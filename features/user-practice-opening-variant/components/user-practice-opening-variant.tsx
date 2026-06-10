import Image from "next/image";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

type UserPracticeOpeningVariantListProps = {
  openingVariants: UserPracticeOpeningVariantWithDetails[];
  voltScoresBySequenceId?: Record<string, VoltScoreResult>;
};

export function UserPracticeOpeningVariantList({
  openingVariants,
  voltScoresBySequenceId = {},
}: UserPracticeOpeningVariantListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-lg bg-[#113DC4]">
        <div className="min-w-0 flex-1 space-y-2 p-4">
          <p className="text-primary text-sm font-semibold">Build your repertoire, one variant at a time</p>
          <h2 className="text-3xl font-bold">Your Opening Practice List</h2>
        </div>
        <div className="overflow-hidden rounded-lg">
          <Image
            src="/images/openings/bg-openings.png"
            alt="Opening"
            width={268}
            height={200}
            className="object-contain"
          />
        </div>
      </div>

      {openingVariants.length === 0 ? (
        <EmptyDataMessage message="You haven't added any opening variants to your practice list yet." />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {openingVariants.map((practice) => {
            const { openingVariant } = practice;
            return (
              <OpeningBoardCard
                key={practice.id}
                id={openingVariant.id}
                name={openingVariant.title ?? "Untitled variant"}
                group={openingVariant.group}
                size={240}
                href={`/openings/variant/${openingVariant.id}`}
                fen={openingVariant.moveSequence.displayFen ?? openingVariant.moveSequence.initialFen}
                description={openingVariant.description}
                moves={openingVariant.moveSequence.moves}
                voltScore={voltScoresBySequenceId[openingVariant.moveSequence.id] ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
