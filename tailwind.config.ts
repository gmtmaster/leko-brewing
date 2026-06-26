import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#160f16",
        mulberry: "#3b1627",
        rosehaze: "#d99aa3",
        nectar: "#f6c76f",
        moss: "#6f8b5a",
        pine: "#233b2e",
        cream: "#fff5df"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(246, 199, 111, 0.24)",
        rose: "0 20px 90px rgba(217, 154, 163, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
