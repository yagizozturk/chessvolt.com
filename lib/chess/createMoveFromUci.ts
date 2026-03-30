import { Move } from "@/lib/shared/types/move";

export function parseUciParts(uci: string): Pick<Move, "from" | "to" | "promotion"> {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci.slice(4) : undefined,
  };
}

export function createMoveObjectFromUci(uci: string): Move {
  return {
    ...parseUciParts(uci),
    uci,
    san: uci,
  };
}
