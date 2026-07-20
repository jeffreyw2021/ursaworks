# Homepage Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage into a scrollable narrative — staggered hero load-in, scroll-linked hero exit, and four scroll-revealed teaser sections (Mission, Robots, Latest Event, Join CTA) linking to the existing subpages.

**Architecture:** New `src/components/home/` teaser components composed by `pages/Home.jsx`, sharing a `Reveal` viewport-reveal wrapper. `Layout.jsx` exposes its scrolling `.container` div through a `ScrollContainerContext` so the rewritten `Hero.jsx` can scrub its exit with Framer Motion's `useScroll`. Existing subpage routes/components are untouched.

**Tech Stack:** React 18, Vite, react-router-dom v6, framer-motion (new dependency), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-19-homepage-revamp-design.md`

## Global Constraints

- All `npm` commands run from `react-ursaworks/` (the app lives there, repo root does not have a package.json).
- Visual language stays exactly as-is: existing gradient (`var(--main-grad)`), grid background, fonts, colors, `.sectionTitle` style. This change is motion + content structure only.
- Animate only `transform` and `opacity`. No `window.addEventListener('scroll')`. No persistent React re-renders during scroll (Framer motion values only).
- All animated components respect `useReducedMotion()` from framer-motion: reduced users get opacity-only transitions, no y-drift, no infinite float.
- No emojis anywhere in code, markup, or copy.
- The app scrolls inside the `.container` div (`overflow-y: scroll`), NOT the window. Any scroll-linked motion must target that container.
- `src/content.json` is the source of truth for all text; teasers must import it, never hardcode robot/event/mission copy.
- Existing test pattern: `App.test.jsx` renders `<App />` after `window.history.pushState` (App uses BrowserRouter). Component tests wrap in `MemoryRouter` when the component uses `Link`.
- End every commit message with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: Install framer-motion, test stubs, and ScrollContainerContext

**Files:**
- Modify: `react-ursaworks/package.json` (via npm install)
- Modify: `react-ursaworks/src/setupTests.js`
- Create: `react-ursaworks/src/configs/ScrollContainerContext.jsx`
- Modify: `react-ursaworks/src/components/Layout.jsx`
- Test: `react-ursaworks/src/components/Layout.test.jsx`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `ScrollContainerContext` — a React context (default export of `src/configs/ScrollContainerContext.jsx`) whose value is a React ref object (`{ current: HTMLElement | null }`) pointing at the scrolling `.container` div. Later tasks read it with `useContext(ScrollContainerContext)`. Also produces jsdom stubs (`matchMedia`, `ResizeObserver`) that framer-motion needs in every later test.

- [ ] **Step 1: Install framer-motion**

Run (from `react-ursaworks/`):
```bash
npm install framer-motion
```
Expected: `framer-motion` appears under `dependencies` in `package.json`.

- [ ] **Step 2: Add jsdom stubs for framer-motion to setupTests.js**

framer-motion's `useReducedMotion` calls `window.matchMedia` and its scroll tracking uses `ResizeObserver`; jsdom implements neither. Append to `react-ursaworks/src/setupTests.js` (below the existing IntersectionObserver stub):

```js
// jsdom does not implement matchMedia (used by framer-motion's useReducedMotion).
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom does not implement ResizeObserver (used by framer-motion's scroll tracking).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver ?? ResizeObserverStub;
```

- [ ] **Step 3: Write the failing test for Layout providing the scroll container**

Create `react-ursaworks/src/components/Layout.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { useContext, useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ScrollContainerContext from '../configs/ScrollContainerContext';

// Reads the provided ref after mount (refs are only populated post-commit).
function Probe() {
    const containerRef = useContext(ScrollContainerContext);
    const [cls, setCls] = useState('');
    useEffect(() => {
        setCls(containerRef.current?.className ?? '');
    }, [containerRef]);
    return <p data-testid="probe">{cls}</p>;
}

test('Layout provides a ref to the scrolling .container div', () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Probe />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('container');
});
```

- [ ] **Step 4: Run test to verify it fails**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/Layout.test.jsx
```
Expected: FAIL — cannot resolve `../configs/ScrollContainerContext`.

- [ ] **Step 5: Create the context and provide it from Layout**

Create `react-ursaworks/src/configs/ScrollContainerContext.jsx`:

```jsx
import { createContext } from 'react';

// Ref to the scrolling .container div. The app scrolls inside that div
// (overflow-y: scroll), not the window, so scroll-linked animation hooks
// need this ref as their container.
const ScrollContainerContext = createContext({ current: null });

export default ScrollContainerContext;
```

Replace the full contents of `react-ursaworks/src/components/Layout.jsx` with:

```jsx
import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollContainerContext from '../configs/ScrollContainerContext';
import '../styles/dashboardStyle.css';
import '../styles/bgAnimationStyle.css';

export default function Layout() {
    const containerRef = useRef(null);

    return (
        <ScrollContainerContext.Provider value={containerRef}>
            <div className="container" ref={containerRef}>
                <Navbar />

                <div className="content">
                    <Outlet />
                    <Footer />
                </div>

                <div className="bgAnimation">
                    <div className="bgAnimationGrid" />
                </div>
            </div>
        </ScrollContainerContext.Provider>
    );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run (from `react-ursaworks/`):
```bash
npm test -- --run
```
Expected: PASS — new Layout test and both existing App tests green.

- [ ] **Step 7: Commit**

```bash
git add react-ursaworks/package.json react-ursaworks/package-lock.json react-ursaworks/src/setupTests.js react-ursaworks/src/configs/ScrollContainerContext.jsx react-ursaworks/src/components/Layout.jsx react-ursaworks/src/components/Layout.test.jsx
git commit -m "feat: add framer-motion and scroll container context

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Reveal wrapper component

**Files:**
- Create: `react-ursaworks/src/components/home/Reveal.jsx`
- Test: `react-ursaworks/src/components/home/Reveal.test.jsx`

**Interfaces:**
- Consumes: `framer-motion` (Task 1).
- Produces: `Reveal` — default export, props `{ children, delay?: number (seconds, default 0), className?: string }`. Renders a `motion.div` that fades/slides its children in the first time they enter the viewport. All teaser components wrap their content in it.

- [ ] **Step 1: Write the failing test**

Create `react-ursaworks/src/components/home/Reveal.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import Reveal from './Reveal';

test('renders its children', () => {
    render(
        <Reveal>
            <p>hello from inside</p>
        </Reveal>
    );
    expect(screen.getByText('hello from inside')).toBeInTheDocument();
});

test('passes className through to the wrapper element', () => {
    const { container } = render(
        <Reveal className="probeClass">
            <p>hi</p>
        </Reveal>
    );
    expect(container.querySelector('.probeClass')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/Reveal.test.jsx
```
Expected: FAIL — cannot resolve `./Reveal`.

- [ ] **Step 3: Implement Reveal**

Create `react-ursaworks/src/components/home/Reveal.jsx`:

```jsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Shared scroll-reveal wrapper: fades/slides children up the first time they
// enter the viewport. `delay` (seconds) staggers sibling reveals.
export default function Reveal({ children, delay = 0, className }) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 100, damping: 20, delay },
            }}
            viewport={{ once: true, amount: 0.3 }}
        >
            {children}
        </motion.div>
    );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/Reveal.test.jsx
```
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add react-ursaworks/src/components/home/Reveal.jsx react-ursaworks/src/components/home/Reveal.test.jsx
git commit -m "feat: add Reveal scroll-reveal wrapper

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Home stylesheet and MissionTeaser

**Files:**
- Create: `react-ursaworks/src/styles/homeStyle.css`
- Create: `react-ursaworks/src/components/home/MissionTeaser.jsx`
- Test: `react-ursaworks/src/components/home/MissionTeaser.test.jsx`

**Interfaces:**
- Consumes: `Reveal` (Task 2), `content.intro` from `src/content.json`.
- Produces: `MissionTeaser` — default export, no props. Also produces the shared home classes later tasks use: `.homeSection`, `.teaserLink`, `.heroSpacer` (plus robot/event/CTA classes defined here once so the stylesheet lands complete).

- [ ] **Step 1: Write the failing test**

Create `react-ursaworks/src/components/home/MissionTeaser.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MissionTeaser from './MissionTeaser';
import content from '../../content.json';

test('renders the mission title, intro text, and a link to /about', () => {
    render(<MissionTeaser />, { wrapper: MemoryRouter });
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(content.intro)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /more about us/i })).toHaveAttribute('href', '/about');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/MissionTeaser.test.jsx
```
Expected: FAIL — cannot resolve `./MissionTeaser`.

- [ ] **Step 3: Create the home stylesheet**

Create `react-ursaworks/src/styles/homeStyle.css` (complete file — later tasks reuse these classes without touching this file again):

```css
@import url(../App.css);

/* Scroll runway under the fixed hero: one viewport of empty space the hero
   scrubs out over before the first teaser section arrives. */
.heroSpacer {
    width: 100vw;
    height: 100vh;
}

.homeSection {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 3rem;
    padding: 4rem;
}

/* Gradient arrow-link, same visual language as .moreAboutLink on /events. */
.teaserLink {
    display: inline-flex;
    align-items: center;
    color: white;
    padding: 0.6rem 1.4rem;
    background: var(--main-grad);
    border-radius: 0.4rem;
    text-decoration: none;
}

.teaserLink:hover {
    filter: brightness(1.2);
}

.teaserLink:active {
    transform: scale(0.98);
}

.teaserLink span {
    font-weight: 500;
    margin-right: 0.6rem;
    font-size: 1.2rem;
}

.missionIntro {
    color: #dddddd;
    font-size: 2rem;
    font-weight: 300;
    line-height: 1.5;
    margin: 2rem 0;
    max-width: 62rem;
}

.teaserRobot {
    width: 100%;
    display: flex;
    gap: 4rem;
    justify-content: flex-start;
    align-items: center;
}

.teaserRobotFlipped {
    flex-direction: row-reverse;
}

.teaserRobotImage {
    width: calc(40% - 4rem);
    border-radius: 0.4rem;
    object-fit: contain;
    background-image: url(../assets/logoItems/white-stars.svg);
    background-size: contain;
    background-repeat: no-repeat;
}

.teaserRobotText {
    width: 60%;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
}

.teaserRobotText h3 {
    font-size: 2rem;
    font-weight: 500;
    color: #fff;
}

.teaserRobotText p {
    color: #cdcdcd;
    font-size: 1.6rem;
    font-weight: 300;
    line-height: 1.44;
}

.teaserEvent {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.teaserEventImage {
    position: relative;
    max-width: 48rem;
}

.teaserEventImage img {
    width: 100%;
    height: auto;
    border-radius: 0.4rem;
}

.teaserEventDate {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.6rem 0.35rem;
    border-radius: 0.3rem;
    background-color: #fff;
    color: #000;
}

.teaserEvent h3 {
    font-weight: 500;
    font-size: 1.6rem;
    color: #fff;
}

.teaserEventLocation {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 0.25rem;
}

.teaserEventLocation img {
    height: 1.1rem;
}

.teaserEventLocation p {
    font-size: 1.2rem;
    color: #fff;
}

.joinCta {
    align-items: center;
    padding-bottom: 6rem;
}

.joinCtaInner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
    text-align: center;
}

.joinCtaText {
    color: #dddddd;
    font-size: 1.6rem;
    font-weight: 300;
}

@media (max-width: 758px) {
    .homeSection {
        padding: 3rem 2rem;
    }

    .teaserRobot,
    .teaserRobotFlipped {
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .teaserRobotText {
        width: 100%;
    }

    .teaserRobotImage {
        width: 100%;
        aspect-ratio: 16/9;
    }
}
```

- [ ] **Step 4: Implement MissionTeaser**

Create `react-ursaworks/src/components/home/MissionTeaser.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

export default function MissionTeaser() {
    return (
        <section className="homeSection">
            <Reveal>
                <h2 className="sectionTitle">Our Mission</h2>
                <p className="missionIntro">{content.intro}</p>
                <Link className="teaserLink" to="/about">
                    <span>More About Us</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/MissionTeaser.test.jsx
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add react-ursaworks/src/styles/homeStyle.css react-ursaworks/src/components/home/MissionTeaser.jsx react-ursaworks/src/components/home/MissionTeaser.test.jsx
git commit -m "feat: add home stylesheet and MissionTeaser section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: RobotsTeaser

**Files:**
- Create: `react-ursaworks/src/components/home/RobotsTeaser.jsx`
- Test: `react-ursaworks/src/components/home/RobotsTeaser.test.jsx`

**Interfaces:**
- Consumes: `Reveal` (Task 2, props `{ delay, className }`), classes `.homeSection`, `.teaserRobot`, `.teaserRobotFlipped`, `.teaserRobotImage`, `.teaserRobotText`, `.teaserLink` (Task 3), `content.robots` (`[{ name, description, image }]`), `loadImage(folder, imageName)` from `src/configs/loadImages.js`.
- Produces: `RobotsTeaser` — default export, no props.

- [ ] **Step 1: Write the failing test**

Create `react-ursaworks/src/components/home/RobotsTeaser.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RobotsTeaser from './RobotsTeaser';
import content from '../../content.json';

test('renders every robot name and a link to /robots', () => {
    render(<RobotsTeaser />, { wrapper: MemoryRouter });
    for (const robot of content.robots) {
        expect(screen.getByText(robot.name)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /meet all the robots/i })).toHaveAttribute('href', '/robots');
});

