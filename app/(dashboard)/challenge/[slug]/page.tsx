import { NumberStatsCard } from "@/components/stats/number-stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiddleBoardCard } from "@/features/game-riddle/components/riddle-board-card";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import { getGameRiddlesByGameType } from "@/features/game-riddle/services/game-riddle";
import { getGroupStats } from "@/features/game-riddle/utilities/get-group-stats";
import { getGamesByIds } from "@/features/game/services/game";
import { getPublicUser } from "@/lib/supabase/auth";
import { Target, TrendingUp, Trophy, XOctagon } from "lucide-react";

type Params = {
  params: Promise<{ slug: string }>;
};

/**
 * Fonksyon Bilgisi ✅
 * 1. İlgili gameType'da(memorable games örn.) bütün riddle lar çekilir
 * 2. Oyunucunun bu riddle larda daha önce deneyip denemediği, doğru yanlış bilgisi çekilir. User auth değilse [] döner.
 * 3. fromEntries riddleId, isCorrect bilgisi ile birleştirilir ve yeni objeye çevrilir.
 * 4. gameId ler bilindiğinden bu sefer Game bilgisinin tamamı çekilir Id ler aratılarak.
 * 5. Id ler ile game birleştirilip (fromEntries ile) listelenecek gameMap değeri çıkar
 * 6. İstatistikler çekilen verilere göre hesaplanır
 */
export default async function ChallengePage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getPublicUser();

  const gameType = slug.replace(/-/g, "_");

  // ========================================================================
  // (1,2) Getting riddles and attempts for this game type
  // ========================================================================
  const [gameRiddles, attemptedRiddles] = await Promise.all([
    getGameRiddlesByGameType(supabase, gameType),
    user ? userGameRiddleRepo.findGameRiddleAttempts(supabase, user.id) : [],
  ]);

  // ========================================================================
  // (3) Mapping. FromEntries example return: { "riddle-101": true }
  // ========================================================================
  const attemptByRiddleId = Object.fromEntries(
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]),
  );

  // ========================================================================
  // (4, 5) Fetch games for riddles (unique gameIds) - single query
  // ========================================================================
  const gameIds = [...new Set(gameRiddles.map((r) => r.gameId))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  // ========================================================================
  // (6) İstatistikler
  // ========================================================================
  const stats = getGroupStats(gameRiddles, attemptByRiddleId);
  const total = stats.total;
  const correct = stats.completed;
  const attempted = attemptedRiddles.length;
  const incorrect = attempted - correct;
  const remaining = total - attempted;
  const solveRate = stats.percentage;

  // ========================================================================
  // (7) Render -> ilgili challenge daki(memorable games) GameRiddle lar kadar dönüp
  // onu RiddleBoard a atıcaz. Eğer record silinmiş ise, yani game silinmiş ise riddle
  // silinmeden o null kontrolüne girer. (satır 81)
  // ========================================================================
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div className="grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3">
          {gameRiddles
            .map((riddle, index) => {
              const game = gameMap[riddle.gameId];
              if (!game) return null;
              return { riddle, game, index };
            })
            .filter((x): x is NonNullable<typeof x> => x != null)
            .map(({ riddle, game, index }) => {
              const num = index + 1;

              return (
                <RiddleBoardCard
                  key={riddle.id}
                  riddle={riddle}
                  game={game}
                  num={num}
                  width={250}
                  height={250}
                  isComplete={attemptByRiddleId[riddle.id]}
                  displayFen={riddle.displayFen}
                />
              );
            })}
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
