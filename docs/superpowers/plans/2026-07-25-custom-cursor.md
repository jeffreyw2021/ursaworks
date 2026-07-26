# Custom Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the native cursor on fine-pointer devices with a purple dot that tracks the pointer exactly plus a larger ring that trails behind it, reacting to hover and click.

**Architecture:** A single `Cursor` component mounts once in `Layout.jsx` so it covers every route. Position is written straight to the DOM through refs inside a `requestAnimationFrame` loop — never through React state — so pointer movement costs zero re-renders. React state holds only the three things that change rendering: enabled, hovering, clicking. Each visual element is a positioned wrapper (moved by JS every frame) containing a shape span (scaled and recolored by CSS transitions), which keeps the per-frame transform and the eased hover transform from fighting over the same property.

**Tech Stack:** React 18 function components with hooks, plain CSS in `src/styles/`, Vitest + React Testing Library + jest-dom.

## Global Constraints

- Accent purple is `#C871C7` — the same value as `.JoinusLink` in `src/styles/navbarStyle.css:53` and the 35% stop of `--main-grad` in `src/App.css:18`. Do not introduce a new purple.
- Ring border weight is `1.8px`, matching `.JoinusLink`'s border in `src/styles/navbarStyle.css:56`.
- The cursor renders only when `window.matchMedia('(pointer: fine)')` matches. On coarse pointers the component returns `null`, registers no listeners, and never applies `cursor: none`.
- `cursor: none` is applied by toggling a class on `document.documentElement` from inside the component, never as a static rule in a stylesheet.
- Positioned elements use `position: fixed`. `.container` in `src/styles/dashboardStyle.css:3` is a `100vh` scroll container, so `position: absolute` would drift away from the pointer on scroll.
- `prefers-reduced-motion: reduce` removes the ring's trailing lag (ring tracks 1:1) and disables the shape transitions.
- All new stylesheets live in `src/styles/` and are imported by their component, matching the existing one-stylesheet-per-component convention.
- Tests are colocated in `src/components/__tests__/`.
- `src/setupTests.js:15-26` stubs `window.matchMedia` to always return `matches: false`. Every test that needs the cursor enabled must override `window.matchMedia` itself and restore it afterward.
- Run all npm commands from `react-ursaworks/`.

---

### Task 1: Cursor component — pointer gate, rendering, and position tracking

**Files:**
- Create: `react-ursaworks/src/components/Cursor.jsx`
- Create: `react-ursaworks/src/styles/cursorStyle.css`
- Test: `react-ursaworks/src/components/__tests__/Cursor.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `export default function Cursor()` — takes no props, returns `null` on coarse pointers, otherwise a fragment containing two elements with `data-testid="cursor-dot"` and `data-testid="cursor-ring"`. Adds and removes the class `cursorHidden` on `document.documentElement`.

- [ ] **Step 1: Write the failing test**

Create `react-ursaworks/src/components/__tests__/Cursor.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Cursor from '../Cursor';

