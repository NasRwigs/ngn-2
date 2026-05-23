# NGN Portal — Design audit (MIF Brand Guidelines)

**Date:** 2026-05-23  
**Reference:** `Brand Guidelines.pdf` (Mo Ibrahim Foundation, April 2024)  
**Target:** http://localhost:3100  
**Scope:** Landing (`/landing`), Home (`/`), Connect (`/connect`), Mentor (`/mentor`)  
**Mode:** Audit only (fix loop deferred)

Screenshots captured locally during the gstack browse audit (not committed; re-run `/design-review` to regenerate).

---

## Executive summary

| Metric | Grade | Verdict |
|--------|-------|---------|
| **Design score** | **C** | Professional app shell, but brand identity is not yet on-guideline |
| **Brand compliance** | **D+** | Typography and logo are the largest gaps vs `Brand Guidelines.pdf` |
| **AI slop score** | **C** | Avoids purple gradients; still shows SaaS template patterns (icon circles, stat cards, decorative hero tiles) |

The portal reads as a capable member product, not yet as a confident MIF sub-brand. Colour tokens partially echo MIF Blue (`#0e3b83`) and orange accents, but **Museo Sans**, the **primary MIF logo lockup**, and **Afro font patterns** from the PDF are missing or stubbed.

---

## First impression (landing)

- **Communicates:** A modern SaaS community platform for African leaders — competent, not distinctly Mo Ibrahim Foundation.
- **I notice:** Orange CTAs and navy accents feel “corporate startup” more than “MIF 2024 refresh.” The hero uses soft gradient tiles, not Afro square-tile backdrops from the guidelines.
- **First three focal points:** (1) headline, (2) orange “Get started”, (3) gradient mosaic — hierarchy is clear; brand anchor (colourful band logo) is absent.
- **One word:** **Capable** (not yet **distinctive**).

**Page area test (landing):** Header, hero, stats band, pillars, footer are nameable in &lt;2s. The stats band includes **internal dev copy** (“Partner and alumni marks ship here…”) — that area fails a production “billboard” test.

---

## Brand Guidelines compliance matrix

| Guideline (PDF / PRD §3) | Required | Observed (live + code) | Severity |
|--------------------------|----------|-------------------------|----------|
| **Typography** | Museo Sans 100/300/500/700; Noto Sans for Arabic | **Hanken Grotesk** everywhere (`app/layout.tsx`, computed styles) | **High** |
| **Afro display** | Afro + Museo 500 for acronyms/patterns; square tiles & backdrops | `.bg-afro-pattern` = generic radial gradients; no Afro typeface | **High** |
| **Primary logo** | Colourful band + “Mo Ibrahim Foundation” typography, **left-aligned** | `N` in blue square (`logo.svg`, `BrandLockup`, landing header) | **High** |
| **MIF Blue** | `#0e3b83` primary brand | Present as `primary-container`; **primary** token is `#00265e` (darker navy) | **Medium** |
| **MIF Orange** | `#f39000` | CTA ~`rgb(254, 152, 18)` / `#fe9812` — close, not exact | **Low** |
| **Body text** | MIF Dark Grey `#343c42`, headings `#2e2d2c` | `on-surface` `#1b1b1c`, `on-surface-variant` `#434651` | **Medium** |
| **Page background** | Background grey `#f2efef`, warm grey `#ede8e2` | `surface` `#fcf9f9`, Material-style containers | **Medium** |
| **Semantic colours** | Red `#df1b12`, Lime `#c5b300`, Green `#4c5c0f` | Generic Material error/success/warning tokens | **Medium** |
| **Section palettes** | e.g. mentorship = Orange+Blue; directory = green tones (PRD) | Mentorship/home use orange accents; Connect/directory not grounded in Palette 3 greens | **Medium** |
| **Logo misuse** | No effects, no busy backgrounds, no centre/right align | Placeholder is simple (no glow) — **compliant on misuse rules**, but **not the real asset** | **High** (missing asset) |
| **Profile photos** | Circular (MIF band motif) | Circular avatars in directory/cards | **Pass** |
| **Mobile-first** | Required | Layout stacks; filter chips **34px** tall (&lt;44px guideline) | **Medium** |

---

## Inferred design system (rendered)

