import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const MODEL = "claude-sonnet-4-6";

export async function callClaude(prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  return block.text;
}
