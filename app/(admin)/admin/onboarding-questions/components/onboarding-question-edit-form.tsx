"use client";

import { useActionState, useState } from "react";

import {
  type UpdateOnboardingQuestionFormState,
  updateOnboardingQuestionAction,
} from "@/app/(admin)/admin/onboarding-questions/actions/onboarding-questions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type Props = {
  question: OnboardingQuestion;
};

const initialState: UpdateOnboardingQuestionFormState = { error: null };

export function OnboardingQuestionEditForm({ question }: Props) {
  const [state, formAction, isPending] = useActionState(updateOnboardingQuestionAction, initialState);
  const [isActive, setIsActive] = useState(question.isActive);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="onboardingQuestionId" value={question.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required defaultValue={question.title} />
        </Field>
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input name="slug" defaultValue={question.slug} className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            defaultValue={question.description ?? ""}
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue={String(question.sortOrder)} />
        </Field>
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
