/* ======================================================
   app.js — "Simplifying Radicals"
   welcome -> LEARN -> PRACTICE -> QUIZ -> results
   Reuses radicals.js for all math. ADHD-friendly, no calculator.
   ====================================================== */
(function () {
  'use strict';
  var R = window.Radicals;

  var stageEl = document.getElementById('stage');
  var footerEl = document.getElementById('footer');
  var stagesEl = document.getElementById('stages');
  var pillEl = document.getElementById('phase-pill');

  var SAVE_KEY = 'simprad_v1';
  function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; } }
  function save(patch) { var s = load(); Object.keys(patch).forEach(function (k) { s[k] = patch[k]; }); try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) {} }

  var state = { mode: 'welcome', learn: 0, we: 0, prac: 0, quiz: 0 };

  // ---------- radical HTML ----------
  function radHTML(coeff, radicand, index, size) {
    size = size || 'lg';
    if (radicand === 1) {
      return '<span class="radical ' + size + '"><span class="coef">' + coeff + '</span></span>';
    }
    var c = (coeff === 1) ? '' : (coeff === -1 ? '−' : String(coeff));
    var coefHTML = c ? '<span class="coef">' + c + '</span>' : '';
    var idx = (index === 3) ? '<span class="rad-index">3</span>' : '';
    return '<span class="radical ' + size + '">' + coefHTML +
      '<span class="radwrap">' + idx + '<span class="radsign"><span class="radbox">' + radicand + '</span></span></span></span>';
  }
  function symHTML(sym, size) { return radHTML(sym.coeff, sym.radicand, sym.index, size); }

  // flat prime list, e.g. 24 -> [2,2,2,3]
  function flatPrimes(n) {
    var f = R.primeFactor(n), out = [];
    Object.keys(f).map(Number).sort(function (a, b) { return a - b; }).forEach(function (p) {
      for (var i = 0; i < f[p]; i++) out.push(p);
    });
    return out;
  }
  // grouped tiles: full couples/triples ringed, leftover singles plain
  function groupedTilesHTML(n, index) {
    var f = R.primeFactor(n), html = '';
    Object.keys(f).map(Number).sort(function (a, b) { return a - b; }).forEach(function (p) {
      var e = f[p], groups = Math.floor(e / index), singles = e % index;
      for (var g = 0; g < groups; g++) {
        html += '<span class="group-ring">';
        for (var k = 0; k < index; k++) html += '<span class="tile">' + p + '</span>';
        html += '</span>';
      }
      for (var s = 0; s < singles; s++) html += '<span class="tile single">' + p + '</span>';
    });
    return '<span class="tiles">' + html + '</span>';
  }
  function plainTilesHTML(n) {
    return '<span class="tiles">' + flatPrimes(n).map(function (p) { return '<span class="tile">' + p + '</span>'; }).join('') + '</span>';
  }

  // ====================================================
  //  ROUTER + STAGE TRACKER
  // ====================================================
  function render() {
    renderStages();
    if (state.mode === 'welcome') return renderWelcome();
    if (state.mode === 'learn') return renderLearn();
    if (state.mode === 'practice') return renderPractice();
    if (state.mode === 'quiz') return renderQuiz();
    if (state.mode === 'results') return renderResults();
  }

  function renderStages() {
    if (state.mode === 'welcome') { stagesEl.innerHTML = ''; return; }
    var s = load();
    var chips = [
      { id: 'learn', label: 'Learn', n: 1, done: s.learnDone },
      { id: 'practice', label: 'Practice', n: 2, done: s.practiceDone },
      { id: 'quiz', label: 'Quiz', n: 3, done: s.bestQuiz != null }
    ];
    var active = (state.mode === 'results') ? 'quiz' : state.mode;
    stagesEl.innerHTML = chips.map(function (c) {
      var cls = 'stage-chip' + (c.id === active ? ' active' : (c.done ? ' done' : ''));
      return '<button class="' + cls + '" data-go="' + c.id + '"><span class="ix">' + c.n + '</span>' + c.label + (c.done ? ' ✓' : '') + '</button>';
    }).join('');
    stagesEl.querySelectorAll('[data-go]').forEach(function (b) {
      b.onclick = function () {
        var g = b.getAttribute('data-go');
        if (g === 'learn') { state.mode = 'learn'; state.learn = 0; state.we = 0; }
        else if (g === 'practice') { state.mode = 'practice'; state.prac = 0; PR = null; }
        else { state.mode = 'quiz'; state.quiz = 0; QUIZ = null; }
        render();
      };
    });
  }

  function dots(count, active) {
    var h = '';
    for (var i = 0; i < count; i++) h += '<span class="dot' + (i < active ? ' done' : '') + (i === active ? ' active' : '') + '"></span>';
    return '<div class="dots">' + h + '</div>';
  }

  // ====================================================
  //  WELCOME
  // ====================================================
  function renderWelcome() {
    pillEl.textContent = 'Start';
    var s = load();
    var best = (s.bestQuiz != null) ? '<p class="sub" style="margin-top:14px">Best quiz so far: <b style="color:var(--lime)">' + s.bestQuiz + '/' + QUIZ_LEN + '</b> — beat it!</p>' : '';
    stageEl.innerHTML =
      '<div class="card tall">' +
        '<div class="welcome-emoji">√</div>' +
        '<div class="eyebrow">9th Grade · Algebra 1</div>' +
        '<h1 class="big">Simplifying <span class="hl">Radicals</span></h1>' +
        '<p class="lede">Square roots <i>and</i> cube roots — by hand, no calculator.</p>' +
        '<p class="sub">Three stages: <b style="color:var(--lime)">Learn</b> the method, <b style="color:var(--lime)">Practice</b> it with help, then take a quick <b style="color:var(--lime)">Quiz</b>. The whole trick is one line: <b style="color:var(--lime)">couples or triples go out, singles stay in.</b></p>' +
        best +
      '</div>';
    footerEl.innerHTML = '<div class="grow"></div><button class="btn btn-primary btn-lg" id="go">🎾 Serve it up →</button>';
    document.getElementById('go').onclick = function () { state.mode = 'learn'; state.learn = 0; state.we = 0; render(); };
  }

  // ====================================================
  //  LEARN
  // ====================================================
  // 7 teaching screens + 5 worked examples
  var WORKED = [
    { coeff: 1, radicand: 24, index: 2 },
    { coeff: 1, radicand: 256, index: 2 },
    { coeff: 3, radicand: 8, index: 2 },
    { coeff: 1, radicand: 72, index: 3 },
    { coeff: 5, radicand: 250, index: 3 }
  ];
  var LEARN_LEN = 7 + WORKED.length;

  function renderLearn() {
    pillEl.textContent = 'Learn ' + (state.learn + 1) + '/' + LEARN_LEN;
    var teach = [learn1, learn2, learn3, learn4, learn5, learn6, learn7];
    var body;
    if (state.learn < 7) { body = teach[state.learn](); learnFooter(); }
    else { return renderWorked(state.learn - 7); }
    stageEl.innerHTML = dots(LEARN_LEN, state.learn) + body;
  }

  function learnFooter(nextLabel) {
    footerEl.innerHTML =
      (state.learn > 0 ? '<button class="btn btn-ghost" id="back">← Back</button>' : '<div></div>') +
      '<div class="grow"></div>' +
      '<button class="btn btn-primary" id="next">' + (nextLabel || 'Next →') + '</button>';
    var b = document.getElementById('back'); if (b) b.onclick = function () { state.learn--; state.we = 0; render(); };
    document.getElementById('next').onclick = function () {
      if (state.learn < LEARN_LEN - 1) { state.learn++; state.we = 0; render(); }
      else { save({ learnDone: true }); state.mode = 'practice'; state.prac = 0; PR = null; render(); }
    };
  }

  function learn1() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 1 · What a radical is</div>' +
      '<h1 class="big">A radical undoes an <span class="hl">exponent</span>.</h1>' +
      '<div class="compare">' +
        '<div class="col sq"><h3>Square root</h3><p>Index is <b>invisible</b> (it\'s a 2). Asks: what number times itself?</p><div class="ex">' + radHTML(1, 9, 2, 'lg') + ' = 3</div></div>' +
        '<div class="col cb"><h3>Cube root</h3><p>Has a small <b>3</b> tucked in front. Asks: what number cubed?</p><div class="ex">' + radHTML(1, 27, 3, 'lg') + ' = 3</div></div>' +
      '</div>' +
      '<div class="note warn"><b>Check the index FIRST.</b> Square root → think in <b>2</b>s. Cube root → think in <b>3</b>s. That one habit prevents most mistakes.</div>' +
    '</div>';
  }
  function learn2() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 2 · The one method</div>' +
      '<h1 class="big">Always build a <span class="hl">factor tree</span>.</h1>' +
      '<p class="lede">Break the number under the radical into its <b>prime</b> pieces — keep splitting until every branch is a prime.</p>' +
      '<div style="margin:10px 0">' + plainTilesHTML(24) + '</div>' +
      '<p class="sub">24 = 2 × 2 × 2 × 3. Now you can <i>see</i> the couples and singles.</p>' +
    '</div>';
  }
  function learn3() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 3 · The core rule</div>' +
      '<h1 class="big">The whole trick</h1>' +
      '<div class="method-phrase"><span class="out">Couples or triples go OUT</span><br>· <span class="in">singles STAY IN</span> ·</div>' +
      '<div class="compare">' +
        '<div class="col sq"><h3>Square root</h3><p>Hunt for <b>couples</b> (pairs of two).</p></div>' +
        '<div class="col cb"><h3>Cube root</h3><p>Hunt for <b>triples</b> (sets of three).</p></div>' +
      '</div>' +
      '<div class="note">One member of each group walks out front; whatever can\'t form a full group stays under the radical.</div>' +
    '</div>';
  }
  function learn4() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 4 · More than one group</div>' +
      '<h1 class="big">Multiples <span class="hl">multiply</span>.</h1>' +
      '<ul class="step-list">' +
        '<li><span class="num">×</span><span>Several couples/triples coming out? <b>Multiply them together</b> in front.</span></li>' +
        '<li><span class="num">×</span><span>Several singles staying in? <b>Multiply them together</b> under the radical.</span></li>' +
      '</ul>' +
      '<div class="note">Example: 2 and 3 both come out → 2 × 3 = <b>6</b> in front.</div>' +
    '</div>';
  }
  function learn5() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 5 · The #1 mistake</div>' +
      '<h1 class="big">Don\'t drop the <span class="hl">front number</span>.</h1>' +
      '<p class="lede">A coefficient already in front gets <b>multiplied</b> by whatever comes out.</p>' +
      '<div style="font-size:1.5rem;font-weight:800;margin:14px 0">' +
        radHTML(3, 8, 2, 'lg') + ' &nbsp;→&nbsp; 3 × ' + radHTML(2, 2, 2, 'sm') + ' &nbsp;=&nbsp; ' + radHTML(6, 2, 2, 'lg') +
      '</div>' +
      '<div class="note warn">The 2 from the couple comes out, but the <b>3 was already there</b> — multiply: 3 × 2 = 6. Forgetting it is the most common error.</div>' +
    '</div>';
  }
  function learn6() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 6 · Rational or irrational?</div>' +
      '<h1 class="big">When does it become a <span class="hl">whole number</span>?</h1>' +
      '<div class="compare">' +
        '<div class="col sq"><h3>Rational</h3><p>Everything pairs/triples up — <b>nothing stays under</b>. The radical disappears.</p><div class="ex">' + radHTML(1, 256, 2, 'lg') + ' = 16</div></div>' +
        '<div class="col cb"><h3>Irrational</h3><p>Something is left under the radical — it never ends or repeats.</p><div class="ex">' + radHTML(2, 6, 2, 'lg') + '</div></div>' +
      '</div>' +
      '<div class="note">If the radical is gone, the answer is <b>rational</b>. If a root is still hanging around, it\'s <b>irrational</b>.</div>' +
    '</div>';
  }
  function learn7() {
    return '<div class="card">' +
      '<div class="eyebrow">Step 7 · Always self-check</div>' +
      '<h1 class="big">Multiply it back.</h1>' +
      '<p class="lede">Multiply your prime factors back together — you should land right back on the original number.</p>' +
      '<div class="note">2 × 2 × 2 × 3 = 24 ✓ — if it doesn\'t match, a factor went missing. Quick, calculator-free, and it catches errors.</div>' +
      '<p class="sub" style="margin-top:16px">Ready? Let\'s watch a few, then you\'ll try.</p>' +
    '</div>';
  }

  // ----- worked examples (animated step reveal) -----
  function renderWorked(i) {
    var w = WORKED[i];
    var sym = R.simplify(w.radicand, w.index, w.coeff);
    var rootWord = w.index === 3 ? 'triples' : 'couples';
    var sizeName = w.index === 3 ? 'cube root' : 'square root';
    var caps = [
      'Start with ' + plainText(w.coeff, w.radicand, w.index) + '. It\'s a <b>' + sizeName + '</b> — so we hunt in <b>' + rootWord + '</b>.',
      'Factor tree → primes: <b>' + flatPrimes(w.radicand).join(' × ') + '</b>.',
      'Ring the <b>' + rootWord + '</b>. ' + (sym.radicand === 1 ? 'Everything groups up — nothing will be left under!' : 'Leftovers with no group will stay in.'),
      'Result: <b>' + R.toText(sym) + '</b>. ' + (sym.radicand === 1 ? 'No radical left → <b>rational</b>.' : 'A root is still under → <b>irrational</b>.') +
        (w.coeff !== 1 ? ' (Note the front ' + w.coeff + ' multiplied in!)' : '')
    ];
    var visual;
    if (state.we === 0) visual = symHTML({ coeff: w.coeff, radicand: w.radicand, index: w.index }, 'xl');
    else if (state.we === 1) visual = plainTilesHTML(w.radicand);
    else if (state.we === 2) visual = groupedTilesHTML(w.radicand, w.index);
    else visual = symHTML(sym, 'xl');

    stageEl.innerHTML = dots(LEARN_LEN, state.learn) +
      '<div class="card tall">' +
        '<div class="eyebrow">Watch one · ' + (i + 1) + ' of ' + WORKED.length + '</div>' +
        '<h1 class="big">' + plainText(w.coeff, w.radicand, w.index) + ' → <span class="hl">' + R.toText(sym) + '</span></h1>' +
        '<div class="we-stage">' + visual + '</div>' +
        '<div class="we-caption">' + caps[state.we] + '</div>' +
      '</div>';

    footerEl.innerHTML =
      '<button class="btn btn-ghost" id="back">← Back</button><div class="grow"></div>' +
      (state.we > 0 ? '<button class="btn btn-ghost" id="replay">↺ Replay</button>' : '') +
      (state.we < caps.length - 1 ? '<button class="btn btn-primary" id="step">▶ Next step</button>'
        : (state.learn < LEARN_LEN - 1 ? '<button class="btn btn-primary" id="nextEx">Next →</button>'
          : '<button class="btn btn-primary" id="toPractice">Start practicing →</button>'));
    document.getElementById('back').onclick = function () { if (state.we > 0) { state.we--; render(); } else { state.learn--; state.we = 0; render(); } };
    var rp = document.getElementById('replay'); if (rp) rp.onclick = function () { state.we = 0; render(); };
    var st = document.getElementById('step'); if (st) st.onclick = function () { state.we++; render(); };
    var nx = document.getElementById('nextEx'); if (nx) nx.onclick = function () { state.learn++; state.we = 0; render(); };
    var tp = document.getElementById('toPractice'); if (tp) tp.onclick = function () { save({ learnDone: true }); state.mode = 'practice'; state.prac = 0; PR = null; render(); };
  }
  function plainText(coeff, radicand, index) {
    var c = coeff === 1 ? '' : String(coeff);
    return c + R.radSymbol(index) + radicand;
  }

  // ====================================================
  //  PRACTICE
  // ====================================================
  var PRAC_TIERS = ['perfect2', 'simple2', 'simple2', 'coeff2', 'neg2', 'perfect3', 'cube', 'mixed'];
  var PRAC_LEN = PRAC_TIERS.length;
  var PR = null;       // current practice problem working state
  var streak = 0;

  function newProblem() {
    var item = R.generate(PRAC_TIERS[state.prac]);
    PR = {
      item: item,
      correct: R.simplify(item.radicand, item.index, item.coeffFront),
      sign: 1, hintLevel: 0, feedback: null, solved: false
    };
  }

  function renderPractice() {
    if (!PR) newProblem();
    pillEl.textContent = 'Practice ' + (state.prac + 1) + '/' + PRAC_LEN;
    var it = PR.item, correct = PR.correct;
    var needSign = (it.coeffFront < 0 || it.radicand < 0);
    var isPerfect = (correct.radicand === 1);

    stageEl.innerHTML = dots(PRAC_LEN, state.prac) +
      '<div class="problem-head">' +
        '<div class="streak">' + (streak > 0 ? '🔥 ' + streak + ' in a row' : 'Take your time — you\'ve got this.') + '</div>' +
      '</div>' +
      '<div class="stage-label">Simplify</div>' +
      '<div class="prompt-radical">' + symHTML({ coeff: it.coeffFront, radicand: it.radicand, index: it.index }, 'xl') + '</div>' +
      '<div class="assemble">Build the answer:</div>' +
      '<div class="fields">' +
        (needSign ? '<button class="sign-toggle' + (PR.sign < 0 ? ' neg' : '') + '" id="sign">' + (PR.sign < 0 ? '−' : '+') + '</button>' : '') +
        '<div class="field"><label>goes out in front</label>' +
          '<div class="field-row"><input class="num-input" id="outF" inputmode="numeric" placeholder="?" value="' + (PR.outF || '') + '"></div></div>' +
        '<div class="field"><label>stays under the ' + (it.index === 3 ? 'cube ' : '') + 'root</label>' +
          '<div class="field-row"><span class="under-mark">' + (it.index === 3 ? '<span class="index-hint">3</span>' : '') + '√</span>' +
          '<input class="num-input" id="inF" inputmode="numeric" placeholder="' + (isPerfect ? '1' : '?') + '" value="' + (PR.inF || '') + '"></div></div>' +
      '</div>' +
      (isPerfect ? '<p class="sub" style="margin-top:10px;font-size:.92rem">Perfect root? Put the whole number in front and leave the under-root as <b>1</b>.</p>' : '') +
      '<div class="hint-area" id="hintArea">' + (PR.hintLevel > 0 ? hintHTML() : '') + '</div>' +
      (PR.feedback ? feedbackHTML(PR.feedback) : '');

    var sb = document.getElementById('sign'); if (sb) sb.onclick = function () { PR.sign *= -1; captureFields(); render(); };
    document.getElementById('outF').oninput = function () { PR.outF = this.value; };
    document.getElementById('inF').oninput = function () { PR.inF = this.value; };

    footerEl.innerHTML =
      '<button class="btn btn-ghost" id="hintBtn">🌳 Show me the tree</button>' +
      '<div class="grow"></div>' +
      (PR.solved
        ? '<button class="btn btn-primary" id="nextP">' + (state.prac < PRAC_LEN - 1 ? 'Next →' : 'On to the quiz →') + '</button>'
        : '<button class="btn btn-primary" id="check">Check it</button>');
    document.getElementById('hintBtn').onclick = function () { captureFields(); PR.hintLevel = Math.min(PR.hintLevel + 1, flatPrimes(Math.abs(it.radicand)).length + 1); render(); };
    var ck = document.getElementById('check'); if (ck) ck.onclick = checkPractice;
    var np = document.getElementById('nextP'); if (np) np.onclick = function () {
      if (state.prac < PRAC_LEN - 1) { state.prac++; PR = null; render(); }
      else { save({ practiceDone: true }); state.mode = 'quiz'; state.quiz = 0; QUIZ = null; render(); }
    };
  }

  function captureFields() {
    var o = document.getElementById('outF'), i = document.getElementById('inF');
    if (o) PR.outF = o.value; if (i) PR.inF = i.value;
  }

  function hintHTML() {
    var rad = Math.abs(PR.item.radicand);
    var primes = flatPrimes(rad);
    var lvl = PR.hintLevel;
    if (lvl > primes.length) {
      // final: grouped tiles so they can read off the answer
      return '<div class="hint-tiles"><p class="sub" style="margin-bottom:10px">Now group into ' + (PR.item.index === 3 ? 'triples' : 'couples') + ':</p>' + groupedTilesHTML(rad, PR.item.index) + '</div>';
    }
    // running breakdown: pull out `lvl` primes
    var prod = 1, parts = [];
    for (var i = 0; i < lvl; i++) { parts.push(primes[i]); prod *= primes[i]; }
    var remaining = rad / prod;
    var line = parts.join(' × ') + (remaining > 1 ? ' × ' + remaining : '');
    return '<div class="hint-tiles"><p class="sub">' + rad + ' = <b style="color:var(--lime);font-size:1.2rem">' + line + '</b></p>' +
      '<p class="sub" style="margin-top:6px;font-size:.9rem">Tap again to factor further.</p></div>';
  }

  function checkPractice() {
    captureFields();
    var it = PR.item, correct = PR.correct;
    var needSign = (it.coeffFront < 0 || it.radicand < 0);
    var sign = needSign ? PR.sign : 1;
    var outAbs = parseInt(PR.outF, 10);
    var inRaw = (PR.inF == null || PR.inF === '') ? 1 : parseInt(PR.inF, 10);
    if (isNaN(outAbs)) { PR.feedback = { kind: 'bad', html: 'Pop a number in the <b>front</b> box first.' }; return render(); }
    if (isNaN(inRaw) || inRaw < 1) inRaw = 1;
    var userOut = sign * outAbs;

    if (userOut === correct.coeff && inRaw === correct.radicand) {
      streak++;
      PR.solved = true;
      var why = correct.radicand === 1
        ? 'every factor grouped up, so the radical disappears — that makes it <b>rational</b>.'
        : 'you pulled the full ' + (it.index === 3 ? 'triples' : 'couples') + ' out and left the singles in.';
      PR.feedback = { kind: 'good', html: '✅ <b>Yes!</b> ' + symHTML(correct, 'sm') + ' — ' + why + (it.coeffFront !== 1 && it.coeffFront !== -1 ? ' Nice catch multiplying the front number.' : '') };
      return render();
    }

    // --- diagnose the error type ---
    var msg = diagnose(it, correct, userOut, inRaw, sign);
    PR.feedback = { kind: 'bad', html: msg };
    if (streak > 0) streak = 0;
    render();
  }

  function diagnose(it, correct, userOut, inRaw, sign) {
    var noFront = R.simplify(it.radicand, it.index, it.coeffFront < 0 ? -1 : 1); // forgot-coefficient value
    var other = null; try { other = R.simplify(it.radicand, it.index === 2 ? 3 : 2, it.coeffFront); } catch (e) {}

    // 1) sign only
    if (Math.abs(userOut) === Math.abs(correct.coeff) && inRaw === correct.radicand && userOut !== correct.coeff) {
      return '⚠️ <b>Watch the sign on the coefficient.</b> Everything else is right — flip the + / − toggle.';
    }
    // 2) forgot the front coefficient
    if (Math.abs(it.coeffFront) !== 1 && Math.abs(userOut) === Math.abs(noFront.coeff) && inRaw === noFront.radicand && Math.abs(noFront.coeff) !== Math.abs(correct.coeff)) {
      return '⚠️ <b>Don\'t forget to multiply the number already in front.</b> The ' + Math.abs(it.coeffFront) + ' was there before you started — multiply it by what comes out.';
    }
    // 3) used the wrong index (pairs on a cube root, or triples on a square root)
    if (other && Math.abs(userOut) === Math.abs(other.coeff) && inRaw === other.radicand) {
      return '⚠️ <b>Check the index first.</b> This is a <b>' + (it.index === 3 ? 'cube root — it comes out in triples (threes)' : 'square root — it comes out in couples (pairs)') + '</b>, not ' + (it.index === 3 ? 'pairs' : 'triples') + '.';
    }
    // 4) left it unsimplified / not fully simplified
    var stillInside = R.simplify(inRaw, it.index, 1);
    if (inRaw === Math.abs(it.radicand) || stillInside.radicand !== inRaw) {
      return '⚠️ <b>There\'s still a perfect ' + (it.index === 3 ? 'cube' : 'square') + ' hiding in there</b> — keep factoring until the number under the root has no ' + (it.index === 3 ? 'triples' : 'couples') + ' left.';
    }
    // generic nudge
    return '❌ Not quite. Build the factor tree (use <b>🌳 Show me the tree</b>), ring the ' + (it.index === 3 ? 'triples' : 'couples') + ', send one of each out front, and keep the singles under the root.';
  }

  function feedbackHTML(fb) { return '<div class="feedback ' + (fb.kind === 'good' ? 'good' : 'bad') + '">' + fb.html + '</div>'; }

  // ====================================================
  //  QUIZ
  // ====================================================
  var QUIZ_PLAN = ['perfect2', 'simple2', 'coeff2', 'neg2', 'perfect3', 'cube', 'cube_neg', 'classify', 'mixed'];
  var QUIZ_LEN = QUIZ_PLAN.length;
  var QUIZ = null;

  function buildQuiz() {
    QUIZ = { qs: [], answers: [], score: 0 };
    QUIZ_PLAN.forEach(function (tier) {
      if (tier === 'classify') {
        // a rational-or-irrational item
        var rational = Math.random() < 0.5;
        var it = R.generate(rational ? (Math.random() < 0.5 ? 'perfect2' : 'perfect3') : (Math.random() < 0.5 ? 'simple2' : 'cube'));
        var sym = R.simplify(it.radicand, it.index, it.coeffFront);
        QUIZ.qs.push({ type: 'classify', item: it, sym: sym, isRational: sym.radicand === 1, tier: 'classify' });
      } else {
        var item = R.generate(tier);
        var mc = R.buildChoices(item);
        QUIZ.qs.push({ type: 'mc', item: item, correct: mc.correct, options: mc.options, tier: tier });
      }
    });
  }

  function renderQuiz() {
    if (!QUIZ) buildQuiz();
    if (state.quiz >= QUIZ_LEN) return renderResults();
    pillEl.textContent = 'Quiz ' + (state.quiz + 1) + '/' + QUIZ_LEN;
    var q = QUIZ.qs[state.quiz];
    var answered = QUIZ.answers[state.quiz] != null;

    var body = dots(QUIZ_LEN, state.quiz) + '<div class="quiz-q"><div class="quiz-count">Question ' + (state.quiz + 1) + ' of ' + QUIZ_LEN + '</div>';
    if (q.type === 'classify') {
      body += '<div class="stage-label">Rational or irrational?</div>' +
        '<div class="prompt-radical">' + symHTML(q.sym, 'xl') + '</div>' +
        '<div class="classify-choices">' +
          '<button class="mc-btn" data-c="rational"' + (answered ? ' disabled' : '') + '>Rational</button>' +
          '<button class="mc-btn" data-c="irrational"' + (answered ? ' disabled' : '') + '>Irrational</button>' +
        '</div>';
    } else {
      body += '<div class="stage-label">Simplify</div>' +
        '<div class="prompt-radical">' + symHTML({ coeff: q.item.coeffFront, radicand: q.item.radicand, index: q.item.index }, 'xl') + '</div>' +
        '<div class="mc-grid">' +
          q.options.map(function (o, idx) { return '<button class="mc-btn" data-i="' + idx + '"' + (answered ? ' disabled' : '') + '>' + symHTML(o, 'lg') + '</button>'; }).join('') +
        '</div>';
    }
    body += '</div>';
    if (answered) body += feedbackHTML(QUIZ.answers[state.quiz].fb);
    stageEl.innerHTML = body;

    if (!answered) {
      if (q.type === 'classify') {
        stageEl.querySelectorAll('[data-c]').forEach(function (b) {
          b.onclick = function () { answerClassify(q, b.getAttribute('data-c') === 'rational'); };
        });
      } else {
        stageEl.querySelectorAll('[data-i]').forEach(function (b) {
          b.onclick = function () { answerMC(q, parseInt(b.getAttribute('data-i'), 10), b); };
        });
      }
    }

    footerEl.innerHTML = '<button class="btn btn-ghost" id="reLearn">↺ Back to Learn</button><div class="grow"></div>' +
      (answered ? '<button class="btn btn-primary" id="nextQ">' + (state.quiz < QUIZ_LEN - 1 ? 'Next →' : 'See results →') + '</button>' : '');
    document.getElementById('reLearn').onclick = function () { state.mode = 'learn'; state.learn = 0; state.we = 0; render(); };
    var nq = document.getElementById('nextQ'); if (nq) nq.onclick = function () { state.quiz++; render(); };
  }

  function answerMC(q, idx, btn) {
    var chosen = q.options[idx];
    var right = R.key(chosen) === R.key(q.correct);
    if (right) QUIZ.score++;
    // mark buttons
    stageEl.querySelectorAll('[data-i]').forEach(function (b) {
      var o = q.options[parseInt(b.getAttribute('data-i'), 10)];
      b.disabled = true;
      if (R.key(o) === R.key(q.correct)) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
    var fb = right
      ? { kind: 'good', html: '✅ <b>Correct!</b> ' + symHTML(q.correct, 'sm') + '.' }
      : { kind: 'bad', html: '❌ The answer is ' + symHTML(q.correct, 'sm') + '. ' + missHint(q, chosen) };
    QUIZ.answers[state.quiz] = { right: right, fb: fb, tier: q.tier };
    render();
  }

  function answerClassify(q, saidRational) {
    var right = (saidRational === q.isRational);
    if (right) QUIZ.score++;
    var fb = right
      ? { kind: 'good', html: '✅ <b>Correct — ' + (q.isRational ? 'rational' : 'irrational') + '.</b> ' + (q.isRational ? 'No radical is left, so it\'s a whole number.' : 'A root is still under the radical, so it never ends or repeats.') }
      : { kind: 'bad', html: '❌ It\'s <b>' + (q.isRational ? 'rational' : 'irrational') + '</b> — ' + (q.isRational ? 'the radical fully simplifies to a whole number.' : 'there\'s still a root left under the radical.') };
    QUIZ.answers[state.quiz] = { right: right, fb: fb, tier: 'classify' };
    render();
  }

  function missHint(q, chosen) {
    // identify which error the chosen distractor encodes
    var it = q.item;
    var noFront = (Math.abs(it.coeffFront) !== 1) ? R.simplify(it.radicand, it.index, it.coeffFront < 0 ? -1 : 1) : null;
    var other = null; try { other = R.simplify(it.radicand, it.index === 2 ? 3 : 2, it.coeffFront); } catch (e) {}
    if (noFront && R.key(chosen) === R.key(noFront)) return 'You forgot to multiply the number out front.';
    if (other && R.key(chosen) === R.key(other)) return 'That used ' + (it.index === 3 ? 'pairs on a cube root — cube roots need triples' : 'triples on a square root — square roots need pairs') + '.';
    if (chosen.radicand === Math.abs(it.radicand) && chosen.coeff === it.coeffFront) return 'That\'s the original, still unsimplified.';
    if (chosen.coeff === -q.correct.coeff && chosen.radicand === q.correct.radicand) return 'Watch the sign.';
    return 'Build the tree and group carefully.';
  }

  // ====================================================
  //  RESULTS
  // ====================================================
  function renderResults() {
    pillEl.textContent = 'Results';
    var score = QUIZ.score, pct = Math.round(score / QUIZ_LEN * 100);
    var prev = load().bestQuiz;
    var best = (prev == null || score > prev) ? score : prev;
    save({ bestQuiz: best });

    var TIER_NAME = {
      perfect2: 'Perfect squares', simple2: 'Square roots', coeff2: 'With a coefficient',
      neg2: 'Negative coefficient', perfect3: 'Perfect cubes', cube: 'Cube roots',
      cube_neg: 'Cube roots (negative)', classify: 'Rational vs irrational', mixed: 'Mixed'
    };
    var missed = [];
    QUIZ.answers.forEach(function (a) { if (a && !a.right) { var n = TIER_NAME[a.tier] || a.tier; if (missed.indexOf(n) < 0) missed.push(n); } });

    var reviewRows = QUIZ.qs.map(function (q, i) {
      var a = QUIZ.answers[i] || {};
      var label = (q.type === 'classify') ? symHTML(q.sym, 'sm') + ' &nbsp;<span style="color:var(--muted)">(rational?)</span>'
        : symHTML({ coeff: q.item.coeffFront, radicand: q.item.radicand, index: q.item.index }, 'sm') + ' = ' + symHTML(q.correct, 'sm');
      return '<li>' + label + '<span class="mark ' + (a.right ? 'ok' : 'no') + '">' + (a.right ? '✓' : '✗') + '</span></li>';
    }).join('');

    var cheer = pct === 100 ? 'Perfect serve! 🎾' : pct >= 75 ? 'Strong work — almost there.' : pct >= 50 ? 'Good start. A little review and you\'ve got it.' : 'No worries — replay Learn and try again. Everyone starts here.';

    stageEl.innerHTML =
      '<div class="card tall">' +
        '<div class="trophy">' + (pct >= 75 ? '🏆' : '🎾') + '</div>' +
        '<h1 class="big">Quiz <span class="hl">complete</span></h1>' +
        '<div class="results-score">' + score + '/' + QUIZ_LEN + '</div>' +
        '<div class="results-bar"><span style="width:' + pct + '%"></span></div>' +
        '<p class="lede">' + cheer + '</p>' +
        (missed.length ? '<div class="note warn"><b>Review these:</b> ' + missed.join(', ') + '.</div>' : '<div class="note"><b>Nailed every concept.</b> 🔥</div>') +
        '<ul class="review-list">' + reviewRows + '</ul>' +
      '</div>';
    footerEl.innerHTML =
      '<button class="btn btn-ghost" id="reLearn2">↺ Review Learn</button>' +
      '<div class="grow"></div>' +
      '<button class="btn btn-ghost" id="rePractice">Practice more</button>' +
      '<button class="btn btn-primary" id="retake">Retake quiz</button>';
    document.getElementById('reLearn2').onclick = function () { state.mode = 'learn'; state.learn = 0; state.we = 0; render(); };
    document.getElementById('rePractice').onclick = function () { state.mode = 'practice'; state.prac = 0; PR = null; render(); };
    document.getElementById('retake').onclick = function () { state.mode = 'quiz'; state.quiz = 0; QUIZ = null; render(); };
  }

  // ---------- boot ----------
  render();
})();
