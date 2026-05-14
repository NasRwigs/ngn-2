# NGN Portal — Decisions log

A short, dated record of the implementation decisions made during Phase 0. Each entry is paired to the plan section it resolves.

---

## §13.1 — Tailwind 3 vs 4

**Decision:** Tailwind 3.4.

**Why:** The `_shell-storybook` already pinned Tailwind 3, the design tokens in `DESIGN.md` were authored against the v3 token API (no `@theme`), and Tailwind 4 is still flighting through breaking ecosystem changes. We can revisit when the broader plugin ecosystem (Headless UI, Radix, prettier-plugin-tailwindcss) catches up.

**Revisit:** Q4 2026, or when we want CSS-first config.

---

## §13.2 — Storybook major version

**Decision:** Storybook 9, with `addon-docs` only (no `addon-essentials`).

**Why:** Storybook 9 dropped the bundled `addon-essentials` package; viewport, controls, and actions are now stable defaults that ship in the core. Pinning a single major version across `_shell-storybook` and the main app prevents the addon mismatch we hit earlier.

**Revisit:** Only when a new major drops.

---

## §13.3 — Mobile parity for the matching workspace (Screen 38)

**Decision:** Mobile renders the matching workspace as a stacked single-column view — mentee list first, mentor recommendations below. Drag-to-pair is desktop-only; mobile uses the same "Propose pair" button per mentor row.

**Why:** Drag-and-drop matching is a Programme-Admin power user flow that is overwhelmingly done from a laptop. We don't want to ship a sub-par mobile experience, but we also don't want to gate the workflow on rebuilding it for touch.

**Revisit:** If usage data shows >15% of matching activity on mobile.

---

## §13.4 — Hanken Grotesk brand approval

**Decision:** Hanken Grotesk via `next/font/google` is mounted as the default body and headline face. Brand has been notified to confirm OR to nominate a replacement (Inter Tight, IBM Plex Sans, or Outfit are the fallback candidates listed in `DESIGN.md`).

**Why:** Hanken Grotesk has weights 300–700 with strong i18n coverage including African Latin extensions. Self-host via `next/font` for performance and to avoid runtime Google Fonts requests.

**Revisit:** If brand pushes back, swap the import in `app/layout.tsx`. The CSS variable `--font-hanken` is the only callsite — one-line change.

---

## §13.5 — Brand asset delivery

**Decision:** Brand assets land under `public/brand/` as they arrive. Today the lockup is a CSS-only `N` glyph in a primary-coloured square. Once brand delivers the real wordmark + favicon set, the lockup component (`src/components/app-shell/sidebar.tsx`, `app/(public)/landing/page.tsx`, `app/(public)/login/page.tsx`) wraps the swap in three edits.

**Revisit:** When brand delivers.

---

## Phase-12 notes (front-end completion pass)

- **Discussion threads (formerly P3):** Space thread list, thread detail with replies, compose dialog, and mock-backed `mutations.spaces.createThread` / `replyToThread` are implemented. Routes: `/discuss/spaces/[slug]`, `/discuss/spaces/[slug]/threads/[threadId]`.
- **Admin moderation queue:** No longer a hard-coded client stub — reads `queries.admin.moderationQueue()` and resolves via `mutations.admin.moderationResolve` (in-memory).
- **Admin MFA enrol:** Renders a real `otpauth://` QR via `react-qr-code` (still mock secret until IdP integration).
- **Storybook:** `npm run storybook` / `npm run build-storybook` wired in-repo under `.storybook/` with starter stories in `stories/` (expand incrementally).
- `t()` i18n seam remains incremental — wrapping every string is deferred until a second locale is scheduled.
- Cache Components / PPR remain off until the data layer is swapped off the mock (avoids caching stale in-memory fixtures).
- Visual regression baselines remain un-captured until brand lockup is final (see §13.5).
