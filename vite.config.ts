import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Deve coincidir com serveRoot do WAHA (/dashboard)
export default defineConfig({
  plugins: [react()],
  base: '/dashboard/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_WAHA_DEV_PROXY ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/ping': {
        target: process.env.VITE_WAHA_DEV_PROXY ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/health': {
        target: process.env.VITE_WAHA_DEV_PROXY ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
});
