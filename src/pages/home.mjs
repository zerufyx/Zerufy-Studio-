import { chooser } from './vertical.mjs';
import { esc, icon } from '../core.mjs';
import { btn, img, phone, stage, lines, ctaBand } from '../components.mjs';
import { services } from '../../content/services.mjs';
import { projects } from '../../content/projects.mjs';
import { process } from '../../content/studio.mjs';
import { organization, website } from '../seo.mjs';

const pad = (n) => String(n).padStart(2, '0');
const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

// Vista previa de cada servicio (captura real o demostración marcada)
const preview = {
  websites: { src: 'jircars-desktop-800', w: 800, h: 500, wide: true },
  catalogs: { src: 'aureon-catalogo', w: 540, h: 1169 },
  menus: { src: 's91-menu', w: 540, h: 1169 },
  booking: { src: 'ibrows-servicios', w: 540, h: 1169 },
  systems: { src: 's91-panel-edit', w: 540, h: 1169 },
};

// Tarjetas del hero: interfaces reales que flotan detrás de la tipografía
const heroCards = [
  { src: 'ibrows-desktop-800', w: 800, h: 500, cls: 'hc-1 is-web', depth: 0.35 },
  { src: 's91-bebidas', w: 540, h: 1169, cls: 'hc-2', depth: 0.8 },
  { src: 'aureon-catalogo', w: 540, h: 1169, cls: 'hc-3', depth: 0.55 },
  { src: 'jircars-desktop-800', w: 800, h: 500, cls: 'hc-4 is-web', depth: 0.45 },
  { src: 's91-panel-edit', w: 540, h: 1169, cls: 'hc-5', depth: 1 },
  { src: 'ibrows-servicios', w: 540, h: 1169, cls: 'hc-6', depth: 0.7 },
  { src: 'offsuite-catalogo', w: 540, h: 1169, cls: 'hc-7', depth: 0.6 },
];

// La instalación: una misma pantalla que se transforma en cinco negocios
const scenes = [
  // tour: captura larga del negocio real que baja sola; splash: su pantalla de logo; fixed: encabezado fijo
  { k: 'Sitio con reservas', who: 'I Brows', note: 'Concepto', shape: 'phone', tour: 'ibrows', w: 900, h: 5843, splash: true, fixed: true },
  { k: 'Sitio web', who: 'Jircars', note: 'Concepto', shape: 'web', tour: 'jircars', w: 1440, h: 2700, splash: true, fixed: true },
  { k: 'Catálogo digital', who: 'Aureon', note: 'Concepto', shape: 'phone', tour: 'aureon', w: 900, h: 5843, splash: true, fixed: true },
  { k: 'Menú digital', who: 'S91 House Grill', note: 'En línea', shape: 'phone', tour: 's91', w: 900, h: 5843, splash: true, fixed: false },
  { k: 'Catálogo con carrito', who: 'Offsuite', note: 'Concepto', shape: 'phone', tour: 'offsuite', w: 900, h: 5843, splash: false, fixed: true },
];
// Tiempos del recorrido (ms): logo, bajada y pausa al final
const tourTime = (s) => { const start = s.splash ? 2300 : 1100; const run = s.shape === 'web' ? 6500 : 7500; return { start, run, total: start + run + 1700 }; };

const sysSteps = ['Agregar producto', 'Cambiar precio', 'Marcar agotado', 'Editar menú', 'Recibir pedido'];

