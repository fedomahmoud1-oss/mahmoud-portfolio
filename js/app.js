(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var T = {
    en: {
      all: 'All', play: 'Play',
      cat: { ai: 'AI Filmmaking', film: 'Film', tv: 'Television', micro: 'Micro-drama', theatre: 'Theatre', direction: 'Direction', commercial: 'Commercial' },
      status: { 'Produced': 'Produced', 'Released': 'Released', 'Broadcast': 'Broadcast', 'Post-production': 'Post-production', 'Unreleased': 'Unreleased', 'In Development': 'In development' },
      groups: {
        screen: ['Film, television & micro-drama', ''],
        series: ['Produced series', 'Original concept, screenplay and dialogue'],
        direction: ['Direction & visual work', ''],
        development: ['In development', 'Unproduced screenplays and concepts']
      },
      ticker: ['AI Filmmaking', 'Workflow Design', 'Creative Direction', 'Screenwriting', 'Copywriting', 'Direction', 'Theatre', 'Team Training']
    },
    ar: {
      all: 'الكل', play: 'تشغيل',
      cat: { ai: 'صناعة أفلام بالذكاء الاصطناعي', film: 'أفلام', tv: 'تلفزيون', micro: 'دراما قصيرة', theatre: 'مسرح', direction: 'إخراج', commercial: 'إعلانات' },
      status: { 'Produced': 'منفَّذ', 'Released': 'معروض', 'Broadcast': 'عُرض تلفزيونيًا', 'Post-production': 'مرحلة ما بعد الإنتاج', 'Unreleased': 'غير معروض بعد', 'In Development': 'قيد التطوير' },
      groups: {
        screen: ['أفلام وتلفزيون ودراما قصيرة', ''],
        series: ['مسلسلات منفَّذة', 'الفكرة الأصلية والسيناريو والحوار'],
        direction: ['الإخراج والعمل البصري', ''],
        development: ['قيد التطوير', 'سيناريوهات وأفكار لم تُنتَج بعد']
      },
      ticker: ['صناعة أفلام بالذكاء الاصطناعي', 'تصميم أنظمة العمل', 'إدارة إبداعية', 'كتابة السيناريو', 'كتابة الإعلانات', 'الإخراج', 'المسرح', 'تدريب الفرق']
    }
  };

  var state = { lang: 'en', works: [], credits: [], filter: 'all' };
  var html = document.documentElement;
  var pick = function (o, k) { return (state.lang === 'ar' && o[k + '_ar']) ? o[k + '_ar'] : (o[k + '_en'] || ''); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- language ---------- */
  function applyStatic() {
    $$('[data-ar]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = state.lang === 'ar' ? el.dataset.ar : el.dataset.en;
    });
    $$('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.l === state.lang); });
    var ar = state.lang === 'ar';
    html.lang = ar ? 'ar' : 'en';
    html.dir = ar ? 'rtl' : 'ltr';
    document.title = ar ? 'محمود فداوي — مدير إبداعي · صانع أفلام ذكاء اصطناعي · مخرج' : 'Mahmoud Fadawy — Creative Director · AI Filmmaker · Screenwriter · Director';
  }
  function setLang(l) {
    state.lang = l === 'ar' ? 'ar' : 'en';
    store.set('mf-lang', state.lang);
    try { var u = new URL(location.href); if (state.lang === 'ar') u.searchParams.set('lang', 'ar'); else u.searchParams.delete('lang'); history.replaceState(null, '', u); } catch (e) {}
    applyStatic(); renderTicker(); renderFilters(); renderWorks(); renderCredits(); observe();
  }

  /* ---------- ticker ---------- */
  function renderTicker() {
    var items = T[state.lang].ticker.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    $('#tick').innerHTML = items + items + items + items;
  }

  /* ---------- work grid ---------- */
  function renderFilters() {
    var cats = []; state.works.forEach(function (w) { if (cats.indexOf(w.category) < 0) cats.push(w.category); });
    var h = '<button class="chip' + (state.filter === 'all' ? ' on' : '') + '" data-f="all">' + T[state.lang].all + '</button>';
    cats.forEach(function (c) { h += '<button class="chip' + (state.filter === c ? ' on' : '') + '" data-f="' + esc(c) + '">' + esc(T[state.lang].cat[c] || c) + '</button>'; });
    $('#filters').innerHTML = h;
  }
  function renderWorks() {
    var list = state.works.map(function (w, i) { return { w: w, i: i }; })
      .sort(function (a, b) { return (b.w.featured ? 1 : 0) - (a.w.featured ? 1 : 0) || a.i - b.i; });
    $('#works').innerHTML = list.map(function (o) {
      var w = o.w, isVid = w.media_kind === 'video' || w.media_kind === 'youtube';
      var st = T[state.lang].status[w.status] || w.status;
      var yr = w.year ? ' · ' + esc(w.year) : '';
      return '<button class="work' + (state.filter !== 'all' && w.category !== state.filter ? ' hide' : '') + '" data-i="' + o.i + '" aria-label="' + esc(pick(w, 'title')) + '">' +
        '<div class="media"><img src="' + esc(w.poster || w.media) + '" alt="' + esc(pick(w, 'title')) + '" loading="lazy">' +
        (w.media_kind === 'video' ? '<video muted loop playsinline preload="none" data-src="' + esc(w.media) + '"></video>' : '') + '</div>' +
        '<span class="badge">' + esc(st) + '</span>' +
        (isVid ? '<span class="play"><svg viewBox="0 0 14 14" fill="currentColor"><path d="M2 1l11 6-11 6z"/></svg></span>' : '') +
        '<span class="shade"></span><span class="info"><small>' + esc(pick(w, 'type')) + yr + '</small><h3>' + esc(pick(w, 'title')) + '</h3><p>' + esc(pick(w, 'role')) + '</p></span></button>';
    }).join('');
    $$('.work').forEach(bindHover);
  }
  function bindHover(el) {
    var v = $('video', el); if (!v || !matchMedia('(hover:hover)').matches) return;
    el.addEventListener('mouseenter', function () { if (!v.src) v.src = v.dataset.src; el.classList.add('hov'); var p = v.play(); if (p && p.catch) p.catch(function () {}); });
    el.addEventListener('mouseleave', function () { el.classList.remove('hov'); v.pause(); });
  }

  /* ---------- credits ---------- */
  function renderCredits() {
    var order = ['screen', 'series', 'direction', 'development'], g = T[state.lang].groups, out = '';
    order.forEach(function (k) {
      var rows = state.credits.filter(function (c) { return c.group === k; });
      if (!rows.length) return;
      out += '<div class="group rv"><h3><span>' + esc(g[k][0]) + '</span><em>' + esc(g[k][1]) + '</em></h3>' + rows.map(creditRow).join('') + '</div>';
    });
    $('#creditGroups').innerHTML = out;
    var com = state.credits.filter(function (c) { return c.group === 'commercial'; });
    $('#commercial').innerHTML = com.map(function (c) { return '<li><b>' + esc(pick(c, 'title')) + '</b><span>' + esc(pick(c, 'role')) + '</span></li>'; }).join('');
  }
  function creditRow(c) {
    var st = T[state.lang].status[c.status] || c.status;
    return '<div class="row credit"><span class="y">' + esc(c.year) + '</span><div class="t">' + esc(pick(c, 'title')) + '<small>' + esc(pick(c, 'meta')) + '</small></div>' +
      '<div class="r">' + esc(pick(c, 'role')) + '</div><div class="s"><span class="status ' + esc(c.status) + '">' + esc(st) + '</span></div></div>';
  }

  /* ---------- system players ---------- */
  function renderPlayers() {
    var vids = [['media/video/studio-1.mp4', 'media/img/p-studio-1.jpg'], ['media/video/studio-2.mp4', 'media/img/p-studio-2.jpg']];
    $('#sysPlayers').innerHTML = vids.map(function (v) {
      return '<div class="vid"><video src="' + v[0] + '" poster="' + v[1] + '" playsinline preload="none" controls></video></div>';
    }).join('');
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), stage = $('#lbStage');
  function ytId(s) { var m = String(s || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/); return m ? m[1] : s; }
  function openLB(src, kind, title, desc, list) {
    var h = '';
    if (kind === 'image') h = '<img src="' + esc(src) + '" alt="' + esc(title) + '">';
    else if (kind === 'youtube') h = '<iframe src="https://www.youtube.com/embed/' + esc(ytId(src)) + '?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
    else h = '<video src="' + esc(src) + '" controls autoplay playsinline></video>';
    stage.innerHTML = h;
    $('#lbT').textContent = title || ''; $('#lbD').textContent = desc || '';
    var pl = $('#lbPl'); pl.innerHTML = '';
    if (list && list.length > 1) {
      list.forEach(function (s, i) {
        var b = document.createElement('button'); b.textContent = (state.lang === 'ar' ? 'لقطة ' : 'Shot ') + (i + 1); b.className = s === src ? 'on' : '';
        b.onclick = function () { openLB(s, 'video', title, desc, list); }; pl.appendChild(b);
      });
    }
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeLB() { lb.classList.remove('open'); stage.innerHTML = ''; document.body.style.overflow = ''; }
  $('#lbx').onclick = closeLB;
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLB(); });

  /* ---------- reveal ---------- */
  var io;
  function observe() {
    if (!('IntersectionObserver' in window)) { $$('.rv').forEach(function (e) { e.classList.add('in'); }); return; }
    io = io || new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv:not(.in)').forEach(function (e) { io.observe(e); });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var l = e.target.closest('.lang button'); if (l) return setLang(l.dataset.l);
    var f = e.target.closest('.chip'); if (f) { state.filter = f.dataset.f; renderFilters(); $$('.work').forEach(function (w) { var d = state.works[w.dataset.i]; w.classList.toggle('hide', state.filter !== 'all' && d.category !== state.filter); }); return; }
    var w = e.target.closest('.work');
    if (w) { var d = state.works[w.dataset.i], list = d.more && d.more.length ? [d.media].concat(d.more) : null; openLB(d.media_kind === 'youtube' ? (d.youtube || d.media) : d.media, d.media_kind, pick(d, 'title'), pick(d, 'desc'), list); return; }
    if (e.target.closest('#reelBtn')) return openLB('media/video/reel.mp4', 'video', state.lang === 'ar' ? 'شوريل محمود فداوي' : 'Mahmoud Fadawy — Showreel', state.lang === 'ar' ? 'مختارات من أعمال الذكاء الاصطناعي.' : 'A selection of AI filmmaking work.');
    if (e.target.closest('#burger')) { var b = $('#burger'), open = !b.classList.contains('open'); b.classList.toggle('open', open); $('#nav').classList.toggle('open', open); b.setAttribute('aria-expanded', open); return; }
    if (e.target.closest('#nav a')) { $('#burger').classList.remove('open'); $('#nav').classList.remove('open'); }
  });
  window.addEventListener('scroll', function () { $('#top').classList.toggle('solid', scrollY > 40); var v = $('#heroVid'); if (v && scrollY > innerHeight * 1.1) { if (!v.paused) v.pause(); } else if (v && v.paused && !lb.classList.contains('open')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }, { passive: true });

  /* ---------- boot ---------- */
  function load(url) { return fetch(url + '?v=' + Date.now()).then(function (r) { return r.json(); }); }
  var q = new URLSearchParams(location.search).get('lang');
  state.lang = (q === 'ar' || q === 'en') ? q : (store.get('mf-lang') === 'ar' ? 'ar' : 'en');
  if (q === 'en') store.set('mf-lang', 'en');
  applyStatic(); renderTicker(); renderPlayers(); observe();
  Promise.all([load('content/works.json'), load('content/credits.json')]).then(function (r) {
    state.works = r[0].works || []; state.credits = r[1].credits || [];
    renderFilters(); renderWorks(); renderCredits(); observe();
  }).catch(function () {
    var C = window.__CONTENT || { works: {}, credits: {} };
    state.works = C.works.works || []; state.credits = C.credits.credits || [];
    renderFilters(); renderWorks(); renderCredits(); observe();
  });
})();
