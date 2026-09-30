/*
 * quinndoak.dev: case study page behavior
 * Highlights the table-of-contents entry for the section in view.
 * Progressive enhancement: without it the TOC is still a working
 * list of anchor links.
 */
(function () {
  'use strict';

  function setupToc() {
    const toc = document.querySelector('.cs-toc');
    if (!toc || !('IntersectionObserver' in window)) return;

    const links = new Map();
    toc.querySelectorAll('a[href^="#"]').forEach((a) => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) links.set(target, a);
    });
    if (!links.size) return;

    const setActive = (link) => {
      links.forEach((a) => a.classList.remove('active'));
      link.classList.add('active');
    };

    setActive(links.values().next().value);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(links.get(visible.target));
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    links.forEach((_, section) => obs.observe(section));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToc);
  } else {
    setupToc();
  }
})();
