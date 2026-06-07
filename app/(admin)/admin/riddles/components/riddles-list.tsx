"use client";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";

import { deleteRiddleAction } from "../actions/actions";
import { RiddleItem } from "./riddle-item";

type Props = {
  riddles: RiddleWithThemes[];
};

export function RiddlesList({ riddles }: Props) {
  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("This riddle will be deleted. Are you sure?")) return;
    await deleteRiddleAction(id);
  }

  if (riddles.length === 0) {
    return <EmptyDataMessage message="No riddles yet." />;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {riddles.map((r) => (
        <RiddleItem key={r.id} riddle={r} onDelete={handleDelete} />
      ))}
    </div>
  );
}
