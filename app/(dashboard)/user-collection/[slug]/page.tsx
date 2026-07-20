// TODO: Refactor
import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeaderWithImage } from "@/components/page-header";
import { loadCollectionRiddlesForDisplay } from "@/features/collection/services/collection-riddles-display.service";
import { getCollectionCoverImageSrc } from "@/features/collection/utilities/collection-cover-image.utils";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function UserCollectionDetailPage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const { collection, riddles, items } = await loadCollectionRiddlesForDisplay({
    supabase,
    user,
    slug,
    collectionType: "custom",
  });

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderWithImage
          title={collection.title}
          description={collection.description}
          imageSrc={getCollectionCoverImageSrc(collection.coverImageUrl)}
        />
        {riddles.length === 0 && <EmptyState message="No riddles found in this collection." />}
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
              showVoltScore
              voltScore={voltScore}
              primaryTheme={primaryTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
