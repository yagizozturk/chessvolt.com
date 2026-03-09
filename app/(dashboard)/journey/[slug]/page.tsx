import Link from "next/link";
import { Target, Trophy, XOctagon, TrendingUp, Check, BookOpen, Lock } from "lucide-react";
import { getGameRiddlesByGameType } from "@/lib/services/game-riddle";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import * as userGameRiddleRepo from "@/lib/repositories/user-game-riddle.repository";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ChapterStatus = "complete" | "current" | "locked";

type JourneyChapter = {
  id: string;
  title: string;
  status: ChapterStatus;
  index: number;
};

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function JourneyPage({ params }: Params) {
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

  const attemptByRiddleId = Object.fromEntries(
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]),
  );

  let foundCurrent = false;
  const chapters: JourneyChapter[] = gameRiddles.map((riddle, index) => {
    const isCorrect = attemptByRiddleId[riddle.id];
    const isAttempted = riddle.id in attemptByRiddleId;

    let status: JourneyChapter["status"] = "locked";
    if (!foundCurrent) {
      if (isAttempted && isCorrect) {
        status = "complete";
      } else {
        status = "current";
        foundCurrent = true;
      }
    }

    return {
      id: riddle.id,
      title: riddle.title,
      status,
      index,
    };
  });

  const total = gameRiddles.length;
  const correct = attemptedRiddles.filter((a) => a.isCorrect).length;
  const incorrect = attemptedRiddles.filter((a) => !a.isCorrect).length;
  const attempted = correct + incorrect;
  const remaining = total - attempted;
  const solveRate = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: Journey (header + riddles) */}
        <div>
          <div className="mb-12 flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-foreground text-4xl font-black tracking-tight capitalize md:text-5xl">
              {slug.replace(/-/g, " ")} Journey
            </h1>
            <p className="text-muted-foreground text-lg">
              Master the tactics and unlock the secrets of this kingdom.
            </p>
          </div>

          {gameRiddles.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No riddles added to this journey yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {chapters.map((chapter) => {
                const isLocked = chapter.status === "locked";
                const isComplete = chapter.status === "complete";
                const isCurrent = chapter.status === "current";

                return (
                  <div key={chapter.id} className="relative">
                    {isCurrent && (
                      <Badge className="bg-primary text-primary-foreground absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce px-3 py-1 text-xs">
                        Current
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant={isLocked ? "ghost" : "default"}
                      className={`h-14 w-14 rounded-full border-b-4 transition-all active:border-b-0 ${
                        isComplete
                          ? "border-primary/80 bg-primary hover:bg-primary/90"
                          : isCurrent
                            ? "border-primary bg-primary shadow-lg hover:bg-primary/90"
                            : "pointer-events-none border-border bg-muted text-muted-foreground"
                      }`}
                      asChild={!isLocked}
                    >
                      {isLocked ? (
                        <span>
                          <Lock className="h-6 w-6" />
                        </span>
                      ) : (
                        <Link href={`/game-riddle/${chapter.id}`}>
                          {isComplete ? (
                            <Check className="h-6 w-6" />
                          ) : (
                            <BookOpen className="h-6 w-6" />
                          )}
                        </Link>
                      )}
                    </Button>
                    <p className="text-muted-foreground mt-2 truncate text-center text-sm">
                      {chapter.title}
                    </p>
                  </div>
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
              <CardDescription>Your journey stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground text-sm">Total</span>
                <span className="text-foreground font-bold">{total}</span>
              </div>
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground text-sm">Remaining</span>
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
