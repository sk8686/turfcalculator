'use strict';

const SoilCalculator = (() => {
  const CUFT_PER_CUYD = 27;
  const CUM_PER_CUYD = 0.7646;
  const LITERS_PER_CUYD = 764.6;

  function t(key, fallback) {
    const parts = key.split('.');
    let val = window.I18N;
    for (const p of parts) { val = val?.[p]; }
    return (val !== undefined && val !== null) ? val : fallback;
  }

  function calculate(area, depth) {
    if (!area || area <= 0 || !Number.isFinite(area) || !depth || depth <= 0 || !Number.isFinite(depth)) {
      return { cubicYards: 0, cubicFeet: 0, cubicMeters: 0, liters: 0, bags075: 0, bags1: 0, bags15: 0 };
    }
    const cubicYards = (area * depth) / 324;
    const cubicFeet = cubicYards * CUFT_PER_CUYD;
    const cubicMeters = cubicYards * CUM_PER_CUYD;
    const liters = cubicYards * LITERS_PER_CUYD;
    const bags075 = Math.ceil(cubicFeet / 0.75);
    const bags1 = Math.ceil(cubicFeet / 1);
    const bags15 = Math.ceil(cubicFeet / 1.5);
    return { cubicYards, cubicFeet, cubicMeters, liters, bags075, bags1, bags15 };
  }

  function renderResults(result) {
    const container = document.getElementById('soil-results');
    if (!container) return;
    if (result.cubicYards <= 0) {
      container.innerHTML = '';
      return;
    }
    const fmt = (v, digits = 2) => TurfApp.formatNumber(v, { maximumFractionDigits: digits });
    container.innerHTML = `
      <div class="result-card">
        <div class="result-label">${t('soil_calc.results_cubic_yards', 'Cubic Yards')}</div>
        <div class="result-value">${fmt(result.cubicYards)} ${t('common.cu_yd', 'cu yd')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('soil_calculator.results_cubic_feet', 'Cubic Feet')}</div>
        <div class="result-value">${fmt(result.cubicFeet)} ${t('common.cu_ft', 'cu ft')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('soil_calculator.results_cubic_meters', 'Cubic Meters')}</div>
        <div class="result-value">${fmt(result.cubicMeters)} ${t('common.cu_m', 'cu m')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('soil_calc.liters', 'Liters')}</div>
        <div class="result-value">${fmt(result.liters, 0)} ${t('common.unit_l', 'L')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('soil_calc.bags_075cuft', '0.75 cu ft Bags')}</div>
        <div class="result-value">${fmt(result.bags075, 0)}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('soil_calc.bags_1cuft', '1 cu ft Bags')}</div>
        <div class="result-value">${fmt(result.bags1, 0)}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('soil_calc.bags_15cuft', '1.5 cu ft Bags')}</div>
        <div class="result-value">${fmt(result.bags15, 0)}</div>
      </div>
    `;
  }

  function recalculate() {
    const areaInput = document.getElementById('soil-area');
    const depthInput = document.getElementById('soil-depth');
    if (!areaInput || !depthInput) return;
    const area = parseFloat(areaInput.value) || 0;
    const depth = parseFloat(depthInput.value) || 0;
    const result = calculate(area, depth);
    renderResults(result);
  }

  function initInputListeners() {
    const areaInput = document.getElementById('soil-area');
    const depthInput = document.getElementById('soil-depth');
    if (areaInput) areaInput.addEventListener('input', recalculate);
    if (depthInput) depthInput.addEventListener('input', recalculate);
  }

  function handleUrlParams() {
    const params = TurfApp.getUrlParams();
    const area = params.get('area');
    const unit = params.get('unit');
    if (area && (unit === 'sqft' || !unit)) {
      const areaInput = document.getElementById('soil-area');
      if (areaInput) areaInput.value = area;
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
