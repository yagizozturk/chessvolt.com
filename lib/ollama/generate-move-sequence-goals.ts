import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { ollamaChat } from "@/lib/ollama/client";

const SYSTEM_PROMPT_BASE = `You are a Chess Master and an experienced chess coach. Your goal is to improve your student by presenting a variety of chess puzzles. You have access to both the puzzles and their corresponding FEN positions. For each puzzle, the student's task is to correctly guess every move for the side whose turn it is to move. The student should only predict the moves for the side to move, while the opponent's moves are already determined by the puzzle solution. 

To help the student discover the correct moves more easily, provide a short, clear, with words that everybody can understand and entertaining hint before each move. Each hint must be no longer than 10 words. Since the main job of the student is to guess the correct move you shouldn't provide any direct move notation inside your hint. A hint should subtly convey why the move is necessary and strategically important without revealing the move itself.  To create effective hints, first identify the puzzle's underlying strategy motif and the key idea behind its solution. Then, ensure that each hint reflects this strategic theme while also connecting naturally to the student's next moves, so that all hints together form a coherent progression throughout the solution. Final JSON data has successMessage property. This is for a congratulations message to user when the move is found correctly.

Your goal is to create a JSON array that defines a title, description (which will include hint) for only active player move in moves (uci, seperated by space) array. The active player is the one whose turn it is. You will create JSON from the active player perspective only for the active player moves. You can understand the perspective from the FEN.You will place the hint for each move in the description field of the JSON.  This moves array includes all the consecutive moves sequence and the solution of the riddle. Also you should create a PLY property. Chess coach will assist to user only in odd moves. So PLY property will only include move descriptions for odd numbers.

It is important that every object in JSON array, has to have an ply, move, title, description, isCompleted, successMessage. isCompleted field is default has a value false. 

Here is the example JSON: 
{ 
"ply": 1, 
"move": "e2e4", 
"title": "...", 
"description": "...", 
"isCompleted": false,
“successMessage”:”....”
} 

There are two ways of getting needed information from the admin input. Use one of them. Admin input data can only be one of them.
First way: Admin can input system only a FEN value and moves(uci format) string(seperated with space).Example FEN: 4R3/1br5/5b1p/2p2rpk/1p2p3/1B2B3/P1P2PPP/3R2K1 w - - 0 1 moves: g2g4 h5g4 b3e6 I need you to create a JSON for this data. In this sample your JSON will include explanation for only g2g4 and b3e6Second way: Admin can provide a whole PGN that contains FEN data and SAN based moves. You have to convert SAN moves to uci moves for the final JSON.
Example:
[Event "?"] 
[Site "?"] 
[Date "2018.09.20"] 
[Round "?"] 
[White "35-5"] 
[Black "?"] 
[Result "*"] 
[SetUp "1"] 
[FEN "4R3/1br5/5b1p/2p2rpk/1p2p3/1B2B3/P1P2PPP/3R2K1 w - - 0 1"] 
[PlyCount "3"] 1. g4+ Kxg4 2. Be6 * 

I need you to create a JSON for this data. In this sample your JSON will include explanation for only g2g4(g4+ converted to g2g4) and b3e6(Be6 converted to b3e6).

`;

export type GenerateGoalsInput = {
  initialFen: string;
  pgn: string | null;
  moves: string;
};

function formatPuzzleInputForPrompt(input: GenerateGoalsInput): string {
  const pgn = input.pgn?.trim();
  if (pgn) {
    return `Admin input data:\n${pgn}\n\nI need you to create a JSON for this data.`;
  }

  return `Admin input data:\nFEN: ${input.initialFen.trim()}\nmoves: ${input.moves.trim()}\n\nI need you to create a JSON for this data.`;
}

export function buildMoveSequenceGoalsSystemPrompt(input: GenerateGoalsInput): string {
  return `${SYSTEM_PROMPT_BASE}\n\n${formatPuzzleInputForPrompt(input)}`;
}

function parseMovesFromSequence(moves: string): string[] {
  return moves
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0);
}

function getInitialSideToMove(initialFen: string): "w" | "b" {
  const side = initialFen.trim().split(/\s+/)[1];
  return side === "b" ? "b" : "w";
}

function getPlayerMoveIndices(uciMoves: string[]): number[] {
  const indices: number[] = [];
  let index = 0;

  while (index < uciMoves.length) {
    indices.push(index);
    index = uciMoves[index + 1] !== undefined ? index + 2 : index + 1;
  }

  return indices;
}

function getExpectedPlayerGoals(initialFen: string, uciMoves: string[]) {
  const basePly = getInitialSideToMove(initialFen) === "w" ? 1 : 2;

  return getPlayerMoveIndices(uciMoves).map((moveIndex, ordinal) => ({
    moveIndex,
    ply: basePly + ordinal * 2,
    move: uciMoves[moveIndex]!,
  }));
}

function coerceRawGoal(item: unknown, fallback: { ply: number; move: string }): MoveGoal {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  return {
    ply: typeof record.ply === "number" && Number.isFinite(record.ply) ? record.ply : fallback.ply,
    move: typeof record.move === "string" && record.move ? record.move : fallback.move,
    title: typeof record.title === "string" ? record.title : "Move goal",
    description: typeof record.description === "string" ? record.description : "",
    isCompleted: false,
    ...(typeof record.card === "string" ? { card: record.card } : {}),
  };
}

function collectGoalCandidates(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (!parsed || typeof parsed !== "object") {
    return [];
  }

  const record = parsed as Record<string, unknown>;

  if (Array.isArray(record.goals)) return record.goals;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.data)) return record.data;

  for (const value of Object.values(record)) {
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
  }

  return [parsed];
}

function parseGoalsContent(content: string, expectedGoals: ReturnType<typeof getExpectedPlayerGoals>): MoveGoal[] {
  const trimmed = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("Ollama response is not valid JSON");
  }

  const candidates = collectGoalCandidates(parsed);
  const normalized = expectedGoals.map((expected, index) =>
    coerceRawGoal(candidates[index] ?? candidates[0], expected),
  );

  return normalized.sort((a, b) => a.ply - b.ply);
}

async function requestGoalsFromOllama(
  input: GenerateGoalsInput,
  uciMoves: string[],
  expectedGoals: ReturnType<typeof getExpectedPlayerGoals>,
): Promise<MoveGoal[]> {
  const userPayload = {
    initialFen: input.initialFen,
    pgn: input.pgn,
    moves: input.moves,
    uciMoves,
    playerGoalCount: expectedGoals.length,
    playerMoves: expectedGoals.map((goal) => ({
      ply: goal.ply,
      move: goal.move,
    })),
  };

  const content = await ollamaChat({
    messages: [
      { role: "system", content: buildMoveSequenceGoalsSystemPrompt(input) },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
    format: "json",
  });

  return parseGoalsContent(content, expectedGoals);
}

export async function generateMoveSequenceGoals(input: GenerateGoalsInput): Promise<MoveGoal[]> {
  const uciMoves = parseMovesFromSequence(input.moves);
  if (uciMoves.length === 0) {
    throw new Error("Move sequence has no moves");
  }

  const expectedGoals = getExpectedPlayerGoals(input.initialFen, uciMoves);
  if (expectedGoals.length === 0) {
    throw new Error("Move sequence has no player moves to explain");
  }

  try {
    return await requestGoalsFromOllama(input, uciMoves, expectedGoals);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ollama request failed";
    throw new Error(message);
  }
}
