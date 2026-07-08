// TODO: Refactor
import { useSound } from "./use-sound";

export function useAchievementSound() {
  const { play: playAchievementSound } = useSound("/audio/achievement.mp3", 1);
  return { playAchievementSound };
}
