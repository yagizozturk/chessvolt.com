import { OnboardingOptionCard } from "@/features/onboarding-option/components/onboarding-option-card";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";

type OnboardingOptionListProps = {
  options: OnboardingOption[];
  selectedValue?: string | null;
  onSelect?: (option: OnboardingOption) => void;
  disabled?: boolean;
};

export function OnboardingOptionList({
  options,
  selectedValue,
  onSelect,
  disabled = false,
}: OnboardingOptionListProps) {
  if (options.length === 0) {
    return <p className="text-muted-foreground text-sm">No options available.</p>;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <li key={option.id}>
          <OnboardingOptionCard
            option={option}
            selected={selectedValue === option.value}
            disabled={disabled}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
