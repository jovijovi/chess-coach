# Chess Coach

<img src="plugins/chess-coach/assets/logo.svg" width="112" height="112" alt="Chess Coach：直立鬃毛的象牙白马棋子，饰以古金色边框" />

[English](README.md) | 简体中文 · [使用手册](https://jovijovi.github.io/chess-coach/zh-CN/)

在 Codex 应用内浏览器的交互棋盘上与 Stockfish 对弈，并在对话中讨论真实局面。
中英文 UI 支持拖动、点击、键盘走棋、合法落点、升变、提示、悔棋、翻转棋盘、自动保存和 PGN 导出。

## 发行状态与要求

当前私有预览版：[0.2.0-rc.2](https://github.com/jovijovi/chess-coach/releases/tag/v0.2.0-rc.2)。三平台结果与验证范围见[验收记录](release/ACCEPTANCE.zh-CN.md)。

**0.2.0 正在进行私有 RC 内测。** 获得项目所有者确认前，仓库保持私有。
文档网站公开访问，默认英文。下文稳定版命令在正式版本发布后生效。

支持 Linux x86_64、macOS Intel 和 Apple Silicon。请预装 **Node.js 26+**，
确保 Codex 能找到 `node`；兼容性基线为 **Codex CLI 0.154.0**。
本版不支持 Windows、Linux ARM、远程 MCP、自动升级、npm 发布或官方目录上架。

用户安装的是完整插件包，无需编译、项目依赖、Python、`flock` 或额外安装脚本。
安装时需要联网；安装后的棋盘、MCP、规则、引擎和保存均可离线在本机运行。
与 Codex 模型的对话仍依赖 Codex 服务和账户。

## 通过 Codex 安装

私有 RC 发布后，获得仓库访问授权的测试者使用：

```bash
# Authenticate Git for the private repository if necessary.
gh auth login
gh auth setup-git
codex plugin marketplace add jovijovi/chess-coach --ref marketplace-preview
codex plugin add chess-coach@chess-coach-preview
```

正式版本发布后使用：

```bash
codex plugin marketplace add jovijovi/chess-coach --ref marketplace
codex plugin add chess-coach@chess-coach
```

新建 **Codex 任务**，说“打开棋盘”“继续上一局”或“解释上一步”。
Codex 打开 `show_board` 返回的地址。地址片段携带本地授权令牌，须保持完整，避免写入共享日志。

插件包包含 portable `plugin.json`、`mcp.json`、兼容清单
`.codex-plugin/plugin.json` 和全部运行资源。注册和缓存由 Codex 管理；
启动器校验资源后准备稳定运行目录，不会下载引擎。

## 升级、迁移与卸载

手动升级稳定版：

```bash
codex plugin marketplace upgrade chess-coach
codex plugin add chess-coach@chess-coach
```

RC 将两处 marketplace 名称替换为 `chess-coach-preview`。升级后新建任务。
旧缓存不能覆盖较新的运行版本；同一版本的不同构建也会被拒绝，请增加 RC 编号，不要复用发行版本。

**从 `chess-coach@personal` 一次性迁移：** 关闭旧的下棋任务，停止旧服务，
仅卸载这个插件。下列命令保留棋局、语言偏好及其他 personal marketplace 条目。

```bash
node ~/.local/share/chess-coach/runtime/control.js stop
codex plugin remove chess-coach@personal
# Preserve a copy of the legacy runtime if a migration rollback may be needed.
cp -R ~/.local/share/chess-coach/runtime ~/.local/share/chess-coach/runtime-0.1-backup
```

通过 Codex 安装预览版。首次打开棋盘前，使用 `codex plugin add` 打印的
插件绝对路径，执行 `node <installed-plugin>/scripts/launch.mjs clean-runtime`，
然后新建任务。启动器不会默默替换无法识别的旧运行目录；新版本能够读取现有棋谱格式。
迁移验证完成前保留旧运行文件备份。

正常卸载时，先关闭下棋任务并停止服务，再运行
`codex plugin remove chess-coach@chess-coach`，或对应的 preview/local 标识。
卸载默认保留棋局与语言。若还需清理运行文件，在卸载前运行
`node ~/.local/share/chess-coach/runtime/control.js clean-runtime`；
该命令保留 `state.db` 与 `preferences.json`。

每版都有不可变的 `plugin-vVERSION` Git 引用。手动回退时：关闭任务、停止服务、
卸载插件，使用所选版本包的启动器清理运行文件，只移除对应 marketplace 注册；
然后通过 `--ref plugin-vVERSION` 重新添加仓库并安装目录中的插件。
请从对应 Release 选择已存在的不可变引用；RC 引用提供 `chess-coach@chess-coach-preview`。
仅回退到已说明兼容当前保存格式的版本；0.2.0 各 RC 沿用现有格式。
不要用旧数据库覆盖更新后的棋局。

## 本地数据与恢复

三个平台统一使用 `~/.local/share/chess-coach/`：

| 路径                                    | 用途                     |
| --------------------------------------- | ------------------------ |
| `state.db`                              | 当前一局，含完整走棋历史 |
| `preferences.json`                      | UI 语言选择              |
| `runtime/`                              | 已校验的运行文件         |
| `activation-lock.db`、`service-lock.db` | 独立 SQLite 进程锁       |
| `server.json`、`service.log`            | 私有服务元数据和诊断日志 |

激活锁和服务锁采用 Node 内置 SQLite，进程崩溃后由系统释放，不占用棋局数据库。
升级先暂存并校验文件，再停止旧服务、切换目录并检查健康状态；失败恢复旧运行文件，
不会回退或删除棋局。切换中断时，下一次启动会恢复。

```bash
node ~/.local/share/chess-coach/runtime/control.js doctor
node ~/.local/share/chess-coach/runtime/control.js stop
```

`doctor` 显示路径、平台、版本、构建标识、完整性和服务状态，不输出令牌。
直接运行 CLI 或测试时，可用 `CHESS_COACH_DATA_DIR` 隔离数据。
Codex 可能过滤继承的环境变量；使用自定义目录时，应在 MCP 环境配置中显式设置此变量，
并让所有任务及控制命令保持一致。

引擎失败时，用户走棋仍已保存，可使用“重试”。服务重启后请让 Codex 重新打开棋盘。
SSE 重连获取完整状态。数据库损坏会报错，不会静默开始新局；检查 `service.log`。
请勿提交或发布数据库、令牌、偏好或日志。

## 语言与对局行为

UI 优先采用浏览器支持的语言，默认回退到英文；可手动选择英文或简体中文。
选择在刷新和重启后保留，不影响局面或 PGN。Codex 根据对话语言讲解。
源码注释、诊断、MCP 描述和插件配置使用英文。项目变化时，同步更新 README、网站
和其他受影响文档的全部语言版本；`AGENTS.md` 仅保留英文。

默认执白、中等难度。简单/中等/困难采用 Skill Level 0/5/10 和
200/500/1000 毫秒搜索预算，不代表校准等级分。提示采用独立分析设置。
分数以白方视角显示，将杀距离与厘兵分开。悔棋撤销上次用户走棋及引擎应手，
或取消尚未完成的应手；执黑时保留引擎第一步。
休闲模式自动按三次重复和五十回合条件判和。替换唯一保存槽前可导出 PGN。

八个共享 MCP 工具：`show_board`、`get_game`、`new_game`、`make_move`、
`undo_turn`、`retry_engine`、`analyze_position`、`export_pgn`。
修改操作及分析保持现有 `gameId`/`expectedRevision` 参数契约。
分析返回 FEN、版本、半步编号 `ply` 和合法变化线，便于明确讲解对应的局面。
服务仅监听 `127.0.0.1`，校验令牌、请求来源及过期版本。

## 开发与发行

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

Playwright 优先使用已安装的 Chrome，否则使用托管 Chromium；可通过
`CHESS_COACH_CHROME` 覆盖路径。测试需要子进程与本地回环网络。
`npm run package` 首次获取固定的对应源码材料并缓存在 `output/vendor/`，
任何校验失败都会阻止打包。生成物、依赖和个人数据不提交到源码分支。

[发行指南](release/README.zh-CN.md) 说明带注释的标签、三平台验收、Draft Release、
手动渠道发布、不可变引用和公开访问确认步骤。main 推送可能更新
[GitHub Pages](.github/workflows/pages.yml)，但**不会发布插件版本**。
人工提交和标签使用仓库本地 Git 身份；流水线生成的提交继承发行标签的发布者身份。
贡献约定见 [AGENTS.md](AGENTS.md)。

## 许可证与图标

原创代码、文档及古典风格马棋子图标采用 [Apache License 2.0](LICENSE)，
署名见 [NOTICE](NOTICE)。[第三方声明](THIRD_PARTY_NOTICES.zh-CN.md) 说明依赖许可。
Stockfish 18.0.8 保留 GPL-3.0。插件包附带依赖许可证全文和
[对应源码及构建材料](release/STOCKFISH-SOURCE.zh-CN.md)，
JS、WASM 与网络文件的固定哈希见 `release/stockfish.json`。

Linux CI runner 使用临时 AppArmor 配置，为专用验收程序启用命名空间。
runner 配置详见发行指南。
