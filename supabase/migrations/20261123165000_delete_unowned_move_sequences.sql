-- =============================================================================
-- Delete the move sequences nothing uses.
--
-- After the owner backfill (20261123160000) some rows still have no owner and
-- no puzzle, opening variant or game mistake uses them: leftovers of deleted
-- mistakes, analyses and content. Nothing can show them. On 2026-11-24 there
-- were 307, all but one a single best move, and no attempt pointed at any.
--
-- Kept: rows an attempt still points at, and rows created in the last hour (a
-- sequence written just before the puzzle or mistake that will use it).
-- =============================================================================
do $$
declare
  deleted integer;
begin
  delete from public.move_sequences ms
  where ms.user_id is null
    and ms.created_at < now() - interval '1 hour'
    and not exists (select 1 from public.puzzles p where p.move_sequence_id = ms.id)
    and not exists (select 1 from public.opening_variants ov where ov.move_sequence_id = ms.id)
    and not exists (select 1 from public.game_analysis_mistakes gam where gam.move_sequence_id = ms.id)
    and not exists (select 1 from public.user_sequence_attempts usa where usa.sequence_id = ms.id);

  get diagnostics deleted = row_count;
  raise notice 'deleted % move sequences that nothing used', deleted;
end
$$;