**Fonts:** `"Hanken Grotesk", system-ui, sans-serif` only (flag: not Museo; `system-ui` fallback matches AI-slop signal in gstack checklist).

**Key colours in use (Connect sample):**
- `rgb(0, 38, 94)` — primary (not spec `#0e3b83`)
- `rgb(14, 59, 131)` — primary-container (matches MIF Blue)
- `rgb(254, 152, 18)` — secondary CTA
- `rgb(27, 27, 28)` — body/headings
- `rgb(252, 249, 249)` — page surface

**Heading scale:** h1 landing 48px/700 — good size; weight map doesn’t match Museo scale (700/500/300/100).

**Touch targets:** Filter pills on Connect are **w×h ≈ 62–103 × 34px** — below 44px minimum for mobile (Category 5 / Mobile rules).

---

## Litmus checks (Brand Guidelines + gstack)

| Check | Landing | App (Home/Connect/Mentor) |
|-------|---------|---------------------------|
| Brand/product unmistakable in first screen? | **No** — “NGN Portal” + N glyph, not MIF band lockup | **Partial** — sub-brand label only |
| One strong visual anchor? | Headline yes; brand anchor weak | Sidebar + data cards |
| Scannable by headlines only? | **Yes** | **Yes** |
| Each section one job? | **Mostly** — stats band mixes metrics + dev note | **Yes** |
| Cards necessary? | Stats + pillars = card-heavy | Directory = card grid (earned for browse) |
| Motion improves hierarchy? | Static (no intentional motion audited) | Static |
| Premium without decorative shadows? | Shadows on stat cards — moderate chrome | Card shadows + coloured top borders |

**Classifier:** Landing = **MARKETING**; signed-in routes = **APP UI**. App UI follows calm hierarchy reasonably; landing leans generic SaaS hero + feature cards.

---

## Findings (prioritised)

### High impact

**FINDING-001 — Wrong typeface (brand mandatory)**  
- **Category:** Typography / Brand  
- **I notice…** All UI uses Hanken Grotesk from Google Fonts.  
- **Brand rule:** Museo Sans is the sole MIF digital typeface (PDF p.11–12).  
- **Fix:** License/load Museo Sans; map weights 100/300/500/700 to design tokens; keep Noto Sans for Arabic per PDF.  
- **Files:** `app/layout.tsx`, `tailwind.tokens.ts`, `globals.css`

**FINDING-002 — MIF logo lockup not implemented**  
- **Category:** Brand / Visual identity  
- **I notice…** Header/sidebar use a blue square with “N” (`/brand/logo.svg`), not the colourful band + wordmark.  
- **Brand rule:** Primary logo is left-aligned band + typography; secondary single-colour on coloured surfaces (PDF p.7–10).  
- **Fix:** Drop in approved SVGs per `public/brand/README.md`; use `BrandLockup` with left alignment; retire CSS-only glyph on landing.  
- **Evidence:** landing desktop screenshot, `brand-lockup.tsx`

**FINDING-003 — Afro patterns are placeholders, not brand patterns**  
- **Category:** Brand / Visual elements  
- **I notice…** Hero uses `HeroMosaic` gradient rectangles; `bg-afro-pattern` is radial CSS, not Afro square tiles/backdrops (PDF p.17, 23–28).  
- **Brand rule:** Afro font for display, patterns, hero/empty states; combined with Museo when used as type.  
- **Fix:** Import Afro assets or approved tile SVGs; replace mosaic and radial utility with guideline backdrops at low opacity.

**FINDING-004 — Production-visible implementation note on landing**  
- **Category:** Content / Trust  
- **I notice…** “Partner and alumni marks ship here when brand supplies vector assets…”  
- **Impact:** Depletes goodwill; reads as unfinished to members and MIF stakeholders.  
- **Fix:** Remove or gate behind `NODE_ENV === 'development'`; replace with partner marks or omit section until assets exist.  
- **File:** `app/(public)/landing/page.tsx` (lines 162–167)

### Medium impact

**FINDING-005 — Primary colour token drift from MIF Blue**  
- **I think…** `primary: #00265e` drives nav, links, and theme-color; brand primary is `#0e3b83`.  
- **Fix:** Align `primary` / `themeColor` to `#0e3b83`; reserve tints (`#41589a`, `#c2c4e0`) per PDF grey/blue page.

