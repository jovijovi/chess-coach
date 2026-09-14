import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);

// plugins/chess-coach/src/activation.ts
import {
  cp,
  mkdir as mkdir3,
  rename,
  rm,
  readFile as readFile3,
  writeFile,
  lstat as lstat2
} from "node:fs/promises";
import { join as join3 } from "node:path";

// plugins/chess-coach/src/locks.ts
import { DatabaseSync } from "node:sqlite";
import { mkdir, chmod } from "node:fs/promises";
import { dirname } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
var LockBusyError = class extends Error {
};
async function acquireLock(path, timeoutMs = 3e4) {
  await mkdir(dirname(path), { recursive: true, mode: 448 });
  const db = new DatabaseSync(path);
  const deadline = Date.now() + timeoutMs;
  try {
    await chmod(path, 384);
    db.exec("PRAGMA busy_timeout=0");
    for (; ; ) {
      try {
        db.exec("BEGIN EXCLUSIVE");
        let released = false;
        return () => {
          if (released) return;
          released = true;
          try {
            db.exec("ROLLBACK");
          } finally {
            db.close();
          }
        };
      } catch (error) {
        const code = error.errcode;
        if (code !== 5 && code !== 6) throw error;
        if (Date.now() >= deadline)
          throw new LockBusyError(
            "Chess Coach is busy. Retry after the current activation finishes."
          );
        await delay(50);
      }
    }
  } catch (error) {
    db.close();
    throw error;
  }
}

// plugins/chess-coach/src/integrity.ts
import { readFile, readdir, lstat } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
var sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function readManifest(root) {
  const manifest = JSON.parse(
    await readFile(join(root, "runtime.json"), "utf8")
  );
  if (manifest.protocol !== 1 || !/^\d+\.\d+\.\d+(?:-rc\.\d+)?$/.test(manifest.version) || !/^[a-f0-9]{64}$/.test(manifest.buildId) || !manifest.files || sha256(
    JSON.stringify({
      version: manifest.version,
      protocol: manifest.protocol,
      files: manifest.files
    })
  ) !== manifest.buildId)
    throw new Error(
      "Invalid Chess Coach runtime manifest. Reinstall the plugin."
    );
  return manifest;
}
async function verifyRuntime(root) {
  const manifest = await readManifest(root);
  const actual = [];
  async function visit(relative) {
    for (const entry of await readdir(join(root, relative), {
      withFileTypes: true
    })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink())
        throw new Error(`Unexpected symbolic link: ${name}`);
      if (entry.isDirectory()) await visit(name);
      else if (entry.isFile() && name !== "runtime.json") actual.push(name);
      else if (!entry.isFile())
        throw new Error(`Unexpected runtime entry: ${name}`);
    }
  }
  if ((await lstat(root)).isSymbolicLink())
    throw new Error("The runtime directory must not be a symbolic link.");
  await visit("");
  const expected = Object.keys(manifest.files).sort();
  if (JSON.stringify(actual.sort()) !== JSON.stringify(expected))
    throw new Error(
      "Chess Coach runtime files are missing or unexpected. Reinstall the plugin."
    );
  for (const name of expected) {
    if (!/^[a-zA-Z0-9_./-]+$/.test(name) || name.startsWith("/") || name.split("/").includes("..") || sha256(await readFile(join(root, name))) !== manifest.files[name])
      throw new Error(
        `Chess Coach resource verification failed: ${name}. Reinstall the plugin.`
      );
  }
  return manifest;
}
function compareVersions(a, b) {
  const parts = (v) => {
    const [core, rc] = v.split("-rc.");
    return [
      ...core.split(".").map(Number),
      rc === void 0 ? Infinity : Number(rc)
    ];
  };
  const x = parts(a), y = parts(b);
  for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  return 0;
}

