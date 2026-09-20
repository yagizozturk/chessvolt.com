"use client";

import { ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { completeOnboardingAction } from "@/features/onboarding/actions/complete-onboarding";
import { OnboardingPlatformUsernameStep } from "@/features/onboarding/components/onboarding-platform-username-step";
import { POST_ONBOARDING_URL } from "@/features/onboarding/constants/onboarding-routes";

export function OnboardingForm() {
  const router = useRouter();
  const [chesscomUsername, setChesscomUsername] = useState("");
  const [lichessUsername, setLichessUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ======================================================================
  // Completes onboarding with linked accounts, or a default rating when skipped.
  // ======================================================================
  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await completeOnboardingAction({
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

  function handleChesscomUsernameChange(value: string) {
    setError(null);
    setChesscomUsername(value);
  }

  function handleLichessUsernameChange(value: string) {
    setError(null);
    setLichessUsername(value);
  }

  const primaryButtonLabel = chesscomUsername.trim() || lichessUsername.trim() ? "Finish" : "Skip";

  return (
    <div className="mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-lg flex-col gap-6 md:min-h-[calc(100svh-8rem)]">
      <div className="text-foreground flex items-center justify-center gap-2 text-2xl font-bold tracking-tighter sm:text-3xl">
        <Zap className="fill-primary text-primary h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
        <span>ChessVolt</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 py-4 sm:py-6">
        <OnboardingPlatformUsernameStep
          chesscomUsername={chesscomUsername}
          lichessUsername={lichessUsername}
          onChesscomUsernameChange={handleChesscomUsernameChange}
          onLichessUsernameChange={handleLichessUsernameChange}
          disabled={isPending}
        />

        {error ? (
          <p className="text-destructive text-center text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="volt" onClick={handleSubmit} disabled={isPending}>
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
