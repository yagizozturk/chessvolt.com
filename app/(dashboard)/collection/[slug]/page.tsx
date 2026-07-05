import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeaderWithImage } from "@/components/page-header";
import { loadCollectionRiddlesForDisplay } from "@/features/collection/services/collection-riddles-display.service";
import { getCollectionCoverImageSrc } from "@/features/collection/utilities/collection-cover-image.utils";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionDetailPage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getPublicUser();

  // ================================================================================================
  // Loading collection riddles for display from service
  // ================================================================================================
  const { collection, riddles, items } = await loadCollectionRiddlesForDisplay({
    supabase,
    user,
    slug,
    collectionType: "admin",
  });

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page header */}
        <PageHeaderWithImage
          title={collection.title}
          description={collection.description}
          imageSrc={getCollectionCoverImageSrc(collection.coverImageUrl)}
        />
        {/* Show empty state if no riddles found in collection */}
        {riddles.length === 0 && <EmptyState message="No riddles found in this collection." />}
        {/* Show riddles in grid layout */}
        <div className="page-container-grid-data-layout">
          {items.map(({ riddle, game, href, displayFen, accuracyPercent, voltScore, primaryTheme }) => (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              boardWrapperClassName="aspect-square w-[180px] shrink-0"
              href={href}
              displayFen={displayFen}
              accuracyPercent={accuracyPercent}
              voltScore={voltScore}
              primaryTheme={primaryTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
