import { Calendar, Circle, Flag, Gauge, Puzzle, Target } from "lucide-react";
import Link from "next/link";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Button } from "@/components/ui/button";
import type { Game } from "@/features/game/types/game";
import type { Riddle } from "@/features/riddle/types/riddle";
import { formatRiddleDifficultyLabel } from "@/features/riddle/types/riddle-difficulty";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";

type RiddleBoardCardProps = {
  riddle: Riddle;
  game: Game | null;
  num: number;
  size?: number;
  /** true = correct, false = wrong, undefined = not attempted, Undefined ı tipin bir parçası yapmak için ? ni ekleriz */
  isComplete?: boolean;
  accuracyPercent?: number | null;
  href?: string;
  displayFen?: string | null;
};

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function RiddleBoardCard({
  riddle,
  game,
  num,
  size = 200,
  isComplete,
  accuracyPercent,
  href,
  displayFen,
}: RiddleBoardCardProps) {
  const moveCountLabel = formatMoveCountLabel(riddle.moveSequence.moves);

  return (
    <Link
      href={href ?? `/riddle/${riddle.id}`}
      className="bg-card border-b-card-shadow flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6"
    >
      <div>
        {isComplete === true && <BoardStatusIcon status="solved" />}
        {isComplete === false && <BoardStatusIcon status="wrong" />}
        <DisplayBoard sourceId={riddle.id} initialFen={displayFen ?? undefined} size={size} coordinates={false} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-xl font-bold">{riddle.title}</p>
        {game ? (
          <>
            <div className="flex flex-col rounded-lg">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 shrink-0 fill-white" />
                <span className="truncate text-sm font-medium">{game.whitePlayer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 shrink-0 fill-black" />
                <span className="truncate text-sm font-medium">{game.blackPlayer}</span>
              </div>
            </div>
            <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {game.event ? <BoardCardMetaRow icon={Flag} label={game.event} truncate /> : null}
              <BoardCardMetaRow icon={Calendar} label={formatDate(game.playedAt)} />
            </div>
          </>
        ) : riddle.description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{riddle.description}</p>
        ) : (
          <p className="text-muted-foreground text-sm">Custom position</p>
        )}
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <BoardCardMetaRow icon={Gauge} label={formatRiddleDifficultyLabel(riddle.difficulty)} />
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <BoardCardMetaRow icon={Puzzle} label={moveCountLabel ?? "No moves"} />
        </div>
        <div className="mt-auto flex items-center gap-3">
          {accuracyPercent != null ? (
            <BoardCardMetaRow
              icon={Target}
              label={`${accuracyPercent}% accuracy`}
              className="text-muted-foreground text-sm"
            />
          ) : null}
          <Button variant="voltCompact" size="xs" className="ml-auto shrink-0">
            Play
          </Button>
        </div>
      </div>
    </Link>
  );
}
