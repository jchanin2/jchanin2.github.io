// game.js — NIGHTFALL: save slots, heat & take, timers, payouts, ranks.

// ============================================================
// RANKS
// ============================================================
const RANKS = [
  { at: 0,     name: 'LOOKOUT' },
  { at: 5000,  name: 'PICKLOCK' },
  { at: 12000, name: 'SAFECRACKER' },
  { at: 22000, name: 'GHOST RUNNER' },
  { at: 32000, name: 'MASTERMIND' },
  { at: 42000, name: 'THE CIPHER · LEGEND' }
];
function rankFor(cash) {
  let r = RANKS[0], next = null;
  for (const rk of RANKS) { if (cash >= rk.at) r = rk; else { next = rk; break; } }
  return { rank: r, next };
}
function fmtCash(n) { return '$' + (n || 0).toLocaleString('en-US'); }

// ============================================================
// SAVE SLOTS
// ============================================================
const Slots = {
  KEY: 'nightfall_slots_v1',
  NUM_SLOTS: 3,
  activeIndex: 0,
  _data: null,

  load() {
    if (this._data) return this._data;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) this._data = JSON.parse(raw);
    } catch (e) { /* fall through */ }
    if (!this._data) this._data = { slots: [null, null, null], activeIndex: 0 };
    if (!Array.isArray(this._data.slots) || this._data.slots.length !== this.NUM_SLOTS) {
      this._data.slots = [null, null, null];
    }
    if (typeof this._data.activeIndex !== 'number' || this._data.activeIndex < 0 || this._data.activeIndex >= this.NUM_SLOTS) {
      this._data.activeIndex = 0;
    }
    this.activeIndex = this._data.activeIndex;
    return this._data;
  },
  persist() { try { localStorage.setItem(this.KEY, JSON.stringify(this._data)); } catch (e) {} },
  getActive() { this.load(); return this._data.slots[this.activeIndex]; },
  ensureActive() {
    this.load();
    if (!this._data.slots[this.activeIndex]) {
      this._data.slots[this.activeIndex] = { jobs: {}, cash: 0, createdAt: Date.now(), lastPlayed: Date.now() };
    }
    return this._data.slots[this.activeIndex];
  },
  selectSlot(idx) { this.load(); this.activeIndex = idx; this._data.activeIndex = idx; this.persist(); },
  deleteSlot(idx) { this.load(); this._data.slots[idx] = null; this.persist(); },
  jobState(id) { const s = this.getActive(); return (s && s.jobs && s.jobs[id]) || null; },
  saveJobState(id, state) {
    const slot = this.ensureActive();
    if (!slot.jobs) slot.jobs = {};
    slot.jobs[id] = Object.assign({}, slot.jobs[id] || {}, state);
    slot.lastPlayed = Date.now();
    this.persist();
  },
  bankCash(amount) {
    const slot = this.ensureActive();
    slot.cash = (slot.cash || 0) + amount;
    slot.lastPlayed = Date.now();
    this.persist();
    return slot.cash;
  },
  cash() { const s = this.getActive(); return (s && s.cash) || 0; },
  markJobComplete(id) {
    const slot = this.ensureActive();
    if (!slot.jobs) slot.jobs = {};
    const prev = slot.jobs[id] || {};
    slot.jobs[id] = { completed: true, currentChallenge: 0, timesCompleted: (prev.timesCompleted || 0) + 1 };
    slot.lastPlayed = Date.now();
    this.persist();
  },
  isJobComplete(id) {
    const s = this.getActive();
    return !!(s && s.jobs && s.jobs[id] && s.jobs[id].completed);
  },
  isJobUnlocked(idx) {
    if (idx === 0) return true;
    return this.isJobComplete(JOBS[idx - 1].id);
  },
  snapshotJob() {
    if (!Game.currentJob) return;
    this.saveJobState(Game.currentJob.id, { currentChallenge: Game.currentChallengeIndex, completed: this.isJobComplete(Game.currentJob.id) });
  },
  summary(idx) {
    this.load();
    const slot = this._data.slots[idx];
    if (!slot) return { isEmpty: true };
    const jobs = slot.jobs || {};
    const completed = JOBS.filter(j => jobs[j.id] && jobs[j.id].completed).length;
    let inProg = null;
    for (const j of JOBS) {
      const st = jobs[j.id];
      if (st && !st.completed && typeof st.currentChallenge === 'number' && st.currentChallenge > 0) {
        inProg = { title: j.title, currentChallenge: st.currentChallenge, total: j.challenges.length };
        break;
      }
    }
    return { isEmpty: false, completedCount: completed, totalJobs: JOBS.length, cash: slot.cash || 0, inProgress: inProg, lastPlayed: slot.lastPlayed };
  }
};

