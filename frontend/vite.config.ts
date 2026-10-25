import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': `http://127.0.0.1:${process.env.AI_API_PORT || 3001}`
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})
