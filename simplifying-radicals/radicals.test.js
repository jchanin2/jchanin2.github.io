/* ======================================================
   radicals.test.js — run with:  node radicals.test.js
   Verifies the seed bank simplifies to the vetted answers,
   and that every generated item passes the numeric verifier.
   Exits non-zero on any failure.
   ====================================================== */
var R = require('./radicals.js');

var pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; } else { fail++; console.log('  ✗ FAIL: ' + msg); } }

// 1) seed bank: text + numeric verify
console.log('— seed bank —');
R.SEED.forEach(function (row) {
  var cf = row[0], rad = row[1], idx = row[2], expected = row[3];
  var sym = R.simplify(rad, idx, cf);
  var text = R.toText(sym);
  ok(text === expected, (cf !== 1 ? cf : '') + R.radSymbol(idx) + rad + '  expected ' + expected + '  got ' + text);
  ok(R.verify(cf, rad, idx, sym), 'numeric verify failed for ' + expected);
});

// 2) generated items across every tier all verify + stay in range
console.log('— generated items —');
var tiers = ['perfect2', 'simple2', 'coeff2', 'neg2', 'perfect3', 'cube', 'cube_coeff', 'cube_neg', 'mixed'];
tiers.forEach(function (tier) {
  for (var i = 0; i < 200; i++) {
    var it = R.generate(tier);
    var sym = R.simplify(it.radicand, it.index, it.coeffFront);
    ok(R.verify(it.coeffFront, it.radicand, it.index, sym), 'generated ' + tier + ' failed verify: ' + JSON.stringify(it));
    var limit = it.index === 3 ? 250 : 300;
    ok(Math.abs(it.radicand) <= limit, 'radicand out of range (' + tier + '): ' + it.radicand);
    if (it.index === 2) ok(it.radicand >= 0, 'square root of negative generated: ' + JSON.stringify(it));
  }
});

// 3) every MC set: correct present, no duplicate-of-correct distractor, 4 options
console.log('— multiple-choice sets —');
for (var q = 0; q < 400; q++) {
  var item = R.generate('mixed');
  var mc = R.buildChoices(item);
  ok(mc.options.length === 4, 'expected 4 options, got ' + mc.options.length);
  ok(mc.options.some(function (o) { return R.key(o) === R.key(mc.correct); }), 'correct answer missing from options');
  var keys = mc.options.map(R.key);
  ok(new Set(keys).size === keys.length, 'duplicate options: ' + JSON.stringify(keys));
}

// 4) sanity: square root of a negative throws
console.log('— guards —');
var threw = false; try { R.simplify(-50, 2, 1); } catch (e) { threw = true; }
ok(threw, 'simplify should throw on sqrt of negative');

console.log('\n' + pass + ' passed, ' + fail + ' failed.');
process.exit(fail === 0 ? 0 : 1);
