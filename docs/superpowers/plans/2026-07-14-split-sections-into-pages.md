# Split About & Events into standalone pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **For the human implementer:** This plan is written to be followed by hand or while pairing. Each task ends with a working, verifiable app. Run all `npm` commands from inside `react-ursaworks/`.

**Goal:** Turn the single scrolling page into a routed multi-page site — a standalone Hero homepage at `/`, plus `/about` and `/events` pages — with the Ursaworks logo linking home.

**Architecture:** Introduce `react-router-dom` (`BrowserRouter`). A shared `Layout` (navbar + footer + background grid + `<Outlet/>`) wraps three route pages. The Hero's scroll-fade moves to the `Home` page; the old active-tab `IntersectionObserver` is deleted in favor of `NavLink` active state. GitHub Pages clean-path support comes from `base: '/'` plus a `404.html` SPA-redirect shim.

**Tech Stack:** React 18, Vite 6, `react-router-dom` ^6, Vitest + Testing Library, deployed to GitHub Pages (`gh-pages -d build`) on the custom domain `ursaworks.club`.

## Global Constraints

- Run all `npm` commands from `react-ursaworks/`.
- The site is served at the **root** of the custom domain `ursaworks.club` (via `public/CNAME`) — asset base must be absolute `/`, and the `404.html` shim keeps **0** path segments.
- Do not touch dormant code (`screens/Management.jsx`, `apis/`, `components/Team.jsx`).
- Do not change the internals or styling of `About.jsx`, `Event.jsx`, `Hero.jsx`, `Footer.jsx` — only where they are mounted.
- `src/content.json` remains the source of truth for text; `syncAssets.js` and the deploy flow are unchanged.

---

## Task 1: Add react-router-dom and switch the asset base to `/`

**Files:**
- Modify: `react-ursaworks/package.json` (dependencies)
- Modify: `react-ursaworks/vite.config.mjs:8`

Foundation task: install the router and fix the asset base so nested routes resolve assets correctly. No routing is wired yet — the app still renders exactly as before.

- [ ] **Step 1: Install react-router-dom**

Run (from `react-ursaworks/`):

```bash
npm install react-router-dom@^6
```

Expected: `package.json` `dependencies` now includes `"react-router-dom": "^6.x.x"`; `npm` exits 0.

- [ ] **Step 2: Change the Vite asset base to absolute**

In `react-ursaworks/vite.config.mjs`, replace the base line and its stale comment:

```js
// base: '/' → absolute asset URLs. Required so assets resolve at nested routes
// like /about under BrowserRouter. Correct because the site is served at the
// root of the custom domain ursaworks.club (see public/CNAME), not a sub-path.
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
```

- [ ] **Step 3: Verify the app still builds and runs**

Run:

```bash
npm run build
```

Expected: build succeeds; `build/index.html` references assets with absolute paths like `/assets/index-*.js` (not `./assets/...`).

Then:

```bash
npm run dev
```

Expected: dev server at http://localhost:3000 renders the current single-page site unchanged (Hero, About, Events, Footer). Stop the server (Ctrl-C) when confirmed.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.mjs
git commit -m "Add react-router-dom and set absolute asset base for routing"
```

---

## Task 2: Wire up routing — Layout, pages, Navbar, and the homepage Hero fade

**Files:**
- Create: `react-ursaworks/src/components/Layout.jsx`
- Create: `react-ursaworks/src/components/ScrollToTop.jsx`
- Create: `react-ursaworks/src/pages/Home.jsx`
- Create: `react-ursaworks/src/pages/AboutPage.jsx`
- Create: `react-ursaworks/src/pages/EventsPage.jsx`
- Modify: `react-ursaworks/src/configs/GlobalController.jsx`
- Modify: `react-ursaworks/src/components/Navbar.jsx`
- Delete: `react-ursaworks/src/screens/Main.jsx`
- Modify (test): `react-ursaworks/src/App.test.jsx`
- Modify (comment only): `react-ursaworks/src/setupTests.js:3`

**Interfaces:**
- `GlobalController` renders `<BrowserRouter>` containing `<ScrollToTop/>` and a `<Routes>` tree with a `Layout` parent route and child routes `/` → `Home`, `/about` → `AboutPage`, `/events` → `EventsPage`, `*` → `<Navigate to="/" replace/>`.
- `Layout` renders `Navbar`, a `.content` wrapper containing `<Outlet/>` and `Footer`, and the `.bgAnimation` grid.
- `Navbar` takes **no props** (the old `activeTab` prop is removed); active state comes from `NavLink`.

This task is atomic: the app is mid-refactor until every file below is in place, then it becomes a working multi-page site. Do all edits, then run the checks.

- [ ] **Step 1: Write the failing tests**

Replace the entire contents of `react-ursaworks/src/App.test.jsx` with:

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('homepage does not render the About "Our Mission" section', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.queryByText('Our Mission')).not.toBeInTheDocument();
});

test('the /about route renders the About "Our Mission" section', () => {
  window.history.pushState({}, '', '/about');
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to verify the first one fails**

Run:

```bash
npm test -- --run src/App.test.jsx
```

Expected: the first test FAILS — with the current single-page `App`, "Our Mission" is present at `/`, so `not.toBeInTheDocument()` fails. (The second test passes because the old page shows About regardless.) This confirms the test drives the split.

- [ ] **Step 3: Create the ScrollToTop helper**

The scroll container is the `.container` element (`overflow-y: scroll`), not the window, and `Layout` persists across route changes — so reset both on navigation.

Create `react-ursaworks/src/components/ScrollToTop.jsx`:

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Layout (and thus the scrollable .container) stays mounted across route
// changes, so its scroll position must be reset on each navigation.
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const container = document.querySelector('.container');
        if (container) container.scrollTo(0, 0);
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
```

