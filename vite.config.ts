import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('crypto-js') || id.includes('sha256') || id.includes('sha512') || id.includes('md5')) {
              return 'crypto-vendor';
            }
            if (id.includes('qrcode') || id.includes('date-fns') || id.includes('zxcvbn')) {
              return 'utils-vendor';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild', // Use esbuild for faster builds
  },
  server: {
    port: 5173,
    open: true
  }
})
