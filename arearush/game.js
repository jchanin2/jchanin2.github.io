// game.js — MUFFIN'S RUSH: 90-second area speed runs.
// Muffin finally drives. Every correct area moves the van down the strip.

const ROUND_SECONDS = 90;
const WRONG_PENALTY = 5;        // seconds lost per miss
const SPEED_BONUS_UNDER = 12;   // answer faster than this earns bonus

const Store = {
  KEY: 'arearush_v1',
  _d: null,
  load() {
    if (this._d) return this._d;
    try { this._d = JSON.parse(localStorage.getItem(this.KEY)); } catch (e) {}
    if (!this._d || typeof this._d !== 'object' || !this._d.bests) this._d = { bests: {}, totalSolved: 0 };
    return this._d;
  },
  save() { try { localStorage.setItem(this.KEY, JSON.stringify(this._d)); } catch (e) {} },
  best(mode) { return this.load().bests[mode] || null; },
  // returns which records were broken
  record(mode, run) {
    const d = this.load();
    const prev = d.bests[mode];
    const broke = { score: false, speed: false };
    if (!prev || run.score > prev.score) broke.score = true;
    const speedEligible = run.solved >= 8;
    const prevSpeed = prev && prev.avgSec != null ? prev.avgSec : Infinity;
    if (speedEligible && run.avgSec < prevSpeed) broke.speed = true;
    d.bests[mode] = {
      score: Math.max(run.score, prev ? prev.score : 0),
      avgSec: broke.speed ? run.avgSec : (prev ? prev.avgSec : (speedEligible ? run.avgSec : null)),
      solved: Math.max(run.solved, prev ? prev.solved : 0)
    };
    d.totalSolved += run.solved;
    this.save();
    return broke;
  }
};

const Game = {
  mode: null,
  rng: null,
  problem: null,
  index: 0,
  missesThisProblem: 0,
  startedAt: 0,         // timestamp problem shown
  timeLeft: 0,
  timerId: null,
  run: null,            // { score, solved, firstTry, misses, streak, bestStreak, times: [] }
  over: false
};

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
}

function fmtSec(s) { return s.toFixed(1) + 's'; }

// ============================================================
// GARAGE (mode select)
// ============================================================
function renderGarage() {
  const list = $('mode-list');
  list.innerHTML = '';
  Object.keys(MODES).forEach(key => {
    const m = MODES[key];
    const best = Store.best(key);
    const bestLine = best
      ? '<div class="mode-best">BEST ' + best.score.toLocaleString() + (best.avgSec != null ? ' · ' + best.avgSec.toFixed(1) + 's/shape' : '') + '</div>'
      : '<div class="mode-best fresh">no run yet — set the record</div>';
    const card = document.createElement('button');
    card.className = 'mode-card mode-' + key;
    card.innerHTML =
      '<div class="mode-emoji">' + ({ para: '▱', tri: '△', mixed: '⛟', strange: '⬠', flags: '⚑', prisms: '🧊' })[key] + '</div>' +
      '<div class="mode-name">' + m.name + '</div>' +
      '<div class="mode-desc">' + ({
        para: 'b × h. Watch for decoy slants.',
        tri: '½ × b × h. The dashed line is your friend.',
        mixed: 'Everything at once, plus reverse problems.',
        strange: 'Trapezoids, houses, ramps, L-shapes.',
        flags: 'Shaded flags, frames & L-shapes — subtract the missing piece.',
        prisms: 'Surface area & volume of prisms — and you must pick the UNITS.'
      })[key] + '</div>' +
      bestLine;
    card.addEventListener('click', () => startRound(key));
    list.appendChild(card);
  });
  const d = Store.load();
  $('garage-total').textContent = d.totalSolved.toLocaleString();
}

