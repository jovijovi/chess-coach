# Releasing Chess Coach 0.2.0

English | [简体中文](README.zh-CN.md)

The owner has made the repository public. Prepare stable 0.2.0 through the same
annotated-tag, three-platform-check, draft, and manual-promotion workflow used for
the RCs. GitHub Release titles, descriptions, and tag annotations must be English.
Keep English and Chinese user documentation as separate editions.

## Prepare a candidate

1. Set the same `0.2.0-rc.N` version in root `package.json`, its lockfile, and both
   plugin manifests. Use a new RC number for each candidate; never replace tags.
2. Update both READMEs, the handbook locales, relevant skill explanations, and
   English-only `AGENTS.md`. Run `npm run check`.
3. Inspect `git config --local user.name` and `git config --local user.email`.
   Use those values for both author and committer when committing and creating
   an **annotated** `v0.2.0-rc.N` tag. Do not rely on global identity.
4. Push the source commit and tag. The tag triggers `release.yml`; ordinary main
   pushes only affect eligible documentation deployment, not plugin releases.

`npm run package` builds `output/release/marketplace/`, a deterministic tar.gz,
`SHA256SUMS`, and `sources.json`. Packaging uses an explicit file allowlist;
no databases, preferences, service logs, host paths, or machine configuration
are included. Source commit, build ID, locked dependency versions/integrities,
engine hashes, source archive, and NNUE network are recorded. Production
license texts, Apache-2.0, and Stockfish GPL/source materials accompany the bundle.
Missing or mismatched source materials block packaging. See
[Stockfish source details](STOCKFISH-SOURCE.md).

## Automated acceptance

The build job checks TypeScript, packaging, documentation, Vitest, and Chromium.
The same archive then runs on `ubuntu-24.04`, `macos-15-intel`, and `macos-15`.
Every target installs the pinned native Codex CLI 0.154.0 and exercises all
8 tools for at least 10 full rounds, checking analysis position/variations,
PGN replay, restart, SSE, and removal/reinstallation data retention. Browser
tests cover both languages on each platform. Node 22 must produce a readable
prerequisite error; missing `node` must be reported by Codex.

Linux acceptance uses a disposable home and network/PID namespaces. macOS runs
only on a disposable CI runner, with a sandbox that blocks external networking.
Python and flock execution is disabled; the plugin runs from a relocated package
without project dependencies. Report JSON omits access URLs, tokens, logs, and
personal paths. The runner uses native Codex app-server APIs; no model account
or fabricated model response is used to pass the tool/position checks. Natural
language coaching remains a separate user-facing manual check.

For a local Linux run after packaging:

```bash
# Use an existing baseline CLI, or omit this override to fetch the pinned binary.
CHESS_COACH_CODEX="$(command -v codex)" node scripts/run-native-acceptance.mjs
```

This requires `bwrap`; that is a test dependency, not a plugin dependency.

## Review and promote

Only after all three targets pass does CI create a **Draft Release**, attaching
the exact archive, checksums, provenance, and three acceptance reports.
Review those artifacts, then manually run **Publish verified plugin release** from `main`, with the tag.
It validates the draft, checks report/build/source identity, and advances only
its channel: `marketplace-preview` for RCs or `marketplace` for stable versions.
The generated commit inherits the annotated source tag's name and email.
The workflow creates an immutable annotated `plugin-vVERSION` reference and
publishes the Release. Verify installation from the promoted GitHub marketplace and record the result. Channel branches contain only generated distribution
files; do not edit them manually. Stable channels reject prereleases.

The public-access decision and private RC checks are complete. Stable publication
now requires the v0.2.0 tag checks and manual promotion, followed by anonymous
installation using the public GitHub marketplace:

```bash
node scripts/run-native-acceptance.mjs output/anonymous-acceptance.json --github
```

On Linux this uses a fresh filesystem-isolated Codex profile, omits account tokens
and SSH/askpass credentials, disables system/global Git credential helpers, installs
and refreshes the public catalog, then blocks external networking for the native
ten-round test. Reports identify anonymous GitHub acceptance explicitly.
Record unexecuted manual checks accurately; automated engine/position checks do not
grade generated model explanations.

## Upgrade, rollback, and migration

User commands are maintained in the root [README](../README.md). Upgrades use
native marketplace refresh and plugin reinstall, followed by a new task.
The runtime preserves the existing save format. Higher versions win; equal
versions with different builds are rejected. Intentional rollback requires
closing tasks, stopping the service, cleaning only runtime files, and installing
a compatible immutable reference. Never overwrite a newer database with a backup.

Legacy `personal` users remove only `chess-coach@personal`, preserve a runtime
backup, and clean the legacy runtime with the newly installed launcher before
activation. Native uninstall leaves games and language preferences on disk.

Ubuntu 24.04 CI grants user-namespace access to a dedicated copy of bwrap through
a temporary AppArmor profile, then removes it after native acceptance. See
[Ubuntu namespace restrictions](https://documentation.ubuntu.com/security/security-features/privilege-restriction/apparmor/).

Historical RC evidence: [0.2.0-rc.2 acceptance record](ACCEPTANCE.md).

Stable [0.2.0 acceptance](https://github.com/jovijovi/chess-coach/blob/main/release/STABLE-ACCEPTANCE.md) includes anonymous GitHub installation and offline native verification.
