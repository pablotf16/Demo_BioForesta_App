import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-dom/client'],
  },
  build: {
    rollupOptions: {
      plugins: [commonjs()],
    },
  },
})