// ============================================================
// ROUND FLOW
// ============================================================
function startRound(mode) {
  Game.mode = mode;
  Game.rng = makeRng(Date.now() % 2147483647);
  Game.index = 0;
  Game.over = false;
  Game.run = { score: 0, solved: 0, firstTry: 0, misses: 0, streak: 0, bestStreak: 0, times: [] };
  Game.timeLeft = ROUND_SECONDS;
  $('play-mode-name').textContent = MODES[mode].name;
  showScreen('play');
  renderHud();
  renderRoad();
  // 3-2-1-GO
  const cd = $('countdown');
  cd.style.display = 'flex';
  let n = 3;
  cd.textContent = n;
  SFX.play('tick');
  const iv = setInterval(() => {
    n--;
    if (n > 0) { cd.textContent = n; SFX.play('tick'); return; }
    clearInterval(iv);
    cd.textContent = 'GO!';
    SFX.play('stage');
    setTimeout(() => {
      cd.style.display = 'none';
      nextProblem();
      startClock();
    }, 450);
  }, 700);
}

function startClock() {
  stopClock();
  Game.timerId = setInterval(() => {
    Game.timeLeft--;
    if (Game.timeLeft <= 10 && Game.timeLeft > 0) SFX.play('tick');
    if (Game.timeLeft <= 0) { Game.timeLeft = 0; renderHud(); endRound(); return; }
    renderHud();
  }, 1000);
}
function stopClock() { if (Game.timerId) clearInterval(Game.timerId); Game.timerId = null; }

function multiplier() {
  const s = Game.run.streak;
  if (s >= 9) return 4;
  if (s >= 6) return 3;
  if (s >= 3) return 2;
  return 1;
}

function renderHud() {
  $('hud-score').textContent = Game.run.score.toLocaleString();
  $('hud-time').textContent = Game.timeLeft + 's';
  $('hud-time').classList.toggle('urgent', Game.timeLeft <= 10);
  const m = multiplier();
  const chip = $('hud-mult');
  chip.textContent = '×' + m;
  chip.className = 'mult-chip m' + m;
  $('hud-solved').textContent = Game.run.solved;
}

function renderRoad() {
  const van = $('van');
  const pct = Math.min(94, (Game.run.solved % 12) / 12 * 94);
  van.style.left = pct + '%';
  van.classList.toggle('blazing', Game.run.streak >= 3);
}

const POW_SUP = { 1: '', 2: '²', 3: '³' };

function nextProblem() {
  Game.problem = MODES[Game.mode].gen(Game.rng, Game.index);
  Game.index++;
  Game.missesThisProblem = 0;
  Game.selectedPow = null;
  Game.startedAt = performance.now();
  const p = Game.problem;
  const pow = p.unitPow || 2;
  const tag = p.needsUnit
    ? '<span class="unit-tag">pick the units!</span>'
    : '<span class="unit-tag">answer in ' + p.unit + POW_SUP[pow] + '</span>';
  $('problem-prompt').innerHTML = p.prompt + ' ' + tag;
  $('shape-box').innerHTML = p.svg;
  $('answer-input').value = '';
  // unit selector (surface area / volume problems)
  const row = $('unit-row');
  row.style.display = p.needsUnit ? 'flex' : 'none';
  if (p.needsUnit) {
    row.querySelectorAll('.unit-btn').forEach(b => {
      b.classList.remove('selected');
      b.innerHTML = p.unit + (POW_SUP[b.dataset.pow] ? '<sup>' + (b.dataset.pow === '2' ? '2' : '3') + '</sup>' : '');
    });
  }
  $('formula-hint').style.display = 'none';
  $('play-feedback').textContent = '';
  $('play-feedback').className = 'play-feedback';
  $('answer-input').focus();
}

