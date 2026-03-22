import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 1420,
    strictPort: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
