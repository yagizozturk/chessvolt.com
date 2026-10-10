import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { PageHeaderWithImage } from "@/components/page-header/page-header";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getOpeningById, getOpeningVariantsByOpeningId } from "@/features/openings/services/openings.service";
import { getOpeningCoverImageSrc } from "@/features/openings/utilities/opening-cover-image.utils";
import { getFavoritedOpeningVariantIds } from "@/features/user-favorites/services/user-favorite.service";
import {
  getAttemptsByUserAndSequenceIds,
  getLatestAttemptStatsForSequences,
} from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { openingDocumentDescription, openingDocumentTitle } from "@/lib/metadata/training-page-metadata";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const { supabase } = await getPublicUser();
  const opening = await getOpeningById(supabase, id);

  if (!opening) {
    notFound();
  }

  return {
    title: openingDocumentTitle(opening.name),
    description: openingDocumentDescription(opening.name, opening.description),
  };
}

export default async function OpeningBySlugAndIdPage({ params }: Params) {
  const { id } = await params;
  const { user, supabase } = await getPublicUser();

  // ================================================================================================
  // Id ye göre açılış çekilir.
  // ================================================================================================
  const opening = await getOpeningById(supabase, id);
  if (!opening) {
    notFound();
  }

  // ================================================================================================
  // Açılışın tüm varyantları çekilir. Açılış ID ye göre.
  // ================================================================================================
  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);

  // ================================================================================================
  // Varyant IDleri ve sequence IDleri değişkene atanır.
  // ================================================================================================
  const variantIds = variants.map((v) => v.id);

  // ================================================================================================
  // map ile variants daki tüm nesnelerin sadece moveSequence.id değerleri yeni diziye atanır.
  // Set, içinde aynı değerden sadece 1 tane barındıran veri yapısıdır. Duplicate engeller.
  // Set nesnesi (Dizi değildir!): const mySet = new Set([101, 102, 101]); // Set { 101, 102 }
  // Spread ile Set'i Diziye dönüştürme: const myArray = [...mySet]; // [101, 102]
  // ================================================================================================
  const sequenceIds = [...new Set(variants.map((v) => v.moveSequence.id))];

  // ================================================================================================
  // Promise.all ile iki farklı işlem paralel olarak yapılır.
  // getLatestAttemptStatsForSequences: sequenceIds dizisindeki IDlerin attemptleri çekilir.
  // getFavoritedOpeningVariantIds: hangi variantlar favorilenmiş o çekilir.
  // kullanıcı user oluşturmamışsa bu servisler çekilmez.
  // user olmadığı durumda Promise.all yapısını bozmamak için geriye anında tamamlanmış yapay bir
  // Promise döndürmek gerekir.Promise.resolve(değer) hazır bir Promise verir, sıra bozulmaz.
  // Ek açıklama: Promise.all normal değerleri de kabul eder; Promise.resolve zorunlu değildir.
  // Kullanıcı yoksa veya ilgili ID dizisi boşsa servis çağrılmaz.
  // ================================================================================================
  const [stats, favoritedVariantIds] = await Promise.all([
    user && sequenceIds.length > 0
      ? getLatestAttemptStatsForSequences(supabase, user.id, sequenceIds)
      : Promise.resolve([]),
    user && variantIds.length > 0
      ? getFavoritedOpeningVariantIds(supabase, user.id, variantIds)
      : Promise.resolve(new Set<string>()),
  ]);

  const favoritedVariants = variants.filter((variant) => favoritedVariantIds.has(variant.id));

  // ================================================================================================
  // Aynı sequence birden fazla varyantta kullanılıyorsa yalnızca bir kez hesaba katılır.
  // ================================================================================================
  const favoritedSequencesById = new Map(
    favoritedVariants.map((variant) => [variant.moveSequence.id, variant.moveSequence]),
  );
  const favoritedSequenceIds = [...favoritedSequencesById.keys()];

  // ================================================================================================
  // Favorilen varyantların attemptleri çekilir. Volt score hesaplaması yapacağız.
  // ================================================================================================
  const favoritedAttempts =
    user && favoritedSequenceIds.length > 0
      ? await getAttemptsByUserAndSequenceIds(supabase, user.id, favoritedSequenceIds)
      : [];

  // ================================================================================================
  // Volt score hesaplaması için context bilgileri hazırlanır.
  // ================================================================================================
  const voltContexts = [...favoritedSequencesById.values()].map((sequence) => ({
    sequenceId: sequence.id,
    totalMoveCount: getPlayerMoveCount(sequence.moves),
    rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
  }));

  // ================================================================================================
  // Favorilen varyantların volt scoreleri hesaplanır.
  // ================================================================================================
  const voltScoresBySequenceId = getVoltScoresBySequenceId(favoritedAttempts, voltContexts);

  const attemptStatsBySequenceId = createAttemptStatsBySequenceIdMap(stats);
  const coverImageSrc = opening.coverImageUrl
    ? getOpeningCoverImageSrc(opening.coverImageUrl)
    : "/images/openings/bg-opening-default-cover-image.png";

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <div className="md:hidden">
          {/* ====== Sayfa Başlığı Mobilde  ====== */}
          <PageHeaderWithImage
            title={opening.name}
            description={opening.description ?? ""}
            imageSrc={coverImageSrc}
            imageAlt={opening.name}
          />
        </div>

        {/* ====== Sayfa Başlığı Desktopta  ====== */}
        <div
          className="hidden gap-4 rounded-lg md:flex"
          style={opening.coverImageColor ? { background: opening.coverImageColor } : undefined}
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-6">
            <h1 className="text-2xl font-bold text-neutral-800">{opening.name}</h1>
            <p className="text-base text-neutral-600">{opening.description}</p>
          </div>
          <div className="overflow-hidden rounded-lg">
            <Image src={coverImageSrc} alt={opening.name} width={265} height={150} className="object-contain" />
          </div>
        </div>

        {/* ====== Sayfa İçeriği ve Varyantlar ====== */}
        <div className="page-container-grid-data-layout">
          {variants.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center text-sm">No variations available yet.</p>
          )}
          {variants.map((variant) => {
            const attemptStats = attemptStatsBySequenceId[variant.moveSequence.id];
            const isFavorited = favoritedVariantIds.has(variant.id);

            return (
              <OpeningBoardCard
                key={variant.id}
                id={variant.id}
                name={variant.title ?? ""}
                href={`/openings/variant/${variant.id}`}
                fen={variant.moveSequence.displayFen ?? variant.moveSequence.initialFen}
                isComplete={attemptStatusToIsComplete(attemptStats?.status)}
                accuracyPercent={attemptStats ? computeSequenceAttemptAccuracy(attemptStats) : null}
                description={variant.description}
                moves={variant.moveSequence.moves}
                voltScore={isFavorited ? (voltScoresBySequenceId[variant.moveSequence.id] ?? null) : null}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
