'use strict';

const GrassGuide = (() => {
  const WARM_STATES = ['FL', 'GA', 'AL', 'MS', 'LA', 'TX', 'SC', 'NC', 'AR', 'TN', 'AZ', 'NM', 'NV', 'CA'];
  const WARM_COUNTRIES = ['AU', 'BR', 'MX', 'IN', 'TH', 'SG', 'MY', 'PH'];

  function detectSeason() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.startsWith('Australia/') || tz.startsWith('Asia/Singapore') || tz.startsWith('Asia/Bangkok')) {
        return 'warm';
      }
      if (tz.startsWith('Europe/') || tz.startsWith('Asia/Tokyo')) {
        return 'cool';
      }
      if (tz.startsWith('America/')) {
        const lower = tz.toLowerCase();
        for (const state of WARM_STATES.map((s) => s.toLowerCase())) {
          if (lower.includes(state)) return 'warm';
        }
        return 'cool';
      }
    } catch { /* fallback */ }
    return 'cool';
  }

  function setSeason(season) {
    const warmCards = document.querySelectorAll('.grass-card-warm');
    const coolCards = document.querySelectorAll('.grass-card-cool');
    const warmToggle = document.getElementById('season-warm');
    const coolToggle = document.getElementById('season-cool');

    if (season === 'warm') {
      warmCards.forEach((el) => el.hidden = false);
      coolCards.forEach((el) => el.hidden = true);
      if (warmToggle) warmToggle.classList.add('active');
      if (coolToggle) coolToggle.classList.remove('active');
    } else {
      warmCards.forEach((el) => el.hidden = true);
      coolCards.forEach((el) => el.hidden = false);
      if (coolToggle) coolToggle.classList.add('active');
      if (warmToggle) warmToggle.classList.remove('active');
    }
  }

  function init() {
    const warmToggle = document.getElementById('season-warm');
    const coolToggle = document.getElementById('season-cool');

    if (warmToggle) warmToggle.addEventListener('click', () => setSeason('warm'));
    if (coolToggle) coolToggle.addEventListener('click', () => setSeason('cool'));

    const detected = detectSeason();
    setSeason(detected);
  }

  TurfApp.onReady(init);

  return { detectSeason, setSeason };
})();
