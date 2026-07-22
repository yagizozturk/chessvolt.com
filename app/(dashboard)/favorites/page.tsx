import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { FavoritesViewFilter } from "@/features/favorites/components/favorites-view-filter";
import { parseFavoritesView } from "@/features/favorites/types/favorites-view";
import { UserFavouriteOpeningVariants } from "@/features/user-favourites/components/user-favourite-opening-variants";
import { UserFavouriteRiddles } from "@/features/user-favourites/components/user-favourite-riddles";
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
          <UserFavouriteRiddles userId={user.id} supabase={supabase} />
        ) : (
          <UserFavouriteOpeningVariants userId={user.id} supabase={supabase} />
        )}
      </div>
    </div>
  );
}
