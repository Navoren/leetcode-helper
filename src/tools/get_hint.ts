import { z } from "zod";
import { callClaude } from "../lib/claude.js";

export const name = "get_hint";
export const description =
  "Takes a LeetCode problem and where the user is stuck, returns a targeted nudge without revealing the solution.";

export const schema = {
  problem: z.string().describe("The full LeetCode problem statement"),
  stuck_on: z
    .string()
    .describe("What the user is struggling with or where they are blocked"),
};

export async function handler({
  problem,
  stuck_on,
}: {
  problem: string;
  stuck_on: string;
}) {
  const prompt = `DSA mentor. Do NOT write code or reveal the solution. Respond using ONLY these labels, max 4 lines:

Missing: <key insight they haven't seen, ≤10 words>
Q: <one Socratic question to nudge them>
Hint: <data structure or single step, no code>
Next: <one concrete action to take>

Problem: ${problem}
Stuck on: ${stuck_on}`;

  const text = await callClaude(prompt);
  return { content: [{ type: "text" as const, text }] };
}
