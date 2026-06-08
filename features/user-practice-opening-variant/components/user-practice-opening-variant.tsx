import Link from "next/link";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PracticeOpeningVariantCard } from "@/features/user-practice-opening-variant/components/practice-opening-variant-card";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

type UserPracticeOpeningsTabProps = {
  practiceVariants: UserPracticeOpeningVariantWithDetails[];
  voltBySequenceId?: Record<string, VoltScoreResult>;
};

export function UserPracticeOpeningsTab({ practiceVariants, voltBySequenceId = {} }: UserPracticeOpeningsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {practiceVariants.length === 0 ? (
        <EmptyDataMessage message="You haven't added any opening variants to your practice list yet." />
      ) : (
        <div className="flex flex-col gap-6">
          {practiceVariants.map((practice) => (
            <PracticeOpeningVariantCard
              key={practice.id}
              practice={practice}
              voltScore={voltBySequenceId[practice.openingVariant.moveSequence.id] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
