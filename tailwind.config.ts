import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        bounceY: {
          "0%, 100%": { transform: "translateY(-20px)" },
          "50%": { transform: "translateY(20px)" },
        },
        bounceYBack: {
          "100%, 0%": { transform: "translateY(-20px)" },
          "50%": { transform: "translateY(20px)" },
        },
      },
      animation: {
        bounceY: "bounceY 4s ease-in-out infinite",
        bounceYBack: "bounceY 4s ease-in-out infinite ",
      },
    },
  },
  plugins: [],
};
export default config;
