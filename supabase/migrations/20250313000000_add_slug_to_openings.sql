-- Add slug column to openings table
ALTER TABLE public.openings
ADD COLUMN IF NOT EXISTS slug text null;

-- Populate slug from name for existing rows
UPDATE public.openings
SET slug = lower(regexp_replace(regexp_replace(trim(name), '\s+', '-', 'g'), '[^a-z0-9-]', '', 'g'))
WHERE slug IS NULL AND name IS NOT NULL;

-- Make slug unique and not null for new rows (optional - run after data is migrated)
-- ALTER TABLE public.openings ALTER COLUMN slug SET NOT NULL;
-- CREATE UNIQUE INDEX IF NOT EXISTS openings_slug_idx ON public.openings (slug);
