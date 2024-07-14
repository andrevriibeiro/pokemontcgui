module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",,
  ],
  theme: {
    extend: {
      maxWidth: {
        'full-100': '100%',
      },
      screens: {
        '2xl': '1536px',
      },
      height: {
        '17rem': '17rem',
      },
      width: {
        '12rem': '12rem',
      }
    },
  },
  plugins: [],
}