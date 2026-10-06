/* Zerufy Studio: formulario "Empezar un proyecto".
   Envía cada solicitud a los destinos configurados en site.config.mjs:
     1. Supabase (tabla leads)            → integrations.supabase
     2. Webhook (Make / Zapier / n8n)     → integrations.webhook  (Notion, Airtable, CRM, email…)
   Si no hay ninguno configurado, el último paso es enviarla por WhatsApp. */
(function () {
  'use strict';
  var d = document, w = window, DS = w.DS || {};
  var form = d.querySelector('[data-lead-form]');
  if (!form) return;

  var done = d.querySelector('[data-done]');
  var alertBox = form.querySelector('[data-form-alert]');
  var submit = form.querySelector('[data-submit]');
  var startedAt = Date.now();

  var NEED_LABELS = {};
  form.querySelectorAll('input[name="needs"]').forEach(function (i) { NEED_LABELS[i.value] = i.nextElementSibling.textContent; });
  var PLAN_LABELS = { 'plan-base': 'Plan Base', 'plan-completo': 'Plan Completo' };

  /* ---------- Prellenado desde el enlace (#menus, #plan-base…) ---------- */
  function prefill() {
    var key = (location.hash || '').slice(1);
    if (!key) return;
    if (PLAN_LABELS[key]) form.elements.plan.value = PLAN_LABELS[key];
    else check(key);
  }
  function check(k) { var el = k && d.getElementById('need-' + k); if (el) el.checked = true; }
  prefill();
  w.addEventListener('hashchange', prefill);

  /* ---------- Validación ---------- */
  function val(name) { var el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }
  function needs() { return [].slice.call(form.querySelectorAll('input[name="needs"]:checked')).map(function (i) { return i.value; }); }
  function budget() { var b = form.querySelector('input[name="budget"]:checked'); return b ? b.value : ''; }
  function timeline() { var b = form.querySelector('input[name="timeline"]:checked'); return b ? b.value : ''; }
  function showError(name, show) {
    var msg = form.querySelector('[data-error-for="' + name + '"]');
    var el = form.elements[name];
    if (msg) msg.hidden = !show;
    if (name === 'needs') {
      form.querySelector('[data-needs]').classList.toggle('is-invalid', show);
    } else if (el) {
      el.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (msg) el.setAttribute('aria-describedby', msg.id || (msg.id = 'err-' + name));
    }
    return show;
  }
  function validate() {
    var bad = [];
    if (showError('needs', needs().length === 0)) bad.push('needs');
    if (showError('business', val('business').length < 2)) bad.push('business');
    if (showError('name', val('name').length < 2)) bad.push('name');
    if (showError('phone', val('phone').replace(/\D/g, '').length < 10)) bad.push('phone');
    var em = val('email');
    if (showError('email', em !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))) bad.push('email');
    return bad;
  }
  ['business', 'name', 'phone', 'email'].forEach(function (n) {
    form.elements[n].addEventListener('blur', function () {
      if (form.elements[n].getAttribute('aria-invalid') === 'true') validate();
    });
  });
  form.addEventListener('change', function (e) { if (e.target.name === 'needs' && needs().length) showError('needs', false); });

  /* ---------- Medición del formulario: dónde se queda la gente ---------- */
  var T = function (n, p) { if (DS.track) DS.track(n, p); };
  var started = false, reached = {};
  var groups = [].slice.call(form.querySelectorAll('.field-group'));
  form.addEventListener('focusin', function (e) {
    if (!started) { started = true; T('form_start', { page: location.pathname }); }
    var g = e.target.closest('.field-group');
    var i = groups.indexOf(g);
    if (i > -1 && !reached[i]) {
      reached[i] = true;
      var leg = g.querySelector('legend');
      T('form_progress', { step: i + 1, step_name: leg ? leg.textContent.replace(/\s+/g, ' ').replace(/^\d+/, '').trim().slice(0, 40) : '' });
    }
  });

  /* ---------- Mensaje para WhatsApp ---------- */
  function waText(lead) {
    var lines = ['Hola Zerufy Studio, quiero empezar un proyecto.', ''];
    lines.push('Nombre: ' + lead.name);
    lines.push('Negocio: ' + lead.business + (lead.business_type ? ' (' + lead.business_type + ')' : ''));
    lines.push('Necesito: ' + lead.needs.map(function (k) { return NEED_LABELS[k] || k; }).join(', '));
    if (lead.plan) lines.push('Plan: ' + lead.plan);
    if (lead.budget) lines.push('Tamaño: ' + lead.budget);
    if (lead.timeline) lines.push('Para cuándo: ' + lead.timeline);
    if (lead.instagram) lines.push('Web o Instagram: ' + lead.instagram);
    lines.push('Teléfono: ' + lead.phone);
    if (lead.email) lines.push('Email: ' + lead.email);
    if (lead.message) { lines.push(''); lines.push(lead.message); }
    return lines.join('\n');
  }
  function waUrl(text) { return 'https://wa.me/' + (DS.whatsapp || '') + '?text=' + encodeURIComponent(text); }

  /* ---------- Destinos ---------- */
  function toSupabase(lead) {
    var cfg = DS.supabase;
    return fetch(cfg.url.replace(/\/$/, '') + '/rest/v1/' + cfg.table, {
      method: 'POST',
      headers: { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(lead),
    }).then(function (r) { if (!r.ok) throw new Error('supabase ' + r.status); return true; });
  }
  function toWebhook(lead) {
    // text/plain evita el preflight CORS; Make, Zapier y n8n lo leen como JSON igual.
    return fetch(DS.webhook, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(lead) })
      .then(function () { return true; });
  }
  function dispatch(lead) {
    var jobs = [];
    if (DS.supabase) jobs.push(toSupabase(lead));
    if (DS.webhook) jobs.push(toWebhook(lead));
    if (!jobs.length) return Promise.resolve('none');
    return Promise.all(jobs.map(function (p) { return p.then(function () { return true; }, function () { return false; }); }))
      .then(function (res) { return res.some(Boolean) ? 'saved' : 'failed'; });
  }

  /* ---------- Resultado ---------- */
  function row(dt, dd) { return dd ? '<div><dt>' + esc(dt) + '</dt><dd>' + esc(dd) + '</dd></div>' : ''; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function showDone(lead, outcome) {
    var first = lead.name.split(' ')[0];
    var t = done.querySelector('[data-done-t]');
    var p = done.querySelector('[data-done-d]');
    var waBtn = done.querySelector('[data-done-wa]');
    var waLabel = done.querySelector('[data-done-wa-label]');
    if (outcome === 'saved') {
      t.textContent = 'Listo, ' + first + '. Recibimos tu proyecto.';
      p.textContent = 'Te vamos a escribir por WhatsApp' + (lead.email ? ' o por email' : '') + ' para conversar los detalles y mandarte una propuesta.';
      waLabel.textContent = 'Enviar también por WhatsApp';
      waBtn.className = 'btn btn-ghost';
    } else {
      t.textContent = outcome === 'failed' ? 'Envíanos tu proyecto por WhatsApp.' : 'Último paso: envíalo por WhatsApp.';
      p.textContent = outcome === 'failed'
        ? 'No pudimos guardar el formulario en este momento. Tu solicitud ya está escrita: tócala para abrir WhatsApp y enviarla.'
        : 'Tu solicitud ya está escrita. Toca el botón para abrir WhatsApp con todo listo y enviarla.';
      waLabel.textContent = 'Enviar por WhatsApp';
      waBtn.className = 'btn btn-primary';
    }
    waBtn.href = waUrl(waText(lead));
    done.querySelector('[data-done-sum]').innerHTML =
      row('Negocio', lead.business) +
      row('Necesitas', lead.needs.map(function (k) { return NEED_LABELS[k] || k; }).join(', ')) +
      row('Plan', lead.plan) +
      row('Tamaño', lead.budget) +
      row('Para cuándo', lead.timeline) +
      row('Teléfono', lead.phone) +
      row('Email', lead.email);
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Envío ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertBox.hidden = true;
    var bad = validate();
    if (bad.length) {
      T('form_error', { fields: bad.join(',') });
      var target = bad[0] === 'needs' ? form.querySelector('input[name="needs"]') : form.elements[bad[0]];
      target.focus();
      alertBox.textContent = 'Revisa los campos marcados para continuar.';
      alertBox.hidden = false;
      return;
    }
    // Antispam: campo trampa y envíos instantáneos
    if (val('website_url') !== '' || Date.now() - startedAt < 2500) { showDone({ name: val('name'), business: val('business'), needs: needs(), phone: val('phone') }, 'saved'); return; }

    var lead = {
      name: val('name'),
      business: val('business'),
      business_type: val('btype') || null,
      email: val('email') || null,
      phone: val('phone'),
      instagram: val('instagram') || null,
      needs: needs(),
      budget: budget() || null,
      timeline: timeline() || null,
      message: val('message') || null,
      plan: val('plan') || null,
      source_page: location.pathname + location.hash,
      origin: DS.origin || null,
    };

    submit.setAttribute('aria-busy', 'true');
    submit.querySelector('[data-submit-label]').textContent = 'Enviando';
    dispatch(lead).then(function (outcome) {
      T('generate_lead', { needs: lead.needs.join(','), budget: lead.budget || '', timeline: lead.timeline || '' });
      showDone(lead, outcome);
    }).finally(function () {
      submit.removeAttribute('aria-busy');
      submit.querySelector('[data-submit-label]').textContent = 'Enviar mi proyecto';
    });
  });
})();
