update public.onboarding_questions
set is_active = false
where slug in ('improvement_goal', 'starter_collection');
