/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          default: '#F9F8F6', // Off-white
          paper: '#FFFFFF',   // Branco puro dos cards
        },
        brand: {
          primary: '#007A78', // Verde esmeralda escuro
          light: '#E6F2F2',
          dark: '#005C5A',
        },
        alert: {
          warning: '#D97706', // Âmbar
          light: '#FEF3C7',
        },
        charcoal: {
          dark: '#1A1D1A',
          medium: '#6B706C',
          divider: '#EBE9E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}