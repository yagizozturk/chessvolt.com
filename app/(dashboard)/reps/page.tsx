import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllReps } from "@/features/reps/services/reps";
import Link from "next/link";
import { Sword, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";

export default async function RepsPage() {
  const { supabase } = await getAuthenticatedUser();
  const reps = await getAllReps(supabase);

  const repsWithPgn = reps.filter((r) => r.pgn);

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      {reps.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No repertoires yet.
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold">
                Repertoire
                <Badge variant="default" className="font-normal">
                  {reps.length} repertoire{reps.length !== 1 ? "s" : ""}
                </Badge>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Study and practice your opening repertoires.
              </p>
            </div>
          </div>
          <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {repsWithPgn.map((rep, index) => {
              const num = index + 1;
              const numColorClasses = [
                "text-primary",
                "text-chart-2",
                "text-chart-4",
                "text-chart-1",
                "text-chart-3",
                "text-chart-5",
              ];
              const numColorClass =
                numColorClasses[index % 6] ?? numColorClasses[0];

              return (
                <Link
                  key={rep.id}
                  href={`/reps/${rep.id}`}
                  className="group flex flex-col"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex shrink-0 items-baseline gap-0.5">
                      <span className={`text-sm font-medium ${numColorClass}`}>
                        #
                      </span>
                      <span className={`text-4xl font-bold ${numColorClass}`}>
                        {num}
                      </span>
                    </span>
                    <p className="truncate text-lg">
                      {rep.title || "Untitled Repertoire"}
                    </p>
                  </div>
                  <div className="group/board relative mt-2 inline-flex justify-center">
                    <PuzzleBoard
                      sourceId={rep.id}
                      mode="riddle"
                      pgn={rep.pgn ?? ""}
                      ply={rep.ply ?? 0}
                      moves={rep.moves}
                      width={280}
                      height={280}
                      className="border-muted rounded-xl border-4"
                      viewOnly
                    />
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
                      <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
                        <Sword className="text-primary-foreground h-7 w-7" />
                      </div>
                      <span className="font-semibold text-white">Play</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    {rep.openingName ? (
                      <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/10 text-primary"
                      >
                        <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                        {rep.openingName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Opening repertoire
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
