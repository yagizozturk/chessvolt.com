"use client";

import { Check, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { cn } from "@/lib/utils";

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
  return originalMove ? `Played ${originalMove}` : question.title;
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
  const completedCount = questions.filter((question) => completedQuestionIds.has(question.id)).length;
  const progressValue = questions.length > 0 ? Math.round((completedCount / questions.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold">Review questions</p>
          <p className="text-muted-foreground text-sm">Pick a step, solve it on the board, then continue.</p>
        </div>
        {questions.length > 0 ? (
          <Badge variant="secondary" className="shrink-0 rounded-lg">
            {completedCount}/{questions.length}
          </Badge>
        ) : null}
      </div>

      {questions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Progress value={progressValue} className="h-3" aria-label="Solved questions progress" />
          <p className="text-muted-foreground text-sm">
            {completedCount} of {questions.length} questions solved
          </p>
        </div>
      ) : null}

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">
          Evaluating positions via Stockfish. Large games can take a while...
        </p>
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
