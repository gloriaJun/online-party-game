# CLAUDE.md - Online Party Game

## Project Overview

온라인 파티 게임 플랫폼. 여러 종류의 파티 게임을 하나의 도메인 아래 독립적으로 제공한다.
현재 첫 번째 게임으로 **Spyfall(스파이폴)** 을 개발 중이다.

## Architecture

**Turborepo 모노레포** + **Next.js Multi-Zone** 아키텍처.
각 게임은 독립적인 Next.js 앱으로 존재하며, Dashboard가 rewrites로 통합 라우팅한다.

### Apps

| App | Path | Port (dev) | Description |
|-----|------|-----------|-------------|
| `apps/dashboard` | `/` | 3000 | 게임 목록, 로비, 프로필 |
| `apps/spyfall` | `/games/spyfall` | 3001 | 스파이폴 게임 (독립 앱) |

### Packages

| Package | Description |
|---------|-------------|
| `packages/game-common` | 게임 공통 유틸 (timer, voting, room code 생성) |
| `packages/supabase` | Supabase 클라이언트, Realtime(Broadcast/Presence) 유틸 |
| `packages/ui` | 공유 UI 컴포넌트 |
| `packages/eslint-config` | 공유 ESLint 설정 |
| `packages/typescript-config` | 공유 TypeScript 설정 |

### Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Realtime | Supabase Realtime (Broadcast + Presence) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Anonymous / Guest) |
| Monorepo | Turborepo + pnpm workspaces |
| Deploy | Vercel (Multi-Zone) |
| Language | TypeScript |

## Essential Commands

```bash
pnpm install                          # Install all dependencies
pnpm turbo build                      # Build all apps and packages
pnpm turbo dev                        # Dev all apps simultaneously
pnpm --filter spyfall dev             # Dev spyfall only (port 3001)
pnpm --filter dashboard dev           # Dev dashboard only (port 3000)
pnpm turbo lint                       # Lint all packages
pnpm turbo check-types                # TypeScript check all packages
```

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

## Development Patterns

### Adding a New Game

1. Create `apps/<game-name>/` as a new Next.js app
2. Set `basePath: "/games/<game-name>"` in next.config.ts
3. Add rewrite rule in `apps/dashboard/next.config.ts`
4. Use `@repo/game-common` for shared game utilities
5. Use `@repo/supabase` for realtime communication
6. Add game entry in dashboard's game list

### Multi-Zone Routing

Dashboard acts as the main zone and routes to game apps via rewrites:
- `apps/dashboard/next.config.ts` contains rewrite rules
- Each game app has its own `basePath` for asset/route isolation
- In production, Vercel handles zone routing automatically

### Supabase Realtime

- **Broadcast**: Room-scoped real-time events (votes, timer sync, game state)
- **Presence**: Player connection tracking (join/leave/reconnect)
- Channel naming: `room:{roomCode}`

### Workspace Dependencies

- Apps import packages via `@repo/<package-name>` (workspace:*)
- `transpilePackages` in next.config.ts for package resolution
- Shared types in `@repo/game-common/src/types/`

## Conventions

- **Package Manager**: Always use `pnpm`
- **Naming**: kebab-case for directories, PascalCase for components
- **Imports**: Use `@/*` path alias within each app (maps to `./src/*`)
- **Package refs**: Use `@repo/<name>` for cross-package imports
- **Branching**: Feature branches, PR-based merge to main
- **Commits**: Conventional commits (feat:, fix:, docs:, chore:)

## Spyfall Game Specifics

- **Players**: 4~12 (spy count auto-recommended by player count)
- **Realtime**: Supabase Broadcast for game events, Presence for connection tracking
- **Game flow**: Lobby → Role Reveal → Discussion → Voting → Spy Guess → Result
- **Full requirements**: See `docs/spyfall/requirements.md`
- **Game rules**: See `docs/spyfall/game-rules.md`
- **Location data**: See `docs/spyfall/locations.md` (15 locations, each with 8-12 roles)

## Environment Variables

Copy `.env.example` to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SPYFALL_URL=http://localhost:3001  # dev only
```

## GitHub Workflow

- GitHub Project board로 task 관리
- 각 task를 Issue로 생성 → feature branch 작업 → PR → main 병합
- Branch naming: `feat/<issue-number>-<short-description>`
