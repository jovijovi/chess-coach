import { Chess, DEFAULT_POSITION, type Move } from "chess.js";
import { EventEmitter } from "node:events";
import { randomUUID } from "node:crypto";
import { Store } from "./store.js";
import {
  DIFFICULTIES,
  GameError,
  type Analysis,
  type Color,
  type Difficulty,
  type Engine,
  type GameView,
  type MoveInput,
  type SavedGame,
  type Version,
} from "./types.js";
export const toUci = (move: Move) =>
  move.from + move.to + (move.promotion ?? "");
export function parseUci(uci: string): MoveInput {
  if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci))
    throw new GameError("INVALID_MOVE", "Invalid move format.");
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] as MoveInput["promotion"] } : {}),
  };
}
export function replay(saved: SavedGame, ply = saved.moves.length) {
  const chess = new Chess(saved.startFen);
  for (const move of saved.moves.slice(0, ply)) chess.move(parseUci(move));
  return chess;
}
export class GameService extends EventEmitter {
  private saved: SavedGame;
  private job?: AbortController;
  private generation = 0;
  private engineError: string | null = null;
  private closed = false;
  constructor(
    private store: Store,
    private engine: Engine,
  ) {
    super();
    this.saved = store.load() ?? {
      gameId: randomUUID(),
      revision: 0,
      startFen: DEFAULT_POSITION,
      moves: [],
      playerColor: "w",
      difficulty: "medium",
      createdAt: new Date().toISOString(),
    };
    replay(this.saved); // Detect corrupt persisted history instead of silently replacing it.
    store.save(this.saved);
  }
  start() {
    this.scheduleEngine();
  }
  private check(version: Version) {
    if (
      version.gameId !== this.saved.gameId ||
      version.expectedRevision !== this.saved.revision
    )
      throw new GameError(
        "STALE_STATE",
        "The game has changed. Retry using the latest position.",
        this.view(),
      );
  }
  private cancel() {
    this.generation++;
    this.job?.abort();
    this.job = undefined;
  }
  private commit(next: SavedGame) {
    this.store.save(next);
    this.saved = next;
    this.engineError = null;
  }
  private publish() {
    this.emit("change", this.view());
  }
  view(): GameView {
    const chess = replay(this.saved);
    let status: GameView["status"] = "playing";
    if (chess.isCheckmate()) status = "checkmate";
    else if (chess.isStalemate()) status = "stalemate";
    else if (chess.isInsufficientMaterial()) status = "insufficient";
    else if (chess.isThreefoldRepetition()) status = "repetition";
    else if (chess.isDrawByFiftyMoves()) status = "fifty_moves";
    else if (chess.isDraw()) status = "draw";
    const result =
      status === "playing"
        ? "*"
        : status === "checkmate"
          ? chess.turn() === "w"
            ? "0-1"
            : "1-0"
          : "1/2-1/2";
    for (const [key, value] of Object.entries({
      Event: "Chess Coach",
      White: this.saved.playerColor === "w" ? "Player" : "Stockfish",
      Black: this.saved.playerColor === "b" ? "Player" : "Stockfish",
      Result: result,
      Date: this.saved.createdAt.slice(0, 10).replaceAll("-", "."),
    }))
      chess.setHeader(key, value);
    const history = chess.history({ verbose: true });
    return {
      ...this.saved,
      fen: chess.fen(),
      turn: chess.turn(),
      board: chess.board(),
      moves: history.map((m) => ({
        from: m.from,
        to: m.to,
        ...(m.promotion
          ? { promotion: m.promotion as MoveInput["promotion"] }
          : {}),
        san: m.san,
        uci: toUci(m),
        color: m.color,
        piece: m.piece,
      })),
      legalMoves:
        status === "playing"
          ? chess.moves({ verbose: true }).map((m) => ({
              from: m.from,
              to: m.to,
              ...(m.promotion
                ? { promotion: m.promotion as MoveInput["promotion"] }
                : {}),
            }))
          : [],
      status,
      result,
      check: chess.isCheck(),
      engineError: this.engineError,
      phase:
        status !== "playing"
          ? "finished"
          : chess.turn() === this.saved.playerColor
            ? "player_turn"
            : this.engineError
              ? "engine_error"
              : "engine_thinking",
      canUndo: history.some((m) => m.color === this.saved.playerColor),
      pgn: chess.pgn(),
    };
  }
  newGame(input: Version & { playerColor: Color; difficulty: Difficulty }) {
    this.check(input);
    const next: SavedGame = {
      gameId: randomUUID(),
      revision: this.saved.revision + 1,
      startFen: DEFAULT_POSITION,
      moves: [],
      playerColor: input.playerColor,
      difficulty: input.difficulty,
      createdAt: new Date().toISOString(),
    };
    this.commit(next);
    this.cancel();
    this.publish();
    this.scheduleEngine();
    return this.view();
  }
  makeMove(input: Version & MoveInput) {
    this.check(input);
    const current = this.view();
    if (current.phase !== "player_turn")
      throw new GameError("WRONG_TURN", "You cannot move right now.", current);
    const chess = replay(this.saved);
    let move: Move;
    try {
      move = chess.move({
        from: input.from,
        to: input.to,
        promotion: input.promotion,
      });
    } catch {
      throw new GameError(
        "ILLEGAL_MOVE",
        "This move is illegal. Choose a legal destination.",
        current,
      );
    }
    this.commit({
      ...this.saved,
      revision: this.saved.revision + 1,
      moves: [...this.saved.moves, toUci(move)],
    });
    this.cancel();
    this.publish();
    this.scheduleEngine();
    return this.view();
  }
  undo(input: Version) {
    this.check(input);
    const history = replay(this.saved).history({ verbose: true });
    const lastPlayer = history.findLastIndex(
      (m) => m.color === this.saved.playerColor,
    );
    if (lastPlayer < 0)
      throw new GameError(
        "NOTHING_TO_UNDO",
        "There is no move to undo yet.",
        this.view(),
      );
    this.commit({
      ...this.saved,
      revision: this.saved.revision + 1,
      moves: this.saved.moves.slice(0, lastPlayer),
    });
    this.cancel();
    this.publish();
    return this.view();
  }
  retry(input: Version) {
    this.check(input);
    if (this.view().phase === "engine_error") {
      this.engineError = null;
      this.publish();
      this.scheduleEngine();
    }
    return this.view();
  }
  private scheduleEngine() {
    if (this.closed || this.view().phase !== "engine_thinking") return;
    this.cancel();
    const job = (this.job = new AbortController()),
      generation = this.generation;
    const saved = structuredClone(this.saved);
    const settings = DIFFICULTIES[saved.difficulty];
    void this.engine
      .search(
        { fen: saved.startFen, moves: saved.moves, ...settings, multiPv: 1 },
        job.signal,
      )
      .then((result) => {
        if (job.signal.aborted || this.closed || generation !== this.generation)
          return;
        const chess = replay(saved);
        const move = chess.move(parseUci(result.bestMove));
        this.commit({
          ...saved,
          revision: saved.revision + 1,
          moves: [...saved.moves, toUci(move)],
        });
        this.publish();
      })
      .catch((error) => {
        if (job.signal.aborted || this.closed || generation !== this.generation)
          return;
        this.engineError =
          error instanceof Error
            ? error.message
            : "The chess engine is temporarily unavailable.";
        this.publish();
      })
      .finally(() => {
        if (this.job === job) this.job = undefined;
      });
  }
  async analyze(input: Version & { ply?: number }): Promise<Analysis> {
    this.check(input);
    if (this.view().phase === "engine_thinking")
      throw new GameError(
        "ENGINE_BUSY",
        "The engine is making its move. Try analyzing again shortly.",
        this.view(),
      );
    const saved = structuredClone(this.saved),
      ply = input.ply ?? saved.moves.length;
    if (!Number.isInteger(ply) || ply < 0 || ply > saved.moves.length)
      throw new GameError(
        "INVALID_PLY",
        "The analysis ply is outside the game history.",
      );
    const chess = replay(saved, ply);
    const base: Analysis = {
      gameId: saved.gameId,
      revision: saved.revision,
      ply,
      fen: chess.fen(),
      turn: chess.turn(),
      historical: ply !== saved.moves.length,
      lines: [],
    };
    if (chess.isGameOver()) return base;
    this.cancel();
    const job = (this.job = new AbortController());
    try {
      const result = await this.engine.search(
        {
          fen: saved.startFen,
          moves: saved.moves.slice(0, ply),
          skill: 20,
          budget: 1000,
          multiPv: 3,
        },
        job.signal,
      );
      if (
        job.signal.aborted ||
        this.saved.gameId !== saved.gameId ||
        this.saved.revision !== saved.revision
      )
        throw new GameError(
          "ANALYSIS_CANCELLED",
          "The position has changed. This analysis was cancelled.",
          this.view(),
        );
      base.lines = result.lines
        .slice(0, 3)
        .map((line) => {
          const variation = replay(saved, ply),
            san: string[] = [],
            uci: string[] = [];
          for (const token of line.pv) {
            try {
              const move = variation.move(parseUci(token));
              san.push(move.san);
              uci.push(toUci(move));
            } catch {
              break;
            }
          }
          return {
            rank: line.rank,
            depth: line.depth,
            whiteScore: {
              ...line.score,
              value: line.score.value * (chess.turn() === "w" ? 1 : -1),
            },
            uci,
            san,
          };
        })
        .filter((line) => line.uci.length);
      if (!base.lines.length)
        throw new GameError(
          "ANALYSIS_FAILED",
          "The engine returned no valid variations. Please retry.",
        );
      return base;
    } catch (error) {
      if (job.signal.aborted)
        throw new GameError(
          "ANALYSIS_CANCELLED",
          "The position or analysis request changed. This analysis was cancelled.",
          this.view(),
        );
      throw error;
    } finally {
      if (this.job === job) this.job = undefined;
    }
  }
  close() {
    this.closed = true;
    this.cancel();
    this.store.close();
  }
}
