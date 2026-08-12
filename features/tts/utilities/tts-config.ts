export const TTS_ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
export const TTS_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
export const TTS_ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";
export const TTS_ELEVENLABS_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.8,
  style: 0.25,
  use_speaker_boost: true,
} as const;

export const TTS_KOKORO_URL = "https://xxneuralnexusxx-kokoro-tts-fastapi-1.hf.space/tts";
export const TTS_KOKORO_VOICE = "am_fenrir";
export const TTS_KOKORO_SPEED = 1.25;
export const TTS_KOKORO_OUTPUT_FORMAT = "mp3";
export const TTS_KOKORO_RETRY_ATTEMPTS = 4;
export const TTS_KOKORO_RETRY_DELAY_MS = 500;

export const TTS_CACHE_BUCKET = "tts-cache";
