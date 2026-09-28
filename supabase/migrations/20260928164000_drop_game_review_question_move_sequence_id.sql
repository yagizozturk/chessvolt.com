alter table public.game_review_questions
  drop constraint if exists game_review_questions_move_sequence_id_fkey;

alter table public.game_review_questions
  drop column if exists move_sequence_id;

create unique index if not exists game_review_questions_user_game_ply_uidx
  on public.game_review_questions (user_id, game_id, ply);
