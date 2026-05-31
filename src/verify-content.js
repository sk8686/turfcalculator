const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const langs = fs.readdirSync(distDir).filter(f => {
  return fs.statSync(path.join(distDir, f)).isDirectory() && f !== 'css' && f !== 'js';
});

console.log('Languages:', langs.length);
console.log('');

let totalFiles = 0;
let issues = [];

for (const lang of langs) {
  const langDir = path.join(distDir, lang);
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.html'));
  totalFiles += files.length;

  for (const file of files) {
    const content = fs.readFileSync(path.join(langDir, file), 'utf8');

    if (!content.includes(`<html lang="${lang}">`) && !content.includes(`<html lang="${lang}" dir="rtl">`)) {
      issues.push(`${lang}/${file}: Missing correct lang attribute`);
    }
    if (!content.includes('hreflang')) {
      issues.push(`${lang}/${file}: Missing hreflang`);
    }
    if (!content.includes('styles.css')) {
      issues.push(`${lang}/${file}: Missing styles.css`);
    }
    if (file === 'index.html' && !content.includes('<h1>')) {
      issues.push(`${lang}/${file}: Missing h1`);
    }
    if (content.includes('undefined') || content.includes('{{')) {
      const undefinedMatches = content.match(/\{\{[^}]+\}\}/g);
      if (undefinedMatches) {
        issues.push(`${lang}/${file}: Unresolved template vars: ${undefinedMatches.slice(0, 3).join(', ')}`);
      }
    }
  }
}

console.log(`Total HTML files: ${totalFiles}`);
console.log(`Issues found: ${issues.length}`);
if (issues.length > 0) {
  issues.slice(0, 30).forEach(i => console.log('  ' + i));
  if (issues.length > 30) console.log(`  ... and ${issues.length - 30} more`);
}

console.log('\n=== Detailed content checks ===');

const enIndex = fs.readFileSync(path.join(distDir, 'en', 'index.html'), 'utf8');
console.log('EN index.html:');
console.log('  Length:', enIndex.length, 'bytes');
console.log('  Has lang="en":', enIndex.includes('lang="en"'));
console.log('  Has h1:', enIndex.includes('<h1>'));
console.log('  Has hreflang:', enIndex.includes('hreflang'));
console.log('  Has styles.css:', enIndex.includes('styles.css'));
console.log('  Has app.js:', enIndex.includes('app.js'));
console.log('  Has cookie-banner:', enIndex.includes('cookie-banner'));
console.log('  Has schema.org:', enIndex.includes('schema.org'));
console.log('  Unresolved vars:', (enIndex.match(/\{\{[^}]+\}\}/g) || []).length);

const enSodCalc = fs.readFileSync(path.join(distDir, 'en', 'sod-calculator.html'), 'utf8');
console.log('\nEN sod-calculator.html:');
console.log('  Length:', enSodCalc.length, 'bytes');
console.log('  Has sod-calculator.js:', enSodCalc.includes('sod-calculator.js'));
console.log('  Has calculator form:', enSodCalc.includes('field-group'));
console.log('  Has result card:', enSodCalc.includes('result-card'));
console.log('  Has FAQ:', enSodCalc.includes('faq-item'));
console.log('  Unresolved vars:', (enSodCalc.match(/\{\{[^}]+\}\}/g) || []).length);

const arIndex = fs.readFileSync(path.join(distDir, 'ar', 'index.html'), 'utf8');
console.log('\nAR index.html:');
console.log('  Has dir="rtl":', arIndex.includes('dir="rtl"'));
console.log('  Has lang="ar":', arIndex.includes('lang="ar"'));

const esCalc = fs.readFileSync(path.join(distDir, 'es', 'calculadora-de-tepes.html'), 'utf8');
console.log('\nES calculadora-de-tepes.html:');
console.log('  Length:', esCalc.length, 'bytes');
console.log('  Has lang="es":', esCalc.includes('lang="es"'));
console.log('  Has sod-calculator.js:', esCalc.includes('sod-calculator.js'));
console.log('  Unresolved vars:', (esCalc.match(/\{\{[^}]+\}\}/g) || []).length);

const zhCalc = fs.readFileSync(path.join(distDir, 'zh', '草皮计算器.html'), 'utf8');
console.log('\nZH 草皮计算器.html:');
console.log('  Length:', zhCalc.length, 'bytes');
console.log('  Has lang="zh":', zhCalc.includes('lang="zh"'));
console.log('  Has sod-calculator.js:', zhCalc.includes('sod-calculator.js'));
console.log('  Unresolved vars:', (zhCalc.match(/\{\{[^}]+\}\}/g) || []).length);

console.log('\n=== Sitemap check ===');
const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
const sitemapEntries = (sitemap.match(/<url>/g) || []).length;
console.log('Sitemap entries:', sitemapEntries);

console.log('\n=== Static assets ===');
const cssSize = fs.statSync(path.join(distDir, 'css', 'styles.css')).size;
console.log('CSS size:', cssSize, 'bytes');
const jsFiles = fs.readdirSync(path.join(distDir, 'js'));
for (const js of jsFiles) {
  const size = fs.statSync(path.join(distDir, 'js', js)).size;
  console.log(`  ${js}: ${size} bytes`);
}
