import { Field, FieldLabel } from "@/components/ui/field";
import {
  CONTENT_THEME_WEIGHTS,
  formatContentThemeWeightLabel,
  isContentThemeWeight,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: ContentThemeWeight;
  onChange: (value: ContentThemeWeight) => void;
  name?: string;
};

export function ContentThemeWeightSelect({ value, onChange, name = "weight" }: Props) {
  return (
    <Field>
      <FieldLabel>Weight (1–10)</FieldLabel>
      <select
        name={name}
        required
        value={String(value)}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (isContentThemeWeight(num)) onChange(num);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {CONTENT_THEME_WEIGHTS.map((weight) => (
          <option key={weight} value={weight}>
            {weight} — {formatContentThemeWeightLabel(weight)}
          </option>
        ))}
      </select>
      <p className="text-muted-foreground mt-1 text-xs">
        Higher weight = stronger link between content and theme (used for recommendations).
      </p>
    </Field>
  );
}
