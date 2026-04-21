import { useSound } from "@/lib/shared/hooks/use-sound";

const BOARD_SOUND_ASSETS = {
  correctMove: {
    src: "/audio/piece-correct-move-sound.mp3",
    volume: 1,
  },
  move: {
    src: "/audio/piece-move-sound.wav",
    volume: 0.5,
  },
} as const;

export function useBoardSounds() {
  const { play: playCorrectSound } = useSound(
    BOARD_SOUND_ASSETS.correctMove.src,
    BOARD_SOUND_ASSETS.correctMove.volume,
  );
  const { play: playMoveSound } = useSound(
    BOARD_SOUND_ASSETS.move.src,
    BOARD_SOUND_ASSETS.move.volume,
  );

  return { playCorrectSound, playMoveSound };
}
