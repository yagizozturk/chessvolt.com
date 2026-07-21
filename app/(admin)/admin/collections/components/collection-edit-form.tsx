"use client";

import { useActionState, useState } from "react";

import {
  type UpdateCollectionFormState,
  updateCollectionAction,
} from "@/app/(admin)/admin/collections/actions/collections";
import { DEFAULT_COLLECTION_COVER_COLOR } from "@/app/(admin)/admin/collections/constants/cover-images";
import { CollectionDifficultySelect } from "@/app/(admin)/admin/collections/components/collection-difficulty-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/features/collection/types/collection";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";

type Props = {
  collection: Collection;
};

const initialState: UpdateCollectionFormState = { error: null };

export function CollectionEditForm({ collection }: Props) {
  const [state, formAction, isPending] = useActionState(updateCollectionAction, initialState);
  const [isActive, setIsActive] = useState(collection.isActive);
  const [difficulty, setDifficulty] = useState<CollectionDifficulty>(collection.difficulty);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="collectionId" value={collection.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required defaultValue={collection.title} />
        </Field>
        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <Input name="slug" defaultValue={collection.slug} />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            rows={3}
            defaultValue={collection.description}
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <CollectionDifficultySelect value={difficulty} onChange={setDifficulty} />
        <Field>
          <FieldLabel>Cover image</FieldLabel>
          <Input
            name="coverImageUrl"
            required
            placeholder="e.g. from-tal-to-kasparov.png"
            defaultValue={collection.coverImageUrl}
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs">Filename under public/images/collections/</p>
        </Field>
        <Field>
          <FieldLabel>Cover color</FieldLabel>
          <Input
            name="coverImageColor"
            required
            placeholder="#5D37BF"
            defaultValue={collection.coverImageColor || DEFAULT_COLLECTION_COVER_COLOR}
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Sort order</FieldLabel>
          <Input name="sortOrder" type="number" defaultValue={String(collection.sortOrder)} />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel className="mb-0">Active (visible on collection pages)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
