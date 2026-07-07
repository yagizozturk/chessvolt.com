import { PageHeader } from "@/components/page-header";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { OpeningTypeFilter } from "@/features/openings/components/opening-type-filter";
import {
  getOpeningsWithVariantCount,
  getOpeningsWithVariantCountByType,
} from "@/features/openings/services/openings.service";
import { getPublicUser } from "@/lib/supabase/auth";

type SearchParams = Promise<{ type?: string }>;

export default async function OpeningsPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await getPublicUser();
  const params = await searchParams;
  const filterType = params.type?.trim() ?? "";

  const openings = filterType
    ? await getOpeningsWithVariantCountByType(supabase, filterType)
    : await getOpeningsWithVariantCount(supabase);

  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <PageHeader
          title="Learn Openings To Master The Game"
          description="From e4 openings to d4, indian setups"
          actions={<OpeningTypeFilter filterType={filterType} />}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {openings.length === 0 && filterType ? (
            <p className="text-muted-foreground col-span-2 text-center text-sm">
              No openings match this type. Set the opening&apos;s type in admin (e.g. white, black, popular).
            </p>
          ) : null}
          {openings.map((opening) => {
            return (
              <OpeningBoardCard
                key={opening.id}
                id={opening.id}
                name={opening.name}
                description={opening.description}
                variantCount={opening.variantCount}
                href={`/openings/${opening.slug}/${opening.id}`}
                fen={opening.displayFen}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
