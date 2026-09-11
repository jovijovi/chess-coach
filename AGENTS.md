# Repository Guidelines

## Project Structure & Module Organization

- `plugins/chess-coach/src/` contains game rules, persistence, preferences, engine integration, HTTP/SSE, and MCP. Keep state transitions in `game.ts` and shared operation schemas in `operations.ts`.
- `plugins/chess-coach/ui/` contains React components, API access, and styles. `ui/locales/` owns English and Chinese display strings.
- Plugin metadata lives in `.codex-plugin/plugin.json`; agent instructions live in `skills/chess-coach/SKILL.md`, inside the plugin directory.
- `scripts/` handles build, development, and installation. `tests/` holds Vitest suites; `tests/browser/` holds Playwright suites.
- `plugins/chess-coach/dist/` contains generated bundles and engine assets. Keep dependencies, build products, and `output/` artifacts out of commits.

## Build, Test, and Development Commands

Use Node.js 26+ from the repository root.

- `npm ci`: install locked dependencies.
- `npm run dev`: build an isolated game and print its URL; no hot reload.
- `npm run build`: bundle frontend/backend and engine resources.
- `npm run typecheck`: check TypeScript.
- `npm test`: run Vitest; build first for integration tests.
- `npm run test:browser`: run Chromium tests in both languages.
- `npm run check`: typecheck, build, and run all tests.
- `npm run format`: apply Prettier.
- `npm run install:local -- --dry-run`: preview personal installation paths.

## Coding Style & Localization

Use strict TypeScript, ES modules, two-space indentation, double quotes, semicolons, and Prettier. Follow camelCase functions, PascalCase types/components, lowercase filenames, and existing backend `.js` import extensions. No lint command exists.

Write comments, developer explanations, diagnostics, and MCP descriptions in English. Keep UI copy in typed locale dictionaries, including errors and accessibility labels. Return stable error codes from the service. Keep `AGENTS.md` English-only for AI readers. For project changes, update `README.md` and other affected documentation, including all language editions, in the same change. Keep code-example comments English.

## Testing Guidelines

Use `*.test.ts` for Vitest and `tests/browser/*.spec.ts` for Playwright. No coverage percentage is enforced. Add behavioral tests for changed rules, cancellation, recovery, locale fallback/persistence, and translated interactions. Run `npm run check` for code changes. Tests require subprocesses and loopback access; override Chromium with `CHESS_COACH_CHROME`.

## Commit & Pull Request Guidelines

Use imperative subjects, e.g. `Add persistent language selection`. Keep commits focused. PRs should describe behavior, link issues, report checks, include UI screenshots, and explain installation or persistence impacts.

## Agent & Configuration Notes

When `.codegraph/` exists, use `codegraph_explore` or `codegraph explore` before reading indexed code. Isolate experiments with `CHESS_COACH_DATA_DIR`. Preserve saved games, preferences, loopback authentication, revision checks, and engine licenses. Keep tokens out of commits.
