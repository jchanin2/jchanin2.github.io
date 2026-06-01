// ======================================================
// engine.js — Combat, shop, adaptive tracking, dialogue
// Realms of Mathematica II — The Numerian Codex
// ======================================================

const Engine = {

  // --------------------------------------------------------
  // HERO STATE — derived stats from base + bonuses
  // --------------------------------------------------------
  effectiveStats(hero) {
    if (!hero) return Object.assign({}, STAT_DEFAULT);
    const s = Object.assign({}, hero.stats);
    // heritage stat bonus
    const her = HERITAGES[hero.heritageId];
    if (her && her.statBonus) Object.entries(her.statBonus).forEach(([k, v]) => s[k] = (s[k] || 0) + v);
    // class stat bonus
    const cls = CLASSES[hero.classId];
    if (cls && cls.statBonus) Object.entries(cls.statBonus).forEach(([k, v]) => s[k] = (s[k] || 0) + v);
    // equipped items
    Object.values(hero.equipped || {}).forEach(itemId => {
      const it = ITEMS[itemId];
      if (it && it.effect) {
        ['precision','insight','speed','stamina','wisdom','luck'].forEach(k => {
          if (it.effect[k]) s[k] = (s[k] || 0) + it.effect[k];
        });
      }
    });
    // feat bonus (insight only, others apply later)
    if (hero.feat && FEATS[hero.feat] && FEATS[hero.feat].effect.bonusInsight) {
      s.insight = (s.insight || 0) + FEATS[hero.feat].effect.bonusInsight;
    }
    return s;
  },

  effectiveDerived(hero) {
    const s = this.effectiveStats(hero);
    let maxHp = maxHpFor(s);
    let critPct = critPctFor(s);
    let timerSec = timerSecFor(s);
    let hints = hintsFor(s);
    // feat & item bonuses
    if (hero.feat && FEATS[hero.feat] && FEATS[hero.feat].effect) {
      const fe = FEATS[hero.feat].effect;
      if (fe.bonusHp) maxHp += fe.bonusHp;
      if (fe.critPct) critPct += fe.critPct;
      if (fe.bonusTimer) timerSec += fe.bonusTimer;
    }
    // heritage extras
    const her = HERITAGES[hero.heritageId];
    if (her && her.extraTimer) timerSec += her.extraTimer;
    // items with bonusHp / bonusTimer
    Object.values(hero.equipped || {}).forEach(itemId => {
      const it = ITEMS[itemId];
      if (!it || !it.effect) return;
      if (it.effect.bonusHp) maxHp += it.effect.bonusHp;
      if (it.effect.bonusTimer) timerSec += it.effect.bonusTimer;
    });
    // companion bonus: Mira grants +1 Insight (free hint) while she travels with you
    if (hero.flags && hero.flags.miraBound) hints += 1;
    return {
      maxHp: maxHp,
      maxMp: maxMpFor(s),
      baseDmg: baseDmgFor(s),
      critPct: critPct,
      timerSec: timerSec,
      hints: hints
    };
  },

  weaponBonusVs(hero, topic) {
    let bonus = 0;
    Object.values(hero.equipped || {}).forEach(itemId => {
      const it = ITEMS[itemId];
      if (it && it.effect && it.effect.bonusVsTopic && it.effect.bonusVsTopic[topic]) {
        bonus += it.effect.bonusVsTopic[topic];
      }
    });
    return bonus;
  },

  // --------------------------------------------------------
  // TOPIC MASTERY tracking
  // --------------------------------------------------------
  recordAttempt(hero, topic, correct) {
    if (!hero.mastery) hero.mastery = {};
    if (!hero.mastery[topic]) hero.mastery[topic] = { attempts: 0, correct: 0, streak: 0 };
    const m = hero.mastery[topic];
    m.attempts++;
    if (correct) { m.correct++; m.streak++; } else { m.streak = 0; }
  },

  masteryPct(hero, topic) {
    const m = hero.mastery && hero.mastery[topic];
    if (!m || m.attempts === 0) return null;
    return Math.round((m.correct / m.attempts) * 100);
  },

  weakestTopics(hero, minAttempts) {
    const min = minAttempts || 3;
    const list = [];
    Object.keys(hero.mastery || {}).forEach(topic => {
      const m = hero.mastery[topic];
      if (m.attempts >= min) {
        list.push({ topic: topic, pct: (m.correct / m.attempts) * 100 });
      }
    });
    list.sort((a, b) => a.pct - b.pct);
    return list;
  },

  // --------------------------------------------------------
  // COMBAT
  // --------------------------------------------------------
  startCombat(opts) {
    // opts: { enemyId, onVictory(loot), onDefeat() }
    const enemy = ENEMIES[opts.enemyId];
    if (!enemy) { console.error('Unknown enemy: ' + opts.enemyId); return; }
    const hero = Game.hero;

    const derived = this.effectiveDerived(hero);
    // Clamp hp/mp to max
    if (hero.hp === undefined || hero.hp === null) hero.hp = derived.maxHp;
    if (hero.mp === undefined || hero.mp === null) hero.mp = derived.maxMp;
    if (hero.hp > derived.maxHp) hero.hp = derived.maxHp;
    if (hero.mp > derived.maxMp) hero.mp = derived.maxMp;

    const C = {
      hero: hero,
      enemy: JSON.parse(JSON.stringify(enemy)),
      derived: derived,
      hintsLeft: derived.hints,
      onVictory: opts.onVictory,
      onDefeat: opts.onDefeat,
      currentProblem: null,
      timerId: null,
      timerRemaining: 0,
      phaseIndex: 0,
      enemyAttacksRemaining: 1, // counter for queued enemy actions
      pendingEffect: {
        doubleStrike: false, halfDamage: false, dodgeNext: false,
        guaranteedCrit: false, reveal: false, skip: false, magicDamage: 0, partialOnFail: false
      },
      cooldowns: {},
      firstCritResisted: false,
      nineLivesUsed: false,
      announcedPhase: -1,
      log: []
    };
    C.enemy.maxHp = C.enemy.hp;
    Game.combat = C;
    showScreen('combat');
    this._renderCombatStatic();
    this._nextRound();
  },

  _renderCombatStatic() {
    const C = Game.combat;
    const hero = C.hero;
    document.getElementById('combat-hero-portrait').innerHTML = Art.heroPortrait(hero, 'combat');
    document.getElementById('combat-hero-name').textContent = hero.name + ' the ' + (CLASSES[hero.classId] || {name:''}).name;
    document.getElementById('combat-enemy-sprite').innerHTML = Art.enemySprite(C.enemy.spriteId);
    document.getElementById('combat-enemy-name').textContent = C.enemy.name;
    document.getElementById('combat-banner').textContent = C.enemy.isBoss ? '— A boss battle —' : '';
    document.getElementById('combat-hint-count').textContent = C.hintsLeft;
    this._renderBars();
    this._clearLog();
  },

  _renderBars() {
    const C = Game.combat;
    const hero = C.hero;
    const dh = C.derived;
    const hpPct = Math.max(0, Math.min(100, (hero.hp / dh.maxHp) * 100));
    const mpPct = dh.maxMp > 0 ? Math.max(0, Math.min(100, (hero.mp / dh.maxMp) * 100)) : 0;
    const epPct = Math.max(0, Math.min(100, (C.enemy.hp / C.enemy.maxHp) * 100));
    document.getElementById('combat-hero-hp-fill').style.width = hpPct + '%';
    document.getElementById('combat-hero-mp-fill').style.width = mpPct + '%';
    document.getElementById('combat-enemy-hp-fill').style.width = epPct + '%';
    document.getElementById('combat-hero-hp-num').textContent = Math.max(0, hero.hp) + ' / ' + dh.maxHp;
    document.getElementById('combat-hero-mp-num').textContent = hero.mp + ' / ' + dh.maxMp;
    document.getElementById('combat-enemy-hp-num').textContent = Math.max(0, C.enemy.hp) + ' / ' + C.enemy.maxHp;
    // phase
    const phaseEl = document.getElementById('combat-enemy-phase');
    if (C.enemy.phases) {
      phaseEl.textContent = 'Phase ' + (C.phaseIndex + 1) + ' / ' + C.enemy.phases.length;
    } else {
      phaseEl.textContent = '';
    }
  },

  _nextRound() {
    const C = Game.combat;
    if (!C) return;
    if (C.enemy.hp <= 0) { this._victory(); return; }
    if (C.hero.hp <= 0) { this._defeat(); return; }

    // determine topic & difficulty for this round
    let topic, difficulty;
    if (C.enemy.phases) {
      const phase = C.enemy.phases[Math.min(C.phaseIndex, C.enemy.phases.length - 1)];
      topic = phase.topic; difficulty = phase.difficulty;
      // Announce the phase line only once, when first entering that phase
      if (phase.say && C.announcedPhase !== C.phaseIndex) {
        C.announcedPhase = C.phaseIndex;
        this._addLog('enemy', C.enemy.name + ': ' + phase.say);
      }
    } else {
      topic = C.enemy.topic; difficulty = C.enemy.difficulty;
    }

    const problem = generateProblem(topic, difficulty);
    C.currentProblem = problem;
    this._renderProblem(problem);
    this._startTimer();
    this._refreshControls();
  },

  // Recompute which phase a boss is in from its current HP (threshold bands)
  _phaseFromHp() {
    const C = Game.combat;
    if (!C.enemy.phases) return 0;
    const n = C.enemy.phases.length;
    const frac = 1 - Math.max(0, C.enemy.hp) / C.enemy.maxHp; // 0 at full, 1 at dead
    return Math.min(n - 1, Math.floor(frac * n));
  },

  _renderProblem(problem) {
    const tag = document.getElementById('combat-topic-tag');
    if (tag) {
      const tName = (TOPICS[problem.topic] || {}).name || '';
      tag.textContent = tName ? ('✦ ' + tName) : '';
    }
    document.getElementById('combat-problem-prompt').textContent = problem.question;
    const area = document.getElementById('combat-problem-area');
    area.innerHTML = '';
    Game.combat._gridAnswer = null;
    // optional static figure (coordinate grid, shape, etc.) above the answer area
    if (problem.figure) {
      const fig = document.createElement('div');
      fig.className = 'combat-figure';
      fig.innerHTML = problem.figure;
      area.appendChild(fig);
    }
    if (problem.format === 'grid') {
      // interactive coordinate grid — click to plot
      const size = problem.gridSize || 10;
      const holder = document.createElement('div');
      holder.className = 'combat-grid-holder';
      holder.innerHTML = Art.coordGrid(size, { markers: problem.figureMarkers || [] });
      area.appendChild(holder);
      const svg = holder.querySelector('svg');
      const userLayer = svg.querySelector('.grid-user-layer');
      svg.style.cursor = 'crosshair';
      svg.addEventListener('click', (e) => {
        const rect = svg.getBoundingClientRect();
        const sx = (e.clientX - rect.left) / rect.width * Art.GRID_VB;
        const sy = (e.clientY - rect.top) / rect.height * Art.GRID_VB;
        const g = Art.gridFromSvg(sx, sy, size);
        Game.combat._gridAnswer = g;
        userLayer.innerHTML = Art.gridMarkerSvg(g.x, g.y, size) +
          '<text x="' + (Art.GRID_OX + g.x * (Art.GRID_LEN / size) + 10) + '" y="' + (Art.GRID_OY - g.y * (Art.GRID_LEN / size) - 8) + '" fill="#0a2010" font-family="Cinzel,serif" font-size="11" font-weight="bold">(' + g.x + ', ' + g.y + ')</text>';
      });
      const tip = document.createElement('div');
      tip.className = 'combat-grid-tip';
      tip.textContent = 'Tap the grid to plot, then press Strike.';
      area.appendChild(tip);
    } else if (problem.format === 'mc') {
      const grid = document.createElement('div');
      grid.className = 'combat-mc-grid';
      problem.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'combat-mc-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          grid.querySelectorAll('.combat-mc-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          Game.combat._selectedAnswer = opt;
        });
        grid.appendChild(btn);
      });
      area.appendChild(grid);
      Game.combat._selectedAnswer = null;
    } else {
      const wrap = document.createElement('div');
      wrap.style.display = 'flex'; wrap.style.flexDirection = 'column'; wrap.style.alignItems = 'center';
      const inp = document.createElement('input');
      inp.className = 'combat-input';
      inp.type = 'text';
      inp.setAttribute('autocomplete', 'off');
      inp.setAttribute('inputmode', 'decimal');
      inp.setAttribute('autocapitalize', 'off');
      inp.placeholder = '?';
      inp.addEventListener('focus', function () { this.select(); });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          Engine._submitAnswer();
        }
      });
      wrap.appendChild(inp);
      area.appendChild(wrap);
      setTimeout(() => inp.focus(), 50);
      Game.combat._inputEl = inp;
    }
    // sight reveal
    if (Game.combat.pendingEffect.reveal) {
      const hint = document.createElement('div');
      hint.className = 'combat-hint-line';
      hint.textContent = 'Sight reveals: ' + problem.answer;
      area.appendChild(hint);
      Game.combat.pendingEffect.reveal = false;
    }
  },

  _startTimer() {
    const C = Game.combat;
    if (C.timerId) { clearInterval(C.timerId); }
    C.timerRemaining = C.derived.timerSec;
    const fill = document.getElementById('combat-timer-fill');
    const label = document.getElementById('combat-timer-label');
    const update = () => {
      const pct = Math.max(0, (C.timerRemaining / C.derived.timerSec) * 100);
      fill.style.width = pct + '%';
      label.textContent = C.timerRemaining + 's';
      if (C.timerRemaining <= 5) fill.classList.add('danger');
      else fill.classList.remove('danger');
    };
    update();
    C.timerId = setInterval(() => {
      C.timerRemaining--;
      update();
      if (C.timerRemaining <= 0) {
        clearInterval(C.timerId); C.timerId = null;
        Engine._submitAnswer(true /* timeout */);
      }
    }, 1000);
  },

  _stopTimer() {
    const C = Game.combat;
    if (C.timerId) { clearInterval(C.timerId); C.timerId = null; }
  },

  _refreshControls() {
    const C = Game.combat;
    document.getElementById('combat-hint-count').textContent = C.hintsLeft;
    document.getElementById('btn-combat-hint').disabled = C.hintsLeft <= 0;
    document.getElementById('btn-combat-spell').disabled = C.hero.mp <= 0 || !this._hasUsableSpell();
    document.getElementById('btn-combat-item').disabled = !this._hasConsumable();
  },

  _hasUsableSpell() {
    const cls = CLASSES[Game.combat.hero.classId];
    if (!cls) return false;
    return (cls.abilities || []).some(aid => {
      const ab = ABILITIES[aid];
      return ab && ab.type === 'spell' && (ab.cost || 0) <= Game.combat.hero.mp;
    });
  },

  _hasConsumable() {
    return (Game.combat.hero.inventory || []).some(it => {
      const def = ITEMS[it.itemId];
      return def && def.slot === 'consumable' && it.qty > 0;
    });
  },

  // Action: spend a hint
  useHint() {
    const C = Game.combat;
    if (!C || C.hintsLeft <= 0 || !C.currentProblem) return;
    C.hintsLeft--;
    document.getElementById('combat-hint-count').textContent = C.hintsLeft;
    const area = document.getElementById('combat-problem-area');
    const old = area.querySelector('.combat-hint-line');
    if (old) old.remove();
    const hint = document.createElement('div');
    hint.className = 'combat-hint-line';
    hint.textContent = 'Hint: ' + C.currentProblem.hint;
    area.appendChild(hint);
    this._addLog('system', 'You channel Insight — a hint appears in your mind.');
  },

  // Open the spell submenu (modal)
  openSpellMenu() {
    const C = Game.combat;
    const cls = CLASSES[C.hero.classId];
    if (!cls) return;
    const opts = (cls.abilities || []).map(aid => ABILITIES[aid]).filter(Boolean);
    UI.openModal({
      title: 'Cast a Spell',
      body: opts.length === 0 ? 'You know no spells.' :
        opts.map(ab => {
          const canCast = (ab.cost || 0) <= C.hero.mp && !C.cooldowns[ab.id];
          return '<div class="modal-spell-row" data-id="' + ab.id + '" style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border:1px solid ' + (canCast ? '#d4a624' : '#5a5a5a') + ';border-radius:4px;margin-bottom:6px;cursor:' + (canCast ? 'pointer' : 'not-allowed') + ';opacity:' + (canCast ? 1 : 0.5) + ';">' +
            '<div><div style="color:#f0d27a;font-family:Cinzel,serif;">' + ab.name + ' <span style="font-size:0.8em;opacity:0.7;">(' + (ab.cost ? ab.cost + ' MP' : 'free') + ')</span></div>' +
            '<div style="font-style:italic;color:#c8b078;font-size:0.9em;">' + ab.desc + '</div></div></div>';
        }).join(''),
      actions: [{ label: 'Cancel', kind: 'secondary' }],
      afterRender: (modal) => {
        modal.querySelectorAll('.modal-spell-row').forEach(row => {
          row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            const ab = ABILITIES[id];
            const canCast = (ab.cost || 0) <= C.hero.mp && !C.cooldowns[ab.id];
            if (!canCast) return;
            UI.closeModal();
            Engine._castAbility(ab);
          });
        });
      }
    });
  },

  _castAbility(ab) {
    const C = Game.combat;
    C.hero.mp -= (ab.cost || 0);
    if (ab.cooldown) C.cooldowns[ab.id] = ab.cooldown;
    if (ab.effect.reveal) {
      C.pendingEffect.reveal = true;
      this._addLog('you', 'You cast ' + ab.name + '. The answer becomes clear.');
      // re-render problem to show the reveal
      if (C.currentProblem) {
        const area = document.getElementById('combat-problem-area');
        const old = area.querySelector('.combat-hint-line');
        if (old) old.remove();
        const hint = document.createElement('div');
        hint.className = 'combat-hint-line';
        hint.textContent = 'Sight reveals: ' + C.currentProblem.answer;
        area.appendChild(hint);
        C.pendingEffect.reveal = false;
      }
    } else if (ab.effect.dodgeNext) {
      C.pendingEffect.dodgeNext = true;
      this._addLog('you', 'You cast ' + ab.name + '. The next enemy strike will miss you.');
    } else if (ab.effect.guaranteedCrit) {
      C.pendingEffect.guaranteedCrit = true;
      this._addLog('you', 'You cast ' + ab.name + '. Your next correct answer lands as a critical.');
    } else if (ab.effect.doubleStrike) {
      C.pendingEffect.doubleStrike = true;
      C.pendingEffect.halfDamage = !!ab.effect.halfDamage;
      this._addLog('you', 'You ready ' + ab.name + '. Your next attack strikes twice.');
    } else if (ab.effect.magicDamage) {
      C.pendingEffect.magicDamage = ab.effect.magicDamage;
      C.pendingEffect.partialOnFail = !!ab.effect.partialOnFail;
      this._addLog('you', 'You cast ' + ab.name + '. Arcane energy gathers — your next answer unleashes it.');
    }
    this._refreshControls();
    this._renderBars();
  },

  openItemMenu() {
    const C = Game.combat;
    const items = (C.hero.inventory || []).filter(it => {
      const def = ITEMS[it.itemId];
      return def && def.slot === 'consumable' && it.qty > 0;
    });
    UI.openModal({
      title: 'Use an Item',
      body: items.length === 0 ? 'You have no consumables.' :
        items.map(it => {
          const def = ITEMS[it.itemId];
          return '<div class="modal-item-row" data-id="' + it.itemId + '" style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border:1px solid #d4a624;border-radius:4px;margin-bottom:6px;cursor:pointer;">' +
            '<div><div style="color:#f0d27a;font-family:Cinzel,serif;">' + def.name + ' <span style="font-size:0.8em;opacity:0.7;">×' + it.qty + '</span></div>' +
            '<div style="font-style:italic;color:#c8b078;font-size:0.9em;">' + def.desc + '</div></div></div>';
        }).join(''),
      actions: [{ label: 'Cancel', kind: 'secondary' }],
      afterRender: (modal) => {
        modal.querySelectorAll('.modal-item-row').forEach(row => {
          row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            UI.closeModal();
            Engine._useConsumable(id);
          });
        });
      }
    });
  },

  _useConsumable(itemId) {
    const C = Game.combat;
    const def = ITEMS[itemId];
    if (!def) return;
    Inventory.consume(C.hero, itemId, 1);
    if (def.effect.heal) {
      const before = C.hero.hp;
      C.hero.hp = Math.min(C.derived.maxHp, C.hero.hp + def.effect.heal);
      this._popup('+' + (C.hero.hp - before), 'heal', 'hero');
      this._addLog('you', 'You drink the ' + def.name + '. Restored ' + (C.hero.hp - before) + ' HP.');
    } else if (def.effect.restoreMp) {
      C.hero.mp = Math.min(C.derived.maxMp, C.hero.mp + def.effect.restoreMp);
      this._addLog('you', 'You drink the ' + def.name + '. Restored ' + def.effect.restoreMp + ' MP.');
    } else if (def.effect.reveal) {
      C.pendingEffect.reveal = true;
      this._addLog('you', 'You unfurl the ' + def.name + '. The answer reveals itself.');
      if (C.currentProblem) {
        const area = document.getElementById('combat-problem-area');
        const old = area.querySelector('.combat-hint-line');
        if (old) old.remove();
        const hint = document.createElement('div');
        hint.className = 'combat-hint-line';
        hint.textContent = 'Sight reveals: ' + C.currentProblem.answer;
        area.appendChild(hint);
        C.pendingEffect.reveal = false;
      }
    } else if (def.effect.skip) {
      this._addLog('you', 'You unfurl the ' + def.name + '. Both sides hesitate. The moment passes.');
      this._stopTimer();
      setTimeout(() => Engine._nextRound(), 700);
    }
    this._renderBars();
    this._refreshControls();
  },

  flee() {
    UI.confirm({
      title: 'Flee?',
      body: 'You can attempt to flee, but you will lose 10% of your gold and a small amount of pride.',
      yes: () => {
        const C = Game.combat;
        const lost = Math.max(1, Math.floor((C.hero.gold || 0) * 0.10));
        C.hero.gold = Math.max(0, (C.hero.gold || 0) - lost);
        Engine._endCombat(false, false);
        UI.toast('Fled. Lost ' + lost + ' gold.');
        if (C.onDefeat) C.onDefeat({ fled: true });
      }
    });
  },

  // Submit the current answer (or timeout)
  _submitAnswer(timeout) {
    const C = Game.combat;
    if (!C || !C.currentProblem) return;
    this._stopTimer();
    let userAnswer = null;
    let correct = false;
    if (C.currentProblem.format === 'grid') {
      const g = C._gridAnswer;
      const t = C.currentProblem.target;
      correct = !timeout && !!g && !!t && g.x === t.x && g.y === t.y;
    } else if (C.currentProblem.format === 'mc') {
      userAnswer = C._selectedAnswer;
      correct = !timeout && userAnswer !== null && userAnswer !== '' && checkAnswer(userAnswer, C.currentProblem.answer);
    } else {
      userAnswer = C._inputEl ? C._inputEl.value : '';
      correct = !timeout && userAnswer !== null && userAnswer !== '' && checkAnswer(userAnswer, C.currentProblem.answer);
    }
    Engine.recordAttempt(C.hero, C.currentProblem.topic, correct);

    if (correct) {
      Engine._resolveHit();
    } else {
      Engine._resolveMiss(timeout);
    }
  },

  _resolveHit() {
    const C = Game.combat;
    const hero = C.hero;
    const derived = C.derived;
    const enemy = C.enemy;
    const topic = C.currentProblem.topic;

    let dmg = derived.baseDmg + Engine.weaponBonusVs(hero, topic);
    // Pending magic damage replaces base
    if (C.pendingEffect.magicDamage) {
      dmg += C.pendingEffect.magicDamage;
      C.pendingEffect.magicDamage = 0;
    }
    // double strike halves
    const hits = C.pendingEffect.doubleStrike ? 2 : 1;
    const halfMod = C.pendingEffect.halfDamage ? 0.5 : 1;
    C.pendingEffect.doubleStrike = false; C.pendingEffect.halfDamage = false;
    let totalDmg = 0;
    let critHits = 0;
    for (let i = 0; i < hits; i++) {
      let thisDmg = Math.max(1, Math.floor(dmg * halfMod));
      const isCrit = C.pendingEffect.guaranteedCrit || (Math.random() * 100 < derived.critPct);
      if (isCrit) { thisDmg *= 2; critHits++; }
      C.pendingEffect.guaranteedCrit = false;
      totalDmg += thisDmg;
      enemy.hp -= thisDmg;
      Engine._popup('-' + thisDmg, isCrit ? 'crit' : 'dmg', 'enemy');
    }
    Engine._addLog('you', 'Correct! You strike for ' + totalDmg + (critHits ? ' (' + critHits + ' crit' + (critHits > 1 ? 's' : '') + '!)' : '') + '.');
    Engine._renderBars();
    if (enemy.hp <= 0) {
      setTimeout(() => Engine._victory(), 900);
    } else {
      // Threshold-band phases: the HP bar drains continuously; the topic
      // advances when HP crosses a band boundary. No HP reset, no bar jump.
      if (enemy.phases) {
        const newPhase = Engine._phaseFromHp();
        if (newPhase > C.phaseIndex) {
          C.phaseIndex = newPhase;
          Engine._addLog('system', 'The ' + enemy.name + ' shifts — its trial changes. (Phase ' + (C.phaseIndex + 1) + ' of ' + enemy.phases.length + ')');
          Engine._renderBars();
        }
      }
      setTimeout(() => Engine._nextRound(), 900);
    }
    // tick cooldowns
    Object.keys(C.cooldowns).forEach(k => { C.cooldowns[k]--; if (C.cooldowns[k] <= 0) delete C.cooldowns[k]; });
  },

  _resolveMiss(timeout) {
    const C = Game.combat;
    const hero = C.hero;
    const enemy = C.enemy;
    // dodge
    if (C.pendingEffect.dodgeNext) {
      C.pendingEffect.dodgeNext = false;
      Engine._addLog('you', timeout ? 'Time runs out — but you dodge the strike with Quick Step!' : 'Wrong answer — but you dodge the strike with Quick Step!');
      Engine._popup('Dodge!', 'miss', 'hero');
      setTimeout(() => Engine._nextRound(), 900);
      return;
    }
    // magic partial
    if (C.pendingEffect.magicDamage && C.pendingEffect.partialOnFail) {
      const partial = Math.max(1, Math.floor(C.pendingEffect.magicDamage / 2));
      enemy.hp -= partial;
      Engine._popup('-' + partial, 'dmg', 'enemy');
      Engine._addLog('you', 'Wrong, but the gathered arcane still bites for ' + partial + '.');
      C.pendingEffect.magicDamage = 0; C.pendingEffect.partialOnFail = false;
    }
    // enemy attacks
    let edmg = enemy.attack;
    const isCrit = Math.random() * 100 < 8; // ~8% enemy crit
    if (isCrit) {
      const her = HERITAGES[hero.heritageId];
      if (her && her.resistFirstCrit && !C.firstCritResisted) {
        C.firstCritResisted = true;
        Engine._popup('Stout!', 'miss', 'hero');
        Engine._addLog('you', 'Your dwarvish constitution shrugs off the critical blow.');
        setTimeout(() => Engine._nextRound(), 900);
        return;
      }
      edmg *= 2;
    }
    Engine._popup('-' + edmg, isCrit ? 'crit' : 'dmg', 'hero');
    Engine._addLog('enemy', timeout ? 'Time runs out! The ' + enemy.name + ' strikes for ' + edmg + (isCrit ? ' (critical!)' : '') + '.' :
                                  'Wrong! The ' + enemy.name + ' strikes for ' + edmg + (isCrit ? ' (critical!)' : '') + '.');
    if (C.currentProblem) {
      Engine._addLog('system', 'The correct answer was ' + C.currentProblem.answer + '.');
    }
    // Tabaxi "Nine Lives": once per battle, a lethal blow leaves you at 1 HP.
    const her2 = HERITAGES[hero.heritageId];
    if (hero.hp - edmg <= 0 && her2 && her2.surviveLethal && !C.nineLivesUsed) {
      C.nineLivesUsed = true;
      hero.hp = 1;
      Engine._popup('Nine Lives!', 'heal', 'hero');
      Engine._addLog('you', 'A blow that should have felled you — but you twist in the air, land on your feet, and cling on at 1 HP!');
      Engine._renderBars();
      setTimeout(() => Engine._nextRound(), 1100);
      return;
    }
    hero.hp = Math.max(0, hero.hp - edmg);
    Engine._renderBars();
    if (hero.hp <= 0) {
      setTimeout(() => Engine._defeat(), 900);
    } else {
      setTimeout(() => Engine._nextRound(), 1000);
    }
  },

  _popup(text, kind, side) {
    const layer = document.getElementById('combat-popup-layer');
    if (!layer) return;
    const arena = layer.parentElement;
    const arenaRect = arena.getBoundingClientRect();
    const targetEl = side === 'enemy' ? document.getElementById('combat-enemy-sprite') :
                                         document.getElementById('combat-hero-portrait');
    if (!targetEl) return;
    const tr = targetEl.getBoundingClientRect();
    const x = tr.left - arenaRect.left + tr.width / 2;
    const y = tr.top - arenaRect.top + tr.height / 3;
    const el = document.createElement('div');
    el.className = 'combat-popup ' + kind;
    el.style.left = (x - 20) + 'px';
    el.style.top = (y - 200) + 'px';
    el.textContent = text;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  },

  _addLog(kind, text) {
    const log = document.getElementById('combat-log');
    if (!log) return;
    const entry = document.createElement('div');
    entry.className = 'combat-log-entry ' + (kind || '');
    entry.textContent = text;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  },

  _clearLog() {
    const log = document.getElementById('combat-log');
    if (log) log.innerHTML = '';
  },

  _endCombat(victory, rendered) {
    const C = Game.combat;
    this._stopTimer();
    if (!rendered) Game.combat = null;
  },

  _victory() {
    const C = Game.combat;
    const enemy = C.enemy;
    const hero = C.hero;
    const gold = enemy.goldDrop ? _R(enemy.goldDrop[0], enemy.goldDrop[1]) : 0;
    const xp = enemy.xpDrop || 0;
    const heritage = HERITAGES[hero.heritageId];
    const goldGained = heritage && heritage.goldBonus ? Math.round(gold * (1 + heritage.goldBonus)) : gold;
    hero.gold = (hero.gold || 0) + goldGained;
    const prevLevel = levelFromXp(hero.xp || 0);
    hero.xp = (hero.xp || 0) + xp;
    const newLevel = levelFromXp(hero.xp);
    const loot = [];
    if (enemy.guaranteedLoot) {
      enemy.guaranteedLoot.forEach(itemId => {
        Inventory.add(hero, itemId, 1);
        loot.push(ITEMS[itemId].name);
      });
    }
    // small chance of bonus potion
    if (!enemy.isBoss && Math.random() < 0.25) {
      Inventory.add(hero, 'minor_potion', 1);
      loot.push('Minor Healing Draught');
    }
    Engine._addLog('victory', '— Victory —');
    this._endCombat(true, true);

    const cb = C.onVictory;
    UI.openModal({
      title: 'Victory!',
      body: '<p>You defeated <em>' + enemy.name + '</em>.</p>' +
            '<ul style="list-style:none; padding-left:0;">' +
              '<li>+ ' + goldGained + ' gold</li>' +
              '<li>+ ' + xp + ' XP</li>' +
              (loot.length ? '<li>Loot: ' + loot.join(', ') + '</li>' : '') +
              (newLevel > prevLevel ? '<li style="color:#f0d27a;font-family:Cinzel;">⚜ LEVEL UP! You are now level ' + newLevel + '. (+' + (STAT_POINTS_PER_LEVEL * (newLevel - prevLevel)) + ' stat points to spend)</li>' : '') +
            '</ul>',
      actions: [{ label: 'Continue', kind: 'gold', click: () => {
        UI.closeModal();
        if (newLevel > prevLevel) {
          hero.unspentPoints = (hero.unspentPoints || 0) + STAT_POINTS_PER_LEVEL * (newLevel - prevLevel);
        }
        Game.save();
        if (cb) cb({ gold: goldGained, xp: xp, loot: loot });
      }}]
    });
  },

  _defeat() {
    const C = Game.combat;
    const cb = C.onDefeat;
    Engine._addLog('defeat', '— You have fallen —');
    this._endCombat(false, true);
    UI.openModal({
      title: 'Defeated',
      body: '<p>The world fades. Lysara\'s voice echoes from somewhere far: <em>"Not yet, young hero. Not yet."</em></p>' +
            '<p>You wake at the village well, restored — but Numeria still needs its hero.</p>',
      actions: [{ label: 'Rise Again', kind: 'gold', click: () => {
        UI.closeModal();
        const derived = Engine.effectiveDerived(Game.hero);
        Game.hero.hp = derived.maxHp;
        Game.hero.mp = derived.maxMp;
        Game.save();
        if (cb) cb({ fled: false });
      }}]
    });
  }
};

