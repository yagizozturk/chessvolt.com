import { isAdminClientConfigured } from "@/lib/supabase/admin";

import { getTtsCachePath } from "./tts-cache";
import { TTS_MODEL_ID, TTS_OUTPUT_FORMAT, TTS_VOICE_SETTINGS } from "./tts-config";
import { getCachedTtsAudio, saveCachedTtsAudio } from "./tts-storage";

export class TtsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsConfigError";
  }
}

export class TtsSynthesisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsSynthesisError";
  }
}

async function synthesizeWithElevenLabs(text: string, apiKey: string, voiceId: string) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${TTS_OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: TTS_MODEL_ID,
        voice_settings: TTS_VOICE_SETTINGS,
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.arrayBuffer();
}

/**
 * Resolve TTS audio: Storage cache hit → return; miss → ElevenLabs → upload → return.
 */
export async function resolveTtsAudio(text: string): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    throw new TtsConfigError("Missing ElevenLabs config");
  }

  const storagePath = isAdminClientConfigured() ? getTtsCachePath(text, voiceId) : null;

  if (storagePath) {
    const cachedAudio = await getCachedTtsAudio(storagePath);

    if (cachedAudio) {
      return cachedAudio;
    }
  }

  const audioBuffer = await synthesizeWithElevenLabs(text, apiKey, voiceId);

  if (!audioBuffer) {
    throw new TtsSynthesisError("ElevenLabs request failed");
  }

  if (storagePath) {
    try {
      await saveCachedTtsAudio(storagePath, audioBuffer);
    } catch (error) {
      console.error("Failed to cache TTS audio:", error);
    }
  }

  return audioBuffer;
}
