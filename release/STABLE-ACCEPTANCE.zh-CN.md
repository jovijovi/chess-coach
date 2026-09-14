# Chess Coach 0.2.0 稳定版验收

[English](STABLE-ACCEPTANCE.md) | 简体中文

日期：2026-09-14。仓库已公开，稳定版 0.2.0 已发布。
GitHub Release 标题、正文及 Tag 注释均使用英文；翻译文档单独提供。

## 发行与证据

- [稳定版 Release](https://github.com/jovijovi/chess-coach/releases/tag/v0.2.0)
- [三平台检查](https://github.com/jovijovi/chess-coach/actions/runs/34828503526)
- [稳定渠道发布](https://github.com/jovijovi/chess-coach/actions/runs/34829760817)
- 源码提交：`b0d289da970ce34d30f34d2cffbe5230b9f48e48`
- 运行构建：`508aeee53fea35e252e7edb16b1365a887a0ee62ad8d48cb1a66732a22563543`
- 不可变发行引用：`plugin-v0.2.0`
- 稳定目录：`chess-coach`，来自 `marketplace` 分支

插件包及三份平台报告均与源码、构建标识一致，并通过原始 SHA-256 清单校验。
人工提交和标签采用仓库本地 Git 身份；生成的发行提交继承带注释标签的发布者。

## 检查结果

`npm run check` 通过：TypeScript、打包与源码材料校验、双语文档、44 项 Vitest
和 13 项浏览器测试。CI 另在 Ubuntu 24.04 x64、macOS 15 Intel 和 Apple Silicon
逐平台通过原生 Codex 及 13 项浏览器检查，使用 Node.js 26.8.2 和 Codex CLI 0.154.0。

每个平台完成八个工具和十个完整回合，验证分析的 FEN、版本和合法变化线、PGN 重放、
服务进程终止后的恢复、SSE 完整快照，以及重装后的数据保留。
同时检查了缺失 Node 与 Node 22 的版本要求提示。

实际 RC.2 → 稳定版升级在引擎应手期间完成，保留棋局且只生成一次应手；
已有 MCP 会话仍可读取当前运行版本。原始 personal 安装和棋局保留。

## 匿名安装

在文件系统隔离的全新 Linux Codex 用户目录中安装并刷新公开 GitHub marketplace。
排除了账户令牌、SSH/askpass 凭据及系统、全局 Git 凭据配置。
实际发布的插件包随后在阻断外网的环境下完成另一轮十回合原生验收，包括分析、
重启、SSE、PGN 重放和重装。附加报告记录 `anonymousGitHub: true` 及正式构建标识。

```bash
codex plugin marketplace add jovijovi/chess-coach --ref marketplace
codex plugin add chess-coach@chess-coach
```

可复现的检查命令：

```bash
node scripts/run-native-acceptance.mjs output/anonymous-acceptance.json --github
```

原始发行产物保留 `SHA256SUMS`；匿名安装、升级报告和本说明使用单独的补充校验清单。
不上传棋局数据库、偏好、认证令牌或服务日志。

## 验证范围

原生证据来自真实 CLI/app-server API 和引擎结果，尚未逐平台使用已登录桌面模型
账户进行人工对话。自动化检查验证传给 Codex 的局面及合法分析，不评价自然语言讲解质量。
手册继续默认英文并支持简体中文；MCP、引擎和棋局继续在用户本机运行。
