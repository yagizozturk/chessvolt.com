"use client";

import { useState } from "react";

import { createStudyAction } from "@/app/(admin)/admin/studies/actions/studies";
import {
  DEFAULT_STUDY_COVER_COLOR,
  DEFAULT_STUDY_COVER_IMAGE,
} from "@/app/(admin)/admin/studies/constants/cover-images";
import { StudyDifficultySelect } from "@/app/(admin)/admin/studies/components/study-difficulty-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_STUDY_DIFFICULTY } from "@/features/study/constants/study-difficulty.constants";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";

export function StudyForm() {
  const [isActive, setIsActive] = useState(true);
  const [difficulty, setDifficulty] = useState<StudyDifficulty>(DEFAULT_STUDY_DIFFICULTY);

  return (
    <form action={createStudyAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required placeholder="e.g. Legend Games from Tal to Kasparov" />
        </Field>
        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <Input name="slug" placeholder="Auto-generated from title if empty" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            placeholder="Short summary shown on study cards"
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <StudyDifficultySelect value={difficulty} onChange={setDifficulty} />
        <Field>
          <FieldLabel>Cover image</FieldLabel>
          <Input
            name="coverImageUrl"
            required
            placeholder="e.g. from-tal-to-kasparov.png"
            defaultValue={DEFAULT_STUDY_COVER_IMAGE}
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs">Filename under public/images/studies/</p>
        </Field>
        <Field>
          <FieldLabel>Cover color</FieldLabel>
          <Input
            name="coverImageColor"
            required
            placeholder="#5D37BF"
            defaultValue={DEFAULT_STUDY_COVER_COLOR}
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue="0" />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active (visible on study pages)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit">Add study</Button>
    </form>
  );
}
