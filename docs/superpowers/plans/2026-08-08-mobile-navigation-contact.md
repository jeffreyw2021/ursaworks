# Mobile Navigation and Contact Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible hamburger dropdown for the five primary mobile navigation destinations and make the Contact page fit an iPhone 16 Pro Max viewport.

**Architecture:** Keep `Navbar` as the single owner of mobile menu state and render the existing internal links plus the external Join Us link from one shared link definition. Use CSS media queries at the existing 758px breakpoint to switch between the desktop row and mobile dropdown. Constrain Contact page children with mobile-safe widths and wrapping rules without changing the route or content model.

**Tech Stack:** React, React Router, CSS media queries, Vitest, Testing Library, Vite.

## Global Constraints

- Keep the existing horizontal desktop navigation unchanged.
- Use the existing mobile breakpoint: `max-width: 758px`.
- Include About, Events, Robots, Contact, and Join Us in the mobile menu.
- Preserve the external Google Forms destination for Join Us.
- Keep Contact content within the viewport without horizontal overflow.
- Run npm commands from `react-ursaworks/`.

---

## File Map

- Modify `react-ursaworks/src/components/Navbar.jsx`: shared link data, menu state, accessible toggle, outside/Escape close behavior, and close-on-selection behavior.
- Modify `react-ursaworks/src/styles/navbarStyle.css`: desktop/mobile visibility, button, dropdown, focus, and mobile header spacing.
- Modify `react-ursaworks/src/styles/contactStyle.css`: viewport-safe mobile padding, link wrapping, and card sizing.
- Create `react-ursaworks/src/components/__tests__/Navbar.test.jsx`: focused interaction and accessibility coverage.
- Create `react-ursaworks/src/components/__tests__/Contact.test.jsx`: rendered contact content coverage.

### Task 1: Add failing navbar interaction tests

**Files:**
- Create: `react-ursaworks/src/components/__tests__/Navbar.test.jsx`

**Interfaces:**
- Consumes: `Navbar` rendered inside `MemoryRouter`.
- Produces: assertions for the toggle contract that the implementation must satisfy.

- [ ] **Step 1: Write the failing tests**

Create tests that verify the menu starts closed, opens with `aria-expanded="true"`, exposes all five destinations while open, and closes when an internal link is clicked. Also verify the Join Us link is present in the menu and retains an external target.

```jsx
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

function renderNavbar() {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <Navbar />
        </MemoryRouter>
    );
}

test('mobile menu starts closed and opens with all primary destinations', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'EVENTS' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'ROBOTS' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'CONTACT' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'JOIN US' })).toHaveAttribute('target', '_blank');
});

test('selecting an internal destination closes the mobile menu', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('link', { name: 'CONTACT' }));

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run src/components/__tests__/Navbar.test.jsx`

Expected: FAIL because `Navbar` does not yet render a menu button or `aria-expanded` state.

### Task 2: Implement the responsive navbar behavior

**Files:**
- Modify: `react-ursaworks/src/components/Navbar.jsx`
- Modify: `react-ursaworks/src/styles/navbarStyle.css`

**Interfaces:**
- Consumes: the existing `Link`, `NavLink`, logo, and Join Us destination.
- Produces: a `button#mobile-navigation-toggle` with `aria-controls="mobile-navigation-menu"`, a mobile menu with that id, and the existing desktop navigation.

- [ ] **Step 1: Add the menu state and close handlers**

In `Navbar`, add `useEffect`, `useRef`, and `useState`. Use `isMenuOpen` for the toggle state. Register a document `mousedown` listener that closes the menu when the event target is outside a navbar ref, and a `keydown` listener that closes on Escape. Remove both listeners in the effect cleanup.

Use a shared `navigationItems` array so desktop and mobile render the same five destinations. Give internal items a `closeMenu` callback and give Join Us the same external URL, `target`, and `rel` attributes in both views.

- [ ] **Step 2: Add the accessible toggle and mobile menu markup**

Render the button next to the logo with:

```jsx
<button
    id="mobile-navigation-toggle"
    className="mobileMenuToggle"
    type="button"
    aria-expanded={isMenuOpen}
    aria-controls="mobile-navigation-menu"
    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
    onClick={() => setIsMenuOpen((open) => !open)}
>
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
</button>
```

