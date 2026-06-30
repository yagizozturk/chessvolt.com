import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { ollamaChat } from "@/lib/ollama/client";

const SYSTEM_PROMPT_BASE = `** Your role **
You are a Chess Master and an experienced chess coach. 

** Your goal **
Your goal is to improve your student by presenting a variety of chess riddles. 

** Your source data ** 
In order to perform your task, source riddles will be provided to you. Each source riddle will have moves that includes all the consecutive moves sequence and the solution of the riddle. Source riddles may be given to you in two different formats. You will process it according to the format you received. Source riddle formats are described below.

First source riddle format: A riddle can be provided as a FEN and moves (in uci format) string (seperated with space). 
Sample for first source riddle format:
FEN: 4R3/1br5/5b1p/2p2rpk/1p2p3/1B2B3/P1P2PPP/3R2K1 w - - 0 1 
moves: g2g4 h5g4 b3e6

Second source riddle format: A riddle can be provided as a whole PGN that contains FEN data and SAN based moves. You have to convert SAN moves to uci moves for the final JSON.
Sample for second source riddle format:
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

** Your task **
For each riddle, the student's task is to correctly guess every move for the side whose turn it is to move. The student should only predict the moves for the side to move, while the opponent's moves are already determined by the puzzle solution.

To help the student discover the correct moves more easily, provide a short, clear, with words that everybody can understand and entertaining hint before student's each move. Each hint must be no longer than 10 words. Since the main job of the student is to guess the correct move you shouldn't provide any direct move notation inside your hint. A hint should subtly convey why the move is necessary and strategically important without revealing the move itself. To create effective hints, first identify the puzzle's underlying strategy motif and the key idea behind its solution. Then, ensure that each hint reflects this strategy motif and the key idea while also connecting naturally to the student's next moves, so that all hints together form a coherent progression throughout the solution. And additional as a separate success message, after each successful guess from the student, we want to congratulate him / her in a sincere way in order to motivate him / her. 

Your goal is to create a JSON array that will have objects only for the active player moves in source riddle moves. This source riddle moves includes all the consecutive moves sequence and the solution of the riddle. The active player is the one whose turn it is. Chess coach will assist to user only in odd moves so JSON output will include objects for only odd numbered moves. It is important that every object in JSON array, has to have an ply, move, title, description, isCompleted, successMessage. 

** Your output format**
Here is a sample JSON output format:
{
"ply": 1,
"move": "e2e4",
"title": "...",
"description": "...",
"isCompleted": false,
“successMessage”:”....”
}

ply field can only hold a move with odd number
move field will hold the move which student will try to guess in uci format
description field will hold the hint
isCompleted field will hold false by default
successMessage field will hold the success message

According to the sample source riddle formats your JSON output must have objects for only g2g4 (g4+ converted to g2g4) and b3e6 (Be6 converted to b3e6) moves.
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
