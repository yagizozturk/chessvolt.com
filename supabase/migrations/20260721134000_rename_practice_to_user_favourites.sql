begin;

alter table public.user_practice_opening_variants rename to user_favourites;

alter table public.user_favourites
  drop constraint if exists user_practice_opening_variants_unique;

alter table public.user_favourites
  drop constraint if exists user_practice_opening_variants_sort_order_check;

alter table public.user_favourites
  drop column if exists is_active,
  drop column if exists sort_order;

alter table public.user_favourites
  alter column opening_variant_id drop not null;

alter table public.user_favourites
  add column if not exists riddle_id uuid null references public.riddles (id) on delete cascade,
  add column if not exists is_pinned boolean not null default false,
  add column if not exists note text null;

alter table public.user_favourites
  drop constraint if exists user_favourites_target_xor_check;

alter table public.user_favourites
  add constraint user_favourites_target_xor_check check (
    (opening_variant_id is not null and riddle_id is null)
    or (opening_variant_id is null and riddle_id is not null)
  );

create unique index if not exists user_favourites_user_opening_variant_uidx
  on public.user_favourites (user_id, opening_variant_id)
  where opening_variant_id is not null;

create unique index if not exists user_favourites_user_riddle_uidx
  on public.user_favourites (user_id, riddle_id)
  where riddle_id is not null;

commit;
