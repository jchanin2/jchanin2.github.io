// ratio.js — Muffin's Food Truck: number helpers + ticket generators.
// Pure (no DOM): shared by game.js, practice.html and the node tests.
// Content tracks IM Accelerated 6, Unit 2 Lessons 10–11 (ratio tables, the
// "row with a 1", unit price) plus GCF of multi-digit numbers.

// ---------- RNG ----------
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function ri(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function shuffled(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- numbers ----------
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function clean(x) { return Math.round(x * 1e6) / 1e6; }
function approxEq(a, b) { return Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)); }
function isInt(x) { return approxEq(x, Math.round(x)); }
function smallestPrimeFactor(n) { for (let p = 2; p * p <= n; p++) if (n % p === 0) return p; return n; }

// Accepts "77.5", "77.50", "$1,200", ".75", "3/4", "1 1/2". Returns null if unreadable.
function parseNum(s) {
  if (s == null) return null;
  s = String(s).replace(/[$,]/g, '').trim().replace(/\s+/g, ' ');
  if (!s) return null;
  let m;
  if (/^(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  if ((m = s.match(/^(\d+) (\d+)\/(\d+)$/))) return +m[3] ? +m[1] + +m[2] / +m[3] : null;
  if ((m = s.match(/^(\d+)\/(\d+)$/))) return +m[2] ? +m[1] / +m[2] : null;
  return null;
}

function fmtNum(x) {
  x = clean(x);
  if (isInt(x)) return Math.round(x).toLocaleString('en-US');
  return x.toLocaleString('en-US', { maximumFractionDigits: 3 });
}
// money cells show cents ("1.25", "77.50") like the textbook's tables
function fmtCell(x, money) {
  x = clean(x);
  if (money && !isInt(x)) return x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return fmtNum(x);
}
function fmtMoney(x) { return '$' + fmtCell(x, true); }
function fmtMoney2(x) { return '$' + clean(x).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// tolerant of the 6-decimal rounding from clean(), so 0.666667 still reads as 2/3
function toFraction(x, maxDen) {
  for (let d = 1; d <= (maxDen || 100); d++) {
    const n = x * d;
    if (Math.abs(n - Math.round(n)) < 1e-5 * d) { const N = Math.round(n), g = gcd(N, d); return [N / g, d / g]; }
  }
  return null;
}
function fracHTML(n, d) {
  return '<span class="fr"><span class="frn">' + n + '</span><span class="frd">' + d + '</span></span>';
}
// amounts on price tags: whole numbers and short decimals as-is, repeating decimals as fractions (⅔)
function amountHTML(x) {
  if (isInt(x)) return fmtNum(x);
  if (isInt(x * 100)) return fmtNum(x);
  const f = toFraction(x, 12);
  if (!f) return fmtNum(x);
  const w = Math.floor(f[0] / f[1]), r = f[0] - w * f[1];
  return (w ? w + ' ' : '') + fracHTML(r, f[1]);
}

// Arrow label between two ratio-table rows: "× 62", "÷ 4", "× 5/2"
function factorLabel(f) {
  const near = x => Math.abs(x - Math.round(x)) < 1e-5 * Math.max(1, Math.abs(x));
  if (near(f)) return '× ' + fmtNum(Math.round(f));
  if (near(1 / f)) return '÷ ' + fmtNum(Math.round(1 / f));
  const fr = toFraction(f, 100);
  if (fr) return '× ' + fr[0] + '/' + fr[1];
  return '× ' + fmtNum(f);
}

// ---------- order contexts ----------
// Customer gives a number in one column (side 'L' or 'R'); the ticket wants the other.
const bN = x => '<b>' + fmtNum(x) + '</b>';
const bM = x => '<b>' + fmtMoney(x) + '</b>';

const CTX = {
  granola: { L: 'granola (lbs)', R: 'price ($)', money: 'R', Lname: 'pounds of granola', Rname: 'dollars',
    sign: (a, b) => bN(a) + ' lbs of granola cost ' + bM(b) + '.',
    fromL: t => 'I need ' + bN(t) + ' lbs of granola. How much will that cost?',
    fromR: t => 'I have ' + bM(t) + '. How many pounds of granola can I buy?' },
  avocados: { L: 'avocados', R: 'price ($)', money: 'R', Lname: 'avocados', Rname: 'dollars',
    sign: (a, b) => bN(a) + ' avocados cost ' + bM(b) + '.',
    fromL: t => 'I\'ll take ' + bN(t) + ' avocados. What\'s my total?',
    fromR: t => 'How many avocados can I get for ' + bM(t) + '?' },
  pasta: { L: 'pasta (lbs)', R: 'price ($)', money: 'R', Lname: 'pounds of pasta', Rname: 'dollars',
    sign: (a, b) => bN(a) + ' lbs of pasta cost ' + bM(b) + '.',
    fromL: t => 'I\'m catering a wedding and need ' + bN(t) + ' lbs of pasta. How much?',
    fromR: t => 'My pasta budget is ' + bM(t) + '. How many pounds is that?' },
  vinegar: { L: 'vinegar (gallons)', R: 'price ($)', money: 'R', Lname: 'gallons of vinegar', Rname: 'dollars',
    sign: (a, b) => bN(a) + ' gallons of vinegar cost ' + bM(b) + '.',
    fromL: t => 'I\'m making pickles — I need ' + bN(t) + ' gallons. How much?',
    fromR: t => 'How many gallons of vinegar does ' + bM(t) + ' buy?' },
  lemonade: { L: 'lemonades', R: 'price ($)', money: 'R', Lname: 'lemonades', Rname: 'dollars',
    sign: (a, b) => bN(a) + ' lemonades cost ' + bM(b) + '.',
    fromL: t => 'Lemonade for my whole soccer team — ' + bN(t) + ' cups! How much?',
    fromR: t => 'I have ' + bM(t) + '. How many lemonades can I get?' },
  limes: { L: 'limes', R: 'price ($)', money: 'R', Lname: 'limes', Rname: 'dollars',
    sign: (a, b) => bN(a) + ' limes cost ' + bM(b) + '.',
    fromL: t => 'I need ' + bN(t) + ' limes for guacamole. How much?',
    fromR: t => 'How many limes can I buy with ' + bM(t) + '?' },
  tacos: { L: 'tacos', R: 'cheese (oz)', money: null, Lname: 'tacos', Rname: 'ounces of cheese',
    sign: (a, b) => 'For ' + bN(a) + ' tacos, Muffin uses ' + bN(b) + ' oz of cheese.',
    fromL: t => 'I ordered ' + bN(t) + ' tacos! How much cheese will Muffin need?',
    fromR: t => 'Muffin has ' + bN(t) + ' oz of cheese left. How many tacos will that make?' },
  burgers: { L: 'burgers', R: 'time (min)', money: null, Lname: 'burgers', Rname: 'minutes',
    sign: (a, b) => 'The grill cooks ' + bN(a) + ' burgers in ' + bN(b) + ' minutes.',
    fromL: t => 'How long will it take to grill ' + bN(t) + ' burgers?',
    fromR: t => 'How many burgers can the grill cook in ' + bN(t) + ' minutes?' },
  wages: { L: 'hours worked', R: 'pay ($)', money: 'R', Lname: 'hours', Rname: 'dollars',
    sign: (a, b) => 'Muffin\'s helper earns ' + bM(b) + ' for ' + bN(a) + ' hours of work.',
    fromL: t => 'How much will the helper earn for ' + bN(t) + ' hours?',
    fromR: t => 'How many hours does the helper need to work to earn ' + bM(t) + '?' },
  fizzy: { L: 'cranberry juice (cups)', R: 'soda water (cups)', money: null, Lname: 'cups of cranberry juice', Rname: 'cups of soda water',
    sign: (a, b) => 'Fizzy juice recipe: ' + bN(a) + ' cups of cranberry juice for every ' + bN(b) + ' cups of soda water.',
    fromL: t => 'I\'m making a giant batch with ' + bN(t) + ' cups of cranberry juice. How much soda water?',
    fromR: t => 'I\'ve got ' + bN(t) + ' cups of soda water. How much cranberry juice do I need?' },
  smoothie: { L: 'mango (cups)', R: 'yogurt (cups)', money: null, Lname: 'cups of mango', Rname: 'cups of yogurt',
    sign: (a, b) => 'Mango smoothie: ' + bN(a) + ' cups of mango for every ' + bN(b) + ' cups of yogurt.',
    fromL: t => 'Smoothies for the whole class — I\'m using ' + bN(t) + ' cups of mango. How much yogurt?',
    fromR: t => 'I have ' + bN(t) + ' cups of yogurt. How much mango goes with it?' },
  lemonmix: { L: 'lemonade mix (scoops)', R: 'water (cups)', money: null, Lname: 'scoops of mix', Rname: 'cups of water',
    sign: (a, b) => 'Lemonade recipe: ' + bN(a) + ' scoops of mix for every ' + bN(b) + ' cups of water.',
    fromL: t => 'I\'m using ' + bN(t) + ' scoops of mix. How many cups of water?',
    fromR: t => 'The big jug holds ' + bN(t) + ' cups of water. How many scoops of mix?' },
  salsa: { L: 'tomatoes (oz)', R: 'peppers (oz)', money: null, Lname: 'ounces of tomatoes', Rname: 'ounces of peppers',
    sign: (a, b) => 'Muffin\'s salsa: ' + bN(a) + ' oz of tomatoes for every ' + bN(b) + ' oz of peppers.',
    fromL: t => 'Party size! I\'ve got ' + bN(t) + ' oz of tomatoes. How many ounces of peppers?',
    fromR: t => 'I have ' + bN(t) + ' oz of peppers. How many ounces of tomatoes?' },
  bakery: { L: 'flour (g)', R: 'sugar (g)', money: null, Lname: 'grams of flour', Rname: 'grams of sugar',
    sign: (a, b) => 'Muffin\'s cookie recipe: ' + bN(a) + ' g of flour for every ' + bN(b) + ' g of sugar.',
    fromL: t => 'Catering order! We\'re using ' + bN(t) + ' g of flour. How much sugar?',
    fromR: t => 'We have exactly ' + bN(t) + ' g of sugar. How much flour goes with it?' },
  ricebeans: { L: 'rice (cups)', R: 'beans (cups)', money: null, Lname: 'cups of rice', Rname: 'cups of beans',
    sign: (a, b) => 'Burrito bowls: ' + bN(a) + ' cups of rice for every ' + bN(b) + ' cups of beans.',
    fromL: t => 'Stadium order! We\'re cooking ' + bN(t) + ' cups of rice. How many cups of beans?',
    fromR: t => 'We have ' + bN(t) + ' cups of beans. How many cups of rice?' },
  pennies: { L: 'pennies', R: 'mass (g)', money: null, Lname: 'pennies', Rname: 'grams',
    sign: (a, b) => 'Each penny in the tip jar weighs ' + bN(b) + ' grams.',
    fromL: t => 'Muffin counted ' + bN(t) + ' pennies. How much do they weigh?',
    fromR: t => 'The pennies in the tip jar weigh ' + bN(t) + ' g. How many pennies is that?' }
};

const MONEY_CTX = ['granola', 'avocados', 'pasta', 'vinegar', 'lemonade', 'limes'];
const RECIPE_CTX = ['fizzy', 'smoothie', 'lemonmix', 'salsa'];
const U_DEC = [1.25, 1.5, 2.5, 0.75, 1.75, 2.25, 0.5, 3.5, 4.5, 1.2, 0.8, 2.4, 0.6];
const A_CHOICES = [2, 3, 4, 5, 6, 8, 10];

function mkOrder(ctx, a, b, side, t, answer, level) {
  return { type: 'order', level, ctx, a: clean(a), b: clean(b), side, t: clean(t), answer: clean(answer) };
}
function coprimePair(rng, lo, hi) {
  let p, q;
  do { p = ri(rng, lo, hi); q = ri(rng, lo, hi); } while (p === q || gcd(p, q) !== 1);
  return [p, q];
}

// L1: whole-number unit rates ("4 minutes per page")
function orderL1(rng) {
  const ctx = pick(rng, ['tacos', 'burgers', 'wages', 'lemonade']);
  const u = ctx === 'wages' ? ri(rng, 8, 15) : ri(rng, 2, 6);
  const a = ri(rng, 2, 6), b = a * u;
  let n; do { n = ri(rng, 7, 15); } while (n === a);
  return rng() < 0.75 ? mkOrder(ctx, a, b, 'L', n, n * u, 1) : mkOrder(ctx, a, b, 'R', n * u, n, 1);
}
// L2: decimal unit prices ("4 lbs for $5 → $1.25 per lb")
function orderL2(rng) {
  let ctx, u;
  if (rng() < 0.7) { ctx = pick(rng, MONEY_CTX); u = pick(rng, U_DEC); }
  else { ctx = pick(rng, ['tacos', 'burgers']); u = pick(rng, [2.5, 1.5, 0.75, 1.25]); }
  const a = pick(rng, A_CHOICES), b = clean(a * u);
  let t = ri(rng, 11, 80);
  if (t % a === 0 && rng() < 0.6) t++;           // mostly force a trip through the unit rate
  return mkOrder(ctx, a, b, 'L', t, clean(t * u), 2);
}
// recipe ratios (Lesson 11: 5 : 2 cranberry to soda water, 16 cups of soda → 40)
function orderRecipe(rng, level) {
  const [p, q] = coprimePair(rng, 2, 9);
  const ctx = pick(rng, RECIPE_CTX);
  const side = rng() < 0.5 ? 'L' : 'R';
  const v = side === 'L' ? p : q, o = side === 'L' ? q : p;
  if ([2, 4, 5].includes(v) && rng() < 0.4) {   // not a multiple: needs the "1 row" (answers like 17.5)
    let t; do { t = ri(rng, 7, 30); } while (t % v === 0);
    return mkOrder(ctx, p, q, side, t, t * o / v, level);
  }
  const m = ri(rng, 3, 12);
  return mkOrder(ctx, p, q, side, v * m, o * m, level);
}
function orderReverseMoney(rng, level) {
  const ctx = pick(rng, ['granola', 'avocados', 'pasta', 'vinegar']);
  const u = pick(rng, U_DEC), a = pick(rng, A_CHOICES), b = clean(a * u);
  let n; do { n = ri(rng, 6, 40); } while (n === a);
  return mkOrder(ctx, a, b, 'R', clean(n * u), n, level);
}
// Priya's pennies: 1 penny : 2.5 g, multi-digit targets
function orderPennies(rng, level) {
  const n = level >= 4 ? 10 * ri(rng, 40, 200) : 10 * ri(rng, 12, 99);
  return rng() < 0.75
    ? mkOrder('pennies', 1, 2.5, 'R', clean(n * 2.5), n, level)
    : mkOrder('pennies', 1, 2.5, 'L', n, clean(n * 2.5), level);
}
// big multi-digit ratios: shrink by the GCF first, then scale (600 : 450 → 4 : 3)
function orderBigGcf(rng) {
  const [p, q] = coprimePair(rng, 2, 9);
  const g = pick(rng, [20, 25, 30, 40, 50, 60, 75, 150]);
  const ctx = pick(rng, ['bakery', 'ricebeans']);
  const side = rng() < 0.6 ? 'L' : 'R';
  const v = side === 'L' ? p : q, o = side === 'L' ? q : p;
  let m; do { m = pick(rng, [10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 200]); } while (m === g);
  return mkOrder(ctx, p * g, q * g, side, v * m, o * m, 4);
}
function orderBigMoney(rng) {
  const ctx = pick(rng, ['granola', 'pasta', 'vinegar', 'avocados']);
  const u = pick(rng, [1.25, 2.5, 0.75, 1.5, 0.25, 1.75]);
  const a = pick(rng, [4, 6, 8, 12]), b = clean(a * u);
  if (rng() < 0.6) {
    const t = pick(rng, [120, 150, 160, 200, 240, 300, 360, 400, 480, 600]);
    return mkOrder(ctx, a, b, 'L', t, clean(t * u), 4);
  }
  const n = pick(rng, [100, 120, 150, 160, 200, 240, 300, 400]);
  return mkOrder(ctx, a, b, 'R', clean(n * u), n, 4);
}

function genOrder(rng, level) {
  if (level <= 1) return orderL1(rng);
  if (level === 2) return orderL2(rng);
  const r = rng();
  if (level === 3) {
    if (r < 0.45) return orderRecipe(rng, 3);
    if (r < 0.75) return orderReverseMoney(rng, 3);
    return orderPennies(rng, 3);
  }
  if (r < 0.5) return orderBigGcf(rng);
  if (r < 0.8) return orderBigMoney(rng);
  return orderPennies(rng, 4);
}

// ---------- prep (GCF ladder) ----------
const PREP_G = {
  1: [4, 5, 6, 8, 9, 10, 12],
  2: [12, 14, 15, 16, 18, 20, 24, 25],
  3: [30, 35, 40, 45, 50, 60, 75, 90],
  4: [120, 125, 150, 180, 200, 240, 300]
};
const PREP_FLAVOR = [
  { L: 'flour (g)', R: 'sugar (g)',
    line: (A, B) => 'Recipe card: ' + bN(A) + ' g of flour to ' + bN(B) + ' g of sugar.',
    ask: 'This recipe card is way too big for the truck! Shrink it to the smallest whole-number ratio.' },
  { L: 'tortillas', R: 'cheese slices',
    line: (A, B) => 'Delivery: ' + bN(A) + ' tortillas and ' + bN(B) + ' slices of cheese.',
    ask: 'What\'s the simplest whole-number ratio of tortillas to cheese slices?' },
  { L: 'cabbage (g)', R: 'carrots (g)',
    line: (A, B) => 'Coleslaw card: ' + bN(A) + ' g of cabbage to ' + bN(B) + ' g of carrots.',
    ask: 'Shrink this recipe card to the smallest whole numbers that taste the same.' },
  { L: 'taco orders', R: 'burrito orders',
    line: (A, B) => 'This month: ' + bN(A) + ' taco orders and ' + bN(B) + ' burrito orders.',
    ask: 'Write the ratio of taco orders to burrito orders in simplest form.' },
  { L: 'rice (cups)', R: 'beans (cups)',
    line: (A, B) => 'Catering sheet: ' + bN(A) + ' cups of rice to ' + bN(B) + ' cups of beans.',
    ask: 'Shrink it to the simplest whole-number ratio.' }
];
function genPrep(rng, level) {
  const lv = Math.min(4, Math.max(1, level));
  const g = pick(rng, PREP_G[lv]);
  let p, q;
  // level 3+ must be genuinely multi-digit (no 35 : 70 sneaking in)
  do { [p, q] = coprimePair(rng, 1, lv <= 1 ? 7 : 9); } while (lv >= 3 && Math.max(p, q) * g < 100);
  return { type: 'prep', level, A: p * g, B: q * g, p, q, g, flavor: ri(rng, 0, PREP_FLAVOR.length - 1) };
}

// ---------- price check (Lesson 11, problem 1) ----------
const PRICE_CTX = [
  { noun: 'vinegar', one: 'gallon', many: 'gallons' },
  { noun: 'pasta', one: 'pound', many: 'pounds' },
  { noun: 'rice', one: 'pound', many: 'pounds' },
  { noun: 'apple juice', one: 'bottle', many: 'bottles' },
  { noun: 'cheese', one: 'pound', many: 'pounds' }
];
function genPrice(rng, level) {
  const c = ri(rng, 0, PRICE_CTX.length - 1);
  let q, u;
  if (level <= 1) { q = ri(rng, 2, 5); u = ri(rng, 2, 6); }
  else { q = ri(rng, 2, 6); u = pick(rng, [1.5, 2.5, 0.75, 1.25, 0.5, 1.2, 1.75]); }
  const p = clean(q * u);
  const trues = [
    { amt: 1, usd: u, moneyFirst: false },                                        // 1 gallon to $1.50
    (k => ({ amt: k * q, usd: clean(k * p), moneyFirst: false }))(pick(rng, [3, 4, 5, 10])),
    (k => ({ amt: k * q, usd: clean(k * p), moneyFirst: true }))(pick(rng, [2, 6]))
  ];
  if (level >= 2) trues.push({ amt: 1 / u, usd: 1, moneyFirst: true });         // $1.00 to ⅔ gallon (kept exact)
  const falses = [
    { amt: p, usd: q, moneyFirst: false },                                        // numbers swapped
    (d => ({ amt: q + d, usd: clean(p + d), moneyFirst: false }))(pick(rng, [1, 2, 4])), // added, not multiplied
    { amt: 2 * q, usd: p, moneyFirst: rng() < 0.5 },                              // only one side doubled
    (k => ({ amt: k * q, usd: clean(k * p + pick(rng, [1, 2])), moneyFirst: true }))(pick(rng, [3, 5, 10]))
  ];
  const nTrue = pick(rng, [2, 3]);
  const tags = shuffled(rng, shuffled(rng, trues).slice(0, nTrue).concat(shuffled(rng, falses).slice(0, 5 - nTrue)));
  tags.forEach(t => { t.ok = approxEq(t.usd / t.amt, u); });
  return { type: 'price', level, ctx: c, q, p, u, tags };
}
function tagHTML(tag, ctxIdx) {
  const c = PRICE_CTX[ctxIdx];
  const unit = tag.amt <= 1 ? c.one : c.many;
  return tag.moneyFirst
    ? fmtMoney2(tag.usd) + ' to ' + amountHTML(tag.amt) + ' ' + unit
    : amountHTML(tag.amt) + ' ' + unit + ' to ' + fmtMoney2(tag.usd);
}

// ---------- dispatch + ticket text ----------
function genTicket(type, rng, level) {
  if (type === 'order') return genOrder(rng, level);
  if (type === 'prep') return genPrep(rng, level);
  return genPrice(rng, level);
}

function ticketText(tk) {
  if (tk.type === 'order') {
    const c = CTX[tk.ctx];
    return { label: 'ORDER', boardLabel: 'MENU BOARD', board: c.sign(tk.a, tk.b),
             bubble: tk.side === 'L' ? c.fromL(tk.t) : c.fromR(tk.t) };
  }
  if (tk.type === 'prep') {
    const f = PREP_FLAVOR[tk.flavor];
    return { label: 'PREP · SHRINK IT', boardLabel: 'RECIPE CARD', board: f.line(tk.A, tk.B), bubble: f.ask };
  }
  const c = PRICE_CTX[tk.ctx];
  return { label: 'PRICE CHECK', boardLabel: 'SUPPLIER',
           board: bN(tk.q) + ' ' + c.many + ' of ' + c.noun + ' for <b>' + fmtMoney2(tk.p) + '</b>.',
           bubble: 'Somebody wrote these price tags in a hurry. Stamp each one ✓ if it matches the supplier\'s price, ✗ if it doesn\'t.' };
}

// ---------- shifts + drills ----------
const SHIFTS = [
  { id: 'open', name: 'Opening Time', blurb: 'Whole-number rates. Warm up the grill — find the row with a 1.',
    tickets: [['order', 1], ['order', 1], ['prep', 1], ['price', 1], ['order', 1]] },
  { id: 'lunch', name: 'Lunch Rush', blurb: 'Decimal prices — $1.25 a pound, $0.75 an avocado. The line is out the door.',
    tickets: [['order', 2], ['order', 2], ['prep', 2], ['order', 2], ['price', 2], ['order', 2]] },
  { id: 'batch', name: 'Big-Batch Saturday', blurb: 'Recipe ratios, reverse orders, and a tip jar full of pennies.',
    tickets: [['order', 3], ['prep', 3], ['order', 3], ['price', 2], ['order', 3], ['prep', 3]] },
  { id: 'critic', name: 'The Food Critic', blurb: 'Huge numbers. Shrink by the GCF first, then scale up.',
    tickets: [['prep', 4], ['order', 4], ['order', 4], ['price', 3], ['prep', 4], ['order', 4], ['order', 4]] }
];
const DRILLS = {
  order: { name: 'Order Window', icon: '🧾', blurb: 'Endless ratio-table orders.' },
  prep:  { name: 'Prep Station', icon: '🔪', blurb: 'Shrink big ratios — GCF of multi-digit numbers.' },
  price: { name: 'Price Check', icon: '🏷️', blurb: 'Spot the wrong price tags.' }
};

if (typeof module !== 'undefined') {
  module.exports = { makeRng, ri, pick, shuffled, gcd, clean, approxEq, isInt, smallestPrimeFactor, parseNum,
    fmtNum, fmtCell, fmtMoney, fmtMoney2, toFraction, amountHTML, factorLabel, CTX, PREP_FLAVOR, PRICE_CTX,
    genOrder, genPrep, genPrice, genTicket, ticketText, tagHTML, orderBigGcf, SHIFTS, DRILLS };
}
