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
    sourceNote: "访问仓库需要相应授权。",
    top: "回到开篇",
    license: "项目许可证",
    thirdParty: "第三方声明",
    footer: "愿每一次落子，都多一分从容。",
    system: "Linux · Node.js 26+",
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
          title: "开始之前",
          text: "需要 Linux x86_64、Node.js 26+、npm、`/usr/bin/flock`、带有 `plugin-creator` 系统技能的 Codex，以及安装了 PyYAML 的 `/usr/bin/python3`。可用 `CHESS_COACH_PYTHON` 指定其他兼容的 Python。克隆私有仓库需要 GitHub 授权。",
        },
        {
          type: "steps",
          items: [
            {
              title: "获取已授权的项目副本",
              text: "通过 GitHub CLI 登录，然后克隆项目。",
              code: "gh auth login\ngh repo clone jovijovi/chess-coach\ncd chess-coach",
              after: "已经有项目副本？可以直接进入下一步。",
            },
            {
              title: "构建并安装",
              text: "准备本地引擎，将 Chess Coach 加入你的个人插件 marketplace。",
              code: "npm ci\nnpm run build\nnpm run install:local -- --dry-run\nnpm run install:local",
              after: "安装时需要联网获取依赖；安装后的棋盘与引擎在本机运行。",
            },
            {
              title: "开始第一盘棋",
              text: "新建一个 Codex 任务，发送下面这句话。插件会自动启动本地服务，并在应用内浏览器打开棋盘。",
              prompt: "打开国际象棋棋盘。",
              after:
                "默认执白，对阵中等难度。无需手动启动开发服务器，也无需单独的 OpenAI API Key。",
            },
          ],
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
          title: "文件保存在哪里",
          headers: ["位置", "用途"],
          rows: [
            ["~/.local/share/chess-coach/state.db", "当前棋局与完整走棋历史"],
            ["~/.local/share/chess-coach/preferences.json", "你选择的界面语言"],
            ["~/.local/share/chess-coach/runtime/", "已安装的服务与引擎"],
            ["~/plugins/chess-coach/", "个人插件源文件"],
          ],
        },
        {
          type: "code",
          title: "管理本地服务",
          code: "npm run stop\nnpm run open",
          text: "停止服务会保留棋局和语言偏好。open 命令输出当前棋盘地址与局面。服务重启后，请通过 Codex 重新打开棋盘。",
        },
        {
          type: "faq",
          items: [
            {
              title: "引擎没有响应，怎么办？",
              text: "使用棋盘上的重试操作，或请 Codex 重试引擎。你的落子已经保存。若服务断开，请让 Codex 重新打开棋盘；详细信息可查看数据目录中的 service.log。",
            },
            {
              title: "更新插件会丢失棋局吗？",
              text: "不会。数据库和语言偏好位于运行目录之外。构建并重新安装后，新建 Codex 任务来加载更新的技能和工具。",
            },
            {
              title: "可以保留多盘棋吗？",
              text: "当前版本保存一盘棋，替换前可导出 PGN。暂未提供历史棋局库或联网对战。",
            },
          ],
        },
        {
          type: "paragraph",
          text: "用 `CHESS_COACH_DATA_DIR` 隔离开发和测试数据，避免影响日常棋局。数据库损坏时会报错，而不会静默清空重来。",
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
            ["npm test", "构建后运行 Vitest"],
            ["npm run test:browser", "在 Chromium 中检查两种界面语言"],
            ["npm run check", "运行完整代码检查流程"],
            ["npm run docs:build", "在 output/docs 构建这份双语静态手册"],
            ["npm run docs:preview", "重新构建并在本机预览手册"],
          ],
        },
        {
          type: "code",
          title: "更新本机插件",
          code: "npm run build\nnpm run install:local",
          text: "安装脚本更新稳定运行目录，并通过支持的 cachebuster 与重新安装流程刷新插件。更新后请新建 Codex 任务。",
        },
        {
          type: "paragraph",
          text: "项目原创代码、文档和美术资源采用 Apache License 2.0。Stockfish 仍采用 GPLv3，构建保留其许可证与版权声明；其他依赖保留各自的许可证。",
        },
      ],
    },
  ],
};
