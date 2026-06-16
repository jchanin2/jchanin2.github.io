/* ======================================================
   Hidden Factors — Simplifying Square Roots
   Vanilla JS. Two parts: INSTRUCTION then GUIDED PRACTICE.
   Square roots only. No calculator. ADHD-friendly.
   ====================================================== */
(function () {
  'use strict';

  // ---------- DOM ----------
  var stageEl = document.getElementById('stage');
  var footerEl = document.getElementById('footer');
  var progressEl = document.getElementById('progress');
  var pillEl = document.getElementById('phase-pill');

  // ---------- math helpers ----------
  function isPrime(n) {
    if (n < 2) return false;
    for (var i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }
  function factorPairs(n) {           // non-trivial pairs a<=b (excludes 1×n)
    var out = [];
    for (var a = 2; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]);
    return out;
  }
  function primeFactorize(n) {        // sorted ascending, e.g. 72 -> [2,2,2,3,3]
    var f = [], m = n, p = 2;
    while (p * p <= m) { if (m % p === 0) { f.push(p); m /= p; } else p++; }
    if (m > 1) f.push(m);
    return f;
  }
  function countMap(arr) {
    var c = {}; arr.forEach(function (v) { c[v] = (c[v] || 0) + 1; }); return c;
  }

  // ---------- problems ----------
  var PROBLEMS = [
    { n: 25, coeff: 1, intro: 'Warm-up. √25 is a <b>perfect square</b> — its tree pairs up perfectly and nothing is left inside.' },
    { n: 50, coeff: 1, tennis: true, intro: '🎾 A square section of a tennis court has an area of <b>50 ft²</b>. Each side is the square root of the area, so the side length is <b>√50</b>. How long is one side?' },
    { n: 18, coeff: 1, intro: '√18 — build the tree and find the couple.' },
    { n: 72, coeff: 1, intro: '√72 has <b>more than one couple</b>. Take your time — send each couple out one at a time.' },
    { n: 200, coeff: 1, intro: '√200 — a big one, but the rules never change.' },
    { n: 12, coeff: 2, intro: 'Now there\'s a number <b>already out front</b>: 2√12. Whatever leaves the radical will <b>multiply</b> that 2.' }
  ];

  // ---------- state ----------
  var state = {
    mode: 'welcome',     // welcome | instruction | practice | done
    instr: 0,            // 0..3
    we: 0,               // worked-example sub-step
    prob: 0,             // problem index
    results: []          // {label, answer}
  };

  // ====================================================
  //  RENDER ROUTER
  // ====================================================
  function render() {
    if (state.mode === 'welcome') return renderWelcome();
    if (state.mode === 'instruction') return renderInstruction();
    if (state.mode === 'practice') return renderPractice();
    if (state.mode === 'done') return renderDone();
  }

  function setProgress(count, activeIndex, doneUpTo) {
    var html = '';
    for (var i = 0; i < count; i++) {
      var cls = 'dot';
      if (i < (doneUpTo == null ? activeIndex : doneUpTo)) cls += ' done';
      if (i === activeIndex) cls += ' active';
      html += '<span class="' + cls + '"></span>';
    }
    progressEl.innerHTML = html;
  }

  // ====================================================
  //  WELCOME
  // ====================================================
  function renderWelcome() {
    pillEl.textContent = 'Start';
    progressEl.innerHTML = '';
    stageEl.innerHTML =
      '<div class="card tall">' +
        '<div class="welcome-emoji">√</div>' +
        '<div class="eyebrow">9th Grade · Algebra</div>' +
        '<h1 class="big">Hidden <span class="hl">Factors</span></h1>' +
        '<p class="lede">Simplifying square roots with a factor tree.</p>' +
        '<p class="sub">Two short parts: first a quick lesson, then you\'ll do it yourself. No calculator — just smart factoring. The whole trick is four words: <b style="color:var(--lime)">couples go out, singles stay in.</b></p>' +
      '</div>';
    footerEl.innerHTML = '<div class="grow"></div><button class="btn btn-primary btn-lg" id="go">Start the lesson →</button>';
    document.getElementById('go').onclick = function () { state.mode = 'instruction'; state.instr = 0; render(); };
  }

  // ====================================================
  //  INSTRUCTION  (4 click-through screens)
  // ====================================================
  function renderInstruction() {
    pillEl.textContent = 'Lesson ' + (state.instr + 1) + '/4';
    setProgress(4, state.instr);
    var screens = [instrRealNumbers, instrMethod, instrWorkedExample, instrNoCalc];
    screens[state.instr]();
    // worked-example manages its own footer; others use the shared one
    if (state.instr !== 2) instrFooter();
  }

  function instrFooter(nextLabel) {
    footerEl.innerHTML =
      (state.instr > 0 ? '<button class="btn btn-ghost" id="back">← Back</button>' : '<div></div>') +
      '<div class="grow"></div>' +
      '<button class="btn btn-primary" id="next">' + (nextLabel || 'Next →') + '</button>';
    var b = document.getElementById('back');
    if (b) b.onclick = function () { state.instr--; state.we = 0; render(); };
    document.getElementById('next').onclick = function () {
      if (state.instr < 3) { state.instr++; state.we = 0; render(); }
      else { state.mode = 'practice'; state.prob = 0; render(); }
    };
  }

  // --- Screen 1: real numbers quick-classify ---
  function instrRealNumbers() {
    stageEl.innerHTML =
      '<div class="card">' +
        '<div class="eyebrow">Lesson 1 · Two kinds of numbers</div>' +
        '<h1 class="big">When is a root <span class="hl">“nice”</span>?</h1>' +
        '<div class="compare">' +
          '<div class="col rat"><h3>Rational</h3><p>Ends or repeats. Can be written as a fraction.</p><div class="ex">√9 = 3</div></div>' +
          '<div class="col irr"><h3>Irrational</h3><p>Goes forever with <b>no repeating pattern</b> — non-terminating <i>and</i> non-repeating.</p><div class="ex">√12 = 3.4641…</div></div>' +
        '</div>' +
        '<p class="sub">A few <b>perfect squares</b> have whole-number roots:</p>' +
        '<div class="chips">' +
          '<span class="chip">√4 = <b>2</b></span>' +
          '<span class="chip">√9 = <b>3</b></span>' +
          '<span class="chip">√16 = <b>4</b></span>' +
          '<span class="chip">√25 = <b>5</b></span>' +
          '<span class="chip">√36 = <b>6</b></span>' +
        '</div>' +
        '<div class="note">√9 lands on a whole number, so it\'s done. √12 doesn\'t — so we <b>simplify</b> it into its hidden factors.</div>' +
      '</div>';
  }

  // --- Screen 2: the method language ---
  function instrMethod() {
    stageEl.innerHTML =
      '<div class="card">' +
        '<div class="eyebrow">Lesson 2 · The method</div>' +
        '<h1 class="big">Couples &amp; singles</h1>' +
        '<ul class="step-list">' +
          '<li><span class="num">1</span><span>Build a <b>factor tree</b> — keep splitting until every branch ends on a <b>prime</b> number.</span></li>' +
          '<li><span class="num">2</span><span>Then follow the one rule:</span></li>' +
        '</ul>' +
        '<div class="method-phrase"><span class="out">COUPLES go out</span> · <span class="in">SINGLES stay in</span></div>' +
        '<div class="note">A <b>couple</b> is two of the <b>same</b> prime (like 5 and 5). For square roots, we hunt in <b>pairs of two</b>. <b>(Square roots only — no cube roots yet.)</b></div>' +
      '</div>';
  }

  // --- Screen 3: animated worked example  √12 → 2√3 ---
  function instrWorkedExample() {
    var caps = [
      'Here\'s √12. 12 isn\'t a perfect square — so let\'s find its hidden factors.',
      'Factor tree: 12 → 2 × 6 → 2 × 2 × 3. The branches end on primes: <b>2, 2, 3</b>.',
      'Spot the <b style="color:var(--lime)">couple</b> — two 2s. Couples go out!',
      'Just <b>one</b> 2 walks outside. Its partner\'s job is done. The lonely <b>3</b> has no pair, so it <b>stays in</b>.',
      '√12 = <b style="color:var(--lime)">2√3</b>. (And 2√3 is irrational — √3 never ends or repeats.)'
    ];
    var leaves =
      '<span class="tile" id="t2a">2</span>' +
      '<span class="tile" id="t2b">2</span>' +
      '<span class="tile single">3</span>';
    var visual = '';
    if (state.we === 0) {
      visual = radicalHTML(1, '<span class="tile">12</span>');
    } else if (state.we === 1) {
      visual = miniTree12();
    } else if (state.we === 2) {
      visual = '<div class="work-row" id="lr">' + leaves + '</div>';
    } else if (state.we === 3) {
      visual = '<div class="work-row"><span class="tile fly-out">2</span>' +
               radicalHTML(1, '<span class="tile single">3</span>') + '</div>';
    } else {
      visual = radicalHTML(2, '<span class="tile single">3</span>');
    }
    stageEl.innerHTML =
      '<div class="card tall">' +
        '<div class="eyebrow">Lesson 3 · Watch one</div>' +
        '<h1 class="big">√12 → <span class="hl">2√3</span></h1>' +
        '<div class="we-stage">' + visual + '</div>' +
        '<div class="we-caption">' + caps[state.we] + '</div>' +
      '</div>';
    if (state.we === 2) {
      // ring the couple
      setTimeout(function () {
        var a = document.getElementById('t2a'), b = document.getElementById('t2b');
        if (a) a.classList.add('couple-ring'); if (b) b.classList.add('couple-ring');
      }, 60);
    }
    // footer for the worked example
    footerEl.innerHTML =
      '<button class="btn btn-ghost" id="back">← Back</button>' +
      '<div class="grow"></div>' +
      (state.we > 0 ? '<button class="btn btn-ghost" id="replay">↺ Replay</button>' : '') +
      (state.we < caps.length - 1
        ? '<button class="btn btn-primary" id="step">▶ Next step</button>'
        : '<button class="btn btn-primary" id="next">Next →</button>');
    document.getElementById('back').onclick = function () {
      if (state.we > 0) { state.we--; render(); }
      else { state.instr--; render(); }
    };
    var rp = document.getElementById('replay'); if (rp) rp.onclick = function () { state.we = 0; render(); };
    var st = document.getElementById('step'); if (st) st.onclick = function () { state.we++; render(); };
    var nx = document.getElementById('next'); if (nx) nx.onclick = function () { state.instr++; state.we = 0; render(); };
  }

  function miniTree12() {
    return '<div class="tree-wrap"><div class="tree"><ul>' +
      '<li><button class="tnode root" disabled>12</button><ul>' +
        '<li><button class="tnode prime" disabled>2</button></li>' +
        '<li><button class="tnode" disabled style="border-color:var(--lime);color:var(--lime)">6</button><ul>' +
          '<li><button class="tnode prime" disabled>2</button></li>' +
          '<li><button class="tnode prime" disabled>3</button></li>' +
        '</ul></li>' +
      '</ul></li>' +
    '</ul></div></div>';
  }

  // --- Screen 4: no-calculator factoring trick ---
  function instrNoCalc() {
    stageEl.innerHTML =
      '<div class="card">' +
        '<div class="eyebrow">Lesson 4 · No calculator needed</div>' +
        '<h1 class="big">Stuck? Just <span class="hl">divide</span>.</h1>' +
        '<ul class="step-list">' +
          '<li><span class="num">÷</span><span>Hard to factor? Divide by the smallest prime that fits. <b>50 ÷ 2 = 25</b>, then <b>25 ÷ 5 = 5</b>. Done.</span></li>' +
          '<li><span class="num">★</span><span>Try the small primes in order: <b>2, 3, 5, 7…</b></span></li>' +
        '</ul>' +
        '<div class="note">Already have a number <b>out front</b>? It <b>multiplies</b> whatever comes out. <br><b>2·√12 → 2·(2√3) → 4√3.</b></div>' +
      '</div>';
    instrFooter('Start practicing →');
  }

  // shared radical builder: coeff (1 = hide), innerHTML for the radbox
  function radicalHTML(coeff, inner) {
    var c = (coeff && coeff !== 1) ? '<span class="coef">' + coeff + '</span>' : '';
    return '<span class="radical">' + c + '<span class="radsign"><span class="radbox">' + inner + '</span></span></span>';
  }

  // ====================================================
  //  PRACTICE
  // ====================================================
  var cur = null;  // current problem working state

  function startProblem() {
    var p = PROBLEMS[state.prob];
    var root = { v: p.n, id: 1, kids: null };
    cur = {
      p: p,
      root: root,
      idc: 2,
      stage: 'tree',         // tree | couples | classify | reveal
      // couples stage:
      pairs: [], singles: [], outProduct: p.coeff, sentValues: [],
      activePair: -1,
      chooserId: null,       // node id awaiting factor choice
      feedback: null,
      classified: false, classifyCorrect: false
    };
    render();
  }

  function renderPractice() {
    if (!cur || cur.p !== PROBLEMS[state.prob]) { startProblem(); return; }
    pillEl.textContent = 'Practice ' + (state.prob + 1) + '/' + PROBLEMS.length;
    setProgress(PROBLEMS.length, state.prob, state.prob);
    if (cur.stage === 'tree') return renderTreeStage();
    if (cur.stage === 'couples') return renderCouplesStage();
    if (cur.stage === 'classify') return renderClassifyStage();
  }

  // ---------- TREE STAGE ----------
  function findNode(node, id) {
    if (node.id === id) return node;
    if (node.kids) { for (var i = 0; i < node.kids.length; i++) { var r = findNode(node.kids[i], id); if (r) return r; } }
    return null;
  }
  function treeDone(node) {
    if (!node.kids) return isPrime(node.v);
    return node.kids.every(treeDone);
  }
  function renderTreeNode(node, isRoot) {
    var composite = !node.kids && !isPrime(node.v);
    var prime = !node.kids && isPrime(node.v);
    var cls = 'tnode' + (isRoot ? ' root' : '') + (composite ? ' composite' : '') + (prime ? ' prime' : '');
    var html = '<li><button class="' + cls + '" data-id="' + node.id + '"' + (composite ? '' : ' disabled') + '>' + node.v + '</button>';
    if (node.kids) html += '<ul>' + node.kids.map(function (k) { return renderTreeNode(k, false); }).join('') + '</ul>';
    return html + '</li>';
  }

  function renderTreeStage() {
    var p = cur.p;
    var done = treeDone(cur.root);
    stageEl.innerHTML =
      '<div class="problem-intro' + (p.tennis ? ' tennis' : '') + '">' + p.intro + '</div>' +
      '<div class="stage-label">Step 1 · Factor tree</div>' +
      '<div class="big-target">Simplify ' + radicalHTML(p.coeff, '<span style="color:var(--ink)">' + p.n + '</span>') + '</div>' +
      '<p class="sub" style="margin-bottom:14px">' +
        (done ? '✅ Every branch ends on a <b>prime</b>. Now collect the couples →'
              : 'Tap a <b style="color:var(--lime)">glowing</b> number to split it into two factors. Keep going until every branch is prime.') +
      '</p>' +
      '<div class="tree-wrap"><div class="tree"><ul>' + renderTreeNode(cur.root, true) + '</ul></div></div>' +
      (cur.chooserId != null ? factorSheet(findNode(cur.root, cur.chooserId)) : '');

    // wire composite nodes
    stageEl.querySelectorAll('.tnode.composite').forEach(function (btn) {
      btn.onclick = function () { cur.chooserId = parseInt(btn.getAttribute('data-id'), 10); render(); };
    });
    // wire factor sheet
    if (cur.chooserId != null) wireFactorSheet();

    footerEl.innerHTML =
      '<button class="btn btn-ghost" id="restartTree">↺ Restart tree</button>' +
      '<div class="grow"></div>' +
      '<button class="btn btn-primary" id="toCouples"' + (done ? '' : ' disabled') + '>Find the couples →</button>';
    document.getElementById('restartTree').onclick = function () { startProblem(); };
    document.getElementById('toCouples').onclick = function () { enterCouples(); };
  }

  function factorSheet(node) {
    var pairs = factorPairs(node.v);
    var opts = pairs.map(function (pr) {
      return '<button class="factor-opt" data-a="' + pr[0] + '" data-b="' + pr[1] + '">' + pr[0] + ' × ' + pr[1] + '</button>';
    }).join('');
    // no-calculator helper
    var smallest = pairs.length ? pairs[0][0] : null;
    var hint = smallest ? ('Stuck? Divide by the smallest prime that fits: ' + node.v + ' ÷ ' + smallest + ' = ' + (node.v / smallest) + '.') : '';
    return '<div class="sheet-backdrop" id="sheetBd"><div class="sheet">' +
      '<h3>Split ' + node.v + ' into two factors</h3>' +
      '<div class="hint-line">' + hint + '</div>' +
      '<div class="factor-options">' + opts + '</div>' +
      '<div class="sheet-actions"><button class="btn btn-ghost" id="sheetCancel">Cancel</button></div>' +
    '</div></div>';
  }
  function wireFactorSheet() {
    var node = findNode(cur.root, cur.chooserId);
    stageEl.querySelectorAll('.factor-opt').forEach(function (btn) {
      btn.onclick = function () {
        var a = parseInt(btn.getAttribute('data-a'), 10);
        var b = parseInt(btn.getAttribute('data-b'), 10);
        node.kids = [{ v: a, id: cur.idc++, kids: null }, { v: b, id: cur.idc++, kids: null }];
        cur.chooserId = null;
        render();
      };
    });
    document.getElementById('sheetCancel').onclick = function () { cur.chooserId = null; render(); };
    document.getElementById('sheetBd').onclick = function (e) { if (e.target.id === 'sheetBd') { cur.chooserId = null; render(); } };
  }

  // ---------- COUPLES STAGE ----------
  function collectLeaves(node, acc) {
    if (!node.kids) { acc.push(node.v); return; }
    node.kids.forEach(function (k) { collectLeaves(k, acc); });
  }
  function enterCouples() {
    var leaves = []; collectLeaves(cur.root, leaves);
    var counts = countMap(leaves);
    var pairs = [], singles = [];
    Object.keys(counts).map(Number).sort(function (a, b) { return a - b; }).forEach(function (v) {
      var c = counts[v];
      for (var i = 0; i < Math.floor(c / 2); i++) pairs.push({ v: v, sent: false });
      if (c % 2 === 1) singles.push({ v: v });
    });
    cur.pairs = pairs; cur.singles = singles;
    cur.outProduct = cur.p.coeff; cur.sentValues = [];
    cur.activePair = -1; cur.feedback = null;
    cur.stage = 'couples';
    render();
  }

  function outsideZoneHTML() {
    var terms = [];
    if (cur.p.coeff !== 1) terms.push(cur.p.coeff);
    cur.sentValues.forEach(function (v) { terms.push(v); });
    if (terms.length === 0) return '<span class="outside-zone"><span class="empty">＿</span></span>';
    if (terms.length === 1) return '<span class="outside-zone">' + terms[0] + '</span>';
    var prod = terms.reduce(function (a, b) { return a * b; }, 1);
    return '<span class="outside-zone">' + terms.join(' × ') + ' = ' + prod + '</span>';
  }

  function renderCouplesStage() {
    var p = cur.p;
    // radical contents: unsent couples + singles
    var inner = '';
    cur.pairs.forEach(function (pr, i) {
      if (pr.sent) return;
      inner += '<span class="couple" data-pair="' + i + '"><span class="tile">' + pr.v + '</span><span class="tile">' + pr.v + '</span></span>';
    });
    cur.singles.forEach(function (s) {
      inner += '<span class="single-wrap"><span class="tile single">' + s.v + '</span></span>';
    });
    if (inner === '') inner = '<span class="tile single" style="opacity:.5">1</span>';

    var allSent = cur.pairs.every(function (pr) { return pr.sent; });

    stageEl.innerHTML =
      '<div class="problem-intro' + (p.tennis ? ' tennis' : '') + '">' + p.intro + '</div>' +
      '<div class="stage-label">Step 2 · Couples go out, singles stay in</div>' +
      '<p class="sub" style="margin-bottom:10px">' +
        (allSent ? 'Nice — every couple is out. Singles stay inside. Ready to read the answer →'
                 : 'Tap a <b style="color:var(--lime)">couple</b> (two of the same number) to send it out.') +
      '</p>' +
      '<div class="work"><div class="work-row">' +
        outsideZoneHTML() +
        '<span class="radical"><span class="radsign"><span class="radbox" style="font-size:1rem">' + inner + '</span></span></span>' +
      '</div></div>' +
      (cur.activePair >= 0 ? coupleChoiceHTML(cur.pairs[cur.activePair].v) : '') +
      (cur.feedback ? feedbackHTML(cur.feedback) : '');

    // wire couples
    stageEl.querySelectorAll('.couple').forEach(function (c) {
      c.onclick = function () {
        cur.activePair = parseInt(c.getAttribute('data-pair'), 10);
        cur.feedback = null; render();
      };
    });
    // tapping a single → gentle correction
    stageEl.querySelectorAll('.single-wrap').forEach(function (s) {
      s.onclick = function () {
        cur.feedback = { kind: 'bad', html: '<b>Singles stay inside!</b> A lonely number has no partner, so it can\'t leave the radical. Only <b>couples</b> go out.' };
        cur.activePair = -1; render();
      };
    });
    // wire couple choice
    if (cur.activePair >= 0) wireCoupleChoice();

    footerEl.innerHTML =
      '<button class="btn btn-ghost" id="backTree">← Tree</button>' +
      '<div class="grow"></div>' +
      '<button class="btn btn-primary" id="toClassify"' + (allSent ? '' : ' disabled') + '>Read the answer →</button>';
    document.getElementById('backTree').onclick = function () { cur.stage = 'tree'; render(); };
    document.getElementById('toClassify').onclick = function () { cur.stage = 'classify'; cur.feedback = null; render(); };
  }

  function coupleChoiceHTML(v) {
    return '<div class="couple-choice">' +
      '<p>The couple of <b>' + v + '</b>s is leaving the radical. What goes <b>outside</b>?</p>' +
      '<div class="choices">' +
        '<button class="btn btn-primary" id="sendOne">Send ONE out → ' + v + '</button>' +
        '<button class="btn btn-ghost" id="sendBoth">Multiply them → ' + v + '×' + v + ' = ' + (v * v) + '</button>' +
      '</div></div>';
  }
  function wireCoupleChoice() {
    var pr = cur.pairs[cur.activePair];
    var v = pr.v;
    document.getElementById('sendOne').onclick = function () {
      pr.sent = true;
      cur.outProduct *= v;
      cur.sentValues.push(v);
      cur.activePair = -1;
      cur.feedback = { kind: 'good', html: '✅ Yes! A couple sends <b>just one</b> of itself outside. <b>' + v + '</b> moves out.' };
      render();
    };
    document.getElementById('sendBoth').onclick = function () {
      // THE misconception — catch it specifically. Reference THIS couple + the
      // canonical √50 example so it's always correct (even on coefficient problems).
      cur.feedback = {
        kind: 'bad',
        html: '✗ <b>Careful — that\'s the #1 mistake.</b> A couple sends just <b>ONE</b> of itself outside, ' +
              'not both multiplied together. This couple of <b>' + v + '</b>s sends out a single <b>' + v + '</b>, ' +
              'not ' + v + '×' + v + ' = ' + (v * v) + '. ' +
              '<br>Remember: <b>√50 = 5√2</b>, not 25√2. ' +
              'Tap <b>“Send ONE out → ' + v + '”</b> to fix it.'
      };
      render();
    };
  }

  // ---------- answer assembly ----------
  function insideValue() {
    return cur.singles.reduce(function (a, s) { return a * s.v; }, 1);
  }
  function fullOutside() {
    // product of front coeff and every couple's single contribution (whether sent yet or not, for preview)
    var prod = cur.p.coeff;
    cur.pairs.forEach(function (pr) { prod *= pr.v; });
    return prod;
  }
  function answerString() {
    var inside = insideValue();
    var coeff = fullOutside();
    if (inside === 1) return { display: String(coeff), coeff: coeff, inside: 1, rational: true };
    var disp = (coeff === 1 ? '' : coeff) + '√' + inside;
    return { display: disp, coeff: coeff, inside: inside, rational: false };
  }

  function feedbackHTML(fb) {
    return '<div class="feedback ' + (fb.kind === 'good' ? 'good' : 'bad') + '">' + fb.html + '</div>';
  }

  // ---------- CLASSIFY STAGE ----------
  function renderClassifyStage() {
    var ans = answerString();
    var p = cur.p;
    var tennisLine = (p.tennis)
      ? '<div class="note" style="margin-bottom:16px">🎾 So each side of that 50 ft² court section is <b>√50 = 5√2 ft</b> — about 7.07 ft, but the <b>exact</b> answer is 5√2.</div>'
      : '';

    stageEl.innerHTML =
      '<div class="stage-label">Step 3 · The answer</div>' +
      '<div class="answer-hero">' + radicalReadout(ans) + '</div>' +
      tennisLine +
      (cur.classified
        ? feedbackHTML({ kind: cur.classifyCorrect ? 'good' : 'bad', html: cur.classifyMsg })
        : '<div class="stage-label" style="color:var(--lime)">Last thing — like your class tests:</div>' +
          '<p class="sub" style="margin-bottom:10px">Is <b>' + ans.display + '</b> rational or irrational?</p>' +
          '<div class="classify-row">' +
            '<button class="btn btn-ghost" id="cRat">Rational</button>' +
            '<button class="btn btn-ghost" id="cIrr">Irrational</button>' +
          '</div>');

    if (!cur.classified) {
      document.getElementById('cRat').onclick = function () { classify(true); };
      document.getElementById('cIrr').onclick = function () { classify(false); };
      footerEl.innerHTML = '<button class="btn btn-ghost" id="backCouples">← Couples</button><div class="grow"></div>';
      document.getElementById('backCouples').onclick = function () { cur.stage = 'couples'; render(); };
    } else {
      footerEl.innerHTML =
        '<button class="btn btn-ghost" id="redo">↺ Redo this one</button><div class="grow"></div>' +
        '<button class="btn btn-primary" id="nextProb">' + (state.prob < PROBLEMS.length - 1 ? 'Next root →' : 'Finish 🎉') + '</button>';
      document.getElementById('redo').onclick = function () { startProblem(); };
      document.getElementById('nextProb').onclick = function () {
        if (state.prob < PROBLEMS.length - 1) { state.prob++; cur = null; render(); }
        else {
          state.results.push({ label: labelFor(cur.p), answer: ans.display });
          state.mode = 'done'; render();
        }
      };
    }
  }

  function radicalReadout(ans) {
    if (ans.rational) return '<span style="color:var(--lime)">' + ans.coeff + '</span>';
    var c = ans.coeff === 1 ? '' : '<span class="coef" style="font-size:2.6rem">' + ans.coeff + '</span>';
    return '<span class="radical" style="font-size:2.4rem">' + c +
      '<span class="radsign"><span class="radbox" style="border-top-width:3px">' + ans.inside + '</span></span></span>';
  }

  function labelFor(p) { return (p.coeff !== 1 ? p.coeff : '') + '√' + p.n; }

  function classify(saidRational) {
    var ans = answerString();
    var correct = (saidRational === ans.rational);
    cur.classified = true;
    cur.classifyCorrect = correct;
    if (correct) {
      cur.classifyMsg = ans.rational
        ? '✅ Right — it\'s <b>rational</b>. √' + cur.p.n + ' landed on a whole number (' + ans.coeff + '), and whole numbers are rational.'
        : '✅ Right — it\'s <b>irrational</b>. The √' + ans.inside + ' part never ends and never repeats, so the whole thing is irrational.';
      if (!state.results.some(function (r) { return r.label === labelFor(cur.p); })) {
        state.results.push({ label: labelFor(cur.p), answer: ans.display });
      }
    } else {
      cur.classifyMsg = ans.rational
        ? '✗ Not quite — <b>' + ans.display + '</b> is a whole number, so it\'s <b>rational</b>. (No leftover root inside.)'
        : '✗ Not quite — there\'s still a <b>√' + ans.inside + '</b> inside, and √' + ans.inside + ' never ends or repeats. That makes it <b>irrational</b>.';
    }
    render();
  }

  // ====================================================
  //  DONE
  // ====================================================
  function renderDone() {
    pillEl.textContent = 'Done';
    setProgress(PROBLEMS.length, PROBLEMS.length - 1, PROBLEMS.length);
    var rows = state.results.map(function (r) {
      return '<li><span class="q">√' + r.label.replace(/^\d*√?/, function (m) { return m; }) + '</span><span class="a">= ' + r.answer + '</span></li>';
    }).join('');
    // cleaner: rebuild from PROBLEMS to guarantee order/labels
    rows = PROBLEMS.map(function (p) {
      var label = (p.coeff !== 1 ? p.coeff : '') + '√' + p.n;
      var match = state.results.find(function (r) { return r.label === label; });
      return '<li><span class="q">' + label + '</span><span class="a">= ' + (match ? match.answer : '—') + '</span></li>';
    }).join('');
    stageEl.innerHTML =
      '<div class="card tall">' +
        '<div class="trophy">🏆</div>' +
        '<h1 class="big">Roots <span class="hl">simplified.</span></h1>' +
        '<p class="lede">You found the hidden factors in all six. Remember the rule:</p>' +
        '<div class="method-phrase"><span class="out">couples out</span> · <span class="in">singles in</span></div>' +
        '<ul class="summary-list">' + rows + '</ul>' +
        '<div class="note" style="margin-top:18px">The mistake to keep dodging: a couple sends <b>one</b> out, not both multiplied. √50 = <b>5√2</b>, never 25√2.</div>' +
      '</div>';
    footerEl.innerHTML =
      '<a class="btn btn-ghost" href="../#grade9">← Menu</a><div class="grow"></div>' +
      '<button class="btn btn-primary" id="again">Practice again ↺</button>';
    document.getElementById('again').onclick = function () {
      state.mode = 'practice'; state.prob = 0; state.results = []; cur = null; render();
    };
  }

  // ---------- boot ----------
  render();
})();
