const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const I18N_DIR = path.join(SRC, 'i18n');
const TEMPLATES_DIR = path.join(SRC, 'templates');
const PARTIALS_DIR = path.join(SRC, 'partials');

const RTL_LANGUAGES = new Set(['ar']);

const DOMAIN = 'https://turfonlinecalculator.com';

const LOCALE_MAP = {
  ar: 'ar_AR', de: 'de_DE', en: 'en_US', es: 'es_ES', fr: 'fr_FR',
  it: 'it_IT', ja: 'ja_JP', ko: 'ko_KR', nl: 'nl_NL', pl: 'pl_PL',
  pt: 'pt_BR', sv: 'sv_SE', tr: 'tr_TR', zh: 'zh_CN',
};

const EXCLUDED_FROM_SITEMAP = new Set(['404']);

const conversionPairs = [
  { slug: 'sq-ft-to-sq-m', from: 'Square Feet', to: 'Square Meters', fromUnit: 'sqft', toUnit: 'sqm', factor: 0.092903 },
  { slug: 'sq-m-to-sq-ft', from: 'Square Meters', to: 'Square Feet', fromUnit: 'sqm', toUnit: 'sqft', factor: 10.76391 },
  { slug: 'acres-to-square-feet', from: 'Acres', to: 'Square Feet', fromUnit: 'ac', toUnit: 'sqft', factor: 43560 },
  { slug: 'square-feet-to-acres', from: 'Square Feet', to: 'Acres', fromUnit: 'sqft', toUnit: 'ac', factor: 0.0000229568 },
  { slug: 'sq-ft-to-sq-yd', from: 'Square Feet', to: 'Square Yards', fromUnit: 'sqft', toUnit: 'sqyd', factor: 0.111111 },
  { slug: 'hectares-to-acres', from: 'Hectares', to: 'Acres', fromUnit: 'ha', toUnit: 'ac', factor: 2.47105 },
  { slug: 'acres-to-hectares', from: 'Acres', to: 'Hectares', fromUnit: 'ac', toUnit: 'ha', factor: 0.404686 },
  { slug: 'sq-yd-to-sq-ft', from: 'Square Yards', to: 'Square Feet', fromUnit: 'sqyd', toUnit: 'sqft', factor: 9 },
  { slug: 'sq-m-to-acres', from: 'Square Meters', to: 'Acres', fromUnit: 'sqm', toUnit: 'ac', factor: 0.000247105 },
  { slug: 'acres-to-sq-m', from: 'Acres', to: 'Square Meters', fromUnit: 'ac', toUnit: 'sqm', factor: 4046.86 },
  { slug: 'hectares-to-sq-m', from: 'Hectares', to: 'Square Meters', fromUnit: 'ha', toUnit: 'sqm', factor: 10000 },
  { slug: 'sq-m-to-hectares', from: 'Square Meters', to: 'Hectares', fromUnit: 'sqm', toUnit: 'ha', factor: 0.0001 },
  { slug: 'sq-ft-to-sq-in', from: 'Square Feet', to: 'Square Inches', fromUnit: 'sqft', toUnit: 'sqin', factor: 144 },
  { slug: 'sq-in-to-sq-ft', from: 'Square Inches', to: 'Square Feet', fromUnit: 'sqin', toUnit: 'sqft', factor: 0.00694444 },
  { slug: 'sq-mi-to-acres', from: 'Square Miles', to: 'Acres', fromUnit: 'sqmi', toUnit: 'ac', factor: 640 },
  { slug: 'acres-to-sq-mi', from: 'Acres', to: 'Square Miles', fromUnit: 'ac', toUnit: 'sqmi', factor: 0.0015625 },
  { slug: 'sq-m-to-sq-yd', from: 'Square Meters', to: 'Square Yards', fromUnit: 'sqm', toUnit: 'sqyd', factor: 1.19599 },
  { slug: 'sq-yd-to-sq-m', from: 'Square Yards', to: 'Square Meters', fromUnit: 'sqyd', toUnit: 'sqm', factor: 0.836127 },
  { slug: 'sq-ft-to-sq-cm', from: 'Square Feet', to: 'Square Centimeters', fromUnit: 'sqft', toUnit: 'sqcm', factor: 929.0304 },
  { slug: 'sq-cm-to-sq-ft', from: 'Square Centimeters', to: 'Square Feet', fromUnit: 'sqcm', toUnit: 'sqft', factor: 0.00107639 }
];

