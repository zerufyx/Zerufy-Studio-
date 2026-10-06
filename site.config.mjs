// ─────────────────────────────────────────────────────────────
//  Zerufy Studio — configuración del sitio
//  Todo lo que cambia de un despliegue a otro vive aquí.
//  Después de editar, corre:  node scripts/build.mjs
// ─────────────────────────────────────────────────────────────

export default {
  name: 'Zerufy Studio',
  legalName: 'Zerufy Studio',

  // Dominio final, sin barra al final. Se usa en canonical, sitemap y Open Graph.
  // Dominio propio conectado a GitHub Pages
  siteUrl: 'https://zerufystudio.com',

  // "" si el sitio vive en la raíz del dominio (lo normal con dominio propio).
  // "/nombre-del-repo" si lo publicas en usuario.github.io/nombre-del-repo
  basePath: '',

  lang: 'es',
  locale: 'es_US',
  city: 'Orlando',
  region: 'FL',
  country: 'US',

  contact: {
    whatsapp: '14072833785', // solo números, con código de país
    whatsappDisplay: '+1 (407) 283-3785',
    whatsappMessage: 'Hola Zerufy Studio, quiero información para mi negocio.',
    email: '',     // ej. hola@tudominio.com — vacío = no se muestra
    instagram: '', // ej. zerufystudio — vacío = no se muestra
    tiktok: '',
  },

  // Integraciones. Vacío = apagado. No se carga nada que no esté configurado.
  integrations: {
    // Guarda cada solicitud del formulario en la tabla "leads" (ver supabase/leads.sql)
    supabase: {
      url: 'https://drkcstmcdscklcrefxbs.supabase.co',
      // Llave pública (anon). Es segura en el navegador: con ella el sitio solo puede crear solicitudes, nunca leerlas.
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRya2NzdG1jZHNja2xjcmVmeGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzc1NjksImV4cCI6MjA5MjgxMzU2OX0.4LE8Qj0LWLvJEJ_peQK9YU1CJPjZXZS0Kjc6ahlZ4wE',
      table: 'leads',
    },
    // Webhook opcional (Make, Zapier, n8n) para mandar cada solicitud a
    // Notion, Airtable, un CRM, email o Google Sheets.
    webhook: '',

    // ── Medición ──────────────────────────────────────────────
    // Cada una se activa sola al pegar su código. Vacío = no se carga nada.
    ga4: 'G-QQ2XLWRQZX',     // Google Analytics 4 → "ID de medición", ej. G-XXXXXXXXXX
    metaPixel: '', // Meta (Facebook/Instagram) Pixel → "ID del píxel", ej. 123456789012345
    clarity: '',   // Microsoft Clarity (mapa de calor y grabaciones) → "Project ID", ej. abcd1234ef

    // Verificación de propiedad del dominio (solo el código, sin la etiqueta <meta>)
    verification: {
      google: 'IyaOE4ZxGq2j5-_Da-Z0bsfaVYZu7fDsM_JZyDEZuBc',// Google Search Console → método "Etiqueta HTML" → valor de content="..."
      meta: '',   // Meta Business → Seguridad de la marca → Dominios → valor de content="..."
    },
  },

  // Rutas reservadas para crecer. "enabled: false" = no se publica todavía.
  futureRoutes: {
    blog: { enabled: false, path: '/blog/' },
    dashboard: { enabled: true, path: '/dashboard/' }, // página privada (noindex)
  },
};
