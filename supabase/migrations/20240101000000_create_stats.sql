create table if not exists stats (
  id text primary key default 'global',
  total_visits bigint default 4456620,
  total_reports bigint default 1441446,
  monthly_visits bigint default 323216
);

-- Seed initial row
insert into stats (id) values ('global')
on conflict (id) do nothing;

-- RLS: public read, no write
alter table stats enable row level security;

create policy "public read" on stats
  for select using (true);
