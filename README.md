# Chess Coach

<img src="plugins/chess-coach/assets/logo.svg" width="112" height="112" alt="Chess Coach logo: an ivory knight with a short upright mane on a classical pedestal, framed in antique gold" />

English | [中文](README.zh-CN.md)

Play Stockfish on an interactive chessboard in Codex's in-app browser and discuss the actual position in your Codex conversation. The interface supports English and Simplified Chinese, drag-and-drop, click and keyboard moves, legal destinations, promotion, hints, undo, board flipping, automatic saves, and PGN export.

## Repository and license

The project is maintained in the private GitHub repository [jovijovi/chess-coach](https://github.com/jovijovi/chess-coach). Repository access requires GitHub authorization. Original project code and documentation are licensed under [Apache License, Version 2.0](LICENSE); see [NOTICE](NOTICE) for attribution and [third-party notices](THIRD_PARTY_NOTICES.md) for dependency licenses. Stockfish remains GPLv3.

To obtain an authorized checkout using GitHub CLI:

```bash
gh auth login
gh repo clone jovijovi/chess-coach
cd chess-coach
```

## Local installation

Requirements: Linux x86_64, Node.js 26+, npm, `/usr/bin/flock`, and Codex's installed `plugin-creator` system skill. The installer uses `/usr/bin/python3` with PyYAML; override it with `CHESS_COACH_PYTHON` if necessary.

```bash
npm ci
npm run build
npm run install:local -- --dry-run
npm run install:local
```

Installation adds the plugin to your personal marketplace and runs `codex plugin add`. The default personal marketplace needs no separate registration. Start a **new Codex task** and ask:

> Open the chessboard.

The MCP launcher starts the local service automatically. Codex opens the returned URL, whose fragment authorizes access to the local game. No Vite server or manual background startup is required.

- “Continue my game”: resume the single saved game.
- “Move the knight to f3”: validate your move and let the engine reply.
- “Explain my last move”: analyze the relevant position in the conversation.
- **Give me a hint**: show the engine's suggested move and variation on the board.

Downloading dependencies initially requires networking. Once installed, the board, rules, engine, and storage run locally. Coaching uses your existing Codex account, without a separate OpenAI API key.

## Languages

On first use, the UI selects the first supported browser language: `en` or `zh-CN`. Chinese browser variants use Simplified Chinese; unsupported languages fall back to English. Use the language selector to switch at any time. Buttons, dialogs, game states, errors, accessibility labels, and the page title update together.

An explicit choice is saved separately in `preferences.json`, so it survives refreshes and service restarts even when the local port changes. Switching languages does not change the position, game version, or PGN. A new browser page uses the saved preference; pages already open keep their current language until changed or reloaded. Codex explains positions in the language you request.

User-facing translations live in `plugins/chess-coach/ui/locales/`. Keep both dictionaries complete. Code comments, developer documentation within source files, MCP descriptions, diagnostics, and CLI output are English; the UI translates stable error codes. Plugin configuration files, including manifest descriptions and default prompts, are written in English. The chessboard UI continues to support both English and Chinese.

This README and [third-party notices](THIRD_PARTY_NOTICES.md) have English and Chinese editions. The available [plugin skill guide](plugins/chess-coach/skills/chess-coach/SKILL.md) is in English. The legal `LICENSE` and `NOTICE` texts are kept in English. [AGENTS.md](AGENTS.md) is an English-only guide for AI readers. Whenever the project changes, update this README and other affected documentation, including every language edition, in the same change. Keep descriptions, commands, configuration, and examples aligned with the implementation. Generated acceptance records are historical artifacts, not maintained documentation.

## Game behavior

The default is White against Medium difficulty. Easy, Medium, and Hard use Skill Level 0 / 5 / 10 and search budgets of 200 / 500 / 1000 ms. These labels are not calibrated ratings. Hints use stronger, separate analysis settings. Scores are from White's perspective; positive favors White. Mate distances are distinct from centipawn scores.

Undo returns to the position before your previous turn. It removes your move and the engine reply, or cancels a pending search and removes your move. When playing Black, it preserves the engine's opening move.

There is one save slot. Export PGN before starting over if you want to keep the old game; there is no history library. This is untimed casual chess: threefold repetition and the fifty-move condition are automatic draws, unlike tournament workflows that require a claim.

## Development and validation

```bash
npm run dev           # Build an isolated game in output/dev-data and print its URL
npm run typecheck     # Check TypeScript
npm run build         # Prepare bundles before integration tests
npm test              # Run rules, engine, MCP, localization, and installation tests
npm run test:browser  # Exercise both UI languages in Chromium
npm run check         # Run all checks in dependency order
```

Tests require subprocesses and access to `127.0.0.1`. Run them in an environment that permits both. Playwright defaults to `/opt/google/chrome/chrome`; override it with `CHESS_COACH_CHROME`. Screenshots and traces are written under `output/playwright/`.

MCP and installation tests use built bundles, so build before `npm test`. `npm run dev` rebuilds on each invocation; it does not provide hot reload. See [AGENTS.md](AGENTS.md) for contributor conventions.

## Data, lifecycle, and updates

- Game database: `~/.local/share/chess-coach/state.db`, retaining the full move history.
- Language preference: `~/.local/share/chess-coach/preferences.json`.
- Installed runtime: `~/.local/share/chess-coach/runtime/`.
- Personal plugin source: `~/plugins/chess-coach/`; the cached plugin points to the stable runtime.
- Logs and service discovery files share the data directory. Override `CHESS_COACH_DATA_DIR` for isolated development and tests.

System `flock` ensures one service per data directory. MCP sessions and browser pages share this service. It listens only on loopback, validates tokens and request origins, and sends full snapshots when SSE reconnects. Version checks reject repeated or stale mutations.

```bash
npm run stop          # Stop the default service while retaining saves and preferences
npm run open          # Print the default board URL and current position
CHESS_COACH_DATA_DIR="$PWD/output/dev-data" npm run stop
```

After changes, run `npm run build` and `npm run install:local`. Installation stops the old service, copies the runtime, updates its version using plugin-creator's cachebuster helper, and reinstalls the plugin. The database and preferences are outside the runtime directory and survive updates. Start a new Codex task to load updated skills and tools.

If the engine fails, the saved position remains available and the board offers a retry. If the service disconnects, reopen the board through Codex. Database corruption causes an error instead of silently clearing your game; inspect `service.log` in the data directory.

## Architecture and tools

React, TypeScript, Vite, and react-chessboard provide the UI. Node HTTP/SSE serves it, chess.js validates moves, and Stockfish 18 lite single-threaded WASM runs in a separate process. All runtime assets are bundled locally.

MCP tools: `show_board`, `get_game`, `new_game`, `make_move`, `undo_turn`, `retry_engine`, `analyze_position`, and `export_pgn`. Mutations carry `gameId` and `expectedRevision`. Analysis uses a half-move `ply` (0 means the initial position) and returns the position version, FEN, and legal SAN variations. Authenticated `GET /preferences` and `POST /preferences` manage the UI language separately from the game.

This local version does not include inline MCP Apps, online opponents, model calls inside the board, or public distribution tooling.

## Logo

The original [SVG logo](plugins/chess-coach/assets/logo.svg) depicts an ivory knight with a short upright mane on a Roman-inspired stepped pedestal, with an antique gold frame on deep green. Compact tufts rise directly from the back of the neck, forming a continuous silhouette. Its simple shapes and restrained architectural details remain legible at icon sizes. It scales without fonts or external images and is used for the plugin logo in both themes and the composer icon. The local installer copies `plugins/chess-coach/assets/` into the installed plugin.

## Third-party components

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the runtime dependency license summary.

Stockfish.js 18.0.8 © Chess.com, LLC and Stockfish contributors, GPL-3.0. Builds retain the engine copyright header and `engine/COPYING`. Corresponding source: [Stockfish.js](https://github.com/nmrugg/stockfish.js). Other dependency licenses remain in their npm packages.
