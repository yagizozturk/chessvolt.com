"use client";

import Link from "next/link";

import { deleteOpeningAction } from "@/app/(admin)/admin/openings/main-opening/actions/openings";
import { Button } from "@/components/ui/button";
import type { Opening } from "@/features/openings/types/opening";

type Props = {
  openings: Opening[];
};

export function MainOpenings({ openings }: Props) {
  async function handleDelete(id: string) {
    if (!confirm("This opening will be deleted. All its variants will also be deleted (CASCADE). Are you sure?"))
      return;
    await deleteOpeningAction(id);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {openings.map((o) => (
        <div key={o.id} className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4">
          <Link
            href={`/admin/openings/main-opening/${o.id}`}
            className="hover:text-primary line-clamp-2 block min-w-0 font-medium transition-colors"
          >
            {o.name}
          </Link>
          <p className="text-muted-foreground text-xs">
            {o.type ? `${o.type} · ` : null}
            {o.arrows?.reduce((sum, group) => sum + group.arrows.length, 0) ?? 0} arrow(s)
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link href={`/admin/openings/main-opening/edit/${o.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDelete(o.id)}
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
