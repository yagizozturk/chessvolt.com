-- RLS for games
-- SELECT: public (game-riddle page, journey)
-- INSERT, UPDATE, DELETE: admin only

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'games') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON games', r.policyname);
  END LOOP;
END $$;

-- Anyone can read games (for game-riddle, journey pages)
CREATE POLICY "Public can select games"
  ON games FOR SELECT
  USING (true);

-- Admins can insert games
CREATE POLICY "Admins can insert games"
  ON games FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update games
CREATE POLICY "Admins can update games"
  ON games FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete games
CREATE POLICY "Admins can delete games"
  ON games FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
