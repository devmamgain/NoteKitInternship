/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '200px',
      'sm2' : '425px',
      'lg' : '597px'
    },
    extend: {},
  },
  plugins: [],
}
