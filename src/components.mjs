// Componentes reutilizables. Todos devuelven HTML como texto.
import { esc, icon, wa } from './core.mjs';
import { categories } from '../content/projects.mjs';

const catLabel = Object.fromEntries(categories.map((c) => [c.key, c.label]));

export function btn(href, label, { variant = 'primary', ic, external, track, cls = '', size = '', arrow = false } = {}) {
  const ext = external ? ' target="_blank" rel="noopener"' : '';
  const tr = track ? ` data-track="${track}"` : '';
  return `<a class="btn btn-${variant}${size ? ' btn-' + size : ''}${cls ? ' ' + cls : ''}" href="${href}"${ext}${tr}>${ic ? icon(ic) : ''}<span>${esc(label)}</span>${arrow ? icon('arrow', 'ic ic-go') : ''}</a>`;
}

/** Titular en líneas que aparecen de abajo hacia arriba. Acepta HTML (em). */
export function lines(list) {
  return list.map((l, i) => `<span class="line"><span style="--i:${i}">${l}</span></span>`).join('');
}

export function img(ctx, name, { alt = '', w, h, eager = false, cls = '', sizes, srcset } = {}) {
  const src = ctx.asset(`/assets/img/work/${name}.webp`);
  const ss = srcset ? ` srcset="${srcset.map(([n, sw]) => `${ctx.asset(`/assets/img/work/${n}.webp`)} ${sw}w`).join(', ')}"` : '';
  return `<img src="${src}"${ss}${sizes ? ` sizes="${sizes}"` : ''} alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''}>`;
}

/** Teléfono con una captura real dentro. scroll=true recorre la pantalla despacio. */
export function phone(ctx, { src, alt = '', eager = false, scroll = false, tall = 1169, cls = '', style = '' }) {
  return `<div class="phone${scroll ? ' is-scroll' : ''}${cls ? ' ' + cls : ''}"${style ? ` style="${style}"` : ''}><div class="phone-screen">${img(ctx, src, { alt, w: 540, h: tall, eager })}</div></div>`;
}

/** Escenario de un proyecto: teléfonos con capturas reales sobre el color del cliente. */
export function stage(ctx, p, { eager = false } = {}) {
  const shots = p.phones || [];
  const alt = (s) => s.alt || '';
  if (p.web) {
    return `<div class="stage is-web" style="--tint:${p.tint}">
      <div class="browser"><div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.urlLabel || '')}</span></div>${img(ctx, p.web.src, { alt: p.web.alt, w: 1440, h: p.web.h || 900, eager })}</div>
      ${shots.map((s) => phone(ctx, { src: s.src, alt: alt(s), eager })).join('')}
    </div>`;
  }
  return `<div class="stage${shots.length === 2 ? ' is-duo' : ''}" style="--tint:${p.tint}">${shots.map((s) => phone(ctx, { src: s.src, alt: alt(s), eager })).join('')}</div>`;
}

export function sectionHead(title, lead, { id, level = 2, cls = '' } = {}) {
  return `<header class="sec-head${cls ? ' ' + cls : ''}">
  <h${level} class="h2"${id ? ` id="${id}"` : ''}>${title}</h${level}>
  ${lead ? `<p class="lead">${lead}</p>` : ''}
</header>`;
}

export function serviceIndex(ctx, list) {
  return `<ul class="svc-index" role="list">${list
    .map(
      (s) => `<li><a href="${ctx.url(s.path)}">
    <span class="svc-name">${esc(s.name)}${s.status === 'soon' ? ' <span class="tag">Próximamente</span>' : ''}</span>
    <span class="svc-outcome">${esc(s.outcome)}</span>
    <span class="svc-arrow" aria-hidden="true">${icon('external')}</span>
  </a></li>`
    )
    .join('')}</ul>`;
}

/** Qué tarjetas van a lo ancho para que nunca quede una sola en una fila:
 *  impar → la primera; par (4+) → la primera y la última; 2 → ninguna. */
