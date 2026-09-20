alter table public.user_favorites
  add column game_review_question_id uuid null;

alter table public.user_favorites
  add constraint user_favorites_game_review_question_id_fkey
  foreign key (game_review_question_id)
  references public.game_review_questions (id)
  on delete cascade;

alter table public.user_favorites
  drop constraint if exists user_favorites_target_xor_check,
  drop constraint if exists user_favourites_target_xor_check,
  add constraint user_favorites_target_xor_check
  check (num_nonnulls(opening_variant_id, puzzle_id, game_review_question_id) = 1);

create unique index if not exists user_favorites_user_game_review_question_uidx
  on public.user_favorites using btree (user_id, game_review_question_id)
  where (game_review_question_id is not null);
