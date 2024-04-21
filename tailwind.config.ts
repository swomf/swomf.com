/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
    },
    fontFamily: {
      mono: ["Hack-Regular", "monospace"],
    },

      // typography: {
      //   DEFAULT: {
      //     css: {
      //       pre: {
      //         color: false,
      //       },
      //       code: {
      //         color: false,
      //       },
      //     },
      //   },
      // },
    
  },
  plugins: [require("@tailwindcss/typography")],
};