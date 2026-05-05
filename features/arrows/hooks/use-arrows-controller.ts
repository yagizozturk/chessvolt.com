"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { useEffect, useMemo, useState } from "react";

type UseArrowsControllerParams = {
  arrows: DrawShape[] | null | undefined;
};

function getArrowKey(orig?: string, dest?: string) {
  if (!orig || !dest) return null;
  return `${orig.toLowerCase()}-${dest.toLowerCase()}`;
}

export function useArrowsController({ arrows }: UseArrowsControllerParams) {
  const [defaultArrows, setDefaultArrows] = useState<DrawShape[]>(() => arrows ?? []);
  const [drawnArrows, setDrawnArrows] = useState<DrawShape[]>([]);

  useEffect(() => {
    setDefaultArrows(arrows ?? []);
  }, [arrows]);

  const defaultArrowKeySet = useMemo(
    () =>
      new Set(
        defaultArrows
          .filter((arrow): arrow is DrawShape & { orig: string; dest: string } => !!arrow.orig && !!arrow.dest)
          .map((arrow) => getArrowKey(arrow.orig, arrow.dest))
          .filter((key): key is string => !!key),
      ),
    [defaultArrows],
  );

  const userApprovedArrows = useMemo(() => {
    const uniqueApproved = new Set<string>();

    drawnArrows.forEach((arrow) => {
      const key = getArrowKey(arrow.orig, arrow.dest);
      if (!key) return;
      if (defaultArrowKeySet.has(key)) {
        uniqueApproved.add(key);
      }
    });

    return Array.from(uniqueApproved).map((key) => {
      const [orig, dest] = key.split("-");
      return { orig: orig as Key, dest: dest as Key, brush: "green" } satisfies DrawShape;
    });
  }, [drawnArrows, defaultArrowKeySet]);

  const boardArrows = useMemo(() => {
    const approvedKeySet = new Set(userApprovedArrows.map((arrow) => `${arrow.orig}-${arrow.dest}`));
    return defaultArrows.map((arrow) => {
      const key = getArrowKey(arrow.orig, arrow.dest);
      if (!key) return arrow;
      if (!approvedKeySet.has(key)) return arrow;
      return {
        ...arrow,
        brush: "green",
      };
    });
  }, [defaultArrows, userApprovedArrows]);

  function clearDefaultArrows() {
    setDefaultArrows([]);
  }

  function handleDrawChange(shapes: DrawShape[]) {
    const filteredShapes = shapes.filter((shape) => {
      const key = getArrowKey(shape.orig, shape.dest);
      if (!key) return false;
      return defaultArrowKeySet.has(key);
    });

    setDrawnArrows(filteredShapes);
    return filteredShapes;
  }

  return {
    defaultArrows,
    boardArrows,
    drawnArrows,
    userApprovedArrows,
    handleDrawChange,
    clearDefaultArrows,
  };
}
