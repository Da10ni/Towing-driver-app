/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        darkGreen: "#1f8a66",
        lightGreen: "#7decc7",
        darkestWhite: "#fff",
        darkestBlack: "#000",
        lightestGrey: "#e4e4e4",
        lighterGrey: "#c6c5c4",
        lightGrey: "#adadad",
        semiDarkGrey: "#636262",
      },
    },
  },
  plugins: [],
};
