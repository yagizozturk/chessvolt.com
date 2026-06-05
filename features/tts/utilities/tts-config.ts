export const TTS_MODEL_ID = "eleven_multilingual_v2";

export const TTS_OUTPUT_FORMAT = "mp3_44100_128";

export const TTS_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.8,
  style: 0.25,
  use_speaker_boost: true,
} as const;

export const TTS_CACHE_BUCKET = "tts-cache";
