import { esc } from '../core.mjs';
import { btn } from '../components.mjs';

export function notFound(ctx) {
  const main = `
<section class="page-hero nf">
  <div class="wrap">
    <p class="display-2" aria-hidden="true">404</p>
    <h1 class="h2">Esta página no existe.</h1>
    <p class="hero-lead">Puede que el enlace esté mal escrito o que la página se haya movido. Desde aquí puedes seguir:</p>
    <div class="hero-actions">
      ${btn(ctx.url('/'), 'Ir al inicio')}
      ${btn(ctx.url('/portfolio/'), 'Ver trabajos', { variant: 'ghost' })}
      ${btn(ctx.url('/services/'), 'Ver servicios', { variant: 'ghost' })}
    </div>
  </div>
</section>`;
  return { path: '/404.html', title: 'Página no encontrada | Zerufy Studio', description: 'Esta página no existe.', noindex: true, main, sitemap: false };
}

// Espacio reservado para el panel interno (leads, clientes, proyectos, pedidos).
export function dashboard(ctx) {
  const modules = [
    ['Solicitudes', 'Cada formulario de “Crear mi proyecto”, con estado: nuevo, en conversación, propuesta, cerrado.', 'Tabla lista: leads'],
    ['Clientes', 'Negocios activos, contacto, plan y fecha de pago.', 'Por construir'],
    ['Proyectos', 'Lo que está en diseño, en construcción o publicado.', 'Por construir'],
    ['Portafolio', 'Casos de estudio que aparecen en el sitio.', 'Hoy en content/projects.mjs'],
    ['Servicios', 'Servicios del sitio.', 'Hoy en content/services.mjs'],
    ['Catálogos y menús', 'Acceso a los paneles de cada negocio.', 'Plataforma existente'],
    ['Pedidos', 'Pedidos de las tiendas de los clientes.', 'Por construir'],
    ['Contenido', 'Textos del sitio y futuras entradas del blog.', 'Por construir'],
  ];
  const main = `
<section class="page-hero">
  <div class="wrap">
    <h1 class="display-2">Panel del estudio</h1>
    <p class="hero-lead">Esta ruta está reservada para el panel interno de Zerufy Studio. Se conectará a Supabase con acceso por correo y contraseña. Esta página no aparece en Google.</p>
  </div>
</section>
<section class="section tight-top">
  <div class="wrap">
    <ul class="dash-list" role="list">${modules
      .map(([t, d, s]) => `<li><h2 class="h4">${esc(t)}</h2><p>${esc(d)}</p><span class="tag">${esc(s)}</span></li>`)
      .join('')}</ul>
  </div>
</section>`;
  return { path: '/dashboard/', title: 'Panel del estudio | Zerufy Studio', description: 'Panel interno de Zerufy Studio.', noindex: true, main, sitemap: false, hideDock: true };
}

// Política de privacidad. Meta y Google la piden cuando el sitio usa Pixel, Analytics o anuncios.
// Solo menciona las herramientas que están activadas en site.config.mjs.
export function privacy(ctx) {
  const i = ctx.config.integrations;
  const c = ctx.config.contact;
  const tools = [
    i.ga4 && ['Google Analytics', 'cuenta visitas y qué páginas se ven, sin decirnos quién eres.', 'https://tools.google.com/dlpage/gaoptout'],
    i.metaPixel && ['Meta Pixel (Facebook e Instagram)', 'nos dice si alguien que vio un anuncio nuestro visitó el sitio o nos escribió, para medir los anuncios y mostrarlos a personas parecidas.', 'https://www.facebook.com/adpreferences/ad_settings'],
    i.clarity && ['Microsoft Clarity', 'muestra mapas de dónde se toca y hasta dónde se baja en cada página. Oculta lo que se escribe en los formularios.', 'https://privacy.microsoft.com/es-es/privacystatement'],
  ].filter(Boolean);
  const contactLine = c.email
    ? `escríbenos por WhatsApp al ${esc(c.whatsappDisplay)} o a ${esc(c.email)}`
    : `escríbenos por WhatsApp al ${esc(c.whatsappDisplay)}`;
  const main = `
<section class="page-hero">
  <div class="wrap">
    <h1 class="display-2">Privacidad</h1>
    <p class="hero-lead">Qué datos guardamos cuando visitas zerufystudio.com o nos pides un proyecto, y para qué.</p>
  </div>
</section>
<section class="section tight-top">
  <div class="wrap prose legal">
    <h2 class="h3">Lo que nos das en el formulario</h2>
    <p>Cuando llenas “Empezar un proyecto” guardamos tu nombre, el de tu negocio, tu WhatsApp, tu email si lo pones, tu web o Instagram y lo que nos cuentas del proyecto. También guardamos desde qué página o anuncio llegaste. Lo usamos solo para responderte y prepararte una propuesta. No lo vendemos ni lo compartimos con nadie para su propia publicidad.</p>
    <p>Se guarda en Supabase, el servicio donde vive nuestra base de datos. Si nos escribes por WhatsApp, esa conversación queda en WhatsApp.</p>
    <h2 class="h3">Lo que se mide al navegar</h2>
    ${
      tools.length
        ? `<p>Usamos estas herramientas para saber qué partes del sitio funcionan y cuáles no:</p>
    <ul>${tools.map(([n, d, u]) => `<li><strong>${esc(n)}</strong>: ${esc(d)} <a class="link" href="${u}" target="_blank" rel="noopener">Cómo desactivarlo</a>.</li>`).join('')}</ul>
    <p>Estas herramientas usan cookies o tecnologías parecidas en tu navegador. Puedes borrarlas o bloquearlas desde los ajustes del navegador y el sitio sigue funcionando igual.</p>`
        : `<p>Hoy no usamos herramientas de medición de terceros.</p>`
    }
    <p>Además, el sitio recuerda en tu propio navegador desde dónde llegaste la primera vez (por ejemplo, un anuncio de Instagram) durante 30 días, para incluirlo si nos mandas el formulario.</p>
    <h2 class="h3">Tus datos, tu decisión</h2>
    <p>Si quieres ver, corregir o borrar lo que nos mandaste, ${contactLine} y lo hacemos.</p>
    <p class="legal-date">Última actualización: ${new Date().toISOString().slice(0, 10)}.</p>
  </div>
</section>`;
  return {
    path: '/privacidad/',
    title: 'Privacidad | Zerufy Studio',
    description: 'Qué datos guarda Zerufy Studio cuando visitas el sitio o pides un proyecto, y para qué.',
    main,
    priority: '0.2',
  };
}
