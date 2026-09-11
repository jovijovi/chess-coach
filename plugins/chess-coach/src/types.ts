export type Color = "w" | "b";
export type Difficulty = "easy" | "medium" | "hard";
export type MoveInput = {
  from: string;
  to: string;
  promotion?: "q" | "r" | "b" | "n";
};
export type Version = { gameId: string; expectedRevision: number };
export type SavedGame = {
  gameId: string;
  revision: number;
  startFen: string;
  moves: string[];
  playerColor: Color;
  difficulty: Difficulty;
  createdAt: string;
};
export type MoveRecord = MoveInput & {
  san: string;
  uci: string;
  color: Color;
  piece: string;
};
export type GameView = Omit<SavedGame, "moves"> & {
  fen: string;
  moves: MoveRecord[];
  turn: Color;
  legalMoves: MoveInput[];
  board: ({ square: string; type: string; color: Color } | null)[][];
  status:
    | "playing"
    | "checkmate"
    | "stalemate"
    | "insufficient"
    | "repetition"
    | "fifty_moves"
    | "draw";
  result: "*" | "1-0" | "0-1" | "1/2-1/2";
  check: boolean;
  phase: "player_turn" | "engine_thinking" | "engine_error" | "finished";
  engineError: string | null;
  canUndo: boolean;
  pgn: string;
};
export type EngineLine = {
  rank: number;
  depth: number;
  score: { type: "cp" | "mate"; value: number };
  pv: string[];
};
export type EngineSearch = {
  fen: string;
  moves: string[];
  skill: number;
  budget: number;
  multiPv: number;
};
export interface Engine {
  search(
    request: EngineSearch,
    signal: AbortSignal,
  ): Promise<{ bestMove: string; lines: EngineLine[] }>;
}
export type Analysis = {
  gameId: string;
  revision: number;
  ply: number;
  fen: string;
  turn: Color;
  historical: boolean;
  lines: {
    rank: number;
    depth: number;
    whiteScore: EngineLine["score"];
    uci: string[];
    san: string[];
  }[];
};
export class GameError extends Error {
  constructor(
    public code: string,
    message: string,
    public current?: GameView,
  ) {
    super(message);
  }
}
export const DIFFICULTIES = {
  easy: { skill: 0, budget: 200 },
  medium: { skill: 5, budget: 500 },
  hard: { skill: 10, budget: 1000 },
};
