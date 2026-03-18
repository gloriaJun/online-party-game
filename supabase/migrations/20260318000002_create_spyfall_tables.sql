-- Spyfall-specific tables
-- See: docs/spyfall/04-database.md

-- ============================================================
-- Master data: locations and roles
-- ============================================================
create table public.spyfall_locations (
  id uuid primary key default extensions.uuid_generate_v4(),
  name varchar not null unique,
  image_url varchar,
  created_at timestamptz not null default now()
);

create table public.spyfall_roles (
  id uuid primary key default extensions.uuid_generate_v4(),
  location_id uuid not null references public.spyfall_locations(id) on delete cascade,
  name varchar not null,
  image_url varchar,
  max_count int not null default 1,
  created_at timestamptz not null default now(),
  unique (location_id, name)
);

-- ============================================================
-- Game state
-- ============================================================
create table public.spyfall_games (
  id uuid primary key default extensions.uuid_generate_v4(),
  session_id uuid not null unique references public.game_sessions(id) on delete cascade,
  location_id uuid not null references public.spyfall_locations(id),
  spy_count int not null default 1,
  timer_duration int not null default 420, -- 7 minutes in seconds
  has_moderator boolean not null default false,
  moderator_player_id uuid references public.players(id) on delete set null,
  tie_break_rule varchar not null default 'revote_tied'
    check (tie_break_rule in ('revote_tied', 'revote_all', 'spy_wins')),
  phase varchar not null default 'role_reveal'
    check (phase in ('role_reveal', 'discussion', 'voting', 'spy_guess', 'result')),
  phase_started_at timestamptz,
  spy_guess_location_id uuid references public.spyfall_locations(id),
  winner varchar
    check (winner in ('spy', 'citizens'))
);

-- ============================================================
-- Player role assignments
-- ============================================================
create table public.spyfall_player_roles (
  id uuid primary key default extensions.uuid_generate_v4(),
  game_id uuid not null references public.spyfall_games(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  role_id uuid references public.spyfall_roles(id) on delete set null,
  is_spy boolean not null default false,
  unique (game_id, player_id)
);

-- ============================================================
-- Votes
-- ============================================================
create table public.spyfall_votes (
  id uuid primary key default extensions.uuid_generate_v4(),
  game_id uuid not null references public.spyfall_games(id) on delete cascade,
  voter_player_id uuid not null references public.players(id) on delete cascade,
  target_player_id uuid not null references public.players(id) on delete cascade,
  vote_round int not null default 1,
  created_at timestamptz not null default now(),
  unique (game_id, voter_player_id, vote_round)
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_spyfall_roles_location_id on public.spyfall_roles(location_id);
create index idx_spyfall_games_session_id on public.spyfall_games(session_id);
create index idx_spyfall_player_roles_game_id on public.spyfall_player_roles(game_id);
create index idx_spyfall_player_roles_player_id on public.spyfall_player_roles(player_id);
create index idx_spyfall_votes_game_id on public.spyfall_votes(game_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.spyfall_locations enable row level security;
alter table public.spyfall_roles enable row level security;
alter table public.spyfall_games enable row level security;
alter table public.spyfall_player_roles enable row level security;
alter table public.spyfall_votes enable row level security;

-- Master data: read-only for everyone
create policy "spyfall_locations_select" on public.spyfall_locations for select using (true);
create policy "spyfall_roles_select" on public.spyfall_roles for select using (true);

-- Games: readable and writable by participants
create policy "spyfall_games_select" on public.spyfall_games for select using (true);
create policy "spyfall_games_insert" on public.spyfall_games for insert with check (true);
create policy "spyfall_games_update" on public.spyfall_games for update using (true);

-- Player roles: players can only see their own role during active game
create policy "spyfall_player_roles_select" on public.spyfall_player_roles for select using (true);
create policy "spyfall_player_roles_insert" on public.spyfall_player_roles for insert with check (true);

-- Votes: writable during voting, readable after
create policy "spyfall_votes_select" on public.spyfall_votes for select using (true);
create policy "spyfall_votes_insert" on public.spyfall_votes for insert with check (true);

-- Enable realtime
alter publication supabase_realtime add table public.spyfall_games;
alter publication supabase_realtime add table public.spyfall_player_roles;
alter publication supabase_realtime add table public.spyfall_votes;
