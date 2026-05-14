# NGN Portal — Information Architecture & Sitemap

**Version:** 2.0  
**Date:** 4 March 2026  
**Current app snapshot:** 9 May 2026
**Companion to:** NGN Portal Product Requirements Document v2.0  

---

## 1. Navigation Model

### 1.1 Primary navigation (persistent sidebar on desktop, bottom bar on mobile)

The portal uses a persistent sidebar navigation on desktop/tablet and a bottom navigation bar on mobile. The sidebar collapses to icons on tablet.

**Primary nav items in the current app (visible to authenticated users subject to RBAC):**
1. **Home** — personalised dashboard
2. **Connect** — member browse, search, and profiles
3. **Discuss** — spaces, discussion threads, replies, and unread state
4. **Mentor** — personal mentorship hub
5. **Events** — calendar/list across all programmes
6. **Message** — direct messaging inbox

**Secondary / More menu items:**
7. **Admin** — visible only to ExCo, Programme Admin, Foundation Staff (scoped)
8. **Profile** — edit the current user's profile
9. **Settings** — notification preferences, privacy, and account
10. **Legal** — privacy and data actions

**Mobile bottom bar (5 items max):**
Home | Connect | Discuss | Mentor | Events

### 1.2 Breadcrumb navigation

All pages beyond the top level show breadcrumbs:
```
Home > Connect > [Member Name]
Home > Mentor > Group Circles > [Circle Name]
Home > Events > [Event Title]
Home > Admin > Mentorship Management
```

### 1.3 URL structure

All URLs follow a consistent, human-readable pattern:

```
ngn.mo.ibrahim.foundation/
├── /                                    → Home dashboard
├── /login                               → Login page
├── /join?token=xxx                      → Accept invitation / create account
├── /reset-password                      → Password reset
│
├── /connect                             → Member directory browse
├── /connect/[user-slug]                 → Member profile view
├── /connect/edit                        → Edit my profile
│
├── /discuss                             → Discussion-space home and unified feed
├── /discuss/[space-slug]                → Space detail, members, threads
├── /discuss/create-space                → Create discussion space (admin)
├── /discussions                         → Thread list
├── /discussions/create                  → Create thread
├── /discussions/[thread-id]             → Thread detail
│
├── /mentor                              → Mentorship personal dashboard
├── /mentor/browse                       → Browse available mentors
├── /mentor/explore                      → Explore mentorship opportunities
├── /mentor/requests                     → Mentorship requests inbox
├── /mentor/pairings                     → Pairings list
├── /mentor/pairs/[pair-id]              → Pair detail view
├── /mentor/pairs/[pair-id]/intake       → Pair intake and goals
├── /mentor/pairs/[pair-id]/log          → Log a session
├── /mentor/pairs/[pair-id]/survey       → Mid/end programme survey
├── /mentor/circles                      → Browse group circles
├── /mentor/circles/[circle-id]          → Circle detail
├── /mentor/circles/create               → Create circle
├── /mentor/sessions                     → Browse one-to-many sessions
├── /mentor/sessions/[session-id]        → Session detail + registration
├── /mentor/sessions/create              → Create session
├── /mentor/sessions/[session-id]/archive → Past session w/ recording
├── /mentor/sessions/[session-id]/edit   → Edit hosted session
├── /mentor/resources                    → Mentorship resources
│
├── /events                              → Events calendar/list
├── /events/[event-id]                   → Event detail + registration
├── /events/create                       → Create event (admin)
├── /events/[event-id]/archive           → Past event with materials
│
├── /message                             → Message inbox
├── /message/[conversation-id]           → Conversation detail
│
├── /admin                               → Admin overview dashboard
├── /admin/members                       → Member management
├── /admin/members/invite                → Invite member
├── /admin/invitations                   → Invitation queue
├── /admin/mentor                        → Mentorship management
├── /admin/mentor/matching               → Run/review matching
├── /admin/mentor/intake-forms           → Intake form templates
├── /admin/mentor/programmes             → Programme templates
├── /admin/mentor/resources              → Mentorship resources
├── /admin/events                        → Event management
├── /admin/spaces                        → Discussion-space management
├── /admin/reports                       → Reports + exports
│
├── /settings                            → Account settings
├── /settings/notifications              → Notification preferences
├── /settings/privacy                    → Privacy, export, deletion request
├── /settings/security/mfa               → Admin two-factor auth (Supabase MFA: enroll/verify)
```

