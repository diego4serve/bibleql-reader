import type { AiAnswer } from "../renderer/src/types/ai";

export {};

declare global {
  interface Window {
    desktop: {
      platform: NodeJS.Platform;
      version: string;
    };
    ai: {
      ask(question: string, locale: "en" | "es", anthropicApiKey: string): Promise<AiAnswer>;
    };
  }
}
