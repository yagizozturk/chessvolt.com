-- RLS for game_riddles
-- SELECT: public (journey preview, game-riddle pages)
-- INSERT, UPDATE, DELETE: admin only

ALTER TABLE game_riddles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'game_riddles') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON game_riddles', r.policyname);
  END LOOP;
END $$;

-- Anyone can read game_riddles (for journey preview, game-riddle play)
CREATE POLICY "Public can select game_riddles"
  ON game_riddles FOR SELECT
  USING (true);

-- Admins can insert game_riddles
CREATE POLICY "Admins can insert game_riddles"
  ON game_riddles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update game_riddles
CREATE POLICY "Admins can update game_riddles"
  ON game_riddles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete game_riddles
CREATE POLICY "Admins can delete game_riddles"
  ON game_riddles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
