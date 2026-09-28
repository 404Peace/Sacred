/* ============================================
   ENHANCED EFFECTS — FULL LIBRARY + LIVE TOGGLES
   ============================================ */
(function () {
  'use strict';

  /* ===========================================================
     CONFIG — flip true/false or use the live panel
     =========================================================== */
  const DEFAULTS = {
    // Ambient
    particles:        true,
    aurora:           true,
    grain:            true,
    vignette:         true,

    // Cursor
    cursorSpotlight:  false,
    cursorTrail:      false,
    cursorReticle:    false,

    // Text
    heroShimmer:      true,
    nameSweep:        false,
    nameGlowPulse:    true,
    underlineDraw:    true,
    chromatic:        true,

    // Table
    rowSweep:         false,
    rowEntrance:      false,
    rowFlash:         false,
    zebraTint:        false,
    tierGlow:         false,
    dropBars:         false,

    // Planner
    confetti:         true,

    // UI / chrome
    borderGlow:       true,
    cardTilt:         true,
    chipGlow:         true,
    tabPill:          true,
    scrollProgress:   false,
    stickyHeaderShrink: true,
    haptic:           true,
    insetGlow:        true,
    pulseBadge:       true,

    // Tooltip
    tipScale:         true
  };

   const STORAGE_KEY = 'st:effects4';
  let EFFECTS = Object.assign({}, DEFAULTS);
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.assign(EFFECTS, saved);
  } catch (_) {}

  function saveEffects() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(EFFECTS)); } catch (_) {}
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ===========================================================
     AMBIENT
     =========================================================== */

  function initParticles() {
    if (reducedMotion) return;
    const old = document.querySelector('.particles');
    if (old) old.remove();

    const container = document.createElement('div');
    container.className = 'particles';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    const colors = ['#38e0b0', '#7c5cff', '#ffc861', '#ff7aa8', '#6fc6ff'];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--duration', (22 + Math.random() * 18) + 's');
      p.style.setProperty('--delay', (-Math.random() * 30) + 's');
      const size = (2 + Math.random() * 3) + 'px';
      p.style.width = p.style.height = size;
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  function initAurora() {
    if (reducedMotion) return;
    let a = document.querySelector('.aurora');
    if (!a) {
      a = document.createElement('div');
      a.className = 'aurora';
      a.setAttribute('aria-hidden', 'true');
      document.body.appendChild(a);
    }
    a.classList.add('on');
  }

  function initGrain() {
    let g = document.querySelector('.grain');
    if (!g) {
      g = document.createElement('div');
      g.className = 'grain';
      g.setAttribute('aria-hidden', 'true');
      document.body.appendChild(g);
    }
    g.classList.add('on');
  }

  function initVignette() {
    let v = document.querySelector('.vignette');
    if (!v) {
      v = document.createElement('div');
      v.className = 'vignette';
      v.setAttribute('aria-hidden', 'true');
      document.body.appendChild(v);
    }
    v.classList.add('on');
  }

  /* ===========================================================
     CURSOR
     =========================================================== */

  function initCursorSpotlight() {
    if (reducedMotion || isTouch) return;
    let layer = document.querySelector('.cursor-spotlight');
    if (layer) { layer.style.display = ''; return; }

    layer = document.createElement('div');
    layer.className = 'cursor-spotlight';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let raf = null;
    let visible = false;

    function tick() {
      layer.style.setProperty('--mx', mx + 'px');
      layer.style.setProperty('--my', my + 'px');
      raf = null;
    }
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) { layer.classList.add('on'); visible = true; }
      schedule();
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      layer.classList.remove('on'); visible = false;
    });
  }

  function initCursorTrail() {
    if (reducedMotion || isTouch) return;
    let container = document.querySelector('.cursor-trail');
    if (container) { container.style.display = ''; return; }

    container = document.createElement('div');
    container.className = 'cursor-trail';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) return;

      lastX = e.clientX; lastY = e.clientY;

      const dot = document.createElement('span');
      dot.className = 'trail-dot';
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      const hue = Math.floor((performance.now() / 20) % 360);
      dot.style.background = `hsl(${hue}, 80%, 65%)`;
      dot.style.boxShadow = `0 0 12px hsl(${hue}, 80%, 65%)`;
      container.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove(), { once: true });
    }, { passive: true });
  }

  function initCursorReticle() {
    if (reducedMotion || isTouch) return;
    let reticle = document.querySelector('.cursor-reticle');
    if (reticle) { reticle.style.display = ''; return; }

    reticle = document.createElement('div');
    reticle.className = 'cursor-reticle';
    reticle.setAttribute('aria-hidden', 'true');
    document.body.appendChild(reticle);

    let raf = null;
    let x = 0, y = 0;

    function tick() {
      reticle.style.left = x + 'px';
      reticle.style.top  = y + 'px';
      raf = null;
    }

    document.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      reticle.classList.add('on');
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      reticle.classList.remove('on');
    });
  }

  /* ===========================================================
     TEXT
     =========================================================== */

  function initHeroShimmer() {
    document.querySelectorAll('.hero-name').forEach((n, i) => {
      n.classList.add('shimmer');
      n.style.setProperty('--shimmer-delay', (i * 0.4) + 's');
    });
  }

  function initNameSweep() {
    document.querySelectorAll('#gear .item-name').forEach((n) => n.classList.add('sweep'));
  }

  function initNameGlowPulse() {
    document.querySelectorAll('#gear .item-name').forEach((n) => n.classList.add('glow-pulse'));
  }

  function initUnderlineDraw() {
    const sels = [
      '#gear .item-name',
      '#gear .mat-link',
      '#dungeons .dungeon-link',
      '#hero-grid .hero-name',
      '#item-grid .hero-name'
    ];
    document.querySelectorAll(sels.join(',')).forEach((n) => n.classList.add('underline-draw'));
  }

  function initChromatic() {
    document.querySelectorAll('#gear .item-name, #gear .mat-link')
      .forEach((n) => n.classList.add('chromatic'));
  }

  /* ===========================================================
     TABLE
     =========================================================== */

  function initRowSweep() {
    document.querySelectorAll('#gear tbody tr').forEach((tr) => tr.classList.add('sweep-row'));
  }

  function initZebraTint() {
    document.querySelectorAll('#gear tbody tr').forEach((tr) => tr.classList.add('zebra'));
  }

  function initTierGlow() {
    document.querySelectorAll('#gear tbody td.lvl-5').forEach((td) => td.classList.add('tier-glow'));
  }

  function initStaggeredRows() {
    const tbody = document.querySelector('#gear tbody');
    if (!tbody || reducedMotion) return;
    tbody.classList.add('rows-animate');
    const rowCount = tbody.children.length;
    const total = Math.min(rowCount * 0.02, 0.6);
    setTimeout(() => tbody.classList.remove('rows-animate'), total * 1000 + 400);
  }

  function initRowFlash() {
    const tbody = document.querySelector('#gear tbody');
    if (!tbody || reducedMotion) return;
    tbody.querySelectorAll('tr:not([hidden])').forEach((tr) => {
      tr.classList.remove('flash');
      void tr.offsetWidth;
      tr.classList.add('flash');
    });
  }

  function initDropBars() {
    const cells = document.querySelectorAll('#gear tbody .drop-cell');
    const pending = [];

    for (const cell of cells) {
      if (cell.querySelector('.drop-bar')) continue;
      const badge = cell.querySelector('.drop-best');
      if (!badge) continue;

      const m = (badge.textContent || '').match(/([\d.]+)%/);
      if (!m) continue;
      const pct = parseFloat(m[1]);
      if (!isFinite(pct) || pct <= 0) continue;

      const widthPct = Math.min(100, pct * 4);

      const bar = document.createElement('div');
      bar.className = 'drop-bar' + (pct < 1 ? ' low' : pct < 10 ? ' mid' : '');
      const fill = document.createElement('span');
      bar.appendChild(fill);
      badge.insertAdjacentElement('afterend', bar);

      pending.push([fill, widthPct]);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const [fill, w] of pending) fill.style.width = w + '%';
      });
    });
  }

  /* ===========================================================
     PLANNER
     =========================================================== */

  function initPlannerCelebration() {
    if (reducedMotion) return;

    const plannerContent = document.getElementById('planner-content');
    if (!plannerContent) return;
    if (plannerContent.__celebrateInit) return;
    plannerContent.__celebrateInit = true;

    const wasReady = new Map();

    function celebrate(item) {
      const ripple = document.createElement('span');
      ripple.className = 'complete-ripple';
      item.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });

      if (!EFFECTS.confetti) return;

      const colors = ['#38e0b0', '#7c5cff', '#ffc861', '#ff7aa8', '#6fc6ff'];
      const count = 18;
      const frag = document.createDocumentFragment();

      for (let i = 0; i < count; i++) {
        const c = document.createElement('span');
        c.className = 'confetti-piece';
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 80 + Math.random() * 120;
        c.style.background = colors[i % colors.length];
        c.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        c.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        c.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        c.style.setProperty('--dur', (0.9 + Math.random() * 0.6) + 's');
        frag.appendChild(c);
      }

      item.appendChild(frag);
      setTimeout(() => {
        item.querySelectorAll('.confetti-piece').forEach((el) => el.remove());
      }, 1700);
    }

    function checkItems() {
      const items = plannerContent.querySelectorAll('.planner-item');
      items.forEach((item) => {
        const nameEl = item.querySelector('.planner-item-head b');
        const id = nameEl ? nameEl.textContent : null;
        if (!id) return;
        const isReady = item.classList.contains('ready');
        const prev = wasReady.get(id);

        if (isReady && !prev) celebrate(item);
        wasReady.set(id, isReady);
      });
    }

    const mo = new MutationObserver(() => checkItems());
    mo.observe(plannerContent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    plannerContent.addEventListener('change', () => {
      requestAnimationFrame(() => requestAnimationFrame(checkItems));
    });

    checkItems();
  }

  /* ===========================================================
     UI / CHROME
     =========================================================== */

  function initTabPill() {
    const tabs = document.querySelector('.tabs');
    if (!tabs) return;

    let pill = tabs.querySelector('.tab-pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'tab-pill';
      pill.setAttribute('aria-hidden', 'true');
      tabs.insertBefore(pill, tabs.firstChild);
    }

    const buttons = tabs.querySelectorAll('.tab');

    function update() {
      const active = tabs.querySelector('.tab[aria-selected="true"]');
      if (!active) { pill.style.opacity = '0'; return; }
      const tabRect = tabs.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      pill.style.opacity = '1';
      pill.style.width = activeRect.width + 'px';
      pill.style.transform = `translateX(${activeRect.left - tabRect.left - 5}px)`;
    }

    requestAnimationFrame(update);
    buttons.forEach((b) => b.addEventListener('click', () => requestAnimationFrame(update)));

    if (tabs.__pillResize) window.removeEventListener('resize', tabs.__pillResize);
    let raf;
    tabs.__pillResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('resize', tabs.__pillResize, { passive: true });
  }

  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span');
      bar.appendChild(fill);
      document.body.appendChild(bar);
    }
    const fill = bar.firstElementChild;

    let raf = null;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      fill.style.transform = `scaleX(${pct})`;
      raf = null;
    }
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }
    if (!window.__scrollProgressInit) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      window.__scrollProgressInit = true;
    }
    update();
  }

  function initStickyHeaderShrink() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const scroller = table.closest('.scroll');
      if (!scroller || scroller.__shrinkInit) return;
      scroller.__shrinkInit = true;
      let raf = null;
      function check() {
        if (scroller.scrollTop > 20) table.classList.add('compact');
        else table.classList.remove('compact');
        raf = null;
      }
      scroller.addEventListener('scroll', () => {
        if (raf) return;
        raf = requestAnimationFrame(check);
      }, { passive: true });
    });
  }

  function initHaptic() {
    if (reducedMotion) return;
    if (window.__hapticInit) return;
    window.__hapticInit = true;
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('button, .action-btn, .chip, .dungeon-link');
      if (!btn) return;
      btn.classList.remove('haptic');
      void btn.offsetWidth;
      btn.classList.add('haptic');
      btn.addEventListener('animationend', () => btn.classList.remove('haptic'), { once: true });
    });
  }

  function initInsetGlow() {
    document.querySelectorAll('input#q, input#item-q, input[type=search], select')
      .forEach((el) => el.classList.add('inset-glow'));
  }

  function initRipple() {
    if (reducedMotion) return;
    if (window.__rippleInit) return;
    window.__rippleInit = true;

    if (!document.getElementById('ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent =
        '@keyframes ripple-effect{to{transform:translate(-50%,-50%) scale(1);opacity:0}}';
      document.head.appendChild(style);
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText =
        'position:absolute;pointer-events:none;border-radius:50%;' +
        'background:rgba(255,255,255,.35);' +
        'left:' + x + 'px;top:' + y + 'px;' +
        'width:200px;height:200px;' +
        'transform:translate(-50%,-50%) scale(0);' +
        'animation:ripple-effect .5s ease-out forwards;';

      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      if (getComputedStyle(btn).overflow !== 'hidden') btn.style.overflow = 'hidden';

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  }

  function initBorderGlow() {
    document.querySelectorAll('.hero-card').forEach((c) => c.classList.add('border-glow'));
  }

  function initChipGlow() {
    document.querySelectorAll('.chip').forEach((c) => c.classList.add('chip-glow'));
  }

  function initCardTilt() {
    if (reducedMotion || isTouch) return;
    document.querySelectorAll('.hero-card').forEach((card) => {
      if (card.__tiltInit) return;
      card.__tiltInit = true;
      card.classList.add('tilt');

      let raf = null;
      let targetX = 0, targetY = 0;

      function apply() {
        card.style.transform =
          `perspective(800px) rotateX(${targetY}deg) rotateY(${targetX}deg)`;
        raf = null;
      }

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        targetX = (px - 0.5) * 8;
        targetY = (py - 0.5) * -8;
        if (!raf) raf = requestAnimationFrame(apply);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        targetX = targetY = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      });
    });
  }

  function initTipScale() {
    const tip = document.getElementById('wc3-tip');
    if (tip) tip.classList.add('tip-scale');
  }

  function initPulseBadge() {
    document.querySelectorAll('.planner-ready-badge').forEach((b) => b.classList.add('pulse-badge'));
  }

  /* ===========================================================
     LIVE TOGGLE PANEL
     =========================================================== */

  function buildTogglePanel() {
    if (document.getElementById('fx-panel')) return;

    const btn = document.createElement('button');
    btn.id = 'fx-toggle';
    btn.setAttribute('aria-label', 'Toggle effects panel');
    btn.textContent = '✨';
    btn.style.cssText =
      'position:fixed;bottom:22px;left:22px;z-index:9999;' +
      'width:48px;height:48px;padding:0;border-radius:50%;font-size:20px;' +
      'background:linear-gradient(135deg,#5df3c6,#38e0b0 42%,#7c5cff);' +
      'color:#04140f;box-shadow:0 12px 30px -14px rgba(56,224,176,.95);';
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'fx-panel';
    panel.style.cssText =
      'position:fixed;bottom:80px;left:22px;z-index:9999;' +
      'width:280px;max-height:70vh;overflow-y:auto;' +
      'background:linear-gradient(180deg,rgba(22,33,50,.98),rgba(11,17,28,.98));' +
      'border:1px solid rgba(122,162,205,.34);border-radius:14px;' +
      'padding:16px;box-shadow:0 24px 60px -18px #000;' +
      'color:#dbe7f4;font:13px/1.5 ui-sans-serif,system-ui,sans-serif;' +
      'display:none;';

    panel.innerHTML =
      '<div style="font-weight:800;letter-spacing:.14em;text-transform:uppercase;' +
      'font-size:11px;color:#5df3c6;margin-bottom:12px">Effects</div>' +
      '<div id="fx-list"></div>' +
      '<button id="fx-reset" style="margin-top:14px;width:100%;padding:8px;' +
      'background:transparent;color:#dbe7f4;border:1px solid rgba(122,162,205,.34);' +
      'border-radius:8px;font-size:12px;cursor:pointer">Reset defaults</button>';

    document.body.appendChild(panel);

    const list = panel.querySelector('#fx-list');

    const groups = {
      'Ambient': ['particles', 'aurora', 'grain', 'vignette'],
      'Cursor':  ['cursorSpotlight', 'cursorTrail', 'cursorReticle'],
      'Text':    ['heroShimmer', 'nameSweep', 'nameGlowPulse', 'underlineDraw', 'chromatic'],
      'Table':   ['rowSweep', 'rowEntrance', 'rowFlash', 'zebraTint', 'tierGlow', 'dropBars'],
	  'Planner': ['confetti'],
      'Chrome':  ['borderGlow', 'cardTilt', 'chipGlow', 'tabPill', 'scrollProgress',
                  'stickyHeaderShrink', 'haptic', 'insetGlow',
                  'pulseBadge', 'tipScale']
    };

    const labels = {
      particles: 'Floating particles',
      aurora: 'Aurora background',
      grain: 'Film grain',
      vignette: 'Vignette breathe',
      cursorSpotlight: 'Cursor spotlight',
      cursorTrail: 'Cursor trail',
      cursorReticle: 'Cursor reticle',
      heroShimmer: 'Hero name shimmer',
      nameSweep: 'Name gradient sweep',
      nameGlowPulse: 'Name glow on hover',
      underlineDraw: 'Underline draw',
      chromatic: 'Chromatic aberration',
      rowSweep: 'Row highlight sweep',
      rowEntrance: 'Row entrance stagger',
      rowFlash: 'Row flash on filter',
      zebraTint: 'Zebra row tint',
      tierGlow: 'High-tier glow',
      dropBars: 'Drop-rate bars',
      confetti: 'Confetti burst',
      borderGlow: 'Card border glow',
      cardTilt: 'Card 3D tilt',
      chipGlow: 'Chip hover glow',
      tabPill: 'Sliding tab pill',
      scrollProgress: 'Scroll progress bar',
      stickyHeaderShrink: 'Sticky header shrink',
      haptic: 'Haptic bounce',
      insetGlow: 'Inset glow on focus',
      pulseBadge: 'Pulsing badges',
      tipScale: 'Tooltip scale-in'
    };

    for (const [group, keys] of Object.entries(groups)) {
      const gh = document.createElement('div');
      gh.textContent = group;
      gh.style.cssText =
        'font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;' +
        'color:#8ba0b8;margin:10px 0 6px';
      list.appendChild(gh);

      for (const key of keys) {
        const row = document.createElement('label');
        row.style.cssText =
          'display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;font-size:12.5px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!EFFECTS[key];
        cb.style.cssText = 'width:16px;height:16px;accent-color:#38e0b0;cursor:pointer';
        cb.addEventListener('change', () => {
          EFFECTS[key] = cb.checked;
          saveEffects();
          applyEffectToggle(key, cb.checked);
        });
        const span = document.createElement('span');
        span.textContent = labels[key] || key;
        row.append(cb, span);
        list.appendChild(row);
      }
    }

    panel.querySelector('#fx-reset').addEventListener('click', () => {
      EFFECTS = Object.assign({}, DEFAULTS);
      saveEffects();
      location.reload();
    });

    btn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
  }

  /* ===========================================================
     APPLY / REMOVE individual effects at runtime
     =========================================================== */

  function applyEffectToggle(key, on) {
    const classTargets = {
      rowSweep:      ['#gear tbody tr', 'sweep-row'],
      zebraTint:     ['#gear tbody tr', 'zebra'],
      tierGlow:      ['#gear tbody td.lvl-5', 'tier-glow'],
      heroShimmer:   ['.hero-name', 'shimmer'],
      nameSweep:     ['#gear .item-name', 'sweep'],
      nameGlowPulse: ['#gear .item-name', 'glow-pulse'],
      underlineDraw: ['#gear .item-name, #gear .mat-link, #dungeons .dungeon-link, .hero-name', 'underline-draw'],
      chromatic:     ['#gear .item-name, #gear .mat-link', 'chromatic'],
      borderGlow:    ['.hero-card', 'border-glow'],
      chipGlow:      ['.chip', 'chip-glow'],
      pulseBadge:    ['.planner-ready-badge', 'pulse-badge'],
      tipScale:      ['#wc3-tip', 'tip-scale'],
      insetGlow:     ['input#q, input#item-q, input[type=search], select', 'inset-glow']
    };

    const t = classTargets[key];
    if (t) {
      document.querySelectorAll(t[0]).forEach((el) => el.classList.toggle(t[1], on));
      return;
    }

    const layerMap = {
      particles:       '.particles',
      aurora:          '.aurora',
      grain:           '.grain',
      vignette:        '.vignette',
      cursorSpotlight: '.cursor-spotlight',
      cursorTrail:     '.cursor-trail',
      cursorReticle:   '.cursor-reticle',
      scrollProgress:  '.scroll-progress'
    };

    if (layerMap[key]) {
      const el = document.querySelector(layerMap[key]);
      if (!on) {
        if (el) el.style.display = 'none';
        return;
      }
      if (el) { el.style.display = ''; return; }
      const initializers = {
        particles:       initParticles,
        aurora:          initAurora,
        grain:           initGrain,
        vignette:        initVignette,
        cursorSpotlight: initCursorSpotlight,
        cursorTrail:     initCursorTrail,
        cursorReticle:   initCursorReticle,
        scrollProgress:  initScrollProgress
      };
      if (initializers[key]) initializers[key]();
      return;
    }

    if (on) {
      const initializers = {
        dropBars:           initDropBars,
        tabPill:            initTabPill,
        scrollProgress:     initScrollProgress,
        stickyHeaderShrink: initStickyHeaderShrink,
        haptic:             initHaptic,
        cardTilt:           initCardTilt,
        confetti:           initPlannerCelebration,
        rowEntrance:        initStaggeredRows,
        rowFlash:           initRowFlash
      };
      if (initializers[key]) initializers[key]();
    }
  }

  /* ===========================================================
     INIT
     =========================================================== */

  function init() {
    if (EFFECTS.particles)          initParticles();
    if (EFFECTS.aurora)             initAurora();
    if (EFFECTS.grain)              initGrain();
    if (EFFECTS.vignette)           initVignette();

    if (EFFECTS.cursorSpotlight)    initCursorSpotlight();
    if (EFFECTS.cursorTrail)        initCursorTrail();
    if (EFFECTS.cursorReticle)      initCursorReticle();

    if (EFFECTS.heroShimmer)        initHeroShimmer();
    if (EFFECTS.nameSweep)          initNameSweep();
    if (EFFECTS.nameGlowPulse)      initNameGlowPulse();
    if (EFFECTS.underlineDraw)      initUnderlineDraw();
    if (EFFECTS.chromatic)          initChromatic();

    if (EFFECTS.rowSweep)           initRowSweep();
    if (EFFECTS.rowEntrance)        initStaggeredRows();
    if (EFFECTS.rowFlash)           initRowFlash();
    if (EFFECTS.zebraTint)          initZebraTint();
    if (EFFECTS.tierGlow)           initTierGlow();
    if (EFFECTS.dropBars)           initDropBars();

    if (EFFECTS.confetti)           initPlannerCelebration();
    if (EFFECTS.pulseBadge)         initPulseBadge();

    if (EFFECTS.borderGlow)         initBorderGlow();
    if (EFFECTS.cardTilt)           initCardTilt();
    if (EFFECTS.chipGlow)           initChipGlow();
    if (EFFECTS.tabPill)            initTabPill();
    if (EFFECTS.scrollProgress)     initScrollProgress();
    if (EFFECTS.stickyHeaderShrink) initStickyHeaderShrink();
    if (EFFECTS.haptic)             initHaptic();
    if (EFFECTS.insetGlow)          initInsetGlow();
    if (EFFECTS.tipScale)           initTipScale();

    initRipple();
    buildTogglePanel();
  }

  function observeTableRebuild() {
    const tbody = document.querySelector('#gear tbody');
    if (!tbody) return;
    const mo = new MutationObserver(() => {
      if (EFFECTS.rowSweep)  initRowSweep();
      if (EFFECTS.zebraTint) initZebraTint();
      if (EFFECTS.tierGlow)  initTierGlow();
      if (EFFECTS.dropBars)  initDropBars();
    });
    mo.observe(tbody, { childList: true });
  }

  function boot() {
    init();
    observeTableRebuild();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();