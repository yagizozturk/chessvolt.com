"use client";

import { createCollectionAction } from "@/app/(admin)/admin/collections/actions/collections";
import {
  COLLECTION_COVER_IMAGES,
  DEFAULT_COLLECTION_COVER_COLOR,
} from "@/app/(admin)/admin/collections/constants/cover-images";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

export function CollectionForm() {
  const [isActive, setIsActive] = useState(true);
  const defaultCover = COLLECTION_COVER_IMAGES[0]?.url ?? "";

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
        <Field>
          <FieldLabel>Cover image</FieldLabel>
          <select
            name="coverImageUrl"
            required
            defaultValue={defaultCover}
            className={cn(
              "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
            )}
          >
            {COLLECTION_COVER_IMAGES.map((image) => (
              <option key={image.url} value={image.url}>
                {image.label}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>Cover color</FieldLabel>
          <Input
            name="coverImageColor"
            required
            type="color"
            defaultValue={DEFAULT_COLLECTION_COVER_COLOR}
            className="h-10 w-full cursor-pointer"
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
