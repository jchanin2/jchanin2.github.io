// game.js — MUFFIN'S FOOD TRUCK: shifts, tickets, tips.
// Three ticket stations share one shell:
//   order — build a ratio table (set it up, add rows, serve the "?")
//   prep  — shrink a big ratio with a division ladder, then name the GCF
//   price — stamp price tags ✓/✗ against the supplier's price

const $ = id => document.getElementById(id);
const COARSE = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
const PATIENCE = {           // seconds of customer patience, by station and level
  order: [0, 120, 120, 150, 150],
  prep:  [0, 90, 100, 120, 130],
  price: [0, 90, 90, 100, 100]
};
const TIP_BASE = 4, TIP_SPEED = 4, TIP_EFF = 2, TIP_MAX = TIP_BASE + TIP_SPEED + TIP_EFF;

const CUSTOMERS = [['🦊', 'Fox'], ['🐻', 'Bear'], ['🐼', 'Panda'], ['🐨', 'Koala'], ['🦉', 'Owl'], ['🐸', 'Frog'],
  ['🐧', 'Penguin'], ['🦝', 'Raccoon'], ['🐰', 'Bunny'], ['🐯', 'Tiger'], ['🦁', 'Lion'], ['🐷', 'Pig'],
  ['🐮', 'Cow'], ['🐵', 'Monkey'], ['🦒', 'Giraffe'], ['🦔', 'Hedgehog'], ['🐢', 'Turtle'], ['🦩', 'Flamingo']];

const MUFFIN_SVG =
  '<svg viewBox="0 0 64 64" class="muffin-svg" aria-hidden="true">' +
  '<ellipse cx="14" cy="24" rx="5" ry="4" fill="#7a5a36"/><ellipse cx="50" cy="24" rx="5" ry="4" fill="#7a5a36"/>' +
  '<ellipse cx="32" cy="39" rx="22" ry="18" fill="#a0794c"/>' +
  '<ellipse cx="32" cy="47" rx="13" ry="9" fill="#b8935a"/>' +
  '<ellipse cx="32" cy="43" rx="5" ry="3" fill="#5c3d1e"/>' +
  '<circle cx="23" cy="33" r="3" fill="#2c1810"/><circle cx="41" cy="33" r="3" fill="#2c1810"/>' +
  '<circle cx="24" cy="32" r="1" fill="#fff"/><circle cx="42" cy="32" r="1" fill="#fff"/>' +
  '<path d="M27 51 Q32 55 37 51" fill="none" stroke="#5c3d1e" stroke-width="1.5" stroke-linecap="round"/>' +
  '<rect x="20" y="13" width="24" height="8" rx="2" fill="#fff" stroke="#d8d2c4"/>' +
  '<circle cx="24" cy="11" r="6" fill="#fff"/><circle cx="32" cy="8" r="7" fill="#fff"/><circle cx="40" cy="11" r="6" fill="#fff"/>' +
  '</svg>';

// ============================================================
// SAVE
// ============================================================
const Store = {
  KEY: 'foodtruck_v1',
  _d: null,
  load() {
    if (this._d) return this._d;
    try { this._d = JSON.parse(localStorage.getItem(this.KEY)); } catch (e) {}
    if (!this._d || typeof this._d !== 'object') this._d = {};
    if (!this._d.shifts || typeof this._d.shifts !== 'object') this._d.shifts = {};
    if (!this._d.drills || typeof this._d.drills !== 'object') this._d.drills = {};
    if (typeof this._d.totalTips !== 'number') this._d.totalTips = 0;
    return this._d;
  },
  save() { try { localStorage.setItem(this.KEY, JSON.stringify(this._d)); } catch (e) {} },
  shift(id) { return this.load().shifts[id] || null; },
  unlocked(i) { return i === 0 || !!this.shift(SHIFTS[i - 1].id); },
  recordShift(id, tips, stars) {
    const d = this.load(), prev = d.shifts[id];
    const newBest = !prev || tips > prev.bestTips;
    d.shifts[id] = { stars: Math.max(stars, prev ? prev.stars : 0), bestTips: Math.max(tips, prev ? prev.bestTips : 0) };
    d.totalTips += tips;
    this.save();
    return newBest;
  },
  drill(type) { return this.load().drills[type] || null; },
  recordDrill(type, run) {
    const d = this.load(), prev = d.drills[type] || { bestStreak: 0, bestLevel: 1 };
    const newBest = run.bestStreak > prev.bestStreak;
    d.drills[type] = { bestStreak: Math.max(run.bestStreak, prev.bestStreak), bestLevel: Math.max(run.level, prev.bestLevel) };
    d.totalTips += run.tips;
    this.save();
    return newBest;
  }
};

// ============================================================
// STATE
// ============================================================
const Game = {
  screen: 'menu',
  mode: null,            // 'shift' | 'drill'
  shiftIdx: 0,
  drillType: null, drillLevel: 1, drillClean: 0, drillStreak: 0, drillBestStreak: 0,
  rng: null,
  queue: [], idx: 0,
  ticket: null, ctrl: null,
  t: null,               // per-ticket: mistakes, hints, hintLevel, total, left, served, grumpy
  tips: 0, slipTips: [],
  stats: null,
  timerId: null,
  activeInput: null
};

function newStats() { return { served: 0, clean: 0, mistakes: 0, hints: 0, efficient: 0, maxTips: 0, secs: 0 }; }

// ---------- number pad: laptops type on the keyboard, touch screens tap ----------
// One preference shared by all the games on this site.
const NUMPAD_KEY = 'mathgames_numpad';
const Pad = {
  show: true,
  init() {
    let pref = null;
    try { pref = localStorage.getItem(NUMPAD_KEY); } catch (e) {}
    const fine = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    this.show = pref ? pref === 'show' : !fine;
  },
  toggle() {
    this.show = !this.show;
    try { localStorage.setItem(NUMPAD_KEY, this.show ? 'show' : 'hide'); } catch (e) {}
    paintPad();
  }
};
function paintPad() {
  const tk = Game.ticket;
  const needed = !!(tk && tk.type !== 'price' && Game.t && !Game.t.served);
  $('kbd-row').style.display = needed ? '' : 'none';
  $('keypad').style.display = needed && Pad.show ? '' : 'none';
  $('numpad-toggle').textContent = Pad.show ? '⌨️ Hide number pad' : '🔢 Show number pad';
  $('kbd-tip').innerHTML = '<b>Enter</b> checks · <b>Tab</b> jumps to the next box' +
    (tk && tk.type === 'order' ? ' · <b>+</b> adds a row' : '');
}

