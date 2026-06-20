import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { OnboardingOptionCard } from "@/features/onboarding-option/components/onboarding-option-card";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";

type OnboardingOptionListProps = {
  options: OnboardingOption[];
  selectedIds?: string[];
  onSelect?: (option: OnboardingOption) => void;
  /** When provided with `multiple`, renders a "Select all" control above the option list. */
  onSelectAllChange?: (selectAll: boolean) => void;
  disabled?: boolean;
  multiple?: boolean;
};

export function OnboardingOptionList({
  options,
  selectedIds = [],
  onSelect,
  onSelectAllChange,
  disabled = false,
  multiple = false,
}: OnboardingOptionListProps) {
  if (options.length === 0) {
    return <Text variant="muted">No options available.</Text>;
  }

  const selectedIdSet = new Set(selectedIds);
  // Checked only when every option is selected — avoid indeterminate, which renders like checked.
  const allSelected = options.every((option) => selectedIdSet.has(option.id));

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      {/* Step 2 (multi-select): one-click select or clear every option */}
      {multiple && onSelectAllChange ? (
        <div className="flex items-center justify-start gap-2">
          <Checkbox
            id="onboarding-select-all"
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAllChange(checked === true)}
            disabled={disabled}
          />
          <Label htmlFor="onboarding-select-all" className="text-muted-foreground font-normal">
            Select all
          </Label>
        </div>
      ) : null}
      <ul
        className="flex flex-col gap-3"
        role={multiple ? "group" : undefined}
        aria-label={multiple ? "Select all that apply" : undefined}
      >
      {options.map((option) => (
        <li key={option.id}>
          <OnboardingOptionCard
            option={option}
            selected={selectedIdSet.has(option.id)}
            disabled={disabled}
            onSelect={onSelect}
            multiple={multiple}
          />
        </li>
      ))}
      </ul>
    </div>
  );
}
