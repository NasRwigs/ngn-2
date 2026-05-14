# NGN Portal — UX Wireframes & Screen Specifications

**Version:** 2.0  
**Date:** 4 March 2026  
**Companion to:** NGN Portal PRD v2.0 and Information Architecture v2.0  

---

## How to read this document

Each screen specification includes:

1. **Purpose** — what the screen does and why it exists
2. **Layout** — ASCII wireframe showing spatial arrangement
3. **Content inventory** — every element on the screen
4. **Interaction behaviour** — what happens when users act
5. **Responsive variants** — how layout adapts for mobile, tablet, desktop
6. **States** — empty, loading, error, and edge cases
7. **Design notes** — brand-specific styling guidance

---

## Screen 01: Landing / Welcome Page

**URL:** `/` (unauthenticated)  
**Type:** Page  
**Access:** Public  

### Purpose
The first thing anyone sees when visiting `ngn.mo.ibrahim.foundation`. It must communicate what the NGN Portal is, establish trust through the MIF brand, and funnel visitors to login or accept an invitation. This is not a marketing page — only invited members will ever use it.

### Layout — Desktop (1024px+)
```
┌────────────────────────────────────────────────────────────────┐
│ [MIF Logo]                              [Login Button]         │
│────────────────────────────────────────────────────────────────│
│                                                                │
│              ┌──────────────────────────────────┐              │
│              │                                  │              │
│              │    AFRO PATTERN HERO BANNER       │              │
│              │    (Colour palette #1: Orange+Blue)│             │
│              │                                  │              │
│              │   "Now Generation Network"        │              │
│              │    [Afro font, display size]      │              │
│              │                                  │              │
│              │   "The digital home for Africa's  │              │
│              │    next generation of leaders"    │              │
│              │    [Museo Sans 300, 20px]         │              │
│              │                                  │              │
│              │   [Sign In] [I have an invite]   │              │
│              │                                  │              │
│              └──────────────────────────────────┘              │
│                                                                │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │  📁 350+     │  │  🤝 100+     │  │  🌍 25+      │       │
│   │  Members     │  │  Mentorship  │  │  Countries   │       │
│   │  across the  │  │  pairs       │  │  represented │       │
│   │  network     │  │  active      │  │              │       │
│   └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│   ┌────────────────────────────────────────────────────┐      │
│   │  Mo Ibrahim Foundation                              │      │
│   │  mo.ibrahim.foundation | Privacy | Contact          │      │
│   └────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────┘
```

### Layout — Mobile (320–767px)
```
┌──────────────────────────────┐
│ [MIF Logo]         [Login]   │
│──────────────────────────────│
│                              │
│  AFRO PATTERN HERO           │
│  (full-width, 40vh)          │
│                              │
│  "Now Generation Network"    │
│  [Afro font, scaled down]    │
│                              │
│  "The digital home for       │
│   Africa's next generation   │
│   of leaders"                │
│                              │
│  [Sign In — full width]      │
│  [I have an invite — link]   │
│                              │
│──────────────────────────────│
│  350+ Members                │
│  100+ Mentorship pairs       │
│  25+ Countries               │
│──────────────────────────────│
│  Footer                      │
└──────────────────────────────┘
```

### Content inventory
- MIF logo (primary, colourful band variant) — top left
- Login button — top right, Museo Sans 500, MIF Blue outline
- Hero banner — Afro font pattern background using Palette #1 (Orange + Blue)
- Heading: "Now Generation Network" — Afro font (display use only), MIF Blue or white depending on background
- Subheading — Museo Sans 300, 20px desktop / 16px mobile
- Two CTAs: "Sign In" (primary, MIF Orange fill) and "I have an invitation" (secondary, outline)
- Three stat cards with icons — Museo Sans 500 for numbers, 300 for labels
- Footer — MIF logo, links to main site, privacy policy, contact

### Interaction behaviour
- "Sign In" → navigates to `/login`
- "I have an invitation" → navigates to `/join` (prompts for invitation token if not in URL)
- Stats are static — pulled from Supabase (cached and updated daily)

### States
- **Default:** As described above
- **Loading:** Skeleton placeholder for stat numbers (grey pills)
- **Error:** If stats fail to load, hide the stats section entirely — the page still works

### Design notes
- The hero should feel warm and inviting — this is the front door. Use the MIF Orange + Blue combination.
- The Afro font "NGN" lockup from page 28 of the brand guidelines can be used as the hero centrepiece.
- Ensure contrast ratios meet WCAG AA on all text over pattern backgrounds.

---

## Screen 02: Login

**URL:** `/login`  
**Type:** Page  
**Access:** Public  

### Purpose
Simple, fast login. Members may not visit frequently, so magic link (passwordless) should be equally prominent to password login.

