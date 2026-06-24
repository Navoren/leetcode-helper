# Technical Document — leetcode-helper MCP Server

---

## 1. System Overview

`leetcode-helper` is a **Model Context Protocol (MCP) server** written in TypeScript. It exposes six DSA-guidance tools to any MCP-compatible client (Claude Desktop, Claude Code IDE). Each tool call translates into a tightly-structured prompt sent to Claude via the Anthropic API, and the response is returned back through the MCP protocol.

The server is **stateless** — no session, no database, no filesystem writes. Every tool invocation is a self-contained prompt → response cycle.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Client                               │
│          Claude Desktop  /  Claude Code IDE Extension           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    MCP Protocol over stdio
                  (JSON-RPC 2.0 — ListTools / CallTool)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  leetcode-helper MCP Server                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    McpServer (SDK)                       │    │
│  │   Handles MCP handshake, capability negotiation,         │    │
│  │   tool listing, and call dispatch automatically          │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                              │ routes by tool name               │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                    Tool Registry                          │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌────────────────────┐  │   │
│  │  │get_approach │  │ get_hint │  │   get_complexity   │  │   │
│  │  └─────────────┘  └──────────┘  └────────────────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────────┐  ┌──────────┐   │   │
│  │  │post_solution │  │similar_questions │  │ upsolve  │   │   │
│  │  └──────────────┘  └──────────────────┘  └──────────┘   │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │ callClaude(prompt)                │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                  lib/claude.ts                            │   │
│  │         Anthropic SDK client — singleton instance         │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    HTTPS — Anthropic Messages API
                               │
                               ▼
               ┌───────────────────────────────┐
               │     Claude claude-sonnet-4-6        │
               │  (claude-sonnet-4-6)          │
               └───────────────────────────────┘
```

---

## 3. Request Lifecycle

```
User invokes tool in Claude client
         │
         ▼
MCP Client sends CallToolRequest (JSON-RPC over stdio)
         │
         ▼
McpServer receives request
  → validates args against Zod schema
  → routes to the matching tool handler
         │
         ▼
Tool handler builds a structured prompt
  → injects user args into the prompt template
         │
         ▼
callClaude(prompt) → Anthropic Messages API
  → model: claude-sonnet-4-6
  → max_tokens: 1024
         │
         ▼
Response text extracted from first content block
         │
         ▼
Returned as { content: [{ type: "text", text }] }
  → McpServer wraps into CallToolResponse
  → sent back over stdio to MCP client
         │
         ▼
Claude client displays the response to the user
```

---

## 4. Component Breakdown

### `src/index.ts` — Entry Point
- Instantiates the server via `createServer()`
- Connects `StdioServerTransport`
- Single responsibility: boot and bind

### `src/server.ts` — Server Factory
- Creates `McpServer` instance with name + version
- Calls `registerTools(server)` to wire all tools
- Returns the configured server — transport-agnostic

### `src/lib/claude.ts` — API Client
- Holds the single `Anthropic` client instance
- Exports `callClaude(prompt): Promise<string>`
- Centralizes model name and `max_tokens` — one place to change
- All tools share this; no duplicate client setup

### `src/tools/registry.ts` — Tool Registration
- Imports every tool module
- Iterates and calls `server.tool(name, description, schema, handler)` for each
- **The only file that changes when adding a new tool**

### `src/tools/*.ts` — Individual Tools
Each tool file is self-contained and exports exactly four things:

| Export | Type | Purpose |
|---|---|---|
| `name` | `string` | Tool identifier used by the MCP client |
| `description` | `string` | Shown to the LLM to decide when to call this tool |
| `schema` | `ZodRawShape` | Validates and types the incoming arguments |
| `handler` | `async (args) => { content }` | Builds the prompt and calls Claude |

---

## 5. Technology Decisions

| Decision | Choice | Why |
|---|---|---|
| MCP SDK class | `McpServer` (high-level) | Handles tool listing, dispatch, schema validation automatically. `Server` (low-level) is deprecated |
| Schema library | Zod | MCP SDK's `tool()` accepts Zod shapes natively; gives typed handler args for free |
| Module system | ESM (`"type": "module"`) | Required by MCP SDK; `NodeNext` resolution for `.js` imports from `.ts` source |
| Transport | stdio | Standard MCP transport; works with Claude Desktop and Claude Code out of the box |
| Model | `claude-sonnet-4-6` | Best balance of reasoning quality and latency for DSA analysis |
| Prompt strategy | Labeled, max-line format | Forces Claude to return structured, scannable output instead of prose |

---

## 6. Extension Pattern

To add a new tool:

```
1. Create  src/tools/new_tool.ts
           └── export: name, description, schema, handler

2. Edit    src/tools/registry.ts
           └── import * as newTool from "./new_tool.js"
           └── add newTool to the tools array

3. Run     npm run build
```

Zero changes to `server.ts`, `index.ts`, or `lib/claude.ts`.

---

## 7. Key Design Properties

**Stateless** — No memory between calls. Each tool invocation is independent. Safe to restart anytime.

**Single model call per tool** — No chaining, no multi-turn. One prompt in, one response out. Latency is predictable.

**Prompt as contract** — Each tool's prompt enforces a strict output format using labels and line limits. The structure is part of the tool's specification, not an afterthought.

**No LeetCode integration** — Problem statements are user-supplied. No scraping, no auth, no rate-limit surface. Beat % for `post_solution` is estimated from algorithm class, not fetched.
