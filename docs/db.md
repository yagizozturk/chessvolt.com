db enumlar tanımlandı
db trigger tanımlandı: set_updated_at
lichess için ayrı index yazıldı: create unique index riddles_lichess_source_unique_idx
on public.riddles(source, source_id)
where source = 'lichess'
and source_id is not null;
