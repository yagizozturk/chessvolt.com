-- Add role column to profiles table
-- Default: 'user'. Allowed: 'user' | 'admin'
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Optional: Create index for admin lookups if you'll query by role often
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- To set a user as admin (run in Supabase SQL Editor after replacing USER_ID):
-- UPDATE profiles SET role = 'admin' WHERE id = 'USER_ID';
