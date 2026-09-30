# Case studies

Each case study is its own folder with an `index.html`, so it gets a real
shareable URL you can put on a resume or LinkedIn:

```
projects/mini-siem/index.html  ->  https://quinndoak.dev/projects/mini-siem/
```

The content lives in the HTML itself rather than in `/data`. That is
deliberate: crawlers and link previews read the page without running
JavaScript, and each case study is different enough that a shared JSON
schema would fight you more than help.

## Adding one

1. Copy `_template/` to `projects/<slug>/`, where `<slug>` is lowercase
   with hyphens (`mini-siem`, `pi-soc-honeypot`).
2. Fill in every `PROJECT NAME`, `SLUG`, `CATEGORY`, and placeholder
   sentence. Search the file for those words to be sure none are left.
3. Delete any block the project does not have. The template marks the
   optional ones in comments: the diagram figure, the code excerpt, the
   metric tiles, the GitHub button, and the next-case-study row. Omit the
   element entirely rather than shipping an empty or invented one. Metric
   tiles only ship if every number is real.
4. Remove the `<meta name="robots" content="noindex">` line so the page
   can be indexed.
5. Add the project to `data/projects.json` with `"caseStudy": true` and a
   matching `"slug"`, so the homepage card links to it.
6. Add the URL to `sitemap.xml`.

## House rules

These match `eportfolio-handoff/CLAUDE.md`:

- No em dashes anywhere. Use colons, commas, periods, or parentheses.
- Never invent metrics, tools, or dates.
- Images need `width`, `height`, `loading="lazy"`, and a real `alt`
  sentence describing what the image shows.
- Keep one `h1` per page: the project title.
