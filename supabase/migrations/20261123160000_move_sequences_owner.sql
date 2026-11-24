-- =============================================================================
-- move_sequences.user_id: who a sequence belongs to.
--
-- Game analysis turns each of the player's mistakes into a move sequence to
-- practise. Those rows belong to the player: user_id is set, and deleting the
-- account deletes them. Shared content (puzzles, opening variants, anything an
-- admin creates) keeps user_id null.
--
-- The API writes mistake sequences with the service role, so it takes user_id
-- from the verified session, never from the request.
--
-- Backfill, only for rows no puzzle or opening variant uses:
--   1. the user of the game_analysis_mistakes rows that point at the sequence;
--   2. for sequences no mistake points at any more, the user whose saved game
--      analysis has a critical moment with the same position and best move.
-- A row is filled only when exactly one user matches. The rest stay null.
--
-- Reading: everyone could read every row (move_sequences_select_public). Shared
-- rows stay readable by everyone; a user's own rows only by that user.
-- =============================================================================

alter table public.move_sequences
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

comment on column public.move_sequences.user_id is
  'Owner of a sequence made from the user''s own data (game mistakes); null for shared content.';

create index if not exists move_sequences_user_id_idx
  on public.move_sequences (user_id)
  where user_id is not null;

-- -----------------------------------------------------------------------------
-- 1. From the mistakes that use the sequence
-- -----------------------------------------------------------------------------
with owners as (
  select gam.move_sequence_id as id, min(gam.user_id::text)::uuid as user_id
  from public.game_analysis_mistakes gam
  where gam.move_sequence_id is not null
  group by gam.move_sequence_id
  having count(distinct gam.user_id) = 1
)
update public.move_sequences ms
set user_id = owners.user_id
from owners
where ms.id = owners.id
  and ms.user_id is null
  and exists (select 1 from auth.users u where u.id = owners.user_id)
  and not exists (select 1 from public.puzzles p where p.move_sequence_id = ms.id)
  and not exists (select 1 from public.opening_variants ov where ov.move_sequence_id = ms.id);

-- -----------------------------------------------------------------------------
-- 2. From saved analyses, for sequences whose mistake rows are gone
-- -----------------------------------------------------------------------------
with orphans as (
  select ms.id, ms.initial_fen, ms.moves
  from public.move_sequences ms
  where ms.user_id is null
    and not exists (select 1 from public.puzzles p where p.move_sequence_id = ms.id)
    and not exists (select 1 from public.opening_variants ov where ov.move_sequence_id = ms.id)
    and not exists (select 1 from public.game_analysis_mistakes gam where gam.move_sequence_id = ms.id)
),
moments as (
  select ga.user_id, m ->> 'fen' as fen, m ->> 'bestUci' as best_uci
  from public.game_analyses ga
  cross join lateral jsonb_array_elements(
    case when jsonb_typeof(ga.data -> 'criticalMoments') = 'array' then ga.data -> 'criticalMoments' else '[]'::jsonb end
  ) as m
),
owners as (
  select o.id, min(mo.user_id::text)::uuid as user_id
  from orphans o
  join moments mo on mo.fen = o.initial_fen and mo.best_uci = o.moves
  group by o.id
  having count(distinct mo.user_id) = 1
)
update public.move_sequences ms
set user_id = owners.user_id
from owners
where ms.id = owners.id
  and exists (select 1 from auth.users u where u.id = owners.user_id);

-- -----------------------------------------------------------------------------
-- Reading: shared rows for everyone, a user's own rows for that user only
-- -----------------------------------------------------------------------------
drop policy if exists move_sequences_select_public on public.move_sequences;
drop policy if exists move_sequences_select_shared_or_own on public.move_sequences;

create policy move_sequences_select_shared_or_own
on public.move_sequences
for select
to anon, authenticated
using (user_id is null or user_id = (select auth.uid()));
