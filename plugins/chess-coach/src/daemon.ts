import { createServer, type ServerResponse } from "node:http";
import { readFile, writeFile, rename, rm } from "node:fs/promises";
import { join, resolve, extname } from "node:path";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { ZodError, z } from "zod";
import { Preferences } from "./preferences.js";
import { acquireLock, LockBusyError } from "./locks.js";
import { readManifest } from "./integrity.js";
import { Store } from "./store.js";
import { GameService } from "./game.js";
import { GameError } from "./types.js";
import { StockfishEngine } from "./engine.js";
import { operations, dispatch, type Operation } from "./operations.js";
import {
  dataDir,
  distDir,
  infoPath,
  buildId,
  boardUrl,
  readInfo,
  serviceLock,
  type RuntimeInfo,
} from "./runtime.js";

let game: GameService | undefined;
let preferences: Preferences;
const clients = new Set<ServerResponse>();
let info: RuntimeInfo;
let stopping = false;
let releaseService: (() => void) | undefined;
const root = join(distDir, "public");
const sendJson = (res: ServerResponse, status: number, value: unknown) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(value));
};
const server = createServer(async (req, res) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'",
  );
  try {
    if (!info || req.headers.host !== `127.0.0.1:${info.port}`)
      return sendJson(res, 403, {
        error: { code: "FORBIDDEN", message: "Invalid local service address." },
      });
    if (
      req.headers.origin &&
      req.headers.origin !== `http://127.0.0.1:${info.port}`
    )
      return sendJson(res, 403, {
        error: {
          code: "FORBIDDEN",
          message: "Cross-origin requests are not allowed.",
        },
      });
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${info.port}`);
    if (
      ["/health", "/api", "/events", "/shutdown", "/preferences"].includes(
        url.pathname,
      )
    ) {
      const supplied = Buffer.from(
        req.headers.authorization?.replace(/^Bearer /, "") ?? "",
      );
      const expected = Buffer.from(info.token);
      if (
        supplied.length !== expected.length ||
        !timingSafeEqual(supplied, expected)
      )
        return sendJson(res, 401, {
          error: {
            code: "UNAUTHORIZED",
            message: "Reopen the chessboard from Codex.",
          },
        });
      if (url.pathname === "/preferences" && req.method === "GET")
        return sendJson(res, 200, { locale: preferences.locale });
      if (url.pathname === "/health" && req.method === "GET")
        return sendJson(res, 200, {
          pid: process.pid,
          buildId: info.buildId,
          version: info.version,
        });
      if (url.pathname === "/events" && req.method === "GET") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-store",
          Connection: "keep-alive",
        });
        clients.add(res);
        res.write(`data: ${JSON.stringify(game!.view())}\n\n`);
        const heartbeat = setInterval(
          () => res.write(": heartbeat\n\n"),
          15000,
        );
        req.on("close", () => {
          clearInterval(heartbeat);
          clients.delete(res);
        });
        return;
      }
      if (req.method !== "POST")
        return sendJson(res, 405, {
          error: { code: "METHOD", message: "Invalid request method." },
        });
      if (!req.headers["content-type"]?.startsWith("application/json"))
        return sendJson(res, 415, {
          error: {
            code: "CONTENT_TYPE",
            message: "A JSON request is required.",
          },
        });
      let body = "";
      for await (const part of req) {
        body += String(part);
        if (Buffer.byteLength(body) > 16384) {
          sendJson(res, 413, {
            error: { code: "TOO_LARGE", message: "Request body is too large." },
          });
          return;
        }
      }
      if (url.pathname === "/shutdown") {
        sendJson(res, 200, { stopped: true });
        setTimeout(() => void shutdown(), 20);
        return;
      }
      if (url.pathname === "/preferences") {
        const { locale } = z
          .object({ locale: z.enum(["en", "zh-CN"]) })
          .strict()
          .parse(JSON.parse(body));
        preferences.setLocale(locale);
        return sendJson(res, 200, { locale });
      }
      const parsed = z
        .object({
          name: z.enum(Object.keys(operations) as [Operation, ...Operation[]]),
          args: z.unknown().default({}),
        })
        .strict()
        .parse(JSON.parse(body));
      const result = await dispatch(
        game!,
        parsed.name,
        parsed.args,
        boardUrl(info),
      );
      return sendJson(res, 200, { result });
    }
    if (req.method !== "GET")
      return sendJson(res, 405, {
        error: { code: "METHOD", message: "Invalid request method." },
      });
    const requested =
      url.pathname === "/" || url.pathname === "/export"
        ? "/index.html"
        : decodeURIComponent(url.pathname);
    const path = resolve(root, "." + requested);
    if (!path.startsWith(root + "/"))
      return sendJson(res, 404, {
        error: { code: "NOT_FOUND", message: "Page not found." },
      });
    const bytes = await readFile(path);
    const mime: Record<string, string> = {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".svg": "image/svg+xml",
    };
    res.writeHead(200, {
      "Content-Type": mime[extname(path)] ?? "application/octet-stream",
      "Cache-Control": path.endsWith(".html") ? "no-store" : "max-age=3600",
    });
    res.end(bytes);
  } catch (error) {
    if (res.destroyed || res.writableEnded) return;
    if (error instanceof GameError)
      sendJson(res, error.code === "STALE_STATE" ? 409 : 400, {
        error: {
          code: error.code,
          message: error.message,
          current: error.current,
        },
      });
    else if (error instanceof ZodError || error instanceof SyntaxError)
      sendJson(res, 400, {
        error: {
          code: "INVALID_INPUT",
          message: "Invalid request parameters.",
        },
      });
    else if ((error as NodeJS.ErrnoException).code === "ENOENT")
      sendJson(res, 404, {
        error: {
          code: "NOT_FOUND",
          message: "Page not found. Rebuild the plugin.",
        },
      });
    else {
      console.error(error);
      sendJson(res, 500, {
        error: {
          code: "INTERNAL",
          message:
            error instanceof Error
              ? error.message
              : "The service is temporarily unavailable.",
        },
      });
    }
  }
});
async function shutdown() {
  if (stopping) return;
  stopping = true;
  game?.close();
  clients.forEach((res) => res.end());
  server.close();
  server.closeAllConnections();
  const saved = await readInfo();
  if (info && saved?.pid === process.pid && saved.token === info.token)
    await rm(infoPath, { force: true });
  releaseService?.();
  process.exit(process.exitCode ?? 0);
}
try {
  process.umask(0o077);
  releaseService = await acquireLock(serviceLock, 0);
  game = new GameService(
    new Store(join(dataDir, "state.db")),
    new StockfishEngine(),
  );
  preferences = new Preferences(join(dataDir, "preferences.json"));
  game.on("change", (value) => {
    for (const res of clients) res.write(`data: ${JSON.stringify(value)}\n\n`);
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Failed to allocate a loopback port");
  info = {
    pid: process.pid,
    port: address.port,
    token: randomBytes(32).toString("hex"),
    buildId: await buildId(),
    version: (await readManifest(distDir)).version,
    protocol: 1,
  };
  await writeFile(infoPath + ".tmp", JSON.stringify(info), { mode: 0o600 });
  await rename(infoPath + ".tmp", infoPath);
  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
  game.start();
} catch (error) {
  if (error instanceof LockBusyError) process.exit(0);
  console.error(error);
  process.exitCode = 1;
  await shutdown();
}
