import { Field, FieldLabel } from "@/components/ui/field";
import {
  RIDDLE_DIFFICULTIES,
  formatRiddleDifficultyLabel,
  type RiddleDifficulty,
} from "@/features/riddle/types/riddle-difficulty";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: RiddleDifficulty;
  onChange: (value: RiddleDifficulty) => void;
  name?: string;
};

export function RiddleDifficultySelect({ value, onChange, name = "difficulty" }: Props) {
  return (
    <Field>
      <FieldLabel>Difficulty</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => onChange(e.target.value as RiddleDifficulty)}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {RIDDLE_DIFFICULTIES.map((level) => (
          <option key={level} value={level}>
            {formatRiddleDifficultyLabel(level)}
          </option>
        ))}
      </select>
    </Field>
  );
}
