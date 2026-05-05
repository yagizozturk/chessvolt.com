export async function getTTS(text: string) {
  const response = await fetch("/http/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("TTS request failed");
  }

  return response.blob();
}