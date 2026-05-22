-- Run only after every opening_variants row has move_sequence_id set (backfill complete).

ALTER TABLE public.opening_variants
  DROP COLUMN IF EXISTS moves,
  DROP COLUMN IF EXISTS initial_fen,
  DROP COLUMN IF EXISTS display_fen,
  DROP COLUMN IF EXISTS pgn,
  DROP COLUMN IF EXISTS goals;
