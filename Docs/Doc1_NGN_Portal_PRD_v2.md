# NGN Portal — Product Requirements Document

**Version:** 2.0  
**Date:** 4 March 2026  
**Current app snapshot:** 9 May 2026
**Author:** Nasi Rwigema, Head of Product — The Alliance | Co-President, Now Generation Network  
**Status:** Product source of truth for the current build and upcoming UI/UX prototyping

---

## 1. Executive Summary & Product Vision

### 1.1 Mission statement

The NGN Portal is the digital infrastructure for transforming the Now Generation Network from a manually coordinated alumni community into a proprietary "think-and-do tank" — a self-sustaining platform where Africa's next generation of leaders connect, mentor, debate, publish, and build together.

Today, NGN runs on WhatsApp threads, spreadsheets, and memory. This works at 100 members. It does not work at 350, and it will not work at 500. The portal is the step-change that makes scale possible without losing the intimacy and trust that makes NGN valuable.

### 1.2 Primary value proposition

The portal replaces a £13,600/year third-party mentorship SaaS subscription with a custom-built, MIF-owned platform that does three things the SaaS never could:

1. **Centralises NGN's digital identity.** Every member has a persistent, searchable profile — not a WhatsApp message that scrolls away. The directory becomes the front door to the network.
2. **Scales mentorship without scaling admin.** Automated matching suggestions, session tracking, check-in reminders, and programme surveys mean the Mentorship Committee focuses on quality, not chasing people.
3. **Creates a single home for all NGN activity.** Mentorship, In Conversation sessions, Debates, Future of Africa workshops, Insights magazine, Advisory work — one platform, one login, one place to find everything.

### 1.3 What this is NOT

- **Not a replacement for WhatsApp.** WhatsApp remains the primary communication channel. The portal handles what WhatsApp cannot: structured profiles, mentorship tracking, event management, and persistent knowledge.
- **Not a social network.** There is no feed, no likes, no algorithmic content. This is a professional tool for a professional community.
- **Not a content management system.** The portal links to MIF research and IIAG data but does not replicate it. The Foundation's Drupal site continues to be the home for research publications.

### 1.4 Success metrics (North Star)

| Metric | Target | How measured |
|--------|--------|-------------|
| Admin burden per mentorship pair | Reduced by 50% vs. 2025 manual process | Time-tracking comparison |
| Mentorship match satisfaction | ≥80% positive | Mid-programme survey |
| Member profiles completed | 250+ of ~350 members | Platform data, within 3 months |
| Monthly active users | 150+ | Login + meaningful action |
| Ecosystem participant → NGN applicant conversion | Track and report | Application data |
| Cost vs. SaaS alternative | >90% saving | Annual cost comparison |

### 1.5 Current implementation snapshot

The current production app is a Next.js 16 App Router application backed by Supabase Auth, Postgres, Storage, and SQL migrations. It has moved beyond the original MVP scaffold and now includes the main member, mentorship, discussion, messaging, event, notification, and admin surfaces.

Current top-level product areas:

- **Home** (`/`) — personalised dashboard with onboarding nudges, feed items, suggested members, events, discussions, and admin priority actions.
- **Connect** (`/connect`) — the member directory, profile detail pages, profile editing, follows, endorsements, reporting, and profile visibility rules.
- **Discuss** (`/discuss`, `/discussions`) — discussion spaces, space membership, thread lists, thread details, replies, reactions, bookmarks, unread state, and moderation/reporting hooks.
- **Mentor** (`/mentor`) — mentorship dashboard, browse/explore mentors, requests, pair detail, intake, working agreements, goals, sessions, pulse checks, resources, circles, programme sessions, and mentor/admin operating states.
- **Events** (`/events`) — event discovery, event detail, registration, attendee previews, admin creation/editing, archive materials, and event reminders.
- **Message** (`/message`) — direct conversation inbox, conversation detail, realtime updates, read tracking, forwarding, reactions, quoted replies, link previews, attachment foundations, and presence.
- **Admin** (`/admin`) — member operations, invitations, mentorship operations, matching recommendations, programme templates, intake forms, resources, event operations, discussion spaces, reports, audit-friendly activity, and scoped Foundation Staff access.
- **Settings** (`/settings`) — notification preferences, privacy/data actions, account controls, and admin MFA flows.

