import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MAX_RIDDLE_RATING,
  MIN_RIDDLE_RATING,
  parseRiddleRating,
} from "@/features/riddle/types/riddle-rating";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  name?: string;
};

export function RiddleRatingInput({ value, onChange, name = "rating" }: Props) {
  return (
    <Field>
      <FieldLabel>Rating</FieldLabel>
      <Input
        name={name}
        type="number"
        min={MIN_RIDDLE_RATING}
        max={MAX_RIDDLE_RATING}
        step={1}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value.trim();
          onChange(raw === "" ? null : parseRiddleRating(raw));
        }}
        placeholder={`${MIN_RIDDLE_RATING}–${MAX_RIDDLE_RATING}, leave empty for unrated`}
        className={cn("font-mono text-sm")}
      />
      <p className="text-muted-foreground text-xs">
        Chess rating between {MIN_RIDDLE_RATING} and {MAX_RIDDLE_RATING}. Optional.
      </p>
    </Field>
  );
}
