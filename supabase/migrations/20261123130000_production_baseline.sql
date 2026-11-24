-- =============================================================================
-- Production baseline: the schema as it is in production on 2026-11-24
-- (Postgres 17.6).
--
-- Most tables were created in the Supabase dashboard, and some changes never
-- reached a migration file (game_review_questions became game_analysis_mistakes,
-- blog_posts.description and profiles.volt_score were added), so the older
-- files could not rebuild the database. This file replaces them:
--   20260910120000_game_review_questions.sql
--   20260913125007_add_game_review_question_to_user_favorites.sql
--   20260928164000_drop_game_review_question_move_sequence_id.sql
--   20261003150000_create_blog_posts.sql
--
-- It was generated from a read-only catalog export of production and recreates
-- everything in public (types, tables, functions, constraints, indexes,
-- triggers, RLS policies and privileges, exactly as granted), plus what the app
-- adds to Supabase-managed schemas: the auth.users trigger that creates the
-- profile, the storage buckets and the storage policies.
--
-- Production already has all of this. Do not run it there. With the Supabase
-- CLI, mark it as applied instead:
--   supabase migration repair --status applied 20261123130000
-- =============================================================================

set check_function_bodies = false;

-- -----------------------------------------------------------------------------
-- Types
-- -----------------------------------------------------------------------------
create type public.difficulty as enum ('beginner', 'intermediate', 'advanced', 'master', 'grandmaster');
create type public.journey_difficulty as enum ('beginner', 'intermediate', 'advanced', 'expert');
create type public.puzzle_attempt_status as enum ('started', 'completed', 'failed', 'abandoned');
create type public.riddle_type as enum ('game', 'lichess', 'custom');
create type public.sequence_attempt_event_type as enum ('start', 'move', 'hint', 'complete', 'fail', 'abandon');

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table public.blog_posts (
  id uuid default gen_random_uuid() not null,
  slug text not null,
  title text not null,
  content jsonb not null,
  cover_image_path text not null,
  status text default 'draft'::text not null,
  published_at timestamp with time zone,
  author_id uuid not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  description text not null
);

create table public.contact_messages (
  id uuid default gen_random_uuid() not null,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  user_id uuid,
  created_at timestamp with time zone default now() not null
);

