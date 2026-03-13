import Link from "next/link";
import {
  ChevronLeft,
  Target,
  Trophy,
  XOctagon,
  TrendingUp,
} from "lucide-react";
import { getGameRiddlesByGameType } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import {
  formatGameType,
  getGameTypeCopy,
} from "@/features/game-riddle/utilities/game-type-copy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CollectionHeader } from "@/components/collection/collection-header";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function ChallengePage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const gameType = slug.replace(/-/g, "_");

  // ===============================================================
  // gameRiddles gives me the games for that gameType.
  // ===============================================================
  const [gameRiddles, attemptedRiddles] = await Promise.all([
    getGameRiddlesByGameType(supabase, gameType),
    userGameRiddleRepo.findGameRiddleAttempts(supabase, user.id),
  ]);

  // Fetch games for boards
  const gameIds = [...new Set(gameRiddles.map((r) => r.gameId))];
  const games = await Promise.all(
    gameIds.map((id) => getGameById(supabase, id)),
  );
  const gameMap = Object.fromEntries(
    games
      .filter((g): g is NonNullable<typeof g> => g != null)
      .map((g) => [g.id, g]),
  );

  const attemptByRiddleId = Object.fromEntries(
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]),
  );

  const total = gameRiddles.length;
  const copy = getGameTypeCopy(gameType);
  const correct = attemptedRiddles.filter((a) => a.isCorrect).length;
  const incorrect = attemptedRiddles.filter((a) => !a.isCorrect).length;
  const attempted = correct + incorrect;
  const remaining = total - attempted;
  const solveRate = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        {/* Left: Challenge (header + riddles) */}
        <div>
          {gameRiddles.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No riddles added to this challenge yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {gameRiddles
                .map((riddle, index) => {
                  const game = gameMap[riddle.gameId];
                  if (!game?.pgn) return null;
                  return { riddle, game, index };
                })
                .filter((x): x is NonNullable<typeof x> => x != null)
                .map(({ riddle, game, index }) => {
                  const num = index + 1;

                  return (
                    <PuzzleCard
                      key={riddle.id}
                      riddle={riddle}
                      game={game}
                      num={num}
                      width={250}
                      height={250}
                      isComplete={attemptByRiddleId[riddle.id] === true}
                    />
                  );
                })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-primary h-5 w-5" />
                Progress
              </CardTitle>
              <CardDescription>Your challenge stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground text-sm">
                  Total Solved
                </span>
                <span className="text-foreground font-bold">{total}</span>
              </div>
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground text-sm">
                  Remaining Challenges
                </span>
                <span className="text-foreground font-bold">{remaining}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="text-primary h-5 w-5" />
                Solved
              </CardTitle>
              <CardDescription>Correct answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-primary text-3xl font-bold">{correct}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XOctagon className="text-destructive h-5 w-5" />
                Failed
              </CardTitle>
              <CardDescription>Incorrect attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-destructive text-3xl font-bold">
                {incorrect}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary h-5 w-5" />
                Solve Rate
              </CardTitle>
              <CardDescription>Success percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-primary text-3xl font-bold">
                {solveRate}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
