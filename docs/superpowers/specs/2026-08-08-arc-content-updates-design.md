# ARC Rebrand + 2026 Championship Content Updates

**Date:** 2026-08-08
**Branch:** content/arc-rebrand-updates (off `react-ursaworks`)
**Sources:** [arc-robotics.org/about](https://www.arc-robotics.org/about),
[arc-robotics.org](https://www.arc-robotics.org/),
[WashU Engineering news article](https://engineering.washu.edu/news/2026/WashU-Ursaworks-Robotics-finishes-strong-at-2026-ARC-Championship.html)

## Goal

Bring site copy in line with the RoboMaster North America → ARC rebrand, add a
"What Is ARC" section to `/about`, reorder the robot lineup to
Infantry → Sentry → Hero, tighten two robot descriptions, restructure the
events intro, and add the 2026 ARC Championship to the events list.

Text-only in intent, but five files of small code changes are required to render
the new data — including one latent bug that would silently break the new event
photo.

## Decisions Made

| Question | Decision |
|---|---|
| Branch base | `react-ursaworks`; PRs #23 (sectioning revamp) and #24 (reveal fix) are already merged, so every target string is on main |
| ARC acronym expansion | **Do not expand it.** ARC's own site never states what ARC stands for; inventing an expansion would put a fabricated fact on the site |
| "What Is ARC" placement | Below the mission, as a full-width sibling of `.ourMission` |
| Content split | About = the organization and championship; robots page = the game itself. Avoids the two reading as duplicates |
| Historical event names | **Keep as-is.** RMNA 2023–2025 happened under that name; renaming them retroactively is inaccurate. 2026 onward uses ARC |
| Competition card locations | **Removed entirely.** These cards describe recurring competitions, not instances; per-year locations already live on the event entries |
| `robomasterna.com` link | `href` unchanged (it resolves to the same site); visible label updated |
| Top-8 finish | Surfaced via a new optional `result` field on the 2026 event entry |
| `Contact.jsx` "ARC Robotics Competition" | **Leave alone.** The WashU article uses that exact phrase, so it is a legitimate name in circulation |
| Scope | Single PR |

## Copy Changes — `src/content.json`

### 1. `ourRobot`

Before:
> Each year, the Robomaster Competition challenges teams to design and build robots for a paintball-like game. Last season, we developed and tested these robots:

After:
> Each year, the ARC Robotics Competition challenges teams to design and build robots for a combat-style game. Last season, we developed and tested these 3 robots:

"Combat-style" rather than "tactical combat" deliberately — the latter is used
in the new `arc` block, and repeating it across two pages reads as boilerplate.

### 2. New `arc` block

Added at the top level, immediately after `aboutHighlights`:

```json
"arc": {
  "title": "What Is ARC",
  "description": "ARC Robotics — formerly RoboMaster North America — runs an annual competition where university teams from around the world showcase their engineering through tactical combat and technical challenges. The ARC Championship draws more than 20 international and domestic teams across three events: a 1v1 competition, a 3v3 competition, and an engineering challenge."
}
```

Every claim is sourced: "tactical combat and technical challenges" and the
three-event structure from arc-robotics.org; "more than 20 international and
domestic university teams" from the WashU article; "formerly RoboMaster North
America" from an ARC staff bio noting the org "started as RMNA in 2021".

### 3. `aboutHighlights[2]` — "Built To Compete"

`RoboMaster events across North America` → `ARC events across North America`.
Rest of the description unchanged.

### 4. `robots[]` — reorder

New order: **Infantry, Sentry, Hero**. One array reorder satisfies both the
homepage teaser and `/robots`, since both read the same array.

Cosmetic side effect: `RobotsTeaser` alternates layout via `index % 2 === 1`,
so which robots render flipped changes. This is intended and needs no code change.

### 5. Sentry description — remove the restricted-zone clause

Before:
> In the 3v3 format, it roams within a restricted zone, providing constant automated pressure and forcing enemy robots to adapt their movements.

After:
> In the 3v3 format, it provides constant automated pressure and forces enemy robots to adapt their movements.

The clause is cut, not the whole sentence; the verbs are re-conjugated so the
sentence still parses.

### 6. Infantry description — drop the final sentence

Remove: "Because they are often fielded in multiples, their collective
performance heavily influences the pace and outcome of each round."

The preceding sentence already closes the paragraph.

### 7. `competitions[]`

| Field | Before | After |
|---|---|---|
| `[0].name` | RoboMaster North America (RMNA) | ARC Championship (ARCC) |
| `[0].tag` | Championship · San Diego, CA | Championship |
| `[0].description` | "The premier collegiate RoboMaster competition in the region." | "The premier collegiate ARC competition in the region." |
| `[1].name` | Midwest RoboMaster Regional | Midwest ARC Regional |
| `[1].tag` | Regional Qualifier · Purdue University, IN | Regional Qualifier |
| `[1].description` | "…ahead of the North America championship…" | "…ahead of the ARC Championship…" |

Dropping the locations resolves a real accuracy problem: `[0]` was tagged San
Diego, but ARCC 2026 was held at Purdue — and `[1]` is also Purdue, so simply
correcting `[0]` would have left both cards reading "Purdue University, IN".

`.competitionTag` is an inline uppercase label with no fixed width or pill
background, so shorter text needs no CSS change.

### 8. New event entry at `events[0]`

```json
{
  "name": "ARCC 2026",
  "location": "Purdue University, IN",
  "date": "Jun 29. 2026",
  "image": "2026ARCUrsaworks-Team-Photo-1.webp",
  "result": "Top 8 · 1v1 Division"
}
```

The `date` format is load-bearing: `Event.jsx` derives "Seasons Competing" by
regex-matching `/\d{4}/` out of it, so the existing `"Mon DD. YYYY"` shape must
hold. `"Jun 29. 2026"` matches `2026` correctly.

**Assumption:** ARC lists ARCC Season One as June 29 – July 5; existing entries
show a single day, so the start date is used.

Automatic knock-on effects, all desired:
- Events Attended: 6 → 7
- Seasons Competing: 3 → 4
- `topEvents = events.slice(0, 2)` — ARCC 2026 and RMNA 2025 become the two
  large cards; Midwest 2025 drops into the smaller grid below.
- `EventTeaser` on the homepage shows `events[0]`, so ARCC 2026 also becomes the
  homepage "Latest Event".

## Code Changes

### A. `src/configs/loadImages.js` — support `.webp`

```
'../assets/**/*.{png,jpg,jpeg,svg}'  →  '../assets/**/*.{png,jpg,jpeg,svg,webp}'
```

**Required, not optional.** The new photo
(`content/assets/events/2026ARCUrsaworks-Team-Photo-1.webp`) is webp. Without
this, `loadImage` returns `null`, `<img src={null}>` renders broken in both
`/events` and the homepage teaser, and the only signal is a `console.error`.

`syncAssets.js` copies by directory with no extension filter, so the file
reaches `src/assets/events/` already — the glob is the sole blocker.

Keeping webp is the right call: the new photo is 59 KB, while `2025RMNA.jpg` is
16 MB and `2024midwest.jpg` is 12 MB.

### B. `src/components/About.jsx` — render the ARC section

New sibling after `.ourMission`, inside `#aboutBlock`:

```jsx
<div className="whatIsArc">
    <h2 className="sectionTitle">{content.arc.title}</h2>
    <p className="aboutDesc">{content.arc.description}</p>
</div>
```

`#aboutBlock` is already `flex-direction: column; gap: 12rem`, so no
restructuring is needed. `.aboutLeft > .sectionTitle { text-align: center }` is
child-scoped, so the new heading is left-aligned — correct for a full-width block.

### C. `src/styles/aboutStyle.css` — add `.whatIsArc`

```css
.whatIsArc{
    width: 100%;
    max-width: 90rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
```

The `max-width` is functional, not decorative: `#aboutBlock` is `100vw`, so an
unconstrained 1.6rem paragraph runs well over 100 characters per line on a wide
monitor.

### D. `src/components/Event.jsx` — three changes

1. Move `<p className="robomasterDesc">` from above `.eventStats` to directly
   below it (still inside `.robomaster`, above the competition cards).
2. Relabel `More About Robomasters` → `More About ARC`. `href` unchanged.
3. Render `result` conditionally in **both** `.eventInfo` (top cards) and
   `.otherEventInfo` (grid below), so the line survives when ARCC 2026 ages out
   of the top two:
   ```jsx
   {event.result && <span className="eventResult">{event.result}</span>}
   ```
   Being optional, the six older entries render exactly as they do today.

### E. `src/styles/eventStyle.css` — add `.eventResult`

Matches the established accent-label pattern (`.competitionTag`,
`.highlightTag`) so it reads as part of the existing visual language:

```css
.eventResult{
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #E87ABA;
}
```

## Testing

Existing tests are content-driven and adapt for free: `RobotsTeaser.test.jsx`
iterates `content.robots` (so it validates the reorder), and
`EventTeaser.test.jsx` reads `content.events[0]` (so it validates the new
entry). No edits needed to either.

Two new tests:

1. **Image extension guard** — assert every `image` filename referenced in
   `content.json` (`robots[]`, `events[]`, `aboutImage`) ends in an extension
   the `loadImages` glob supports. This is the test that would have caught the
   webp bug, and it generalizes to the next format added.
2. **Result line** — `Event` renders `result` when present and omits the element
   entirely when absent.

Full suite (`npx vitest --run`) and `npm run lint` must pass.

## Out of Scope

- `2025RMNA.jpg` (16 MB) and `2024midwest.jpg` (12 MB) — roughly 37 MB of event
  photos ship to visitors. Real problem, separate PR.
- `.bgAnimation` compositor layer memory (~113 MB of ~192 MB at 1920×920 @1×),
  carried over from the PR #24 investigation.
- `seattleMatch.png` remains unreferenced. The WashU article places ARCC 2026 at
  Purdue with no mention of Seattle, so it is not the championship photo. Its
  event is unidentified.
- Adding results to the six historical events. Only 2026 has a sourced result.
