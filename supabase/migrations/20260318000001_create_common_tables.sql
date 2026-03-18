-- Common tables shared across all game apps
-- See: docs/database-architecture.md

-- Enable UUID generation
create extension if not exists "uuid-ossp" with schema extensions;

-- ============================================================
-- rooms
-- ============================================================
create table public.rooms (
  id uuid primary key default extensions.uuid_generate_v4(),
  code varchar(6) not null unique,
  game_type varchar not null,
  status varchar not null default 'waiting'
    check (status in ('waiting', 'playing', 'finished')),
  host_player_id uuid, -- FK added after players table is created
  max_players int not null default 12,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- players
-- ============================================================
create table public.players (
  id uuid primary key default extensions.uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  nickname varchar not null,
  is_host boolean not null default false,
  is_connected boolean not null default true,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Now add the FK from rooms to players
alter table public.rooms
  add constraint rooms_host_player_id_fkey
  foreign key (host_player_id) references public.players(id)
  on delete set null;

-- ============================================================
-- game_sessions
-- ============================================================
create table public.game_sessions (
  id uuid primary key default extensions.uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  game_type varchar not null,
  round_number int not null default 1,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  result jsonb
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_rooms_code on public.rooms(code);
create index idx_players_room_id on public.players(room_id);
create index idx_players_user_id on public.players(user_id) where user_id is not null;
create index idx_game_sessions_room_id on public.game_sessions(room_id);

-- ============================================================
-- Updated_at trigger
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger rooms_updated_at
  before update on public.rooms
  for each row execute function public.update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.game_sessions enable row level security;

-- rooms: readable by anyone, writable by authenticated/anonymous users
create policy "rooms_select" on public.rooms for select using (true);
create policy "rooms_insert" on public.rooms for insert with check (true);
create policy "rooms_update" on public.rooms for update using (true);

-- players: readable by anyone, insertable by anyone, updatable by anyone
create policy "players_select" on public.players for select using (true);
create policy "players_insert" on public.players for insert with check (true);
create policy "players_update" on public.players for update using (true);

-- game_sessions: readable by anyone, writable by anyone
create policy "game_sessions_select" on public.game_sessions for select using (true);
create policy "game_sessions_insert" on public.game_sessions for insert with check (true);
create policy "game_sessions_update" on public.game_sessions for update using (true);

-- Enable realtime for these tables
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.game_sessions;
