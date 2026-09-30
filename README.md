# quinndoak.dev

Personal cybersecurity ePortfolio for Quinn Doak. Static site, no build step,
deployed to [quinndoak.dev](https://quinndoak.dev/) via GitHub Pages.

## What it is

A single-page portfolio (hero, selected work, experience, academics, skills,
about, contact) plus one page per case study under `projects/`.

Homepage **content lives in JSON** under `data/`, and a small vanilla-JS
renderer (`assets/js/main.js`) builds the page on load. Case studies are the
exception: each is static HTML so crawlers and link previews see a real page.
There is no framework, bundler, or npm dependency; it stays a plain static site.

The design follows the "Console" spec in `eportfolio-handoff/design/HANDOFF.md`.
Read that before changing any UI.

## File map

```
index.html              Page skeleton: <head> metadata (SEO/OG/JSON-LD),
                        header, section shells, and the <script> tags.
assets/
  css/styles.css        All styles (design tokens, layout, a11y, responsive)
                        for both the homepage and case studies.
  js/nav.js             Mobile menu. Loaded by every page.
  js/main.js            Fetches data/*.json and renders the homepage.
  js/case-study.js      Table-of-contents scroll-spy on case study pages.
  favicon.svg           Primary favicon. favicon-32.png / apple-touch-icon.png = raster fallbacks.
data/
  site.json             Hero, profile.status rows, about copy, stat tiles,
                        contact callout, contact links, footer.
  projects.json         Selected-work cards.
  courses.json          Course accordions + the current-term block.
  experience.json       Work (one featured, rest compact) + education.
  skills.json           Skill categories and chips.
projects/
  README.md             How to add a case study.
  _template/            Copy this to projects/<slug>/ for a new case study.
resume.pdf              Résumé: kept at the site root (do not move; it may be
                        linked from submitted applications: quinndoak.dev/resume.pdf).
og-image.png            1200×630 social share image.
robots.txt, sitemap.xml, CNAME, .nojekyll   Hosting/SEO plumbing.
```

## How to update content

**You only need to edit files in `data/`.** No HTML surgery.

- **Fix a course grade/status, add a highlight, add a course** → `data/courses.json`
- **Add or change a project** → `data/projects.json`
- **Update a job / add experience** → `data/experience.json` (keep it
  reverse-chronological, newest first)
- **Add a skill** → `data/skills.json`
- **Hero text, status panel rows, about paragraphs, stat tiles, contact** → `data/site.json`
- **Add a case study** → see `projects/README.md`

Each JSON file is an array or object of plain records; copy an existing entry as
a template. Text is rendered as plain text (HTML is escaped), so just write
normal characters.

### Regenerating images

`og-image.png` and the icons were produced with a headless-Chromium script
(kept out of the repo). There is no pipeline that must be re-run for the site
to work.

## Running locally

Because the page fetches JSON, open it through a local server (not `file://`):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Push to the default branch. GitHub Pages serves the repo root as-is. `CNAME`
points the Pages site at `quinndoak.dev`; `.nojekyll` stops Pages from
interfering with the `assets/` directory.

## Accessibility notes

- Course accordions and the "Show all courses" control are real `<button>`s
  with `aria-expanded` / `aria-controls`; operable by keyboard alone.
- The mobile menu traps Tab while open, closes on Escape, returns focus to its
  button, and locks body scroll. With JavaScript off it degrades to a plain
  link list.
- Visible focus rings everywhere (`:focus-visible`); a skip-to-content link is
  the first focusable element.
- Every interactive control is at least 44px tall.
- `prefers-reduced-motion` disables the menu transition and smooth scrolling.
- All text meets WCAG AA contrast (verified at 390, 768, and 1440px).
- Status and card state are never conveyed by color alone; each dot or check
  has a text label beside it.
