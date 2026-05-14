# NGN Portal — Wireframes Review & Fix Plan

**Version:** 1.0
**Date:** 10 May 2026
**Author:** Review against Doc1 PRD v2.0, Doc2 IA v2.0, Doc3 UX Wireframes, Doc4 Implementation Blueprint, and `Wireframes/ngn_portal/DESIGN.md`.
**Status:** Action plan for the next wireframe iteration. Locks the contracts that the current `Wireframes/` set violates.

---

## 0. How to use this document

Before any more screen design happens, the team needs to agree on five things — the **Locks** in §1–§5. Every existing wireframe is then reviewed against those Locks in the **Reconciliation** in §6 and fixed per the **Per-screen actions** in §7. §8 is the worked example showing how a single misaligned screen becomes a compliant one. §9 lists the screens still missing from the deck. §10 is the recommended sequence.

If you only read one section: §1 (Brand) and §2 (Chrome) — those two unblock everything else.

---

## 1. Brand Lock

The product has one name and one wordmark. It is used identically on every surface.

| Surface | String |
|---|---|
| Product name (long form) | **NGN Portal** |
| Product name (descriptor) | The Now Generation Network Portal |
| Operator | Mo Ibrahim Foundation |
| Domain | `ngn.mo.ibrahim.foundation` |
| Header lockup (auth'd) | `[Logo] NGN Portal` |
| Header lockup (public) | `[Logo] NGN Portal` with sublabel "Mo Ibrahim Foundation" |
| Login subhead | "Sign in to the NGN Portal" |
| Footer | `© 2026 Mo Ibrahim Foundation. All rights reserved.` |

**Banned strings** (currently appearing across wireframes): "Next Gen Network", "Now Generation Network" (as a wordmark — it's the network name, not the product), "MIF Portal", "MIFNGN", "MIF NGN", "MIF NGN Portal", "MentorConnect", "Grow Together", "EventPro", "Professional Events", "DiscussHub", "Member Portal", "Admin Portal" (as a wordmark — admin is a *view*, not a product), "Mo Ibrahim Foundation Network".

**Notification & avatar treatment** in the global header: bell icon with unread count (MIF Orange dot), then circular avatar (40px) opening a profile menu. Identical on every authenticated screen.

---

## 2. Chrome Lock

The shell that wraps every authenticated page. Per Doc2 §1.1 + §4.1, normative version below. Every existing wireframe with chrome must conform.

### 2.1 Desktop sidebar (≥1024px) — single canonical version

```
┌──────────────────────┐
│  [Logo] NGN Portal   │   ← brand lockup, links to /
│                      │
│  🏠  Home            │   /
│  👥  Connect         │   /connect
│  💬  Discuss         │   /discuss
│  🤝  Mentor          │   /mentor
│  📅  Events          │   /events
│  ✉️  Message         │   /message       (badge: unread count)
│                      │
│  ─── divider ───     │
│  🛡  Admin           │   /admin         (conditional — see §2.4)
│                      │
│  ┌────────────────┐  │   ← pinned to bottom of sidebar
│  │ [Avatar]       │  │
│  │ Name           │  │
│  │ Role label     │  │   e.g. "Member" / "ExCo" / "Programme Admin"
│  │ Profile · Set. │  │   menu: Profile, Settings, Legal, Sign out
│  └────────────────┘  │
└──────────────────────┘
```

- Width: 240px expanded.
- Active item: 4px MIF Orange left bar + filled MIF Blue surface tint + bold label.
- Hover: surface-container-low background.
- No "Resources" item, no "Members", no "Directory", no "My Mentorship", no "Community", no "Sessions", no "Skills" — those are *sub-pages*, not top-level nav.

### 2.2 Tablet rail (768–1023px)

Same sidebar collapsed to 64px icons-only. Tooltip on hover. Expands to 240px on click. Same item set, same order.

### 2.3 Mobile bottom bar (<768px) — single canonical version

```
┌──────────────────────────────────────┐
│ [Logo] NGN Portal      [🔔] [Avatar] │   ← global header (56px)
│──────────────────────────────────────│
│                                      │
│           PAGE CONTENT               │
│                                      │
│──────────────────────────────────────│
│  🏠     👥      💬      🤝     📅    │   ← bottom bar (64px, 5 items max)
│ Home  Connect Discuss Mentor Events  │
└──────────────────────────────────────┘
```

- 5 items, fixed: **Home | Connect | Discuss | Mentor | Events**.
- `Message`, `Profile`, `Settings`, `Admin` are reached via the avatar in the header (`Message` gets a badge there) and via the More menu inside Connect/Mentor/etc. when contextually relevant.
- Banned mobile-bar items currently in use: "Resources", "Directory", "Profile", "Network", "Matches", "Inbox", "Courses", "Dashboard". All must be removed.

### 2.4 Conditional items

| Item | Visible to |
|---|---|
| `Admin` (sidebar) | ExCo, Programme Admin, Foundation Staff. Hidden for Members. |
| `Message` badge count | All authenticated. |
| `Settings → Security/MFA` link | ExCo, Programme Admin, Foundation Staff. |

### 2.5 Breadcrumbs

Per Doc2 §1.2, every page below top-level shows breadcrumbs immediately under the global header (desktop) or directly under it (mobile, scrollable). Format: `Home > Connect > [Member Name]`. Currently absent from every wireframe.

### 2.6 Component contract (handoff to engineering)

```
<AppShell>
  <Sidebar items={NAV_ITEMS} role={user.role} />          // desktop + tablet
  <MobileBottomBar items={NAV_ITEMS_MOBILE} />            // mobile only
  <GlobalHeader brand="NGN Portal" notifications avatar />
  <Breadcrumbs trail={...} />
  <main>{page}</main>
</AppShell>
```

A single `<AppShell>` — drawn once, imported by every page. **No screen redraws the chrome.** This is the single most important fix in this document.

---

## 3. Onboarding Lock

Per Doc3 Screen 03, the canonical flow is **5 steps**, not 3 or 4. Every onboarding screen must use the same stepper.

### 3.1 Canonical flow

| # | Title | URL fragment | Spec source |
|---|---|---|---|
| 1 | Account setup | `/join?token=xxx#step=1` | Doc3 §Step 1 |
| 2 | Basic identity | `…#step=2` | Doc3 §Step 2 |
| 3 | Professional context | `…#step=3` | Doc3 §Step 3 |
| 4 | Your story | `…#step=4` | Doc3 §Step 4 |
| 5 | Mentorship preferences | `…#step=5` | Doc3 §Step 5 |

### 3.2 Stepper component contract

- **Desktop:** linear progress bar with 5 numbered nodes, the active node is filled MIF Blue, completed nodes show a check, upcoming nodes are outlined. "Step N of 5: [Title]" text right-aligned.
- **Mobile:** 5 dots, current is MIF Blue filled, completed are MIF Blue filled with a check, upcoming are outline-variant. "Step N of 5" text below.
- **Header:** always reads `Create your NGN Portal account` (top-level page title), with the step title as the H1 inside the form card. Banned page-title strings currently in use: "Account setup", "Create Account", "Accept Invitation", "Tell us about yourself" *as the page title* (it's the step H1, not the page title).
- **Primary CTA:** always `Continue` (steps 1–4) and `Complete profile` (step 5). Never `Next`, `Next Step`, `Save & Continue`. MIF Orange filled per DESIGN.md.
- **Secondary:** always `Back` (steps 2–5), text-only MIF Blue. `Save for later` is an *additional* link on every step (engineering: this is a hard requirement because Doc3 §Interaction says each step auto-saves).
- **No left nav, no "MIFNGN" wordmark, no "Welcome / Basic Info / Experience / Interests / Mentorship" stepper variant.** One stepper, one set of labels.

### 3.3 Mobile and desktop content parity

The same data model applies on both. Mobile is a single-column reflow of the desktop card. The **field set** is identical step-by-step — currently mobile and desktop show different fields per step.

---

## 4. Taxonomy Lock

Three controlled vocabularies are currently inconsistent across wireframes. Lock them once.

### 4.1 Sectors (used in onboarding step 3, profile, directory filter)

Per Doc3 Step 3:

```
Governance · Technology · Finance · Health · Education ·
Energy · Agriculture · Media · Legal · Arts & Culture · Other
```

Currently 3 different sector lists across screens (mobile onboarding, desktop onboarding, desktop directory filter). Replace all with the above. The directory filter uses the same vocabulary — no "Departments / Leadership / Engineering / Marketing".

### 4.2 Programme areas (used in events tabs, discussion spaces, content tagging)

Per Doc1 §1.2 and Doc2 §3.3:

```
Mentorship · In Conversation · Debates · Future of Africa ·
Insights · Advisory · General / Cross-cutting
```

Replace the current ad-hoc tabs ("Workshops", "Networking", "Webinar", "Annual Summit", etc.). "Workshop" can remain as an event *format* (see §4.4) but never as a programme area.

### 4.3 Roles (used in profile badges, admin views, RBAC)

Per Doc1 §2.1, exactly four tiers + an external category:

```
ExCo · Programme Admin · Foundation Staff · Member · Ecosystem Participant
```

Banned badges currently in use: "Senior Mentor", "MIF Fellow 2018", "Top Mentor", "Super Admin", "Lead Mentor". If badges of that flavour are desired they need a separate `mentorship_status` model — not roles — and that needs a PRD addendum before being drawn.

### 4.4 Event formats (orthogonal to programme area)

```
Virtual · In-person · Hybrid
```

Plus an event *type* dropdown if needed: `Webinar · Workshop · Panel · Forum · Mixer · Summit`. These are display facets, not navigation tabs.

### 4.5 Pair status

Per Doc2 §4.2 status badge spec:

```
Active (MIF Lime) · Pending (Additional Orange) ·
At Risk (MIF Red) · Completed (MIF Blue)
```

No "Stalled", "Conflict", "Pending Response", "Senior Mentor" — replace each with the canonical equivalent.

---

## 5. Visual System Lock (deltas from current wireframes)

DESIGN.md is mostly well-followed. The recurring violations:

1. **Primary CTA must be MIF Orange** (`#fe9812` family). The mobile landing page uses MIF Blue for the "Sign In" CTA — fix.
2. **Card top-border accent stripes carry semantic meaning** (Lime = success/category, Red = alert, Blue = informational). Currently applied as random decoration. Either drop the accent or assign meaning per card type.
3. **Decorative geometric pattern at 5–10% opacity, behind content** per DESIGN.md §Layout. Currently at ~25–40% on `mentorship_dashboard_desktop` and `events_list_desktop`.
4. **Avatars are 100% circular** (DESIGN.md §Shapes). Event/media imagery uses `rounded-md` (8px). Currently mixed.
5. **Icon library**: pick one (Heroicons, Phosphor, or Lucide) and ship it. Currently icons render as literal token strings ("MAGNIFYINGGLASS", "MEGA", "PEN", "OPEN") on `directory_browse`, `discussions_desktop`, and `discussions` mobile.
6. **Date format**: pick one and use globally. Recommend `Oct 15, 2026 · 14:00 GMT` for absolute and `2h ago / Yesterday / Mon` for relative.

---

## 6. IA Reconciliation Table

Every existing wireframe folder mapped to its canonical Doc2 route, with a verdict.

**Verdicts:**
- **Keep** — content is on-brief, only minor polish needed.
- **Fix** — keep the screen, fix the named issues.
- **Replace** — start over against the spec; current screen is wrong template or wrong content model.
- **Misfiled** — content is for a different route; rename and reclassify.
- **Merge** — duplicate of another folder; consolidate.

| Folder | Canonical route (Doc2 §) | Verdict | Headline issue |
|---|---|---|---|
| `landing_page_desktop` | Landing `/` (unauth) #01 | Fix | Wrong wordmark ("Next Gen Network"); stats invented; copyright 2023; "Join the Network" CTA implies open signup but PRD §2.2 says invitation-only. |
| `landing_page_mobile` | Landing `/` (unauth) #01 | Replace | Three different brand strings on one screen; corrupted hero graphic; primary CTA wrong colour; stats disagree with desktop. |
| `login` | Login `/login` #02 | Keep | Closest-to-spec screen in the deck. Apply chrome §2.3, swap "Request Access" → "Contact your ExCo representative" to match Doc3 §Invalid token copy. |
| `login_desktop` | Login `/login` #02 | Fix | Two-panel layout is fine; left panel illustration shows "Loggin" misspelling; right panel header should be "Welcome back" + "Sign in to the NGN Portal" to match mobile. |
| `onboarding_account_setup` | `/join?token` Step 1 #03 | Fix | Stepper shows 4 dots — must be 5. Header missing canonical title. |
| `onboarding_account_setup_desktop` | `/join?token` Step 1 #03 | Replace | Shows 3-step flow ("Account Setup / Profile / Verify"). Wrong total. Wrong wordmark "MIFNGN". |
| `onboarding_basic_identity` | `/join?token` Step 2 #03 | Keep | Closest-to-spec onboarding screen. Apply canonical CTA labels. |
| `onboarding_basic_identity_desktop` | `/join?token` Step 2 #03 | Fix | "Step 2 of 4" — must be 5. |
| `onboarding_professional_context` | `/join?token` Step 3 #03 | Fix | Sector taxonomy wrong (§4.1); missing canonical step title. |
| `onboarding_professional_context_desktop` | `/join?token` Step 3 #03 | Fix | "Step 3 of 4" — must be 5. Sector taxonomy wrong. Top-bar wordmark "MIF NGN" wrong. |
| `onboarding_your_story` | `/join?token` Step 4 #03 | Fix | Header says "Create Account" — should be "Your story". |
| `onboarding_your_story_desktop` | `/join?token` Step 4 #03 | Fix | "Step 4 of 5" is correct ✓. Apply chrome §2.1 (currently no sidebar, full-screen — onboarding intentionally has no sidebar; but header needs canonical wordmark). |
| `onboarding_mentorship_preferences` | `/join?token` Step 5 #03 | Fix | Header says "Accept Invitation" — should be "Mentorship preferences". Stepper shows 4 dots — must be 5. CTA copy "Complete Profile" → "Complete profile" (sentence case per other CTAs). |
| `onboarding_mentorship_preferences_desktop` | `/join?token` Step 5 #03 | Replace | Has invented left-nav stepper "Welcome / Basic Info / Experience / Interests / Mentorship" — replace with the canonical horizontal stepper. |
| `home_dashboard` | Home `/` #05 | Fix | Apply chrome §2.3. Bottom nav currently "Home, Events, Mentorship, Profile" → must be canonical 5 items. Quick-actions labels are good. See §8 for the desktop counterpart. |
| `home_dashboard_desktop` | Home `/` #05 | **Replace** | Wrong product entirely ("MentorConnect — Grow Together" with non-NGN sidebar). See worked example §8. |
| `directory_browse` | Connect `/connect` #06 | Fix | Search icon broken (renders "MAGNIFYINGGLASS"). Bottom nav wrong. Sample members are non-African — replace with African leader names (the desktop directory does this correctly). Filter taxonomy is fine in spirit (Country / Sector / Expertise) — align Sector to §4.1. |
| `member_directory_desktop` | Connect `/connect` #06 | Fix | Wordmark wrong ("Member Portal — Admin View"). "Departments" filter taxonomy wrong — replace with §4.1 Sector. "Invite Member" CTA should be Admin-only, currently shown unconditionally. |
| `member_profile_view` | Member Profile `/connect/[slug]` #07 | Replace | Still in placeholder state ("Member Name / Role at Organisation / Tier Badge"). Mockup-grade content needed to match the rest of the deck. |
| `member_profile_desktop` | Member Profile `/connect/[slug]` #07 | Fix | Strong screen overall. Wordmark wrong. "MIF Fellow 2018" / "Top Mentor" badges aren't in the role model — see §4.3. |
| `mentorship_dashboard` | Mentor `/mentor` #09/#10 | Fix | Apply chrome §2.3 (currently "Home, Network, Mentorship, Profile" — wrong). Pair status pills "Pending Response" → "Pending" per §4.5. |
| `mentorship_dashboard_desktop` | Mentor `/mentor` #09/#10 | Fix | Sidebar shows mentor-only sub-nav as primary ("Home, My Pairings, Circles, Sessions, Skills") — these are sub-tabs, not top-level. Apply §2.1. Tab bar within page should be `My Pairings · Circles · Sessions` (drop "Skills" — Doc2 #24 marks Skills as Backlog with no standalone route). |
| `mentorship_pair_detail_desktop` | **Misfiled** — actually `/admin/mentor/pairs/[id]` (admin view of a pair, currently unspec'd as standalone) | Misfiled | Rename folder to `admin_pair_detail_desktop`. The member view is `pair_detail_view`. The admin view should live under Admin, not Mentor. |
| `pair_detail_view` | Pair Detail `/mentor/pairs/[id]` #14 | Fix | Apply chrome §2.3. Pair status copy "On Track" / "At Risk" → align to §4.5 (At Risk ✓, "On Track" → drop or replace with "Active"). |
| `events_list` | Events `/events` #26 | Fix | Apply chrome §2.3 (currently "Home, Events, Resources, Profile" — Resources isn't a top-level area). Tabs "Mentorship / Debates / Workshops" → use Programme Areas §4.2 (drop "Workshops" as a tab). |
| `events_list_desktop` | Events `/events` #26 | Fix | Sidebar wrong (Community ≠ Discuss). Tabs use wrong programme areas. "Create Event" CTA must be Admin-only and live in the page header, not the sidebar. |
| `event_detail` | Event Detail `/events/[id]` #27 | Keep | On-brief mobile. Apply chrome §2.3. |
| `event_detail_desktop` | Event Detail `/events/[id]` #27 | Replace | Wrong template entirely ("EventPro / Professional Events" with Speakers/Sponsors/About sub-nav and "$499/person" ticketing). NGN events are not paid; rebuild against §2.1 chrome with Doc3 Screen 27 spec. |
| `discussions` | Discuss `/discuss` #30 | Fix | Bottom nav wrong (currently "Home, Courses, Discussions, Profile" — Courses is not a product area). Content (sustainable urban, tech hubs, cross-border trade) is good. |
| `discussions_desktop` | Discuss `/discuss` #30 | Replace | Wrong template ("DiscussHub" tech-forum) with React/Sidebar/Accessibility sample threads. Rebuild against §2.1 chrome with Doc3 Screens 30–32 spec. |
| `messages` | Message Inbox `/message` #33 | Fix | Bottom nav wrong (currently "Home, Matches, Inbox, Profile"). Sample names "Mike Ross" reads off-brief. |
| `messages_desktop` | Message Inbox `/message` #33 | Fix | Layout is strong. Replace icon-rail sidebar with §2.1 canonical sidebar (the icon rail loses context — engineering will not build a separate nav for messages). |
| `conversation_detail` | Conversation `/message/[id]` #34 | Keep | On-brief. Add chrome §2.3 (mobile back arrow only is acceptable per Doc2 §4.3 "Modals → Full-screen sheet" pattern). |
| `admin_overview` | Admin Overview `/admin` #35 | Fix | Apply chrome §2.3 with `Admin` highlighted. Bottom nav "Dashboard, Directory, Reports, Settings" — Admin shouldn't have its own bottom-bar variant; reuse the canonical 5 items and let Admin live in the sidebar/avatar menu. |
| `admin_overview_desktop` | Admin Overview `/admin` #35 | Fix | Strongest admin screen. Apply §2.1 sidebar (currently "Overview, Members, Mentorships, Reports, Settings" is the *Admin* sub-nav — fine *within* `/admin`, but the global nav must still be visible above or beside it). Reconcile metric numbers with mobile (28 vs 56 pending). |
| `Wireframes/ngn_portal/DESIGN.md` | n/a | Keep | This is the system spec, not a screen. Add: icon library choice, date format, banned wordmarks. |

**Summary:** 6 Replace, 21 Fix, 5 Keep, 1 Misfiled, 0 Merge. ~80% of the deck needs work; the foundations (DESIGN.md, login mobile, basic identity mobile, conversation detail, event detail mobile) are good starting points.

---

## 7. Per-screen action shortlist

The minimum-viable set of edits to bring the deck to a coherent baseline. Each is one designer-day or less.

### 7.1 Global (do first)
- [ ] Lock the `<AppShell>` component (§2). Render every screen inside it. Stop redrawing chrome.
- [ ] Lock the brand strings (§1). Find/replace every banned wordmark.
- [ ] Lock the icon library (§5.5). Replace every literal token string.
- [ ] Lock the stepper component (§3.2). Replace all 10 onboarding step indicators.

### 7.2 Landing & login (P1 surface)
- [ ] `landing_page_desktop`: change wordmark, copy CTAs to "Sign In" + "I have an invitation" (matching the invitation-only model), correct stats to PRD §1.4 (350 members target, real numbers if available), update copyright year to 2026.
- [ ] `landing_page_mobile`: rebuild using the desktop hero treatment, downscaled. Remove "Now Generation Network" wordmark in body — that's the network name; the product is "NGN Portal". Replace corrupted hero graphic.
- [ ] `login`/`login_desktop`: align headers and CTAs across both. Fix "Loggin" misspelling.

### 7.3 Onboarding (highest-risk P1 flow)
- [ ] All 10 onboarding screens: apply §3 stepper, §3.2 CTA labels, §3.3 field parity. Sector chips on Step 3 use §4.1 vocabulary.
- [ ] Add the missing **invitation accept** screen (`/join?token=xxx` landing, before Step 1 begins) — currently the "Accept Invitation" header floats on the Step 5 screen, suggesting confusion about where this lives.

### 7.4 Home dashboard
- [ ] Replace `home_dashboard_desktop` per worked example §8.
- [ ] `home_dashboard` mobile: apply chrome §2.3.

### 7.5 Connect (directory + profile)
- [ ] `directory_browse`: fix icon, swap to African sample members (port from `member_directory_desktop`), align filter to §4.1.
- [ ] `member_directory_desktop`: wordmark fix, taxonomy fix, gate "Invite Member" by role.
- [ ] `member_profile_view`: rebuild with mockup-grade content (use Dr. Amina Diop or similar, matching desktop).
- [ ] `member_profile_desktop`: wordmark fix, replace badges per §4.3.

### 7.6 Mentor
- [ ] Both mentorship dashboards: chrome fix, status pill vocabulary fix.
- [ ] Rename `mentorship_pair_detail_desktop` → `admin_pair_detail_desktop` (it's the admin view).
- [ ] `pair_detail_view` mobile: chrome fix, status vocab fix.

### 7.7 Events
- [ ] Both event lists: chrome fix, tab taxonomy fix, gate "Create Event" by role.
- [ ] Replace `event_detail_desktop` entirely. **Critical:** remove the `$499/person` price block and "General Admission" treatment — there is no paid-events product.

### 7.8 Discuss
- [ ] Replace `discussions_desktop` entirely. Rebuild thread content against actual NGN topics.
- [ ] `discussions` mobile: chrome fix.

### 7.9 Message
- [ ] Both: chrome fix. Replace "Mike Ross" sample. `messages_desktop` icon-rail → canonical sidebar.

### 7.10 Admin
- [ ] Both admin dashboards: chrome fix, reconcile metric numbers, agree on metric names (recommend: Total Members, Active Pairs, Pending Requests, Avg Programme Duration, Mentorship Health Index).

---

## 8. Worked example — fixing `home_dashboard_desktop`

The most off-brief screen in the deck. Currently rebrands the entire product as "MentorConnect — Grow Together" and uses a sidebar that doesn't exist anywhere else. Here is the corrected spec.

### 8.1 What's wrong (annotated)

| Element on current wireframe | Problem | Fix |
|---|---|---|
| Header wordmark "MentorConnect / Grow Together" | Not the product. | Replace with `[Logo] NGN Portal` per §1. |
| Sidebar items: Home, My Mentorship, Events, Resources, Settings | Wrong nav (3 of 5 items don't match canonical). | Use canonical sidebar §2.1: Home, Connect, Discuss, Mentor, Events, Message, [Admin]. |
| Sidebar bottom: "Sarah Jenkins / Emerging Leader" | "Emerging Leader" is not a role. | Use role per §4.3 (Member, Programme Admin, ExCo, etc.). |
| Page H1: "Welcome back, Sarah!" | Acceptable, but spec says `Good morning, [First Name]` per Doc3 Screen 05 layout. | "Good morning, Sarah" with timezone-aware greeting. |
| 3 quick action buttons: Message Mentor, Log Meeting, Find Resources | Mismatched with mobile (which shows Browse Directory, Find a Mentor, Edit Profile, Browse Skills). | Use Doc3 Screen 05 quick-actions: Browse Directory · Find a Mentor · Edit My Profile · Browse Skills (4 actions, 2×2 grid). |
| "Active Mentorship" card with "View Goals →" link | OK shape, but missing required fields per Doc3: Next milestone, Sessions logged X/Y, Goals on track Y/Z. | Add: `Next milestone: Mid-programme check-in (12 days)`, `Sessions logged: 3/6`, `Goals: 1/3 on track`, two CTAs `[Log a Session] [View Pair]`. |
| "David Chen — Senior Mentor" badge | "Senior Mentor" not in role model. | Drop badge or replace with `Mentor` (relationship label, not role). |
| "Recent Activity" feed in right column | Spec calls this `Activity` and it sits next to `Quick Actions` per Doc3 Screen 05. | Keep but rename header to `Activity`. |
| No breadcrumbs | Required per §2.5. | Add `Home` (single crumb on dashboard, or omit since this *is* Home). |
| No notification bell | Required per §1. | Add bell + avatar in top-right. |

### 8.2 Corrected layout (ASCII per Doc3 Screen 05 §Layout — Desktop)

```
┌──────────┬──────────────────────────────────────────────────────────┐
│          │  Good morning, Sarah                       [🔔 3] [👤]   │
│ [Logo]   │──────────────────────────────────────────────────────────│
│ NGN      │                                                          │
│ Portal   │  ┌──── MY MENTORSHIP ───────────────────────────────┐   │
│          │  │ [Photo] David Chen · Mentor                      │   │
│ 🏠 Home● │  │ Pair: Cohort '24 · Established Jan 2026          │   │
│ 👥 Conn. │  │ Next milestone: Mid-programme check-in (12 days) │   │
│ 💬 Disc. │  │ Sessions logged: 3/6  ·  Goals: 1/3 on track    │   │
│ 🤝 Ment. │  │ [Log a Session]  [View Pair]                     │   │
│ 📅 Evts  │  └──────────────────────────────────────────────────┘   │
│ ✉  Msg 2 │                                                          │
│          │  ┌──── UPCOMING EVENTS ─────────────────────────────┐   │
│ ───      │  │ [Event Card 1]   [Event Card 2]   [Event Card 3] │   │
│ 🛡 Admin │  │ View all events →                                 │   │
│          │  └──────────────────────────────────────────────────┘   │
│ ┌──────┐ │                                                          │
│ │[👤]  │ │  ┌─── QUICK ACTIONS ──┐  ┌─── ACTIVITY ──────────────┐  │
│ │Sarah │ │  │ Browse Directory   │  │ • New thread: "Cross-     │  │
│ │Jenk. │ │  │ Find a Mentor      │  │   border trade ag…" 2h    │  │
│ │Member│ │  │ Edit My Profile    │  │ • Message: David Chen 4h  │  │
│ └──────┘ │  │ Browse Skills      │  │ • Event recap: Q3 forum   │  │
│          │  └────────────────────┘  └───────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────────┘
```

This is the same screen, on-brief. Every other broken desktop screen follows the same pattern: replace the wordmark, swap to the canonical sidebar, then keep the page-content innovations the designer has already invented.

---

## 9. Missing screens (P1 from Doc2 §2.1, not yet in the deck)

These exist in spec but have no wireframe. Add to the next iteration:

| # | Screen | Route | Why blocking |
|---|---|---|---|
| 03 | Accept Invitation landing | `/join?token=xxx` | This is the *only* way in (invitation-only). Without it the onboarding is unreachable. |
| 04 | Password Reset | `/reset-password` | P1, two states (request + complete). |
| 08 | Edit My Profile | `/connect/edit` | All authenticated users need this. |
| 12 | Send Mentorship Request modal | (modal from `/connect/[slug]`) | The "Request Mentorship" CTA on the profile leads nowhere. |
| 13 | Mentee Intake Form | `/mentor/pairs/[id]/intake` | Critical mentorship-flow step. |
| 15 | Log a Session | `/mentor/pairs/[id]/log` | Top-of-stack CTA on dashboard, currently has no destination. |
| 36 | Member Management | `/admin/members` | P1 admin page. |
| 37 | Mentorship Management | `/admin/mentor` | P1 admin page. |
| 38 | Run Matching | `/admin/mentor/matching` | The PRD value-prop hinges on this. |
| 43 | Account Settings | `/settings` | Where does `Sign out` live? Where does notification preference live? |
| 44 | Admin MFA setup | `/settings/security/mfa` | Doc4 §3.8 makes this mandatory before first admin action. |

Plus four states that should be drawn at least once each so engineering knows the pattern:

| State | Recommended host screen |
|---|---|
| Empty state | `directory_browse` (no results found) |
| Loading skeleton | `home_dashboard` (data loading) |
| Error state | `event_detail` (event not found) |
| Permission-denied state | `admin_overview` viewed as Member |

---

## 10. Recommended sequence

In strict order. Don't start step N+1 before step N is signed off, because each step locks contracts that step N+1 depends on.

1. **Brand & Chrome lock (§1, §2)** — agree the strings, agree the shell. One designer, one day.
2. **Onboarding lock (§3)** — agree the 5-step stepper component. One designer, half a day.
3. **Taxonomy lock (§4)** — circulate the four vocabularies for sign-off (PM owns; this is a product decision, not a design decision).
4. **Worked example (§8)** — fix `home_dashboard_desktop` first as the reference implementation. Get it approved.
5. **Per-screen pass (§7)** — apply locks to the remaining 35 screens. ~3–4 designer-days.
6. **Missing screens (§9)** — add the 11 P1 screens and 4 states. ~2 designer-days.
7. **Eng handoff** — at this point the deck is a spec. Engineering can scaffold the `<AppShell>` and start consuming screens.

Total estimate to baseline: **~7–8 designer-days** (one person, one calendar week with some buffer). Without these locks, every additional screen multiplies the inconsistency rather than reducing it.

---

## Appendix A — Quick reference: legal vs banned strings

| Concept | ✓ Use | ✗ Banned |
|---|---|---|
| Product name | NGN Portal | Next Gen Network, Now Generation Network (as wordmark), MIF Portal, MIFNGN, MIF NGN, MentorConnect, EventPro, DiscussHub, Member Portal, Admin Portal |
| Network name | Now Generation Network (in body copy) | NGN (only after first use) |
| Operator | Mo Ibrahim Foundation | MIF (only after first use) |
| Member tabs/nav | Home · Connect · Discuss · Mentor · Events · Message | Directory, Members, Network, Community, Matches, Inbox, Resources, Courses, My Mentorship, My Pairings, Sessions, Skills, Circles |
| Onboarding steps | Account setup · Basic identity · Professional context · Your story · Mentorship preferences | Profile · Verify · Welcome · Basic Info · Experience · Interests |
| Roles | ExCo · Programme Admin · Foundation Staff · Member · Ecosystem Participant | Senior Mentor · Top Mentor · MIF Fellow · Super Admin · Lead Mentor · Emerging Leader |
| Pair status | Active · Pending · At Risk · Completed | Stalled · Conflict · Pending Response · On Track · Halfway there |
| Primary CTA copy (onboarding) | Continue · Complete profile | Next · Next Step · Save & Continue |
| Date format | Oct 15, 2026 · 14:00 GMT (absolute) / 2h ago (relative) | mixed Oct 15 / October 15, 2024 / Oct 15, 2024 |

---

*End of Doc5. Once §1–§5 are signed off, the rest is mechanical.*
