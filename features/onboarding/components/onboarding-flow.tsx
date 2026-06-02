"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { completeOnboardingAction } from "@/features/onboarding/actions/complete-onboarding";
import { OnboardingOptionList } from "@/features/onboarding-option/components/onboarding-option-list";
import { OnboardingQuestionStep } from "@/features/onboarding-question/components/onboarding-question-step";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type OnboardingStepData = {
  question: OnboardingQuestion;
  options: OnboardingOption[];
};

type OnboardingFlowProps = {
  steps: OnboardingStepData[];
};

export function OnboardingFlow({ steps }: OnboardingFlowProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOptionByQuestionId, setSelectedOptionByQuestionId] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStep = steps[stepIndex];
  const selectedOptionId = selectedOptionByQuestionId[currentStep.question.id] ?? null;
  const selectedValue =
    currentStep.options.find((option) => option.id === selectedOptionId)?.value ?? null;
  const isLastStep = stepIndex === steps.length - 1;
  const progressValue = ((stepIndex + 1) / steps.length) * 100;

  function handleSelect(option: OnboardingOption) {
    setError(null);
    setSelectedOptionByQuestionId((prev) => ({
      ...prev,
      [currentStep.question.id]: option.id,
    }));
  }

  function handleContinue() {
    if (!selectedOptionId) {
      setError("Please select an option to continue.");
      return;
    }

    setError(null);
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    const missingAnswer = steps.some((step) => !selectedOptionByQuestionId[step.question.id]);
    if (missingAnswer) {
      setError("Please answer all onboarding questions.");
      return;
    }

    const optionIds = steps.map((step) => selectedOptionByQuestionId[step.question.id]);

    startTransition(async () => {
      const result = await completeOnboardingAction(optionIds);
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

      <OnboardingQuestionStep question={currentStep.question} stepNumber={stepIndex + 1}>
        <OnboardingOptionList
          options={currentStep.options}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          disabled={isPending}
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
          disabled={isPending || !selectedOptionId}
        >
          {isPending ? "Saving..." : isLastStep ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
