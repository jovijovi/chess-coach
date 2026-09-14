import {
  cp,
  mkdir,
  rename,
  rm,
  readFile,
  writeFile,
  lstat,
} from "node:fs/promises";
import { join } from "node:path";
import { acquireLock } from "./locks.js";
import { compareVersions, readManifest, verifyRuntime } from "./integrity.js";
import {
  activationLock,
  dataDir,
  distDir,
  ensureServiceLocked,
  healthy,
  readInfo,
  serviceLock,
  stopService,
} from "./runtime.js";

export const runtime = join(dataDir, "runtime");
const previous = join(dataDir, "runtime.previous");
const staged = join(dataDir, "runtime.staged");
const journal = join(dataDir, "activation.json");
async function exists(path: string) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}
async function writeJournal(hadRuntime: boolean) {
  await writeFile(journal + ".tmp", JSON.stringify({ hadRuntime }), {
    mode: 0o600,
  });
  await rename(journal + ".tmp", journal);
}
async function recover() {
  if (!(await exists(journal))) return;
  const { hadRuntime } = JSON.parse(await readFile(journal, "utf8"));
  await stopService();
  const unlock = await acquireLock(serviceLock, 5000);
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

/** Activate bundled files under one lease. Saved games are never copied or reverted. */
export async function activate(source = distDir) {
  const wanted = await verifyRuntime(source);
  const release = await acquireLock(activationLock);
  try {
    await mkdir(dataDir, { recursive: true, mode: 0o700 });
    await recover();
    if (await exists(runtime)) {
      let current;
      try {
        current = await readManifest(runtime);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        throw new Error(
          "A legacy personal runtime is present. Stop old tasks and follow the documented personal migration before installing this release.",
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
          "This version has a different build ID. Install a new RC version, or stop all tasks and clean the runtime before an intentional rollback.",
        );
    }
    await rm(staged, { recursive: true, force: true });
    await cp(source, staged, {
      recursive: true,
      errorOnExist: true,
      force: false,
    });
    await verifyRuntime(staged);
    const hadRuntime = await exists(runtime);
    await rm(previous, { recursive: true, force: true });
    await stopService();
    const unlock = await acquireLock(serviceLock, 5000);
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
        { cause: error },
      );
    }
    await rm(journal, { force: true });
    await rm(previous, { recursive: true, force: true });
    return runtime;
  } finally {
    release();
  }
}

export async function doctor() {
  const info = await readInfo();
  let installed: unknown;
  try {
    const manifest = await verifyRuntime(runtime);
    installed = {
      version: manifest.version,
      buildId: manifest.buildId,
      integrity: "ok",
    };
  } catch (error) {
    installed = { integrity: "unavailable", reason: (error as Error).message };
  }
  return {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    dataDir,
    runtime,
    installed,
    service:
      info && (await healthy(info))
        ? {
            running: true,
            pid: info.pid,
            version: info.version,
            buildId: info.buildId,
          }
        : { running: false },
  };
}

export async function control(command: string) {
  if (command === "doctor") return doctor();
  if (command !== "stop" && command !== "clean-runtime")
    throw new Error("Usage: launch.mjs [doctor | stop | clean-runtime | open]");
  const release = await acquireLock(activationLock);
  try {
    await stopService();
    const unlock = await acquireLock(serviceLock, 5000);
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
      dataPreserved: true,
    };
  } finally {
    release();
  }
}
