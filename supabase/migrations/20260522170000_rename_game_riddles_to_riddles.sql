-- Rename game_riddles → riddles (matches app type Riddle and features/riddle module).

ALTER TABLE public.game_riddles RENAME TO riddles;

ALTER INDEX IF EXISTS game_riddles_pkey RENAME TO riddles_pkey;
ALTER INDEX IF EXISTS game_riddles_game_id_idx RENAME TO riddles_game_id_idx;
ALTER INDEX IF EXISTS game_riddles_is_active_idx RENAME TO riddles_is_active_idx;

ALTER FUNCTION public.delete_move_sequence_for_game_riddle() RENAME TO delete_move_sequence_for_riddle;

ALTER TRIGGER game_riddles_delete_move_sequence ON public.riddles
  RENAME TO riddles_delete_move_sequence;
