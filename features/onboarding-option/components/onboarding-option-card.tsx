"use client";

import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { cn } from "@/lib/utils/cn";

type OnboardingOptionCardProps = {
  option: OnboardingOption;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (option: OnboardingOption) => void;
};

export function OnboardingOptionCard({
  option,
  selected = false,
  disabled = false,
  onSelect,
}: OnboardingOptionCardProps) {
  const isInteractive = Boolean(onSelect) && !disabled;

  return (
    <button
      type="button"
      disabled={!isInteractive}
      onClick={() => onSelect?.(option)}
      className={cn(
        "border-border bg-card w-full rounded-lg border p-4 text-left transition-colors",
        isInteractive && "hover:border-primary/50 hover:bg-muted/30 cursor-pointer",
        selected && "border-primary ring-primary/30 ring-2",
        disabled && "opacity-60",
      )}
      aria-pressed={selected}
    >
      <span className="block font-medium">{option.label}</span>
      {option.description ? (
        <span className="text-muted-foreground mt-1 block text-sm">{option.description}</span>
      ) : null}
    </button>
  );
}
