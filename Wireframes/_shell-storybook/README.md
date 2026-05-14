# NGN Portal — AppShell Storybook

Live preview of the **Doc5 §2** chrome (`<AppShell>` + sidebar + header +
mobile bar) for designers and engineers. Sibling to `../_shell/` — no copy
of components; webpack resolves `@ngn-shell/*` to `../_shell/`.

## Run locally

```bash
cd Wireframes/_shell-storybook
npm install
npm run storybook
```

Open **http://localhost:6006** → **Chrome / AppShell** → pick a story.

Static build (e.g. CI preview or `npx serve storybook-static`):

```bash
npm run build-storybook
```

## Stories (6)

| Story | Viewport | Role | `pathname` (active nav) |
|-------|----------|------|-------------------------|
| **Mobile · Member** | 390×844 | Member | `/` |
| **Mobile · ExCo** | 390×844 | ExCo | `/` |
| **Tablet · Member** | 820×1180 | Member | `/connect` |
| **Tablet · ExCo** | 820×1180 | ExCo | `/admin` |
| **Desktop · Member** | 1280×800 | Member | `/events` |
| **Desktop · ExCo** | 1280×800 | ExCo | `/admin` |

Use the **viewport toolbar** in Storybook to switch presets without leaving
the file. Custom presets are named `ngnMobile`, `ngnTablet`, `ngnDesktop`
(see `.storybook/preview.tsx`).

**ExCo** stories should show **Admin** in the sidebar (tablet/desktop) and
in the avatar menu on mobile. **Member** stories must not show Admin.

## Stack

- Storybook 9 + `@storybook/nextjs` (App Router, `next/link`, `next/image`)
- **Next.js 15** in this package only (Storybook + Next 16 is still uneven
  across minor releases — bump when your toolchain is ready)
- Tailwind 3 + tokens from `../_shell/tailwind.tokens.ts`
- Hanken Grotesk via `.storybook/preview-head.html`

`next.config.mjs` sets `images.unoptimized: true` so `next/image` in the
shell works inside Storybook without a remote image CDN.

## Moving into the real app

When you merge `_shell/` into `ngn-portal`, either:

1. Move this folder to `apps/web/.storybook` (or `src/../.storybook`) and
   point the `@ngn-shell` alias at your real shell path, or  
2. Delete this package and re-run `npx storybook@latest init` inside the app,
   then copy `stories/AppShell.stories.tsx` and `preview-head` / Tailwind
   wiring.

---

*Chrome contract: `Docs/Doc5_NGN_Wireframes_Review.md` §2.*
