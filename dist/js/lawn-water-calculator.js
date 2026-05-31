'use strict';

const LawnWaterCalculator = (() => {
  const WATER_NEEDS = {
    kentucky_bluegrass: 1.25,
    tall_fescue: 1.25,
    perennial_ryegrass: 1.25,
    fine_fescue: 0.875,
    bermudagrass: 0.875,
    zoysia: 0.875,
    st_augustine: 0.875,
    centipede: 0.625,
    bahiagrass: 0.625,
    sun_shade_mix: 1.0,
  };

  const INCHES_PER_SQFT_TO_GALLONS = 0.623;
  const SPRINKLER_RATE_IN_PER_HR = 1.5;

  function t(key, fallback) {
    const parts = key.split('.');
    let val = window.I18N;
    for (const p of parts) { val = val?.[p]; }
    return (val !== undefined && val !== null) ? val : fallback;
  }

  function calculate(area, grassType) {
    if (!area || area <= 0 || !Number.isFinite(area)) {
      return { gallonsPerWeek: 0, inchesPerWeek: 0, minutesPerSession: 0, sessionsPerWeek: 0 };
    }
    const inchesPerWeek = WATER_NEEDS[grassType];
    if (inchesPerWeek === undefined) {
      return { gallonsPerWeek: 0, inchesPerWeek: 0, minutesPerSession: 0, sessionsPerWeek: 0 };
    }
    const gallonsPerWeek = inchesPerWeek * area * INCHES_PER_SQFT_TO_GALLONS;
    const sessionsPerWeek = inchesPerWeek >= 1.0 ? 3 : 2;
    const inchesPerSession = inchesPerWeek / sessionsPerWeek;
    const minutesPerSession = Math.round((inchesPerSession / SPRINKLER_RATE_IN_PER_HR) * 60);
    return { gallonsPerWeek, inchesPerWeek, minutesPerSession, sessionsPerWeek };
  }

  function renderResults(result) {
    const container = document.getElementById('water-results');
    if (!container) return;
    if (result.gallonsPerWeek <= 0) {
      container.innerHTML = '';
      return;
    }
    const fmt = (v) => TurfApp.formatNumber(v);
    container.innerHTML = `
      <div class="result-card">
        <div class="result-label">${t('lawn_water_calculator.results_weekly_water', 'Weekly Water Need')}</div>
        <div class="result-value">${fmt(result.inchesPerWeek)} ${t('common.unit_in', 'inches')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('lawn_water_calculator.results_gallons_per_week', 'Gallons Per Week')}</div>
        <div class="result-value">${fmt(result.gallonsPerWeek)} ${t('common.gallons', 'gallons')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('lawn_water_calculator.results_minutes_per_session', 'Minutes Per Session')}</div>
        <div class="result-value">${fmt(result.minutesPerSession, { maximumFractionDigits: 0 })} ${t('common.minutes', 'minutes')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('lawn_water_calculator.results_sessions_per_week', 'Sessions Per Week')}</div>
        <div class="result-value">${fmt(result.sessionsPerWeek, { maximumFractionDigits: 0 })}</div>
      </div>
    `;
  }

  function recalculate() {
    const areaInput = document.getElementById('water-area');
    const grassSelect = document.getElementById('water-grass-select');
    if (!areaInput || !grassSelect) return;
    const area = parseFloat(areaInput.value) || 0;
    const grassType = grassSelect.value;
    const result = calculate(area, grassType);
    renderResults(result);
  }

  function initInputListeners() {
    const areaInput = document.getElementById('water-area');
    const grassSelect = document.getElementById('water-grass-select');
    if (areaInput) areaInput.addEventListener('input', recalculate);
    if (grassSelect) grassSelect.addEventListener('change', recalculate);
  }

  function handleUrlParams() {
    const params = TurfApp.getUrlParams();
    const area = params.get('area');
    const unit = params.get('unit');
    const grass = params.get('grass');
    if (area && (unit === 'sqft' || !unit)) {
      const areaInput = document.getElementById('water-area');
      if (areaInput) areaInput.value = area;
    }
    if (grass) {
      const grassSelect = document.getElementById('water-grass-select');
      if (grassSelect) grassSelect.value = grass.replace(/-/g, '_');
    }
  }

  function init() {
    initInputListeners();
    handleUrlParams();
    recalculate();
  }

  TurfApp.onReady(init);

  return { calculate, recalculate };
})();
