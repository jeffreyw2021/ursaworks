# CRA → Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unmaintained Create React App toolchain in `react-ursaworks/` with Vite, keeping identical behavior, deploy, and command names, while adding Vitest and a modern ESLint flat config.

**Architecture:** In-place conversion — the existing `src/` tree stays where it is; only the build tooling around it changes. All work happens inside `react-ursaworks/`. The single webpack-specific code dependency (`require.context` in `loadImages.js`) is replaced with Vite's `import.meta.glob`.

**Tech Stack:** Vite 6, `@vitejs/plugin-react`, Vitest + jsdom, ESLint 9 flat config, React 18. `syncAssets.js` (asset sync) and `gh-pages` (deploy) are unchanged.

## Global Constraints

- **All commands run from `react-ursaworks/`.** Paths below are relative to that directory.
- **Node 18+** required (Vite 6). If `node -v` is lower, stop and report.
- **`base: './'`** in Vite config — produces relative asset URLs required for the GitHub Pages sub-path. NEVER change to `'/'`.
- **`build.outDir: 'build'`** — keeps `gh-pages -d build` working; the deploy command must not change.
- **Command names preserved:** `dev`, `start`, `build`, `test`, `deploy` keep their current meanings.
- **`package.json` stays CommonJS** (no `"type": "module"`) because `syncAssets.js` uses `require`. Vite/ESLint config files therefore use the `.mjs` extension. `syncAssets.js` is NOT modified.
- **Do not touch** `syncAssets.js`, the `content.json` flow, `public/` static assets, or dormant code (`Management`, `apiFunctions`, `Team`).

---

### Task 1: Cut over to Vite (dev server runs)

Atomic cutover: nothing runs until dependencies, config, HTML entry, file renames, and the `loadImages` conversion are all done together. Deliverable: `npm run dev` compiles and serves the app with images rendering.

**Files:**
- Modify: `react-ursaworks/package.json` (full rewrite of deps + scripts)
- Create: `react-ursaworks/vite.config.mjs`
- Create: `react-ursaworks/index.html`
- Delete: `react-ursaworks/public/index.html`
- Rename (`git mv`): 11 JSX files `.js → .jsx`
- Modify: `react-ursaworks/src/configs/loadImages.js`

**Interfaces:**
- Produces: `loadImage(folder: string, imageName: string) => string | null` (unchanged signature; new implementation).
- Produces: Vite entry at `/src/index.jsx`; dev server on port 3000.

- [ ] **Step 1: Verify Node version**

Run: `node -v`
Expected: `v18.x` or higher. If lower, stop and report — Vite 6 will not run.

- [ ] **Step 2: Rewrite `package.json`**

Replace the entire file with:

```json
{
  "name": "react-ursaworks",
  "version": "0.1.0",
  "homepage": ".",
  "private": true,
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.6.0",
    "@fortawesome/free-brands-svg-icons": "^6.6.0",
    "@fortawesome/free-regular-svg-icons": "^6.6.0",
    "@fortawesome/free-solid-svg-icons": "^6.6.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "sync": "node syncAssets.js",
    "dev": "node syncAssets.js && vite",
    "start": "node syncAssets.js && vite",
    "build": "node syncAssets.js && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint .",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "devDependencies": {
    "@eslint/js": "^9.13.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^9.13.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "gh-pages": "^6.1.1",
    "globals": "^15.11.0",
    "jsdom": "^25.0.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

Changes vs. old file: removed `react-scripts`, `typescript`, `@babel/plugin-proposal-private-property-in-object`; removed the `postinstall` symlink, `eslintConfig`, and `browserslist` blocks; added Vite/Vitest/ESLint dev deps; rewrote `scripts`.

- [ ] **Step 3: Install dependencies**

Run: `rm -rf node_modules package-lock.json && npm install`
Expected: install completes. Peer-dependency warnings are acceptable. `ls node_modules/vite/package.json` and `ls node_modules/react-scripts 2>/dev/null` — the first exists, the second does not.

- [ ] **Step 4: Rename JSX files to `.jsx` (preserves git history)**

Run:
```bash
git mv src/index.js src/index.jsx
git mv src/App.js src/App.jsx
git mv src/configs/GlobalController.js src/configs/GlobalController.jsx
git mv src/screens/Main.js src/screens/Main.jsx
git mv src/screens/Management.js src/screens/Management.jsx
git mv src/components/About.js src/components/About.jsx
git mv src/components/Event.js src/components/Event.jsx
git mv src/components/Footer.js src/components/Footer.jsx
git mv src/components/Hero.js src/components/Hero.jsx
git mv src/components/Navbar.js src/components/Navbar.jsx
git mv src/components/Team.js src/components/Team.jsx
```
No import statements need editing — all internal imports are extensionless and Vite resolves `.jsx`. Files that stay `.js` (no JSX): `src/configs/loadImages.js`, `src/apis/apiFunctions.js`, `src/reportWebVitals.js`, `src/setupTests.js`.

- [ ] **Step 5: Create `vite.config.mjs`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → relative asset URLs (required for the GitHub Pages sub-path).
// outDir: 'build' → keeps `gh-pages -d build` working.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 3000, open: false },
  build: { outDir: 'build' },
});
```

