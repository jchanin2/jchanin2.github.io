// ======================================================
// game.js — Slots, Game state, screens, top-level controller
// Realms of Mathematica II — The Numerian Codex
// ======================================================

// --------------------------------------------------------
// SAVE SLOTS
// --------------------------------------------------------
const Slots = {
  KEY: 'chronicle_slots_v1',
  NUM_SLOTS: 3,
  activeIndex: 0,
  _data: null,

  load() {
    if (this._data) return this._data;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) this._data = JSON.parse(raw);
    } catch (e) { /* ignore */ }
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
  persist() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this._data)); }
    catch (e) { console.warn('persist failed', e); }
  },
  selectSlot(idx) { this.load(); this.activeIndex = idx; this._data.activeIndex = idx; this.persist(); },
  deleteSlot(idx) { this.load(); this._data.slots[idx] = null; this.persist(); },
  commitNewHero(hero) {
    this.load();
    this._data.slots[this.activeIndex] = { hero: hero, lastPlayed: Date.now() };
    this.persist();
  },
  saveActive() {
    this.load();
    if (!Game.hero) return;
    this._data.slots[this.activeIndex] = { hero: Game.hero, lastPlayed: Date.now() };
    this.persist();
  },
  getActive() { this.load(); return this._data.slots[this.activeIndex]; },
  summary(idx) {
    this.load();
    const slot = this._data.slots[idx];
    if (!slot || !slot.hero) return { isEmpty: true };
    const h = slot.hero;
    const cls = CLASSES[h.classId] || { name: '?' };
    const her = HERITAGES[h.heritageId] || { name: '?' };
    const level = levelFromXp(h.xp || 0);
    const act = h.currentAct || 1;
    return {
      isEmpty: false,
      name: h.name,
      classLabel: her.name + ' ' + cls.name,
      level: level,
      act: act,
      questNode: h.questNode,
      lastPlayed: slot.lastPlayed,
      complete: h.questNode === 'game_complete' || !!(h.flags && h.flags.gameComplete)
    };
  }
};

