const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, 'i18n');
const enPath = path.join(i18nDir, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(getAllKeys(en));
console.log(`EN has ${enKeys.size} leaf keys`);

const otherLangs = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json') && f !== 'en.json');

for (const file of otherLangs) {
  const fp = path.join(i18nDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.log(`${file}: PARSE ERROR - ${e.message}`);
    continue;
  }

  const langKeys = new Set(getAllKeys(data));
  const missing = [...enKeys].filter(k => !langKeys.has(k));
  const extra = [...langKeys].filter(k => !enKeys.has(k));

  if (missing.length > 0 || extra.length > 0) {
    console.log(`\n${file}: ${langKeys.size} keys`);
    if (missing.length > 0) {
      console.log(`  MISSING (${missing.length}):`);
      missing.forEach(k => console.log(`    - ${k}`));
    }
    if (extra.length > 0) {
      console.log(`  EXTRA (${extra.length}):`);
      extra.slice(0, 10).forEach(k => console.log(`    + ${k}`));
      if (extra.length > 10) console.log(`    ... and ${extra.length - 10} more`);
    }
  } else {
    console.log(`${file}: OK (${langKeys.size} keys, all match)`);
  }
}
