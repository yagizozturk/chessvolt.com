-- Drop fen column from game_riddles (position derived from pgn + ply)
ALTER TABLE game_riddles DROP COLUMN IF EXISTS fen;