// ============================================================
// GAME + RUN STATE
// ============================================================
const Game = {
  currentScreen: 'title',
  currentJob: null,
  currentChallengeIndex: 0,
  activeEvaluator: null,
  run: null,          // { heat, take, alarms, attempts, firstTryStreak }
  timer: null         // { remaining, total, intervalId }
};

function newRun() { return { heat: 0, take: 0, alarms: 0, attempts: 0, firstTryStreak: 0 }; }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  Game.currentScreen = id;
  if (id !== 'challenge') stopTimer();
}

function _formatLastPlayed(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'today';
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 1) return 'yesterday';
  if (diff < 7) return diff + ' days ago';
  return d.toLocaleDateString();
}

// ============================================================
// TITLE EMBLEM — vault door under a crescent moon skyline
// ============================================================
function renderTitleEmblem() {
  const el = document.getElementById('title-emblem');
  if (!el) return;
  el.innerHTML =
    '<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
    // moon
    '<circle cx="160" cy="34" r="16" fill="#f0e8c8" opacity="0.9"/>' +
    '<circle cx="166" cy="30" r="14" fill="#0a0e1a"/>' +
    // skyline silhouette
    '<g fill="#111830">' +
    '<rect x="8" y="52" width="18" height="60"/><rect x="30" y="38" width="14" height="74"/>' +
    '<rect x="48" y="60" width="20" height="52"/><rect x="132" y="50" width="16" height="62"/>' +
    '<rect x="152" y="62" width="22" height="50"/><rect x="178" y="44" width="14" height="68"/>' +
    '</g>' +
    // lit windows
    '<g fill="#3de0ff" opacity="0.7">' +
    '<rect x="34" y="44" width="3" height="3"/><rect x="39" y="52" width="3" height="3"/>' +
    '<rect x="12" y="58" width="3" height="3"/><rect x="19" y="70" width="3" height="3"/>' +
    '<rect x="136" y="56" width="3" height="3"/><rect x="182" y="50" width="3" height="3"/>' +
    '<rect x="157" y="68" width="3" height="3"/>' +
    '</g>' +
    // vault door
    '<circle cx="100" cy="118" r="62" fill="#1a2440" stroke="#3de0ff" stroke-width="2.5"/>' +
    '<circle cx="100" cy="118" r="52" fill="#131a2e" stroke="#26507a" stroke-width="1.5"/>' +
    // bolts
    (() => {
      let s = '';
      for (let i = 0; i < 8; i++) {
        const a = i * 45 * Math.PI / 180;
        s += '<circle cx="' + (100 + Math.cos(a) * 57) + '" cy="' + (118 + Math.sin(a) * 57) + '" r="3" fill="#3de0ff" opacity="0.8"/>';
      }
      return s;
    })() +
    // spinning handle
    '<g class="emblem-spin" style="transform-origin:100px 118px;">' +
    '<circle cx="100" cy="118" r="30" fill="none" stroke="#ffd23d" stroke-width="4"/>' +
    '<line x1="100" y1="88" x2="100" y2="148" stroke="#ffd23d" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="70" y1="118" x2="130" y2="118" stroke="#ffd23d" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="100" cy="118" r="8" fill="#ffd23d"/>' +
    '</g>' +
    // keypad glow
    '<rect x="88" y="166" width="24" height="14" rx="2" fill="#0e1526" stroke="#ff3d8a" stroke-width="1"/>' +
    '<circle cx="94" cy="173" r="1.6" fill="#ff3d8a"/><circle cx="100" cy="173" r="1.6" fill="#ff3d8a"/><circle cx="106" cy="173" r="1.6" fill="#ff3d8a"/>' +
    '</svg>';
}

