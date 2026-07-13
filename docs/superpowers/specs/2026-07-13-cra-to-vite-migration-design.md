# CRA → Vite Migration Design

**Date:** 2026-07-13
**Project:** Ursaworks (WashU RoboMaster) marketing site — `react-ursaworks/`
**Status:** Approved design, pending implementation plan

## Motivation

The app is built on Create React App (`react-scripts` 5.0.1), which is unmaintained. Its frozen dependency tree caused a concrete failure: an auto-installed `typescript@7` broke `@typescript-eslint@5` and made `npm run dev` fail with a misleading `jest/globals` ESLint error. Moving to Vite removes the dead toolchain, gives a modern dev server/build, and eliminates the class of dependency-skew problems that CRA can no longer guard against.

## Scope

**Swap + modern tooling.** Replace the bundler AND refresh the peripheral toolchain (test runner, linting). Explicitly:

- **Keep:** all live components, `syncAssets.js`, the `content.json` flow, gh-pages deploy, same build output folder, same primary command names.
- **Add:** Vitest (with a real smoke test), a modern ESLint flat config.
- **Remove:** the `typescript@4.9.5` pin (only existed to patch CRA's ESLint chain), the broken CRA smoke test, and other CRA-only build deps.
- **Out of scope:** removing dormant code (`Management.js`, `apiFunctions.js`, commented-out `Team`), and any redesign of the content-sync pipeline. These stay as-is.

## Approach

**In-place conversion** (chosen over a fresh `npm create vite` scaffold): keep the existing `src/` tree where it is and swap the build tooling around it. Lowest risk — components, styles, `syncAssets.js`, and the content flow are untouched except where Vite strictly requires a change. A fresh scaffold would turn the diff into "delete everything / add everything," which is harder to review and prone to drift from current behavior.

## Detailed changes

### 1. Dependencies (`react-ursaworks/package.json`)

- **Remove:** `react-scripts`, `typescript`, `@babel/plugin-proposal-private-property-in-object`.
- **Add (devDependencies):** `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `globals`.
- **Keep:** `@fortawesome/*`, `@testing-library/{react,jest-dom,user-event}` (reused by Vitest), `web-vitals`, `gh-pages`.

### 2. Entry HTML & Vite config

- Move `public/index.html` → project-root `react-ursaworks/index.html`.
- Replace every `%PUBLIC_URL%/…` with `/…`.
- Add `<script type="module" src="/src/index.jsx"></script>` before `</body>`.
- New `vite.config.js`:
  - `plugins: [react()]`
  - `base: './'` — reproduces CRA's `homepage: "."` so built asset URLs are **relative** (required for the GitHub Pages sub-path `…github.io/ursaworks/`).
  - `build.outDir: 'build'` — keeps the output folder name identical so `gh-pages -d build` is unchanged.
  - `test` block (see §7).

### 3. JSX file renames (`git mv`, preserves history)

Rename `.js → .jsx` for every file containing JSX:
`src/index`, `src/App`, `src/configs/GlobalController`, `src/screens/Main`, `src/screens/Management`, and all `src/components/*`.

Stay `.js` (no JSX): `src/configs/loadImages`, `src/apis/apiFunctions`, `src/reportWebVitals`, `syncAssets`.

Update the corresponding `import` specifiers where extensions are referenced (most imports are extensionless and need no change).

### 4. `loadImages.js` — the one webpack-specific change (highest risk)

CRA's `require.context` is webpack-only. Replace with Vite's `import.meta.glob`:

```js
const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const loadImage = (folder, imageName) => images[`../assets/${folder}/${imageName}`] ?? null;
```

Notes:
- Glob keys are paths **relative to `loadImages.js`**, so the lookup key is `../assets/<folder>/<name>`.
- This is a dynamic runtime lookup (`content.json` supplies `folder`/`name`), so it must be verified against every category (`about`, `events`, `robots`) after conversion.
- Direct asset imports elsewhere (`import logo from '../assets/…svg'`) need **no** change — Vite returns a URL string exactly like CRA.

### 5. `syncAssets.js` — unchanged

Still runs before `dev`/`build` via npm scripts. The `content/assets → src/assets → public/assets` flow is preserved. `import.meta.glob` reads from `src/assets`, which `syncAssets` populates, so the pipeline is intact.

### 6. npm scripts

```jsonc
"dev":     "node syncAssets.js && vite",
"start":   "node syncAssets.js && vite",     // kept as alias for muscle memory
"build":   "node syncAssets.js && vite build",
"preview": "vite preview",
"test":    "vitest",
"lint":    "eslint .",
"predeploy": "npm run build",
"deploy":  "gh-pages -d build"
```

- **Remove** the `postinstall` symlink hack (`ln -sf $(pwd)/content $(pwd)/node_modules/content`): nothing imports `content` from `node_modules`, and it breaks on Windows/CI. *(Flagged for veto in spec review.)*
- Remove the old `eslintConfig` and `browserslist` blocks from `package.json` (browserslist is unused by Vite; targets move to Vite defaults / `build.target`).

### 7. Testing (Vitest)

- Add a `test` block to `vite.config.js`: `environment: 'jsdom'`, `globals: true`, `setupFiles: './src/setupTests.js'` (existing file, already loads `@testing-library/jest-dom`).
- Replace `src/App.test.js` (asserts "learn react" text that does not exist in this app → currently meaningless/failing) with a real smoke test: render `<App />` and assert a real element renders (e.g. the mission intro text or the "Our Mission" section title).

### 8. ESLint (flat config)

- New `react-ursaworks/eslint.config.js`: `@eslint/js` recommended + `eslint-plugin-react` + `eslint-plugin-react-hooks`, with the React 17+ JSX runtime (no `React` import required) and `globals.browser`.
- Delete the `eslintConfig` block from `package.json`.

## Success criteria / verification

1. `npm run dev` serves locally, compiles clean, and renders **identically** — every robot/event/about image loads (validates the `import.meta.glob` conversion).
2. `npm run build` emits `build/` with **relative** asset paths (`./assets/…`, `./static/…`).
3. `npm run preview` serves the built site with all images intact — this is the pre-deploy gate that catches a wrong `base` before publishing.
4. `npm test` (Vitest) is green.
5. `npm run lint` runs.
6. `npm run deploy` publishes `build/` to the `gh-pages` branch of `origin` (`MichaelXu27/ursaworks`), same as before.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| `import.meta.glob` key/path mismatch in `loadImage` breaks dynamic image lookup | Eager glob into a path-keyed map; verify each category renders in dev before building |
| Wrong `base` → commands succeed but deployed page is blank (404s on JS/CSS) | `base: './'`; mandatory `npm run preview` check before deploy |
| gh-pages publishes wrong folder | `build.outDir: 'build'` keeps `gh-pages -d build` unchanged |
| Dropping the `postinstall` symlink breaks an unseen consumer | Grep confirms nothing imports `content` from `node_modules`; reversible |

## Explicitly unchanged

- `content.json` content-management flow and `syncAssets.js` logic.
- gh-pages deploy target and branch.
- Dormant code (`Management.js`, `apiFunctions.js`, `Team`), `reportWebVitals`, `web-vitals`.
- FontAwesome usage, all component styles, `public/` static assets (favicons, `manifest.json`, `robots.txt`).
