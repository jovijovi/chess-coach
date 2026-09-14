---
name: chess-coach
description: Play international chess with a local interactive board, resume the current game, execute a requested move or undo, or explain a position in the Chess Coach game using Stockfish analysis.
---

# Chess Coach

Respond in the user's requested language, English or Chinese. MCP tool descriptions and diagnostics are English; translate their meaning for the user. Use the plugin's MCP tools. The browser board and these tools share one current game on this computer; the engine automatically plays the opponent.

## Open or resume

Call `show_board`. Open its returned URL in Codex's in-app browser using `open_in_codex` (browser target) or `cua.createBrowserTab("iab", url, { visible: true })`. Keep the returned URL intact because its fragment grants access to the local game. If neither browser opener is available, give the user a clickable URL.

Opening resumes the saved game. Call `new_game` only when the user asks to start over. If replacing a game with moves, offer to export its PGN unless the user already specified the disposition.

## Play and undo

1. Call `get_game` for the latest `gameId`, `revision`, `phase`, and `legalMoves`.
2. Resolve the user's move to `from`, `to`, and optional `promotion` using those legal moves. Ask only when the move or promotion remains ambiguous.
3. Call `make_move` with `expectedRevision` equal to the observed `revision`. The server schedules the engine reply; wait for the player turn before another user move. `undo_turn` cancels an unfinished search or removes the user's move plus the engine reply.
4. On `STALE_STATE`, read the returned current state. Reassess the user's request against it; avoid blindly repeating a mutation. On `engine_error`, report the saved position and use `retry_engine` when the user asks to retry.

## Explain a position

1. Read `get_game`. Determine which half-move (`ply`) the user means: 0 is the initial position; each individual white or black move increments it by one.
2. Call `analyze_position` with the current game identity/version and the selected ply. For a question about a played move, analyze both the position before it and the position after it.
3. Explain using the returned legal SAN variations. `whiteScore.type=cp` is centipawns from White's perspective; positive favors White. `type=mate` is signed mate distance from White's perspective, not a centipawn score. The player may be Black.
4. State the analyzed move/position. Distinguish concrete engine variations from strategic interpretation. If the live board has changed, label the analysis historical. If analysis was cancelled, obtain the new state before retrying.

The board's localized “Give me a hint” button offers engine moves only. Coaching stays in this Codex conversation; ordinary browser pages cannot directly send messages here. No separate API key is needed for this workflow.

## Persistence

Only the current game is retained. `export_pgn` returns its exact PGN, filename, and an authenticated local download page. Scores are engine estimates, and difficulty labels are not calibrated ratings. This casual game automatically draws on threefold repetition and the fifty-move condition.

## UI language

The board supports English and Simplified Chinese through its language selector. The choice is saved separately from the game and survives service restarts. Switching UI language changes neither the position nor PGN. Use the conversation language for coaching even when it differs from the board language.

## Installation and recovery

This release uses a local stdio MCP launched by Node.js 26+ from a complete
Codex-managed package. Linux x64 and macOS x64/arm64 share the same game-data
location, `~/.local/share/chess-coach/`. No remote MCP or separate API key is used.

For installation, manual upgrades, personal-plugin migration, removal, or an
older-Node diagnostic, read the package's [English guide](../../README.md) or
[Chinese guide](../../README.zh-CN.md). Use the user's language when explaining
those steps. Native `codex plugin add` prints the installed package path;
`scripts/launch.mjs doctor` there reports version, integrity, and service status.
After upgrades, start a new task. Keep the game database and language preference
when cleaning runtime files; close old chess tasks before intentional rollback.