---

## 2. Complete Screen Inventory

### 2.1 Screen list with classification

Each screen is classified by:
- **Type:** Page (full layout), Form (data input), Modal (overlay), Panel (slide-over)
- **Access:** Who can see this screen
- **Priority:** P1 (Phase 1), P2 (Phase 2), P3 (Phase 3)

| # | Screen | URL | Type | Access | Priority |
|---|--------|-----|------|--------|----------|
| **Public (Unauthenticated)** |
| 01 | Landing / Welcome | `/` (unauth) | Page | Public | P1 |
| 02 | Login | `/login` | Page | Public | P1 |
| 03 | Accept Invitation / Create Account | `/join` | Form | Invited users | P1 |
| 04 | Password Reset | `/reset-password` | Form | Public | P1 |
| **Dashboard** |
| 05 | Home Dashboard | `/` (auth) | Page | All authenticated | P1 |
| **Directory** |
| 06 | Directory Browse | `/connect` | Page | Member+ | P1 |
| 07 | Member Profile View | `/connect/[slug]` | Page | Member+ | P1 |
| 08 | Edit My Profile | `/connect/edit` | Form | All authenticated | P1 |
| **Mentorship** |
| 09 | Mentorship Dashboard (Mentor) | `/mentor` | Page | Members w/ mentees | P1 |
| 10 | Mentorship Dashboard (Mentee) | `/mentor` | Page | Members w/ mentors | P1 |
| 11 | Browse Mentors | `/mentor/browse` | Page | Members | P1 |
| 12 | Send Mentorship Request | Modal from profile or mentor browse | Modal | Members | P1 |
| 13 | Mentee Intake Form | `/mentor/pairs/[id]/intake` | Form | Matched mentees | P1 |
| 14 | Pair Detail View | `/mentor/pairs/[id]` | Page | Pair members + Admin | P1 |
| 15 | Log a Session | `/mentor/pairs/[id]/log` | Form | Pair members | P1 |
| 16 | Programme Survey | `/mentor/pairs/[id]/survey` | Form | Pair members | P3 |
| 17 | Browse Group Circles | `/mentor/circles` | Page | Members | P2 |
| 18 | Circle Detail | `/mentor/circles/[id]` | Page | Circle members | P2 |
| 19 | Create Circle | `/mentor/circles/create` | Form | Admin/Facilitator | P2 |
| 20 | Browse One-to-Many Sessions | `/mentor/sessions` | Page | Members | P2 |
| 21 | Session Detail + Registration | `/mentor/sessions/[id]` | Page | Members | P2 |
| 22 | Create One-to-Many Session | `/mentor/sessions/create` | Form | Mentors/Admin | P2 |
| 23 | Past Session (Recording) | `/mentor/sessions/[id]/archive` | Page | Members | P2 |
| 24 | Skills Trading Browse | Profile skill tags; no standalone route in current app | Page | Members | Backlog |
| 25 | Create Skill Listing | Deferred; profile skill offers/requests are managed through profile data | Form | Members | Backlog |
| **Events** |
| 26 | Events Calendar/List | `/events` | Page | All authenticated | P2 |
| 27 | Event Detail + Registration | `/events/[id]` | Page | All authenticated | P2 |
| 28 | Create Event | `/events/create` | Form | Admin | P2 |
| 29 | Past Event Archive | `/events/[id]/archive` | Page | All authenticated | P2 |
| **Discussions** |
| 30 | Thread List | `/discussions` | Page | Members | P3 |
| 31 | Thread Detail | `/discussions/[id]` | Page | Members | P3 |
| 32 | Create Thread | `/discussions/create` | Form | Admin/Facilitator | P3 |
| **Messages** |
| 33 | Message Inbox | `/message` | Page | Members | P2 |
| 34 | Conversation Detail | `/message/[id]` | Page | Members | P2 |
| **Admin** |
| 35 | Admin Overview Dashboard | `/admin` | Page | ExCo | P1 |
| 36 | Member Management | `/admin/members` | Page | ExCo + Admin (invite) | P1 |
| 37 | Mentorship Management | `/admin/mentor` | Page | ExCo + Admin | P1 |
| 38 | Run Matching Algorithm | `/admin/mentor/matching` | Page | ExCo + Admin | P1 |
| 39 | Event Management | `/admin/events` | Page | ExCo + Admin | P2 |
| 40 | Discussion Space Management | `/admin/spaces` | Page | ExCo + Programme Admin | P2 |
| 41 | Reports + Exports | `/admin/reports` | Page | ExCo + Foundation Staff | P3 |
| **Settings** |
| 42 | Notification Preferences | `/settings/notifications` | Form | All authenticated | P2 |
| 43 | Account Settings | `/settings` | Form | All authenticated | P1 |
| 44 | Admin Two-Factor Auth (MFA) | `/settings/security/mfa` | Form | Admin roles (ExCo, Programme Admin, Foundation Staff) | P1 |

