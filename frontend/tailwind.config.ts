import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
        "hero": "url('/hero-bg.png')",

			},
			fontFamily: {
				satoshi: ["Satoshi", "sans-serif"],
			},
			colors: {
				secondaryText: "#49536E",
        primaryText: "#192648",
				primary: "#4A23A4",
			},
		},
	},
	plugins: [],
};
export default config;
