import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllOpeningVariants } from "@/features/openings/services/openings";
import * as openingRepo from "@/features/openings/repository/opening.repository";
import { getPgnFromVariant } from "@/features/openings/mapper/opening-variant.mapper";
import { GAME_TYPE_QUOTES } from "@/lib/shared/constants/quote";
import { shuffle } from "@/lib/utilities/shuffle";
import { CollectionHeader } from "@/components/collection/collection-header";
import { Card } from "@/components/ui/card";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { Opening } from "@/features/openings/types/opening";

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

function groupVariantsByOpening(
  variants: OpeningVariant[],
  openings: Opening[],
): Record<string, OpeningVariant[]> {
  const openingMap = new Map(openings.map((o) => [o.id, o]));
  const groups: Record<string, OpeningVariant[]> = {};

  for (const v of variants) {
    const opening = openingMap.get(v.openingId);
    const key = opening?.slug ?? v.openingId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(v);
  }

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.ply - b.ply);
  }

  return groups;
}

function getDisplayName(key: string, openings: Opening[]): string {
  const opening = openings.find((o) => o.slug === key);
  return opening?.name ?? opening?.slug ?? key;
}

export default async function OpeningsPage() {
  const { supabase } = await getAuthenticatedUser();
  const [variants, openings] = await Promise.all([
    getAllOpeningVariants(supabase),
    openingRepo.findAll(supabase),
  ]);

  const groups = groupVariantsByOpening(variants, openings);
  const shuffledGroups: Record<string, OpeningVariant[]> = {};
  for (const key of Object.keys(groups)) {
    shuffledGroups[key] = shuffle(groups[key]!);
  }

  const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
    const aOpening = openings.find((o) => o.slug === a);
    const bOpening = openings.find((o) => o.slug === b);
    return (aOpening?.slug ?? a).localeCompare(bOpening?.slug ?? b);
  });

  const openingQuote = GAME_TYPE_QUOTES.opening_crusher ?? {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      {variants.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No opening variants yet.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroupKeys.map((groupKey) => {
            const groupVariants = shuffledGroups[groupKey] ?? [];
            const slug = groupKey;
            const displayName = getDisplayName(groupKey, openings);

            return (
              <div key={groupKey} className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-2 py-3">
                  <CollectionHeader
                    title={displayName}
                    imageSrc="/images/challanges/magnus_plays.png"
                    imageAlt={displayName}
                    description="Study and practice your opening repertoires. Build your arsenal and dominate from move one."
                    quote={openingQuote.quote}
                    author={openingQuote.author}
                    itemCount={groupVariants.length}
                    itemLabel={
                      groupVariants.length === 1 ? "variant" : "variants"
                    }
                  />
                  <Link
                    href={`/openings/opening/${slug}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    See All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex">
                  <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-4">
                    {groupVariants.slice(0, 4).map((variant, index) => {
                      const { riddle, game } =
                        variantToRiddleAndGame(variant);
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
                          href={`/openings/${variant.id}`}
                          initialFen={variant.fen}
                        />
                      );
                    })}
                  </div>
                  <Card className="m-4 mt-14 w-44 shrink-0 self-start p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <Target className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground text-xs">
                          Variants
                        </p>
                        <p className="text-xl font-bold">
                          {groupVariants.length}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