Render a `<div id="mobile-navigation-menu" className={`mobileNavigation ${isMenuOpen ? 'open' : ''}`}>` containing the five links. Each link calls `closeMenu` on click. Keep the desktop `.right` navigation intact and give it the same `closeMenu` callback for consistent behavior.

- [ ] **Step 3: Add responsive CSS**

Keep the current desktop rules as the default. Add mobile rules inside `@media (max-width: 758px)` that reduce header padding, hide `.right`, show `.mobileMenuToggle`, and show `.mobileNavigation.open`. Position the dropdown below the header with a dark translucent background, a subtle border, full available width, and stacked link rows. Set `:focus-visible` styles for the toggle and links. Ensure the closed menu has `display: none` so hidden links do not occupy layout space.

- [ ] **Step 4: Run the focused navbar tests**

Run: `npm test -- --run src/components/__tests__/Navbar.test.jsx`

Expected: PASS for menu state, destinations, external Join Us attributes, and close-on-selection behavior.

### Task 3: Add contact layout regression coverage

**Files:**
- Create: `react-ursaworks/src/components/__tests__/Contact.test.jsx`

**Interfaces:**
- Consumes: `Contact` rendered with `content.json` and the existing icon/font dependencies.
- Produces: a regression test proving contact content is present and all officers render.

- [ ] **Step 1: Write the contact regression test**

```jsx
import { render, screen } from '@testing-library/react';
import Contact from '../Contact';

test('renders contact links and leadership content', () => {
    render(<Contact />);

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByText('ARC Robotics Competition')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Leadership' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /@/ }).length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the focused test**

Run: `npm test -- --run src/components/__tests__/Contact.test.jsx`

Expected: PASS, establishing the content baseline before CSS changes.

### Task 4: Fix mobile Contact sizing and overflow

**Files:**
- Modify: `react-ursaworks/src/styles/contactStyle.css`

**Interfaces:**
- Consumes: existing `.infoBlock`, `.contactContent`, `.contactLink`, `.officerCard`, and the 758px breakpoint.
- Produces: a Contact page whose content fits within a 430px-wide viewport.

- [ ] **Step 1: Add mobile-safe sizing rules**

Inside the existing mobile media query, set `#contactBlock` to `width: 100%`, use `padding: 8rem 1.25rem 4rem`, and set `min-width: 0`. Set `.contactContent`, `.contactLinks`, and `.officerList` to `min-width: 0` and `width: 100%`. Set `.contactLink` and `.officerCard` to `width: 100%`, `min-width: 0`, and `max-width: 100%`. Add `overflow-wrap: anywhere` to `.contactLink span` and `.officerEmail` so long email values wrap. Keep links stacked on mobile and reduce gaps/padding to avoid unnecessary vertical clipping.

- [ ] **Step 2: Run the contact test and lint**

Run: `npm test -- --run src/components/__tests__/Contact.test.jsx` 

Expected: PASS.

Run: `npm run lint`

Expected: exit code 0 with no new lint errors.

### Task 5: Verify the complete change

**Files:**
- Modify: none unless verification exposes a defect.

**Interfaces:**
- Consumes: completed navbar and Contact changes.
- Produces: verified test/build results and a visual check at mobile size.

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`

Expected: all existing and new tests PASS.

- [ ] **Step 2: Build the production bundle using the repository workflow**

Run from `react-ursaworks/`: `npm run build`

Expected: asset sync completes and Vite writes a successful production build to `react-ursaworks/build/`.

- [ ] **Step 3: Inspect the running site at the target viewport**

Start the app with `npm run dev`, open `http://localhost:3000/contact`, and inspect at 430x932 CSS pixels. Confirm the Contact Us heading, contact links, and leadership cards are visible without horizontal scrolling. Open the hamburger menu and confirm all five items are visible; navigate to Contact and confirm the menu closes. Repeat on `/about`, `/events`, and `/robots` to confirm the shared header does not cover the page title.

- [ ] **Step 4: Review the final diff**

Run: `git diff --check && git status --short`

Expected: only the intended navbar, Contact, and test files remain as working changes; unrelated user-owned files are left untouched.
