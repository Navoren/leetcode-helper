import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as getApproach from "./get_approach.js";
import * as getHint from "./get_hint.js";
import * as getComplexity from "./get_complexity.js";
import * as postSolution from "./post_solution.js";
import * as similarQuestions from "./similar_questions.js";
import * as upsolve from "./upsolve.js";

// To add a new tool: import it above and push it into this array.
const tools = [
  getApproach,
  getHint,
  getComplexity,
  postSolution,
  similarQuestions,
  upsolve,
];

export function registerTools(server: McpServer): void {
  for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.schema, tool.handler);
  }
}
