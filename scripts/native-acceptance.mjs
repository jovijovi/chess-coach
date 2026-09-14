import { spawn, execFileSync } from "node:child_process";
import { createInterface } from "node:readline";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { tmpdir, homedir } from "node:os";
import { existsSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import assert from "node:assert/strict";
import { Chess } from "chess.js";

// Run only in a disposable OS profile (the CI runner or a filesystem-isolated home).
const codex = process.env.CHESS_COACH_CODEX || "codex";
const marketplace = resolve(process.argv[2] || "output/release/marketplace");
const reportPath = resolve(process.argv[3] || "output/native-acceptance.json");
const preinstalled = process.env.CHESS_COACH_PREINSTALLED_MARKETPLACE === "1";
const anonymous = process.env.CHESS_COACH_ANONYMOUS_ACCEPTANCE === "1";
if (anonymous) {
  for (const key of [
    "GH_TOKEN",
    "GITHUB_TOKEN",
    "GH_ENTERPRISE_TOKEN",
    "GITHUB_ENTERPRISE_TOKEN",
    "SSH_AUTH_SOCK",
    "GIT_ASKPASS",
  ])
    assert.equal(
      process.env[key],
      undefined,
      `Anonymous acceptance must omit ${key}`,
    );
}
const installed = JSON.parse(
  execFileSync(codex, ["plugin", "marketplace", "list", "--json"], {
    encoding: "utf8",
  }),
);
assert.equal(
  installed.marketplaces.length,
  preinstalled ? 1 : 0,
  "Native acceptance requires its dedicated disposable Codex profile.",
);
const codexVersion = execFileSync(codex, ["--version"], {
  encoding: "utf8",
}).trim();
assert.match(
  codexVersion,
  /0\.154\.0$/,
  "Release compatibility baseline is Codex 0.154.0.",
);
const catalog = JSON.parse(
  await readFile(join(marketplace, ".agents/plugins/marketplace.json"), "utf8"),
);
const pluginId = `chess-coach@${catalog.name}`;
const metadata = JSON.parse(
  await readFile(join(marketplace, "plugins/chess-coach/sources.json"), "utf8"),
);
const offline = process.env.CHESS_COACH_OFFLINE_ACCEPTANCE === "1";
if (offline) {
  let connected = false;
  try {
    await fetch("https://example.com", { signal: AbortSignal.timeout(3000) });
    connected = true;
  } catch {
    /* The OS sandbox must block external networking. */
  }
  assert.equal(
    connected,
    false,
    "The offline acceptance sandbox still permits external networking",
  );
}
const directory = join(homedir(), ".local/share/chess-coach");
assert.equal(
  existsSync(directory),
  false,
  "Native acceptance requires an empty disposable game directory.",
);
const workspace = await mkdtemp(join(tmpdir(), "chess native 验收 "));
const env = { ...process.env, CHESS_COACH_DATA_DIR: directory };
const cli = (args) => execFileSync(codex, args, { env, encoding: "utf8" });
if (!preinstalled) cli(["plugin", "marketplace", "add", marketplace]);
cli(["plugin", "add", pluginId]);
let proc,
  stderr = "",
  id = 0;
const pending = new Map();
const rpc = (method, params) =>
  new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error(`Native Codex RPC timed out: ${method}`));
    }, 45000);
    pending.set(requestId, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
    proc.stdin.write(JSON.stringify({ id: requestId, method, params }) + "\n");
  });
