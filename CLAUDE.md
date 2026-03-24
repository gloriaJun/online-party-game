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
pnpm --filter @repo/ui storybook      # Run Storybook (UI components)
pnpm --filter spyfall test:e2e        # Run E2E tests (headless)
pnpm --filter spyfall test:e2e:ui     # Run E2E tests (interactive UI)
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

### i18n (Internationalization)

- **Library**: `next-intl` (configured per-app, no shared i18n package)
- **Locale resolution**: `NEXT_LOCALE` cookie → `Accept-Language` header → default `en`
- **Routing**: Cookie/header-based (no URL path prefix) — avoids link sharing forcing sender's language
- **Translation files**: `apps/<app>/messages/{en,ko}.json`
- **Usage**: `useTranslations()` in components, `getTranslations()` in server components/metadata
- **Adding strings**: Add keys to both `en.json` and `ko.json` simultaneously

### Styling

- **Tailwind CSS v4** with PostCSS in each app
- **shadcn/ui** components in `@repo/ui` (New York style, CSS variables)
- **`cn()` utility**: `@repo/ui/lib/utils` for conditional class merging
- **Base theme**: `packages/ui/src/styles/base-theme.css` (Dashboard Neutral Theme, Zinc/Slate)
- **Theme override**: Each app imports base theme via `@import`, then overrides app-specific variables in `globals.css`
- **Storybook**: `packages/ui/` — shared component development & documentation, dark/light mode toggle supported

### UI Component Architecture (Atomic Design)

`packages/ui/src/` follows atomic design structure:

- **`atoms/`** — Base UI primitives (Button, Input, Card, Label, Separator). Include built-in interaction styles (focus ring, hover transitions, active feedback). Apps customize via CSS variables (color, radius) only.
- **`molecules/`** — Composed components combining atoms (RoomCodeInput, SectionDivider, FormSection). Reusable patterns shared across game apps.
- **`organisms/`** — Complex layout/feature components (GameLayout, LocaleSwitcher, ThemeToggle, ThemeProvider).

**Import convention**: External imports stay flat — `@repo/ui/button`, not `@repo/ui/atoms/button`. Internal routing is handled by `package.json` exports.

**Adding shadcn components**: `pnpm dlx shadcn@latest add <component> --path src/atoms` from `packages/ui/`

**Adding new components**: Create the component in the appropriate atomic folder, then add an export entry in `packages/ui/package.json`.

### Workspace Dependencies

- Apps import packages via `@repo/<package-name>` (workspace:\*)
- `transpilePackages` in next.config.ts for package resolution
- Shared types in `@repo/game-common/src/types/`

## Code Quality

### Prettier

- Config: `.prettierrc` at repo root
- Tailwind class sorting via `prettier-plugin-tailwindcss`
- Run: `pnpm format` to format all files

### E2E Testing (Playwright)

- **Location**: `apps/<app>/e2e/` — per-app E2E tests
- **Config**: `apps/<app>/playwright.config.ts`
- **Run**: `pnpm --filter <app> test:e2e` (headless) or `test:e2e:ui` (interactive)
- **When to write E2E tests**: Every user-facing feature should include E2E tests covering the critical user flows (navigation, form validation, i18n)
- **Selectors**: Prefer accessible selectors (`getByRole`, `getByLabel`, `getByText`) over CSS selectors or test IDs
- **i18n testing**: Use `NEXT_LOCALE` cookie to test locale switching
- **CI**: E2E tests run after lint/type-check/build in a separate job with Playwright browsers installed

### CI (GitHub Actions)

- Runs on PRs to `main` via `.github/workflows/ci.yml`
- Uses Turborepo `--filter=...[origin/main]` to validate only affected packages
- Steps: lint → type-check → build → E2E tests

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
- **Full requirements**: See `docs/spyfall/01-requirements.md`
- **Game rules**: See `docs/spyfall/02-game-rules.md`
- **Location data**: See `docs/spyfall/03-locations.md` (15 locations, each with 8-12 roles)

## Issue-Driven Workflow

When an issue number is given to work on:

1. **PRD First**: Write a PRD (Product Requirements Document) for the task and post it as a comment on the GitHub issue (`gh issue comment`)
2. **Implement**: Create a feature branch (`feat/<issue-number>-<short-description>`), implement the task, and submit a PR
3. **Update Docs**: After completion, update `README.md` and `docs/` (e.g., `docs/spyfall/`) if the changes require documentation updates

## Security

- Never read or commit environment variable files such as `.env.local`, `.env`
- Never hardcode API keys, tokens, or secrets in source code
- Refer to `.env.example` for environment variable templates
