/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
        cursive: ['"Dancing Script"', 'cursive', 'serif'],
      },
      colors: {
        'bg-beige': '#f4eee6',
        'bg-cream': '#faf6f0',
        'bg-warm-canvas': '#ebe3d5',
        'autumn-brown': '#4a3324',
        'autumn-brown-dark': '#2d1e14',
        'autumn-chestnut': '#734a32',
        'autumn-rust': '#c46238',
        'autumn-amber': '#d97736',
        'autumn-gold': '#c88a2b',
        'autumn-green': '#587044',
        'autumn-boat-blue': '#2b7a78',
      },
      boxShadow: {
        'autumn': '0 16px 36px rgba(74, 51, 36, 0.12)',
        'frost': '0 8px 32px rgba(115, 74, 50, 0.15)',
        'glow': '0 0 20px rgba(217, 119, 54, 0.25)',
      },
    },
  },
  plugins: [],
}
