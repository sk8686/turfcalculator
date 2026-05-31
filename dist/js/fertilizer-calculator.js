'use strict';

const FertilizerCalculator = (() => {
  const FERT_TYPES = {
    maintenance: { nRate: 1.0, npk: '30-0-4', nPercent: 0.30, label: 'Regular' },
    starter: { nRate: 1.25, npk: '18-24-12', nPercent: 0.18, label: 'Starter' },
    winterizer: { nRate: 1.0, npk: '22-3-14', nPercent: 0.22, label: 'Winterizer' },
  };

  let currentType = 'maintenance';

  function t(key, fallback) {
    const parts = key.split('.');
    let val = window.I18N;
    for (const p of parts) { val = val?.[p]; }
    return (val !== undefined && val !== null) ? val : fallback;
  }

  function calculate(area) {
    if (!area || area <= 0 || !Number.isFinite(area)) {
      return { productLbs: 0, bags15: 0, bags30: 0, npk: '', nRate: 0 };
    }
    const fert = FERT_TYPES[currentType];
    const nNeeded = fert.nRate * (area / 1000);
    const productLbs = nNeeded / fert.nPercent;
    const bags15 = Math.ceil(productLbs / 15);
    const bags30 = Math.ceil(productLbs / 30);
    return { productLbs, bags15, bags30, npk: fert.npk, nRate: fert.nRate };
  }

  function getTimingAdvice() {
    switch (currentType) {
      case 'starter': return t('fertilizer_calculator.timing_starter', 'Apply when establishing new grass or overseeding. Best in early spring or fall.');
      case 'winterizer': return t('fertilizer_calculator.timing_winter', 'Apply in late fall (October–November) before first freeze to prepare roots for winter.');
      default: return t('fertilizer_calculator.timing_maintenance', 'Apply during active growing season. Cool-season: spring & fall. Warm-season: late spring through summer.');
    }
  }

  function renderResults(result) {
    const container = document.getElementById('fertilizer-results');
    if (!container) return;
    if (result.productLbs <= 0) {
      container.innerHTML = '';
      return;
    }
    const fmt = (v) => TurfApp.formatNumber(v);
    container.innerHTML = `
      <div class="result-card">
        <div class="result-label">${t('fertilizer_calculator.results_fertilizer_needed', 'Fertilizer Needed')} (${result.npk})</div>
        <div class="result-value">${fmt(result.productLbs)} ${t('common.lbs', 'lbs')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('fert_calc.bags_15lb', '15 lb Bags')}</div>
        <div class="result-value">${fmt(result.bags15, { maximumFractionDigits: 0 })}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('fert_calc.bags_30lb', '30 lb Bags')}</div>
        <div class="result-value">${fmt(result.bags30, { maximumFractionDigits: 0 })}</div>
      </div>
      <div class="result-card result-card-info">
        <div class="result-label">${t('fertilizer_calculator.results_when_to_apply', 'When to Apply')}</div>
        <div class="result-value">${getTimingAdvice()}</div>
      </div>
    `;
  }

  function recalculate() {
    const areaInput = document.getElementById('fertilizer-area');
    if (!areaInput) return;
    const area = parseFloat(areaInput.value) || 0;
    const result = calculate(area);
    renderResults(result);
  }

  function initFertTypeButtons() {
    const buttons = document.querySelectorAll('[data-fert-type]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentType = btn.dataset.fertType;
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        recalculate();
      });
    });
  }

  function initInputListeners() {
    const areaInput = document.getElementById('fertilizer-area');
    if (areaInput) areaInput.addEventListener('input', recalculate);
  }

  function handleUrlParams() {
    const params = TurfApp.getUrlParams();
    const area = params.get('area');
    const unit = params.get('unit');
    if (area && (unit === 'sqft' || !unit)) {
      const areaInput = document.getElementById('fertilizer-area');
      if (areaInput) areaInput.value = area;
    }
  }

  function init() {
    initInputListeners();
    initFertTypeButtons();
    handleUrlParams();
    recalculate();
  }

  TurfApp.onReady(init);

  return { calculate, recalculate };
})();
