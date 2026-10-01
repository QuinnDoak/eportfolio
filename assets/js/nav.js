/*
 * quinndoak.dev: site header behavior
 * Shared by the homepage and every case study page. Handles the mobile
 * menu only. Content rendering lives in main.js.
 */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  function setupMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const mq = window.matchMedia('(max-width: 767px)');
    let open = false;

    const focusables = () => Array.from(menu.querySelectorAll('a'));

    function setOpen(next, restoreFocus) {
      open = next;
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
      if (open) {
        const first = focusables()[0];
        if (first) first.focus();
      } else if (restoreFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', () => setOpen(!open, false));

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a') && open) setOpen(false, false);
    });

    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false, true);
        return;
      }
      if (e.key === 'Tab') {
        // Keep Tab cycling between the toggle button and the menu links
        const items = [toggle].concat(focusables());
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    mq.addEventListener('change', () => {
      if (!mq.matches && open) setOpen(false, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
  } else {
    setupMobileMenu();
  }
})();
