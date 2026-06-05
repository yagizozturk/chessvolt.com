"use client";

import { useTransition } from "react";

import { saveUserOnboardingAnswerAction } from "@/features/user-onboarding-answer/actions/save-user-onboarding-answer";
import { OnboardingOptionList } from "@/features/onboarding-option/components/onboarding-option-list";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type Props = {
  question: OnboardingQuestion;
  options: OnboardingOption[];
  selectedOptionId?: string | null;
  onSaved?: (optionId: string) => void;
};

export function OnboardingAnswerPicker({ question, options, selectedOptionId, onSaved }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(option: OnboardingOption) {
    startTransition(async () => {
      const result = await saveUserOnboardingAnswerAction(question.id, option.id);
      if (result.success) {
        onSaved?.(option.id);
      }
    });
  }

  const selectedValues = selectedOptionId
    ? [options.find((o) => o.id === selectedOptionId)?.value].filter((value): value is string =>
        Boolean(value),
      )
    : [];

  return (
    <div className={isPending ? "pointer-events-none opacity-60" : undefined}>
      <OnboardingOptionList
        options={options}
        selectedValues={selectedValues}
        onSelect={handleSelect}
        disabled={isPending}
      />
    </div>
  );
}
