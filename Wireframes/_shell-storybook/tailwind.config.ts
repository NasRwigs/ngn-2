import type { Config } from "tailwindcss";

import { ngnTheme } from "../_shell/tailwind.tokens";

const config: Config = {
  content: [
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "../_shell/**/*.{js,ts,jsx,tsx}",
  ],
  theme: ngnTheme,
  plugins: [],
};

export default config;
