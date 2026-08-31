// challenges.js — NIGHTFALL challenge renderers + evaluators.
// Each renderer: (challenge, area) -> evaluator object:
//   { evaluate() -> {ok, message, soft?, done?}, getHint?() }
// ok:true, done:false  => phase cleared, more to do (multi-phase challenges)
// soft:true            => "not wrong, fix the form" — no heat, no attempt counted.

const Challenges = {

  // ---------- shared widgets ----------

  _numInput(placeholder) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    inp.className = 'num-input';
    inp.placeholder = placeholder || '?';
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/[^0-9\-]/g, '').replace(/(?!^)-/g, '');
    });
    return inp;
  },

  _keypad(inp) {
    const pad = document.createElement('div');
    pad.className = 'keypad';
    const keys = ['7','8','9','4','5','6','1','2','3','±','0','⌫'];
    keys.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'key' + (k === '±' || k === '⌫' ? ' key-fn' : '');
      b.textContent = k;
      b.addEventListener('click', () => {
        if (k === '⌫') inp.value = inp.value.slice(0, -1);
        else if (k === '±') {
          inp.value = inp.value.startsWith('-') ? inp.value.slice(1) : '-' + inp.value;
        } else inp.value += k;
        inp.dispatchEvent(new Event('input'));
        inp.focus();
        if (typeof SFX !== 'undefined') SFX.play('key');
      });
      pad.appendChild(b);
    });
    return pad;
  },

  _parseInt(v) {
    if (v === '' || v === '-' || v == null) return null;
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  },

  _gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; },

  _mathDisplay(challenge) {
    if (!challenge.expr) return null;
    const d = document.createElement('div');
    d.className = 'math-display';
    d.innerHTML = challenge.expr;
    return d;
  },

  // Fraction entry widget: optional whole + numerator/denominator stack.
  // wantsWhole: show the whole-number box.
  _fracWidget(wantsWhole) {
    const wrap = document.createElement('div');
    wrap.className = 'frac-entry';
    let whole = null;
    if (wantsWhole) {
      whole = this._numInput('');
      whole.classList.add('frac-whole');
      whole.setAttribute('aria-label', 'whole number');
      wrap.appendChild(whole);
    }
    const stack = document.createElement('div');
    stack.className = 'frac-stack';
    const num = this._numInput('');
    num.classList.add('frac-part');
    num.setAttribute('aria-label', 'numerator');
    const bar = document.createElement('div');
    bar.className = 'frac-bar';
    const den = this._numInput('');
    den.classList.add('frac-part');
    den.setAttribute('aria-label', 'denominator');
    stack.appendChild(num); stack.appendChild(bar); stack.appendChild(den);
    wrap.appendChild(stack);
    return { el: wrap, whole, num, den };
  },

  // Evaluate a fraction widget against expected {w?, n, d} (n/d already lowest terms, 0 <= n < d when w present).
  _checkFraction(widget, expected) {
    const P = this._parseInt.bind(this);
    const uw = widget.whole ? P(widget.whole.value) : null;
    const un = P(widget.num.value);
    const ud = P(widget.den.value);
    const ew = expected.w || 0;

    // whole-only answer (e.g. they typed just the whole box)
    if (un === null && ud === null) {
      return { ok: false, message: 'The dial needs a fraction part — numerator over denominator.' };
    }
    if (un === null || ud === null) return { ok: false, message: 'Fill in both the numerator and the denominator.' };
    if (ud === 0) return { ok: false, message: 'A denominator of zero? The dial refuses on principle.' };

    const userWhole = uw === null ? 0 : uw;
    if (userWhole < 0 || un < 0 || ud < 0) {
      return { ok: false, message: 'No negatives on this dial — check your subtraction.' };
    }
    // exact rational compare: userWhole + un/ud  vs  ew + n/d
    const userNum = userWhole * ud + un;           // over ud
    const expNum = ew * expected.d + expected.n;   // over expected.d
    const equal = userNum * expected.d === expNum * ud;

    if (!equal) return { ok: false, message: 'The dial doesn\'t budge. Recheck your work.' };

    // value is right — enforce form
    const g = this._gcd(un, ud);
    if (ew > 0 && userWhole === 0 && un >= ud) {
      return { ok: false, soft: true, message: 'Right value! But this dial wants a MIXED number — pull the whole part out front.' };
    }
    if (g !== 1) {
      return { ok: false, soft: true, message: 'Right value! But the dial only turns on LOWEST terms — keep reducing.' };
    }
    if (ew > 0 && userWhole !== ew) {
      // equal value, reduced, but whole part off means improper elsewhere — caught above, safety net:
      return { ok: false, soft: true, message: 'Right value — but put it in proper mixed-number form.' };
    }
    return { ok: true, message: '' };
  },

  _choiceList(options, area, cls) {
    const list = document.createElement('div');
    list.className = 'choice-list ' + (cls || '');
    const state = { selected: -1 };
    options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice-btn';
      b.innerHTML = '<span class="choice-tag">' + String.fromCharCode(65 + i) + '</span><span class="choice-text">' + opt + '</span>';
      b.addEventListener('click', () => {
        list.querySelectorAll('.choice-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        state.selected = i;
        if (typeof SFX !== 'undefined') SFX.play('select');
      });
      list.appendChild(b);
    });
    area.appendChild(list);
    return state;
  },

  // shuffle options, return {displayOptions, correctIndex}
  _shuffle(options, correct) {
    const idx = options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return {
      displayOptions: idx.map(i => options[i]),
      correctIndex: idx.indexOf(correct)
    };
  },

  // ============================================================
  // KEYPAD — numeric answer with a vault keypad
  // ============================================================
  keypad(challenge, area) {
    const md = this._mathDisplay(challenge);
    if (md) area.appendChild(md);
    const row = document.createElement('div');
    row.className = 'keypad-row';
    const inp = this._numInput('CODE');
    inp.classList.add('code-display');
    row.appendChild(inp);
    area.appendChild(row);
    area.appendChild(this._keypad(inp));
    setTimeout(() => inp.focus(), 50);
    const self = this;
    return {
      evaluate() {
        const v = self._parseInt(inp.value);
        if (v === null) return { ok: false, soft: true, message: 'Punch in a number first.' };
        if (v === challenge.answer) return { ok: true, message: '' };
        return { ok: false, message: 'The lock buzzes angrily. That\'s not the code.' };
      }
    };
  },

  // ============================================================
  // CHOICE — cut the right wire / pick the right form
  // ============================================================
  choice(challenge, area) {
    const md = this._mathDisplay(challenge);
    if (md) area.appendChild(md);
    const { displayOptions, correctIndex } = this._shuffle(challenge.options, challenge.correct);
    const state = this._choiceList(displayOptions, area);
    return {
      evaluate() {
        if (state.selected < 0) return { ok: false, soft: true, message: 'Pick one first.' };
        if (state.selected === correctIndex) return { ok: true, message: '' };
        return { ok: false, message: 'Sparks fly — wrong pick. Look again.' };
      }
    };
  },

  // ============================================================
  // FRACTION — vault dial that takes n/d or mixed numbers
  // ============================================================
  fraction(challenge, area) {
    const md = this._mathDisplay(challenge);
    if (md) area.appendChild(md);
    const wantsWhole = !!(challenge.answer.w && challenge.answer.w > 0);
    const widget = this._fracWidget(wantsWhole);
    const holder = document.createElement('div');
    holder.className = 'frac-holder';
    if (wantsWhole) {
      const tip = document.createElement('div');
      tip.className = 'frac-tip';
      tip.textContent = 'mixed number · lowest terms';
      holder.appendChild(tip);
    } else {
      const tip = document.createElement('div');
      tip.className = 'frac-tip';
      tip.textContent = 'lowest terms';
      holder.appendChild(tip);
    }
    holder.appendChild(widget.el);
    area.appendChild(holder);
    setTimeout(() => (widget.whole || widget.num).focus(), 50);
    const self = this;
    return {
      evaluate() { return self._checkFraction(widget, challenge.answer); }
    };
  },

  // ============================================================
  // TWOFIELD — two labeled numeric answers (e.g., LCM & GCF)
  // ============================================================
  twofield(challenge, area) {
    const md = this._mathDisplay(challenge);
    if (md) area.appendChild(md);
    const wrap = document.createElement('div');
    wrap.className = 'twofield';
    const inputs = challenge.fields.map(f => {
      const cell = document.createElement('div');
      cell.className = 'twofield-cell';
      const lab = document.createElement('div');
      lab.className = 'twofield-label';
      lab.textContent = f.label;
      const inp = this._numInput('?');
      inp.classList.add('code-display', 'code-small');
      cell.appendChild(lab); cell.appendChild(inp);
      wrap.appendChild(cell);
      return inp;
    });
    area.appendChild(wrap);
    setTimeout(() => inputs[0].focus(), 50);
    const self = this;
    return {
      evaluate() {
        const vals = inputs.map(i => self._parseInt(i.value));
        if (vals.some(v => v === null)) return { ok: false, soft: true, message: 'Both keys, Cipher — fill in every box.' };
        const wrongs = challenge.fields.filter((f, i) => vals[i] !== f.answer);
        if (wrongs.length === 0) return { ok: true, message: '' };
        return { ok: false, message: 'The ' + wrongs.map(f => f.label).join(' and ') + ' key' + (wrongs.length > 1 ? 's don\'t' : ' doesn\'t') + ' fit.' };
      }
    };
  },

  // ============================================================
  // FORGERY — find the bad line, then fix the answer
  // ============================================================
  forgery(challenge, area) {
    const self = this;
    const doc = document.createElement('div');
    doc.className = 'doc';
    const head = document.createElement('div');
    head.className = 'doc-head';
    head.innerHTML = '<span class="doc-stamp">LEDGER SYNDICATE · VERIFIED</span>';
    doc.appendChild(head);
    const state = { selected: -1, phase: 1 };
    challenge.lines.forEach((ln, i) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'doc-line';
      row.innerHTML = '<span class="doc-ln">' + (i + 1) + '</span><span class="doc-math">' + ln + '</span>';
      row.addEventListener('click', () => {
        if (state.phase !== 1) return;
        doc.querySelectorAll('.doc-line').forEach(x => x.classList.remove('selected'));
        row.classList.add('selected');
        state.selected = i;
        if (typeof SFX !== 'undefined') SFX.play('select');
      });
      doc.appendChild(row);
    });
    area.appendChild(doc);

    const fixArea = document.createElement('div');
    fixArea.className = 'fix-area';
    area.appendChild(fixArea);

    let fixWidget = null, fixInput = null, fixChoice = null, fixCorrectIndex = -1;

    function enterPhase2() {
      state.phase = 2;
      doc.querySelectorAll('.doc-line').forEach((x, i) => {
        x.classList.add('locked');
        if (i === challenge.badLine) x.classList.add('busted');
      });
      const p = document.createElement('div');
      p.className = 'fix-prompt';
      p.innerHTML = '🖋 ' + challenge.fixPrompt;
      fixArea.appendChild(p);
      const fix = challenge.fix;
      if (fix.kind === 'number') {
        fixInput = self._numInput('?');
        fixInput.classList.add('code-display');
        const row = document.createElement('div');
        row.className = 'keypad-row';
        row.appendChild(fixInput);
        fixArea.appendChild(row);
        fixArea.appendChild(self._keypad(fixInput));
        setTimeout(() => fixInput.focus(), 50);
      } else if (fix.kind === 'fraction') {
        const wantsWhole = !!(fix.answer.w && fix.answer.w > 0);
        fixWidget = self._fracWidget(wantsWhole);
        const holder = document.createElement('div');
        holder.className = 'frac-holder';
        const tip = document.createElement('div');
        tip.className = 'frac-tip';
        tip.textContent = wantsWhole ? 'mixed number · lowest terms' : 'lowest terms';
        holder.appendChild(tip);
        holder.appendChild(fixWidget.el);
        fixArea.appendChild(holder);
        setTimeout(() => (fixWidget.whole || fixWidget.num).focus(), 50);
      } else if (fix.kind === 'choice') {
        const sh = self._shuffle(fix.options, fix.correct);
        fixCorrectIndex = sh.correctIndex;
        fixChoice = self._choiceList(sh.displayOptions, fixArea, 'fix-choices');
      }
    }

    return {
      evaluate() {
        if (state.phase === 1) {
          if (state.selected < 0) return { ok: false, soft: true, message: 'Tap the line you think is forged.' };
          if (state.selected === challenge.badLine) {
            enterPhase2();
            return { ok: true, done: false, message: 'That\'s the forgery. Line ' + (challenge.badLine + 1) + ' is cooked — now fix it.' };
          }
          return { ok: false, message: 'That line checks out clean. The forgery is elsewhere.' };
        }
        // phase 2
        const fix = challenge.fix;
        if (fix.kind === 'number') {
          const v = self._parseInt(fixInput.value);
          if (v === null) return { ok: false, soft: true, message: 'Enter the corrected value.' };
          if (v === fix.answer) return { ok: true, message: '' };
          return { ok: false, message: 'Not quite — redo the work with the fix in place.' };
        }
        if (fix.kind === 'fraction') return self._checkFraction(fixWidget, fix.answer);
        if (fix.kind === 'choice') {
          if (fixChoice.selected < 0) return { ok: false, soft: true, message: 'Pick the corrected version.' };
          if (fixChoice.selected === fixCorrectIndex) return { ok: true, message: '' };
          return { ok: false, message: 'Still not the true form. Distribute again, carefully.' };
        }
        return { ok: false, message: '?' };
      }
    };
  },

  // ============================================================
  // INTEL — choose the equation that models the story, then solve
  // ============================================================
  intel(challenge, area) {
    const self = this;
    const state = { phase: 1 };
    const { displayOptions, correctIndex } = this._shuffle(challenge.equations, challenge.correctEq);
    const eqChoice = this._choiceList(displayOptions.map(e => '<span class="eq">' + e + '</span>'), area, 'eq-choices');

    const solveArea = document.createElement('div');
    solveArea.className = 'fix-area';
    area.appendChild(solveArea);
    let inp = null;

    function enterPhase2() {
      state.phase = 2;
      area.querySelectorAll('.eq-choices .choice-btn').forEach((b, i) => {
        b.disabled = true;
        b.classList.add('locked');
        if (i === correctIndex) b.classList.add('confirmed');
      });
      const p = document.createElement('div');
      p.className = 'fix-prompt';
      p.innerHTML = '🔓 ' + challenge.answerPrompt;
      solveArea.appendChild(p);
      inp = self._numInput('?');
      inp.classList.add('code-display');
      const row = document.createElement('div');
      row.className = 'keypad-row';
      row.appendChild(inp);
      solveArea.appendChild(row);
      solveArea.appendChild(self._keypad(inp));
      setTimeout(() => inp.focus(), 50);
    }

    return {
      evaluate() {
        if (state.phase === 1) {
          if (eqChoice.selected < 0) return { ok: false, soft: true, message: 'Pick the equation that tells this story.' };
          if (eqChoice.selected === correctIndex) {
            enterPhase2();
            return { ok: true, done: false, message: 'That\'s the right setup. Now solve it.' };
          }
          return { ok: false, message: 'That equation tells a different story. Read it again, slowly.' };
        }
        const v = self._parseInt(inp.value);
        if (v === null) return { ok: false, soft: true, message: 'Enter your answer.' };
        if (v === challenge.answer) return { ok: true, message: '' };
        return { ok: false, message: 'The safe stays shut. Check your solving — and check WHAT the question asked for.' };
      }
    };
  },

  // ============================================================
  // BOSS — multi-stage lock; each stage is keypad/choice/fraction
  // ============================================================
  boss(challenge, area) {
    const self = this;
    const state = { stage: 0, sub: null };

    const header = document.createElement('div');
    header.className = 'boss-header';
    const pips = challenge.stages.map((s, i) => '<span class="boss-pip" data-pip="' + i + '"></span>').join('');
    header.innerHTML = '<div class="boss-name">' + (challenge.bossName || 'THE VAULT') + '</div><div class="boss-pips">' + pips + '</div>';
    area.appendChild(header);

    const stageArea = document.createElement('div');
    stageArea.className = 'boss-stage';
    area.appendChild(stageArea);

    function renderStage() {
      stageArea.innerHTML = '';
      header.querySelectorAll('.boss-pip').forEach((p, i) => {
        p.classList.toggle('done', i < state.stage);
        p.classList.toggle('current', i === state.stage);
      });
      const st = challenge.stages[state.stage];
      const lab = document.createElement('div');
      lab.className = 'boss-stage-label';
      lab.textContent = st.label;
      stageArea.appendChild(lab);
      const pr = document.createElement('div');
      pr.className = 'boss-stage-prompt';
      pr.innerHTML = st.prompt;
      stageArea.appendChild(pr);
      // delegate to a sub-renderer
      const fake = Object.assign({}, st);
      if (st.kind === 'keypad') state.sub = self.keypad(fake, stageArea);
      else if (st.kind === 'choice') state.sub = self.choice(fake, stageArea);
      else if (st.kind === 'fraction') state.sub = self.fraction(fake, stageArea);
    }
    renderStage();

    return {
      getHint() {
        const st = challenge.stages[state.stage];
        return (st && st.hint) || challenge.hint || null;
      },
      evaluate() {
        const r = state.sub.evaluate();
        if (!r.ok) return r;
        if (state.stage < challenge.stages.length - 1) {
          state.stage++;
          renderStage();
          return { ok: true, done: false, message: challenge.stages[state.stage - 1].label + ' — CRACKED. Next.' };
        }
        header.querySelectorAll('.boss-pip').forEach(p => p.classList.add('done'));
        return { ok: true, message: '' };
      }
    };
  }
};
