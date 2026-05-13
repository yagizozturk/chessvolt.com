import type { DrawShape } from "@lichess-org/chessground/draw";

export type Opening = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  type: string | null;
  arrows: DrawShape[] | null;
  displayFen: string;
  createdAt: string;
};
