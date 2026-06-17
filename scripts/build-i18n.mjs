#!/usr/bin/env node
// Nomik.ai i18n build — single English source of truth → generated /fr and /es.
//
// Design: parse each English page with parse5 (sourceCodeLocationInfo) to locate
// every translatable unit (block-level inner HTML, preserving inline tags) and
// translatable attribute. We never re-serialize the document — we splice
// translations into the exact source byte ranges, so a localized page differs
// from its English source ONLY in the translated spans + the injected i18n chrome
// (hreflang/canonical/lang, the language switcher, asset-path rewrites).
//
//   node scripts/build-i18n.mjs --extract   → write i18n/source.json (the inventory)
//   node scripts/build-i18n.mjs --report     → coverage report, write nothing
//   node scripts/build-i18n.mjs              → generate /fr, /es, augment EN in place
//
import { parse } from 'parse5';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://www.nomik.ai';
const SRC_LOCALE = 'en';
const TARGET_LOCALES = ['fr', 'es'];
const ALL_LOCALES = [SRC_LOCALE, ...TARGET_LOCALES];

// Pages that are NOT real content surfaces.
const EXCLUDE = new Set(['og-template.html', 'local.html']);
// Legal pages get a "translation for convenience, English governs" note.
const LEGAL = new Set(['privacy.html', 'terms.html', 'dpa.html', 'cookies.html', 'bridge-privacy.html']);

const LOCALE_NAME = { en: 'English', fr: 'Français', es: 'Español' };
const LOCALE_SHORT = { en: 'EN', fr: 'FR', es: 'ES' };
const LEGAL_NOTE = {
  fr: 'Cette traduction est fournie à titre indicatif. En cas de divergence, la version anglaise fait foi.',
  es: 'Esta traducción se ofrece únicamente con fines informativos. En caso de discrepancia, prevalece la versión en inglés.',
};

// Inline phrasing tags kept inside a translation unit (never unit boundaries).
const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em',
  'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'img', 'svg']);
// Subtrees whose text is never translated (and never descended for units).
const OPAQUE = new Set(['script', 'style', 'svg', 'code', 'pre', 'template', 'noscript']);
// Attributes whose value is human-readable copy.
const TEXT_ATTRS = new Set(['alt', 'aria-label', 'aria-description', 'placeholder', 'title']);
// <meta> content values that are copy (everything else — og:url, theme-color, … — is not).
const META_CONTENT = new Set(['description', 'og:title', 'og:description', 'og:image:alt',
  'twitter:title', 'twitter:description']);