// --------------------------------------------------------
// GAME STATE
// --------------------------------------------------------
const Game = {
  hero: null,
  combat: null,
  currentShop: null,
  _saveTimer: null,

  save() {
    Slots.saveActive();
  },

  refreshHubChrome() {
    const h = this.hero;
    if (!h) return;
    document.getElementById('hero-portrait-mini').innerHTML = Art.heroPortrait(h, 'mini');
    document.getElementById('hero-name-line').textContent = h.name;
    const cls = CLASSES[h.classId] || { name: '?' };
    const her = HERITAGES[h.heritageId] || { name: '?' };
    const level = levelFromXp(h.xp || 0);
    document.getElementById('hero-class-line').textContent = 'Level ' + level + ' · ' + her.name + ' ' + cls.name;
    const d = Engine.effectiveDerived(h);
    document.getElementById('hub-hp').textContent = (h.hp || 0) + '/' + d.maxHp;
    document.getElementById('hub-mp').textContent = (h.mp || 0) + '/' + d.maxMp;
    document.getElementById('hub-gold').textContent = h.gold || 0;
    document.getElementById('hub-xp').textContent = h.xp || 0;
  },

  openCharacterSheet() {
    const h = this.hero;
    if (!h) return;
    const cls = CLASSES[h.classId] || { name: '?' };
    const her = HERITAGES[h.heritageId] || { name: '?' };
    const eff = Engine.effectiveStats(h);
    const der = Engine.effectiveDerived(h);
    const level = levelFromXp(h.xp || 0);
    document.getElementById('sheet-portrait').innerHTML = Art.heroPortrait(h, 'sheet');
    document.getElementById('sheet-name').textContent = h.name;
    const titleStr = (h.titles && h.titles.length) ? ' · ' + h.titles.join(', ') : '';
    document.getElementById('sheet-subline').textContent = 'Level ' + level + ' · ' + her.name + ' ' + cls.name + ' · ' + (h.xp || 0) + ' XP' + titleStr;

    // stats
    const statsEl = document.getElementById('sheet-stats');
    statsEl.innerHTML = STAT_DEFS.map(s =>
      '<div class="sheet-stat-line"><span class="sheet-stat-label">' + s.icon + ' ' + s.name + '</span><span class="sheet-stat-value">' + (eff[s.id] || 0) + '</span></div>'
    ).join('') +
    '<div class="sheet-stat-line"><span class="sheet-stat-label">❤ Max HP</span><span class="sheet-stat-value">' + der.maxHp + '</span></div>' +
    '<div class="sheet-stat-line"><span class="sheet-stat-label">✦ Max MP</span><span class="sheet-stat-value">' + der.maxMp + '</span></div>' +
    '<div class="sheet-stat-line"><span class="sheet-stat-label">⌁ Timer</span><span class="sheet-stat-value">' + der.timerSec + 's</span></div>' +
    '<div class="sheet-stat-line"><span class="sheet-stat-label">☘ Crit</span><span class="sheet-stat-value">' + der.critPct + '%</span></div>';
    if (h.unspentPoints && h.unspentPoints > 0) {
      statsEl.innerHTML += '<div style="margin-top:10px;padding:6px 10px;background:rgba(212,166,36,0.15);border:1px solid #d4a624;border-radius:4px;color:#f0d27a;text-align:center;cursor:pointer;" id="spend-points-btn">⚜ ' + h.unspentPoints + ' unspent stat points — click to assign</div>';
    }

    // equipped
    const eqEl = document.getElementById('sheet-equipped');
    const slots = ['weapon','armor','accessory'];
    eqEl.innerHTML = slots.map(slot => {
      const id = (h.equipped || {})[slot];
      const it = id ? ITEMS[id] : null;
      return '<div class="equip-slot"><span class="equip-slot-label">' + slot.charAt(0).toUpperCase() + slot.slice(1) + '</span>' +
        (it
          ? '<span class="equip-slot-name">' + it.name + ' <button class="inv-item-action" data-unequip="' + slot + '">Unequip</button></span>'
          : '<span class="equip-slot-empty">— empty —</span>') +
        '</div>';
    }).join('');

    // inventory (non-equipped items + consumables)
    const invEl = document.getElementById('sheet-inventory');
    if (!h.inventory || h.inventory.length === 0) {
      invEl.innerHTML = '<div class="equip-slot-empty">Pack is empty.</div>';
    } else {
      const list = document.createElement('div');
      list.className = 'inv-list';
      h.inventory.forEach(it => {
        const def = ITEMS[it.itemId];
        if (!def) return;
        const row = document.createElement('div');
        row.className = 'inv-item';
        const actions = def.slot && def.slot !== 'consumable'
          ? '<button class="inv-item-action" data-equip="' + it.itemId + '">Equip</button>'
          : '<span style="color:#aab87c;font-size:0.8em;">use in combat</span>';
        row.innerHTML = '<span class="inv-item-name" title="' + def.desc + '">' + def.name + '</span>' +
                        '<span><span class="inv-item-qty">×' + it.qty + '</span> ' + actions + '</span>';
        list.appendChild(row);
      });
      invEl.innerHTML = '';
      invEl.appendChild(list);
    }

    // mastery
    const masteryEl = document.getElementById('sheet-mastery');
    const masteryKeys = Object.keys(h.mastery || {}).sort();
    if (masteryKeys.length === 0) {
      masteryEl.innerHTML = '<div class="equip-slot-empty">No data yet — answer problems to build mastery.</div>';
    } else {
      masteryEl.innerHTML = masteryKeys.map(k => {
        const m = h.mastery[k];
        const pct = m.attempts ? Math.round((m.correct / m.attempts) * 100) : 0;
        const name = (TOPICS[k] || { name: k }).name;
        return '<div class="mastery-row">' +
          '<span class="mastery-label">' + name + '</span>' +
          '<div class="mastery-bar"><div class="mastery-fill" style="width:' + pct + '%;"></div></div>' +
          '<span class="mastery-pct">' + pct + '%</span></div>';
      }).join('');
    }

    // feats
    const featsEl = document.getElementById('sheet-feats');
    const feats = [];
    if (h.feat && FEATS[h.feat]) feats.push({ name: FEATS[h.feat].name, desc: FEATS[h.feat].desc });
    if (h.heritageId && HERITAGES[h.heritageId]) feats.push({ name: her.name + ' Trait', desc: HERITAGES[h.heritageId].feat });
    const cls2 = CLASSES[h.classId];
    if (cls2 && cls2.abilities) {
      cls2.abilities.forEach(aid => {
        const ab = ABILITIES[aid];
        if (ab) feats.push({ name: ab.name, desc: ab.desc + (ab.cost ? ' (costs ' + ab.cost + ' MP)' : '') });
      });
    }
    featsEl.innerHTML = feats.map(f => '<div class="feat-card"><div class="feat-card-name">' + f.name + '</div><div class="feat-card-desc">' + f.desc + '</div></div>').join('');

    // wire equipment buttons
    document.querySelectorAll('[data-equip]').forEach(b => {
      b.addEventListener('click', () => {
        Inventory.equip(h, b.getAttribute('data-equip'));
        Game.save();
        Game.openCharacterSheet();
      });
    });
    document.querySelectorAll('[data-unequip]').forEach(b => {
      b.addEventListener('click', () => {
        Inventory.unequip(h, b.getAttribute('data-unequip'));
        Game.save();
        Game.openCharacterSheet();
      });
    });
    const spendBtn = document.getElementById('spend-points-btn');
    if (spendBtn) spendBtn.addEventListener('click', () => Game._openPointSpender());

    showScreen('character');
  },

  _openPointSpender() {
    const h = this.hero;
    const draftStats = Object.assign({}, h.stats);
    let pointsLeft = h.unspentPoints || 0;
    const total = pointsLeft;
    const render = () => {
      UI.openModal({
        title: 'Spend Stat Points',
        body: '<p style="margin-bottom:10px;">You have <strong style="color:#f0d27a;">' + pointsLeft + '</strong> / ' + total + ' points to spend.</p>' +
              STAT_DEFS.map(s =>
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:rgba(212,166,36,0.06);border-radius:4px;margin-bottom:5px;">' +
                  '<span><strong style="color:#f0d27a;font-family:Cinzel,serif;">' + s.name + '</strong> <span style="color:#c8b078;font-size:0.85em;font-style:italic;">' + s.blurb + '</span></span>' +
                  '<span style="display:flex;gap:6px;align-items:center;">' +
                    '<button class="stat-btn" data-stat="' + s.id + '" data-dir="-1" ' + (draftStats[s.id] <= h.stats[s.id] ? 'disabled' : '') + '>−</button>' +
                    '<span style="min-width:30px;text-align:center;font-family:Cinzel,serif;color:#fff;">' + draftStats[s.id] + '</span>' +
                    '<button class="stat-btn" data-stat="' + s.id + '" data-dir="+1" ' + (pointsLeft <= 0 || draftStats[s.id] >= s.max ? 'disabled' : '') + '>+</button>' +
                  '</span>' +
                '</div>'
              ).join(''),
        actions: [
          { label: 'Cancel', kind: 'secondary' },
          { label: 'Save', kind: 'gold', click: () => {
            h.stats = draftStats;
            h.unspentPoints = pointsLeft;
            // clamp HP/MP up to new max
            const d = Engine.effectiveDerived(h);
            if (h.hp < d.maxHp) {/* keep current */}
            Game.save();
            UI.closeModal();
            Game.openCharacterSheet();
          }}
        ],
        afterRender: (modal) => {
          modal.querySelectorAll('.stat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const sid = btn.getAttribute('data-stat');
              const dir = parseInt(btn.getAttribute('data-dir'), 10);
              const sd = STAT_DEFS.find(s => s.id === sid);
              if (dir > 0 && pointsLeft > 0 && draftStats[sid] < sd.max) {
                draftStats[sid]++;
                pointsLeft--;
                render();
              } else if (dir < 0 && draftStats[sid] > h.stats[sid]) {
                draftStats[sid]--;
                pointsLeft++;
                render();
              }
            });
          });
        }
      });
    };
    render();
  },

  // Decide where the active hero should land based on questNode + currentAct
  _routeForHero() {
    const h = Game.hero;
    if (!h) return;
    const node = h.questNode;
    if (!node || node === 'opening_cutscene') return Act1.beginOpening();
    // After completion, the hero lives in Numeria again
    if (h.questNode === 'game_complete') { h.currentAct = 1; return Act1.openTownHub(); }
    // Act II–VI hubs
    if (h.currentAct === 2) return Act2.openPortHub();
    if (h.currentAct === 3) return Act3.openFoundryTown();
    if (h.currentAct === 4) return Act4.openUndermarket();
    if (h.currentAct === 5) return Act5.openConcord();
    if (h.currentAct === 6) return Act6.openSkyOutpost();
    // Default: Act I town hub
    return Act1.openTownHub();
  },

  // Resume from a save slot
  continueFromSlot() {
    const slot = Slots.getActive();
    if (!slot || !slot.hero) return false;
    Game.hero = slot.hero;
    // Backfill flags introduced in later patches
    if (!Game.hero.flags) Game.hero.flags = {};
    if (typeof Game.hero.currentAct !== 'number') Game.hero.currentAct = 1;
    // Initialize hp/mp if null
    const d = Engine.effectiveDerived(Game.hero);
    if (Game.hero.hp === null || Game.hero.hp === undefined) Game.hero.hp = d.maxHp;
    if (Game.hero.mp === null || Game.hero.mp === undefined) Game.hero.mp = d.maxMp;
    Game._routeForHero();
    return true;
  }
};

