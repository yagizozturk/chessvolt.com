"use client";

import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { OnboardingOptionList } from "@/features/onboarding-option/components/onboarding-option-list";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { OnboardingQuestion } from "@/features/onboarding-question/components/onboarding-question";
import { completeOnboardingAction } from "@/features/onboarding/actions/complete-onboarding";
import { isMultiSelectOnboardingQuestion } from "@/features/onboarding/constants/onboarding-questions";
import { POST_ONBOARDING_URL } from "@/features/onboarding/constants/onboarding-routes";
import type { OnboardingStepData } from "@/features/onboarding/types/onboarding-step-data";

type OnboardingFormProps = {
  questionGroups: OnboardingStepData[];
};

export function OnboardingForm({ questionGroups }: OnboardingFormProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0); // Current step index
  const [selectedOptionIdsByQuestionId, setSelectedOptionIdsByQuestionId] = useState<Record<string, string[]>>({}); // Selected option IDs by question ID in map format
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // Transition tells Next it is not urgent so dont block UI

  const currentStep = questionGroups[stepIndex]; // Current step of the question
  const isMultiSelect = isMultiSelectOnboardingQuestion(currentStep.question.slug);
  const selectedOptionIds = selectedOptionIdsByQuestionId[currentStep.question.id] ?? [];
  const selectedValues = currentStep.options
    .filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.value);
  const hasCurrentStepAnswer = selectedOptionIds.length > 0;
  const isLastStep = stepIndex === questionGroups.length - 1;
  const progressValue = ((stepIndex + 1) / questionGroups.length) * 100;

  // ======================================================================
  // Handles the selection of an option for a questionId and handles multiselect
  // ======================================================================
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

  // ======================================================================
  // Handles the continuation to the next step
  // ======================================================================
  function handleContinue() {
    // If no answer is selected, show an error message
    if (!hasCurrentStepAnswer) {
      setError(
        isMultiSelect ? "Please select at least one option to continue." : "Please select an option to continue.",
      );
      return;
    }

    // If there is an error, show it
    setError(null);
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    // If there is a missing answer, show an error message
    const missingAnswer = questionGroups.some(
      (group) => (selectedOptionIdsByQuestionId[group.question.id] ?? []).length === 0,
    );
    if (missingAnswer) {
      setError("Please answer all onboarding questions.");
      return;
    }

    // If there are no missing answers, submit the answers
    const answers = questionGroups.map((group) => ({
      questionId: group.question.id,
      optionIds: selectedOptionIdsByQuestionId[group.question.id] ?? [],
    }));

    // Submit the answers
    startTransition(async () => {
      const result = await completeOnboardingAction(answers);
      if (!result.success) {
        setError(result.error);
        return;
      }

      // Redirect to the collection page
      router.refresh();
      router.push(POST_ONBOARDING_URL);
    });
  }

  // ======================================================================
  // Handles the back to the previous step
  // ======================================================================
  function handleBack() {
    setError(null);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* Heading of the page Brand */}
      <div className="space-y-6 text-center">
        <div className="text-foreground flex items-center justify-center gap-2 text-3xl font-bold tracking-tighter">
          <Zap className="fill-primary text-primary h-7 w-7" aria-hidden />
          <span>ChessVolt</span>
        </div>
        <Text variant="subtitle" as="p">
          Please tell us a bit about yourself so we can &nbsp;
          <Highlighter action="underline" color="#F0B100">
            personalize
          </Highlighter>
          &nbsp; your practice.
        </Text>
      </div>

      {/* Current step of the question and show options */}
      <OnboardingQuestion
        question={currentStep.question}
        options={
          <OnboardingOptionList
            options={currentStep.options}
            selectedValues={selectedValues}
            onSelect={handleSelect}
            disabled={isPending}
            multiple={isMultiSelect}
          />
        }
      />

      {/* Error message */}
      {error ? (
        <p className="text-destructive text-center text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {/* Buttons to navigate between steps */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {stepIndex > 0 ? (
          <Button type="button" variant="voltMuted" onClick={handleBack} disabled={isPending}>
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
        ) : (
          <span />
        )}
        {/* TODO: Total loading icon can be used in order to Saving text change */}
        <Button
          type="button"
          variant="volt"
          className="sm:ml-auto"
          onClick={handleContinue}
          disabled={isPending || !hasCurrentStepAnswer}
        >
          {isPending ? (
            "Saving..."
          ) : (
            <>
              {isLastStep ? "Finish" : "Continue"}
              <ArrowRight data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 text-center">
        <Text variant="subtitle" as="p">
          Step {stepIndex + 1} of {questionGroups.length}
        </Text>
        <Progress value={progressValue} className="mx-auto h-3 w-full max-w-md" />
      </div>
    </div>
  );
}
