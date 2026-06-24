export type OllamaChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

function getOllamaBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL?.trim() || "http://127.0.0.1:11434";
}

export function getOllamaModel(): string {
  const model = process.env.OLLAMA_MODEL?.trim();
  if (!model) {
    throw new Error("OLLAMA_MODEL is not configured");
  }
  return model;
}

export async function ollamaChat(params: {
  messages: OllamaChatMessage[];
  format?: "json";
}): Promise<string> {
  const response = await fetch(`${getOllamaBaseUrl()}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: getOllamaModel(),
      stream: false,
      format: params.format,
      messages: params.messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as OllamaChatResponse;
  const content = data.message?.content?.trim();
  if (!content) {
    throw new Error("Ollama returned an empty response");
  }

  return content;
}
