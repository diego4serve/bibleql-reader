import { ipcMain } from "electron";
import { generateObject, NoObjectGeneratedError } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export interface AiReference {
  ref: string;
  why: string;
}

export interface AiAnswer {
  answer: string;
  references: AiReference[];
}

export interface AskAiArgs {
  question: string;
  locale: "en" | "es";
  anthropicApiKey: string;
}

const AiAnswerSchema = z.object({
  answer: z.string(),
  references: z.array(z.object({ ref: z.string(), why: z.string() }))
});

function buildSystemPrompt(locale: "en" | "es"): string {
  const es = locale === "es";
  return (
    "You are a careful Bible study assistant inside a Bible reading app. Answer in " +
    (es ? "Spanish" : "English") +
    ". Be concise (120 words maximum), grounded in the biblical text, and note when " +
    "faithful traditions read a passage differently instead of asserting one view. Reply with structured data: " +
    "an answer and 2 to 5 references. Each reference's `ref` must be a plain reference like " +
    `"${es ? "Mateo 18:21-22" : "Matthew 18:21-22"}" using ${es ? "Spanish" : "English"} book names.`
  );
}

function describeAiError(err: unknown): string {
  if (NoObjectGeneratedError.isInstance(err)) {
    return "The assistant's reply didn't match the expected format. Try rephrasing.";
  }
  const statusCode = (err as { statusCode?: number }).statusCode;
  if (statusCode === 401 || statusCode === 403) return "The Anthropic API key was rejected.";
  if (statusCode === 429) return "Rate limited by Anthropic. Try again in a moment.";
  const message = (err as { message?: string }).message;
  return message || "The AI assistant request failed.";
}

export function registerAiHandlers(): void {
  ipcMain.handle("ai:ask", async (_event, args: AskAiArgs): Promise<AiAnswer> => {
    const { question, locale, anthropicApiKey } = args;
    if (!anthropicApiKey?.trim()) {
      throw new Error("No Anthropic API key configured. Add one in the key dialog.");
    }
    const anthropic = createAnthropic({ apiKey: anthropicApiKey });
    try {
      const { object } = await generateObject({
        model: anthropic("claude-sonnet-5"),
        schema: AiAnswerSchema,
        system: buildSystemPrompt(locale),
        prompt: question
      });
      return object;
    } catch (err) {
      throw new Error(describeAiError(err));
    }
  });
}
