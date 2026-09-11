import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { operations } from "./operations.js";
import { callService } from "./runtime.js";
const server = new McpServer({ name: "chess-coach", version: "0.1.0" });
for (const [name, definition] of Object.entries(operations)) {
  const readOnly = [
    "show_board",
    "get_game",
    "analyze_position",
    "export_pgn",
  ].includes(name);
  server.registerTool(
    name,
    {
      description: definition.description,
      inputSchema: definition.shape,
      annotations: {
        readOnlyHint: readOnly,
        destructiveHint: name === "new_game",
        openWorldHint: false,
        idempotentHint: readOnly,
      },
    },
    async (args: Record<string, unknown>) => {
      try {
        const reply = await callService(name, args);
        if (reply.error)
          return {
            isError: true,
            content: [
              { type: "text" as const, text: JSON.stringify(reply.error) },
            ],
          };
        return {
          structuredContent: reply.result as Record<string, unknown>,
          content: [
            { type: "text" as const, text: JSON.stringify(reply.result) },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: error instanceof Error ? error.message : String(error),
            },
          ],
        };
      }
    },
  );
}
await server.connect(new StdioServerTransport());