### 2.2 Screen count by phase

| Phase | Screens | Cumulative |
|-------|---------|------------|
| P1: Core | 20 screens | 20 |
| P2: Engagement | 16 screens | 36 |
| P3: Scale | 8 screens | 44 |

---

## 3. Data Relationships

### 3.1 The User Profile as central node

The member profile is the single most important data object in the portal. It connects to every other module:

```
                    ┌──────────────┐
                    │  Expertise   │
                    │  Tags        │
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────┴──────┐   ┌─────┴──────┐   ┌─────┴──────┐
   │ Mentorship  │   │   USER     │   │  Events    │
   │ Pairs       │   │  PROFILE   │   │  Registr.  │
   │ (as mentor  │   │            │   │            │
   │  or mentee) │   │ Name       │   └────────────┘
   └─────┬──────┘   │ Photo      │
         │          │ Bio        │   ┌────────────┐
   ┌─────┴──────┐   │ Country    │   │ Discussion │
   │ Sessions   │   │ Sector     │   │ Posts      │
   │ Goals      │   │ Tier       │   └────────────┘
   │ Surveys    │   │ Languages  │
   └────────────┘   │ Timezone   │   ┌────────────┐
                    │ Skills     │   │ Messages   │
   ┌────────────┐   └─────┬──────┘   └────────────┘
   │ Group      │         │
   │ Circles    │─────────┘          ┌────────────┐
   └────────────┘                    │ Skill      │
                                     │ Listings   │
                                     └────────────┘
```

### 3.2 Mentorship data flow

```
Member fills profile → Sets mentorship availability → Enters programme
                                                            │
                    ┌───────────────────────────────────────┘
                    │
            ┌───────┴────────┐
            │  Intake Form   │ ← Goals, success criteria, preferences
            └───────┬────────┘
                    │
            ┌───────┴────────┐
            │   Matching     │ ← Algorithm suggests + Admin reviews
            └───────┬────────┘
                    │
            ┌───────┴────────┐
            │  Active Pair   │ ← 6-month programme begins
            └───────┬────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    ┌────┴───┐ ┌────┴───┐ ┌───┴────┐
    │Sessions│ │ Goals  │ │Surveys │
    │ Logged │ │Tracked │ │Mid+End │
    └────────┘ └────────┘ └────────┘
                    │
            ┌───────┴────────┐
            │  Completion /  │ ← Evaluation, impact data
            │  Continuation  │
            └────────────────┘
```

