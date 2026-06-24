import { z } from "zod";
import { callClaude } from "../lib/claude.js";

export const name = "upsolve";
export const description =
  "Given a working but suboptimal solution, nudges the user toward a better approach without revealing it. Focuses on optimization, not correctness.";

export const schema = {
  problem: z.string().describe("The full LeetCode problem statement"),
  solution_code: z.string().describe("The user's current working solution"),
};

export async function handler({
  problem,
  solution_code,
}: {
  problem: string;
  solution_code: string;
}) {
  const prompt = `The user has a correct but suboptimal solution. Do NOT write code or reveal the optimized approach. Use ONLY these labels, max 5 lines:

Current: O(?) — <bottleneck in ≤6 words>
Bottleneck: <specific line or pattern causing the inefficiency>
Direction: <technique or data structure name only, no explanation>
Target: O(?) is achievable
Q: <one Socratic question to guide the next attempt>

Problem: ${problem}
Code:
${solution_code}`;

  const text = await callClaude(prompt);
  return { content: [{ type: "text" as const, text }] };
}