// ============================================================
// SLOT PICKER
// ============================================================
function renderSlotPicker() {
  const list = document.getElementById('slots-list');
  list.innerHTML = '';
  for (let i = 0; i < Slots.NUM_SLOTS; i++) {
    const summary = Slots.summary(i);
    const isActive = i === Slots.activeIndex && !summary.isEmpty;
    const card = document.createElement('div');
    card.className = 'slot-card' + (summary.isEmpty ? ' empty' : '') + (isActive ? ' active' : '');
    if (summary.isEmpty) {
      card.innerHTML =
        '<div class="slot-card-number">Dossier ' + (i + 1) + '</div>' +
        '<div class="slot-card-title">NO CREW MEMBER ON FILE</div>' +
        '<div class="slot-card-empty-hint">Tap to join the crew.</div>';
    } else {
      const rk = rankFor(summary.cash);
      const inProg = summary.inProgress;
      const resume = inProg ? '<div class="resume-line">▶ ' + inProg.title + ' — lock ' + (inProg.currentChallenge + 1) + ' of ' + inProg.total + '</div>' : '';
      card.innerHTML =
        '<div class="slot-card-number">Dossier ' + (i + 1) + '</div>' +
        '<div class="slot-card-title">' + rk.rank.name + '</div>' +
        '<div class="slot-card-stats">' +
          '<div class="stat-line"><span>Take returned</span><span class="cash">' + fmtCash(summary.cash) + '</span></div>' +
          '<div class="stat-line"><span>Jobs pulled</span><span>' + summary.completedCount + ' of ' + summary.totalJobs + '</span></div>' +
          resume +
        '</div>' +
        '<div class="slot-card-last-played">Last seen ' + _formatLastPlayed(summary.lastPlayed) + '</div>' +
        '<button class="slot-card-delete" title="Burn this dossier">✕</button>';
    }
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('slot-card-delete')) return;
      Slots.selectSlot(i);
      renderJobBoard();
      showScreen('jobs');
    });
    const del = card.querySelector('.slot-card-delete');
    if (del) del.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Burn Dossier ' + (i + 1) + '? The crew forgets everything. This cannot be undone.')) {
        Slots.deleteSlot(i);
        renderSlotPicker();
      }
    });
    list.appendChild(card);
  }
}

// ============================================================
// JOB BOARD
// ============================================================
function renderJobBoard() {
  const list = document.getElementById('job-list');
  list.innerHTML = '';
  const cash = Slots.cash();
  const rk = rankFor(cash);
  document.getElementById('board-cash').textContent = fmtCash(cash);
  document.getElementById('board-rank').textContent = rk.rank.name;
  const nextEl = document.getElementById('board-next-rank');
  if (rk.next) {
    nextEl.textContent = 'next rank at ' + fmtCash(rk.next.at);
    nextEl.style.display = '';
  } else {
    nextEl.textContent = 'top of the ladder';
    nextEl.style.display = '';
  }

  JOBS.forEach((job, i) => {
    const unlocked = Slots.isJobUnlocked(i);
    const complete = Slots.isJobComplete(job.id);
    const state = Slots.jobState(job.id);
    const inProg = state && !state.completed && typeof state.currentChallenge === 'number' && state.currentChallenge > 0;
    const card = document.createElement('div');
    card.className = 'job-card' + (!unlocked ? ' locked' : '') + (complete ? ' complete' : '');
    const stamp = complete ? '<div class="job-card-stamp">PULLED</div>' : '';
    const lock = !unlocked ? '<div class="job-card-lock">🔒</div>' : '';
    const resume = inProg ? '<span class="resume-tag">Resume · lock ' + (state.currentChallenge + 1) + '</span>' : '';
    card.innerHTML = stamp + lock +
      '<div class="job-card-code">' + job.codename + '</div>' +
      '<div class="job-card-emblem">' + job.emblem + '</div>' +
      '<div class="job-card-title">' + job.title + '</div>' +
      '<div class="job-card-desc">' + job.description + '</div>' +
      '<div class="job-card-progress">' + job.challenges.length + ' locks' + resume + '</div>';
    if (unlocked) card.addEventListener('click', () => startJob(job));
    list.appendChild(card);
  });
}

// ============================================================
// JOB LIFECYCLE
// ============================================================
function startJob(job) {
  Game.currentJob = job;
  Game.run = newRun();
  const state = Slots.jobState(job.id);
  const resumeIdx = (state && !state.completed && typeof state.currentChallenge === 'number' && state.currentChallenge > 0) ? state.currentChallenge : 0;
  if (resumeIdx > 0) {
    Game.currentChallengeIndex = resumeIdx;
    showScreen('challenge');
    renderChallenge();
  } else {
    Game.currentChallengeIndex = 0;
    Slots.snapshotJob();
    showBriefing(job, () => { showScreen('challenge'); renderChallenge(); });
  }
}

