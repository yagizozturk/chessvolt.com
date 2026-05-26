"use client";

import { Save } from "lucide-react";
import { useMemo, useState } from "react";

import { updateRiddleAction } from "@/app/(admin)/admin/riddles/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AdminPgnBoardPicker } from "@/features/admin/components/admin-pgn-board-picker";
import { START_FEN, useUciRowsFromPgn } from "@/features/admin/hooks/use-uci-rows-from-pgn";
import type { Game } from "@/features/game/types/game";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";

type Props = {
  riddle: Riddle;
  game: Game | null;
  onCancel: () => void;
};

function getMoveCountFromMoves(moves: string | null): number {
  if (!moves?.trim()) return 1;
  return Math.max(1, moves.trim().split(/\s+/).filter(Boolean).length);
}

function defaultPlyFromFen(pgn: string, fen: string | null | undefined): number | null {
  if (!pgn.trim() || !fen?.trim()) return null;
  return getPlyFromPgnAtFen(pgn, fen.trim());
}

export function RiddleEditForm({ riddle, game, onCancel }: Props) {
  const pgn = game?.pgn?.trim() || riddle.moveSequence.pgn?.trim() || "";

  const initialPlyDefault =
    defaultPlyFromFen(pgn, riddle.moveSequence.initialFen) ??
    defaultPlyFromFen(pgn, riddle.moveSequence.displayFen) ??
    0;
  const displayPlyDefault = defaultPlyFromFen(pgn, riddle.moveSequence.displayFen) ?? initialPlyDefault;
  const initialMoveCount = getMoveCountFromMoves(riddle.moveSequence.moves);

  const [initialPly, setInitialPly] = useState(String(initialPlyDefault));
  const [displayPly, setDisplayPly] = useState(String(displayPlyDefault));
  const [answerLength, setAnswerLength] = useState(initialMoveCount);

  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);

  const initialPlyNum = Math.min(Math.max(0, parseInt(initialPly, 10) || 0), maxPly);
  const displayPlyNum = Math.min(Math.max(0, parseInt(displayPly, 10) || 0), maxPly);
  const answerEndPlyNum = Math.min(initialPlyNum + answerLength, maxPly);
  const moveCountForAnswer = Math.max(1, answerEndPlyNum - initialPlyNum);

  const initialFen = fensByPly[initialPlyNum] ?? START_FEN;
  const displayFen = fensByPly[displayPlyNum] ?? START_FEN;
  const answerEndFen = fensByPly[answerEndPlyNum] ?? START_FEN;

  const derivedMoves = useMemo(() => {
    if (!pgn.trim()) return riddle.moveSequence.moves ?? "";
    return (
      getUciMovesFromPgnAfterPlyAtMoveCount(pgn, initialPlyNum, moveCountForAnswer) ?? riddle.moveSequence.moves ?? ""
    );
  }, [pgn, initialPlyNum, moveCountForAnswer, riddle.moveSequence.moves]);

  const setInitialPlyFromBoard = (ply: number) => {
    setInitialPly(String(ply));
    if (ply + answerLength > maxPly) {
      setAnswerLength(Math.max(1, maxPly - ply));
    }
  };

  const setDisplayPlyFromBoard = (ply: number) => {
    setDisplayPly(String(ply));
  };

  const setAnswerEndPlyFromBoard = (endPly: number) => {
    if (endPly <= initialPlyNum) {
      setInitialPly(String(Math.max(0, endPly)));
      setAnswerLength(1);
      return;
    }
    setAnswerLength(endPly - initialPlyNum);
  };

  const setAnswerLengthFromInput = (count: number) => {
    const next = Math.max(1, count);
    setAnswerLength(next);
    if (initialPlyNum + next > maxPly) {
      setInitialPly(String(Math.max(0, maxPly - next)));
    }
  };

  return (
    <form
      action={async (formData) => {
        await updateRiddleAction(riddle.id, formData);
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Game ID (optional)</FieldLabel>
          <Input name="gameId" defaultValue={riddle.gameId ?? ""} placeholder="Leave empty if none" />
        </Field>
        <Field>
          <FieldLabel>Initial ply</FieldLabel>
          <Input
            name="initialPly"
            type="number"
            min={0}
            required
            value={String(initialPlyNum)}
            onChange={(e) => setInitialPlyFromBoard(Math.min(Math.max(0, parseInt(e.target.value, 10) || 0), maxPly))}
          />
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            Half-move index where the stored UCI line starts. Even for White orientation. Odd for Black orientation. (
            <span className="font-mono">initial_fen</span>).
          </p>
        </Field>
        <Field>
          <FieldLabel>Display ply</FieldLabel>
          <Input
            name="displayPly"
            type="number"
            min={0}
            required
            value={String(displayPlyNum)}
            onChange={(e) => setDisplayPlyFromBoard(Math.min(Math.max(0, parseInt(e.target.value, 10) || 0), maxPly))}
          />
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            Even for White orientation. Odd for Black orientation.
          </p>
        </Field>
        <Field>
          <FieldLabel>Answer length (half-moves)</FieldLabel>
          <input type="hidden" name="moveCountForAnswer" value={String(moveCountForAnswer)} />
          <Input
            type="number"
            min={1}
            max={maxPly > 0 ? maxPly : undefined}
            disabled={maxPly < 1}
            value={String(answerLength)}
            onChange={(e) => setAnswerLengthFromInput(parseInt(e.target.value, 10) || 1)}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            UCI line is sliced from initial ply through this many half-moves (answer-end board).
          </p>
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" defaultValue={riddle.title} required />
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <input type="hidden" name="moves" value={derivedMoves} />
          <Input readOnly value={derivedMoves} className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Game Type</FieldLabel>
          <Input name="gameType" required defaultValue={riddle.gameType ?? ""} placeholder="e.g. legend_games" />
        </Field>
        <Field>
          <FieldLabel>Themes</FieldLabel>
          <Input
            name="themes"
            defaultValue={riddle.themes.join(", ")}
            placeholder="Comma-separated, e.g. tactics, endgame"
          />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={riddle.isActive} className="size-4 rounded border" />
          <FieldLabel className="mb-0">Active (visible on challenge pages)</FieldLabel>
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={6}
            defaultValue={riddle.moveSequence.goals != null ? JSON.stringify(riddle.moveSequence.goals, null, 2) : ""}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>

      <input type="hidden" name="pgn" value={pgn} />
      <input type="hidden" name="initialFen" value={initialFen} />
      <input type="hidden" name="displayFen" value={displayFen} />

      {pgn.trim() ? (
        <>
          <div className="border-input bg-muted/30 rounded-md border p-3">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">initialFen</p>
                <p className="font-mono text-xs break-all">{initialFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{initialPlyNum}</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">displayFen</p>
                <p className="font-mono text-xs break-all">{displayFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{displayPlyNum}</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">answer end</p>
                <p className="font-mono text-xs break-all">{answerEndFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{answerEndPlyNum}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-10 xl:grid-cols-2">
            <AdminPgnBoardPicker
              sourceId="edit-riddle-initial"
              title="Left — initial (moves start)"
              boardFen={initialFen}
              rows={rows}
              error={error}
              uciMoves={uciMoves}
              safePly={initialPlyNum}
              maxPly={maxPly}
              setSelectedPly={setInitialPlyFromBoard}
            />
            <AdminPgnBoardPicker
              sourceId="edit-riddle-display"
              title="Right — display (puzzle position)"
              boardFen={displayFen}
              rows={rows}
              error={error}
              uciMoves={uciMoves}
              safePly={displayPlyNum}
              maxPly={maxPly}
              setSelectedPly={setDisplayPlyFromBoard}
            />
          </div>
          <AdminPgnBoardPicker
            sourceId="edit-riddle-answer-end"
            title="Answer end — solution line target"
            boardFen={answerEndFen}
            rows={rows}
            error={error}
            uciMoves={uciMoves}
            safePly={answerEndPlyNum}
            maxPly={maxPly}
            setSelectedPly={setAnswerEndPlyFromBoard}
          />
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Add a PGN on the linked move sequence or link a game with PGN to use the board pickers.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
