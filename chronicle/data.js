// ======================================================
// data.js — Static data for Realms of Mathematica II
// Classes, heritages, feats, items, abilities, topics
// ======================================================

// ------------------------------------------------------
// STATS
// ------------------------------------------------------
const STAT_DEFS = [
  { id: 'precision', name: 'Precision', blurb: 'Damage when your answer is right', icon: '⚔', base: 8, max: 16 },
  { id: 'insight',   name: 'Insight',   blurb: 'Free hints per battle',           icon: '✦', base: 1, max: 5  },
  { id: 'speed',     name: 'Speed',     blurb: 'Extra seconds on the timer',      icon: '⌁', base: 8, max: 16 },
  { id: 'stamina',   name: 'Stamina',   blurb: 'Max HP (Stamina × 5 + 40)',       icon: '❤', base: 8, max: 16 },
  { id: 'wisdom',    name: 'Wisdom',    blurb: 'Max spell slots (Wisdom ÷ 3)',    icon: '✧', base: 8, max: 16 },
  { id: 'luck',      name: 'Luck',      blurb: 'Critical-hit chance (Luck × 2%)', icon: '☘', base: 8, max: 16 }
];

const STAT_DEFAULT = { precision: 8, insight: 1, speed: 8, stamina: 8, wisdom: 8, luck: 8 };
const STAT_POINTS_AT_CREATION = 5;
const STAT_POINTS_PER_LEVEL = 2;

function maxHpFor(stats)    { return 40 + (stats.stamina || 0) * 5; }
function maxMpFor(stats)    { return Math.floor((stats.wisdom || 0) / 3); }
function critPctFor(stats)  { return Math.min(50, (stats.luck || 0) * 2); }
function baseDmgFor(stats)  { return 4 + Math.floor((stats.precision || 0) * 1.2); }
function timerSecFor(stats) { return 12 + Math.floor((stats.speed || 0) * 0.6); }
function hintsFor(stats)    { return stats.insight || 0; }

// ------------------------------------------------------
// CLASSES — each grants starting equipment + a signature ability
// ------------------------------------------------------
const CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    flavor: 'Steel and shield. Built to absorb punishment.',
    statBonus: { stamina: 2, precision: 1 },
    startWeapon: 'iron_longsword',
    startArmor: 'leather_hauberk',
    abilities: ['cleave'],
    iconColor: '#8a3e22',
    portraitTraits: { hairColor: '#3a2820', skinTone: '#d9b48b', weaponColor: '#b8c0c8' }
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    flavor: 'Mind sharper than any blade. Speaks the language of numbers.',
    statBonus: { wisdom: 2, insight: 1 },
    startWeapon: 'oak_staff',
    startArmor: 'scholars_robe',
    abilities: ['arcane_burst', 'sight'],
    iconColor: '#3a3e8a',
    portraitTraits: { hairColor: '#5a3a78', skinTone: '#e8d5b5', weaponColor: '#7a5a28' }
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    flavor: 'Lightning hands, light feet. Strikes where it counts.',
    statBonus: { speed: 2, luck: 1 },
    startWeapon: 'pair_of_daggers',
    startArmor: 'shadowed_jerkin',
    abilities: ['quick_step'],
    iconColor: '#2a3a2a',
    portraitTraits: { hairColor: '#2a1a10', skinTone: '#c8a878', weaponColor: '#888888' }
  },
  ranger: {
    id: 'ranger',
    name: 'Ranger',
    flavor: 'Calm, watchful, deadly at distance. Reads the land like a map.',
    statBonus: { precision: 1, speed: 1, luck: 1 },
    startWeapon: 'yew_shortbow',
    startArmor: 'ranger_cloak',
    abilities: ['true_shot'],
    iconColor: '#3a5a2a',
    portraitTraits: { hairColor: '#4a3010', skinTone: '#d0a878', weaponColor: '#6a4818' }
  }
};

// ------------------------------------------------------
// HERITAGES
// ------------------------------------------------------
const HERITAGES = {
  human: {
    id: 'human',
    name: 'Human',
    flavor: 'Adaptable, ambitious, plentiful in Numeria and beyond.',
    statBonus: { precision: 1 },
    feat: 'Versatile (+1 stat point at creation)',
    extraPoints: 1,
    skinTone: '#d9b48b'
  },
  elf: {
    id: 'elf',
    name: 'Elf',
    flavor: 'Long-lived, keen-eyed, raised on poetry and patient calculation.',
    statBonus: { insight: 1 },
    feat: 'Trained Eye (+1 second to every timer)',
    extraTimer: 1,
    skinTone: '#e8d5b5'
  },
  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    flavor: 'Mountain-born, stubborn, masters of stone and weight.',
    statBonus: { stamina: 1 },
    feat: 'Stout (resist the first critical hit per battle)',
    resistFirstCrit: true,
    skinTone: '#c8a878'
  },
  halfling: {
    id: 'halfling',
    name: 'Halfling',
    flavor: 'Small in stature, large in luck. Likes second breakfast.',
    statBonus: { luck: 1 },
    feat: 'Lucky Penny (+10% gold from every source)',
    goldBonus: 0.10,
    skinTone: '#e0c4a0'
  },
  tabaxi: {
    id: 'tabaxi',
    name: 'Tabaxi',
    flavor: 'Cat-folk: quick of paw, quicker of curiosity. Always land on their feet.',
    statBonus: { speed: 1 },
    feat: 'Nine Lives (once per battle, survive a fatal blow at 1 HP)',
    surviveLethal: true,
    isFelid: true,
    defaultFur: 'tabby',
    skinTone: '#d98a3a' // fallback if no fur chosen
  }
};

// ------------------------------------------------------
// TABAXI FUR COLORS — chosen during creation
// base = main coat, marking = stripes/patches, muzzle = lighter chin/cheeks,
// eye = iris color
// ------------------------------------------------------
const FUR_COLORS = {
  tabby: { id: 'tabby', name: 'Orange Tabby', base: '#d98a3a', marking: '#a85a1a', muzzle: '#f0d4a4', eye: '#7aa84a', striped: true },
  black: { id: 'black', name: 'Black',        base: '#3a3038', marking: '#1a1820', muzzle: '#5a5058', eye: '#f0c040', striped: false },
  snow:  { id: 'snow',  name: 'Snow',         base: '#ece6d8', marking: '#cfc6b2', muzzle: '#ffffff', eye: '#6ab0d8', striped: false },
  gray:  { id: 'gray',  name: 'Gray',         base: '#8a8a94', marking: '#5a5a64', muzzle: '#b6b6c0', eye: '#d8a040', striped: true },
  calico:{ id: 'calico',name: 'Calico',       base: '#f0e0c4', marking: '#d98a3a', patch: '#3a3038', muzzle: '#ffffff', eye: '#7aa84a', striped: false, patched: true }
};

// ------------------------------------------------------
// FEATS (chosen at creation, in addition to heritage feat)
// ------------------------------------------------------
const FEATS = {
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    desc: '+5% critical-hit chance.',
    effect: { critPct: 5 }
  },
  tough: {
    id: 'tough',
    name: 'Tough',
    desc: '+10 maximum HP.',
    effect: { bonusHp: 10 }
  },
  sharp_minded: {
    id: 'sharp_minded',
    name: 'Sharp-Minded',
    desc: '+1 Insight (extra hint per battle).',
    effect: { bonusInsight: 1 }
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    desc: '+2 seconds to every problem timer.',
    effect: { bonusTimer: 2 }
  }
};