test('shows only the first sentence of each description', () => {
    render(<RobotsTeaser />, { wrapper: MemoryRouter });
    // Full multi-sentence descriptions belong to /robots, not the teaser.
    expect(screen.queryByText(content.robots[0].description)).not.toBeInTheDocument();
    const firstSentence = content.robots[0].description.slice(
        0,
        content.robots[0].description.indexOf('. ') + 1
    );
    expect(screen.getByText(firstSentence)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/RobotsTeaser.test.jsx
```
Expected: FAIL — cannot resolve `./RobotsTeaser`.

- [ ] **Step 3: Implement RobotsTeaser**

Create `react-ursaworks/src/components/home/RobotsTeaser.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import loadImage from '../../configs/loadImages';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

// The teaser shows one sentence per robot; full descriptions live on /robots.
const firstSentence = (text) => {
    const end = text.indexOf('. ');
    return end === -1 ? text : text.slice(0, end + 1);
};

export default function RobotsTeaser() {
    return (
        <section className="homeSection">
            <Reveal>
                <h2 className="sectionTitle">The Robots</h2>
            </Reveal>
            {content.robots.map((robot, index) => (
                <Reveal
                    key={robot.name}
                    delay={index * 0.15}
                    className={`teaserRobot${index % 2 === 1 ? ' teaserRobotFlipped' : ''}`}
                >
                    <img
                        src={loadImage('robots', robot.image)}
                        alt={robot.name}
                        className="teaserRobotImage"
                    />
                    <div className="teaserRobotText">
                        <h3>{robot.name}</h3>
                        <p>{firstSentence(robot.description)}</p>
                    </div>
                </Reveal>
            ))}
            <Reveal>
                <Link className="teaserLink" to="/robots">
                    <span>Meet All The Robots</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
```

Note: `Reveal` renders a `motion.div`, so the `.teaserRobot` flex classes go on `Reveal`'s `className` prop, with `img` and text as its flex children.

- [ ] **Step 4: Run test to verify it passes**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/RobotsTeaser.test.jsx
```
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add react-ursaworks/src/components/home/RobotsTeaser.jsx react-ursaworks/src/components/home/RobotsTeaser.test.jsx
git commit -m "feat: add RobotsTeaser section with alternating rows

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: EventTeaser and JoinCta

**Files:**
- Create: `react-ursaworks/src/components/home/EventTeaser.jsx`
- Create: `react-ursaworks/src/components/home/JoinCta.jsx`
- Test: `react-ursaworks/src/components/home/EventTeaser.test.jsx`
- Test: `react-ursaworks/src/components/home/JoinCta.test.jsx`

**Interfaces:**
- Consumes: `Reveal` (Task 2), classes `.homeSection`, `.teaserEvent`, `.teaserEventImage`, `.teaserEventDate`, `.teaserEventLocation`, `.joinCta`, `.joinCtaInner`, `.joinCtaText`, `.teaserLink` (Task 3), `content.events` (`[{ name, location, date, image }]`), `loadImage`, `src/assets/logoItems/locationIcon.svg`.
- Produces: `EventTeaser` — default export, props `{ events?: array }` defaulting to `content.events`; renders `null` when the array is empty. `JoinCta` — default export, no props.

- [ ] **Step 1: Write the failing tests**

Create `react-ursaworks/src/components/home/EventTeaser.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventTeaser from './EventTeaser';
import content from '../../content.json';

test('renders the latest event with a link to /events', () => {
    render(<EventTeaser />, { wrapper: MemoryRouter });
    const latest = content.events[0];
    expect(screen.getByText(latest.name)).toBeInTheDocument();
    expect(screen.getByText(latest.location)).toBeInTheDocument();
    expect(screen.getByText(latest.date)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see all events/i })).toHaveAttribute('href', '/events');
});

test('renders nothing when there are no events', () => {
    const { container } = render(<EventTeaser events={[]} />, { wrapper: MemoryRouter });
    expect(container).toBeEmptyDOMElement();
});
```

Create `react-ursaworks/src/components/home/JoinCta.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import JoinCta from './JoinCta';

test('renders the join call-to-action with a mailto link', () => {
    render(<JoinCta />);
    expect(screen.getByText('Join Ursaworks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
        'href',
        'mailto:ursaworksrobotics@gmail.com'
    );
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/EventTeaser.test.jsx src/components/home/JoinCta.test.jsx
```
Expected: FAIL — cannot resolve `./EventTeaser` / `./JoinCta`.

- [ ] **Step 3: Implement EventTeaser**

Create `react-ursaworks/src/components/home/EventTeaser.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import loadImage from '../../configs/loadImages';
import locationIcon from '../../assets/logoItems/locationIcon.svg';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

// `events` is injectable for testing; the first entry is the latest event.
export default function EventTeaser({ events = content.events }) {
    if (events.length === 0) return null;
    const latest = events[0];

    return (
        <section className="homeSection">
            <Reveal>
                <h2 className="sectionTitle">Latest Event</h2>
                <div className="teaserEvent">
                    <div className="teaserEventImage">
                        <img src={loadImage('events', latest.image)} alt={latest.name} />
                        <span className="teaserEventDate">{latest.date}</span>
                    </div>
                    <h3>{latest.name}</h3>
                    <div className="teaserEventLocation">
                        <img src={locationIcon} alt="Location Icon" />
                        <p>{latest.location}</p>
                    </div>
                </div>
                <Link className="teaserLink" to="/events">
                    <span>See All Events</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
```

- [ ] **Step 4: Implement JoinCta**

Create `react-ursaworks/src/components/home/JoinCta.jsx`:

```jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

export default function JoinCta() {
    return (
        <section className="homeSection joinCta">
            <Reveal className="joinCtaInner">
                <h2 className="sectionTitle">Join Ursaworks</h2>
                <p className="joinCtaText">
                    All WashU students are welcome — no experience required.
                </p>
                <a className="teaserLink" href="mailto:ursaworksrobotics@gmail.com">
                    <span>Get In Touch</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </a>
            </Reveal>
        </section>
    );
}
```

(The press-down feedback comes from the `.teaserLink:active { transform: scale(0.98); }` rule in Task 3's stylesheet.)

- [ ] **Step 5: Run tests to verify they pass**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/home/EventTeaser.test.jsx src/components/home/JoinCta.test.jsx
```
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add react-ursaworks/src/components/home/EventTeaser.jsx react-ursaworks/src/components/home/JoinCta.jsx react-ursaworks/src/components/home/EventTeaser.test.jsx react-ursaworks/src/components/home/JoinCta.test.jsx
git commit -m "feat: add EventTeaser and JoinCta sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Hero rewrite — load-in stagger, scroll-linked exit, scroll hint

**Files:**
- Modify: `react-ursaworks/src/components/Hero.jsx` (full rewrite)
- Modify: `react-ursaworks/src/styles/heroStyle.css` (append scroll-hint rules)
- Test: `react-ursaworks/src/components/Hero.test.jsx`

**Interfaces:**
- Consumes: `ScrollContainerContext` (Task 1) via `useContext`; framer-motion `motion`, `useScroll`, `useTransform`, `useReducedMotion`.
- Produces: `Hero` — default export, no props. Must be rendered inside a `ScrollContainerContext.Provider` (Layout provides it in the app; tests provide their own).

- [ ] **Step 1: Write the failing test**

Create `react-ursaworks/src/components/Hero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import Hero from './Hero';
import ScrollContainerContext from '../configs/ScrollContainerContext';

// Hero reads the scroll container from context (Layout provides it in the app).
function Harness() {
    const ref = useRef(null);
    return (
        <ScrollContainerContext.Provider value={ref}>
            <div ref={ref} style={{ overflowY: 'scroll' }}>
                <Hero />
            </div>
        </ScrollContainerContext.Provider>
    );
}

test('renders the logo, wordmark, subtitle, and scroll hint', () => {
    const { container } = render(<Harness />);
    expect(screen.getByAltText('Stars')).toBeInTheDocument();
    expect(screen.getByText('URSAWORKS')).toBeInTheDocument();
    expect(screen.getByText('AT WASHINGTON UNIVERSITY IN ST. LOUIS')).toBeInTheDocument();
    expect(container.querySelector('.scrollHint')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/Hero.test.jsx
```
Expected: FAIL — `.scrollHint` not found (old Hero has no scroll hint).

- [ ] **Step 3: Rewrite Hero**

Replace the full contents of `react-ursaworks/src/components/Hero.jsx` with:

```jsx
import React, { useContext } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import ScrollContainerContext from '../configs/ScrollContainerContext';
import stars from '../assets/logoItems/starAndBear.svg';
import '../styles/heroStyle.css';

export default function Hero() {
    const containerRef = useContext(ScrollContainerContext);
    const reducedMotion = useReducedMotion();

    // The app scrolls inside .container, not the window; scrub the hero's
    // exit over the first ~70vh of that container's scroll.
    const { scrollY } = useScroll({ container: containerRef });
    const exitRange = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500;
    const opacity = useTransform(scrollY, [0, exitRange], [1, 0]);
    const scale = useTransform(scrollY, [0, exitRange], [1, 0.96]);
    const y = useTransform(scrollY, [0, exitRange], [0, -40]);
    const hintOpacity = useTransform(scrollY, [0, exitRange * 0.15], [1, 0]);

    const riseIn = {
        hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
    };

    return (
        <motion.div
            className="hero"
            style={reducedMotion ? { opacity } : { opacity, scale, y }}
        >
            <motion.div
                className="heroContent"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
                <motion.img src={stars} className="stars" alt="Stars" variants={riseIn} />
                <motion.h1 className="title" variants={riseIn}>
                    URSAWORKS
                </motion.h1>
                <motion.h2 className="subtitle" variants={riseIn}>
                    AT WASHINGTON UNIVERSITY IN ST. LOUIS
                </motion.h2>
            </motion.div>
            <motion.div className="scrollHint" style={{ opacity: hintOpacity }} aria-hidden="true">
                <motion.span
                    className="scrollHintChevron"
                    animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M4 9l8 7 8-7"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.span>
            </motion.div>
        </motion.div>
    );
}
```

- [ ] **Step 4: Append scroll-hint styles to heroStyle.css**

Append to `react-ursaworks/src/styles/heroStyle.css`:

```css
.scrollHint {
    position: absolute;
    bottom: 2.4rem;
    left: 50%;
    transform: translateX(-50%);
}

.scrollHintChevron {
    display: block;
    opacity: 0.7;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/components/Hero.test.jsx
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add react-ursaworks/src/components/Hero.jsx react-ursaworks/src/styles/heroStyle.css react-ursaworks/src/components/Hero.test.jsx
git commit -m "feat: hero load-in stagger, scroll-linked exit, scroll hint

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Compose Home, retire the old fade, verify everything

**Files:**
- Modify: `react-ursaworks/src/pages/Home.jsx` (full rewrite)
- Modify: `react-ursaworks/src/styles/dashboardStyle.css` (remove the `#hero` spacer block)
- Modify: `react-ursaworks/src/App.test.jsx` (update the homepage assertion, add a sections test)

**Interfaces:**
- Consumes: `Hero` (Task 6), `MissionTeaser` (Task 3), `RobotsTeaser` (Task 4), `EventTeaser`, `JoinCta` (Task 5), `.heroSpacer` (Task 3).
- Produces: the final homepage. No new exports.

- [ ] **Step 1: Update App.test.jsx (this is the failing-test step)**

The existing first test asserts the homepage does NOT render "Our Mission" — that inverts now, because the MissionTeaser legitimately puts that heading on the homepage. The test's real intent was "the About page content doesn't leak onto home", so re-anchor it to the About page's image (`alt="About"`), which stays exclusive to `/about`.

Replace the full contents of `react-ursaworks/src/App.test.jsx` with:

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('homepage renders all four teaser sections', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
  expect(screen.getByText('The Robots')).toBeInTheDocument();
  expect(screen.getByText('Latest Event')).toBeInTheDocument();
  expect(screen.getByText('Join Ursaworks')).toBeInTheDocument();
});

test('homepage does not render the About page content', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.queryByAltText('About')).not.toBeInTheDocument();
});

test('the /about route renders the About "Our Mission" section', () => {
  window.history.pushState({}, '', '/about');
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `react-ursaworks/`):
```bash
npm test -- --run src/App.test.jsx
```
Expected: FAIL — homepage doesn't render the teaser sections yet.

- [ ] **Step 3: Rewrite Home.jsx**

Replace the full contents of `react-ursaworks/src/pages/Home.jsx` with:

```jsx
import React from 'react';
import Hero from '../components/Hero';
import MissionTeaser from '../components/home/MissionTeaser';
import RobotsTeaser from '../components/home/RobotsTeaser';
import EventTeaser from '../components/home/EventTeaser';
import JoinCta from '../components/home/JoinCta';
import '../styles/homeStyle.css';

export default function Home() {
    return (
        <>
            <Hero />
            <div className="heroSpacer" aria-hidden="true" />
            <MissionTeaser />
            <RobotsTeaser />
            <EventTeaser />
            <JoinCta />
        </>
    );
}
```

- [ ] **Step 4: Remove the dead `#hero` spacer CSS**

In `react-ursaworks/src/styles/dashboardStyle.css`, delete this block (the old IntersectionObserver spacer; `.heroSpacer` in homeStyle.css replaces it):

```css
#hero{
  width: 100vw;
  height: 50vh;
  margin-bottom: 50vh;
}
```

- [ ] **Step 5: Run the full test suite and lint**

Run (from `react-ursaworks/`):
```bash
npm test -- --run
npm run lint
```
Expected: all tests PASS, lint clean.

- [ ] **Step 6: Verify the real page in the browser**

Run (from `react-ursaworks/`):
```bash
npm run dev
```
Open http://localhost:3000 and confirm:
- Hero staggers in (logo, then title, then subtitle), chevron floats at the bottom.
- Scrolling scrubs the hero out smoothly (fade + slight shrink + upward drift); the chevron disappears within the first bit of scroll.
- Mission, Robots (alternating rows, staggered), Latest Event, and Join CTA reveal as they enter the viewport; all four links navigate to the right routes; the mailto button opens email.
- Navigating to /about, /robots, /events still looks unchanged, and returning to / starts at the top with the hero visible.
- Narrow the window below 758px: robot rows collapse to single column, no horizontal scrolling.

Stop the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add react-ursaworks/src/pages/Home.jsx react-ursaworks/src/styles/dashboardStyle.css react-ursaworks/src/App.test.jsx
git commit -m "feat: compose scrollable homepage from teaser sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