create table public.game_analyses (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  game_id text not null,
  source text not null,
  data jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.game_analysis_mistakes (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  game_analysis_id uuid,
  game_id text not null,
  source text not null,
  title text not null,
  ply integer not null,
  quality text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  move_sequence_id uuid
);

create table public.games (
  id uuid default gen_random_uuid() not null,
  white_player text not null,
  black_player text not null,
  pgn text not null,
  result text not null,
  played_at timestamp with time zone not null,
  url text,
  created_at timestamp with time zone default now() not null,
  event text,
  opening text,
  description text
);

create table public.move_sequences (
  id uuid default gen_random_uuid() not null,
  initial_fen text not null,
  moves text not null,
  goals jsonb,
  pgn text,
  display_fen text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.opening_variant_themes (
  id uuid default gen_random_uuid() not null,
  opening_variant_id uuid not null,
  theme_id uuid not null,
  weight integer default 1 not null,
  created_at timestamp with time zone default now() not null
);

create table public.opening_variants (
  id uuid default gen_random_uuid() not null,
  opening_id uuid not null,
  title text,
  created_at timestamp with time zone default now() not null,
  initial_ply integer default 0 not null,
  description text,
  sort_key integer not null,
  eco text,
  move_sequence_id uuid not null
);

create table public.openings (
  id uuid default gen_random_uuid() not null,
  name text not null,
  description text,
  created_at timestamp with time zone default now() not null,
  display_fen text,
  slug text,
  type text,
  cover_image_url text,
  cover_image_color text
);

create table public.profiles (
  id uuid not null,
  username text,
  created_at timestamp without time zone default now(),
  role text default 'user'::text not null,
  onboarding_completed boolean default false not null,
  initial_rating integer,
  current_rating integer,
  chesscom_username text,
  lichess_username text,
  volt_score integer default 0 not null
);

create table public.puzzle_themes (
  id uuid default gen_random_uuid() not null,
  puzzle_id uuid not null,
  theme_id uuid not null,
  weight integer default 1 not null,
  created_at timestamp with time zone default now() not null
);

create table public.puzzles (
  id uuid default gen_random_uuid() not null,
  game_id uuid,
  title text not null,
  created_at timestamp with time zone default now() not null,
  move_sequence_id uuid not null,
  is_active boolean default true not null,
  rating smallint,
  source text,
  source_id text,
  popularity integer
);

create table public.sections (
  id uuid default gen_random_uuid() not null,
  title text not null,
  description text default ''::text not null,
  cover_image_url text default 'study-default-cover-image.png'::text not null,
  cover_image_color text default '#5B37C1'::text not null,
  sort_order integer default 0 not null,
  is_active boolean default true not null,
  created_by uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.studies (
  id uuid default gen_random_uuid() not null,
  title text not null,
  slug text not null,
  description text default ''::text,
  cover_image_url text default 'study-default-cover-image.png'::text not null,
  sort_order integer default 1 not null,
  is_active boolean default true not null,
  created_by uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  cover_image_color text default '#5B37C1'::text not null,
  difficulty smallint
);

create table public.study_puzzles (
  id uuid default gen_random_uuid() not null,
  puzzle_id uuid not null,
  study_id uuid not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null
);

create table public.study_themes (
  id uuid default gen_random_uuid() not null,
  study_id uuid not null,
  theme_id uuid not null,
  weight integer default 1 not null,
  created_at timestamp with time zone default now() not null
);

create table public.themes (
  id uuid default gen_random_uuid() not null,
  slug text not null,
  title text not null,
  description text,
  category text not null,
  sort_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  cover_image_url text
);

create table public.user_favorites (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  opening_variant_id uuid,
  created_at timestamp with time zone default now() not null,
  puzzle_id uuid,
  is_pinned boolean default false not null,
  note text,
  game_analysis_mistake_id uuid
);

create table public.user_sequence_attempt_events (
  id uuid default gen_random_uuid() not null,
  attempt_id uuid not null,
  event_type sequence_attempt_event_type not null,
  move_uci text,
  expected_uci text,
  is_correct boolean,
  hint_level integer,
  time_from_start_ms integer,
  created_at timestamp with time zone default now() not null
);

create table public.user_sequence_attempts (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  sequence_id uuid not null,
  status puzzle_attempt_status default 'started'::puzzle_attempt_status not null,
  started_at timestamp with time zone default now() not null,
  completed_at timestamp with time zone,
  duration_ms integer default 0,
  correct_move_count integer default 0 not null,
  wrong_move_count integer default 0 not null,
  hint_count integer default 0 not null,
  max_correct_streak integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.delete_move_sequence_for_opening_variant()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.move_sequence_id IS NOT NULL THEN
    DELETE FROM public.move_sequences WHERE id = OLD.move_sequence_id;
  END IF;
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_move_sequence_for_puzzle()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if old.move_sequence_id is not null then
    delete from public.move_sequences where id = old.move_sequence_id;
  end if;
  return old;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_game_analyses_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_game_analysis_mistakes_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.validate_onboarding_answer_option()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if not exists (
    select 1
    from public.onboarding_options o
    where o.id = new.option_id
      and o.question_id = new.question_id
  ) then
    raise exception 'Selected option does not belong to the selected onboarding question';
  end if;

  return new;
end;
$function$;

-- -----------------------------------------------------------------------------
-- Constraints
-- -----------------------------------------------------------------------------
alter table public.blog_posts add constraint blog_posts_pkey PRIMARY KEY (id);
alter table public.blog_posts add constraint blog_posts_slug_key UNIQUE (slug);
alter table public.blog_posts add constraint blog_posts_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])));
alter table public.contact_messages add constraint contact_messages_pkey PRIMARY KEY (id);
alter table public.contact_messages add constraint contact_messages_email_check CHECK ((char_length(TRIM(BOTH FROM email)) > 0));
alter table public.contact_messages add constraint contact_messages_message_check CHECK ((char_length(TRIM(BOTH FROM message)) > 0));
alter table public.contact_messages add constraint contact_messages_name_check CHECK ((char_length(TRIM(BOTH FROM name)) > 0));
alter table public.game_analyses add constraint game_analyses_pkey PRIMARY KEY (id);
alter table public.game_analyses add constraint game_analyses_user_game_unique UNIQUE (user_id, source, game_id);
alter table public.game_analyses add constraint game_analyses_data_is_object CHECK ((jsonb_typeof(data) = 'object'::text));
alter table public.game_analysis_mistakes add constraint game_analysis_mistakes_pkey PRIMARY KEY (id);
alter table public.game_analysis_mistakes add constraint game_analysis_mistakes_quality_check CHECK ((quality = ANY (ARRAY['mistake'::text, 'blunder'::text])));
alter table public.games add constraint games_pkey PRIMARY KEY (id);
alter table public.games add constraint games_result_check CHECK ((result = ANY (ARRAY['1-0'::text, '0-1'::text, '1/2-1/2'::text])));
alter table public.move_sequences add constraint move_sequences_pkey PRIMARY KEY (id);
alter table public.move_sequences add constraint move_sequences_fen_not_empty CHECK ((length(TRIM(BOTH FROM initial_fen)) > 0));
alter table public.move_sequences add constraint move_sequences_moves_not_empty CHECK ((length(TRIM(BOTH FROM moves)) > 0));
alter table public.opening_variant_themes add constraint opening_variant_themes_pkey PRIMARY KEY (id);
alter table public.opening_variant_themes add constraint opening_variant_themes_variant_theme_unique UNIQUE (opening_variant_id, theme_id);
alter table public.opening_variant_themes add constraint opening_variant_themes_weight_check CHECK (((weight >= 1) AND (weight <= 10)));
alter table public.opening_variants add constraint opening_variants_pkey PRIMARY KEY (id);
alter table public.openings add constraint openings_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_initial_rating_check CHECK (((initial_rating IS NULL) OR ((initial_rating >= 100) AND (initial_rating <= 3000))));
alter table public.profiles add constraint profiles_role_check CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text])));
alter table public.profiles add constraint profiles_volt_score_check CHECK ((volt_score >= 0));
alter table public.puzzle_themes add constraint puzzle_themes_pkey PRIMARY KEY (id);
alter table public.puzzle_themes add constraint riddle_themes_riddle_theme_unique UNIQUE (puzzle_id, theme_id);
alter table public.puzzle_themes add constraint riddle_themes_weight_check CHECK (((weight >= 1) AND (weight <= 10)));
alter table public.puzzles add constraint puzzles_pkey PRIMARY KEY (id);
alter table public.puzzles add constraint riddles_rating_check CHECK (((rating IS NULL) OR ((rating >= 100) AND (rating <= 3000))));
alter table public.sections add constraint sections_pkey PRIMARY KEY (id);
alter table public.sections add constraint sections_title_not_blank CHECK ((char_length(btrim(title)) > 0));
alter table public.studies add constraint studies_pkey PRIMARY KEY (id);
alter table public.studies add constraint studies_slug_key UNIQUE (slug);
alter table public.studies add constraint studies_difficulty_check CHECK (((difficulty >= 1) AND (difficulty <= 10)));
alter table public.study_puzzles add constraint study_puzzles_pkey PRIMARY KEY (id);
alter table public.study_puzzles add constraint collection_riddles_collection_riddle_unique UNIQUE (puzzle_id, study_id);
alter table public.study_themes add constraint study_themes_pkey PRIMARY KEY (id);
alter table public.study_themes add constraint collection_themes_collection_theme_unique UNIQUE (study_id, theme_id);
alter table public.study_themes add constraint collection_themes_weight_check CHECK (((weight >= 1) AND (weight <= 10)));
alter table public.themes add constraint themes_pkey PRIMARY KEY (id);
alter table public.themes add constraint themes_slug_key UNIQUE (slug);
alter table public.user_favorites add constraint user_practice_opening_variants_pkey PRIMARY KEY (id);
alter table public.user_favorites add constraint user_favorites_target_xor_check CHECK ((num_nonnulls(opening_variant_id, puzzle_id, game_analysis_mistake_id) = 1));
alter table public.user_sequence_attempt_events add constraint user_sequence_attempt_events_pkey PRIMARY KEY (id);
alter table public.user_sequence_attempt_events add constraint hint_level_check CHECK (((hint_level IS NULL) OR (hint_level = ANY (ARRAY[1, 2]))));
alter table public.user_sequence_attempt_events add constraint time_from_start_non_negative CHECK (((time_from_start_ms IS NULL) OR (time_from_start_ms >= 0)));
alter table public.user_sequence_attempts add constraint user_sequence_attempts_pkey PRIMARY KEY (id);
alter table public.user_sequence_attempts add constraint correct_move_count_non_negative CHECK ((correct_move_count >= 0));
alter table public.user_sequence_attempts add constraint duration_ms_non_negative CHECK (((duration_ms IS NULL) OR (duration_ms >= 0)));
alter table public.user_sequence_attempts add constraint hint_count_non_negative CHECK ((hint_count >= 0));
alter table public.user_sequence_attempts add constraint max_correct_streak_non_negative CHECK ((max_correct_streak >= 0));
alter table public.user_sequence_attempts add constraint wrong_move_count_non_negative CHECK ((wrong_move_count >= 0));

