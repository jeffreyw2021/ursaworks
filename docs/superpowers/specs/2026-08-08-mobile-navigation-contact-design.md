# Mobile Navigation and Contact Layout Design

## Goal

Improve the mobile experience for the Ursaworks site by collapsing the five primary navigation destinations into an accessible hamburger dropdown on screens 758px wide or narrower, and ensure the Contact page renders within an iPhone 16 Pro Max viewport.

## Scope

- Keep the existing horizontal desktop navigation unchanged.
- At the existing mobile breakpoint (`max-width: 758px`), replace the horizontal navigation row with a hamburger menu.
- Include About, Events, Robots, Contact, and Join Us in the mobile menu.
- Preserve active-route styling for internal links.
- Keep Join Us as its existing external Google Forms link.
- Make Contact page content fit narrow viewports without clipping or horizontal overflow.

## Design

### Navigation behavior

`Navbar` will own a small `isMenuOpen` React state and render an accessible button on mobile. The button will expose its state through `aria-expanded`, identify the menu with `aria-controls`, and provide a descriptive accessible label. The existing navigation links will be rendered inside a mobile dropdown panel that is visually hidden on mobile when closed and shown when open.

The menu will close when:

- an internal navigation link is selected;
- the external Join Us link is selected;
- the Escape key is pressed;
- the user clicks outside the navbar.

Desktop behavior will not depend on this state and will continue to show the current inline navigation. The mobile control will be hidden on desktop.

### Visual treatment

The mobile header will retain its fixed positioning, logo, dark gradient, and existing purple/pink accents. The hamburger button will use three lines with a visible keyboard focus state. The dropdown will sit beneath the header, align to the right edge of the header content, and use a dark translucent surface with clear row spacing and the site’s existing active-link colors.

### Contact layout

The Contact page will retain its existing content hierarchy and visual styling. Mobile rules will:

- use smaller, viewport-safe horizontal padding;
- allow contact email text to wrap rather than force overflow;
- size contact links and officer cards to the available width;
- keep the fixed navbar from covering the Contact Us heading or first row of content.

## Components and files

- `src/components/Navbar.jsx`: menu state, button, menu close behavior, and link rendering.
- `src/styles/navbarStyle.css`: responsive visibility, dropdown layout, button styling, focus treatment, and mobile spacing.
- `src/styles/contactStyle.css`: narrow viewport sizing, text wrapping, and mobile card/link adjustments.
- `src/components/__tests__/Navbar.test.jsx`: toggle, accessibility state, route/link close behavior, and Join Us presence.
- `src/components/__tests__/Contact.test.jsx`: contact content remains rendered and long values can be constrained by the mobile layout contract.

## Verification

- Run the focused component tests and the complete test suite.
- Run `npm run lint` from `react-ursaworks/`.
- Run `npm run build` from `react-ursaworks/` to verify the production bundle.
- Inspect the running site at a 430x932 CSS viewport, representative of an iPhone 16 Pro Max, checking the hamburger menu and `/contact` page for clipping or horizontal overflow.

## Out of scope

- Redesigning the desktop navbar.
- Changing the route structure or adding new contact data.
- Changing the external Join Us destination.
- Reworking unrelated mobile layouts on About, Events, or Robots pages beyond ensuring the shared navbar does not obscure them.
