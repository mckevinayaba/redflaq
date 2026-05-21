/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        bg: '#08080f',
        card: '#111118',
        section: '#0d0d1a',
        purple: '#6C35DE',
        danger: '#C0392B',
      },
    },
  },
  plugins: [],
};