// ======================================================
// INVENTORY HELPERS
// ======================================================
const Inventory = {
  add(hero, itemId, qty) {
    qty = qty || 1;
    if (!hero.inventory) hero.inventory = [];
    const existing = hero.inventory.find(it => it.itemId === itemId);
    if (existing) existing.qty += qty;
    else hero.inventory.push({ itemId: itemId, qty: qty });
  },
  consume(hero, itemId, qty) {
    qty = qty || 1;
    if (!hero.inventory) return;
    const it = hero.inventory.find(x => x.itemId === itemId);
    if (!it) return;
    it.qty -= qty;
    if (it.qty <= 0) hero.inventory = hero.inventory.filter(x => x !== it);
  },
  has(hero, itemId) {
    return (hero.inventory || []).some(it => it.itemId === itemId && it.qty > 0);
  },
  equip(hero, itemId) {
    const def = ITEMS[itemId];
    if (!def || !def.slot || def.slot === 'consumable') return;
    if (!hero.equipped) hero.equipped = {};
    // if there's an old item in slot, return it to inventory
    const old = hero.equipped[def.slot];
    if (old && old !== itemId) Inventory.add(hero, old, 1);
    hero.equipped[def.slot] = itemId;
    Inventory.consume(hero, itemId, 1);
    // clamp HP/MP to new max
    const d = Engine.effectiveDerived(hero);
    if (hero.hp > d.maxHp) hero.hp = d.maxHp;
    if (hero.mp > d.maxMp) hero.mp = d.maxMp;
  },
  unequip(hero, slot) {
    if (!hero.equipped) return;
    const itemId = hero.equipped[slot];
    if (!itemId) return;
    Inventory.add(hero, itemId, 1);
    delete hero.equipped[slot];
  }
};

