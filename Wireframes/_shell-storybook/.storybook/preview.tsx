import type { Preview } from "@storybook/react";

import "../src/globals.css";

/** Doc5 §2 — chrome contract viewports (iframe size, not CSS breakpoints). */
const ngnViewports = {
  ngnMobile: {
    name: "Mobile (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
  ngnTablet: {
    name: "Tablet (820×1180)",
    styles: { width: "820px", height: "1180px" },
    type: "tablet" as const,
  },
  ngnDesktop: {
    name: "Desktop (1280×800)",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
  },
};

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: { hideNoControlsWarning: true },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    viewport: {
      viewports: ngnViewports,
      defaultViewport: "ngnMobile",
    },
  },
};

export default preview;
