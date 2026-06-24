import { z } from "zod";
import { callClaude } from "../lib/claude.js";

export const name = "post_solution";
export const description =
  "Takes a user's accepted solution and generates a structured LeetCode discussion post with approach, complexity, estimated beat %, and why it's better than brute force.";

export const schema = {
  problem: z.string().describe("The full LeetCode problem statement"),
  solution_code: z.string().describe("The user's accepted solution code"),
  language: z
    .string()
    .optional()
    .describe("Programming language, e.g. Python, Java (auto-detected if omitted)"),
};

export async function handler({
  problem,
  solution_code,
  language,
}: {
  problem: string;
  solution_code: string;
  language?: string;
}) {
  const lang = language ?? "auto-detect";
  const prompt = `Write a LeetCode discussion post for this solution. Use ONLY these labels, max 6 lines, no filler prose:

Intuition: <core idea in ≤12 words>
Approach: <step1 → step2 → step3>
TC: O(?) | SC: O(?)
Beat%: ~X% estimated — <algorithm class reason, e.g. "single-pass hash map"> (note: actual % requires submission)
vs Brute: <what brute does> → <what this does differently in ≤10 words>
Edge cases: <any notable ones, or "none">

Language: ${lang}
Problem: ${problem}
Code:
${solution_code}`;

  const text = await callClaude(prompt);
  return { content: [{ type: "text" as const, text }] };
}
