import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base: '/' → absolute asset URLs, so assets resolve at nested routes like
// /about under BrowserRouter. Correct because the site is served at the root of
// the custom domain ursaworks.club (see public/CNAME), not a sub-path.
// outDir: 'build' → keeps `gh-pages -d build` working.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { port: 3000, open: false },
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
