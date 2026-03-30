"use client";

import { deleteOpeningAction } from "@/app/(admin)/admin/openings/actions/openings";
import { Button } from "@/components/ui/button";
import type { Opening } from "@/features/openings/types/opening";
import { Trash2 } from "lucide-react";
import Link from "next/link";

type Props = {
  openings: Opening[];
};

export function MainOpenings({ openings }: Props) {
  async function handleDelete(id: string) {
    if (
      !confirm(
        "This opening will be deleted. All its variants will also be deleted (CASCADE). Are you sure?",
      )
    )
      return;
    await deleteOpeningAction(id);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {openings.map((o) => (
        <div
          key={o.id}
          className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4"
        >
          <Link
            href={`/admin/openings/opening/${o.id}`}
            className="hover:text-primary line-clamp-2 block min-w-0 font-medium transition-colors"
          >
            {o.name}
          </Link>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link href={`/admin/openings/opening/${o.id}`}>
              <Button variant="outline" size="sm">
                Variants
              </Button>
            </Link>
            <Link href={`/admin/openings/edit/${o.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(o.id)}
              className="text-destructive hover:bg-destructive/10"
              aria-label="Delete opening"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
