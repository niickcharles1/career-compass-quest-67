insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) on conflict (id) do nothing;

create policy "Users view own resumes"
on storage.objects for select
using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users upload own resumes"
on storage.objects for insert
with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users update own resumes"
on storage.objects for update
using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own resumes"
on storage.objects for delete
using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);