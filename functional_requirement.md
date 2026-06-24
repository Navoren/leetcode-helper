# Functional Requirements — leetcode-helper MCP Server

## 1. Purpose

A Model Context Protocol (MCP) server that integrates with Claude-based clients to provide structured, AI-powered DSA guidance for LeetCode practice — without replacing the thinking, only directing it.

---

## 2. Actors

| Actor | Description |
|---|---|
| **User** | Developer solving LeetCode problems in a Claude-enabled IDE or chat client |
| **MCP Client** | Claude Desktop, Claude Code, or any MCP-compatible host |
| **Claude API** | Backend LLM (`claude-sonnet-4-6`) that processes all tool prompts |

---

## 3. Functional Requirements

### FR-1 — `get_approach`
- **Input:** Problem statement (string)
- **Output:** Pattern name, strategy, algorithm steps, TC, SC, and why this approach wins
- **Constraint:** Must name the canonical DSA pattern (e.g. Sliding Window, Two Pointers, BFS)
- **Format:** Labeled, max 6 lines — no prose

### FR-2 — `get_hint`
- **Input:** Problem statement + description of where user is stuck
- **Output:** Key missing insight, Socratic question, one concrete hint, next action
- **Constraint:** Must NOT write code or reveal the solution
- **Format:** 4 labeled lines — Missing / Q / Hint / Next

### FR-3 — `get_complexity`
- **Input:** Problem statement + user's solution code
- **Output:** Time and space complexity with per-block breakdown; optimization flag
- **Constraint:** Must identify the dominant term and explain why
- **Format:** TC / SC / per-section breakdown / Optimize label

### FR-4 — `post_solution`
- **Input:** Problem statement + accepted solution code + optional language
- **Output:** Discussion-ready post — intuition, approach, TC/SC, estimated beat %, brute force comparison, edge cases
- **Constraint:** Beat % must be labeled as estimated (cannot query LeetCode runtime stats)
- **Format:** 6 labeled lines suitable for copy-paste to LeetCode Discuss

### FR-5 — `similar_questions`
- **Input:** Problem statement
- **Output:** 3–5 LeetCode problems reinforcing the same pattern, each with number, title, difficulty, and focus area
- **Constraint:** Problems must be meaningfully distinct (not just restatements)
- **Format:** Pattern label + numbered list

### FR-6 — `upsolve`
- **Input:** Problem statement + user's current working (but suboptimal) solution
- **Output:** Current complexity, bottleneck location, direction (technique name only), target complexity, Socratic question
- **Constraint:** Must NOT write the optimized code or name the full algorithm — hint only
- **Format:** 5 labeled lines — Current / Bottleneck / Direction / Target / Q

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | Each tool must respond in < 3 seconds under normal Anthropic API latency |
| NFR-2 | Responses must be deterministic in structure (same labels every call) |
| NFR-3 | No user data is persisted — every call is stateless |
| NFR-4 | Server must stay alive across multiple sequential tool calls in one session |
| NFR-5 | New tools must be addable without modifying server or transport code |

---

## 5. Constraints & Assumptions

- LeetCode runtime/memory beat percentages cannot be fetched at runtime — estimates only
- No LeetCode authentication or scraping — problem statements are user-supplied
- All LLM calls use `claude-sonnet-4-6`; model is configurable via `lib/claude.ts`
- Transport is stdio only (MCP standard); no HTTP transport in scope
