"use client";

import { useState } from "react";

import { createCollectionAction } from "@/app/(admin)/admin/collections/actions/collections";
import {
  DEFAULT_COLLECTION_COVER_COLOR,
  DEFAULT_COLLECTION_COVER_IMAGE,
} from "@/app/(admin)/admin/collections/constants/cover-images";
import { CollectionDifficultySelect } from "@/app/(admin)/admin/collections/components/collection-difficulty-select";
import { CollectionTypeSelect } from "@/app/(admin)/admin/collections/components/collection-type-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_COLLECTION_DIFFICULTY } from "@/features/collection/constants/collection-difficulty.constants";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import type { CollectionType } from "@/features/collection/types/collection-type";

export function CollectionForm() {
  const [isActive, setIsActive] = useState(true);
  const [difficulty, setDifficulty] = useState<CollectionDifficulty>(DEFAULT_COLLECTION_DIFFICULTY);
  const [collectionType, setCollectionType] = useState<CollectionType>("admin");

  return (
    <form action={createCollectionAction} className="space-y-4">
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
            placeholder="Short summary shown on collection cards"
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <CollectionDifficultySelect value={difficulty} onChange={setDifficulty} />
        <CollectionTypeSelect value={collectionType} onChange={setCollectionType} />
        <Field>
          <FieldLabel>Cover image</FieldLabel>
          <Input
            name="coverImageUrl"
            required
            placeholder="e.g. from-tal-to-kasparov.png"
            defaultValue={DEFAULT_COLLECTION_COVER_IMAGE}
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
            defaultValue={DEFAULT_COLLECTION_COVER_COLOR}
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
          <FieldLabel className="mb-0">Active (visible on collection pages)</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit">Add collection</Button>
    </form>
  );
}