-- -----------------------------------------------------------------------------
-- Foreign keys
-- -----------------------------------------------------------------------------
alter table public.blog_posts add constraint blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE RESTRICT;
alter table public.contact_messages add constraint contact_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.game_analyses add constraint game_analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.game_analysis_mistakes add constraint fk_game_analysis_mistakes_move_sequence FOREIGN KEY (move_sequence_id) REFERENCES move_sequences(id) ON DELETE SET NULL;
alter table public.game_analysis_mistakes add constraint game_analysis_mistakes_game_analysis_id_fkey FOREIGN KEY (game_analysis_id) REFERENCES game_analyses(id) ON DELETE CASCADE;
alter table public.game_analysis_mistakes add constraint game_analysis_mistakes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.opening_variant_themes add constraint opening_variant_themes_opening_variant_id_fkey FOREIGN KEY (opening_variant_id) REFERENCES opening_variants(id) ON DELETE CASCADE;
alter table public.opening_variant_themes add constraint opening_variant_themes_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE;
alter table public.opening_variants add constraint opening_variants_move_sequence_id_fkey FOREIGN KEY (move_sequence_id) REFERENCES move_sequences(id);
alter table public.opening_variants add constraint opening_variants_opening_id_fkey FOREIGN KEY (opening_id) REFERENCES openings(id) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.profiles add constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);
alter table public.puzzle_themes add constraint puzzle_themes_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE;
alter table public.puzzle_themes add constraint puzzle_themes_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE;
alter table public.puzzles add constraint game_riddles_game_id_fkey FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE;
alter table public.puzzles add constraint game_riddles_move_sequence_id_fkey FOREIGN KEY (move_sequence_id) REFERENCES move_sequences(id);
alter table public.sections add constraint sections_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.studies add constraint studies_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.study_puzzles add constraint study_puzzles_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE;
alter table public.study_puzzles add constraint study_puzzles_study_id_fkey FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE;
alter table public.study_themes add constraint study_themes_study_id_fkey FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE;
alter table public.study_themes add constraint study_themes_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE;
alter table public.user_favorites add constraint user_favorites_game_analysis_mistake_id_fkey FOREIGN KEY (game_analysis_mistake_id) REFERENCES game_analysis_mistakes(id) ON DELETE CASCADE;
alter table public.user_favorites add constraint user_favourites_riddle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE;
alter table public.user_favorites add constraint user_practice_opening_variants_opening_variant_id_fkey FOREIGN KEY (opening_variant_id) REFERENCES opening_variants(id) ON DELETE CASCADE;
alter table public.user_favorites add constraint user_practice_opening_variants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.user_sequence_attempt_events add constraint user_sequence_attempt_events_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES user_sequence_attempts(id) ON DELETE CASCADE;
alter table public.user_sequence_attempts add constraint user_riddle_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX blog_posts_published_idx ON public.blog_posts USING btree (published_at DESC) WHERE (status = 'published'::text);
CREATE INDEX contact_messages_created_at_idx ON public.contact_messages USING btree (created_at DESC);
CREATE INDEX game_analyses_created_at_idx ON public.game_analyses USING btree (user_id, created_at DESC);
CREATE INDEX game_analyses_user_id_idx ON public.game_analyses USING btree (user_id);
CREATE INDEX game_analysis_mistakes_created_at_idx ON public.game_analysis_mistakes USING btree (user_id, created_at DESC);
CREATE INDEX game_analysis_mistakes_game_analysis_id_idx ON public.game_analysis_mistakes USING btree (game_analysis_id);
CREATE UNIQUE INDEX game_analysis_mistakes_user_game_ply_uidx ON public.game_analysis_mistakes USING btree (user_id, game_id, ply);
CREATE INDEX game_analysis_mistakes_user_id_idx ON public.game_analysis_mistakes USING btree (user_id);
CREATE INDEX games_opening_idx ON public.games USING btree (opening);
CREATE INDEX move_sequences_created_at_idx ON public.move_sequences USING btree (created_at);
CREATE INDEX opening_variant_themes_theme_idx ON public.opening_variant_themes USING btree (theme_id);
CREATE INDEX opening_variant_themes_variant_idx ON public.opening_variant_themes USING btree (opening_variant_id);
CREATE INDEX opening_variants_opening_idx ON public.opening_variants USING btree (opening_id);
CREATE INDEX idx_openings_name ON public.openings USING btree (name);
CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);
CREATE INDEX riddle_themes_riddle_idx ON public.puzzle_themes USING btree (puzzle_id);
CREATE INDEX riddle_themes_theme_idx ON public.puzzle_themes USING btree (theme_id);
CREATE INDEX puzzles_game_id_idx ON public.puzzles USING btree (game_id);
CREATE INDEX puzzles_is_active_idx ON public.puzzles USING btree (is_active) WHERE (is_active = true);
CREATE INDEX riddles_source_source_id_idx ON public.puzzles USING btree (source, source_id);
CREATE INDEX sections_is_active_idx ON public.sections USING btree (is_active);
CREATE INDEX sections_sort_order_idx ON public.sections USING btree (sort_order);
CREATE INDEX studies_is_active_idx ON public.studies USING btree (is_active);
CREATE INDEX studies_sort_order_idx ON public.studies USING btree (sort_order);
CREATE INDEX collection_riddles_collection_sort_order_idx ON public.study_puzzles USING btree (study_id, sort_order);
CREATE INDEX study_puzzles_puzzle_id_idx ON public.study_puzzles USING btree (puzzle_id);
CREATE INDEX study_puzzles_study_id_idx ON public.study_puzzles USING btree (study_id);
CREATE INDEX collection_themes_collection_idx ON public.study_themes USING btree (study_id);
CREATE INDEX collection_themes_theme_idx ON public.study_themes USING btree (theme_id);
CREATE INDEX themes_category_idx ON public.themes USING btree (category);
CREATE INDEX themes_is_active_idx ON public.themes USING btree (is_active) WHERE (is_active = true);
CREATE UNIQUE INDEX user_favorites_user_game_analysis_mistake_uidx ON public.user_favorites USING btree (user_id, game_analysis_mistake_id) WHERE (game_analysis_mistake_id IS NOT NULL);
CREATE UNIQUE INDEX user_favourites_user_opening_variant_uidx ON public.user_favorites USING btree (user_id, opening_variant_id) WHERE (opening_variant_id IS NOT NULL);
CREATE UNIQUE INDEX user_favourites_user_riddle_uidx ON public.user_favorites USING btree (user_id, puzzle_id) WHERE (puzzle_id IS NOT NULL);
CREATE INDEX user_sequence_attempt_events_attempt_id_idx ON public.user_sequence_attempt_events USING btree (attempt_id);
CREATE INDEX user_sequence_attempt_events_created_at_idx ON public.user_sequence_attempt_events USING btree (created_at);
CREATE INDEX user_sequence_attempt_events_event_type_idx ON public.user_sequence_attempt_events USING btree (event_type);
CREATE INDEX user_sequence_attempts_riddle_id_idx ON public.user_sequence_attempts USING btree (sequence_id);
CREATE INDEX user_sequence_attempts_started_at_idx ON public.user_sequence_attempts USING btree (started_at);
CREATE INDEX user_sequence_attempts_status_idx ON public.user_sequence_attempts USING btree (status);
CREATE INDEX user_sequence_attempts_user_id_idx ON public.user_sequence_attempts USING btree (user_id);
CREATE INDEX user_sequence_attempts_user_sequence_idx ON public.user_sequence_attempts USING btree (user_id, sequence_id);

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION set_blog_posts_updated_at();
CREATE TRIGGER game_analyses_updated_at_trigger BEFORE UPDATE ON public.game_analyses FOR EACH ROW EXECUTE FUNCTION update_game_analyses_updated_at();
CREATE TRIGGER game_analysis_mistakes_updated_at_trigger BEFORE UPDATE ON public.game_analysis_mistakes FOR EACH ROW EXECUTE FUNCTION update_game_analysis_mistakes_updated_at();
CREATE TRIGGER set_move_sequences_updated_at BEFORE UPDATE ON public.move_sequences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER opening_variants_delete_move_sequence AFTER DELETE ON public.opening_variants FOR EACH ROW EXECUTE FUNCTION delete_move_sequence_for_opening_variant();
CREATE TRIGGER puzzles_delete_move_sequence AFTER DELETE ON public.puzzles FOR EACH ROW EXECUTE FUNCTION delete_move_sequence_for_puzzle();
CREATE TRIGGER set_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_studies_updated_at BEFORE UPDATE ON public.studies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_themes_updated_at BEFORE UPDATE ON public.themes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_user_sequence_attempts_updated_at BEFORE UPDATE ON public.user_sequence_attempts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
drop trigger if exists on_auth_user_created on auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- -----------------------------------------------------------------------------
-- Row level security
-- -----------------------------------------------------------------------------
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.game_analyses enable row level security;
alter table public.game_analysis_mistakes enable row level security;
alter table public.games enable row level security;
alter table public.move_sequences enable row level security;
alter table public.opening_variant_themes enable row level security;
alter table public.opening_variants enable row level security;
alter table public.openings enable row level security;
alter table public.profiles enable row level security;
alter table public.puzzle_themes enable row level security;
alter table public.puzzles enable row level security;
alter table public.sections enable row level security;
alter table public.studies enable row level security;
alter table public.study_puzzles enable row level security;
alter table public.study_themes enable row level security;
alter table public.themes enable row level security;
alter table public.user_favorites enable row level security;
alter table public.user_sequence_attempt_events enable row level security;
alter table public.user_sequence_attempts enable row level security;

