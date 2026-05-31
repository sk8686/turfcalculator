'use strict';

const LawnCalendar = (() => {
  const WARM_STATES = ['FL', 'GA', 'AL', 'MS', 'LA', 'TX', 'SC', 'NC', 'AR', 'TN', 'AZ', 'NM', 'NV', 'CA'];
  const WARM_COUNTRIES = ['AU', 'BR', 'MX', 'IN', 'TH', 'SG', 'MY', 'PH'];

  const COOL_SEASON = [
    {
      month: 1, name: 'January', phase: 'dormant', color: '#94a3b8',
      tasks: [
        { text: 'Avoid walking on frozen grass', priority: 'medium' },
        { text: 'Service mower and sharpen blades', priority: 'low' },
      ],
      tip: 'Plan your lawn care schedule for the year ahead.',
    },
    {
      month: 2, name: 'February', phase: 'dormant', color: '#94a3b8',
      tasks: [
        { text: 'Order seeds and supplies', priority: 'low' },
        { text: 'Check for snow mold damage', priority: 'medium' },
      ],
      tip: 'Late February: soil test if ground is thawed.',
    },
    {
      month: 3, name: 'March', phase: 'spring-prep', color: '#86efac',
      tasks: [
        { text: 'Rake and clean up debris', priority: 'high' },
        { text: 'Apply pre-emergent crabgrass control', priority: 'high' },
        { text: 'Soil test and amend pH', priority: 'medium' },
      ],
      tip: 'Pre-emergent must go down before forsythia blooms drop.',
    },
    {
      month: 4, name: 'April', phase: 'active-growth', color: '#4ade80',
      tasks: [
        { text: 'Begin mowing (set height 3–3.5″)', priority: 'high' },
        { text: 'Apply starter fertilizer if overseeding', priority: 'medium' },
        { text: 'Overseed bare spots', priority: 'medium' },
      ],
      tip: 'Never remove more than 1/3 of grass height at once.',
    },
    {
      month: 5, name: 'May', phase: 'active-growth', color: '#4ade80',
      tasks: [
        { text: 'Regular mowing and watering', priority: 'high' },
        { text: 'Spot treat broadleaf weeds', priority: 'medium' },
        { text: 'Apply second round of fertilizer', priority: 'medium' },
      ],
      tip: 'Water deeply (1–1.5″) 2–3 times per week, not daily.',
    },
    {
      month: 6, name: 'June', phase: 'peak-growth', color: '#22c55e',
      tasks: [
        { text: 'Raise mowing height to 3.5–4″', priority: 'high' },
        { text: 'Monitor for grub damage', priority: 'medium' },
        { text: 'Apply grub control if needed', priority: 'low' },
      ],
      tip: 'Taller grass shades soil, retains moisture, and crowds weeds.',
    },
    {
      month: 7, name: 'July', phase: 'summer-stress', color: '#fbbf24',
      tasks: [
        { text: 'Water deeply during dry spells', priority: 'high' },
        { text: 'Avoid fertilizing in heat', priority: 'high' },
        { text: 'Watch for disease (brown patch)', priority: 'medium' },
      ],
      tip: 'Cool-season grass may go dormant — this is normal. Keep watering if you want it green.',
    },
    {
      month: 8, name: 'August', phase: 'summer-stress', color: '#fbbf24',
      tasks: [
        { text: 'Continue deep watering', priority: 'high' },
        { text: 'Plan fall overseeding', priority: 'medium' },
        { text: 'Order seed for fall', priority: 'low' },
      ],
      tip: 'Late August is the time to prepare for fall renovation.',
    },
    {
      month: 9, name: 'September', phase: 'fall-recovery', color: '#86efac',
      tasks: [
        { text: 'Overseed and aerate', priority: 'high' },
        { text: 'Apply starter fertilizer', priority: 'high' },
        { text: 'Lower mowing height back to 3″', priority: 'medium' },
      ],
      tip: 'Fall is the best time to overseed cool-season lawns.',
    },
    {
      month: 10, name: 'October', phase: 'fall-growth', color: '#4ade80',
      tasks: [
        { text: 'Apply winterizer fertilizer', priority: 'high' },
        { text: 'Continue mowing as needed', priority: 'medium' },
        { text: 'Rake leaves regularly', priority: 'medium' },
      ],
      tip: 'Winterizer fertilizer is the most important feeding of the year.',
    },
    {
      month: 11, name: 'November', phase: 'dormancy-prep', color: '#94a3b8',
      tasks: [
        { text: 'Final mowing (lower to 2–2.5″)', priority: 'high' },
        { text: 'Clear all leaves and debris', priority: 'high' },
        { text: 'Winterize irrigation system', priority: 'medium' },
      ],
      tip: 'Shorter final cut prevents snow mold and matting.',
    },
    {
      month: 12, name: 'December', phase: 'dormant', color: '#94a3b8',
      tasks: [
        { text: 'Stay off frozen grass', priority: 'medium' },
        { text: 'Clean and store tools', priority: 'low' },
      ],
      tip: 'Rest and plan — your lawn is sleeping.',
    },
  ];

  const WARM_SEASON = [
    {
      month: 1, name: 'January', phase: 'dormant', color: '#94a3b8',
      tasks: [
        { text: 'Avoid heavy traffic on dormant lawn', priority: 'medium' },
        { text: 'Service equipment', priority: 'low' },
      ],
      tip: 'In frost-prone areas, stay off the lawn on freezing mornings.',
    },
    {
      month: 2, name: 'February', phase: 'late-dormant', color: '#94a3b8',
      tasks: [
        { text: 'Apply pre-emergent for summer weeds', priority: 'high' },
        { text: 'Soil test', priority: 'medium' },
      ],
      tip: 'Pre-emergent timing is critical — apply before soil hits 55°F.',
    },
    {
      month: 3, name: 'March', phase: 'green-up', color: '#86efac',
      tasks: [
        { text: 'Apply spring fertilizer', priority: 'high' },
        { text: 'Begin mowing at recommended height', priority: 'high' },
        { text: 'Spot treat winter weeds', priority: 'medium' },
      ],
      tip: 'Wait until grass is fully green before fertilizing.',
    },
    {
      month: 4, name: 'April', phase: 'active-growth', color: '#4ade80',
      tasks: [
        { text: 'Regular mowing and watering', priority: 'high' },
        { text: 'Apply post-emergent weed control', priority: 'medium' },
        { text: 'Monitor for insects', priority: 'medium' },
      ],
      tip: 'Bermuda: mow at 1–2″. Zoysia: 1–2.5″. St. Augustine: 3–4″.',
    },
    {
      month: 5, name: 'May', phase: 'peak-growth', color: '#22c55e',
      tasks: [
        { text: 'Second fertilizer application', priority: 'high' },
        { text: 'Watch for chinch bugs', priority: 'medium' },
        { text: 'Increase watering frequency', priority: 'medium' },
      ],
      tip: 'Deep, infrequent watering builds deeper roots than daily sprinkling.',
    },
    {
      month: 6, name: 'June', phase: 'peak-growth', color: '#22c55e',
      tasks: [
        { text: 'Continue regular mowing', priority: 'high' },
        { text: 'Apply grub preventer', priority: 'medium' },
        { text: 'Check for disease in humid weather', priority: 'medium' },
      ],
      tip: 'Mow frequently enough to follow the 1/3 rule.',
    },
    {
      month: 7, name: 'July', phase: 'summer-peak', color: '#22c55e',
      tasks: [
        { text: 'Water deeply during dry periods', priority: 'high' },
        { text: 'Apply iron for green-up without excess growth', priority: 'low' },
        { text: 'Monitor for sod webworms', priority: 'medium' },
      ],
      tip: 'Iron sulfate can green up grass without pushing top growth.',
    },
    {
      month: 8, name: 'August', phase: 'summer-peak', color: '#22c55e',
      tasks: [
        { text: 'Continue watering and mowing', priority: 'high' },
        { text: 'Watch for fall armyworms', priority: 'medium' },
        { text: 'Plan for fall renovation if needed', priority: 'low' },
      ],
      tip: 'Late summer is a good time to plug or sprig bare areas.',
    },
    {
      month: 9, name: 'September', phase: 'fall-transition', color: '#86efac',
      tasks: [
        { text: 'Apply fall fertilizer', priority: 'high' },
        { text: 'Overseed with ryegrass if desired (winter color)', priority: 'low' },
        { text: 'Continue mowing', priority: 'medium' },
      ],
      tip: 'Fall fertilizer helps warm-season grass store energy for winter.',
    },
    {
      month: 10, name: 'October', phase: 'slowing', color: '#fbbf24',
      tasks: [
        { text: 'Apply pre-emergent for winter weeds', priority: 'high' },
        { text: 'Reduce watering frequency', priority: 'medium' },
        { text: 'Raise mowing height slightly', priority: 'low' },
      ],
      tip: 'Winter weed pre-emergent is essential — don\'t skip this step.',
    },
    {
      month: 11, name: 'November', phase: 'dormancy-approaching', color: '#94a3b8',
      tasks: [
        { text: 'Final mowing of the season', priority: 'medium' },
        { text: 'Rake leaves and debris', priority: 'medium' },
        { text: 'Reduce watering', priority: 'low' },
      ],
      tip: 'Grass is slowing down — avoid fertilizing with nitrogen now.',
    },
    {
      month: 12, name: 'December', phase: 'dormant', color: '#94a3b8',
      tasks: [
        { text: 'Minimal maintenance needed', priority: 'low' },
        { text: 'Water only if no rain for 3+ weeks', priority: 'medium' },
      ],
      tip: 'Dormant grass still needs occasional water to survive.',
    },
  ];

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

  function renderCalendar(data) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = data.map((m) => {
      const priorityBadge = (p) => {
        const colors = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };
        return `<span class="priority-badge" style="background:${colors[p] || colors.low}">${p}</span>`;
      };
      return `
        <div class="calendar-month" data-phase="${m.phase}">
          <div class="month-header" style="border-top: 3px solid ${m.color}">
            <span class="month-name">${m.name}</span>
          </div>
          <ul class="month-tasks">
            ${m.tasks.map((t) => `<li>${priorityBadge(t.priority)} ${t.text}</li>`).join('')}
          </ul>
          <div class="month-tip">${m.tip}</div>
        </div>`;
    }).join('');
  }

  function setSeason(season) {
    const warmToggle = document.getElementById('cal-season-warm');
    const coolToggle = document.getElementById('cal-season-cool');
    if (season === 'warm') {
      renderCalendar(WARM_SEASON);
      if (warmToggle) warmToggle.classList.add('active');
      if (coolToggle) coolToggle.classList.remove('active');
    } else {
      renderCalendar(COOL_SEASON);
      if (coolToggle) coolToggle.classList.add('active');
      if (warmToggle) warmToggle.classList.remove('active');
    }
  }

  function init() {
    const warmToggle = document.getElementById('cal-season-warm');
    const coolToggle = document.getElementById('cal-season-cool');
    if (warmToggle) warmToggle.addEventListener('click', () => setSeason('warm'));
    if (coolToggle) coolToggle.addEventListener('click', () => setSeason('cool'));

    const detected = detectSeason();
    setSeason(detected);
  }

  TurfApp.onReady(init);

  return { detectSeason, setSeason };
})();
