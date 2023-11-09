/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      height:{
        myscreen:`var(--body-height)`
      },
      screens:{
        xs:`400px`
      }
    },
  },
  plugins: [],
}

