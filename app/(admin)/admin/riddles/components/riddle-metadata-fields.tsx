"use client";

import { useState } from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/features/collection/types/collection";

type Props = {
  collections: Collection[];
  defaultCollectionId?: string;
  defaultTitle?: string;
  defaultRating?: number | null;
  defaultPopularity?: number | null;
  defaultThemes?: string;
  defaultIsActive?: boolean;
  defaultGoals?: string;
  showSourceFields?: boolean;
  defaultSource?: string;
  defaultSourceId?: string;
  hiddenGameId?: string;
};

export function RiddleMetadataFields({
  collections,
  defaultCollectionId = "",
  defaultTitle = "",
  defaultRating = null,
  defaultPopularity = null,
  defaultThemes = "",
  defaultIsActive = true,
  defaultGoals = "",
  showSourceFields = false,
  defaultSource = "",
  defaultSourceId = "",
  hiddenGameId,
}: Props) {
  const [isActive, setIsActive] = useState(defaultIsActive);

  return (
    <FieldGroup>
      {hiddenGameId ? <input type="hidden" name="gameId" value={hiddenGameId} /> : null}
      <Field>
        <FieldLabel>Title</FieldLabel>
        <Input name="title" required defaultValue={defaultTitle} placeholder="Riddle title" />
      </Field>
      <Field>
        <FieldLabel>Rating (optional)</FieldLabel>
        <Input
          name="rating"
          type="number"
          min={100}
          max={3000}
          defaultValue={defaultRating ?? ""}
          placeholder="Optional — 100–3000"
        />
      </Field>
      <Field>
        <FieldLabel>Popularity</FieldLabel>
        <Input name="popularity" type="number" defaultValue={defaultPopularity ?? ""} placeholder="Optional" />
      </Field>
      <Field>
        <FieldLabel>Themes</FieldLabel>
        <Input name="themes" defaultValue={defaultThemes} placeholder="Comma-separated slugs, e.g. fork, pin" />
      </Field>
      <Field>
        <FieldLabel>Collection (optional)</FieldLabel>
        <select
          name="collectionId"
          defaultValue={defaultCollectionId}
          className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        >
          <option value="">None</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </Field>
      {showSourceFields ? (
        <>
          <Field>
            <FieldLabel>Source</FieldLabel>
            <Input name="source" defaultValue={defaultSource} placeholder="e.g. manual" />
          </Field>
          <Field>
            <FieldLabel>Source ID</FieldLabel>
            <Input name="sourceId" defaultValue={defaultSourceId} placeholder="Optional external id" />
          </Field>
        </>
      ) : null}
      <Field>
        <FieldLabel>Goals (JSON, optional)</FieldLabel>
        <textarea
          name="goals"
          rows={4}
          defaultValue={defaultGoals}
          placeholder='[{"ply":1,"move":"e2e4","title":"...","hint":"...","isCompleted":false}]'
          className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-xs shadow-xs outline-none focus-visible:ring-[3px]"
        />
      </Field>
      <Field className="flex flex-row items-center gap-2">
        <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
        <Switch checked={isActive} onCheckedChange={setIsActive} />
        <FieldLabel className="mb-0">Active</FieldLabel>
      </Field>
    </FieldGroup>
  );
}
