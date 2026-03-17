declare module "cm-pgn" {
  export interface PgnMove {
    color: string;
    fen: string;
    flags: string;
    from: string;
    to: string;
    piece: string;
    ply: number;
    san: string;
    uci: string;
    nag?: string;
    commentAfter?: string;
    variations?: PgnMove[][];
    next?: PgnMove;
    previous?: PgnMove;
  }

  export interface PgnHistory {
    moves: PgnMove[];
  }

  export interface PgnHeader {
    tags: Record<string, string>;
    render(): string;
  }

  export class Pgn {
    header: PgnHeader;
    history: PgnHistory;
    props: { sloppy: boolean; chess960: boolean };

    constructor(pgnString?: string, props?: { sloppy?: boolean; chess960?: boolean });
    render(renderHeader?: boolean, renderComments?: boolean, renderNags?: boolean): string;
  }
}
