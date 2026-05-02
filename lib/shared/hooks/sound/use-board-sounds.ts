import { useSound } from "@/lib/shared/hooks/sound/use-sound";

const BOARD_SOUND_ASSETS = {
  move: {
    src: "/audio/piece-move-sound.wav",
    volume: 0.5,
  },
  correctMove: {
    src: "/audio/correct-move.mp3",
    volume: 1,
  },
  wrongMove: {
    src: "/audio/incorrect-move.wav",
    volume: 0.5,
  },
} as const;

export function useBoardSounds() {
  const { play: playMoveSound } = useSound(BOARD_SOUND_ASSETS.move.src, BOARD_SOUND_ASSETS.move.volume);
  const { play: playCorrectSound } = useSound(
    BOARD_SOUND_ASSETS.correctMove.src,
    BOARD_SOUND_ASSETS.correctMove.volume,
  );
  const { play: playWrongMoveSound } = useSound(BOARD_SOUND_ASSETS.wrongMove.src, BOARD_SOUND_ASSETS.wrongMove.volume);

  return { playMoveSound, playCorrectSound, playWrongMoveSound };
}
