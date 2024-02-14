import { type Config } from "tailwindcss";

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    styled: true,
    base: true,
    themeRoot: ":root",
    logs: false,
    prefix: "ds-"
  }
}satisfies Config;