For design tools and prototypes, treat this section and `docs/PRODUCT_DOCS_INDEX.md` as the current product baseline. Older roadmap sections remain useful context, but current route names and implementation status should come from the snapshot documents.

---

## 2. User Personas & Access Governance

### 2.1 Role architecture

The portal operates with four permission tiers.

**ExCo (Executive Committee) — ~8–12 people**

The governing body of the NGN. Full strategic oversight of all portal activity. Can view all data across all programmes, approve ecosystem participant applications, manage all user roles, generate reports for MIF leadership, and export data. ExCo members may also serve as mentors.

**Programme Admin — ~15–25 people**

Committee leads and active operational volunteers across the six NGN programme areas (Mentorship, Future of Africa, In Conversation, Insights, Debates, Advisory). Each Programme Admin is scoped to their programme area(s). They can send member invitations, curate mentorship matches, create and manage events, send reminders, view activity data for their programme, and manage discussion threads. Cannot access aggregate cross-programme dashboards.

**Foundation Staff — ~5–10 people**

MIF employees (Research, Communications, Operations) who are not NGN members but need portal access for their work. Scoped access to specific functions: managing event content, reviewing Insights submissions, supporting communications, and viewing reporting data. Cannot browse the member directory, access mentorship data, or send messages to members. This role exists because Foundation staff support NGN's work without being part of the network itself.

**Member (Standard) — ~350 people, scaling over time**

The default experience for all NGN members. Full access to: their own profile, the member directory, mentorship (as mentor, mentee, or both), events across all programme areas, discussion threads, group circles, one-to-many sessions, skills trading, and in-app messaging.

**External Ecosystem Participant — variable**

A limited-access designation for Track 2 mentorship (non-NGN high-potential leaders from partner programmes, alumni networks, and nominated candidates). Can create a profile (flagged as "Ecosystem Participant"), participate in assigned mentorship pairings, and attend specifically invited events. Cannot browse the full directory, access discussions, or message members outside their pairing. Must be approved by ExCo. Conversion pathway: participants who demonstrate commitment can be nominated for full NGN membership.

### 2.2 Member tiers

NGN operates an internal tiering system reflected in profiles and matching logic:

- **Tier 1:** Senior members — typically anchor mentors and programme leads. Drawn from founding cohorts and established leaders.
- **Tier 2:** Active members — can serve as mentors or mentees. The bulk of the network.
- **Tier 3:** Newer members — typically mentees. Most recent cohort entrants.

Tier is visible on profiles, used as a signal in the matching algorithm (mentors from Tier 1–2, mentees from Tier 2–3), and helps Programme Admins identify capacity for new responsibilities.

### 2.3 Permission matrix

| Capability | ExCo | Programme Admin | Foundation Staff | Member | External |
|-----------|------|----------------|-----------------|--------|----------|
| Full directory access | ✅ | ✅ | ❌ | ✅ | ❌ |
| All mentorship data | ✅ | Own programme | ❌ | Own data | Own pairing |
| Create/manage events | ✅ | ✅ | Content only | ❌ | ❌ |
| Discussion threads | ✅ | ✅ | ❌ | ✅ | Invited only |
| In-app messaging | ✅ | ✅ | ❌ | ✅ | Own pair only |
| Admin dashboard | ✅ | Programme-scoped | Reports only | ❌ | ❌ |
| Member management | ✅ | Invite only | ❌ | ❌ | ❌ |
| Export data | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage content/media | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 3. Design System & Brand Guidelines

### 3.1 Relationship to MIF brand

The portal is a sub-brand of the Mo Ibrahim Foundation. It lives at `ngn.mo.ibrahim.foundation` and must feel like a natural extension of the MIF visual identity — but with the energy and modernity appropriate for a youth leadership platform.

### 3.2 Typography

**Primary typeface:** Museo Sans — used for all text across the portal.
- **Museo Sans 700** — headings, buttons, navigation labels
- **Museo Sans 500** — sub-headings, emphasis, card titles
- **Museo Sans 300** — body text, descriptions, form labels
- **Museo Sans 100** — captions, metadata, secondary information

**Arabic fallback:** Noto Sans (Light, Regular, Medium, Bold) — for members whose profiles or content include Arabic text.

**Display accent:** The MIF Afro font may be used sparingly as a decorative element — section dividers, hero banners, loading screens, or empty states. It is never used for body text or navigation.

### 3.3 Colour palette

