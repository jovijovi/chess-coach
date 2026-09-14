import { DatabaseSync } from "node:sqlite";
import { mkdir, chmod } from "node:fs/promises";
import { dirname } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

export class LockBusyError extends Error {}

/** A separate database holds an OS-backed lease; crashes release it automatically. */
export async function acquireLock(path: string, timeoutMs = 30000) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  const deadline = Date.now() + timeoutMs;
  try {
    await chmod(path, 0o600);
    db.exec("PRAGMA busy_timeout=0");
    for (;;) {
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
        const code = (error as { errcode?: number }).errcode;
        if (code !== 5 && code !== 6) throw error;
        if (Date.now() >= deadline)
          throw new LockBusyError(
            "Chess Coach is busy. Retry after the current activation finishes.",
          );
        await delay(50);
      }
    }
  } catch (error) {
    db.close();
    throw error;
  }
}
