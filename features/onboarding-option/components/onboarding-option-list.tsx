import { OnboardingOptionCard } from "@/features/onboarding-option/components/onboarding-option-card";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";

type OnboardingOptionListProps = {
  options: OnboardingOption[];
  selectedValues?: string[];
  onSelect?: (option: OnboardingOption) => void;
  disabled?: boolean;
  multiple?: boolean;
};

export function OnboardingOptionList({
  options,
  selectedValues = [],
  onSelect,
  disabled = false,
  multiple = false,
}: OnboardingOptionListProps) {
  if (options.length === 0) {
    return <p className="text-muted-foreground text-sm">No options available.</p>;
  }

  const selectedValueSet = new Set(selectedValues);

  return (
    <ul className="grid gap-3 sm:grid-cols-2" role={multiple ? "group" : undefined} aria-label={multiple ? "Select all that apply" : undefined}>
      {options.map((option) => (
        <li key={option.id}>
          <OnboardingOptionCard
            option={option}
            selected={selectedValueSet.has(option.value)}
            disabled={disabled}
            onSelect={onSelect}
            multiple={multiple}
          />
        </li>
      ))}
    </ul>
  );
}