// plugins/chess-coach/src/runtime.ts
import { homedir } from "node:os";
import { dirname as dirname2, join as join2 } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile as readFile2, mkdir as mkdir2, open } from "node:fs/promises";
import { spawn } from "node:child_process";
import { setTimeout as delay2 } from "node:timers/promises";
var dataDir = process.env.CHESS_COACH_DATA_DIR || join2(homedir(), ".local/share/chess-coach");
var distDir = dirname2(fileURLToPath(import.meta.url));
var infoPath = join2(dataDir, "server.json");
var activationLock = join2(dataDir, "activation-lock.db");
var serviceLock = join2(dataDir, "service-lock.db");
async function readInfo() {
  try {
    const info = JSON.parse(await readFile2(infoPath, "utf8"));
    if (info.protocol === 1 && Number.isInteger(info.pid) && info.pid > 0 && Number.isInteger(info.port) && info.port > 0 && info.port < 65536 && /^[a-f0-9]{64}$/.test(info.token))
      return info;
  } catch {
  }
}
var origin = (info) => `http://127.0.0.1:${info.port}`;
async function healthy(info) {
  try {
    const r = await fetch(`${origin(info)}/health`, {
      headers: { Authorization: `Bearer ${info.token}` },
      signal: AbortSignal.timeout(700)
    });
    const health = await r.json();
    return r.ok && health.pid === info.pid && health.buildId === info.buildId;
  } catch {
    return false;
  }
}
async function stopService() {
  const info = await readInfo();
  if (!info || !await healthy(info)) return false;
  const r = await fetch(`${origin(info)}/shutdown`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${info.token}`,
      "Content-Type": "application/json"
    },
    body: "{}",
    signal: AbortSignal.timeout(2e3)
  });
  if (!r.ok)
    throw new Error("The running Chess Coach service refused to stop.");
  for (let i = 0; i < 100; i++) {
    if (!await healthy(info)) {
      const release = await acquireLock(serviceLock, 5e3);
      release();
      return true;
    }
    await delay2(50);
  }
  throw new Error(
    "The running Chess Coach service did not stop. Runtime files were not replaced."
  );
}
async function ensureServiceLocked(directory = distDir) {
  const wanted = await readManifest(directory);
  const old = await readInfo();
  if (old && await healthy(old)) {
    if (old.buildId === wanted.buildId) return old;
    await stopService();
  }
  await verifyRuntime(directory);
  await mkdir2(dataDir, { recursive: true, mode: 448 });
  const log = await open(join2(dataDir, "service.log"), "a", 384);
  let spawnError;
  try {
    const child = spawn(process.execPath, [join2(directory, "daemon.js")], {
      detached: true,
      stdio: ["ignore", log.fd, log.fd],
      cwd: directory,
      env: { ...process.env, CHESS_COACH_DATA_DIR: dataDir }
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
    if (info?.buildId === wanted.buildId && await healthy(info)) return info;
    await delay2(100);
  }
  throw new Error(
    "Chess Coach could not start. Run doctor and inspect service.log in the data directory."
  );
}

// plugins/chess-coach/src/activation.ts
var runtime = join3(dataDir, "runtime");
var previous = join3(dataDir, "runtime.previous");
var staged = join3(dataDir, "runtime.staged");
var journal = join3(dataDir, "activation.json");
async function exists(path) {
  try {
    await lstat2(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function writeJournal(hadRuntime) {
  await writeFile(journal + ".tmp", JSON.stringify({ hadRuntime }), {
    mode: 384
  });
  await rename(journal + ".tmp", journal);
}
async function recover() {
  if (!await exists(journal)) return;
  const { hadRuntime } = JSON.parse(await readFile3(journal, "utf8"));
  await stopService();
  const unlock = await acquireLock(serviceLock, 5e3);
  try {
    if (await exists(previous)) {
      await rm(runtime, { recursive: true, force: true });
      await rename(previous, runtime);
    } else if (!hadRuntime) await rm(runtime, { recursive: true, force: true });
    await rm(staged, { recursive: true, force: true });
    await rm(journal, { force: true });
  } finally {
    unlock();
  }
}
async function activate(source = distDir) {
  const wanted = await verifyRuntime(source);
  const release = await acquireLock(activationLock);
  try {
    await mkdir3(dataDir, { recursive: true, mode: 448 });
    await recover();
    if (await exists(runtime)) {
      let current;
      try {
        current = await readManifest(runtime);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        throw new Error(
          "A legacy personal runtime is present. Stop old tasks and follow the documented personal migration before installing this release."
        );
      }
      const order = compareVersions(current.version, wanted.version);
      if (order > 0 || current.buildId === wanted.buildId) {
        await verifyRuntime(runtime);
        await ensureServiceLocked(runtime);
        return runtime;
      }
      if (order === 0)
        throw new Error(
          "This version has a different build ID. Install a new RC version, or stop all tasks and clean the runtime before an intentional rollback."
        );
    }
    await rm(staged, { recursive: true, force: true });
    await cp(source, staged, {
      recursive: true,
      errorOnExist: true,
      force: false
    });
    await verifyRuntime(staged);
    const hadRuntime = await exists(runtime);
    await rm(previous, { recursive: true, force: true });
    await stopService();
    const unlock = await acquireLock(serviceLock, 5e3);
    try {
      await writeJournal(hadRuntime);
      if (hadRuntime) await rename(runtime, previous);
      await rename(staged, runtime);
    } finally {
      unlock();
    }
    try {
      await ensureServiceLocked(runtime);
    } catch (error) {
      await recover();
      if (hadRuntime) await ensureServiceLocked(runtime);
      throw new Error(
        "Chess Coach activation failed; previous runtime files were restored and saved games were retained.",
        { cause: error }
      );
    }
    await rm(journal, { force: true });
    await rm(previous, { recursive: true, force: true });
    return runtime;
  } finally {
    release();
  }
}
async function doctor() {
  const info = await readInfo();
  let installed;
  try {
    const manifest = await verifyRuntime(runtime);
    installed = {
      version: manifest.version,
      buildId: manifest.buildId,
      integrity: "ok"
    };
  } catch (error) {
    installed = { integrity: "unavailable", reason: error.message };
  }
  return {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    dataDir,
    runtime,
    installed,
    service: info && await healthy(info) ? {
      running: true,
      pid: info.pid,
      version: info.version,
      buildId: info.buildId
    } : { running: false }
  };
}
async function control(command) {
  if (command === "doctor") return doctor();
  if (command !== "stop" && command !== "clean-runtime")
    throw new Error("Usage: launch.mjs [doctor | stop | clean-runtime | open]");
  const release = await acquireLock(activationLock);
  try {
    await stopService();
    const unlock = await acquireLock(serviceLock, 5e3);
    try {
      if (command === "clean-runtime") {
        for (const path of [runtime, previous, staged])
          await rm(path, { recursive: true, force: true });
        await rm(journal, { force: true });
      }
    } finally {
      unlock();
    }
    return {
      stopped: true,
      runtimeRemoved: command === "clean-runtime",
      dataPreserved: true
    };
  } finally {
    release();
  }
}
export {
  activate,
  control,
  doctor,
  runtime
};
