// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111214",
        paper: "#f3f1eb",
        paperDark: "#e9e7e0",
        charcoal: "#171819",
        gold: "#e5bd36",
        goldDeep: "#997b19",
        muted: "#70716d",
        mutedLight: "#bcbdbb",
        mutedFooter: "#81817c",
        line: "#d5d3ca",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "Arial", "sans-serif"],
      },
      spacing: {
        sectionPad: "130px",
        headerH: "94px",
        headerHMobile: "76px",
      },
    },
  },
};
