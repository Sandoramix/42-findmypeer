import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.tsx"],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...fontFamily.sans],
				"futura-bold": "futura-bold",
				"futura-medium": "futura-medium",
				"futura-light": "futura-light",
			},
			height: {
				myscreen: `var(--body-height)`
			},
			screens: {
				xs: `400px`,
				"xs-sm": "560px",
				sm: `700px`
			},
			fontSize: {
				xxxs: "0.4rem",
				xxxm: `.5rem`,
				xxs: "0.6rem",
			},
		},
	},
	plugins: [],
} satisfies Config;
