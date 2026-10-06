#!/usr/bin/env node
// Genera el sitio estático completo en /dist (o /preview con --preview).
// Sin dependencias: solo Node 18+.
//
//   node scripts/build.mjs            → dist/     (para publicar)
//   node scripts/build.mjs --preview  → preview/  (rutas relativas, se abre sin servidor)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '../site.config.mjs';
import { makeCtx } from '../src/core.mjs';
import { document } from '../src/layout.mjs';
import { services } from '../content/services.mjs';
import { projects } from '../content/projects.mjs';

import home from '../src/pages/home.mjs';
import servicesPage from '../src/pages/services.mjs';
import servicePage from '../src/pages/service.mjs';
import portfolio from '../src/pages/portfolio.mjs';
import projectPage from '../src/pages/project.mjs';
import about from '../src/pages/about.mjs';
import contact from '../src/pages/contact.mjs';
import verticalPage, { verticalsIndex } from '../src/pages/vertical.mjs';
import { verticals } from '../content/verticals.mjs';
import { notFound, dashboard, privacy } from '../src/pages/misc.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv.includes('--preview') ? 'preview' : 'production';
const OUT = path.join(ROOT, mode === 'preview' ? 'preview' : 'dist');

// ── Rutas del sitio ────────────────────────────────────────────
const routes = [
  (ctx) => home(ctx),
  (ctx) => verticalsIndex(ctx),
  ...verticals.map((v) => (ctx) => verticalPage(ctx, v)),
  (ctx) => servicesPage(ctx),
  ...services.map((s) => (ctx) => servicePage(ctx, s)),
  (ctx) => portfolio(ctx),
  ...projects.map((p) => (ctx) => projectPage(ctx, p)),
  (ctx) => about(ctx),
  (ctx) => contact(ctx),
  (ctx) => privacy(ctx),
];
if (mode === 'production') routes.push((ctx) => notFound(ctx));
if (config.futureRoutes.dashboard.enabled) routes.push((ctx) => dashboard(ctx));

// Cada ruta necesita saber su propia URL para calcular enlaces relativos,
// así que primero se resuelve con un contexto temporal.
const probe = makeCtx({ pagePath: '/', mode, config });

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = [];
for (const route of routes) {
  const { path: pagePath } = route(probe);
  const ctx = makeCtx({ pagePath, mode, config });
  const page = route(ctx);
  const html = document(ctx, page);
  const file = pagePath.endsWith('/') ? path.join(OUT, pagePath, 'index.html') : path.join(OUT, pagePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  pages.push(page);
}

// ── Assets ─────────────────────────────────────────────────────
const copyDir = (from, to, filter = () => true) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b, filter);
    else if (filter(a)) fs.copyFileSync(a, b);
  }
};
copyDir(path.join(ROOT, 'assets/js'), path.join(OUT, 'assets/js'));
copyDir(path.join(ROOT, 'assets/img'), path.join(OUT, 'assets/img'), (f) => !f.endsWith('.png') || !/icon/.test(f));

const css = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');
fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true });
if (mode === 'preview') {
  // En preview la fuente viene de Google Fonts; se quita el @font-face local.
  fs.writeFileSync(path.join(OUT, 'assets/css/site.preview.css'), css.replace(/\/\* font:start \*\/[\s\S]*?\/\* font:end \*\//, ''));
} else {
  fs.writeFileSync(path.join(OUT, 'assets/css/site.css'), css);
  copyDir(path.join(ROOT, 'assets/fonts'), path.join(OUT, 'assets/fonts'));
}

fs.copyFileSync(path.join(ROOT, 'assets/img/favicon.svg'), path.join(OUT, 'favicon.svg'));
for (const f of ['apple-touch-icon.png', 'icon-512.png']) fs.copyFileSync(path.join(ROOT, 'assets/img', f), path.join(OUT, f));

fs.writeFileSync(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify(
    {
      name: config.name,
      short_name: 'Zerufy',
      lang: config.lang,
      start_url: config.basePath + '/',
      display: 'standalone',
      background_color: '#0a0a0a',
      theme_color: '#0a0a0a',
      icons: [
        { src: config.basePath + '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: config.basePath + '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2
  )
);

// ── SEO: sitemap, robots, dominio ──────────────────────────────
if (mode === 'production') {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noindex && p.sitemap !== false)
    .map((p) => `  <url><loc>${config.siteUrl + config.basePath + p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority || '0.5'}</priority></url>`)
    .join('\n');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: ${config.basePath}/dashboard/\n\nSitemap: ${config.siteUrl + config.basePath}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  const host = new URL(config.siteUrl).host;
  if (!config.basePath && !host.endsWith('.example') && !host.endsWith('github.io')) fs.writeFileSync(path.join(OUT, 'CNAME'), host + '\n');
}

console.log(`✓ ${pages.length} páginas generadas en ${path.relative(ROOT, OUT)}/ (${mode})`);
if (mode === 'production' && config.siteUrl.includes('.example')) {
  console.log('! siteUrl todavía es un dominio de ejemplo. Cámbialo en site.config.mjs antes de publicar.');
}