function resolveDotNotation(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

function replacePlaceholders(html, langData, lang, slug, templateSlug, allLangs) {
  html = html.replace(/\{\{HEADER\}\}/g, partials.HEADER || '');
  html = html.replace(/\{\{FOOTER\}\}/g, partials.FOOTER || '');
  html = html.replace(/\{\{LANG\}\}/g, lang);
  html = html.replace(/\{\{LANG_NAME\}\}/g, langData?.lang_name || lang);
  html = html.replace(/\{\{LANG_DIR\}\}/g, RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr');

  const displaySlug = slug === 'index' ? '' : slug + '.html';
  html = html.replace(/\{\{SLUG\}\}/g, displaySlug);

  if (templateSlug && allLangs) {
    html = replaceLangSwitcherSlugs(html, templateSlug, allLangs);
  }

  // Auto-append .html to {{pages.xxx}} references so nav links work
  // Must run BEFORE the generic dot-notation replacer below
  html = html.replace(/\{\{pages\.([a-zA-Z0-9_-]+)\}\}/g, (match, pageKey) => {
    const value = langData.pages && langData.pages[pageKey];
    return value ? value + '.html' : match;
  });

  html = html.replace(/\{\{([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)\}\}/g, (match, keyPath) => {
    const value = resolveDotNotation(langData, keyPath);
    return value !== null && value !== undefined ? value : match;
  });

  html = html.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (match, key) => {
    if (langData[key] !== undefined && typeof langData[key] === 'string') {
      return langData[key];
    }
    return match;
  });

  html = injectSeoMeta(html, lang);
  html = injectBreadcrumb(html, langData, lang, templateSlug);
  if (templateSlug === 'index') {
    html = injectFaqSchema(html, langData);
  }

  return html;
}

function replaceLangSwitcherSlugs(html, templateSlug, allLangs) {
  const langLinks = [];
  for (const targetLang of allLangs) {
    const targetSlug = getLocalizedSlug(languages[targetLang], templateSlug);
    const displaySlug = targetSlug === 'index' ? '' : targetSlug + '.html';
    langLinks.push(`        <a href="/${targetLang}/${displaySlug}" data-lang="${targetLang}">${languages[targetLang]?.lang_name || targetLang}</a>`);
  }

  const menuBlock = `      <div class="language-switcher__dropdown" id="lang-menu">\n${langLinks.join('\n')}\n      </div>`;
  html = html.replace(/<div class="language-switcher__dropdown" id="lang-menu">[\s\S]*?<\/div>\s*<\/div>/, menuBlock + '\n    </div>');

  return html;
}

function replaceConversionPlaceholders(html, pair, langData) {
  html = html.replace(/\{\{CONV_FROM\}\}/g, pair.from);
  html = html.replace(/\{\{CONV_TO\}\}/g, pair.to);
  html = html.replace(/\{\{CONV_FROM_UNIT\}\}/g, pair.fromUnit);
  html = html.replace(/\{\{CONV_TO_UNIT\}\}/g, pair.toUnit);
  html = html.replace(/\{\{CONV_FACTOR\}\}/g, String(pair.factor));

  const fromLabel = langData.area_converter?.conversion_units?.[pair.fromUnit] || pair.from;
  const toLabel = langData.area_converter?.conversion_units?.[pair.toUnit] || pair.to;
  const convTitleTemplate = langData.area_converter?.conversion_title_template || '{from} to {to} Converter';
  const convTitle = convTitleTemplate.replace('{from}', fromLabel).replace('{to}', toLabel);
  const convDescTemplate = langData.area_converter?.conversion_desc_template || 'Convert {from} to {to} instantly. Free online area converter with accurate results.';
  const convDesc = convDescTemplate.replace('{from}', fromLabel).replace('{to}', toLabel);

  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + convTitle + '</title>');
  html = html.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + convTitle + '">');
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + convDesc + '">');
  html = html.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + convDesc + '">');

  return html;
}

