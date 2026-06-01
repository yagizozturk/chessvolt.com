"use client";

import { useState } from "react";

import { createOnboardingOptionThemeAction } from "@/app/(admin)/admin/onboarding-option-themes/actions/onboarding-option-themes";
import { OnboardingOptionSelect } from "@/features/onboarding-option-theme/components/onboarding-option-select";
import { ThemeSelect } from "@/features/content-theme/components/theme-select";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import type { Theme } from "@/features/theme/types/theme";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

type Props = {
  options: OnboardingOptionWithQuestion[];
  themes: Theme[];
  defaultOptionId?: string;
};

export function OnboardingOptionThemeForm({ options, themes, defaultOptionId }: Props) {
  const [optionId, setOptionId] = useState(defaultOptionId ?? options[0]?.id ?? "");
  const [themeId, setThemeId] = useState(themes[0]?.id ?? "");

  if (options.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Create at least one onboarding option before linking themes.
      </p>
    );
  }

  if (themes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Create at least one theme before linking option themes.</p>
    );
  }

  return (
    <form action={createOnboardingOptionThemeAction} className="space-y-4">
      <FieldGroup>
        <OnboardingOptionSelect options={options} value={optionId} onChange={setOptionId} />
        <ThemeSelect themes={themes} value={themeId} onChange={setThemeId} />
      </FieldGroup>
      <Button type="submit">Add link</Button>
    </form>
  );
}
