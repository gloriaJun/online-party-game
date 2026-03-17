# Online Party Game

An online party game platform that serves multiple party games independently under a single domain.
Currently developing **Spyfall** as the first game.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Realtime | Supabase Realtime (Broadcast + Presence) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Anonymous / Guest) |
| Monorepo | Turborepo + pnpm workspaces |
| Deploy | Vercel (Multi-Zone) |
| Language | TypeScript 5.9 |

## Architecture

**Turborepo monorepo** + **Next.js Multi-Zone** architecture.
Each game exists as an independent Next.js app, with Dashboard handling unified routing via rewrites.

### Apps

| App | Path | Port (dev) | Description |
|-----|------|-----------|-------------|
| `apps/dashboard` | `/` | 3000 | Game list, lobby, profile |
| `apps/spyfall` | `/games/spyfall` | 3001 | Spyfall game (standalone app) |

### Packages

| Package | Description |
|---------|-------------|
| `packages/game-common` | Shared game utilities (timer, voting, room code generation) |
| `packages/supabase` | Supabase client and Realtime (Broadcast/Presence) utilities |
| `packages/ui` | Shared UI components |
| `packages/eslint-config` | Shared ESLint configurations |
| `packages/typescript-config` | Shared TypeScript configurations |

## Project Structure

```
online-party-game/
├── apps/
│   ├── dashboard/                    # Main dashboard (basePath: /)
│   │   ├── src/app/                  # Next.js App Router
│   │   └── next.config.ts            # rewrites for game zone routing
│   └── spyfall/                      # Spyfall game (basePath: /games/spyfall)
│       ├── src/app/                  # Next.js App Router
│       ├── public/images/            # Location/role card images
│       └── next.config.ts            # basePath: /games/spyfall
├── packages/
│   ├── game-common/src/
│   │   ├── types/                    # Shared types (Player, Room, VoteResult, etc.)
│   │   ├── timer/                    # Timer utilities (create, start, remaining)
│   │   ├── voting/                   # Vote calculation, tie-break resolution
│   │   └── room/                     # Room code generation/validation
│   ├── supabase/src/
│   │   ├── client.ts                 # Supabase client initialization
│   │   └── realtime.ts               # Broadcast, Presence utilities
│   ├── ui/src/                       # Shared React UI components
│   ├── eslint-config/                # ESLint configs (base, next.js)
│   └── typescript-config/            # TS configs (base, nextjs, react-library)
├── docs/spyfall/
│   ├── requirements.md               # Full requirements document
│   ├── game-rules.md                 # Game rules and flow diagrams
│   └── locations.md                  # 15 locations with roles data
└── .env.example                      # Supabase env template
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0 (`corepack enable` to activate)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Run all apps simultaneously
pnpm dev

# Run specific app
pnpm --filter dashboard dev    # port 3000
pnpm --filter spyfall dev      # port 3001
```

### Build & Quality

```bash
pnpm build          # Build all apps and packages
pnpm lint           # Lint all packages
pnpm check-types    # TypeScript check all packages
pnpm format         # Format code with Prettier
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SPYFALL_URL=http://localhost:3001  # dev only
```

## Game Documentation

- [Spyfall Requirements](docs/spyfall/requirements.md)
- [Spyfall Game Rules](docs/spyfall/game-rules.md)
- [Spyfall Locations](docs/spyfall/locations.md)
