import { en, type MessageKey } from "./locales/en";
import { zhCN } from "./locales/zh-CN";
export type Locale = "en" | "zh-CN";
export const dictionaries = { en, "zh-CN": zhCN };
export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-CN";
}
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    if (/^zh(?:-|$)/i.test(language)) return "zh-CN";
    if (/^en(?:-|$)/i.test(language)) return "en";
  }
  return "en";
}
export function translate(
  locale: Locale,
  key: MessageKey,
  values: Record<string, string | number> = {},
): string {
  return dictionaries[locale][key].replace(
    /\{(\w+)\}/g,
    (placeholder, name: string) => String(values[name] ?? placeholder),
  );
}
export const pieceKeys: Record<string, MessageKey> = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king",
};
const errorKeys: Record<string, MessageKey> = {
  FORBIDDEN: "errorForbidden",
  UNAUTHORIZED: "errorUnauthorized",
  INVALID_INPUT: "errorInvalidInput",
  METHOD: "errorInvalidInput",
  CONTENT_TYPE: "errorInvalidInput",
  TOO_LARGE: "errorInvalidInput",
  NOT_FOUND: "errorNotFound",
  STALE_STATE: "errorStaleState",
  WRONG_TURN: "errorWrongTurn",
  INVALID_MOVE: "errorIllegalMove",
  ILLEGAL_MOVE: "errorIllegalMove",
  NOTHING_TO_UNDO: "errorNothingToUndo",
  ENGINE_BUSY: "errorEngineBusy",
  INVALID_PLY: "errorInvalidPly",
  ANALYSIS_CANCELLED: "errorAnalysisCancelled",
  ANALYSIS_FAILED: "errorAnalysisFailed",
  CONNECTION: "errorConnection",
  PREFERENCE_SAVE: "errorPreference",
};
export function errorKey(error: unknown): MessageKey {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  )
    return errorKeys[error.code] ?? "errorUnexpected";
  return "errorUnexpected";
}
