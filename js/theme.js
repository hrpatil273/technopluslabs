(function () {
  'use strict';

  var KEY    = 'tpl-theme';
  var MODES  = ['auto', 'light', 'dark'];
  var ICONS  = { auto: 'bi-circle-half', light: 'bi-sun-fill', dark: 'bi-moon-stars-fill' };
  var LABELS = { auto: 'Auto', light: 'Light', dark: 'Dark' };

  function resolvedTheme(mode) {
    return mode === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
  }

  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', resolvedTheme(mode));
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }

  function renderButton(btn, mode) {
    if (!btn) return;
    btn.innerHTML =
      '<i class="bi ' + ICONS[mode] + '"></i>' +
      '<span class="d-none d-md-inline">' + LABELS[mode] + '</span>';
    btn.setAttribute('title', 'Theme: ' + LABELS[mode] + ' — click to cycle');
    btn.setAttribute('aria-label', 'Switch theme (current: ' + LABELS[mode] + ')');
  }

  function renderDate(el) {
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  /* ── Boot: read saved preference ── */
  var current = 'auto';
  try { current = localStorage.getItem(KEY) || 'auto'; } catch (e) {}
  applyTheme(current);

  document.addEventListener('DOMContentLoaded', function () {
    var btn    = document.getElementById('themeToggle');
    var dateEl = document.getElementById('navDate');

    renderButton(btn, current);
    renderDate(dateEl);

    /* Also fill any inline stats date span */
    var statsDateEl = document.getElementById('statsDate');
    if (statsDateEl) {
      statsDateEl.textContent = new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    }

    if (btn) {
      btn.addEventListener('click', function () {
        var idx = (MODES.indexOf(current) + 1) % MODES.length;
        current = MODES[idx];
        applyTheme(current);
        renderButton(btn, current);
      });
    }

    /* React to OS-level preference change while in auto mode */
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      try {
        if (localStorage.getItem(KEY) === 'auto') applyTheme('auto');
      } catch (e) {}
    });
  });
})();