// --------------------------------------------------------
// SCREEN ROUTING
// --------------------------------------------------------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

function _formatLastPlayed(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'today';
  const dayMs = 86400000;
  const diff = Math.floor((now - d) / dayMs);
  if (diff === 1) return 'yesterday';
  if (diff < 7) return diff + ' days ago';
  return d.toLocaleDateString();
}

// --------------------------------------------------------
// SLOT PICKER
// --------------------------------------------------------
function renderSlotPicker() {
  const list = document.getElementById('slots-list');
  list.innerHTML = '';
  for (let i = 0; i < Slots.NUM_SLOTS; i++) {
    const summary = Slots.summary(i);
    const card = document.createElement('div');
    card.className = 'slot-card' + (summary.isEmpty ? ' empty' : '') + (i === Slots.activeIndex && !summary.isEmpty ? ' active' : '');
    if (summary.isEmpty) {
      card.innerHTML =
        '<div class="slot-card-number">Slot ' + (i + 1) + '</div>' +
        '<div class="slot-card-title">New Hero</div>' +
        '<div class="slot-card-empty-hint">Step into the world for the first time.</div>';
      card.addEventListener('click', () => {
        Slots.selectSlot(i);
        Creation.start();
      });
    } else {
      const questBlurb = summary.complete ? '★ Codex complete'
                         : (summary.questNode === 'town_hub_first' ? 'Just arrived in Numeria'
                         : 'In Act ' + (summary.act || 1));
      card.innerHTML =
        '<div class="slot-card-number">Slot ' + (i + 1) + '</div>' +
        '<div class="slot-card-title">' + summary.name + '</div>' +
        '<div class="slot-card-subtitle">' + summary.classLabel + ' · Level ' + summary.level + '</div>' +
        '<div class="slot-card-stats"><div class="stat-line"><span>' + questBlurb + '</span><span>Act ' + summary.act + '</span></div></div>' +
        '<div class="slot-card-last">Last played ' + _formatLastPlayed(summary.lastPlayed) + '</div>' +
        '<button class="slot-card-delete" title="Delete this save">✕</button>';
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('slot-card-delete')) return;
        Slots.selectSlot(i);
        Game.continueFromSlot();
      });
      const del = card.querySelector('.slot-card-delete');
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        UI.confirm({
          title: 'Delete this save?',
          body: 'This will permanently erase <em>' + summary.name + '</em>. There is no recovery.',
          yesLabel: 'Delete',
          yes: () => { Slots.deleteSlot(i); renderSlotPicker(); }
        });
      });
    }
    list.appendChild(card);
  }
}

