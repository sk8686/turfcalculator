const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, 'i18n');
const files = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  try {
    const content = fs.readFileSync(path.join(i18nDir, file), 'utf8');
    const data = JSON.parse(content);
    const keys = Object.keys(data);
    console.log(file + ': Valid JSON (' + keys.length + ' top-level keys)');
  } catch (e) {
    console.log(file + ': INVALID - ' + e.message);
  }
}
