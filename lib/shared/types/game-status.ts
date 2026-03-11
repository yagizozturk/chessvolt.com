export type GameStatus = 
  | { type: "playing" }
  | { type: "checkmate"; winner: "white" | "black" }
  | { type: "stalemate" }
  | { type: "draw" }
  | { type: "check"; color: "white" | "black" };