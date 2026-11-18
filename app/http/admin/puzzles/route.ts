import { createHash, timingSafeEqual } from "node:crypto";

import {
  type CreatePuzzleFromPlyErrorCode,
  createPuzzleFromPly,
  parseCreatePuzzleFromPlyBody,
} from "@/features/puzzle/services/create-puzzle-from-ply.service";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const STATUS_BY_ERROR_CODE: Record<CreatePuzzleFromPlyErrorCode, number> = {
  missing_pgn: 400,
  missing_fen: 400,
  invalid_pgn: 400,
  invalid_ply: 400,
  missing_title: 400,
  invalid_goals: 400,
  study_link_failed: 422,
  create_failed: 500,
  themes_sync_failed: 500,
};

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function isAuthorized(req: Request): boolean {
  const expected = process.env.PUZZLE_IMPORT_API_KEY;
  if (!expected) return false;

  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  return timingSafeEqual(sha256(match[1]!.trim()), sha256(expected));
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = parseCreatePuzzleFromPlyBody(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const result = await createPuzzleFromPly(createAdminClient(), parsed.input);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: STATUS_BY_ERROR_CODE[result.code] ?? 500 });
  }

  return Response.json({ puzzleId: result.puzzleId }, { status: 201 });
}
