import { afterEach, beforeEach, expect, it } from "vitest";
import {
  mkdtemp,
  readFile,
  writeFile,
  rm,
  cp,
  mkdir,
  rename,
} from "node:fs/promises";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { acquireLock } from "../plugins/chess-coach/src/locks";
import type { GameView } from "../plugins/chess-coach/src/types";

const exec = promisify(execFile);
import { version as baseVersion } from "../package.json";
const newerVersion = baseVersion.includes("-rc.")
  ? baseVersion.replace(/-rc\.(\d+)$/, (_, n) => `-rc.${Number(n) + 1}`)
  : "0.2.1-rc.1";
const packaged = resolve("output/release/marketplace/plugins/chess-coach");
const hash = (bytes: string | Buffer) =>
  createHash("sha256").update(bytes).digest("hex");
let root: string, data: string, plugin: string;
const clients: Client[] = [];
const read = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const save = (path: string, value: unknown) =>
  writeFile(path, JSON.stringify(value, null, 2) + "\n");
const env = () => ({ ...process.env, CHESS_COACH_DATA_DIR: data });
const launch = (command: string, source = plugin) =>
  exec(process.execPath, [join(source, "scripts/launch.mjs"), command], {
    env: env(),
    timeout: 25000,
  });
async function client(source = plugin) {
  const c = new Client({ name: "release-test", version: "1" });
  clients.push(c);
  await c.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [join(source, "scripts/launch.mjs")],
      env: env() as Record<string, string>,
      stderr: "pipe",
    }),
  );
  return c;
}
async function game(c: Client) {
  const reply = await c.callTool({ name: "get_game", arguments: {} });
  expect(reply.isError).not.toBe(true);
  return reply.structuredContent as unknown as GameView;
}
async function reseal(source: string, version: string) {
  const manifest = await read(join(source, "dist/runtime.json"));
  manifest.version = version;
  for (const file of Object.keys(manifest.files))
    manifest.files[file] = hash(await readFile(join(source, "dist", file)));
  manifest.buildId = hash(
    JSON.stringify({
      version,
      protocol: manifest.protocol,
      files: manifest.files,
    }),
  );
  await save(join(source, "dist/runtime.json"), manifest);
  const checksums = await read(join(source, "checksums.json"));
  for (const file of Object.keys(checksums))
    checksums[file] = hash(await readFile(join(source, file)));
  await save(join(source, "checksums.json"), checksums);
}
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "chess release 测试 "));
  data = join(root, "saved games");
  plugin = join(root, "cache one", "chess-coach");
  await mkdir(data, { recursive: true });
  await cp(packaged, plugin, { recursive: true });
});
afterEach(async () => {
  await Promise.all(clients.splice(0).map((c) => c.close()));
  await exec(
    process.execPath,
    [resolve("plugins/chess-coach/dist/control.js"), "stop"],
    { env: env() },
  );
  await rm(root, { recursive: true, force: true });
});

it("uses portable manifests and a native CLI installation preview", async () => {
  const config = await read(join(plugin, "mcp.json"));
  expect(config.mcpServers["chess-coach"]).toEqual({
    type: "stdio",
    command: "node",
    args: ["./scripts/launch.mjs"],
    cwd: "${PLUGIN_ROOT}",
  });
  const result = await exec(process.execPath, [
    "scripts/install-local.mjs",
    "--dry-run",
  ]);
  expect(JSON.parse(result.stdout).commands[1]).toEqual([
    "plugin",
    "add",
    "chess-coach@chess-coach-local",
  ]);
});

