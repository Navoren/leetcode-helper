{"model": "claude-sonnet-4-6"}

# leetcode-helper

MCP server — 6 DSA guidance tools backed by Claude. Stateless, stdio transport.

## Build & run

```bash
npm install && npm run build
node dist/index.js        # requires ANTHROPIC_API_KEY in env
```

## Tools

| Tool | Args |
|---|---|
| `get_approach` | problem |
| `get_hint` | problem, stuck_on |
| `get_complexity` | problem, solution_code |
| `post_solution` | problem, solution_code, language? |
| `similar_questions` | problem |
| `upsolve` | problem, solution_code |

## Adding a tool

1. `src/tools/your_tool.ts` — export `name`, `description`, `schema` (Zod), `handler`
2. `src/tools/registry.ts` — import it, add to the `tools` array
3. `npm run build`

## Key files

- `src/lib/claude.ts` — model name + `callClaude()` wrapper
- `src/tools/registry.ts` — single source of truth for all tools
- `src/server.ts` — McpServer wiring, no logic
