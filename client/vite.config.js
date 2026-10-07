import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      // Keep browser requests same-origin in development; Vite forwards /api to Express.
      '/api': 'http://localhost:5000',
    },
  },
})
