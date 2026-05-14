import type { Config } from "tailwindcss";

import { ngnTheme } from "./src/components/app-shell/tailwind.tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: ngnTheme,
  plugins: [],
};

export default config;