// ============================================================
// DOM HELPERS
// ============================================================
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function btn(label, cls, onClick) {
  const b = el('button', cls, label);
  b.type = 'button';
  b.addEventListener('click', onClick);
  return b;
}
function mkInput(ph, cls) {
  const i = document.createElement('input');
  i.type = 'text';
  i.className = 'chalk-in ' + (cls || '');
  i.placeholder = ph || '';
  i.autocomplete = 'off';
  i.spellcheck = false;
  i.setAttribute('inputmode', COARSE ? 'none' : 'decimal');
  i.addEventListener('input', () => { i.value = i.value.replace(/[^0-9.,\/ ]/g, ''); });
  return i;
}
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
  Game.screen = id;
  if (id !== 'play') stopPatience();
  window.scrollTo(0, 0);
}
function shake(e) { e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); }
function starsHTML(n) {
  let s = '';
  for (let i = 0; i < 3; i++) s += '<span class="star' + (i < n ? ' on' : '') + '">★</span>';
  return s;
}
const TYPE_ICON = { order: '🧾', prep: '🔪', price: '🏷️' };

// ============================================================
// MENU
// ============================================================
function renderMenu() {
  const list = $('shift-list');
  list.innerHTML = '';
  SHIFTS.forEach((sh, i) => {
    const rec = Store.shift(sh.id), open = Store.unlocked(i);
    const mix = {};
    sh.tickets.forEach(([ty]) => { mix[ty] = (mix[ty] || 0) + 1; });
    const mixStr = Object.keys(mix).map(k => TYPE_ICON[k] + '×' + mix[k]).join('  ');
    const card = el('button', 'shift-card' + (open ? '' : ' locked') + (rec ? ' done' : ''));
    card.type = 'button';
    card.innerHTML =
      '<div class="sc-num">SHIFT ' + (i + 1) + '</div>' +
      '<div class="sc-name">' + sh.name + '</div>' +
      '<div class="sc-blurb">' + sh.blurb + '</div>' +
      '<div class="sc-mix">' + mixStr + '</div>' +
      '<div class="sc-stars">' + starsHTML(rec ? rec.stars : 0) + '</div>' +
      (rec ? '<div class="sc-best">best: $' + rec.bestTips + ' in tips</div>' : '<div class="sc-best fresh">' + (open ? 'not played yet' : '') + '</div>') +
      (open ? '' : '<div class="sc-lock">🔒 finish Shift ' + i + ' to unlock</div>');
    if (open) card.addEventListener('click', () => startShift(i));
    else card.disabled = true;
    list.appendChild(card);
  });

  const dl = $('drill-list');
  dl.innerHTML = '';
  Object.keys(DRILLS).forEach(type => {
    const d = DRILLS[type], rec = Store.drill(type);
    const card = el('button', 'drill-card');
    card.type = 'button';
    card.innerHTML =
      '<div class="dc-icon">' + d.icon + '</div>' +
      '<div class="dc-name">' + d.name + '</div>' +
      '<div class="dc-blurb">' + d.blurb + '</div>' +
      '<div class="dc-best">' + (rec ? 'best streak ' + rec.bestStreak + ' · reached level ' + rec.bestLevel : 'levels up every 3 clean tickets') + '</div>';
    card.addEventListener('click', () => startDrill(type));
    dl.appendChild(card);
  });
  $('menu-tips').textContent = '$' + Store.load().totalTips.toLocaleString();
}

// ============================================================
// SHIFT / DRILL FLOW
// ============================================================
function startShift(i) {
  Game.mode = 'shift';
  Game.shiftIdx = i;
  Game.rng = makeRng((Date.now() ^ (i * 7919)) >>> 0);
  Game.queue = SHIFTS[i].tickets.slice();
  Game.idx = 0;
  Game.tips = 0;
  Game.slipTips = [];
  Game.stats = newStats();
  $('play-title').textContent = 'Shift ' + (i + 1) + ' · ' + SHIFTS[i].name;
  showScreen('play');
  loadTicket();
}

function startDrill(type) {
  Game.mode = 'drill';
  Game.drillType = type;
  Game.drillLevel = 1;
  Game.drillClean = 0;
  Game.drillStreak = 0;
  Game.drillBestStreak = 0;
  Game.rng = makeRng(Date.now() >>> 0);
  Game.idx = 0;
  Game.tips = 0;
  Game.stats = newStats();
  $('play-title').textContent = DRILLS[type].icon + ' ' + DRILLS[type].name + ' drill';
  showScreen('play');
  loadTicket();
}

function currentSpec() {
  return Game.mode === 'shift' ? Game.queue[Game.idx] : [Game.drillType, Game.drillLevel];
}

function loadTicket() {
  stopPatience();
  const [type, level] = currentSpec();
  const tk = genTicket(type, Game.rng, level);
  Game.ticket = tk;
  const cust = type === 'prep' ? null : CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
  const total = PATIENCE[type][level];
  Game.t = { mistakes: 0, hints: 0, hintLevel: 0, total, left: total, served: false, grumpy: false, start: performance.now() };

  renderTicketCard(tk, cust);
  // on stacked (narrow) layouts the ticket scrolls away — keep the problem pinned above the board
  const tx = ticketText(tk);
  $('recap').innerHTML = '<span class="recap-l">' + tx.boardLabel + '</span> ' + tx.board +
    (type === 'order' ? '<div class="recap-ask">“' + tx.bubble + '”</div>' : '');
  const ws = $('workspace');
  ws.innerHTML = '';
  setFeedback('', '');
  $('next-row').style.display = 'none';
  paintPad();
  Game.activeInput = null;
  Game.ctrl = CONTROLLERS[type](tk, ws, API);
  ws.classList.remove('enter'); void ws.offsetWidth; ws.classList.add('enter');
  renderRail();
  renderHud();
  startPatience();
}

function renderTicketCard(tk, cust) {
  const tx = ticketText(tk);
  $('tk-type').textContent = tx.label;
  $('tk-num').textContent = Game.mode === 'shift' ? '#' + (Game.idx + 1) + ' of ' + Game.queue.length : 'LEVEL ' + Game.drillLevel;
  if (cust) { $('tk-face').textContent = cust[0]; $('tk-name').textContent = cust[1]; }
  else { $('tk-face').innerHTML = MUFFIN_SVG; $('tk-name').textContent = 'Muffin (the boss)'; }
  $('tk-board-label').textContent = tx.boardLabel;
  $('tk-board').innerHTML = tx.board;
  $('tk-bubble').innerHTML = tx.bubble;
  $('hint-box').style.display = 'none';
  $('hint-box').innerHTML = '';
  $('btn-hint').disabled = false;
  $('tk-stamp').style.display = 'none';
  $('tk-tipline').innerHTML = '';
  const card = $('ticket');
  card.classList.remove('served', 'slide'); void card.offsetWidth; card.classList.add('slide');
}

function renderRail() {
  const rail = $('rail');
  rail.innerHTML = '';
  if (Game.mode === 'shift') {
    Game.queue.forEach(([ty], i) => {
      const s = el('div', 'slip' + (i < Game.idx ? ' done' : i === Game.idx ? ' current' : ''));
      s.innerHTML = '<span class="slip-icon">' + TYPE_ICON[ty] + '</span>' +
        (i < Game.idx ? '<span class="slip-tip">+$' + (Game.slipTips[i] || 0) + '</span>' : '<span class="slip-n">' + (i + 1) + '</span>');
      rail.appendChild(s);
    });
  } else {
    for (let lv = 1; lv <= 4; lv++) {
      rail.appendChild(el('div', 'lvl' + (lv < Game.drillLevel ? ' done' : lv === Game.drillLevel ? ' current' : ''), 'Level ' + lv));
    }
    const dots = el('div', 'clean-dots');
    for (let i = 0; i < 3; i++) dots.appendChild(el('span', 'dot' + (i < Game.drillClean ? ' on' : '')));
    if (Game.drillLevel < 4) rail.appendChild(dots);
  }
}

