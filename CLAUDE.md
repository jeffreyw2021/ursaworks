# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing/landing site for **Ursaworks**, the RoboMaster team at Washington University in St. Louis. Single-page React site (Vite) deployed to GitHub Pages. Content (mission text, robots, events) is data-driven from a JSON file plus image assets.

## Layout

The git repo root contains two things:
- `content/assets/` — source-of-truth **images**, organized into `about/`, `events/`, `members/`, `robots/`.
- `react-ursaworks/` — the actual React app. **Run all npm commands from inside `react-ursaworks/`.**

## Commands

Run from `react-ursaworks/`:

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

## Asset sync (`syncAssets.js`)

`sync`, `dev`, `start`, and `build` all run `syncAssets.js` first. It:
1. Copies the four category folders (`about`, `events`, `members`, `robots`) from `../content/assets/` → `src/assets/`.
2. Copies all of `src/assets/` → `public/assets/`.
3. Deletes files in the destinations that no longer exist in the source (so removing an image from `content/assets/` removes it downstream on next sync).

`src/assets/` and `public/assets/` are generated — **edit images in `content/assets/` only**, then re-sync. Non-category asset folders (e.g. `src/assets/logoItems/`) live directly under `src/assets/` and are not managed by the content sync; they are imported directly by components.

## Content data

**`src/content.json` is the source of truth for all text** (mission `intro`, `robots[]`, `events[]`, `team[]`, `aboutImage`). Edit it directly and commit it — it is imported straight into components (`import content from "../content.json"`).

> Note: `readme.md` describes an older workflow where text lived in `content/content.json` and was synced into the app. That file no longer exists and `syncAssets.js` does **not** copy any JSON — only images. Treat `src/content.json` as authoritative; ignore the readme's JSON-sync instructions (its image instructions are still accurate).

Each robot/event/member entry references an image by filename (e.g. `"image": "hero.png"`); the matching file must exist in the corresponding `content/assets/<category>/` folder. Components resolve these at runtime via `configs/loadImages.js`, which uses `import.meta.glob` — so a referenced image only resolves if it has been synced into `src/assets/`.

## App structure

`App.jsx` → `configs/GlobalController.jsx` → `screens/Main.jsx` is the only rendered path. `Main.jsx` composes the single page from `components/` (`Navbar`, `Hero`, `About`, `Event`, `Footer`) and drives the active-nav-tab highlight and hero fade via `IntersectionObserver`. Each component pairs with a stylesheet in `src/styles/`.

`src/configs/loadImages.js` resolves images via Vite's `import.meta.glob` (not webpack `require.context`).

**Dormant code — not wired into the app:** `screens/Management.jsx`, `apis/apiFunctions.js` (a CRUD admin panel against a `PLACEHOLDER_ENDPOINT`), and `components/Team.jsx` (the team section is commented out in `Main.jsx`). Don't assume these run; check `Main.jsx` before relying on them.
