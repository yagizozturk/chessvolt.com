DO $$ BEGIN
  CREATE TYPE public.difficulty AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'master',
    'grandmaster'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.riddles
  ADD COLUMN IF NOT EXISTS difficulty public.difficulty NOT NULL DEFAULT 'beginner';