function getLocalizedSlug(langData, templateSlug) {
  if (langData.pages && langData.pages[templateSlug]) {
    return langData.pages[templateSlug];
  }
  return templateSlug;
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  Warning: Source directory not found: ${src}`);
    return;
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function loadJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`  Error reading ${filePath}: ${err.message}`);
    return null;
  }
}

function injectSeoMeta(html, lang) {
  const locale = LOCALE_MAP[lang] || 'en_US';
  const ogImage = `${DOMAIN}/og-image.svg`;
  const headClose = html.indexOf('</head>');
  if (headClose === -1) return html;

  const metaTags = [
    `<meta name="robots" content="index, follow">`,
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" as="style">`,
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'">`,
    `<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"></noscript>`,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
    `<link rel="preconnect" href="https://turfonlinecalculator.com">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:site_name" content="TurfCalculator">`,
    `<meta property="og:locale" content="${locale}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:image" content="${ogImage}">`,
  ];

  return html.slice(0, headClose) + metaTags.join('\n') + '\n' + html.slice(headClose);
}

function injectBreadcrumb(html, langData, lang, templateSlug) {
  if (templateSlug === 'index' || templateSlug === '404') return html;

  const homeLabel = (langData.nav?.home || 'Home').replace(/"/g, '\\"');
  const i18nKey = templateSlug.replace(/-/g, '_');
  const pageLabel = (langData[i18nKey]?.h1 || langData[i18nKey]?.meta_title || templateSlug).replace(/"/g, '\\"');
  const homeHref = `/${lang}/`;

  const breadcrumbHtml = `<nav aria-label="Breadcrumb" class="breadcrumb"><ol class="breadcrumb__list"><li class="breadcrumb__item"><a href="${homeHref}">${homeLabel}</a></li><li class="breadcrumb__item breadcrumb__item--current" aria-current="page">${pageLabel}</li></ol></nav>`;

  const breadcrumbLd = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"${homeLabel}","item":"${DOMAIN}${homeHref}"},{"@type":"ListItem","position":2,"name":"${pageLabel}"}]}</script>`;

  const headClose = html.indexOf('</head>');
  if (headClose !== -1) {
    html = html.slice(0, headClose) + breadcrumbLd + '\n' + html.slice(headClose);
  }

  const mainTag = html.indexOf('<main');
  if (mainTag !== -1) {
    const mainStart = html.indexOf('>', mainTag) + 1;
    html = html.slice(0, mainStart) + '\n    ' + breadcrumbHtml + html.slice(mainStart);
  }

  return html;
}

function injectFaqSchema(html, langData) {
  const faqItems = [];
  for (let i = 1; i <= 4; i++) {
    const q = langData.home?.[`popular_question_${i}`];
    const a = langData.home?.[`popular_answer_${i}`];
    if (!q || !a) continue;
    faqItems.push(`{"@type":"Question","name":${JSON.stringify(q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(a)}}}`);
  }
  if (faqItems.length === 0) return html;

  const faqLd = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqItems.join(',')}]}</script>`;
  const headClose = html.indexOf('</head>');
  if (headClose !== -1) {
    html = html.slice(0, headClose) + faqLd + '\n' + html.slice(headClose);
  }
  return html;
}

function generateHreflangForPage(templateSlug, localizedSlugsByLang, allLangs) {
  let tags = '';
  for (const lang of allLangs) {
    let slug = localizedSlugsByLang[lang];
    if (slug === 'index') slug = '';
    const hrefSlug = slug === '' ? '' : slug + '.html';
    tags += `  <link rel="alternate" hreflang="${lang}" href="${DOMAIN}/${lang}/${hrefSlug}"/>\n`;
  }
  const enSlug = localizedSlugsByLang['en'] === 'index' ? '' : localizedSlugsByLang['en'];
  const enHrefSlug = enSlug === '' ? '' : enSlug + '.html';
  tags += `  <link rel="alternate" hreflang="x-default" href="${DOMAIN}/en/${enHrefSlug}"/>\n`;
  return tags;
}