- [ ] **Step 4: Create the Layout component**

Create `react-ursaworks/src/components/Layout.jsx`:

```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/dashboardStyle.css';
import '../styles/bgAnimationStyle.css';

export default function Layout() {
    return (
        <div className="container">
            <Navbar />

            <div className="content">
                <Outlet />
                <Footer />
            </div>

            <div className="bgAnimation">
                <div className="bgAnimationGrid" />
            </div>
        </div>
    );
}
```

- [ ] **Step 5: Create the Home page (with the Hero scroll-fade)**

This reproduces the exact fade mechanism from the old `Main.jsx`: a fixed full-screen Hero whose opacity tracks how much of the `#hero` spacer (100vh of scroll room) is visible.

Create `react-ursaworks/src/pages/Home.jsx`:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import Hero from '../components/Hero';

export default function Home() {
    const [heroOpacity, setHeroOpacity] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        const currentHeroRef = heroRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHeroOpacity(entry.intersectionRatio);
            },
            { threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) }
        );

        if (currentHeroRef) observer.observe(currentHeroRef);

        return () => {
            if (currentHeroRef) observer.unobserve(currentHeroRef);
        };
    }, []);

    return (
        <>
            <div style={{ opacity: heroOpacity }}>
                <Hero />
            </div>
            <div id="hero" ref={heroRef} />
        </>
    );
}
```

- [ ] **Step 6: Create the About and Events page wrappers**

The existing `About` / `Event` components already render their own top padding to clear the fixed navbar, so these are thin wrappers.

Create `react-ursaworks/src/pages/AboutPage.jsx`:

```jsx
import React from 'react';
import About from '../components/About';

export default function AboutPage() {
    return <About />;
}
```

Create `react-ursaworks/src/pages/EventsPage.jsx`:

```jsx
import React from 'react';
import Event from '../components/Event';

export default function EventsPage() {
    return <Event />;
}
```

- [ ] **Step 7: Rewrite GlobalController as the router**

Replace the entire contents of `react-ursaworks/src/configs/GlobalController.jsx`:

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ScrollToTop from '../components/ScrollToTop';
import Home from '../pages/Home';
import AboutPage from '../pages/AboutPage';
import EventsPage from '../pages/EventsPage';

export default function GlobalController() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
```

- [ ] **Step 8: Rewrite the Navbar to use router links**

Replace the entire contents of `react-ursaworks/src/components/Navbar.jsx`:

```jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import '../styles/navbarStyle.css';

export default function Navbar() {
    return (
        <nav className="header">
            <Link to="/" className="headerLogoContainer">
                <img src={headerLogo} className="headerLogo" alt="Header Logo" />
            </Link>
            <div className="right">
                {[['about', 'ABOUT'], ['events', 'EVENTS']].map(([path, label]) => (
                    <NavLink
                        key={path}
                        to={`/${path}`}
                        className={({ isActive }) => `headerLink ${isActive ? 'active' : ''}`}
                    >
                        {label}
                    </NavLink>
                ))}
                <a
                    className="JoinusLink"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdA6wetVhaKAaOyRvP9hzwuNKt1eTfAjNX4nF_CTLxj_yEvfw/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    JOIN US
                </a>
            </div>
        </nav>
    );
}
```

