// TODO: Refactor
import { Field, FieldLabel } from "@/components/ui/field";
import {
  formatThemeLinkKindLabel,
  isThemeLinkKind,
  THEME_LINK_KINDS,
  type ThemeLinkKind,
} from "@/features/theme-link/types/theme-link-kind";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: ThemeLinkKind;
  onChange: (value: ThemeLinkKind) => void;
  name?: string;
};

export function ThemeLinkKindSelect({ value, onChange, name = "kind" }: Props) {
  return (
    <Field>
      <FieldLabel>Content type</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => {
          if (isThemeLinkKind(e.target.value)) onChange(e.target.value);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {THEME_LINK_KINDS.map((kind) => (
          <option key={kind} value={kind}>
            {formatThemeLinkKindLabel(kind)}
          </option>
        ))}
      </select>
    </Field>
  );
}
