# Homepage Revamp — Scrollable Teaser Sections with Scroll-Linked Animation

**Date:** 2026-07-19
**Branch:** feat/learn-mode-homepage-update
**Inspiration:** topology.vc (scroll-driven narrative handoff into detail pages)

## Goal

Turn the homepage from a lone fading hero into a scrollable narrative page:
hero with a scroll-linked exit, followed by four scroll-revealed teaser
sections (mission, robots, latest event, join CTA) that link to the existing
subpages. Visual language stays exactly as-is (gradient wordmark, animated
perspective grid, current fonts/colors) — this change is motion and content
structure only. The `/about`, `/robots`, `/events` routes are untouched.

## Decisions Made

| Question | Decision |
|---|---|
| Page scope | Teaser sections linking to existing subpages (routes stay) |
| Aesthetic | Animations only — keep current styling exactly |
| Motion tech | Framer Motion (new dependency) |
| Hero motion | Scroll-linked exit scrub + load-in stagger + scroll hint |
| Sections | Mission intro, Robots preview, Latest event, Join CTA |
| Composition | Dedicated teaser components in `src/components/home/` |

## Architecture

- **New dependency:** `framer-motion` (install from `react-ursaworks/`).
- **`ScrollContainerContext`** (`src/configs/ScrollContainerContext.jsx`):
  `Layout.jsx` attaches a ref to the scrolling `.container` div and provides
  it via this context. Framer's `useScroll` must target this custom scroller,
  not the window. `ScrollToTop` stays as-is.
- **`Home.jsx`** becomes pure composition — the hand-rolled
  IntersectionObserver fade is deleted:
  `<Hero />` + 100vh spacer + `<MissionTeaser />` + `<RobotsTeaser />` +
  `<EventTeaser />` + `<JoinCta />`.
- **`src/components/home/`** holds:
  - `Reveal.jsx` — shared `motion.div` wrapper: `opacity 0→1`, `y 40→0`,
    spring (stiffness 100, damping 20), `whileInView` triggering once at
    ~30% visibility, optional `delay` prop for staggering. `whileInView`'s
    default viewport root is correct because the scroll container fills the
    viewport.
  - `MissionTeaser.jsx`, `RobotsTeaser.jsx`, `EventTeaser.jsx`, `JoinCta.jsx`.
- **`src/styles/homeStyle.css`** — one new stylesheet for the teaser
  sections, reusing existing patterns (`.sectionTitle`, `.infoBlock`
  max-width rhythm, `.moreAboutLink` arrow-link pattern).
- **Reduced motion:** all animated components use Framer's
  `useReducedMotion`; reduced users get instant opacity-only transitions.
- **Motion constraints:** `transform`/`opacity` only; no scroll event
  listeners; no persistent React re-renders during scroll (motion values
  only).

## Hero Motion

- **Load-in:** logo → title → subtitle stagger on mount (fade + small rise,
  spring physics, ~120 ms apart), then a scroll hint at the bottom (a small downward chevron
  with a gentle infinite float).
- **Scroll-linked exit:** hero stays `position: fixed`.
  `useScroll({ container })` + `useTransform` map the first ~70vh of scroll
  to opacity 1→0, scale 1→0.96, y 0→−40px — continuous scrub replacing the
  stepped IntersectionObserver fade. Scroll hint fades out within the first
  ~10vh of scroll.
- Gradient wordmark, star/bear logo, and grid background unchanged.

## Teaser Sections

All content comes from the existing `src/content.json`; images resolve via
`configs/loadImages.js`. Each section wraps in `Reveal` and ends with an
arrow link (existing `.moreAboutLink` pattern) using react-router `Link`.

- **MissionTeaser** — "Our Mission" `.sectionTitle`, then `content.intro`
  rendered larger than body text, left-aligned, revealed as one block.
  Link → `/about`.
- **RobotsTeaser** — "The Robots" title, three robots as alternating
  image/text rows (image left/text right, then flipped — row language from
  the robots page, not a card grid). Each row: image, name, first sentence
  of description. Rows stagger in ~150 ms apart. Link → `/robots`.
- **EventTeaser** — "Latest Event" title with `content.events[0]`: photo
  with the existing date-badge treatment, name, location. If `events` is
  empty, the section renders nothing. Link → `/events`.
- **JoinCta** — closing statement above the footer: "All WashU students are
  welcome" line and a "Join Ursaworks" button in the brand gradient linking
  to `mailto:ursaworksrobotics@gmail.com`. Button presses down
  (`scale 0.98` on `:active`).
- **Mobile:** rows collapse to a single column below 768 px; type scales via
  the existing root `font-size` calc.

## Error Handling

- Missing/unreferenced images: resolved through the existing `loadImage()`
  helper; teasers always pass `alt` text.
- Empty `content.events`: EventTeaser renders nothing.

## Testing

Vitest + Testing Library, alongside the existing `App.test.jsx`:

- Home renders all four section headings and the intro text.
- Teaser links point to `/about`, `/robots`, `/events`.
- RobotsTeaser shows all three robot names.
- Test setup gains a minimal IntersectionObserver mock (jsdom lacks it;
  required for `whileInView`).

## Performance

- `Reveal` animates once and settles.
- Persistent animations: only the existing grid background and the hero
  scroll scrub (Framer motion values, outside the React render cycle).
- All animation on `transform`/`opacity`.