Note: `.headerLogoContainer` was styled for a `<button>` (`background: none; border: none; cursor: pointer`). It applies to the `<Link>` (an `<a>`) fine; no CSS change needed. If you have uncommitted local edits to `Navbar.jsx`/`navbarStyle.css`, reconcile them into this version.

- [ ] **Step 9: Delete the obsolete Main screen**

`screens/Main.jsx`'s composition role is now in `Layout`, its Hero fade is in `Home`, and its active-tab observer is deleted (routing determines the active nav item).

```bash
git rm react-ursaworks/src/screens/Main.jsx
```

- [ ] **Step 10: Update the stale comment in setupTests.js**

In `react-ursaworks/src/setupTests.js`, line 3, update the comment (the observer now lives in `Home.jsx`, not `Main.jsx`):

```js
// jsdom does not implement IntersectionObserver (used by Home.jsx).
```

- [ ] **Step 11: Run the tests to verify they pass**

Run:

```bash
npm test -- --run src/App.test.jsx
```

Expected: both tests PASS. Homepage no longer shows "Our Mission"; `/about` does.

- [ ] **Step 12: Verify the routed app in the browser**

```bash
npm run dev
```

Check at http://localhost:3000:
- `/` shows only the Hero (with its scroll-fade as you scroll down); navbar + footer + background grid present.
- Clicking `ABOUT` navigates to `/about`, shows the About content, and highlights the ABOUT nav link (pink `.active`). Page opens scrolled to the top.
- Clicking `EVENTS` navigates to `/events` similarly.
- Clicking the top-left logo returns to `/` (Hero only).
- Manually visiting an unknown path like http://localhost:3000/nope redirects to `/`.

Stop the server when confirmed.

- [ ] **Step 13: Commit**

```bash
git add react-ursaworks/src
git commit -m "Route About and Events to standalone pages; logo links home"
```

---

## Task 3: Add the GitHub Pages SPA-redirect shim for clean paths

**Files:**
- Create: `react-ursaworks/public/404.html`
- Modify: `react-ursaworks/index.html` (add restore snippet in `<head>`)

Without this, a **direct visit or refresh** of `/about` or `/events` on GitHub Pages returns its 404 page instead of the app. GitHub Pages serves `404.html` for unknown paths; the shim rewrites the path into a query string, redirects to `index.html`, and a snippet there restores the real path before React Router boots. (This does not affect local `npm run dev`/`preview`, which already fall back to `index.html`.)

- [ ] **Step 1: Create the 404.html redirect page**

Create `react-ursaworks/public/404.html` (`pathSegmentsToKeep = 0` because the site is served at the domain root):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Ursaworks</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      // Redirects an unknown path into index.html with the path encoded in the query string.
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 2: Add the restore snippet to index.html**

In `react-ursaworks/index.html`, add this script inside `<head>` (immediately after the `<title>` line, before `</head>`):

```html
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      // Restores the real path that 404.html encoded into the query string.
      (function (l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function (s) {
            return s.replace(/~and~/g, '&');
          }).join('?');
          window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location));
    </script>
```

- [ ] **Step 3: Verify the build includes 404.html**

Run:

```bash
npm run build
```

Expected: build succeeds and `build/404.html` exists (Vite copies `public/` to the build root).

```bash
ls build/404.html
```

Expected: prints `build/404.html`.

- [ ] **Step 4: Commit**

```bash
git add react-ursaworks/public/404.html react-ursaworks/index.html
git commit -m "Add SPA 404 redirect shim so clean paths survive GitHub Pages refresh"
```

- [ ] **Step 5: Deploy-time verification (after `npm run deploy`)**

This is only observable on the live site. After deploying, directly visit `https://ursaworks.club/about` and refresh it — the About page should load (a brief redirect flash through `404.html` is expected on the very first hit), not a GitHub 404. Do the same for `/events`.

---

## Notes / risks

- **`react-router-dom` major version:** pinned to `^6`; all router APIs used here (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`, `Outlet`, `Navigate`, `useLocation`) are v6. If npm resolves v7, these same APIs still apply.
- **Uncommitted local edits:** the working tree has unstaged changes to `Navbar.jsx` and `navbarStyle.css`. Task 2 rewrites `Navbar.jsx` — fold any of your local changes into the new version rather than losing them.
- **`homepage: "."` in package.json:** a Create-React-App leftover Vite ignores; leave it.
- **About/Events top spacing:** relies on the existing `#aboutBlock` `padding-top: 10rem` and `#eventsBlock` `padding-top: 8rem` to clear the fixed navbar. If either looks tight on their standalone page, bump the padding in the respective stylesheet — but verify visually first before changing anything.
