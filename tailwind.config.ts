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

    extend: {
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            ":not(pre) > code": {
              backgroundColor: "#24292e", // if shiki config is changed
              color: "#e1e4e8",           // these should also be changed
              padding: "0.250rem 0.4rem",
              borderRadius: "0.250rem",
            },
          },
        },
        // invert: {
        //   css: {
        //     ":not(pre) > code": {
        //       backgroundColor: theme("colors.zinc.900"),
        //       borderColor: theme("colors.zinc.800"),
        //     },
        //   },
        // },
      }),

    }

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