function injectHreflangIntoHtml(html, hreflangTags) {
  const headClose = html.indexOf('</head>');
  if (headClose === -1) return html;
  return html.slice(0, headClose) + hreflangTags + html.slice(headClose);
}

function generateSitemap(allLangs, allPageEntries) {
  const today = new Date().toISOString().split('T')[0];
  const buildDate = today;
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const entry of allPageEntries) {
    const { templateSlug, localizedSlugsByLang } = entry;

    if (EXCLUDED_FROM_SITEMAP.has(templateSlug)) continue;

    for (const lang of allLangs) {
      let slug = localizedSlugsByLang[lang];
      if (slug === 'index') slug = '';
      const sitemapSlug = slug === '' ? '' : slug + '.html';

      xml += '  <url>\n';
      xml += `    <loc>${DOMAIN}/${lang}/${sitemapSlug}</loc>\n`;

      for (const altLang of allLangs) {
        let altSlug = localizedSlugsByLang[altLang];
        if (altSlug === 'index') altSlug = '';
        const altHrefSlug = altSlug === '' ? '' : altSlug + '.html';
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}/${altHrefSlug}"/>\n`;
      }
      const xDefaultSlug = localizedSlugsByLang['en'] === 'index' ? '' : localizedSlugsByLang['en'];
      const xDefHrefSlug = xDefaultSlug === '' ? '' : xDefaultSlug + '.html';
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/en/${xDefHrefSlug}"/>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';

      let priority = '0.8';
      if (templateSlug === 'index') priority = '1.0';
      else if (templateSlug.includes('calculator') || templateSlug.includes('converter')) priority = '0.9';
      else if (conversionPairs.some(p => p.slug === templateSlug)) priority = '0.7';
      xml += `    <priority>${priority}</priority>\n`;
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>\n';
  return xml;
}

function generateOgImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#15803d"/>
      <stop offset="100%" style="stop-color:#166534"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="240" font-family="system-ui,-apple-system,sans-serif" font-size="96" font-weight="800" fill="white" text-anchor="middle">&#x1F331; TurfCalculator</text>
  <text x="600" y="360" font-family="system-ui,-apple-system,sans-serif" font-size="42" font-weight="400" fill="#bbf7d0" text-anchor="middle">Free Lawn &amp; Sod Calculators</text>
  <text x="600" y="440" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="400" fill="#86efac" text-anchor="middle">Sod &#xB7; Fertilizer &#xB7; Grass Seed &#xB7; Water &#xB7; Soil &#xB7; Area</text>
</svg>`;
  fs.writeFileSync(path.join(DIST, 'og-image.svg'), svg);
  console.log('  Generated og-image.svg');
}

function generateFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#15803d"/>
  <text x="16" y="23" font-family="system-ui,sans-serif" font-size="20" font-weight="800" fill="white" text-anchor="middle">T</text>
</svg>`;
  fs.writeFileSync(path.join(DIST, 'favicon.svg'), svg);
  console.log('  Generated favicon.svg');
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
}

function generateRedirects(allLangs) {
  let content = '/  /en/  302\n';
  for (const lang of allLangs) {
    if (lang !== 'en') {
      content += `/${lang}  /${lang}/  302\n`;
    }
  }
  content += '/*  /404.html  404\n';
  return content;
}

function generateRootIndex() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/en/">
  <link rel="canonical" href="${DOMAIN}/en/">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="/en/">English version</a>...</p>
</body>
</html>`;
}

function generateRoot404() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | TurfCalculator</title>
  <style>
    body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fafaf9;color:#1c1917;text-align:center;padding:20px}
    h1{font-size:4rem;font-weight:800;color:#22c55e;margin:0 0 16px}
    p{font-size:1.125rem;color:#57534e;margin:8px 0;max-width:400px}
    a{display:inline-block;margin-top:24px;padding:12px 28px;background:#22c55e;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600}
    a:hover{background:#16a34a}
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
    <a href="/en/">Go Home →</a>
  </main>
</body>
</html>`;
}

let partials = {};
let languages = {};
let templates = {};

