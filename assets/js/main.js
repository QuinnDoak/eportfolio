/*
 * quinndoak.dev: content renderer
 * Reads the JSON files in /data and builds the page. To update the site,
 * edit the data files, not this script. See README.md.
 */
(function () {
  'use strict';

  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const el = (id) => document.getElementById(id);

  async function loadJSON(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  }

  /* ---------- renderers ---------- */

  function renderHero(hero, status) {
    const root = el('hero-grid');
    if (!root) return;
    const actions = (hero.actions || [])
      .map((a) => {
        const external = /^https?:/.test(a.href);
        const attrs = external ? ' target="_blank" rel="noopener"' : '';
        return `<a href="${esc(a.href)}" class="btn btn-${esc(a.style)}"${attrs}>${esc(a.label)}</a>`;
      })
      .join('');
    const rows = ((status && status.rows) || [])
      .map((r) => {
        const mark = r.mark
          ? ` <span class="status-mark"><span aria-hidden="true">✓</span> ${esc(r.mark)}</span>`
          : '';
        return `
        <div class="status-row">
          <dt class="status-key">${esc(r.key)}</dt>
          <dd class="status-value">${esc(r.value)}${mark}</dd>
        </div>`;
      })
      .join('');
    const panel = status
      ? `
      <aside class="status-panel" aria-label="Profile status">
        <div class="status-panel-head">
          <span>${esc(status.title)}</span>
          <span class="status-badge"><span aria-hidden="true">●</span> ${esc(status.badge)}</span>
        </div>
        <dl class="status-rows">${rows}</dl>
      </aside>`
      : '';
    root.innerHTML = `
      <div class="hero-copy">
        <p class="hero-prompt">${esc(hero.prompt)}</p>
        <h1 class="hero-name">${esc(hero.name)}</h1>
        <p class="hero-lead">${esc(hero.targetLine)}</p>
        <p class="hero-supporting">${esc(hero.supporting)}</p>
        <div class="hero-actions">${actions}</div>
      </div>
      ${panel}`;
  }

  function renderAbout(about) {
    const root = el('about-grid');
    if (!root) return;
    const paras = about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
    const stats = about.stats
      .map(
        (s) => `
        <div class="stat-tile">
          <span class="stat-number">${esc(s.number)}</span>
          <span class="stat-label">${esc(s.label)}</span>
        </div>`
      )
      .join('');
    root.innerHTML = `
      <h2 class="section-h2">About</h2>
      <div class="about-text">${paras}</div>
      <div class="about-stats">${stats}</div>`;
  }

  function renderProjects(projects) {
    const root = el('projects-grid');
    if (!root) return;
    root.innerHTML = projects
      .filter((p) => p.featured)
      .map((p) => {
        const tags = (p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
        const well = p.image
          ? `<div class="work-card-well"><img src="${esc(p.image.src)}" alt="${esc(p.image.alt)}"
               width="${esc(p.image.width)}" height="${esc(p.image.height)}" loading="lazy"
               ${p.image.position ? `style="object-position:${esc(p.image.position)}"` : ''}></div>`
          : `<div class="work-card-well" aria-hidden="true"><span>${esc(p.title)}</span></div>`;
        const href = p.caseStudy
          ? `projects/${encodeURIComponent(p.slug)}/`
          : (p.links && p.links.live) || null;
        const external = href && /^https?:/.test(href);
        const attrs = external ? ' target="_blank" rel="noopener"' : '';
        const title = href
          ? `<a href="${esc(href)}"${attrs}>${esc(p.title)}</a>`
          : esc(p.title);
        const linkLabel = p.caseStudy ? 'Read the case study' : 'Visit the site';
        const link = href
          ? `<a href="${esc(href)}"${attrs} class="work-card-link">${linkLabel} <span aria-hidden="true">→</span></a>`
          : '';
        const status = p.status
          ? `<span class="work-card-status"><span aria-hidden="true">●</span> ${esc(p.status)}</span>`
          : '';
        return `
        <article class="work-card">
          ${well}
          <div class="work-card-body">
            <div class="work-card-meta">
              <span class="work-card-eyebrow">${esc(p.category)}</span>
              ${status}
            </div>
            <h3 class="work-card-title">${title}</h3>
            <p class="work-card-summary">${esc(p.summary)}</p>
            <div class="work-card-tags">${tags}</div>
            ${link}
          </div>
        </article>`;
      })
      .join('');
  }

  function renderCourses(data) {
    const root = el('course-grid');
    if (!root) return;
    const VISIBLE_COUNT = 5;
    const card = (c) => {
        const slug = c.code.replace(/\s+/g, '-').toLowerCase();
        const btnId = `course-btn-${slug}`;
        const panelId = `course-panel-${slug}`;
        const highlights = c.highlights.map((h) => `<li>${esc(h)}</li>`).join('');
        const tags = c.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
        return `
        <article class="course-card">
          <h3 class="course-heading">
            <button type="button" class="course-header" id="${btnId}" aria-expanded="false" aria-controls="${panelId}">
              <span class="course-header-left">
                <span class="course-info">
                  <span class="course-code">${esc(c.code)}</span>
                  <span class="course-name">${esc(c.name)}</span>
                  <span class="course-semester">${esc(c.semester)}</span>
                </span>
              </span>
              <span class="course-toggle" aria-hidden="true">+</span>
            </button>
          </h3>
          <div class="course-body" id="${panelId}" role="region" aria-labelledby="${btnId}">
            <p class="course-desc">${esc(c.desc)}</p>
            <ul class="course-highlights">${highlights}</ul>
            <div class="course-tags">${tags}</div>
          </div>
        </article>`;
    };

    const visible = data.courses.slice(0, VISIBLE_COUNT).map(card).join('');
    const extra = data.courses.slice(VISIBLE_COUNT).map(card).join('');
    const more = extra
      ? `
      <div class="course-grid-more" id="more-courses" hidden>${extra}</div>
      <button type="button" class="btn btn-secondary show-all-courses" id="show-all-courses"
              aria-expanded="false" aria-controls="more-courses">
        Show all ${data.courses.length} courses
      </button>`
      : '';
    root.innerHTML = visible + more;

    const showAll = el('show-all-courses');
    if (showAll) {
      showAll.addEventListener('click', () => {
        const expanded = showAll.getAttribute('aria-expanded') === 'true';
        showAll.setAttribute('aria-expanded', String(!expanded));
        el('more-courses').hidden = expanded;
        showAll.textContent = expanded
          ? `Show all ${data.courses.length} courses`
          : 'Show fewer courses';
      });
    }

    // Delegated, accessible accordion toggle
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.course-header');
      if (!btn) return;
      const card = btn.closest('.course-card');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      card.classList.toggle('open', !expanded);
    });

    // Upcoming block
    const up = el('upcoming-root');
    if (up && data.upcoming) {
      const items = data.upcoming.items
        .map((i) => `<li><span class="u-code">${esc(i.code)}</span>${esc(i.name)}</li>`)
        .join('');
      up.innerHTML = `
        <div class="upcoming-block">
          <h3>${esc(data.upcoming.label || 'Upcoming')}: ${esc(data.upcoming.term)}</h3>
          <p class="upcoming-note">${esc(data.upcoming.note)}</p>
          <ul class="upcoming-list">${items}</ul>
        </div>`;
    }
  }

  function renderSkills(skills) {
    const root = el('skills-container');
    if (!root) return;
    root.innerHTML = skills
      .map((cat) => {
        const chips = cat.items.map((s) => `<span class="tag">${esc(s)}</span>`).join('');
        return `
        <div class="skill-category">
          <h3 class="skill-category-title">${esc(cat.title)}</h3>
          <div class="skill-chips">${chips}</div>
        </div>`;
      })
      .join('');
  }

  function renderExperience(exp) {
    const root = el('experience-root');
    if (!root) return;

    const featured = exp.work
      .filter((w) => w.featured)
      .map((w) => {
        const tools = (w.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
        return `
        <article class="exp-card">
          <div class="exp-card-head">
            <h3 class="exp-card-title">${esc(w.title)}, ${esc(w.org)}</h3>
            <span class="exp-card-date">${esc(w.date)}</span>
          </div>
          <p class="exp-card-summary">${esc(w.summary)}</p>
          ${tools ? `<div class="exp-card-tools">${tools}</div>` : ''}
        </article>`;
      })
      .join('');

    const tiles = exp.work
      .filter((w) => !w.featured)
      .map(
        (w) => `
        <div class="exp-tile">
          <span class="exp-tile-role">${esc(w.title)}</span>
          <span class="exp-tile-org">${esc(w.org)}</span>
          <span class="exp-tile-date">${esc(w.date)}</span>
        </div>`
      )
      .join('');

    const edu = exp.education
      .map(
        (e) => `
        <article class="exp-card exp-card-edu">
          <div class="exp-card-head">
            <h3 class="exp-card-title">${esc(e.title)}</h3>
            <span class="exp-card-date">${esc(e.date)}</span>
          </div>
          <p class="exp-card-org">${esc(e.org)}</p>
          <p class="exp-card-summary">${esc(e.detail)}</p>
        </article>`
      )
      .join('');

    root.innerHTML = `
      ${featured}
      ${tiles ? `<div class="exp-tiles">${tiles}</div>` : ''}
      <h3 class="exp-subhead">Education</h3>
      ${edu}`;
  }

  function renderCallout(callout) {
    const root = el('contact-callout');
    if (!root || !callout) return;
    const actions = (callout.actions || [])
      .map((a) => {
        const external = /^https?:/.test(a.href);
        const attrs = external ? ' target="_blank" rel="noopener"' : '';
        return `<a href="${esc(a.href)}" class="btn btn-${esc(a.style)}"${attrs}>${esc(a.label)}</a>`;
      })
      .join('');
    root.innerHTML = `
      <div class="callout-copy">
        <h2 class="callout-heading">${esc(callout.heading)}</h2>
        <p class="callout-subline">${esc(callout.subline)}</p>
      </div>
      <div class="callout-actions">${actions}</div>`;
  }

  function renderContact(contact) {
    const root = el('contact-grid');
    if (!root) return;
    root.innerHTML = contact
      .map((c) => {
        const external = /^https?:/.test(c.href);
        const attrs = external ? ' target="_blank" rel="noopener"' : '';
        return `
        <a href="${esc(c.href)}" class="contact-link"${attrs}>
          <span class="contact-link-label">${esc(c.label)}</span>
          <span class="contact-link-value">${esc(c.value)}</span>
        </a>`;
      })
      .join('');
  }

  function renderFooter(site) {
    const root = el('site-footer');
    if (!root) return;
    const year = new Date().getFullYear();
    const location = site.footer && site.footer.location ? ` · ${esc(site.footer.location)}` : '';
    root.innerHTML = `&copy; ${year} ${esc(site.hero.name)}${location}`;
  }

  /* ---------- behavior ---------- */

  function setupNavHighlight() {
    const links = new Map();
    document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
      links.set(a.getAttribute('href').slice(1), a);
    });
    const sections = document.querySelectorAll('main section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) => a.classList.remove('active'));
            const active = links.get(entry.target.id);
            if (active) active.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
  }

  /* ---------- boot ---------- */

  async function boot() {
    try {
      const [site, projects, courses, skills, experience] = await Promise.all([
        loadJSON('data/site.json'),
        loadJSON('data/projects.json'),
        loadJSON('data/courses.json'),
        loadJSON('data/skills.json'),
        loadJSON('data/experience.json'),
      ]);

      // Head metadata that lives in data
      if (site.meta) {
        document.title = site.meta.title;
      }

      renderHero(site.hero, site.status);
      renderAbout(site.about);
      renderProjects(projects);
      renderCourses(courses);
      renderSkills(skills);
      renderExperience(experience);
      renderCallout(site.callout);
      renderContact(site.contact);
      renderFooter(site);

      const banner = el('noscript-fallback');
      if (banner) banner.remove();

      setupNavHighlight();
    } catch (err) {
      console.error(err);
      const main = el('main');
      if (main) {
        main.insertAdjacentHTML(
          'afterbegin',
          `<div class="noscript-banner">Something went wrong loading this page's content.
           You can still reach me at <a href="mailto:quinn.doak@gmail.com">quinn.doak@gmail.com</a>
           or view my <a href="resume.pdf">résumé</a>.</div>`
        );
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
