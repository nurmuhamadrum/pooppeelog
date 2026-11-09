/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'poop-brown': '#8B5E3C',
        'pee-amber': '#F5B700',
        'drip-blue': '#3BA3E8',
        'both-teal': '#2FB8AC',
        'emergency': '#FF5A5F',
        'cream-bg': '#FFF6EA',
        'peach-tint': '#F3E3D6',
        'ink': '#2B1A0E',
        'dark-bg': '#1E1A17',
        'dark-surface': '#2E2823',
        'dark-border': '#3D352E',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
