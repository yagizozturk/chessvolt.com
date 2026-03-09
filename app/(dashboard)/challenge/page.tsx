/**
 * Todo:
 * - Sayfa tam olarak büyüyecek ve ilk 6 puzzle board olarak gösterilicek
 * - Eğlenceli ve görsel olarka güzel göstermek için, tepesinde white_player logosu, altta diğeri olabilirmi
 * - belki board un üzerine gelince bir animasyon çıkar, oyna diye.
 *
 *
 */

import Link from "next/link";
import { Map, ChevronRight } from "lucide-react";
import { getAllGameRiddles } from "@/lib/services/game-riddle";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GameRiddle } from "@/lib/model/game-riddle";

function groupRiddlesByGameType(
  riddles: GameRiddle[],
): Record<string, GameRiddle[]> {
  const groups: Record<string, GameRiddle[]> = {};

  for (const riddle of riddles) {
    const gameType = riddle.gameType?.trim() || "uncategorized";
    if (!groups[gameType]) groups[gameType] = [];
    groups[gameType].push(riddle);
  }

  // Sort riddles within each group by ply
  for (const key of Object.keys(groups)) {
    groups[key].sort((a: GameRiddle, b: GameRiddle) => a.ply - b.ply);
  }

  return groups;
}

function formatGameType(slug: string): string {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function gameTypeToSlug(gameType: string): string {
  return gameType.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
}

export default async function ChallengePage() {
  const { supabase } = await getAuthenticatedUser();

  const allRiddles = await getAllGameRiddles(supabase);
  const groups = groupRiddlesByGameType(allRiddles);

  // Filter out uncategorized if empty or sort: put uncategorized last
  const sortedGroupKeys = Object.keys(groups).sort((a: string, b: string) => {
    if (a === "uncategorized") return 1;
    if (b === "uncategorized") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="container mx-auto max-w-5xl px-6 pt-12 pb-16">
      <div className="mb-12 flex flex-col gap-2 text-center md:text-left">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/10 text-primary w-fit gap-2 rounded-full px-4 py-1.5 backdrop-blur-md"
        >
          <Map className="h-4 w-4" />
          Challenges
        </Badge>
        <h1 className="text-foreground text-4xl font-black tracking-tight md:text-5xl">
          All Challenges
        </h1>
        <p className="text-muted-foreground text-lg">
          Master tactics by game type. Pick a challenge and start solving.
        </p>
      </div>

      {sortedGroupKeys.length === 0 ? (
        <Card className="border-border bg-card/50 border-dashed">
          <CardContent className="text-muted-foreground py-12 text-center">
            No challenges added yet. Coming soon!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedGroupKeys.map((gameType) => {
            const riddles = groups[gameType] ?? [];
            const slug = gameTypeToSlug(gameType);
            const displayName = formatGameType(gameType);

            return (
              <Card
                key={gameType}
                className="hover:border-primary/30 overflow-hidden border-2 transition-all hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {displayName}
                        <Badge variant="secondary" className="font-normal">
                          {riddles.length} riddles
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Master the tactics in this collection.
                      </CardDescription>
                    </div>
                    <Link
                      href={`/challenge/${slug}`}
                      className="border-border bg-muted/50 hover:bg-muted flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                      See All
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {riddles.map((riddle) => (
                      <Link
                        key={riddle.id}
                        href={`/game-riddle/${riddle.id}`}
                        className="border-border bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors"
                      >
                        <span className="text-muted-foreground text-xs font-medium">
                          #{riddle.ply}
                        </span>
                        <span className="truncate text-sm font-medium">
                          {riddle.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
