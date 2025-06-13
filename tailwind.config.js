const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        background: "#16082d",
        surface: "#0d0520",
        primary: "#ae24f7",
        accent: "#FFD700",
        pink: "#FF4FCB",
        gold: "#faff56",
        purple: "#A259FF",
        cyan: "#58d8f6",
        gain: "#00FFAA",
        loss: "#FF5C5C",
        text: {
          DEFAULT: "#feeace",
          secondary: "#CCCCCC",
          muted: "#777777",
        },
      },
      borderRadius: {
        DEFAULT: "15px",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", ...fontFamily.sans],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".border-default": {
          borderWidth: "2px",
          borderColor: "#220D4E",
          borderStyle: "solid",
        },
      });
    },
  ],
};
