# Documentation Site

English | [简体中文](README.zh-CN.md)

This is Chess Coach's bilingual static handbook, hosted on GitHub Pages: [English (default)](https://jovijovi.github.io/chess-coach/) and [Simplified Chinese](https://jovijovi.github.io/chess-coach/zh-CN/). The documentation website is public, while the source repository remains private.

## Build and preview

From the repository root, with Node.js 26+ and the locked dependencies installed:

```bash
npm run docs:build
npm run docs:preview
```

The build writes `output/docs/`. Preview uses `http://127.0.0.1:4174/` for English and `http://127.0.0.1:4174/zh-CN/` for Simplified Chinese. It binds only to loopback and fails rather than taking a different port when 4174 is busy. Stop with Ctrl+C. The build is independent of the game runtime, database, and engine assets.

The preview command rebuilds once on startup. After a source edit, run `npm run docs:build` and refresh; there is no source watcher. The built pages can also be read without JavaScript. Search, copying, mobile dialogs, and chapter tracking progressively enhance the static content.

## Maintain the handbook

- `locales/en.mjs` and `locales/zh-CN.mjs`: matching content, navigation, and interface strings. Keep chapter IDs and structure identical. The build checks both.
- `template.mjs`: shared semantic HTML. It escapes text and supports inline code surrounded by backticks.
- `style.css`: typography, layout, responsive behavior, reduced motion, and print styles. System font stacks avoid external font requests.
- `client.js`: local search, clipboard actions, dialogs, language links, and active chapters. No game APIs or external services are called.
- `../scripts/build-docs.mjs`: generates both languages and copies the approved logo and legal files. Version information comes from the root `package.json`.

Update both locale files and both root READMEs when changing site behavior. Comments and implementation notes are English. Do not edit generated `output/docs/` files or commit preview screenshots.

Run `npm run check` for code changes. For site changes, also inspect English and Chinese at desktop and mobile widths; exercise search (including `/`, Ctrl/Cmd+K, Escape, and empty results), copying, navigation, and the mobile menu. Check the built site under a nested path such as `/chess-coach/` as well as `/`.

## GitHub Pages publishing

The output contains two HTML entry points, local assets, and `.nojekyll`. All internal links are relative, so the same build supports a repository subpath. The deployment artifact is **the contents of `output/docs/`**, rather than the source `docs/` directory.

The [Pages workflow](../.github/workflows/pages.yml) runs when relevant documentation, build, version, logo, legal, or workflow files are pushed to `main`. It can also be started manually from the repository's Actions tab; deployment is restricted to `main`.

The build uses Node.js 26 and needs no dependency installation because the generator uses Node.js built-ins and local files only. Official actions are pinned to commit IDs. The build job uploads `output/docs/`; a separate job deploys it through the `github-pages` environment with Pages and OIDC permissions. Local preview commands do not deploy anything.

Keep the source repository private. The published static handbook is publicly accessible. See [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for the official deployment model.

## Plugin release content

Keep the private RC and future stable installation commands distinct. The
handbook documents native marketplace installation, manual upgrades, personal
migration, data-preserving removal, and immutable-reference rollback in both
languages. Plugin release workflows are independent of Pages: annotated tags
prepare drafts; manual promotion updates a channel. See the
[release guide](../release/README.md). Repository visibility remains a separate
owner decision, even when the public documentation describes these commands.
