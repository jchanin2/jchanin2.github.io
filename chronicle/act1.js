// ======================================================
// act1.js — Act I: "The Sundered Quarry"
// Story nodes, location handlers, encounter wiring
// ======================================================

const Cutscene = {
  panels: null,
  index: 0,
  onDone: null,

  play(panels, onDone) {
    // panels: [{ speaker?, text, illustration?, illustrationId? }]
    this.panels = panels;
    this.index = 0;
    this.onDone = onDone;
    this._render();
    showScreen('cutscene');
  },

  _render() {
    const p = this.panels[this.index];
    if (!p) return;
    document.getElementById('cutscene-speaker').textContent = p.speaker || '';
    document.getElementById('cutscene-text').innerHTML = p.text || '';
    const ill = document.getElementById('cutscene-illustration');
    if (p.illustration) {
      ill.innerHTML = p.illustration;
    } else if (p.illustrationId && Art[p.illustrationId]) {
      ill.innerHTML = Art[p.illustrationId]();
    } else {
      ill.innerHTML = '';
    }
    const btn = document.getElementById('btn-cutscene-next');
    btn.textContent = (this.index === this.panels.length - 1) ? 'Begin →' : 'Continue →';
  },

  next() {
    this.index++;
    if (this.index >= this.panels.length) {
      const cb = this.onDone;
      this.panels = null; this.onDone = null;
      if (cb) cb();
    } else {
      this._render();
    }
  }
};

