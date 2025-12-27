/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-white': '#FAFAFA',
        'brand-black': '#121212',
        'brand-gray': '#E5E5E5',
        'brand-dark-gray': '#717171',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      letterSpacing: {
        widest: '.2em',
      },
    },
  },
  plugins: [],
}