function loadPartials() {
  console.log('Loading partials...');
  const partialFiles = ['header.html', 'footer.html'];
  for (const file of partialFiles) {
    const filePath = path.join(PARTIALS_DIR, file);
    if (fs.existsSync(filePath)) {
      const key = path.basename(file, '.html').toUpperCase();
      partials[key] = fs.readFileSync(filePath, 'utf8');
      console.log(`  Loaded partial: ${file}`);
    } else {
      console.warn(`  Warning: Partial not found: ${filePath}`);
      const key = path.basename(file, '.html').toUpperCase();
      partials[key] = '';
    }
  }
}

function loadLanguages() {
  console.log('Loading language files...');
  if (!fs.existsSync(I18N_DIR)) {
    console.error(`  Error: i18n directory not found: ${I18N_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(I18N_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('  Error: No JSON files found in i18n directory');
    process.exit(1);
  }
  for (const file of files) {
    const lang = path.basename(file, '.json');
    const data = loadJSON(path.join(I18N_DIR, file));
    if (data) {
      languages[lang] = data;
      console.log(`  Loaded language: ${lang} (${Object.keys(data).length} top-level keys)`);
    }
  }
}

function loadTemplates() {
  console.log('Loading templates...');
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error(`  Error: templates directory not found: ${TEMPLATES_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.html'));
  if (files.length === 0) {
    console.error('  Error: No HTML templates found');
    process.exit(1);
  }
  for (const file of files) {
    const templateName = path.basename(file, '.html');
    templates[templateName] = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf8');
    console.log(`  Loaded template: ${file}`);
  }
}

const LANG_ORDER = ['en', 'zh', 'es', 'ar', 'pt', 'ja', 'de', 'fr', 'ko', 'it', 'tr', 'pl', 'nl', 'sv'];

function buildPages() {
  const allLangs = LANG_ORDER.filter(l => languages[l]);
  const enData = languages['en'];
  if (!enData) {
    console.error('  Error: English (en.json) is required as the base language');
    process.exit(1);
  }

  const templateNames = Object.keys(templates);
  const allPageEntries = [];
  let totalPagesGenerated = 0;

  console.log(`\nBuilding pages for ${allLangs.length} languages...`);

  for (const lang of allLangs) {
    const langData = languages[lang];
    const langDir = path.join(DIST, lang);
    fs.mkdirSync(langDir, { recursive: true });

    for (const templateName of templateNames) {
      const templateHtml = templates[templateName];
      const templateSlug = templateName === 'index' ? 'index' : templateName;
      const localizedSlug = getLocalizedSlug(langData, templateSlug);

      let html = replacePlaceholders(templateHtml, langData, lang, localizedSlug, templateSlug, allLangs);
      html = injectI18nScript(html, lang);

      if (templateName === 'area-converter') {
        html = html.replace(/\{\{CONV_FROM_UNIT\}\}/g, 'sqft');
        html = html.replace(/\{\{CONV_TO_UNIT\}\}/g, 'sqm');
      }

      const localizedSlugsByLang = {};
      for (const l of allLangs) {
        localizedSlugsByLang[l] = getLocalizedSlug(languages[l], templateSlug);
      }
      const hreflangTags = generateHreflangForPage(templateSlug, localizedSlugsByLang, allLangs);
      html = injectHreflangIntoHtml(html, hreflangTags);

      const outputPath = path.join(langDir, `${localizedSlug}.html`);
      fs.writeFileSync(outputPath, html);
      totalPagesGenerated++;

      if (!allPageEntries.find(e => e.templateSlug === templateSlug)) {
        allPageEntries.push({ templateSlug, localizedSlugsByLang });
      }
    }

    if (templates['area-converter']) {
      const converterTemplate = templates['area-converter'];
      for (const pair of conversionPairs) {
        const localizedSlug = getLocalizedSlug(langData, pair.slug);

        let html = replacePlaceholders(converterTemplate, langData, lang, localizedSlug, pair.slug, allLangs);
        html = replaceConversionPlaceholders(html, pair, langData);
        html = injectI18nScript(html, lang);

        const localizedSlugsByLang = {};
        for (const l of allLangs) {
          localizedSlugsByLang[l] = getLocalizedSlug(languages[l], pair.slug);
        }
        const hreflangTags = generateHreflangForPage(pair.slug, localizedSlugsByLang, allLangs);
        html = injectHreflangIntoHtml(html, hreflangTags);

        const outputPath = path.join(langDir, `${localizedSlug}.html`);
        fs.writeFileSync(outputPath, html);
        totalPagesGenerated++;

        if (!allPageEntries.find(e => e.templateSlug === pair.slug)) {
          allPageEntries.push({ templateSlug: pair.slug, localizedSlugsByLang });
        }
      }
    }

    console.log(`  Built ${lang}/ (${templateNames.length + (templates['area-converter'] ? conversionPairs.length : 0)} pages)`);
  }

  return { allPageEntries, totalPagesGenerated, allLangs };
}

function buildStaticAssets(allLangs, allPageEntries) {
  console.log('\nGenerating static assets...');

  const rootIndex = generateRootIndex();
  fs.writeFileSync(path.join(DIST, 'index.html'), rootIndex);
  console.log('  Generated root index.html (redirects to /en/)');

  generateOgImage();
  generateFavicon();

  const sitemap = generateSitemap(allLangs, allPageEntries);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  console.log(`  Generated sitemap.xml (${allPageEntries.length} page entries)`);

  const robots = generateRobotsTxt();
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);
  console.log('  Generated robots.txt');

  const redirects = generateRedirects(allLangs);
  fs.writeFileSync(path.join(DIST, '_redirects'), redirects);
  console.log('  Generated _redirects (Cloudflare Pages)');

  const root404 = generateRoot404();
  fs.writeFileSync(path.join(DIST, '404.html'), root404);
  console.log('  Generated root 404.html');
}

function copyAssets() {
  console.log('\nCopying static assets...');

  const cssSrc = path.join(SRC, 'css');
  const cssDest = path.join(DIST, 'css');
  if (fs.existsSync(cssSrc)) {
    copyDirSync(cssSrc, cssDest);
    console.log('  Copied css/');
  } else {
    console.warn('  Warning: src/css/ directory not found, skipping');
  }

  const jsSrc = path.join(SRC, 'js');
  const jsDest = path.join(DIST, 'js');
  if (fs.existsSync(jsSrc)) {
    copyDirSync(jsSrc, jsDest);
    console.log('  Copied js/');
  } else {
    console.warn('  Warning: src/js/ directory not found, skipping');
  }
}

function generateI18nFiles() {
  console.log('\nGenerating i18n JS files...');
  const jsDir = path.join(DIST, 'js');
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }
  for (const [lang, data] of Object.entries(languages)) {
    const content = 'window.I18N=' + JSON.stringify(data) + ';';
    const filePath = path.join(jsDir, 'i18n-' + lang + '.js');
    fs.writeFileSync(filePath, content);
  }
  console.log('  Generated ' + Object.keys(languages).length + ' i18n JS files');
}

function injectI18nScript(html, lang) {
  const marker = '<script src="/js/app.js"';
  const i18nTag = '<script src="/js/i18n-' + lang + '.js"></script>\n  ';
  return html.replace(marker, i18nTag + marker);
}

function main() {
  const startTime = Date.now();
  console.log('=== TurfCalculator Build ===\n');

  console.log('Cleaning dist/ directory...');
  cleanDir(DIST);
  console.log('  Cleaned.\n');

  loadPartials();
  loadLanguages();
  loadTemplates();

  const { allPageEntries, totalPagesGenerated, allLangs } = buildPages();
  buildStaticAssets(allLangs, allPageEntries);
  copyAssets();
  generateI18nFiles();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n=== Build complete ===`);
  console.log(`  Languages: ${allLangs.length}`);
  console.log(`  Templates: ${Object.keys(templates).length}`);
  console.log(`  Conversion pairs: ${conversionPairs.length}`);
  console.log(`  Total pages generated: ${totalPagesGenerated}`);
  console.log(`  Sitemap entries: ${allPageEntries.length}`);
  console.log(`  Time: ${elapsed}s`);
}

main();
