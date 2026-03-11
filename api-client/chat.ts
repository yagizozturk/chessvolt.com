export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
  };
  
  export async function streamChatMessages(
    messages: ChatMessage[],
    prompt: string,
  ): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const res = await fetch("/http/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, prompt }), // We are sending messages to make AI remember past chat messages.
      });
  
      if (!res.ok) {
        console.error("Chat API error:", res.status, res.statusText);
        return null;
      }
  
      if (!res.body) {
        console.error("Chat API error: No response body");
        return null;
      }
  
      return res.body;
    } catch (error) {
      console.error("streamChatMessages error:", error);
      return null;
    }
  }