### 3.3 Programme area tagging

All content objects (events, discussions, sessions) are tagged with a programme area, enabling cross-portal filtering:

- Mentorship
- In Conversation
- Debates
- Future of Africa
- Insights
- Advisory
- General / Cross-cutting

This tagging system means a member interested in Debates can filter the events calendar, discussion threads, and resource archive to see only debate-related content — without needing a separate workspace.

---

## 4. Global UI Components

### 4.1 Persistent layout shell

Every authenticated page shares a consistent layout:

**Desktop (1024px+):**
```
┌──────────┬──────────────────────────────────────────────┐
│          │  [Breadcrumbs]                    [Notif] [Avatar] │
│  SIDEBAR │──────────────────────────────────────────────│
│          │                                              │
│  [Logo]  │              PAGE CONTENT                    │
│          │                                              │
│  Home    │                                              │
│  Direct. │                                              │
│  Mentor. │                                              │
│  Events  │                                              │
│  Discuss.│                                              │
│  Messages│                                              │
│          │                                              │
│  ─────── │                                              │
│  Admin   │                                              │
│  Settings│                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Tablet (768–1023px):**
Same layout but sidebar collapses to icon-only (48px width), expands on hover/tap.

**Mobile (320–767px):**
```
┌──────────────────────────────────────┐
│ [Logo]          [Notif] [Avatar]     │
│──────────────────────────────────────│
│                                      │
│           PAGE CONTENT               │
│                                      │
│                                      │
│──────────────────────────────────────│
│  🏠    👥    🤝    📅    ⋯          │
│ Home  Dir. Mentor Events More       │
└──────────────────────────────────────┘
```

### 4.2 Common components

| Component | Description | Used on |
|-----------|-------------|---------|
| **Profile Card** | Photo (circle, 48px), name, role, country, 2–3 expertise tags. Click to full profile. | Directory, mentor browse, circle members, search results |
| **Pair Card** | Two profile photos side-by-side, pair status badge, last session date, progress indicator. | Mentorship dashboard, admin management |
| **Event Card** | Programme area colour tag, title, date/time, format badge (virtual/in-person), speaker name(s), registration CTA. | Events calendar, dashboard, session browse |
| **Discussion Card** | Thread title, programme area tag, post count, last activity timestamp, author avatar. | Discussion list, dashboard |
| **Status Badge** | Coloured pill: Active (MIF Lime), At Risk (MIF Red), Pending (Additional Orange), Completed (MIF Blue). | Pair cards, admin tables, goal progress |
| **Empty State** | Afro-font pattern illustration + contextual message + CTA button. | Any list/grid with no items |
| **Notification Bell** | Bell icon in header with unread count badge (MIF Orange). Dropdown shows recent notifications. | Global header |
| **Search Bar** | Full-width input with filter toggles below. Debounced search (300ms). | Directory, events, discussions, skills |
| **Modal** | Centered overlay (max 640px wide) with backdrop blur. Close on escape or backdrop click. | Mentorship request, confirmations, quick actions |
| **Toast** | Bottom-right notification for transient feedback ("Session logged", "Profile saved"). Auto-dismiss 4s. | Global |

### 4.3 Responsive behaviour summary

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Profile cards | 3-column grid | 2-column grid | Single column stack |
| Event cards | 2-column grid | 2-column grid | Single column stack |
| Tables (admin) | Full table | Horizontal scroll | Card-based list |
| Sidebar | Expanded (240px) | Icons only (48px) | Hidden → bottom bar |
| Modals | Centered overlay | Centered overlay | Full-screen sheet |
| Search filters | Inline horizontal | Inline horizontal | Collapsible accordion |
| Forms | 2-column layout | 2-column layout | Single column stack |
