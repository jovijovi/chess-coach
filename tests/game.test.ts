import { afterEach, describe, expect, it } from "vitest";
import { Chess, DEFAULT_POSITION } from "chess.js";
import { GameService } from "../plugins/chess-coach/src/game";
import { Store } from "../plugins/chess-coach/src/store";
import type {
  Engine,
  EngineSearch,
  SavedGame,
} from "../plugins/chess-coach/src/types";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
class ManualEngine implements Engine {
  pending: {
    request: EngineSearch;
    signal: AbortSignal;
    resolve: (r: Awaited<ReturnType<Engine["search"]>>) => void;
    reject: (e: Error) => void;
  }[] = [];
  search(
    request: EngineSearch,
    signal: AbortSignal,
  ): ReturnType<Engine["search"]> {
    return new Promise((resolve, reject) =>
      this.pending.push({ request, signal, resolve, reject }),
    );
  }
  reply(move: string, index = this.pending.length - 1) {
    this.pending[index].resolve({
      bestMove: move,
      lines: [
        { rank: 1, depth: 5, score: { type: "cp", value: 24 }, pv: [move] },
      ],
    });
  }
}
const games: GameService[] = [];
function setup(
  fen = DEFAULT_POSITION,
  options: Partial<SavedGame> = {},
  path = ":memory:",
) {
  const store = new Store(path);
  store.save({
    gameId: randomUUID(),
    revision: 0,
    startFen: fen,
    moves: [],
    playerColor: "w",
    difficulty: "easy",
    createdAt: new Date().toISOString(),
    ...options,
  });
  const engine = new ManualEngine(),
    game = new GameService(store, engine);
  games.push(game);
  return { game, engine };
}
const v = (game: GameService) => ({
  gameId: game.view().gameId,
  expectedRevision: game.view().revision,
});
const tick = () => new Promise((resolve) => setImmediate(resolve));
afterEach(() => {
  games.splice(0).forEach((game) => game.close());
});
describe("rules through the authoritative game service", () => {
  it("requires promotion choice and allows all four promotions", () => {
    for (const promotion of ["q", "r", "b", "n"] as const) {
      const { game } = setup("7k/P7/8/8/8/8/8/7K w - - 0 1");
      expect(() =>
        game.makeMove({ ...v(game), from: "a7", to: "a8" }),
      ).toThrow();
      game.makeMove({ ...v(game), from: "a7", to: "a8", promotion });
      expect(new Chess(game.view().fen).get("a8")?.type).toBe(promotion);
    }
  });
  it("moves both king and rook when castling, and restores both on undo", () => {
    const { game } = setup("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
    game.makeMove({ ...v(game), from: "e1", to: "g1" });
    expect(new Chess(game.view().fen).get("f1")?.type).toBe("r");
    game.undo(v(game));
    expect(new Chess(game.view().fen).get("h1")?.type).toBe("r");
  });
  it("captures en passant and restores the captured pawn on undo", () => {
    const { game } = setup("7k/8/8/3pP3/8/8/8/7K w - d6 0 1");
    game.makeMove({ ...v(game), from: "e5", to: "d6" });
    expect(new Chess(game.view().fen).get("d5")).toBeUndefined();
    game.undo(v(game));
    expect(new Chess(game.view().fen).get("d5")?.type).toBe("p");
  });
  it("rejects moving a pinned piece and preserves saved version", () => {
    const { game } = setup("4r2k/8/8/8/8/8/4R3/4K3 w - - 0 1");
    expect(() => game.makeMove({ ...v(game), from: "e2", to: "f2" })).toThrow();
    expect(game.view().revision).toBe(0);
  });
  it.each([
    ["7k/6Q1/5K2/8/8/8/8/8 b - - 0 1", "checkmate", "1-0"],
    ["7k/5Q2/6K1/8/8/8/8/8 b - - 0 1", "stalemate", "1/2-1/2"],
    ["7k/8/8/8/8/8/8/7K w - - 0 1", "insufficient", "1/2-1/2"],
    ["7k/8/8/8/8/8/8/R6K w - - 100 51", "fifty_moves", "1/2-1/2"],
  ])("ends %s as %s", (fen, status, result) => {
    const { game, engine } = setup(fen);
    game.start();
    expect(game.view()).toMatchObject({ status, result, phase: "finished" });
    expect(engine.pending).toHaveLength(0);
    expect(() => game.makeMove({ ...v(game), from: "h1", to: "g1" })).toThrow();
  });
  it("keeps repetition history and exports replayable PGN", () => {
    const { game } = setup(DEFAULT_POSITION, {
      moves: ["g1f3", "g8f6", "f3g1", "f6g8", "g1f3", "g8f6", "f3g1", "f6g8"],
    });
    expect(game.view().status).toBe("repetition");
    const restored = new Chess();
    restored.loadPgn(game.view().pgn);
    expect(restored.fen()).toBe(game.view().fen);
    expect(restored.isThreefoldRepetition()).toBe(true);
  });
});
describe("turns and stale work", () => {
  it("automatically opens as white when the human selects black", async () => {
    const { game, engine } = setup();
    game.newGame({ ...v(game), playerColor: "b", difficulty: "hard" });
    expect(engine.pending[0].request).toMatchObject({
      skill: 10,
      budget: 1000,
    });
    engine.reply("e2e4");
    await tick();
    expect(game.view()).toMatchObject({
      turn: "b",
      phase: "player_turn",
      canUndo: false,
    });
  });
  it("rejects duplicates and out-of-turn moves", () => {
    const { game } = setup();
    const version = v(game);
    game.makeMove({ ...version, from: "e2", to: "e4" });
    expect(() => game.makeMove({ ...version, from: "e2", to: "e4" })).toThrow(
      "The game has changed",
    );
    expect(() => game.makeMove({ ...v(game), from: "e7", to: "e5" })).toThrow(
      "You cannot move right now",
    );
  });
  it("undo during thinking ignores even an engine result that arrives after cancellation", async () => {
    const { game, engine } = setup();
    game.makeMove({ ...v(game), from: "e2", to: "e4" });
    game.undo(v(game));
    expect(engine.pending[0].signal.aborted).toBe(true);
    engine.reply("e7e5");
    await tick();
    expect(game.view().moves).toHaveLength(0);
    expect(game.view().phase).toBe("player_turn");
  });
  it("undo after a reply removes exactly a full human turn", async () => {
    const { game, engine } = setup();
    game.makeMove({ ...v(game), from: "e2", to: "e4" });
    engine.reply("e7e5");
    await tick();
    game.undo(v(game));
    expect(game.view().moves).toHaveLength(0);
  });
  it("undo as black retains the engine opening", async () => {
    const { game, engine } = setup(DEFAULT_POSITION, {
      playerColor: "b",
      moves: ["e2e4"],
    });
    game.makeMove({ ...v(game), from: "e7", to: "e5" });
    engine.reply("g1f3");
    await tick();
    game.undo(v(game));
    expect(game.view().moves.map((m) => m.uci)).toEqual(["e2e4"]);
  });
  it("new game rejects an older game ID and cancels old results", async () => {
    const { game, engine } = setup();
    game.makeMove({ ...v(game), from: "e2", to: "e4" });
    const previous = v(game);
    game.newGame({ ...previous, playerColor: "w", difficulty: "easy" });
    engine.reply("e7e5");
    await tick();
    expect(game.view().moves).toHaveLength(0);
    expect(game.view().revision).toBeGreaterThan(previous.expectedRevision);
    expect(() => game.undo(previous)).toThrow("The game has changed");
  });
  it("engine failure preserves the human move and permits retry", async () => {
    const { game, engine } = setup();
    game.makeMove({ ...v(game), from: "e2", to: "e4" });
    engine.pending[0].reject(new Error("engine failed"));
    await tick();
    expect(game.view().phase).toBe("engine_error");
    game.retry(v(game));
    engine.reply("e7e5");
    await tick();
    expect(game.view().moves).toHaveLength(2);
  });
  it("invalid engine moves cannot corrupt the game", async () => {
    const { game, engine } = setup();
    game.makeMove({ ...v(game), from: "e2", to: "e4" });
    engine.reply("a1a8");
    await tick();
    expect(game.view().phase).toBe("engine_error");
    expect(game.view().moves).toHaveLength(1);
  });
});
describe("analysis and persistence", () => {
  it("analysis is immutable and scores use the white perspective", async () => {
    const { game, engine } = setup(DEFAULT_POSITION, {
      playerColor: "b",
      moves: ["e2e4"],
    });
    const before = game.view();
    const pending = game.analyze(v(game));
    engine.reply("e7e5");
    const result = await pending;
    expect(result.lines[0]).toMatchObject({
      whiteScore: { type: "cp", value: -24 },
      san: ["e5"],
    });
    expect(game.view()).toEqual(before);
  });
  it("historical analysis preserves snapshot ply and filters illegal PV tails", async () => {
    const { game, engine } = setup(DEFAULT_POSITION, {
      moves: ["e2e4", "e7e5"],
    });
    const pending = game.analyze({ ...v(game), ply: 1 });
    engine.pending[0].resolve({
      bestMove: "c7c5",
      lines: [
        {
          rank: 1,
          depth: 10,
          score: { type: "mate", value: 3 },
          pv: ["c7c5", "a1a8"],
        },
      ],
    });
    expect(await pending).toMatchObject({
      ply: 1,
      historical: true,
      lines: [
        { whiteScore: { type: "mate", value: -3 }, uci: ["c7c5"], san: ["c5"] },
      ],
    });
    expect(game.view().moves).toHaveLength(2);
  });
  it("discard analysis when a user moves while it is running", async () => {
    const { game, engine } = setup();
    const pending = game.analyze(v(game));
    game.makeMove({ ...v(game), from: "e2", to: "e4" });
    engine.reply("d2d4", 0);
    await expect(pending).rejects.toMatchObject({ code: "ANALYSIS_CANCELLED" });
    expect(engine.pending[1].request.moves).toEqual(["e2e4"]);
  });
  it("restores an interrupted engine turn from disk", async () => {
    const directory = mkdtempSync(join(tmpdir(), "chess-store-"));
    const path = join(directory, "state.db");
    try {
      const { game } = setup(DEFAULT_POSITION, {}, path);
      game.makeMove({ ...v(game), from: "e2", to: "e4" });
      const saved = game.view();
      game.close();
      games.splice(games.indexOf(game), 1);
      const engine = new ManualEngine(),
        restored = new GameService(new Store(path), engine);
      games.push(restored);
      restored.start();
      expect(restored.view().fen).toBe(saved.fen);
      expect(engine.pending).toHaveLength(1);
      engine.reply("e7e5");
      await tick();
      expect(restored.view().moves).toHaveLength(2);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