function parseAnswer(v) {
  if (v === '' || v === '.') return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function submit() {
  if (Game.over || !Game.problem) return;
  const v = parseAnswer($('answer-input').value);
  const fb = $('play-feedback');
  if (v === null) { fb.textContent = 'Type an answer first.'; fb.className = 'play-feedback soft'; return; }

  const elapsed = (performance.now() - Game.startedAt) / 1000;

  // units check (surface area vs volume problems)
  if (Game.problem.needsUnit) {
    if (Game.selectedPow == null) {
      fb.innerHTML = 'Pick the units too — tap <b>' + Game.problem.unit + '</b>, <b>' + Game.problem.unit + '²</b> or <b>' + Game.problem.unit + '³</b>.';
      fb.className = 'play-feedback soft';
      return;
    }
    if (Math.abs(v - Game.problem.answer) < 1e-9 && Game.selectedPow !== Game.problem.unitPow) {
      Game.missesThisProblem++;
      Game.run.misses++;
      Game.run.streak = 0;
      Game.timeLeft = Math.max(0, Game.timeLeft - WRONG_PENALTY);
      SFX.play('wrong');
      shake($('play-card'));
      renderHud();
      renderRoad();
      fb.innerHTML = '✗ ' + v + ' is the right NUMBER — wrong <b>units</b>. Area is square units, volume is cubic. −' + WRONG_PENALTY + 's.';
      fb.className = 'play-feedback wrong';
      if (Game.timeLeft <= 0) endRound();
      return;
    }
  }

  if (Math.abs(v - Game.problem.answer) < 1e-9) {
    // correct
    const mult = multiplier();
    const speedBonus = Math.max(0, Math.round(SPEED_BONUS_UNDER - elapsed)) * 10;
    const pts = 100 * mult + speedBonus;
    Game.run.score += pts;
    Game.run.solved++;
    Game.run.times.push(elapsed);
    if (Game.missesThisProblem === 0) { Game.run.firstTry++; Game.run.streak++; }
    Game.run.bestStreak = Math.max(Game.run.bestStreak, Game.run.streak);
    SFX.play(Game.run.streak >= 3 ? 'streak' : 'correct');
    renderHud();
    renderRoad();
    floatPoints(pts, speedBonus > 0);
    const unitStr = Game.problem.unit + POW_SUP[Game.problem.unitPow || 2];
    fb.innerHTML = '✓ ' + Game.problem.answer + ' ' + unitStr + ' — <b>+' + pts + '</b>' + (speedBonus > 0 ? ' <span class="speedy">⚡ fast!</span>' : '');
    fb.className = 'play-feedback correct';
    Game.problem = null; // lock input until next renders
    setTimeout(() => { if (!Game.over) nextProblem(); }, 420);
  } else {
    // miss: lose time + streak, same problem stays
    Game.missesThisProblem++;
    Game.run.misses++;
    Game.run.streak = 0;
    Game.timeLeft = Math.max(0, Game.timeLeft - WRONG_PENALTY);
    SFX.play('wrong');
    shake($('play-card'));
    renderHud();
    renderRoad();
    fb.textContent = '✗ Not it — −' + WRONG_PENALTY + 's. Same shape, go again.';
    fb.className = 'play-feedback wrong';
    $('answer-input').value = '';
    $('answer-input').focus();
    if (Game.missesThisProblem >= 2) {
      $('formula-hint').innerHTML = '📻 ' + Game.problem.formulaHint;
      $('formula-hint').style.display = 'block';
      SFX.play('radio');
    }
    if (Game.timeLeft <= 0) endRound();
  }
}

function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

function floatPoints(pts, speedy) {
  const anchor = $('hud-score');
  const r = anchor.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-pts' + (speedy ? ' speedy' : '');
  el.textContent = '+' + pts;
  el.style.left = r.left + r.width / 2 + 'px';
  el.style.top = r.top + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ============================================================
// RESULTS
// ============================================================
function verdict(run, avg) {
  if (run.solved === 0) return 'Muffin idles. The van never left the curb. One more run?';
  const acc = run.firstTry / run.solved;
  if (avg <= 7 && acc >= 0.9) return 'Muffin lowers the sunglasses. A slow, respectful nod. You may drive the van.';
  if (avg <= 10 && acc >= 0.8) return 'Muffin chews approvingly. Fast AND clean — that\'s the job.';
  if (acc >= 0.9) return 'Muffin approves of the precision. Now push the pedal — same accuracy, less thinking time.';
  if (avg <= 8) return 'Blazing speed — but Muffin saw those wrong turns. Slow down 1 second, read the labels.';
  return 'Muffin circles the block. Decent run — watch for the decoy slant sides.';
}

function endRound() {
  if (Game.over) return;
  Game.over = true;
  stopClock();
  Game.problem = null;
  const run = Game.run;
  const avg = run.times.length ? run.times.reduce((a, b) => a + b, 0) / run.times.length : 0;
  const acc = run.solved ? Math.round(run.firstTry / run.solved * 100) : 0;
  run.avgSec = Math.round(avg * 10) / 10;

  const broke = Store.record(Game.mode, run);

  $('results-mode').textContent = MODES[Game.mode].name;
  $('res-score').textContent = run.score.toLocaleString();
  $('res-solved').textContent = run.solved;
  $('res-acc').textContent = acc + '%';
  $('res-avg').textContent = run.times.length ? fmtSec(avg) : '—';
  $('res-streak').textContent = run.bestStreak;

  const badges = $('res-badges');
  badges.innerHTML = '';
  if (broke.score && run.score > 0) badges.innerHTML += '<span class="badge gold">🏆 NEW BEST SCORE</span>';
  if (broke.speed) badges.innerHTML += '<span class="badge cyan">⚡ NEW SPEED RECORD</span>';
  if (run.bestStreak >= 9) badges.innerHTML += '<span class="badge fire">🔥 MAX COMBO ×4</span>';

  $('res-verdict').textContent = verdict(run, avg);
  showScreen('results');
  SFX.play(broke.score || broke.speed ? 'rankup' : 'cash');
  if (broke.score || broke.speed) confettiVans();
}

function confettiVans() {
  const wrap = document.createElement('div');
  wrap.className = 'van-rain';
  const glyphs = ['🚐', '⚡', '🏁', '🚐', '⭐'];
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('span');
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = (Math.random() * 1.2) + 's';
    s.style.animationDuration = (2 + Math.random() * 1.6) + 's';
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 4500);
}

// ============================================================
// WIRING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  SFX.init();
  const muteBtn = $('btn-mute');
  const paintMute = () => { muteBtn.textContent = SFX.muted ? '🔇' : '🔊'; };
  paintMute();
  muteBtn.addEventListener('click', () => { SFX.toggleMute(); paintMute(); });

  renderGarage();

  // answer input: digits + one dot
  const inp = $('answer-input');
  inp.addEventListener('input', () => {
    let v = inp.value.replace(/[^0-9.]/g, '');
    const firstDot = v.indexOf('.');
    if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
    inp.value = v;
  });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  // keypad
  document.querySelectorAll('#keypad .key').forEach(k => {
    k.addEventListener('click', () => {
      const v = k.dataset.k;
      if (v === 'del') inp.value = inp.value.slice(0, -1);
      else inp.value += v;
      inp.dispatchEvent(new Event('input'));
      inp.focus();
      SFX.play('key');
    });
  });
  $('btn-go').addEventListener('click', submit);

  // unit selector buttons
  document.querySelectorAll('#unit-row .unit-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#unit-row .unit-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      Game.selectedPow = parseInt(b.dataset.pow, 10);
      SFX.play('select');
      $('answer-input').focus();
    });
  });

  $('btn-quit').addEventListener('click', () => { stopClock(); Game.over = true; renderGarage(); showScreen('garage'); });
  $('btn-again').addEventListener('click', () => startRound(Game.mode));
  $('btn-garage').addEventListener('click', () => { renderGarage(); showScreen('garage'); });
  $('btn-print').addEventListener('click', () => { window.open('practice.html', '_blank'); });
});
