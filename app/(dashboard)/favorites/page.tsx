import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { FavoritesViewFilter } from "@/features/favorites/components/favorites-view-filter";
import { parseFavoritesView } from "@/features/favorites/types/favorites-view";
import { UserFavoriteOpeningVariants } from "@/features/user-favorites/components/user-favorite-opening-variants";
import { UserFavoriteRiddles } from "@/features/user-favorites/components/user-favorite-riddles";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Favorites | ChessVolt",
  description: "Your favourite openings and riddles.",
};

type SearchParams = Promise<{ view?: string }>;

export default async function FavoritesPage({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getAuthenticatedUser();
  const params = await searchParams;
  const view = parseFavoritesView(params.view);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Favorites"
          description="Your favourite openings and riddles."
          actions={<FavoritesViewFilter view={view} />}
        />

        {view === "riddles" ? (
          <UserFavoriteRiddles userId={user.id} supabase={supabase} />
        ) : (
          <UserFavoriteOpeningVariants userId={user.id} supabase={supabase} />
        )}
      </div>
    </div>
  );
}
