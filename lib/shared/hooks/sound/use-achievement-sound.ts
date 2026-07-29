// TODO: Refactor
import { useSound } from "./use-sound";

export function useAchievementSound() {
  const { play: playAchievementSound } = useSound("/audio/sound-level-up.mp3", 1);
  return { playAchievementSound };
}
