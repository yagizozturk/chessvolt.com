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

function defaultDisplayPly(riddle: Riddle, game: Game | null): number {
  if (game?.pgn && riddle.moveSequence.displayFen?.trim()) {
    const p = getPlyFromPgnAtFen(game.pgn, riddle.moveSequence.displayFen.trim());
    if (p !== null) return p;
  }
  return 0;
}

export function RiddleEditForm({ riddle, game, onCancel }: Props) {
  const pgn = game?.pgn ?? "";
  const initialDisplayPly = defaultDisplayPly(riddle, game);
  const initialMoveCount = getMoveCountFromMoves(riddle.moveSequence.moves);

  const [displayPly, setDisplayPly] = useState(String(initialDisplayPly));
  const [answerEndPly, setAnswerEndPly] = useState(String(initialDisplayPly + initialMoveCount));

  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);

  const displayPlyNum = Math.min(Math.max(0, parseInt(displayPly, 10) || 0), maxPly);
  const answerEndPlyNum = Math.min(
    Math.max(displayPlyNum + 1, parseInt(answerEndPly, 10) || displayPlyNum + 1),
    maxPly,
  );
  const moveCountForAnswer = Math.max(1, answerEndPlyNum - displayPlyNum);

  const displayFen = fensByPly[displayPlyNum] ?? START_FEN;
  const answerEndFen = fensByPly[answerEndPlyNum] ?? START_FEN;

  const derivedMoves = useMemo(() => {
    if (!pgn.trim()) return riddle.moveSequence.moves ?? "";
    return (
      getUciMovesFromPgnAfterPlyAtMoveCount(pgn, displayPlyNum, moveCountForAnswer) ??
      riddle.moveSequence.moves ??
      ""
    );
  }, [pgn, displayPlyNum, moveCountForAnswer, riddle.moveSequence.moves]);

  const setDisplayPlyFromBoard = (ply: number) => {
    const prevCount = Math.max(1, answerEndPlyNum - displayPlyNum);
    setDisplayPly(String(ply));
    setAnswerEndPly(String(Math.min(ply + prevCount, maxPly)));
  };

  const setAnswerEndPlyFromBoard = (endPly: number) => {
    if (endPly <= displayPlyNum) {
      setDisplayPly(String(endPly));
      setAnswerEndPly(String(Math.min(endPly + 1, maxPly)));
    } else {
      setAnswerEndPly(String(endPly));
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
          <FieldLabel>Game ID</FieldLabel>
          <Input name="gameId" defaultValue={riddle.gameId} required />
        </Field>
        <Field>
          <FieldLabel>Display ply</FieldLabel>
          <Input
            name="ply"
            type="number"
            min={0}
            required
            value={String(displayPlyNum)}
            onChange={(e) => setDisplayPlyFromBoard(Math.min(Math.max(0, parseInt(e.target.value, 10) || 0), maxPly))}
          />
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            Half-move index for the puzzle start position (left board). Saved as display FEN.
          </p>
        </Field>
        <Field>
          <FieldLabel>Answer length (half-moves)</FieldLabel>
          <input type="hidden" name="moveCountForAnswer" value={String(moveCountForAnswer)} />
          <Input
            type="number"
            min={1}
            value={String(moveCountForAnswer)}
            onChange={(e) => {
              const count = Math.max(1, parseInt(e.target.value, 10) || 1);
              setAnswerEndPly(String(Math.min(displayPlyNum + count, maxPly)));
            }}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            UCI answer line runs from display ply through this many half-moves (right board end position).
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
          <Input
            name="gameType"
            required
            defaultValue={riddle.gameType ?? ""}
            placeholder="e.g. legend_games"
          />
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
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={riddle.isActive}
            className="size-4 rounded border"
          />
          <FieldLabel className="mb-0">Active (visible on challenge pages)</FieldLabel>
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={6}
            defaultValue={
              riddle.moveSequence.goals != null ? JSON.stringify(riddle.moveSequence.goals, null, 2) : ""
            }
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>

      {pgn.trim() ? (
        <>
          <div className="border-input bg-muted/30 rounded-md border p-3">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  displayFen (left board)
                </p>
                <p className="font-mono text-xs break-all">{displayFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{displayPlyNum}</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  answer end (right board)
                </p>
                <p className="font-mono text-xs break-all">{answerEndFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{answerEndPlyNum}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-10 xl:grid-cols-2">
            <AdminPgnBoardPicker
              sourceId="edit-riddle-display"
              title="Left — display"
              boardFen={displayFen}
              rows={rows}
              error={error}
              uciMoves={uciMoves}
              safePly={displayPlyNum}
              maxPly={maxPly}
              setSelectedPly={setDisplayPlyFromBoard}
            />
            <AdminPgnBoardPicker
              sourceId="edit-riddle-answer-end"
              title="Right — answer end"
              boardFen={answerEndFen}
              rows={rows}
              error={error}
              uciMoves={uciMoves}
              safePly={answerEndPlyNum}
              maxPly={maxPly}
              setSelectedPly={setAnswerEndPlyFromBoard}
            />
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Link a game with a PGN to use the board pickers. You can still edit ply and answer length manually above.
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
