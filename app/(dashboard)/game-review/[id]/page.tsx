import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isGameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import GameReviewController from "@/features/game-review/components/game-review-controller";
import { loadGameReviewPage } from "@/features/game-review/loaders/game-review-page.loader";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Game review | ChessVolt",
  description: "Review a saved game analysis.",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
};

export default async function GameReviewPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { source } = await searchParams;
  const gameId = id.trim();

  if (!gameId || !isGameAnalysisSource(source)) {
    notFound();
  }

  const { user, supabase } = await getAuthenticatedUser();
  const pageData = await loadGameReviewPage({
    supabase,
    userId: user.id,
    source,
    gameId,
  });

  return <GameReviewController {...pageData} />;
}
