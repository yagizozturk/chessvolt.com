export type OpeningArrow = {
  orig: string;
  dest: string;
  brush?: string;
  isCompleted?: boolean;
};

export type OpeningArrowGroup = {
  id: string;
  title: string;
  description: string;
  color: string;
  arrows: OpeningArrow[];
};

/** Flatten groups for Chessground; arrow brush falls back to group color. */
export function flattenOpeningArrowGroups(groups: OpeningArrowGroup[]) {
  return groups.flatMap((group) =>
    group.arrows.map((arrow) => ({
      orig: arrow.orig,
      dest: arrow.dest,
      brush: arrow.brush ?? group.color,
    })),
  );
}

export type Opening = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  type: string | null;
  arrows: OpeningArrowGroup[] | null;
  displayFen: string;
  createdAt: string;
};
