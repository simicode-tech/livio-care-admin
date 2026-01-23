/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
        content: [
            './pages/**/*.{js,ts,jsx,tsx,mdx}',
            './components/**/*.{js,ts,jsx,tsx,mdx}',
            './app/**/*.{js,ts,jsx,tsx,mdx}',
        ],
    extend: {
      fontFamily: {
        sans: ['var(--font-sf-pro)'],
      },
    },
  },
    extend: {
        color: { "primary":"#5D055E"},
        keyframes: {
            "caret-blink": {
                "0%,70%,100%": { opacity: "1" },
                "20%,50%": { opacity: "0" },
            },
        },
        animation: {
            "caret-blink": "caret-blink 1.25s ease-out infinite",
        },
    },
}
