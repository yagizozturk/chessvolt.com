"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateRiddleInput } from "@/features/riddle/repository/riddle.repository";
import { createRiddle } from "@/features/riddle/services/riddle.service";
import { parseGoalsFromForm } from "@/lib/admin/parse-goals-from-form";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { getAdminUser } from "@/lib/supabase/auth";

import {
  parseCollectionIdFromForm,
  parseDescriptionFromForm,
  parseRatingFromForm,
  parseIsActiveFromForm,
  parseThemesFromForm,
  linkRiddleToCollection,
  resolvePgnFromFormInput,
} from "./action-utils";

export async function createRiddleAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = ((formData.get("gameId") as string) || "").trim() || null;
  const pgnInput = ((formData.get("pgn") as string) || "").trim();
  const title = (formData.get("title") as string)?.trim();
  const description = parseDescriptionFromForm(formData);
  const rating = parseRatingFromForm(formData);
  const moves = ((formData.get("moves") as string) || "").trim() || null;
  const initialFen = ((formData.get("initialFen") as string) || "").trim() || null;
  const displayFen = ((formData.get("displayFen") as string) || "").trim() || null;
  const moveCountForAnswer = parseInt(formData.get("moveCountForAnswer") as string, 10);
  const goals = parseGoalsFromForm(formData, "/admin/riddles/new?error=invalid_goals_json");
  const themes = parseThemesFromForm(formData);
  const isActive = parseIsActiveFromForm(formData);
  const collectionId = parseCollectionIdFromForm(formData);

  if (!title) {
    redirect("/admin/riddles/new?error=missing_fields");
  }

  if (!collectionId) {
    redirect("/admin/riddles/new?error=missing_collection");
  }

  const pgn = await resolvePgnFromFormInput({ supabase, pgnInput, gameId });

  if (!pgn) {
    redirect("/admin/riddles/new?error=missing_pgn");
  }

  const initialPlyRaw = parseInt(formData.get("initialPly") as string, 10);
  const displayPlyRaw = parseInt(formData.get("displayPly") as string, 10);
  const initialPly =
    !isNaN(initialPlyRaw) && initialPlyRaw >= 0
      ? initialPlyRaw
      : initialFen != null
        ? (getPlyFromPgnAtFen(pgn, initialFen) ?? 0)
        : 0;
  const displayPly =
    !isNaN(displayPlyRaw) && displayPlyRaw >= 0
      ? displayPlyRaw
      : displayFen != null
        ? (getPlyFromPgnAtFen(pgn, displayFen) ?? initialPly)
        : initialPly;
  const resolvedInitialFen = initialFen ?? getFenFromPgnAtPly(pgn, initialPly) ?? undefined;
  const resolvedDisplayFen = displayFen ?? getFenFromPgnAtPly(pgn, displayPly) ?? null;

  let resolvedMoves = moves;
  if (!resolvedMoves && !isNaN(moveCountForAnswer) && moveCountForAnswer >= 1) {
    resolvedMoves = getUciMovesFromPgnAfterPlyAtMoveCount(pgn, initialPly, moveCountForAnswer) ?? null;
  }

  if (!resolvedMoves?.trim()) {
    redirect("/admin/riddles/new?error=invalid_pgn");
  }

  const input: CreateRiddleInput = {
    gameId,
    title,
    description,
    rating,
    pgn,
    moves: resolvedMoves,
    initialFen: resolvedInitialFen ?? null,
    displayFen: resolvedDisplayFen,
    goals,
    themes,
    isActive,
  };

  const riddle = await createRiddle(supabase, input);
  if (!riddle) {
    redirect("/admin/riddles/new?error=create_failed");
  }

  const linked = await linkRiddleToCollection(supabase, riddle.id, collectionId);
  if (!linked) {
    redirect("/admin/riddles/new?error=collection_link_failed");
  }

  revalidatePath("/admin/riddles");
  revalidatePath("/collection");
  redirect(`/admin/riddles/${riddle.id}`);
}
