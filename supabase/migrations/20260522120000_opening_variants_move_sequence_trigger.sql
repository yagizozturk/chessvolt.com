-- When an opening_variant row is deleted, delete its move_sequence (1:1).
-- FK stays RESTRICT so you cannot delete a sequence while a variant still references it.

CREATE OR REPLACE FUNCTION public.delete_move_sequence_for_opening_variant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.move_sequence_id IS NOT NULL THEN
    DELETE FROM public.move_sequences WHERE id = OLD.move_sequence_id;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS opening_variants_delete_move_sequence ON public.opening_variants;

CREATE TRIGGER opening_variants_delete_move_sequence
  AFTER DELETE ON public.opening_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_move_sequence_for_opening_variant();
