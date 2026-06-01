'use strict';

const TurfApp = (() => {
  const SUPPORTED_LANGS = ['en', 'zh', 'es', 'ar', 'pt', 'ja', 'de', 'fr', 'ko', 'it', 'tr', 'pl', 'nl', 'sv'];
  const DEFAULT_LANG = 'en';
  const COOKIE_CONSENT_KEY = 'turf_cookie_consent';
  const LANG_PREF_KEY = 'turf_lang_pref';

  function detectLanguage() {
    const path = window.location.pathname;
    for (const lang of SUPPORTED_LANGS) {
      if (path.includes(`/${lang}/`) || path.startsWith(`/${lang}`)) {
        localStorage.setItem(LANG_PREF_KEY, lang);
        return lang;
      }
    }
    const stored = localStorage.getItem(LANG_PREF_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(browserLang)) {
      localStorage.setItem(LANG_PREF_KEY, browserLang);
      return browserLang;
    }
    return DEFAULT_LANG;
  }

  function getLanguage() {
    const stored = localStorage.getItem(LANG_PREF_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    return detectLanguage();
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    localStorage.setItem(LANG_PREF_KEY, lang);
  }

  function getCookieConsent() {
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function setCookieConsent(analytics) {
    const consent = { analytics, timestamp: Date.now() };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = true;
  }

  function initCookieConsent() {
    const consent = getCookieConsent();
    if (consent) return;
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.hidden = false;
    banner.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      const choice = btn.dataset.consent;
      if (choice === 'accept') {
        setCookieConsent(true);
      } else {
        setCookieConsent(false);
      }
    });
  }

  function initMobileNav() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;
    const currentPath = window.location.pathname;
    const links = nav.querySelectorAll('.bottom-nav__item');
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (currentPath.endsWith(href) || (href !== '/' && currentPath.includes(href))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function initHeaderNav() {
    const nav = document.querySelector('.header__nav');
    if (!nav) return;
    const currentPath = window.location.pathname;
    const links = nav.querySelectorAll('a[data-nav]');
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (currentPath.endsWith(href) || (href !== '/' && currentPath.includes(href))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function initLanguageSwitcher() {
    const toggle = document.querySelector('.language-switcher__toggle');
    const dropdown = document.querySelector('.language-switcher__dropdown');
    if (!toggle || !dropdown) return;
    
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('language-switcher__dropdown--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove('language-switcher__dropdown--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const lang = link.dataset.lang;
        if (lang) setLanguage(lang);
        dropdown.classList.remove('language-switcher__dropdown--open');
        toggle.setAttribute('aria-expanded', 'false');
        window.location.href = link.href;
      });
    });
  }

  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.header__nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('header__nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '✕' : '☰';
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('header__nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function getUrlParams() {
    return new URLSearchParams(window.location.search);
  }

  function getParam(key) {
    return getUrlParams().get(key);
  }

  function prefillFromUrl() {
    const params = getUrlParams();
    const area = params.get('area');
    const unit = params.get('unit');
    const grass = params.get('grass');
    if (area) {
      const areaInput = document.querySelector('[name="area"], #area-input');
      if (areaInput) areaInput.value = area;
    }
    if (unit) {
      const unitSelect = document.querySelector('[name="unit"], #unit-select');
      if (unitSelect) unitSelect.value = unit;
    }
    if (grass) {
      const grassSelect = document.querySelector('[name="grass"], #grass-select');
      if (grassSelect) grassSelect.value = grass.replace(/-/g, '_');
    }
  }

  function initAccordions() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion__trigger');
      if (!trigger) return;
      const content = trigger.nextElementSibling;
      if (!content || !content.classList.contains('accordion__content')) return;
      const item = trigger.closest('.accordion__item');
      if (!item) return;
      const isOpen = item.classList.contains('accordion__item--open');
      item.classList.toggle('accordion__item--open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  function initPrintButton() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.print-btn');
      if (!btn) return;
      window.print();
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(String(text));
    }
    const textarea = document.createElement('textarea');
    textarea.value = String(text);
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve();
  }

  function initCopyButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-btn');
      if (!btn) return;
      const target = btn.dataset.copyTarget;
      let text = '';
      if (target) {
        const el = document.querySelector(target);
        text = el ? el.textContent : '';
      } else {
        text = btn.dataset.copyText || '';
      }
      copyToClipboard(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = original; }, 1500);
      });
    });
  }

  const LOCALE_MAP = {
    en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR',
    it: 'it-IT', nl: 'nl-NL', sv: 'sv-SE', pl: 'pl-PL', tr: 'tr-TR',
    ar: 'ar-SA', ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN',
  };

  function getLocale() {
    const lang = getLanguage();
    return LOCALE_MAP[lang] || 'en-US';
  }

  function formatNumber(value, options = {}) {
    const locale = getLocale();
    const { maximumFractionDigits = 2, style, unit } = options;
    const formatterOpts = {
      maximumFractionDigits,
      style: style || 'decimal',
    };
    if (style === 'unit' && unit) {
      formatterOpts.unit = unit;
      formatterOpts.unitDisplay = 'short';
    }
    return new Intl.NumberFormat(locale, formatterOpts).format(value);
  }

  function formatCurrency(value) {
    const locale = getLocale();
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function init() {
    detectLanguage();
    initCookieConsent();
    initMobileNav();
    initMobileMenu();
    initHeaderNav();
    initLanguageSwitcher();
    initSmoothScroll();
    initAccordions();
    initPrintButton();
    initCopyButtons();
    prefillFromUrl();
  }

  onReady(init);

  return {
    detectLanguage,
    getLanguage,
    setLanguage,
    getCookieConsent,
    setCookieConsent,
    getUrlParams,
    getParam,
    prefillFromUrl,
    copyToClipboard,
    formatNumber,
    formatCurrency,
    onReady,
    t(key, fallback) {
      const parts = key.split('.');
      let val = window.I18N;
      for (const p of parts) { val = val?.[p]; }
      return (val !== undefined && val !== null) ? val : fallback;
    },
  };
})();