function showBriefing(job, onContinue) {
  const overlay = document.getElementById('briefing-overlay');
  if (!overlay) { onContinue(); return; }
  document.getElementById('briefing-codename').textContent = job.codename;
  document.getElementById('briefing-title').textContent = job.title;
  document.getElementById('briefing-text').innerHTML = job.intro;
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('active'));
  const btn = document.getElementById('btn-briefing-go');
  const handler = () => {
    btn.removeEventListener('click', handler);
    overlay.classList.remove('active');
    setTimeout(() => { overlay.style.display = 'none'; onContinue(); }, 250);
  };
  btn.addEventListener('click', handler);
}

// ============================================================
// HEAT / TAKE HUD
// ============================================================
function updateHUD() {
  const run = Game.run;
  const fill = document.getElementById('heat-fill');
  fill.style.width = Math.min(100, run.heat) + '%';
  fill.classList.toggle('hot', run.heat >= 60);
  fill.classList.toggle('critical', run.heat >= 85);
  document.getElementById('take-amount').textContent = fmtCash(run.take);
}

function addHeat(amount) {
  const run = Game.run;
  run.heat = Math.max(0, Math.min(100, run.heat + amount));
  updateHUD();
  if (run.heat >= 100) triggerAlarm();
}

function triggerAlarm() {
  const run = Game.run;
  run.alarms++;
  const lost = Math.ceil(run.take * 0.2 / 50) * 50;
  run.take = Math.max(0, run.take - lost);
  stopTimer();
  const overlay = document.getElementById('alarm-overlay');
  document.getElementById('alarm-lost').textContent = lost > 0 ? 'Circling the block cost the crew ' + fmtCash(lost) + ' of the take.' : 'Lucky — nothing banked yet, nothing lost.';
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('active'));
  const btn = document.getElementById('btn-alarm-continue');
  const handler = () => {
    btn.removeEventListener('click', handler);
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      run.heat = 55;
      updateHUD();
      startTimerIfNeeded();
    }, 250);
  };
  btn.addEventListener('click', handler);
}

// ============================================================
// TIMER (guard patrols)
// ============================================================
function stopTimer() {
  if (Game.timer && Game.timer.intervalId) clearInterval(Game.timer.intervalId);
  Game.timer = null;
  const bar = document.getElementById('timer-bar');
  if (bar) bar.style.display = 'none';
}

function startTimerIfNeeded() {
  stopTimer();
  const ch = Game.currentJob && Game.currentJob.challenges[Game.currentChallengeIndex];
  if (!ch || !ch.timer) return;
  // if challenge already solved (continue button visible), don't restart
  if (document.getElementById('btn-continue').style.display !== 'none') return;
  const total = ch.timer;
  Game.timer = { remaining: total, total, intervalId: null };
  const bar = document.getElementById('timer-bar');
  bar.style.display = 'flex';
  const update = () => {
    const t = Game.timer;
    if (!t) return;
    document.getElementById('timer-count').textContent = t.remaining + 's';
    const pct = (t.remaining / t.total) * 100;
    const f = document.getElementById('timer-fill');
    f.style.width = pct + '%';
    f.classList.toggle('urgent', t.remaining <= 15);
  };
  update();
  Game.timer.intervalId = setInterval(() => {
    const t = Game.timer;
    if (!t) return;
    t.remaining--;
    if (t.remaining <= 0) {
      // guard walks by: heat spike, timer resets
      const fb = document.getElementById('challenge-feedback');
      fb.textContent = '👮 The guard passes RIGHT by you. Heat spikes — new window opening.';
      fb.className = 'challenge-feedback wrong';
      addHeat(Game.currentJob.heatPerMiss);
      t.remaining = t.total;
    }
    update();
  }, 1000);
}

