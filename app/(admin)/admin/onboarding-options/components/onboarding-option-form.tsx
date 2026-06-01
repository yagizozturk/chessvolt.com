"use client";

import { useState } from "react";

import { createOnboardingOptionAction } from "@/app/(admin)/admin/onboarding-options/actions/onboarding-options";
import { OnboardingQuestionSelect } from "@/features/onboarding-option/components/onboarding-question-select";
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
  questions: OnboardingQuestion[];
  defaultQuestionId?: string;
};

export function OnboardingOptionForm({ questions, defaultQuestionId }: Props) {
  const [isActive, setIsActive] = useState(true);
  const [questionId, setQuestionId] = useState(defaultQuestionId ?? questions[0]?.id ?? "");

  if (questions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Create at least one onboarding question before adding options.
      </p>
    );
  }

  return (
    <form action={createOnboardingOptionAction} className="space-y-4">
      <FieldGroup>
        <OnboardingQuestionSelect questions={questions} value={questionId} onChange={setQuestionId} />
        <Field>
          <FieldLabel>Value</FieldLabel>
          <Input
            name="value"
            required
            placeholder="e.g. tactics_focus"
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs">Stable machine value, unique per question.</p>
        </Field>
        <Field>
          <FieldLabel>Label</FieldLabel>
          <Input name="label" required placeholder="e.g. Improve my tactics" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            placeholder="Optional subtitle on the option card"
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue="0" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Initial rating (optional)</FieldLabel>
            <Input
              name="initialRating"
              type="number"
              min={MIN_ONBOARDING_INITIAL_RATING}
              max={MAX_ONBOARDING_INITIAL_RATING}
              placeholder={`${MIN_ONBOARDING_INITIAL_RATING}–${MAX_ONBOARDING_INITIAL_RATING}`}
            />
          </Field>
          <Field>
            <FieldLabel>Initial rating deviation (optional)</FieldLabel>
            <Input
              name="initialRatingDeviation"
              type="number"
              min={MIN_ONBOARDING_INITIAL_RATING_DEVIATION}
              max={MAX_ONBOARDING_INITIAL_RATING_DEVIATION}
              placeholder={`${MIN_ONBOARDING_INITIAL_RATING_DEVIATION}–${MAX_ONBOARDING_INITIAL_RATING_DEVIATION}`}
            />
          </Field>
        </div>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active (shown in onboarding)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit">Add option</Button>
    </form>
  );
}
