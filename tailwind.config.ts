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
  },
  theme: {
    extend: {
      animation: {
        'ping-fast': 'ping 1.25s cubic-bezier(0, -0.2, 1, 0.5) infinite',
      },
    },
  }
}satisfies Config;

