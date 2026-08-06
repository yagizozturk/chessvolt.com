"use client";

import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { cn } from "@/lib/utils/cn";

type OnboardingOptionCardProps = {
  option: OnboardingOption;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (option: OnboardingOption) => void;
  multiple?: boolean;
};

export function OnboardingOptionCard({
  option,
  selected = false,
  disabled = false,
  onSelect,
  multiple = false,
}: OnboardingOptionCardProps) {
  const isInteractive = Boolean(onSelect) && !disabled;

  return (
    <button
      type="button"
      disabled={!isInteractive}
      onClick={() => onSelect?.(option)}
      className={cn(
        "border-border bg-card w-full rounded-lg border p-4 text-center transition-colors",
        isInteractive && "hover:border-primary/50 hover:bg-muted/30 cursor-pointer",
        selected && "border-primary ring-primary/30 ring-2",
        disabled && "opacity-60",
      )}
      aria-pressed={multiple ? selected : undefined}
      aria-checked={multiple ? selected : undefined}
      role={multiple ? "checkbox" : undefined}
    >
      <span className="block font-medium">{option.label}</span>
    </button>
  );
}