function renderHud() {
  $('hud-tips').textContent = '$' + Game.tips;
  $('hud-prog').textContent = Game.mode === 'shift'
    ? 'Ticket ' + Math.min(Game.idx + 1, Game.queue.length) + '/' + Game.queue.length
    : 'Streak ' + Game.drillStreak;
}

// ---------- patience ----------
function startPatience() {
  stopPatience();
  paintPatience();
  Game.timerId = setInterval(() => {
    const t = Game.t;
    if (!t || t.served || document.hidden) return;
    if (t.left > 0) {
      t.left--;
      if (t.left > 0 && t.left <= 10) SFX.play('tick');
    }
    if (t.left === 0 && !t.grumpy) {
      t.grumpy = true;
      setFeedback('😤 The customer is getting grumpy — the speed tip is gone, but keep going. You can still serve it!', 'soft');
    }
    paintPatience();
  }, 1000);
}
function stopPatience() { if (Game.timerId) clearInterval(Game.timerId); Game.timerId = null; }
function paintPatience() {
  const t = Game.t;
  if (!t) return;
  const pct = t.total ? t.left / t.total : 0;
  const fill = $('pat-fill');
  fill.style.width = (pct * 100) + '%';
  fill.className = 'pat-fill' + (pct <= 0.25 ? ' low' : pct <= 0.55 ? ' mid' : '');
  $('tk-mood').textContent = t.served ? '😋' : pct > 0.55 ? '😀' : pct > 0.25 ? '😐' : pct > 0 ? '😟' : '😤';
}

// ---------- feedback + hints ----------
function setFeedback(msg, kind) {
  const fb = $('fb');
  fb.innerHTML = msg;
  fb.className = 'fb' + (kind ? ' ' + kind : '');
}

function useHint() {
  if (!Game.ctrl || !Game.t || Game.t.served) return;
  const text = Game.ctrl.hint(Game.t.hintLevel);
  if (!text) return;
  Game.t.hints++;
  Game.t.hintLevel++;
  SFX.play('radio');
  const box = $('hint-box');
  box.innerHTML = MUFFIN_SVG + '<div class="hint-text">' + text + '</div>';
  box.style.display = 'flex';
  box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop');
}

// API handed to every station controller
const API = {
  miss(msg) {
    Game.t.mistakes++;
    SFX.play('wrong');
    setFeedback('✗ ' + msg, 'wrong');
    shake($('workspace'));
  },
  soft(msg) { SFX.play('soft'); setFeedback(msg, 'soft'); },
  ok(msg) { SFX.play('correct'); setFeedback(msg, 'good'); },
  step(msg) { SFX.play('stage'); setFeedback(msg, 'good'); },
  serve(info) { serveTicket(info); }
};

// ---------- serving + tips ----------
function serveTicket(info) {
  const t = Game.t;
  if (t.served) return;
  t.served = true;
  stopPatience();
  paintPatience();
  const speed = Math.round(TIP_SPEED * (t.left / t.total));
  const eff = info.efficient ? TIP_EFF : 0;
  const tip = Math.max(1, Math.min(TIP_MAX, TIP_BASE + speed + eff - t.mistakes - t.hints));
  Game.tips += tip;
  const s = Game.stats;
  s.served++;
  s.maxTips += TIP_MAX;
  s.mistakes += t.mistakes;
  s.hints += t.hints;
  s.secs += (performance.now() - t.start) / 1000;
  if (t.mistakes === 0 && t.hints === 0) s.clean++;
  if (info.efficient) s.efficient++;
  if (Game.mode === 'shift') Game.slipTips[Game.idx] = tip;

  SFX.play('correct');
  setTimeout(() => SFX.play('cash'), 220);
  $('ticket').classList.add('served');
  const stamp = $('tk-stamp');
  stamp.innerHTML = 'SERVED<span>+$' + tip + ' tip</span>';
  stamp.style.display = 'block';
  const parts = ['base $' + TIP_BASE];
  if (speed) parts.push('speed +$' + speed);
  if (eff) parts.push('efficient +$' + eff);
  if (t.mistakes) parts.push('mistakes −$' + t.mistakes);
  if (t.hints) parts.push('hints −$' + t.hints);
  $('tk-tipline').innerHTML = parts.join(' · ');
  $('btn-hint').disabled = true;
  setFeedback('🍽️ ' + (info.note || 'Order up!'), 'good');
  floatTip(tip);

  if (Game.mode === 'drill') {
    if (t.mistakes === 0 && t.hints === 0) { Game.drillStreak++; Game.drillClean++; }
    else { Game.drillStreak = 0; Game.drillClean = 0; }
    Game.drillBestStreak = Math.max(Game.drillBestStreak, Game.drillStreak);
    if (Game.drillClean >= 3 && Game.drillLevel < 4) {
      Game.drillLevel++;
      Game.drillClean = 0;
      showLevelUp(Game.drillLevel);
    }
  }
  renderHud();
  renderRail();

  const last = Game.mode === 'shift' && Game.idx >= Game.queue.length - 1;
  $('btn-next').textContent = last ? 'Close up shop →' : 'Next ticket →';
  $('next-row').style.display = 'flex';
  paintPad();
  setTimeout(() => $('btn-next').focus(), 50);
}

function floatTip(tip) {
  const r = $('hud-tips').getBoundingClientRect();
  const f = el('div', 'float-tip', '+$' + tip);
  f.style.left = (r.left + r.width / 2) + 'px';
  f.style.top = r.top + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1200);
}

function showLevelUp(lv) {
  const b = $('levelup');
  b.innerHTML = '⬆ LEVEL ' + lv + '<span>bigger numbers incoming</span>';
  b.style.display = 'block';
  b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
  SFX.play('rankup');
  setTimeout(() => { b.style.display = 'none'; }, 1900);
}

function nextTicket() {
  if (Game.mode === 'shift') {
    Game.idx++;
    if (Game.idx >= Game.queue.length) { endShift(); return; }
  } else {
    Game.idx++;
  }
  loadTicket();
}

// ============================================================
// RESULTS
// ============================================================
function verdictFor(stars, s) {
  const effRate = s.served ? s.efficient / s.served : 0;
  if (stars === 3 && effRate >= 0.7) return 'Muffin wipes down the counter and gives you a slow, proud nod. Fast, clean, and efficient — that\'s a real line cook.';
  if (stars === 3) return 'Three stars! Muffin is impressed. Next time, try fewer rows — find the row with a 1, then jump straight to the order.';
  if (s.hints >= s.served && s.served) return 'Muffin was happy to help — now try a run where you ask for fewer hints. You know more than you think.';
  if (s.mistakes > s.served) return 'Lots of sent-back orders today. Slow down one second: copy the menu board into row 1 carefully, then do the SAME thing to both columns.';
  return 'Solid shift! Run it again — faster serves and shorter tables earn bigger tips.';
}