**Primary colours (from MIF brand)**
| Name | Hex | Usage |
|------|-----|-------|
| MIF Blue | #0e3b83 | Primary brand colour. Navigation, headers, primary buttons, links. |
| MIF Orange | #f39000 | Accent colour. CTAs, highlights, active states, badges. |
| MIF Red | #df1b12 | Alerts, errors, at-risk status indicators. |
| MIF Lime | #c5b300 | Success states, goal completion, positive indicators. |
| MIF Green | #4c5c0f | Secondary success, tier badges (Tier 1). |

**Secondary / UI colours**
| Name | Hex | Usage |
|------|-----|-------|
| 25% MIF Blue | #c2c4e0 | Light backgrounds, card surfaces, section dividers. |
| 80% MIF Blue | #41589a | Secondary text on dark backgrounds, hover states. |
| 65% Additional Red | #f09571 | Warm highlights, mentorship-related accents. |
| 95% Additional Orange | #fbb92d | Warning states, pending status indicators. |
| Background grey | #f2efef | Page background, input fields. |
| Warm grey | #ede8e2 | Alternate section backgrounds, subtle dividers. |
| MIF Dark Grey | #343c42 | Primary body text colour. |
| 95% Black | #2e2d2c | Headings, high-emphasis text. |

**Colour palette combinations (from brand guidelines)**
- **Palette 1 (Orange + Blue):** Used for mentorship-related screens — warm, energetic.
- **Palette 2 (Red + Lime):** Used for events and debates — bold, attention-grabbing.
- **Palette 3 (Green tones):** Used for directory and profiles — grounded, professional.

### 3.4 Visual elements

**Afro font patterns:** The geometric patterns derived from the MIF Afro font (square tiles, backdrops) can be used as:
- Hero section backgrounds on the landing page and dashboard
- Decorative headers on section pages (Directory, Mentorship, Events)
- Loading screen animations
- Empty state illustrations (e.g., "No upcoming events" placeholder)
- Email template headers

These patterns should use the approved colour combinations from the brand guidelines and never compete with content for attention.

**Logo usage:** The MIF logo (colourful band + "Mo Ibrahim Foundation" typography) appears in the portal header, left-aligned per brand guidelines. On coloured backgrounds, the single-colour secondary logo variant is used. The NGN sub-brand identifier (e.g., "Now Generation Network" or the Afro-font "NGN" lockup shown in the brand guidelines) appears alongside.

**Photography:** Member profile photos are displayed in circles (consistent with the rounded band motif of the MIF logo). All other imagery follows MIF's editorial photography style — authentic, high-quality, contextual.

### 3.5 Mobile-first & low-bandwidth requirements

The portal must be designed mobile-first. The majority of NGN members access digital tools primarily via mobile devices, often on variable-quality connections across the African continent.

**Performance targets:**
- Initial page load: <200KB transferred, <3 seconds on 3G
- Time to interactive: <5 seconds on 3G
- Lighthouse performance score: ≥90 on mobile

**Technical approach:**
- Server-side rendering (Next.js Server Components) — minimise client-side JavaScript
- Progressive image loading — profile photos compressed to WebP, lazy-loaded, with low-res placeholders
- Service worker caching — directory profiles and event data available offline after first load
- Responsive breakpoints: Mobile (320–767px), Tablet (768–1023px), Desktop (1024px+)
- Touch targets: minimum 44x44px on all interactive elements
- Font loading: Museo Sans loaded via `font-display: swap` to prevent layout shift

**Connectivity considerations:**
- All forms auto-save progress locally — if connection drops mid-session-log, data is not lost
- Offline indicator — a subtle banner when connectivity is lost, with auto-retry
- Image-free fallback — profile cards show initials + name if photos fail to load
- Minimal animation on mobile — reduce motion for battery and bandwidth

---

## 4. Functional Requirements: Core Modules

### 4.1 Member Directory

The directory is the foundation of the portal. Every other feature depends on rich, complete profiles.

**Profile fields:**
- Full name, profile photo, country of residence, nationality
- Current role, organisation, sector(s)
- Areas of expertise (structured tags from a controlled vocabulary)
- Bio (free text, max 300 words)
- Languages spoken, timezone
- NGN tier, year joined NGN
- Mentorship availability (open to mentoring / seeking a mentor / both / neither)
- Skills offered and skills sought (structured tags)
- LinkedIn URL, personal website (optional)

