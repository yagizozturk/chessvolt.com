import Link from "next/link";
import { ChevronLeft, Target } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getOpeningVariantsByOpeningId } from "@/features/openings/services/openings";
import * as openingRepo from "@/features/openings/repository/opening.repository";
import { getPgnFromVariant } from "@/features/openings/mapper/opening-variant.mapper";
import { GAME_TYPE_QUOTES } from "@/lib/shared/constants/quote";
import { CollectionHeader } from "@/components/collection/collection-header";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import { Card, CardContent } from "@/components/ui/card";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { notFound } from "next/navigation";

function variantToRiddleAndGame(variant: OpeningVariant) {
  const pgn = getPgnFromVariant(variant);
  return {
    riddle: {
      id: variant.id,
      gameId: variant.id,
      ply: variant.ply,
      title: variant.title || "Untitled Variant",
      moves: variant.moves,
      gameType: null,
      createdAt: variant.createdAt,
    },
    game: {
      id: variant.id,
      pgn,
      whitePlayer: variant.ecoCode ?? "White",
      blackPlayer: "Black",
      result: "",
      playedAt: "",
      url: null,
      createdAt: variant.createdAt,
      event: null,
      opening: variant.title,
      description: null,
    },
  };
}

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function OpeningsBySlugPage({ params }: Params) {
  const { slug } = await params;
  const { supabase } = await getAuthenticatedUser();

  const opening = await openingRepo.findBySlug(supabase, slug);
  if (!opening) {
    notFound();
  }

  const variants = await getOpeningVariantsByOpeningId(
    supabase,
    opening.id,
  );

  const openingQuote = GAME_TYPE_QUOTES.opening_crusher ?? {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  };

  const displayName = opening.name ?? opening.slug;

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div>
          <Link
            href="/openings"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Openings
          </Link>
          <div className="mb-8 flex items-center justify-between gap-4 px-2 py-3">
            <CollectionHeader
              title={`${displayName} Variants`}
              imageSrc="/images/challanges/magnus_plays.png"
              imageAlt={displayName}
              description="Study and practice your opening repertoires. Build your arsenal and dominate from move one."
              quote={openingQuote.quote}
              author={openingQuote.author}
              itemCount={variants.length}
              itemLabel={variants.length === 1 ? "variant" : "variants"}
            />
          </div>

          {variants.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No variants in this opening yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant, index) => {
                const { riddle, game } = variantToRiddleAndGame(variant);
                const num = index + 1;
                const numColorClasses = [
                  "text-primary",
                  "text-chart-2",
                  "text-chart-4",
                  "text-chart-1",
                  "text-chart-3",
                  "text-chart-5",
                ];
                const numColorClass =
                  numColorClasses[index % 6] ?? numColorClasses[0];

                return (
                  <PuzzleCard
                    key={variant.id}
                    riddle={riddle}
                    game={game}
                    num={num}
                    numColorClass={numColorClass}
                    width={220}
                    height={220}
                    href={`/openings/${variant.id}`}
                    initialFen={variant.fen}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="w-44 shrink-0 self-start p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Target className="text-primary h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs">Variants</p>
                <p className="text-xl font-bold">{variants.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
