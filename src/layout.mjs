// Estructura de cada documento: <head> con SEO, encabezado, pie y barra móvil.
import { esc, icon, wordmark, wa } from './core.mjs';
import { services } from '../content/services.mjs';

const NAV = [
  { href: '/negocios/', label: 'Tu negocio', match: '/negocios/' },
  { href: '/portfolio/', label: 'Trabajos', match: '/portfolio/' },
  { href: '/services/', label: 'Servicios', match: '/services/' },
  { href: '/about/', label: 'Nosotros', match: '/about/' },
];

export function publicConfig(config) {
  const i = config.integrations;
  return {
    whatsapp: config.contact.whatsapp,
    whatsappMessage: config.contact.whatsappMessage,
    supabase: i.supabase.url && i.supabase.anonKey ? { url: i.supabase.url, anonKey: i.supabase.anonKey, table: i.supabase.table } : null,
    webhook: i.webhook || null,
    ga4: i.ga4 || null,
    metaPixel: i.metaPixel || null,
    clarity: i.clarity || null,
  };
}

// Etiquetas de verificación de dominio (Search Console, Meta). Solo si están configuradas.
function verify(config) {
  const v = (config.integrations && config.integrations.verification) || {};
  return [
    v.google ? `\n<meta name="google-site-verification" content="${esc(v.google)}">` : '',
    v.meta ? `\n<meta name="facebook-domain-verification" content="${esc(v.meta)}">` : '',
  ].join('');
}

function head(ctx, p) {
  const { config } = ctx;
  const canonical = ctx.abs(p.path);
  const og = ctx.abs('/assets/img/' + (p.ogImage || 'og-default.jpg'));
  const fonts =
    ctx.mode === 'preview'
      ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;family=Montserrat:wght@400..800&amp;display=swap">`
      : `<link rel="preload" href="${ctx.asset('/assets/fonts/bebas-neue.woff2')}" as="font" type="font/woff2" crossorigin><link rel="preload" href="${ctx.asset('/assets/fonts/montserrat-var.woff2')}" as="font" type="font/woff2" crossorigin>`;
  const schema = (p.schema || []).map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n');
  // En la vista previa (Artifact) la portada lleva solo el nombre de la marca.
  const docTitle = ctx.mode === 'preview' && p.path === '/' ? ctx.config.name : p.title;
  return `<title>${esc(docTitle)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="robots" content="${p.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#0a0a0a">${verify(config)}
<meta name="color-scheme" content="dark">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${esc(config.name)}">
<meta property="og:locale" content="${config.locale}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.ogTitle || p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="${ctx.asset('/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.asset('/apple-touch-icon.png')}">
<link rel="manifest" href="${ctx.asset('/site.webmanifest')}">
${fonts}
<link rel="stylesheet" href="${ctx.asset(ctx.mode === 'preview' ? '/assets/css/site.preview.css' : '/assets/css/site.css')}">
${schema}
<script>document.documentElement.classList.add('js');window.DS=${JSON.stringify(publicConfig(config))};</script>
<script defer src="${ctx.asset('/assets/js/site.js')}"></script>
${p.scripts ? p.scripts.map((s) => `<script defer src="${ctx.asset(s)}"></script>`).join('\n') : ''}`;
}

