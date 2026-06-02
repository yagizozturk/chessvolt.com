-- Onboarding completion timestamp on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

COMMENT ON COLUMN public.profiles.onboarding_completed_at IS
  'When the user finished the signup onboarding flow.';

-- Allow authenticated users to update their own profile (onboarding completion, rating, etc.)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read their own profile (middleware / client hooks)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- user_onboarding_answers: upsert during onboarding
ALTER TABLE public.user_onboarding_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_onboarding_answers_select_own" ON public.user_onboarding_answers;
CREATE POLICY "user_onboarding_answers_select_own"
  ON public.user_onboarding_answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_onboarding_answers_insert_own" ON public.user_onboarding_answers;
CREATE POLICY "user_onboarding_answers_insert_own"
  ON public.user_onboarding_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_onboarding_answers_update_own" ON public.user_onboarding_answers;
CREATE POLICY "user_onboarding_answers_update_own"
  ON public.user_onboarding_answers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
