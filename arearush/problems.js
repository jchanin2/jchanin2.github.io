// problems.js — Muffin's Rush: procedural area problems + SVG diagrams.
// Shared by the game (game.js) and the printable sheet (practice.html).
// Shapes are drawn roughly to proportion but labeled "not to scale" — like real tests.

// ---------- seeded RNG (mulberry32) ----------
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function ri(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); } // inclusive
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

const UNITS = ['cm', 'm', 'in', 'ft', 'mm'];

// ---------- SVG helpers ----------
const SVG_W = 340, SVG_H = 225;

function svgWrap(inner) {
  return '<svg viewBox="0 0 ' + SVG_W + ' ' + SVG_H + '" xmlns="http://www.w3.org/2000/svg" class="shape-svg">' + inner + '</svg>';
}
// scale/center unit-space points ([x,y] with y DOWN) into the viewbox
function fitter(maxX, maxY, padX, padTop, padBot) {
  padX = padX == null ? 52 : padX;
  padTop = padTop == null ? 16 : padTop;
  padBot = padBot == null ? 34 : padBot;
  const s = Math.min((SVG_W - padX * 2) / maxX, (SVG_H - padTop - padBot) / maxY);
  const ox = (SVG_W - maxX * s) / 2;
  const oy = padTop + (SVG_H - padTop - padBot - maxY * s) / 2;
  return { x: u => ox + u * s, y: u => oy + u * s, s };
}
function poly(pts, f) {
  return '<polygon points="' + pts.map(p => f.x(p[0]).toFixed(1) + ',' + f.y(p[1]).toFixed(1)).join(' ') + '" class="shape-fill"/>';
}
function dashed(x1, y1, x2, y2, f) {
  return '<line x1="' + f.x(x1).toFixed(1) + '" y1="' + f.y(y1).toFixed(1) + '" x2="' + f.x(x2).toFixed(1) + '" y2="' + f.y(y2).toFixed(1) + '" class="shape-dash"/>';
}
// small right-angle square at (x,y), arms toward dx,dy directions (unit-space signs)
function rangle(x, y, dx, dy, f) {
  const m = 7;
  const px = f.x(x), py = f.y(y);
  return '<path d="M ' + (px + dx * m) + ' ' + py + ' L ' + (px + dx * m) + ' ' + (py + dy * m) + ' L ' + px + ' ' + (py + dy * m) + '" class="shape-ra"/>';
}
function label(x, y, text, f, anchor, cls) {
  return '<text x="' + f.x(x).toFixed(1) + '" y="' + f.y(y).toFixed(1) + '" text-anchor="' + (anchor || 'middle') + '" class="shape-label ' + (cls || '') + '">' + text + '</text>';
}
// label at raw px offset from unit point
function labelPx(x, y, dxPx, dyPx, text, f, anchor, cls) {
  return '<text x="' + (f.x(x) + dxPx).toFixed(1) + '" y="' + (f.y(y) + dyPx).toFixed(1) + '" text-anchor="' + (anchor || 'middle') + '" class="shape-label ' + (cls || '') + '">' + text + '</text>';
}
function fmt(n) { return Number.isInteger(n) ? String(n) : String(n); }

// plausible "not to scale" length for a slanted side (always longer than the height)
function slantLabel(h, extra) { return h + extra; }

// ---------- generators ----------
// Each returns { svg, prompt, answer, unit, kind, formulaHint }
// `answer` is a number; integers except marked triangle problems that end in .5.

