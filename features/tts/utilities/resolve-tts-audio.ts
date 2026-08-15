import { isAdminClientConfigured } from "@/lib/supabase/admin";

import { getTtsCachePath } from "./tts-cache";
import {
  TTS_ELEVENLABS_MODEL_ID,
  TTS_ELEVENLABS_OUTPUT_FORMAT,
  TTS_ELEVENLABS_URL,
  TTS_ELEVENLABS_VOICE_SETTINGS,
  TTS_KOKORO_RETRY_ATTEMPTS,
  TTS_KOKORO_RETRY_DELAY_MS,
  TTS_KOKORO_SPEED,
  TTS_KOKORO_URL,
  TTS_KOKORO_VOICE,
} from "./tts-config";
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function synthesizeWithKokoro(text: string): Promise<ArrayBuffer | null> {
  for (let attempt = 1; attempt <= TTS_KOKORO_RETRY_ATTEMPTS; attempt += 1) {
    const response = await fetch(TTS_KOKORO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice: TTS_KOKORO_VOICE,
        speed: TTS_KOKORO_SPEED,
        output_format: "mp3",
      }),
    });

    if (response.ok) {
      return response.arrayBuffer();
    }

    if (response.status !== 429 || attempt === TTS_KOKORO_RETRY_ATTEMPTS) {
      return null;
    }

    await sleep(TTS_KOKORO_RETRY_DELAY_MS * attempt);
  }

  return null;
}

async function synthesizeWithElevenLabs(text: string, apiKey: string, voiceId: string) {
  const response = await fetch(
    `${TTS_ELEVENLABS_URL}/${voiceId}?output_format=${TTS_ELEVENLABS_OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: TTS_ELEVENLABS_MODEL_ID,
        voice_settings: TTS_ELEVENLABS_VOICE_SETTINGS,
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.arrayBuffer();
}

/**
 * Resolve TTS audio: Storage cache hit → return; miss → Kokoro FastAPI → fallback ElevenLabs → return.
 */
export async function resolveTtsAudio(text: string): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  const kokoroStoragePath = isAdminClientConfigured()
    ? getTtsCachePath(text, TTS_KOKORO_VOICE, "kokoro")
    : null;

  if (kokoroStoragePath) {
    const cachedAudio = await getCachedTtsAudio(kokoroStoragePath);

    if (cachedAudio) {
      return cachedAudio;
    }
  }

  const kokoroAudio = await synthesizeWithKokoro(text);

  if (kokoroAudio) {
    if (kokoroStoragePath) {
      try {
        await saveCachedTtsAudio(kokoroStoragePath, kokoroAudio);
      } catch (error) {
        console.error("Failed to cache Kokoro TTS audio:", error);
      }
    }

    return kokoroAudio;
  }

  if (!apiKey || !voiceId) {
    throw new TtsConfigError("Missing ElevenLabs config and Kokoro TTS failed");
  }

  const elevenLabsStoragePath = isAdminClientConfigured()
    ? getTtsCachePath(text, voiceId, "elevenlabs")
    : null;

  if (elevenLabsStoragePath) {
    const cachedAudio = await getCachedTtsAudio(elevenLabsStoragePath);

    if (cachedAudio) {
      return cachedAudio;
    }
  }

  const audioBuffer = await synthesizeWithElevenLabs(text, apiKey, voiceId);

  if (!audioBuffer) {
    throw new TtsSynthesisError("Kokoro and ElevenLabs request failed");
  }

  if (elevenLabsStoragePath) {
    try {
      await saveCachedTtsAudio(elevenLabsStoragePath, audioBuffer);
    } catch (error) {
      console.error("Failed to cache ElevenLabs TTS audio:", error);
    }
  }

  return audioBuffer;
}
