"use client";

import { useActionState, useState } from "react";

import { type UpdateThemeFormState, updateThemeAction } from "@/app/(admin)/admin/themes/actions/themes";
import { ThemeCategorySelect } from "@/features/theme/components/theme-category-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Theme } from "@/features/theme/types/theme";
import type { ThemeCategory } from "@/features/theme/types/theme-category";

type Props = {
  theme: Theme;
};

const initialState: UpdateThemeFormState = { error: null };

export function ThemeEditForm({ theme }: Props) {
  const [state, formAction, isPending] = useActionState(updateThemeAction, initialState);
  const [isActive, setIsActive] = useState(theme.isActive);
  const [category, setCategory] = useState<ThemeCategory>(theme.category);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="themeId" value={theme.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required defaultValue={theme.title} />
        </Field>
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input name="slug" defaultValue={theme.slug} className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            defaultValue={theme.description ?? ""}
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <ThemeCategorySelect value={category} onChange={setCategory} />
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue={String(theme.sortOrder)} />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
