// sfx.js — NIGHTFALL sound engine. Pure WebAudio synthesis, no assets.
// SFX.play(name) is safe to call any time; silent until first user gesture.

const SFX = {
  ctx: null,
  muted: false,
  MUTE_KEY: 'nightfall_muted',

  init() {
    try { this.muted = localStorage.getItem(this.MUTE_KEY) === '1'; } catch (e) {}
    // Create/resume the context on the first real gesture.
    const unlock = () => {
      this._ensureCtx();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    };
    ['pointerdown', 'keydown'].forEach(ev =>
      document.addEventListener(ev, unlock, { passive: true }));
  },

  _ensureCtx() {
    if (this.ctx) return this.ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    } catch (e) { this.ctx = null; }
    return this.ctx;
  },

  toggleMute() {
    this.muted = !this.muted;
    try { localStorage.setItem(this.MUTE_KEY, this.muted ? '1' : '0'); } catch (e) {}
    return this.muted;
  },

  // --- low-level helpers -------------------------------------------------
  _tone({ freq = 440, type = 'sine', dur = 0.12, vol = 0.16, when = 0, glide = null, decay = true }) {
    const ctx = this._ensureCtx();
    if (!ctx || this.muted) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glide), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    if (decay) g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    else g.gain.setValueAtTime(vol, t0 + dur - 0.01), g.gain.linearRampToValueAtTime(0, t0 + dur);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  },

  _noise({ dur = 0.08, vol = 0.08, when = 0, filter = 1800 }) {
    const ctx = this._ensureCtx();
    if (!ctx || this.muted) return;
    const t0 = ctx.currentTime + when;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = filter; f.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    src.start(t0); src.stop(t0 + dur);
  },

  // --- named cues --------------------------------------------------------
  play(name) {
    if (!this._ensureCtx() || this.muted) return;
    const fns = {
      // keypad digit press — short mechanical tick
      key: () => {
        this._tone({ freq: 2200, type: 'square', dur: 0.03, vol: 0.05 });
        this._noise({ dur: 0.02, vol: 0.03, filter: 3200 });
      },
      // selecting a wire/choice/doc line
      select: () => this._tone({ freq: 900, type: 'triangle', dur: 0.06, vol: 0.09 }),
      // correct — rising major triad sparkle
      correct: () => {
        [523.25, 659.25, 783.99].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', dur: 0.16, vol: 0.13, when: i * 0.06 }));
        this._tone({ freq: 1567.98, type: 'sine', dur: 0.25, vol: 0.07, when: 0.18 });
      },
      // cash lands in the bag — two-tone coin ding
      cash: () => {
        this._tone({ freq: 1318.5, type: 'sine', dur: 0.09, vol: 0.11, when: 0.02 });
        this._tone({ freq: 1975.5, type: 'sine', dur: 0.22, vol: 0.10, when: 0.09 });
      },
      // streak (3+) — extra flourish on top of correct
      streak: () => {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', dur: 0.15, vol: 0.13, when: i * 0.055 }));
        this._tone({ freq: 2093, type: 'sine', dur: 0.3, vol: 0.08, when: 0.24 });
      },
      // wrong — low dissonant buzz
      wrong: () => {
        this._tone({ freq: 160, type: 'sawtooth', dur: 0.22, vol: 0.10, glide: 110 });
        this._tone({ freq: 168, type: 'square', dur: 0.22, vol: 0.06, glide: 118 });
      },
      // soft nudge — neutral double blip
      soft: () => {
        this._tone({ freq: 660, type: 'sine', dur: 0.07, vol: 0.08 });
        this._tone({ freq: 660, type: 'sine', dur: 0.07, vol: 0.08, when: 0.11 });
      },
      // mid-boss / phase cleared — punchy two-note
      stage: () => {
        this._tone({ freq: 392, type: 'triangle', dur: 0.1, vol: 0.13 });
        this._tone({ freq: 587.33, type: 'triangle', dur: 0.18, vol: 0.13, when: 0.09 });
      },
      // radio hint — static + blip
      radio: () => {
        this._noise({ dur: 0.12, vol: 0.05, filter: 1400 });
        this._tone({ freq: 1200, type: 'sine', dur: 0.05, vol: 0.07, when: 0.12 });
        this._noise({ dur: 0.07, vol: 0.04, when: 0.18, filter: 1800 });
      },
      // alarm — two siren sweeps
      alarm: () => {
        for (let i = 0; i < 2; i++) {
          this._tone({ freq: 520, glide: 940, type: 'sawtooth', dur: 0.4, vol: 0.10, when: i * 0.45 });
          this._tone({ freq: 940, glide: 520, type: 'sawtooth', dur: 0.4, vol: 0.08, when: i * 0.45 + 0.4 });
        }
      },
      // urgent timer tick
      tick: () => this._tone({ freq: 1400, type: 'square', dur: 0.03, vol: 0.06 }),
      // payout counter tick
      count: () => this._tone({ freq: 1800, type: 'square', dur: 0.02, vol: 0.045 }),
      // vault door swings open — deep thunk + rush
      vault: () => {
        this._tone({ freq: 70, type: 'sine', dur: 0.4, vol: 0.22, glide: 45 });
        this._noise({ dur: 0.5, vol: 0.06, when: 0.1, filter: 500 });
        this._tone({ freq: 392, type: 'triangle', dur: 0.2, vol: 0.10, when: 0.35 });
        this._tone({ freq: 523.25, type: 'triangle', dur: 0.3, vol: 0.11, when: 0.5 });
      },
      // rank up — fanfare
      rankup: () => {
        [392, 523.25, 659.25, 783.99].forEach((f, i) =>
          this._tone({ freq: f, type: 'triangle', dur: 0.22, vol: 0.14, when: i * 0.11 }));
        this._tone({ freq: 1046.5, type: 'triangle', dur: 0.5, vol: 0.13, when: 0.44 });
        this._tone({ freq: 1318.5, type: 'sine', dur: 0.5, vol: 0.07, when: 0.44 });
      }
    };
    const fn = fns[name];
    if (fn) { try { fn(); } catch (e) { /* audio hiccups never break the game */ } }
  }
};
