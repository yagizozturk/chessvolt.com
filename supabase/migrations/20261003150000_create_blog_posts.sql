create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  content jsonb not null,
  cover_image_path text not null,
  status text not null default 'draft',
  published_at timestamptz,
  author_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_key unique (slug),
  constraint blog_posts_status_check check (status in ('draft', 'published'))
);

create index blog_posts_published_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

create policy "Anyone can read published blog posts"
on public.blog_posts
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all blog posts"
on public.blog_posts
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

create policy "Admins can insert blog posts"
on public.blog_posts
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

create policy "Admins can update blog posts"
on public.blog_posts
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

create policy "Admins can delete blog posts"
on public.blog_posts
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

grant select on table public.blog_posts to anon, authenticated;
grant insert, update, delete on table public.blog_posts to authenticated;

insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true);

create policy "Anyone can read blog covers"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blog-covers');

create policy "Admins can upload blog covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-covers'
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

create policy "Admins can update blog covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog-covers'
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

create policy "Admins can delete blog covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog-covers'
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);
