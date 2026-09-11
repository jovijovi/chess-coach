import { expect, it } from "vitest";
import { StockfishEngine } from "../plugins/chess-coach/src/engine";
import { Chess, DEFAULT_POSITION } from "chess.js";
import { resolve } from "node:path";
import { parseUci } from "../plugins/chess-coach/src/game";
const engine = new StockfishEngine(
  resolve("node_modules/stockfish/bin/stockfish-18-lite-single.js"),
);
it("real bundled Stockfish produces legal moves and principal variations", async () => {
  const result = await engine.search(
    { fen: DEFAULT_POSITION, moves: [], skill: 20, budget: 100, multiPv: 3 },
    new AbortController().signal,
  );
  expect(new Chess().move(parseUci(result.bestMove))).toBeTruthy();
  expect(result.lines.length).toBeGreaterThan(0);
  for (const line of result.lines) {
    const chess = new Chess();
    for (const move of line.pv) expect(chess.move(parseUci(move))).toBeTruthy();
  }
});
it("cancels a real engine search without waiting for the search budget", async () => {
  const controller = new AbortController();
  const pending = engine.search(
    { fen: DEFAULT_POSITION, moves: [], skill: 20, budget: 5000, multiPv: 1 },
    controller.signal,
  );
  setTimeout(() => controller.abort(), 50);
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
});
