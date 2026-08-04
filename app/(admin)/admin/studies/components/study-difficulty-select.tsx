import { Field, FieldLabel } from "@/components/ui/field";
import { STUDY_DIFFICULTY_LEVELS } from "@/features/study/constants/study-difficulty.constants";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";
import {
  formatStudyDifficultyLabel,
  isStudyDifficulty,
} from "@/features/study/utilities/study-difficulty.utils";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: StudyDifficulty;
  onChange: (value: StudyDifficulty) => void;
  name?: string;
};

export function StudyDifficultySelect({ value, onChange, name = "difficulty" }: Props) {
  return (
    <Field>
      <FieldLabel>Difficulty</FieldLabel>
      <select
        name={name}
        required
        value={String(value)}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (isStudyDifficulty(num)) onChange(num);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {STUDY_DIFFICULTY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level} — {formatStudyDifficultyLabel(level)}
          </option>
        ))}
      </select>
    </Field>
  );
}
