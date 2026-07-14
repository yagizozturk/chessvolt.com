// TODO: Refactor
"use client";

import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { OnboardingOptionList } from "@/features/onboarding-option/components/onboarding-option-list";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { OnboardingQuestion } from "@/features/onboarding-question/components/onboarding-question";
import { completeOnboardingAction } from "@/features/onboarding/actions/complete-onboarding";
import { OnboardingPlatformUsernameStep } from "@/features/onboarding/components/onboarding-platform-username-step";
import { POST_ONBOARDING_URL } from "@/features/onboarding/constants/onboarding-routes";
import { hasPlatformUsername } from "@/features/onboarding/types/onboarding-platform-usernames";
import type { OnboardingStepData } from "@/features/onboarding/types/onboarding-step-data";

type OnboardingFormProps = {
  familiarityQuestion: OnboardingStepData | null;
};

export function OnboardingForm({ familiarityQuestion }: OnboardingFormProps) {
  const router = useRouter();
  const [showFamiliarityQuestion, setShowFamiliarityQuestion] = useState(false);
  const [chesscomUsername, setChesscomUsername] = useState("");
  const [lichessUsername, setLichessUsername] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasLinkedAccount = hasPlatformUsername({ chesscomUsername, lichessUsername });
  // First chess_familiarity option is unsupported for now — keep it visible but unselectable.
  const disabledOptionIds = familiarityQuestion?.options[0] ? [familiarityQuestion.options[0].id] : [];

  // ======================================================================
  // Handles the selection of the familiarity option.
  // ======================================================================
  function handleSelect(option: OnboardingOption) {
    if (disabledOptionIds.includes(option.id)) return;
    setError(null);
    setSelectedOptionId(option.id);
  }

  // ======================================================================
  // Completes onboarding with a linked account or familiarity answer.
  // ======================================================================
  function submitOnboarding(answers: { questionId: string; optionIds: string[] }[]) {
    startTransition(async () => {
      const result = await completeOnboardingAction({
        answers,
        chesscomUsername: chesscomUsername.trim() || null,
        lichessUsername: lichessUsername.trim() || null,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
      router.push(POST_ONBOARDING_URL);
    });
  }

  function handleAccountContinue() {
    setError(null);
    if (hasLinkedAccount) {
      submitOnboarding([]);
      return;
    }

    if (!familiarityQuestion) {
      setError("Chess familiarity question is not available.");
      return;
    }

    setShowFamiliarityQuestion(true);
  }

  function handleFinish() {
    if (!familiarityQuestion || !selectedOptionId) {
      setError("Please select an option to continue.");
      return;
    }

    setError(null);
    submitOnboarding([
      {
        questionId: familiarityQuestion.question.id,
        optionIds: [selectedOptionId],
      },
    ]);
  }

  function handleBack() {
    setError(null);
    setShowFamiliarityQuestion(false);
  }

  function handleChesscomUsernameChange(value: string) {
    setError(null);
    setChesscomUsername(value);
  }

  function handleLichessUsernameChange(value: string) {
    setError(null);
    setLichessUsername(value);
  }

  const primaryButtonLabel = showFamiliarityQuestion || hasLinkedAccount ? "Finish" : "Continue";

  return (
    <div className="mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-lg flex-col gap-6 md:min-h-[calc(100svh-8rem)]">
      <div className="text-foreground flex items-center justify-center gap-2 text-2xl font-bold tracking-tighter sm:text-3xl">
        <Zap className="fill-primary text-primary h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
        <span>ChessVolt</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 py-4 sm:py-6">
        {!showFamiliarityQuestion ? (
          <OnboardingPlatformUsernameStep
            chesscomUsername={chesscomUsername}
            lichessUsername={lichessUsername}
            onChesscomUsernameChange={handleChesscomUsernameChange}
            onLichessUsernameChange={handleLichessUsernameChange}
            disabled={isPending}
          />
        ) : familiarityQuestion ? (
          <OnboardingQuestion
            question={familiarityQuestion.question}
            minOptionCount={familiarityQuestion.options.length}
            showSelectAllRow={false}
            options={
              <OnboardingOptionList
                options={familiarityQuestion.options}
                selectedIds={selectedOptionId ? [selectedOptionId] : []}
                onSelect={handleSelect}
                disabled={isPending}
                disabledOptionIds={disabledOptionIds}
                multiple={false}
              />
            }
          />
        ) : null}

        {error ? (
          <p className="text-destructive text-center text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {showFamiliarityQuestion ? (
          <Button type="button" variant="voltMuted" onClick={handleBack} disabled={isPending}>
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="volt"
          className="sm:ml-auto"
          onClick={showFamiliarityQuestion ? handleFinish : handleAccountContinue}
          disabled={isPending || (showFamiliarityQuestion && !selectedOptionId)}
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Saving...
            </>
          ) : (
            <>
              {primaryButtonLabel}
              <ArrowRight data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
