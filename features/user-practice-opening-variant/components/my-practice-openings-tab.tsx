import Link from "next/link";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import { PracticeOpeningVariantCard } from "@/features/user-practice-opening-variant/components/practice-opening-variant-card";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

type MyPracticeOpeningsTabProps = {
  practiceVariants: UserPracticeOpeningVariantWithDetails[];
  voltBySequenceId?: Record<string, VoltScoreResult>;
};

export function MyPracticeOpeningsTab({
  practiceVariants,
  voltBySequenceId = {},
}: MyPracticeOpeningsTabProps) {
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
      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/openings">Browse openings</Link>
        </Button>
      </div>
    </div>
  );
}