function renderResults(o) {
  $('res-title').textContent = o.title;
  $('res-stamp').innerHTML = o.stamp;
  $('res-stars').innerHTML = o.stars == null ? '' : starsHTML(o.stars);
  $('res-stars').style.display = o.stars == null ? 'none' : '';
  $('res-tips').textContent = '$' + o.tips;
  $('res-badges').innerHTML = o.badges.join('');
  $('res-grid').innerHTML = o.cells.map(([n, l]) => '<div class="res-cell"><b>' + n + '</b><span>' + l + '</span></div>').join('');
  $('res-verdict').textContent = o.verdict;
  $('btn-nextshift').style.display = o.nextShift != null ? '' : 'none';
  showScreen('results');
  if (o.party) confetti();
}

function endShift() {
  stopPatience();
  const s = Game.stats, sh = SHIFTS[Game.shiftIdx];
  const frac = s.maxTips ? Game.tips / s.maxTips : 0;
  const stars = frac >= 0.75 ? 3 : frac >= 0.5 ? 2 : 1;
  const firstTime = !Store.shift(sh.id);
  const newBest = Store.recordShift(sh.id, Game.tips, stars);
  const badges = [];
  if (newBest && !firstTime) badges.push('<span class="badge gold">🏆 NEW BEST</span>');
  if (firstTime && Game.shiftIdx < SHIFTS.length - 1) badges.push('<span class="badge mint">🔓 Shift ' + (Game.shiftIdx + 2) + ' unlocked</span>');
  if (s.efficient === s.served) badges.push('<span class="badge tomato">⚡ ALL EFFICIENT</span>');
  const hasNext = Game.shiftIdx < SHIFTS.length - 1;
  renderResults({
    title: 'Shift ' + (Game.shiftIdx + 1) + ' · ' + sh.name,
    stamp: 'CLOSED<br>FOR THE DAY',
    stars, tips: Game.tips, badges,
    cells: [
      [s.served, 'tickets served'],
      [s.clean + '/' + s.served, 'clean (no misses, no hints)'],
      [s.efficient + '/' + s.served, 'efficient solves'],
      [(s.served ? Math.round(s.secs / s.served) : 0) + 's', 'avg per ticket']
    ],
    verdict: verdictFor(stars, s),
    nextShift: hasNext ? Game.shiftIdx + 1 : null,
    party: stars === 3 || (newBest && !firstTime)
  });
  SFX.play(stars === 3 ? 'rankup' : 'cash');
}

function endDrill() {
  stopPatience();
  const s = Game.stats;
  const newBest = Store.recordDrill(Game.drillType, { bestStreak: Game.drillBestStreak, level: Game.drillLevel, tips: Game.tips });
  renderResults({
    title: DRILLS[Game.drillType].name + ' drill',
    stamp: 'DRILL<br>DONE',
    stars: null, tips: Game.tips,
    badges: newBest ? ['<span class="badge gold">🏆 NEW BEST STREAK: ' + Game.drillBestStreak + '</span>'] : [],
    cells: [
      [s.served, 'tickets served'],
      ['Level ' + Game.drillLevel, 'reached'],
      [Game.drillBestStreak, 'best clean streak'],
      [(s.served ? Math.round(s.secs / s.served) : 0) + 's', 'avg per ticket']
    ],
    verdict: s.served === 0 ? 'Muffin hands you an apron. Come back when you\'re ready!' :
      Game.drillLevel >= 4 ? 'Level 4 — the big-number station. Muffin is genuinely impressed.' :
      'Every 3 clean tickets in a row bumps the level. Push for the next one!',
    nextShift: null,
    party: newBest
  });
  SFX.play(newBest ? 'rankup' : 'cash');
}

function confetti() {
  const wrap = el('div', 'confetti');
  const glyphs = ['🌮', '🥤', '🍔', '⭐', '💵', '🥑', '🍋'];
  for (let i = 0; i < 26; i++) {
    const s = el('span', null, glyphs[i % glyphs.length]);
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = (Math.random() * 1.3) + 's';
    s.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 5000);
}

// ============================================================
// STATION: ORDER (ratio table)
// ============================================================
function arrowHTML(label, side) {
  const path = side === 'l' ? 'M20 3 Q3 33 20 63' : 'M4 3 Q21 33 4 63';
  const head = side === 'l' ? 'M12 58 L20 63 L13 67' : 'M12 58 L4 63 L11 67';
  return '<svg class="rt-arrow" viewBox="0 0 24 70" aria-hidden="true"><path d="' + path + '"/><path d="' + head + '"/></svg>' +
    '<span class="rt-lab">' + label + '</span>';
}

