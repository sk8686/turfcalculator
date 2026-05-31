const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const langs = fs.readdirSync(distDir).filter(f => {
  return fs.statSync(path.join(distDir, f)).isDirectory() && f !== 'css' && f !== 'js';
});

let totalFiles = 0;
let unresolvedCount = 0;
let missingHreflang = 0;
let missingCSS = 0;
let missingJS = 0;

for (const lang of langs) {
  const langDir = path.join(distDir, lang);
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.html'));
  totalFiles += files.length;

  for (const file of files) {
    const content = fs.readFileSync(path.join(langDir, file), 'utf8');
    const unresolved = content.match(/\{\{[^}]+\}\}/g);
    if (unresolved) {
      unresolvedCount += unresolved.length;
      console.log(`${lang}/${file}: ${unresolved.length} unresolved vars`);
      if (unresolved.length <= 5) {
        unresolved.forEach(v => console.log(`  ${v}`));
      } else {
        unresolved.slice(0, 3).forEach(v => console.log(`  ${v}`));
        console.log(`  ... and ${unresolved.length - 3} more`);
      }
    }
    if (!content.includes('hreflang')) missingHreflang++;
    if (!content.includes('styles.css')) missingCSS++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Total HTML files: ${totalFiles}`);
console.log(`Unresolved template vars: ${unresolvedCount}`);
console.log(`Missing hreflang: ${missingHreflang}`);
console.log(`Missing CSS: ${missingCSS}`);

console.log(`\n=== Checking specific content ===`);

const enSod = fs.readFileSync(path.join(distDir, 'en', 'sod-calculator.html'), 'utf8');
console.log('EN sod-calculator.html:');
console.log('  Has calculator form:', enSod.includes('id="calc-form"') || enSod.includes('calculator-form'));
console.log('  Has length input:', enSod.includes('id="lawn-length"'));
console.log('  Has width input:', enSod.includes('id="lawn-width"'));
console.log('  Has calculate button:', enSod.includes('id="calculate-btn"') || enSod.includes('btn-calculate'));
console.log('  Has result rolls:', enSod.includes('id="rolls-needed"'));
console.log('  Has result pallets:', enSod.includes('id="pallets-needed"'));
console.log('  Has result cost:', enSod.includes('id="est-cost"'));
console.log('  Has advanced toggle:', enSod.includes('advanced-toggle') || enSod.includes('advanced-options'));
console.log('  Has sod-calculator.js:', enSod.includes('sod-calculator.js'));
console.log('  Has schema.org:', enSod.includes('schema.org'));

const enArea = fs.readFileSync(path.join(distDir, 'en', 'lawn-area-calculator.html'), 'utf8');
console.log('\nEN lawn-area-calculator.html:');
console.log('  Has area calculator form:', enArea.includes('field-group'));
console.log('  Has add area button:', enArea.includes('add-area') || enArea.includes('add_area'));
console.log('  Has subtract area:', enArea.includes('subtract') || enArea.includes('subtract_area'));
console.log('  Has area-calculator.js:', enArea.includes('area-calculator.js'));

const enGrass = fs.readFileSync(path.join(distDir, 'en', 'grass-type-guide.html'), 'utf8');
console.log('\nEN grass-type-guide.html:');
console.log('  Has warm/cool toggle:', enGrass.includes('warm-season') && enGrass.includes('cool-season'));
console.log('  Has grass cards:', enGrass.includes('grass-card'));
console.log('  Has comparison table:', enGrass.includes('comparison-table'));
console.log('  Has grass-guide.js:', enGrass.includes('grass-guide.js'));

const enIndex = fs.readFileSync(path.join(distDir, 'en', 'index.html'), 'utf8');
console.log('\nEN index.html:');
console.log('  Has calculator:', enIndex.includes('lawn-length'));
console.log('  Has tool cards:', enIndex.includes('tool-card'));
console.log('  Has FAQ:', enIndex.includes('faq-item') || enIndex.includes('accordion'));