// ======================================================
// SHOP
// ======================================================
const Shop = {
  open(shopId, returnTo) {
    const shop = SHOPS[shopId];
    if (!shop) return;
    Game.currentShop = { shopId: shopId, returnTo: returnTo };
    document.getElementById('shop-keeper-portrait').innerHTML = Art[shop.keeperId] ? Art[shop.keeperId](80) : '';
    document.getElementById('shop-keeper-name').textContent = shop.keeperName;
    document.getElementById('shop-keeper-line').textContent = shop.keeperLine;
    document.getElementById('shop-gold').textContent = Game.hero.gold || 0;
    const list = document.getElementById('shop-items');
    list.innerHTML = '';
    shop.stock.forEach(entry => {
      const def = ITEMS[entry.itemId];
      if (!def) return;
      const card = document.createElement('div');
      card.className = 'shop-card';
      const effectBlurb = def.effect ?
        Object.entries(def.effect).map(([k, v]) => {
          if (typeof v === 'object') return '';
          const label = ({precision:'Precision',insight:'Insight',speed:'Speed',stamina:'Stamina',wisdom:'Wisdom',luck:'Luck',bonusHp:'Max HP',bonusTimer:'Timer'}[k] || k);
          return '<strong>+' + v + '</strong> ' + label;
        }).filter(Boolean).join(' · ') : '';
      card.innerHTML =
        '<div class="shop-card-name">' + def.name + '</div>' +
        '<div class="shop-card-desc">' + def.desc + '</div>' +
        (effectBlurb ? '<div class="shop-card-effect">' + effectBlurb + '</div>' : '') +
        '<div class="shop-card-row">' +
          '<div class="shop-card-price">⛁ ' + entry.price + '</div>' +
          '<button class="shop-card-buy">Buy</button>' +
        '</div>';
      const btn = card.querySelector('.shop-card-buy');
      btn.disabled = (Game.hero.gold || 0) < entry.price;
      btn.addEventListener('click', () => Shop.buy(entry));
      list.appendChild(card);
    });
    showScreen('shop');
  },

  buy(entry) {
    const def = ITEMS[entry.itemId];
    if (!def) return;
    if ((Game.hero.gold || 0) < entry.price) return;
    // Half the time, offer a math-priced purchase (Hybrid: math everywhere)
    if (Math.random() < 0.55) {
      Shop.bargainProblem(entry);
    } else {
      Shop._completeBuy(entry);
    }
  },

  bargainProblem(entry) {
    // Generate a small problem the player must solve to get a discount
    const topic = _pick(['multidigit_multiply','decimals_add','fractions_multiply','volume_rect_prism']);
    const prob = generateProblem(topic, 'easy');
    UI.openModal({
      title: 'Bargain Problem',
      body: '<p style="margin-bottom:10px;">Solve to confirm the trade:</p>' +
            '<div style="font-family:IM Fell English SC,serif;font-size:1.1rem;background:rgba(212,166,36,0.12);border:1px solid #d4a624;border-radius:4px;padding:12px;margin-bottom:10px;text-align:center;">' + prob.question + '</div>' +
            '<input id="bargain-input" type="text" autocomplete="off" inputmode="decimal" style="width:100%;padding:10px;font-family:Special Elite,monospace;font-size:1.2rem;text-align:center;background:rgba(0,0,0,0.3);color:#f0d27a;border:1px solid #d4a624;border-radius:4px;"/>',
      actions: [
        { label: 'Cancel', kind: 'secondary' },
        { label: 'Confirm Trade', kind: 'gold', click: () => {
          const inp = document.getElementById('bargain-input');
          const ans = inp ? inp.value : '';
          const correct = checkAnswer(ans, prob.answer);
          Engine.recordAttempt(Game.hero, prob.topic, correct);
          UI.closeModal();
          if (correct) {
            const discounted = Math.max(1, Math.floor(entry.price * 0.85));
            Shop._completeBuy({ itemId: entry.itemId, price: discounted });
            UI.toast('Sharp trading! 15% discount applied.');
          } else {
            UI.toast('Trade fell through. The answer was ' + prob.answer + '.');
          }
        } }
      ],
      afterRender: () => {
        setTimeout(() => { const i = document.getElementById('bargain-input'); if (i) i.focus(); }, 50);
      }
    });
  },

  _completeBuy(entry) {
    const def = ITEMS[entry.itemId];
    Game.hero.gold -= entry.price;
    Inventory.add(Game.hero, entry.itemId, 1);
    UI.toast('Acquired: ' + def.name);
    Game.save();
    Shop.open(Game.currentShop.shopId, Game.currentShop.returnTo);
  },

  leave() {
    const ret = Game.currentShop && Game.currentShop.returnTo;
    Game.currentShop = null;
    if (ret) ret();
    else showScreen('hub');
  }
};

