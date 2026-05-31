const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

const checks = {
  sodCalculator: {
    file: path.join(distDir, 'en', 'sod-calculator.html'),
    requiredIds: ['sod-calculator-form', 'sod-length', 'sod-width', 'sod-results',
      'sod-advanced-toggle', 'sod-advanced-panel', 'sod-shape-selector',
      'sod-shape-rectangle', 'sod-shape-circle', 'sod-shape-triangle', 'sod-shape-l-shape',
      'sod-radius', 'sod-base', 'sod-height', 'sod-l-length', 'sod-l-width', 'sod-l-extension', 'sod-l-ext-width'],
    requiredDataAttrs: ['data-roll-size', 'data-waste-factor'],
    requiredJs: 'sod-calculator.js'
  },
  areaCalculator: {
    file: path.join(distDir, 'en', 'lawn-area-calculator.html'),
    requiredIds: ['area-calculator-form', 'area-zones', 'area-results', 'add-zone-btn', 'subtract-zone-btn'],
    requiredJs: 'area-calculator.js'
  },
  grassGuide: {
    file: path.join(distDir, 'en', 'grass-type-guide.html'),
    requiredIds: ['season-warm', 'season-cool'],
    requiredClasses: ['grass-card'],
    requiredJs: 'grass-guide.js'
  },
  seedCalculator: {
    file: path.join(distDir, 'en', 'grass-seed-calculator.html'),
    requiredIds: ['seed-results', 'seed-area', 'seed-grass-select'],
    requiredDataAttrs: ['data-seeding-type'],
    requiredJs: 'grass-seed-calculator.js'
  },
  fertilizerCalculator: {
    file: path.join(distDir, 'en', 'fertilizer-calculator.html'),
    requiredIds: ['fertilizer-results', 'fertilizer-area'],
    requiredDataAttrs: ['data-fert-type'],
    requiredJs: 'fertilizer-calculator.js'
  },
  waterCalculator: {
    file: path.join(distDir, 'en', 'lawn-water-calculator.html'),
    requiredIds: ['water-results', 'water-area', 'water-grass-select'],
    requiredJs: 'lawn-water-calculator.js'
  },
  soilCalculator: {
    file: path.join(distDir, 'en', 'soil-calculator.html'),
    requiredIds: ['soil-results', 'soil-area', 'soil-depth'],
    requiredJs: 'soil-calculator.js'
  },
  areaConverter: {
    file: path.join(distDir, 'en', 'area-converter.html'),
    requiredIds: ['converter-value', 'converter-from', 'converter-to', 'converter-result', 'converter-swap', 'converter-copy'],
    requiredJs: 'area-converter.js'
  },
  calendar: {
    file: path.join(distDir, 'en', 'lawn-care-calendar.html'),
    requiredIds: ['calendar-grid', 'cal-season-warm', 'cal-season-cool'],
    requiredJs: 'lawn-calendar.js'
  },
  index: {
    file: path.join(distDir, 'en', 'index.html'),
    requiredIds: ['sod-calculator-form', 'sod-length', 'sod-width', 'sod-results'],
    requiredJs: 'sod-calculator.js'
  }
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

for (const [name, config] of Object.entries(checks)) {
  const content = fs.readFileSync(config.file, 'utf8');
  let pagePassed = true;

  console.log(`\n=== ${name} ===`);

  if (config.requiredIds) {
    for (const id of config.requiredIds) {
      totalChecks++;
      if (content.includes(`id="${id}"`)) {
        passedChecks++;
        console.log(`  ✓ id="${id}"`);
      } else {
        failedChecks++;
        pagePassed = false;
        console.log(`  ✗ id="${id}" MISSING`);
      }
    }
  }

  if (config.requiredDataAttrs) {
    for (const attr of config.requiredDataAttrs) {
      totalChecks++;
      if (content.includes(attr)) {
        passedChecks++;
        console.log(`  ✓ ${attr}`);
      } else {
        failedChecks++;
        pagePassed = false;
        console.log(`  ✗ ${attr} MISSING`);
      }
    }
  }

  if (config.requiredClasses) {
    for (const cls of config.requiredClasses) {
      totalChecks++;
      if (content.includes(`class="${cls}"`) || content.includes(`class="`) && content.includes(cls)) {
        passedChecks++;
        console.log(`  ✓ class="${cls}"`);
      } else {
        failedChecks++;
        pagePassed = false;
        console.log(`  ✗ class="${cls}" MISSING`);
      }
    }
  }

  if (config.requiredJs) {
    totalChecks++;
    if (content.includes(config.requiredJs)) {
      passedChecks++;
      console.log(`  ✓ JS: ${config.requiredJs}`);
    } else {
      failedChecks++;
      pagePassed = false;
      console.log(`  ✗ JS: ${config.requiredJs} MISSING`);
    }
  }

  if (pagePassed) {
    console.log(`  ✅ ALL CHECKS PASSED`);
  } else {
    console.log(`  ❌ SOME CHECKS FAILED`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Total: ${totalChecks}, Passed: ${passedChecks}, Failed: ${failedChecks}`);
