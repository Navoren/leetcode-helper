import { z } from "zod";
import { callClaude } from "../lib/claude.js";

export const name = "get_approach";
export const description =
  "Takes a LeetCode problem statement and returns the recommended DSA approach, pattern name, and time/space complexity.";

export const schema = {
  problem: z.string().describe("The full LeetCode problem statement"),
};

export async function handler({ problem }: { problem: string }) {
  const prompt = `Analyze this LeetCode problem. Respond using ONLY these labels, no prose, max 6 lines total:

Pattern: <canonical DSA pattern name>
Approach: <strategy in ≤10 words>
Steps: <step1 → step2 → step3>
TC: O(?) — <reason in ≤5 words>
SC: O(?) — <reason in ≤5 words>
Why: <why this beats alternatives in ≤10 words>

Problem: ${problem}`;

  const text = await callClaude(prompt);
  return { content: [{ type: "text" as const, text }] };
}
