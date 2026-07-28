import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { FavoritesViewFilter } from "@/features/favorites/components/favorites-view-filter";
import { parseFavoritesView } from "@/features/favorites/types/favorites-view";
import { UserFavoriteOpeningVariants } from "@/features/user-favorites/components/user-favorite-opening-variants";
import { UserFavoriteRiddles } from "@/features/user-favorites/components/user-favorite-riddles";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Favorites | ChessVolt",
  description: "Favorite openings and riddles to check your Volt score.",
};

type SearchParams = Promise<{ view?: string }>;

export default async function FavoritesPage({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getAuthenticatedUser();
  const params = await searchParams;
  const view = parseFavoritesView(params.view);

  // ================================================================================================
  // Getting favorites count for the user so to show dialog if not 0.
  // Because I need to show dialog if there is VoltScore shown in any card, riddle or opening.
  // ================================================================================================
  const { count: favoritesCount } = await supabase
    .from("user_favorites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Favorites"
          description="Your favourite openings and riddles to check your Volt score."
          actions={<FavoritesViewFilter view={view} />}
        />

        {/* Volt Explain shows only once (localStorage); only when user has favorites */}
        {(favoritesCount ?? 0) > 0 ? <VoltExplainDialogAutoStart /> : null}

        {(view === "all" || view === "riddles") && (
          <UserFavoriteRiddles userId={user.id} supabase={supabase} />
        )}
        {(view === "all" || view === "openings") && (
          <UserFavoriteOpeningVariants userId={user.id} supabase={supabase} />
        )}
      </div>
    </div>
  );
}
