"use client";

import Lottie from "lottie-react";
import { Check, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { cn } from "@/lib/utils";
import loaderAnimationData from "@/public/images/animations/animation-rocjet-launch.json";

type GameReviewQuestionStepperProps = {
  questions: GameReviewQuestion[];
  originalMoveByPly: Record<number, string>;
  activeQuestionId: string | null;
  completedQuestionIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  hasResult: boolean;
  onSelectQuestion: (question: GameReviewQuestion) => void;
};

function qualityLabel(quality: GameReviewQuestion["quality"]) {
  return quality === "blunder" ? "Blunder" : "Mistake";
}

function questionTitle(question: GameReviewQuestion, originalMoveByPly: Record<number, string>) {
  const originalMove = originalMoveByPly[question.ply]?.trim();
  if (originalMove) return `Played ${originalMove}`;

  const title = question.title.trim();
  return /^played\s+/i.test(title) ? title : "Original game move";
}

export function GameReviewQuestionStepper({
  questions,
  originalMoveByPly,
  activeQuestionId,
  completedQuestionIds,
  isLoading,
  error,
  hasResult,
  onSelectQuestion,
}: GameReviewQuestionStepperProps) {
  return (
    <div className="flex flex-col gap-4">
      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <div className="text-muted-foreground flex items-center gap-3 text-sm" role="status" aria-live="polite">
          <Lottie animationData={loaderAnimationData} loop autoplay aria-hidden="true" className="size-12 shrink-0" />
          <span>Evaluating positions via Stockfish. Large games can take a while...</span>
        </div>
      ) : null}

      {!isLoading && questions.length > 0 ? (
        <div className="min-w-0 overflow-x-auto pb-2">
          <ol className="flex min-w-max items-start gap-3" aria-label="Game review questions">
            {questions.map((question, index) => {
              const active = question.id === activeQuestionId;
              const completed = completedQuestionIds.has(question.id);
              const previousCompleted = index > 0 && completedQuestionIds.has(questions[index - 1].id);
              const title = questionTitle(question, originalMoveByPly);

              return (
                <li key={question.id} className="relative flex w-28 flex-col items-center gap-2 text-center">
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "bg-border absolute top-5 right-[calc(50%+1.25rem)] h-1 w-[calc(100%-1.5rem)] rounded-full",
                        previousCompleted && "bg-primary",
                      )}
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant={completed ? "voltGreen" : active ? "volt" : "voltIcon"}
                    size="icon"
                    onClick={() => onSelectQuestion(question)}
                    className="relative rounded-full"
                    aria-current={active ? "step" : undefined}
                    aria-label={`Question ${index + 1}: ${title}`}
                  >
                    {completed ? <Check /> : active ? <Play /> : index + 1}
                  </Button>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        question.quality === "blunder" ? "text-destructive" : "text-primary",
                      )}
                    >
                      {qualityLabel(question.quality)}
                    </span>
                    <span className="line-clamp-2 text-sm leading-tight font-medium">{title}</span>
                    <span className="text-muted-foreground text-xs">Ply {question.ply}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {!isLoading && !error && hasResult && questions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No review questions found for this game.</p>
      ) : null}
    </div>
  );
}
