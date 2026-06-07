"use client";

import { useState } from "react";

import { createThemeLinkAction } from "@/app/(admin)/admin/content-themes/actions/content-themes";
import { ThemeLinkKindSelect } from "@/features/theme-link/components/theme-link-kind-select";
import { ThemeLinkWeightSelect } from "@/features/theme-link/components/theme-link-weight-select";
import type { ThemeLinkKind } from "@/features/theme-link/types/theme-link-kind";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
import { ThemeSelect } from "@/features/theme/components/theme-select";
import type { Theme } from "@/features/theme/types/theme";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  themes: Theme[];
};

const DEFAULT_KIND: ThemeLinkKind = "riddle";

export function ContentThemeForm({ themes }: Props) {
  const [kind, setKind] = useState<ThemeLinkKind>(DEFAULT_KIND);
  const [themeId, setThemeId] = useState(themes[0]?.id ?? "");
  const [weight, setWeight] = useState<ThemeLinkWeight>(DEFAULT_THEME_LINK_WEIGHT);

  if (themes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Create at least one theme before linking content to themes.
      </p>
    );
  }

  return (
    <form action={createThemeLinkAction} className="space-y-4">
      <FieldGroup>
        <ThemeLinkKindSelect value={kind} onChange={setKind} />
        <Field>
          <FieldLabel>Content ID</FieldLabel>
          <Input
            name="parentId"
            required
            placeholder="UUID of the riddle, collection, or opening variant"
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Must match an existing row for the selected content type.
          </p>
        </Field>
        <ThemeSelect themes={themes} value={themeId} onChange={setThemeId} />
        <ThemeLinkWeightSelect value={weight} onChange={setWeight} />
      </FieldGroup>
      <Button type="submit">Add link</Button>
    </form>
  );
}