create policy "Admins can delete blog posts"
on public.blog_posts
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))));

create policy "Admins can insert blog posts"
on public.blog_posts
as permissive
for insert
to authenticated
with check (((author_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text))))));

create policy "Admins can read all blog posts"
on public.blog_posts
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))));

create policy "Admins can update blog posts"
on public.blog_posts
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))));

create policy "Anyone can read published blog posts"
on public.blog_posts
as permissive
for select
to anon, authenticated
using ((status = 'published'::text));

create policy "Admins can read contact messages"
on public.contact_messages
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Anyone can submit contact messages"
on public.contact_messages
as permissive
for insert
to anon, authenticated
with check (((user_id IS NULL) OR (user_id = auth.uid())));

create policy "Users can create their own game analyses"
on public.game_analyses
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can delete their own game analyses"
on public.game_analyses
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can read their own game analyses"
on public.game_analyses
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can update their own game analyses"
on public.game_analyses
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can create their own game analysis mistakes"
on public.game_analysis_mistakes
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can delete their own game analysis mistakes"
on public.game_analysis_mistakes
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can read their own game analysis mistakes"
on public.game_analysis_mistakes
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can update their own game analysis mistakes"
on public.game_analysis_mistakes
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));

create policy "Admins can delete games"
on public.games
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can insert games"
on public.games
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can update games"
on public.games
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Public can select games"
on public.games
as permissive
for select
to public
using (true);

