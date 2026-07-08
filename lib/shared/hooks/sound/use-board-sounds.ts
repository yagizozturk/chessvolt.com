// TODO: Refactor
import { useCallback } from "react";

import { useSound } from "@/lib/shared/hooks/sound/use-sound";
import { useBoardSoundsStore } from "@/lib/shared/store/board-sounds-store";

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
  hint: {
    src: "/audio/magic.mp3",
    volume: 1,
  },
  levelUp: {
    src: "/audio/level-up.mp3",
    volume: 1,
  },
} as const;

export function useBoardSounds() {
  const enabled = useBoardSoundsStore((s) => s.enabled);

  const { play: playMoveSoundRaw } = useSound(BOARD_SOUND_ASSETS.move.src, BOARD_SOUND_ASSETS.move.volume);
  const { play: playCorrectSoundRaw } = useSound(
    BOARD_SOUND_ASSETS.correctMove.src,
    BOARD_SOUND_ASSETS.correctMove.volume,
  );
  const { play: playWrongMoveSoundRaw } = useSound(
    BOARD_SOUND_ASSETS.wrongMove.src,
    BOARD_SOUND_ASSETS.wrongMove.volume,
  );
  const { play: playHintSoundRaw } = useSound(BOARD_SOUND_ASSETS.hint.src, BOARD_SOUND_ASSETS.hint.volume);
  const { play: playLevelUpSoundRaw } = useSound(BOARD_SOUND_ASSETS.levelUp.src, BOARD_SOUND_ASSETS.levelUp.volume);

  const gate = useCallback((play: () => void) => () => {
    if (enabled) play();
  }, [enabled]);

  return {
    playMoveSound: gate(playMoveSoundRaw),
    playCorrectSound: gate(playCorrectSoundRaw),
    playWrongMoveSound: gate(playWrongMoveSoundRaw),
    playHintSound: gate(playHintSoundRaw),
    playLevelUpSound: gate(playLevelUpSoundRaw),
    soundsEnabled: enabled,
  };
}