async function connect(missingNode = false) {
  proc = spawn(codex, ["app-server", "--stdio"], {
    env: missingNode
      ? { ...env, PATH: join(workspace, "no-executables") }
      : env,
    cwd: workspace,
    stdio: ["pipe", "pipe", "pipe"],
  });
  proc.stderr.on("data", (bytes) => {
    stderr = (stderr + bytes).slice(-10000);
  });
  proc.on("error", (error) => {
    for (const waiter of pending.values()) waiter.reject(error);
    pending.clear();
  });
  createInterface({ input: proc.stdout }).on("line", (line) => {
    const message = JSON.parse(line);
    const waiter = pending.get(message.id);
    if (waiter) {
      pending.delete(message.id);
      if (message.error)
        waiter.reject(new Error(JSON.stringify(message.error)));
      else waiter.resolve(message.result);
    }
  });
  await rpc("initialize", {
    clientInfo: { name: "chess-coach-release-acceptance", version: "1" },
    capabilities: { experimentalApi: true },
  });
  proc.stdin.write(JSON.stringify({ method: "initialized" }) + "\n");
  const { thread } = await rpc("thread/start", {
    cwd: workspace,
    ephemeral: true,
    approvalPolicy: "never",
  });
  const status = await rpc("mcpServerStatus/list", { threadId: thread.id });
  const server = status.data.find((s) => s.pluginId === pluginId);
  assert.ok(server, "Native Codex must load the installed plugin");
  if (missingNode) {
    assert.match(
      server.toolsError ?? "",
      /No such file|not found|cannot find/i,
      "Codex must report that node is unavailable",
    );
    return;
  }
  assert.equal(server.toolsError, null);
  assert.equal(server.serverInfo.version, metadata.version);
  const names = Object.keys(server.tools).sort();
  assert.deepEqual(names, [
    "analyze_position",
    "export_pgn",
    "get_game",
    "make_move",
    "new_game",
    "retry_engine",
    "show_board",
    "undo_turn",
  ]);
  return async (tool, args = {}, allowError = false) => {
    const result = await rpc("mcpServer/tool/call", {
      threadId: thread.id,
      server: server.name,
      tool,
      arguments: args,
    });
    if (!allowError)
      assert.notEqual(
        result.isError,
        true,
        `Native tool failed: ${tool}: ${JSON.stringify(result.content)}`,
      );
    return result.structuredContent ?? JSON.parse(result.content[0].text);
  };
}
async function disconnect() {
  if (!proc || proc.exitCode !== null) return;
  const stopped = new Promise((resolve) => proc.once("exit", resolve));
  proc.kill("SIGTERM");
  await stopped;
}
const version = (game) => ({
  gameId: game.gameId,
  expectedRevision: game.revision,
});
async function ready(tool) {
  for (let i = 0; i < 200; i++) {
    const game = await tool("get_game");
    if (game.phase !== "engine_thinking") return game;
    await delay(75);
  }
  throw new Error("Stockfish did not complete its reply.");
}
try {
  await connect(true);
  await disconnect();
  let tool = await connect();
  let game = await tool("show_board");
  const board = new URL(game.url);
  assert.equal(board.hostname, "127.0.0.1");
  assert.match(await (await fetch(board.origin)).text(), /Chess Coach/);
  game = await tool("new_game", {
    ...version(game),
    playerColor: "w",
    difficulty: "easy",
  });
  await tool("retry_engine", version(game), true);
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
    assert.equal(game.status, "playing");
    const move =
      game.legalMoves.find((m) => m.from + m.to === opening[i]) ??
      game.legalMoves.find((m) => m.from !== "f2") ??
      game.legalMoves[0];
    await tool("make_move", { ...version(game), ...move });
    game = await ready(tool);
    assert.equal(game.phase, "player_turn");
  }
  assert.equal(game.moves.length, 20);
  const analysis = await tool("analyze_position", version(game));
  assert.equal(analysis.fen, game.fen);
  assert.equal(analysis.gameId, game.gameId);
  assert.equal(analysis.revision, game.revision);
  assert.ok(analysis.lines.length > 0);
  for (const line of analysis.lines) {
    const replay = new Chess(analysis.fen);
    for (const move of line.san) assert.ok(replay.move(move));
  }
  const exported = await tool("export_pgn");
  const replay = new Chess();
  replay.loadPgn(exported.pgn);
  assert.equal(replay.fen(), game.fen);
  const savedFen = game.fen;
  const info = JSON.parse(
    await readFile(join(directory, "server.json"), "utf8"),
  );
  const headers = {
    Authorization: `Bearer ${info.token}`,
    "Content-Type": "application/json",
  };
  await fetch(`http://127.0.0.1:${info.port}/preferences`, {
    method: "POST",
    headers,
    body: '{"locale":"zh-CN"}',
  });
  const stream = await fetch(`http://127.0.0.1:${info.port}/events`, {
    headers,
  });
  const reader = stream.body.getReader();
  assert.ok(
    new TextDecoder().decode((await reader.read()).value).includes(savedFen),
  );
  await reader.cancel();
  process.kill(info.pid, "SIGKILL");
  game = await ready(tool);
  assert.equal(game.fen, savedFen);
  assert.equal(game.moves.length, 20);
  const freshBoard = await tool("show_board");
  assert.match(
    await (await fetch(new URL(freshBoard.url).origin)).text(),
    /Chess Coach/,
  );
  await disconnect();
  cli(["plugin", "remove", pluginId]);
  cli(["plugin", "add", pluginId]);
  tool = await connect();
  game = await tool("get_game");
  assert.equal(game.fen, savedFen);
  assert.equal(
    JSON.parse(await readFile(join(directory, "preferences.json"), "utf8"))
      .locale,
    "zh-CN",
  );
  const undone = await tool("undo_turn", version(game));
  assert.equal(undone.moves.length, 18);
  const report = {
    passed: true,
    anonymousGitHub: anonymous,
    offline,
    codex: codexVersion,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    version: metadata.version,
    buildId: metadata.buildId,
    sourceCommit: metadata.sourceCommit,
    toolCount: 8,
    rounds: 10,
    missingNodeDiagnostic: true,
    finalFen: savedFen,
    analysisMatches: true,
    legalVariations: true,
    pgnReplayMatches: true,
    restartPreservesGame: true,
    reinstallPreservesData: true,
    sseSnapshot: true,
    localBoardServed: true,
    generatedAt: new Date().toISOString(),
  };
  await mkdir(resolve(reportPath, ".."), { recursive: true });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error.message);
  // Runtime logs may contain paths and credentials; reports deliberately omit them.
  process.exitCode = 1;
} finally {
  await disconnect();
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
    await delay(250);
  } catch {
    /* A failed launch may not have created a service. */
  }
  cli(["plugin", "remove", pluginId]);
  cli(["plugin", "marketplace", "remove", catalog.name]);
  await rm(directory, { recursive: true, force: true });
  await rm(workspace, { recursive: true, force: true });
}
