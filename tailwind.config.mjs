import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", ...fontFamily.sans],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
      colors: {
        background: "#16082d",
        surface: "#0d0520",
        borderBlock: "#220d4e",
        primary: "#A259FF",
        accent: "#FFD700",
        pinkFluo: "#FF4FCB",
        gold: "#faff56",
        pink: "#ae24f7",
        cyan: "#58d8f6",
        gain: "#00FFAA",
        loss: "#FF5C5C",
        text: {
          DEFAULT: "#feeace",
          secondary: "#CCCCCC",
          muted: "#777777",
        },
      },
    },
  },
  plugins: [],
};