// ============================================================
// CHALLENGE RENDER + CHECK
// ============================================================
function renderChallenge() {
  const job = Game.currentJob;
  const idx = Game.currentChallengeIndex;
  const challenge = job.challenges[idx];
  Game.run.attempts = 0;

  document.getElementById('game-job-title').textContent = job.codename + ' · ' + job.title;
  document.getElementById('progress-current').textContent = idx + 1;
  document.getElementById('progress-total').textContent = job.challenges.length;

  const story = document.getElementById('challenge-story');
  story.innerHTML = challenge.story || '';
  story.style.display = challenge.story ? 'block' : 'none';

  document.getElementById('challenge-prompt').innerHTML = challenge.prompt || '';

  const area = document.getElementById('challenge-area');
  area.innerHTML = '';

  const fb = document.getElementById('challenge-feedback');
  fb.textContent = '';
  fb.className = 'challenge-feedback';

  const hintBox = document.getElementById('hint-box');
  hintBox.style.display = 'none';
  hintBox.innerHTML = '';
  document.getElementById('btn-hint').style.display = 'none';

  document.getElementById('btn-check').style.display = 'inline-block';
  document.getElementById('btn-check').disabled = false;
  document.getElementById('btn-continue').style.display = 'none';

  const fn = Challenges[challenge.type];
  if (typeof fn !== 'function') {
    area.textContent = 'Unknown challenge type: ' + challenge.type;
    Game.activeEvaluator = null;
    return;
  }
  Game.activeEvaluator = fn.call(Challenges, challenge, area);
  updateHUD();
  startTimerIfNeeded();
}

function currentHint() {
  const ev = Game.activeEvaluator;
  if (ev && typeof ev.getHint === 'function') {
    const h = ev.getHint();
    if (h) return h;
  }
  const ch = Game.currentJob.challenges[Game.currentChallengeIndex];
  return ch.hint || null;
}

function showHintButton() {
  const h = currentHint();
  if (!h) return;
  document.getElementById('btn-hint').style.display = 'inline-block';
}

function revealHint() {
  const h = currentHint();
  if (!h) return;
  const crew = CREW[h.who] || CREW.ace;
  const box = document.getElementById('hint-box');
  box.innerHTML = '<span class="hint-who" style="color:' + crew.color + '">' + crew.name + '</span> <span class="hint-text">' + h.text + '</span>';
  box.style.display = 'block';
  document.getElementById('btn-hint').style.display = 'none';
}

function payoutFor(challenge, attempts) {
  const base = challenge.value || 400;
  if (attempts === 0) return base;
  if (attempts === 1) return Math.round(base * 0.6 / 50) * 50;
  return Math.round(base * 0.4 / 50) * 50;
}

function handleCheck() {
  if (!Game.activeEvaluator) return;
  const result = Game.activeEvaluator.evaluate();
  const fb = document.getElementById('challenge-feedback');
  const challenge = Game.currentJob.challenges[Game.currentChallengeIndex];

  if (result.soft) {
    fb.textContent = result.message;
    fb.className = 'challenge-feedback soft';
    return;
  }

  if (result.ok && result.done === false) {
    fb.textContent = result.message || 'Phase cleared. Keep going.';
    fb.className = 'challenge-feedback correct';
    // re-show hint availability for next phase after a miss
    document.getElementById('hint-box').style.display = 'none';
    document.getElementById('btn-hint').style.display = 'none';
    return;
  }

  if (result.ok) {
    stopTimer();
    const pay = payoutFor(challenge, Game.run.attempts);
    Game.run.take += pay;
    if (Game.run.attempts === 0) {
      Game.run.firstTryStreak++;
      addHeat(-6);
    } else {
      Game.run.firstTryStreak = 0;
    }
    updateHUD();
    const flair = Game.run.attempts === 0
      ? (Game.run.firstTryStreak >= 3 ? '🔥 ' + Game.run.firstTryStreak + ' clean cracks in a row! ' : '✦ First try — clean crack. ')
      : '✦ Cracked. ';
    fb.innerHTML = flair + 'The crew bags <span class="cash">+' + fmtCash(pay) + '</span>' + (Game.run.attempts === 0 ? ' · heat cools a little.' : '.');
    fb.className = 'challenge-feedback correct';
    document.getElementById('btn-check').style.display = 'none';
    document.getElementById('btn-continue').style.display = 'inline-block';
    document.getElementById('btn-hint').style.display = 'none';
    return;
  }

  // wrong
  Game.run.attempts++;
  fb.textContent = result.message;
  fb.className = 'challenge-feedback wrong';
  addHeat(Game.currentJob.heatPerMiss);
  showHintButton();
}

function handleContinue() {
  Game.currentChallengeIndex++;
  const job = Game.currentJob;
  if (Game.currentChallengeIndex >= job.challenges.length) {
    finishJob(job);
    return;
  }
  Slots.snapshotJob();
  renderChallenge();
}