### Layout — Desktop
```
┌────────────────────────────────────────────────────────────────┐
│ [MIF Logo]                                                     │
│────────────────────────────────────────────────────────────────│
│                                                                │
│  ┌─── LEFT PANEL (50%) ───────┐  ┌─── RIGHT PANEL (50%) ──┐  │
│  │                             │  │                         │  │
│  │  AFRO PATTERN               │  │  "Welcome back"         │  │
│  │  (decorative, Palette #3)   │  │  [Museo Sans 700, 28px] │  │
│  │                             │  │                         │  │
│  │                             │  │  [Email input]          │  │
│  │                             │  │  [Password input]       │  │
│  │                             │  │  [Forgot password?]     │  │
│  │                             │  │                         │  │
│  │                             │  │  [Sign In — button]     │  │
│  │                             │  │                         │  │
│  │                             │  │  ─── or ───             │  │
│  │                             │  │                         │  │
│  │                             │  │  [Send me a magic link] │  │
│  │                             │  │                         │  │
│  │                             │  │  Don't have an account? │  │
│  │                             │  │  [I have an invitation] │  │
│  │                             │  │                         │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Layout — Mobile
```
┌──────────────────────────────┐
│ [MIF Logo — centered]        │
│──────────────────────────────│
│                              │
│  "Welcome back"              │
│                              │
│  [Email input]               │
│  [Password input]            │
│  [Forgot password? — link]   │
│                              │
│  [Sign In — full width]      │
│                              │
│  ─── or ───                  │
│                              │
│  [Send me a magic link]      │
│                              │
│  Don't have an account?      │
│  [I have an invitation]      │
│                              │
└──────────────────────────────┘
```

### Content inventory
- MIF logo — top
- Decorative panel (desktop only) — Afro pattern, Palette #3 (Green tones)
- Heading: "Welcome back" — Museo Sans 700, 28px, #2e2d2c
- Email input — label "Email address", Museo Sans 300, border #c2c4e0, focus border MIF Blue
- Password input — with show/hide toggle
- "Forgot password?" — text link, MIF Blue, navigates to `/reset-password`
- Sign In button — full-width within form area, MIF Orange fill, white text, Museo Sans 700
- Divider — "or" with horizontal lines
- Magic link button — outline style, MIF Blue border
- Invitation link — text link

### Interaction behaviour
- Email + password submit → POST to auth endpoint → success redirects to `/` (dashboard) | failure shows inline error below password field
- Magic link → enter email → POST → success shows "Check your email" confirmation screen | failure shows "This email isn't registered"
- Forgot password → navigates to `/reset-password`
- All inputs validate on blur (email format, password not empty)

### States
- **Default:** Empty form
- **Loading:** Button shows spinner, inputs disabled
- **Error:** Red border on invalid field, error message below in MIF Red, Museo Sans 300, 14px
- **Magic link sent:** Form replaced with confirmation message + email icon + "Check your inbox" + "Resend" link

---

## Screen 03: Accept Invitation / Create Account

**URL:** `/join?token=xxx`  
**Type:** Multi-step form  
**Access:** Users with valid invitation token  

### Purpose
Guided onboarding that creates the account AND builds the member profile in one flow. This is the most important conversion moment — if this is painful, adoption dies.

### Layout — Desktop (stepped wizard)
```
┌────────────────────────────────────────────────────────────────┐
│ [MIF Logo]                                                     │
│────────────────────────────────────────────────────────────────│
│                                                                │
│   Step 1 of 5  ●───●───○───○───○  [progress bar]              │
│                                                                │
│   ┌────────────────────────────────────────────────────┐       │
│   │                                                    │       │
│   │  STEP CONTENT AREA                                 │       │
│   │  (varies by step — see below)                      │       │
│   │                                                    │       │
│   │                                                    │       │
│   │                                                    │       │
│   └────────────────────────────────────────────────────┘       │
│                                                                │
│   [Back]                                    [Next — button]    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Step content

**Step 1: Account setup**
- "Create your account" heading
- Email (pre-filled from invitation, read-only)
- Password (with strength indicator)
- Confirm password

**Step 2: Basic identity**
- "Tell us about yourself" heading
- Full name (first + last)
- Profile photo (upload with crop tool, or skip for now)
- Country of residence (dropdown with search)
- Nationality (dropdown with search)

**Step 3: Professional context**
- "What do you do?" heading
- Current role/title
- Organisation
- Sector(s) (multi-select from controlled list: Governance, Technology, Finance, Health, Education, Energy, Agriculture, Media, Legal, Arts & Culture, Other)
- Areas of expertise (tag input, type-ahead from controlled vocabulary, max 8)

**Step 4: Your story**
- "Introduce yourself to the network" heading
- Bio (text area, max 300 words, with character count)
- Prompt text: "What drives your work? What are you passionate about? What would you want other NGN members to know about you?"
- Languages spoken (multi-select)
- Timezone (auto-detected with override option)
- LinkedIn URL (optional)
- Personal website (optional)

**Step 5: Mentorship preferences**
- "How would you like to engage with mentorship?" heading
- Radio: I'd like to mentor others / I'm looking for a mentor / Both / Not right now
- If mentor: "Skills and experience you can offer" (tag input)
- If mentee: "Skills and experience you're looking for" (tag input)
- "You can change this anytime from your profile."

### Layout — Mobile
Same 5-step flow but each step is full-width single-column. Progress bar becomes dots at top. Back/Next buttons are sticky at bottom of viewport.

### Interaction behaviour
- Token validation on page load — invalid/expired token shows error page with "Contact your ExCo representative"
- Each step auto-saves to local storage — if connection drops, progress is not lost
- Photo upload: click area opens file picker, then shows crop tool (square aspect ratio). Skip option always visible.
- Tag inputs: type-ahead search against controlled vocabulary, can also add free-text tags
- "Next" validates current step before advancing
- Final "Complete" → creates account + profile → redirects to dashboard with welcome toast

### States
- **Invalid token:** Error page — "This invitation link has expired or is invalid. Please contact your ExCo representative for a new invitation."
- **Loading:** Skeleton for pre-filled email
- **Validation error:** Inline below relevant field, MIF Red
- **Photo uploading:** Progress bar overlay on photo area
- **Completed:** Redirect to dashboard with confetti or warm welcome animation (subtle)

### Design notes
- This flow should feel premium. The quality of this experience sets the tone for everything that follows.
- Use generous whitespace. One thing at a time. Never overwhelming.
- Photo crop tool should work on mobile — touch-friendly handles.

---

## Screen 04: Password Reset

**URL:** `/reset-password`  
**Type:** Form  
**Access:** Public  

### Purpose
Simple email-based password reset.

### Layout — Desktop & Mobile
Identical to login screen right panel (desktop) / full-screen (mobile), but with:
- Heading: "Reset your password"
- Email input
- "Send reset link" button
- "Back to login" link

