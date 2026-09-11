import { afterAll, beforeAll, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { Chess } from "chess.js";
import type { GameView, Analysis } from "../plugins/chess-coach/src/types";
let directory: string;
const clients: Client[] = [];
async function client() {
  const c = new Client({ name: "chess-coach-acceptance", version: "1.0.0" });
  await c.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [resolve("plugins/chess-coach/dist/mcp.js")],
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(
            (e): e is [string, string] => e[1] !== undefined,
          ),
        ),
        CHESS_COACH_DATA_DIR: directory,
      },
    }),
  );
  clients.push(c);
  return c;
}
async function tool<T>(c: Client, name: string, args = {}) {
  const result = await c.callTool({ name, arguments: args });
  if (result.isError) throw new Error(JSON.stringify(result.content));
  return result.structuredContent as T;
}
const v = (game: GameView) => ({
  gameId: game.gameId,
  expectedRevision: game.revision,
});
async function ready(c: Client) {
  for (let i = 0; i < 150; i++) {
    const game = await tool<GameView>(c, "get_game");
    if (game.phase !== "engine_thinking") {
      expect(game.engineError).toBeNull();
      return game;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Engine never finished");
}
beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "chess-mcp-"));
});
afterAll(async () => {
  await Promise.all(clients.map((c) => c.close()));
  try {
    const info = JSON.parse(
      await readFile(join(directory, "server.json"), "utf8"),
    );
    await fetch(`http://127.0.0.1:${info.port}/shutdown`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${info.token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    await new Promise((r) => setTimeout(r, 150));
  } catch {
    /* Already stopped during an assertion. */
  }
  await rm(directory, { recursive: true, force: true });
});
it("two independent MCP sessions share one daemon and complete ten rounds with reload, analysis and PGN", async () => {
  const [a, b] = await Promise.all([client(), client()]);
  const names = (await a.listTools()).tools.map((t) => t.name);
  expect(names).toEqual(
    expect.arrayContaining([
      "show_board",
      "new_game",
      "make_move",
      "undo_turn",
      "get_game",
      "analyze_position",
      "export_pgn",
      "retry_engine",
    ]),
  );
  const [first, second] = await Promise.all([
    tool<GameView & { url: string }>(a, "show_board"),
    tool<GameView & { url: string }>(b, "show_board"),
  ]);
  expect(first.url).toBe(second.url);
  expect(first.gameId).toBe(second.gameId);
  let game = await tool<GameView>(a, "new_game", {
    ...v(first),
    playerColor: "w",
    difficulty: "easy",
  });
  const opening = [
    "e2e4",
    "g1f3",
    "b1c3",
    "f1c4",
    "d2d3",
    "e1g1",
    "c1e3",
    "d1d2",
    "a2a3",
    "h2h3",
  ];
  for (let i = 0; i < 10; i++) {
    expect(game.status).toBe("playing");
    const desired = opening[i];
    const move =
      game.legalMoves.find((m) => m.from + m.to === desired) ??
      game.legalMoves.find((m) => m.from !== "f2") ??
      game.legalMoves[0];
    const stale = v(game);
    game = await tool<GameView>(a, "make_move", { ...stale, ...move });
    if (i === 0) {
      const duplicate = await b.callTool({
        name: "make_move",
        arguments: { ...stale, ...move },
      });
      expect(duplicate.isError).toBe(true);
    }
    game = await ready(b);
  }
  expect(game.moves).toHaveLength(20);
  const analysis = await tool<Analysis>(a, "analyze_position", v(game));
  expect(analysis.fen).toBe(game.fen);
  expect(analysis.lines.length).toBeGreaterThan(0);
  for (const line of analysis.lines) {
    const board = new Chess(analysis.fen);
    for (const san of line.san) board.move(san);
  }
  expect((await tool<GameView>(b, "get_game")).fen).toBe(game.fen);
  const exported = await tool<{ pgn: string }>(a, "export_pgn");
  const restored = new Chess();
  restored.loadPgn(exported.pgn);
  expect(restored.fen()).toBe(game.fen);
  const info = JSON.parse(
    await readFile(join(directory, "server.json"), "utf8"),
  );
  const url = `http://127.0.0.1:${info.port}`;
  const preferenceHeaders = {
    Authorization: `Bearer ${info.token}`,
    "Content-Type": "application/json",
  };
  expect((await fetch(url + "/preferences")).status).toBe(401);
  expect(
    await (
      await fetch(url + "/preferences", { headers: preferenceHeaders })
    ).json(),
  ).toEqual({ locale: null });
  expect(
    (
      await fetch(url + "/preferences", {
        method: "POST",
        headers: preferenceHeaders,
        body: JSON.stringify({ locale: "invalid" }),
      })
    ).status,
  ).toBe(400);
  expect(
    (
      await fetch(url + "/preferences", {
        method: "POST",
        headers: { ...preferenceHeaders, Origin: "https://unrelated.example" },
        body: JSON.stringify({ locale: "en" }),
      })
    ).status,
  ).toBe(403);
  expect(
    await (
      await fetch(url + "/preferences", {
        method: "POST",
        headers: preferenceHeaders,
        body: JSON.stringify({ locale: "zh-CN" }),
      })
    ).json(),
  ).toEqual({ locale: "zh-CN" });
  expect((await tool<GameView>(a, "get_game")).revision).toBe(game.revision);
  expect(
    (
      await fetch(url + "/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
  ).toBe(401);
  expect(
    (
      await fetch(url + "/health", {
        headers: {
          Authorization: `Bearer ${info.token}`,
          Origin: "https://unrelated.example",
        },
      })
    ).status,
  ).toBe(403);
  const page = await fetch(url);
  expect(await page.text()).toContain("Chess Coach");
  const stream = await fetch(url + "/events", {
    headers: { Authorization: `Bearer ${info.token}` },
  });
  const reader = stream.body!.getReader();
  const event = await reader.read();
  expect(new TextDecoder().decode(event.value)).toContain(game.fen);
  await reader.cancel();
  await fetch(url + "/shutdown", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${info.token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  await new Promise((r) => setTimeout(r, 250));
  const recovered = await tool<GameView>(b, "get_game");
  expect(recovered.fen).toBe(game.fen);
  expect(recovered.moves).toHaveLength(20);
  const nextInfo = JSON.parse(
    await readFile(join(directory, "server.json"), "utf8"),
  );
  expect(
    await (
      await fetch(`http://127.0.0.1:${nextInfo.port}/preferences`, {
        headers: { Authorization: `Bearer ${nextInfo.token}` },
      })
    ).json(),
  ).toEqual({ locale: "zh-CN" });
}, 30000);
