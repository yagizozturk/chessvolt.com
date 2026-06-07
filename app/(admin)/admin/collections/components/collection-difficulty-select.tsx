import { Field, FieldLabel } from "@/components/ui/field";
import {
  COLLECTION_DIFFICULTY_LEVELS,
  formatCollectionDifficultyLabel,
  isCollectionDifficulty,
  type CollectionDifficulty,
} from "@/features/collection/types/collection-difficulty";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: CollectionDifficulty;
  onChange: (value: CollectionDifficulty) => void;
  name?: string;
};

export function CollectionDifficultySelect({ value, onChange, name = "difficulty" }: Props) {
  return (
    <Field>
      <FieldLabel>Difficulty</FieldLabel>
      <select
        name={name}
        required
        value={String(value)}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (isCollectionDifficulty(num)) onChange(num);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {COLLECTION_DIFFICULTY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level} — {formatCollectionDifficultyLabel(level)}
          </option>
        ))}
      </select>
    </Field>
  );
}
