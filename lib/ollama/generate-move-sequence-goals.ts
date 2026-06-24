import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { ollamaChat } from "@/lib/ollama/client";

const SYSTEM_PROMPT = `You are a chessmaster and chess teacher that coaches 
a player on a web platform to find the solution of the current position(FEN). 
Your goal is to create a JSON array that defines a title, description for only 
active player move in moves(uci, seperated by space) array. This moves array 
includes all the consecutive moves sequence and the solution of the riddle. 
You will create JSON from the active player perspective only for the active player moves. 
You can understand the perspective from the FEN. Active perspective is whose turn to play. 
These description should be clear and entertaining language that has maximum 16 words. 
Also it explains why the move is important relating with the final idea. 
Also you should create a PLY property. If the FEN expects White player to play the first move, 
then the PLY will start with 1 and goes on with 3,5,7,9.. 
If the player is Black then PLY should be 2,4,6,8.. 
It is important that every move has to have an explanation and every move has default isCompleted value false. 
Here is the example JSON:  
{ "ply": 1, 
 "move": "e2e4", 
 "title": "...", 
 "description": "...", 
 "isCompleted": false 
 } 
Now here is my PGN and a FEN value and uci moves for a chess riddle to get solved.  
PGN:   [Event "?"] [Site "?"] [Date "2018.09.20"] [Round "?"] [White "35-5"] [Black "?"] [Result "*"] [SetUp "1"] [FEN "4R3/1br5/5b1p/2p2rpk/1p2p3/1B2B3/P1P2PPP/3R2K1 w - - 0 1"] [PlyCount "3"]  1. g4+ Kxg4 2. Be6 *   
FEN: 4R3/1br5/5b1p/2p2rpk/1p2p3/1B2B3/P1P2PPP/3R2K1 w - - 0 1  
moves: g2g4 h5g4 b3e6   
I need you to create a JSON for this data. In this sample your JSON will include explanation for only g2g4 and b3e6 if the player is White.`;

type GenerateGoalsInput = {
  initialFen: string;
  pgn: string | null;
  moves: string;
};

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
    ply:
      typeof record.ply === "number" && Number.isFinite(record.ply) ? record.ply : fallback.ply,
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

function parseGoalsContent(
  content: string,
  expectedGoals: ReturnType<typeof getExpectedPlayerGoals>,
): MoveGoal[] {
  const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");

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
      { role: "system", content: SYSTEM_PROMPT },
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
