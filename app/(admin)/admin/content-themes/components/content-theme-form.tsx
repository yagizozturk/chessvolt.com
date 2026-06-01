"use client";

import { useState } from "react";

import { createContentThemeAction } from "@/app/(admin)/admin/content-themes/actions/content-themes";
import { ContentThemeWeightSelect } from "@/features/content-theme/components/content-theme-weight-select";
import { ContentTypeSelect } from "@/features/content-theme/components/content-type-select";
import { ThemeSelect } from "@/features/content-theme/components/theme-select";
import type { ContentType } from "@/features/content-theme/types/content-type";
import {
  DEFAULT_CONTENT_THEME_WEIGHT,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import type { Theme } from "@/features/theme/types/theme";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  themes: Theme[];
};

const DEFAULT_CONTENT_TYPE: ContentType = "riddle";

export function ContentThemeForm({ themes }: Props) {
  const [contentType, setContentType] = useState<ContentType>(DEFAULT_CONTENT_TYPE);
  const [themeId, setThemeId] = useState(themes[0]?.id ?? "");
  const [weight, setWeight] = useState<ContentThemeWeight>(DEFAULT_CONTENT_THEME_WEIGHT);

  if (themes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Create at least one theme before linking content to themes.
      </p>
    );
  }

  return (
    <form action={createContentThemeAction} className="space-y-4">
      <FieldGroup>
        <ContentTypeSelect value={contentType} onChange={setContentType} />
        <Field>
          <FieldLabel>Content ID</FieldLabel>
          <Input
            name="contentId"
            required
            placeholder="UUID of the riddle, game, etc."
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Must match an existing row for the selected content type (validated by the database).
          </p>
        </Field>
        <ThemeSelect themes={themes} value={themeId} onChange={setThemeId} />
        <ContentThemeWeightSelect value={weight} onChange={setWeight} />
      </FieldGroup>
      <Button type="submit">Add link</Button>
    </form>
  );
}
