/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        lato: ['Lato'],
        OpenSans: ['Open Sans'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}