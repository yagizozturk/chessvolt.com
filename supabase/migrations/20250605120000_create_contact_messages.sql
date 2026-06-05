-- Contact messages submitted from the public contact form.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  email text not null check (char_length(trim(email)) > 0),
  subject text,
  message text not null check (char_length(trim(message)) > 0),
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Anonymous and signed-in users can submit messages.
create policy "Anyone can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid ());

-- Only admins can read submitted messages.
create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid ()
        and profiles.role = 'admin'
    )
  );
