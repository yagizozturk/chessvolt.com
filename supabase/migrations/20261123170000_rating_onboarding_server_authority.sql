-- =============================================================================
-- Rating, onboarding and practice attempts are written by the server only.
--
-- Before: a signed-in user could update profiles.current_rating and
-- onboarding_completed through PostgREST, and insert or update their own
-- user_sequence_attempts and attempt events. The rating rules lived in
-- TypeScript, so anyone writing the rows directly skipped them.
--
-- After:
--   * profiles: the user may update username, chesscom_username and
--     lichess_username only. Column privileges protect every other column,
--     role included (it was guarded only by the UPDATE policy's WITH CHECK).
--   * user_sequence_attempts and user_sequence_attempt_events are read-only
--     for clients.
--   * Writes go through the SECURITY DEFINER functions below, which only
--     service_role may execute. The API calls them with the user id of the
--     verified session.
--   * save_sequence_attempt changes the rating in the same transaction that
--     records the attempt: -5 on the first recorded mistake or a failure, +5
--     on a clean completion; at most once per attempt and once per puzzle per
--     user. Finished attempts (completed / failed / abandoned) are final.
--   * complete_onboarding sets the initial rating once; it refuses to run
--     again, so the rating is never reset.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Which attempt changed the rating
-- -----------------------------------------------------------------------------
alter table public.user_sequence_attempts add column if not exists rating_delta smallint;

comment on column public.user_sequence_attempts.rating_delta is
  'Rating change this attempt applied to the profile; null when it applied none.';

-- Backstop for "once per puzzle per user"; save_sequence_attempt also runs one save per user at a time.
create unique index if not exists user_sequence_attempts_one_rating_per_sequence_uidx
  on public.user_sequence_attempts (user_id, sequence_id)
  where rating_delta is not null;

-- -----------------------------------------------------------------------------
-- Client privileges
-- -----------------------------------------------------------------------------
revoke insert, update, delete, truncate on table public.profiles from anon, authenticated;
grant update (username, chesscom_username, lichess_username) on table public.profiles to authenticated;
-- The auth.users trigger creates the profile; the app's fallback (ensureProfileExists) inserts only these two
-- columns, so every other column starts at its default (role 'user', no rating, onboarding not completed).
grant insert (id, username) on table public.profiles to authenticated;

revoke insert, update, delete, truncate on table public.user_sequence_attempts from anon, authenticated;
revoke insert, update, delete, truncate on table public.user_sequence_attempt_events from anon, authenticated;

-- -----------------------------------------------------------------------------
-- start_sequence_attempt: a new attempt on a sequence the user can see
-- (shared content, or a game-mistake sequence of their own)
-- -----------------------------------------------------------------------------
create or replace function public.start_sequence_attempt(p_user_id uuid, p_sequence_id uuid)
returns public.user_sequence_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.user_sequence_attempts;
begin
  if p_user_id is null or p_sequence_id is null then
    raise exception 'invalid_arguments';
  end if;

  if not exists (
    select 1
    from public.move_sequences ms
    where ms.id = p_sequence_id
      and (ms.user_id is null or ms.user_id = p_user_id)
  ) then
    raise exception 'sequence_not_found';
  end if;

  insert into public.user_sequence_attempts (user_id, sequence_id, status)
  values (p_user_id, p_sequence_id, 'started')
  returning * into v_attempt;

  return v_attempt;
end;
$$;

-- -----------------------------------------------------------------------------
-- save_sequence_attempt: progress ('started') or finish, plus the rating
-- -----------------------------------------------------------------------------
create or replace function public.save_sequence_attempt(
  p_user_id uuid,
  p_attempt_id uuid,
  p_sequence_id uuid,
  p_status public.puzzle_attempt_status,
  p_duration_ms integer default null,
  p_correct_move_count integer default null,
  p_wrong_move_count integer default null,
  p_hint_count integer default null,
  p_max_correct_streak integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_max_count constant integer := 10000;
  c_max_duration_ms constant integer := 86400000; -- one day
  c_solve_points constant smallint := 5;
  c_fail_points constant smallint := -5;
  v_attempt public.user_sequence_attempts;
  v_delta smallint;
  v_rating integer;
begin
  if p_user_id is null or p_attempt_id is null or p_sequence_id is null or p_status is null then
    raise exception 'invalid_arguments';
  end if;

  -- least / greatest skip nulls, so missing counters pass.
  if least(p_duration_ms, p_correct_move_count, p_wrong_move_count, p_hint_count, p_max_correct_streak) < 0
     or greatest(p_correct_move_count, p_wrong_move_count, p_hint_count, p_max_correct_streak) > c_max_count
     or p_duration_ms > c_max_duration_ms then
    raise exception 'invalid_attempt_counters';
  end if;

  -- One save per user at a time: two concurrent saves cannot both see a puzzle as not rated yet.
  perform 1 from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'profile_not_found';
  end if;

  select * into v_attempt
  from public.user_sequence_attempts
  where id = p_attempt_id and user_id = p_user_id
  for update;

  if not found then
    raise exception 'attempt_not_found';
  end if;

  if v_attempt.sequence_id <> p_sequence_id then
    raise exception 'attempt_sequence_mismatch';
  end if;

  if v_attempt.status <> 'started' then
    raise exception 'attempt_already_finished';
  end if;

  -- Counters are totals so far and only grow; a later save cannot erase a recorded mistake.
  update public.user_sequence_attempts
  set
    status = p_status,
    completed_at = case when p_status = 'started' then completed_at else now() end,
    duration_ms = greatest(duration_ms, p_duration_ms),
    correct_move_count = greatest(correct_move_count, coalesce(p_correct_move_count, 0)),
    wrong_move_count = greatest(wrong_move_count, coalesce(p_wrong_move_count, 0)),
    hint_count = greatest(hint_count, coalesce(p_hint_count, 0)),
    max_correct_streak = greatest(max_correct_streak, coalesce(p_max_correct_streak, 0))
  where id = p_attempt_id
  returning * into v_attempt;

  -- Only puzzles carry rating, and each puzzle counts once per user. Attempts saved before this migration count
  -- as rated when they were completed or had a mistake (the old rule).
  if v_attempt.rating_delta is null
     and exists (select 1 from public.puzzles p where p.move_sequence_id = v_attempt.sequence_id)
     and not exists (
       select 1
       from public.user_sequence_attempts other
       where other.user_id = p_user_id
         and other.sequence_id = v_attempt.sequence_id
         and other.id <> v_attempt.id
         and (other.rating_delta is not null or other.status = 'completed' or other.wrong_move_count > 0)
     ) then
    v_delta := case
      when v_attempt.wrong_move_count > 0 or v_attempt.status = 'failed' then c_fail_points
      when v_attempt.status = 'completed' then c_solve_points
    end;
  end if;

  if v_delta is not null then
    update public.profiles
    set current_rating = greatest(0, coalesce(current_rating, initial_rating, 0) + v_delta)
    where id = p_user_id
    returning current_rating into v_rating;

    update public.user_sequence_attempts
    set rating_delta = v_delta
    where id = v_attempt.id
    returning * into v_attempt;
  else
    select current_rating into v_rating from public.profiles where id = p_user_id;
  end if;

  return jsonb_build_object('attempt', to_jsonb(v_attempt), 'rating_delta', v_delta, 'current_rating', v_rating);
end;
$$;

-- -----------------------------------------------------------------------------
-- record_sequence_attempt_event: analytics row for one of the user's attempts
-- -----------------------------------------------------------------------------
create or replace function public.record_sequence_attempt_event(
  p_user_id uuid,
  p_attempt_id uuid,
  p_event_type public.sequence_attempt_event_type,
  p_move_uci text default null,
  p_expected_uci text default null,
  p_is_correct boolean default null,
  p_hint_level integer default null,
  p_time_from_start_ms integer default null
)
returns public.user_sequence_attempt_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.user_sequence_attempt_events;
begin
  if p_user_id is null or p_attempt_id is null or p_event_type is null then
    raise exception 'invalid_arguments';
  end if;

  if length(p_move_uci) > 5
     or length(p_expected_uci) > 5
     or p_hint_level not between 1 and 2 -- hint_level_check allows 1 and 2
     or p_time_from_start_ms not between 0 and 86400000 then
    raise exception 'invalid_attempt_event';
  end if;

  if not exists (
    select 1 from public.user_sequence_attempts where id = p_attempt_id and user_id = p_user_id
  ) then
    raise exception 'attempt_not_found';
  end if;

  insert into public.user_sequence_attempt_events
    (attempt_id, event_type, move_uci, expected_uci, is_correct, hint_level, time_from_start_ms)
  values
    (p_attempt_id, p_event_type, p_move_uci, p_expected_uci, p_is_correct, p_hint_level, p_time_from_start_ms)
  returning * into v_event;

  return v_event;
end;
$$;

-- -----------------------------------------------------------------------------
-- complete_onboarding: the initial rating, once
-- -----------------------------------------------------------------------------
create or replace function public.complete_onboarding(
  p_user_id uuid,
  p_initial_rating integer,
  p_chesscom_username text default null,
  p_lichess_username text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.profiles;
begin
  if p_user_id is null or p_initial_rating is null then
    raise exception 'invalid_arguments';
  end if;

  select * into v_profile from public.profiles where id = p_user_id for update;

  if not found then
    raise exception 'profile_not_found';
  end if;

  if v_profile.onboarding_completed then
    raise exception 'onboarding_already_completed';
  end if;

  update public.profiles
  set
    initial_rating = p_initial_rating,
    current_rating = p_initial_rating,
    onboarding_completed = true,
    chesscom_username = nullif(btrim(p_chesscom_username), ''),
    lichess_username = nullif(btrim(p_lichess_username), '')
  where id = p_user_id
  returning * into v_profile;

  return v_profile;
end;
$$;

-- -----------------------------------------------------------------------------
-- Only the server (service_role) may call the functions above
-- -----------------------------------------------------------------------------
revoke all on function public.start_sequence_attempt(uuid, uuid) from public, anon, authenticated;
revoke all on function public.save_sequence_attempt(
  uuid, uuid, uuid, public.puzzle_attempt_status, integer, integer, integer, integer, integer
) from public, anon, authenticated;
revoke all on function public.record_sequence_attempt_event(
  uuid, uuid, public.sequence_attempt_event_type, text, text, boolean, integer, integer
) from public, anon, authenticated;
revoke all on function public.complete_onboarding(uuid, integer, text, text) from public, anon, authenticated;

grant execute on function public.start_sequence_attempt(uuid, uuid) to service_role;
grant execute on function public.save_sequence_attempt(
  uuid, uuid, uuid, public.puzzle_attempt_status, integer, integer, integer, integer, integer
) to service_role;
grant execute on function public.record_sequence_attempt_event(
  uuid, uuid, public.sequence_attempt_event_type, text, text, boolean, integer, integer
) to service_role;
grant execute on function public.complete_onboarding(uuid, integer, text, text) to service_role;
