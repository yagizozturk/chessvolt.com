import { Move } from "@/lib/shared/types/move";

export function createMoveObjectFromUci(uci: string): Move {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci.slice(4) : undefined;
  const san = uci;

  return {
    from,
    to,
    promotion,
    san,
  };
}
