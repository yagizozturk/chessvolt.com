// TODO: Refactor
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

export function getOpeningArrowGroupProgress(group: OpeningArrowGroup) {
  const total = group.arrows.length;
  const completed = group.arrows.filter((arrow) => arrow.isCompleted).length;
  return { completed, total };
}

export function isOpeningArrowGroupComplete(group: OpeningArrowGroup): boolean {
  return group.arrows.length > 0 && group.arrows.every((arrow) => arrow.isCompleted);
}

export function areAllOpeningArrowGroupsComplete(groups: OpeningArrowGroup[]): boolean {
  return groups.length > 0 && groups.every(isOpeningArrowGroupComplete);
}

function cloneArrowGroups(groups: OpeningArrowGroup[]): OpeningArrowGroup[] {
  return groups.map((group) => ({
    ...group,
    arrows: group.arrows.map((arrow) => ({ ...arrow, isCompleted: arrow.isCompleted ?? false })),
  }));
}

export function createArrowGroupsState(groups: OpeningArrowGroup[]): OpeningArrowGroup[] {
  return cloneArrowGroups(groups);
}

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
