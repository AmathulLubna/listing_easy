import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/listing_easy/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
