"use client";

import { useActionState, useState } from "react";

import {
  type UpdateUserOnboardingAnswerFormState,
  updateUserOnboardingAnswerAction,
} from "@/app/(admin)/admin/user-onboarding-answers/actions/user-onboarding-answers";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { UserOnboardingAnswerWithDetails } from "@/features/user-onboarding-answer/types/user-onboarding-answer";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils/cn";

type Props = {
  answer: UserOnboardingAnswerWithDetails;
  optionsForQuestion: OnboardingOption[];
};

const initialState: UpdateUserOnboardingAnswerFormState = { error: null };

export function UserOnboardingAnswerEditForm({ answer, optionsForQuestion }: Props) {
  const [state, formAction, isPending] = useActionState(updateUserOnboardingAnswerAction, initialState);
  const [optionId, setOptionId] = useState(answer.optionId);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="answerId" value={answer.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <dl className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-foreground">User</dt>
          <dd className="font-mono text-xs">{answer.userId}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Question</dt>
          <dd>{answer.question.title}</dd>
        </div>
      </dl>
      <FieldGroup>
        <Field>
          <FieldLabel>Selected option</FieldLabel>
          <select
            name="optionId"
            required
            value={optionId}
            onChange={(e) => setOptionId(e.target.value)}
            className={cn(
              "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
            )}
          >
            {optionsForQuestion.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} ({option.value})
              </option>
            ))}
          </select>
          <p className="text-muted-foreground mt-1 text-xs">
            Must belong to this question (validated by the database).
          </p>
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
