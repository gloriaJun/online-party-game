# Database Architecture

## Overview

This project uses a single Supabase project (PostgreSQL) shared across all apps.
Dashboard, Spyfall, and future game apps run as independent Next.js Multi-Zone applications, but they all connect to the same database instance.

## Design Principles

1. **Single Database, Multiple Apps**: All apps connect to one Supabase instance
2. **Shared Tables for Common Concerns**: Rooms, players, and game sessions are managed in shared tables
3. **Game-Specific Tables with Prefix**: Each game's unique data uses a `{game_name}_` prefix for namespace separation
4. **Supabase Realtime**: Broadcast (events) and Presence (connection tracking) for real-time communication

## Table Namespace Strategy

### Current Approach: Prefix (Option A)

Game-specific tables use a `{game_name}_` prefix for logical separation within the `public` schema.

```
public.rooms                    -- shared
public.players                  -- shared
public.game_sessions            -- shared
public.[game]_*                 -- game-specific (e.g., spyfall_locations, spyfall_roles)
```

Each game app defines its own set of prefixed tables. See the game-specific documentation for details:

- Spyfall: [docs/spyfall/04-database.md](spyfall/04-database.md)

**Advantages**:

- Works with default Supabase configuration out of the box
- Low setup complexity
- RLS (Row Level Security) provides sufficient access control

### Future Consideration: Schema Separation (Option B)

When the project grows to 5+ games or requires team-level isolation, migrating to PostgreSQL schema separation can be considered.

```
public.rooms                    -- shared
public.players                  -- shared
public.game_sessions            -- shared
[game].locations                -- game-specific (e.g., spyfall.locations)
[game].roles                    -- game-specific (e.g., spyfall.roles)
[game].game_state               -- game-specific (e.g., spyfall.game_state)
```

**Advantages**:

- Physical namespace isolation
- Schema-level permission control
- Cleaner table listing as game count grows

**Additional setup required**:

- `db.schemas` configuration change in `supabase/config.toml`
- API schema exposure settings in Supabase
- Schema creation step in migrations

### Comparison

| Aspect                 | Option A: Prefix            | Option B: Schema Separation      |
| ---------------------- | --------------------------- | -------------------------------- |
| Table structure        | `public.[game]_locations`   | `[game].locations`               |
| Isolation level        | Logical (naming convention) | Physical (PostgreSQL schema)     |
| Access control         | Table-level RLS             | Schema-level permissions + RLS   |
| Supabase compatibility | Default config, no changes  | Requires `db.schemas` config     |
| Complexity             | Low                         | Medium                           |
| Migration effort       | Maintain prefix consistency | Schema creation + table creation |

**Migration trigger**: Consider switching to Option B when the project has 5+ games or when separate teams manage different games independently.

## Shared Tables

Common tables used by all games.

### rooms

| Column         | Type        | Description                                    |
| -------------- | ----------- | ---------------------------------------------- |
| id             | uuid (PK)   | Unique room ID                                 |
| code           | varchar(6)  | Join code (uppercase alphanumeric)             |
| game_type      | varchar     | Game type identifier (`spyfall`, ...)          |
| status         | varchar     | Room status (`waiting`, `playing`, `finished`) |
| host_player_id | uuid (FK)   | Reference to host player                       |
| max_players    | int         | Maximum player count                           |
| created_at     | timestamptz | Creation timestamp                             |
| updated_at     | timestamptz | Last update timestamp                          |

### players

| Column       | Type            | Description                                                 |
| ------------ | --------------- | ----------------------------------------------------------- |
| id           | uuid (PK)       | Unique player ID                                            |
| room_id      | uuid (FK)       | Reference to room                                           |
| nickname     | varchar         | Display name                                                |
| is_host      | boolean         | Whether this player is the host                             |
| is_connected | boolean         | Connection status                                           |
| user_id      | uuid (nullable) | Authenticated user reference (for future login integration) |
| created_at   | timestamptz     | Join timestamp                                              |

### game_sessions

| Column       | Type                   | Description                                 |
| ------------ | ---------------------- | ------------------------------------------- |
| id           | uuid (PK)              | Unique session ID                           |
| room_id      | uuid (FK)              | Reference to room                           |
| game_type    | varchar                | Game type identifier                        |
| round_number | int                    | Round number within the room                |
| started_at   | timestamptz            | Round start time                            |
| ended_at     | timestamptz (nullable) | Round end time                              |
| result       | jsonb (nullable)       | Game result data (structure varies by game) |

## Future: Authentication

When Supabase Auth is integrated via the Dashboard app:

- `players.user_id` links authenticated users to player records
- Game history, statistics, and profiles can be managed per user
- Unauthenticated users can still play via Anonymous Auth (current behavior preserved)

## Realtime Strategy

| Feature                           | Method    | Channel           |
| --------------------------------- | --------- | ----------------- |
| Game events (votes, timer, state) | Broadcast | `room:{roomCode}` |
| Player connection status          | Presence  | `room:{roomCode}` |

All game apps connect to Realtime through the shared client in `@repo/supabase`.

## Migration Conventions

- Location: `supabase/migrations/`
- File naming: `{timestamp}_{description}.sql`
- Common table migrations: e.g., `create_common_tables`
- Game-specific migrations: e.g., `create_spyfall_tables`
