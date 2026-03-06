import { Chess, SQUARES } from 'chess.js';
import { Key } from "@lichess-org/chessground/types";

// Gets legal moves, converts to destinations.
export function toDests(chess: Chess): Map<Key, Key[]> {
    const dests = new Map<Key, Key[]>();
    SQUARES.forEach((s) => {
        const ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
            dests.set(
                s,
                ms.map((m) => m.to),
            );
    });
    return dests;
}