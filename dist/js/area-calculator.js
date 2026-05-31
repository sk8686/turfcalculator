'use strict';

const AreaCalculator = (() => {
  let zoneCounter = 0;

  function t(key, fallback) {
    const parts = key.split('.');
    let val = window.I18N;
    for (const p of parts) { val = val?.[p]; }
    return (val !== undefined && val !== null) ? val : fallback;
  }

  function createZoneHTML(id, isSubtract = false) {
    const prefix = isSubtract ? 'subtract' : 'add';
    return `
      <div class="zone-row" data-zone-id="${id}" data-zone-type="${prefix}">
        <div class="zone-header">
          <span class="zone-label">${isSubtract ? '− ' + t('area_calc.subtract', 'Subtract') : '+ ' + t('area_calc.add_area', 'Area')} ${zoneCounter}</span>
          <button type="button" class="zone-remove-btn" data-remove-zone="${id}">&times;</button>
        </div>
        <div class="zone-fields">
          <select name="zone-shape-${id}" class="zone-shape-select" data-zone-id="${id}">
            <option value="rectangle">${t('area_calc.shape_rectangle', 'Rectangle')}</option>
            <option value="circle">${t('area_calc.shape_circle', 'Circle')}</option>
            <option value="triangle">${t('area_calc.shape_triangle', 'Triangle')}</option>
          </select>
          <div class="zone-dims zone-dims-rectangle" data-zone-dims="${id}">
            <input type="number" name="zone-length-${id}" placeholder="${t('area_calc.length_ft', 'Length (ft)')}" min="0" step="any">
            <input type="number" name="zone-width-${id}" placeholder="${t('area_calc.width_ft', 'Width (ft)')}" min="0" step="any">
          </div>
          <div class="zone-dims zone-dims-circle" data-zone-dims="${id}" hidden>
            <input type="number" name="zone-radius-${id}" placeholder="${t('area_calc.radius_ft', 'Radius (ft)')}" min="0" step="any">
          </div>
          <div class="zone-dims zone-dims-triangle" data-zone-dims="${id}" hidden>
            <input type="number" name="zone-base-${id}" placeholder="${t('area_calc.base_ft', 'Base (ft)')}" min="0" step="any">
            <input type="number" name="zone-height-${id}" placeholder="${t('area_calc.height_ft', 'Height (ft)')}" min="0" step="any">
          </div>
        </div>
      </div>`;
  }

  function addZone(isSubtract = false) {
    zoneCounter++;
    const id = zoneCounter;
    const container = document.getElementById('area-zones');
    if (!container) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = createZoneHTML(id, isSubtract).trim();
    const zoneEl = wrapper.firstElementChild;
    container.appendChild(zoneEl);
    zoneEl.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener('input', recalculate);
    });
    zoneEl.querySelector('.zone-shape-select').addEventListener('change', (e) => {
      updateZoneShape(id, e.target.value);
    });
    recalculate();
  }

  function removeZone(id) {
    const zone = document.querySelector(`[data-zone-id="${id}"]`);
    if (zone) {
      zone.remove();
      recalculate();
    }
  }

  function updateZoneShape(zoneId, shape) {
    const allDims = document.querySelectorAll(`[data-zone-dims="${zoneId}"]`);
    allDims.forEach((el) => { el.hidden = true; });
    const active = document.querySelector(`.zone-dims-${shape}[data-zone-dims="${zoneId}"]`);
    if (active) active.hidden = false;
  }

  function getZoneArea(zoneEl) {
    const shape = zoneEl.querySelector('.zone-shape-select')?.value || 'rectangle';
    const getVal = (name) => {
      const input = zoneEl.querySelector(`input[name="${name}"]`);
      return input ? (parseFloat(input.value) || 0) : 0;
    };
    const zoneId = zoneEl.dataset.zoneId;
    switch (shape) {
      case 'rectangle': {
        const l = getVal(`zone-length-${zoneId}`);
        const w = getVal(`zone-width-${zoneId}`);
        return Math.max(0, l * w);
      }
      case 'circle': {
        const r = getVal(`zone-radius-${zoneId}`);
        return Math.max(0, Math.PI * r * r);
      }
      case 'triangle': {
        const b = getVal(`zone-base-${zoneId}`);
        const h = getVal(`zone-height-${zoneId}`);
        return Math.max(0, 0.5 * b * h);
      }
      default: return 0;
    }
  }

  function recalculate() {
    let totalAdd = 0;
    let totalSubtract = 0;
    document.querySelectorAll('.zone-row').forEach((zone) => {
      const type = zone.dataset.zoneType;
      const area = getZoneArea(zone);
      if (type === 'subtract') {
        totalSubtract += area;
      } else {
        totalAdd += area;
      }
    });
    const totalSqFt = Math.max(0, totalAdd - totalSubtract);
    renderResults(totalSqFt);
  }

  function renderResults(totalSqFt) {
    const container = document.getElementById('area-results');
    if (!container) return;
    const fmt = (v) => TurfApp.formatNumber(v);
    const sqM = totalSqFt / 10.76391;
    const sqYd = totalSqFt / 9;
    const acres = totalSqFt / 43560;
    container.innerHTML = `
      <div class="result-card">
        <div class="result-label">${t('area_calc.square_feet', 'Square Feet')}</div>
        <div class="result-value">${fmt(totalSqFt)} ${t('common.unit_sqft', 'sq ft')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('area_calc.square_meters', 'Square Meters')}</div>
        <div class="result-value">${fmt(sqM)} ${t('common.unit_sqm', 'sq m')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('area_calc.square_yards', 'Square Yards')}</div>
        <div class="result-value">${fmt(sqYd)} ${t('common.unit_sqyd', 'sq yd')}</div>
      </div>
      <div class="result-card">
        <div class="result-label">${t('area_calc.acres', 'Acres')}</div>
        <div class="result-value">${fmt(acres, { maximumFractionDigits: 4 })} ${t('common.unit_ac', 'ac')}</div>
      </div>
      <a href="${container.dataset.sodCalcUrl || '/sod-calculator'}?area=${encodeURIComponent(totalSqFt)}&unit=sqft" class="send-to-sod-btn">${t('area_calc.send_to_sod', 'Send to Sod Calculator →')}</a>
    `;
  }

  function init() {
    const addBtn = document.getElementById('add-zone-btn');
    const subtractBtn = document.getElementById('subtract-zone-btn');
    if (addBtn) addBtn.addEventListener('click', () => addZone(false));
    if (subtractBtn) subtractBtn.addEventListener('click', () => addZone(true));

    document.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-zone]');
      if (removeBtn) removeZone(removeBtn.dataset.removeZone);
    });

    const defaultInputs = document.querySelectorAll('#area-calculator-form input[type="number"]');
    defaultInputs.forEach((input) => input.addEventListener('input', recalculate));

    recalculate();
  }

  TurfApp.onReady(init);

  return { addZone, removeZone, recalculate };
})();
