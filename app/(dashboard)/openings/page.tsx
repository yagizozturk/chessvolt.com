import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getAllOpenings } from "@/features/openings/services/openings";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function OpeningsPage() {
  const { supabase } = await getAuthenticatedUser();
  const openings = await getAllOpenings(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
        {openings.map((opening, index) => {
          return (
            <OpeningBoardCard
              key={opening.id}
              id={opening.id}
              name={opening.name}
              num={index + 1}
              width={250}
              height={250}
              href={`/openings/${opening.slug}/${opening.id}`}
              fen={opening.displayFen}
            />
          );
        })}
      </div>
    </div>
  );
}
