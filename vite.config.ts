import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  build: {
    outDir: 'dist',
  }
});
