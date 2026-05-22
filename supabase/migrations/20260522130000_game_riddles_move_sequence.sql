-- Link game_riddles to move_sequences (run backfill before NOT NULL + drop if you have existing rows).

alter table public.game_riddles
  add column if not exists move_sequence_id uuid references public.move_sequences (id);

-- Backfill: one move_sequence per riddle (skip if already linked)
do $$
declare
  r record;
  new_id uuid;
  default_fen constant text := 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
begin
  for r in
    select id, moves, display_fen
    from public.game_riddles
    where move_sequence_id is null
  loop
    insert into public.move_sequences (initial_fen, moves, display_fen)
    values (
      coalesce(nullif(trim(r.display_fen), ''), default_fen),
      coalesce(nullif(trim(r.moves), ''), 'e2e4'),
      r.display_fen
    )
    returning id into new_id;

    update public.game_riddles
    set move_sequence_id = new_id
    where id = r.id;
  end loop;
end;
$$;

alter table public.game_riddles
  alter column move_sequence_id set not null;

alter table public.game_riddles
  drop column if exists moves,
  drop column if exists display_fen;

create or replace function public.delete_move_sequence_for_game_riddle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.move_sequence_id is not null then
    delete from public.move_sequences where id = old.move_sequence_id;
  end if;
  return old;
end;
$$;

drop trigger if exists game_riddles_delete_move_sequence on public.game_riddles;

create trigger game_riddles_delete_move_sequence
  after delete on public.game_riddles
  for each row
  execute function public.delete_move_sequence_for_game_riddle();
