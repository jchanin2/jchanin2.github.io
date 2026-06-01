// ======================================================
// act6.js — Act VI: "The Sky-Bridge" (the final act)
// Unit 7: coordinate grid, shapes, rules, expressions
// Interactive grid combat; the all-units final boss; epilogue.
// ======================================================

const Act6 = {

  beginOpening() {
    const hero = Game.hero;
    Game.hero.currentAct = 6;
    Cutscene.play([
      {
        illustrationId: 'lysaraStudy',
        speaker: 'Lysara',
        text: '<p>Lysara lays the five recovered pages in a row. They no longer merely hum — they <em>sing</em>, a pure chord that makes the candle-flames stand straight. "One page left," she says, and for the first time you hear fear in her voice. "And the last reading points <em>up</em>. To the <em>Sky-Bridge</em> — the lattice of star-iron the first scholars laid across the heavens, marked out like a vast coordinate grid. The sixth page is at its summit."</p>' +
              '<p>"And ' + hero.name + ' — I believe whatever has been tearing pages from the Codex will be waiting there. In person. When the book is nearly whole, it will come to finish what it started: to <em>un-write</em> it."</p>'
      },
      {
        illustrationId: 'skyOutpost',
        speaker: 'Mira',
        text: '<p>The climb takes three days — up switchback stairs, then a cage-lift, then a long walk along a spar of star-iron into thinning air. At the last outpost before the bridge, an old astronomer waits with hot tea and grim eyes.</p>' +
              '<p>Mira looks out at the glowing grid stretching up into the dark. "Coordinates," she murmurs. "Plot the point. Find the distance. Name the shape. I taught you all of it on the boat, remember?" She grips your shoulder. "Whatever\'s up there — you finish this, and I\'ll be right behind you. All of us will."</p>'
      },
      {
        illustrationId: 'skyBridge',
        speaker: '',
        text: '<p>You step onto the Sky-Bridge. It is exactly a coordinate grid made real — glowing rungs and rails of star-iron, every intersection a point of light, stretching up and away to a distant gate. Below, through the lattice, the whole realm turns: Numeria, the Quarry, the sea, the foundries, the vaults, Concord, all small and bright.</p>' +
              '<p>Far above, at the vanishing point, something waits where the page should be. Something shaped like a scholar, and like a hole in the world.</p>'
      }
    ], () => {
      Game.hero.questNode = 'sky_first';
      Game.save();
      Act6.openSkyOutpost();
    });
  },

  openSkyOutpost() {
    Game.hero.currentAct = 6;
    Game.refreshHubChrome();
    document.getElementById('hub-illustration').innerHTML = Art.skyOutpost();
    const list = document.getElementById('hub-locations');
    list.innerHTML = '';
    this._locations().forEach(loc => {
      const btn = document.createElement('button');
      btn.className = 'hub-location-btn';
      btn.innerHTML = '<span class="hub-location-name">' + loc.name + '</span>' +
                      '<span class="hub-location-desc">' + loc.desc + '</span>' +
                      (loc.badge ? '<span class="hub-location-badge">' + loc.badge + '</span>' : '');
      btn.disabled = !!loc.disabled;
      btn.addEventListener('click', loc.action);
      list.appendChild(btn);
    });
    document.getElementById('hub-quest-text').textContent = this._questText();
    showScreen('hub');
    Game.save();
  },

  _questText() {
    const node = Game.hero.questNode;
    if (node === 'sky_first') return 'Equip for the end at the Sky-Outpost, then climb the Sky-Bridge.';
    if (node === 'sky_summit') return 'The summit is open. Face the Nullity and make the Codex whole.';
    return 'Climb the Sky-Bridge toward the summit.';
  },

  _locations() {
    const node = Game.hero.questNode;
    const locs = [];
    locs.push({
      name: 'Sky-Outpost Store',
      desc: 'Astronomer Vega\'s wares. Ambrosia, star-iron arms, plotting tools.',
      action: () => Act6.enterOutpost()
    });
    locs.push({
      name: 'Lysara\'s Sending Stone',
      desc: 'Speak with Lysara below. She watches your weak spots.',
      action: () => Act6.sendingStone()
    });
    locs.push({
      name: 'The Star-Chart',
      desc: 'Vega\'s practice grid. Drill your weakest topic before the end.',
      action: () => Act1.enterTraining()
    });
    locs.push({
      name: 'The Sky-Bridge',
      desc: 'The glowing grid up to the summit — and the Nullity.',
      badge: node === 'sky_first' ? 'QUEST' : null,
      action: () => Act6.climbBridge()
    });
    locs.push({
      name: 'Character Sheet',
      desc: 'Inspect your stats, equipment, inventory, and mastery.',
      action: () => Game.openCharacterSheet()
    });
    return locs;
  },

  enterOutpost() {
    Story.show({
      illustration: 'skyOutpost',
      speaker: 'Astronomer Vega',
      text: '<p>Astronomer Vega pours you tea without asking, her star-circlet catching the light of a hundred constellations. "I have charted this bridge for sixty years, and I have never seen the dark at its summit move the way it moves now." She slides a tray of star-iron gear toward you. "Whatever you mean to do up there — do it well-equipped. The Nullity does not bargain. It only erases."</p>',
      choices: [
        { text: 'Browse the store.', go: () => Shop.open('sky_outpost', () => Act6.enterOutpost()) },
        { text: 'Ask Vega about the Nullity.', go: () => Act6._vegaLore() },
        { text: 'Leave.', go: () => Act6.openSkyOutpost() }
      ]
    });
  },

  _vegaLore() {
    Story.show({
      illustration: 'skyOutpost',
      speaker: 'Astronomer Vega',
      text: '<p>"The Nullity was the <em>First Scholar</em> — the one who wrote the Numerian Codex, long ago. They loved the infinite: the boundless, the undefined, the beautiful unmeasured dark. And then their own book began to pin the world down — this many, that long, exactly so — and they came to hate it for that." She stares into her tea. "Now they want to un-write every number. Return the world to a perfect, silent zero."</p>' +
            '<p>"You cannot reason with that. But you <em>can</em> out-reckon it. It will throw every kind of math at you — every unit you have learned. Volume. Fractions. Great numbers. Decimals. Measures. And at the last, the grid itself. Be ready for all of it, ' + Game.hero.name + '."</p>',
      choices: [
        { text: 'Browse the store.', go: () => Shop.open('sky_outpost', () => Act6.enterOutpost()) },
        { text: 'Leave.', go: () => Act6.openSkyOutpost() }
      ]
    });
  },

  sendingStone() {
    const top = Engine.weakestTopics(Game.hero, 3)[0];
    let line;
    if (top) {
      const t = (TOPICS[top.topic] || {name: top.topic}).name;
      line = '<p>"Before the end — your shakiest skill is <em>' + t + '</em>, about ' + Math.round(top.pct) + '%. Drill it at the Star-Chart. Leave nothing to chance up there."</p>';
    } else {
      line = '<p>"You are as ready as practice can make you. The rest is courage."</p>';
    }
    Story.show({
      illustration: 'lysaraStudy',
      speaker: 'Lysara (through the stone)',
      text: '<p>The stone is barely warm now, so high and far from her tower — but her voice reaches you.</p>' + line +
            '<p>"Listen to me, ' + Game.hero.name + '. The Nullity believes numbers are a cage. They are wrong. Numbers are how we <em>share</em> the world — how a baker and a builder and a child far away can all mean the same thing. When you stand before it, do not just defeat it. <em>Show</em> it. Now go and make the Codex whole."</p>',
      choices: [ { text: 'Pocket the stone.', go: () => Act6.openSkyOutpost() } ]
    });
  },

  // ---------- The Sky-Bridge ascent ----------
  climbBridge() {
    const node = Game.hero.questNode;
    if (node === 'sky_summit') return Act6._summitApproach();
    if (node === 'sky_mid') return Act6._bridgeMid();
    return Act6._bridgeLow();
  },

  _bridgeLow() {
    Story.show({
      illustration: 'skyBridge',
      speaker: '',
      text: '<p>You climb out along the glowing lattice. Each footfall lands on an intersection of star-iron — a plotted point in the dark. A shimmering <em>Grid-Wisp</em> uncoils from the rails ahead, a lattice-spirit testing whether you know where you stand.</p>',
      choices: [
        { text: 'Plot your strike.', tag: 'COMBAT', go: () => Engine.startCombat({
          enemyId: 'grid_wisp',
          onVictory: () => { Game.save(); Act6._bridgeLowB(); },
          onDefeat: () => Act6.openSkyOutpost()
        }) }
      ]
    });
  },

  _bridgeLowB() {
    Story.show({
      illustration: 'skyBridge',
      speaker: '',
      text: '<p>Higher now. The realm is a glowing map far below. A <em>Glyph-Moth</em> flutters down on wings cut into perfect quadrilaterals, scattering shape-glyphs across the rungs.</p>',
      choices: [
        { text: 'Name it to fell it.', tag: 'COMBAT', go: () => Engine.startCombat({
          enemyId: 'glyph_moth',
          onVictory: () => { Game.hero.questNode = 'sky_mid'; Game.save(); Act6._bridgeMid(); },
          onDefeat: () => Act6.openSkyOutpost()
        }) },
        { text: 'Descend to the outpost to prepare.', go: () => Act6.openSkyOutpost() }
      ]
    });
  },

  _bridgeMid() {
    Story.show({
      illustration: 'skyBridge',
      speaker: '',
      text: '<p>The bridge narrows to a single shining beam. A <em>Star-Sentinel</em> — a guardian shaped like a great star — blocks the way, measuring the exact distance between you and it, and finding it too small.</p>',
      choices: [
        { text: 'Close the distance.', tag: 'COMBAT', go: () => Engine.startCombat({
          enemyId: 'star_sentinel',
          onVictory: () => { Game.save(); Act6._wardenIntro(); },
          onDefeat: () => Act6.openSkyOutpost()
        }) }
      ]
    });
  },

  _wardenIntro() {
    Story.show({
      illustration: 'skyBridge',
      speaker: '',
      text: '<p>Where the bridge widens into a final landing before the summit stands the <em>Axis-Warden</em> — a colossus built from a crossed x- and y-axis, a glowing grid for a torso, a single red plotted point for a heart. It is the last guardian before the gate.</p>' +
            '<p style="color:#88c4f0;font-style:italic;">"You will not pass the origin. Plot true, step true, obey the rule — or fall through the lattice into the dark below."</p>',
      choices: [
        { text: 'Take the Warden\'s trial.', tag: 'BOSS', go: () => Engine.startCombat({
          enemyId: 'axis_warden',
          onVictory: () => { Game.hero.questNode = 'sky_summit'; Game.save(); Act6._afterWarden(); },
          onDefeat: () => Act6.openSkyOutpost()
        }) }
      ]
    });
  },

  _afterWarden() {
    if (!Inventory.has(Game.hero, 'plotters_compass')) Inventory.add(Game.hero, 'plotters_compass', 1);
    Story.show({
      illustration: 'skyBridge',
      speaker: 'Mira',
      text: '<p>The Axis-Warden\'s grid-heart winks out, and its great frame folds away into points of light. From the wreck you take a <em>Plotter\'s Compass</em>. Ahead, a gate of pure light marks the summit — and through it, you can see the sixth page turning slowly above a lone figure.</p>' +
            '<p>"That\'s it," Mira breathes. "Top of the world. Whatever that thing is up there — we end it, and the Codex is whole." She steps back. "Go. I\'m right here."</p>',
      choices: [
        { text: 'Step through the gate.', tag: 'FINAL', go: () => Act6._summitApproach() },
        { text: 'Descend one last time to prepare.', go: () => Act6.openSkyOutpost() }
      ]
    });
  },

  _summitApproach() {
    Story.show({
      illustration: 'nullityVoid',
      speaker: '',
      text: '<p>The summit is a single coordinate grid of light floating in absolute dark. The five pages you carry tear free of your pack and rise to join the sixth, and all six begin to orbit a hooded figure — a robe wrapped around a wound in the world, a quill of cold light in one shadow-hand, busily un-writing the stars one by one.</p>' +
            '<p style="color:#a8c4f0;font-style:italic;">"You brought me the last pages. How kind. I am the <em>First Scholar</em> — I wrote this book, and I have spent an age regretting it. Numbers are a cage, child. I will open it. I will return everything to the beautiful, boundless <em>nothing</em>... starting with you."</p>',
      choices: [
        { text: '"Numbers aren\'t a cage. They\'re how we share the world." Strike.', tag: 'FINAL', go: () => Act6._fightNullity() }
      ]
    });
  },

  _fightNullity() {
    Engine.startCombat({
      enemyId: 'the_nullity',
      onVictory: () => Act6._epilogue(),
      onDefeat: () => Act6.openSkyOutpost()
    });
  },

  _epilogue() {
    Game.hero.questNode = 'game_complete';
    Game.hero.flags.gameComplete = true;
    Game.hero.titles = Game.hero.titles || [];
    if (!Game.hero.titles.includes('Codex-Whole')) Game.hero.titles.push('Codex-Whole');
    // award the completed Codex
    if (!Inventory.has(Game.hero, 'codex_complete')) Inventory.add(Game.hero, 'codex_complete', 1);
    UI.toast('The Numerian Codex is whole.');
    Game.save();

    const hero = Game.hero;
    const cls = (CLASSES[hero.classId] || { name: '' }).name;
    const her = (HERITAGES[hero.heritageId] || { name: '' }).name;
    const titles = (hero.titles || []).join(' · ');

    document.getElementById('epilogue-illustration').innerHTML = Art.finaleVista();
    document.getElementById('epilogue-title').textContent = 'A Realm Made Whole';
    document.getElementById('epilogue-text').innerHTML =
      '<p>The Nullity\'s quill stills. For a long moment the First Scholar looks at the six pages orbiting overhead — at the volume of a stone, the halves of a loaf, the great numbers of an army, the tenths of a coin, the measures of a market, the points of a grid — all the small, shared, human ways the world had learned to mean the same thing to everyone at once.</p>' +
      '<p>"...Oh," it says softly. "I had forgotten. It was never a cage. It was a <em>language</em>." And the hooded dark unravels, not into nothing, but into a quiet drift of starlight that settles gently over the realm below.</p>' +
      '<p>The six pages fold themselves into your hands as a single, whole book. Far below, through the lattice, you can see it all at once: Numeria with its rebuilt tower, the quiet Quarry, the fishing boats of the Isles, the cooled Foundry, the balanced Vaults, the agreeing city of Concord — every land you set right, bright in the dawn.</p>' +
      '<p>Lysara is waiting at the foot of the bridge. So is Mira. So, it turns out, is half the realm.</p>' +
      '<p><em>' + hero.name + ' the ' + her + ' ' + cls + ' — Codex-Whole — had made every number in the world agree. For now, that was enough.</em></p>' +
      '<p style="color:#a890c0;font-style:italic;">— The End —</p>';
    document.getElementById('epilogue-rewards').innerHTML =
      '<div class="reward-line">⚜ The Numerian Codex — made whole</div>' +
      '<div class="reward-line">⚜ Final title: <em>Codex-Whole</em></div>' +
      '<div class="reward-line">⚜ Titles earned: ' + titles + '</div>' +
      '<div class="reward-line">⚜ The Starlance &amp; Champion of the Realms are yours</div>' +
      '<div class="reward-line">⚜ Your hero is saved — load this slot any time to keep exploring</div>';
    showScreen('epilogue');
  }
};

if (typeof window !== 'undefined') window.Act6 = Act6;
