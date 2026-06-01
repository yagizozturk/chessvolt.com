import { Field, FieldLabel } from "@/components/ui/field";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import { cn } from "@/lib/utils/cn";

type Props = {
  options: OnboardingOptionWithQuestion[];
  value: string;
  onChange: (optionId: string) => void;
  name?: string;
};

export function OnboardingOptionSelect({ options, value, onChange, name = "optionId" }: Props) {
  return (
    <Field>
      <FieldLabel>Onboarding option</FieldLabel>
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
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label} — {option.question.title}
          </option>
        ))}
      </select>
    </Field>
  );
}
