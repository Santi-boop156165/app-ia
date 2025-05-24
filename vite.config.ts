import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss(),
],
  server: {
    proxy: {
      '/api/proxy': {
        target: 'http://52.201.253.226:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/proxy/, ''),
      },
    },
  },
})
