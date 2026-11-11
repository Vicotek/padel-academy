/* Padel Academy — lógica de idioma y reservas (sin dependencias) */
(function () {
  'use strict';

  // ---- Configuración ----
  var CONFIG = {
    phone: '4571380894',            // WhatsApp (sin + ni espacios)
    defaultLang: 'es',              // idioma inicial: 'es' | 'en' | 'da' | 'auto' (según navegador)
    hours: ['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    daysAhead: 7
  };

  var VIDEOS = [
    { num: '01', tag: 'tagShort', k: 'v1', url: 'https://www.youtube.com/shorts/uHwI03TOoWU' },
    { num: '02', tag: 'tagVideo', k: 'v2', url: 'https://www.youtube.com/watch?v=9Dqy17yeIRM' },
    { num: '03', tag: 'tagShort', k: 'v3', url: 'https://www.youtube.com/shorts/sDvJ32XyjDE' }
  ];

  // Marcas de ejemplo para la demo: sustituir por colaboradores reales.
  var PARTNERS = [
    { initial: 'V', name: 'Vértice', cat: 'cat1', off: 'off1' },
    { initial: 'N', name: 'Nórdica Grip', cat: 'cat2', off: 'off2' },
    { initial: 'R', name: 'Rebote', cat: 'cat3', off: 'off3' },
    { initial: 'S', name: 'Saque Shoes', cat: 'cat4', off: 'off4' },
    { initial: 'B', name: 'Bandeja Wear', cat: 'cat5', off: 'off5' },
    { initial: 'P', name: 'Pista Norte', cat: 'cat6', off: 'off6' }
  ];

  var TYPES = [
    { id: 'ind', label: 'typeInd', detail: 'detInd', price: 'priceLesson', phrase: 'phraseInd', wa: 'waInd' },
    { id: 'par', label: 'typePar', detail: 'detPar', price: 'priceLesson', phrase: 'phrasePar', wa: 'waPar' },
    { id: 'gru', label: 'typeGru', detail: 'detGru', price: 'pricePerson', phrase: 'phraseGru', wa: 'waGru' }
  ];

  var I18N = window.PA_I18N;
  var $ = function (id) { return document.getElementById(id); };

  // ---- Estado ----
  var state = { lang: pickLang(), type: 'ind', day: 0, slot: null, done: false };

  function pickLang() {
    try {
      var saved = localStorage.getItem('pa-lang');
      if (saved && I18N[saved]) return saved;
    } catch (e) {}
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && I18N[fromUrl]) return fromUrl;
    if (CONFIG.defaultLang !== 'auto') return CONFIG.defaultLang;
    var nl = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    if (nl.indexOf('da') === 0) return 'da';
    if (nl.indexOf('es') === 0) return 'es';
    return 'en';
  }

  function t() { return I18N[state.lang] || I18N.es; }
  function waLink(msg) { return 'https://wa.me/' + CONFIG.phone + '?text=' + encodeURIComponent(msg); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  // ---- Fechas y disponibilidad (demo) ----
  var dates = (function () {
    var out = [], today = new Date(); today.setHours(0, 0, 0, 0);
    for (var i = 0; i < CONFIG.daysAhead; i++) { var d = new Date(today); d.setDate(today.getDate() + i); out.push(d); }
    return out;
  })();

  // DEMO: ocupación simulada. En producción, sustituir por la disponibilidad real del calendario.
  function isBooked(di, hi) { return ((dates[di].getDate() * 7 + hi * 13 + di * 5) % 10) < 4; }

  // ---- Textos estáticos ----
  function applyStatic() {
    var tr = t();
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = tr[n.getAttribute('data-i18n')] || ''; });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (n) { n.alt = tr[n.getAttribute('data-i18n-alt')]; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (n) { n.placeholder = tr[n.getAttribute('data-i18n-placeholder')]; });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (n) { n.setAttribute('aria-label', tr[n.getAttribute('data-i18n-aria')]); });
    document.querySelectorAll('[data-wa]').forEach(function (n) {
      n.href = waLink(n.getAttribute('data-wa') === 'partner' ? tr.waPartnerMsg : tr.waInfoMsg);
      n.target = '_blank'; n.rel = 'noopener';
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === state.lang));
    });
    var note = document.querySelector('.videos-note');
    note.hidden = !tr.videosNote;
  }

  // ---- Vídeos ----
  function renderVideos() {
    var tr = t(), grid = $('video-grid');
    grid.innerHTML = '';
    VIDEOS.forEach(function (v) {
      var a = el('a', 'video-card'); a.href = v.url; a.target = '_blank'; a.rel = 'noopener';
      var th = el('div', 'video-thumb');
      ['ln ln-net', 'ln ln-mid', 'ln ln-top', 'ln ln-bot'].forEach(function (c) { th.appendChild(el('div', c)); });
      th.appendChild(el('span', 'video-tag', tr[v.tag]));
      th.appendChild(el('span', 'video-num', v.num));
      var play = el('div', 'play');
      play.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#0E2233"/></svg>';
      th.appendChild(play);
      th.appendChild(el('span', 'video-short', tr[v.k + 's']));
      a.appendChild(th);
      var meta = el('div', 'stack'); meta.style.gap = '6px';
      meta.appendChild(el('h3', null, tr[v.k + 't']));
      meta.appendChild(el('span', 'desc', tr[v.k + 'd']));
      a.appendChild(meta);
      grid.appendChild(a);
    });
  }

  // ---- Colaboradores ----
  function renderPartners() {
    var tr = t(), grid = $('partners');
    grid.innerHTML = '';
    PARTNERS.forEach(function (p, i) {
      var a = el('a', 'partner'); a.href = '#colaboradores';
      a.appendChild(el('div', 'mark mark--' + (i + 1), p.initial));
      a.appendChild(el('span', 'pn', p.name));
      a.appendChild(el('span', 'pc', tr[p.cat]));
      a.appendChild(el('span', 'po', tr[p.off]));
      grid.appendChild(a);
    });
  }

  // ---- Reservas ----
  function renderBooking() {
    var tr = t();

    var types = $('types'); types.innerHTML = '';
    TYPES.forEach(function (ty) {
      var b = el('button', 'type-btn'); b.type = 'button';
      b.setAttribute('aria-pressed', String(ty.id === state.type));
      b.appendChild(el('span', 't', tr[ty.label]));
      b.appendChild(el('span', 'd', tr[ty.detail]));
      b.appendChild(el('span', 'p', tr[ty.price]));
      b.addEventListener('click', function () { state.type = ty.id; renderBooking(); });
      types.appendChild(b);
    });

    var m0 = tr.mon[dates[0].getMonth()];
    $('month').textContent = m0.charAt(0).toUpperCase() + m0.slice(1) + ' ' + dates[0].getFullYear();

    var days = $('days'); days.innerHTML = '';
    dates.forEach(function (d, di) {
      var free = 0;
      CONFIG.hours.forEach(function (_, hi) { if (!isBooked(di, hi)) free++; });
      var b = el('button', 'day-btn'); b.type = 'button';
      b.setAttribute('aria-pressed', String(di === state.day));
      b.appendChild(el('span', 'dw', di === 0 ? tr.today : tr.dow[d.getDay()]));
      b.appendChild(el('span', 'dn', String(d.getDate())));
      b.appendChild(el('span', 'df', free + ' ' + tr.free));
      b.addEventListener('click', function () { state.day = di; state.slot = null; renderBooking(); });
      days.appendChild(b);
    });

    var slots = $('slots'); slots.innerHTML = '';
    CONFIG.hours.forEach(function (h, hi) {
      var booked = isBooked(state.day, hi);
      var b = el('button', 'slot' + (state.slot === h ? ' is-selected' : ''), h); b.type = 'button';
      b.disabled = booked;
      b.setAttribute('aria-label', h + ' ' + (booked ? tr.busy : tr.avail));
      if (!booked) b.setAttribute('aria-pressed', String(state.slot === h));
      b.addEventListener('click', function () { state.slot = h; renderBooking(); });
      slots.appendChild(b);
    });

    renderSummary();
  }

  function currentType() { return TYPES.filter(function (x) { return x.id === state.type; })[0]; }
  function dateText() { var tr = t(), d = dates[state.day]; return tr.fmtDate(tr.dowL[d.getDay()], d.getDate(), tr.mon[d.getMonth()]); }

  function renderSummary() {
    var tr = t(), ty = currentType();
    var name = $('pa-name').value.trim();
    var cant = !state.slot || name.length < 2;

    $('sum-type').textContent = tr[ty.label];
    $('sum-day').textContent = (state.day === 0 ? tr.today + ', ' : '') + dateText();
    $('sum-slot').textContent = state.slot || tr.chooseTime;
    $('sum-price').textContent = tr[ty.price];
    $('confirm').disabled = cant;
    $('hint').textContent = cant ? (state.slot ? tr.hintName : tr.hintSlot) : tr.hintOk;

    var who = name || tr.guest;
    $('done-text').textContent = tr.done(who, tr[ty.phrase], dateText(), state.slot || '');
    $('wa-booking').href = waLink(tr.wa(who, tr[ty.wa], dateText(), state.slot || ''));
    $('sum-form').hidden = state.done;
    $('sum-done').hidden = !state.done;
  }

  // ---- Eventos ----
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.lang = b.getAttribute('data-lang');
      try { localStorage.setItem('pa-lang', state.lang); } catch (e) {}
      renderAll();
    });
  });
  $('pa-name').addEventListener('input', renderSummary);
  $('confirm').addEventListener('click', function () {
    // DEMO: aquí se enviaría la reserva al calendario (Google Calendar / Cal.com / Calendly).
    state.done = true; renderSummary();
  });
  $('again').addEventListener('click', function () { state.done = false; state.slot = null; renderBooking(); });
  $('year').textContent = new Date().getFullYear();

  function renderAll() { applyStatic(); renderVideos(); renderPartners(); renderBooking(); }
  renderAll();
})();