function featured(ctx, p, layout, n) {
  const href = ctx.url(`/projects/${p.slug}/`);
  const meta = `<p class="fx-meta"><span class="fx-idx">${pad(n)}</span><span>${esc(p.name)}</span><span>${esc(p.meta)}</span></p>`;
  const body = `<div class="fx-body">
      <h3 class="fx-title">${esc(p.name)}</h3>
      <p class="fx-sum">${esc(p.summary)}</p>
      ${p.slug === 'zerufy' ? '<p class="fx-note">Caja e inventario con datos de ejemplo.</p>' : ''}
      <span class="fx-go">Abrir proyecto ${icon('arrow', 'ic ic-go')}</span>
    </div>`;
  let media;
  if (layout === 'asym') {
    media = `<div class="fx-media fx-asym-media" data-clip>
      <div class="browser">${img(ctx, p.web.src, { alt: p.web.alt, w: 1440, h: 900 })}</div>
      ${phone(ctx, { src: p.phones[1].src, alt: p.phones[1].alt, cls: 'fx-float' })}
    </div>`;
  } else if (layout === 'strip') {
    media = `<div class="fx-media fx-strip" data-clip style="--tint:${p.tint}">${p.phones.map((s) => phone(ctx, { src: s.src, alt: s.alt })).join('')}</div>`;
  } else {
    media = `<div class="fx-media" data-clip>${stage(ctx, p)}</div>`;
  }
  return `<article class="fx fx-${layout}">
  <a class="fx-link" href="${href}" data-cursor="Abrir">
    ${meta}
    ${media}
    ${body}
  </a>
</article>`;
}

function moreCard(ctx, p) {
  return `<li class="mw">
  <a href="${ctx.url(`/projects/${p.slug}/`)}" data-cursor="Abrir">
    ${stage(ctx, p)}
    <span class="mw-name">${esc(p.name)}</span>
    <span class="mw-meta">${esc(p.meta)}</span>
  </a>
</li>`;
}

