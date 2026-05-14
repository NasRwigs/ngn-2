# NGN Portal

Front-end for the Now Generation Network portal. Built against the v2 PRD (`Docs/Doc1_NGN_Portal_PRD_v2.md`), the IA + Sitemap (`Docs/Doc2_NGN_Portal_IA_Sitemap.md`), the wireframe spec (`Docs/Doc3_NGN_Portal_UX_Wireframes.md`), and the design system in `DESIGN.md`. Inconsistencies and locks for branding, chrome, onboarding, taxonomy, and visual system are recorded in `Docs/Doc5_NGN_Wireframes_Review.md`.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript strict
- Tailwind CSS 3 — design tokens in `src/components/app-shell/tailwind.tokens.ts`
- Radix UI primitives, lucide-react icons
- Sonner toasts, react-hook-form + zod-ready
- Vitest + React Testing Library (unit), Playwright (E2E)
- Storybook 9 (`npm run storybook`) — component catalogue in `stories/`
- npm (lockfile: `package-lock.json`; pnpm works too if you prefer)

> **Note on Next 15 vs Next 16.** The plan targets Next 16 once typed routes and Cache Components are GA. We're on 15.1+ today because the rest of the toolchain (Storybook 9, ESLint Next config) has shipped Next 15 support but Next 16 was still gating storybook addons at the time the project was scaffolded. The migration to Next 16 is an `npm update` + `npx @next/codemod@latest` away.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The default persona is **Sarah Jenkins** (member). Switch personas at `/dev/persona` — there's also a dev shortcut on the login page.

### Scripts

```bash
npm run dev          # Next dev server on :3000 (bumps HTTP header cap for IDE preview)
npm run build        # Production build
npm run start        # Run the production build
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run test         # Vitest unit tests
npm run e2e          # Playwright E2E (starts the dev server)
npm run storybook    # Storybook 9 on :6006
npm run build-storybook   # Static Storybook → storybook-static/
npm run ci           # typecheck + lint + test + build + build-storybook
```

## Supabase backend

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (and optionally `SUPABASE_SERVICE_ROLE_KEY` for admin invites / onboarding profile sync when email confirmation is on). Set `DATA_PROVIDER=mock` to keep the in-memory fixtures even if Supabase env vars are present (used by Playwright).

- SQL migrations live in [`supabase/migrations/`](supabase/migrations/). Apply via [Supabase CLI](https://supabase.com/docs/guides/cli) or the SQL editor on your hosted project (London: `eu-west-2`).
- Optional local seed: [`supabase/seed.sql`](supabase/seed.sql) (discussion spaces).
- `middleware.ts` refreshes the Supabase session and protects app routes when Supabase env vars are set.

## Architecture

```
app/
  (public)/           # Routes with no chrome (landing, login, onboarding, reset, MFA verify, invitation)
    layout.tsx
    landing/, login/, onboarding/, reset-password/, mfa-verify/, invitation/
  (app)/              # Routes inside <AppShell>
    layout.tsx        # Mounts AppShell with current user + counts
    page.tsx          # Home dashboard
    connect/          # Directory, member profile, edit profile
    mentor/           # Mentorship dashboards, browse, request, pairs/, intake, log
    discuss/          # Discuss landing, spaces (+ threads), circles, sessions
    events/           # Events list, detail, create, archive
    message/          # Inbox + conversation view (with realtime seam)
    notifications/    # Notifications inbox
    settings/         # Account settings + notification prefs
    admin/            # Admin overview, members, mentorship, matching, events, spaces, MFA enrol
    legal/            # Legal pages
  dev/persona/        # Dev-only persona switcher
  auth/callback/      # PKCE / magic link exchange (Supabase)
  auth/sign-out/      # POST → Supabase sign-out + clears persona cookie
supabase/             # Postgres migrations + optional seed (local CLI)
src/
  components/
    app-shell/        # Vendored chrome: sidebar, header, breadcrumbs, mobile bar
    ui/               # Primitives (Button, Card, Input, Modal, Stepper, ResponsiveTable, …)
    patterns/         # Domain patterns: ProfileCard, PairCard, EventCard, FilterBar, SessionTimeline
  lib/
    auth/             # session.ts (cookie → user), permissions.ts (RBAC matrix)
    data/             # types.ts, queries.ts, mutations.ts, mock-impl.ts, fixtures/, personas.ts
    taxonomy/         # Sectors, programme areas, statuses, countries — canonical vocabularies
    format/           # date.ts (formatDate/Time/Relative), i18n.ts (t())
    realtime/         # useRealtimeChannel — Supabase Realtime or polling fallback
tests/                # Vitest setup + permissions + date format + Supabase config
e2e/                  # Playwright smoke
middleware.ts         # Supabase session refresh + auth gate
```

## Data layer

Every page reads from `await dataProvider()` and pulls `queries` / `mutations`. With `NEXT_PUBLIC_SUPABASE_URL` + publishable key set (and `DATA_PROVIDER` not `mock`), `dataProvider()` uses the Supabase-backed implementation in `src/lib/data/supabase/*`. Otherwise it uses in-memory fixtures in `src/lib/data/mock-impl.ts`.

## Auth

With Supabase configured, `getCurrentUser()` reads the Supabase session and `profiles` row. Without Supabase env vars (or with `DATA_PROVIDER=mock`), `getCurrentUser()` uses the `ngn_persona` cookie and fixture members (`/dev/persona`).

## Storybook

- **In this repo:** `npm run storybook` / `npm run build-storybook` — config under `.storybook/`, starter stories under `stories/`. Expand stories as primitives evolve.
- **`Wireframes/_shell-storybook/`:** sibling package focused on the vendored `<AppShell>` chrome contract; keep both until we consolidate into a single Storybook app (optional Turborepo move).

## Decisions

See `DECISIONS.md` for the four §13 decisions locked during Phase 0.

## Plan provenance

This repo implements `ngn_portal_fe_build_7603848e.plan.md` (the build plan attached to this conversation). Phase boundaries and their deliverables are tracked in that file — please don't drift away from those without a corresponding plan edit.