create policy move_sequences_insert_admin
on public.move_sequences
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))));

create policy move_sequences_select_public
on public.move_sequences
as permissive
for select
to anon, authenticated
using (true);

create policy move_sequences_update_admin
on public.move_sequences
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text)))));

create policy "Allow delete for admins only"
on public.opening_variants
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Allow insert for admins only"
on public.opening_variants
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Allow update for admins only"
on public.opening_variants
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy variants_public_read
on public.opening_variants
as permissive
for select
to public
using (true);

create policy "Allow delete for admins only"
on public.openings
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Allow insert for admins only"
on public.openings
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Allow update for admins only"
on public.openings
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Openings are viewable by everyone"
on public.openings
as permissive
for select
to public
using (true);

create policy "Admins can update any profile"
on public.profiles
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles profiles_1
  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'admin'::text)))));

create policy "Users can insert own profile"
on public.profiles
as permissive
for insert
to public
with check ((auth.uid() = id));

create policy "Users can update own profile except role"
on public.profiles
as permissive
for update
to public
using ((auth.uid() = id))
with check (((auth.uid() = id) AND (role = 'user'::text)));

create policy "Users can view own profile"
on public.profiles
as permissive
for select
to public
using ((auth.uid() = id));

create policy "Admins can manage puzzle themes"
on public.puzzle_themes
as permissive
for all
to public
using (is_admin())
with check (is_admin());

