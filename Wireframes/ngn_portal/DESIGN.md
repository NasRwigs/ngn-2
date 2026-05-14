---
name: NGN Portal
colors:
  surface: '#fcf9f9'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e2'
  on-surface: '#1b1b1c'
  on-surface-variant: '#434651'
  inverse-surface: '#303031'
  inverse-on-surface: '#f3f0f0'
  outline: '#747782'
  outline-variant: '#c4c6d2'
  surface-tint: '#385ca5'
  primary: '#00265e'
  on-primary: '#ffffff'
  primary-container: '#0e3b83'
  on-primary-container: '#86a8f7'
  inverse-primary: '#afc6ff'
  secondary: '#8b5000'
  on-secondary: '#ffffff'
  secondary-container: '#fe9812'
  on-secondary-container: '#653900'
  tertiary: '#695f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#bead00'
  on-tertiary-container: '#474000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#afc6ff'
  on-primary-fixed: '#001944'
  on-primary-fixed-variant: '#1b448c'
  secondary-fixed: '#ffdcbe'
  secondary-fixed-dim: '#ffb871'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#6a3c00'
  tertiary-fixed: '#f9e544'
  tertiary-fixed-dim: '#dbc826'
  on-tertiary-fixed: '#201c00'
  on-tertiary-fixed-variant: '#4f4700'
  background: '#fcf9f9'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
  emphasis:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The visual identity of the design system for the NGN Portal balances the institutional prestige of the Mo Ibrahim Foundation with the energetic, forward-looking pulse of the next generation of African leaders. The brand personality is **authoritative yet accessible**, combining professional corporate structures with vibrant, culturally resonant accents.

The design style follows a **Corporate/Modern** aesthetic characterized by:
- **Clarity and Precision:** Generous whitespace and a strict typographic hierarchy to ensure complex data and leadership insights are easily digestible.
- **Cultural Texture:** The use of "Afro font" geometric patterns as subtle overlays provides a distinctive regional identity without compromising the professional utility of the portal.
- **Sub-Brand Synergy:** While maintaining its own energy through the MIF Orange and Lime accents, the system remains anchored by the MIF Blue to signal continuity and trust.

## Colors

The palette is rooted in the MIF primary identity, repurposed here to create a high-contrast, accessible environment. 

- **Primary (MIF Blue):** Reserved for high-level navigation, headers, and structural elements. It conveys stability and institutional heritage.
- **Secondary (MIF Orange):** The primary action color. Used for CTAs and interactive highlights to drive engagement and signify energy.
- **Tertiary (MIF Lime):** An accent color for progress indicators, success states, or subtle decorative borders to keep the UI feeling fresh.
- **Backgrounds:** A warm grey (#f2efef) base provides a softer, more premium feel than pure white, reducing eye strain for long-form reading.
- **Contrast Compliance:** All text-on-background combinations must meet WCAG AA standards. Specifically, white text is used exclusively on MIF Blue and MIF Orange backgrounds.

## Typography

This design system utilizes **Hanken Grotesk** as a contemporary substitute for Museo Sans, maintaining the geometric clarity and professional warmth required by the brand. 

- **Headings (700):** Bold and assertive. Used to establish a clear content hierarchy.
- **Emphasis (500):** Used for sub-headers, button labels, and highlighted data points to provide visual weight without the heaviness of a headline.
- **Body (300):** Set with light weight and generous line height to ensure readability for the portal's in-depth reports and articles. 

On mobile devices, headline sizes scale down slightly to prevent awkward text wrapping, while body sizes remain constant to ensure accessibility.

## Layout & Spacing

The design system employs a **mobile-first fluid grid** approach. 

- **Desktop:** A 12-column grid with a maximum container width of 1280px. 
- **Mobile:** A single-column layout with 16px side margins.
- **Spacing Logic:** An 8px base unit (linear scale) governs all padding and margins to ensure mathematical harmony.
- **Whitespace:** Generous vertical spacing (using the 'lg' and 'xl' tokens) is encouraged between major sections to separate high-level network content and prevent cognitive overload.
- **Patterns:** The 'Afro font' geometric patterns should be applied as `absolute` background elements in hero sections, limited to 5-10% opacity to ensure text over-layers remain legible.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows** rather than heavy borders.

- **Level 0 (Background):** Warm grey (#f2efef) acts as the canvas.
- **Level 1 (Cards/Surfaces):** White surfaces (#ffffff) with a soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)). This makes the card appear to float slightly above the warm grey background.
- **Level 2 (Interactive/Navigation):** Floating Action Buttons (FABs) or active state cards use a more pronounced shadow (0px 8px 30px rgba(0, 0, 0, 0.10)) to indicate interactivity.
- **Overlay Pattern:** The decorative geometric patterns sit at Level 0.5—appearing behind the content cards but above the base background color.

## Shapes

The shape language is primarily **Rounded**, mirroring the circular "band" motif of the Mo Ibrahim Foundation logo.

- **Component Radius:** Standard buttons, cards, and input fields use a 0.5rem (8px) radius to maintain a modern, friendly feel.
- **Circular Motifs:** Avatars, profile images, and iconography containers must be 100% circular. 
- **Decorative Elements:** Occasional use of large, semi-transparent circles in the background can be used to echo the MIF logo band and guide the user's eye toward key information.

## Components

### Buttons
- **Primary CTA:** Solid MIF Orange (#f39000) with White text. Bold weight (500). Rounded (8px).
- **Secondary:** Outlined MIF Blue (#0e3b83) with 2px border.
- **Ghost:** Transparent background with MIF Blue text, used for less prominent actions.

### Cards
- **Surface:** Solid White.
- **Shadow:** Level 1 Ambient Shadow.
- **Corner:** 16px (rounded-lg) for large cards; 8px for small modules.
- **Accent:** A 4px top border in MIF Lime or MIF Red can be used to categorize card types (e.g., "Event" vs. "Alert").

### Navigation
- **Header:** Solid MIF Blue background. Navigation links in White (300 weight) with an Orange underline (2px) for active states.
- **Mobile Menu:** Full-screen overlay with a subtle geometric pattern watermark.

### Input Fields
- **Style:** Off-white background with a subtle 1px border (#cccccc). 
- **Focus State:** 2px border in MIF Blue.

### Loading States
- **Skeleton Screens:** Use the 'Afro font' geometric pattern as a shimmering mask for skeleton loading states to maintain brand consistency even during latency.