"use client";

import { deleteRiddleAction } from "@/app/(admin)/admin/riddles/actions/delete-riddle-action";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  title: string;
};

export function DeleteRiddleButton({ id, title }: Props) {
  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteRiddleAction(id);
  }

  return (
    <Button type="button" variant="outline" className="text-destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
}
