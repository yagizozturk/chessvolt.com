alter table public.profiles
  add column if not exists current_rating integer;

update public.profiles
set current_rating = initial_rating
where current_rating is null
  and initial_rating is not null;
