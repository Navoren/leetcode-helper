import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/registry.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "leetcode-helper",
    version: "1.0.0",
  });

  registerTools(server);

  return server;
}