// ------------------------------------------------------
// ABILITIES (class spells / signature moves)
// MP cost in spell slots; effect resolved by engine
// ------------------------------------------------------
const ABILITIES = {
  cleave: {
    id: 'cleave',
    name: 'Cleave',
    type: 'attack',
    cost: 0,
    cooldown: 3,
    desc: 'Strike twice in one turn. Damage is half on each hit but two chances to crit.',
    effect: { doubleStrike: true, halfDamage: true }
  },
  arcane_burst: {
    id: 'arcane_burst',
    name: 'Arcane Burst',
    type: 'spell',
    cost: 1,
    desc: 'A flare of pure number-energy. Hits even on a wrong answer (half damage).',
    effect: { magicDamage: 14, partialOnFail: true }
  },
  sight: {
    id: 'sight',
    name: 'Sight',
    type: 'spell',
    cost: 1,
    desc: 'See the next answer before you act. Reveals the answer for one problem.',
    effect: { reveal: true }
  },
  quick_step: {
    id: 'quick_step',
    name: 'Quick Step',
    type: 'attack',
    cost: 0,
    cooldown: 4,
    desc: 'Vanish and reposition. Guaranteed dodge of the next enemy attack.',
    effect: { dodgeNext: true }
  },
  true_shot: {
    id: 'true_shot',
    name: 'True Shot',
    type: 'attack',
    cost: 0,
    cooldown: 3,
    desc: 'A patient, perfect arrow. Guaranteed critical on a correct answer.',
    effect: { guaranteedCrit: true }
  }
};

