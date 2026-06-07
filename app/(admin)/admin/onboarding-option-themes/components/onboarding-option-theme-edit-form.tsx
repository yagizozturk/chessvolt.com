"use client";

import { useActionState, useState } from "react";

import {
  type UpdateOnboardingOptionThemeFormState,
  updateOnboardingOptionThemeAction,
} from "@/app/(admin)/admin/onboarding-option-themes/actions/onboarding-option-themes";
import { OnboardingOptionSelect } from "@/features/onboarding-option-theme/components/onboarding-option-select";
import type { OnboardingOptionThemeWithDetails } from "@/features/onboarding-option-theme/types/onboarding-option-theme";
import { ThemeSelect } from "@/features/theme/components/theme-select";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import type { Theme } from "@/features/theme/types/theme";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

type Props = {
  item: OnboardingOptionThemeWithDetails;
  options: OnboardingOptionWithQuestion[];
  themes: Theme[];
};

const initialState: UpdateOnboardingOptionThemeFormState = { error: null };

export function OnboardingOptionThemeEditForm({ item, options, themes }: Props) {
  const [state, formAction, isPending] = useActionState(updateOnboardingOptionThemeAction, initialState);
  const [optionId, setOptionId] = useState(item.optionId);
  const [themeId, setThemeId] = useState(item.themeId);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="onboardingOptionThemeId" value={item.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <OnboardingOptionSelect options={options} value={optionId} onChange={setOptionId} />
        <ThemeSelect themes={themes} value={themeId} onChange={setThemeId} />
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