create policy "Anyone can read puzzle themes"
on public.puzzle_themes
as permissive
for select
to public
using (true);

create policy "Admins can delete puzzles"
on public.puzzles
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can insert puzzles"
on public.puzzles
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can update puzzles"
on public.puzzles
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Public can select puzzles"
on public.puzzles
as permissive
for select
to public
using (true);

create policy "Admins can delete sections"
on public.sections
as permissive
for delete
to authenticated
using (( SELECT is_admin() AS is_admin));

create policy "Admins can insert sections"
on public.sections
as permissive
for insert
to authenticated
with check (( SELECT is_admin() AS is_admin));

create policy "Admins can read all sections"
on public.sections
as permissive
for select
to authenticated
using (( SELECT is_admin() AS is_admin));

create policy "Admins can update sections"
on public.sections
as permissive
for update
to authenticated
using (( SELECT is_admin() AS is_admin))
with check (( SELECT is_admin() AS is_admin));

create policy "Anyone can read active sections"
on public.sections
as permissive
for select
to anon, authenticated
using ((is_active = true));

create policy "Admins can delete studies"
on public.studies
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can insert studies"
on public.studies
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can read all studies"
on public.studies
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can update studies"
on public.studies
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Anyone can read active studies"
on public.studies
as permissive
for select
to anon, authenticated
using ((is_active = true));

create policy "Admins can delete study puzzles"
on public.study_puzzles
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

create policy "Admins can insert study puzzles"
on public.study_puzzles
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

create policy "Admins can read all study puzzles"
on public.study_puzzles
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

create policy "Admins can update study puzzles"
on public.study_puzzles
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

create policy "Public can read active study puzzles"
on public.study_puzzles
as permissive
for select
to public
using (((EXISTS ( SELECT 1
   FROM puzzles r
  WHERE ((r.id = study_puzzles.puzzle_id) AND (r.is_active = true)))) AND (EXISTS ( SELECT 1
   FROM studies c
  WHERE ((c.id = study_puzzles.study_id) AND (c.is_active = true))))));

create policy "Admins can manage study themes"
on public.study_themes
as permissive
for all
to public
using (is_admin())
with check (is_admin());

create policy "Anyone can read study themes"
on public.study_themes
as permissive
for select
to public
using (true);

create policy "Admins can delete themes"
on public.themes
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can insert themes"
on public.themes
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can read all themes"
on public.themes
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Admins can update themes"
on public.themes
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Public can read active themes"
on public.themes
as permissive
for select
to anon, authenticated
using ((is_active = true));

create policy "Admins can manage all practice opening variants"
on public.user_favorites
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