export function isBig(i, n) {
  if (n % 2 === 1) return i === 0;
  if (n >= 4) return i === 0 || i === n - 1;
  return false;
}

export function workGrid(ctx, list, { level = 3, eagerFirst = false } = {}) {
  return `<div class="work-grid" data-grid>${list.map((p, i) => workCard(ctx, p, { level, eager: eagerFirst && i === 0, big: isBig(i, list.length) })).join('')}</div>`;
}

export function workCard(ctx, p, { level = 3, eager = false, big = false } = {}) {
  return `<article class="work-card${big ? ' is-big' : ''}" data-cats="${p.categories.join(' ')}">
  <a class="work-link" href="${ctx.url(`/projects/${p.slug}/`)}" data-cursor="Abrir">
    ${stage(ctx, p, { eager })}
    <div class="work-meta">
      <p class="work-type">${esc(p.meta || p.type)}${p.kind === 'concept' ? ' <span class="tag">Concepto</span>' : ''}</p>
      <h${level} class="work-title">${esc(p.name)}</h${level}>
      <p class="work-sum">${esc(p.summary)}</p>
      <span class="work-go">Abrir proyecto ${icon('arrow', 'ic ic-go')}</span>
    </div>
  </a>
</article>`;
}

export function steps(list) {
  return `<ol class="steps" role="list">${list
    .map((s, i) => `<li><span class="n" aria-hidden="true">${i + 1}</span><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`)
    .join('')}</ol>`;
}

export function growthLine(list) {
  const col = (title, items) => `<div class="grow-col"><h3 class="grow-h">${title}</h3><ul class="svc-index" role="list">${items
    .map((g) => `<li><div class="grow-row"><span class="svc-name">${esc(g.t)}</span><span class="svc-outcome">${esc(g.d)}</span></div></li>`)
    .join('')}</ul></div>`;
  return `<div class="grow">${col('Hoy', list.filter((g) => g.now))}${col('Lo que viene', list.filter((g) => !g.now))}</div>`;
}

export function faqList(list, { id = 'faq' } = {}) {
  return `<div class="faq" id="${id}">
  ${list
    .map(
      (f, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
    <summary><h3 class="faq-q">${esc(f.q)}</h3><span class="faq-sign" aria-hidden="true"></span></summary>
    <div class="faq-a"><p>${esc(f.a)}</p></div>
  </details>`
    )
    .join('')}
</div>`;
}

/** Cierre de cada página: fondo negro, tipografía enorme. */
export function ctaBand(ctx, { q = '¿Tienes un negocio?', title = 'Construyamos su lado <em>digital.</em>', need } = {}) {
  const href = ctx.url('/contact/' + (need ? '#' + need : ''));
  return `<section class="fin" aria-labelledby="fin-t">
  <div class="wrap">
    <h2 class="fin-t" id="fin-t"><span class="line"><span class="fin-q">${esc(q)}</span></span><span class="line"><span style="--i:1">${title}</span></span></h2>
    <div class="fin-actions">
      ${btn(href, 'Empezar un proyecto', { size: 'lg', arrow: true, cls: 'magnetic' })}
      ${btn(ctx.url('/portfolio/'), 'Ver trabajos', { variant: 'ghost', size: 'lg', arrow: true, cls: 'magnetic' })}
    </div>
    <p class="fin-wa">¿Prefieres escribir? <a class="link" href="${wa(ctx.config)}" target="_blank" rel="noopener">WhatsApp ${esc(ctx.config.contact.whatsappDisplay)}</a></p>
  </div>
</section>`;
}

export function crumbs(ctx, items) {
  return `<nav class="crumbs" aria-label="Ruta"><ol>${items
    .map((it, i) => (i < items.length - 1 ? `<li><a href="${ctx.url(it.href)}">${esc(it.label)}</a></li>` : `<li aria-current="page">${esc(it.label)}</li>`))
    .join('')}</ol></nav>`;
}

export { catLabel };
