# Chess Coach 0.2.0 发行指南

[English](README.md) | 简体中文

所有者已将仓库公开。稳定版 0.2.0 沿用 RC 的带注释标签、三平台检查、
Draft Release 和手动渠道发布流程。GitHub Release 标题、正文及 Tag 注释必须使用英文；
用户文档继续分别维护英文和中文版本。

## 准备候选版本

1. 在根 `package.json`、锁文件和两个插件清单中统一设置 `0.2.0-rc.N`。
   每个候选使用新的 RC 编号，不覆盖旧标签。
2. 同步中英文 README、网站、受影响的技能说明及仅英文的 `AGENTS.md`，
   执行 `npm run check`。
3. 检查 `git config --local user.name` 和 `git config --local user.email`。
   人工提交和创建带注释的 `v0.2.0-rc.N` 标签时，作者与提交者都使用这些值，
   不依赖全局身份。
4. 推送源码提交和标签。标签触发 `release.yml`；普通 main 推送只可能部署文档，
   不会发行插件版本。

`npm run package` 生成 `output/release/marketplace/`、确定性的 tar.gz、
`SHA256SUMS` 和 `sources.json`。打包采用显式文件白名单，不包含数据库、偏好、
服务日志、主机路径或机器配置。清单记录源码提交、构建标识、锁定的依赖版本和
完整性信息、引擎哈希、源码归档及 NNUE 网络。随包保留生产依赖许可证全文、
Apache-2.0，以及 Stockfish GPL 和源码材料。材料缺失或校验不符会阻止打包。
详见 [Stockfish 对应源码](STOCKFISH-SOURCE.zh-CN.md)。

## 自动化验收

构建任务执行 TypeScript、打包、文档、Vitest 和 Chromium 检查。
随后同一归档在 `ubuntu-24.04`、`macos-15-intel`、`macos-15` 上验收。
每个平台安装固定的原生 Codex CLI 0.154.0，通过全部八个工具完成至少十个完整回合，
检查分析局面和变化线、PGN 重放、重启、SSE，以及卸载重装后的数据保留。
各平台均测试中英文浏览器交互。Node 22 须给出清楚的版本错误；缺失 `node`
须由 Codex 报告。

Linux 使用独立用户目录、网络和 PID 命名空间；macOS 仅在一次性 CI runner
运行，并用系统沙箱阻断外网。禁用 Python 和 flock 执行，从迁移后的完整包启动，
不依赖项目依赖。JSON 报告不含授权地址、令牌、日志或个人路径。
验收调用原生 Codex app-server API，不使用模型账户，也不伪造模型回复。
自然语言讲解另行进行面向用户的人工检查。

Linux 本地打包后可运行：

```bash
# Use an existing baseline CLI, or omit this override to fetch the pinned binary.
CHESS_COACH_CODEX="$(command -v codex)" node scripts/run-native-acceptance.mjs
```

该测试需要 `bwrap`，插件安装和运行不需要。

## 审核与发布

三个目标全部通过后，CI 才创建 **Draft Release**，附上同一归档、校验文件、
来源清单和三份验收报告。审核产物后，从 main 手动运行 **Publish verified plugin release**，传入标签。
它检查 Draft、报告与构建/源码的一致性，仅更新对应渠道：RC 为
`marketplace-preview`，稳定版为 `marketplace`。
生成提交沿用源码标签的发布者姓名和邮箱，创建不可变的带注释
`plugin-vVERSION` 引用并发布 Release，再从已发布的 GitHub marketplace 验证安装并记录结果。渠道分支只存放生成的发行内容，不手工修改。
稳定渠道拒绝预发布版本。

公开决定和私有 RC 检查已经完成。接下来执行 v0.2.0 标签检查、手动渠道发布，
然后通过公开 GitHub marketplace 验证匿名安装：

```bash
node scripts/run-native-acceptance.mjs output/anonymous-acceptance.json --github
```

此 Linux 检查使用文件系统隔离的新 Codex 用户目录，移除账户令牌、SSH 与 askpass
凭据，并禁用系统和全局 Git 凭据配置。安装并刷新公开目录后，阻断外网进行原生
十回合验收。报告显式记录匿名 GitHub 验证。准确注明未执行的人工检查；
引擎和局面自动化检查不评价模型自然语言讲解的质量。

## 升级、回退与迁移

用户命令统一维护在根 [README](../README.zh-CN.md)。升级采用原生 marketplace
刷新和插件重装，之后新建任务。运行时沿用现有保存格式；较高版本优先，同版不同构建会被拒绝。
主动回退需关闭任务、停止服务、仅清理运行文件，再安装兼容的不可变引用，
不能用备份覆盖更新后的棋局。

旧 personal 用户仅卸载 `chess-coach@personal`，保留旧运行文件备份，
使用新装插件的启动器清理旧运行目录后再激活。Codex 卸载默认保留棋局和语言偏好。

Ubuntu 24.04 CI 为 bwrap 的专用副本加载临时 AppArmor 配置，允许其使用用户命名空间，
原生验收后移除。参见 [Ubuntu 命名空间限制](https://documentation.ubuntu.com/security/security-features/privilege-restriction/apparmor/)。

历史 RC 证据：[0.2.0-rc.2 验收记录](ACCEPTANCE.zh-CN.md)。

[稳定版 0.2.0 验收](https://github.com/jovijovi/chess-coach/blob/main/release/STABLE-ACCEPTANCE.zh-CN.md)包括匿名 GitHub 安装与离线原生验证。
