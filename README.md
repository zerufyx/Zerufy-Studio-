# Zerufy Studio — sitio web

El sitio del estudio: **zerufystudio.com**. Tiene el portafolio, los servicios, las páginas por tipo de negocio y el formulario para captar clientes.
Es HTML estático generado con Node, sin frameworks ni dependencias.

- Repositorio: `zerufyx/Zerufy-Studio-`
- Se publica solo: cada cambio que sube a `main` se publica en GitHub Pages (`.github/workflows/deploy.yml`).
- Dominio: Namecheap → GitHub Pages. El archivo `CNAME` lo crea el build a partir de `siteUrl`.

## Regla de orden

Este repo es **solo el sitio de Zerufy Studio**. El código de cada cliente o concepto vive en su propio repo (ver el mapa de abajo). Aquí solo entran **capturas** de esos proyectos (`assets/img/`), nunca su código.

## Estructura

```
site.config.mjs          ← nombre, dominio, WhatsApp, redes, Supabase, Analytics, Meta Pixel
content/                 ← TODO el texto del sitio (se edita aquí, no en src/)
  projects.mjs           ←   portafolio: clientes y conceptos, y su orden
  services.mjs           ←   los 6 servicios: textos, para quién, ejemplos, SEO
  service-guide.mjs      ←   cómo funciona cada servicio (lo que damos, lo que controlas)
  verticals.mjs          ←   páginas por tipo de negocio (/negocios/...)
  studio.mjs             ←   proceso, principios, crecimiento, preguntas, opciones del formulario
src/                     ← plantillas (cómo se ve, no qué dice)
  core.mjs               ←   utilidades: rutas, íconos, link de WhatsApp
  layout.mjs             ←   <head> con SEO, encabezado, pie, entrada animada de la portada
  components.mjs         ←   piezas reutilizables: botones, teléfonos, tarjetas, preguntas
  seo.mjs                ←   datos estructurados para Google (schema.org)
  pages/                 ←   una plantilla por tipo de página
assets/
  css/site.css           ← todo el diseño
  js/site.js             ← menú, animaciones, recorridos, Analytics
  js/lead.js             ← formulario "Empezar un proyecto" → Supabase + WhatsApp
  fonts/                 ← Bebas Neue y Montserrat (propias, sin Google Fonts)
  img/work/              ← capturas de proyectos (.webp, teléfono 540×1169, web 1440×900)
  img/tour/              ← capturas largas para los recorridos de la portada
  img/                   ← favicon, íconos e imágenes para redes (og-*.jpg)
supabase/leads.sql       ← tabla donde se guardan las solicitudes del formulario
scripts/build.mjs        ← genera el sitio
scripts/serve.mjs        ← servidor local para revisarlo
DESIGN.md                ← colores, tipografía y movimiento
PRODUCT.md               ← a quién le habla el sitio y cómo
```

`dist/` y `preview/` se generan con el build y **no se suben** al repo.

## Comandos

Node 18 o más nuevo.

```bash
node scripts/build.mjs             # genera dist/ (lo que se publica)
node scripts/serve.mjs             # abre dist/ en http://localhost:4321
node scripts/build.mjs --preview   # versión con rutas relativas (para vista previa)
```

## Páginas

| Ruta | Qué es |
|---|---|
| `/` | Inicio, con la entrada animada (una vez por visita) |
| `/negocios/` y `/negocios/<tipo>/` | Restaurantes, tiendas, concesionarios, citas |
| `/services/` y `/websites/` `/menus/` `/catalogs/` `/booking/` `/systems/` `/apps/` | Servicios |
| `/portfolio/` y `/projects/<proyecto>/` | Trabajos y caso de cada uno |
| `/about/` · `/contact/` | Nosotros · formulario |
| `/dashboard/` | Panel interno (no aparece en Google) |

## Mapa de repos de Zerufy (GitHub: zerufyx)

