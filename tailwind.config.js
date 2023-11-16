/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#00B126",
        yellow: "#FFFF01",
        pink: "#F8D7E9",
        "pink-muted": "#C0A7C6",
        "elephant-low": "#8973ff",
        elephant: "#6B4FFD",
        "elephant-high": "#5638fc",
        gray: "#9CA3AF",
        "gray-warm": "#C7C7C7",
      },
      lineHeight: {
        100: "100%",
      },
      letterSpacing: {
        snug: "-0.02em",
      },
      animation: {
        "smacky-gelatiny": "smacky-gelatiny 750ms ease-in-out",
      },
      keyframes: {
        "smacky-gelatiny": {
          "0%": {
            opacity: 0,
            transform: "scale(.3)",
          },
          "30%": {
            opacity: 1,
            transform: "scale(1.05)",
          },
          "50%": { transform: "scale(.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