const Problems = {

  parallelogram(rng, level) {
    const unit = pick(rng, UNITS);
    let b, h, dec = false;
    if (level === 1) { b = ri(rng, 5, 12); h = ri(rng, 3, 9); }
    else if (level === 2) { b = ri(rng, 9, 20); h = ri(rng, 4, 12); }
    else { // decimal base, even height -> integer answer
      b = ri(rng, 5, 15) + 0.5; h = 2 * ri(rng, 2, 6); dec = true;
    }
    const o = Math.max(2, Math.round((level >= 2 ? 0.45 : 0.3) * h)); // lean
    const flip = rng() < 0.5;
    const f = fitter(b + o, h);
    const X = u => (flip ? b + o - u : u);
    const pts = [[X(0), h], [X(b), h], [X(b + o), 0], [X(o), 0]];
    let s = poly(pts, f);
    // dashed height from top vertex down to the base line
    const hx = X(flip ? b : o);
    s += dashed(hx, 0, hx, h, f);
    s += rangle(hx, h, flip ? -1 : 1, -1, f);
    s += labelPx((X(0) + X(b)) / 2, h, 0, 20, fmt(b) + ' ' + unit, f);
    // the height line always lands at x = o (left side) whichever way the shape leans:
    // label it INSIDE the body, and put the decoy slant label on the right slant side.
    s += labelPx(hx, h / 2, 13, 4, fmt(h) + ' ' + unit, f, 'start', 'hl');
    if (level >= 2) {
      const sl = slantLabel(h, ri(rng, 1, 3));
      s += labelPx(b + o / 2, h / 2, 12, 4, fmt(sl) + ' ' + unit, f, 'start', 'trap');
    }
    return {
      svg: svgWrap(s), unit, kind: 'parallelogram',
      prompt: 'Area of the parallelogram?',
      answer: b * h,
      formulaHint: 'A = b × h' + (level >= 2 ? ' — the slant side is a decoy!' : '')
    };
  },

  parallelogramInverse(rng) {
    const unit = pick(rng, UNITS);
    const b = ri(rng, 6, 15), h = ri(rng, 4, 12);
    const A = b * h;
    const o = Math.max(2, Math.round(0.35 * h));
    const f = fitter(b + o, h);
    const pts = [[0, h], [b, h], [b + o, 0], [o, 0]];
    let s = poly(pts, f);
    s += dashed(o, 0, o, h, f);
    s += rangle(o, h, 1, -1, f);
    s += labelPx(b / 2, h, 0, 20, fmt(b) + ' ' + unit, f);
    s += labelPx(o, h / 2, 13, 4, 'h = ?', f, 'start', 'hl');
    s += labelPx((b + o) * 0.62, h * 0.4, 0, 4, 'A = ' + A + ' ' + unit + '²', f, 'middle', 'area');
    return {
      svg: svgWrap(s), unit, kind: 'parallelogram (reverse)',
      prompt: 'Area = ' + A + ' ' + unit + '². Find the height <b>h</b>.',
      answer: h, answerUnit: unit,
      formulaHint: 'A = b × h, so h = A ÷ b'
    };
  },

  triangle(rng, level) {
    const unit = pick(rng, UNITS);
    let b, h;
    if (level === 1) { // right triangle, legs labeled, integer answer
      b = ri(rng, 4, 12); h = ri(rng, 3, 10);
      if ((b * h) % 2 === 1) b++;
      const flip = rng() < 0.5;
      const f = fitter(b, h);
      const X = u => (flip ? b - u : u);
      let s = poly([[X(0), h], [X(b), h], [X(0), 0]], f);
      s += rangle(X(0), h, flip ? -1 : 1, -1, f);
      s += labelPx(b / 2, h, 0, 20, fmt(b) + ' ' + unit, f);
      s += labelPx(X(0), h / 2, flip ? 14 : -14, 4, fmt(h) + ' ' + unit, f, flip ? 'start' : 'end', 'hl');
      return {
        svg: svgWrap(s), unit, kind: 'right triangle',
        prompt: 'Area of the triangle?',
        answer: (b * h) / 2, formulaHint: 'A = ½ × b × h'
      };
    }
    // level 2: scalene with dashed height + decoy side; level 3: may end in .5
    b = ri(rng, 6, 18); h = ri(rng, 4, 12);
    if (level === 2 && (b * h) % 2 === 1) b++;           // integer answers at L2
    if (level === 3 && (b * h) % 2 === 0 && rng() < 0.6) b++; // force some .5 answers at L3
    const ax = ri(rng, Math.ceil(b * 0.25), Math.floor(b * 0.7)); // apex x over the base
    const f = fitter(b, h);
    let s = poly([[0, h], [b, h], [ax, 0]], f);
    s += dashed(ax, 0, ax, h, f);
    s += rangle(ax, h, ax > b / 2 ? -1 : 1, -1, f);
    s += labelPx(b / 2, h, 0, 20, fmt(b) + ' ' + unit, f);
    s += labelPx(ax, h / 2, ax > b / 2 ? -13 : 13, 4, fmt(h) + ' ' + unit, f, ax > b / 2 ? 'end' : 'start', 'hl');
    // decoy: label the longer slant side, low along the side so it clears the height label
    const sl = slantLabel(h, ri(rng, 1, 4));
    const left = ax >= b - ax; // label the longer side
    const lx = left ? ax * 0.3 : b + (ax - b) * 0.3;
    s += labelPx(lx, h * 0.7, left ? -12 : 12, 0, fmt(sl) + ' ' + unit, f, left ? 'end' : 'start', 'trap');
    return {
      svg: svgWrap(s), unit, kind: 'triangle',
      prompt: 'Area of the triangle?',
      answer: (b * h) / 2,
      formulaHint: 'A = ½ × b × h — use the DASHED height, not the slanted side'
    };
  },

  triangleInverse(rng) {
    const unit = pick(rng, UNITS);
    const h = ri(rng, 4, 12);
    const b = 2 * ri(rng, 3, 9); // even base keeps A = ½bh integer
    const A = (b * h) / 2;
    const ax = Math.round(b * 0.4);
    const f = fitter(b, h);
    let s = poly([[0, h], [b, h], [ax, 0]], f);
    s += dashed(ax, 0, ax, h, f);
    s += rangle(ax, h, 1, -1, f);
    s += labelPx(b / 2, h, 0, 20, fmt(b) + ' ' + unit, f);
    s += labelPx(ax, h / 2, 13, 4, 'h = ?', f, 'start', 'hl');
    s += labelPx(b * 0.8, h * 0.25, 20, 0, 'A = ' + A + ' ' + unit + '²', f, 'start', 'area');
    return {
      svg: svgWrap(s), unit, kind: 'triangle (reverse)',
      prompt: 'Area = ' + A + ' ' + unit + '². Find the height <b>h</b>.',
      answer: h, formulaHint: 'A = ½ × b × h, so h = 2A ÷ b'
    };
  },

  trapezoid(rng) {
    const unit = pick(rng, UNITS);
    let a = ri(rng, 4, 10);
    let b = a + ri(rng, 3, 9);
    let h = ri(rng, 3, 9);
    if (((a + b) * h) % 2 === 1) b++;
    const inset = (b - a) / 2;
    const f = fitter(b, h);
    let s = poly([[inset, 0], [inset + a, 0], [b, h], [0, h]], f);
    s += dashed(inset, 0, inset, h, f);
    s += rangle(inset, h, 1, -1, f);
    s += labelPx(b / 2, 0, 0, -8, fmt(a) + ' ' + unit, f);
    s += labelPx(b / 2, h, 0, 20, fmt(b) + ' ' + unit, f);
    s += labelPx(inset, h / 2, 13, 4, fmt(h) + ' ' + unit, f, 'start', 'hl');
    return {
      svg: svgWrap(s), unit, kind: 'trapezoid',
      prompt: 'Area of the trapezoid?',
      answer: ((a + b) * h) / 2,
      formulaHint: 'A = ½ × (a + b) × h — add the two parallel sides first'
    };
  },

  house(rng) { // rectangle + triangle roof
    const unit = pick(rng, UNITS);
    const w = 2 * ri(rng, 3, 7);       // even width -> integer roof area
    const r = ri(rng, 3, 8);           // rectangle height
    const t = ri(rng, 2, 5);           // roof height
    const f = fitter(w, r + t);
    let s = poly([[0, t], [w / 2, 0], [w, t], [w, t + r], [0, t + r]], f);
    s += dashed(0, t, w, t, f);                 // roofline
    s += dashed(w / 2, 0, w / 2, t, f);         // roof height
    s += labelPx(w / 2, t + r, 0, 20, fmt(w) + ' ' + unit, f);
    s += labelPx(w, t + r / 2, 14, 4, fmt(r) + ' ' + unit, f, 'start');
    s += labelPx(w / 2, t / 2, 11, 4, fmt(t) + ' ' + unit, f, 'start', 'hl');
    return {
      svg: svgWrap(s), unit, kind: 'composite (house)',
      prompt: 'Total area of the figure? <span class="subtle">(rectangle + triangle)</span>',
      answer: w * r + (w * t) / 2,
      formulaHint: 'Rectangle (w × h) + triangle (½ × w × roof height)'
    };
  },

  ramp(rng) { // rectangle + right-triangle ramp on the side
    const unit = pick(rng, UNITS);
    const w = ri(rng, 5, 11);
    const h = ri(rng, 4, 9);
    let d = ri(rng, 3, 8);
    if ((d * h) % 2 === 1) d++;
    const f = fitter(w + d, h);
    let s = poly([[0, 0], [w, 0], [w + d, h], [0, h]], f);
    s += dashed(w, 0, w, h, f);
    s += labelPx(w / 2, 0, 0, -8, fmt(w) + ' ' + unit, f);
    s += labelPx(0, h / 2, -12, 4, fmt(h) + ' ' + unit, f, 'end', 'hl');
    s += labelPx(w + d / 2, h, 0, 20, fmt(d) + ' ' + unit, f);
    return {
      svg: svgWrap(s), unit, kind: 'composite (ramp)',
      prompt: 'Total area of the figure? <span class="subtle">(rectangle + right triangle)</span>',
      answer: w * h + (d * h) / 2,
      formulaHint: 'Rectangle (w × h) + triangle (½ × d × h)'
    };
  },

  lshape(rng) { // big rectangle with a rectangular notch removed
    const unit = pick(rng, UNITS);
    const W = ri(rng, 8, 14), H = ri(rng, 6, 11);
    const w = ri(rng, 3, W - 4), h = ri(rng, 2, H - 3);
    const f = fitter(W, H);
    let s = poly([[0, 0], [W - w, 0], [W - w, h], [W, h], [W, H], [0, H]], f);
    s += labelPx((W - w) / 2, 0, 0, -8, fmt(W - w) + ' ' + unit, f);
    s += labelPx(0, H / 2, -12, 4, fmt(H) + ' ' + unit, f, 'end');
    s += labelPx(W / 2, H, 0, 20, fmt(W) + ' ' + unit, f);
    s += labelPx(W - w, h / 2, -5, 4, fmt(h) + ' ' + unit, f, 'end', 'hl');
    s += labelPx(W - w / 2, h, 0, -8, fmt(w) + ' ' + unit, f);
    return {
      svg: svgWrap(s), unit, kind: 'composite (L-shape)',
      prompt: 'Area of the L-shaped figure?',
      answer: W * H - w * h,
      formulaHint: 'Big rectangle (' + W + '×' + H + ') minus the notch (' + w + '×' + h + ')'
    };
  }
};

