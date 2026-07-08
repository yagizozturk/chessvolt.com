// TODO: Refactor
import { Field, FieldLabel } from "@/components/ui/field";
import {
  formatThemeCategoryLabel,
  isThemeCategory,
  THEME_CATEGORIES,
  type ThemeCategory,
} from "@/features/theme/types/theme-category";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: ThemeCategory;
  onChange: (value: ThemeCategory) => void;
  name?: string;
};

export function ThemeCategorySelect({ value, onChange, name = "category" }: Props) {
  return (
    <Field>
      <FieldLabel>Category</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => {
          if (isThemeCategory(e.target.value)) onChange(e.target.value);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {THEME_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {formatThemeCategoryLabel(category)}
          </option>
        ))}
      </select>
    </Field>
  );
}
