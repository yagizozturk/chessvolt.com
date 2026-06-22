import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { parseRiddlePopularity } from "@/features/riddle/utilities/parse-riddle-popularity";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  name?: string;
};

export function RiddlePopularityInput({ value, onChange, name = "popularity" }: Props) {
  return (
    <Field>
      <FieldLabel>Popularity</FieldLabel>
      <Input
        name={name}
        type="number"
        step="any"
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value.trim();
          onChange(raw === "" ? null : parseRiddlePopularity(raw));
        }}
        placeholder="Leave empty for unset"
        className={cn("font-mono text-sm")}
      />
      <p className="text-muted-foreground text-xs">Optional numeric popularity score.</p>
    </Field>
  );
}
