import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        sfr: {
          red: "#C8001A",
          "red-soft": "#FBE9EC",
        },
        ink: {
          DEFAULT: "#0D0D0D",
          2: "#3A3A3A",
          3: "#6E6E6E",
          4: "#A8A8A8",
        },
        paper: {
          DEFAULT: "#F5F3EE",
          2: "#ECEAE3",
          3: "#E0DDD4",
        },
        posture: {
          protect: "#C8001A",
          "protect-soft": "#FBE9EC",
          stabilise: "#B45309",
          "stabilise-soft": "#FEF3C7",
          grow: "#155E37",
          "grow-soft": "#DCFCE7",
          invest: "#1E3A8A",
          "invest-soft": "#DBEAFE",
        },
      },
    },
  },
  plugins: [],
};
export default config;
