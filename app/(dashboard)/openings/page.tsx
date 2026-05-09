import Image from "next/image";

import { Input } from "@/components/ui/input";
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
      <div className="flex rounded-lg bg-orange-300 p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-accent text-2xl font-bold">Openings</h1>
          <p className="text-secondary text-base">
            Openings are a collection of chess positions that are used to help you improve your chess skills.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            >
              All
            </button>
            <button
              type="button"
              className="bg-background text-foreground hover:bg-background/80 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
            >
              White
            </button>
            <button
              type="button"
              className="bg-background text-foreground hover:bg-background/80 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
            >
              Black
            </button>
            <button
              type="button"
              className="bg-background text-foreground hover:bg-background/80 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
            >
              Popular
            </button>
            <div className="min-w-[220px] flex-1">
              <Input type="search" placeholder="Search openings..." className="bg-white" />
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <Image src="/images/avatar/volt-avatar.jpg" alt="Opening" width={120} height={120} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 py-3">
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
