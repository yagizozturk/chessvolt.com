ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS difficulty public.difficulty NOT NULL DEFAULT 'beginner';
