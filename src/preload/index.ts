import { contextBridge, ipcRenderer } from "electron";
import type { AiAnswer, AskAiArgs } from "../renderer/src/types/ai";

contextBridge.exposeInMainWorld("desktop", {
  platform: process.platform,
  version: process.versions.electron
});

contextBridge.exposeInMainWorld("ai", {
  ask: (question: string, locale: "en" | "es", anthropicApiKey: string): Promise<AiAnswer> =>
    ipcRenderer.invoke("ai:ask", { question, locale, anthropicApiKey } satisfies AskAiArgs)
});