// ======================================================
// ACT I
// ======================================================
const Act1 = {

  // ---------- Opening cutscene ----------
  beginOpening() {
    const hero = Game.hero;
    Cutscene.play([
      {
        illustrationId: 'numeriaHub',
        speaker: 'Numeria — Year Three of the Quiet',
        text: '<p>Three years have passed since the goblin uprising. The village of <em>Numeria</em> has been rebuilt — new thatch on the tavern, a fresh anvil at the forge, and a tall stone tower at the edge of the square where there used to be only fields. The tower belongs to <em>Lysara</em>, the elf scholar who helped end the old crisis.</p><p>This morning, the messenger\'s sparrow that arrived at your door bore a single word: <em>"Come."</em></p>'
      },
      {
        illustrationId: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>"' + hero.name + '. Thank you for coming." She turns from the window, and even the candles seem to dim around her. "I have been studying an artefact for three years. The <em>Numerian Codex</em> — a book of measurements, rules, and patterns older than this village. It was the Codex that taught us how to balance the world after the last crisis."</p><p>"Yesterday, three pages of it tore themselves out and flew into the night. I cannot follow them. <em>You</em> can."</p>'
      },
      {
        illustrationId: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>"The first page fell into <em>The Sundered Quarry</em>, a day\'s walk south. The quarrymen abandoned it last spring — they claimed the stones themselves had begun to breathe. I think the Codex page is the cause. I think something <em>woke up</em> when it landed."</p><p>"Find the page. Bring it back. The math you learn fighting your way to it will be the math you need for the pages that come after. There will be more, ' + hero.name + '. There will be six in all."</p>'
      },
      {
        illustrationId: 'quarryExterior',
        speaker: '',
        text: '<p>You stand at the edge of the Sundered Quarry as the sun climbs over the cliff-tops. A cart sits abandoned on the rails. The arched mouth of the mine yawns wide. Somewhere deep inside, something is breathing in cubes.</p><p>It is time to begin.</p>'
      }
    ], () => {
      Game.hero.questNode = 'town_hub_first';
      Game.hero.flags.metLysara = true;
      Game.save();
      Act1.openTownHub();
    });
  },

  // ---------- Town hub ----------
  openTownHub() {
    const hero = Game.hero;
    Game.refreshHubChrome();
    document.getElementById('hub-illustration').innerHTML = Art.numeriaHub();
    const list = document.getElementById('hub-locations');
    list.innerHTML = '';

    const locations = this._currentLocations();
    locations.forEach(loc => {
      const btn = document.createElement('button');
      btn.className = 'hub-location-btn';
      btn.innerHTML = '<span class="hub-location-name">' + loc.name + '</span>' +
                      '<span class="hub-location-desc">' + loc.desc + '</span>' +
                      (loc.badge ? '<span class="hub-location-badge">' + loc.badge + '</span>' : '');
      btn.disabled = !!loc.disabled;
      btn.addEventListener('click', loc.action);
      list.appendChild(btn);
    });
    document.getElementById('hub-quest-text').textContent = this._currentQuestText();
    showScreen('hub');
    Game.save();
  },

  _currentQuestText() {
    const node = Game.hero.questNode;
    if (node === 'town_hub_first') return 'Speak to Lysara — she has a task for you. (Visit her tower.)';
    if (node === 'in_quarry_entry') return 'Make your way through the Sundered Quarry.';
    if (node === 'before_foreman') return 'Confront the Quarry Foreman in the central chamber.';
    if (node === 'after_foreman') return 'Choose your path — descend to the void, or surface to track the corruption.';
    if (node === 'before_hollowed') return 'Face The Hollowed One in the heart of the Quarry.';
    if (node === 'act1_complete') return 'Act I complete. Rest, prepare, and return to Lysara to begin Act II.';
    if (node === 'act2_complete') return 'Act II complete. Visit Lysara\'s Tower to begin Act III — the Iron Foundries.';
    if (node === 'act3_complete') return 'Act III complete. Visit Lysara\'s Tower to begin Act IV — the Deep Vaults.';
    if (node === 'act4_complete') return 'Act IV complete. Visit Lysara\'s Tower to begin Act V — Concord.';
    if (node === 'act5_complete') return 'Act V complete. Visit Lysara\'s Tower to begin the final act.';
    if (node === 'game_complete') return 'The Codex is whole. Numeria is at peace — wander, shop, and revisit as you like.';
    return 'Find the missing page of the Numerian Codex.';
  },

  _currentLocations() {
    const hero = Game.hero;
    const node = hero.questNode;
    const locs = [];

    locs.push({
      name: 'The Rusty Compass',
      desc: 'Brenna\'s tavern. Stew, gossip, and a few quietly useful potions for sale.',
      action: () => Act1.enterTavern()
    });

    locs.push({
      name: 'Dorrick\'s Forge',
      desc: 'A dwarven smith with a knack for charms and chain-mail.',
      action: () => Act1.enterForge()
    });

    locs.push({
      name: 'Lysara\'s Tower',
      desc: 'The scholar\'s study. Maps, books, and a glowing orb.',
      badge: node === 'town_hub_first' ? 'QUEST' : ((node === 'act1_complete' || node === 'act2_complete' || node === 'act3_complete' || node === 'act4_complete' || node === 'act5_complete') ? 'RETURN' : null),
      action: () => Act1.enterLysara()
    });

    locs.push({
      name: 'Training Yard',
      desc: 'A patient straw-dummy and a chalkboard. Practice the topics you find hardest.',
      action: () => Act1.enterTraining()
    });

    locs.push({
      name: 'The Sundered Quarry',
      desc: node === 'town_hub_first'
        ? 'Closed to you — speak with Lysara first.'
        : (node !== 'in_quarry_entry' && node !== 'before_foreman' && node !== 'after_foreman' && node !== 'branch_descend' && node !== 'branch_surface' && node !== 'before_hollowed' ? 'A quiet, empty pit, the corruption gone.' : 'The abandoned quarry, mouth like a wound in the earth.'),
      disabled: node !== 'in_quarry_entry' && node !== 'before_foreman' && node !== 'after_foreman' && node !== 'branch_descend' && node !== 'branch_surface' && node !== 'before_hollowed',
      action: () => Act1.enterQuarry()
    });

    locs.push({
      name: 'Character Sheet',
      desc: 'Inspect your stats, equipment, inventory, and mastery.',
      action: () => Game.openCharacterSheet()
    });

    return locs;
  },

  // ---------- Tavern ----------
  enterTavern() {
    Story.show({
      illustration: 'tavernInterior',
      speaker: 'Brenna',
      text: '<p>"Look who\'s back. Sit down, hero — your face says you\'ve been somewhere damp."</p><p>"Tam swears he saw a shape moving along the quarry rim last night. Wasn\'t a wolf. Wasn\'t a bird. Was — and I quote — \'tall and full of corners.\' He\'s nine, mind, so take it with salt."</p><p>"Now: what\'ll it be?"</p>',
      choices: [
        { text: 'Browse Brenna\'s shelf.', go: () => Shop.open('brenna_tavern', () => Act1.enterTavern()) },
        { text: '"Tell me more about the strange shape Tam saw."', go: () => Act1._brennaLore() },
        { text: 'Leave the tavern.', go: () => Act1.openTownHub() }
      ]
    });
  },

  _brennaLore() {
    Story.show({
      illustration: 'tavernInterior',
      speaker: 'Brenna',
      text: '<p>"All right. So Tam said the shape was tall — taller than me — and \'full of corners.\' He said its eyes were too far apart. He said it didn\'t walk, exactly. It <em>fell</em> from one place to the next, like a die being thrown and landing flat each time."</p><p>She slides a small leather pouch across the bar. "Take this. He found it on the path, picked it up before I could stop him. There\'s a number scratched on the inside."</p>',
      choices: [
        { text: 'Take the pouch and inspect it.', go: () => Act1._brennaPouch() },
        { text: 'Browse her shelf.', go: () => Shop.open('brenna_tavern', () => Act1.enterTavern()) },
        { text: 'Leave the tavern.', go: () => Act1.openTownHub() }
      ]
    });
  },

  _brennaPouch() {
    if (!Inventory.has(Game.hero, 'scroll_of_sight')) {
      Inventory.add(Game.hero, 'scroll_of_sight', 1);
      UI.toast('Gained: Scroll of Sight');
    }
    Game.save();
    Story.show({
      illustration: 'tavernInterior',
      speaker: '',
      text: '<p>The pouch is empty save for a folded scrap of parchment. Scrawled on it in a precise hand: <em>"V = 6 × 4 × 3."</em></p><p>Beneath that, a single circled number: <em>72.</em></p><p>You tuck the scrap into your pack.</p>',
      choices: [
        { text: 'Browse Brenna\'s shelf.', go: () => Shop.open('brenna_tavern', () => Act1.enterTavern()) },
        { text: 'Leave the tavern.', go: () => Act1.openTownHub() }
      ]
    });
  },

  // ---------- Forge ----------
  enterForge() {
    Story.show({
      illustration: 'forge',
      speaker: 'Dorrick',
      text: '<p>"You came to the right anvil, friend. Steel that sings, leather that holds, charms that mean something — Dorrick makes them all. Look at the rack. Pick what you can afford. I haggle with no one."</p><p>He winks at you under his great braided beard, which somewhat undermines the haggling claim.</p>',
      choices: [
        { text: 'Browse the rack.', go: () => Shop.open('smith_dorrick', () => Act1.enterForge()) },
        { text: 'Ask Dorrick about the Sundered Quarry.', go: () => Act1._dorrickLore() },
        { text: 'Leave the forge.', go: () => Act1.openTownHub() }
      ]
    });
  },

  _dorrickLore() {
    Story.show({
      illustration: 'forge',
      speaker: 'Dorrick',
      text: '<p>"The Quarry? Aye. Forty years I worked stone, and that pit was the cleanest cut on this side of the Spine. Then last spring the brutes started turning out wrong. Not crooked — <em>wrong</em>. Like they were cut to a measure that didn\'t match anything else."</p><p>"My grandda would have said it was the <em>old breath</em>, the thing that lives in solid stone and counts every grain. Whatever\'s down there now — it\'s woken that breath up. So when you go down, you keep your numbers tight. Stone forgives a poor strike. The old breath does not."</p>',
      choices: [
        { text: 'Browse the rack.', go: () => Shop.open('smith_dorrick', () => Act1.enterForge()) },
        { text: 'Leave the forge.', go: () => Act1.openTownHub() }
      ]
    });
  },

  // ---------- Lysara ----------
  enterLysara() {
    const node = Game.hero.questNode;
    if (node === 'town_hub_first') {
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>"Good. You came back. Listen — the Quarry will test you on <em>volume</em>. Length times width times height. The stone-bound creatures down there think in cubes. Their bodies, their attacks, their counting — all cubes."</p><p>"Take this." She presses a small silver-bound charm into your hand. "It will not save you. But it will <em>remind</em> you. Volume = l × w × h. Burn that into the back of your eyelids before you set foot in the dark."</p>',
        choices: [
          { text: 'Take the charm.', go: () => {
            Inventory.add(Game.hero, 'cubits_amulet', 1);
            UI.toast('Gained: Cubit\'s Amulet');
            Game.hero.questNode = 'in_quarry_entry';
            Game.save();
            Story.show({
              illustration: 'lysaraStudy',
              speaker: 'Lysara',
              text: '<p>She nods once. "The Quarry is yours when you are ready. Come back any time — I am here, the kettle is always on, and I will help you face whatever the math finds in you."</p>',
              choices: [
                { text: 'Return to the village.', go: () => Act1.openTownHub() }
              ]
            });
          } }
        ]
      });
    } else if (node === 'act1_complete') {
      // post-Act I conversation — leads into Act II
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>She takes the page in both hands, holds it up to the candlelight, and exhales a breath she has been holding for three years.</p><p>"It is the right page. It is undamaged." She looks up. "Five more, ' + Game.hero.name + '. And I think the next is somewhere very wet."</p>',
        choices: [
          { text: 'I\'m ready. Tell me where to go.', tag: 'ACT II', go: () => Act2.beginOpening() },
          { text: 'Not yet. I need to rest.', go: () => Act1.openTownHub() }
        ]
      });
    } else if (node === 'act2_complete') {
      // post-Act II conversation — leads into Act III
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>She lays the salt-wet page beside the first, and they hum quietly together. "Two of six. ' + Game.hero.name + ', you have done in three months what I could not have done in three years."</p>' +
              '<p>"Page Three is pinned at last. The compass points <em>north</em>, into the war-marches — to the <em>Iron Foundries</em> of Cinderforge. Something there has woken the old war-machines, and it counts its army in the thousands. Multiplication and division, ' + Game.hero.name + '. The math of armies. Mira will see you up the King\'s Road."</p>',
        choices: [
          { text: 'I\'m ready. March north.', tag: 'ACT III', go: () => Act3.beginOpening() },
          { text: 'Not yet. I need to prepare.', go: () => Act1.openTownHub() }
        ]
      });
    } else if (node === 'act3_complete') {
      // post-Act III conversation — leads into Act IV
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>Three pages now rest on the desk, humming in chorus. "Halfway, ' + Game.hero.name + '. Halfway." She rubs her eyes. "The next reading is the strangest yet — it points <em>down</em>, beneath the old city, into the <em>Deep Vaults</em> where the merchant-princes of the first Numeria hid their fortunes in tenths and hundredths of a coin."</p>' +
              '<p>"Something down there has been <em>skimming</em> — a sliver of value off everything, so small no one notices, until a whole city is poor. Decimals, ' + Game.hero.name + '. The little places where wealth quietly goes missing. Mira knows a way down through the old market well."</p>',
        choices: [
          { text: 'I\'m ready. Take me down.', tag: 'ACT IV', go: () => Act4.beginOpening() },
          { text: 'Not yet. I need to prepare.', go: () => Act1.openTownHub() }
        ]
      });
    } else if (node === 'act4_complete') {
      // post-Act IV conversation — leads into Act V
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>Four pages, humming a chord that rattles the teacups. "Two left," she says softly. "The fifth points <em>outward</em> — across the border to <em>Concord</em>, the free trade-city, where the page has set every market and every measure at war with itself. A half is bigger than a third in one street and smaller in the next. If it spreads, every treaty in the realm collapses."</p>' +
              '<p>"Unlike fractions, mixed numbers, powers of ten, conversions — the math of trade and treaty, ' + Game.hero.name + '. Find the common ground. Mira knows the roads to Concord better than anyone alive."</p>',
        choices: [
          { text: 'I\'m ready. To Concord.', tag: 'ACT V', go: () => Act5.beginOpening() },
          { text: 'Not yet. I need to prepare.', go: () => Act1.openTownHub() }
        ]
      });
    } else if (node === 'act5_complete') {
      // post-Act V conversation — leads into the final act
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>Five pages now, and the chord they hum is almost a voice. "One left," Lysara whispers. "And the last reading points <em>up</em> — into the sky itself, to the old <em>Sky-Bridge</em> above Numeria, a lattice of star-iron laid out like a vast coordinate grid. The sixth page is at its summit. And ' + Game.hero.name + '... I think whatever has been corrupting these pages will be waiting there, in person, when the Codex is nearly whole."</p>' +
              '<p>"Plot the points. Find the distances. Name the shapes. Everything you learned on Captain Cartwright\'s old charts, and everything since. This is the end of the road, hero. Climb when you are ready."</p>',
        choices: [
          { text: 'I\'m ready. Climb to the Sky-Bridge.', tag: 'FINAL ACT', go: () => Act6.beginOpening() },
          { text: 'Not yet. I need to prepare.', go: () => Act1.openTownHub() }
        ]
      });
    } else if (node === 'game_complete') {
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>The whole Codex rests on the desk between you, humming its quiet, complete chord. "You did it," Lysara says simply. "Every page. Every land. Every kind of number in the world, set right by your hand." She smiles. "Go on — the realm is yours to wander now. The kettle is always on."</p>',
        choices: [
          { text: 'Rest in Numeria.', go: () => Act1.openTownHub() }
        ]
      });
    } else {
      // generic visit
      Story.show({
        illustration: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>"You smell of stone-dust. Good. Means you are doing the work. The Quarry will not get easier — but you will get sharper. Be sharper than it is."</p>' +
              '<p style="font-size:0.92em;font-style:italic;color:#c8b078;">She pours you a small cup of something hot and brown that tastes of cardamom.</p>',
        choices: [
          { text: 'Talk about adaptive practice.', go: () => Act1.enterTraining() },
          { text: 'Return to the village.', go: () => Act1.openTownHub() }
        ]
      });
    }
  },

  // ---------- Training Yard / Adaptive practice ----------
  enterTraining() {
    const weak = Engine.weakestTopics(Game.hero, 2);
    const top = weak[0];
    const topic = top ? top.topic : 'volume_rect_prism';
    const topicName = (TOPICS[topic] || {name: topic}).name;
    const masteryLine = top ? '<p>You\'ve struggled most with <em>' + topicName + '</em> (' + Math.round(top.pct) + '% mastery). Five problems on that topic — get four right and earn a reward.</p>'
                            : '<p>You haven\'t practiced enough yet to find a weak spot. Five mixed problems will do you good either way.</p>';
    Story.show({
      illustration: 'forge', // re-use any indoor scene; we don't have a yard yet
      speaker: 'Training Yard',
      text: '<p>You step into the open patch behind Dorrick\'s forge. A straw-dummy stands in a circle of chalk, and a small slate leans against the wall.</p>' + masteryLine,
      choices: [
        { text: 'Practice ' + (top ? topicName : 'a mixed set') + ' (5 problems)', go: () => Act1._runTraining(topic) },
        { text: 'Back.', go: () => Game._routeForHero() }
      ]
    });
  },

  _runTraining(topic) {
    const session = { topic: topic, problems: [], i: 0, correct: 0, total: 5 };
    for (let i = 0; i < 5; i++) {
      session.problems.push(generateProblem(topic, 'easy'));
    }
    Act1._trainingTick(session);
  },

  _trainingTick(session) {
    if (session.i >= session.total) return Act1._trainingDone(session);
    const p = session.problems[session.i];
    UI.openModal({
      title: 'Training — Problem ' + (session.i + 1) + ' of ' + session.total,
      body: '<p style="margin-bottom:10px;font-family:IM Fell English SC,serif;font-size:1.1rem;background:rgba(212,166,36,0.12);border:1px solid #d4a624;border-radius:4px;padding:12px;text-align:center;">' + p.question + '</p>' +
            (p.format === 'mc'
              ? p.options.map((opt, i) => '<button class="train-mc" data-opt="' + opt + '" style="display:block;width:100%;text-align:left;background:rgba(0,0,0,0.3);border:1px solid #d4a624;color:#f0d27a;padding:8px 12px;margin-bottom:6px;border-radius:4px;cursor:pointer;font-family:IM Fell English SC,serif;">' + opt + '</button>').join('')
              : '<input id="train-input" type="text" autocomplete="off" inputmode="decimal" style="width:100%;padding:10px;font-family:Special Elite,monospace;font-size:1.2rem;text-align:center;background:rgba(0,0,0,0.3);color:#f0d27a;border:1px solid #d4a624;border-radius:4px;"/>'),
      actions: p.format === 'mc'
        ? [{ label: 'Skip', kind: 'secondary', click: () => { UI.closeModal(); session.i++; Act1._trainingTick(session); } }]
        : [
            { label: 'Skip', kind: 'secondary', click: () => { UI.closeModal(); session.i++; Act1._trainingTick(session); } },
            { label: 'Submit', kind: 'gold', click: () => {
              const inp = document.getElementById('train-input');
              const ans = inp ? inp.value : '';
              const ok = checkAnswer(ans, p.answer);
              Engine.recordAttempt(Game.hero, p.topic, ok);
              if (ok) { session.correct++; UI.toast('Correct!'); } else { UI.toast('Not quite — answer was ' + p.answer); }
              UI.closeModal();
              session.i++;
              Act1._trainingTick(session);
            } }
          ],
      afterRender: (modal) => {
        if (p.format === 'mc') {
          modal.querySelectorAll('.train-mc').forEach(btn => {
            btn.addEventListener('click', () => {
              const ans = btn.getAttribute('data-opt');
              const ok = checkAnswer(ans, p.answer);
              Engine.recordAttempt(Game.hero, p.topic, ok);
              if (ok) { session.correct++; UI.toast('Correct!'); } else { UI.toast('Not quite — answer was ' + p.answer); }
              UI.closeModal();
              session.i++;
              Act1._trainingTick(session);
            });
          });
        } else {
          setTimeout(() => { const i = document.getElementById('train-input'); if (i) i.focus(); }, 50);
        }
      }
    });
  },

  _trainingDone(session) {
    const passed = session.correct >= 4;
    let reward = '';
    if (passed) {
      Game.hero.gold = (Game.hero.gold || 0) + 18;
      Inventory.add(Game.hero, 'minor_potion', 1);
      reward = '<p style="color:#f0d27a;">+18 gold, +1 Minor Potion.</p>';
    }
    Game.save();
    UI.openModal({
      title: passed ? 'Training Complete' : 'Training Done',
      body: '<p>You answered <strong>' + session.correct + ' of ' + session.total + '</strong> correctly.</p>' + reward + '<p style="font-style:italic;color:#c8b078;">Topic mastery has been recorded.</p>',
      actions: [{ label: 'Done', kind: 'gold', click: () => { UI.closeModal(); Game._routeForHero(); } }]
    });
  },

  // ---------- Quarry — main dungeon ----------
  enterQuarry() {
    const node = Game.hero.questNode;
    if (node === 'in_quarry_entry') return Act1._quarryEntry();
    if (node === 'before_foreman') return Act1._quarryForemanIntro();
    if (node === 'after_foreman') return Act1._quarryBranch();
    if (node === 'branch_descend' || node === 'before_hollowed') return Act1._hollowedIntro();
    if (node === 'branch_surface' || node === 'before_hollowed_b') return Act1._hollowedIntroB();
    // fallback
    return Act1._quarryEntry();
  },

  _quarryEntry() {
    Story.show({
      illustration: 'quarryExterior',
      speaker: '',
      text: '<p>You step under the wooden arch. The air drops ten degrees. Beyond the entrance, the tunnel slopes downward into a great chamber, lit by torches that shouldn\'t still be burning.</p><p>A skittering noise to your left — a <em>Rubble Imp</em>, a fist-sized creature of stacked stones, scuttles toward you with a hiss.</p>',
      choices: [
        { text: 'Strike first!', tag: 'COMBAT', go: () => {
          Engine.startCombat({
            enemyId: 'rubble_imp',
            onVictory: () => {
              Game.save();
              Act1._quarryPassage1();
            },
            onDefeat: () => Act1.openTownHub()
          });
        } }
      ]
    });
  },

  _quarryPassage1() {
    Story.show({
      illustration: 'quarryInterior',
      speaker: '',
      text: '<p>The imp crumbles into harmless gravel. You step over it into a long stone gallery. The torch-light is purple-edged — wrong, but useful. Pillars stand at intervals, each carved with cubes.</p><p>From a side passage emerges a long, segmented thing — a <em>Stone Grub</em>, the size of a stagecoach.</p>',
      choices: [
        { text: 'Stand your ground.', tag: 'COMBAT', go: () => {
          Engine.startCombat({
            enemyId: 'stone_grub',
            onVictory: () => {
              Game.save();
              Act1._quarryRest();
            },
            onDefeat: () => Act1.openTownHub()
          });
        } },
        { text: 'Retreat to the village to prepare.', go: () => Act1.openTownHub() }
      ]
    });
  },

  _quarryRest() {
    Story.show({
      illustration: 'quarryInterior',
      speaker: '',
      text: '<p>You reach a small alcove. A spring of clean water bubbles into a stone basin — the only living thing in this dead place. You drink, eat, and your wounds knit a little.</p>',
      choices: [
        { text: 'Rest. (+25 HP, +1 MP)', go: () => {
          const d = Engine.effectiveDerived(Game.hero);
          Game.hero.hp = Math.min(d.maxHp, (Game.hero.hp || 0) + 25);
          Game.hero.mp = Math.min(d.maxMp, (Game.hero.mp || 0) + 1);
          UI.toast('Rested.');
          Game.save();
          Act1._quarryBrute();
        } }
      ]
    });
  },

  _quarryBrute() {
    Story.show({
      illustration: 'quarryInterior',
      speaker: '',
      text: '<p>The passage opens into a wide hall lined with massive carved blocks. In the center stands a <em>Quarry Brute</em> — a hulking stone-skinned warrior with a chest-carving in the shape of the letter V.</p><p>It speaks in a voice that grates: <em>"Length. Width. Height. Volume."</em> Then it raises its pickaxe.</p>',
      choices: [
        { text: 'Meet it head-on.', tag: 'COMBAT', go: () => {
          Engine.startCombat({
            enemyId: 'quarry_brute',
            onVictory: () => {
              Game.hero.questNode = 'before_foreman';
              Game.save();
              Act1._quarryForemanIntro();
            },
            onDefeat: () => Act1.openTownHub()
          });
        } }
      ]
    });
  },

  _quarryForemanIntro() {
    Story.show({
      illustration: 'quarryInterior',
      speaker: '',
      text: '<p>The Brute falls in a clatter of detached cubes. Beyond it, a great door opens of its own accord — into a wider chamber lit by torches and a single banner stitched with the rune ∑.</p><p>A massive figure stands at the far end. Twice the height of a man, helmet horned, armour scrawled with the letters FORE. The <em>Quarry Foreman</em>.</p><p><em>"You will go no further until you have proved yourself in three trials of measurement,"</em> it growls. <em>"Approach, little ant."</em></p>',
      choices: [
        { text: 'Accept the trial.', tag: 'BOSS', go: () => {
          Engine.startCombat({
            enemyId: 'quarry_foreman',
            onVictory: () => {
              Game.hero.questNode = 'after_foreman';
              Game.save();
              Act1._quarryBranch();
            },
            onDefeat: () => Act1.openTownHub()
          });
        } },
        { text: 'Withdraw and prepare further.', go: () => Act1.openTownHub() }
      ]
    });
  },

  _quarryBranch() {
    Story.show({
      illustration: 'quarryInterior',
      speaker: '',
      text: '<p>The Foreman crumbles. From its chest you draw a small obsidian shard — and behind where it stood, the chamber splits into <em>two passages</em>.</p>' +
            '<p>The <em>left</em> passage descends in a steep stair into deeper darkness. The air there hums with a low, almost musical sound, like a single sustained note.</p>' +
            '<p>The <em>right</em> passage spirals up and out, toward a ledge that overlooks the quarry from above. From there you could see the whole pit — and perhaps find the source of the corruption from a height.</p>',
      choices: [
        { text: 'Descend the left passage. (Direct confrontation — extra loot, harder boss)', tag: 'DEEP', go: () => {
          Game.hero.questNode = 'branch_descend';
          Game.hero.flags.branch = 'descend';
          // bonus: extra gold and a free potion before the boss
          Game.hero.gold += 25;
          Inventory.add(Game.hero, 'greater_potion', 1);
          UI.toast('Found 25 gold and a Greater Healing Draught on the way down.');
          Game.save();
          Act1._hollowedIntro();
        } },
        { text: 'Climb the right passage. (Tactical approach — start the boss at lower HP)', tag: 'HIGH', go: () => {
          Game.hero.questNode = 'branch_surface';
          Game.hero.flags.branch = 'surface';
          Game.save();
          Act1._hollowedIntroB();
        } }
      ]
    });
  },

  _hollowedIntro() {
    Story.show({
      illustration: 'bossArena',
      speaker: '',
      text: '<p>The stair ends in a vast vaulted chamber. Four pillars rise like the corners of a colossal die. In the center, on a black altar, floats a cube the size of a wagon — and inside the cube, a single page of parchment, slowly turning end over end.</p>' +
            '<p>The cube has an eye. The eye opens. The cube speaks.</p>' +
            '<p style="color:#cc4878;font-style:italic;">"You should not have come. But since you are here — count me, little one. Count me to my end."</p>',
      choices: [
        { text: 'Face The Hollowed One.', tag: 'FINAL', go: () => Act1._fightHollowed(false) }
      ]
    });
  },

  _hollowedIntroB() {
    Story.show({
      illustration: 'bossArena',
      speaker: '',
      text: '<p>You climb the spiral and find yourself on a stone ledge above the quarry. The whole pit lies below you, and at its center — bound to the stone by humming purple chains — is a great cube. You can see how the chains are anchored. You can see the weak seams in the cube\'s shell. You see, in fact, exactly where to strike.</p>' +
            '<p>You drop down silently behind it. The cube\'s eye snaps open. It speaks.</p>' +
            '<p style="color:#cc4878;font-style:italic;">"Clever. <em>Clever.</em> But you still have to do the math."</p>',
      choices: [
        { text: 'Strike the surprised Hollowed One.', tag: 'FINAL', go: () => Act1._fightHollowed(true) }
      ]
    });
  },

  _fightHollowed(surprised) {
    Engine.startCombat({
      enemyId: 'hollowed_one',
      onVictory: () => Act1._finishAct1(),
      onDefeat: () => Act1.openTownHub()
    });
    // surprise tactic: pre-damage the boss
    if (surprised && Game.combat) {
      const C = Game.combat;
      const sneakDmg = Math.floor(C.enemy.maxHp * 0.2);
      C.enemy.hp -= sneakDmg;
      Engine._renderBars();
      Engine._addLog('you', 'Your surprise strike deals ' + sneakDmg + ' damage before the battle proper!');
    }
  },

  _finishAct1() {
    Game.hero.questNode = 'act1_complete';
    Game.hero.flags.actsDone = (Game.hero.flags.actsDone || 0) + 1;
    // Final loot beyond combat reward — codex page
    if (!Inventory.has(Game.hero, 'apprentices_grimoire')) Inventory.add(Game.hero, 'apprentices_grimoire', 1);
    Game.save();
    // Show act-complete screen
    document.getElementById('act-stamp').textContent = 'ACT I COMPLETE';
    document.getElementById('act-complete-illustration').innerHTML = Art.endingVista();
    document.getElementById('act-complete-title').textContent = 'The Page Returns';
    document.getElementById('act-complete-text').innerHTML =
      '<p>The cube cracks. The eye gutters and dies. The page falls — slowly, weightlessly — into your outstretched palm.</p>' +
      '<p>You climb out of the Quarry into a sunrise that wasn\'t there an hour ago. Numeria sits below you, smoke rising from Dorrick\'s forge, sparrows wheeling above the tower. The page in your hand is warm.</p>' +
      '<p><em>"There will be six in all,"</em> Lysara said.</p>' +
      '<p>One down. Five to go.</p>';
    const rewards = document.getElementById('act-complete-rewards');
    rewards.innerHTML =
      '<div class="reward-line">⚜ The first page of the Numerian Codex (the volume page)</div>' +
      '<div class="reward-line">⚜ Title earned: <em>Quarry-Breaker</em></div>' +
      '<div class="reward-line">⚜ Act II will open the next time you visit Lysara\'s Tower</div>';
    Game.hero.titles = Game.hero.titles || [];
    if (!Game.hero.titles.includes('Quarry-Breaker')) Game.hero.titles.push('Quarry-Breaker');
    Game.save();
    showScreen('act-complete');
  }

};

if (typeof window !== 'undefined') {
  window.Cutscene = Cutscene;
  window.Act1 = Act1;
}
