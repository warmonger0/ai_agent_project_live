import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/logs': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
      '/status': 'http://localhost:8000',
      '/retry': 'http://localhost:8000',
      '/plugins': 'http://localhost:8000',
    },
    fs: {
      allow: ['..'], // allows serving one level up (useful for monorepos or shared files)
    },
  },
  appType: 'spa', // ✅ ensures fallback to index.html for all non-asset routes
  build: {
    rollupOptions: {
      input: '/index.html',
    },
  },
  resolve: {
    alias: {
      '@': '/src', // ✅ clean alias for src folder
    },
  },
});
