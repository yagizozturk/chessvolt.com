import { createAdminClient } from "@/lib/supabase/admin";

import { TTS_CACHE_BUCKET } from "./tts-config";

function isStorageNotFoundError(error: { message?: string; statusCode?: string }) {
  return error.statusCode === "404" || error.message?.toLowerCase().includes("not found");
}

export async function getCachedTtsAudio(storagePath: string): Promise<ArrayBuffer | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(TTS_CACHE_BUCKET).download(storagePath);

  if (error) {
    if (!isStorageNotFoundError(error)) {
      console.warn("TTS cache read failed, falling back to ElevenLabs:", error.message);
    }

    return null;
  }

  if (!data) {
    return null;
  }

  return data.arrayBuffer();
}

export async function saveCachedTtsAudio(storagePath: string, audio: ArrayBuffer): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(TTS_CACHE_BUCKET).upload(storagePath, audio, {
    contentType: "audio/mpeg",
    upsert: true,
  });

  if (error) {
    throw error;
  }
}
