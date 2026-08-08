"use client";

import Link from "next/link";

import { deletePuzzleAction } from "@/app/(admin)/admin/puzzles/actions/delete-puzzle-action";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPuzzleRatingLabel } from "@/features/puzzle/types/puzzle-rating";
import type { PuzzleWithThemes } from "@/features/puzzle/types/puzzle-with-themes";

type Props = {
  puzzles: PuzzleWithThemes[];
};

export function PuzzleListItem({ puzzle }: { puzzle: PuzzleWithThemes }) {
  async function handleDelete() {
    if (!confirm(`Delete "${puzzle.title}"? This cannot be undone.`)) return;
    await deletePuzzleAction(puzzle.id);
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div className="font-medium">{puzzle.title}</div>
        {puzzle.source ? (
          <div className="text-muted-foreground text-xs">
            {puzzle.source}
            {puzzle.sourceId ? ` · ${puzzle.sourceId}` : ""}
          </div>
        ) : null}
      </td>
      <td className="text-muted-foreground px-4 py-3">{formatPuzzleRatingLabel(puzzle.rating)}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {puzzle.themeSlugs.slice(0, 4).map((slug) => (
            <Badge key={slug} variant="outline" className="text-xs">
              {slug}
            </Badge>
          ))}
          {puzzle.themeSlugs.length > 4 ? (
            <span className="text-muted-foreground text-xs">+{puzzle.themeSlugs.length - 4}</span>
          ) : null}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={puzzle.isActive ? "default" : "secondary"}>{puzzle.isActive ? "Active" : "Inactive"}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/puzzles/${puzzle.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Link href={`/admin/puzzles/edit/${puzzle.id}`}>
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

export function PuzzlesList({ puzzles }: Props) {
  if (puzzles.length === 0) {
    return <EmptyDataMessage message="No puzzles yet." />;
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
          {puzzles.map((puzzle) => (
            <PuzzleListItem key={puzzle.id} puzzle={puzzle} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
