"use client";

import { useActionState, useState } from "react";

import {
  type UpdateStudyFormState,
  updateStudyAction,
} from "@/app/(admin)/admin/studies/actions/studies";
import { DEFAULT_STUDY_COVER_COLOR } from "@/app/(admin)/admin/studies/constants/cover-images";
import { StudyDifficultySelect } from "@/app/(admin)/admin/studies/components/study-difficulty-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Study } from "@/features/study/types/study";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";

type Props = {
  study: Study;
};

const initialState: UpdateStudyFormState = { error: null };

export function StudyEditForm({ study }: Props) {
  const [state, formAction, isPending] = useActionState(updateStudyAction, initialState);
  const [isActive, setIsActive] = useState(study.isActive);
  const [difficulty, setDifficulty] = useState<StudyDifficulty>(study.difficulty);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="studyId" value={study.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required defaultValue={study.title} />
        </Field>
        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <Input name="slug" defaultValue={study.slug} />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            defaultValue={study.description}
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
            defaultValue={study.coverImageUrl}
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
            defaultValue={study.coverImageColor || DEFAULT_STUDY_COVER_COLOR}
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue={String(study.sortOrder)} />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active (visible on study pages)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
