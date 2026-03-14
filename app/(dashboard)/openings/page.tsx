import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllOpenings } from "@/features/openings/services/openings";
import { slugify } from "@/lib/utilities/slugify";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";

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
            const num = index + 1;

            return (
              <OpeningBoardCard
                key={opening.id}
                id={opening.id}
                name={opening.name}
                num={num}
                width={250}
                height={250}
                href={`/openings/${opening.slug ?? slugify(opening.name)}/${opening.id}`}
                displayFen={opening.displayFen}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
