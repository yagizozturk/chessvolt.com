"use client";

import { deletePuzzleAction } from "@/app/(admin)/admin/puzzles/actions/delete-puzzle-action";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  title: string;
};

export function DeletePuzzleButton({ id, title }: Props) {
  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePuzzleAction(id);
  }

  return (
    <Button type="button" variant="outline" className="text-destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
}
