import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base: './' → relative asset URLs (required for the GitHub Pages sub-path).
// outDir: 'build' → keeps `gh-pages -d build` working.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 3000, open: false },
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
