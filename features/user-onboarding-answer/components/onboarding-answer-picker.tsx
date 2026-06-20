"use client";

import { useTransition } from "react";

import { Spinner } from "@/components/ui/spinner";

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

  return (
    <div className="relative">
      <div className={isPending ? "pointer-events-none opacity-60" : undefined}>
        <OnboardingOptionList
          options={options}
          selectedIds={selectedOptionId ? [selectedOptionId] : []}
          onSelect={handleSelect}
          disabled={isPending}
        />
      </div>
      {isPending ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : null}
    </div>
  );
}