create policy "Users can delete own practice opening variants"
on public.user_favorites
as permissive
for delete
to public
using ((auth.uid() = user_id));

create policy "Users can insert own practice opening variants"
on public.user_favorites
as permissive
for insert
to public
with check ((auth.uid() = user_id));

create policy "Users can update own practice opening variants"
on public.user_favorites
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

create policy "Users can view own practice opening variants"
on public.user_favorites
as permissive
for select
to public
using ((auth.uid() = user_id));

create policy "Admins can select all riddle attempt events"
on public.user_sequence_attempt_events
as permissive
for select
to public
using (is_admin());

create policy "Users can insert own riddle attempt events"
on public.user_sequence_attempt_events
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM user_sequence_attempts a
  WHERE ((a.id = user_sequence_attempt_events.attempt_id) AND (a.user_id = auth.uid())))));

create policy "Users can select own riddle attempt events"
on public.user_sequence_attempt_events
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_sequence_attempts a
  WHERE ((a.id = user_sequence_attempt_events.attempt_id) AND (a.user_id = auth.uid())))));

create policy "Admins can select all riddle attempts"
on public.user_sequence_attempts
as permissive
for select
to public
using (is_admin());

create policy "Users can insert own riddle attempts"
on public.user_sequence_attempts
as permissive
for insert
to public
with check ((user_id = auth.uid()));

create policy "Users can select own riddle attempts"
on public.user_sequence_attempts
as permissive
for select
to public
using ((user_id = auth.uid()));

create policy "Users can update own riddle attempts"
on public.user_sequence_attempts
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- Privileges (anon, authenticated, service_role and PUBLIC, exactly as in production)
-- -----------------------------------------------------------------------------

revoke all on table public.blog_posts from anon, authenticated, service_role, public;
grant all on table public.blog_posts to anon;
grant all on table public.blog_posts to authenticated;
grant all on table public.blog_posts to service_role;

revoke all on table public.contact_messages from anon, authenticated, service_role, public;
grant all on table public.contact_messages to anon;
grant all on table public.contact_messages to authenticated;
grant all on table public.contact_messages to service_role;

revoke all on table public.game_analyses from anon, authenticated, service_role, public;
grant all on table public.game_analyses to authenticated;
grant all on table public.game_analyses to service_role;

revoke all on table public.game_analysis_mistakes from anon, authenticated, service_role, public;
grant all on table public.game_analysis_mistakes to authenticated;
grant all on table public.game_analysis_mistakes to service_role;

revoke all on table public.games from anon, authenticated, service_role, public;
grant all on table public.games to anon;
grant all on table public.games to authenticated;
grant all on table public.games to service_role;

revoke all on table public.move_sequences from anon, authenticated, service_role, public;
grant all on table public.move_sequences to anon;
grant all on table public.move_sequences to authenticated;
grant all on table public.move_sequences to service_role;

revoke all on table public.opening_variant_themes from anon, authenticated, service_role, public;
grant all on table public.opening_variant_themes to anon;
grant all on table public.opening_variant_themes to authenticated;
grant all on table public.opening_variant_themes to service_role;

revoke all on table public.opening_variants from anon, authenticated, service_role, public;
grant all on table public.opening_variants to anon;
grant all on table public.opening_variants to authenticated;
grant all on table public.opening_variants to service_role;

revoke all on table public.openings from anon, authenticated, service_role, public;
grant all on table public.openings to anon;
grant all on table public.openings to authenticated;
grant all on table public.openings to service_role;

revoke all on table public.profiles from anon, authenticated, service_role, public;
grant all on table public.profiles to anon;
grant all on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

revoke all on table public.puzzle_themes from anon, authenticated, service_role, public;
grant all on table public.puzzle_themes to anon;
grant all on table public.puzzle_themes to authenticated;
grant all on table public.puzzle_themes to service_role;

revoke all on table public.puzzles from anon, authenticated, service_role, public;
grant all on table public.puzzles to anon;
grant all on table public.puzzles to authenticated;
grant all on table public.puzzles to service_role;

revoke all on table public.sections from anon, authenticated, service_role, public;
grant all on table public.sections to service_role;
grant select on table public.sections to anon;
grant insert, select, update, delete on table public.sections to authenticated;

revoke all on table public.studies from anon, authenticated, service_role, public;
grant all on table public.studies to anon;
grant all on table public.studies to authenticated;
grant all on table public.studies to service_role;

revoke all on table public.study_puzzles from anon, authenticated, service_role, public;
grant all on table public.study_puzzles to anon;
grant all on table public.study_puzzles to authenticated;
grant all on table public.study_puzzles to service_role;

revoke all on table public.study_themes from anon, authenticated, service_role, public;
grant all on table public.study_themes to anon;
grant all on table public.study_themes to authenticated;
grant all on table public.study_themes to service_role;

