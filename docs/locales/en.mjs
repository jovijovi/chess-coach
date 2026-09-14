export default {
  lang: "en",
  title: "Chess Coach — The Handbook",
  description:
    "Play Stockfish locally in Codex and learn from every position. Installation, game controls, coaching, and the complete tool reference.",
  ui: {
    handbook: "The handbook",
    edition: "A companion for the thinking player",
    contents: "Contents",
    gettingStarted: "Getting started",
    reference: "Reference & care",
    documentation: "Documentation",
    search: "Search the handbook",
    searchHint: "Search commands, tools, or a topic…",
    searchEmpty: "No chapters found. Try “install”, “PGN”, or a tool name.",
    searchInitial: "Find your next step.",
    searchCount: "chapters found",
    close: "Close",
    menu: "Open contents",
    skip: "Skip to content",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy unavailable. Select and copy the text below.",
    copyPrompt: "Copy this prompt",
    language: "Language",
    repository: "View on GitHub",
    source: "Source repository",
    sourceNote: "Repository access requires authorization.",
    top: "Back to the beginning",
    license: "Project license",
    thirdParty: "Third-party notices",
    footer: "Made for the quiet pleasure of a considered move.",
    system: "Linux · Node.js 26+",
    downloadLogo: "Download the SVG mark",
    note: "Worth remembering",
    code: "Terminal",
    navigation: "Chapter navigation",
    openChapter: "Open chapter",
    logoAlt: "Chess Coach, the upright-maned knight",
  },
  hero: {
    eyebrow: "The Chess Coach handbook",
    title: ["The art of", "a better move."],
    lead: "A worthy opponent. A thoughtful companion.",
    text: "Play Stockfish on a local chessboard in Codex, then explore the position together in conversation. This is your guide to the first move—and everything that follows.",
    primary: "Begin your first game",
    secondary: "Explore the tools",
    sealTop: "PLAY · REFLECT · IMPROVE",
    sealBottom: "THE CHESS COACH COLLECTION",
    pillars: [
      {
        title: "A board of your own",
        text: "The board and engine run locally, with your game saved on your machine.",
      },
      {
        title: "Understanding, move by move",
        text: "Ask Codex about the very position on your board.",
      },
      {
        title: "Return when you wish",
        text: "One saved game. No clock. Room to think.",
      },
    ],
  },
  sections: [
    {
      id: "installation",
      label: "Installation",
      kicker: "Your first move",
      title: "Set up your chess companion.",
      summary:
        "Install once. After that, ask Codex to open the board whenever you are ready to play.",
      blocks: [
        {
          type: "callout",
          title: "Before you begin",
          text: "You need Linux x86_64, Node.js 26+, npm, `/usr/bin/flock`, Codex with its `plugin-creator` system skill, and `/usr/bin/python3` with PyYAML. Use `CHESS_COACH_PYTHON` to select another compatible Python. GitHub access is required to clone the private repository.",
        },
        {
          type: "steps",
          items: [
            {
              title: "Get an authorized checkout",
              text: "Sign in with GitHub CLI, then clone the project.",
              code: "gh auth login\ngh repo clone jovijovi/chess-coach\ncd chess-coach",
              after: "Already have a checkout? Start with the next step.",
            },
            {
              title: "Build and install",
              text: "Prepare the local engine and add Chess Coach to your personal plugin marketplace.",
              code: "npm ci\nnpm run build\nnpm run install:local -- --dry-run\nnpm run install:local",
              after:
                "Dependencies download during setup. The installed board and engine run locally.",
            },
            {
              title: "Make your first move",
              text: "Start a new Codex task and send the prompt below. The plugin starts its local service and opens the board in the in-app browser.",
              prompt: "Open the chessboard.",
              after:
                "The default game is White against Medium. No development server or separate OpenAI API key is needed.",
            },
          ],
        },
      ],
    },
    {
      id: "playing",
      label: "Playing a game",
      kicker: "At the board",
      title: "A little room to think.",
      summary:
        "Choose your side and your challenge. Take a move back, turn the board around, or return to the game another day.",
      blocks: [
        {
          type: "features",
          items: [
            {
              title: "Move naturally",
              text: "Drag a piece or select it and its destination. Legal squares are highlighted; keyboard moves and all four promotion choices are supported.",
            },
            {
              title: "Keep your bearings",
              text: "Follow the move list, last-move highlights, and check indicators. Flip the board whenever a different view helps.",
            },
            {
              title: "Take a second look",
              text: "Undo returns to before your last turn: your move and the engine reply, or just your move if the engine is still thinking.",
            },
            {
              title: "Keep the story",
              text: "Export PGN before a new game if you want to retain the score. A new game replaces the single save slot.",
            },
          ],
        },
        {
          type: "table",
          title: "Find your pace",
          headers: ["Difficulty", "Skill Level", "Search per move"],
          rows: [
            ["Easy", "0", "200 ms"],
            ["Medium · default", "5", "500 ms"],
            ["Hard", "10", "1,000 ms"],
          ],
        },
        {
          type: "paragraph",
          text: "Difficulty names are not calibrated ratings. When you play Black, Stockfish makes the opening move; undo preserves that first engine move.",
        },
        {
          type: "callout",
          title: "Casual chess, considered rules",
          text: "Checkmate, stalemate, and insufficient material end the game normally. Threefold repetition and the fifty-move condition are automatic draws in this untimed mode.",
        },
        {
          type: "paragraph",
          text: "The board supports English and Simplified Chinese. It follows the first supported browser language until you choose a language yourself. Your choice survives refreshes and service restarts, without changing the game or PGN.",
        },
      ],
    },
    {
      id: "coaching",
      label: "Learning with Codex",
      kicker: "Beyond the move",
      title: "Turn a position into understanding.",
      summary:
        "The board supplies engine hints. Your Codex conversation is where you explore the ideas behind them.",
      blocks: [
        {
          type: "prompts",
          items: [
            {
              title: "Understand the position",
              prompt:
                "Analyze the current position. What should I be thinking about?",
            },
            {
              title: "Look back at a decision",
              prompt:
                "Explain my last move and compare it with the engine's alternatives.",
            },
            {
              title: "Consider the next move",
              prompt: "Give me a hint and explain the plan behind it.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Codex reads the current game and uses Stockfish analysis for that position. Analysis includes the half-move number (`ply`), FEN, game version, and legal variations. It does not change the board. Ask for explanations in either language.",
        },
        {
          type: "callout",
          title: "Read the evaluation correctly",
          text: "Scores are from White’s perspective: positive favors White. Mate distance is reported separately from centipawn scores. An earlier analysis describes its recorded position, not a later board state.",
        },
      ],
    },
    {
      id: "tools",
      label: "MCP tool reference",
      kicker: "Under the surface",
      title: "One board. A shared understanding.",
      summary:
        "The interactive board and Codex use the same game service. Expand a tool to see what it does and which inputs it expects.",
      blocks: [
        {
          type: "tools",
          items: [
            {
              name: "show_board",
              description: "Open or resume the board",
              input: "No inputs.",
              text: "Returns the current game and a URL for the Codex in-app browser. The local service starts automatically when needed.",
            },
            {
              name: "get_game",
              description: "Read the complete game",
              input: "No inputs.",
              text: "Returns the position, complete history, legal moves, engine state, gameId, and revision.",
            },
            {
              name: "new_game",
              description: "Start a new game",
              input:
                "gameId, expectedRevision, playerColor (w | b), difficulty (easy | medium | hard).",
              text: "Replaces the current save on an explicit request. Export PGN first if you want to keep the old score.",
            },
            {
              name: "make_move",
              description: "Play your requested move",
              input:
                "gameId, expectedRevision, from, to; optional promotion (q | r | b | n).",
              text: "Validates the move, saves it, and schedules Stockfish’s reply. Squares use algebraic coordinates such as e2 and e4.",
            },
            {
              name: "undo_turn",
              description: "Reconsider the last turn",
              input: "gameId, expectedRevision.",
              text: "Cancels a pending search and restores the position before the previous human turn.",
            },
            {
              name: "retry_engine",
              description: "Retry an engine reply",
              input: "gameId, expectedRevision.",
              text: "Retries after an engine timeout or exit, starting from the saved position. No replacement move is invented.",
            },
            {
              name: "analyze_position",
              description: "Study a chosen position",
              input:
                "gameId, expectedRevision; optional ply (0 is the starting position).",
              text: "Returns White-perspective scores and legal variations without changing the game. The result identifies its exact position and version.",
            },
            {
              name: "export_pgn",
              description: "Take your score with you",
              input: "No inputs.",
              text: "Returns the current PGN, a suggested filename, and local download information.",
            },
          ],
        },
        {
          type: "callout",
          title: "Use the latest position",
          text: "Read the latest `gameId` and `revision` before a mutation or analysis, and send the latter as `expectedRevision`. Stale or repeated operations are rejected so two pages cannot silently overwrite each other.",
        },
      ],
    },
    {
      id: "recovery",
      label: "Saves & recovery",
      kicker: "A game worth keeping",
      title: "Pick up where you left off.",
      summary:
        "Each move is saved before the engine replies. Closing the board leaves the current game ready for your next visit.",
      blocks: [
        {
          type: "table",
          title: "Where things live",
          headers: ["Location", "Purpose"],
          rows: [
            [
              "~/.local/share/chess-coach/state.db",
              "Current game and complete move history",
            ],
            [
              "~/.local/share/chess-coach/preferences.json",
              "Your chosen UI language",
            ],
            [
              "~/.local/share/chess-coach/runtime/",
              "Installed service and engine",
            ],
            ["~/plugins/chess-coach/", "Personal plugin source"],
          ],
        },
        {
          type: "code",
          title: "Service controls",
          code: "npm run stop\nnpm run open",
          text: "Stop retains your save and language preference. Open prints the current board URL and position. Reopen the board through Codex after a service restart.",
        },
        {
          type: "faq",
          items: [
            {
              title: "The engine stopped responding. What now?",
              text: "Use the board’s retry action or ask Codex to retry the engine. Your move remains saved. If the service disconnected, ask Codex to open the board again; check service.log in the data directory for details.",
            },
            {
              title: "Will an update erase my game?",
              text: "No. The database and language preference are outside the runtime directory. Build and reinstall the plugin, then start a new Codex task to load the updated skills and tools.",
            },
            {
              title: "Can I keep several games?",
              text: "This version keeps one game. Export PGN before replacing it. There is no historical game library or online multiplayer.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Use `CHESS_COACH_DATA_DIR` to isolate development or tests from your saved game. A damaged database produces an error instead of silently starting over.",
        },
      ],
    },
    {
      id: "development",
      label: "Development & license",
      kicker: "For the curious",
      title: "Built to be understood.",
      summary:
        "React and TypeScript at the board. Node.js, chess.js, SQLite, and Stockfish behind it. A shared, versioned game state throughout.",
      blocks: [
        {
          type: "table",
          title: "The working toolkit",
          headers: ["Command", "Purpose"],
          rows: [
            [
              "npm run dev",
              "Build an isolated game in output/dev-data; no hot reload",
            ],
            ["npm run typecheck", "Check TypeScript"],
            ["npm run build", "Bundle the plugin and local engine resources"],
            ["npm test", "Run Vitest after building the bundles"],
            ["npm run test:browser", "Check both UI languages in Chromium"],
            ["npm run check", "Run the complete code validation sequence"],
            [
              "npm run docs:build",
              "Build this bilingual static handbook in output/docs",
            ],
            [
              "npm run docs:preview",
              "Rebuild and serve a local handbook preview",
            ],
          ],
        },
        {
          type: "code",
          title: "Update your local plugin",
          code: "npm run build\nnpm run install:local",
          text: "The installer refreshes the stable runtime and uses the supported cachebuster and reinstall flow. Start a new Codex task after updating.",
        },
        {
          type: "paragraph",
          text: "Original project code, documentation, and artwork use Apache License 2.0. Stockfish remains GPLv3; builds retain its license and copyright notices. Other dependencies keep their own licenses.",
        },
      ],
    },
  ],
};
