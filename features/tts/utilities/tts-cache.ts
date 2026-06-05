import { createHash } from "crypto";

import { TTS_MODEL_ID, TTS_OUTPUT_FORMAT, TTS_VOICE_SETTINGS } from "./tts-config";

/** Normalize text so minor spacing/casing differences reuse the same cache file. */
export function normalizeTtsText(text: string) {
  return text.trim().toLowerCase();
}

/** Stable hash for a given script + voice + synthesis settings. */
export function getTtsCacheKey(text: string, voiceId: string) {
  const payload = [
    normalizeTtsText(text),
    voiceId,
    TTS_MODEL_ID,
    TTS_OUTPUT_FORMAT,
    JSON.stringify(TTS_VOICE_SETTINGS),
  ].join("|");

  return createHash("sha256").update(payload).digest("hex");
}

/** Storage object path inside the `tts-cache` bucket. */
export function getTtsCachePath(text: string, voiceId: string) {
  return `tts/${getTtsCacheKey(text, voiceId)}.mp3`;
}
