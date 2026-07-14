# Design: Split About & Events into standalone pages

**Date:** 2026-07-14
**Status:** Approved, pending implementation plan

## Goal

Convert the single-scrolling-page site into a multi-page site with client-side
routing. The homepage becomes a standalone landing page (the Hero, plus a future
intro section the author will add later that funnels visitors to the other
pages). "About" and "Events" become their own pages at clean URLs. The Ursaworks
logo in the top-left navigates back to the homepage.

## Current state

- Single-page React (Vite) app deployed to GitHub Pages on a custom domain
  (`ursaworks.club`, via `public/CNAME`), served at the domain root.
- No router. `screens/Main.jsx` composes one long page: `Navbar`, `Hero`, then a
  `.content` block containing `About`, `Event`, and `Footer`, plus a `bgAnimation`
  grid.
- Navigation is anchor-based: `Navbar` renders `ABOUT` / `EVENTS` as `href="#..."`
  links. `Main.jsx` runs two `IntersectionObserver`s: one fades the Hero on scroll,
  one tracks which section is most visible to highlight the active nav tab
  (`activeTab` prop passed into `Navbar`).
- The logo in the navbar is a dead `<button>` (no handler).
- `vite.config.mjs` uses `base: './'` (relative asset URLs) — a leftover from when
  the site was served from a GitHub Pages sub-path, before the custom domain.

## Decisions

- **Routing library:** `react-router-dom` (`BrowserRouter`). Rejected: hand-rolled
  History API routing (reinvents links/active-state/scroll for no benefit); hash
  routing (author chose clean paths).
- **URL style:** clean paths (`/about`, `/events`), not hash URLs.
- **Homepage content:** just the Hero for now; author will add an intro section
  later. No duplicated About/Events content on the homepage.
- **Shared chrome:** navbar, footer, and animated background grid appear on every
  page via one shared layout.
- **Unknown URLs:** redirect to the homepage (`/`), not a dedicated 404 page.
- **Hero scroll-fade:** preserved, scoped to the homepage.

## Routing structure

`App → GlobalController → BrowserRouter → Routes`

| Path      | Page          | Renders                                  |
|-----------|---------------|------------------------------------------|
| `/`       | Home          | `<Hero/>` (+ future intro section)        |
| `/about`  | About page    | existing `<About/>`                       |
| `/events` | Events page   | existing `<Event/>`                       |
| `*`       | catch-all     | redirect to `/`                           |

All routes render inside a shared `Layout` (navbar + `<Outlet/>` + footer +
background grid), so the chrome mounts once and persists across navigation.

## Files

**New:**
- `src/components/Layout.jsx` — shared chrome: `Navbar`, `<Outlet/>`, `Footer`,
  `bgAnimation` grid. Absorbs `Main.jsx`'s composition role.
- `src/pages/Home.jsx` — renders `<Hero/>`; owns the Hero scroll-fade
  `IntersectionObserver` (moved from `Main.jsx` as-is), ready to sit above the
  future intro section.
- `src/pages/AboutPage.jsx` — thin wrapper rendering the existing `<About/>`.
- `src/pages/EventsPage.jsx` — thin wrapper rendering the existing `<Event/>`.
- `src/components/ScrollToTop.jsx` — on route change, scrolls window to top so
  About/Events open at the top rather than inheriting scroll position.
- `public/404.html` — SPA redirect shim (rafgraph/spa-github-pages), configured
  for a root-served site (keep 0 path segments).

**Changed:**
- `src/configs/GlobalController.jsx` — sets up `<BrowserRouter>` + `<Routes>` +
  `ScrollToTop` instead of rendering `<Main/>`.
- `src/components/Navbar.jsx` — logo `<button>` → `<Link to="/">`; `ABOUT`/`EVENTS`
  → `<NavLink>`s whose active styling comes from `NavLink`'s built-in active state;
  drop the `activeTab` prop. `JOIN US` stays an external link.
- `src/App.test.jsx` — currently renders `<App/>` and asserts "Our Mission" is on
  screen; that content now lives at `/about`. Update it to render at the `/about`
  route so it still verifies the About content mounts.
- `vite.config.mjs` — `base: './'` → `base: '/'` (absolute asset URLs, required so
  assets resolve correctly at nested routes like `/about`; correct because the site
  is served at the custom-domain root). Update the stale sub-path comment.
- `index.html` — add the SPA-redirect restore snippet (companion to `404.html`).
- `package.json` — add `react-router-dom` dependency.

**Removed:**
- `src/screens/Main.jsx` — composition role → `Layout`; Hero-fade observer → `Home`;
  active-tab `IntersectionObserver` deleted entirely (routing now determines the
  active nav item).

## GitHub Pages / deploy considerations

Clean paths under `BrowserRouter` require two things on GitHub Pages, which has no
server-side routing:

1. **`base: '/'`** — with `base: './'`, an asset referenced as `./assets/x.js`
   resolves relative to the current path, so at `/about` it becomes
   `/about/assets/x.js` (404). Absolute `/` fixes this and is correct for a
   root-served custom domain.
2. **`404.html` SPA shim** — GitHub Pages serves `404.html` for unknown paths. A
   ~15-line script there rewrites the requested path into a query string and
   redirects to `index.html`; a companion snippet in `index.html` restores the
   original path before React Router boots. This makes direct visits and refreshes
   of `/about` and `/events` work. Configure for 0 kept path segments (root domain).

The `gh-pages -d build` deploy flow and `syncAssets.js` are unaffected. `CNAME`
already lives in `public/` and continues to be published.

## Out of scope

- The homepage intro section (author will add it later).
- Any change to `About`/`Event`/`Footer`/`Hero` internals or styling.
- Dormant code (`screens/Management.jsx`, `apis/`, `components/Team.jsx`).
