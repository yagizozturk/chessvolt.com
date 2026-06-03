"use client";

import { useState } from "react";

import {
  deleteCollectionContentThemeAction,
  updateCollectionContentThemeAction,
} from "@/app/(admin)/admin/collections/actions/collection-content-themes";
import type { ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import {
  CONTENT_THEME_WEIGHTS,
  formatContentThemeWeightLabel,
  isContentThemeWeight,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Props = {
  collectionId: string;
  items: ContentThemeWithTheme[];
};

export function CollectionContentThemesList({ collectionId, items }: Props) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No themes linked to this collection yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Theme</th>
            <th className="px-4 py-3 font-medium">Weight</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <CollectionContentThemeRow
              key={item.id}
              collectionId={collectionId}
              item={item}
              showTopTwoHint={index < 2}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type RowProps = {
  collectionId: string;
  item: ContentThemeWithTheme;
  showTopTwoHint: boolean;
};

function CollectionContentThemeRow({ collectionId, item, showTopTwoHint }: RowProps) {
  const [weight, setWeight] = useState<ContentThemeWeight>(item.weight);

  async function handleDelete() {
    const label = item.theme.title;
    if (!confirm(`Remove "${label}" from this collection?`)) return;
    await deleteCollectionContentThemeAction(item.id, collectionId);
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <div className="font-medium">{item.theme.title}</div>
            <div className="text-muted-foreground font-mono text-xs">/{item.theme.slug}</div>
          </div>
          {showTopTwoHint ? (
            <Badge variant="secondary" className="text-xs">
              Shown on card
            </Badge>
          ) : null}
        </div>
      </td>
      <td className="px-4 py-3">
        <form action={updateCollectionContentThemeAction} className="flex items-center gap-2">
          <input type="hidden" name="collectionId" value={collectionId} />
          <input type="hidden" name="contentThemeId" value={item.id} />
          <select
            name="weight"
            required
            value={String(weight)}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (isContentThemeWeight(num)) setWeight(num);
            }}
            title={formatContentThemeWeightLabel(weight)}
            className={cn(
              "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 min-w-[4.5rem] rounded-md border border-2 bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
            )}
          >
            {CONTENT_THEME_WEIGHTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm" className="shrink-0">
            Save
          </Button>
        </form>
      </td>
      <td className="px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Remove
        </Button>
      </td>
    </tr>
  );
}
