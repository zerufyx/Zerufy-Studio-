# Zerufy Studio — sitio web

El sitio del estudio: **zerufystudio.com**. Tiene el portafolio, los servicios, las páginas por tipo de negocio y el formulario para captar clientes.
Es HTML estático generado con Node, sin frameworks ni dependencias.

- Repositorio: `zerufyx/Zerufy-Studio-`
- Se publica solo: cada cambio que sube a `main` lo construye y publica **Cloudflare Pages** (proyecto `zerufy-studio`, comando `node scripts/build.mjs`, carpeta `dist`). También responde en https://zerufy-studio.pages.dev.
- Dominio: comprado en Namecheap, con los nameservers de Cloudflare y conectado al proyecto en Custom domains (zerufystudio.com y www).
- `.github/workflows/deploy.yml` es el despliegue viejo a GitHub Pages. Se borra cuando se apague GitHub Pages (ver `claude/migracion-cloudflare.md` en el proyecto).

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

Todo se publica en **Cloudflare Pages** (cuenta zerufyx@gmail.com) desde su repo. Cada proyecto responde en su dirección `.pages.dev`; los que tienen dominio propio, también en su dominio.

**Sitios en línea**

| Repo | Qué es | Supabase | En línea |
|---|---|---|---|
| `Zerufy-Studio-` | Este sitio, el del estudio | `leads` | zerufystudio.com |
| `Zerufy` | Tienda Zerufy (reventa de lujo y streetwear), propia | Tiendas, 2 | zerufy.store |
| `S91-Grill-House-` | S91 House Grill, menú digital, **cliente** | Menús, 4 | s91housegrill.com |
| `amhstore` | AMH Store, **cliente** | Tiendas, 3 | amhstore.store (todavía sale de GitHub Pages; espera que el dueño cambie sus nameservers) |
| `LIZ-BOUTIQUE` | Liz Boutique, catálogo de moda, **cliente** desde el 12 oct 2026 (pago único, sin mensualidad) | Tiendas, 6 | liz-boutique.pages.dev (falta su dominio) |
| `Underblock` | **Guarida Store**, catálogo, **cliente**. Se diseñó para Underblock, que no lo tomó; el repo conserva ese nombre | Tiendas, 7 | guaridaastore.com |

**Conceptos y propuestas** (no son clientes; en el sitio siempre dicen "Concepto")

| Repo | Qué es | Supabase | En línea |
|---|---|---|---|
| `ibrows` | I Brows, sitio con reservas (referencia de Citas) | — | ibrows.pages.dev |
| `ByKate` | By Kate · La Silla Roja, reservas | Reservas (`bk_*`) | bykate.pages.dev |
| `Placidlux` | Placid Lux Esthetic, spa facial con agenda | — | placidlux.pages.dev |
| `Luzeglow` | Luzé Glow Brows, cejas con cita por Instagram o WhatsApp. Se le está mostrando a un prospecto | — | zerufyx.github.io/Luzeglow (todavía no está en Cloudflare) |
| `Jircars` | Concesionario | — | jircars.pages.dev |
| `CarpaShop` | Catálogo de accesorios | Tiendas, 5 | carpashop.pages.dev |
| `AUREON` | Catálogo de fragancias | Sin conectar | aureon-c1a.pages.dev |
| `ALTAPINTA` | Catálogo de ropa urbana (no se muestra en el portafolio) | Sin conectar | altapinta.pages.dev |
| `JJ-` | JJTECH_73, catálogo de relojes, tenis y tecnología | Sin conectar | jj-4mt.pages.dev |
| `PARCHITA-` | Parchita, catálogo de carteras | Sin conectar | parchita.pages.dev |
| `LBA-Store-` | Luisba Store, catálogo de gorras | Sin conectar | lba-store.pages.dev |
| — | **Offsuite**, catálogo con carrito. **Todavía no tiene repo.** | — | Falta subirlo |

**Retirado:** `zerufy-v2`, copia vieja de la tienda Zerufy. Su página solo redirige a zerufy.store. Se puede archivar.

Números de tienda usados en Supabase: 2, 3, 4 (Menús), 5, 6, 7. El próximo negocio usa el 8. Nunca se reutiliza un número.

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
| Google Analytics 4 | Activo (`integrations.ga4`) |
| Meta Pixel | Activo (`integrations.metaPixel`) |
| Microsoft Clarity (mapas de calor, grabaciones) | Apagado (`integrations.clarity`): falta crear el proyecto |
| Verificación Google Search Console | Activo (`integrations.verification.google`) |
| Verificación de dominio en Meta | Activo (`integrations.verification.meta`) |

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
