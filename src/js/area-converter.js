'use strict';

const AreaConverter = (() => {
  const UNITS = {
    sqft: { label: 'sq ft', factor: 1 },
    sqm: { label: 'sq m', factor: 10.76391 },
    sqyd: { label: 'sq yd', factor: 9 },
    sqin: { label: 'sq in', factor: 144 },
    ac: { label: 'acres', factor: 43560 },
    ha: { label: 'hectares', factor: 107639.10417 },
    sqmi: { label: 'sq mi', factor: 27878400 },
    sqcm: { label: 'sq cm', factor: 929.0304 },
  };

  function convert(value, fromUnit, toUnit) {
    if (!value || !Number.isFinite(value) || value < 0) return 0;
    const from = UNITS[fromUnit];
    const to = UNITS[toUnit];
    if (!from || !to) return 0;
    const sqFt = value * from.factor;
    return sqFt / to.factor;
  }

  function renderResult(result, fromUnit, toUnit) {
    const container = document.getElementById('converter-result');
    const labelEl = document.querySelector('.result-label');
    if (!container) return;
    const from = UNITS[fromUnit];
    const to = UNITS[toUnit];
    if (!from || !to) return;
    const fmt = (v) => TurfApp.formatNumber(v, { maximumFractionDigits: 6 });
    container.textContent = `${fmt(result)} ${to.label}`;
    if (labelEl) {
      const factor = from.factor / to.factor;
      labelEl.textContent = `1 ${from.label} = ${fmt(factor)} ${to.label}`;
    }
  }

  function recalculate() {
    const valueInput = document.getElementById('converter-value');
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');
    if (!valueInput || !fromSelect || !toSelect) return;
    const value = parseFloat(valueInput.value) || 0;
    const fromUnit = fromSelect.value;
    const toUnit = toSelect.value;
    const result = convert(value, fromUnit, toUnit);
    renderResult(result, fromUnit, toUnit);
  }

  function initSwapButton() {
    const swapBtn = document.getElementById('converter-swap');
    if (!swapBtn) return;
    swapBtn.addEventListener('click', () => {
      const fromSelect = document.getElementById('converter-from');
      const toSelect = document.getElementById('converter-to');
      if (!fromSelect || !toSelect) return;
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      recalculate();
    });
  }

  function initCopyButton() {
    const copyBtn = document.getElementById('converter-copy');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', () => {
      const container = document.getElementById('converter-result');
      if (!container) return;
      TurfApp.copyToClipboard(container.textContent).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = original; }, 1500);
      });
    });
  }

  function initInputListeners() {
    const valueInput = document.getElementById('converter-value');
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');
    if (valueInput) valueInput.addEventListener('input', recalculate);
    if (fromSelect) fromSelect.addEventListener('change', recalculate);
    if (toSelect) toSelect.addEventListener('change', recalculate);
  }

  function initSubPageMode() {
    const metaFrom = document.querySelector('meta[name="conv-from-unit"]');
    const metaTo = document.querySelector('meta[name="conv-to-unit"]');
    if (!metaFrom && !metaTo) return;
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');
    if (metaFrom?.content && fromSelect) fromSelect.value = metaFrom.content;
    if (metaTo?.content && toSelect) toSelect.value = metaTo.content;

    const fromAttr = document.querySelector('[data-conv-from-unit]');
    const toAttr = document.querySelector('[data-conv-to-unit]');
    if (fromAttr?.dataset.convFromUnit && fromSelect) fromSelect.value = fromAttr.dataset.convFromUnit;
    if (toAttr?.dataset.convToUnit && toSelect) toSelect.value = toAttr.dataset.convToUnit;
  }

  function init() {
    initInputListeners();
    initSwapButton();
    initCopyButton();
    initSubPageMode();
    recalculate();
  }

  TurfApp.onReady(init);

  return { convert, recalculate };
})();
