# Third-Party Notices

English | [简体中文](THIRD_PARTY_NOTICES.zh-CN.md)

The Apache-2.0 license in this repository applies to original Chess Coach code and documentation. Dependencies and their assets retain their own copyrights and license terms.

## Runtime dependencies

| Package                     | Version | License      | Source                                                                       |
| --------------------------- | ------- | ------------ | ---------------------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | 1.30.0  | MIT          | [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) |
| `chess.js`                  | 1.4.0   | BSD-2-Clause | [chess.js](https://github.com/jhlywa/chess.js)                               |
| `react`                     | 19.3.0  | MIT          | [React](https://github.com/react/react)                                      |
| `react-dom`                 | 19.3.0  | MIT          | [React](https://github.com/react/react)                                      |
| `react-chessboard`          | 5.12.1  | MIT          | [React Chessboard](https://github.com/Clariity/react-chessboard)             |
| `stockfish`                 | 18.0.8  | GPL-3.0      | [Stockfish.js](https://github.com/nmrugg/stockfish.js)                       |
| `zod`                       | 3.25.76 | MIT          | [Zod](https://github.com/colinhacks/zod)                                     |

Versions and declared licenses above correspond to the installed packages and lockfile. Development and transitive dependencies also retain their own terms; consult their package metadata and included license files.

## Stockfish engine

Stockfish.js 18.0.8 is a WASM implementation of Stockfish 18, copyright Chess.com, LLC and the Stockfish contributors, distributed under GPLv3. The build copies the unmodified lite single-threaded engine and preserves its copyright header and GPL text in `engine/COPYING`.

The repository tracks source and dependency declarations; `node_modules/`, generated engine binaries, and `dist/` are excluded. Installing and building locally retrieves the engine through the locked npm dependency. The Apache license does not replace the engine's GPLv3 terms. If distributing built engine assets, retain the applicable notices and provide the corresponding source for the exact binaries under the upstream license requirements. See [Stockfish's distribution guidance](https://stockfishchess.org/about/).

The root `LICENSE` and `NOTICE` files state the license and attribution for the project's original work. They do not replace third-party licenses.

## Complete 0.2.0 packages

`npm run package` includes license and notice texts for the locked production
packages, including transitive dependencies, under `licenses/dependencies/`.
`sources.json` records their versions and integrity values. The package also
includes the exact Stockfish source commit archive, its NNUE network, and
English/Chinese build instructions in `licenses/stockfish/`. Pinned binary,
source, and network hashes are checked before packaging; the network is compared
against the distributed WASM's reconstructed memory. See
[corresponding-source details](release/STOCKFISH-SOURCE.md). Development-tool
requirements in that guide apply to rebuilding the engine, not running the plugin.
