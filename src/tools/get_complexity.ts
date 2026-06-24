import { z } from "zod";
import { callClaude } from "../lib/claude.js";

export const name = "get_complexity";
export const description =
  "Takes a LeetCode problem and the user's solution code, returns time and space complexity analysis with explanation.";

export const schema = {
  problem: z.string().describe("The full LeetCode problem statement"),
  solution_code: z.string().describe("The user's solution code to analyze"),
};

export async function handler({
  problem,
  solution_code,
}: {
  problem: string;
  solution_code: string;
}) {
  const prompt = `Analyze complexity of this solution. Respond using ONLY these labels, max 6 lines:

TC: O(?) — <dominant term reason in ≤6 words>
  Loop/block breakdown: <section>: O(?) | <section>: O(?)
SC: O(?) — <reason in ≤6 words>
  Space breakdown: <structure>: O(?) | <structure>: O(?)
Optimize: Yes — <one technique to explore> | No

Problem: ${problem}
Code:
${solution_code}`;

  const text = await callClaude(prompt);
  return { content: [{ type: "text" as const, text }] };
}
