"use client";

import type { Riddle } from "@/features/riddle/types/riddle";

import { deleteRiddleAction } from "../actions/actions";
import { RiddleItem } from "./riddle-item";

type Props = {
  riddles: Riddle[];
};

export function RiddlesList({ riddles }: Props) {
  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("This riddle will be deleted. Are you sure?")) return;
    await deleteRiddleAction(id);
  }

  if (riddles.length === 0) {
    return <p className="text-muted-foreground py-8 text-center">No riddles yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {riddles.map((r) => (
        <RiddleItem key={r.id} riddle={r} onDelete={handleDelete} />
      ))}
    </div>
  );
}