// ============================================================
// PAYOUT / JOB COMPLETE
// ============================================================
function finishJob(job) {
  stopTimer();
  const run = Game.run;
  const stealthBonus = run.heat <= 30 ? 1200 : 0;
  const cleanBonus = run.alarms === 0 ? 600 : 0;
  const total = run.take + stealthBonus + cleanBonus;

  const before = Slots.cash();
  const rkBefore = rankFor(before);
  Slots.markJobComplete(job.id);
  const after = Slots.bankCash(total);
  const rkAfter = rankFor(after);

  document.getElementById('payout-job-title').textContent = job.title;
  const lines = document.getElementById('payout-lines');
  lines.innerHTML =
    '<div class="payout-line"><span>Take from the job</span><span class="cash">' + fmtCash(run.take) + '</span></div>' +
    '<div class="payout-line' + (stealthBonus ? '' : ' zero') + '"><span>Stealth bonus <em>(heat ≤ 30)</em></span><span class="cash">' + (stealthBonus ? '+' + fmtCash(stealthBonus) : '—') + '</span></div>' +
    '<div class="payout-line' + (cleanBonus ? '' : ' zero') + '"><span>No alarms tripped</span><span class="cash">' + (cleanBonus ? '+' + fmtCash(cleanBonus) : '—') + '</span></div>' +
    (run.alarms > 0 ? '<div class="payout-line penalty"><span>Alarms tripped</span><span>' + run.alarms + '</span></div>' : '') +
    '<div class="payout-line total"><span>Banked for the city</span><span class="cash">' + fmtCash(total) + '</span></div>' +
    '<div class="payout-line grand"><span>Crew total</span><span class="cash">' + fmtCash(after) + '</span></div>';

  const rankEl = document.getElementById('payout-rank');
  if (rkAfter.rank.at > rkBefore.rank.at) {
    rankEl.innerHTML = '⭐ RANK UP: <b>' + rkAfter.rank.name + '</b>';
    rankEl.style.display = 'block';
  } else if (rkAfter.next) {
    rankEl.innerHTML = 'Rank: <b>' + rkAfter.rank.name + '</b> · ' + fmtCash(rkAfter.next.at - after) + ' to ' + rkAfter.next.name;
    rankEl.style.display = 'block';
  } else {
    rankEl.innerHTML = 'Rank: <b>' + rkAfter.rank.name + '</b>';
    rankEl.style.display = 'block';
  }

  document.getElementById('payout-outro').innerHTML = job.outro || '';
  showScreen('payout');

  const allDone = JOBS.every(j => Slots.isJobComplete(j.id));
  const btn = document.getElementById('btn-payout-continue');
  btn.textContent = allDone ? 'One Last Sunrise →' : 'Back to the Safehouse';
  btn.onclick = () => {
    if (allDone) {
      showScreen('final');
    } else {
      renderJobBoard();
      showScreen('jobs');
    }
  };
}

// ============================================================
// EVENT WIRING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  Slots.load();
  renderTitleEmblem();
  document.getElementById('btn-start').addEventListener('click', () => { renderSlotPicker(); showScreen('slots'); });
  document.getElementById('btn-slots-back').addEventListener('click', () => showScreen('title'));
  document.getElementById('btn-jobs-back').addEventListener('click', () => { renderSlotPicker(); showScreen('slots'); });
  document.getElementById('btn-switch-slot').addEventListener('click', () => { renderSlotPicker(); showScreen('slots'); });
  document.getElementById('btn-game-back').addEventListener('click', () => {
    const ok = Game.run && Game.run.take > 0
      ? confirm('Pull out now? The unbanked take (' + fmtCash(Game.run.take) + ') stays behind. Your lock progress is saved.')
      : true;
    if (!ok) return;
    Slots.snapshotJob();
    stopTimer();
    renderJobBoard();
    showScreen('jobs');
  });
  document.getElementById('btn-check').addEventListener('click', handleCheck);
  document.getElementById('btn-continue').addEventListener('click', handleContinue);
  document.getElementById('btn-hint').addEventListener('click', revealHint);
  document.getElementById('btn-final-back').addEventListener('click', () => showScreen('title'));

  // Enter key = Check (or Continue)
  document.addEventListener('keydown', (e) => {
    if (Game.currentScreen !== 'challenge' || e.key !== 'Enter') return;
    const cont = document.getElementById('btn-continue');
    if (cont.style.display !== 'none') { cont.click(); return; }
    const chk = document.getElementById('btn-check');
    if (chk.style.display !== 'none' && !chk.disabled) chk.click();
  });
});
