/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      height:{
        myscreen:`var(--body-height)`
      },
      screens:{
        xs:`400px`,
        "xs-sm":"560px",
      },
      fontSize:{
        xxxs:"0.4rem",
        xxxm:`.5rem`,
        xxs:"0.6rem",
      }
    },
  },
  plugins: [],
}

