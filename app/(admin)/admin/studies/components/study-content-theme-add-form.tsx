"use client";

import { useMemo, useState } from "react";

import { createStudyContentThemeAction } from "@/app/(admin)/admin/studies/actions/study-content-themes";
import type { StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";
import { ThemeLinkWeightSelect } from "@/features/theme-link/components/theme-link-weight-select";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
import { ThemeSelect } from "@/features/theme/components/theme-select";
import type { Theme } from "@/features/theme/types/theme";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

type Props = {
  studyId: string;
  themes: Theme[];
  linkedThemes: StudyThemeWithTheme[];
};

export function StudyContentThemeAddForm({ studyId, themes, linkedThemes }: Props) {
  const availableThemes = useMemo(
    () => themes.filter((theme) => !linkedThemes.some((link) => link.themeId === theme.id)),
    [themes, linkedThemes],
  );

  const [themeId, setThemeId] = useState(availableThemes[0]?.id ?? "");
  const [weight, setWeight] = useState<ThemeLinkWeight>(DEFAULT_THEME_LINK_WEIGHT);

  if (themes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Create at least one theme before linking themes to this study.
      </p>
    );
  }

  if (availableThemes.length === 0) {
    return <p className="text-muted-foreground text-sm">All themes are already linked to this study.</p>;
  }

  return (
    <form action={createStudyContentThemeAction} className="space-y-4">
      <input type="hidden" name="studyId" value={studyId} />
      <FieldGroup>
        <ThemeSelect themes={availableThemes} value={themeId} onChange={setThemeId} />
        <ThemeLinkWeightSelect value={weight} onChange={setWeight} />
      </FieldGroup>
      <Button type="submit">Add theme</Button>
    </form>
  );
}
