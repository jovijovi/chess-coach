# Chess Coach

<img src="plugins/chess-coach/assets/logo.svg" width="112" height="112" alt="Chess Coach: an ivory knight with an upright mane, framed in antique gold" />

English | [简体中文](README.zh-CN.md) · [Handbook](https://jovijovi.github.io/chess-coach/)

Play Stockfish on an interactive board in Codex's in-app browser and discuss the
actual position in the conversation. The English/Chinese UI supports dragging,
clicking, keyboard moves, legal destinations, promotion, hints, undo, board
flipping, automatic saves, and PGN export.

## Release status and requirements

Latest private preview: [0.2.0-rc.2](https://github.com/jovijovi/chess-coach/releases/tag/v0.2.0-rc.2). See the [acceptance record](release/ACCEPTANCE.md) for three-platform results and verification scope.

**0.2.0 is in private RC testing.** The repository stays private until the owner
approves public access. The documentation website is public and defaults to
English. Stable-channel commands below apply after the stable release is promoted.

Supported targets: Linux x86_64, macOS Intel, and macOS Apple Silicon. Install
**Node.js 26+** and make `node` available to Codex. The compatibility baseline is
**Codex CLI 0.154.0**. Windows, Linux ARM, remote MCP, automatic upgrades, npm
publication, and official-directory submission are outside this release.

Users install a complete bundle: no compilation, project dependencies, Python,
`flock`, or separate installation script. Installation needs network access;
the installed board, MCP, rules, engine, and saves work locally without it.
Conversation with the Codex model still uses the Codex service and account.

## Install through Codex

For authorized private testers, after the RC has been promoted:

```bash
# Authenticate Git for the private repository if necessary.
gh auth login
gh auth setup-git
codex plugin marketplace add jovijovi/chess-coach --ref marketplace-preview
codex plugin add chess-coach@chess-coach-preview
```

For the stable release, after publication:

```bash
codex plugin marketplace add jovijovi/chess-coach --ref marketplace
codex plugin add chess-coach@chess-coach
```

Start a **new Codex task** and ask “Open the chessboard”, “Continue my saved game”,
or “Explain my last move”. Codex opens the URL returned by `show_board`. Its
fragment authorizes the local page; keep it intact and out of shared logs.

The package contains portable `plugin.json` and `mcp.json`, the compatibility
`.codex-plugin/plugin.json`, and all runtime resources. Codex owns registration
and caches. The launcher verifies its resources and prepares a stable runtime
without downloading an engine.

## Upgrade, migration, and removal

Manual stable upgrade:

```bash
codex plugin marketplace upgrade chess-coach
codex plugin add chess-coach@chess-coach
```

For RCs, replace both marketplace names with `chess-coach-preview`. Start a new
Codex task after upgrading. A newer runtime cannot be overwritten by an older
cached plugin. Different builds of the same version are rejected: publish a new
RC number instead of reusing a release version.

**One-time migration from `chess-coach@personal`:** close old chess tasks, stop
the old service, and remove only this plugin. The commands below preserve the
saved game, language preference, and every other personal-marketplace entry.

```bash
node ~/.local/share/chess-coach/runtime/control.js stop
codex plugin remove chess-coach@personal
# Preserve a copy of the legacy runtime if a migration rollback may be needed.
cp -R ~/.local/share/chess-coach/runtime ~/.local/share/chess-coach/runtime-0.1-backup
```

Install the preview through Codex. Before opening its first board, run
`node <installed-plugin>/scripts/launch.mjs clean-runtime` using the absolute
installed-plugin path printed by `codex plugin add`, then start a new task.
The new launcher refuses to silently replace an unidentified legacy runtime.
It can read the existing game format. Keep the legacy backup until verified.

For normal removal, close chess tasks, stop the service, then run
`codex plugin remove chess-coach@chess-coach` (or the preview/local identifier).
Uninstallation retains your game and language. To remove runtime files too,
run `node ~/.local/share/chess-coach/runtime/control.js clean-runtime` **before**
uninstalling. That command retains `state.db` and `preferences.json`.

Every promoted release has an immutable `plugin-vVERSION` Git reference. For a
manual rollback, close tasks, stop the service, remove the installed plugin,
clean its runtime with the selected package's launcher, and remove only that
marketplace registration. Re-add this repository with `--ref plugin-vVERSION`
and install the catalog's plugin. Choose an existing immutable ref from its Release; RC refs contain
`chess-coach@chess-coach-preview`. Only roll back to a version documented as
compatible with the current save format; all 0.2.0 RCs use the existing format.
Never restore an old database over a newer game.

## Local data and recovery

All three platforms use `~/.local/share/chess-coach/`:

| Path                                    | Purpose                                        |
| --------------------------------------- | ---------------------------------------------- |
| `state.db`                              | Single saved game, including full move history |
| `preferences.json`                      | UI language choice                             |
| `runtime/`                              | Verified active runtime files                  |
| `activation-lock.db`, `service-lock.db` | Separate SQLite process leases                 |
| `server.json`, `service.log`            | Private service metadata and diagnostics       |

Activation and service leases use Node's built-in SQLite; the OS releases them
on a crash. The game database is independent. Updates stage and verify files,
stop the service, switch runtime directories, and health-check the replacement.
A failed activation restores previous files without reverting or deleting games.
An interrupted switch is recovered on the next launch.

```bash
node ~/.local/share/chess-coach/runtime/control.js doctor
node ~/.local/share/chess-coach/runtime/control.js stop
```

`doctor` reports paths, platform, version, build ID, integrity, and service status
without exposing the access token. `CHESS_COACH_DATA_DIR` isolates direct CLI
launches and tests. Codex may filter inherited environment variables; for a
custom directory, explicitly configure this variable in the MCP environment.
Keep the same setting for every task and control command.

If the engine fails, your move remains saved; use Retry. If the service restarts,
ask Codex to reopen the board. SSE reconnects with full state snapshots. Corrupt
databases produce an error instead of silently starting a new game. Inspect
`service.log`; do not commit or publish data, tokens, preferences, or logs.

## Languages and game behavior

The UI follows the first supported browser language, falling back to English.
Use its selector to choose English or Simplified Chinese; the choice survives
refreshes and restarts without changing the position or PGN. Codex explains in
the conversation language. Source comments, diagnostics, MCP descriptions, and
plugin configuration are English. Keep every affected language edition of the
README, website, and other documentation synchronized. `AGENTS.md` is English-only.

The default is White/Medium. Easy, Medium, and Hard use Stockfish Skill Level
0/5/10 with 200/500/1000 ms per move, without claiming calibrated ratings.
Hints use independent analysis settings. Scores are from White's perspective;
mate distance is distinct from centipawns. Undo removes your previous move and
the engine reply, or cancels the pending reply. Playing Black preserves the
engine's opening move. This casual mode automatically draws on threefold
repetition and the fifty-move condition. Export PGN before replacing the one save slot.

Eight shared MCP tools: `show_board`, `get_game`, `new_game`, `make_move`,
`undo_turn`, `retry_engine`, `analyze_position`, and `export_pgn`. Mutations and
analysis retain their existing `gameId`/`expectedRevision` contracts. Analysis
includes FEN, revision, half-move `ply`, and legal variations, so coaching can
identify the actual analyzed position. The service binds only to `127.0.0.1`
and checks authentication tokens, request origins, and stale revisions.

## Development and release engineering

```bash
npm ci
npm run dev                    # Isolated game in output/dev-data; no hot reload
npm run build                  # Frontend, backend, and pinned engine
npm run package                # Complete marketplace, archive, SHA256SUMS, sources.json
npm run typecheck
npm test                       # Build the package first for installation tests
npm run test:browser            # Chromium interactions in both languages
npm run check                  # Typecheck, package, docs, Vitest, and Playwright
npm run install:local -- --dry-run
npm run install:local          # Native Codex install in chess-coach-local
npm run docs:build             # Default English site; Chinese at /zh-CN/
npm run docs:preview           # Local preview at http://127.0.0.1:4174
```

Playwright uses installed Chrome when present, otherwise its managed Chromium;
set `CHESS_COACH_CHROME` to override. Tests need subprocess and loopback access.
`npm run package` obtains pinned corresponding-source materials on first use
and caches them in `output/vendor/`; release packaging fails if verification fails.
Generated output, dependencies, and personal data stay out of source commits.

The [release guide](release/README.md) describes annotated source tags, the
three-platform acceptance matrix, Draft Releases, manual channel promotion,
immutable refs, and the public-access gate. Main pushes may update
[GitHub Pages](.github/workflows/pages.yml), but **never release a plugin version**.
Human commits/tags use repository-local Git identity; generated release commits
inherit the annotated tag's publisher. See [AGENTS.md](AGENTS.md) for contributors.

## License and artwork

Original code, documentation, and the classical knight logo use
[Apache License 2.0](LICENSE); see [NOTICE](NOTICE).
[Third-party notices](THIRD_PARTY_NOTICES.md) explain dependencies. Stockfish
18.0.8 retains GPL-3.0. Packages include full dependency license texts and
[corresponding source and build material](release/STOCKFISH-SOURCE.md), with
pinned JS/WASM/network hashes in `release/stockfish.json`.

The Linux CI runner uses a temporary AppArmor profile for its dedicated namespace
test executable. See the release guide for runner setup.