- [ ] **Step 6: Create root `index.html` and delete `public/index.html`**

Create `react-ursaworks/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#080808" />
    <meta name="description" content="WashU RoboMaster" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>WashU Robomaster</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

Then run: `git rm public/index.html`
(Vite uses the root `index.html`; the leading-slash public paths above are rebased by `base` at build time.)

- [ ] **Step 7: Convert `loadImages.js` to `import.meta.glob`**

Replace the entire contents of `src/configs/loadImages.js` with:

```js
// Resolve images from src/assets by folder + filename.
// import.meta.glob is Vite's replacement for webpack's require.context.
const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const loadImage = (folder, imageName) => {
  const key = `../assets/${folder}/${imageName}`;
  if (!(key in images)) {
    console.error(`Image ${imageName} not found in folder ${folder}`);
    return null;
  }
  return images[key];
};

export default loadImage;
```

- [ ] **Step 8: Run the dev server and verify**

Run: `npm run dev`
Expected: syncAssets logs succeed, then `VITE v6.x ready` with `Local: http://localhost:3000/`.

In a second shell:
Run: `curl -s http://localhost:3000 | grep -o '<title>[^<]*</title>'`
Expected: `<title>WashU Robomaster</title>`

Then open `http://localhost:3000` in a browser and confirm the robot images (About section) and event images render — this validates the `import.meta.glob` conversion. Stop the dev server (Ctrl-C) when done.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Migrate build tooling from CRA to Vite

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Vitest tests green (`npm test`)

**Files:**
- Modify: `react-ursaworks/vite.config.mjs` (add `test` block)
- Modify (overwrite): `react-ursaworks/src/setupTests.js`
- Rename + rewrite: `react-ursaworks/src/App.test.js → src/App.test.jsx`
- Create: `react-ursaworks/src/configs/loadImages.test.js`

**Interfaces:**
- Consumes: `loadImage` from Task 1; `<App />` from `src/App.jsx`.

- [ ] **Step 1: Add the Vitest `test` block to `vite.config.mjs`**

Replace the whole file with (import now comes from `vitest/config`):

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

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
```

- [ ] **Step 2: Overwrite `src/setupTests.js` (add IntersectionObserver stub)**

`Main.jsx` constructs `IntersectionObserver`, which jsdom does not implement — without a stub, `render(<App />)` throws. Replace the file with:

```js
import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver (used by Main.jsx).
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub;
```

- [ ] **Step 3: Write the failing smoke test**

Rename and replace the broken CRA test (it asserts "learn react", which does not exist in this app):

Run: `git mv src/App.test.js src/App.test.jsx`

Then replace `src/App.test.jsx` contents with:

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the mission section heading', () => {
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
});
```

- [ ] **Step 4: Write the loadImages regression test**

Create `src/configs/loadImages.test.js`:

```js
import { describe, it, expect } from 'vitest';
import loadImage from './loadImages';

describe('loadImage', () => {
  it('resolves a known robot image to a URL', () => {
    expect(loadImage('robots', 'hero.png')).toBeTruthy();
  });

  it('returns null for a missing image', () => {
    expect(loadImage('robots', 'nope.png')).toBeNull();
  });
});
```

