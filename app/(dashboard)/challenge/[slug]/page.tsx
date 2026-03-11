import Link from "next/link";
import {
  Target,
  Trophy,
  XOctagon,
  TrendingUp,
  Check,
  Sword,
  Circle,
} from "lucide-react";
import { getGameRiddlesByGameType } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game-riddle/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";

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
    userGameRiddleRepo.findAttemptedGameRiddleAttempts(supabase, user.id),
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
  const correct = attemptedRiddles.filter((a) => a.isCorrect).length;
  const incorrect = attemptedRiddles.filter((a) => !a.isCorrect).length;
  const attempted = correct + incorrect;
  const remaining = total - attempted;
  const solveRate = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: Challenge (header + riddles) */}
        <div>
          <div className="mb-12 flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-foreground text-4xl font-black tracking-tight capitalize md:text-5xl">
              {slug.replace(/-/g, " ")} Challenge
            </h1>
            <p className="text-muted-foreground text-lg">
              Master the tactics and unlock the secrets of this kingdom.
            </p>
          </div>

          {gameRiddles.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No riddles added to this challenge yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {gameRiddles
                .map((riddle, index) => {
                  const game = gameMap[riddle.gameId];
                  if (!game?.pgn) return null;
                  return { riddle, game, index };
                })
                .filter((x): x is NonNullable<typeof x> => x != null)
                .map(({ riddle, game, index }) => {
                  const isComplete = attemptByRiddleId[riddle.id] === true;
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
                    <Link
                      key={riddle.id}
                      href={`/game-riddle/${riddle.id}`}
                      className="group flex flex-col"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex shrink-0 items-baseline gap-0.5">
                          <span
                            className={`text-sm font-medium ${numColorClass}`}
                          >
                            #
                          </span>
                          <span
                            className={`text-4xl font-bold ${numColorClass}`}
                          >
                            {num}
                          </span>
                        </span>
                        <p className="truncate text-lg">{riddle.title}</p>
                      </div>
                      <div className="group/board relative mt-2 inline-flex justify-center">
                        {isComplete && (
                          <div className="absolute top-2 right-2 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-md">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <PuzzleBoard
                          sourceId={riddle.id}
                          mode="riddle"
                          pgn={game.pgn}
                          ply={riddle.ply}
                          moves={riddle.moves ?? ""}
                          width={220}
                          height={220}
                          className="border-muted rounded-xl border-4"
                          viewOnly
                        />
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
                          <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
                            <Sword className="text-primary-foreground h-7 w-7" />
                          </div>
                          <span className="font-semibold text-white">Play</span>
                        </div>
                      </div>
                      <div className="mt-3 flex w-full">
                        <div className="flex w-1/2 min-w-0 shrink-0 items-center gap-2">
                          <Circle className="stroke-border h-3.5 w-3.5 shrink-0 fill-white" />
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="truncate text-sm font-medium">
                              {game.whitePlayer.split(" ")[0]}
                            </div>
                            {game.whitePlayer.includes(" ") && (
                              <div className="text-muted-foreground truncate text-xs">
                                {game.whitePlayer.split(" ").slice(1).join(" ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex w-1/2 min-w-0 shrink-0 items-center justify-end gap-2">
                          <div className="min-w-0 flex-1 overflow-hidden text-right">
                            <div className="truncate text-sm font-medium">
                              {game.blackPlayer.split(" ")[0]}
                            </div>
                            {game.blackPlayer.includes(" ") && (
                              <div className="text-muted-foreground truncate text-xs">
                                {game.blackPlayer.split(" ").slice(1).join(" ")}
                              </div>
                            )}
                          </div>
                          <Circle className="fill-primary stroke-primary h-3.5 w-3.5 shrink-0" />
                        </div>
                      </div>
                    </Link>
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
