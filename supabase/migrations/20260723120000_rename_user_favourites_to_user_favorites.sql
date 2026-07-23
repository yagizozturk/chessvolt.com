begin;

alter table public.user_favourites rename to user_favorites;

alter table public.user_favorites
  drop constraint if exists user_favourites_target_xor_check;

alter table public.user_favorites
  add constraint user_favorites_target_xor_check check (
    (opening_variant_id is not null and riddle_id is null)
    or (opening_variant_id is null and riddle_id is not null)
  );

alter index if exists user_favourites_user_opening_variant_uidx
  rename to user_favorites_user_opening_variant_uidx;

alter index if exists user_favourites_user_riddle_uidx
  rename to user_favorites_user_riddle_uidx;

commit;
