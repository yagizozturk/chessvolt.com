import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import {
  normalizeGoalsFromMoves,
  parseMovesFromSequence,
  validateNormalizedGoals,
} from "@/features/move-sequence/validation/validate-goals-for-moves";
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
Here is the example JSON:  { "ply": 1, "move": "e2e4", "title": "...", "description": "...", "isCompleted": false } 
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

function coerceRawGoal(item: unknown, index: number): MoveGoal {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  return {
    ply: index + 1,
    move: typeof record.move === "string" ? record.move : "",
    title: typeof record.title === "string" ? record.title : "",
    description: typeof record.description === "string" ? record.description : "",
    isCompleted: false,
    ...(typeof record.card === "string" ? { card: record.card } : {}),
  };
}

function extractGoalsFromParsed(parsed: unknown): MoveGoal[] | null {
  if (Array.isArray(parsed)) {
    return parsed.map((item, index) => coerceRawGoal(item, index));
  }

  if (parsed && typeof parsed === "object" && "goals" in parsed) {
    const goals = (parsed as { goals?: unknown }).goals;
    if (!Array.isArray(goals)) return null;
    return goals.map((item, index) => coerceRawGoal(item, index));
  }

  return null;
}

function parseGoalsContent(content: string): MoveGoal[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Ollama response is not valid JSON");
  }

  const goals = extractGoalsFromParsed(parsed);
  if (!goals) {
    throw new Error("Ollama response does not contain a valid goals array");
  }

  return goals;
}

async function requestGoalsFromOllama(
  input: GenerateGoalsInput,
  uciMoves: string[],
  retryHint?: string,
): Promise<MoveGoal[]> {
  const userPayload = {
    initialFen: input.initialFen,
    pgn: input.pgn,
    moves: input.moves,
    moveCount: uciMoves.length,
    uciMoves,
  };

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    {
      role: "user" as const,
      content: JSON.stringify(userPayload),
    },
  ];

  if (retryHint) {
    messages.push({
      role: "user" as const,
      content: retryHint,
    });
  }

  const content = await ollamaChat({ messages, format: "json" });
  return parseGoalsContent(content);
}

export async function generateMoveSequenceGoals(input: GenerateGoalsInput): Promise<MoveGoal[]> {
  const uciMoves = parseMovesFromSequence(input.moves);
  if (uciMoves.length === 0) {
    throw new Error("Move sequence has no moves");
  }

  let rawGoals: MoveGoal[];
  try {
    rawGoals = await requestGoalsFromOllama(input, uciMoves);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ollama request failed";
    throw new Error(message);
  }

  if (rawGoals.length !== uciMoves.length) {
    try {
      rawGoals = await requestGoalsFromOllama(
        input,
        uciMoves,
        `Your previous response had ${rawGoals.length} goals but moveCount is ${uciMoves.length}. Return JSON with exactly ${uciMoves.length} goals.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ollama retry failed";
      throw new Error(message);
    }
  }

  if (rawGoals.length !== uciMoves.length) {
    throw new Error(`Expected ${uciMoves.length} goals from Ollama, got ${rawGoals.length}`);
  }

  const normalizedGoals = normalizeGoalsFromMoves(uciMoves, rawGoals);
  const validation = validateNormalizedGoals(uciMoves, normalizedGoals);
  if (!validation.ok) {
    try {
      const retryGoals = await requestGoalsFromOllama(
        input,
        uciMoves,
        `Fix the goals JSON only. ${validation.message}. Return exactly ${uciMoves.length} valid goals.`,
      );
      const retryNormalized = normalizeGoalsFromMoves(uciMoves, retryGoals);
      const retryValidation = validateNormalizedGoals(uciMoves, retryNormalized);
      if (!retryValidation.ok) {
        throw new Error(retryValidation.message);
      }
      return retryValidation.goals;
    } catch (error) {
      const message = error instanceof Error ? error.message : validation.message;
      throw new Error(message);
    }
  }

  return validation.goals;
}
