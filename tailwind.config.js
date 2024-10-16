/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode:'class',
  theme: {
    extend: {
      height:{
        myscreen:`var(--body-height)`
      },
      screens:{
        xs:`400px`,
        "xs-sm":"560px",
        sm:`700px`
      },
      fontSize:{
        xxxs:"0.4rem",
        xxxm:`.5rem`,
        xxs:"0.6rem",
      },
      fontFamily:{
        "futura-bold": "futura-bold",
        "futura-medium": "futura-medium",
        "futura-light": "futura-light",
      }
    },
  },
  plugins: [],
}

