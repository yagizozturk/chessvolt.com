"use client";

import { useMemo, useState } from "react";

import { createCollectionContentThemeAction } from "@/app/(admin)/admin/collections/actions/collection-content-themes";
import { ContentThemeWeightSelect } from "@/features/content-theme/components/content-theme-weight-select";
import { ThemeSelect } from "@/features/content-theme/components/theme-select";
import type { ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import {
  DEFAULT_CONTENT_THEME_WEIGHT,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import type { Theme } from "@/features/theme/types/theme";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

type Props = {
  collectionId: string;
  themes: Theme[];
  linkedThemes: ContentThemeWithTheme[];
};

export function CollectionContentThemeAddForm({ collectionId, themes, linkedThemes }: Props) {
  const availableThemes = useMemo(
    () => themes.filter((theme) => !linkedThemes.some((link) => link.themeId === theme.id)),
    [themes, linkedThemes],
  );

  const [themeId, setThemeId] = useState(availableThemes[0]?.id ?? "");
  const [weight, setWeight] = useState<ContentThemeWeight>(DEFAULT_CONTENT_THEME_WEIGHT);

  if (themes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Create at least one theme before linking themes to this collection.
      </p>
    );
  }

  if (availableThemes.length === 0) {
    return <p className="text-muted-foreground text-sm">All themes are already linked to this collection.</p>;
  }

  return (
    <form action={createCollectionContentThemeAction} className="space-y-4">
      <input type="hidden" name="collectionId" value={collectionId} />
      <FieldGroup>
        <ThemeSelect themes={availableThemes} value={themeId} onChange={setThemeId} />
        <ContentThemeWeightSelect value={weight} onChange={setWeight} />
      </FieldGroup>
      <Button type="submit">Add theme</Button>
    </form>
  );
}