function OrderCtrl(tk, ws, api) {
  const c = CTX[tk.ctx];
  const mL = c.money === 'L', mR = c.money === 'R';
  const fL = x => fmtCell(x, mL), fR = x => fmtCell(x, mR);
  const tokenTxt = tk.side === 'L' ? fL(tk.t) : fR(tk.t);
  const sideLabel = tk.side === 'L' ? c.L : c.R, sideName = tk.side === 'L' ? c.Lname : c.Rname;
  const st = { phase: 'setup', placed: null, rows: [], editing: null };

  const board = el('div', 'chalkboard');
  const title = el('div', 'cb-title', 'Ratio table <span class="cb-step">Step 1 · set the table</span>');
  const instr = el('div', 'cb-instr', '① Copy the menu board\'s two numbers into the top row.<br>' +
    '② Tap the column where the customer\'s <b>' + tokenTxt + '</b> goes.');
  const rt = el('div', 'rt');
  board.append(title, instr, rt);

  function mkRow(cls) {
    const r = el('div', 'rt-row ' + (cls || ''));
    const gL = el('div', 'rt-g rt-gl'), cL = el('div', 'rt-c rt-cl'), cR = el('div', 'rt-c rt-cr'), gR = el('div', 'rt-g rt-gr');
    r.append(gL, cL, cR, gR);
    return { el: r, gL, cL, cR, gR };
  }
  function mkConn() {
    const r = el('div', 'rt-conn');
    const gL = el('div', 'rt-g rt-gl'), mid = el('div', 'rt-mid'), gR = el('div', 'rt-g rt-gr');
    r.append(gL, mid, gR);
    return { el: r, set(label) { gL.innerHTML = arrowHTML(label, 'l'); gR.innerHTML = arrowHTML(label, 'r'); r.classList.add('on'); } };
  }
  function lockCell(cell, text, cls) { cell.innerHTML = '<span class="rt-val ' + (cls || '') + '">' + text + '</span>'; }

  const head = mkRow('rt-head');
  head.cL.textContent = c.L;
  head.cR.textContent = c.R;
  const r0 = mkRow();
  const in0L = mkInput('?'), in0R = mkInput('?');
  r0.cL.appendChild(in0L);
  r0.cR.appendChild(in0R);
  r0.gL.innerHTML = '<span class="rt-tag">menu<br>board</span>';
  const connT = mkConn();
  const tr = mkRow('rt-target');
  tr.gL.innerHTML = '<span class="rt-tag">order</span>';
  const slotL = el('button', 'slot'), slotR = el('button', 'slot');
  slotL.type = slotR.type = 'button';
  tr.cL.appendChild(slotL);
  tr.cR.appendChild(slotR);
  rt.append(head.el, r0.el, connT.el, tr.el);
  let inT = null;

  function paintSlots() {
    [['L', slotL], ['R', slotR]].forEach(([s, b]) => {
      const on = st.placed === s;
      b.classList.toggle('filled', on);
      b.innerHTML = on ? '<span class="slot-val">' + tokenTxt + '</span>' : '<span class="slot-hint">tap to put<br><b>' + tokenTxt + '</b> here</span>';
    });
  }
  [['L', slotL], ['R', slotR]].forEach(([s, b]) => b.addEventListener('click', () => {
    if (st.phase !== 'setup') return;
    st.placed = st.placed === s ? null : s;
    paintSlots();
    SFX.play('select');
  }));
  paintSlots();

  const actions = el('div', 'cb-actions');
  board.appendChild(actions);
  function setActions(nodes) { actions.innerHTML = ''; nodes.forEach(n => actions.appendChild(n)); }
  setActions([
    el('div', 'token-line', 'Customer\'s number: <span class="token">' + tokenTxt + '</span>'),
    btn('Set the table ✓', 'btn btn-chalk', checkSetup)
  ]);
  ws.appendChild(board);
  setTimeout(() => in0L.focus(), 60);

  // ----- step 1: set the table -----
  function checkSetup() {
    if (st.phase !== 'setup') return;
    const a = parseNum(in0L.value), b = parseNum(in0R.value);
    if (a == null || b == null) return api.soft('Start with row 1: copy the two numbers from the menu board that go together.');
    if (!(approxEq(a, tk.a) && approxEq(b, tk.b))) {
      if (approxEq(a, tk.b) && approxEq(b, tk.a)) {
        return api.miss('Right numbers, wrong columns! ' + fL(tk.a) + ' goes under “' + c.L + '” and ' + fR(tk.b) + ' goes under “' + c.R + '”.');
      }
      return api.miss('Row 1 should be the two numbers on the menu board — the ' + c.Lname + ' and the ' + c.Rname + ' that go together.' +
        (tk.ctx === 'pennies' ? ' (“Each penny” means 1 penny!)' : ''));
    }
    if (!st.placed) return api.soft('Row 1 is right! Now tap the column where the customer\'s <b>' + tokenTxt + '</b> belongs.');
    if (st.placed !== tk.side) {
      return api.miss('The customer\'s ' + tokenTxt + ' is ' + sideName + ' — it belongs in the “' + sideLabel + '” column.');
    }
    // table is set
    st.phase = 'build';
    lockCell(r0.cL, fL(tk.a));
    lockCell(r0.cR, fR(tk.b));
    st.rows.push({ L: tk.a, R: tk.b });
    const known = tk.side === 'L' ? tr.cL : tr.cR, unknown = tk.side === 'L' ? tr.cR : tr.cL;
    lockCell(known, tokenTxt, 'tok');
    inT = mkInput('?', 'in-target');
    unknown.innerHTML = '';
    unknown.appendChild(inT);
    tr.el.classList.add('live');
    title.innerHTML = 'Ratio table <span class="cb-step">Step 2 · find the “?”</span>';
    instr.innerHTML = 'Answer in the “?” box — or add a stepping-stone row first (a row with a <b>1</b> works great).';
    setActions([btn('+ Add a row', 'btn btn-ghost', addRow), btn('Serve it ✓', 'btn btn-go', serve)]);
    api.step('Table set! Now find the “?” — add rows as stepping stones if you want.');
    setTimeout(() => inT.focus(), 40);
  }

  // ----- step 2: build rows -----
  function addRow() {
    if (st.phase !== 'build') return;
    if (st.editing) { st.editing.inL.focus(); return api.soft('Finish your new row first — press ✓ to check it, or ✕ to remove it.'); }
    if (st.rows.length >= 7) return api.soft('That\'s a lot of rows! Try a bigger jump.');
    const conn = mkConn(), r = mkRow('rt-new');
    const inL = mkInput('?'), inR = mkInput('?');
    r.cL.appendChild(inL);
    r.cR.appendChild(inR);
    r.gR.append(btn('✓', 'mini mini-ok', checkRow), btn('✕', 'mini mini-x', removeRow));
    rt.insertBefore(conn.el, connT.el);
    rt.insertBefore(r.el, connT.el);
    st.editing = { conn, r, inL, inR };
    SFX.play('select');
    setTimeout(() => inL.focus(), 30);
  }
  function removeRow() {
    if (!st.editing) return;
    st.editing.conn.el.remove();
    st.editing.r.el.remove();
    st.editing = null;
    setFeedback('', '');
  }
  function checkRow() {
    const e = st.editing;
    if (!e) return;
    const x = parseNum(e.inL.value), y = parseNum(e.inR.value);
    if (x == null || y == null) return api.soft('Fill in both numbers in your new row.');
    if (x <= 0 || y <= 0) return api.soft('Use numbers bigger than 0.');
    const prev = st.rows[st.rows.length - 1];
    if (approxEq(x, prev.L) && approxEq(y, prev.R)) return api.soft('That\'s the same as the row above — make a new row.');
    if (approxEq(x * tk.b, y * tk.a)) {
      const lab = factorLabel(x / prev.L);
      lockCell(e.r.cL, fL(x));
      lockCell(e.r.cR, fR(y));
      e.r.gR.innerHTML = '';
      e.r.el.classList.remove('rt-new');
      e.r.el.classList.add('pop');
      e.conn.set(lab);
      st.rows.push({ L: x, R: y });
      st.editing = null;
      api.ok('✓ Equivalent! You did ' + lab + ' to both columns.' + (approxEq(tk.side === 'L' ? x : y, 1) ? ' A row with a 1 — great stepping stone.' : ''));
      if (inT) setTimeout(() => inT.focus(), 30);
      return;
    }
    if (approxEq(x - prev.L, y - prev.R)) {
      return api.miss('You added the same amount to both columns. Equivalent ratios need multiplying or dividing — never adding!');
    }
    return api.miss('Not equivalent. Left: ' + fL(prev.L) + ' → ' + fL(x) + ' is ' + factorLabel(x / prev.L) +
      ', but right: ' + fR(prev.R) + ' → ' + fR(y) + ' is ' + factorLabel(y / prev.R) + '. Do the SAME thing to both columns.');
  }

  // ----- step 3: serve -----
  function serve() {
    if (st.phase !== 'build') return;
    if (st.editing) {
      if (!st.editing.inL.value && !st.editing.inR.value) removeRow();
      else return api.soft('Check your new row first (✓), or remove it (✕).');
    }
    const v = parseNum(inT.value);
    if (v == null) return api.soft('Type the missing number in the “?” box.');
    const last = st.rows[st.rows.length - 1];
    const tL = tk.side === 'L' ? tk.t : v, tR = tk.side === 'L' ? v : tk.t;
    if (approxEq(v, tk.answer)) {
      st.phase = 'done';
      lockCell(tk.side === 'L' ? tr.cR : tr.cL, tk.side === 'L' ? fR(v) : fL(v), 'ans');
      connT.set(factorLabel(tL / last.L));
      setActions([]);
      const k = st.rows.length - 1;   // stepping-stone rows used
      const note = k === 0 ? 'Straight to the answer — no stepping stones needed!' :
        k === 1 ? 'Efficient! One stepping stone, just like the book\'s “more efficient” table.' :
        k === 2 ? 'Nice work. Could you do it with just one stepping stone next time?' :
        'Served — the long way around. Try going straight to the row with a 1.';
      title.innerHTML = 'Ratio table <span class="cb-step">✓ served</span>';
      instr.remove();
      const ansMoney = tk.side === 'L' ? mR : mL;
      const ansTxt = ansMoney ? fmtMoney(v) : fmtNum(v) + ' ' + (tk.side === 'L' ? c.Rname : c.Lname);
      return api.serve({ efficient: k <= 1, note: '<b>' + ansTxt + '</b>. ' + note });
    }
    if (approxEq(tL - last.L, tR - last.R)) {
      return api.miss('Looks like you added instead of multiplied. Ratio tables multiply or divide BOTH columns.');
    }
    const known = tk.side === 'L' ? last.L : last.R, other = tk.side === 'L' ? fR(last.R) : fL(last.L);
    const f = tk.t / known;
    const tricky = !isInt(f) ? ' (That\'s a tricky jump — a row with a 1 makes it easy.)' : '';
    return api.miss('Not quite. From your last row, the ' + (tk.side === 'L' ? 'left' : 'right') + ' column goes ' +
      (tk.side === 'L' ? fL(known) : fR(known)) + ' → ' + tokenTxt + ' (' + factorLabel(f) + '). Do exactly that to ' + other + '.' + tricky);
  }

  return {
    plus() { if (st.phase === 'build') addRow(); },
    enter(target) {
      if (st.phase === 'setup') {
        // keyboard placement: Tab to a column, Enter puts the customer's number there
        if (target === slotL || target === slotR) {
          st.placed = target === slotL ? 'L' : 'R';
          paintSlots();
          SFX.play('select');
          if (in0L.value && in0R.value) checkSetup();
          return;
        }
        if (target === in0L && !in0R.value) { in0R.focus(); return; }
        return checkSetup();
      }
      if (st.phase !== 'build') return;
      if (st.editing && (target === st.editing.inL || target === st.editing.inR)) {
        if (target === st.editing.inL && !st.editing.inR.value) { st.editing.inR.focus(); return; }
        return checkRow();
      }
      return serve();
    },
    hint(level) {
      if (st.phase === 'setup') {
        if (level === 0) return 'The menu board gives you two numbers that go together: <b>' + fL(tk.a) + '</b> and <b>' + fR(tk.b) +
          '</b>. That\'s row 1. The customer\'s <b>' + tokenTxt + '</b> is the third piece of information.';
        return 'Row 1: <b>' + fL(tk.a) + '</b> under “' + c.L + '”, <b>' + fR(tk.b) + '</b> under “' + c.R + '”. The customer\'s ' +
          tokenTxt + ' is ' + sideName + ', so it goes in the “' + sideLabel + '” column.';
      }
      if (st.phase !== 'build') return null;
      const last = st.rows[st.rows.length - 1];
      const v = tk.side === 'L' ? last.L : last.R;
      const vTxt = tk.side === 'L' ? fL(v) : fR(v);
      const m = tk.t / v;
      if (isInt(m) && m > 1 && !approxEq(v, 1)) {
        return level === 0
          ? 'Look at the “' + sideLabel + '” column: ' + vTxt + ' → ' + tokenTxt + '. Is there a whole number you can multiply by?'
          : 'Multiply BOTH numbers in your last row by <b>' + fmtNum(m) + '</b>.';
      }
      if (!approxEq(v, 1)) {
        const oVal = tk.side === 'L' ? last.R : last.L;
        const o = tk.side === 'L' ? fR(last.R) : fL(last.L);
        const otherLabel = tk.side === 'L' ? c.R : c.L;
        // a 1 in the customer's column only helps if the other number comes out clean (not 0.8333…)
        if (isInt((oVal / v) * 100)) {
          return level === 0
            ? 'Try making a row with a <b>1</b> in the “' + sideLabel + '” column. Tap “+ Add a row”.'
            : 'Divide both numbers by ' + vTxt + ': the new row is 1 and ' + o + ' ÷ ' + vTxt + '. Then multiply that row by ' + tokenTxt + '.';
        }
        // dividing by the OTHER column's number puts the 1 over there; the customer's column becomes this
        const unitSide = tk.side === 'R' ? fR(last.R / last.L) : fL(last.L / last.R);
        return level === 0
          ? 'A 1 in the “' + sideLabel + '” column gives a messy decimal here. Try a row with a <b>1</b> in the “' + otherLabel + '” column instead.'
          : 'Divide both numbers by ' + o + ': that row is 1 and ' + unitSide + '. Then ask: how many ' + unitSide + 's make ' + tokenTxt + '? Multiply that row by that number.';
      }
      return 'You have a 1 in the “' + sideLabel + '” column. Multiply BOTH numbers in that row by <b>' + tokenTxt + '</b>.';
    }
  };
}

