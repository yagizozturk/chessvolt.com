"use client";

import { useState, useCallback } from "react";
import { streamChatMessages, type ChatMessage } from "@/lib/api/chat"; // Calls for the api and returns stream.

export function useChatStream(
  initialMessage?: string,
) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessage
      ? [{ role: "assistant", content: initialMessage }]
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Without useCallback, a new function is created on every render.
  const sendMessage = useCallback( // useCallback preserves same function reference until dependencies change.
    async (prompt: string) => {
      if (isLoading) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: "Why did you suggest this move? Explain please.",
      };

      const newMessages = [...messages, userMessage]; // Create new message list. Copy all from messages, then append userMessage.
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);

      // Add empty assistant message for streaming
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]); // Add empty assistant message. It will update as stream arrives.
      
      try {
        const stream = await streamChatMessages(newMessages, prompt);

        if (!stream) {
          throw new Error("Failed to get stream");
        }

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantText += chunk;

          // Update the last message with accumulated text
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantText,
              };
            }
            return updated;
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        // Remove the empty assistant message on error
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const reset = useCallback(() => {
    setMessages(
      initialMessage ? [{ role: "assistant", content: initialMessage }] : []
    );
    setError(null);
  }, [initialMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    reset,
  };
}