if (typeof window !== 'undefined') {
  window.Game = Game; window.Slots = Slots; window.showScreen = showScreen;
}

// --------------------------------------------------------
// DOM EVENT WIRING
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  Slots.load();
  document.getElementById('title-emblem').innerHTML = Art.titleEmblem();

  document.getElementById('btn-start').addEventListener('click', () => {
    renderSlotPicker();
    showScreen('slots');
  });
  document.getElementById('btn-slots-back').addEventListener('click', () => showScreen('title'));
  document.getElementById('btn-create-back').addEventListener('click', () => Creation.back());
  document.getElementById('btn-create-next').addEventListener('click', () => Creation.next());

  // cutscene
  document.getElementById('btn-cutscene-next').addEventListener('click', () => Cutscene.next());

  // combat controls
  document.getElementById('btn-combat-attack').addEventListener('click', () => Engine._submitAnswer());
  document.getElementById('btn-combat-hint').addEventListener('click', () => Engine.useHint());
  document.getElementById('btn-combat-spell').addEventListener('click', () => Engine.openSpellMenu());
  document.getElementById('btn-combat-item').addEventListener('click', () => Engine.openItemMenu());
  document.getElementById('btn-combat-flee').addEventListener('click', () => Engine.flee());

  // hub controls
  document.getElementById('btn-hub-quit').addEventListener('click', () => {
    UI.confirm({
      title: 'Return to title?',
      body: 'Your progress is auto-saved. You can come back any time.',
      yes: () => { Game.save(); showScreen('title'); }
    });
  });
  document.getElementById('btn-open-character').addEventListener('click', () => Game.openCharacterSheet());
  document.getElementById('btn-character-back').addEventListener('click', () => Game._routeForHero());

  // shop
  document.getElementById('btn-shop-back').addEventListener('click', () => Shop.leave());

  // act complete
  document.getElementById('btn-act-continue').addEventListener('click', () => Game._routeForHero());

  // epilogue (game complete)
  const epiBtn = document.getElementById('btn-epilogue-back');
  if (epiBtn) epiBtn.addEventListener('click', () => { Game.save(); showScreen('title'); });

  // close modal backdrop
  const layer = document.getElementById('modal-layer');
  layer.querySelector('.modal-backdrop').addEventListener('click', () => UI.closeModal());

  // load any slot summary on title screen as quick "Continue" — keep simple for now
});