### Interaction behaviour
- Submit → POST → always shows "If that email exists, we've sent a reset link" (don't reveal whether email is registered)
- Reset link email contains token-based URL → lands on form with new password + confirm password
- After successful reset → redirect to login with success toast

---

## Screen 05: Home Dashboard

**URL:** `/` (authenticated)  
**Type:** Page  
**Access:** All authenticated  

### Purpose
The personalised landing page after login. Surfaces the most relevant, actionable information. Different content depending on role and activity.

### Layout — Desktop
```
┌──────────┬──────────────────────────────────────────────────────┐
│          │  Good morning, [First Name]           [🔔 3] [👤]   │
│ SIDEBAR  │──────────────────────────────────────────────────────│
│          │                                                      │
│          │  ┌──── MY MENTORSHIP (if active) ─────────────────┐ │
│          │  │                                                 │ │
│          │  │  [Mentor/Mentee photo]  [Name]                  │ │
│          │  │  Next milestone: Mid-programme check-in (12 days)│ │
│          │  │  Sessions logged: 3/6  |  Goals: 1/3 on track  │ │
│          │  │  [Log a Session]  [View Pair Detail]            │ │
│          │  │                                                 │ │
│          │  └─────────────────────────────────────────────────┘ │
│          │                                                      │
│          │  ┌──── UPCOMING EVENTS ───────────────────────────┐ │
│          │  │                                                 │ │
│          │  │  [Event Card 1]  [Event Card 2]  [Event Card 3]│ │
│          │  │                                                 │ │
│          │  │  [View all events →]                            │ │
│          │  └─────────────────────────────────────────────────┘ │
│          │                                                      │
│          │  ┌──── QUICK ACTIONS ─────┐  ┌──── ACTIVITY ─────┐ │
│          │  │                         │  │                    │ │
│          │  │  [Browse Directory]     │  │  [Recent thread]   │ │
│          │  │  [Find a Mentor]        │  │  [Recent thread]   │ │
│          │  │  [Edit My Profile]      │  │  [New message]     │ │
│          │  │  [Browse Skills]        │  │  [Event recap]     │ │
│          │  │                         │  │                    │ │
│          │  └─────────────────────────┘  └────────────────────┘ │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Layout — Mobile
```
┌──────────────────────────────┐
│ [Logo]          [🔔 3] [👤] │
│──────────────────────────────│
│                              │
│ Good morning, [First Name]   │
│                              │
│ ┌─ MY MENTORSHIP ──────────┐│
│ │ [Photo] [Name]            ││
│ │ Sessions: 3/6             ││
│ │ [Log a Session — btn]     ││
│ └───────────────────────────┘│
│                              │
│ UPCOMING EVENTS              │
│ ┌─ [Event Card 1] ─────────┐│
│ └───────────────────────────┘│
│ ┌─ [Event Card 2] ─────────┐│
│ └───────────────────────────┘│
│ [View all events →]         │
│                              │
│ RECENT ACTIVITY              │
│ [Thread notification]        │
│ [Message notification]       │
│                              │
│──────────────────────────────│
│  🏠    👥    🤝    📅    ⋯  │
└──────────────────────────────┘
```

### Content inventory
- Greeting: "Good morning/afternoon/evening, [First Name]" — Museo Sans 700, 24px, #2e2d2c. Time-of-day aware.
- Notification bell with unread count
- **My Mentorship card** (conditional — only if member has active pairing): partner's photo + name, next milestone, session count, goal status, CTAs
- **Upcoming Events** (next 3 across all programme areas): event cards in horizontal scroll (mobile) or 3-column grid (desktop)
- **Quick Actions** (4 shortcut buttons): contextual based on role and activity state
- **Recent Activity** (last 5 items): notifications feed — new discussion posts, messages, event recaps, mentorship reminders

### Interaction behaviour
- Mentorship card → "Log a Session" navigates to session log form; "View Pair Detail" to pair page
- Event cards → click to event detail
- Quick action buttons → direct navigation
- Activity items → click navigates to source (thread, message, event)
- Notification bell → dropdown with recent notifications, "Mark all read" link, "View all" link

### States
- **New member (no mentorship, no events):** Mentorship card replaced with "Get started" card: "Complete your profile" (if incomplete) or "Browse the directory and find a mentor" + "Explore upcoming events"
- **Admin user:** Additional "Admin Quick Actions" card: "X unmatched mentees", "Y pending applications", etc.
- **Empty events:** "No upcoming events" with Afro pattern empty state + "Check back soon"

---

## Screen 06: Directory Browse

**URL:** `/connect`
**Type:** Page  
**Access:** Member+  

### Purpose
The network's front door. Browsable, searchable, filterable grid of all NGN member profiles.

### Layout — Desktop
```
┌──────────┬──────────────────────────────────────────────────────┐
│          │  Home > Directory                     [🔔] [👤]     │
│ SIDEBAR  │──────────────────────────────────────────────────────│
│          │                                                      │
│          │  ┌─ SEARCH ──────────────────────────────────────┐  │
│          │  │  🔍 [Search members by name, skill, or keyword]│  │
│          │  └───────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ FILTERS (inline row) ────────────────────────┐  │
│          │  │ [Country ▼] [Sector ▼] [Expertise ▼]          │  │
│          │  │ [Tier ▼] [Mentorship ▼] [Language ▼] [Clear]  │  │
│          │  └───────────────────────────────────────────────┘  │
│          │                                                      │
│          │  Showing 247 members                 [Grid] [List]  │
│          │                                                      │
│          │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│          │  │ [Photo]  │  │ [Photo]  │  │ [Photo]  │            │
│          │  │ Name     │  │ Name     │  │ Name     │            │
│          │  │ Role     │  │ Role     │  │ Role     │            │
│          │  │ 🌍 Kenya │  │ 🌍 Nigeria│ │ 🌍 Ghana │            │
│          │  │ [tag][tag]│  │ [tag][tag]│ │ [tag][tag]│           │
│          │  │ 🤝 Mentor│  │ 🤝 Both  │  │          │            │
│          │  └─────────┘  └─────────┘  └─────────┘            │
│          │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│          │  │ ...      │  │ ...      │  │ ...      │            │
│          │  └─────────┘  └─────────┘  └─────────┘            │
│          │                                                      │
│          │  [Load more] or infinite scroll                     │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Layout — Tablet
2-column profile card grid. Filters in same inline row but may wrap to two rows.

### Layout — Mobile
```
┌──────────────────────────────┐
│ [Logo]          [🔔] [👤]   │
│──────────────────────────────│
│ Directory                    │
│                              │
│ 🔍 [Search members...]      │
│                              │
│ [Filters ▼] (collapsible)   │
│  When expanded:              │
│  [Country ▼]                 │
│  [Sector ▼]                  │
│  [Expertise ▼]               │
│  [Tier ▼]                    │
│  [Mentorship ▼]              │
│  [Apply] [Clear]             │
│                              │
│ 247 members                  │
│                              │
│ ┌───────────────────────────┐│
│ │ [Photo] Name              ││
│ │         Role, Organisation││
│ │         🌍 Kenya          ││
│ │         [tag] [tag] [tag] ││
│ │         🤝 Open to mentor ││
│ └───────────────────────────┘│
│ ┌───────────────────────────┐│
│ │ ...                       ││
│ └───────────────────────────┘│
│                              │
│──────────────────────────────│
│  🏠    👥    🤝    📅    ⋯  │
└──────────────────────────────┘
```

### Content inventory
- Page heading: "Directory" (breadcrumb provides context)
- Search bar: full-width, magnifying glass icon, placeholder "Search members by name, skill, or keyword"
- Filter row: dropdown selectors for each filter dimension. "Clear all" link when any filter active.
- Results count: "Showing X members" — updates dynamically on filter/search
- View toggle: Grid (default) / List view
- Profile cards (grid): circle photo (64px desktop, 48px mobile), full name (Museo Sans 500), role + org (Museo Sans 300, grey), country flag + name, up to 3 expertise tags (pills, 25% MIF Blue background), mentorship availability icon
- Profile cards (list): horizontal layout with more detail visible (bio excerpt)
- Pagination: infinite scroll with "Load more" fallback for low-bandwidth

### Interaction behaviour
- Search: debounced 300ms, searches across name, bio, and expertise tags (PostgreSQL full-text)
- Filters: each dropdown shows options with counts ("Kenya (12)"). Multiple selections within a filter = OR. Across filters = AND.
- Click profile card → navigates to `/connect/[user-slug]`
- Mentorship availability icon: green circle = "Open to mentoring", blue circle = "Seeking mentor", split = "Both", grey = "Not now"
- Photo fallback: if no photo, show initials on coloured circle (colour derived from name hash, using MIF palette)

### States
- **Loading:** 6 skeleton cards (grey animated rectangles matching card dimensions)
- **No results:** Afro pattern empty state: "No members match your search. Try adjusting your filters."
- **Error:** "Something went wrong loading the directory. Please try again." + retry button

---

## Screen 07: Member Profile View

**URL:** `/connect/[user-slug]`
**Type:** Page  
**Access:** Member+  

### Purpose
Full view of a member's profile. This is where organic mentorship connections begin — someone browses, finds an interesting person, reads their story, and reaches out.

### Layout — Desktop
```
┌──────────┬──────────────────────────────────────────────────────┐
│          │  Home > Directory > [Member Name]      [🔔] [👤]    │
│ SIDEBAR  │──────────────────────────────────────────────────────│
│          │                                                      │
│          │  ┌─ PROFILE HEADER ──────────────────────────────┐  │
│          │  │                                                │  │
│          │  │  [Photo     ]  [Name — Museo Sans 700, 28px]  │  │
│          │  │  [128px     ]  [Role, Organisation]            │  │
│          │  │  [circle    ]  [🌍 Country  |  Tier 2 badge]  │  │
│          │  │              [🗣 English, French]              │  │
│          │  │              [🕐 WAT (UTC+1)]                 │  │
│          │  │                                                │  │
│          │  │  [Send Message]  [Request Mentorship]          │  │
│          │  │                                                │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ BIO ─────────────────────────────────────────┐  │
│          │  │  "Lorem ipsum dolor sit amet..."               │  │
│          │  │  [Full bio text, Museo Sans 300, 16px]         │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ EXPERTISE ─────┐  ┌─ LINKS ──────────────────┐ │
│          │  │ [tag] [tag]      │  │ 🔗 LinkedIn              │ │
│          │  │ [tag] [tag]      │  │ 🌐 Website               │ │
│          │  │ [tag] [tag]      │  │                           │ │
│          │  └──────────────────┘  └───────────────────────────┘ │
│          │                                                      │
│          │  ┌─ MENTORSHIP ──────────────────────────────────┐  │
│          │  │  🤝 Open to mentoring                          │  │
│          │  │  Can help with: [tag] [tag] [tag]              │  │
│          │  │  Looking for: [tag] [tag]                       │  │
│          │  │  [Request Mentorship — button]                  │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Layout — Mobile
Single column. Photo centred at top (96px), name and details below. CTAs as sticky bottom bar ("Send Message" | "Request Mentorship"). Bio full-width. Expertise tags wrap. Links as tappable rows.

### Content inventory
- Profile photo (128px desktop, 96px mobile, circle crop)
- Name — Museo Sans 700, 28px desktop / 22px mobile
- Role + Organisation — Museo Sans 300, 16px, MIF Dark Grey
- Country (with flag emoji), Tier badge (coloured pill), Languages, Timezone
- CTA buttons: "Send Message" (outline, MIF Blue) and "Request Mentorship" (filled, MIF Orange — only if member is marked available)
- Bio section — full text
- Expertise tags — pills with 25% MIF Blue background
- External links — LinkedIn, website — open in new tab
- Mentorship section — availability status, skills offered, skills sought
- If viewing own profile: "Edit Profile" button replaces CTAs

### Interaction behaviour
- "Send Message" → navigates to `/message` with new conversation pre-addressed
- "Request Mentorship" → opens modal (Screen 12)
- LinkedIn/website links → new tab
- If member is not available for mentorship, the "Request Mentorship" button is hidden and the mentorship section shows "Not currently available for mentorship"

### States
- **Own profile:** CTAs replaced with "Edit Profile" button
- **External participant viewing:** Limited view — only name, photo, role, and mentorship-relevant info
- **No bio:** Section hidden (not an empty placeholder)
- **No photo:** Initials on coloured circle

---

## Screen 08: Edit My Profile

**URL:** `/connect/edit`
**Type:** Form  
**Access:** All authenticated  

### Purpose
Edit all profile fields. Single-page form (not stepped like onboarding — experienced users want efficiency).

### Layout — Desktop
Two-column form. Left column: photo, name, country, nationality, role, org, sector. Right column: bio, expertise, languages, timezone, mentorship preferences, links. Save button sticky at bottom.

### Layout — Mobile
Single column, all fields stacked. Save button sticky at bottom of viewport.

### Content inventory
All fields from the profile, editable. Same validation as onboarding. Photo has "Change" and "Remove" options. Tags have same type-ahead input. Bio has character count.

### Interaction behaviour
- Auto-save draft to local storage every 30 seconds
- "Save" validates all fields → POST → success toast "Profile updated" → stay on page
- "Cancel" → confirm if unsaved changes → navigate back to profile view
- Photo change → file picker → crop tool → upload → preview immediately

---

## Screen 09–10: Mentorship Dashboard (Mentor / Mentee views)

**URL:** `/mentor`
**Type:** Page  
**Access:** Members with active pairings  

### Purpose
The member's personal mentorship hub. Shows all their active pairings, goals, sessions, and programme status. Mentor and mentee see the same page structure but with role-appropriate content.

### Layout — Desktop
```
┌──────────┬──────────────────────────────────────────────────────┐
│          │  Home > Mentorship                     [🔔] [👤]    │
│ SIDEBAR  │──────────────────────────────────────────────────────│
│          │                                                      │
│          │  ┌─ TAB BAR ─────────────────────────────────────┐  │
│          │  │ [My Pairings] [Circles] [Sessions] [Skills]   │  │
│          │  └───────────────────────────────────────────────┘  │
│          │                                                      │
│          │  MY PAIRINGS (default tab)                           │
│          │                                                      │
│          │  ┌─ PAIR CARD ───────────────────────────────────┐  │
│          │  │                                                │  │
│          │  │  [Partner photo]  [Partner name]               │  │
│          │  │                   Role, Organisation           │  │
│          │  │                   Status: ● Active             │  │
│          │  │                   Started: 15 Jan 2026         │  │
│          │  │                   Sessions: 3/6 logged         │  │
│          │  │                                                │  │
│          │  │  GOALS                                         │  │
│          │  │  ✅ Goal 1: Improve public speaking  [On track]│  │
│          │  │  ⚠️ Goal 2: Build strategic network [Needs att]│  │
│          │  │  ○  Goal 3: Leadership framework    [Not start]│  │
│          │  │                                                │  │
│          │  │  [Log a Session]  [View Detail]                │  │
│          │  │                                                │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ SUGGESTED MENTORS (mentee only, if unmatched) ┐ │
│          │  │  Based on your profile, you might connect with: │ │
│          │  │  [Profile Card] [Profile Card] [Profile Card]   │ │
│          │  │  [Browse all mentors →]                         │ │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Layout — Mobile
Tab bar becomes horizontally scrollable pills. Pair cards full-width stacked. Goals shown as compact list. Suggested mentors as horizontal scroll.

### Content inventory
- Tab bar: My Pairings | Circles | Sessions | Skills — navigates to sub-sections
- Pair card(s): one per active pairing. Partner photo + name, status badge, start date, session count with visual progress bar, goals with status icons
- CTAs per pair: "Log a Session" (MIF Orange), "View Detail" (outline)
- Suggested Mentors section (mentee only, if no active pairing): 3 algorithmically suggested profiles
- For mentors with multiple mentees: multiple pair cards stacked

### Interaction behaviour
- Tab navigation → switches content area (no page reload, client-side routing)
- Pair card → "Log a Session" navigates to session log form for that pair
- Pair card → "View Detail" navigates to pair detail page
- Suggested mentor cards → click to profile view

### States
- **No active pairings (mentee):** "You're not currently in a mentorship pairing" + "Find a mentor" CTA + suggested mentors
- **No active pairings (mentor):** "You don't have any mentees yet. When someone requests you as a mentor, you'll see it here."
- **Pending request:** Pair card shows "Pending" status with "View Request" CTA

---

## Screen 11: Browse Mentors

**URL:** `/mentor/browse`
**Type:** Page  
**Access:** Members  

### Purpose
Filtered view of the directory showing only members who are open to mentoring. This is where organic mentor discovery happens.

### Layout
Identical to Directory Browse (Screen 06) but pre-filtered to `mentor_available = true`. Additional filter: "Suggested for you" toggle that sorts by algorithmic match score.

### Content inventory
Same as directory but with:
- "Suggested for you" toggle at top (default ON for mentees with intake data)
- Match score indicator on cards when suggestions are active (e.g., "92% match" pill)
- "Request Mentorship" quick action on each card (in addition to click-to-profile)

### Interaction behaviour
- "Suggested for you" toggle → re-sorts by match score (requires mentee to have completed intake or at minimum have "skills sought" populated)
- "Request Mentorship" on card → opens modal (Screen 12) without navigating away from browse
- All other behaviour same as directory

---

## Screen 12: Send Mentorship Request (Modal)

**URL:** Overlay on current page  
**Type:** Modal  
**Access:** Members  

### Layout — Desktop
```
┌── Modal (max 560px wide) ─────────────────────────────┐
│                                                  [✕]   │
│                                                        │
│  Request mentorship with [Name]                        │
│                                                        │
│  [Mentor photo + name + role — compact card]           │
│                                                        │
│  Why would you like to work with [First Name]?         │
│  [Text area — 500 char max]                            │
│  Prompt: "What are you hoping to learn? Why this       │
│   mentor specifically?"                                │
│                                                        │
│  What are your goals for this mentorship?              │
│  [Text area — 500 char max]                            │
│  Prompt: "What does success look like for you at       │
│   the end of 6 months?"                                │
│                                                        │
│  Preferred meeting frequency                           │
│  [Once a month ▼]                                      │
│                                                        │
│  [Cancel]                    [Send Request — button]   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Layout — Mobile
Full-screen sheet sliding up from bottom. Same content, single column.

### Interaction behaviour
- Submit → POST → success: modal closes, toast "Request sent to [Name]", mentor receives notification
- Cancel → modal closes, no action
- If mentee already has a pending request to this mentor → show "You already have a pending request" instead of form

---

## Screen 13: Mentee Intake Form

**URL:** `/mentor/pairs/[pair-id]/intake`
**Type:** Form  
**Access:** Matched mentees  

### Purpose
After a mentor accepts a request, the mentee completes a structured intake form defining their goals and success criteria.

### Layout — Desktop & Mobile
Single-page form (not stepped).

### Content inventory
- Heading: "Set your mentorship goals"
- Subheading: "These goals will guide your mentorship journey over the next 6 months. You can update them anytime."
- **Goal 1** (required): Title (short text) + "What does success look like?" (text area, 200 char)
- **Goal 2** (optional): Same
- **Goal 3** (optional): Same
- "Add another goal" link (max 3)
- Preferred meeting day/time (optional — free text)
- Any additional context for your mentor (text area, optional)
- [Save Goals — button]

### Interaction behaviour
- Save → POST → navigates to pair detail page → toast "Goals saved"
- Goals appear on pair detail page and mentorship dashboard
- Mentee can edit goals from pair detail page at any time

---

## Screen 14: Pair Detail View

**URL:** `/mentor/pairs/[pair-id]`
**Type:** Page  
**Access:** Pair members + Programme Admin + ExCo  

### Purpose
The comprehensive view of a single mentorship pairing — both parties see the same page. Serves as the "control room" for the relationship.

### Layout — Desktop
```
┌──────────┬──────────────────────────────────────────────────────┐
│          │  Home > Mentorship > Pair with [Name]  [🔔] [👤]    │
│ SIDEBAR  │──────────────────────────────────────────────────────│
│          │                                                      │
│          │  ┌─ PAIR HEADER ─────────────────────────────────┐  │
│          │  │ [Mentor photo]  ↔  [Mentee photo]              │  │
│          │  │ [Mentor name]      [Mentee name]               │  │
│          │  │ Status: ● Active    Track: NGN Core            │  │
│          │  │ Started: 15 Jan 2026  |  Cycle: 2026-H1       │  │
│          │  │ Programme: Month 3 of 6                        │  │
│          │  │ [████████░░░░] 50%                             │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ GOALS ───────────────────────────────────────┐  │
│          │  │ Goal 1: Improve public speaking                │  │
│          │  │ Success: "Deliver a keynote at IGW 2026"       │  │
│          │  │ Status: [On track ▼]                           │  │
│          │  │ Notes: "Completed 2 practice sessions..."      │  │
│          │  │ [Update progress]                              │  │
│          │  │                                                │  │
│          │  │ Goal 2: Build strategic network                │  │
│          │  │ ...                                            │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ SESSION LOG ─────────────────────────────────┐  │
│          │  │ [Log a Session — button]                       │  │
│          │  │                                                │  │
│          │  │ Session 3 — 28 Feb 2026 (45 min)              │  │
│          │  │ "Discussed presentation techniques..."         │  │
│          │  │ Rating: ● On track                             │  │
│          │  │                                                │  │
│          │  │ Session 2 — 15 Feb 2026 (60 min)              │  │
│          │  │ "Reviewed networking strategy..."              │  │
│          │  │ Rating: ⚠ Needs attention                      │  │
│          │  │                                                │  │
│          │  │ Session 1 — 20 Jan 2026 (60 min)              │  │
│          │  │ "Introductory session. Set goals..."           │  │
│          │  │ Rating: ● On track                             │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ ADMIN NOTES (Admin/ExCo only) ───────────────┐ │
│          │  │ [Add a note — text area]                       │ │
│          │  │ Note by Admin X — 10 Feb: "Pair seems..."     │ │
│          │  └────────────────────────────────────────────────┘ │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Layout — Mobile
Single column. Pair header condensed (photos smaller, inline). Goals as expandable accordion. Session log as timeline cards. "Log a Session" as sticky bottom CTA.

### Interaction behaviour
- "Update progress" on goals → inline edit (dropdown for status, text area for notes)
- "Log a Session" → navigates to session log form (Screen 15)
- Session entries are read-only after creation (but can be edited within 24 hours)
- Admin notes section only visible to Programme Admin and ExCo

---

## Screen 15: Log a Session

**URL:** `/mentor/pairs/[pair-id]/log`
**Type:** Form  
**Access:** Pair members  

### Layout — Desktop & Mobile
Simple single-column form, centered (max 640px).

### Content inventory
- Heading: "Log a mentorship session"
- "Session with [Partner Name]" — compact card
- Date (date picker, defaults to today)
- Duration — select: 30 min, 45 min, 60 min, 90 min, Other (→ free input)
- What did you discuss? (text area, 1000 char max)
- How would you rate progress? — three radio options with visual indicators:
  - ● On track (MIF Lime) — "We're making good progress"
  - ⚠ Needs attention (Additional Orange) — "We need to refocus"
  - ● At risk (MIF Red) — "We're struggling and may need support"
- [Save Session — button]

### Interaction behaviour
- Save → POST → toast "Session logged" → navigate back to pair detail
- "At risk" selection triggers a note to Programme Admin

---

## Screen 16: Programme Survey

**URL:** `/mentor/pairs/[pair-id]/survey`
**Type:** Form  
**Access:** Pair members  

### Purpose
Mid-programme (3 months) and end-of-programme (6 months) evaluation. Sent automatically via notification.

### Content inventory
- Heading: "Mid-programme check-in" or "End-of-programme evaluation"
- Satisfaction score (1–10 slider or numbered buttons)
- Match quality score (1–10)
- "What's going well?" (text area)
- "What could be improved?" (text area)
- End-programme only: "Would you like to continue this pairing?" (Yes / No / Undecided)
- End-programme only: "Would you recommend this programme to other NGN members?" (Yes / No)
- [Submit — button]

---

## Screens 17–19: Group Circles (Browse, Detail, Create)

### Screen 17: Browse Group Circles (`/mentor/circles`)
Grid of circle cards. Each card: title, theme, facilitator name + photo, participant count / max, cadence, status badge (Open / Active / Completed). Filter by theme. "Join" button on open circles.

### Screen 18: Circle Detail (`/mentor/circles/[id]`)
Header: title, theme, facilitator, cadence, duration. Participant list (profile cards). Schedule: upcoming sessions with date/time. Async discussion thread (embedded — same component as Screen 31). "Leave circle" option.

### Screen 19: Create Circle (`/mentor/circles/create`)
Form: title, description, theme (dropdown), max participants, cadence (dropdown), duration (months), start date. Facilitator is automatically the creator. [Create Circle — button].

---

## Screens 20–23: One-to-Many Sessions (Browse, Detail, Create, Archive)

### Screen 20: Browse Sessions (`/mentor/sessions`)
List/grid of upcoming sessions. Cards: title, host name + photo, date/time, topic tags, registered count / capacity. Filter by topic. Sort by date.

### Screen 21: Session Detail (`/mentor/sessions/[id]`)
Header: title, host profile card, date/time, format, capacity. Description. Topic tags. Registration CTA ("Register" / "Registered ✓" / "Full — Join waitlist"). "Add to calendar" (iCal download).

### Screen 22: Create Session (`/mentor/sessions/create`)
Form: title, description, topic tags, date/time, duration, max attendees, "Will this be recorded?" toggle. [Create Session — button].

### Screen 23: Past Session Archive (`/mentor/sessions/[id]/archive`)
Same layout as Session Detail but with: recording embed (video player or YouTube embed), downloadable materials (slides, documents), attendance count.

---

## Screens 24–25: Skills Trading (Browse, Create)

### Screen 24: Browse Skills (Backlog / prototype opportunity)
Two tabs: "Offers" and "Requests". Card grid. Each card: title, author name + photo, category tag, description excerpt. Filter by category. Click → expands inline or navigates to author profile. The current app keeps skill signals in profile data; there is no standalone skills route yet.

### Screen 25: Create Skill Listing (Backlog / prototype opportunity)
Form: type (Offer / Request), title, description, category (dropdown). [Post — button].

---

## Screens 26–29: Events (Calendar, Detail, Create, Archive)

### Screen 26: Events Calendar (`/events`)
Calendar view (month) with dot indicators on days with events + list view below (default). Toggle between calendar and list. Filter by programme area (pill tabs: All, Mentorship, In Conversation, Debates, Future of Africa, Insights, Advisory). Filter by format (Virtual / In-person / Hybrid).

### Screen 27: Event Detail (`/events/[id]`)
Header with programme area colour band. Title, date/time, format, location/link. Speaker/panellist profiles (compact cards). Description. Registration CTA + "Add to calendar". Registered attendee count.

Mobile: Speaker cards as horizontal scroll. Registration as sticky bottom CTA.

### Screen 28: Create Event (`/events/create`)
Form: title, description, programme area (dropdown), event type, format, date/time, location or video link, speakers (member search + add), max capacity, registration required toggle, materials upload. [Create Event — button].

### Screen 29: Past Event Archive (`/events/[id]/archive`)
Same as event detail but with: recording (embed), materials (downloads), recap text (editable by admin), attendance count.

---

## Screens 30–32: Discussions (List, Detail, Create)

### Screen 30: Thread List (`/discussions`)
List of threads sorted by most recent activity. Each row: title, programme area tag, author avatar, post count, last activity timestamp. Filter by programme area. Search threads.

### Screen 31: Thread Detail (`/discussions/[id]`)
Header: title, programme area tag, created by, date. Posts in chronological order. Each post: author avatar + name + timestamp, body text, attachments, reply button. Nested replies indented (max 2 levels). "Post a reply" composer at bottom (text area + attach file + submit).

Mobile: Full-width posts. Nested replies indicated by connecting line rather than indentation (saves horizontal space).

### Screen 32: Create Thread (`/discussions/create`)
Form: title, description, programme area (dropdown), optionally link to a circle (dropdown). [Create Thread — button].

---

## Screens 33–34: Messages (Inbox, Conversation)

### Screen 33: Message Inbox (`/message`)
**Desktop:** Two-panel layout. Left panel (320px): conversation list sorted by recency, each row shows avatar + name + last message preview + timestamp + unread indicator. Right panel: selected conversation (Screen 34 content inline).

**Mobile:** Conversation list only. Tap → navigates to conversation detail (Screen 34) as a separate page.

### Screen 34: Conversation Detail (`/message/[id]`)
Chat-style layout. Messages in bubbles. Own messages right-aligned (MIF Blue background, white text). Other's messages left-aligned (light grey background). Timestamp between message groups. Composer at bottom: text input + send button.

Mobile: Full-screen conversation with back arrow to inbox.

---

## Screens 35–41: Admin

### Screen 35: Admin Overview Dashboard (`/admin`)
**Desktop layout:**
```
┌──────────┬──────────────────────────────────────────────────────┐
│          │  Admin Dashboard                       [🔔] [👤]    │
│ SIDEBAR  │──────────────────────────────────────────────────────│
│          │                                                      │
│          │  ┌─ STATS ROW ───────────────────────────────────┐  │
│          │  │ [Total Members: 347] [Active Pairs: 78]       │  │
│          │  │ [Events This Month: 4] [Unread Applications: 3]│  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
│          │  ┌─ MENTORSHIP HEALTH ──┐  ┌─ MEMBER ACTIVITY ───┐ │
│          │  │  Active: 78           │  │  Logins (30d): 189  │ │
│          │  │  At risk: 5           │  │  Profiles updated: 24│ │
│          │  │  Avg sessions/pair: 2.3│ │  New this month: 12 │ │
│          │  │  Satisfaction: 8.1/10 │  │                     │ │
│          │  │  [Manage →]           │  │  [View members →]   │ │
│          │  └──────────────────────┘  └──────────────────────┘ │
│          │                                                      │
│          │  ┌─ REQUIRES ATTENTION ──────────────────────────┐  │
│          │  │  ⚠ 5 pairs flagged "at risk"                  │  │
│          │  │  ⚠ 12 pairs inactive >30 days                  │  │
│          │  │  ⚠ 3 ecosystem applications pending            │  │
│          │  │  ⚠ 23 members haven't completed profiles       │  │
│          │  └────────────────────────────────────────────────┘  │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

Mobile: Stats as horizontal scroll cards. Health and activity as stacked cards. "Requires attention" as notification list.

### Screen 36: Member Management (`/admin/members`)
Table: name, email, tier, country, role (ExCo/Admin/Member/External), status (active/invited/inactive), last active date. Actions: change role, resend invite, deactivate. "Invite new member" button → modal with email + role + tier fields. Bulk invite via CSV upload. Export to CSV.

Mobile: Table → card list with key info + action menu (three dots).

### Screen 37: Mentorship Management (`/admin/mentor`)
Table of all pairs: mentor name, mentee name, status, track, sessions logged, last session, progress rating, flags. Filters: status, track, flagged. Actions per pair: view detail, flag, add note, discontinue. Summary stats at top.

### Screen 38: Run Matching Algorithm (`/admin/mentor/matching`)
Two-panel view. Left: list of unmatched mentees with their intake summary. Right: when a mentee is selected, shows top 5 algorithm-suggested mentors with match scores and reasoning (which factors scored highest). Actions: approve match, skip, manually assign different mentor. Bulk mode: "Auto-suggest all" → review list of proposed pairs before approving.

### Screen 39: Event Management (`/admin/events`)
Table of all events: title, programme area, date, format, registrations, status. Actions: edit, cancel, duplicate. "Create event" button.

### Screen 40: Discussion Space Management (`/admin/spaces`)
Admin view for discussion spaces, membership, visibility, and moderation settings. The earlier ecosystem-applications concept is not a current standalone route.

### Screen 41: Reports + Exports (`/admin/reports`)
Report generator. Select: report type (Mentorship Impact, Member Engagement, Programme Overview, Event Attendance), date range, filters. "Generate" → preview on screen → "Export PDF" or "Export CSV".

---

## Screens 42–43: Settings

### Screen 42: Notification Preferences (`/settings/notifications`)
Toggle matrix. Rows: Mentorship reminders, Event updates, New messages, Discussion replies, Admin announcements, Survey requests. Columns: In-app, Email, WhatsApp (if opted in). Global "Pause all notifications" toggle.

### Screen 43: Account Settings (`/settings`)
- Change password
- Email address (read-only, contact admin to change)
- Timezone (auto-detected, with override)
- Language preference (future: English, French, Portuguese, Arabic)
- Delete my account (→ confirmation modal → data deletion per GDPR)
- "Download my data" (JSON/CSV export per GDPR)

---

## Appendix: Core User Journeys

### Journey 1: New member onboarding (first 10 minutes)

```
Invitation email received
    │
    ▼
Click link → Screen 03 (Accept Invitation)
    │
    ▼
Complete 5-step profile setup (~5 min)
    │
    ▼
Redirected to Screen 05 (Home Dashboard)
    │
    ▼
Dashboard shows "Get started" card:
"Browse the directory" / "Find a mentor" / "Explore events"
    │
    ├── Browse directory (Screen 06) → Find interesting people
    │       │
    │       ▼
    │   View a profile (Screen 07) → "Send Message" or "Request Mentorship"
    │
    ├── Browse mentors (Screen 11) → See suggested mentors
    │       │
    │       ▼
    │   Request mentorship (Screen 12 modal) → Send request
    │       │
    │       ▼
    │   Wait for acceptance → Notification when accepted
    │       │
    │       ▼
    │   Complete intake form (Screen 13) → Set goals
    │       │
    │       ▼
    │   Pair appears on mentorship dashboard (Screen 09/10)
    │
    └── Browse events (Screen 26) → Register for upcoming event
```

### Journey 2: Mentorship lifecycle (6 months)

```
Mentee requests mentor (Screen 12)
    │
    ▼
Mentor receives notification → Reviews request on their dashboard
    │
    ├── Accepts → Pair created, both notified
    │       │
    │       ▼
    │   Mentee completes intake form (Screen 13) → Goals set
    │       │
    │       ▼
    │   Pair is now "Active" on both dashboards (Screen 09/10)
    │       │
    │       ▼
    │   Monthly meetings (offline, via Zoom, etc.)
    │       │
    │       ▼
    │   After each meeting → Log session (Screen 15)
    │       │
    │       ├── If >30 days without log → Automated reminder (email/WhatsApp)
    │       │
    │       ├── If "At risk" → Programme Admin notified, adds admin note
    │       │
    │       ▼
    │   Month 3 → Mid-programme survey (Screen 16) sent automatically
    │       │
    │       ▼
    │   Months 4-6 → Continue meetings + session logs
    │       │
    │       ▼
    │   Month 6 → End-of-programme evaluation (Screen 16)
    │       │
    │       ├── "Continue?" → Yes → Pair renewed for another cycle
    │       └── "Continue?" → No → Pair marked "Completed"
    │
    └── Declines → Mentee notified, encouraged to try others
```

### Journey 3: Admin managing the mentorship programme

```
Admin logs in → Screen 05 (Dashboard) shows admin quick actions
    │
    ▼
Navigate to Admin > Mentorship (Screen 37)
    │
    ├── View programme overview: X active pairs, Y at risk, Z unmatched
    │
    ├── Click "Unmatched mentees" → Screen 38 (Matching)
    │       │
    │       ▼
    │   Select a mentee → Review their goals + preferences
    │       │
    │       ▼
    │   See top 5 suggested mentors with match scores
    │       │
    │       ├── Approve a match → Pair created, both notified
    │       ├── Skip → Move to next mentee
    │       └── Manually assign → Search for specific mentor
    │
    ├── Click "At risk pairs" → Filtered table of flagged pairs
    │       │
    │       ▼
    │   Click into a pair (Screen 14) → Review session log, goals
    │       │
    │       ▼
    │   Add admin note → "Reached out to mentor to check in"
    │       │
    │       ▼
    │   Send nudge (email) to pair from admin panel
    │
    └── Navigate to Reports (Screen 41) → Generate impact report
            │
            ▼
        Select "Mentorship Impact" + date range → Preview
            │
            ▼
        Export PDF → Share with ExCo / MIF leadership
```

### Journey 4: Discovering and attending an event

```
Member sees event notification (email or in-app)
    │
    ▼
Clicks link → Screen 27 (Event Detail)
    │
    ▼
Reads description, sees speakers, checks date
    │
    ├── "Register" → Confirmation toast + "Add to calendar" prompt
    │       │
    │       ▼
    │   24h before: reminder notification (email + optional WhatsApp)
    │       │
    │       ▼
    │   1h before: reminder notification
    │       │
    │       ▼
    │   Attends event (external: Zoom/in-person)
    │       │
    │       ▼
    │   After event: Programme Admin uploads recording + materials
    │       │
    │       ▼
    │   Screen 29 (Past Event Archive) → Watch recording, download slides
    │
    └── Alternatively: Browse events calendar (Screen 26) → Filter by programme area → Find event
```

### Journey 5: Organic connection via the directory

```
Member browses directory (Screen 06) out of curiosity
    │
    ▼
Sees an interesting profile card → Clicks into it (Screen 07)
    │
    ▼
Reads bio, sees expertise in "Climate Finance" — relevant to their work
    │
    ├── "Send Message" → Drafts a note: "I was really impressed by your work on..."
    │       │
    │       ▼
    │   Conversation begins (Screen 34) → May lead to informal mentorship
    │
    └── "Request Mentorship" → Formal mentorship request (Screen 12)
```
