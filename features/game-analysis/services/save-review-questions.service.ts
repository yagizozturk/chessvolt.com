import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

import {
  getGameAnalysisMistakesByGameId,
  upsertGameAnalysisMistakes,
} from "@/features/game-analysis-mistakes/services/game-analysis-mistake.service";
import type {
  GameAnalysisMistake,
  GameAnalysisMistakePayload,
  GameAnalysisMistakeQuality,
} from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import { createMoveSequences } from "@/features/move-sequence/services/move-sequence.service";
import { getPlayerColorFromPgn } from "@/lib/chess/getPlayerColorFromPgn";
import { createAdminClient } from "@/lib/supabase/admin";

function isQuestionQuality(quality: CriticalMoment["quality"]): quality is GameAnalysisMistakeQuality {
  return quality === "mistake" || quality === "blunder";
}

export async function saveReviewQuestions(input: {
  supabase: SupabaseClient;
  userId: string;
  username: string;
  pgn: string;
  source: GameAnalysisSource;
  gameId: string;
  gameAnalysisId: string;
  moments: CriticalMoment[];
}): Promise<GameAnalysisMistake[]> {
  const userColor = getPlayerColorFromPgn(input.pgn, input.username);
  if (!userColor) return [];

  // ================================================================================================
  // Varmı bu kaıt kontrolü. Flatmap ile boş datalar temizlenir.
  // ================================================================================================
  const existing = await getGameAnalysisMistakesByGameId(input.supabase, input.userId, input.gameId);
  const sequenceIdByPly = new Map(
    existing.flatMap((question) => (question.moveSequenceId ? [[question.ply, question.moveSequenceId] as const] : [])),
  );

  const mistakesToSave: GameAnalysisMistakePayload[] = [];
  const sequencesToCreate: { id: string; initialFen: string; displayFen: string; moves: string }[] = []; // Her bir hatadaki hamle için moveSequence üretiriz ünkü volt-score larını takip etmek için. moveSequenceId si ile attempt yazıcaz.

  // ================================================================================================
  // moveSequence ve mistakes datası arraylere eklenir.
  // ================================================================================================
  for (const moment of input.moments) {
    const bestUci = moment.bestUci.trim();
    if (moment.turn !== userColor || !bestUci || !isQuestionQuality(moment.quality)) continue;

    let moveSequenceId = sequenceIdByPly.get(moment.ply);
    if (!moveSequenceId) {
      moveSequenceId = randomUUID();
      sequencesToCreate.push({
        id: moveSequenceId,
        initialFen: moment.fen,
        displayFen: moment.fen,
        moves: bestUci,
      });
    }

    mistakesToSave.push({
      userId: input.userId,
      gameAnalysisId: input.gameAnalysisId,
      moveSequenceId,
      gameId: input.gameId,
      source: input.source,
      title: moment.playedSan ? `Played ${moment.playedSan}` : "Original game move",
      ply: moment.ply,
      quality: moment.quality,
    });
  }

  // ================================================================================================
  // moveSequence ve mistakes datası için servis çalıştırılır.
  // ================================================================================================
  if (sequencesToCreate.length > 0) {
    const created = await createMoveSequences(createAdminClient(), sequencesToCreate);
    const createdIds = new Set(created.map((sequence) => sequence.id));
    if (createdIds.size !== sequencesToCreate.length) {
      const reusable = new Set(sequenceIdByPly.values());
      const saved = await upsertGameAnalysisMistakes(
        input.supabase,
        mistakesToSave.filter((question) => reusable.has(question.moveSequenceId)),
      );
      return saved.sort((a, b) => a.ply - b.ply);
    }
  }

  // Eklenen kayıtlar geri döndürlür.
  const saved = await upsertGameAnalysisMistakes(input.supabase, mistakesToSave);
  return saved.sort((a, b) => a.ply - b.ply);
}
