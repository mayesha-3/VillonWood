/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        villon: {
          beige: '#f4eee6',
          cream: '#faf6f0',
          canvas: '#ebe3d5',
          brown: '#4a3324',
          'brown-dark': '#2d1e14',
          chestnut: '#734a32',
          rust: '#c46238',
          amber: '#d97736',
          gold: '#c88a2b',
          parchment: '#dfc284',
          'parchment-light': '#f8ebd2',
          'parchment-card': '#f8ebd7',
          'parchment-border': '#b88d55',
        }
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
        cursive: ['Dancing Script', 'Brush Script MT', 'cursive', 'serif'],
      }
    },
  },
  plugins: [],
}
