begin;

-- Rename primary + join tables.
alter table public.collections rename to studies;
alter table public.collection_riddles rename to study_riddles;
alter table public.collection_themes rename to study_themes;

-- Rename FK columns on join tables.
alter table public.study_riddles rename column collection_id to study_id;
alter table public.study_themes rename column collection_id to study_id;

-- studies constraints / indexes / trigger
alter table public.studies rename constraint collections_pkey to studies_pkey;
alter table public.studies rename constraint collections_slug_key to studies_slug_key;
alter table public.studies rename constraint collections_created_by_fkey to studies_created_by_fkey;
alter table public.studies rename constraint collections_difficulty_check to studies_difficulty_check;

alter index if exists public.collections_is_active_idx rename to studies_is_active_idx;
alter index if exists public.collections_sort_order_idx rename to studies_sort_order_idx;

alter trigger set_collections_updated_at on public.studies rename to set_studies_updated_at;

-- study_riddles constraints / indexes (names may vary; rename when present)
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'collection_riddles_pkey' and conrelid = 'public.study_riddles'::regclass
  ) then
    alter table public.study_riddles rename constraint collection_riddles_pkey to study_riddles_pkey;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'collection_riddles_collection_id_fkey' and conrelid = 'public.study_riddles'::regclass
  ) then
    alter table public.study_riddles rename constraint collection_riddles_collection_id_fkey to study_riddles_study_id_fkey;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'collection_riddles_riddle_id_fkey' and conrelid = 'public.study_riddles'::regclass
  ) then
    alter table public.study_riddles rename constraint collection_riddles_riddle_id_fkey to study_riddles_riddle_id_fkey;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'collection_riddles_collection_id_riddle_id_key' and conrelid = 'public.study_riddles'::regclass
  ) then
    alter table public.study_riddles rename constraint collection_riddles_collection_id_riddle_id_key to study_riddles_study_id_riddle_id_key;
  end if;
end $$;

alter index if exists public.collection_riddles_collection_id_idx rename to study_riddles_study_id_idx;
alter index if exists public.collection_riddles_riddle_id_idx rename to study_riddles_riddle_id_idx;

-- study_themes constraints / indexes
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'collection_themes_pkey' and conrelid = 'public.study_themes'::regclass
  ) then
    alter table public.study_themes rename constraint collection_themes_pkey to study_themes_pkey;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'collection_themes_collection_id_fkey' and conrelid = 'public.study_themes'::regclass
  ) then
    alter table public.study_themes rename constraint collection_themes_collection_id_fkey to study_themes_study_id_fkey;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'collection_themes_theme_id_fkey' and conrelid = 'public.study_themes'::regclass
  ) then
    alter table public.study_themes rename constraint collection_themes_theme_id_fkey to study_themes_theme_id_fkey;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'collection_themes_collection_id_theme_id_key' and conrelid = 'public.study_themes'::regclass
  ) then
    alter table public.study_themes rename constraint collection_themes_collection_id_theme_id_key to study_themes_study_id_theme_id_key;
  end if;
end $$;

alter index if exists public.collection_themes_collection_id_idx rename to study_themes_study_id_idx;
alter index if exists public.collection_themes_theme_id_idx rename to study_themes_theme_id_idx;

-- Cover image default + existing default filenames
alter table public.studies
  alter column cover_image_url set default 'study-default-cover-image.png';

update public.studies
set cover_image_url = 'study-default-cover-image.png'
where cover_image_url in (
  'collection-default-cover-image',
  'collection-default-cover-image.png',
  'collection-default-image',
  'collection-default-image.png'
);

-- RLS policies: rename when present (adjust names against live pg_policies if needed).
-- Expected patterns: collections_*, collection_riddles_*, collection_themes_*.
do $$
declare
  r record;
  new_name text;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('studies', 'study_riddles', 'study_themes')
      and (
        policyname like 'collections%'
        or policyname like 'collection_riddles%'
        or policyname like 'collection_themes%'
        or policyname like '%collection%'
      )
  loop
    new_name := replace(
      replace(
        replace(r.policyname, 'collections', 'studies'),
        'collection_riddles',
        'study_riddles'
      ),
      'collection_themes',
      'study_themes'
    );
    new_name := replace(new_name, 'collection', 'study');
    if new_name <> r.policyname then
      execute format(
        'alter policy %I on %I.%I rename to %I',
        r.policyname,
        r.schemaname,
        r.tablename,
        new_name
      );
    end if;
  end loop;
end $$;

commit;
