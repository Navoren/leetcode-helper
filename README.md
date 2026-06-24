# leetcode-helper

An MCP server that gives structured, AI-powered DSA guidance inside Claude Desktop or Claude Code — approach analysis, hints, complexity breakdowns, and more, without spoiling the solution.

---

## Tools at a Glance

| Tool | Input | What it returns |
|---|---|---|
| `get_approach` | problem | Pattern, steps, TC/SC |
| `get_hint` | problem + where stuck | Nudge, no spoilers |
| `get_complexity` | problem + code | TC/SC breakdown per block |
| `post_solution` | problem + accepted code | Discussion post ready to copy |
| `similar_questions` | problem | 3–5 problems for the same pattern |
| `upsolve` | problem + working code | Optimization direction, not solution |

---

## Setup

**Prerequisites:** Node.js 18+, an `ANTHROPIC_API_KEY`

```bash
git clone https://github.com/Navoren/leetcode-helper.git
cd leetcode-helper
npm install
npm run build
```

---

## Connect to Claude Code

Add to `.claude/settings.json` (project or global):

```json
{
  "mcpServers": {
    "leetcode-helper": {
      "command": "node",
      "args": ["d:/leetcode-helper/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Connect to Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "leetcode-helper": {
      "command": "node",
      "args": ["/absolute/path/to/leetcode-helper/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

---

## Example Usage

**Getting an approach:**
> "Use get_approach on: Given an array of integers, return indices of two numbers that add up to target."

**Getting a hint when stuck:**
> "Use get_hint — problem: two sum, stuck on: my nested loop works but is too slow"

**Generating a discussion post:**
> "Use post_solution with my accepted Python solution for two sum"

**Upsolving:**
> "Use upsolve — here's my O(n²) solution, help me think toward better"

---

## Project Structure

```
leetcode-mcp/
├── src/
│   ├── index.ts               # Entry point
│   ├── server.ts              # McpServer setup
│   ├── lib/
│   │   └── claude.ts          # Anthropic API client
│   └── tools/
│       ├── registry.ts        # Registers all tools (one line per tool)
│       ├── get_approach.ts
│       ├── get_hint.ts
│       ├── get_complexity.ts
│       ├── post_solution.ts
│       ├── similar_questions.ts
│       └── upsolve.ts
├── dist/                      # Compiled output
├── functional_requirement.md
├── technical_document.md
└── CLAUDE.md
```

---

## Adding a New Tool

1. Create `src/tools/your_tool.ts` — export `name`, `description`, `schema` (Zod), `handler`
2. Add one import + one entry in `src/tools/registry.ts`
3. `npm run build`

No changes to `server.ts`, `index.ts`, or `claude.ts`.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js (ESM) |
| Language | TypeScript 5 |
| MCP SDK | `@modelcontextprotocol/sdk` |
| Schema validation | Zod |
| LLM | Anthropic `claude-sonnet-4-6` |
| Transport | stdio |