// ======================================================
// STORY NODE RUNNER
// ======================================================
const Story = {
  show(node) {
    // node: { speaker?, text, choices, illustration?, encounter?, onEnter?, reward? }
    if (node.onEnter) node.onEnter();
    document.getElementById('story-speaker').textContent = node.speaker || '';
    document.getElementById('story-text').innerHTML = node.text || '';
    const illEl = document.getElementById('story-illustration');
    if (node.illustration && Art[node.illustration]) {
      illEl.innerHTML = Art[node.illustration]();
      illEl.style.display = 'block';
    } else {
      illEl.innerHTML = '';
      illEl.style.display = 'none';
    }
    const cont = document.getElementById('story-choices');
    cont.innerHTML = '';
    (node.choices || []).forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'story-choice' + (ch.locked ? ' locked' : '');
      btn.innerHTML = ch.text + (ch.tag ? ' <span class="story-choice-tag">' + ch.tag + '</span>' : '');
      if (!ch.locked) {
        btn.addEventListener('click', () => {
          if (typeof ch.go === 'function') ch.go();
          else if (typeof ch.next === 'string' && Story._nodeMap && Story._nodeMap[ch.next]) Story.show(Story._nodeMap[ch.next]);
        });
      }
      cont.appendChild(btn);
    });
    showScreen('story');
    Game.save();
  },

  setMap(map) { Story._nodeMap = map; }
};

