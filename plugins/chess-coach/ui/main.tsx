import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { Chessboard } from "react-chessboard";
import type {
  Analysis,
  Color,
  Difficulty,
  GameView,
  MoveInput,
} from "../src/types";
import { call, downloadPgn, subscribe } from "./api";
import "./style.css";
import { translate, errorKey, pieceKeys, isLocale } from "./i18n";
import type { MessageKey } from "./locales/en";
import { useLocale } from "./use-locale";
const endingKeys: Record<GameView["status"], MessageKey> = {
  checkmate: "checkmate",
  stalemate: "stalemate",
  insufficient: "insufficient",
  repetition: "repetition",
  fifty_moves: "fiftyMoves",
  draw: "draw",
  playing: "yourTurn",
};
function App() {
  const [game, setGame] = useState<GameView>();
  const current = useRef<GameView | undefined>(undefined);
  const [connected, setConnected] = useState(false),
    [error, setError] = useState<MessageKey | "">("");
  const [busy, setBusy] = useState(false),
    [selected, setSelected] = useState<string>();
  const [flipped, setFlipped] = useState(false),
    [analysis, setAnalysis] = useState<Analysis>();
  const [analyzing, setAnalyzing] = useState(false);
  const [promotion, setPromotion] = useState<{ from: string; to: string }>();
  const [newDialog, setNewDialog] = useState(false),
    [help, setHelp] = useState(false);
  const [color, setColor] = useState<Color>("w"),
    [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const dialogRef = useRef<HTMLDialogElement>(null),
    promoRef = useRef<HTMLDialogElement>(null),
    helpRef = useRef<HTMLDialogElement>(null);
  const actionLock = useRef(false);
  const { locale, changeLocale } = useLocale(() => setError("errorPreference"));
  const t = (key: MessageKey, values?: Record<string, string | number>) =>
    translate(locale, key, values);
  const accept = (next: GameView) => {
    const previous = current.current;
    // Ignore late HTTP responses once SSE has delivered a newer revision of this game.
    if (previous && previous.revision > next.revision) return;
    if (
      previous?.gameId !== next.gameId ||
      previous?.revision !== next.revision
    ) {
      setSelected(undefined);
      setPromotion(undefined);
      setAnalysis(undefined);
    }
    current.current = next;
    setGame(next);
  };
  useEffect(() => {
    const controller = new AbortController();
    void call<GameView>("get_game")
      .then(async (next) => {
        accept(next);
        if (location.pathname === "/export") {
          const exported = await call<{ pgn: string; filename: string }>(
            "export_pgn",
          );
          downloadPgn(exported.pgn, exported.filename);
          history.replaceState(null, "", "/");
        }
      })
      .catch((e) => setError(errorKey(e)));
    void subscribe(accept, setConnected, controller.signal);
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (newDialog) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [newDialog]);
  useEffect(() => {
    if (promotion) promoRef.current?.showModal();
    else promoRef.current?.close();
  }, [promotion]);
  useEffect(() => {
    if (help) helpRef.current?.showModal();
    else helpRef.current?.close();
  }, [help]);
  const version = () => ({
    gameId: current.current!.gameId,
    expectedRevision: current.current!.revision,
  });
  async function mutate(name: string, args: unknown = {}) {
    if (actionLock.current || !current.current) return;
    actionLock.current = true;
    setBusy(true);
    setError("");
    try {
      accept(await call<GameView>(name, { ...version(), ...(args as object) }));
    } catch (e) {
      const failure = e as Error & { current?: GameView };
      setError(errorKey(failure));
      if (failure.current) accept(failure.current);
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  }
  const playable = !!game && connected && !busy && game.phase === "player_turn";
  function attempt(from: string, to: string) {
    if (!playable || !game) return;
    const candidates = game.legalMoves.filter(
      (m) => m.from === from && m.to === to,
    );
    if (!candidates.length) {
      setError("errorIllegalMove");
      setSelected(undefined);
      return;
    }
    if (candidates.some((m) => m.promotion)) setPromotion({ from, to });
    else void mutate("make_move", { from, to });
  }
  function select(square: string) {
    if (!playable || !game) return;
    const piece = game.board.flat().find((p) => p?.square === square);
    if (piece?.color === game.playerColor) {
      setSelected(selected === square ? undefined : square);
      setError("");
    } else if (selected) attempt(selected, square);
  }
  async function hint() {
    if (!game || analyzing) return;
    const expected = version();
    setAnalyzing(true);
    setError("");
    try {
      const result = await call<Analysis>("analyze_position", expected);
      if (
        current.current?.gameId === result.gameId &&
        current.current.revision === result.revision
      )
        setAnalysis(result);
    } catch (e) {
      const failure = e as Error & { code?: string };
      if (failure.code !== "ANALYSIS_CANCELLED") setError(errorKey(failure));
    } finally {
      setAnalyzing(false);
    }
  }
  async function exportGame() {
    const result = await call<{ pgn: string; filename: string }>("export_pgn");
    downloadPgn(result.pgn, result.filename);
  }
  async function startNew(exportFirst: boolean) {
    if (exportFirst) {
      try {
        await exportGame();
      } catch (e) {
        setError(errorKey(e));
        return;
      }
    }
    setNewDialog(false);
    setFlipped(false);
    await mutate("new_game", { playerColor: color, difficulty });
  }
  const squareStyles: Record<string, CSSProperties> = {};
  const last = game?.moves.at(-1);
  if (last) {
    squareStyles[last.from] = { backgroundColor: "rgba(231,196,95,.6)" };
    squareStyles[last.to] = { backgroundColor: "rgba(231,196,95,.72)" };
  }
  if (selected) {
    squareStyles[selected] = {
      backgroundColor: "#c4c968",
      boxShadow: "inset 0 0 0 3px #426652",
    };
    for (const move of game!.legalMoves.filter((m) => m.from === selected))
      squareStyles[move.to] = {
        ...squareStyles[move.to],
        backgroundImage: game!.board.flat().some((p) => p?.square === move.to)
          ? "radial-gradient(transparent 60%, rgba(20,65,47,.45) 62%)"
          : "radial-gradient(rgba(20,65,47,.35) 19%, transparent 21%)",
      };
  }
  if (game?.check) {
    const king = game.board
      .flat()
      .find((p) => p?.type === "k" && p.color === game.turn);
    if (king) squareStyles[king.square] = { backgroundColor: "#d58b74" };
  }
  const orientation =
    (game?.playerColor === "b") !== flipped ? "black" : "white";
  const humanBottom = !flipped;
  const title = !game
    ? t("restoring")
    : game.phase === "finished"
      ? t(endingKeys[game.status])
      : game.phase === "engine_error"
        ? t("enginePaused")
        : game.phase === "engine_thinking"
          ? t("engineThinking")
          : game.check
            ? t("inCheck")
            : t("yourTurn");
  const best = analysis?.lines[0];
  function playerRow(human: boolean) {
    const white =
      (human ? game?.playerColor : game?.playerColor === "w" ? "b" : "w") ===
      "w";
    return (
      <div className="player-row">
        <div
          className={`piece-avatar ${white ? "white" : "black"}`}
          aria-hidden="true"
        >
          {white ? "♙" : "♟"}
        </div>
        <div>
          <strong>{human ? t("you") : "Stockfish"}</strong>
          <span>
            {white ? t("white") : t("black")}
            {!human && game
              ? ` · ${t(game.difficulty)}`
              : ` · ${t("practice")}`}
          </span>
        </div>
        <span className="player-tag">
          {human ? t("player") : t("opponent")}
        </span>
      </div>
    );
  }
  return (
    <main className="app">
      <header className="header">
        <a className="brand" href="/" aria-label={t("home")}>
          <span className="brand-icon" aria-hidden="true">
            ♞
          </span>
          <span>
            CHESS <b>COACH</b>
          </span>
        </a>
        <div className="header-right">
          <span className={`connection ${connected ? "online" : ""}`}>
            <i />
            {connected ? t("localGame") : t("connecting")}
          </span>
          <select
            className="language-select"
            aria-label={t("language")}
            value={locale}
            onChange={(event) => {
              if (isLocale(event.target.value))
                changeLocale(event.target.value);
            }}
          >
            <option value="en" lang="en">
              {t("languageEnglish")}
            </option>
            <option value="zh-CN" lang="zh-CN">
              {t("languageChinese")}
            </option>
          </select>
          <button className="quiet" onClick={() => setHelp(true)}>
            {t("help")}
          </button>
        </div>
      </header>
      <div className="intro">
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1>{t("heading")}</h1>
          <p>{t("subtitle")}</p>
        </div>
        <button
          className="primary"
          onClick={() => {
            setColor(game?.playerColor ?? "w");
            setDifficulty(game?.difficulty ?? "medium");
            setNewDialog(true);
          }}
          disabled={!game || busy}
        >
          {t("newGame")}
        </button>
      </div>
      {error && (
        <div className="error" role="alert">
          {t(error)}
          <button
            className="quiet"
            aria-label={t("dismissError")}
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}
      {!connected && game && (
        <div className="notice" role="status">
          {t("disconnected")}
        </div>
      )}
      <div className="workspace">
        <section className="board-area" aria-label={t("board")}>
          {playerRow(!humanBottom)}
          <div className="board-frame">
            {game ? (
              <Chessboard
                options={{
                  id: "chess-coach",
                  position: game.fen,
                  boardOrientation: orientation,
                  allowDragging: playable,
                  allowDrawingArrows: false,
                  allowDragOffBoard: false,
                  allowAutoScroll: false,
                  canDragPiece: ({ piece }) =>
                    piece.pieceType[0] === game.playerColor,
                  onPieceDrag: ({ square }) => {
                    if (square) setSelected(square);
                  },
                  onSquareClick: ({ square }) => select(square),
                  onPieceDrop: ({ sourceSquare, targetSquare }) => {
                    if (targetSquare) attempt(sourceSquare, targetSquare);
                    return false;
                  },
                  boardStyle: { borderRadius: "3px" },
                  darkSquareStyle: { backgroundColor: "#79968a" },
                  lightSquareStyle: { backgroundColor: "#ece9d9" },
                  darkSquareNotationStyle: {
                    color: "#fffbea",
                    fontSize: "11px",
                  },
                  lightSquareNotationStyle: {
                    color: "#38523f",
                    fontSize: "11px",
                  },
                  squareStyles,
                  arrows: best
                    ? [
                        {
                          startSquare: best.uci[0].slice(0, 2),
                          endSquare: best.uci[0].slice(2, 4),
                          color: "#cd7528",
                        },
                      ]
                    : [],
                  squareRenderer: ({ square, piece, children }) => (
                    <button
                      style={squareStyles[square]}
                      className="square-access"
                      aria-label={
                        piece
                          ? t("pieceSquare", {
                              square,
                              color: t(
                                piece.pieceType[0] === "w"
                                  ? "whitePiece"
                                  : "blackPiece",
                              ),
                              piece: t(
                                pieceKeys[piece.pieceType[1].toLowerCase()],
                              ),
                            })
                          : t("vacantSquare", {
                              square,
                              empty: t("emptySquare"),
                            })
                      }
                      aria-pressed={selected === square}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select(square);
                        }
                      }}
                    >
                      {children}
                    </button>
                  ),
                  animationDurationInMs: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? 0
                    : 180,
                }}
              />
            ) : (
              <div className="board-loading" role="status">
                {t("loadingBoard")}
              </div>
            )}
          </div>
          {playerRow(humanBottom)}
          <div className="board-tools">
            <button
              onClick={() => void mutate("undo_turn")}
              disabled={!game?.canUndo || busy || !connected}
            >
              {t("undo")}
            </button>
            <button onClick={() => setFlipped((v) => !v)}>{t("flip")}</button>
            <button
              onClick={() => void hint()}
              disabled={!playable || analyzing}
            >
              {analyzing ? t("analyzing") : t("hint")}
            </button>
          </div>
          <p className="board-caption">{t("boardCaption")}</p>
        </section>
        <aside className="sidebar">
          <section className="turn-panel" aria-live="polite">
            <span className="eyebrow">
              {game?.phase === "finished" ? t("gameOverLabel") : t("onBoard")}
            </span>
            <h2>
              {title}
              {game?.phase === "engine_thinking" && (
                <span className="thinking-dots">…</span>
              )}
            </h2>
            <p>
              {game?.phase === "finished"
                ? t("result", { result: game.result })
                : game?.phase === "engine_thinking"
                  ? t("thinkingDescription")
                  : game?.phase === "engine_error"
                    ? t("pausedDescription")
                    : t("turnDescription")}
            </p>
            {game?.phase === "engine_error" && (
              <button
                className="retry"
                onClick={() => void mutate("retry_engine")}
              >
                {t("retryEngine")}
              </button>
            )}
            <div className="turn-bottom">
              <span>
                {game
                  ? t("roundNumber", {
                      count: Math.floor(game.moves.length / 2) + 1,
                    })
                  : "—"}
              </span>
              <span>
                {game?.phase === "finished" ? t("finished") : t("untimed")}
              </span>
            </div>
          </section>
          <section className="moves-panel">
            <div className="section-title">
              <h2>{t("moves")}</h2>
              <span>
                {t(game?.moves.length === 1 ? "moveCountOne" : "moveCount", {
                  count: game?.moves.length ?? 0,
                })}
              </span>
            </div>
            <div className="moves-head">
              <span>{t("round")}</span>
              <span>{t("white")}</span>
              <span>{t("black")}</span>
            </div>
            <div className="moves-list" data-testid="move-list">
              {!game?.moves.length ? (
                <div className="empty-moves">
                  <span aria-hidden="true">♙</span>
                  <p>{t("emptyMoves")}</p>
                  <small>{t("autosave")}</small>
                </div>
              ) : (
                Array.from(
                  { length: Math.ceil(game.moves.length / 2) },
                  (_, i) => (
                    <div className="move-row" key={i}>
                      <span>{i + 1}.</span>
                      {[0, 1].map((j) => (
                        <span
                          key={j}
                          className={
                            i * 2 + j === game.moves.length - 1
                              ? "latest-move"
                              : ""
                          }
                        >
                          {game.moves[i * 2 + j]?.san ?? "—"}
                        </span>
                      ))}
                    </div>
                  ),
                )
              )}
            </div>
            <button
              className="export"
              onClick={() =>
                void exportGame().catch((e) => setError(errorKey(e)))
              }
              disabled={!game?.moves.length}
            >
              {t("export")}
            </button>
          </section>
          {best && (
            <section className="hint-panel" aria-live="polite">
              <div className="section-title">
                <h2>{t("candidate")}</h2>
                <button
                  className="quiet"
                  onClick={() => setAnalysis(undefined)}
                >
                  {t("hideHint")}
                </button>
              </div>
              <strong className="hint-move">{best.san[0]}</strong>
              <p>{best.san.slice(0, 6).join(" → ")}</p>
              <small>
                {t("whitePerspective")}
                {best.whiteScore.type === "mate"
                  ? t("mateDistance", { count: best.whiteScore.value })
                  : `${best.whiteScore.value >= 0 ? "+" : ""}${(best.whiteScore.value / 100).toFixed(2)}`}{" "}
                · {t("engineAnalysis")}
              </small>
            </section>
          )}
          <section className="coach-panel">
            <span className="eyebrow">{t("coachEyebrow")}</span>
            <h2>{t("coachHeading")}</h2>
            <p>
              {t("coachQuestionMove")}
              <br />
              {t("coachQuestionPlan")}
            </p>
            <span className="coach-foot">{t("coachFoot")}</span>
          </section>
        </aside>
      </div>
      <footer>
        <span>CHESS COACH</span>
        <span>{t("footer")}</span>
        <span>
          {game
            ? t("gameVersion", {
                id: game.gameId.slice(0, 8),
                revision: game.revision,
              })
            : ""}
        </span>
      </footer>
      <dialog ref={dialogRef} onCancel={() => setNewDialog(false)}>
        <div className="dialog-body">
          <span className="eyebrow">{t("newEyebrow")}</span>
          <h2>{t("newHeading")}</h2>
          <label>
            {t("chooseColor")}
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as Color)}
            >
              <option value="w">{t("whiteFirst")}</option>
              <option value="b">{t("blackSecond")}</option>
            </select>
          </label>
          <label>
            {t("difficulty")}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              <option value="easy">{t("easy")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="hard">{t("hard")}</option>
            </select>
          </label>
          {!!game?.moves.length && <p>{t("replaceGame")}</p>}
          <div className="dialog-actions">
            <button onClick={() => setNewDialog(false)}>{t("cancel")}</button>
            {!!game?.moves.length && (
              <button onClick={() => void startNew(true)}>
                {t("exportThenNew")}
              </button>
            )}
            <button className="primary" onClick={() => void startNew(false)}>
              {game?.moves.length ? t("replaceAndNew") : t("startGame")}
            </button>
          </div>
        </div>
      </dialog>
      <dialog ref={promoRef} onCancel={() => setPromotion(undefined)}>
        <div className="dialog-body">
          <h2>{t("promotionTitle")}</h2>
          <p>{t("promotionDescription")}</p>
          <div className="promotion-choices">
            {(["q", "r", "b", "n"] as const).map((piece) => (
              <button
                key={piece}
                onClick={() => {
                  if (promotion)
                    void mutate("make_move", {
                      ...promotion,
                      promotion: piece,
                    });
                  setPromotion(undefined);
                }}
              >
                {t(pieceKeys[piece])}
              </button>
            ))}
          </div>
          <button className="quiet" onClick={() => setPromotion(undefined)}>
            {t("cancel")}
          </button>
        </div>
      </dialog>
      <dialog ref={helpRef} onCancel={() => setHelp(false)}>
        <div className="dialog-body">
          <h2>{t("helpTitle")}</h2>
          <p>{t("helpMoves")}</p>
          <p>{t("helpSave")}</p>
          <p>{t("helpRules")}</p>
          <p>{t("helpCoach")}</p>
          <p>{t("helpLanguage")}</p>
          <button className="primary" onClick={() => setHelp(false)}>
            {t("gotIt")}
          </button>
        </div>
      </dialog>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
