import { BookOpen, Puzzle } from "lucide-react";
import Link from "next/link";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";

type PracticeOpeningVariantCardProps = {
  practice: UserPracticeOpeningVariantWithDetails;
};

export function PracticeOpeningVariantCard({ practice }: PracticeOpeningVariantCardProps) {
  const { openingVariant } = practice;
  const fen = openingVariant.moveSequence.displayFen ?? openingVariant.moveSequence.initialFen;
  const moveCountLabel = formatMoveCountLabel(openingVariant.moveSequence.moves);
  const title = openingVariant.title ?? "Untitled variant";
  const href = `/openings/variant/${openingVariant.id}`;

  return (
    <Link
      href={href}
      className="bg-card border-b-card-shadow flex h-full flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6"
    >
      <div className="shrink-0">
        <DisplayBoard sourceId={openingVariant.id} initialFen={fen} size={168} coordinates={false} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {openingVariant.group ? (
          <Badge variant="secondary" className="w-fit">
            <BookOpen data-icon="inline-start" />
            {openingVariant.group}
          </Badge>
        ) : null}
        <h2 className="text-2xl font-bold">{title}</h2>
        {openingVariant.description ? (
          <p className="text-muted-foreground line-clamp-2 text-base">{openingVariant.description}</p>
        ) : null}
        {moveCountLabel ? (
          <BoardCardMetaRow icon={Puzzle} label={moveCountLabel} className="text-muted-foreground text-sm" />
        ) : null}
        <div className="mt-auto flex items-center gap-3">
          <Button variant="voltCompact" size="xs" className="ml-auto shrink-0">
            Practice
          </Button>
        </div>
      </div>
    </Link>
  );
}
