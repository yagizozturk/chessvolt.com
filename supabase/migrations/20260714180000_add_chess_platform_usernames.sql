alter table public.profiles
  add column if not exists chesscom_username text null,
  add column if not exists lichess_username text null;
