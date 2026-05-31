"use client";

import Link from "next/link";

import { deleteCollectionAction } from "@/app/(admin)/admin/collections/actions/collections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollectionWithRiddleCount } from "@/features/collection/types/collection";
import { formatRiddleDifficultyLabel } from "@/features/riddle/types/riddle-difficulty";

type Props = {
  collections: CollectionWithRiddleCount[];
};

export function CollectionsList({ collections }: Props) {
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? Riddle links in this collection will also be removed.`)) return;
    await deleteCollectionAction(id);
  }

  if (collections.length === 0) {
    return <p className="text-muted-foreground text-sm">No collections yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <div key={collection.id} className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/collection/${collection.slug}`}
              className="hover:text-primary line-clamp-2 min-w-0 font-medium transition-colors"
            >
              {collection.title}
            </Link>
            <Badge variant={collection.isActive ? "default" : "secondary"}>
              {collection.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-xs">{collection.description || "No description"}</p>
          <p className="text-muted-foreground text-xs">
            {formatRiddleDifficultyLabel(collection.difficulty)} · {collection.riddleCount}{" "}
            {collection.riddleCount === 1 ? "riddle" : "riddles"} · /{collection.slug}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link href={`/admin/collections/edit/${collection.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDelete(collection.id, collection.title)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