// ============================================================
// STATION: PREP (GCF division ladder)
// ============================================================
function divisHint(A, B, level) {
  const g = gcd(A, B);
  if (g === 1) return 'No whole number bigger than 1 divides both ' + fmtNum(A) + ' and ' + fmtNum(B) + '. Tap “simplest form”!';
  const sp = smallestPrimeFactor(g);
  if (level >= 1) return 'Try ÷ <b>' + sp + '</b>: work out ' + fmtNum(A) + ' ÷ ' + sp + ' and ' + fmtNum(B) + ' ÷ ' + sp + '.';
  if (A % 10 === 0 && B % 10 === 0) return 'Both numbers end in 0 — you can divide both by 10.';
  if (A % 2 === 0 && B % 2 === 0) return 'Both are even, so 2 works. (Are both multiples of 4? Even better!)';
  if (A % 5 === 0 && B % 5 === 0) return 'Both end in 0 or 5 — try 5.';
  const ds = n => String(n).split('').reduce((s, d) => s + +d, 0);
  if (A % 3 === 0 && B % 3 === 0) {
    return 'Digit-sum trick: the digits of ' + fmtNum(A) + ' add to ' + ds(A) + ', and ' + fmtNum(B) + ' adds to ' + ds(B) +
      '. Both are multiples of 3, so 3 divides both' + (A % 9 === 0 && B % 9 === 0 ? ' (so does 9!)' : '') + '.';
  }
  return 'They share an odd factor — try 7, 11 or 13. Does it go into both evenly?';
}