function header(ctx) {
  const links = NAV.map(
    (n) => `<li><a href="${ctx.url(n.href)}"${n.match !== '#' && ctx.isActive(n.match) ? ' aria-current="page"' : ''}>${n.label}</a></li>`
  ).join('');
  const bigLinks = NAV.concat([{ href: '/contact/', label: 'Contacto', match: '/contact/' }])
    .map((n, i) => `<li style="--i:${i}"><a href="${ctx.url(n.href)}"${n.match !== '#' && ctx.isActive(n.match) ? ' aria-current="page"' : ''}><span class="sheet-n">${String(i + 1).padStart(2, '0')}</span>${n.label}</a></li>`)
    .join('');
  const sheetServices = services
    .map((s) => `<li><a href="${ctx.url(s.path)}">${esc(s.name)}</a></li>`)
    .join('');
  return `<a class="skip" href="#main">Saltar al contenido</a>
<header class="site-head" data-head>
  <div class="wrap head-row">
    <a class="brand" href="${ctx.url('/')}" aria-label="Zerufy Studio, inicio">${wordmark()}</a>
    <nav class="nav" aria-label="Principal"><ul>${links}</ul></nav>
    <a class="head-cta" href="${ctx.url('/contact/')}"><span>Empezar un proyecto</span>${icon('arrow', 'ic ic-go')}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-sheet" data-menu-btn>
      <span class="menu-lines" aria-hidden="true"><i></i><i></i></span>
      <span class="sr">Menú</span>
    </button>
  </div>
  <div class="sheet" id="menu-sheet" data-sheet>
    <div class="wrap sheet-inner">
      <ul class="sheet-main">${bigLinks}</ul>
      <p class="sheet-label">Servicios</p>
      <ul class="sheet-services">${sheetServices}</ul>
      <div class="sheet-actions">
        <a class="btn btn-primary btn-lg" href="${ctx.url('/contact/')}"><span>Empezar un proyecto</span>${icon('arrow', 'ic ic-go')}</a>
        <a class="btn btn-ghost btn-lg" href="${wa(ctx.config)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a>
      </div>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { contact } = ctx.config;
  const year = new Date().getFullYear();
  const svc = services.map((s) => `<li><a href="${ctx.url(s.path)}">${esc(s.name)}${s.status === 'soon' ? ' (pronto)' : ''}</a></li>`).join('');
  return `<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="${ctx.url('/')}" aria-label="Zerufy Studio, inicio">${wordmark()}</a>
        <p>Páginas web, menús digitales, catálogos, citas y sistemas, con tu panel para manejarlos tú mismo.</p>
      </div>
      <nav aria-label="Servicios"><h2 class="foot-h">Servicios</h2><ul>${svc}</ul></nav>
      <nav aria-label="Estudio"><h2 class="foot-h">Estudio</h2><ul>
        <li><a href="${ctx.url('/negocios/')}">Tu negocio</a></li>
        <li><a href="${ctx.url('/portfolio/')}">Trabajos</a></li>
        <li><a href="${ctx.url('/#proceso')}">Proceso</a></li>
        <li><a href="${ctx.url('/about/')}">Nosotros</a></li>
        <li><a href="${ctx.url('/contact/')}">Empezar un proyecto</a></li>
      </ul></nav>
      <div><h2 class="foot-h">Contacto</h2><ul>
        <li><a href="${wa(ctx.config)}" target="_blank" rel="noopener">WhatsApp <span class="nowrap">${esc(contact.whatsappDisplay)}</span></a></li>
        ${contact.email ? `<li><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>` : ''}
        ${contact.instagram ? `<li><a href="https://instagram.com/${esc(contact.instagram)}" target="_blank" rel="noopener">Instagram @${esc(contact.instagram)}</a></li>` : ''}
        ${contact.tiktok ? `<li><a href="https://tiktok.com/@${esc(contact.tiktok)}" target="_blank" rel="noopener">TikTok @${esc(contact.tiktok)}</a></li>` : ''}
        <li>Orlando, Florida</li>
      </ul></div>
    </div>
    <p class="foot-word" aria-hidden="true">Zerufy Studio<span class="dot">.</span></p>
    <div class="foot-base"><span>© ${year} ${esc(ctx.config.legalName)}</span><a href="${ctx.url('/privacidad/')}">Privacidad</a><span>Atendemos en español e inglés</span></div>
  </div>
</footer>`;
}

function dock(ctx) {
  return `<div class="dock" data-dock>
  <a class="btn btn-primary" href="${ctx.url('/contact/')}"><span>Empezar un proyecto</span></a>
  <a class="btn btn-ghost btn-icon" href="${wa(ctx.config)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${icon('whatsapp')}</a>
</div>`;
}

/* ---------- Entrada de la portada ----------
   El punto rojo de la marca aparece, escribe ZERUFY STUDIO, crece hasta cubrir
   la pantalla y sube como una cortina. Una vez por sesión; un toque la salta.
   Los tiempos (ms) tienen que coincidir con las animaciones .intro en site.css. */
const INTRO_HEAD = `(function(){try{if(location.hash||sessionStorage.getItem('zs-intro'))return;document.documentElement.classList.add('has-intro');}catch(e){}})();`;

const INTRO_RUN = `(function(){
var h=document.documentElement,el=document.querySelector('[data-intro]');if(!el)return;
if(!h.classList.contains('has-intro')){el.parentNode.removeChild(el);return;}
try{sessionStorage.setItem('zs-intro','1');}catch(e){}
var w=window,reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var T=reduce?{reveal:950,end:1350}:{reveal:2380,end:3150};
var timers=[],done=false,dot=el.querySelector('.intro-dot');
function reveal(){if(w.__introRevealed)return;w.__introRevealed=true;document.dispatchEvent(new Event('intro:reveal'));}
function end(){if(done)return;done=true;timers.forEach(clearTimeout);off();reveal();h.classList.remove('has-intro');if(el.parentNode)el.parentNode.removeChild(el);}
function skip(){if(done||el.classList.contains('is-skip'))return;el.classList.add('is-skip');reveal();timers.forEach(clearTimeout);timers=[setTimeout(end,340)];}
var evs=['pointerdown','wheel','keydown','touchstart'];
function on(){evs.forEach(function(e){w.addEventListener(e,skip,{passive:true});});}
function off(){evs.forEach(function(e){w.removeEventListener(e,skip,{passive:true});});}
function go(){if(done)return;
var r=dot.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,W=w.innerWidth,H=w.innerHeight;
dot.style.setProperty('--sx',(W/2-cx).toFixed(1)+'px');dot.style.setProperty('--sy',(H/2-cy).toFixed(1)+'px');
dot.style.setProperty('--fs',Math.ceil(2*Math.max(cx,W-cx,cy,H-cy)/Math.max(r.width,1)*1.05+2));
el.classList.add('is-go');timers.push(setTimeout(reveal,T.reveal),setTimeout(end,T.end));}
on();timers.push(setTimeout(end,6500));
var f=document.fonts;
if(f&&f.load){Promise.race([f.load('1em "Bebas Neue"'),new Promise(function(r){setTimeout(r,800);})]).then(function(){requestAnimationFrame(go);},go);}
else go();
})();`;

function intro() {
  let n = 0;
  const word = (s, cls) => `<span class="iw ${cls}">${[...s].map((c) => `<span class="il" style="--i:${n++}">${c}</span>`).join('')}</span>`;
  return `<div class="intro" aria-hidden="true" data-intro>
  <div class="intro-panel">
    <div class="intro-c">
      <p class="intro-word"><span class="intro-mask">${word('Zerufy', 'iw-r')} ${word('Studio', '')}</span><i class="intro-dot"></i></p>
      <div class="intro-rule"><i></i></div>
      <div class="intro-meta"><span>Creamos experiencias digitales</span><span>Orlando, FL</span></div>
    </div>
  </div>
</div>
<script>${INTRO_RUN}</script>`;
}

/** Documento completo. En preview, la portada se publica sin <html>/<head>/<body>
 *  porque el Artifact le pone su propio esqueleto. */
export function document(ctx, p) {
  const bare = ctx.mode === 'preview' && p.path === '/';
  const isHome = p.path === '/';
  const body = `${isHome ? `<script>${INTRO_HEAD}</script>\n${intro()}\n` : ''}${header(ctx)}
<main id="main" class="${esc(p.mainClass || '')}">
${p.main}
</main>
${footer(ctx)}
${p.hideDock ? '' : dock(ctx)}`;
  if (bare) return `${head(ctx, p)}\n${body}\n`;
  return `<!doctype html>
<html lang="${ctx.config.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head(ctx, p)}
</head>
<body>
${body}
</body>
</html>
`;
}