it("serializes first launches, survives daemon crashes and cache moves, and preserves data after removal", async () => {
  const [a, b, c] = await Promise.all([client(), client(), client()]);
  const views = await Promise.all([game(a), game(b), game(c)]);
  expect(new Set(views.map((v) => v.gameId)).size).toBe(1);
  expect((await a.listTools()).tools).toHaveLength(8);
  let current = views[0];
  await a.callTool({
    name: "make_move",
    arguments: {
      gameId: current.gameId,
      expectedRevision: current.revision,
      from: "e2",
      to: "e4",
    },
  });
  await expect.poll(async () => (await game(b)).phase).toBe("player_turn");
  current = await game(b);
  await writeFile(join(data, "preferences.json"), '{"locale":"zh-CN"}');
  const first = await read(join(data, "server.json"));
  process.kill(first.pid, "SIGKILL");
  await expect.poll(async () => (await game(a)).fen).toBe(current.fen);
  const second = await read(join(data, "server.json"));
  expect(second.pid).not.toBe(first.pid);
  const moved = join(root, "cache 二");
  await rename(plugin, moved);
  plugin = moved;
  expect((await game(await client())).fen).toBe(current.fen);
  await Promise.all(clients.splice(0).map((x) => x.close()));
  await launch("clean-runtime");
  expect((await read(join(data, "preferences.json"))).locale).toBe("zh-CN");
  expect((await game(await client())).fen).toBe(current.fen);
  const report = JSON.parse((await launch("doctor")).stdout);
  expect(report.installed.integrity).toBe("ok");
  expect(JSON.stringify(report)).not.toContain(second.token);
}, 30000);

it("refuses corrupt resources before stopping a healthy service", async () => {
  const c = await client();
  const current = await game(c);
  const before = await read(join(data, "server.json"));
  await writeFile(
    join(plugin, "dist/engine/stockfish-18-lite-single.wasm"),
    "damaged",
  );
  await expect(launch("open")).rejects.toThrow(/verification failed/);
  expect((await read(join(data, "server.json"))).pid).toBe(before.pid);
  expect((await game(c)).gameId).toBe(current.gameId);
});

it("upgrades during an engine reply and prevents an old cached task from downgrading", async () => {
  const c = await client();
  const initial = await game(c);
  await c.callTool({
    name: "make_move",
    arguments: {
      gameId: initial.gameId,
      expectedRevision: initial.revision,
      from: "e2",
      to: "e4",
    },
  });
  const newer = join(root, "new cache");
  await cp(plugin, newer, { recursive: true });
  await reseal(newer, newerVersion);
  const next = await client(newer);
  await expect.poll(async () => (await game(next)).phase).toBe("player_turn");
  expect((await game(next)).moves).toHaveLength(2);
  const info = await read(join(data, "server.json"));
  expect((await game(c)).fen).toBe((await game(next)).fen);
  await client(plugin);
  expect((await read(join(data, "server.json"))).pid).toBe(info.pid);
  expect((await read(join(data, "runtime/runtime.json"))).version).toBe(
    newerVersion,
  );
});

it("restores previous runtime files when a staged release cannot become healthy", async () => {
  const c = await client();
  const initial = await game(c);
  const broken = join(root, "broken cache");
  await cp(plugin, broken, { recursive: true });
  await writeFile(
    join(broken, "dist/daemon.js"),
    'process.stderr.write("Injected startup failure\\n"); process.exit(1);',
  );
  await reseal(broken, newerVersion);
  await expect(launch("open", broken)).rejects.toThrow(
    /previous runtime files were restored/,
  );
  expect((await game(c)).gameId).toBe(initial.gameId);
  expect((await read(join(data, "runtime/runtime.json"))).version).toBe(
    baseVersion,
  );
}, 25000);

it("recovers an interrupted directory switch without changing the saved game", async () => {
  const c = await client();
  const initial = await game(c);
  await launch("stop");
  await rename(join(data, "runtime"), join(data, "runtime.previous"));
  await mkdir(join(data, "runtime"));
  await writeFile(join(data, "runtime", "incomplete"), "crash");
  await save(join(data, "activation.json"), { hadRuntime: true });
  expect((await game(await client())).gameId).toBe(initial.gameId);
});

it("holds SQLite leases across processes and releases them on process death", async () => {
  const path = join(data, "lease.db");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import {DatabaseSync} from "node:sqlite"; const db=new DatabaseSync(process.argv[1]);db.exec("BEGIN EXCLUSIVE");console.log("locked");setInterval(()=>{},1000);',
      path,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  await new Promise<void>((resolve, reject) => {
    child.stdout.once("data", () => resolve());
    child.once("error", reject);
  });
  try {
    await expect(acquireLock(path, 0)).rejects.toThrow(/busy/);
  } finally {
    child.kill("SIGKILL");
    await new Promise((resolve) => child.once("exit", resolve));
  }
  const release = await acquireLock(path, 1000);
  release();
});
