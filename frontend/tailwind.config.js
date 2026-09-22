/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#050505',
          card: '#0d1117',
          border: 'rgba(255, 255, 255, 0.08)',
          textMuted: '#b1bbb1',
        },
        accent: {
          orange: '#DC8016',
          gold: '#FBB03B',
          emerald: '#10B981',
        }
      }
    },
  },
  plugins: [],
}
