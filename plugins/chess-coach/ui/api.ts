import type { GameView } from "../src/types";
import type { Locale } from "./i18n";
const hash = new URLSearchParams(location.hash.slice(1));
if (hash.get("token")) {
  sessionStorage.setItem("chess-coach-token", hash.get("token")!);
  history.replaceState(null, "", location.pathname);
}
const token = sessionStorage.getItem("chess-coach-token") ?? "";
async function request<T>(path: string, data?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: data === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw Object.assign(new Error("The local chess service is unavailable."), {
      code: "CONNECTION",
    });
  }
  const body = await response.json();
  if (body.error)
    throw Object.assign(new Error(body.error.message), body.error);
  if (!response.ok)
    throw Object.assign(
      new Error("The local chess service returned an error."),
      { code: "CONNECTION" },
    );
  return body as T;
}
export async function call<T>(name: string, args: unknown = {}): Promise<T> {
  return (await request<{ result: T }>("/api", { name, args })).result;
}
export const loadLocale = () =>
  request<{ locale: Locale | null }>("/preferences");
export const saveLocale = (locale: Locale) =>
  request<{ locale: Locale }>("/preferences", { locale });
export async function subscribe(
  onGame: (game: GameView) => void,
  onConnected: (value: boolean) => void,
  signal: AbortSignal,
) {
  while (!signal.aborted) {
    try {
      const response = await fetch("/events", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      if (!response.ok || !response.body) throw new Error("Connection failed.");
      onConnected(true);
      const reader = response.body.getReader(),
        decoder = new TextDecoder();
      let buffer = "";
      while (!signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let end: number;
        while ((end = buffer.indexOf("\n\n")) !== -1) {
          const event = buffer.slice(0, end);
          buffer = buffer.slice(end + 2);
          if (event.startsWith("data: "))
            onGame(JSON.parse(event.slice(6)) as GameView);
        }
      }
    } catch {
      /* Reconnect with a complete server snapshot. */
    }
    onConnected(false);
    if (!signal.aborted)
      await new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timer);
          signal.removeEventListener("abort", done);
          resolve();
        };
        const timer = setTimeout(done, 1200);
        signal.addEventListener("abort", done, { once: true });
      });
  }
}
export function downloadPgn(pgn: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([pgn], { type: "application/x-chess-pgn;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
