"use client";

import { useState } from "react";

export function SpeakButton() {
  const [loading, setLoading] = useState(false);

  async function handleSpeak() {
    setLoading(true);

    try {
      const response = await fetch("/http/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "White develops the knight and prepares kingside castling.",
        }),
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      await audio.play();
      URL.revokeObjectURL(audioUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleSpeak} disabled={loading}>
      {loading ? "Ses hazirlaniyor..." : "Dinle"}
    </button>
  );
}