// ------------------------------------------------------
// EQUIPMENT — weapons / armor / accessories
// slot: weapon | armor | accessory
// effect: stat bonuses & modifiers
// ------------------------------------------------------
const ITEMS = {
  // ---------- starter weapons ----------
  iron_longsword:   { id: 'iron_longsword',   name: 'Iron Longsword',   slot: 'weapon', desc: 'Honest steel, well balanced.',         effect: { precision: 2 } },
  oak_staff:        { id: 'oak_staff',        name: 'Oak Staff',        slot: 'weapon', desc: 'Carved with simple sigils.',            effect: { wisdom: 1, insight: 1 } },
  pair_of_daggers:  { id: 'pair_of_daggers',  name: 'Pair of Daggers',  slot: 'weapon', desc: 'Quick to draw, quicker still to strike.',effect: { speed: 2, luck: 1 } },
  yew_shortbow:     { id: 'yew_shortbow',     name: 'Yew Shortbow',     slot: 'weapon', desc: 'Springy yew, waxed string.',             effect: { precision: 1, luck: 1 } },

  // ---------- starter armor ----------
  leather_hauberk:  { id: 'leather_hauberk',  name: 'Leather Hauberk',  slot: 'armor', desc: 'Boiled leather, riveted.',           effect: { stamina: 2 } },
  scholars_robe:    { id: 'scholars_robe',    name: 'Scholar\'s Robe',  slot: 'armor', desc: 'Deep blue, hemmed with silver runes.', effect: { wisdom: 1, insight: 1 } },
  shadowed_jerkin:  { id: 'shadowed_jerkin',  name: 'Shadowed Jerkin',  slot: 'armor', desc: 'Soundless leather, dyed forest-black.', effect: { speed: 1, luck: 1 } },
  ranger_cloak:     { id: 'ranger_cloak',     name: 'Ranger\'s Cloak',  slot: 'armor', desc: 'Camouflaged in greens and greys.',     effect: { stamina: 1, speed: 1 } },

  // ---------- act I shop ----------
  measuring_chain:  { id: 'measuring_chain',  name: 'Measuring Chain',  slot: 'accessory', desc: 'A brass chain marked in inches — measure twice, strike once.', effect: { precision: 1, insight: 1 } },
  cubits_amulet:    { id: 'cubits_amulet',    name: 'Cubit\'s Amulet',  slot: 'accessory', desc: 'Glyphs of length and breadth. Grants insight in confined spaces.', effect: { wisdom: 1, stamina: 1 } },
  quarrymans_belt:  { id: 'quarrymans_belt',  name: 'Quarryman\'s Belt',slot: 'accessory', desc: 'Stout leather, loops for chisels. +10 HP.', effect: { bonusHp: 10 } },
  hourglass_charm:  { id: 'hourglass_charm',  name: 'Hourglass Charm',  slot: 'accessory', desc: 'A sliver of red sand drifts upward in defiance. +3s timer.', effect: { bonusTimer: 3 } },

  // ---------- act I loot drops ----------
  hollowed_blade:   { id: 'hollowed_blade',   name: 'Hollowed Blade',   slot: 'weapon', desc: 'Carved with cubic glyphs. Devours volume-warped foes.', effect: { precision: 3, bonusVsTopic: { volume_rect_prism: 4 } } },
  apprentices_grimoire: { id: 'apprentices_grimoire', name: 'Apprentice\'s Grimoire', slot: 'accessory', desc: 'Lysara\'s old field-book. +1 spell slot.', effect: { wisdom: 3 } },
  ironwood_circlet: { id: 'ironwood_circlet', name: 'Ironwood Circlet', slot: 'accessory', desc: 'Cool against the brow. +1 Insight.', effect: { insight: 1 } },
  golems_core:      { id: 'golems_core',      name: 'Golem\'s Core',    slot: 'accessory', desc: 'A pulsing cube of crystal pulled from a fallen golem. +5 HP, +1 Precision.', effect: { stamina: 1, precision: 1 } },

  // ---------- act II shop (port + net-mender) ----------
  brass_sextant:    { id: 'brass_sextant',    name: 'Brass Sextant',    slot: 'accessory', desc: 'Mira\'s spare. Lets you measure the angles between answers.', effect: { precision: 2, insight: 1 } },
  pearled_circlet:  { id: 'pearled_circlet',  name: 'Pearled Circlet',  slot: 'accessory', desc: 'Three small pearls set in driftwood. Calms the racing heart.', effect: { wisdom: 2, stamina: 1 } },
  kelp_charm:       { id: 'kelp_charm',       name: 'Knot of Kelp',     slot: 'accessory', desc: 'Knotted in fractions: 1/2, 1/4, 1/8. Each knot is a small luck.', effect: { luck: 2, speed: 1 } },
  saltskin_jerkin:  { id: 'saltskin_jerkin',  name: 'Saltskin Jerkin',  slot: 'armor', desc: 'Cured in brine. Resists strike and stain alike.', effect: { stamina: 3, speed: 1 } },
  netcaster_cloak:  { id: 'netcaster_cloak',  name: 'Netcaster\'s Cloak', slot: 'armor', desc: 'Threaded with fisher-knots. +5 HP, +1 Insight.', effect: { stamina: 1, insight: 1, bonusHp: 5 } },

  // ---------- act II loot drops ----------
  tide_blade:       { id: 'tide_blade',       name: 'Tide-Blade',       slot: 'weapon', desc: 'Curved, blue-edged, whispers like surf. Bites fraction-warped foes.', effect: { precision: 3, bonusVsTopic: { fraction_times_fraction: 4, fraction_times_whole: 3 } } },
  coral_staff:      { id: 'coral_staff',      name: 'Coral Staff',      slot: 'weapon', desc: 'Pale pink coral, still cool from the sea.', effect: { wisdom: 2, insight: 1, bonusVsTopic: { divide_whole_by_unit_fraction: 4 } } },
  half_kings_horn:  { id: 'half_kings_horn',  name: 'The Half-King\'s Horn', slot: 'accessory', desc: 'A spiral of bone. Calls a wave when blown. +2 to every stat (lightly).', effect: { precision: 2, stamina: 2, wisdom: 1, luck: 1, bonusHp: 10 } },
  sextant_of_wholeness: { id: 'sextant_of_wholeness', name: 'Sextant of Wholeness', slot: 'accessory', desc: 'Reforged from three island-pieces. The needle always finds the whole.', effect: { precision: 2, insight: 2, bonusTimer: 2 } },
  navigators_locket: { id: 'navigators_locket', name: 'Navigator\'s Locket', slot: 'accessory', desc: 'A small portrait of someone far away. A reminder.', effect: { wisdom: 1, stamina: 2, luck: 1 } },

  // ---------- act III shop (quartermaster + artificer) ----------
  forge_hammer:     { id: 'forge_hammer',     name: 'Forge-Hammer',     slot: 'weapon', desc: 'A smith\'s maul reforged for war. Heavy, certain.', effect: { precision: 3, stamina: 1 } },
  repeater_sling:   { id: 'repeater_sling',   name: 'Repeater Sling',   slot: 'weapon', desc: 'Clockwork sling that loads itself. Quick and lucky.', effect: { speed: 2, luck: 2 } },
  plated_brigandine:{ id: 'plated_brigandine',name: 'Plated Brigandine',slot: 'armor', desc: 'Iron plates riveted into leather. Soaks blows.', effect: { stamina: 4 } },
  artificer_vest:   { id: 'artificer_vest',   name: 'Artificer\'s Vest', slot: 'armor', desc: 'Pockets of tools and chalk. +1 Insight, +1 Wisdom.', effect: { insight: 1, wisdom: 1, bonusHp: 5 } },
  abacus_ring:      { id: 'abacus_ring',      name: 'Abacus Ring',      slot: 'accessory', desc: 'Beads click as you reckon. Sharpens multiplication.', effect: { precision: 1, insight: 1, bonusVsTopic: { multidigit_multiply: 3, partial_products: 3 } } },
  ledger_seal:      { id: 'ledger_seal',      name: 'Quartermaster\'s Seal', slot: 'accessory', desc: 'A division stamp of the war-march. Cuts foes down to size.', effect: { precision: 1, bonusVsTopic: { multidigit_divide: 3, multidigit_divide_word: 3 } } },
  cinder_charm:     { id: 'cinder_charm',     name: 'Cinder Charm',     slot: 'accessory', desc: 'A warm ember that never dies. +12 HP.', effect: { bonusHp: 12 } },

  // ---------- act III loot drops ----------
  multipliers_edge: { id: 'multipliers_edge', name: 'The Multiplier\'s Edge', slot: 'weapon', desc: 'Pried from the Foundry-Mind. Each strike reckons in the thousands.', effect: { precision: 4, luck: 1, bonusVsTopic: { multidigit_multiply: 4, estimate_product: 3 } } },
  dividing_engine:  { id: 'dividing_engine',  name: 'The Dividing Engine', slot: 'accessory', desc: 'A brass core that splits any number cleanly. +2 Wisdom, +1 Insight.', effect: { wisdom: 2, insight: 1, bonusTimer: 2 } },
  warmarch_medal:   { id: 'warmarch_medal',   name: 'War-March Medal',   slot: 'accessory', desc: 'Awarded for the Foundry. +2 Precision, +10 HP.', effect: { precision: 2, bonusHp: 10 } },
  sabotage_kit:     { id: 'sabotage_kit',     name: 'Saboteur\'s Kit',   slot: 'accessory', desc: 'Lockpicks, fuses, chalk. +2 Speed, +1 Luck.', effect: { speed: 2, luck: 1 } },

  // ---------- act IV shop (vault-keeper + assayer) ----------
  coinblade:        { id: 'coinblade',        name: 'Coinblade',        slot: 'weapon', desc: 'A sword edged with shaved coin-rims. Sharp to the hundredth.', effect: { precision: 3, luck: 1 } },
  assayers_scale:   { id: 'assayers_scale',   name: 'Assayer\'s Scale', slot: 'weapon', desc: 'A balance-staff that weighs an enemy\'s worth — then takes it.', effect: { wisdom: 2, insight: 1 } },
  vault_mail:       { id: 'vault_mail',       name: 'Vault Mail',       slot: 'armor', desc: 'Chain woven from old strongbox links. Heavy, sure.', effect: { stamina: 4 } },
  archivists_coat:  { id: 'archivists_coat',  name: 'Archivist\'s Coat', slot: 'armor', desc: 'Deep pockets, ink-stained. +1 Insight, +1 Wisdom, +5 HP.', effect: { insight: 1, wisdom: 1, bonusHp: 5 } },
  assayers_loupe:   { id: 'assayers_loupe',   name: 'Assayer\'s Loupe',  slot: 'accessory', desc: 'A jeweler\'s lens. You see every digit\'s true place.', effect: { insight: 1, bonusVsTopic: { compare_decimals: 3, round_decimal: 3, decimal_place_value: 3 } } },
  decimal_abacus:   { id: 'decimal_abacus',   name: 'Decimal Abacus',   slot: 'accessory', desc: 'Beads sliding past a tiny painted point. Sharpens decimal sums.', effect: { precision: 1, bonusVsTopic: { decimals_add: 3, decimals_subtract: 3, decimals_multiply: 3 } } },
  lucky_decicoin:   { id: 'lucky_decicoin',   name: 'Lucky Deci-Coin',  slot: 'accessory', desc: 'A coin worth exactly 0.99. Almost whole. Almost. +2 Luck.', effect: { luck: 2, bonusTimer: 1 } },

  // ---------- act IV loot drops ----------
  tithe_breaker:    { id: 'tithe_breaker',    name: 'The Tithe-Breaker', slot: 'weapon', desc: 'Forged from the Hollow Coin. It gives back what was taken.', effect: { precision: 4, wisdom: 1, bonusVsTopic: { decimals_multiply: 4, divide_by_decimal: 4 } } },
  hollow_coin:      { id: 'hollow_coin',      name: 'The Hollow Coin',   slot: 'accessory', desc: 'A coin with nothing in the middle. Powerful, and a little cold. +3 Precision, +3 Luck.', effect: { precision: 3, luck: 3 } },
  keepers_ledger:   { id: 'keepers_ledger',   name: 'The Keeper\'s Ledger', slot: 'accessory', desc: 'Every coin ever counted, balanced to the thousandth. +2 Wisdom, +2 Insight.', effect: { wisdom: 2, insight: 2 } },
  deepvault_medal:  { id: 'deepvault_medal',  name: 'Deep-Vault Medal',  slot: 'accessory', desc: 'For those who went down and came back up. +2 Stamina, +10 HP.', effect: { stamina: 2, bonusHp: 10 } },

  // ---------- act V shop (market + guild outfitter) ----------
  balance_glaive:   { id: 'balance_glaive',   name: 'Balance-Glaive',   slot: 'weapon', desc: 'A polearm tipped with twin scale-pans. Cuts true once weighed.', effect: { precision: 3, wisdom: 1 } },
  tally_wand:       { id: 'tally_wand',       name: 'Tally-Wand',       slot: 'weapon', desc: 'A merchant\'s counting-rod that sparks with reckoning.', effect: { wisdom: 2, insight: 1 } },
  guild_tabard:     { id: 'guild_tabard',     name: 'Guild Tabard',     slot: 'armor', desc: 'Quartered in the colors of every guild. Respected, and padded.', effect: { stamina: 3, luck: 1 } },
  merchants_finery: { id: 'merchants_finery', name: 'Merchant\'s Finery', slot: 'armor', desc: 'Fine cloth, hidden mail. +1 Wisdom, +1 Luck, +6 HP.', effect: { wisdom: 1, luck: 1, bonusHp: 6 } },
  common_denom_ring:{ id: 'common_denom_ring',name: 'Common-Denominator Ring', slot: 'accessory', desc: 'Brings any two fractions to common ground. Sharpens fraction sums.', effect: { insight: 1, bonusVsTopic: { frac_add_unlike: 4, frac_subtract_unlike: 4, mixed_number_add_sub: 3 } } },
  power_loop:       { id: 'power_loop',       name: 'Loop of Powers',   slot: 'accessory', desc: 'Ten beads, then a hundred, then a thousand. Sharpens powers of 10.', effect: { precision: 1, bonusVsTopic: { powers_of_10: 4, metric_convert: 3 } } },
  traders_chain:    { id: 'traders_chain',    name: 'Trader\'s Chain',   slot: 'accessory', desc: 'Links of a dozen mints. +2 Luck and a little extra coin.', effect: { luck: 2, bonusTimer: 1 } },

  // ---------- act V loot drops ----------
  accord_blade:     { id: 'accord_blade',     name: 'The Accord-Blade',  slot: 'weapon', desc: 'Forged from the treaty-seals of every guild. Ends arguments.', effect: { precision: 4, wisdom: 1, bonusVsTopic: { convert_time: 3, metric_convert: 3 } } },
  babel_key:        { id: 'babel_key',        name: 'The Babel-Key',     slot: 'accessory', desc: 'A key that fits every lock and speaks every measure. +2 Wisdom, +2 Insight.', effect: { wisdom: 2, insight: 2 } },
  concord_medal:    { id: 'concord_medal',    name: 'Medal of Concord',  slot: 'accessory', desc: 'For the one who made the cities agree. +2 Precision, +12 HP.', effect: { precision: 2, bonusHp: 12 } },
  unity_charm:      { id: 'unity_charm',      name: 'Charm of Unity',    slot: 'accessory', desc: 'Three guild-tokens fused into one. +1 to several stats.', effect: { precision: 1, wisdom: 1, luck: 1, stamina: 1 } },

  // ---------- act VI shop (sky outpost) ----------
  starforged_blade: { id: 'starforged_blade', name: 'Star-Forged Blade', slot: 'weapon', desc: 'Quenched in the cold between stars. Hums on the grid-lines.', effect: { precision: 4, luck: 1 } },
  astrolabe_staff:  { id: 'astrolabe_staff',  name: 'Astrolabe Staff',  slot: 'weapon', desc: 'Plots the heavens and your foes alike.', effect: { wisdom: 3, insight: 1 } },
  skyweave_mail:    { id: 'skyweave_mail',    name: 'Skyweave Mail',    slot: 'armor', desc: 'Light as cloud, strong as star-iron.', effect: { stamina: 4, speed: 1 } },
  constellation_cloak:{ id: 'constellation_cloak', name: 'Constellation Cloak', slot: 'armor', desc: 'Sewn with real stars. +1 Insight, +1 Wisdom, +8 HP.', effect: { insight: 1, wisdom: 1, bonusHp: 8 } },
  plotters_compass: { id: 'plotters_compass', name: 'Plotter\'s Compass', slot: 'accessory', desc: 'Finds any point in an instant. Sharpens the coordinate grid.', effect: { precision: 1, insight: 1, bonusVsTopic: { coord_plot: 4, coord_word: 4, coord_distance: 3 } } },
  geometers_lens:   { id: 'geometers_lens',   name: 'Geometer\'s Lens',  slot: 'accessory', desc: 'Names every shape at a glance. Sharpens classification & rules.', effect: { insight: 1, bonusVsTopic: { classify_quad: 4, classify_triangle: 4, rule_two_variables: 3 } } },
  sky_charm:        { id: 'sky_charm',        name: 'Sky-Charm',        slot: 'accessory', desc: 'A shard of the Sky-Bridge itself. +14 HP, +1 Luck.', effect: { bonusHp: 14, luck: 1 } },

  // ---------- act VI loot drops ----------
  codex_complete:   { id: 'codex_complete',   name: 'The Numerian Codex (Whole)', slot: 'accessory', desc: 'All six pages, reunited. Every kind of math bends to your hand. +2 to every stat.', effect: { precision: 2, insight: 2, speed: 2, stamina: 2, wisdom: 2, luck: 2 } },
  starlance:        { id: 'starlance',        name: 'The Starlance',     slot: 'weapon', desc: 'A spear of pure coordinate light, won from the Nullity. Strikes true on any grid.', effect: { precision: 5, wisdom: 1, luck: 1, bonusVsTopic: { coord_plot: 4, coord_distance: 4 } } },
  champion_medal:   { id: 'champion_medal',   name: 'Champion of the Realms', slot: 'accessory', desc: 'For the hero who made the Codex whole. +3 Precision, +20 HP.', effect: { precision: 3, bonusHp: 20 } },

  // ---------- consumables ----------
  minor_potion:     { id: 'minor_potion',     name: 'Minor Healing Draught', slot: 'consumable', desc: 'Restores 15 HP.',              effect: { heal: 15 } },
  greater_potion:   { id: 'greater_potion',   name: 'Greater Healing Draught', slot: 'consumable', desc: 'Restores 35 HP.',            effect: { heal: 35 } },
  mana_phial:       { id: 'mana_phial',       name: 'Mana Phial',           slot: 'consumable', desc: 'Restores 2 spell slots.',       effect: { restoreMp: 2 } },
  scroll_of_sight:  { id: 'scroll_of_sight',  name: 'Scroll of Sight',      slot: 'consumable', desc: 'One-time use: reveals the answer to the next problem.', effect: { reveal: true } },
  scroll_of_clemency: { id: 'scroll_of_clemency', name: 'Scroll of Clemency', slot: 'consumable', desc: 'Skip the current problem, no damage to either side.', effect: { skip: true } },
  smoked_kipper:    { id: 'smoked_kipper',    name: 'Smoked Kipper', slot: 'consumable', desc: 'A salty snack from the docks. Restores 20 HP.', effect: { heal: 20 } },
  brine_phial:      { id: 'brine_phial',      name: 'Brine Phial', slot: 'consumable', desc: 'Stinging blue brew. Restores 3 spell slots.', effect: { restoreMp: 3 } },
  ration_tin:       { id: 'ration_tin',       name: 'Army Ration Tin', slot: 'consumable', desc: 'Dense, salty, filling. Restores 28 HP.', effect: { heal: 28 } },
  oil_flask:        { id: 'oil_flask',        name: 'Flask of Quenching Oil', slot: 'consumable', desc: 'Restores 40 HP — the good stuff.', effect: { heal: 40 } },
  candied_fig:      { id: 'candied_fig',      name: 'Candied Fig', slot: 'consumable', desc: 'A sweet from the Undermarket. Restores 22 HP.', effect: { heal: 22 } },
  lamp_oil_draught: { id: 'lamp_oil_draught', name: 'Lamp-Oil Draught', slot: 'consumable', desc: 'Bitter, bright. Restores 3 spell slots.', effect: { restoreMp: 3 } },
  spiced_wine:      { id: 'spiced_wine',      name: 'Cup of Spiced Wine', slot: 'consumable', desc: 'Warm and restorative (watered, for a hero). Restores 26 HP.', effect: { heal: 26 } },
  guild_tonic:      { id: 'guild_tonic',      name: 'Guild Tonic', slot: 'consumable', desc: 'A clarifying draught. Restores 4 spell slots.', effect: { restoreMp: 4 } },
  ambrosia:         { id: 'ambrosia',         name: 'Sky-Ambrosia', slot: 'consumable', desc: 'Sweet cloud-nectar. Restores 50 HP.', effect: { heal: 50 } },
  star_tonic:       { id: 'star_tonic',       name: 'Star-Tonic', slot: 'consumable', desc: 'Liquid starlight. Restores 5 spell slots.', effect: { restoreMp: 5 } }
};

