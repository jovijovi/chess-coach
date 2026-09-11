import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Engine, EngineLine, EngineSearch } from "./types.js";
export class StockfishEngine implements Engine {
  constructor(
    private script = join(
      dirname(fileURLToPath(import.meta.url)),
      "engine/stockfish-18-lite-single.js",
    ),
  ) {}
  search(
    request: EngineSearch,
    signal: AbortSignal,
  ): ReturnType<Engine["search"]> {
    return new Promise((resolve, reject) => {
      if (signal.aborted)
        return reject(new DOMException("Search cancelled", "AbortError"));
      const child = spawn(
        process.execPath,
        [
          join(dirname(fileURLToPath(import.meta.url)), "engine-worker.cjs"),
          this.script,
        ],
        { stdio: ["pipe", "pipe", "pipe"] },
      );
      const lines = new Map<number, EngineLine>();
      let done = false,
        started = false,
        diagnostic = "";
      const reader = createInterface({ input: child.stdout });
      const finish = (error?: Error, bestMove?: string) => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        signal.removeEventListener("abort", abort);
        reader.close();
        child.stdin.end("quit\n");
        const kill = setTimeout(() => child.kill("SIGKILL"), 500);
        kill.unref();
        child.once("exit", () => clearTimeout(kill));
        if (error) reject(error);
        else
          resolve({
            bestMove: bestMove!,
            lines: [...lines.values()].sort((a, b) => a.rank - b.rank),
          });
      };
      const abort = () => {
        finish(new DOMException("Search cancelled", "AbortError"));
        child.kill();
      };
      const timeout = setTimeout(
        () => finish(new Error("The chess engine timed out. Please retry.")),
        request.budget + 12000,
      );
      signal.addEventListener("abort", abort, { once: true });
      child.on("error", (error) => finish(error));
      child.stdin.on("error", () => {});
      child.stderr.on("data", (chunk) => {
        diagnostic = (diagnostic + String(chunk)).slice(-1500);
      });
      child.on("exit", () => {
        if (!done)
          finish(
            new Error(`The chess engine exited unexpectedly. ${diagnostic}`),
          );
      });
      const send = (command: string) => child.stdin.write(command + "\n");
      reader.on("line", (text) => {
        if (text === "uciok") {
          send("setoption name Hash value 16");
          send(`setoption name Skill Level value ${request.skill}`);
          send(`setoption name MultiPV value ${request.multiPv}`);
          send("isready");
        } else if (text === "readyok" && !started) {
          started = true;
          send(
            `position fen ${request.fen}${request.moves.length ? " moves " + request.moves.join(" ") : ""}`,
          );
          send(`go movetime ${request.budget}`);
        } else if (text.startsWith("info ") && text.includes(" pv ")) {
          const score = text.match(/ score (cp|mate) (-?\d+)/);
          if (
            !score ||
            text.includes(" lowerbound ") ||
            text.includes(" upperbound ")
          )
            return;
          const rank = Number(text.match(/ multipv (\d+)/)?.[1] ?? 1);
          lines.set(rank, {
            rank,
            depth: Number(text.match(/ depth (\d+)/)?.[1] ?? 0),
            score: { type: score[1] as "cp" | "mate", value: Number(score[2]) },
            pv: text.split(" pv ")[1].trim().split(/\s+/),
          });
        } else if (text.startsWith("bestmove "))
          finish(undefined, text.split(" ")[1]);
      });
      send("uci");
    });
  }
}
