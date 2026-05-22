import { ChallengeHeader } from "@/features/challenge/components/challenge-header";
import { RiddleBoardCard } from "@/features/game-riddle/components/riddle-board-card";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import { getGameRiddlesByGameType } from "@/features/game-riddle/services/game-riddle.service";
import { formatGameType, getGameTypeConstants } from "@/features/game-riddle/utilities/game-type-helpers";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getPublicUser } from "@/lib/supabase/auth";

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
    getGameRiddlesByGameType(supabase, gameType, { activeOnly: true }),
    user ? userGameRiddleRepo.findGameRiddleAttempts(supabase, user.id) : [],
  ]);

  // ========================================================================
  // (3) Mapping. FromEntries example return: { "riddle-101": true }
  // ========================================================================
  const attemptByRiddleId = Object.fromEntries(attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]));

  // ========================================================================
  // (4, 5) Fetch games for riddles (unique gameIds) - single query
  // ========================================================================
  const gameIds = [...new Set(gameRiddles.map((r) => r.gameId))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const displayName = formatGameType(gameType);
  const gameTypeConstants = getGameTypeConstants(gameType);

  // ========================================================================
  // (6) Render -> ilgili challenge daki(memorable games) GameRiddle lar kadar dönüp
  // onu RiddleBoard a atıcaz. Eğer record silinmiş ise, yani game silinmiş ise riddle silinmeden
  // o null kontrolüne girer. (satır 81)
  // ========================================================================
  return (
    <div className="container mx-auto max-w-6xl pt-10 pb-16">
      <div className="flex flex-col gap-4">
        <ChallengeHeader
          title={displayName}
          imageSrc={`/images/challanges/bg-${gameType}.png`}
          imageAlt={displayName}
          description={gameTypeConstants.description}
          quote={gameTypeConstants.quote}
          author={gameTypeConstants.author}
          itemCount={gameRiddles.length}
          itemLabel="riddles"
        />
        <div className="grid grid-cols-2 gap-6">
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
                  size={170}
                  isComplete={attemptByRiddleId[riddle.id]}
                  displayFen={riddle.moveSequence.displayFen}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