// ------------------------------------------------------
// PROBLEM TOPICS — IDs aligned with the IM curriculum
// Used for both adaptive tracking and problem generators
// ------------------------------------------------------
const TOPICS = {
  // ---------- Unit 1: Volume ----------
  volume_rect_prism:    { unit: 1, name: 'Volume of rectangular prisms' },
  volume_unit_cubes:    { unit: 1, name: 'Volume with unit cubes' },
  volume_decomposed:    { unit: 1, name: 'Volume by decomposition' },
  volume_word:          { unit: 1, name: 'Volume word problems' },
  volume_expression:    { unit: 1, name: 'Volume expressions' },
  volume_side_length:   { unit: 1, name: 'Missing side length' },

  // ---------- Units 2 & 3: Fractions ----------
  fractions_multiply:           { unit: 2, name: 'Multiplying fractions' },
  fractions_divide:             { unit: 3, name: 'Dividing fractions' },
  fractions_as_division:        { unit: 2, name: 'Fractions as division' },
  fraction_times_whole:         { unit: 2, name: 'Fraction × whole' },
  fraction_times_fraction:      { unit: 3, name: 'Fraction × fraction' },
  mixed_number_multiply:        { unit: 2, name: 'Mixed number × whole' },
  area_fractional_sides:        { unit: 2, name: 'Area with fractional sides' },
  divide_unit_fraction_by_whole:{ unit: 3, name: 'Unit fraction ÷ whole' },
  divide_whole_by_unit_fraction:{ unit: 3, name: 'Whole ÷ unit fraction' },
  compare_products_scaling:     { unit: 3, name: 'Compare products (scaling)' },

  // ---------- Unit 4: Multi-digit ----------
  multidigit_multiply:       { unit: 4, name: 'Multi-digit multiplication' },
  multidigit_divide:         { unit: 4, name: 'Multi-digit division' },
  estimate_product:          { unit: 4, name: 'Estimating products' },
  estimate_quotient:         { unit: 4, name: 'Estimating quotients' },
  partial_products:          { unit: 4, name: 'Partial products' },
  multidigit_multiply_word:  { unit: 4, name: 'Multiplication word problems' },
  multidigit_divide_word:    { unit: 4, name: 'Division word problems' },
  unknown_factor:            { unit: 4, name: 'Missing factor' },

  // ---------- Unit 5: Decimals ----------
  decimals_add:              { unit: 5, name: 'Adding decimals' },
  decimals_subtract:         { unit: 5, name: 'Subtracting decimals' },
  decimals_multiply:         { unit: 5, name: 'Multiplying decimals' },
  decimals_multiply_whole:   { unit: 5, name: 'Decimal × whole number' },
  decimals_divide:           { unit: 5, name: 'Dividing decimals' },
  decimals_divide_whole:     { unit: 5, name: 'Decimal ÷ whole number' },
  divide_by_decimal:         { unit: 5, name: 'Dividing by a decimal' },
  round_decimal:             { unit: 5, name: 'Rounding decimals' },
  compare_decimals:          { unit: 5, name: 'Comparing decimals' },
  decimal_place_value:       { unit: 5, name: 'Decimal place value' },

  // ---------- Unit 6 ----------
  powers_of_10:         { unit: 6, name: 'Powers of 10' },
  frac_add_unlike:      { unit: 6, name: 'Adding unlike fractions' },
  frac_subtract_unlike: { unit: 6, name: 'Subtracting unlike fractions' },
  mixed_number_add_sub: { unit: 6, name: 'Adding & subtracting mixed numbers' },
  metric_convert:       { unit: 6, name: 'Metric conversions' },
  convert_time:         { unit: 6, name: 'Time conversions' },
  // ---------- Unit 7 ----------
  coords_q1:            { unit: 7, name: 'Coordinates (Q1)' },
  coord_plot:           { unit: 7, name: 'Plotting points' },
  coord_word:           { unit: 7, name: 'Coordinate moves' },
  coord_distance:       { unit: 7, name: 'Distance on the grid' },
  classify_quad:        { unit: 7, name: 'Classifying quadrilaterals' },
  classify_triangle:    { unit: 7, name: 'Classifying triangles' },
  rule_two_variables:   { unit: 7, name: 'Rules relating two variables' },
  expr_parentheses:     { unit: 7, name: 'Expressions with parentheses' }
};

