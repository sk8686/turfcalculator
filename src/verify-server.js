const http = require('http');

const langs = ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'sv', 'pl', 'tr', 'ar', 'ja', 'ko', 'zh'];
const pages = [
  '',
  'sod-calculator',
  'lawn-area-calculator',
  'grass-type-guide',
  'grass-seed-calculator',
  'fertilizer-calculator',
  'lawn-water-calculator',
  'soil-calculator',
  'area-converter',
  'lawn-care-calendar',
  'about',
  'privacy-policy',
  'terms',
  'disclaimer',
  'cookie-policy',
];

async function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

async function main() {
  let total = 0, ok = 0, fail = 0;
  const failures = [];

  for (const lang of langs) {
    for (const page of pages) {
      const url = `http://localhost:3000/${lang}/${page}${page ? '/' : ''}`;
      total++;
      const result = await check(url);
      if (result.status === 200) {
        ok++;
      } else {
        fail++;
        failures.push(`${url} -> ${result.status || result.error}`);
      }
    }
  }

  console.log(`\nTotal: ${total}, OK: ${ok}, Failed: ${fail}`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach(f => console.log('  ' + f));
  }

  console.log('\nChecking root redirect...');
  const root = await check('http://localhost:3000/');
  console.log(`  / -> ${root.status}`);

  console.log('\nChecking sitemap...');
  const sitemap = await check('http://localhost:3000/sitemap.xml');
  console.log(`  /sitemap.xml -> ${sitemap.status} (${sitemap.length} bytes)`);

  console.log('\nChecking robots.txt...');
  const robots = await check('http://localhost:3000/robots.txt');
  console.log(`  /robots.txt -> ${robots.status}`);

  console.log('\nChecking CSS...');
  const css = await check('http://localhost:3000/css/styles.css');
  console.log(`  /css/styles.css -> ${css.status} (${css.length} bytes)`);

  console.log('\nChecking JS files...');
  const jsFiles = ['app.js', 'sod-calculator.js', 'area-calculator.js', 'grass-guide.js',
    'grass-seed-calculator.js', 'fertilizer-calculator.js', 'lawn-water-calculator.js',
    'soil-calculator.js', 'area-converter.js', 'lawn-calendar.js'];
  for (const js of jsFiles) {
    const r = await check(`http://localhost:3000/js/${js}`);
    console.log(`  /js/${js} -> ${r.status} (${r.length} bytes)`);
  }
}

main();
