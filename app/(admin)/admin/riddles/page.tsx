import { Plus } from "lucide-react";
import Link from "next/link";

import { RiddlesList } from "@/app/(admin)/admin/riddles/components/riddles-list";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRiddleByIdWithThemes } from "@/features/riddle/services/riddle.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function AdminRiddlesPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const { id } = await searchParams;
  const riddleId = id?.trim() ?? "";
  const riddle = riddleId ? await getRiddleByIdWithThemes(supabase, riddleId) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Riddles</h2>
            <p className="text-muted-foreground text-sm">Search by riddle ID</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/riddles/new/pgn-ply"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              PGN + ply
            </Link>
            <Link
              href="/admin/riddles/new/from-game"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              From game
            </Link>
            <Link
              href="/admin/riddles/new/bulk"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Bulk PGN
            </Link>
            <Link
              href="/admin/riddles/new/lichess"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Lichess CSV
            </Link>
          </div>
        </div>
        <form action="/admin/riddles" method="get" className="mb-4 flex max-w-md items-center gap-2">
          <Input
            name="id"
            defaultValue={riddleId}
            placeholder="Riddle ID"
            aria-label="Riddle ID"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        {riddleId && !riddle ? (
          <EmptyDataMessage message="No riddle found with that ID." />
        ) : riddle ? (
          <RiddlesList riddles={[riddle]} />
        ) : null}
      </section>
    </div>
  );
}
