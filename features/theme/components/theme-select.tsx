// TODO: Refactor
import { Field, FieldLabel } from "@/components/ui/field";
import type { Theme } from "@/features/theme/types/theme";
import { cn } from "@/lib/utils/cn";

type Props = {
  themes: Theme[];
  value: string;
  onChange: (themeId: string) => void;
  name?: string;
};

export function ThemeSelect({ themes, value, onChange, name = "themeId" }: Props) {
  return (
    <Field>
      <FieldLabel>Theme</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        <option value="" disabled>
          Select a theme
        </option>
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.title} ({theme.slug})
          </option>
        ))}
      </select>
    </Field>
  );
}
