import { EmptyState } from "@/components/empty-state/empty-state";
import { CollectionHeader } from "@/features/collection/components/collection-header";
import { loadCollectionRiddlesForDisplay } from "@/features/collection/services/collection-riddles-display.service";
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
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-8">
        <CollectionHeader collection={collection} />
        {riddles.length === 0 && <EmptyState message="No riddles found in this collection." />}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map(({ riddle, game, href, displayFen, accuracyPercent, voltScore, primaryTheme }) => (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
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
