'use strict';

const GrassSeedCalculator = (() => {
  const SEED_RATES = {
    kentucky_bluegrass: { new: 2.5, overseeding: 1.25 },
    tall_fescue: { new: 7, overseeding: 3.5 },
    perennial_ryegrass: { new: 6, overseeding: 3 },
    fine_fescue: { new: 4.5, overseeding: 2.25 },
    bermudagrass: { new: 2.5, overseeding: 1.25 },
    zoysia: { new: 1.5, overseeding: 0.75 },
    bahiagrass: { new: 5.5, overseeding: 2.75 },
    centipede: { new: 0.75, overseeding: 0.375 },
    st_augustine: { new: null, overseeding: null },
    sun_shade_mix: { new: 5.5, overseeding: 2.75 },
  };

  let seedingType = 'new_lawn';

  function t(key, fallback) {
    const parts = key.split('.');
    let val = window.I18N;
    for (const p of parts) { val = val?.[p]; }
    return (val !== undefined && val !== null) ? val : fallback;
  }

  function calculate(area, grassType) {
    if (!area || area <= 0 || !Number.isFinite(area)) {
      return { seedLbs: 0, bagSize: 0, bags: 0, isSodOnly: false };
    }
    const rates = SEED_RATES[grassType];
    if (!rates) return { seedLbs: 0, bagSize: 0, bags: 0, isSodOnly: false };
    if (rates.new === null) return { seedLbs: 0, bagSize: 0, bags: 0, isSodOnly: true };

    const rate = seedingType === 'overseed' ? rates.overseeding : rates.new;
    const seedLbs = (rate * area) / 1000;
    const bagSize = seedLbs <= 25 ? 5 : 20;
    const bags = Math.ceil(seedLbs / bagSize);

    return { seedLbs, bagSize, bags, isSodOnly: false };
  }

  function renderResults(result) {
    const container = document.getElementById('seed-results');
    if (!container) return;

    if (result.isSodOnly) {
      container.innerHTML = `
        <div class="result-card result-card-info">
          <div class="result-label">${t('grass_seed_calculator.st_augustine', 'St. Augustine Grass')}</div>
          <div class="result-value">${t('grass_seed_calculator.sod_only_msg', 'Typically planted as sod only — seed is not commonly available.')}</div>
        </div>`;
      return;
    }

    if (result.seedLbs <= 0) {
      container.innerHTML = '';
      return;
    }

    const fmt = (v) => TurfApp.formatNumber(v);
    container.innerHTML = `
      <div class="result-card">
        <div class="result-label">${t('grass_seed_calculator.results_seed_needed', 'Seed Needed')}</div>
        <div class="result-value">${fmt(result.seedLbs)} ${t('common.lbs', 'lbs')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('grass_seed_calculator.results_bags', 'Bags Needed')} (${result.bagSize} ${t('grass_seed_calculator.lb_bags', 'lb bags')})</div>
        <div class="result-value">${fmt(result.bags, { maximumFractionDigits: 0 })}</div>
      </div>
    `;
  }

  function recalculate() {
    const areaInput = document.getElementById('seed-area');
    const grassSelect = document.getElementById('seed-grass-select');
    if (!areaInput || !grassSelect) return;

    const area = parseFloat(areaInput.value) || 0;
    const grassType = grassSelect.value;
    const result = calculate(area, grassType);
    renderResults(result);
  }

  function initSeedingTypeToggle() {
    const buttons = document.querySelectorAll('[data-seeding-type]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        seedingType = btn.dataset.seedingType;
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        recalculate();
      });
    });
  }

  function initInputListeners() {
    const areaInput = document.getElementById('seed-area');
    const grassSelect = document.getElementById('seed-grass-select');
    if (areaInput) areaInput.addEventListener('input', recalculate);
    if (grassSelect) grassSelect.addEventListener('change', recalculate);
  }

  function handleUrlParams() {
    const params = TurfApp.getUrlParams();
    const area = params.get('area');
    const unit = params.get('unit');
    const grass = params.get('grass');
    if (area && (unit === 'sqft' || !unit)) {
      const areaInput = document.getElementById('seed-area');
      if (areaInput) areaInput.value = area;
    }
    if (grass) {
      const grassSelect = document.getElementById('seed-grass-select');
      if (grassSelect) grassSelect.value = grass.replace(/-/g, '_');
    }
  }

  function init() {
    initInputListeners();
    initSeedingTypeToggle();
    handleUrlParams();
    recalculate();
  }

  TurfApp.onReady(init);

  return { calculate, recalculate };
})();
