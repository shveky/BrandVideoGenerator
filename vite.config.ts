import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Vite serves the in-browser control panel only.
// Remotion has its own bundler for studio + renders.
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'src/app'),
  publicDir: resolve(__dirname, 'public'),
  server: { port: 5173, open: true },
  build: {
    outDir: resolve(__dirname, 'dist/panel'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@compositions': resolve(__dirname, 'src/compositions'),
      '@scenes': resolve(__dirname, 'src/scenes'),
    },
  },
});
