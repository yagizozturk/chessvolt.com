"use client";

import { useActionState, useState } from "react";

import {
  type UpdateOnboardingOptionFormState,
  updateOnboardingOptionAction,
} from "@/app/(admin)/admin/onboarding-options/actions/onboarding-options";
import { OnboardingQuestionSelect } from "@/app/(admin)/admin/onboarding-options/components/onboarding-question-select";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import {
  MAX_ONBOARDING_INITIAL_RATING,
  MAX_ONBOARDING_INITIAL_RATING_DEVIATION,
  MIN_ONBOARDING_INITIAL_RATING,
  MIN_ONBOARDING_INITIAL_RATING_DEVIATION,
} from "@/features/onboarding-option/types/onboarding-rating";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  option: OnboardingOptionWithQuestion;
  questions: OnboardingQuestion[];
};

const initialState: UpdateOnboardingOptionFormState = { error: null };

export function OnboardingOptionEditForm({ option, questions }: Props) {
  const [state, formAction, isPending] = useActionState(updateOnboardingOptionAction, initialState);
  const [isActive, setIsActive] = useState(option.isActive);
  const [questionId, setQuestionId] = useState(option.questionId);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="onboardingOptionId" value={option.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <OnboardingQuestionSelect questions={questions} value={questionId} onChange={setQuestionId} />
        <Field>
          <FieldLabel>Value</FieldLabel>
          <Input name="value" required defaultValue={option.value} className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Label</FieldLabel>
          <Input name="label" required defaultValue={option.label} />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue={String(option.sortOrder)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Initial rating (optional)</FieldLabel>
            <Input
              name="initialRating"
              type="number"
              min={MIN_ONBOARDING_INITIAL_RATING}
              max={MAX_ONBOARDING_INITIAL_RATING}
              defaultValue={option.initialRating ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel>Initial rating deviation (optional)</FieldLabel>
            <Input
              name="initialRatingDeviation"
              type="number"
              min={MIN_ONBOARDING_INITIAL_RATING_DEVIATION}
              max={MAX_ONBOARDING_INITIAL_RATING_DEVIATION}
              defaultValue={option.initialRatingDeviation ?? ""}
            />
          </Field>
        </div>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active (shown in onboarding)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
