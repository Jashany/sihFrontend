/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        PrimaryBlack: "#161616",
        PrimaryGrayDark: "#1D1D1D",
        PrimaryGrayLight: "#393939",
        PrimaryGrayLighter: "#494949",
        PrimaryGrayTextLight: "#BEBEBE",
        PrimaryGrayTextDark: "#9E9E9E",
        PrimaryBlue: "#509FFF",
        PrimaryGrayHover: "#2E2E2E",
        PrimaryGrayIcons: "#676767",
        PrimaryLight: '#ffffff',
      },
    },
  },
  plugins: [],
};
