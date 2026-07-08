// TODO: Refactor
import { Field, FieldLabel } from "@/components/ui/field";
import {
  formatThemeLinkWeightLabel,
  isThemeLinkWeight,
  THEME_LINK_WEIGHTS,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: ThemeLinkWeight;
  onChange: (value: ThemeLinkWeight) => void;
  name?: string;
};

export function ThemeLinkWeightSelect({ value, onChange, name = "weight" }: Props) {
  return (
    <Field>
      <FieldLabel>Weight (1–10)</FieldLabel>
      <select
        name={name}
        required
        value={String(value)}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (isThemeLinkWeight(num)) onChange(num);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {THEME_LINK_WEIGHTS.map((weight) => (
          <option key={weight} value={weight}>
            {weight} — {formatThemeLinkWeightLabel(weight)}
          </option>
        ))}
      </select>
      <p className="text-muted-foreground mt-1 text-xs">
        Higher weight = stronger link between content and theme (used for recommendations).
      </p>
    </Field>
  );
}
