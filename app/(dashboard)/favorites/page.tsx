import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { FavoritesViewFilter } from "@/features/favorites/components/favorites-view-filter";
import { parseFavoritesView } from "@/features/favorites/types/favorites-view";
import { FavoritesTour } from "@/features/user-favorites/components/favorites-tour";
import { UserFavoriteOpeningVariants } from "@/features/user-favorites/components/user-favorite-opening-variants";
import { UserFavoritePuzzles } from "@/features/user-favorites/components/user-favorite-puzzles";
import { FAVORITES_TOUR_ID } from "@/features/user-favorites/tours/favorites-tour-steps";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Favorites | ChessVolt",
  description: "Favorite openings and puzzles to check your Volt score.",
};

type SearchParams = Promise<{ view?: string }>;

export default async function FavoritesPage({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getAuthenticatedUser();
  const params = await searchParams;
  const view = parseFavoritesView(params.view);

  // ================================================================================================
  // Getting favorites count for the user so to show dialog if not 0.
  // Because I need to show dialog if there is VoltScore shown in any card, puzzle or opening.
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
          description="Your favorite openings and puzzles to check your Volt score."
          actions={<FavoritesViewFilter view={view} />}
        />

        <FavoritesTour view={view} />

        {/* Volt Explain: second visit (after favorites tour); only when user has favorites */}
        {(favoritesCount ?? 0) > 0 ? <VoltExplainDialogAutoStart requireTourSeenId={FAVORITES_TOUR_ID} /> : null}

        <div className="flex flex-col gap-8">
          {(view === "all" || view === "openings") && (
            <div data-tour="favorites-opening-list">
              <h2 className="mb-3 text-lg font-bold">Opening variants</h2>
              <UserFavoriteOpeningVariants userId={user.id} supabase={supabase} />
            </div>
          )}
          {(view === "all" || view === "puzzles") && (
            <div data-tour="favorites-puzzle-list">
              <h2 className="mb-3 text-lg font-bold">Puzzles</h2>
              <UserFavoritePuzzles userId={user.id} supabase={supabase} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
