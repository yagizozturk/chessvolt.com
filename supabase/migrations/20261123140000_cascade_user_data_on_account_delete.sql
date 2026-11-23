-- =============================================================================
-- Account deletion (DELETE /http/account → supabase.auth.admin.deleteUser) must
-- remove every row that belongs to the user.
--
-- Most user tables were created in the Supabase dashboard, so their foreign keys
-- are not in this repo. On 2026-11-23 deleteUser failed for a test user until its
-- profiles row was removed by hand: profiles.id → auth.users does not cascade.
--
-- Instead of guessing constraint names, this looks the foreign keys up at run time:
--   * every listed FK that does not cascade is recreated as ON DELETE CASCADE
--     (same name, column, referenced table, ON UPDATE rule and deferrability);
--   * a listed column without any FK gets one, NOT VALID so existing rows stay.
-- Running it again changes nothing.
--
-- Left as they are on purpose:
--   * blog_posts.author_id → auth.users ON DELETE RESTRICT: an author who still has
--     posts cannot be deleted until the posts are reassigned or removed.
--   * contact_messages.user_id ON DELETE SET NULL: messages are kept anonymously.
--   * move_sequences created for game mistakes have no user column and stay behind.
-- =============================================================================
do $$
declare
  target record;
  fk record;
  table_oid oid;
  column_num smallint;
begin
  for target in
    select *
    from (
      values
        -- table, column, referenced table to use when the column has no FK yet
        ('profiles', 'id', 'auth.users'),
        ('user_favorites', 'user_id', 'auth.users'),
        ('user_favorites', 'game_analysis_mistake_id', 'public.game_analysis_mistakes'),
        ('game_analyses', 'user_id', 'auth.users'),
        ('game_analysis_mistakes', 'user_id', 'auth.users'),
        ('game_analysis_mistakes', 'game_analysis_id', 'public.game_analyses'),
        ('user_sequence_attempts', 'user_id', 'auth.users'),
        ('user_sequence_attempt_events', 'attempt_id', 'public.user_sequence_attempts')
    ) as t (table_name, column_name, default_reference)
  loop
    table_oid := to_regclass(format('public.%I', target.table_name));
    if table_oid is null then
      raise notice 'skipped public.%: table does not exist', target.table_name;
      continue;
    end if;

    column_num := null;
    select attnum into column_num
    from pg_attribute
    where attrelid = table_oid and attname = target.column_name and not attisdropped;

    if column_num is null then
      raise notice 'skipped public.%.%: column does not exist', target.table_name, target.column_name;
      continue;
    end if;

    -- Recreate the single-column foreign keys on this column that do not cascade yet.
    for fk in
      select
        c.conname,
        c.confrelid::regclass as referenced_table,
        ref.attname as referenced_column,
        case c.confupdtype
          when 'r' then 'restrict'
          when 'c' then 'cascade'
          when 'n' then 'set null'
          when 'd' then 'set default'
          else 'no action'
        end as on_update,
        case
          when c.condeferred then ' deferrable initially deferred'
          when c.condeferrable then ' deferrable'
          else ''
        end as deferrable_clause
      from pg_constraint c
      join pg_attribute ref on ref.attrelid = c.confrelid and ref.attnum = c.confkey[1]
      where c.contype = 'f'
        and c.conrelid = table_oid
        and c.conkey = array[column_num]
        and c.confdeltype <> 'c'
    loop
      execute format('alter table public.%I drop constraint %I', target.table_name, fk.conname);
      execute format(
        'alter table public.%I add constraint %I foreign key (%I) references %s (%I) on update %s on delete cascade%s',
        target.table_name,
        fk.conname,
        target.column_name,
        fk.referenced_table,
        fk.referenced_column,
        fk.on_update,
        fk.deferrable_clause
      );
      raise notice 'public.%.% -> %: now ON DELETE CASCADE (%)',
        target.table_name, target.column_name, fk.referenced_table, fk.conname;
    end loop;

    -- No foreign key at all: rows would outlive their owner, so add one.
    if not exists (
      select 1
      from pg_constraint c
      where c.contype = 'f' and c.conrelid = table_oid and c.conkey = array[column_num]
    ) then
      execute format(
        'alter table public.%I add constraint %I foreign key (%I) references %s (id) on delete cascade not valid',
        target.table_name,
        target.table_name || '_' || target.column_name || '_fkey',
        target.column_name,
        target.default_reference
      );
      raise notice 'public.%.%: added ON DELETE CASCADE foreign key to %',
        target.table_name, target.column_name, target.default_reference;
    end if;
  end loop;
end
$$;
