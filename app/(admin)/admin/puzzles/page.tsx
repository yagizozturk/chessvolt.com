import { Plus } from "lucide-react";
import Link from "next/link";

import { PuzzlesList } from "@/app/(admin)/admin/puzzles/components/puzzles-list";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPuzzleByIdWithThemes } from "@/features/puzzle/services/puzzle.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function AdminPuzzlesPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const { id } = await searchParams;
  const puzzleId = id?.trim() ?? "";
  const puzzle = puzzleId ? await getPuzzleByIdWithThemes(supabase, puzzleId) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Puzzles</h2>
            <p className="text-muted-foreground text-sm">Search by puzzle ID</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/puzzles/new/pgn-ply"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              PGN + ply
            </Link>
            <Link
              href="/admin/puzzles/new/from-game"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              From game
            </Link>
            <Link
              href="/admin/puzzles/new/bulk"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Bulk PGN
            </Link>
            <Link
              href="/admin/puzzles/new/lichess"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Lichess CSV
            </Link>
          </div>
        </div>
        <form action="/admin/puzzles" method="get" className="mb-4 flex max-w-md items-center gap-2">
          <Input
            name="id"
            defaultValue={puzzleId}
            placeholder="Puzzle ID"
            aria-label="Puzzle ID"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        {puzzleId && !puzzle ? (
          <EmptyDataMessage message="No puzzle found with that ID." />
        ) : puzzle ? (
          <PuzzlesList puzzles={[puzzle]} />
        ) : null}
      </section>
    </div>
  );
}