function PrepCtrl(tk, ws, api) {
  const f = PREP_FLAVOR[tk.flavor];
  const st = { A: tk.A, B: tk.B, divs: [], phase: 'ladder' };

  const board = el('div', 'chalkboard');
  board.appendChild(el('div', 'cb-title', 'Shrink it <span class="cb-step">divide BOTH numbers by a factor they share</span>'));
  const instr = el('div', 'cb-instr', '① In the ÷ box, type a number that divides BOTH.<br>' +
    '② Write both answers underneath. Repeat until nothing else divides both, then tap <b>simplest form</b>.');
  board.appendChild(instr);
  const ld = el('div', 'ladder');
  ld.appendChild(el('div', 'ld-row ld-head', '<div class="ld-div"></div><div class="ld-n">' + f.L + '</div><div class="ld-n">' + f.R + '</div>'));
  board.appendChild(ld);

  function numRow(a, b) {
    const r = el('div', 'ld-row ld-nums');
    const dv = el('div', 'ld-div');
    r.append(dv, el('div', 'ld-n', fmtNum(a)), el('div', 'ld-n', fmtNum(b)));
    return { el: r, div: dv };
  }
  let cur = numRow(st.A, st.B);
  ld.appendChild(cur.el);
  let edit = null;
  function openEdit() {
    const inD = mkInput('?', 'in-div');
    cur.div.innerHTML = '<span class="ld-op">÷</span>';
    cur.div.appendChild(inD);
    const r = el('div', 'ld-row ld-edit');
    const inQ1 = mkInput('', 'in-q'), inQ2 = mkInput('', 'in-q');
    const c1 = el('div', 'ld-n'), c2 = el('div', 'ld-n');
    c1.appendChild(inQ1);
    c2.appendChild(inQ2);
    r.append(el('div', 'ld-div'), c1, c2);
    ld.appendChild(r);
    edit = { el: r, inD, inQ1, inQ2 };
    setTimeout(() => inD.focus(), 40);
  }
  openEdit();

  const actions = el('div', 'cb-actions');
  const gcfArea = el('div', 'gcf-area');
  gcfArea.style.display = 'none';
  board.append(actions, gcfArea);
  actions.append(btn('Divide ✓', 'btn btn-chalk', divide), btn('It\'s in simplest form!', 'btn btn-ghost', simplest));
  ws.appendChild(board);
  let inG = null;

  function checkDivisor() {
    const d = parseNum(edit.inD.value);
    if (d == null) { api.soft('Type a number in the ÷ box — something that divides BOTH numbers evenly.'); return null; }
    if (!isInt(d) || d < 2) { api.soft('Use a whole number bigger than 1.'); return null; }
    const bad = [st.A, st.B].filter(n => n % d !== 0);
    if (bad.length) { api.miss(fmtNum(d) + ' doesn\'t divide ' + bad.map(fmtNum).join(' or ') + ' evenly. Hunt for a factor they share.'); return null; }
    return d;
  }
  function divide() {
    if (st.phase !== 'ladder') return;
    const d = checkDivisor();
    if (d == null) return;
    const q1 = parseNum(edit.inQ1.value), q2 = parseNum(edit.inQ2.value);
    if (q1 == null || q2 == null) {
      api.soft('Good factor! Now fill in ' + fmtNum(st.A) + ' ÷ ' + d + ' and ' + fmtNum(st.B) + ' ÷ ' + d + ' underneath.');
      (q1 == null ? edit.inQ1 : edit.inQ2).focus();
      return;
    }
    const wrong = [];
    if (!approxEq(q1, st.A / d)) wrong.push(fmtNum(st.A) + ' ÷ ' + d + ' isn\'t ' + fmtNum(q1));
    if (!approxEq(q2, st.B / d)) wrong.push(fmtNum(st.B) + ' ÷ ' + d + ' isn\'t ' + fmtNum(q2));
    if (wrong.length) return api.miss('Check your division: ' + wrong.join('; ') + '.');
    cur.div.innerHTML = '<span class="ld-op">÷</span><span class="ld-d">' + d + '</span>';
    edit.el.remove();
    st.divs.push(d);
    st.A = st.A / d;
    st.B = st.B / d;
    cur = numRow(st.A, st.B);
    cur.el.classList.add('pop');
    ld.appendChild(cur.el);
    api.ok('✓ Both divided by ' + d + '. Can you divide again, or is it as simple as it gets?');
    openEdit();
  }
  function simplest() {
    if (st.phase !== 'ladder') return;
    const g = gcd(st.A, st.B);
    if (g > 1) return api.miss('Not yet — ' + fmtNum(st.A) + ' and ' + fmtNum(st.B) + ' can both still be divided by ' + smallestPrimeFactor(g) + '.');
    st.phase = 'gcf';
    instr.remove();
    edit.el.remove();
    cur.div.innerHTML = '';
    cur.el.classList.add('final');
    actions.innerHTML = '';
    if (st.divs.length === 1) {
      st.phase = 'done';
      return api.serve({ efficient: true, note: fmtNum(tk.A) + ' : ' + fmtNum(tk.B) + ' = <b>' + tk.p + ' : ' + tk.q +
        '</b>. One-shot — you divided by the GCF (' + tk.g + ') directly!' });
    }
    gcfArea.innerHTML = '<div class="gcf-line">Simplest form: <b>' + fmtNum(tk.A) + ' : ' + fmtNum(tk.B) + ' = ' + st.A + ' : ' + st.B + '</b></div>' +
      '<div class="gcf-q">You shrank it by a total of <span class="gcf-expr">' + st.divs.join(' × ') + '</span> = </div>';
    inG = mkInput('?', 'in-gcf');
    gcfArea.querySelector('.gcf-q').append(inG, btn('✓', 'btn btn-chalk btn-small', checkGcf));
    gcfArea.appendChild(el('div', 'gcf-note', '…and that total is the <b>GCF</b> of ' + fmtNum(tk.A) + ' and ' + fmtNum(tk.B) + '.'));
    gcfArea.style.display = 'block';
    api.step('Simplest form! Last step: multiply your divisors to find the GCF.');
    setTimeout(() => inG.focus(), 40);
  }
  function checkGcf() {
    if (st.phase !== 'gcf') return;
    const v = parseNum(inG.value);
    if (v == null) return api.soft('Multiply ' + st.divs.join(' × ') + ' and type the result.');
    if (!approxEq(v, tk.g)) return api.miss('Multiply all your divisors together: ' + st.divs.join(' × ') + '.');
    st.phase = 'done';
    inG.disabled = true;
    api.serve({ efficient: st.divs.length <= 2, note: 'GCF of ' + fmtNum(tk.A) + ' and ' + fmtNum(tk.B) + ' is <b>' + tk.g + '</b>, so ' +
      fmtNum(tk.A) + ' : ' + fmtNum(tk.B) + ' = <b>' + tk.p + ' : ' + tk.q + '</b>. ' +
      (st.divs.length <= 2 ? 'Efficient ladder!' : 'Bigger divisors = fewer steps next time.') });
  }

  return {
    enter(target) {
      if (st.phase === 'gcf') return checkGcf();
      if (st.phase !== 'ladder') return;
      if (target === edit.inD) {
        if (checkDivisor() != null) {
          if (!edit.inQ1.value) edit.inQ1.focus(); else divide();
        }
        return;
      }
      if (target === edit.inQ1 && !edit.inQ2.value) { edit.inQ2.focus(); return; }
      divide();
    },
    hint(level) {
      if (st.phase === 'gcf') return 'Multiply all the numbers you divided by: <b>' + st.divs.join(' × ') + '</b>.';
      if (st.phase !== 'ladder') return null;
      return divisHint(st.A, st.B, level);
    }
  };
}

