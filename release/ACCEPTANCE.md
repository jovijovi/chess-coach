# Chess Coach 0.2.0-rc.2 Acceptance

English | [简体中文](ACCEPTANCE.zh-CN.md)

Date: 2026-09-14. Status: **published private preview**. Repository visibility
remains private. Stable publication and anonymous installation await the owner's
public-access decision.

## Release identity

- [Release and original artifacts](https://github.com/jovijovi/chess-coach/releases/tag/v0.2.0-rc.2)
- [Three-platform workflow](https://github.com/jovijovi/chess-coach/actions/runs/34819394335)
- [Channel promotion](https://github.com/jovijovi/chess-coach/actions/runs/34820343425)
- Source: `cc81888cf5288d32b74a3304fd995122aa0a9a05`
- Distribution commit: `cc8258ebaf1e70256fd26f868bc963623e4557c1`
- Immutable ref: `plugin-v0.2.0-rc.2`
- Build ID: `ce3d4fd6dc2183c2ad8fdf83d7a7c30d4cd5a1e53a16da7c064fd0809f9dbc6d`

Source commits/tags and the generated distribution commit use
`jovijovi <1058245+jovijovi@users.noreply.github.com>`, taken from repository-local
Git configuration and then the annotated publisher tag. All original release
artifacts and three reports passed SHA-256 verification and match this source/build.

## Automated results

The complete `npm run check` passed: TypeScript, packaging/source verification,
bilingual documentation, **44 Vitest tests**, and **13 browser tests**.

| Native runner          | Node / Codex     | Tools / full rounds | Offline | Browser tests |
| ---------------------- | ---------------- | ------------------- | ------- | ------------- |
| Ubuntu 24.04 x64       | 26.8.2 / 0.154.0 | 8 / 10              | Passed  | 13 passed     |
| macOS 15 Intel         | 26.8.2 / 0.154.0 | 8 / 10              | Passed  | 13 passed     |
| macOS 15 Apple Silicon | 26.8.2 / 0.154.0 | 8 / 10              | Passed  | 13 passed     |

Each native run used real Codex marketplace installation and stdio tool calls,
verified analysis FEN/revision and legal variations, replayed exported PGN,
recovered from daemon termination, received SSE snapshots, and retained the game
and language after removal/reinstallation. Missing Node was diagnosed by Codex;
Node 22 produced the launcher prerequisite message. Python/flock execution and
external networking were blocked during the native local-game check.

Lifecycle tests cover simultaneous first activation, process-lease release after
crash, cache paths containing spaces/non-ASCII characters, cache relocation,
upgrade during an engine reply, older cached sessions, corrupt resources,
failed-activation rollback, interrupted directory switching, and data retention.

RC.1 was correctly blocked by its Linux isolation failure. RC.2 uses a temporary
AppArmor profile for the dedicated CI test executable; all three targets passed.
The RC.1 source tag was retained unchanged.

## Additional local verification

- The private GitHub source `jovijovi/chess-coach --ref marketplace-preview` was
  added through Codex using existing GitHub authentication in a disposable profile.
  The installed GitHub package then passed another offline ten-round native run,
  including analysis, restart, PGN, and reinstallation.
- Native marketplace refresh/reinstall and installation from `plugin-v0.2.0-rc.2` passed in a disposable profile. Private Git transfers were slow during retries; the lifecycle check used HTTP/1.1 and bounded transfer waits.
- An isolated copy of the existing 0.1.0 save passed legacy-runtime gating,
  runtime cleanup, full-history recovery, language-preference retention, and PGN
  replay. The original game and personal installation were retained.
- English/Chinese handbook layouts were inspected at desktop and mobile widths.
  Chapter-preserving language links, search for the new cleanup command, and
  Escape dismissal were checked. The site continues to default to English.

## Evidence scope and remaining release steps

Native Codex evidence uses CLI/app-server APIs and real engine results. Per-platform
signed-in desktop model conversations were not run. The automated coaching checks
verify the position, revision, score representation, and legal variations supplied
to the conversation; they do not grade generated natural-language explanations.

The repository remains private. After the owner's explicit public-access decision,
prepare and promote stable `v0.2.0`, then verify installation without GitHub
credentials. The preview does not perform automatic upgrades, publish to npm,
register a remote MCP, or submit to the official directory.