// ------------------------------------------------------
// SHOPS — keyed lists of item IDs for each act-I vendor
// ------------------------------------------------------
const SHOPS = {
  brenna_tavern: {
    keeperId: 'brenna',
    keeperName: 'Brenna',
    keeperLine: '"Sit down, adventurer. The world\'s nasty out there, but my stew is hot and my prices are fair."',
    stock: [
      { itemId: 'minor_potion',    price: 12 },
      { itemId: 'greater_potion',  price: 30 },
      { itemId: 'scroll_of_sight', price: 22 },
      { itemId: 'scroll_of_clemency', price: 18 }
    ]
  },
  smith_dorrick: {
    keeperId: 'dorrick',
    keeperName: 'Dorrick the Blacksmith',
    keeperLine: '"You came to the right anvil. Steel that sings, leather that holds, charms that mean something."',
    stock: [
      { itemId: 'measuring_chain', price: 45 },
      { itemId: 'cubits_amulet',   price: 55 },
      { itemId: 'quarrymans_belt', price: 60 },
      { itemId: 'hourglass_charm', price: 70 }
    ]
  },
  goren_salt_worn: {
    keeperId: 'goren',
    keeperName: 'Goren Saltbeard',
    keeperLine: '"A sailor without supplies is a sailor lost. Take what you need, pay what\'s fair."',
    stock: [
      { itemId: 'smoked_kipper',   price: 14 },
      { itemId: 'greater_potion',  price: 32 },
      { itemId: 'brine_phial',     price: 38 },
      { itemId: 'scroll_of_sight', price: 22 }
    ]
  },
  netmender_shed: {
    keeperId: 'gull',
    keeperName: 'Aunt Gull',
    keeperLine: '"Mira\'s little one is back, I see. Bring me anything that needs mending — or buy. I keep what the sea returns."',
    stock: [
      { itemId: 'kelp_charm',      price: 50 },
      { itemId: 'pearled_circlet', price: 65 },
      { itemId: 'saltskin_jerkin', price: 80 },
      { itemId: 'netcaster_cloak', price: 95 },
      { itemId: 'brass_sextant',   price: 110 }
    ]
  },
  quartermaster_depot: {
    keeperId: 'serjeant_vol',
    keeperName: 'Serjeant Vol',
    keeperLine: '"Supplies are counted, soldier. Take what you can pay for and don\'t waste my powder."',
    stock: [
      { itemId: 'ration_tin',    price: 16 },
      { itemId: 'oil_flask',     price: 40 },
      { itemId: 'brine_phial',   price: 38 },
      { itemId: 'forge_hammer',  price: 95 },
      { itemId: 'plated_brigandine', price: 110 }
    ]
  },
  artificer_workshop: {
    keeperId: 'tinker_pell',
    keeperName: 'Tinker Pell',
    keeperLine: '"Numbers are just machines, friend. Wind them right and they do the work for you. Here — let me show you my wares."',
    stock: [
      { itemId: 'repeater_sling',  price: 100 },
      { itemId: 'artificer_vest',  price: 120 },
      { itemId: 'abacus_ring',     price: 130 },
      { itemId: 'ledger_seal',     price: 130 },
      { itemId: 'cinder_charm',    price: 85 }
    ]
  },
  keeper_stall: {
    keeperId: 'keeper_sable',
    keeperName: 'Keeper Sable',
    keeperLine: '"Down here we count to the thousandth, traveler. Everything has its exact worth. Tell me what you need — I\'ll quote you a fair price, to the penny."',
    stock: [
      { itemId: 'candied_fig',       price: 18 },
      { itemId: 'oil_flask',         price: 40 },
      { itemId: 'lamp_oil_draught',  price: 38 },
      { itemId: 'vault_mail',        price: 120 },
      { itemId: 'archivists_coat',   price: 135 }
    ]
  },
  assayer_office: {
    keeperId: 'assayer_fenn',
    keeperName: 'Assayer Fenn',
    keeperLine: '"I weigh things for a living — coins, ore, the worth of a soul on a slow day. Everything I sell is balanced exactly. No short measures."',
    stock: [
      { itemId: 'coinblade',       price: 130 },
      { itemId: 'assayers_scale',  price: 130 },
      { itemId: 'assayers_loupe',  price: 140 },
      { itemId: 'decimal_abacus',  price: 140 },
      { itemId: 'lucky_decicoin',  price: 95 }
    ]
  },
  concord_market: {
    keeperId: 'marketer_quill',
    keeperName: 'Marketer Quill',
    keeperLine: '"Welcome to Concord! Best prices in the free cities — when the cities can agree what a price IS. Spiced wine? A glaive? Speak up, friend."',
    stock: [
      { itemId: 'spiced_wine',     price: 20 },
      { itemId: 'oil_flask',       price: 40 },
      { itemId: 'guild_tonic',     price: 42 },
      { itemId: 'balance_glaive',  price: 140 },
      { itemId: 'guild_tabard',    price: 120 }
    ]
  },
  guild_outfitter: {
    keeperId: 'outfitter_bex',
    keeperName: 'Outfitter Bex',
    keeperLine: '"Every guild, every measure, all under one roof — that\'s how Concord used to work. Help me put it back together and I\'ll kit you out proper."',
    stock: [
      { itemId: 'tally_wand',        price: 135 },
      { itemId: 'merchants_finery',  price: 135 },
      { itemId: 'common_denom_ring', price: 150 },
      { itemId: 'power_loop',        price: 150 },
      { itemId: 'traders_chain',     price: 95 }
    ]
  },
  sky_outpost: {
    keeperId: 'astronomer_vega',
    keeperName: 'Astronomer Vega',
    keeperLine: '"Few climb this high. Fewer still mean to climb higher. The Sky-Bridge is a grid of star-iron, child — and at its summit waits the thing that unwrote the Codex. Take what you need. You will need all of it."',
    stock: [
      { itemId: 'ambrosia',            price: 48 },
      { itemId: 'star_tonic',          price: 50 },
      { itemId: 'starforged_blade',    price: 160 },
      { itemId: 'skyweave_mail',       price: 150 },
      { itemId: 'plotters_compass',    price: 165 },
      { itemId: 'geometers_lens',      price: 165 },
      { itemId: 'constellation_cloak', price: 155 },
      { itemId: 'sky_charm',           price: 110 }
    ]
  }
};

