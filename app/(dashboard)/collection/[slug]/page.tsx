import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeaderWithImage } from "@/components/page-header";
import { CollectionRiddlesPagination } from "@/features/collection/components/collection-riddles-pagination";
import { loadCollectionRiddlesForDisplay } from "@/features/collection/services/collection-riddles-display.service";
import { getCollectionCoverImageSrc } from "@/features/collection/utilities/collection-cover-image.utils";
import { parseCollectionRiddlesPage } from "@/features/collection/utilities/collection-riddles-pagination.utils";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getPublicUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CollectionDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseCollectionRiddlesPage(pageParam);
  const { user, supabase } = await getPublicUser();

  const { collection, items, pagination } = await loadCollectionRiddlesForDisplay({
    supabase,
    user,
    slug,
    collectionType: "admin",
    page,
  });

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page Header with Collection Image */}
        <PageHeaderWithImage
          title={collection.title}
          description={collection.description}
          imageSrc={getCollectionCoverImageSrc(collection.coverImageUrl)}
        />

        {/* Check If there are collections, if not, empty state */}
        {pagination?.totalCount === 0 && <EmptyState message="No riddles found in this collection." />}

        {/* If there are collections, display them in a grid */}
        <div className="page-container-grid-data-layout">
          {items.map(({ riddle, game, href, displayFen, accuracyPercent, primaryTheme }) => (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              boardWrapperClassName="aspect-square w-[180px] shrink-0"
              href={href}
              displayFen={displayFen}
              accuracyPercent={accuracyPercent}
              primaryTheme={primaryTheme}
            />
          ))}
        </div>

        {/* If there are collections and pages, display the pagination navigator */}
        {pagination ? (
          <CollectionRiddlesPagination
            basePath={`/collection/${slug}`}
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        ) : null}
      </div>
    </div>
  );
}