// Relative asset references get rewritten to root-absolute in /fr and /es.
const ASSET_RE = /\.(css|js|mjs|svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|mp4|webm|json|xml|webmanifest|pdf)(\?|#|$)/i;

const args = new Set(process.argv.slice(2));
const MODE = args.has('--extract') ? 'extract' : args.has('--report') ? 'report' : 'build';

const sha = (s) => createHash('sha1').update(s).digest('hex').slice(0, 10);
const hasLetter = (s) => /\p{L}/u.test(s.replace(/<[^>]*>/g, ''));
const isExternalUrl = (v) => /^(https?:|mailto:|tel:|data:)/i.test(v);

function listPages() {
  return readdirSync(ROOT)
    .filter((f) => f.endsWith('.html') && !EXCLUDE.has(f))
    .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
}

// urlPath relative to site root, '' for the home page.
const urlPathOf = (file) => (file === 'index.html' ? '' : file);
const localeUrl = (loc, file) => `${BASE}/${loc === 'en' ? '' : loc + '/'}${urlPathOf(file)}`;
// Root-absolute switcher hrefs (work from any directory depth).
const localeHref = (loc, file) => `/${loc === 'en' ? '' : loc + '/'}${urlPathOf(file)}`;

const loc = (n) => n.sourceCodeLocation;
const tag = (n) => n.tagName;
const isElement = (n) => !!n.tagName;
const isText = (n) => n.nodeName === '#text';
const attrOf = (n, name) => (n.attrs || []).find((a) => a.name === name)?.value;

// Does this subtree contain any translatable bare text (ignoring opaque subtrees)?
function hasText(node) {
  if (isText(node)) return /\S/.test(node.value);
  if (isElement(node) && OPAQUE.has(tag(node))) return false;
  return (node.childNodes || []).some(hasText);
}

// ---- extraction ---------------------------------------------------------
// Walk the tree collecting: text units (with source ranges), attribute units,
// and structural anchors (html lang, canonical href, .nav-cta, <main>, </head>).
function analyze(html) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const units = [];   // { start, end, msgid, kind }
  const anchors = { htmlLang: null, canonicalHref: null, navCta: null, main: null };

  // text units via phrasing-run grouping
  function runMember(c) {
    if (isText(c)) return true;
    if (!isElement(c)) return false;            // comments: ignore
    if (INLINE.has(tag(c))) return hasText(c);  // inline w/ text joins the run; icon-only inline is a boundary
    return false;                                // block element: boundary
  }
  function addUnit(start, end) {
    let s = start, e = end;
    while (s < e && /\s/.test(html[s])) s++;
    while (e > s && /\s/.test(html[e - 1])) e--;
    if (e <= s) return;
    const msgid = html.slice(s, e);
    if (!hasLetter(msgid)) return;
    units.push({ start: s, end: e, msgid, kind: 'text' });
  }
  function flush(run) {
    if (!run.length) return;
    const bare = run.some((n) => isText(n) && /\S/.test(n.value));
    if (bare) {
      addUnit(loc(run[0]).startOffset, loc(run[run.length - 1]).endOffset);
    } else {
      for (const n of run) if (isElement(n) && INLINE.has(tag(n)) && !OPAQUE.has(tag(n))) walkText(n);
    }
  }
  function walkText(node) {
    let run = [];
    for (const c of node.childNodes || []) {
      if (runMember(c)) { run.push(c); continue; }
      flush(run); run = [];
      if (isElement(c) && !OPAQUE.has(tag(c)) && !INLINE.has(tag(c))) walkText(c); // recurse blocks
    }
    flush(run);
  }

  // attributes + anchors via a plain DFS (not descending opaque subtrees)
  function walkAttrs(node) {
    if (isElement(node)) {
      const t = tag(node), L = loc(node);
      if (t === 'html' && L?.attrs?.lang) anchors.htmlLang = L.attrs.lang;
      if (t === 'link' && attrOf(node, 'rel') === 'canonical' && L?.attrs?.href) anchors.canonicalHref = L.attrs.href;
      if (t === 'main' && !anchors.main && L?.startTag) anchors.main = L.startTag.endOffset;
      if (t === 'div' && /\bnav-cta\b/.test(attrOf(node, 'class') || '') && !anchors.navCta && L?.startTag) {
        anchors.navCta = L.startTag.endOffset;
      }
      for (const a of node.attrs || []) {
        let translate = false;
        if (TEXT_ATTRS.has(a.name)) translate = true;
        else if (t === 'meta' && a.name === 'content') {
          const key = attrOf(node, 'name') || attrOf(node, 'property');
          if (META_CONTENT.has(key)) translate = true;
        }
        if (!translate) continue;
        const v = a.value;
        if (!v || !hasLetter(v) || isExternalUrl(v)) continue;
        const span = valueSpan(html, L?.attrs?.[a.name], v);
        if (span) units.push({ start: span.start, end: span.end, msgid: v, kind: 'attr' });
      }
      // JSON-LD structured data: translate the human-readable string values in place.
      if (t === 'script' && /application\/ld\+json/.test(attrOf(node, 'type') || '') && L?.startTag && L?.endTag) {
        extractJsonLd(L.startTag.endOffset, L.endTag.startOffset);
      }
      if (OPAQUE.has(t)) return; // don't descend opaque subtrees for attrs
    }
    for (const c of node.childNodes || []) walkAttrs(c);
  }

  // Pull translatable values (a whitelist of schema.org text keys) out of a JSON-LD block.
  function extractJsonLd(s, e) {
    const seg = html.slice(s, e);
    const re = /("(?:name|text|description|headline|alternateName|caption)"\s*:\s*")((?:[^"\\]|\\.)*)(")/g;
    let m;
    while ((m = re.exec(seg))) {
      const vStart = s + m.index + m[1].length;
      let clean;
      try { clean = JSON.parse('"' + m[2] + '"'); } catch { continue; }
      if (!hasLetter(clean)) continue;
      units.push({ start: vStart, end: vStart + m[2].length, msgid: clean, kind: 'jsonld' });
    }
  }

  walkText(doc);
  walkAttrs(doc);

  // Drop attribute units contained inside a text unit (translated inline as part of the block).
  units.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept = [];
  let coveredUntil = -1;
  for (const u of units) {
    if (u.start < coveredUntil) continue; // contained in / overlapping a larger earlier unit
    kept.push(u); coveredUntil = u.end;
  }
  return { units: kept, anchors };
}