**FINDING-006 — Body and surface neutrals don’t match MIF greys**  
- Spec: `#343c42` body, `#f2efef` / `#ede8e2` backgrounds.  
- App: `#1b1b1c` / `#fcf9f9` Material-style surfaces.  
- **Fix:** Map semantic text/background tokens to brand greys in `tailwind.tokens.ts`.

**FINDING-007 — Icon-in-circle feature cards (AI slop adjacent)**  
- **I notice…** “What you can do” uses Lucide icons in `rounded-full bg-primary/10` circles (PDF anti-pattern: icons in coloured circles as decoration).  
- **Fix:** Use Afro accent, photography, or typographic hierarchy instead; or icon + text without circle container.

**FINDING-008 — Section colour strategy (PRD palettes) not applied**  
- PRD assigns Palette 1 (orange+blue) to mentorship, Palette 3 (greens) to directory.  
- Connect uses orange tier pills but overall chrome is neutral/grey, not green-grounded directory mood.  
- **Fix:** Thematic section tokens per route (e.g. Connect header band `80% MIF Green` / `#617434` accents).

**FINDING-009 — Filter chip touch targets (mobile)**  
- Pills ~34px tall on Connect.  
- **Fix:** `min-h-11` (44px) + adequate horizontal padding on filter controls.

### Polish

**FINDING-010 — Orange CTA hex mismatch**  
- `#fe9812` vs brand `#f39000` — minor; align `secondary-container` to spec.

**FINDING-011 — Hero decorative mosaic**  
- Reads as stock placeholder grid, not editorial photography or Afro backdrop.  
- **Fix:** Photography from MIF library or approved pattern per PDF “Backdrops”.

**FINDING-012 — Success/error semantics**  
- Success green `#3c7a2f` vs MIF Green `#4c5c0f` / Lime `#c5b300` — align status badges to brand semantics.

---

## Cross-page consistency

| Element | Landing | App shell |
|---------|---------|-----------|
| Lockup | CSS `N` + “NGN Portal” | `BrandLockup` + SVG (still N-only) |
| CTA orange | Yes | Yes (buttons, accents) |
| Card pattern | Stat trio + pillar cards | Profile/pair cards |
| Nav | Top bar only | Sidebar + bottom bar (mobile) |

Tone is consistent; **brand assets** are not.

---

## Category grades

| Category | Grade | Notes |
|----------|-------|-------|
| Visual hierarchy | B | Clear headings, CTAs, dashboard structure |
| Typography | **D** | Wrong family vs brand |
| Color & contrast | C+ | MIF blue/orange present; tokens drift |
| Spacing & layout | B | Consistent grid, readable density |
| Interaction states | B- | Focus rings; filter chips undersized |
| Responsive | B | Stacks well; chip height issue |
| Content & microcopy | C | Dev placeholder on landing |
| AI slop | C | Icon circles, stat cards, gradient mosaic |
| Motion | B | Reduced-motion respected in CSS |
| Performance feel | Not measured | — |
| **Brand compliance** | **D+** | Logo + type + Afro |

**Weighted design score: C**  
**AI slop score: C** — “Avoids the worst AI palette, still template-shaped.”

---

## Quick wins (&lt;30 min each)

1. Remove landing dev copy block (FINDING-004).  
2. Set `secondary-container` / button orange to `#f39000` (FINDING-010).  
3. Bump filter chips to `min-h-11` (FINDING-009).  
4. Point `themeColor` and `primary` to `#0e3b83` (FINDING-005).  
5. Add `DESIGN.md` excerpt from PDF + PRD §3 as source of truth for future PRs.

---

## Recommended fix sequence (when tree is clean)

1. Brand asset drop-in (logo SVGs, favicon, OG) — unlocks FINDING-002.  
2. Museo Sans (+ Noto Arabic) — FINDING-001.  
3. Token pass: blues, greys, semantic status colours — FINDING-005, 006, 012.  
4. Afro backdrops / remove mosaic placeholder — FINDING-003, 011.  
5. Route-level palette accents — FINDING-008.  
6. Re-run `/design-review` in regression mode against this baseline.

---

## PR-ready summary

> Design review against MIF Brand Guidelines: **Design C**, **Brand D+**, **AI slop C**. Main gaps: Museo Sans, MIF logo lockup, Afro patterns; quick remove of landing dev copy.
