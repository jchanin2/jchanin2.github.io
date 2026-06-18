/* Headless smoke test: load the REAL app.js against a tiny DOM shim and
   drive welcome -> LEARN -> PRACTICE -> QUIZ -> results for several problem
   types, catching any runtime error. Run:  node headless_smoke.js          */
var fs = require('fs');
var Radicals = require('./radicals.js');
var APP_SRC = fs.readFileSync(__dirname + '/app.js', 'utf8');

// ---- selector parser (only the data-* selectors app.js uses) ----
function parseSel(html, sel, cache) {
  if (cache[sel]) return cache[sel];
  var attr = (sel.match(/\[data-([a-z]+)\]/) || [])[1];
  var out = [];
  if (attr) {
    var re = new RegExp('data-' + attr + '="([^"]*)"', 'g'), m;
    while ((m = re.exec(html))) out.push(stubEl({ ['data-' + attr]: m[1] }));
  }
  cache[sel] = out;
  return out;
}
function stubEl(attrs) {
  attrs = attrs || {};
  var el = {
    value: '', textContent: '', style: {}, _onclick: null, _html: '', _cache: {},
    classList: { add: function () {}, remove: function () {}, contains: function () { return false; } },
    setAttribute: function (k, v) { attrs[k] = v; },
    getAttribute: function (k) { return attrs[k] != null ? attrs[k] : null; },
    focus: function () {}, appendChild: function () {}, remove: function () {},
    addEventListener: function (ev, fn) { if (ev === 'click') this._onclick = fn; },
    querySelectorAll: function (s) { return parseSel(this._html, s, this._cache); },
    querySelector: function (s) { return this.querySelectorAll(s)[0] || null; }
  };
  Object.defineProperty(el, 'onclick', { get: function () { return this._onclick; }, set: function (f) { this._onclick = f; } });
  Object.defineProperty(el, 'innerHTML', { get: function () { return this._html; }, set: function (h) { this._html = h; this._cache = {}; } });
  return el;
}

function makeDoc() {
  var ids = {};
  return {
    _ids: ids,
    getElementById: function (id) { if (!ids[id]) ids[id] = stubEl(); return ids[id]; },
    querySelectorAll: function () { return []; },
    addEventListener: function () {}
  };
}

function run(label, item, recipe) {
  var doc = makeDoc();
  var store = {};
  var R2 = Object.assign({}, Radicals, { generate: function () { return Object.assign({}, item); } });
  var sandbox = {
    window: { Radicals: R2 },
    document: doc,
    localStorage: { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = v; } },
    Math: Math, parseInt: parseInt, isNaN: isNaN, Set: Set, JSON: JSON, Object: Object, Array: Array, String: String
  };
  sandbox.window.document = doc;
  var click = function (id) { var e = doc._ids[id]; if (e && e._onclick) { e._onclick.call(e); return true; } return false; };
  var clickQ = function (sel, i) { var a = doc.getElementById('stage').querySelectorAll(sel); if (a[i] && a[i]._onclick) { a[i]._onclick.call(a[i]); return true; } return false; };
  var setField = function (id, v) { doc.getElementById(id).value = v; };

  // execute app.js inside the sandbox
  var fn = new Function('window', 'document', 'localStorage', APP_SRC);
  fn(sandbox.window, doc, sandbox.localStorage);   // boots at render() -> welcome

  click('go');                                     // -> learn 0
  // walk all of LEARN (teaching + worked examples) into practice
  for (var guard = 0; guard < 80; guard++) {
    if (click('next')) continue;
    if (click('step')) continue;
    if (click('nextEx')) continue;
    if (click('toPractice')) break;
  }
  // PRACTICE: solve each problem with the recipe, advance
  for (var p = 0; p < 8; p++) {
    click('hintBtn'); click('hintBtn');            // exercise the hint
    if (recipe.signFlip) click('sign');
    setField('outF', recipe.outF); setField('inF', recipe.inF);
    click('check');                                // should solve
    if (!click('nextP')) { /* not solved -> try once more */ click('check'); click('nextP'); }
  }
  // QUIZ: answer every question (option 0 or classify), advance
  for (var q = 0; q < 12; q++) {
    if (!clickQ('[data-i]', 0)) clickQ('[data-c]', 0);
    if (!click('nextQ')) break;
  }
  // results: bounce around the replay buttons
  click('retake'); click('reLearn2');
  console.log('  ✓ ' + label + ' — drove welcome→learn→practice→quiz→results with no error');
}

var passes = [
  ['square √50', { coeffFront: 1, radicand: 50, index: 2 }, { outF: '5', inF: '2', signFlip: false }],
  ['perfect √256', { coeffFront: 1, radicand: 256, index: 2 }, { outF: '16', inF: '', signFlip: false }],
  ['coeff 3√8', { coeffFront: 3, radicand: 8, index: 2 }, { outF: '6', inF: '2', signFlip: false }],
  ['neg -2√48', { coeffFront: -2, radicand: 48, index: 2 }, { outF: '8', inF: '3', signFlip: true }],
  ['cube ∛250', { coeffFront: 1, radicand: 250, index: 3 }, { outF: '5', inF: '2', signFlip: false }],
  ['cube-neg ∛-250', { coeffFront: 1, radicand: -250, index: 3 }, { outF: '5', inF: '2', signFlip: true }]
];

var failed = 0;
passes.forEach(function (p) {
  try { run(p[0], p[1], p[2]); }
  catch (e) { failed++; console.log('  ✗ ' + p[0] + ' THREW: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')); }
});
console.log(failed === 0 ? '\nAll UI flows ran clean.' : '\n' + failed + ' flow(s) errored.');
process.exit(failed === 0 ? 0 : 1);