// ------------------------------------------------------
// ENEMIES — used in encounters
// ------------------------------------------------------
const ENEMIES = {
  rubble_imp: {
    id: 'rubble_imp', name: 'Rubble Imp',
    hp: 28, attack: 7, spriteId: 'rubble_imp',
    topic: 'volume_unit_cubes', difficulty: 'easy',
    goldDrop: [4, 8], xpDrop: 20
  },
  stone_grub: {
    id: 'stone_grub', name: 'Stone Grub',
    hp: 36, attack: 8, spriteId: 'stone_grub',
    topic: 'volume_rect_prism', difficulty: 'easy',
    goldDrop: [6, 10], xpDrop: 25
  },
  quarry_brute: {
    id: 'quarry_brute', name: 'Quarry Brute',
    hp: 48, attack: 10, spriteId: 'quarry_brute',
    topic: 'volume_expression', difficulty: 'medium',
    goldDrop: [10, 16], xpDrop: 40
  },
  // Mini-boss
  quarry_foreman: {
    id: 'quarry_foreman', name: 'The Quarry Foreman',
    hp: 150, attack: 12, spriteId: 'quarry_foreman',
    isBoss: true,
    phases: [
      { topic: 'volume_rect_prism',  difficulty: 'medium', say: '"Try my count, little ant."' },
      { topic: 'volume_decomposed',  difficulty: 'medium', say: '"Break it apart if you can."' },
      { topic: 'volume_word',        difficulty: 'medium', say: '"Numbers won\'t save you."' }
    ],
    goldDrop: [40, 55], xpDrop: 120,
    guaranteedLoot: ['hollowed_blade']
  },
  // ---------- Act II — Fractured Isles ----------
  brine_sprite: {
    id: 'brine_sprite', name: 'Brine Sprite',
    hp: 32, attack: 8, spriteId: 'brine_sprite',
    topic: 'fraction_times_whole', difficulty: 'easy',
    goldDrop: [5, 10], xpDrop: 28
  },
  splitwhelk: {
    id: 'splitwhelk', name: 'Splitwhelk',
    hp: 44, attack: 9, spriteId: 'splitwhelk',
    topic: 'fractions_as_division', difficulty: 'easy',
    goldDrop: [7, 12], xpDrop: 34
  },
  tide_imp: {
    id: 'tide_imp', name: 'Tide-Imp',
    hp: 50, attack: 10, spriteId: 'tide_imp',
    topic: 'fraction_times_fraction', difficulty: 'medium',
    goldDrop: [9, 14], xpDrop: 42
  },
  coral_golem: {
    id: 'coral_golem', name: 'Coral Golem',
    hp: 64, attack: 11, spriteId: 'coral_golem',
    topic: 'area_fractional_sides', difficulty: 'medium',
    goldDrop: [12, 18], xpDrop: 52
  },
  // Mini-bosses on each island
  halves_warden: {
    id: 'halves_warden', name: 'Warden of Halves',
    hp: 185, attack: 13, spriteId: 'halves_warden',
    isBoss: true,
    phases: [
      { topic: 'fraction_times_whole',  difficulty: 'medium', say: '"Half of you. Half again. Until nothing."' },
      { topic: 'fractions_as_division', difficulty: 'medium', say: '"Show me what one piece looks like."' },
      { topic: 'compare_products_scaling', difficulty: 'medium', say: '"Less than the whole. Always less."' }
    ],
    goldDrop: [40, 55], xpDrop: 110,
    guaranteedLoot: ['tide_blade']
  },
  thirds_seer: {
    id: 'thirds_seer', name: 'Seer of Thirds',
    hp: 200, attack: 13, spriteId: 'thirds_seer',
    isBoss: true,
    phases: [
      { topic: 'divide_unit_fraction_by_whole', difficulty: 'medium', say: '"A third of a third of a third. Do you still know yourself?"' },
      { topic: 'fraction_times_fraction', difficulty: 'medium', say: '"Multiply. Then multiply again. Smaller. Smaller."' },
      { topic: 'mixed_number_multiply',  difficulty: 'medium', say: '"Mix it with the whole. Lose the line."' }
    ],
    goldDrop: [45, 60], xpDrop: 120,
    guaranteedLoot: ['coral_staff']
  },
  pieces_collector: {
    id: 'pieces_collector', name: 'The Pieces-Collector',
    hp: 215, attack: 14, spriteId: 'pieces_collector',
    isBoss: true,
    phases: [
      { topic: 'divide_whole_by_unit_fraction', difficulty: 'medium', say: '"How many pieces of you are there? Tell me. I want them all."' },
      { topic: 'area_fractional_sides', difficulty: 'medium', say: '"A piece this wide. A piece this tall. Multiply."' },
      { topic: 'compare_products_scaling', difficulty: 'hard',   say: '"Larger, smaller, the same. Choose."' }
    ],
    goldDrop: [50, 65], xpDrop: 130,
    guaranteedLoot: ['navigators_locket']
  },
  // Final Act II boss
  half_king: {
    id: 'half_king', name: 'The Half-King',
    hp: 360, attack: 16, spriteId: 'half_king',
    isBoss: true,
    phases: [
      { topic: 'fraction_times_whole',  difficulty: 'easy',   say: '"You walked here on water. Now walk in halves."' },
      { topic: 'fraction_times_fraction', difficulty: 'medium', say: '"A piece of a piece. That is all anything ever was."' },
      { topic: 'divide_whole_by_unit_fraction', difficulty: 'medium', say: '"How many of me. Tell me — how many of ME!"' },
      { topic: 'mixed_number_multiply', difficulty: 'hard',   say: '"You count badly when you are afraid."' },
      { topic: 'area_fractional_sides', difficulty: 'hard',   say: '"One last piece. Mine, or yours. Choose."' }
    ],
    goldDrop: [100, 150], xpDrop: 360,
    guaranteedLoot: ['half_kings_horn', 'sextant_of_wholeness']
  },
  // ---------- Act III — The Iron Foundries ----------
  cog_sprite: {
    id: 'cog_sprite', name: 'Cog-Sprite',
    hp: 40, attack: 9, spriteId: 'cog_sprite',
    topic: 'estimate_product', difficulty: 'easy',
    goldDrop: [6, 11], xpDrop: 34
  },
  bolt_hound: {
    id: 'bolt_hound', name: 'Bolt-Hound',
    hp: 52, attack: 11, spriteId: 'bolt_hound',
    topic: 'multidigit_multiply', difficulty: 'medium',
    goldDrop: [8, 14], xpDrop: 44
  },
  slag_crawler: {
    id: 'slag_crawler', name: 'Slag-Crawler',
    hp: 60, attack: 12, spriteId: 'slag_crawler',
    topic: 'multidigit_divide', difficulty: 'medium',
    goldDrop: [10, 16], xpDrop: 52
  },
  forge_sentinel: {
    id: 'forge_sentinel', name: 'Forge-Sentinel',
    hp: 74, attack: 13, spriteId: 'forge_sentinel',
    topic: 'partial_products', difficulty: 'medium',
    goldDrop: [12, 20], xpDrop: 64
  },
  // Mini-boss — SABOTAGE route (division-focused)
  quartermaster_construct: {
    id: 'quartermaster_construct', name: 'The Quartermaster-Construct',
    hp: 195, attack: 14, spriteId: 'quartermaster_construct',
    isBoss: true,
    phases: [
      { topic: 'multidigit_divide',      difficulty: 'medium', say: '"DIVIDE. ALLOCATE. RATION. You are a rounding error."' },
      { topic: 'estimate_quotient',      difficulty: 'medium', say: '"ESTIMATE YOUR ODDS. THEY ARE POOR."' },
      { topic: 'multidigit_divide_word', difficulty: 'hard',   say: '"REMAINDER: ONE. YOU."' }
    ],
    goldDrop: [55, 75], xpDrop: 150,
    guaranteedLoot: ['dividing_engine']
  },
  // Mini-boss — ASSAULT route (multiplication-focused)
  siege_breaker: {
    id: 'siege_breaker', name: 'The Siege-Breaker',
    hp: 210, attack: 16, spriteId: 'siege_breaker',
    isBoss: true,
    phases: [
      { topic: 'multidigit_multiply',      difficulty: 'medium', say: '"MORE. ALWAYS MORE. MULTIPLY THE RUIN."' },
      { topic: 'multidigit_multiply_word', difficulty: 'medium', say: '"COUNT MY LEGIONS, LITTLE ONE."' },
      { topic: 'estimate_product',         difficulty: 'hard',   say: '"YOU CANNOT EVEN GUESS HOW MANY."' }
    ],
    goldDrop: [55, 75], xpDrop: 150,
    guaranteedLoot: ['multipliers_edge']
  },
  // Act III final boss
  foundry_mind: {
    id: 'foundry_mind', name: 'The Foundry-Mind',
    hp: 380, attack: 17, spriteId: 'foundry_mind',
    isBoss: true,
    phases: [
      { topic: 'estimate_product',         difficulty: 'easy',   say: '"I AM THE SUM OF EVERY FORGE. ESTIMATE ME, IF YOU DARE."' },
      { topic: 'multidigit_multiply',      difficulty: 'medium', say: '"MULTIPLY. I FEED ON FACTORS."' },
      { topic: 'multidigit_divide',        difficulty: 'medium', say: '"DIVIDE ME, THEN. SEE WHAT REMAINS."' },
      { topic: 'partial_products',         difficulty: 'hard',   say: '"BREAK ME APART. EVERY PART STILL BURNS."' },
      { topic: 'multidigit_divide_word',   difficulty: 'hard',   say: '"ONE LAST RECKONING. MAKE IT EXACT."' }
    ],
    goldDrop: [120, 170], xpDrop: 420,
    guaranteedLoot: ['warmarch_medal']
  },
  // ---------- Act IV — The Deep Vaults ----------
  coin_mite: {
    id: 'coin_mite', name: 'Coin-Mite',
    hp: 44, attack: 10, spriteId: 'coin_mite',
    topic: 'compare_decimals', difficulty: 'easy',
    goldDrop: [7, 12], xpDrop: 40
  },
  ledger_shade: {
    id: 'ledger_shade', name: 'Ledger-Shade',
    hp: 58, attack: 12, spriteId: 'ledger_shade',
    topic: 'decimals_subtract', difficulty: 'medium',
    goldDrop: [9, 15], xpDrop: 50
  },
  tarnish_ooze: {
    id: 'tarnish_ooze', name: 'Tarnish-Ooze',
    hp: 66, attack: 13, spriteId: 'tarnish_ooze',
    topic: 'decimals_multiply_whole', difficulty: 'medium',
    goldDrop: [11, 18], xpDrop: 60
  },
  vault_sentinel: {
    id: 'vault_sentinel', name: 'Vault-Sentinel',
    hp: 80, attack: 14, spriteId: 'vault_sentinel',
    topic: 'decimals_divide_whole', difficulty: 'medium',
    goldDrop: [13, 20], xpDrop: 70
  },
  // Mini-boss — AUDIT route (place value / rounding)
  the_auditor: {
    id: 'the_auditor', name: 'The Auditor',
    hp: 205, attack: 15, spriteId: 'the_auditor',
    isBoss: true,
    phases: [
      { topic: 'decimal_place_value', difficulty: 'medium', say: '"Every digit in its column. Including the ones you owe."' },
      { topic: 'round_decimal',       difficulty: 'medium', say: '"I will round you. Down."' },
      { topic: 'compare_decimals',    difficulty: 'hard',   say: '"You are worth less than you think. Provably."' }
    ],
    goldDrop: [60, 80], xpDrop: 160,
    guaranteedLoot: ['keepers_ledger']
  },
  // Mini-boss — HOARD route (decimal mult/div)
  coin_hoard: {
    id: 'coin_hoard', name: 'The Coin-Hoard',
    hp: 220, attack: 16, spriteId: 'coin_hoard',
    isBoss: true,
    phases: [
      { topic: 'decimals_multiply_whole', difficulty: 'medium', say: '"More. More. Count it all. It is all mine."' },
      { topic: 'decimals_multiply',       difficulty: 'medium', say: '"A piece of a piece of a coin. Still mine."' },
      { topic: 'divide_by_decimal',       difficulty: 'hard',   say: '"How many of me? Endless. ENDLESS."' }
    ],
    goldDrop: [70, 95], xpDrop: 160,
    guaranteedLoot: ['tithe_breaker']
  },
  // Act IV final boss
  tithe_master: {
    id: 'tithe_master', name: 'The Tithe-Master',
    hp: 400, attack: 18, spriteId: 'tithe_master',
    isBoss: true,
    phases: [
      { topic: 'compare_decimals',        difficulty: 'easy',   say: '"I take only a little. A tenth. A hundredth. You will not even feel it."' },
      { topic: 'decimals_add',            difficulty: 'medium', say: '"Add up everything you own. Now subtract my share."' },
      { topic: 'decimals_multiply_whole', difficulty: 'medium', say: '"Multiply your debt. It compounds, you see."' },
      { topic: 'divide_by_decimal',       difficulty: 'hard',   say: '"Divide what little remains. Divide it among the dark."' },
      { topic: 'decimals_subtract',       difficulty: 'hard',   say: '"One last withdrawal. All of it. Make the books balance."' }
    ],
    goldDrop: [140, 190], xpDrop: 480,
    guaranteedLoot: ['deepvault_medal', 'hollow_coin']
  },
  // ---------- Act V — Concord, the Measureless City ----------
  tare_wisp: {
    id: 'tare_wisp', name: 'Tare-Wisp',
    hp: 50, attack: 11, spriteId: 'tare_wisp',
    topic: 'metric_convert', difficulty: 'easy',
    goldDrop: [8, 13], xpDrop: 46
  },
  tally_gremlin: {
    id: 'tally_gremlin', name: 'Tally-Gremlin',
    hp: 58, attack: 12, spriteId: 'tally_gremlin',
    topic: 'frac_add_unlike', difficulty: 'medium',
    goldDrop: [9, 15], xpDrop: 54
  },
  zero_sprite: {
    id: 'zero_sprite', name: 'Zero-Sprite',
    hp: 64, attack: 13, spriteId: 'zero_sprite',
    topic: 'powers_of_10', difficulty: 'medium',
    goldDrop: [10, 17], xpDrop: 60
  },
  // District mini-bosses
  the_misweigher: {
    id: 'the_misweigher', name: 'The Misweigher',
    hp: 205, attack: 15, spriteId: 'the_misweigher',
    isBoss: true,
    phases: [
      { topic: 'metric_convert', difficulty: 'medium', say: '"A gram is a kilogram if I say so. Convert, and I will cheat you."' },
      { topic: 'convert_time',   difficulty: 'medium', say: '"An hour is sixty minutes. Or six. Are you SURE?"' },
      { topic: 'powers_of_10',   difficulty: 'hard',   say: '"Move the point. Wrong way. There. Now you owe me."' }
    ],
    goldDrop: [60, 80], xpDrop: 165,
    guaranteedLoot: ['accord_blade']
  },
  the_sunderer: {
    id: 'the_sunderer', name: 'The Sunderer',
    hp: 215, attack: 15, spriteId: 'the_sunderer',
    isBoss: true,
    phases: [
      { topic: 'frac_add_unlike',      difficulty: 'medium', say: '"Different denominators. You\'ll never make them agree."' },
      { topic: 'frac_subtract_unlike', difficulty: 'medium', say: '"Take a piece away. Now they REALLY don\'t match."' },
      { topic: 'mixed_number_add_sub', difficulty: 'hard',   say: '"Wholes and pieces, all jumbled. Sort THAT."' }
    ],
    goldDrop: [65, 85], xpDrop: 165,
    guaranteedLoot: ['common_denom_ring']
  },
  the_decimator: {
    id: 'the_decimator', name: 'The Decimator',
    hp: 220, attack: 16, spriteId: 'the_decimator',
    isBoss: true,
    phases: [
      { topic: 'powers_of_10',   difficulty: 'medium', say: '"Times ten. Times a hundred. Watch your zeros vanish."' },
      { topic: 'metric_convert', difficulty: 'medium', say: '"Kilo to milli, a million times smaller. Keep up."' },
      { topic: 'frac_add_unlike',difficulty: 'hard',   say: '"Now a fraction, just to break your rhythm."' }
    ],
    goldDrop: [65, 85], xpDrop: 165,
    guaranteedLoot: ['power_loop']
  },
  // Act V final boss
  babel_engine: {
    id: 'babel_engine', name: 'The Babel-Engine',
    hp: 410, attack: 18, spriteId: 'babel_engine',
    isBoss: true,
    phases: [
      { topic: 'frac_add_unlike',      difficulty: 'easy',   say: '"I AM EVERY MEASURE AT ONCE. ADD, IF YOU CAN AGREE WITH YOURSELF."' },
      { topic: 'mixed_number_add_sub', difficulty: 'medium', say: '"WHOLES. PIECES. NEITHER. BOTH."' },
      { topic: 'powers_of_10',         difficulty: 'medium', say: '"I MULTIPLY MEANINGS BY TEN. BY A HUNDRED."' },
      { topic: 'metric_convert',       difficulty: 'hard',   say: '"NAME MY UNITS. YOU CANNOT. THERE ARE TOO MANY."' },
      { topic: 'convert_time',         difficulty: 'hard',   say: '"TIME ITSELF I WILL RECKON WRONG. STOP ME."' }
    ],
    goldDrop: [150, 200], xpDrop: 520,
    guaranteedLoot: ['concord_medal', 'babel_key']
  },
  // ---------- Act VI — The Sky-Bridge ----------
  grid_wisp: {
    id: 'grid_wisp', name: 'Grid-Wisp',
    hp: 56, attack: 12, spriteId: 'grid_wisp',
    topic: 'coord_plot', difficulty: 'easy',
    goldDrop: [9, 14], xpDrop: 50
  },
  glyph_moth: {
    id: 'glyph_moth', name: 'Glyph-Moth',
    hp: 64, attack: 13, spriteId: 'glyph_moth',
    topic: 'classify_quad', difficulty: 'medium',
    goldDrop: [10, 16], xpDrop: 58
  },
  star_sentinel: {
    id: 'star_sentinel', name: 'Star-Sentinel',
    hp: 78, attack: 14, spriteId: 'star_sentinel',
    topic: 'coord_distance', difficulty: 'medium',
    goldDrop: [12, 19], xpDrop: 70
  },
  axis_warden: {
    id: 'axis_warden', name: 'The Axis-Warden',
    hp: 215, attack: 15, spriteId: 'axis_warden',
    isBoss: true,
    phases: [
      { topic: 'coord_plot',         difficulty: 'medium', say: '"You will not pass the x-axis. Plot, and prove you can even FIND it."' },
      { topic: 'coord_word',         difficulty: 'medium', say: '"Step where I say. Right. Up. There is nowhere else to go."' },
      { topic: 'rule_two_variables', difficulty: 'hard',   say: '"Every step you take obeys MY rule."' }
    ],
    goldDrop: [70, 95], xpDrop: 175,
    guaranteedLoot: ['plotters_compass']
  },
  // The true final boss — draws on ALL SIX units, one phase per unit
  the_nullity: {
    id: 'the_nullity', name: 'The Nullity',
    hp: 540, attack: 19, spriteId: 'the_nullity',
    isBoss: true,
    phases: [
      { topic: 'volume_rect_prism',  difficulty: 'medium', say: '"I am the First Scholar. I wrote the Codex — and I have come to UN-write it. Unit One: volume. The space a thing takes... I will take it back."' },
      { topic: 'fraction_times_fraction', difficulty: 'medium', say: '"Unit Two and Three: the pieces. I will break you into pieces of pieces until nothing remains."' },
      { topic: 'multidigit_multiply', difficulty: 'medium', say: '"Unit Four: the great numbers. I multiply my unmaking a thousandfold."' },
      { topic: 'divide_by_decimal',  difficulty: 'hard',   say: '"Unit Five: the small places. A tenth of you. A hundredth. A thousandth. Gone."' },
      { topic: 'frac_add_unlike',    difficulty: 'hard',   say: '"Unit Six: I will set your very measures against one another. Agree with me, and end."' },
      { topic: 'coord_plot',         difficulty: 'hard',   say: '"Unit Seven. The last. There is one point left to plot, hero — the point where you were, before I erase it. Find it. FIND IT."' }
    ],
    goldDrop: [250, 300], xpDrop: 1000,
    guaranteedLoot: ['starlance', 'champion_medal']
  },
  // Act I final boss
  hollowed_one: {
    id: 'hollowed_one', name: 'The Hollowed One',
    hp: 160, attack: 14, spriteId: 'hollowed_one',
    isBoss: true,
    phases: [
      { topic: 'volume_unit_cubes', difficulty: 'easy',   say: '"You see only the surface, child."' },
      { topic: 'volume_rect_prism', difficulty: 'medium', say: '"Then count my edges."' },
      { topic: 'volume_decomposed', difficulty: 'medium', say: '"Tear me apart, then. Try."' },
      { topic: 'volume_expression', difficulty: 'hard',   say: '"Now write me an expression worthy of an end."' },
      { topic: 'volume_word',       difficulty: 'hard',   say: '"One last reckoning. Make it count."' }
    ],
    goldDrop: [80, 120], xpDrop: 300,
    guaranteedLoot: ['apprentices_grimoire', 'golems_core']
  }
};

