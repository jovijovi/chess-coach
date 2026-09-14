# Chess Coach 0.2.0 Stable Acceptance

English | [Simplified Chinese](STABLE-ACCEPTANCE.zh-CN.md)

Date: 2026-09-14. The repository is public and stable 0.2.0 is published.
GitHub Release titles, descriptions, and tag annotations are English.
Translated documentation remains available separately.

## Release and evidence

- [Stable Release](https://github.com/jovijovi/chess-coach/releases/tag/v0.2.0)
- [Three-platform checks](https://github.com/jovijovi/chess-coach/actions/runs/34828503526)
- [Stable promotion](https://github.com/jovijovi/chess-coach/actions/runs/34829760817)
- Source commit: `b0d289da970ce34d30f34d2cffbe5230b9f48e48`
- Runtime build: `508aeee53fea35e252e7edb16b1365a887a0ee62ad8d48cb1a66732a22563543`
- Immutable distribution ref: `plugin-v0.2.0`
- Stable catalog: `chess-coach`, from branch `marketplace`

The package and all three platform reports match the source/build identity and
passed the original SHA-256 manifest. Human commits/tags use repository-local
Git identity; generated distribution commits inherit the annotated tagger.

## Results

`npm run check` passed: TypeScript, package/source verification, bilingual docs,
44 Vitest tests, and 13 browser tests. CI additionally passed native Codex and
13 browser tests on each of Ubuntu 24.04 x64, macOS 15 Intel, and macOS 15 Apple
Silicon, using Node.js 26.8.2 and Codex CLI 0.154.0.

Every platform completed eight tools and ten full rounds, checked matching
analysis FEN/revision and legal variations, replayed PGN, recovered after daemon
termination, received full SSE snapshots, and retained data after reinstallation.
Missing Node and Node 22 prerequisite diagnostics were also checked.

An actual RC.2-to-stable upgrade during an engine reply preserved the game,
produced one reply, and allowed the existing MCP session to read the current
runtime. The original personal installation and game were retained.

## Anonymous installation

The public GitHub marketplace was installed and refreshed in a fresh,
filesystem-isolated Linux Codex profile. Account tokens, SSH/askpass credentials,
and system/global Git credential configuration were excluded. The actual
published package then passed another ten-round native test with external
networking blocked, including analysis, restart, SSE, PGN replay, and reinstallation.
The attached report records `anonymousGitHub: true` and the published build ID.

```bash
codex plugin marketplace add jovijovi/chess-coach --ref marketplace
codex plugin add chess-coach@chess-coach
```

The reproducible check is:

```bash
node scripts/run-native-acceptance.mjs output/anonymous-acceptance.json --github
```

Original release artifacts retain `SHA256SUMS`. Additional anonymous/upgrade
reports and these documents have a separate supplemental checksum file.
No game databases, preferences, authentication tokens, or service logs are uploaded.

## Verification scope

Native evidence uses real CLI/app-server APIs and engine results. Signed-in
desktop model conversations were not run on every platform. Automated checks
validate the position and legal analysis supplied to Codex; they do not grade
natural-language explanations. The handbook remains English by default and
supports Simplified Chinese. MCP, the engine, and saved games remain local.