- [ ] **Step 5: Run the tests**

Run: `npm test -- --run`
Expected: PASS — 2 files, 3 tests passing. (`--run` makes Vitest run once instead of watch mode.)

If `getByText('Our Mission')` fails, confirm `src/components/About.jsx` still renders the literal `Our Mission` heading; do not change the component to fit the test.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Vitest with smoke and loadImages tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: ESLint flat config (`npm run lint` passes)

**Files:**
- Create: `react-ursaworks/eslint.config.mjs`

- [ ] **Step 1: Create `eslint.config.mjs`**

```js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['build/**', 'dist/**', 'node_modules/**', 'public/**', 'coverage/**'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.test.{js,jsx}', 'src/setupTests.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
];
```

Rationale for the rule overrides: `react-in-jsx-scope`/`prop-types` off (React 17+ JSX runtime, no PropTypes in this codebase); `no-unescaped-entities` off (event copy contains apostrophes); `no-unused-vars` downgraded to a warning so pre-existing unused props/imports in the dormant components don't fail the lint gate (fixing them is out of scope).

- [ ] **Step 2: Run the linter**

Run: `npm run lint`
Expected: exits 0. Warnings (e.g. unused `React` imports, unused `aboutRef`/`eventsRef` props) are acceptable; there must be no errors.

If any **errors** appear, read them — a real error (e.g. `no-undef` for a missing browser global) should be fixed by adding the global to the config, not by editing components.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add ESLint flat config

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Verify production build + preview, update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (repo root) — refresh the CRA references

**Interfaces:**
- Consumes: everything from Tasks 1–3.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: syncAssets logs, then `vite build` completes and writes to `build/`. `ls build/index.html build/assets` succeeds.

- [ ] **Step 2: Verify asset URLs are relative (the deploy-correctness check)**

Run: `grep -o 'src="[^"]*"' build/index.html`
Expected: the bundle script path starts with `./` (e.g. `src="./assets/index-XXXXXXXX.js"`), NOT `/assets/...`. A leading `/` here means the deployed page would 404 on GitHub Pages — if you see that, `base` is wrong.

- [ ] **Step 3: Preview the built site**

Run: `npm run preview` (serves `build/` on `http://localhost:4173/`)
In a second shell:
Run: `curl -s http://localhost:4173/ | grep -o '<title>[^<]*</title>'`
Expected: `<title>WashU Robomaster</title>`

Open `http://localhost:4173/` in a browser and confirm images render from the production bundle. Stop the preview server when done. Do NOT run `npm run deploy` — deploy is left for the maintainer to run intentionally.

- [ ] **Step 4: Update `CLAUDE.md`**

In the repo-root `CLAUDE.md`, replace the CRA-specific guidance so future sessions aren't misled. Specifically:
- In the overview, change "Single-page React site (Create React App)" to "Single-page React site (Vite)".
- Replace the `## Commands` fenced block with:

```bash
npm install        # installs deps
npm run dev        # sync assets + start Vite dev server (http://localhost:3000)
npm start          # alias of dev
npm run sync       # run syncAssets.js only (copy images, no server)
npm run build      # sync + Vite production build into build/
npm run preview    # serve the built build/ folder locally (http://localhost:4173)
npm run deploy     # build + publish build/ to GitHub Pages (gh-pages)
npm test           # Vitest (watch mode); add -- --run for a single pass
npm test -- --run src/App.test.jsx   # run one test file once
npm run lint       # ESLint (flat config)
```

- Delete the sentence stating that `react-scripts` is unmaintained and the note about the `typescript@4.9.5` pin (both no longer apply).
- Add one line noting the webpack→Vite asset detail: "`src/configs/loadImages.js` resolves images via Vite's `import.meta.glob` (not webpack `require.context`)."

Leave the asset-sync and content-data sections unchanged — they still describe the real workflow.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md for Vite toolchain

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notes on verification

The migration's real risk is not "does a command run" but "does the deployed page render." That risk is covered by three checkpoints: the browser image check in Task 1 (dev), the `loadImages` regression test in Task 2, and the relative-URL grep + preview in Task 4 (production). Only after Task 4 passes should the maintainer run `npm run deploy`.
