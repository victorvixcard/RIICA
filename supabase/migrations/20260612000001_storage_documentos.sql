-- ============================================================
-- Storage: bucket público "documentos"
-- PDFs de comunicados, fatos relevantes, releases, atas etc.
-- disponibilizados para download no portal público.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit)
values ('documentos', 'documentos', true, 20971520) -- 20 MB
on conflict (id) do update
  set public = true,
      file_size_limit = 20971520;

-- Leitura pública: qualquer visitante pode baixar (bucket é público).
drop policy if exists "documentos_leitura_publica" on storage.objects;
create policy "documentos_leitura_publica" on storage.objects
  for select to public
  using (bucket_id = 'documentos');

-- Escrita (upload/alteração/remoção) restrita a super_admin autenticado.
drop policy if exists "documentos_insert_admin" on storage.objects;
create policy "documentos_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documentos' and public.meu_papel() = 'super_admin');

drop policy if exists "documentos_update_admin" on storage.objects;
create policy "documentos_update_admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'documentos' and public.meu_papel() = 'super_admin');

drop policy if exists "documentos_delete_admin" on storage.objects;
create policy "documentos_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documentos' and public.meu_papel() = 'super_admin');