| Repo | Qué es | En línea |
|---|---|---|
| `Zerufy-Studio-` | Este sitio, el del estudio | zerufystudio.com |
| `Zerufy` | Tienda Zerufy (reventa de lujo y streetwear) | zerufy.store |
| `zerufy-v2` | Copia vieja de la tienda Zerufy. Hay que apagarla y archivarla | Todavía en GitHub Pages |
| `amhstore` | AMH Store, cliente | amhstore.store |
| `S91-Grill-House-` | S91 House Grill, menú digital, cliente | s91housegrill.com |
| `ibrows` | I Brows, concepto: sitio con reservas | GitHub Pages |
| `Jircars` | Jircars, concepto: concesionario | GitHub Pages |
| `AUREON` | Aureon, concepto: catálogo | GitHub Pages |
| `ALTAPINTA` | Alta Pinta, concepto: catálogo | GitHub Pages |
| `LIZ-BOUTIQUE` | Liz Boutique, concepto: catálogo | GitHub Pages |
| `CarpaShop` | CarpaShop, concepto: catálogo | GitHub Pages |
| `ByKate` | By Kate, concepto (todavía no está en el portafolio) | GitHub Pages |
| `Placidlux` | Placid Lux Esthetic, concepto (todavía no está en el portafolio) | GitHub Pages |
| — | **Offsuite**, concepto: catálogo con carrito. **Todavía no tiene repo.** | Falta subirlo |

## Supabase

Un solo proyecto de Supabase para todos los negocios, con cuatro sistemas separados: Tiendas (`stores`, `products`…), Menús (`tiendas`, `platos`…), Reservas (`bk_*`) y este sitio (`leads`). Cada tabla dice en su comentario a qué sistema y a qué repo pertenece. Cada negocio nuevo recibe su propio `store_id`, que nunca se reutiliza.

## Agregar un proyecto al portafolio

1. Su código va en **su propio repo**, no aquí.
2. Las capturas van en `assets/img/work/<proyecto>-<pantalla>.webp` (teléfono 540×1169, web 1440×900 y 800×500).
3. Copia un bloque en `content/projects.mjs`, cambia los datos y ponlo en `ORDER`. Los conceptos llevan `kind: 'concept'` y en el sitio siempre dicen "Concepto".
4. `node scripts/build.mjs`. Se crea la página del caso y aparece en el portafolio y en el sitemap.

## Integraciones (se activan desde `site.config.mjs`)

| Integración | Estado |
|---|---|
| WhatsApp | Activo (`contact.whatsapp`) |
| Formulario → Supabase | Activo. Tablas `leads` y `studio_admins`. Las solicitudes se ven en Supabase → Table Editor → `leads` |
| Webhook (Make, Zapier, n8n) | Apagado (`integrations.webhook`) |
| Google Analytics 4 | Apagado (`integrations.ga4`) |
| Meta Pixel | Apagado (`integrations.metaPixel`) |
| Microsoft Clarity (mapas de calor, grabaciones) | Apagado (`integrations.clarity`) |
| Verificación Google Search Console | Apagado (`integrations.verification.google`) |
| Verificación de dominio en Meta | Apagado (`integrations.verification.meta`) |

Cada una se activa sola al pegar su código. Vacío = no se carga ningún script externo.

### Embudo que se mide (GA4 · Meta · Clarity)

| Evento | Cuándo | En Meta |
|---|---|---|
| `view_vertical` / `view_service` / `view_project` | Abre una página de tipo de negocio, servicio o caso | `ViewContent` |
| `cta_click` | Toca un botón que lleva a /contact/ (con `location`: dónde estaba) | `CTAClick` |
| `whatsapp_click` | Toca cualquier enlace de WhatsApp (con `location`) | `Contact` |
| `form_start` | Toca el primer campo del formulario | `FormStart` |
| `form_progress` | Llega a cada bloque del formulario (`step` 1–4) | `FormProgress` |
| `form_error` | Intenta enviar con campos mal (`fields`) | `FormError` |
| `generate_lead` | Formulario enviado | `Lead` |

Origen del cliente: la primera visita guarda UTM, `fbclid`, `gclid`, referrer y página de entrada (30 días, en el navegador) y se manda con la solicitud a `leads.origin`. Así en Supabase se ve qué anuncio trajo cada cliente.

Página `/privacidad/`: Meta y Google la piden para anuncios. Solo menciona las herramientas activadas.

## Pendientes

- [ ] `contact.instagram` y `contact.email` en `site.config.mjs`, si quieres que aparezcan
- [ ] Capturas de Zerufy y AMH Store que muestren productos (hoy muestran la portada)
- [ ] Repo para Offsuite
