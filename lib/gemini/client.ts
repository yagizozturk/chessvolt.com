// TODO: Refactor
import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return apiKey;
}

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export async function geminiChat(params: { system: string; user: string; json?: boolean }): Promise<string> {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  const model = genAI.getGenerativeModel({
    model: getGeminiModel(),
    systemInstruction: params.system,
    ...(params.json ? { generationConfig: { responseMimeType: "application/json" } } : {}),
  });

  let result;
  try {
    result = await model.generateContent(params.user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini request failed";
    throw new Error(`Gemini request failed: ${message}`);
  }

  const content = result.response.text()?.trim();
  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return content;
}