**Directory features:**
- Searchable by name, keyword (across bio and expertise), and all filterable fields
- Filterable by: country, sector, expertise tags, tier, mentorship availability, language
- Profile card grid view (photo, name, role, country, key tags)
- Full profile view with all fields, mentorship history summary, and contact options
- Admin export to CSV

### 4.2 Mentorship Engine — 1:1 Pairings

**Matching (hybrid model):**
1. **Organic discovery** — members browse profiles and send mentorship requests
2. **Admin curation** — Programme Admins review applications and manually assign pairs
3. **Algorithmic suggestions** — weighted scoring on expertise overlap (30%), sector alignment (20%), goal relevance (20%), timezone proximity (15%), language match (10%), diversity bonus (5%)

The algorithm never auto-matches. It produces ranked suggestions for human review.

**Mentorship lifecycle:**
- Applied → Matched → Active → Mid-Review (3 months) → Completing → Completed / Discontinued
- Each pair commits to a 6-month programme, minimum 1 meeting/month (~1 hour)
- Mentees set 1–3 goals with success criteria at intake
- Sessions are logged by either party: date, duration, summary, progress rating
- Automated reminders at 30 days of inactivity
- Mid-programme survey at 3 months, end-of-programme evaluation at 6 months

**Tracking & reporting:**
- Admin view: all pairs with status, last session, total sessions, progress rating, flags
- Aggregate metrics: active pairs, sessions per pair, goal completion, satisfaction scores, retention

### 4.3 Mentorship — Group Circles

Recurring small groups (4–6 members) around a shared theme or interest. Created by Programme Admins or facilitators with title, theme, max participants, cadence, and duration. Each circle has a schedule, participant list, and attached async discussion thread. Mix of live scheduled sessions and async conversation between meetings.

### 4.4 Mentorship — One-to-Many Sessions

Single events where a mentor or expert presents to a broader audience. Aligned with the "Open Call & Thematic Offering" model from the mentorship plan. Mentors create sessions with topic, date, capacity. Members browse and register. Post-event: recordings and materials uploaded and accessible.

### 4.5 Skills Trading Marketplace

Lightweight ad-hoc boards for members who cannot commit to full 1:1 programmes. Members post skill offers or requests (e.g., "AI training", "Financial planning", "Executive communication"). Others browse by category and connect via direct messaging. System surfaces relevant offers based on profile tags.

### 4.6 Events & Programming

Central hub for all NGN events across all six programme areas. Programme Admins create events with: programme area tag, format (virtual/in-person/hybrid), date/time, speakers, capacity, materials. Members browse a calendar, register, export to personal calendar (iCal), and access post-event recordings and materials.

### 4.7 Async Discussions

Persistent, threaded conversation spaces that complement WhatsApp. Threads are tagged by programme area and optionally linked to a group circle. Members post text, links, and attachments with nested replies. Notifications configurable: immediate, daily digest, or off.

### 4.8 In-App Messaging

Light direct messaging between members. Send from any profile page. Conversation inbox with recency sorting. Email notifications configurable. Reporting mechanism for inappropriate messages.

### 4.9 Admin Dashboard & Reporting

**ExCo dashboard:** Total members by tier/country/sector, mentorship programme health, upcoming events, engagement trends, exportable PDF reports.
**Programme Admin dashboard:** Scoped to their programme area with matching metrics.
**Foundation Staff view:** Event content management and reporting data only.

### 4.10 Notifications & Communication

Configurable notification preferences per member. Channels: in-app, email, and WhatsApp (opt-in). Automated triggers for: mentorship requests, session reminders, event reminders, messages, discussion replies, surveys, and admin announcements. WhatsApp via WhatsApp Business API (Twilio or 360dialog) for critical reminders only.

---

## 5. Technical Architecture

### 5.1 Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | SSR for performance, API routes, React ecosystem |
| Language | TypeScript | Type safety, tooling |
| Styling | Tailwind CSS | Rapid development, consistent design tokens |
| Database | PostgreSQL | Relational, full-text search, proven |
| Backend / Data | Supabase (Postgres + JS client) | Type-safe via generated types; migrations in SQL; single platform for DB + Auth |
| Auth | Supabase Auth | Email/password, invite flow, session cookie; Supabase MFA (TOTP) for admin roles. NextAuth/Auth.js optional future SSO |
| File Storage | Cloudflare R2 or AWS S3 | Per MIF infrastructure |
| Email | Resend | Modern, React templates |
| Hosting | Vercel | Zero-config Next.js, edge functions |
| Analytics | PostHog or Plausible | Privacy-respecting |

