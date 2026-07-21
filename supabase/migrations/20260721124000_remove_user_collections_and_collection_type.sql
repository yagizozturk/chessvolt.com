begin;

-- Remove user-created collections and dependent links first.
delete from collection_riddles
where collection_id in (
  select id from collections where collection_type = 'custom'
);

delete from collection_themes
where collection_id in (
  select id from collections where collection_type = 'custom'
);

delete from collections
where collection_type = 'custom';

-- Retire collection type for a single read-only collections model.
alter table collections
drop column if exists collection_type;

commit;