// ---------- mode decks ----------
// Each mode maps a problem index (0-based) to a generator call; difficulty ramps.
const MODES = {
  para: {
    name: 'Parallelogram Alley',
    gen(rng, i) {
      if (i < 3) return Problems.parallelogram(rng, 1);
      if (i < 7) return Problems.parallelogram(rng, 2);
      if (rng() < 0.3) return Problems.parallelogramInverse(rng);
      return Problems.parallelogram(rng, rng() < 0.5 ? 2 : 3);
    }
  },
  tri: {
    name: 'Triangle Turnpike',
    gen(rng, i) {
      if (i < 3) return Problems.triangle(rng, 1);
      if (i < 7) return Problems.triangle(rng, 2);
      if (rng() < 0.3) return Problems.triangleInverse(rng);
      return Problems.triangle(rng, rng() < 0.55 ? 2 : 3);
    }
  },
  mixed: {
    name: 'Rush Hour (Mixed)',
    gen(rng, i) {
      const lvl = i < 3 ? 1 : 2;
      if (i >= 6 && rng() < 0.22) return rng() < 0.5 ? Problems.parallelogramInverse(rng) : Problems.triangleInverse(rng);
      return rng() < 0.5 ? Problems.parallelogram(rng, lvl) : Problems.triangle(rng, lvl);
    }
  },
  strange: {
    name: 'Strange Shapes',
    gen(rng, i) {
      if (i < 2) return Problems.trapezoid(rng);
      const r = rng();
      if (r < 0.3) return Problems.trapezoid(rng);
      if (r < 0.55) return Problems.house(rng);
      if (r < 0.8) return Problems.ramp(rng);
      return Problems.lshape(rng);
    }
  }
};