// Resolve the byte range of an attribute *value* from parse5's `name="value"` span.
function valueSpan(html, attrLoc, value) {
  if (!attrLoc) return null;
  const sub = html.slice(attrLoc.startOffset, attrLoc.endOffset);
  const m = sub.match(/^([^=]*?)(\s*=\s*)(['"]?)([\s\S]*)\3\s*$/);
  if (!m || m[4] !== value) return null;
  const start = attrLoc.startOffset + m[1].length + m[2].length + m[3].length;
  return { start, end: start + value.length };
}

// ---- asset-path rewrite (for /fr, /es) ----------------------------------
// Relative asset URLs must resolve from the site root, not the locale subdir; in-locale
// .html links stay relative. Parse5-based (knows element/attribute boundaries, never
// touches script bodies) and run as a second pass over the already-translated HTML, so
// assets anywhere — including inside translated blocks — are covered.
const isRewritableAsset = (v) =>
  !!v && !isExternalUrl(v) && !v.startsWith('/') && !v.startsWith('#') && ASSET_RE.test(v);

function rewriteAssets(html) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const ops = [];
  const walk = (node) => {
    if (isElement(node)) {
      const L = loc(node);
      for (const a of node.attrs || []) {
        if (a.name !== 'href' && a.name !== 'src' && a.name !== 'srcset') continue;
        const span = valueSpan(html, L?.attrs?.[a.name], a.value);
        if (!span) continue;
        if (a.name === 'srcset') {
          const next = a.value.replace(/(^|,\s*)([^\s,]+)/g, (_m, p, u) => p + (isRewritableAsset(u) ? '/' + u : u));
          if (next !== a.value) ops.push({ start: span.start, end: span.end, text: next });
        } else if (isRewritableAsset(a.value)) {
          ops.push({ start: span.start, end: span.end, text: '/' + a.value });
        }
      }
      if (OPAQUE.has(tag(node))) return; // never rewrite inside <script>/<svg>/…
    }
    for (const c of node.childNodes || []) walk(c);
  };
  walk(doc);
  return applyOps(html, ops);
}

// ---- splice -------------------------------------------------------------
function applyOps(html, ops) {
  const sorted = [...ops].sort((a, b) => b.start - a.start || b.end - a.end);
  let out = html;
  let lastStart = Infinity;
  for (const op of sorted) {
    if (op.end > lastStart) continue; // skip overlaps defensively
    out = out.slice(0, op.start) + op.text + out.slice(op.end);
    lastStart = op.start;
  }
  return out;
}

// Remove previously-injected i18n chrome so re-runs are idempotent.
function stripChrome(html) {
  return html.replace(/[ \t]*<!--i18n:(alt|switch|legal)-->[\s\S]*?<!--\/i18n:\1-->\n?/g, '');
}

const OG_LOCALE = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

function headI18nBlock(file, locale) {
  const rows = ALL_LOCALES.map(
    (l) => `  <link rel="alternate" hreflang="${l}" href="${localeUrl(l, file)}" />`
  );
  rows.push(`  <link rel="alternate" hreflang="x-default" href="${localeUrl('en', file)}" />`);
  rows.push(`  <meta property="og:locale" content="${OG_LOCALE[locale]}" />`);
  for (const l of ALL_LOCALES) if (l !== locale) rows.push(`  <meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`);
  return `  <!--i18n:alt-->\n${rows.join('\n')}\n  <!--/i18n:alt-->\n`;
}

function switcher(file, current) {
  const links = ALL_LOCALES.map((l) => {
    const active = l === current ? ' class="is-active" aria-current="page"' : '';
    return `<a href="${localeHref(l, file)}" hreflang="${l}" lang="${l}"${active}>${LOCALE_SHORT[l]}</a>`;
  }).join('');
  return `<!--i18n:switch--><div class="lang-switch" role="navigation" aria-label="Language">${links}</div><!--/i18n:switch-->`;
}

function legalNote(locale) {
  const t = LEGAL_NOTE[locale];
  return `<!--i18n:legal--><p class="legal-i18n-note" lang="${locale}">${t}</p><!--/i18n:legal-->`;
}

// ---- per-locale render --------------------------------------------------
function render(html, file, locale, catalog, stats) {
  const { units, anchors } = analyze(html);
  const ops = [];

  if (locale !== 'en') {
    for (const u of units) {
      const id = sha(u.msgid);
      const t = catalog[id];
      stats.total++;
      if (t == null || t === '') { stats.missing.push({ id, msgid: u.msgid, file }); continue; }
      stats.done++;
      // JSON-LD values must be re-escaped for the JSON string they sit in.
      ops.push({ start: u.start, end: u.end, text: u.kind === 'jsonld' ? JSON.stringify(t).slice(1, -1) : t });
    }
  }

  // structural chrome (all locales)
  if (anchors.htmlLang) ops.push({ start: anchors.htmlLang.startOffset, end: anchors.htmlLang.endOffset, text: `lang="${locale}"` });
  if (anchors.canonicalHref) {
    const span = valueSpanFromLoc(html, anchors.canonicalHref);
    if (span) ops.push({ start: span.start, end: span.end, text: localeUrl(locale, file) });
  }
  if (anchors.navCta != null) ops.push({ start: anchors.navCta, end: anchors.navCta, text: switcher(file, locale) });
  const headIdx = html.indexOf('</head>');
  if (headIdx >= 0) ops.push({ start: headIdx, end: headIdx, text: headI18nBlock(file, locale) });
  if (locale !== 'en' && LEGAL.has(file) && anchors.main != null) {
    ops.push({ start: anchors.main, end: anchors.main, text: legalNote(locale) });
  }
  let out = applyOps(html, ops);
  if (locale !== 'en') out = rewriteAssets(out); // second pass: in-locale asset paths → root-absolute
  return out;
}

function valueSpanFromLoc(html, attrLoc) {
  const sub = html.slice(attrLoc.startOffset, attrLoc.endOffset);
  const m = sub.match(/^([^=]*?)(\s*=\s*)(['"])([\s\S]*?)\3/);
  if (!m) return null;
  const start = attrLoc.startOffset + m[1].length + m[2].length + m[3].length;
  return { start, end: start + m[4].length };
}

// ---- modes --------------------------------------------------------------
function loadCatalog(locale) {
  try { return JSON.parse(readFileSync(join(ROOT, 'i18n', `${locale}.json`), 'utf8')); }
  catch { return {}; }
}

function runExtract() {
  const pages = listPages();
  const strings = {};
  for (const file of pages) {
    const html = stripChrome(readFileSync(join(ROOT, file), 'utf8'));
    const { units } = analyze(html);
    for (const u of units) {
      const id = sha(u.msgid);
      if (!strings[id]) strings[id] = { en: u.msgid, kind: u.kind, pages: [] };
      if (!strings[id].pages.includes(file)) strings[id].pages.push(file);
    }
  }
  const out = { base: BASE, locales: TARGET_LOCALES, count: Object.keys(strings).length, strings };
  mkdirSync(join(ROOT, 'i18n'), { recursive: true });
  writeFileSync(join(ROOT, 'i18n', 'source.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(`extracted ${out.count} unique strings across ${pages.length} pages → i18n/source.json`);
}

function runBuild({ write }) {
  const pages = listPages();
  const catalogs = Object.fromEntries(TARGET_LOCALES.map((l) => [l, loadCatalog(l)]));
  const report = {};
  for (const locale of ALL_LOCALES) {
    const stats = { total: 0, done: 0, missing: [] };
    for (const file of pages) {
      const raw = stripChrome(readFileSync(join(ROOT, file), 'utf8'));
      const out = render(raw, file, locale, catalogs[locale] || {}, stats);
      if (write) {
        const dir = locale === 'en' ? ROOT : join(ROOT, locale);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, file), out);
      }
    }
    report[locale] = stats;
  }
  for (const locale of TARGET_LOCALES) {
    const s = report[locale];
    const pct = s.total ? ((s.done / s.total) * 100).toFixed(1) : '0.0';
    console.log(`${locale}: ${s.done}/${s.total} strings (${pct}%)${s.missing.length ? `  — ${s.missing.length} missing` : ' ✓'}`);
    if (MODE === 'report') {
      const byId = new Map();
      for (const m of s.missing) if (!byId.has(m.id)) byId.set(m.id, m);
      for (const m of [...byId.values()].slice(0, 40)) console.log(`   [${m.id}] ${m.msgid.slice(0, 80).replace(/\s+/g, ' ')}`);
      if (byId.size > 40) console.log(`   … ${byId.size - 40} more unique`);
    }
  }
  if (write) {
    emitSitemap();
    console.log(`generated /${TARGET_LOCALES.join(', /')} + augmented EN in place + sitemap.xml`);
  }
}

// Regenerate sitemap.xml: one <url> per (page × locale), each carrying the full
// set of xhtml:link hreflang alternates (Google's documented i18n method). The
// page set + lastmod/changefreq/priority are read from the existing sitemap so
// editorial SEO choices are preserved; only the locale fan-out is added.
function emitSitemap() {
  let xml;
  try { xml = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8'); } catch { return; }
  const entries = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = m[1];
    const locM = block.match(/<loc>\s*([^<]+?)\s*<\/loc>/);
    if (!locM) continue;
    const loc = locM[1];
    if (!loc.startsWith(BASE)) continue;
    let rel = loc.slice(BASE.length).replace(/^\//, '');           // '' for home
    if (rel === '' ) rel = 'index.html';
    rel = rel.split(/[?#]/)[0];
    const file = rel === 'index.html' ? 'index.html' : rel;
    const grab = (t) => (block.match(new RegExp(`<${t}>\\s*([^<]+?)\\s*</${t}>`)) || [])[1];
    entries.push({ file, lastmod: grab('lastmod'), changefreq: grab('changefreq'), priority: grab('priority') });
  }
  const known = new Set(listPages());
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
  for (const e of entries) {
    const translated = known.has(e.file);
    const locales = translated ? ALL_LOCALES : ['en'];
    const alts = translated
      ? [...ALL_LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localeUrl(l, e.file)}" />`),
         `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl('en', e.file)}" />`].join('\n')
      : null;
    for (const l of locales) {
      lines.push('  <url>');
      lines.push(`    <loc>${localeUrl(l, e.file)}</loc>`);
      if (alts) lines.push(alts);
      if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority) lines.push(`    <priority>${e.priority}</priority>`);
      lines.push('  </url>');
    }
  }
  lines.push('</urlset>', '');
  writeFileSync(join(ROOT, 'sitemap.xml'), lines.join('\n'));
}

if (MODE === 'extract') runExtract();
else if (MODE === 'report') runBuild({ write: false });
else runBuild({ write: true });