// ======================================================
// UI HELPERS — modal, toast, confirm
// ======================================================
const UI = {
  openModal(opts) {
    const layer = document.getElementById('modal-layer');
    document.getElementById('modal-title').textContent = opts.title || '';
    document.getElementById('modal-body').innerHTML = opts.body || '';
    const actions = document.getElementById('modal-actions');
    actions.innerHTML = '';
    (opts.actions || [{ label: 'OK', kind: 'gold' }]).forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'btn ' + (a.kind === 'gold' ? 'btn-gold' : (a.kind === 'secondary' ? 'btn-secondary' : 'btn-ghost'));
      btn.textContent = a.label;
      btn.addEventListener('click', () => {
        if (typeof a.click === 'function') a.click();
        else UI.closeModal();
      });
      actions.appendChild(btn);
    });
    layer.style.display = 'flex';
    if (typeof opts.afterRender === 'function') opts.afterRender(layer);
  },
  closeModal() {
    document.getElementById('modal-layer').style.display = 'none';
  },
  confirm(opts) {
    UI.openModal({
      title: opts.title || 'Confirm',
      body: opts.body || '',
      actions: [
        { label: 'No', kind: 'secondary' },
        { label: opts.yesLabel || 'Yes', kind: 'gold', click: () => { UI.closeModal(); if (opts.yes) opts.yes(); } }
      ]
    });
  },
  toast(text) {
    const layer = document.getElementById('toast-layer');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
};

if (typeof window !== 'undefined') {
  window.Engine = Engine; window.Inventory = Inventory; window.Shop = Shop;
  window.Story = Story; window.UI = UI;
}
