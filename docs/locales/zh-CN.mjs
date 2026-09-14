export default {
  lang: "zh-CN",
  title: "Chess Coach — 使用手册",
  description:
    "在 Codex 中与 Stockfish 本地对弈，从每一步棋中有所收获。阅读安装、对局、讲解和完整工具指南。",
  ui: {
    handbook: "使用手册",
    edition: "写给每一位用心落子的棋友",
    contents: "卷中目录",
    gettingStarted: "从这里开始",
    reference: "参考与维护",
    documentation: "项目文档",
    search: "搜索使用手册",
    searchHint: "搜索命令、工具或你关心的问题…",
    searchEmpty: "未找到相关章节。试试“安装”“PGN”或工具名称。",
    searchInitial: "找到你的下一步。",
    searchCount: "个相关章节",
    close: "关闭",
    menu: "打开目录",
    skip: "跳至正文",
    copy: "复制",
    copied: "已复制",
    copyFailed: "暂时无法自动复制，请选中下方文字手动复制。",
    copyPrompt: "复制这条提示",
    language: "语言",
    repository: "在 GitHub 查看",
    source: "源代码仓库",
    sourceNote: "公开源码仓库 · 稳定版 0.2.0 已发布。",
    top: "回到开篇",
    license: "项目许可证",
    thirdParty: "第三方声明",
    footer: "愿每一次落子，都多一分从容。",
    system: "Linux x64 · macOS · Node.js 26+",
    downloadLogo: "下载 SVG 标志",
    note: "落子前记得",
    code: "终端",
    navigation: "章节导航",
    openChapter: "阅读章节",
    logoAlt: "Chess Coach，直立鬃毛的马棋子",
  },
  hero: {
    eyebrow: "Chess Coach 使用手册",
    title: ["方寸棋盘，", "步步精进。"],
    lead: "棋逢对手，亦遇良师。",
    text: "在 Codex 的本地棋盘上与 Stockfish 对弈，再回到对话中理解局面。从第一步落子，到每一次复盘，这份手册与你相伴。",
    primary: "开始第一盘棋",
    secondary: "查阅工具指南",
    sealTop: "对弈 · 思考 · 精进",
    sealBottom: "CHESS COACH · 棋友手册",
    pillars: [
      {
        title: "一方自己的棋盘",
        text: "棋盘与引擎在本机运行，棋局也在本机保存。",
      },
      {
        title: "每一步，都有所得",
        text: "与 Codex 讨论的，正是眼前棋盘上的真实局面。",
      },
      {
        title: "随时回来，继续落子",
        text: "一盘棋，没有时钟，留给思考足够的时间。",
      },
    ],
  },
  sections: [
    {
      id: "installation",
      label: "安装与启用",
      kicker: "落下第一子",
      title: "准备好你的棋友。",
      summary: "完成一次安装，往后想下棋时，只需请 Codex 打开棋盘。",
      blocks: [
        {
          type: "callout",
          title: "安装前准备",
          text: "支持 Linux x86_64、macOS Intel 和 Apple Silicon。预装 Node.js 26+ 并确保 Codex 能找到 node；兼容性基线为 Codex CLI 0.154.0。稳定版 0.2.0 已发布，无需 GitHub 认证即可安装。用户无需编译、项目依赖、Python 或 flock。",
        },
        {
          type: "steps",
          items: [
            {
              title: "安装稳定版",
              text: "通过原生 GitHub marketplace 安装完整稳定版插件包。",
              code: "codex plugin marketplace add jovijovi/chess-coach --ref marketplace\ncodex plugin add chess-coach@chess-coach",
              after:
                "当前预览版使用 ref marketplace-preview 和插件标识 chess-coach@chess-coach-preview。公开仓库无需 GitHub 认证。",
            },
            {
              title: "手动升级",
              text: "刷新稳定目录并重新安装；预览版将目录名称改为 chess-coach-preview。",
              code: "codex plugin marketplace upgrade chess-coach\ncodex plugin add chess-coach@chess-coach",
              after:
                "每次升级后新建 Codex 任务。旧缓存不会覆盖较新的运行版本。",
            },
            {
              title: "落下第一子",
              text: "在新任务中发出下方请求；插件自动启动本地服务，并在应用内浏览器打开棋盘。",
              prompt: "打开国际象棋棋盘。",
              after:
                "默认执白、中等难度。安装后棋盘和引擎可离线运行；模型对话仍使用 Codex 服务。",
            },
          ],
        },
        {
          type: "callout",
          title: "从预览版切换",
          text: "先关闭下棋任务，运行 codex plugin remove chess-coach@chess-coach-preview，再启用稳定版 chess-coach@chess-coach 并新建任务。棋局保留在共享数据目录中。",
        },
      ],
    },
    {
      id: "playing",
      label: "棋盘与对弈",
      kicker: "从容对弈",
      title: "给思考，一点余地。",
      summary:
        "选择你的执棋颜色与挑战难度。退回一步，换个角度，或者明天再继续。",
      blocks: [
        {
          type: "features",
          items: [
            {
              title: "自然落子",
              text: "拖动棋子，或依次点击棋子和目标格。合法落点会高亮显示，也支持键盘走棋与四种升变选择。",
            },
            {
              title: "看清局面",
              text: "棋谱、上一步高亮和将军提示帮助你掌握棋局。需要换个视角时，随时翻转棋盘。",
            },
            {
              title: "重新想一想",
              text: "悔棋退回到你上一次走棋之前：撤销你的落子及引擎应手；引擎思考中，则撤销你的那一步。",
            },
            {
              title: "留住一盘好棋",
              text: "想保留棋谱，就在新开局前导出 PGN。新开局会替换唯一的当前保存槽。",
            },
          ],
        },
        {
          type: "table",
          title: "选择合适的挑战",
          headers: ["难度", "Skill Level", "每步搜索时间"],
          rows: [
            ["简单", "0", "200 ms"],
            ["中等 · 默认", "5", "500 ms"],
            ["困难", "10", "1,000 ms"],
          ],
        },
        {
          type: "paragraph",
          text: "难度名称不对应经校准的等级分。执黑时由 Stockfish 先走；悔棋会保留引擎的首步。",
        },
        {
          type: "callout",
          title: "休闲对局，规则清楚",
          text: "将死、逼和和子力不足正常结束。本模式不计时，三次重复和五十回合条件自动判和。",
        },
        {
          type: "paragraph",
          text: "棋盘支持英文与简体中文。首次使用遵循浏览器中第一个受支持的语言；手动选择后，刷新和服务重启都会保留偏好，不影响棋局或 PGN。",
        },
      ],
    },
    {
      id: "coaching",
      label: "与 Codex 复盘",
      kicker: "棋盘之外",
      title: "知其然，也知其所以然。",
      summary:
        "棋盘提供引擎提示，而每一步背后的思路，可以在 Codex 对话中慢慢展开。",
      blocks: [
        {
          type: "prompts",
          items: [
            {
              title: "理解眼前的局面",
              prompt: "分析当前局面，我应该重点考虑什么？",
            },
            {
              title: "回看刚才的选择",
              prompt: "解释我刚才那一步，并与引擎建议的其他走法比较。",
            },
            {
              title: "寻找下一步思路",
              prompt: "给我一个提示，并解释这步棋背后的计划。",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Codex 会读取真实棋局，并用 Stockfish 分析对应局面。分析结果包含半步数（`ply`）、FEN、棋局版本与合法变化线，不会修改棋盘。你可以用中文或英文请求讲解。",
        },
        {
          type: "callout",
          title: "如何理解分数",
          text: "分数统一为白方视角：正数利白。将杀距离与普通局面分数分别报告。旧分析只解释其记录的局面，不能当作后续局面的判断。",
        },
      ],
    },
    {
      id: "tools",
      label: "MCP 工具指南",
      kicker: "表里如一",
      title: "同一盘棋，共同的理解。",
      summary:
        "交互棋盘与 Codex 共用同一套棋局服务。展开工具，查看它的用途和输入参数。",
      blocks: [
        {
          type: "tools",
          items: [
            {
              name: "show_board",
              description: "打开或继续棋盘",
              input: "无需参数。",
              text: "返回当前棋局和供 Codex 应用内浏览器打开的地址；需要时自动启动本地服务。",
            },
            {
              name: "get_game",
              description: "读取完整棋局",
              input: "无需参数。",
              text: "返回当前局面、完整历史、合法走法、引擎状态、gameId 和 revision。",
            },
            {
              name: "new_game",
              description: "开始新的一局",
              input:
                "gameId、expectedRevision、playerColor（w | b）、difficulty（easy | medium | hard）。",
              text: "按明确的新开局请求替换当前保存槽。希望保留旧棋谱时，请先导出 PGN。",
            },
            {
              name: "make_move",
              description: "执行你指定的走法",
              input:
                "gameId、expectedRevision、from、to；可选 promotion（q | r | b | n）。",
              text: "校验并保存走法，然后安排 Stockfish 应手。格子使用 e2、e4 等代数坐标。",
            },
            {
              name: "undo_turn",
              description: "重想上一个回合",
              input: "gameId、expectedRevision。",
              text: "取消正在进行的搜索，退回到玩家上一次走棋之前。",
            },
            {
              name: "retry_engine",
              description: "重试引擎应手",
              input: "gameId、expectedRevision。",
              text: "引擎超时或退出后，从已保存的局面重试，不会编造替代走法。",
            },
            {
              name: "analyze_position",
              description: "分析指定局面",
              input: "gameId、expectedRevision；可选 ply（0 表示初始局面）。",
              text: "返回白方视角的分数和合法变化线，不修改对局。结果会标明对应的局面和版本。",
            },
            {
              name: "export_pgn",
              description: "带走这盘棋谱",
              input: "无需参数。",
              text: "返回当前 PGN、建议文件名和本地下载信息。",
            },
          ],
        },
        {
          type: "callout",
          title: "以最新局面为准",
          text: "变更或分析前，先读取最新的 `gameId` 和 `revision`，将后者作为 `expectedRevision` 提交。过期或重复操作会被拒绝，避免两个页面互相覆盖棋局。",
        },
      ],
    },
    {
      id: "recovery",
      label: "保存与恢复",
      kicker: "好棋，留待下回",
      title: "回来时，棋局还在。",
      summary:
        "每次落子都在引擎应手前保存。关闭棋盘后，当前这一局仍等待你下一次继续。",
      blocks: [
        {
          type: "table",
          title: "数据始终留在本机",
          headers: ["路径", "用途"],
          rows: [
            ["~/.local/share/chess-coach/state.db", "当前棋局和完整历史"],
            ["~/.local/share/chess-coach/preferences.json", "语言偏好"],
            ["~/.local/share/chess-coach/runtime/", "校验后的运行文件"],
            ["activation-lock.db / service-lock.db", "独立 SQLite 进程锁"],
          ],
        },
        {
          type: "code",
          title: "检查与停止服务",
          code: "node ~/.local/share/chess-coach/runtime/control.js doctor\nnode ~/.local/share/chess-coach/runtime/control.js stop",
          text: "doctor 不输出令牌。停止保留棋局和语言；服务重启后通过 Codex 重新打开棋盘。",
        },
        {
          type: "code",
          title: "从 personal 一次性迁移",
          code: "node ~/.local/share/chess-coach/runtime/control.js stop\ncodex plugin remove chess-coach@personal\ncp -R ~/.local/share/chess-coach/runtime ~/.local/share/chess-coach/runtime-0.1-backup",
          text: "先关闭旧任务。安装预览版后，使用安装输出中的插件绝对路径执行 node <installed-plugin>/scripts/launch.mjs clean-runtime，再新建任务。不会删除棋局、偏好或其他 personal 条目。验证完成前保留备份。",
        },
        {
          type: "code",
          title: "卸载与清理",
          code: "node ~/.local/share/chess-coach/runtime/control.js stop\nnode ~/.local/share/chess-coach/runtime/control.js clean-runtime\ncodex plugin remove chess-coach@chess-coach-preview",
          text: "先关闭下棋任务。clean-runtime 为可选操作，仅删除运行文件，保留棋局与语言。稳定版标识为 chess-coach@chess-coach。",
        },
        {
          type: "faq",
          items: [
            {
              title: "引擎停止响应怎么办？",
              text: "用户走棋已经保存，使用重试即可。服务断开时重新打开棋盘，必要时检查数据目录的 service.log。",
            },
            {
              title: "升级失败会丢失棋局吗？",
              text: "新文件先暂存、校验再切换，并检查服务健康状态。失败恢复旧运行文件，不回退数据库。进程崩溃自动释放锁，中断的切换在下次启动时恢复。",
            },
            {
              title: "如何主动回退？",
              text: "关闭任务、停止服务、卸载插件并清理运行文件，只移除对应目录注册，再用 --ref plugin-vVERSION 安装兼容版本。请从 Release 选择已存在的 RC 引用，使用对应预览目录。不要覆盖较新的数据库；0.2.0 各 RC 保持现有棋谱格式。",
            },
          ],
        },
        {
          type: "paragraph",
          text: "三个平台采用相同数据目录。直接 CLI 可使用 CHESS_COACH_DATA_DIR；Codex 若过滤继承变量，需在 MCP 环境中显式设置，并让任务和控制命令一致。数据库损坏会报错，不会静默清空。",
        },
      ],
    },
    {
      id: "development",
      label: "开发与许可证",
      kicker: "探索其间",
      title: "清晰构建，从容维护。",
      summary:
        "棋盘由 React 与 TypeScript 构建，背后是 Node.js、chess.js、SQLite 和 Stockfish。所有交互共享带版本的真实棋局。",
      blocks: [
        {
          type: "table",
          title: "日常开发命令",
          headers: ["命令", "用途"],
          rows: [
            ["npm run dev", "在 output/dev-data 构建独立棋局，不提供热更新"],
            ["npm run typecheck", "检查 TypeScript"],
            ["npm run build", "打包插件与本地引擎资源"],
            ["npm run package", "完整包、归档、校验文件和来源清单"],
            ["npm test", "打包后运行 Vitest 集成测试"],
            ["npm run test:browser", "在 Chromium 中检查两种界面语言"],
            ["npm run check", "运行完整代码检查流程"],
            ["npm run docs:build", "在 output/docs 构建这份双语静态手册"],
            ["npm run docs:preview", "重新构建并在本机预览手册"],
          ],
        },
        {
          type: "code",
          title: "开发安装与发行",
          code: "npm run install:local -- --dry-run\nnpm run install:local",
          text: "开发目录为 chess-coach-local，通过 Codex 原生命令安装，无 Python 安装依赖。带注释的 v0.2.0-rc.N 或 v0.2.0 标签触发三平台检查和 Draft Release；手动确认后更新发行分支。普通 main 推送不会发布插件。",
        },
        {
          type: "paragraph",
          text: "原创代码、文档与图标采用 Apache-2.0。Stockfish 18.0.8 保持 GPL-3.0；完整包保留依赖许可证、对应源码、网络文件、构建说明和固定哈希。源码材料不完整时禁止发行。",
        },
      ],
    },
  ],
};
