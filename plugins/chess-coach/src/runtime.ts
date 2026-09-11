import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, mkdir, open } from "node:fs/promises";
import { spawn } from "node:child_process";
export const dataDir =
  process.env.CHESS_COACH_DATA_DIR ||
  join(homedir(), ".local/share/chess-coach");
export const distDir = dirname(fileURLToPath(import.meta.url));
export type RuntimeInfo = {
  pid: number;
  port: number;
  token: string;
  buildId: string;
  protocol: 1;
};
export const infoPath = join(dataDir, "server.json");
export const lockPath = join(dataDir, "server.lock");
export async function buildId() {
  return (await readFile(join(distDir, "build-id"), "utf8")).trim();
}
export async function readInfo(): Promise<RuntimeInfo | undefined> {
  try {
    const info = JSON.parse(await readFile(infoPath, "utf8")) as RuntimeInfo;
    if (
      info.protocol !== 1 ||
      !Number.isInteger(info.port) ||
      info.port < 1 ||
      info.port > 65535 ||
      !/^[a-f0-9]{64}$/.test(info.token)
    )
      return;
    return info;
  } catch {
    return;
  }
}
export const origin = (info: RuntimeInfo) => `http://127.0.0.1:${info.port}`;
export const boardUrl = (info: RuntimeInfo) =>
  `${origin(info)}/#token=${info.token}`;
export async function healthy(info: RuntimeInfo) {
  try {
    const r = await fetch(origin(info) + "/health", {
      headers: { Authorization: `Bearer ${info.token}` },
      signal: AbortSignal.timeout(700),
    });
    const health = (await r.json()) as { pid: number; buildId: string };
    return r.ok && health.pid === info.pid && health.buildId === info.buildId;
  } catch {
    return false;
  }
}
export async function stopService() {
  const info = await readInfo();
  if (!info || !(await healthy(info))) return false;
  await fetch(origin(info) + "/shutdown", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${info.token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    signal: AbortSignal.timeout(2000),
  });
  for (let i = 0; i < 60 && (await healthy(info)); i++)
    await new Promise((r) => setTimeout(r, 50));
  return true;
}
export async function ensureService(): Promise<RuntimeInfo> {
  const wanted = await buildId();
  const old = await readInfo();
  if (old && (await healthy(old))) {
    if (old.buildId === wanted) return old;
    await stopService();
  }
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const log = await open(join(dataDir, "service.log"), "a", 0o600);
  const child = spawn(
    "/usr/bin/flock",
    ["--nonblock", lockPath, process.execPath, join(distDir, "daemon.js")],
    {
      detached: true,
      stdio: ["ignore", log.fd, log.fd],
      env: { ...process.env, CHESS_COACH_DATA_DIR: dataDir },
      cwd: distDir,
    },
  );
  let spawnError: Error | undefined;
  child.on("error", (error) => {
    spawnError = error;
  });
  child.unref();
  await log.close();
  for (let i = 0; i < 150; i++) {
    if (spawnError) throw spawnError;
    const info = await readInfo();
    if (info && info.buildId === wanted && (await healthy(info))) return info;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(
    `Failed to start the local chess service. See ${join(dataDir, "service.log")}`,
  );
}
export async function callService(name: string, args: unknown = {}) {
  const info = await ensureService();
  const response = await fetch(origin(info) + "/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${info.token}`,
    },
    body: JSON.stringify({ name, args }),
    signal: AbortSignal.timeout(20000),
  });
  const body = (await response.json()) as {
    result?: unknown;
    error?: { code: string; message: string; current?: unknown };
  };
  if (body.error) return { error: body.error };
  if (!response.ok)
    throw new Error("The local chess service is temporarily unavailable.");
  return { result: body.result };
}
