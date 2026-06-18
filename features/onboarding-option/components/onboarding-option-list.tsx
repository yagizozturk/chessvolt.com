import { Text } from "@/components/ui/text";
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
    return <Text variant="muted">No options available.</Text>;
  }

  const selectedValueSet = new Set(selectedValues);

  return (
    <ul
      className="mx-auto flex w-full max-w-sm flex-col gap-3"
      role={multiple ? "group" : undefined}
      aria-label={multiple ? "Select all that apply" : undefined}
    >
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
