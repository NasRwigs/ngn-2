/**
 * Tailwind config snippet that exposes the DESIGN.md tokens as utilities.
 * Merge this into your existing `tailwind.config.ts`.
 *
 * Source of truth: Wireframes/ngn_portal/DESIGN.md
 *
 * Usage in components:
 *   <div class="bg-surface text-on-surface" />
 *   <button class="bg-secondary-container text-on-secondary" />  // primary CTA
 *   <aside class="bg-surface-container-low border-outline-variant" />
 */

import type { Config } from "tailwindcss";

export const ngnTheme: Config["theme"] = {
  extend: {
    colors: {
      // Surfaces
      surface: "#fcf9f9",
      "surface-dim": "#dcd9d9",
      "surface-bright": "#fcf9f9",
      "surface-container-lowest": "#ffffff",
      "surface-container-low": "#f6f3f3",
      "surface-container": "#f0eded",
      "surface-container-high": "#eae7e7",
      "surface-container-highest": "#e5e2e2",
      "on-surface": "#1b1b1c",
      "on-surface-variant": "#434651",
      "inverse-surface": "#303031",
      "inverse-on-surface": "#f3f0f0",
      outline: "#747782",
      "outline-variant": "#c4c6d2",

      // MIF Blue (primary)
      primary: "#00265e",
      "on-primary": "#ffffff",
      "primary-container": "#0e3b83",
      "on-primary-container": "#86a8f7",
      "inverse-primary": "#afc6ff",

      // MIF Orange (secondary; used for primary CTAs per DESIGN.md §Buttons)
      secondary: "#8b5000",
      "on-secondary": "#ffffff",
      "secondary-container": "#fe9812",
      "on-secondary-container": "#653900",

      // MIF Lime (tertiary; success / category accent)
      tertiary: "#695f00",
      "on-tertiary": "#ffffff",
      "tertiary-container": "#bead00",
      "on-tertiary-container": "#474000",

      // Error / alert
      error: "#ba1a1a",
      "on-error": "#ffffff",
      "error-container": "#ffdad6",
      "on-error-container": "#93000a",
    },

    fontFamily: {
      sans: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
    },

    fontSize: {
      "display-lg": [
        "48px",
        { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
      ],
      "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "700" }],
      "headline-lg-mobile": ["28px", { lineHeight: "1.3", fontWeight: "700" }],
      "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "700" }],
      "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "300" }],
      "body-md": ["16px", { lineHeight: "1.6", fontWeight: "300" }],
      emphasis: ["16px", { lineHeight: "1.6", fontWeight: "500" }],
      "label-sm": [
        "12px",
        { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" },
      ],
    },

    spacing: {
      gutter: "24px",
      "margin-mobile": "16px",
      "margin-desktop": "64px",
    },

    borderRadius: {
      DEFAULT: "0.5rem",
      sm: "0.25rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      full: "9999px",
    },

    boxShadow: {
      // DESIGN.md §Elevation
      "level-1": "0px 4px 20px rgba(0, 0, 0, 0.05)",
      "level-2": "0px 8px 30px rgba(0, 0, 0, 0.10)",
    },
  },
};
