import { Sword } from "lucide-react";
import Link from "next/link";

import ImageTooltipBadge from "@/components/badge/image-tooltip-badge/image-tooltip-badge";
import { IterationBadge } from "@/components/badge/number-badge/number-badge";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import { BlurFade } from "@/components/ui/blur-fade";
import VoltBoard from "@/components/volt-board/volt-board";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  group?: string | null;
  num: number;
  width?: number;
  height?: number;
  isComplete?: boolean;
  href: string;
  fen: string;
  description?: string | null;
};

type OpeningVariantGroupMeta = {
  imageSrc: string;
};

function getOpeningVariantGroupMeta(group: string | null | undefined): OpeningVariantGroupMeta {
  const normalizedGroup = group?.trim().toLowerCase();

  switch (normalizedGroup) {
    case "fundamentals":
      return {
        imageSrc: "/images/icons/icon-fundamentals.png",
      };
    case "practical gambits & traps":
      return {
        imageSrc: "/images/icons/icon-traps.png",
      };
    case "theoretical main lines":
      return {
        imageSrc: "/images/icons/icon-book.png",
      };
    case "responses to opponent reactions":
      return {
        imageSrc: "/images/icons/icon-sword.png",
      };
    default:
      return {
        imageSrc: "/images/icons/icon-goal.png",
      };
  }
}

export function OpeningBoardCard({
  id,
  name,
  group,
  num,
  width = 200,
  height = 200,
  isComplete,
  href,
  fen,
  description,
}: OpeningBoardCardProps) {
  const { imageSrc } = getOpeningVariantGroupMeta(group);
  const trimmedGroup = group?.trim();

  return (
    <BlurFade duration={0.4} direction="down" blur="4px">
      <Link href={href} className="group flex flex-col">
        <div className="flex items-center gap-3">
          <IterationBadge num={num} />
          <p className="line-clamp-2 min-w-0 flex-1 text-sm break-words">{name}</p>
          {trimmedGroup && (
            <ImageTooltipBadge imageSrc={imageSrc} imageAlt={`${trimmedGroup} icon`} title={trimmedGroup} size={20} />
          )}
        </div>
        <div className="group/board relative mt-2 inline-flex justify-center">
          {isComplete === true && <BoardStatusIcon status="solved" positionClassName="top-2 right-3" />}
          {isComplete === false && <BoardStatusIcon status="wrong" positionClassName="top-2 right-3" />}
          <VoltBoard
            sourceId={id}
            initialFen={fen}
            moves={""}
            width={width}
            height={height}
            className="border-secondary rounded-xl border-4"
            viewOnly
            coordinates={false}
          />
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
            <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
              <Sword className="text-primary-foreground h-7 w-7" />
            </div>
            <span className="font-semibold text-white">Play</span>
          </div>
        </div>
        {description && <div className="bg-secondary/50 mt-4 flex rounded-lg p-3 text-sm ring-0">{description}</div>}
      </Link>
    </BlurFade>
  );
}