// setupTests.js stubs matchMedia to always report matches: false, so the
// component is disabled unless a test opts in. Returns a restore function.
function mockPointer({ fine, reducedMotion = false }) {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({
        matches: query.includes('pointer: fine') ? fine : reducedMotion,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
    return () => {
        window.matchMedia = original;
    };
}

test('renders nothing on a coarse pointer', () => {
    const restore = mockPointer({ fine: false });
    const { container } = render(<Cursor />);
    expect(container).toBeEmptyDOMElement();
    restore();
});

test('renders the dot and the ring on a fine pointer', () => {
    const restore = mockPointer({ fine: true });
    render(<Cursor />);
    expect(screen.getByTestId('cursor-dot')).toBeInTheDocument();
    expect(screen.getByTestId('cursor-ring')).toBeInTheDocument();
    restore();
});

test('hides the native cursor only while mounted on a fine pointer', () => {
    const restore = mockPointer({ fine: true });
    const { unmount } = render(<Cursor />);
    expect(document.documentElement).toHaveClass('cursorHidden');
    unmount();
    expect(document.documentElement).not.toHaveClass('cursorHidden');
    restore();
});

test('never hides the native cursor on a coarse pointer', () => {
    const restore = mockPointer({ fine: false });
    render(<Cursor />);
    expect(document.documentElement).not.toHaveClass('cursorHidden');
    restore();
});

test('moves the dot to the pointer position', () => {
    const restore = mockPointer({ fine: true });
    const frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb);
        return frames.length;
    });

    render(<Cursor />);
    fireEvent.mouseMove(document, { clientX: 120, clientY: 80 });
    frames[0](); // run one animation frame by hand

    expect(screen.getByTestId('cursor-dot')).toHaveStyle({
        transform: 'translate3d(120px, 80px, 0)',
    });

    window.requestAnimationFrame.mockRestore();
    restore();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run src/components/__tests__/Cursor.test.jsx`

Expected: FAIL — `Failed to resolve import "../Cursor"`.

- [ ] **Step 3: Write the stylesheet**

Create `react-ursaworks/src/styles/cursorStyle.css`:

```css
/* Wrappers carry the per-frame position written by Cursor.jsx. The shape spans
   inside them carry the eased hover/click transforms, so the two never fight
   over the same transform property. */
.cursorDot,
.cursorRing {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  will-change: transform;
}

.cursorDotShape,
.cursorRingShape {
  display: block;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  transition: transform 0.18s ease-out, border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

.cursorDotShape {
  width: 8px;
  height: 8px;
  background-color: #c871c7;
}

.cursorRingShape {
  width: 38px;
  height: 38px;
  border: 1.8px solid rgba(200, 113, 199, 0.55);
}

/* Applied to <html> by Cursor.jsx, and only on fine pointers. */
html.cursorHidden,
html.cursorHidden * {
  cursor: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .cursorDotShape,
  .cursorRingShape {
    transition: none;
  }
}
```

- [ ] **Step 4: Write the component**

Create `react-ursaworks/src/components/Cursor.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react';
import '../styles/cursorStyle.css';

// Fraction of the remaining distance the ring covers each frame. Lower trails
// longer. 1 means no lag at all, which is what reduced motion asks for.
const RING_EASING = 0.18;

export default function Cursor() {
    const [enabled, setEnabled] = useState(false);
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    // Only mice and trackpads get a custom cursor. Touch devices keep their
    // native behavior and never lose the pointer.
    useEffect(() => {
        const query = window.matchMedia('(pointer: fine)');
        const sync = () => setEnabled(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (!enabled) return undefined;
        document.documentElement.classList.add('cursorHidden');
        return () => document.documentElement.classList.remove('cursorHidden');
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return undefined;

        const target = { x: 0, y: 0 };
        const ringPos = { x: 0, y: 0 };
        const ease = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 1
            : RING_EASING;
        let frame;

        const move = (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
        };

        const draw = () => {
            ringPos.x += (target.x - ringPos.x) * ease;
            ringPos.y += (target.y - ringPos.y) * ease;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
            }
            frame = window.requestAnimationFrame(draw);
        };

        document.addEventListener('mousemove', move);
        frame = window.requestAnimationFrame(draw);

        return () => {
            document.removeEventListener('mousemove', move);
            window.cancelAnimationFrame(frame);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <div className="cursorRing" data-testid="cursor-ring" ref={ringRef}>
                <span className="cursorRingShape" />
            </div>
            <div className="cursorDot" data-testid="cursor-dot" ref={dotRef}>
                <span className="cursorDotShape" />
            </div>
        </>
    );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- --run src/components/__tests__/Cursor.test.jsx`

Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add react-ursaworks/src/components/Cursor.jsx \
        react-ursaworks/src/styles/cursorStyle.css \
        react-ursaworks/src/components/__tests__/Cursor.test.jsx
git commit -m "feat: add custom cursor with pointer gate and rAF tracking"
```

---

### Task 2: Hover, click, and pointer-leave states

**Files:**
- Modify: `react-ursaworks/src/components/Cursor.jsx`
- Modify: `react-ursaworks/src/styles/cursorStyle.css`
- Test: `react-ursaworks/src/components/__tests__/Cursor.test.jsx`

**Interfaces:**
- Consumes: `Cursor` from Task 1, including the `cursor-dot` and `cursor-ring` test ids and the `.cursorDot` / `.cursorRing` class names.
- Produces: the wrappers gain the classes `isHovering`, `isClicking`, and `isOffscreen` as those states change. No exported API change.

- [ ] **Step 1: Write the failing tests**

Append to `react-ursaworks/src/components/__tests__/Cursor.test.jsx`:

```jsx
test('grows the ring while an interactive element is hovered', () => {
    const restore = mockPointer({ fine: true });
    render(
        <>
            <Cursor />
            <a href="/about">About</a>
            <p>plain text</p>
        </>
    );

    fireEvent.mouseOver(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByTestId('cursor-ring')).toHaveClass('isHovering');

    fireEvent.mouseOut(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isHovering');
    restore();
});

test('ignores hover over non-interactive elements', () => {
    const restore = mockPointer({ fine: true });
    render(
        <>
            <Cursor />
            <p>plain text</p>
        </>
    );

    fireEvent.mouseOver(screen.getByText('plain text'));
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isHovering');
    restore();
});

test('marks the cursor as clicking between mousedown and mouseup', () => {
    const restore = mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseDown(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isClicking');

    fireEvent.mouseUp(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isClicking');
    restore();
});

test('hides the cursor when the pointer leaves the window', () => {
    const restore = mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseLeave(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isOffscreen');

    fireEvent.mouseEnter(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isOffscreen');
    restore();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run src/components/__tests__/Cursor.test.jsx`

Expected: FAIL — 4 failures reading `expect(element).toHaveClass("isHovering")` and similar, because no state classes are applied yet.

- [ ] **Step 3: Add the state effects to the component**

In `react-ursaworks/src/components/Cursor.jsx`, add this constant below `RING_EASING`:

```jsx
// Everything a user can click or type into. One delegated listener covers all
// of them, so no component has to opt in.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';
```

Add these three state declarations below `const [enabled, setEnabled] = useState(false);`:

```jsx
    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [offscreen, setOffscreen] = useState(false);
```

Add this effect directly after the `requestAnimationFrame` effect:

```jsx
    useEffect(() => {
        if (!enabled) return undefined;

        const over = (e) => {
            if (e.target.closest?.(INTERACTIVE)) setHovering(true);
        };
        const out = (e) => {
            if (!e.target.closest?.(INTERACTIVE)) return;
            // Moving between children of the same link (icon to label, say)
            // fires mouseout but is still a hover. Don't flicker.
            if (e.relatedTarget?.closest?.(INTERACTIVE)) return;
            setHovering(false);
        };
        const down = () => setClicking(true);
        const up = () => setClicking(false);
        const leave = () => setOffscreen(true);
        const enter = () => setOffscreen(false);

        document.addEventListener('mouseover', over);
        document.addEventListener('mouseout', out);
        document.addEventListener('mousedown', down);
        document.addEventListener('mouseup', up);
        document.addEventListener('mouseleave', leave);
        document.addEventListener('mouseenter', enter);

        return () => {
            document.removeEventListener('mouseover', over);
            document.removeEventListener('mouseout', out);
            document.removeEventListener('mousedown', down);
            document.removeEventListener('mouseup', up);
            document.removeEventListener('mouseleave', leave);
            document.removeEventListener('mouseenter', enter);
        };
    }, [enabled]);
```

Replace the `return` block at the bottom of the component with:

```jsx
    const state = [
        hovering ? 'isHovering' : '',
        clicking ? 'isClicking' : '',
        offscreen ? 'isOffscreen' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <div
                className={`cursorRing ${state}`.trim()}
                data-testid="cursor-ring"
                ref={ringRef}
            >
                <span className="cursorRingShape" />
            </div>
            <div
                className={`cursorDot ${state}`.trim()}
                data-testid="cursor-dot"
                ref={dotRef}
            >
                <span className="cursorDotShape" />
            </div>
        </>
    );
```

- [ ] **Step 4: Add the state styles**

In `react-ursaworks/src/styles/cursorStyle.css`, insert these rules directly after the `.cursorRingShape` block and before the `html.cursorHidden` block. Order matters: `isClicking` comes after `isHovering` so a click while hovering wins.

```css
/* Over a link or button: the ring swells into the accent purple and the dot
   ducks out of the way. */
.cursorRing.isHovering .cursorRingShape {
  transform: translate(-50%, -50%) scale(1.5);
  border-color: #c871c7;
  background-color: rgba(200, 113, 199, 0.12);
}

.cursorDot.isHovering .cursorDotShape {
  transform: translate(-50%, -50%) scale(0);
}

.cursorRing.isClicking .cursorRingShape {
  transform: translate(-50%, -50%) scale(0.8);
}

.cursorDot.isClicking .cursorDotShape {
  transform: translate(-50%, -50%) scale(1.8);
}

.cursorDot.isOffscreen,
.cursorRing.isOffscreen {
  opacity: 0;
}
```

Add `opacity` to the shared transition so the offscreen fade is smooth. Change the `transition` line in the `.cursorDotShape, .cursorRingShape` block to:

```css
  transition: transform 0.18s ease-out, border-color 0.18s ease-out,
    background-color 0.18s ease-out, opacity 0.18s ease-out;
```

Then add the matching opacity transition to the wrappers by appending to the `.cursorDot, .cursorRing` block:

```css
  transition: opacity 0.18s ease-out;
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- --run src/components/__tests__/Cursor.test.jsx`

Expected: PASS, 9 tests.

- [ ] **Step 6: Commit**

```bash
git add react-ursaworks/src/components/Cursor.jsx \
        react-ursaworks/src/styles/cursorStyle.css \
        react-ursaworks/src/components/__tests__/Cursor.test.jsx
git commit -m "feat: add hover, click, and offscreen cursor states"
```

---

### Task 3: Mount the cursor site-wide

**Files:**
- Modify: `react-ursaworks/src/components/Layout.jsx:14-16`
- Test: `react-ursaworks/src/components/__tests__/Layout.test.jsx`

**Interfaces:**
- Consumes: `Cursor` from Tasks 1 and 2, including the `cursor-dot` test id.
- Produces: nothing new. This is the last task.

- [ ] **Step 1: Write the failing test**

Append to `react-ursaworks/src/components/__tests__/Layout.test.jsx`:

```jsx
test('Layout mounts the custom cursor on a fine pointer', () => {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({
        matches: query.includes('pointer: fine'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });

    render(
        <MemoryRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<p>home</p>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByTestId('cursor-dot')).toBeInTheDocument();
    window.matchMedia = original;
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/components/__tests__/Layout.test.jsx`

Expected: FAIL — `Unable to find an element by: [data-testid="cursor-dot"]`.

- [ ] **Step 3: Mount the component**

In `react-ursaworks/src/components/Layout.jsx`, add the import below the `Footer` import on line 4:

```jsx
import Cursor from './Cursor';
```

Then add `<Cursor />` as the first child of `.container`, directly above `<Navbar />`:

```jsx
            <div className="container" ref={containerRef}>
                <Cursor />
                <Navbar />
```

- [ ] **Step 4: Run the full test suite**

Run: `npm test -- --run`

Expected: PASS, all files. The pre-existing Layout test still passes because `setupTests.js` reports `matches: false` for it, so the cursor renders nothing there.

- [ ] **Step 5: Verify lint and build**

Run: `npm run lint && npm run build`

Expected: no lint errors, build succeeds.

- [ ] **Step 6: Verify by hand in the browser**

Run: `npm run dev`, then open `http://localhost:3000`.

Check each of these:
- The purple dot tracks the pointer exactly; the ring lags behind it.
- Hovering the navbar links and the Join Us button swells the ring to purple and shrinks the dot away.
- The ring stays locked to the pointer while scrolling down `/about` — this is what `position: fixed` buys.
- Holding the mouse button down enlarges the dot.
- Moving the pointer out of the window fades both away.
- With macOS System Settings → Accessibility → Display → Reduce motion on, the ring tracks with no lag.

- [ ] **Step 7: Commit**

```bash
git add react-ursaworks/src/components/Layout.jsx \
        react-ursaworks/src/components/__tests__/Layout.test.jsx
git commit -m "feat: mount custom cursor site-wide in Layout"
```
