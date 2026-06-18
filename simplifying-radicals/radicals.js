/* ======================================================
   radicals.js — math engine for "Simplifying Radicals"
   Pure logic, no DOM. Works in the browser (window.Radicals)
   and in Node (module.exports) for the test suite.

   Method (matches the class):
     - factor down to primes
     - "couples or triples go OUT, singles STAY IN"
       (index 2 -> pairs; index 3 -> triples)
     - a coefficient in front MULTIPLIES whatever comes out
     - only couples/triples out (nothing left under) -> rational
   ====================================================== */
(function (root) {
  'use strict';

  function ipow(b, e) { var r = 1; for (var i = 0; i < e; i++) r *= b; return r; }

  // prime factorization of a positive integer -> { prime: exponent }
  function primeFactor(n) {
    var f = {}, m = Math.abs(n), p = 2;
    while (p * p <= m) { while (m % p === 0) { f[p] = (f[p] || 0) + 1; m /= p; } p++; }
    if (m > 1) f[m] = (f[m] || 0) + 1;
    return f;
  }

  // numeric value of the nth root (handles cube root of negatives)
  function rootVal(x, index) { return index === 3 ? Math.cbrt(x) : Math.sqrt(x); }

  function radSymbol(index) { return index === 3 ? '∛' : '√'; } // ∛ / √

  /* simplify a radical expression.
     radicand may be negative ONLY for index 3 (cube root).
     returns { coeff, radicand, index, isRational }
       coeff      = signed integer that ends up in front
       radicand   = what stays under the radical (1 = nothing left)
       isRational = radicand === 1 (a whole number)              */
  function simplify(radicand, index, coeffFront) {
    index = index || 2;
    coeffFront = (coeffFront == null) ? 1 : coeffFront;

    var sign = 1;
    if (coeffFront < 0) sign *= -1;
    if (radicand < 0) {
      // only valid for cube roots
      if (index !== 3) throw new Error('square root of a negative is not real');
      sign *= -1;
    }
    var rad = Math.abs(radicand);
    var cf = Math.abs(coeffFront);

    var f = primeFactor(rad);
    var out = 1, inside = 1;
    Object.keys(f).map(Number).sort(function (a, b) { return a - b; }).forEach(function (p) {
      var e = f[p];
      out *= ipow(p, Math.floor(e / index));
      inside *= ipow(p, e % index);
    });

    return {
      coeff: sign * cf * out,
      radicand: inside,
      index: index,
      isRational: inside === 1
    };
  }

  // plain-text form, e.g. "2√6", "16", "-5∛2", "-2√3"
  function toText(sym) {
    if (sym.radicand === 1) return String(sym.coeff);
    var c = sym.coeff;
    var cstr = (c === 1) ? '' : (c === -1 ? '-' : String(c));
    return cstr + radSymbol(sym.index) + sym.radicand;
  }

  // equality key for de-duping options
  function key(sym) { return sym.coeff + '|' + sym.radicand + '|' + sym.index; }

  /* verify a simplification numerically against the ORIGINAL.
     ( coeffFront * root(radicand) )  ===  ( sym.coeff * root(sym.radicand) ) */
  function verify(coeffFront, radicand, index, sym) {
    var original = coeffFront * rootVal(radicand, index);
    var simplified = sym.coeff * (sym.radicand === 1 ? 1 : rootVal(sym.radicand, index));
    var tol = 1e-6 * Math.max(1, Math.abs(original));
    return Math.abs(original - simplified) < tol;
  }

  // ----------------------------------------------------
  // problem generation (by prime construction -> always clean)
  // ----------------------------------------------------
  var SQ_INSIDE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];   // squarefree leftovers
  var CB_INSIDE = [2, 3, 4, 5, 6, 7, 9];                 // cube-free leftovers (exp <= 2)
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }

  // build a single item {coeffFront, radicand, index, tier}; retry until in range
  function generate(tier) {
    tier = tier || 'mixed';
    if (tier === 'mixed') tier = pick(['simple2', 'coeff2', 'neg2', 'cube', 'perfect2']);
    for (var tries = 0; tries < 60; tries++) {
      var item = buildTier(tier);
      if (!item) continue;
      var sym = simplify(item.radicand, item.index, item.coeffFront);
      if (!verify(item.coeffFront, item.radicand, item.index, sym)) continue; // safety net
      item.tier = tier;
      return item;
    }
    // guaranteed fallback
    return { coeffFront: 1, radicand: 12, index: 2, tier: tier };
  }

  function buildTier(tier) {
    var out, inside, rad, cf;
    if (tier === 'perfect2') {
      out = randInt(4, 12); rad = out * out;
      if (rad > 300) return null;
      return { coeffFront: 1, radicand: rad, index: 2 };
    }
    if (tier === 'perfect3') {
      out = randInt(2, 5); rad = out * out * out;
      return { coeffFront: 1, radicand: rad, index: 3 };
    }
    if (tier === 'simple2' || tier === 'coeff2' || tier === 'neg2') {
      out = randInt(2, 7); inside = pick(SQ_INSIDE); rad = out * out * inside;
      if (rad > 300) return null;
      cf = 1;
      if (tier === 'coeff2') cf = pick([2, 3, 5]);
      if (tier === 'neg2') cf = pick([-2, -3, -5]);
      return { coeffFront: cf, radicand: rad, index: 2 };
    }
    if (tier === 'cube' || tier === 'cube_coeff' || tier === 'cube_neg') {
      out = randInt(2, 4); inside = pick(CB_INSIDE); rad = out * out * out * inside;
      if (rad > 250) return null;
      cf = 1;
      if (tier === 'cube_coeff') cf = pick([2, 3]);
      if (tier === 'cube_neg') { cf = pick([1, -1, 2]); if (Math.random() < 0.5) rad = -rad; }
      else if (Math.random() < 0.25) { rad = -rad; } // some plain cubes are negative
      return { coeffFront: cf, radicand: rad, index: 3 };
    }
    return null;
  }

  /* build a multiple-choice set for an item.
     returns { correct: sym, options: [sym...], errorTags: {key: tag} } */
  function buildChoices(item) {
    var index = item.index, rad = item.radicand, cf = item.coeffFront;
    var correct = simplify(rad, index, cf);
    var opts = [correct];
    var tags = {}; tags[key(correct)] = 'correct';

    function add(sym, tag) {
      if (!sym) return;
      if (key(sym) === key(correct)) return;           // never duplicate the answer
      if (opts.some(function (o) { return key(o) === key(sym); })) return;
      opts.push(sym); tags[key(sym)] = tag;
    }

    // 1) forgot the front coefficient
    if (Math.abs(cf) !== 1) add(simplify(rad, index, cf < 0 ? -1 : 1), 'forgot-coeff');
    // 2) used the wrong index (pairs on a cube root / triples on a square root)
    try { add(simplify(rad, index === 2 ? 3 : 2, cf), 'wrong-index'); } catch (e) {}
    // 3) the unsimplified original
    add({ coeff: cf, radicand: Math.abs(rad), index: index, isRational: false }, 'unsimplified');
    // 4) sign-flipped (for negatives)
    if (correct.coeff < 0 || cf < 0) add({ coeff: -correct.coeff, radicand: correct.radicand, index: index }, 'sign-flip');
    // pad with mild numeric nudges if needed
    var nudge = 1;
    while (opts.length < 4 && nudge < 6) {
      add({ coeff: correct.coeff + nudge, radicand: correct.radicand, index: index }, 'nudge');
      nudge++;
    }
    // shuffle, cap at 4
    var four = opts.slice(0, 4);
    for (var i = four.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = four[i]; four[i] = four[j]; four[j] = t; }
    return { correct: correct, options: four, tags: tags };
  }

  // ----------------------------------------------------
  // vetted seed bank  (verified fixtures; also used in tests)
  // each: [coeffFront, radicand, index, expectedText]
  // ----------------------------------------------------
  var SEED = [
    // square roots
    [1, 8, 2, '2√2'], [1, 12, 2, '2√3'], [1, 18, 2, '3√2'], [1, 20, 2, '2√5'],
    [1, 24, 2, '2√6'], [1, 27, 2, '3√3'], [1, 32, 2, '4√2'], [1, 45, 2, '3√5'],
    [1, 48, 2, '4√3'], [1, 50, 2, '5√2'], [1, 72, 2, '6√2'], [1, 75, 2, '5√3'],
    [1, 98, 2, '7√2'], [1, 200, 2, '10√2'],
    // perfect squares
    [1, 16, 2, '4'], [1, 36, 2, '6'], [1, 64, 2, '8'], [1, 81, 2, '9'], [1, 100, 2, '10'], [1, 144, 2, '12'],
    // with coefficient
    [2, 18, 2, '6√2'], [3, 8, 2, '6√2'], [5, 12, 2, '10√3'], [-2, 48, 2, '-8√3'],
    // cube roots
    [1, 16, 3, '2∛2'], [1, 24, 3, '2∛3'], [1, 40, 3, '2∛5'], [1, 48, 3, '2∛6'],
    [1, 54, 3, '3∛2'], [1, 81, 3, '3∛3'], [1, 128, 3, '4∛2'], [1, 250, 3, '5∛2'],
    // perfect cubes
    [1, 8, 3, '2'], [1, 27, 3, '3'], [1, 64, 3, '4'], [1, 125, 3, '5'],
    // cube with coefficient / negative
    [2, 24, 3, '4∛3'], [-1, 250, 3, '-5∛2'], [1, -250, 3, '-5∛2']
  ];

  var API = {
    primeFactor: primeFactor,
    simplify: simplify,
    verify: verify,
    toText: toText,
    key: key,
    radSymbol: radSymbol,
    rootVal: rootVal,
    generate: generate,
    buildChoices: buildChoices,
    SEED: SEED,
    SQ_INSIDE: SQ_INSIDE,
    CB_INSIDE: CB_INSIDE
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.Radicals = API;
})(typeof window !== 'undefined' ? window : this);
