# Spyfall - Database Schema

This document describes Spyfall-specific tables. For shared tables (`rooms`, `players`, `game_sessions`) and overall architecture, see [Database Architecture](../database-architecture.md).

## Table Overview

```
public.spyfall_locations            -- location master data
public.spyfall_roles                -- role master data per location
public.spyfall_games                -- game configuration and state per round
public.spyfall_player_roles         -- assigned role per player per round
public.spyfall_votes                -- individual votes per round
```

## Master Data Tables

### spyfall_locations

Static location data used for game content.

| Column | Type | Description |
| --- | --- | --- |
| id | uuid (PK) | Unique location ID |
| name | varchar | Location display name |
| image_url | varchar (nullable) | Card image path |
| created_at | timestamptz | Creation timestamp |

### spyfall_roles

Roles available at each location. Each role has a max headcount.

| Column | Type | Description |
| --- | --- | --- |
| id | uuid (PK) | Unique role ID |
| location_id | uuid (FK) | Reference to `spyfall_locations` |
| name | varchar | Role display name |
| image_url | varchar (nullable) | Role card image path |
| max_count | int | Maximum players assignable to this role |
| created_at | timestamptz | Creation timestamp |

## Game State Tables

### spyfall_games

Per-round game configuration and state. One row per game round (linked to `game_sessions`).

| Column | Type | Description |
| --- | --- | --- |
| id | uuid (PK) | Unique game ID |
| session_id | uuid (FK) | Reference to `game_sessions` |
| location_id | uuid (FK) | Selected location for this round |
| spy_count | int | Number of spies |
| timer_duration | int | Discussion timer in seconds |
| has_moderator | boolean | Whether moderator mode is enabled |
| moderator_player_id | uuid (FK, nullable) | Reference to moderator player |
| tie_break_rule | varchar | `revote_tied`, `revote_all`, or `spy_wins` |
| phase | varchar | Current game phase (see Game Phases below) |
| phase_started_at | timestamptz (nullable) | When the current phase started |
| spy_guess_location_id | uuid (FK, nullable) | Location the spy guessed (if applicable) |
| winner | varchar (nullable) | `spy` or `citizens` (set when game ends) |

#### Game Phases

| Phase | Description |
| --- | --- |
| `role_reveal` | Players view their assigned role cards |
| `discussion` | Question-and-answer round with timer |
| `voting` | All players vote simultaneously |
| `spy_guess` | Caught spy attempts to guess the location |
| `result` | Game over, showing winner and summary |

### spyfall_player_roles

Role assignment for each player in a game round.

| Column | Type | Description |
| --- | --- | --- |
| id | uuid (PK) | Unique assignment ID |
| game_id | uuid (FK) | Reference to `spyfall_games` |
| player_id | uuid (FK) | Reference to `players` |
| role_id | uuid (FK, nullable) | Reference to `spyfall_roles` (null if spy) |
| is_spy | boolean | Whether this player is a spy |

### spyfall_votes

Individual vote records for each voting round.

| Column | Type | Description |
| --- | --- | --- |
| id | uuid (PK) | Unique vote ID |
| game_id | uuid (FK) | Reference to `spyfall_games` |
| voter_player_id | uuid (FK) | Player who cast the vote |
| target_player_id | uuid (FK) | Player being voted for |
| vote_round | int | Vote round number (1 = initial, 2+ = revotes) |
| created_at | timestamptz | Vote timestamp |

## Relationships

```
game_sessions 1──1 spyfall_games
spyfall_locations 1──* spyfall_roles
spyfall_games *──1 spyfall_locations
spyfall_games 1──* spyfall_player_roles
spyfall_games 1──* spyfall_votes
spyfall_player_roles *──1 players
spyfall_player_roles *──1 spyfall_roles
spyfall_votes *──1 players (voter)
spyfall_votes *──1 players (target)
```

For shared table relationships (`rooms`, `players`, `game_sessions`), see [Database Architecture](../database-architecture.md).

## Indexes

| Table | Index | Purpose |
| --- | --- | --- |
| spyfall_locations | `name` (unique) | Prevent duplicate locations |
| spyfall_roles | `(location_id, name)` (unique) | Prevent duplicate roles per location |
| spyfall_games | `session_id` (unique) | One game per session |
| spyfall_player_roles | `(game_id, player_id)` (unique) | One role per player per game |
| spyfall_votes | `(game_id, voter_player_id, vote_round)` (unique) | One vote per player per round |

## RLS (Row Level Security) Notes

- `spyfall_locations` and `spyfall_roles`: Read-only for all authenticated/anonymous users
- `spyfall_player_roles`: Players can only read their own role during an active game (prevents seeing other players' spy status)
- `spyfall_votes`: Write-only during voting phase; read-all after voting is complete
- `spyfall_games`: Read for room participants; write for host only (phase transitions)

## Seed Data

Location and role data from [03-locations.md](03-locations.md) will be loaded as seed data via `supabase/seed.sql`. This includes 15 locations with 8-12 roles each.
