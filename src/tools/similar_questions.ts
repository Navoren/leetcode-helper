import { z } from "zod";
import { callClaude } from "../lib/claude.js";

export const name = "similar_questions";
export const description =
  "Given a LeetCode problem, returns 3-5 similar problems that reinforce the same DSA pattern.";

export const schema = {
  problem: z.string().describe("The full LeetCode problem statement"),
};

export async function handler({ problem }: { problem: string }) {
  const prompt = `Identify the DSA pattern in this problem, then list 3-5 LeetCode problems that reinforce it. Use ONLY this format, no prose:

Pattern: <name>

1. #<number> <Title> [Easy/Medium/Hard] — <what to focus on, ≤8 words>
2. #<number> <Title> [Easy/Medium/Hard] — <what to focus on, ≤8 words>
3. #<number> <Title> [Easy/Medium/Hard] — <what to focus on, ≤8 words>
(add 4th and 5th only if meaningfully distinct)

Problem: ${problem}`;

  const text = await callClaude(prompt);
  return { content: [{ type: "text" as const, text }] };
}
