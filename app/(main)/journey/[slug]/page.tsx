import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { getGameRiddlesByGameType } from "@/lib/services/game-riddle";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import * as userGameRiddleRepo from "@/lib/repositories/user-game-riddle.repository";

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
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect])
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Journey: {slug}</h1>
      {gameRiddles.length === 0 ? (
        <p className="text-muted-foreground">
          Bu journey için riddle bulunmuyor.
        </p>
      ) : (
        <ul className="space-y-2">
          {gameRiddles.map((riddle) => {
            const isCorrect = attemptByRiddleId[riddle.id];
            const isAttempted = riddle.id in attemptByRiddleId;

            return (
              <li key={riddle.id} className="flex items-center gap-2">
                <Link
                  href={`/game-riddle/${riddle.id}`}
                  className="text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
                >
                  {riddle.title}
                  {riddle.rating != null && (
                    <span className="ml-2 text-gray-500">
                      (Rating: {riddle.rating})
                    </span>
                  )}
                </Link>
                {isAttempted && isCorrect === true && (
                  <CheckCircle
                    className="size-5 shrink-0 text-green-600"
                    aria-label="Doğru"
                  />
                )}
                {isAttempted && isCorrect === false && (
                  <XCircle
                    className="size-5 shrink-0 text-red-600"
                    aria-label="Yanlış"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
