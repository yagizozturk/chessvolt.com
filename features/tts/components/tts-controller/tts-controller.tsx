"use client";

import { useEffect, useRef } from "react";

import { getTTS } from "@/features/tts/api/tts";

type TTSControllerProps = {
  text: string;
};

export function TTSController({ text }: TTSControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!text.trim()) return;

    let cancelled = false;

    const playText = async () => {
      const currentAudio = audioRef.current;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const audioBlob = await getTTS(text);
      if (cancelled) return;

      const audioUrl = URL.createObjectURL(audioBlob);
      objectUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      await audio.play();
    };

    void playText();

    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [text]);

  return null;
}