revoke all on table public.themes from anon, authenticated, service_role, public;
grant all on table public.themes to anon;
grant all on table public.themes to authenticated;
grant all on table public.themes to service_role;

revoke all on table public.user_favorites from anon, authenticated, service_role, public;
grant all on table public.user_favorites to anon;
grant all on table public.user_favorites to authenticated;
grant all on table public.user_favorites to service_role;

revoke all on table public.user_sequence_attempt_events from anon, authenticated, service_role, public;
grant all on table public.user_sequence_attempt_events to anon;
grant all on table public.user_sequence_attempt_events to authenticated;
grant all on table public.user_sequence_attempt_events to service_role;

revoke all on table public.user_sequence_attempts from anon, authenticated, service_role, public;
grant all on table public.user_sequence_attempts to anon;
grant all on table public.user_sequence_attempts to authenticated;
grant all on table public.user_sequence_attempts to service_role;
revoke all on function public.delete_move_sequence_for_opening_variant() from anon, authenticated, service_role, public;
grant all on function public.delete_move_sequence_for_opening_variant() to public;
grant all on function public.delete_move_sequence_for_opening_variant() to anon;
grant all on function public.delete_move_sequence_for_opening_variant() to authenticated;
grant all on function public.delete_move_sequence_for_opening_variant() to service_role;
revoke all on function public.delete_move_sequence_for_puzzle() from anon, authenticated, service_role, public;
grant all on function public.delete_move_sequence_for_puzzle() to public;
grant all on function public.delete_move_sequence_for_puzzle() to anon;
grant all on function public.delete_move_sequence_for_puzzle() to authenticated;
grant all on function public.delete_move_sequence_for_puzzle() to service_role;
revoke all on function public.handle_new_user() from anon, authenticated, service_role, public;
grant all on function public.handle_new_user() to public;
grant all on function public.handle_new_user() to anon;
grant all on function public.handle_new_user() to authenticated;
grant all on function public.handle_new_user() to service_role;
revoke all on function public.is_admin() from anon, authenticated, service_role, public;
grant all on function public.is_admin() to public;
grant all on function public.is_admin() to anon;
grant all on function public.is_admin() to authenticated;
grant all on function public.is_admin() to service_role;
revoke all on function public.set_blog_posts_updated_at() from anon, authenticated, service_role, public;
grant all on function public.set_blog_posts_updated_at() to public;
grant all on function public.set_blog_posts_updated_at() to anon;
grant all on function public.set_blog_posts_updated_at() to authenticated;
grant all on function public.set_blog_posts_updated_at() to service_role;
revoke all on function public.set_updated_at() from anon, authenticated, service_role, public;
grant all on function public.set_updated_at() to public;
grant all on function public.set_updated_at() to anon;
grant all on function public.set_updated_at() to authenticated;
grant all on function public.set_updated_at() to service_role;
revoke all on function public.update_game_analyses_updated_at() from anon, authenticated, service_role, public;
grant all on function public.update_game_analyses_updated_at() to public;
grant all on function public.update_game_analyses_updated_at() to anon;
grant all on function public.update_game_analyses_updated_at() to authenticated;
grant all on function public.update_game_analyses_updated_at() to service_role;
revoke all on function public.update_game_analysis_mistakes_updated_at() from anon, authenticated, service_role, public;
grant all on function public.update_game_analysis_mistakes_updated_at() to public;
grant all on function public.update_game_analysis_mistakes_updated_at() to anon;
grant all on function public.update_game_analysis_mistakes_updated_at() to authenticated;
grant all on function public.update_game_analysis_mistakes_updated_at() to service_role;
revoke all on function public.validate_onboarding_answer_option() from anon, authenticated, service_role, public;
grant all on function public.validate_onboarding_answer_option() to public;
grant all on function public.validate_onboarding_answer_option() to anon;
grant all on function public.validate_onboarding_answer_option() to authenticated;
grant all on function public.validate_onboarding_answer_option() to service_role;

-- -----------------------------------------------------------------------------
-- Storage
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-covers', 'blog-covers', true, null, null)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tts-cache', 'tts-cache', true, null, null)
on conflict (id) do nothing;

create policy "Admins can delete blog covers"
on storage.objects
as permissive
for delete
to authenticated
using (((bucket_id = 'blog-covers'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text))))));

create policy "Admins can update blog covers"
on storage.objects
as permissive
for update
to authenticated
using (((bucket_id = 'blog-covers'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text))))));

create policy "Admins can upload blog covers"
on storage.objects
as permissive
for insert
to authenticated
with check (((bucket_id = 'blog-covers'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::text))))));

create policy "Anyone can read blog covers"
on storage.objects
as permissive
for select
to anon, authenticated
using ((bucket_id = 'blog-covers'::text));

reset check_function_bodies;
