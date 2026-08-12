import { createHash } from "crypto";

import {
  TTS_ELEVENLABS_MODEL_ID,
  TTS_ELEVENLABS_OUTPUT_FORMAT,
  TTS_ELEVENLABS_VOICE_SETTINGS,
  TTS_KOKORO_OUTPUT_FORMAT,
  TTS_KOKORO_SPEED,
} from "./tts-config";

export type TtsProvider = "kokoro" | "elevenlabs";

/** Normalize text so minor spacing/casing differences reuse the same cache file. */
export function normalizeTtsText(text: string) {
  return text.trim().toLowerCase();
}

/** Stable hash for a given provider + script + voice + synthesis settings. */
export function getTtsCacheKey(
  text: string,
  voiceId: string,
  provider: TtsProvider = "elevenlabs",
) {
  const payload = [
    "tts-v1",
    provider,
    normalizeTtsText(text),
    voiceId,
    provider === "kokoro" ? "kokoro" : TTS_ELEVENLABS_MODEL_ID,
    provider === "kokoro" ? TTS_KOKORO_OUTPUT_FORMAT : TTS_ELEVENLABS_OUTPUT_FORMAT,
    provider === "kokoro"
      ? JSON.stringify({ speed: TTS_KOKORO_SPEED, output_format: TTS_KOKORO_OUTPUT_FORMAT })
      : JSON.stringify(TTS_ELEVENLABS_VOICE_SETTINGS),
  ].join("|");

  return createHash("sha256").update(payload).digest("hex");
}

/** Storage object path inside the `tts-cache` bucket. */
export function getTtsCachePath(
  text: string,
  voiceId: string,
  provider: TtsProvider = "elevenlabs",
) {
  return `tts/${provider}/${getTtsCacheKey(text, voiceId, provider)}.mp3`;
}
