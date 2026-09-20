create table public.game_review_questions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  game_analysis_id uuid
    references public.game_analyses(id)
    on delete cascade,

  move_sequence_id uuid not null
    references public.move_sequences(id)
    on delete restrict,

  game_id text not null,
  source text not null,
  title text not null,
  ply integer not null,
  quality text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint game_review_questions_quality_check
    check (quality in ('mistake', 'blunder'))
);

create index game_review_questions_user_id_idx
  on public.game_review_questions (user_id);

create index game_review_questions_game_analysis_id_idx
  on public.game_review_questions (game_analysis_id);

create index game_review_questions_created_at_idx
  on public.game_review_questions (user_id, created_at desc);

create or replace function public.update_game_review_questions_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger game_review_questions_updated_at_trigger
before update on public.game_review_questions
for each row
execute function public.update_game_review_questions_updated_at();

alter table public.game_review_questions enable row level security;

create policy "Users can read their own game review questions"
on public.game_review_questions
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own game review questions"
on public.game_review_questions
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own game review questions"
on public.game_review_questions
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own game review questions"
on public.game_review_questions
for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.game_review_questions from anon;

grant select, insert, update, delete
on table public.game_review_questions
to authenticated;
