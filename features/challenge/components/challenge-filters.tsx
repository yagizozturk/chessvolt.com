import { Button } from "@/components/ui/button";

const LEVEL_OPTIONS = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type ChallengeFiltersProps = {
  gameTypeOptions: string[];
  selectedLevel: string;
  selectedGameType: string;
};

export function ChallengeFilters({ gameTypeOptions, selectedLevel, selectedGameType }: ChallengeFiltersProps) {
  return (
    <form className="bg-muted/50 flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center">
      <div className="md:w-56">
        <select
          id="challenge-level"
          name="level"
          defaultValue={selectedLevel}
          aria-label="Filter by level"
          className="border-input focus-visible:ring-primary/50 h-9 w-full rounded-xl border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-3"
        >
          {LEVEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="md:w-64">
        <select
          id="challenge-game-type"
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
