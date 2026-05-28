import { ChallengeHeader } from "@/features/challenge/components/challenge-header";
import { getGamesByIds } from "@/features/game/services/game.service";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getRiddlesByGameType } from "@/features/riddle/services/riddle.service";
import { formatGameType, getGameTypeConstants } from "@/features/riddle/utilities/game-type-helpers";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { buildAttemptByRiddleId } from "@/features/user-sequence-attempt/utilities/build-attempt-by-riddle-id";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string }>;
};

/**
 * Fonksyon Bilgisi ✅
 * 1. İlgili gameType'da(memorable games örn.) bütün riddle lar çekilir
 * 2. Oyuncunun move sequence attempt özetleri çekilir (auth yoksa []).
 * 3. Riddle id → solved/wrong/undefined haritası oluşturulur.
 * 4. gameId ler bilindiğinden bu sefer Game bilgisinin tamamı çekilir Id ler aratılarak.
 * 5. Id ler ile game birleştirilip (fromEntries ile) listelenecek gameMap değeri çıkar
 * 6. İstatistikler çekilen verilere göre hesaplanır
 */
export default async function ChallengePage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getPublicUser();

  const gameType = slug;

  // ========================================================================
  // (1,2) Getting riddles and attempts for this game type
  // ========================================================================
  const riddles = await getRiddlesByGameType(supabase, gameType, { activeOnly: true });

  const sequenceIds = [...new Set(riddles.map((r) => r.moveSequence.id))];
  const summaries = user ? await attemptService.getLatestSummariesForSequences(supabase, user.id, sequenceIds) : [];
  const attemptByRiddleId = buildAttemptByRiddleId(riddles, summaries);

  // ========================================================================
  // (4, 5) Fetch games for riddles (unique gameIds) - single query
  // ========================================================================
  const gameIds = [...new Set(riddles.map((r) => r.gameId).filter((id): id is string => id != null))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const displayName = formatGameType(gameType);
  const gameTypeConstants = getGameTypeConstants(gameType);

  // ========================================================================
  // (6) Render -> ilgili challenge daki(memorable games) Riddle lar kadar dönüp
  // onu RiddleBoard a atıcaz. Eğer record silinmiş ise, yani game silinmiş ise riddle silinmeden
  // o null kontrolüne girer. (satır 81)
  // ========================================================================
  return (
    <div className="container mx-auto max-w-6xl pt-10 pb-16">
      <div className="flex flex-col gap-4">
        <ChallengeHeader
          title={displayName}
          imageSrc={`/images/challanges/${gameType}.png`}
          imageAlt={displayName}
          description={gameTypeConstants.description}
          quote={gameTypeConstants.quote}
          author={gameTypeConstants.author}
          backgroundColor={gameTypeConstants.backgroundColor}
          itemCount={riddles.length}
          itemLabel="riddles"
        />
        <div className="grid grid-cols-2 gap-6">
          {riddles
            .map((riddle, index) => {
              const game = riddle.gameId ? gameMap[riddle.gameId] : null;
              if (!game && !riddle.moveSequence.displayFen) return null;
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
                  size={240}
                  isComplete={attemptByRiddleId[riddle.id]?.isComplete}
                  accuracyPercent={attemptByRiddleId[riddle.id]?.accuracyPercent}
                  displayFen={riddle.moveSequence.displayFen}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
