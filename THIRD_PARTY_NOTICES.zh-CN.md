# 第三方声明

[English](THIRD_PARTY_NOTICES.md) | 简体中文

本仓库的 Apache-2.0 许可证适用于 Chess Coach 原创代码与文档。依赖及其资源仍保留各自的版权和许可证条款。

## 运行时依赖

| 软件包                      | 版本    | 许可证       | 源码                                                                         |
| --------------------------- | ------- | ------------ | ---------------------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | 1.30.0  | MIT          | [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) |
| `chess.js`                  | 1.4.0   | BSD-2-Clause | [chess.js](https://github.com/jhlywa/chess.js)                               |
| `react`                     | 19.3.0  | MIT          | [React](https://github.com/react/react)                                      |
| `react-dom`                 | 19.3.0  | MIT          | [React](https://github.com/react/react)                                      |
| `react-chessboard`          | 5.12.1  | MIT          | [React Chessboard](https://github.com/Clariity/react-chessboard)             |
| `stockfish`                 | 18.0.8  | GPL-3.0      | [Stockfish.js](https://github.com/nmrugg/stockfish.js)                       |
| `zod`                       | 3.25.76 | MIT          | [Zod](https://github.com/colinhacks/zod)                                     |

上表的版本与许可证声明对应已安装的软件包和锁文件。开发依赖和传递依赖同样保留各自条款，详情见对应软件包的元数据和许可证文件。

## Stockfish 引擎

Stockfish.js 18.0.8 是 Stockfish 18 的 WASM 实现，版权归 Chess.com, LLC 和 Stockfish 贡献者所有，以 GPLv3 发布。构建过程复制未修改的轻量单线程引擎，保留版权头，并将 GPL 全文保存为 `engine/COPYING`。

仓库跟踪源码和依赖声明，排除 `node_modules/`、生成的引擎二进制和 `dist/`。本机构建时通过锁定的 npm 依赖获取引擎。Apache 许可证不替代引擎的 GPLv3 条款。如果分发构建后的引擎资源，应保留适用声明，并按照上游许可证要求提供与具体二进制对应的源码。参见 [Stockfish 分发说明](https://stockfishchess.org/about/)。

根目录的 `LICENSE` 和 `NOTICE` 说明项目原创部分的许可证与署名，不替代第三方许可证。
