/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'aeonik': ['aeonikFono', 'Courier New', 'monospace'],
        'roboto-condensed': ['Roboto Condensed', 'Roboto Condensed Fallback', 'Arial Narrow', 'sans-serif'],
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
    },
  },
  plugins: [],
}

module.exports = {
content: ["./src/**/*.{js,ts,jsx,tsx}"],
theme: {
extend: {
fontFamily: {
archivo: ['Archivo', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
},
},
},
plugins: [],
};
