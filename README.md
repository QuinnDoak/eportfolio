# quinndoak.dev

Personal cybersecurity ePortfolio for Quinn Doak. Static site, no build step,
deployed to [quinndoak.dev](https://quinndoak.dev/) via GitHub Pages.

## What it is

A single-page portfolio (hero, about, projects, academics, skills & experience,
contact). All page **content lives in JSON** under `data/`, and a small
vanilla-JS renderer (`assets/js/main.js`) builds the page on load. There is no
framework, bundler, or npm dependency — it stays a plain static site.

## File map

```
index.html              Page skeleton: <head> metadata (SEO/OG/JSON-LD),
                        nav, section shells, and the <script> tag.
assets/
  css/styles.css        All styles (design tokens, layout, a11y, responsive).
  js/main.js            Fetches data/*.json and renders every section.
  me.jpg                Hero photo (compressed).
  favicon.svg           Primary favicon. favicon-32.png / apple-touch-icon.png = raster fallbacks.
data/
  site.json             Hero, about, stats, certifications, coursework list,
                        contact links, and lastUpdated (shown in the footer).
  projects.json         Project cards.
  courses.json          Course accordions + the "Upcoming" block.
  experience.json       Education + work timeline (reverse-chronological).
  skills.json           Skill categories and chips.
resume.pdf              Résumé — kept at the site root (do not move; it may be
                        linked from submitted applications: quinndoak.dev/resume.pdf).
og-image.png            1200×630 social share image.
robots.txt, sitemap.xml, CNAME, .nojekyll   Hosting/SEO plumbing.
```

## How to update content

**You only need to edit files in `data/`.** No HTML surgery.

- **Fix a course grade/status, add a highlight, add a course** → `data/courses.json`
- **Add or change a project** → `data/projects.json`
- **Update a job / add experience** → `data/experience.json` (keep it
  reverse-chronological — newest first)
- **Add a skill** → `data/skills.json`
- **Hero text, about paragraphs, stats, certifications, contact links** → `data/site.json`
- **Bump the "Last updated" date in the footer** → `lastUpdated` in `data/site.json`

Each JSON file is an array or object of plain records; copy an existing entry as
a template. Text is rendered as plain text (HTML is escaped), so just write
normal characters.

### Regenerating images

`og-image.png`, the icons, and the compressed `assets/me.jpg` were produced with
a headless-Chromium script (kept out of the repo). If you swap the photo, drop a
new `assets/me.jpg`; there's no pipeline that must be re-run for the site to work.

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

- Course accordions are real `<button>`s with `aria-expanded` / `aria-controls`;
  operable by keyboard alone.
- Visible focus rings everywhere (`:focus-visible`); a skip-to-content link is
  the first focusable element.
- `prefers-reduced-motion` disables fade-ins, the particle animation, and smooth
  scrolling.
- Body text meets WCAG AA contrast.
