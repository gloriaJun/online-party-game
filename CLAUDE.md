# CLAUDE.md - Online Party Game

For project overview, structure, tech stack, and setup, refer to README.md.

## Essential Commands

```bash
pnpm install                          # Install all dependencies
pnpm dev                              # Dev all apps simultaneously
pnpm --filter spyfall dev             # Dev spyfall only (port 3001)
pnpm --filter dashboard dev           # Dev dashboard only (port 3000)
pnpm build                            # Build all apps and packages
pnpm lint                             # Lint all packages
pnpm check-types                      # TypeScript check all packages
pnpm format                           # Format with Prettier
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

- **Package Manager**: Always use `pnpm` - never npm or yarn
- **Naming**: kebab-case for directories, PascalCase for components
- **Imports**: Use `@/*` path alias within each app (maps to `./src/*`)
- **Package refs**: Use `@repo/<name>` for cross-package imports
- **Branching**: Feature branches, PR-based merge to main
- **Commits**: Conventional commits (feat:, fix:, docs:, chore:)
- **Branch naming**: `feat/<issue-number>-<short-description>`

## Spyfall Game Specifics

- **Players**: 4~12 (spy count auto-recommended by player count)
- **Game flow**: Lobby → Role Reveal → Discussion → Voting → Spy Guess → Result
- **Full requirements**: See `docs/spyfall/requirements.md`
- **Game rules**: See `docs/spyfall/game-rules.md`
- **Location data**: See `docs/spyfall/locations.md` (15 locations, each with 8-12 roles)

## Security

- Never read or commit environment variable files such as `.env.local`, `.env`
- Never hardcode API keys, tokens, or secrets in source code
- Refer to `.env.example` for environment variable templates
