// Lichess is first returning opponent move in puzzles. After initial move
// we need to get the next turn to display the correct turn
export function getNextTurnFromFen(fen?: string) {
    if (!fen) return null;
    const parts = fen.split(" ");
    const turn = parts[1];
    return turn === "w" ? "Black's move" : "White's move";
}