### 5.2 Subdomain architecture

The portal is an entirely separate application at `ngn.mo.ibrahim.foundation`. No Drupal dependency. MIF adds a DNS record pointing to the hosting provider. SSL via Cloudflare (already in use). Brand consistency through shared design tokens, not runtime integration.

### 5.3 Cost estimate

~$70/month ($840/year) vs. £13,600/year for the SaaS alternative. Over 95% saving.

---

## 6. Security & Access Control

### 6.1 Authentication
- Email + password (bcrypt), magic link (passwordless) as alternative
- JWT in HTTP-only cookies, 7-day sliding expiry
- Supabase MFA (TOTP) required for ExCo, Programme Admin, and Foundation Staff before admin access; enroll/verify at `/settings/security/mfa`
- Future: SSO with MIF identity provider

### 6.2 Data protection
- GDPR and UK GDPR compliant
- Explicit consent at sign-up
- Data export and deletion on request
- 12-month inactivity flagging, 24-month archival
- TLS in transit, encryption at rest
- Daily backups, 30-day retention

### 6.3 Operational security
- Invite-only (no public registration)
- API rate limiting
- Server-side input validation
- Audit logging for all admin actions
- Automated dependency vulnerability scanning

---

## 7. Integration Points

| Integration | Provider | Purpose |
|------------|----------|---------|
| Email | Resend or SendGrid | Transactional notifications, invitations, surveys |
| WhatsApp | Twilio or 360dialog | Opt-in reminders (mentorship, events) |
| Calendar | iCal (.ics) export | Add events to personal calendars |
| MIF Website | Subdomain + navigation links | Brand consistency, cross-linking |
| Analytics | PostHog or Plausible | Usage tracking, engagement metrics |

---

## 8. Phased Delivery Roadmap

| Phase | Duration | Scope | Milestone |
|-------|----------|-------|-----------|
| 0: Prototype | Weeks 1–2 | Clickable prototype: directory, basic matching, events | Shared with ExCo |
| 1: Core | Weeks 3–8 | Auth, directory, 1:1 mentorship, session logging, admin dashboard, email | Soft launch to ExCo |
| 2: Engagement | Weeks 9–14 | Group circles, one-to-many, skills trading, events calendar, messaging, notifications | Full launch to members |
| 3: Scale | Weeks 15–20 | Surveys, algorithm refinements, discussions, reports, WhatsApp, Track 2 | Programme operational |
| 4: Optimise | Ongoing | SSO, content hub, PWA/mobile, advanced analytics, multi-language | Continuous improvement |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low member adoption | Medium | High | Invest in onboarding UX. Soft launch with early adopters. Make directory immediately useful. |
| "Yet another tool" fatigue | Medium | High | Subdomain integration. WhatsApp stays for chat. Portal handles structured work. |
| Admin team doesn't engage | Medium | High | Minimise friction. Automate everything. Regular training. |
| MIF technical constraints | Low | Medium | Subdomain minimises dependencies. Early tech conversation in Phase 0. |
| Data privacy breach | Low | High | GDPR-compliant. Invite-only. Encryption everywhere. |
| Scope creep | Medium | Medium | This spec is the contract. Phase strictly. |
| Single developer dependency | Medium | Medium | Standard technologies. Document everything. |

---

## 10. Open Questions for MIF Technical Team

1. Where is the MIF website hosted? (AWS, GCP, dedicated?)
2. Does MIF use an identity provider (Azure AD, Google Workspace) for SSO?
3. Specific security or compliance frameworks?
4. Existing Cloudflare CDN configuration for subdomain?
5. Existing vendor relationships (email, cloud) to leverage?
6. Process for adding a subdomain to mo.ibrahim.foundation?
7. Brand asset files (logo SVGs, Museo Sans font files, Afro font files)?

---

## 11. Companion Documents

This PRD is accompanied by two detailed companion documents:

- **Document 2: Information Architecture & Sitemap** — complete screen inventory with hierarchy, navigation model, and URL structure.
- **Document 3: UX Wireframes & Screen Specifications** — screen-by-screen wireframe descriptions with layout annotations, interaction behaviour, and responsive variants for mobile, tablet, and desktop.
