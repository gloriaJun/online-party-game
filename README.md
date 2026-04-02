# Online Party Game

An online party game platform that serves multiple party games independently under a single domain.
Currently developing **Spyfall** as the first game.

## Tech Stack

| Category | Technology                               |
| -------- | ---------------------------------------- |
| Frontend | Next.js 15 (App Router) + React 19       |
| Styling  | Tailwind CSS v4 + shadcn/ui              |
| i18n     | next-intl (English / Korean)             |
| Realtime | Supabase Realtime (Broadcast + Presence) |
| Database | Supabase (PostgreSQL)                    |
| Auth     | Supabase Auth (Anonymous / Guest)        |
| Monorepo | Turborepo + pnpm workspaces              |
| Deploy   | Vercel (Multi-Zone)                      |
| Language | TypeScript 5.9                           |

## Architecture

**Turborepo monorepo** + **Next.js Multi-Zone** architecture.
Each game exists as an independent Next.js app, with Dashboard handling unified routing via rewrites.

### Apps

| App              | Path             | Port (dev) | Description                   |
| ---------------- | ---------------- | ---------- | ----------------------------- |
| `apps/dashboard` | `/`              | 3000       | Game list, lobby, profile     |
| `apps/spyfall`   | `/games/spyfall` | 3001       | Spyfall game (standalone app) |

### Packages

| Package                      | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `packages/game-common`       | Shared game utilities (timer, voting, room code generation) |
| `packages/supabase`          | Supabase client and Realtime (Broadcast/Presence) utilities |
| `packages/ui`                | Shared UI components (shadcn/ui + Tailwind CSS)             |
| `packages/eslint-config`     | Shared ESLint configurations                                |
| `packages/typescript-config` | Shared TypeScript configurations                            |

## Project Structure

```
online-party-game/
├── apps/                  # Independent Next.js apps
│   ├── dashboard/         # Main dashboard (port 3000)
│   └── spyfall/           # Spyfall game (port 3001)
├── packages/              # Shared libraries
│   ├── game-common/       # Game logic (timer, voting, room)
│   ├── supabase/          # Supabase client & realtime
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # ESLint configurations
│   └── typescript-config/ # TypeScript configurations
└── docs/                  # Game documentation
```

## Getting Started

### Prerequisites

- Node.js 24 LTS (see `.nvmrc`)
- pnpm (via Corepack — **npm/yarn are not supported**)

### Setup

```bash
# Enable Corepack (activates pnpm from packageManager field)
corepack enable

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
SPYFALL_URL=http://localhost:3001  # dev only
```

## Game Documentation

- [Spyfall](docs/spyfall/)
