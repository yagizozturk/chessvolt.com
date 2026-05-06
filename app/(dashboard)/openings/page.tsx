import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getOpeningsWithVariantCount } from "@/features/openings/services/openings.service";
import { getPublicUser } from "@/lib/supabase/auth";

/**
 * Fonksyon Bilgisi ✅
 * 1. Auth olmayan ziyaretçi de her bilgiyi görebilir
 */
export default async function OpeningsPage() {
  const { supabase } = await getPublicUser();
  const openings = await getOpeningsWithVariantCount(supabase);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-4 pb-16">
      <div className="grid grid-cols-2 gap-6 px-2 py-3">
        {openings.map((opening, index) => {
          return (
            <OpeningBoardCard
              key={opening.id}
              id={opening.id}
              name={opening.name}
              description={opening.description}
              variantCount={opening.variantCount}
              num={index + 1}
              size={160}
              href={`/openings/${opening.slug}/${opening.id}`}
              fen={opening.displayFen}
            />
          );
        })}
      </div>
    </div>
  );
}
