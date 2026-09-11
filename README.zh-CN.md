# Chess Coach

[English](README.md) | 中文

在 Codex 的应用内浏览器中与 Stockfish 下国际象棋，并在 Codex 对话中讨论真实棋局。界面支持英文和简体中文，以及拖动、点击、键盘走棋、合法落点、升变、提示、悔棋、翻转、自动保存与 PGN 导出。

## 仓库与许可证

项目维护于私有 GitHub 仓库 [jovijovi/chess-coach](https://github.com/jovijovi/chess-coach)，访问需要 GitHub 授权。项目原创代码和文档采用 [Apache License, Version 2.0](LICENSE)，署名信息见 [NOTICE](NOTICE)，依赖许可证见 [第三方声明](THIRD_PARTY_NOTICES.zh-CN.md)。Stockfish 仍采用 GPLv3。

可通过 GitHub CLI 获取已授权的仓库副本：

```bash
gh auth login
gh repo clone jovijovi/chess-coach
cd chess-coach
```

## 本机安装

目标环境：Linux x86_64、Node.js 26、npm、`/usr/bin/flock`，以及已安装 Codex 的 `plugin-creator` 系统技能。安装脚本默认使用带 PyYAML 的 `/usr/bin/python3`；其他解释器可通过 `CHESS_COACH_PYTHON` 指定。

```bash
npm ci
npm run build
npm run install:local -- --dry-run
npm run install:local
```

安装会将插件加入个人 marketplace，并执行 `codex plugin add`。默认个人 marketplace 无需另行添加。然后**新建 Codex 任务**并输入：

> 打开国际象棋棋盘。

插件的 MCP 启动器自动启动本地服务，Codex 打开返回的浏览器地址；无需运行 Vite 或手动启动后台服务。页面地址中的令牌仅用于访问本机棋局。

- “继续上一盘棋”：恢复唯一的当前棋局。
- “马走到 f3”：Codex 根据合法走法执行，并由引擎自动应手。
- “解释一下我刚才那步”：Codex 分析对应局面；讲解发生在对话中。
- “给我提示”：棋盘直接显示 Stockfish 建议走法和变化线。

首次获取依赖需要联网。安装完成后的棋盘、规则、引擎和保存完全在本机运行；Codex 对话仍使用你的 Codex 账户。插件不需要单独的 OpenAI API Key。

## 多语言

首次使用时，界面选择浏览器语言列表中第一个受支持的语言：`en` 或 `zh-CN`。各种中文语言标识均使用简体中文；不支持的语言回退为英文。可随时通过语言菜单切换，按钮、弹窗、状态、错误提示、无障碍标签和页面标题都会同步更新。

手动选择会单独写入 `preferences.json`，刷新或服务重启后仍保留，即使本地端口发生变化。切换语言不修改棋局、状态版本或 PGN。新页面采用保存的偏好；已经打开的其他页面保持原语言，直到主动切换或刷新。Codex 按你请求的语言讲解棋局。

界面译文集中在 `plugins/chess-coach/ui/locales/`，两种语言必须保持完整。代码注释、源文件中的开发者说明、MCP 工具描述、诊断信息和命令行输出使用英文；UI 根据稳定的错误码显示对应语言。插件配置文件统一使用英文，包括清单中的描述和默认提示。棋盘 UI 继续支持英文和中文。

本 README 和 [第三方声明](THIRD_PARTY_NOTICES.zh-CN.md) 提供英文和中文版本。现有的 [插件技能指南](plugins/chess-coach/skills/chess-coach/SKILL.md) 使用英文。法律文本 `LICENSE` 和 `NOTICE` 保留英文。[AGENTS.md](AGENTS.md) 是供 AI 阅读的指南，仅保留英文。项目发生变更时，应在同一次变更中同步更新本 README 和其他受影响的文档，包括所有语言版本，确保功能说明、命令、配置和示例与实现一致。生成的验收记录属于历史产物，不作为维护文档翻译。

## 对局约定

默认执白、中等难度；难度是 Skill Level 0 / 5 / 10，搜索预算 200 / 500 / 1000 ms，不表示经校准的等级分。提示采用更强的独立分析设置，评价值统一为白方视角，正数利白。将杀距离与普通局面分数分开显示。

悔棋退回到你的上一回合走棋之前：引擎已应手时撤销双方各一步，正在思考时取消引擎并撤销你的那步。执黑时保留引擎的首步。

保存槽只有一个。新开局前可以导出旧棋谱；替换后不提供历史棋局列表。本版为不限时休闲对局，三次重复和五十回合条件自动判和，区别于需要主动申和的比赛流程。

## 开发与检查

```bash
npm run dev           # Build an isolated game in output/dev-data and print its URL
npm run typecheck     # Check TypeScript
npm run build         # Prepare bundles before integration tests
npm test              # Run rules, engine, MCP, localization, and installation tests
npm run test:browser  # Exercise both UI languages in Chromium
npm run check         # Run all checks in dependency order
```

测试需要能启动子进程和监听 `127.0.0.1`。受限制的沙箱可能阻止这两项能力，须在允许本地进程和回环网络的环境运行。Playwright 默认使用 `/opt/google/chrome/chrome`，可用 `CHESS_COACH_CHROME` 指定其他 Chromium。截图位于 `output/playwright/`。

`npm test` 中的 MCP 与安装测试使用已构建产物，因此先运行 `npm run build`。开发命令每次执行重新构建，不使用热更新。

## 数据、启动与更新

- 当前棋局：`~/.local/share/chess-coach/state.db`，SQLite 保存完整走棋历史。
- 语言偏好：`~/.local/share/chess-coach/preferences.json`。
- 稳定运行目录：`~/.local/share/chess-coach/runtime/`。
- 个人插件源：`~/plugins/chess-coach/`；Codex 缓存中的插件引用稳定运行目录。
- 日志和服务发现文件在棋局数据目录。`CHESS_COACH_DATA_DIR` 可用于隔离开发和测试。

每个用户的数据目录用系统 `flock` 保证只有一个棋局服务；多个 MCP 会话和页面共享这一服务。服务只监听回环地址，数据接口验证令牌和请求来源。SSE 重连返回完整状态；棋局版本校验拒绝重复或过期操作。

```bash
npm run stop          # Stop the default service while retaining saves and preferences
npm run open          # Print the default board URL and current position
CHESS_COACH_DATA_DIR="$PWD/output/dev-data" npm run stop
```

修改插件后运行 `npm run build` 和 `npm run install:local`。安装脚本停止旧服务、复制运行文件、使用 plugin-creator 的 cachebuster helper 更新版本，再重新安装；数据库和语言偏好位于运行目录外，不受更新影响。新建 Codex 任务加载更新后的技能和工具。

若引擎失败，已经走出的棋仍被保存；棋盘显示重试按钮。若服务断开，回到 Codex 重新打开棋盘。损坏的数据库会使服务报错，程序不会静默清空它；详细错误见数据目录内的 `service.log`。

## 实现与接口

React / TypeScript / Vite / react-chessboard 构建页面，Node HTTP 与 SSE 提供本机服务，chess.js 校验规则，Stockfish 18 lite single-threaded WASM 通过独立子进程运行。所有资产都包含在构建产物内。

MCP 工具：`show_board`、`get_game`、`new_game`、`make_move`、`undo_turn`、`retry_engine`、`analyze_position`、`export_pgn`。变更操作携带 `gameId` 和 `expectedRevision`。分析的 `ply` 以半步计数，0 表示初始局面，结果包含局面版本、FEN 和合法 SAN 变化线。经过身份验证的 `GET /preferences` 和 `POST /preferences` 独立管理界面语言。

插件是本机版本，未提供对话内嵌 MCP Apps、联网对战、棋盘内模型调用或公开分发流程。

## 第三方组件

运行时依赖许可证汇总见 [第三方声明](THIRD_PARTY_NOTICES.zh-CN.md)。

Stockfish.js 18.0.8 © Chess.com, LLC 及 Stockfish 贡献者，GPL-3.0。构建保留引擎版权头与 `engine/COPYING`，对应源代码见 [Stockfish.js](https://github.com/nmrugg/stockfish.js)。其他依赖的许可证保留在其 npm 包中。
