import { Target, Trophy, XOctagon, TrendingUp } from "lucide-react";
import { getGameRiddlesByGameType } from "@/features/game-riddle/services/game-riddle";
import { getGamesByIds } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import { getGroupStats } from "@/features/game-riddle/utilities/get-group-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NumberStatsCard } from "@/components/stats/number-stats-card";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function ChallengePage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const gameType = slug.replace(/-/g, "_");

  // ========================================================================
  // Getting riddles and attempts for this game type
  // ========================================================================
  const [gameRiddles, attemptedRiddles] = await Promise.all([
    getGameRiddlesByGameType(supabase, gameType),
    userGameRiddleRepo.findGameRiddleAttempts(supabase, user.id),
  ]);

  // ========================================================================
  // Mapping. FromEntries example return: { "riddle-101": true }
  // ========================================================================
  const attemptByRiddleId = Object.fromEntries(
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]),
  );

  // ========================================================================
  // Fetch games for riddles (unique gameIds) - single query
  // ========================================================================
  const gameIds = [...new Set(gameRiddles.map((r) => r.gameId))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const stats = getGroupStats(gameRiddles, attemptByRiddleId);
  const total = stats.total;
  const correct = stats.completed;
  const attempted = attemptedRiddles.length;
  const incorrect = attempted - correct;
  const remaining = total - attempted;
  const solveRate = stats.percentage;

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
                      displayFen={riddle.displayFen}
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

          <NumberStatsCard
            icon={Trophy}
            label="Correct answers"
            value={correct}
            variant="primary"
          />
          <NumberStatsCard
            icon={XOctagon}
            label="Incorrect attempts"
            value={incorrect}
            variant="destructive"
          />
          <NumberStatsCard
            icon={TrendingUp}
            label="Success percentage"
            value={`${solveRate}%`}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}
