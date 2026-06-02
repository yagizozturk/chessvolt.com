"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
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
  chessFamiliarity: OnboardingStepData;
  improvementGoal: OnboardingStepData;
};

export function OnboardingFlow({ chessFamiliarity, improvementGoal }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [chessOptionId, setChessOptionId] = useState<string | null>(null);
  const [improvementOptionId, setImprovementOptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStep = step === 1 ? chessFamiliarity : improvementGoal;
  const selectedOptionId = step === 1 ? chessOptionId : improvementOptionId;
  const selectedValue =
    currentStep.options.find((option) => option.id === selectedOptionId)?.value ?? null;

  function handleSelect(option: OnboardingOption) {
    setError(null);
    if (step === 1) {
      setChessOptionId(option.id);
      return;
    }
    setImprovementOptionId(option.id);
  }

  function handleContinue() {
    if (!selectedOptionId) {
      setError("Please select an option to continue.");
      return;
    }

    setError(null);
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!chessOptionId || !improvementOptionId) {
      setError("Please answer both questions.");
      return;
    }

    startTransition(async () => {
      const result = await completeOnboardingAction([chessOptionId, improvementOptionId]);
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
    setStep(1);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Step {step} of 2
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Chessvolt</h1>
        <p className="text-muted-foreground text-base">
          Tell us a bit about yourself so we can personalize your training.
        </p>
      </div>

      <OnboardingQuestionStep question={currentStep.question} stepNumber={step}>
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
        {step === 2 ? (
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
          {isPending ? "Saving..." : step === 1 ? "Continue" : "Finish"}
        </Button>
      </div>
    </div>
  );
}
