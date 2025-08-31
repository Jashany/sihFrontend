module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // This is the fix!
    autoprefixer: {},
  },
};