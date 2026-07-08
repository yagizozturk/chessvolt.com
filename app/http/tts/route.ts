// TODO: Refactor
import { TtsConfigError, TtsSynthesisError, resolveTtsAudio } from "@/features/tts/utilities/resolve-tts-audio";

function audioResponse(audio: ArrayBuffer) {
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text) {
    return Response.json({ error: "Text is required" }, { status: 400 });
  }

  try {
    const audio = await resolveTtsAudio(text);
    return audioResponse(audio);
  } catch (error) {
    if (error instanceof TtsConfigError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof TtsSynthesisError) {
      return Response.json({ error: error.message }, { status: 502 });
    }

    console.error("TTS request failed:", error);
    return Response.json({ error: "TTS request failed" }, { status: 500 });
  }
}
