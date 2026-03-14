import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllOpenings } from "@/features/openings/services/openings";
import { slugify } from "@/lib/utilities/slugify";
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
      whitePlayer: "White",
      blackPlayer: "Black",
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

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      {openings.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No openings yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
          {openings.map((opening, index) => {
            const { riddle, game } = openingToRiddleAndGame(opening);
            const num = index + 1;

            return (
              <PuzzleCard
                key={opening.id}
                riddle={riddle}
                game={game}
                num={num}
                width={250}
                height={250}
                href={`/openings/${opening.slug ?? slugify(opening.name)}`}
                initialFen={opening.fen}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
