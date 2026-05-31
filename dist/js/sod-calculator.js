'use strict';

const SodCalculator = (() => {
  const ROLL_SIZES = {
    standard: { labelKey: 'sod_calc.roll_standard_short', sqFt: 10 },
    mini: { labelKey: 'sod_calc.roll_mini_short', sqFt: 5 },
    large: { labelKey: 'sod_calc.roll_large_short', sqFt: 25 },
  };
  const WASTE_FACTORS = [5, 10, 15];
  const DEFAULT_WASTE = 10;
  const DEFAULT_ROLL = 'standard';
  const PALLET_SQFT = 500;

  let currentShape = 'rectangle';
  let currentRoll = DEFAULT_ROLL;
  let currentWaste = DEFAULT_WASTE;

  function getInputs() {
    const length = parseFloat(document.getElementById('sod-length')?.value) || 0;
    const width = parseFloat(document.getElementById('sod-width')?.value) || 0;
    const radius = parseFloat(document.getElementById('sod-radius')?.value) || 0;
    const base = parseFloat(document.getElementById('sod-base')?.value) || 0;
    const height = parseFloat(document.getElementById('sod-height')?.value) || 0;
    const lLength = parseFloat(document.getElementById('sod-l-length')?.value) || 0;
    const lWidth = parseFloat(document.getElementById('sod-l-width')?.value) || 0;
    const lExtension = parseFloat(document.getElementById('sod-l-extension')?.value) || 0;
    const lExtWidth = parseFloat(document.getElementById('sod-l-ext-width')?.value) || 0;
    return { length, width, radius, base, height, lLength, lWidth, lExtension, lExtWidth };
  }

  function calculateArea(shape, dims) {
    switch (shape) {
      case 'rectangle':
        return Math.max(0, dims.length * dims.width);
      case 'circle':
        return Math.max(0, Math.PI * dims.radius * dims.radius);
      case 'triangle':
        return Math.max(0, 0.5 * dims.base * dims.height);
      case 'l-shape':
        return Math.max(0, (dims.lLength * dims.lWidth) + (dims.lExtension * dims.lExtWidth));
      default:
        return 0;
    }
  }

  function calculate(area) {
    if (!area || area <= 0 || !Number.isFinite(area)) {
      return { area: 0, areaWithWaste: 0, rolls: 0, pallets: 0 };
    }
    const wasteMultiplier = 1 + currentWaste / 100;
    const areaWithWaste = area * wasteMultiplier;
    const rollSqFt = ROLL_SIZES[currentRoll].sqFt;
    const rolls = Math.ceil(Math.round(areaWithWaste / rollSqFt * 1000) / 1000);
    const pallets = Math.ceil(Math.round(areaWithWaste / PALLET_SQFT * 1000) / 1000);
    return { area, areaWithWaste, rolls, pallets };
  }

  function t(key, fallback) {
    const parts = key.split('.');
    let val = window.I18N;
    for (const p of parts) { val = val?.[p]; }
    return (val !== undefined && val !== null) ? val : fallback;
  }

  function renderResults(result) {
    const container = document.getElementById('sod-results');
    if (!container) return;
    if (result.area <= 0) {
      container.innerHTML = '';
      return;
    }
    const fmt = (v) => TurfApp.formatNumber(v);
    const sqFt = t('common.unit_sqft', 'sq ft');
    const totalAreaLabel = t('sod_calc.total_area_label', 'Total Area');
    const wasteLabel = t('sod_calc.area_with_waste', 'Area with {waste}% Waste').replace('{waste}', currentWaste);
    const rollFallbacks = { standard: 'Standard Roll', mini: 'Mini Roll', large: 'Large Roll' };
    const rollsLabel = t('sod_calc.rolls_needed_roll', 'Rolls Needed ({roll})').replace('{roll}', t(ROLL_SIZES[currentRoll].labelKey, rollFallbacks[currentRoll]));
    const palletsLabel = t('sod_calculator.pallets_needed', 'Pallets Needed');
    const costLabel = t('sod_calculator.estimated_cost', 'Estimated Cost');
    const priceLabel = t('sod_calc.price_per_sqft', 'Price per sq ft');
    const costHelp = t('sod_calc.cost_help', 'Enter your local price per sq ft to estimate total cost.');
    container.innerHTML = `
      <div class="result-card result-card--main">
        <div class="result-label">${totalAreaLabel}</div>
        <div class="result-value">${fmt(result.area)} ${sqFt}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${wasteLabel}</div>
        <div class="result-value">${fmt(result.areaWithWaste)} ${sqFt}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${rollsLabel}</div>
        <div class="result-value">${fmt(result.rolls, { maximumFractionDigits: 0 })}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${palletsLabel}</div>
        <div class="result-value">${fmt(result.pallets, { maximumFractionDigits: 0 })}</div>
      </div>
      <div class="cost-estimator">
        <div class="section-label">${costLabel}</div>
        <div class="cost-estimator__row">
          <div class="field-group">
            <label for="sod-price">${priceLabel}</label>
            <div class="input-wrapper">
              <span class="unit-suffix unit-suffix--prefix">$</span>
              <input id="sod-price" type="number" step="0.01" placeholder="0.00">
            </div>
          </div>
          <div class="cost-estimator__total" id="sod-cost-display">—</div>
        </div>
        <div class="cost-estimator__help">${costHelp}</div>
      </div>
    `;
    const priceInput = document.getElementById('sod-price');
    if (priceInput) {
      priceInput.addEventListener('input', () => {
        const price = parseFloat(priceInput.value) || 0;
        const display = document.getElementById('sod-cost-display');
        if (display) {
          if (price > 0) {
            const total = price * result.areaWithWaste;
            display.textContent = TurfApp.formatCurrency(total);
          } else {
            display.textContent = '—';
          }
        }
      });
    }
  }

  function updateShapeInputs() {
    const shapes = document.querySelectorAll('.sod-shape-inputs');
    shapes.forEach((el) => el.hidden = true);
    const active = document.getElementById(`sod-shape-${currentShape}`);
    if (active) active.hidden = false;
  }

  function recalculate() {
    const dims = getInputs();
    const area = calculateArea(currentShape, dims);
    const result = calculate(area);
    renderResults(result);
  }

  function initAdvancedToggle() {
    const toggle = document.getElementById('sod-advanced-toggle');
    const panel = document.getElementById('sod-advanced-panel');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => {
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggle.classList.toggle('open', !isOpen);
    });
  }

  function initShapeSelector() {
    const selector = document.getElementById('sod-shape-selector');
    if (!selector) return;
    selector.addEventListener('change', (e) => {
      currentShape = e.target.value;
      updateShapeInputs();
      recalculate();
    });
  }

  function initRollSizeSelector() {
    const buttons = document.querySelectorAll('[data-roll-size]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentRoll = btn.dataset.rollSize;
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        recalculate();
      });
    });
  }

  function initWasteFactorButtons() {
    const buttons = document.querySelectorAll('[data-waste-factor]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentWaste = parseInt(btn.dataset.wasteFactor, 10);
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        recalculate();
      });
    });
  }

  function initInputListeners() {
    const inputs = document.querySelectorAll('#sod-calculator-form input[type="number"]');
    inputs.forEach((input) => {
      input.addEventListener('input', recalculate);
    });
  }

  function handleUrlParams() {
    const params = TurfApp.getUrlParams();
    const area = params.get('area');
    const unit = params.get('unit');
    if (area && unit === 'sqft') {
      const areaVal = parseFloat(area);
      if (areaVal > 0 && Number.isFinite(areaVal)) {
        const lengthInput = document.getElementById('sod-length');
        const widthInput = document.getElementById('sod-width');
        if (lengthInput && widthInput) {
          const side = Math.sqrt(areaVal);
        const rounded = Math.round(side * 10000) / 10000;
        lengthInput.value = rounded;
        widthInput.value = rounded;
        }
        recalculate();
      }
    }
    const grass = params.get('grass');
    if (grass) {
      const grassSelect = document.querySelector('[name="grass"], #grass-select');
      if (grassSelect) grassSelect.value = grass.replace(/-/g, '_');
    }
  }

  function init() {
    initInputListeners();
    initAdvancedToggle();
    initShapeSelector();
    initRollSizeSelector();
    initWasteFactorButtons();
    updateShapeInputs();
    handleUrlParams();
    recalculate();
  }

  TurfApp.onReady(init);

  return { calculate, recalculate };
})();
