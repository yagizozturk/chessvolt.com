"use client";

import Link from "next/link";

import { deleteRiddleAction } from "@/app/(admin)/admin/riddles/actions/delete-riddle-action";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRiddleRatingLabel } from "@/features/riddle/types/riddle-rating";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";

type Props = {
  riddles: RiddleWithThemes[];
};

export function RiddleListItem({ riddle }: { riddle: RiddleWithThemes }) {
  async function handleDelete() {
    if (!confirm(`Delete "${riddle.title}"? This cannot be undone.`)) return;
    await deleteRiddleAction(riddle.id);
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div className="font-medium">{riddle.title}</div>
        {riddle.source ? (
          <div className="text-muted-foreground text-xs">
            {riddle.source}
            {riddle.sourceId ? ` · ${riddle.sourceId}` : ""}
          </div>
        ) : null}
      </td>
      <td className="text-muted-foreground px-4 py-3">{formatRiddleRatingLabel(riddle.rating)}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {riddle.themeSlugs.slice(0, 4).map((slug) => (
            <Badge key={slug} variant="outline" className="text-xs">
              {slug}
            </Badge>
          ))}
          {riddle.themeSlugs.length > 4 ? (
            <span className="text-muted-foreground text-xs">+{riddle.themeSlugs.length - 4}</span>
          ) : null}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={riddle.isActive ? "default" : "secondary"}>{riddle.isActive ? "Active" : "Inactive"}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/riddles/${riddle.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Link href={`/admin/riddles/edit/${riddle.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function RiddlesList({ riddles }: Props) {
  if (riddles.length === 0) {
    return <EmptyDataMessage message="No riddles yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Themes</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {riddles.map((riddle) => (
            <RiddleListItem key={riddle.id} riddle={riddle} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
