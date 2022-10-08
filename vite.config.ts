import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: join(__dirname, 'src/renderer'),
  plugins: [react()],
  build: {
    outDir: '../../build/renderer',
    emptyOutDir: true,
  },
  base: './',
  server: {
    port: 3000,
  },
});
