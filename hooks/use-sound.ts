import { useRef, useEffect } from "react";

export function useSound(src: string, volume: number = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.preload = "auto";
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [src, volume]);

  const play = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return { play };
}