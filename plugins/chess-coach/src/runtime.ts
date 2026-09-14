import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, mkdir, open } from "node:fs/promises";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { acquireLock } from "./locks.js";
import { readManifest, verifyRuntime } from "./integrity.js";

export const dataDir =
  process.env.CHESS_COACH_DATA_DIR ||
  join(homedir(), ".local/share/chess-coach");
export const distDir = dirname(fileURLToPath(import.meta.url));
export const infoPath = join(dataDir, "server.json");
export const activationLock = join(dataDir, "activation-lock.db");
export const serviceLock = join(dataDir, "service-lock.db");
export type RuntimeInfo = {
  pid: number;
  port: number;
  token: string;
  buildId: string;
  version?: string;
  protocol: 1;
};
export const buildId = async () => (await readManifest(distDir)).buildId;
export async function readInfo(): Promise<RuntimeInfo | undefined> {
  try {
    const info = JSON.parse(await readFile(infoPath, "utf8")) as RuntimeInfo;
    if (
      info.protocol === 1 &&
      Number.isInteger(info.pid) &&
      info.pid > 0 &&
      Number.isInteger(info.port) &&
      info.port > 0 &&
      info.port < 65536 &&
      /^[a-f0-9]{64}$/.test(info.token)
    )
      return info;
  } catch {
    /* Missing metadata is normal before the first launch. */
  }
}
export const origin = (info: RuntimeInfo) => `http://127.0.0.1:${info.port}`;
export const boardUrl = (info: RuntimeInfo) =>
  `${origin(info)}/#token=${info.token}`;
export async function healthy(info: RuntimeInfo) {
  try {
    const r = await fetch(`${origin(info)}/health`, {
      headers: { Authorization: `Bearer ${info.token}` },
      signal: AbortSignal.timeout(700),
    });
    const health = (await r.json()) as RuntimeInfo;
    return r.ok && health.pid === info.pid && health.buildId === info.buildId;
  } catch {
    return false;
  }
}
/** Caller holds the activation lock when changing running files or stopping a service. */
export async function stopService() {
  const info = await readInfo();
  if (!info || !(await healthy(info))) return false;
  const r = await fetch(`${origin(info)}/shutdown`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${info.token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    signal: AbortSignal.timeout(2000),
  });
  if (!r.ok)
    throw new Error("The running Chess Coach service refused to stop.");
  for (let i = 0; i < 100; i++) {
    if (!(await healthy(info))) {
      const release = await acquireLock(serviceLock, 5000);
      release();
      return true;
    }
    await delay(50);
  }
  throw new Error(
    "The running Chess Coach service did not stop. Runtime files were not replaced.",
  );
}
export async function ensureServiceLocked(
  directory = distDir,
): Promise<RuntimeInfo> {
  const wanted = await readManifest(directory);
  const old = await readInfo();
  if (old && (await healthy(old))) {
    if (old.buildId === wanted.buildId) return old;
    await stopService();
  }
  await verifyRuntime(directory);
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const log = await open(join(dataDir, "service.log"), "a", 0o600);
  let spawnError: Error | undefined;
  try {
    const child = spawn(process.execPath, [join(directory, "daemon.js")], {
      detached: true,
      stdio: ["ignore", log.fd, log.fd],
      cwd: directory,
      env: { ...process.env, CHESS_COACH_DATA_DIR: dataDir },
    });
    child.on("error", (error) => {
      spawnError = error;
    });
    child.unref();
  } finally {
    await log.close();
  }
  for (let i = 0; i < 150; i++) {
    if (spawnError) throw spawnError;
    const info = await readInfo();
    if (info?.buildId === wanted.buildId && (await healthy(info))) return info;
    await delay(100);
  }
  throw new Error(
    "Chess Coach could not start. Run doctor and inspect service.log in the data directory.",
  );
}
export async function ensureService() {
  const release = await acquireLock(activationLock);
  try {
    return await ensureServiceLocked();
  } finally {
    release();
  }
}
export async function callService(name: string, args: unknown = {}) {
  const info = await ensureService();
  const r = await fetch(`${origin(info)}/api`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${info.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, args }),
    signal: AbortSignal.timeout(20000),
  });
  const data = (await r.json()) as { result?: unknown; error?: unknown };
  if (!r.ok && !data.error)
    throw new Error("Chess Coach request failed. Reopen the board and retry.");
  return data;
}