export default function home(ctx) {
  const list = services.filter((s) => preview[s.key]);
  const [f1, f2, f3, f4, f5] = ['ibrows', 's91-house-grill', 'offsuite', 'jircars', 'zerufy'].map((k) => bySlug[k]);
  const more = ['aureon', 'amh-store', 'carpashop', 'panel-zerufy'].map((k) => bySlug[k]);
  const thumbs = { fresa: 's91-thumb-fresa', mora: 's91-thumb-mora', pina: 's91-thumb-pina', nestea: 's91-thumb-nestea' };
  const th = (k) => `<img src="${ctx.asset(`/assets/img/work/${thumbs[k]}.webp`)}" alt="" width="160" height="160" loading="lazy" decoding="async">`;

  const main = `
<section class="hx" aria-labelledby="hero-t" data-hero>
  <div class="hx-field" aria-hidden="true">
    ${heroCards
      .map(
        (c, i) => `<div class="hc ${c.cls}" data-depth="${c.depth}" style="--i:${i}"><div class="hc-in">${
          c.cls.includes('is-web') ? '<div class="hc-bar"><i></i><i></i><i></i></div>' : ''
        }<img src="${ctx.asset(`/assets/img/work/${c.src}.webp`)}" alt="" width="${c.w}" height="${c.h}" ${i < 3 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div></div>`
      )
      .join('')}
  </div>
  <div class="wrap hx-inner">
    <h1 class="hx-t" id="hero-t">${lines(['Creamos', 'experiencias', '<em>digitales</em><span class="hx-dot" data-dot>.</span>'])}</h1>
    <div class="hx-foot">
      <p class="hx-lead">Sitios web, catálogos, menús, tiendas y sistemas hechos a la medida de cómo funciona tu negocio.</p>
      <div class="hx-actions">
        ${btn(ctx.url('/portfolio/'), 'Ver trabajos', { size: 'lg', arrow: true, cls: 'magnetic' })}
        ${btn(ctx.url('/contact/'), 'Empezar un proyecto', { variant: 'ghost', size: 'lg', arrow: true, cls: 'magnetic' })}
      </div>
    </div>
  </div>
</section>

<section class="inst" data-carousel aria-labelledby="inst-t">
  <div class="inst-pin">
    <div class="wrap inst-grid">
      <div class="inst-copy">
        <h2 class="inst-t" id="inst-t">${lines(['Tu negocio.', '<em>En línea.</em>'])}</h2>
        <p class="inst-sub">Un estudio. Negocios distintos.</p>
        <ol class="inst-list" role="list">
          ${scenes
            .map(
              (s, i) => `<li data-i="${i}" tabindex="0" role="button" aria-label="Ver ${esc(s.k)}: ${esc(s.who)}"><span class="inst-n">${pad(i + 1)}</span><span class="inst-k">${esc(s.k)}</span><span class="inst-who">${esc(s.who)}<small>${esc(s.note)}</small></span></li>`
            )
            .join('')}
        </ol>
      </div>
      <div class="inst-stage">
        <div class="dev" data-dev>
          <div class="dev-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="dev-screen">
            ${scenes
              .map(
                (s, i) => {
                if (!s.tour) {
                  return `<figure class="dev-scene is-${s.shape}" data-i="${i}" data-dur="4200">
              <img src="${ctx.asset(`/assets/img/work/${s.src}.webp`)}" alt="${esc(s.k)}: ${esc(s.who)}" width="${s.w}" height="${s.h}" loading="lazy" decoding="async">
            </figure>`;
                }
                const t = tourTime(s);
                const src = (n) => ctx.asset(`/assets/img/tour/${s.tour}-${n}.webp`);
                return `<figure class="dev-scene is-${s.shape} is-tour" data-i="${i}" data-dur="${t.total}" style="--t-start:${t.start}ms;--t-run:${t.run}ms">
              <div class="tour-page"><img class="tour-img" src="${src('tall')}" alt="${esc(s.k)}: ${esc(s.who)}" width="${s.w}" height="${s.h}" loading="lazy" decoding="async"></div>
              ${s.fixed ? `<img class="tour-fixed" src="${src('fixed')}" alt="" loading="lazy" decoding="async">` : ''}
              ${s.splash ? `<img class="tour-splash" src="${src('splash')}" alt="" loading="lazy" decoding="async">` : ''}
            </figure>`;
              }
              )
              .join('')}
          </div>
        </div>
        <div class="inst-foot">
          <p class="inst-count"><span data-count>01</span> / ${pad(scenes.length)}</p>
          <div class="inst-dots">${scenes.map((s, i) => `<button type="button" data-i="${i}" aria-label="Ver ${esc(s.k)}"></button>`).join('')}</div>
          <p class="inst-mob"><span data-mob-k>${esc(scenes[0].k)}</span><small data-mob-who>${esc(scenes[0].who)} · ${esc(scenes[0].note)}</small></p>
        </div>
      </div>
    </div>
    <div class="inst-bar" aria-hidden="true"><i></i></div>
  </div>
</section>

<section class="section ng-sec" aria-labelledby="ng-t">
  <div class="wrap">
    <header class="sec-head ng-head">
      <h2 class="h2" id="ng-t">${lines(['¿Qué negocio', '<em>tienes?</em>'])}</h2>
      <p class="lead">Elige el tuyo y mira en un minuto lo que te entregamos y cómo lo manejas tú.</p>
    </header>
    ${chooser(ctx)}
  </div>
</section>

<section class="section svx-sec" aria-labelledby="svc-t">
  <div class="wrap">
    <h2 class="h2 svx-h" id="svc-t">${lines(['Lo que', '<em>construimos.</em>'])}</h2>
    <ul class="svx" role="list" data-svx>
      ${list
        .map((s, i) => {
          const pv = preview[s.key];
          const src = ctx.asset(`/assets/img/work/${pv.src}.webp`);
          return `<li class="svx-row">
        <a href="${ctx.url(s.path)}" data-preview="${src}" data-wide="${pv.wide ? 1 : 0}">
          <span class="svx-n">${pad(i + 1)}</span>
          <span class="svx-name">${esc(s.name)}</span>
          <span class="svx-d">${esc(s.outcome)}</span>
          <span class="svx-go" aria-hidden="true">${icon('arrow')}</span>
          <span class="svx-thumb${pv.wide ? ' is-wide' : ''}" aria-hidden="true"><img src="${src}" alt="" width="${pv.w}" height="${pv.h}" loading="lazy" decoding="async"></span>
        </a>
      </li>`;
        })
        .join('')}
    </ul>
    <p class="svx-soon">Apps móviles: <a class="link" href="${ctx.url('/apps/')}">próximamente</a>.</p>
  </div>
  <div class="svx-float" aria-hidden="true" data-svx-float><img src="${ctx.asset(`/assets/img/work/${preview.websites.src}.webp`)}" alt="" width="800" height="500" decoding="async" loading="lazy"></div>
</section>

<section class="section sel" aria-labelledby="sel-t">
  <div class="wrap">
    <header class="sel-head">
      <h2 class="h2" id="sel-t">${lines(['Trabajo', '<em>seleccionado.</em>'])}</h2>
      <p class="lead">Clientes y conceptos, diseñados y construidos por Zerufy Studio.</p>
    </header>
    ${featured(ctx, f1, 'asym', 1)}
    ${featured(ctx, f2, 'full', 2)}
    ${featured(ctx, f3, 'strip', 3)}
    ${featured(ctx, f4, 'asym', 4)}
    ${featured(ctx, f5, 'strip', 5)}
  </div>
  <div class="mw-sec">
    <div class="wrap mw-head">
      <h3 class="h3">Más trabajos</h3>
      <div class="mw-ctrl">
        <button type="button" class="mw-btn" data-rail-prev aria-label="Anteriores">${icon('arrow', 'ic ic-flip')}</button>
        <button type="button" class="mw-btn" data-rail-next aria-label="Siguientes">${icon('arrow')}</button>
      </div>
    </div>
    <ul class="mw-rail" role="list" data-rail>${more.map((p) => moreCard(ctx, p)).join('')}</ul>
    <div class="wrap"><a class="link-go" href="${ctx.url('/portfolio/')}">Ver todos los trabajos ${icon('arrow', 'ic ic-go')}</a></div>
  </div>
</section>

<section class="sys" data-scrolly="${sysSteps.length}" aria-labelledby="sys-t">
  <div class="sys-pin">
    <div class="wrap sys-grid">
      <div class="sys-copy">
        <h2 class="h2" id="sys-t">${lines(['No es solo', '<em>una página.</em>'])}</h2>
        <p class="lead">Tu negocio debería poder manejar su lado digital solo.</p>
        <ol class="sys-steps" role="list">${sysSteps.map((t, i) => `<li data-i="${i}"><span>${pad(i + 1)}</span>${esc(t)}</li>`).join('')}</ol>
        <p class="sys-note">Demostración con productos del menú de S91 House Grill.</p>
      </div>
      <div class="sys-app" data-sys aria-hidden="true">
        <div class="app">
          <div class="app-top">
            <span class="app-brand"><b>S91</b> House Grill</span>
            <span class="app-user">Panel</span>
          </div>
          <div class="app-tabs"><span class="on">Menú</span><span class="app-orders">Pedidos<i>1</i></span><span>Ajustes</span></div>
          <div class="app-toast" data-toast></div>
          <div class="app-list">
            <p class="app-cat">Hamburguesas <span>2</span></p>
            <div class="app-row r-imp no-ph"><div class="app-info"><b>S91 Imperial House</b><small>Mixta: pollo y picanha</small><em class="app-fav">Favorito</em></div><span class="app-price">$19.99</span><span class="sw on"></span></div>
            <div class="app-row no-ph"><div class="app-info"><b>Valiosa</b><small>Lechuga, tomate, queso, huevo y jamón</small></div><span class="app-price">$17.99</span><span class="sw on"></span></div>
            <p class="app-cat">Bebidas <span class="app-count">3</span></p>
            <div class="app-row r-new">${th('nestea')}<div class="app-info"><b>Nestea de limón</b><small>Té frío</small></div><span class="app-price">$4.20</span><span class="sw on"></span></div>
            <div class="app-row r-fresa">${th('fresa')}<div class="app-info"><b>Jugo de fresa</b><small>Natural, hecho al momento</small></div><span class="app-price"><span class="pr-old">$5.99</span><span class="pr-new">$6.49</span></span><span class="sw on"></span></div>
            <div class="app-row r-mora">${th('mora')}<div class="app-info"><b>Jugo de mora</b><small>Natural, hecho al momento</small><em class="app-out">Agotado</em></div><span class="app-price">$5.99</span><span class="sw on sw-mora"></span></div>
            <div class="app-row">${th('pina')}<div class="app-info"><b>Jugo de piña</b><small>Natural, hecho al momento</small></div><span class="app-price">$5.99</span><span class="sw on"></span></div>
          </div>
          <div class="app-sheet">
            <p class="app-sheet-t">Editar plato</p>
            <label>Nombre<span>S91 Imperial House</span></label>
            <label>Precio<span>$19.99</span></label>
            <label>Descripción<span>Mixta: pollo y picanha, con pico de gallo y aguacate</span></label>
            <div class="app-sheet-sw"><span>Favorito de la casa</span><span class="sw sw-fav"></span></div>
            <span class="app-save">Guardar</span>
          </div>
          <div class="app-order">
            <span class="app-order-ic">${icon('whatsapp')}</span>
            <div><b>Nuevo pedido</b><small>2 × S91 Imperial House, 1 × Jugo de fresa</small></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section proc" id="proceso" aria-labelledby="proc-t">
  <div class="wrap">
    <h2 class="h2" id="proc-t">${lines(['Cómo', '<em>trabajamos.</em>'])}</h2>
    <ol class="tl" role="list" data-tl>
      <li class="tl-line" aria-hidden="true"><i></i></li>
      ${process.map((s, i) => `<li class="tl-step"><span class="tl-n">${pad(i + 1)}</span><div><h3 class="tl-t">${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section mani" aria-labelledby="mani-t">
  <div class="wrap">
    <h2 class="mani-t" id="mani-t">${lines(['No hacemos', 'páginas web', '<em>por hacerlas.</em>'])}</h2>
    <p class="mani-p" data-words>Construimos el lado digital de tu negocio: el lugar donde los clientes te descubren, entienden lo que ofreces y dan el siguiente paso.</p>
  </div>
</section>

<section class="section idn" aria-labelledby="idn-t">
  <div class="wrap">
    <h2 class="sr" id="idn-t">La identidad de Zerufy Studio</h2>
    <div class="idn-grid">
      <p class="idn-word" aria-hidden="true"><span>Zerufy<br>Studio<span class="idn-dot">.</span></span></p>
      <div class="idn-cell idn-bebas">
        <span class="idn-aa">Aa</span>
        <p class="idn-name">Bebas Neue</p>
        <p class="idn-use">Titulares. Siempre en mayúsculas.</p>
        <p class="idn-abc">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ 0123456789</p>
      </div>
      <div class="idn-cell idn-mont">
        <span class="idn-aa">Aa</span>
        <p class="idn-name">Montserrat</p>
        <p class="idn-use">Textos. Directo y fácil de leer.</p>
        <p class="idn-abc">Construimos el lado digital de tu negocio.</p>
      </div>
      <div class="idn-sw sw-k"><span>Negro</span><code>#0A0A0A</code></div>
      <div class="idn-sw sw-w"><span>Blanco</span><code>#F4F4F4</code></div>
      <div class="idn-sw sw-r"><span>Rojo Zerufy</span><code>#E8352A</code></div>
    </div>
    <p class="idn-note">La marca también es un proyecto. Le ponemos a la tuya el mismo cuidado.</p>
  </div>
</section>

${ctaBand(ctx)}
`;

  return {
    path: '/',
    title: 'Zerufy Studio | Experiencias digitales para negocios',
    ogTitle: 'Zerufy Studio: creamos experiencias digitales',
    description: 'Estudio digital en Orlando: sitios web, catálogos, menús digitales, reservas y sistemas hechos a la medida de cómo funciona tu negocio.',
    schema: [organization(ctx), website(ctx)],
    mainClass: 'home',
    main,
    priority: '1.0',
  };
}
