/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        width: 'width',
      },
      colors: {
        sidebar: 'rgba(var(--sidebar))',
        left: 'rgba(var(--left))',
        right: 'rgba(var(--right))',
        button: 'rgba(var(--button))',
        sidebarButtonAccent: 'rgba(var(--sidebarButtonAccent))',
      },
    },
  },
  plugins: [],
};
