import type { Metadata } from "next";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { FavoritesViewFilter } from "@/features/favorites/components/favorites-view-filter";
import { parseFavoritesView } from "@/features/favorites/types/favorites-view";
import { UserFavoriteOpeningVariants } from "@/features/user-favorites/components/user-favorite-opening-variants";
import { UserFavoritePuzzles } from "@/features/user-favorites/components/user-favorite-puzzles";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Volt Tracker | ChessVolt",
  description: "Openings and puzzles in your Volt Tracker to check your Volt score.",
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

  const hasFavorites = (favoritesCount ?? 0) > 0;
  const showMergedEmptyState = view === "all" && !hasFavorites;

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Volt Tracker"
          description="Openings and puzzles in your Volt Tracker to check your Volt score."
          actions={<FavoritesViewFilter view={view} />}
        />

        {hasFavorites ? <VoltExplainDialogAutoStart /> : null}

        {showMergedEmptyState ? (
          <EmptyDataMessage message="You haven't added any openings or puzzles to Volt Tracker yet." />
        ) : (
          <div className="flex flex-col gap-8">
            {(view === "all" || view === "openings") && (
              <UserFavoriteOpeningVariants
                userId={user.id}
                supabase={supabase}
                showEmptyMessage={view === "openings"}
              />
            )}
            {(view === "all" || view === "puzzles") && (
              <UserFavoritePuzzles userId={user.id} supabase={supabase} showEmptyMessage={view === "puzzles"} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
