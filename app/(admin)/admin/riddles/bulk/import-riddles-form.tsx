"use client";

import { bulkCreateRiddlesAction } from "@/app/(admin)/admin/riddles/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState } from "react";

const EXAMPLE_JSON = `[
  {
    "title": "Find the best move",
    "game_type": "legend_games",
    "pgn": "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O",
    "display_ply": 14,
    "initial_ply": 14,
    "move_count_for_answer": 2,
    "themes": ["tactics"],
    "is_active": true,
    "goals": [
      {
        "ply": 1,
        "move": "e4",
        "title": "Control the center",
        "description": "Open with e4.",
        "isCompleted": false
      }
    ]
  }
]`;

export function ImportRiddlesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={async (formData: FormData) => {
        setIsSubmitting(true);
        const jsonData = (formData.get("jsonData") as string) ?? "";
        await bulkCreateRiddlesAction(jsonData);
        setIsSubmitting(false);
      }}
      className="space-y-4"
    >
      <p className="text-muted-foreground text-sm">
        Required per item: <span className="font-mono">title</span>,{" "}
        <span className="font-mono">game_type</span>, <span className="font-mono">pgn</span>, and
        either <span className="font-mono">moves</span> or{" "}
        <span className="font-mono">move_count_for_answer</span> (with{" "}
        <span className="font-mono">display_ply</span>). Optional:{" "}
        <span className="font-mono">game_id</span>, <span className="font-mono">initial_ply</span>{" "}
        (defaults to <span className="font-mono">display_ply</span>),{" "}
        <span className="font-mono">answer_end_ply</span>, <span className="font-mono">themes</span>,{" "}
        <span className="font-mono">is_active</span>, <span className="font-mono">goals</span>. Paste
        a single object or an array.
      </p>
      <FieldGroup>
        <Field>
          <FieldLabel>JSON data</FieldLabel>
          <textarea
            name="jsonData"
            required
            rows={18}
            placeholder={EXAMPLE_JSON}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing…" : "Create riddles"}
      </Button>
    </form>
  );
}
