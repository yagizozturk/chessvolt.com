import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Sword,
  Star,
  ChevronRight,
  Target,
  Trophy,
  XOctagon,
  TrendingUp,
} from "lucide-react";
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

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function JourneyPage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const gameType = slug.replace(/-/g, "_");
  const [gameRiddles, attemptedRiddles] = await Promise.all([
    getGameRiddlesByGameType(supabase, gameType),
    userGameRiddleRepo.findAttemptedGameRiddleAttempts(supabase, user.id),
  ]);

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
        {/* Left: Journey (header + riddles) */}
        <div>
          {/* Header - only in left column */}
          <div className="mb-12 flex flex-col gap-2 text-center md:text-left">
            <Badge className="w-fit self-center border-[#F69E0B]/30 bg-[#F69E0B]/20 text-[#FFB800] md:self-start">
              CHESS ADVENTURE
            </Badge>
            <h1 className="text-4xl font-black capitalize tracking-tight text-white md:text-5xl">
              {slug.replace(/-/g, " ")} Journey
            </h1>
            <p className="text-lg text-white/50">
              Master the tactics and unlock the secrets of this kingdom.
            </p>
          </div>

          {gameRiddles.length === 0 ? (
            <Card className="border-dashed border-white/10 bg-white/5">
              <CardContent className="py-12 text-center text-white/40">
                No riddles added to this journey yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {gameRiddles.map((riddle, index) => {
                const isCorrect = attemptByRiddleId[riddle.id];
                const isAttempted = riddle.id in attemptByRiddleId;

                return (
                  <Link
                    key={riddle.id}
                    href={`/game-riddle/${riddle.id}`}
                    className="group no-underline"
                  >
                    <Card className="overflow-hidden border-white/10 bg-white/5 transition-all duration-300 group-active:scale-[0.98] hover:border-white/20 hover:bg-white/10">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F69E0B] text-xl font-black text-white shadow-[0_4px_0_0_#b45309]">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#FFB800]">
                                {riddle.title}
                              </h3>
                              <div className="mt-1 flex items-center gap-4">
                                {riddle.rating && (
                                  <div className="flex items-center gap-1 text-sm text-white/40">
                                    <Star size={14} className="text-[#FFB800]" />
                                    <span>Rating: {riddle.rating}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-sm text-white/40">
                                  <Sword size={14} />
                                  <span>Tactical Puzzle</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {isAttempted && isCorrect === true && (
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400"
                                aria-label="Correct"
                              >
                                <CheckCircle size={24} />
                              </div>
                            )}
                            {isAttempted && isCorrect === false && (
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-400"
                                aria-label="Incorrect"
                              >
                                <XCircle size={24} />
                              </div>
                            )}
                            {!isAttempted && (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/20 transition-all group-hover:bg-[#FFB800] group-hover:text-black">
                                <ChevronRight size={20} />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Stats Cards - starts from top */}
        <div className="space-y-4">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-[#FFB800]" />
                Progress
              </CardTitle>
              <CardDescription className="text-white/60">
                Your journey stats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-white/60">Total</span>
                <span className="font-bold text-white">{total}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-white/60">Remaining</span>
                <span className="font-bold text-white">{remaining}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-green-400" />
                Solved
              </CardTitle>
              <CardDescription className="text-white/60">
                Correct answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{correct}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <XOctagon className="h-5 w-5 text-red-400" />
                Failed
              </CardTitle>
              <CardDescription className="text-white/60">
                Incorrect attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{incorrect}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-[#FFB800]" />
                Solve Rate
              </CardTitle>
              <CardDescription className="text-white/60">
                Success percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#FFB800]">
                {solveRate}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
