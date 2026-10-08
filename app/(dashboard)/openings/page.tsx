import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header/page-header";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { OpeningTypeFilter } from "@/features/openings/components/opening-type-filter";
import {
  getOpeningsWithVariantCount,
  getOpeningsWithVariantCountByType,
} from "@/features/openings/services/openings.service";
import { getPublicUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Learn Chess Openings & Key Variations | ChessVolt",
  description:
    "Learn chess openings from 1.e4 and 1.d4 to Indian defenses. Practice key variations move by move and understand the ideas behind your opening moves.",
};

type SearchParams = Promise<{ type?: string }>;

export default async function OpeningsPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await getPublicUser();
  const params = await searchParams;
  const filterType = params.type?.trim() ?? "";

  // Filtreye göre getirmesi gereken açılıları getirir.
  const openings = filterType
    ? await getOpeningsWithVariantCountByType(supabase, filterType)
    : await getOpeningsWithVariantCount(supabase);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* ====== Sayfa Başlığı ====== */}
        <PageHeader
          title="Learn Openings To Master The Game"
          description="From e4 openings to d4, indian setups"
          actions={<OpeningTypeFilter filterType={filterType} />}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* ====== Opening varmı kontrolü ====== */}
          {openings.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center text-sm">
              {filterType ? "No openings match this type." : "No openings available yet."}
            </p>
          )}

          {/* ====== Opening Board Cards ====== */}
          {openings.map((opening) => (
            <OpeningBoardCard
              key={opening.id}
              id={opening.id}
              name={opening.name}
              description={opening.description}
              variantCount={opening.variantCount}
              href={`/openings/${opening.slug}/${opening.id}`}
              fen={opening.displayFen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
