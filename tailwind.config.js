/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#AF101A', // Classic Lego Red
        'on-primary': '#FFFFFF',
        'on-primary-fixed': '#410003',
        'brick-blue': '#0055A4', // Classic Lego Blue
        'brick-yellow': '#FFD700', // Classic Lego Yellow
        'brick-green': '#00852B', // Classic Lego Green
        'on-surface': '#1A1C1C', // Dark Ink / Heavy Outline
        'on-surface-variant': '#5B403D',
        'surface': '#F9F9F9',
        'surface-container': '#EEEEEE',
        'surface-container-high': '#E8E8E8',
        'surface-container-highest': '#E2E2E2',
        'surface-container-low': '#F3F3F3',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Work Sans', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
        'button-text': ['Plus Jakarta Sans', 'sans-serif'],
        'label-caps': ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'brick-sm': '2px 2px 0px 0px #1A1C1C',
        'brick': '4px 4px 0px 0px #1A1C1C',
        'brick-md': '6px 6px 0px 0px #1A1C1C',
        'brick-lg': '8px 8px 0px 0px #1A1C1C',
        'brick-red': '4px 4px 0px 0px #AF101A',
        'brick-yellow': '4px 4px 0px 0px #FFD700',
        'brick-blue': '4px 4px 0px 0px #0055A4',
      }
    },
  },
  plugins: [],
}