// ============================================================
// STATION: PRICE CHECK
// ============================================================
function PriceCtrl(tk, ws, api) {
  const c = PRICE_CTX[tk.ctx];
  const state = tk.tags.map(() => 0);   // 0 unmarked, 1 ✓, 2 ✗
  const locked = tk.tags.map(() => false);
  let done = false;

  const board = el('div', 'chalkboard');
  board.appendChild(el('div', 'cb-title', 'Price check <span class="cb-step">tap once for ✓ fair, again for ✗ wrong</span>'));
  const grid = el('div', 'tags');
  const tagEls = tk.tags.map((tag, i) => {
    const b = el('button', 'tag', '<span class="tag-hole"></span><span class="tag-text">' + tagHTML(tag, tk.ctx) + '</span><span class="tag-mark"></span>');
    b.type = 'button';
    b.addEventListener('click', () => {
      if (locked[i] || done) return;
      state[i] = state[i] === 1 ? 2 : 1;
      b.classList.remove('bad');
      paint(i);
      SFX.play('select');
    });
    grid.appendChild(b);
    return b;
  });
  function paint(i) {
    const b = tagEls[i];
    b.classList.toggle('yes', state[i] === 1);
    b.classList.toggle('no', state[i] === 2);
    b.querySelector('.tag-mark').textContent = state[i] === 1 ? '✓' : state[i] === 2 ? '✗' : '';
  }
  const actions = el('div', 'cb-actions');
  actions.appendChild(btn('Stamp the tags ✓', 'btn btn-chalk', check));
  board.append(grid, actions);
  ws.appendChild(board);

  function check() {
    if (done) return;
    if (state.some((s, i) => s === 0 && !locked[i])) return api.soft('Mark every tag — tap once for ✓, twice for ✗.');
    const wrong = [];
    tk.tags.forEach((tag, i) => {
      if (locked[i]) return;
      if ((state[i] === 1) === tag.ok) { locked[i] = true; tagEls[i].classList.add('locked'); }
      else { wrong.push(i); tagEls[i].classList.add('bad'); }
    });
    if (wrong.length) return api.miss(wrong.length + ' tag' + (wrong.length > 1 ? 's are' : ' is') + ' stamped wrong — fix the red one' + (wrong.length > 1 ? 's' : '') + '.');
    done = true;
    actions.innerHTML = '';
    api.serve({ efficient: Game.t.mistakes === 0,
      note: 'Every tag checked! The real price is <b>' + fmtMoney2(tk.u) + ' per ' + c.one + '</b>.' });
  }

  return {
    enter() { check(); },
    hint(level) {
      if (level === 0) return 'The supplier\'s deal is ' + fmtNum(tk.q) + ' ' + c.many + ' for ' + fmtMoney2(tk.p) + '. What does <b>one</b> ' + c.one + ' cost?';
      return 'One ' + c.one + ' costs <b>' + fmtMoney2(tk.u) + '</b>. A tag is fair if its dollars ÷ its ' + c.many + ' = ' + fmtMoney2(tk.u) +
        ' — order doesn\'t matter (“$3 to 2 gallons” is the same deal as “2 gallons to $3”). Watch for tags that ADD instead of multiply!';
    }
  };
}

const CONTROLLERS = { order: OrderCtrl, prep: PrepCtrl, price: PriceCtrl };

// ============================================================
// WIRING
// ============================================================
function handleEnter(target) {
  if (Game.screen !== 'play') return;
  if ($('next-row').style.display !== 'none') { nextTicket(); return; }
  if (Game.ctrl && Game.ctrl.enter) Game.ctrl.enter(target);
}

document.addEventListener('DOMContentLoaded', () => {
  Store.load();
  SFX.init();
  const muteBtn = $('btn-mute');
  const paintMute = () => { muteBtn.textContent = SFX.icon(); muteBtn.title = SFX.title(); };
  paintMute();
  muteBtn.addEventListener('click', () => { SFX.cycle(); paintMute(); SFX.play('select'); });

  $('title-muffin').innerHTML = MUFFIN_SVG;
  Pad.init();
  $('numpad-toggle').addEventListener('click', () => Pad.toggle());
  renderMenu();

  document.addEventListener('focusin', e => {
    if (e.target.classList && e.target.classList.contains('chalk-in')) Game.activeInput = e.target;
  });
  document.querySelectorAll('#keypad .key').forEach(k => {
    k.addEventListener('pointerdown', e => e.preventDefault());
    k.addEventListener('mousedown', e => e.preventDefault());
    k.addEventListener('click', () => {
      const v = k.dataset.k;
      SFX.play('key');
      // focusin doesn't fire while the window is unfocused, so trust the live focus first
      const ae = document.activeElement;
      const inp = ae && ae.classList && ae.classList.contains('chalk-in') ? ae : Game.activeInput;
      if (v === 'enter') { handleEnter(inp); return; }
      if (!inp || !document.body.contains(inp) || inp.disabled) return;
      if (v === 'del') inp.value = inp.value.slice(0, -1);
      else inp.value += v;
      inp.dispatchEvent(new Event('input'));
      inp.focus();
    });
  });
  document.addEventListener('keydown', e => {
    if (Game.screen !== 'play') return;
    if ((e.key === '+' || e.key === '=') && Game.ctrl && Game.ctrl.plus) {
      e.preventDefault();
      Game.ctrl.plus();
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleEnter(document.activeElement);
  });

  $('btn-hint').addEventListener('click', useHint);
  $('btn-next').addEventListener('click', nextTicket);
  $('btn-back').addEventListener('click', () => {
    if (Game.mode === 'drill') { endDrill(); return; }
    if (Game.stats && Game.stats.served > 0 && !confirm('Leave this shift? Tips from this shift won\'t be saved.')) return;
    stopPatience();
    renderMenu();
    showScreen('menu');
  });
  $('btn-again').addEventListener('click', () => {
    if (Game.mode === 'drill') startDrill(Game.drillType); else startShift(Game.shiftIdx);
  });
  $('btn-nextshift').addEventListener('click', () => startShift(Game.shiftIdx + 1));
  $('btn-menu').addEventListener('click', () => { renderMenu(); showScreen('menu'); });
  $('btn-print').addEventListener('click', () => window.open('practice.html', '_blank'));
});
