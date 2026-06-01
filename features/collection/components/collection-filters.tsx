import { Button } from "@/components/ui/button";
import {
  RIDDLE_DIFFICULTY_LEVELS,
  formatRiddleDifficultyLabel,
} from "@/features/riddle/types/riddle-difficulty";

export const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All difficulties" },
  ...RIDDLE_DIFFICULTY_LEVELS.map((difficulty) => ({
    value: String(difficulty),
    label: `${difficulty} — ${formatRiddleDifficultyLabel(difficulty)}`,
  })),
];

type CollectionFiltersProps = {
  gameTypeOptions: string[];
  selectedDifficulty: string;
  selectedGameType: string;
};

export function CollectionFilters({
  gameTypeOptions,
  selectedDifficulty,
  selectedGameType,
}: CollectionFiltersProps) {
  return (
    <form className="bg-muted/50 flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center">
      <div className="md:w-56">
        <select
          id="collection-difficulty"
          name="difficulty"
          defaultValue={selectedDifficulty}
          aria-label="Filter by difficulty"
          className="border-input focus-visible:ring-primary/50 h-9 w-full rounded-xl border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-3"
        >
          {DIFFICULTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="md:w-64">
        <select
          id="collection-game-type"
          name="gameType"
          defaultValue={selectedGameType}
          aria-label="Filter by game type"
          className="border-input focus-visible:ring-primary/50 h-9 w-full rounded-xl border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-3"
        >
          <option value="all">All game types</option>
          {gameTypeOptions.map((gameType) => (
            <option key={gameType} value={gameType}>
              {gameType}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end md:ml-auto">
        <Button type="submit" variant="volt">
          Apply
        </Button>
      </div>
    </form>
  );
}
