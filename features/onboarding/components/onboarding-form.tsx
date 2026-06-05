"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingOptionList } from "@/features/onboarding-option/components/onboarding-option-list";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { OnboardingQuestionStep } from "@/features/onboarding-question/components/onboarding-question-step";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import { completeOnboardingAction } from "@/features/onboarding/actions/complete-onboarding";
import { isMultiSelectOnboardingQuestion } from "@/features/onboarding/constants/onboarding-questions";

type OnboardingStepData = {
  question: OnboardingQuestion;
  options: OnboardingOption[];
};

type OnboardingFormProps = {
  steps: OnboardingStepData[];
};

export function OnboardingForm({ steps }: OnboardingFormProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOptionIdsByQuestionId, setSelectedOptionIdsByQuestionId] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStep = steps[stepIndex];
  const isMultiSelect = isMultiSelectOnboardingQuestion(currentStep.question.slug);
  const selectedOptionIds = selectedOptionIdsByQuestionId[currentStep.question.id] ?? [];
  const selectedValues = currentStep.options
    .filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.value);
  const hasCurrentStepAnswer = selectedOptionIds.length > 0;
  const isLastStep = stepIndex === steps.length - 1;
  const progressValue = ((stepIndex + 1) / steps.length) * 100;

  function handleSelect(option: OnboardingOption) {
    setError(null);
    setSelectedOptionIdsByQuestionId((prev) => {
      const currentIds = prev[currentStep.question.id] ?? [];

      if (isMultiSelect) {
        const nextIds = currentIds.includes(option.id)
          ? currentIds.filter((id) => id !== option.id)
          : [...currentIds, option.id];
        return { ...prev, [currentStep.question.id]: nextIds };
      }

      return { ...prev, [currentStep.question.id]: [option.id] };
    });
  }

  function handleContinue() {
    if (!hasCurrentStepAnswer) {
      setError(
        isMultiSelect ? "Please select at least one option to continue." : "Please select an option to continue.",
      );
      return;
    }

    setError(null);
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    const missingAnswer = steps.some((step) => (selectedOptionIdsByQuestionId[step.question.id] ?? []).length === 0);
    if (missingAnswer) {
      setError("Please answer all onboarding questions.");
      return;
    }

    const answers = steps.map((step) => ({
      questionId: step.question.id,
      optionIds: selectedOptionIdsByQuestionId[step.question.id] ?? [],
    }));

    startTransition(async () => {
      const result = await completeOnboardingAction(answers);
      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
      router.push("/collection");
    });
  }

  function handleBack() {
    setError(null);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <Progress value={progressValue} className="mx-auto h-2 w-full max-w-md" />
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Chessvolt</h1>
        <p className="text-muted-foreground text-base">
          Tell us a bit about yourself so we can personalize your training.
        </p>
      </div>

      <OnboardingQuestionStep
        question={currentStep.question}
        stepNumber={stepIndex + 1}
        hint={isMultiSelect ? "Select all that apply." : undefined}
      >
        <OnboardingOptionList
          options={currentStep.options}
          selectedValues={selectedValues}
          onSelect={handleSelect}
          disabled={isPending}
          multiple={isMultiSelect}
        />
      </OnboardingQuestionStep>

      {error ? (
        <p className="text-destructive text-center text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {stepIndex > 0 ? (
          <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="volt"
          className="sm:ml-auto"
          onClick={handleContinue}
          disabled={isPending || !hasCurrentStepAnswer}
        >
          {isPending ? "Saving..." : isLastStep ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
