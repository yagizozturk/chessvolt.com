"use client";

import { useState } from "react";

import { createThemeAction } from "@/app/(admin)/admin/themes/actions/themes";
import { ThemeCategorySelect } from "@/features/theme/components/theme-category-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ThemeCategory } from "@/features/theme/types/theme-category";

const DEFAULT_CATEGORY: ThemeCategory = "tactics";

export function ThemeForm() {
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState<ThemeCategory>(DEFAULT_CATEGORY);

  return (
    <form action={createThemeAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required placeholder="e.g. Fork" />
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
            placeholder="Optional short description"
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <ThemeCategorySelect value={category} onChange={setCategory} />
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue="0" />
          <p className="text-muted-foreground mt-1 text-xs">
            Used for display order in admin and UI. Leave gaps (e.g. 10, 100, 210) to insert themes later.
          </p>
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit">Add theme</Button>
    </form>
  );
}
