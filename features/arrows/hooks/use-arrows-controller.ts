"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { useEffect, useMemo, useRef, useState } from "react";

type UseArrowsControllerParams = {
  arrows: DrawShape[] | null | undefined;
  onWrongArrow?: () => void;
};

export function useArrowsController({ arrows, onWrongArrow }: UseArrowsControllerParams) {
  const [defaultArrows, setDefaultArrows] = useState<DrawShape[]>(() => arrows ?? []);
  const [drawnArrows, setDrawnArrows] = useState<DrawShape[]>([]);
  const keptShapeKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setDefaultArrows(arrows ?? []);
  }, [arrows]);

  const defaultArrowKeySet = useMemo(
    () =>
      new Set(
        defaultArrows
          .filter((arrow): arrow is DrawShape & { orig: string; dest: string } => !!arrow.orig && !!arrow.dest)
          .map((arrow) => `${arrow.orig}-${arrow.dest}`),
      ),
    [defaultArrows],
  );

  const userApprovedArrows = useMemo(() => {
    const uniqueApproved = new Set<string>();

    drawnArrows.forEach((arrow) => {
      if (!arrow.orig || !arrow.dest) return;
      const key = `${arrow.orig}-${arrow.dest}`;
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
      if (!arrow.orig || !arrow.dest) return arrow;
      const key = `${arrow.orig}-${arrow.dest}`;
      if (!approvedKeySet.has(key)) return arrow;
      return {
        ...arrow,
        brush: "green",
      };
    });
  }, [defaultArrows, userApprovedArrows]);

  function handleDrawChange(shapes: DrawShape[]) {
    for (const shape of shapes) {
      if (!shape.orig || !shape.dest) continue;

      const key = `${shape.orig}-${shape.dest}`;
      if (keptShapeKeysRef.current.has(key)) continue;
      if (!defaultArrowKeySet.has(key)) {
        onWrongArrow?.();
      }
    }

    const filteredShapes = shapes.filter((shape) => {
      if (!shape.orig || !shape.dest) return false;
      return defaultArrowKeySet.has(`${shape.orig}-${shape.dest}`);
    });

    keptShapeKeysRef.current = new Set(
      filteredShapes.map((shape) => `${shape.orig}-${shape.dest}`),
    );

    setDrawnArrows(filteredShapes);
    return filteredShapes;
  }

  return {
    defaultArrows,
    boardArrows,
    drawnArrows,
    userApprovedArrows,
    handleDrawChange,
  };
}