// ------------------------------------------------------
// XP / LEVELS
// ------------------------------------------------------
const XP_PER_LEVEL = [0, 100, 240, 420, 650, 930, 1260, 1640]; // index = level
function levelFromXp(xp) {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i + 1;
  }
  return 1;
}

// ------------------------------------------------------
// EXPORTS (for non-module access)
// ------------------------------------------------------
if (typeof window !== 'undefined') {
  window.STAT_DEFS = STAT_DEFS;
  window.STAT_DEFAULT = STAT_DEFAULT;
  window.STAT_POINTS_AT_CREATION = STAT_POINTS_AT_CREATION;
  window.STAT_POINTS_PER_LEVEL = STAT_POINTS_PER_LEVEL;
  window.maxHpFor = maxHpFor; window.maxMpFor = maxMpFor;
  window.critPctFor = critPctFor; window.baseDmgFor = baseDmgFor;
  window.timerSecFor = timerSecFor; window.hintsFor = hintsFor;
  window.CLASSES = CLASSES; window.HERITAGES = HERITAGES;
  window.FEATS = FEATS; window.ABILITIES = ABILITIES;
  window.FUR_COLORS = FUR_COLORS;
  window.ITEMS = ITEMS; window.TOPICS = TOPICS;
  window.SHOPS = SHOPS; window.ENEMIES = ENEMIES;
  window.XP_PER_LEVEL = XP_PER_LEVEL; window.levelFromXp = levelFromXp;
}
