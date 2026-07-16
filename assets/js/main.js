/*
 * quinndoak.dev — content renderer
 * Reads the JSON files in /data and builds the page. To update the site,
 * edit the data files — not this script. See README.md.
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

  function renderHero(hero) {
    const root = el('hero-grid');
    if (!root) return;
    const nameHtml = hero.nameHighlight
      ? esc(hero.name).replace(esc(hero.nameHighlight), `<span class="highlight">${esc(hero.nameHighlight)}</span>`)
      : `<span class="highlight">${esc(hero.name)}</span>`;
    root.innerHTML = `
      <div class="hero-photo-col">
        <div class="hero-photo-wrapper">
          <img src="${esc(hero.photo.src)}" alt="${esc(hero.photo.alt)}" class="hero-photo"
               width="${esc(hero.photo.width)}" height="${esc(hero.photo.height)}"
               loading="eager" fetchpriority="high">
        </div>
      </div>
      <div class="hero-text-col">
        <p class="hero-greeting">${esc(hero.greeting)}</p>
        <h1 class="hero-name">${nameHtml}</h1>
        <p class="hero-title">${esc(hero.title)}</p>
        <p class="hero-bio">${esc(hero.bio)}</p>
        <div class="hero-actions">
          <a href="#projects" class="btn btn-primary">View Projects</a>
          <a href="#contact" class="btn btn-outline">Get in Touch</a>
          <a href="resume.pdf" class="btn btn-download" download>&#x2913; Resume</a>
        </div>
      </div>`;
  }

  function renderAbout(about) {
    const root = el('about-grid');
    if (!root) return;
    const paras = about.paragraphs
      .map((p, i) => `<p${i === about.paragraphs.length - 1 && about.paragraphs.length > 1 ? ' class="about-note"' : ''}>${esc(p)}</p>`)
      .join('');
    const stats = about.stats
      .map((s) => `<div class="stat-card"><div class="stat-number">${esc(s.number)}</div><div class="stat-label">${esc(s.label)}</div></div>`)
      .join('');
    root.innerHTML = `
      <div class="about-text">${paras}</div>
      <div class="about-stats">${stats}</div>`;
  }

  function renderProjects(projects) {
    const root = el('projects-grid');
    if (!root) return;
    root.innerHTML = projects
      .map((p) => {
        const highlights = p.highlights.map((h) => `<li>${esc(h)}</li>`).join('');
        const stack = p.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
        const link = p.link
          ? `<a href="${esc(p.link.href)}" target="_blank" rel="noopener" class="project-link">${esc(p.link.label)}</a>`
          : '';
        return `
        <article class="project-card ${esc(p.accent || '')}">
          <p class="project-status ${esc(p.status)}">${esc(p.statusLabel)}</p>
          <h3 class="project-name">${esc(p.name)}</h3>
          <p class="project-desc">${esc(p.desc)}</p>
          <ul class="project-highlights">${highlights}</ul>
          <div class="project-footer">
            <div class="project-stack">${stack}</div>
            ${link}
          </div>
        </article>`;
      })
      .join('');
  }

  function renderCourses(data) {
    const root = el('course-grid');
    if (!root) return;
    root.innerHTML = data.courses
      .map((c) => {
        const slug = c.code.replace(/\s+/g, '-').toLowerCase();
        const btnId = `course-btn-${slug}`;
        const panelId = `course-panel-${slug}`;
        const highlights = c.highlights.map((h) => `<li>${esc(h)}</li>`).join('');
        const tags = c.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
        return `
        <article class="course-card ${esc(c.accent || '')}">
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
      })
      .join('');

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
        <div class="upcoming-block fade-in">
          <h3>Upcoming — ${esc(data.upcoming.term)}</h3>
          <p class="upcoming-note">${esc(data.upcoming.note)}</p>
          <ul class="upcoming-list">${items}</ul>
        </div>`;
    }
  }

  function renderSkills(skills, site) {
    const root = el('skills-container');
    if (root) {
      root.innerHTML = skills
        .map((cat) => {
          const chips = cat.items.map((s) => `<span class="skill-chip">${esc(s)}</span>`).join('');
          return `
          <div class="skill-category">
            <h3>${esc(cat.title)}</h3>
            <div class="skill-chips">${chips}</div>
          </div>`;
        })
        .join('');
    }

    const certRoot = el('certs-root');
    if (certRoot && site.certifications) {
      const certs = site.certifications
        .map((c) => {
          const status = c.status && c.status.toLowerCase() !== 'earned'
            ? `<span class="cert-status">${esc(c.status)}</span>` : '';
          return `<li>${esc(c.name)}${status}</li>`;
        })
        .join('');
      certRoot.innerHTML = `
        <h3>Certifications</h3>
        <ul class="cert-list">${certs}</ul>`;
    }

    const cwRoot = el('coursework-root');
    if (cwRoot && site.relevantCoursework) {
      const items = site.relevantCoursework.map((c) => `<li>${esc(c)}</li>`).join('');
      cwRoot.innerHTML = `
        <h3>Relevant Coursework</h3>
        <ul class="cert-list">${items}</ul>`;
    }
  }

  function renderExperience(exp) {
    const root = el('experience-root');
    if (!root) return;
    const edu = exp.education
      .map((e) => `
        <div class="timeline-item">
          <p class="timeline-date">${esc(e.date)}</p>
          <h4>${esc(e.title)}</h4>
          <p class="org">${esc(e.org)}</p>
          <p>${esc(e.detail)}</p>
        </div>`)
      .join('');
    const work = exp.work
      .map((w) => `
        <div class="timeline-item">
          <p class="timeline-date">${esc(w.date)}</p>
          <h4>${esc(w.title)}</h4>
          <p class="org">${esc(w.org)}</p>
          <p>${esc(w.detail)}</p>
        </div>`)
      .join('');
    root.innerHTML = `
      <h3 class="subhead">Education</h3>
      <div class="timeline">${edu}</div>
      <h3 class="subhead">Work Experience</h3>
      <div class="timeline">${work}</div>`;
  }

  function renderContact(contact) {
    const root = el('contact-grid');
    if (!root) return;
    root.innerHTML = contact
      .map((c) => {
        const external = /^https?:/.test(c.href);
        const attrs = external ? ' target="_blank" rel="noopener"' : '';
        return `
        <a href="${esc(c.href)}" class="contact-card"${attrs}>
          <span class="label">${esc(c.label)}</span>
          <span class="value">${esc(c.value)}</span>
        </a>`;
      })
      .join('');
  }

  function renderFooter(site) {
    const root = el('site-footer');
    if (!root) return;
    const year = new Date().getFullYear();
    root.innerHTML = `
      &copy; ${year} ${esc(site.hero.name)}
      <span class="last-updated">Last updated: ${esc(site.lastUpdated)}</span>`;
  }

  /* ---------- behavior ---------- */

  function setupFadeIn() {
    const items = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
      items.forEach((i) => i.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    items.forEach((i) => obs.observe(i));
  }

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

      renderHero(site.hero);
      renderAbout(site.about);
      renderProjects(projects);
      renderCourses(courses);
      renderSkills(skills, site);
      renderExperience(experience);
      renderContact(site.contact);
      renderFooter(site);

      const banner = el('noscript-fallback');
      if (banner) banner.remove();

      setupFadeIn();
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
