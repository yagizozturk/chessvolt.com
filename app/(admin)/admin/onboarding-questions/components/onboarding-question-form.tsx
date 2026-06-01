"use client";

import { useState } from "react";

import { createOnboardingQuestionAction } from "@/app/(admin)/admin/onboarding-questions/actions/onboarding-questions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function OnboardingQuestionForm() {
  const [isActive, setIsActive] = useState(true);

  return (
    <form action={createOnboardingQuestionAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required placeholder="e.g. What is your main goal?" />
        </Field>
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input name="slug" placeholder="Auto-generated from title if empty" className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            placeholder="Optional helper text shown under the title"
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue="0" />
          <p className="text-muted-foreground mt-1 text-xs">
            Controls question order in the onboarding flow. Use gaps (10, 20, 30) to insert later.
          </p>
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active (shown in onboarding)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit">Add question</Button>
    </form>
  );
}
