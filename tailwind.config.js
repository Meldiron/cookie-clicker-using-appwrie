const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

module.exports = {
  prefix: "",
  mode: "jit",
  purge: {
    content: ["./src/**/*.{html,ts,css,scss,sass,less,styl}"],
  },
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        fadeup: "fadeup 1s ease-in-out",
      },
      keyframes: {
        fadeup: {
          "0%": { opacity: "0.8", transform: "translateY(0px)" },
          "100%": { opacity: "0", transform: "translateY(-100px)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
