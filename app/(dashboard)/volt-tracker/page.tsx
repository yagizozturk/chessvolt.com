import type { Metadata } from "next";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header/page-header";
import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { FavoritesSearchFilter } from "@/features/favorites/components/favorites-search-filter";
import { FavoritesSortFilter } from "@/features/favorites/components/favorites-sort-filter";
import { FavoritesViewFilter } from "@/features/favorites/components/favorites-view-filter";
import { type FavoritesSort, parseFavoritesSort } from "@/features/favorites/types/favorites-sort";
import { parseFavoritesView } from "@/features/favorites/types/favorites-view";
import { UserFavoriteGameReviewQuestions } from "@/features/user-favorites/components/user-favorite-game-review-questions";
import { UserFavoriteOpeningVariants } from "@/features/user-favorites/components/user-favorite-opening-variants";
import { UserFavoritePuzzles } from "@/features/user-favorites/components/user-favorite-puzzles";
import { getUserFavoritesForUserWithDetails } from "@/features/user-favorites/services/user-favorite.service";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Volt Tracker | ChessVolt",
  description:
    "Track mistakes from your Chess.com and Lichess games first, alongside openings and puzzles, and use Volt scores to see how accuracy, speed, streaks, and repeat practice build lasting chess memory.",
};

type SearchParams = Promise<{ view?: string; sort?: string; q?: string }>;

function parseSearchQuery(value: string | undefined) {
  return value?.trim() ?? "";
}

function getFavoriteSearchText(favorite: UserFavoriteWithDetails) {
  return [
    favorite.note,
    favorite.openingVariant?.title,
    favorite.openingVariant?.description,
    favorite.puzzle?.title,
    favorite.puzzle?.source,
    favorite.puzzle?.rating?.toString(),
    favorite.gameReviewQuestion?.title,
    favorite.gameReviewQuestion?.source,
    favorite.gameReviewQuestion?.quality,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
}

function getSearchFilteredFavorites(favorites: UserFavoriteWithDetails[], query: string) {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (searchTerms.length === 0) return favorites;

  return favorites.filter((favorite) => {
    const searchText = getFavoriteSearchText(favorite);
    return searchTerms.every((term) => searchText.includes(term));
  });
}

function getCategorySearchEmptyMessage(query: string, label: string) {
  return query ? `No ${label} match "${query}".` : undefined;
}

function getSortedFavorites(favorites: UserFavoriteWithDetails[], sort: FavoritesSort) {
  return [...favorites].sort((a, b) => {
    const pinnedOrder = Number(b.isPinned) - Number(a.isPinned);
    if (pinnedOrder !== 0) return pinnedOrder;

    const dateOrder = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    return sort === "newest-first" ? -dateOrder : dateOrder;
  });
}

export default async function VoltTracker({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getAuthenticatedUser();
  const params = await searchParams;
  const view = parseFavoritesView(params.view);
  const sort = parseFavoritesSort(params.sort);
  const query = parseSearchQuery(params.q);
  const favorites = await getUserFavoritesForUserWithDetails(supabase, user.id);
  const searchFilteredFavorites = getSearchFilteredFavorites(favorites, query);
  const visibleFavorites = getSortedFavorites(searchFilteredFavorites, sort);

  // ================================================================================================
  // Checking if the user has any favorites so to show dialog if not 0.
  // Because I need to show dialog if there is VoltScore shown in any card, puzzle or opening.
  // Dialog shows how the volt is calculated. It shows only once.
  // ================================================================================================
  const hasFavorites = favorites.length > 0;
  const showMergedEmptyState = view === "all" && visibleFavorites.length === 0;
  const mergedEmptyMessage =
    hasFavorites && query ? `No favorites match "${query}".` : "You haven't added anything to Volt Tracker yet.";

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Volt Tracker"
          description="Track mistakes from your Chess.com and Lichess games first, alongside openings and puzzles, and use Volt scores to see how accuracy, speed, streaks, and repeat practice build lasting chess memory."
        />

        {hasFavorites ? <VoltExplainDialogAutoStart /> : null}

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <FavoritesSearchFilter query={query} />
          <FavoritesViewFilter view={view} />
          <FavoritesSortFilter sort={sort} />
        </div>

        {showMergedEmptyState ? (
          <EmptyDataMessage message={mergedEmptyMessage} />
        ) : (
          <div className="flex flex-col gap-8">
            {(view === "all" || view === "openings") && (
              <UserFavoriteOpeningVariants
                favorites={visibleFavorites}
                userId={user.id}
                supabase={supabase}
                emptyMessage={getCategorySearchEmptyMessage(query, "opening variants")}
                showEmptyMessage={view === "openings"}
              />
            )}
            {(view === "all" || view === "puzzles") && (
              <UserFavoritePuzzles
                favorites={visibleFavorites}
                userId={user.id}
                supabase={supabase}
                emptyMessage={getCategorySearchEmptyMessage(query, "puzzles")}
                showEmptyMessage={view === "puzzles"}
              />
            )}
            {(view === "all" || view === "game-reviews") && (
              <UserFavoriteGameReviewQuestions
                favorites={visibleFavorites}
                emptyMessage={getCategorySearchEmptyMessage(query, "game review questions")}
                showEmptyMessage={view === "game-reviews"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
