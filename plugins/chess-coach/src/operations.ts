import { z } from "zod";
import { GameService } from "./game.js";
export const versionShape = {
  gameId: z.string().uuid(),
  expectedRevision: z.number().int().nonnegative(),
};
export const operations = {
  get_game: {
    description:
      "Read the current game, including its version, history, legal moves, and engine status.",
    shape: {},
  },
  show_board: {
    description:
      "Resume the current game and return its URL for the Codex in-app browser.",
    shape: {},
  },
  new_game: {
    description:
      "Replace the current game. Read its latest version and act only on an explicit request for a new game.",
    shape: {
      ...versionShape,
      playerColor: z.enum(["w", "b"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
    },
  },
  make_move: {
    description:
      "Play the move explicitly requested by the user and schedule the engine reply. Use the latest game version.",
    shape: {
      ...versionShape,
      from: z.string().regex(/^[a-h][1-8]$/),
      to: z.string().regex(/^[a-h][1-8]$/),
      promotion: z.enum(["q", "r", "b", "n"]).optional(),
    },
  },
  undo_turn: {
    description:
      "Undo to the position before the previous human turn and cancel any pending engine search.",
    shape: versionShape,
  },
  retry_engine: {
    description: "Retry a failed engine reply from the saved position.",
    shape: versionShape,
  },
  analyze_position: {
    description:
      "Analyze the selected half-move (ply; 0 is the initial position). Return White-perspective scores, legal variations, and the position version without changing the game.",
    shape: { ...versionShape, ply: z.number().int().nonnegative().optional() },
  },
  export_pgn: {
    description: "Return the current game PGN and local download information.",
    shape: {},
  },
};
export type Operation = keyof typeof operations;
export async function dispatch(
  game: GameService,
  name: Operation,
  args: unknown,
  boardUrl: string,
) {
  // Each branch uses the same schema that is exposed through MCP.
  switch (name) {
    case "get_game":
      z.object({}).strict().parse(args);
      return game.view();
    case "show_board":
      z.object({}).strict().parse(args);
      return { ...game.view(), url: boardUrl };
    case "new_game":
      return game.newGame(
        z.object(operations.new_game.shape).strict().parse(args),
      );
    case "make_move":
      return game.makeMove(
        z.object(operations.make_move.shape).strict().parse(args),
      );
    case "undo_turn":
      return game.undo(
        z.object(operations.undo_turn.shape).strict().parse(args),
      );
    case "retry_engine":
      return game.retry(
        z.object(operations.retry_engine.shape).strict().parse(args),
      );
    case "analyze_position":
      return game.analyze(
        z.object(operations.analyze_position.shape).strict().parse(args),
      );
    case "export_pgn": {
      z.object({}).strict().parse(args);
      const { gameId, revision, pgn } = game.view();
      return {
        gameId,
        revision,
        pgn,
        filename: `chess-coach-${gameId.slice(0, 8)}.pgn`,
        url: boardUrl.replace("/#", "/export#"),
      };
    }
  }
}
