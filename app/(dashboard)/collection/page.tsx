import Link from "next/link";

import { CollectionHeader } from "@/features/collection/components/collection-header";
import { getActiveCollectionsWithRiddleCount } from "@/features/collection/services/collection.service";
import { DEFAULT_GAME_TYPE_DETAILS } from "@/lib/shared/constants/game-type-details";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function CollectionPage() {
  const { supabase } = await getPublicUser();
  const collections = await getActiveCollectionsWithRiddleCount(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="mt-12 space-y-24">
        {collections.length === 0 && (
          <div className="bg-muted/40 rounded-xl px-4 py-8 text-center">
            <p className="text-muted-foreground">No collections available yet.</p>
          </div>
        )}
        {collections.map((collection) => (
          <Link
            href={`/collection/${collection.slug}`}
            key={collection.id}
            className="block transition-opacity hover:opacity-90"
          >
            <CollectionHeader
              title={collection.title}
              imageSrc={`/images/challanges/${collection.coverImageUrl}`}
              imageAlt={collection.title}
              description={collection.description ?? DEFAULT_GAME_TYPE_DETAILS.description}
              quote={DEFAULT_GAME_TYPE_DETAILS.quote}
              author={DEFAULT_GAME_TYPE_DETAILS.author}
              backgroundColor={collection.coverImageColor ?? DEFAULT_GAME_TYPE_DETAILS.backgroundColor}
              itemCount={collection.riddleCount}
              itemLabel="riddles"
            />
            <p className="text-muted-foreground text-sm">
              {collection.riddleCount} {collection.riddleCount === 1 ? "riddle" : "riddles"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
