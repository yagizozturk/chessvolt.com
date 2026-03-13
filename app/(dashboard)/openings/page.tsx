import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllOpenings } from "@/features/openings/services/openings";
import { slugify } from "@/lib/utilities/slugify";
import { GAME_TYPE_QUOTES } from "@/lib/shared/constants/quote";
import { CollectionHeader } from "@/components/collection/collection-header";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import type { Opening } from "@/features/openings/types/opening";

function openingToRiddleAndGame(opening: Opening) {
  return {
    riddle: {
      id: opening.id,
      gameId: opening.id,
      ply: 0,
      title: opening.name,
      moves: "",
      gameType: null,
      createdAt: opening.createdAt,
    },
    game: {
      id: opening.id,
      pgn: "",
      whitePlayer: opening.name,
      blackPlayer: opening.ecoCode ?? "—",
      result: "",
      playedAt: "",
      url: null,
      createdAt: opening.createdAt,
      event: null,
      opening: opening.name,
      description: null,
    },
  };
}

export default async function OpeningsPage() {
  const { supabase } = await getAuthenticatedUser();
  const openings = await getAllOpenings(supabase);

  const openingQuote = GAME_TYPE_QUOTES.opening_crusher ?? {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      {openings.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No openings yet.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="px-2 py-3">
            <CollectionHeader
              title="Openings"
              imageSrc="/images/challanges/magnus_plays.png"
              imageAlt="Openings"
              description="Study and practice your opening repertoires. Build your arsenal and dominate from move one."
              quote={openingQuote.quote}
              author={openingQuote.author}
              itemCount={openings.length}
              itemLabel={openings.length === 1 ? "opening" : "openings"}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
            {openings.map((opening, index) => {
              const { riddle, game } = openingToRiddleAndGame(opening);
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
                <PuzzleCard
                  key={opening.id}
                  riddle={riddle}
                  game={game}
                  num={num}
                  numColorClass={numColorClass}
                  href={`/openings/${opening.slug ?? slugify(opening.name)}`}
                  initialFen={opening.fen}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
