// jobs.js — NIGHTFALL: the six heists.
// Math targets (rising 6th grade / RSM Pre-Algebra Prep):
//   equations w/ distribution, like terms, fraction & mixed-number arithmetic,
//   word problems -> equations, clever computation, order of operations,
//   prime factorization / LCM / GCF, and "find the mistake" forensics.

// ---------- tiny math-display helpers ----------
function FR(n, d) {
  return '<span class="fr"><span class="frn">' + n + '</span><span class="frd">' + d + '</span></span>';
}
function MX(w, n, d) { return '<span class="mx">' + w + '</span>' + FR(n, d); }
function SUP(b, e) { return b + '<sup>' + e + '</sup>'; }

// Crew voices for hints
const CREW = {
  ace:    { name: 'ACE',    color: '#3de0ff', title: 'the planner' },
  wrench: { name: 'WRENCH', color: '#ffd23d', title: 'the gadgets' },
  ghost:  { name: 'GHOST',  color: '#b18aff', title: 'the infiltrator' },
  muffin: { name: 'MUFFIN', color: '#ff9d5c', title: 'the driver' }
};

const JOBS = [

  // ============================================================
  // JOB 1 — THE PAWN KING
  // ============================================================
  {
    id: 'pawnking',
    codename: 'JOB 01',
    title: 'The Pawn King',
    description: 'A Syndicate fence runs a pawn shop on Ninth Street. Crack his ledger and take back what he skimmed. Warm-up: integers, order of operations, first locks.',
    emblem: '🂡',
    heatPerMiss: 12,
    intro:
      '<p>Rain on the windows of the safehouse. <b>ACE</b> spreads a blueprint across the table and taps a building circled in red.</p>' +
      '<p>"The Ledger Syndicate has been bleeding this city for years — rigged books, crooked math, everybody pays. Tonight we start taking it back. This is Marlow the Pawn King. Fence for the Syndicate. His shop is a front."</p>' +
      '<p><b>WRENCH</b> slides a headset across the table. "Every Syndicate lock runs on numbers, kid. You\'re <b>THE CIPHER</b> — you crack \'em, we walk in like we own the place."</p>' +
      '<p>Out front, a battered getaway van idles. Behind the wheel: a capybara wearing sunglasses at night, calmly eating a piece of lettuce. <b>MUFFIN</b> nods once. That means it\'s time.</p>' +
      '<p class="brief-rule">Watch the <b>HEAT</b> bar. Wrong answers make noise. Fill it and the alarm trips — Muffin has to circle the block, and circling costs us loot.</p>',
    outro:
      '<p>The strongbox swings open. Stacks of skimmed cash — every dollar Marlow squeezed out of Ninth Street.</p>' +
      '<p>Ace grins. "Load it up. Tomorrow the whole block finds envelopes under their doors."</p>' +
      '<p>Muffin pulls up at the curb at exactly the right second, chewing at exactly the same speed.</p>',
    challenges: [
      {
        type: 'keypad',
        value: 400,
        story: 'Midnight. The alley behind the pawn shop. The back door has a keypad, and Wrench has scratched the master formula onto the delivery schedule.',
        prompt: 'The door code is the value of this expression. Order of operations — no shortcuts.',
        expr: '7 + 3 · (10 − 4)',
        answer: 25,
        hint: { who: 'wrench', text: 'Parentheses first: (10 − 4) = 6. Then multiply, THEN add. The code is 7 + 18.' }
      },
      {
        type: 'choice',
        value: 400,
        story: 'Inside. A junction box guards the camera loop. Four wires, each tagged with a number. Cut the one that matches.',
        prompt: 'Cut the wire whose tag equals <b>−15 · 4</b>.',
        options: ['−60', '60', '−19', '−11'],
        correct: 0,
        hint: { who: 'ghost', text: 'Negative times positive is negative. 15 · 4 = 60, so keep the minus sign.' }
      },
      {
        type: 'keypad',
        value: 400,
        story: 'The camera loop dies. Ghost slips to the cash cage. The till has a cheap two-button lock: one number, signed.',
        prompt: 'Enter the value. Mind the sign.',
        expr: '56 ÷ (−8)',
        answer: -7,
        hint: { who: 'ghost', text: 'Positive divided by negative is negative. Use the ± key.' }
      },
      {
        type: 'keypad',
        value: 450,
        story: 'Marlow\'s desk drawer is rigged with a number lock. A sticky note on the blotter reads: "x minus fifteen is sixty-two."',
        prompt: 'Solve for <b>x</b> — that\'s the combination.',
        expr: 'x − 15 = 62',
        answer: 77,
        hint: { who: 'ace', text: 'Undo the minus 15: add 15 to both sides.' }
      },
      {
        type: 'keypad',
        value: 450,
        story: 'Inside the drawer: a strong little lockbox. Two steps this time — Marlow is learning.',
        prompt: 'Solve for <b>x</b>.',
        expr: '2x − 15 = 17',
        answer: 16,
        hint: { who: 'ace', text: 'Add 15 to both sides first (2x = 32), THEN divide by 2.' }
      },
      {
        type: 'keypad',
        value: 500,
        timer: 90,
        story: 'Headlights sweep the front window — a Syndicate patrol car, slow-rolling the block. Muffin flashes the brights twice: NINETY SECONDS.',
        prompt: 'The floor safe wants this. Too big to grind out by hand — find the <b>clever way</b> before the patrol comes back.',
        expr: '164 · 25 − 25 · 64',
        answer: 2500,
        hint: { who: 'wrench', text: 'Both terms share a 25. Factor it out: 25 · (164 − 64) = 25 · 100.' }
      },
      {
        type: 'forgery',
        value: 600,
        story: 'Ghost photographs Marlow\'s ledger. One entry is cooked — the Syndicate\'s accountant "checked" it and signed off. Play teacher: find the rotten line.',
        prompt: 'Tap the <b>first line where the work goes wrong</b>.',
        lines: [
          '851 − (831 + 7)',
          '= 851 − 831 + 7',
          '= 20 + 7',
          '= 27  ✓ <span class="doc-sig">approved — L.S.</span>'
        ],
        badLine: 1,
        fixPrompt: 'Now fix it. What is the true value of 851 − (831 + 7)?',
        fix: { kind: 'number', answer: 13 },
        hint: { who: 'ace', text: 'Subtracting a GROUP means subtracting everything in it: 851 − 831 − 7.' }
      },
      {
        type: 'keypad',
        value: 500,
        story: 'The back office. Marlow\'s "special inventory" cabinet — the lock has parentheses etched right into the plate.',
        prompt: 'Solve for <b>x</b>.',
        expr: '2x − (x + 2) = 10',
        answer: 12,
        hint: { who: 'ghost', text: 'The minus hits the whole group: 2x − x − 2 = 10. Combine, then undo the −2.' }
      },
      {
        type: 'boss',
        value: 1500,
        story: 'The Pawn King\'s strongbox. Two dials, one after the other. Wrench whistles low: "Genuine Syndicate steel. Show it who you are, Cipher."',
        prompt: 'Crack both dials to open the strongbox.',
        bossName: 'THE STRONGBOX',
        stages: [
          { kind: 'keypad', label: 'DIAL 1', prompt: 'Solve for <b>x</b>.', expr: '3x = 87 − 6', answer: 27,
            hint: { who: 'ace', text: 'Simplify the right side first: 87 − 6 = 81. Then divide by 3.' } },
          { kind: 'keypad', label: 'DIAL 2', prompt: 'Solve for <b>x</b>.', expr: '4x + 2x + 5 = 3x + 35', answer: 10,
            hint: { who: 'ace', text: 'Combine 4x + 2x first. Then get the x terms on one side: 6x − 3x = 35 − 5.' } }
        ]
      }
    ]
  },

  // ============================================================
  // JOB 2 — NEON PALACE ARCADE
  // ============================================================
  {
    id: 'neonpalace',
    codename: 'JOB 02',
    title: 'Neon Palace Arcade',
    description: 'The Syndicate launders cash through a glittering arcade downtown. Every machine is wired with expressions — combine like terms, distribute, and bleed the place dry.',
    emblem: '🕹',
    heatPerMiss: 12,
    intro:
      '<p>The Neon Palace never closes. Skee-ball, claw machines, a change counter that hums all night — and under the floor, a river of dirty Syndicate money.</p>' +
      '<p>"Every machine reports to a central counting room," says <b>ACE</b>. "The wiring is pure algebra. Terms that MATCH can be combined. Terms that don\'t — can\'t. Mix them up and the whole panel screams."</p>' +
      '<p><b>WRENCH</b> hands you a wire cutter shaped suspiciously like a pencil. "Like terms, kid. 3a and 2a are cousins. 3a and 2b are strangers. Don\'t introduce strangers."</p>' +
      '<p>Muffin backs the van into the loading dock and turns on the radio. Smooth jazz. It\'s going to be that kind of night.</p>',
    outro:
      '<p>The counting room stands open. Bins of quarters, bricks of bills — all of it skimmed from the neighborhood, all of it going back.</p>' +
      '<p>Wrench pockets a single arcade token "for science." Ace pretends not to see.</p>' +
      '<p>On the drive home, Muffin takes a corner so smoothly the tower of coin bins doesn\'t even wobble.</p>',
    challenges: [
      {
        type: 'choice',
        value: 400,
        story: 'The service entrance is wired with four cables. The label on the junction box reads: −3a − 2a. Only the cable with the matching simplified tag is safe to cut.',
        prompt: 'Simplify: <b>−3a − 2a</b>',
        options: ['−5a', '−a', '−5', 'a'],
        correct: 0,
        hint: { who: 'wrench', text: 'Both terms are "a" terms. Negative 3 and negative 2 together: negative 5 of them.' }
      },
      {
        type: 'choice',
        value: 400,
        story: 'A claw machine blocks the hallway — its power cable is braided into three identical strands labeled t.',
        prompt: 'Simplify: <b>t + t + t</b>',
        options: ['3t', 't³', 't + 3', '3 + t'],
        correct: 0,
        hint: { who: 'wrench', text: 'Three copies of t ADDED is 3 times t. (t·t·t would be t³ — that\'s multiplying.)' }
      },
      {
        type: 'keypad',
        value: 450,
        story: 'The change counter\'s control board wants a single number: the coefficient left when the expression collapses.',
        prompt: 'Simplify <b>−13s − 12s</b>. It becomes one term: <span class="inline-math">?s</span>. Enter the <b>coefficient</b> (the number in front).',
        answer: -25,
        hint: { who: 'ace', text: 'Owing 13 and then owing 12 more. Use the ± key.' }
      },
      {
        type: 'choice',
        value: 450,
        story: 'The skee-ball lane hides a pressure plate. Its disarm tag is written in factored form — expand it to match a wire.',
        prompt: 'Distribute: <b>3(x − 8)</b>',
        options: ['3x − 24', '3x − 8', '3x + 24', 'x − 24'],
        correct: 0,
        hint: { who: 'ghost', text: 'The 3 multiplies BOTH things inside: 3·x and 3·8.' }
      },
      {
        type: 'choice',
        value: 450,
        story: 'A camera pivots on the ceiling. Its blind-spot timer is keyed to a subtraction with parentheses.',
        prompt: 'Simplify: <b>2x − (x − 1)</b>',
        options: ['x + 1', 'x − 1', '3x − 1', 'x − 3'],
        correct: 0,
        hint: { who: 'ghost', text: 'The minus flips EVERY sign inside: 2x − x + 1.' }
      },
      {
        type: 'choice',
        value: 500,
        story: 'The counting room door. Two locks in opposition — Wrench calls it "the tug-of-war."',
        prompt: 'Simplify: <b>−(2a − b) + (2a + b)</b>',
        options: ['2b', '4a', '0', '4a + 2b'],
        correct: 0,
        hint: { who: 'wrench', text: 'First flip: −2a + b. Then add 2a + b. The a\'s cancel — what survives?' }
      },
      {
        type: 'forgery',
        value: 600,
        story: 'Inside: the Syndicate\'s wiring diagram, "verified" by their accountant. Ghost smells a fake. If the crew rewires by this doc, the panel fries.',
        prompt: 'Tap the <b>first line where the work goes wrong</b>.',
        lines: [
          '−4(a + b) − 5(b + a)',
          '= −4a + 4b − 5b − 5a',
          '= −9a − b',
          'PANEL SAFE ✓ <span class="doc-sig">approved — L.S.</span>'
        ],
        badLine: 1,
        fixPrompt: 'Fix it. What does −4(a + b) − 5(b + a) really simplify to?',
        fix: { kind: 'choice', options: ['−9a − 9b', '−9a + 9b', '−9a − b', '−a − 9b'], correct: 0 },
        hint: { who: 'ace', text: '−4 times (a + b) is −4a MINUS 4b. The minus distributes to both terms.' }
      },
      {
        type: 'keypad',
        value: 500,
        timer: 90,
        story: 'A floor manager\'s flashlight bobs between the pinball machines. Muffin taps the horn once — soft. NINETY SECONDS before his round brings him here.',
        prompt: 'The coin vault wants this monster. There\'s a clever way — find it fast.',
        expr: '263 · 48 − 48 · 63',
        answer: 9600,
        hint: { who: 'wrench', text: 'Factor out the 48: 48 · (263 − 63) = 48 · 200.' }
      },
      {
        type: 'keypad',
        value: 500,
        story: 'The vault\'s inner panel is a mess of terms — the Syndicate\'s idea of camouflage. Wrench grins: "Watch. Most of this cancels."',
        prompt: 'Simplify <b>2x + 5 + (−3x) + (−7) + x + 1</b>. The x-terms vanish completely — enter the number that remains.',
        answer: -1,
        hint: { who: 'wrench', text: 'x-terms: 2 − 3 + 1 = 0. Gone! Numbers: 5 − 7 + 1.' }
      },
      {
        type: 'boss',
        value: 1500,
        story: 'The master cash line runs through one final panel: THE JACKPOT. Two interlocked circuits. Get both, and every machine in the Palace pays out at once.',
        prompt: 'Crack both circuits.',
        bossName: 'THE JACKPOT',
        stages: [
          { kind: 'choice', label: 'CIRCUIT 1', prompt: 'Simplify: <b>3(x − 2) − 2(x − 2)</b>',
            options: ['x − 2', 'x + 2', '5x − 10', 'x'], correct: 0,
            hint: { who: 'ace', text: 'Three of something minus two of the same something leaves ONE of it. Or distribute: 3x − 6 − 2x + 4.' } },
          { kind: 'keypad', label: 'CIRCUIT 2', prompt: 'Simplify and enter the value:', expr: '−x + 17 + (−12) + x', answer: 5,
            hint: { who: 'wrench', text: '−x and +x cancel. 17 − 12 is all that\'s left.' } }
        ]
      }
    ]
  },

  // ============================================================
  // JOB 3 — FIRST MERIDIAN BANK
  // ============================================================
  {
    id: 'meridian',
    codename: 'JOB 03',
    title: 'First Meridian Bank',
    description: 'The Syndicate\'s crooked bank. Every vault door is a multi-step equation — distribute, combine, isolate. This is the big leagues, Cipher.',
    emblem: '🏦',
    heatPerMiss: 14,
    intro:
      '<p>First Meridian looks respectable: marble columns, brass doors, a lobby that smells like money. <b>ACE</b> looks at it the way other people look at a rattlesnake.</p>' +
      '<p>"This is where the Syndicate keeps what they steal. The vault doors run on multi-step locks — parentheses, x on both sides, the works. One rule gets you through all of them: <b>distribute first, combine like terms, then peel the equation apart</b>."</p>' +
      '<p><b>GHOST</b> adds, quietly: "And watch for booby traps. Some locks are fakes — equations with no answer at all. Force one and it\'s sirens. If the x\'s vanish and the numbers disagree, walk away."</p>' +
      '<p>Muffin parks in the bus zone. Nobody tickets Muffin.</p>',
    outro:
      '<p>The Governor vault rolls open like thunder. Inside: deeds, savings, pensions — the whole neighborhood\'s stolen future, boxed and labeled.</p>' +
      '<p>"Every box goes home," Ace says. "Every single one."</p>' +
      '<p>Ghost is already gone — but the loading dock doors are unlocked, and that\'s the same thing as a goodbye.</p>',
    challenges: [
      {
        type: 'keypad',
        value: 450,
        story: 'The staff entrance. A two-step lock, standard Syndicate issue. You\'ve eaten these for breakfast.',
        prompt: 'Solve for <b>x</b>.',
        expr: '7x + 9 = 86',
        answer: 11,
        hint: { who: 'ace', text: 'Subtract 9 from both sides, then divide by 7.' }
      },
      {
        type: 'keypad',
        value: 500,
        story: 'The lobby gate. For the first time tonight, x shows up on BOTH sides of the lock.',
        prompt: 'Solve for <b>x</b>. (Yes, the answer can be negative.)',
        expr: '2(x + 1) = 3x + 5',
        answer: -3,
        hint: { who: 'ace', text: 'Distribute: 2x + 2 = 3x + 5. Move the smaller x-term over: 2 = x + 5.' }
      },
      {
        type: 'keypad',
        value: 500,
        story: 'The teller line. Ghost points at the lock plate: parentheses on BOTH sides. "Distribute both. No mercy."',
        prompt: 'Solve for <b>x</b>.',
        expr: '3(2x − 7) = 5 − (1 − x)',
        answer: 5,
        hint: { who: 'ghost', text: 'Left: 6x − 21. Right: 5 − 1 + x = 4 + x. Now solve 6x − 21 = 4 + x.' }
      },
      {
        type: 'forgery',
        value: 650,
        story: 'A maintenance log taped inside the stairwell — the Syndicate\'s "solution" for the service-door lock. If it\'s right, the door is open. Ghost narrows her eyes: it isn\'t.',
        prompt: 'Tap the <b>first line where the work goes wrong</b>.',
        lines: [
          '(2x − 7) − (x − 5) = 0',
          '2x − 7 − x − 5 = 0',
          'x − 12 = 0',
          'x = 12  ✓ <span class="doc-sig">approved — L.S.</span>'
        ],
        badLine: 1,
        fixPrompt: 'Fix it. What is the true value of x?',
        fix: { kind: 'number', answer: 2 },
        hint: { who: 'ghost', text: 'Subtracting (x − 5) gives −x PLUS 5. Minus a minus is a plus.' }
      },
      {
        type: 'choice',
        value: 550,
        story: 'Third floor. A gleaming vault door, almost too inviting. Ghost holds up a fist: STOP. "Remember what I said about fakes."',
        prompt: 'Solve — carefully: <b>3(x + 5) − 2(x + 3) = x + 1</b>',
        options: [
          'No solution — it\'s a booby trap. Step away.',
          'x = 4',
          'x = −8',
          'x = 1'
        ],
        correct: 0,
        hint: { who: 'ghost', text: 'Simplify the left side: 3x + 15 − 2x − 6 = x + 9. So x + 9 = x + 1... subtract x from both sides. Can 9 ever equal 1?' }
      },
      {
        type: 'keypad',
        value: 550,
        timer: 100,
        story: 'A guard\'s keycard beeps at the far end of the hall — he\'s doing rounds. Muffin\'s voice crackles on the radio for the first time ever. It says: "hurry." (It might have been a chew.)',
        prompt: 'Crack it before the guard rounds the corner.',
        expr: '5(x − 9) − 7(3x + 6) = 25',
        answer: -7,
        hint: { who: 'ace', text: 'Distribute: 5x − 45 − 21x − 42 = 25 → −16x − 87 = 25. Add 87, divide by −16.' }
      },
      {
        type: 'keypad',
        value: 600,
        story: 'The manager\'s office. On the desk, a photo of the Syndicate\'s accountant shaking hands with the mayor. Behind the photo: a wall safe.',
        prompt: 'Solve for <b>x</b>.',
        expr: '8(5x − 3) − 11(3x + 7) = 102',
        answer: 29,
        hint: { who: 'ace', text: '40x − 24 − 33x − 77 = 102 → 7x − 101 = 102. You\'ve got this.' }
      },
      {
        type: 'keypad',
        value: 550,
        story: 'The vault antechamber. One last standard lock before the Governor. Your hands aren\'t even shaking anymore.',
        prompt: 'Solve for <b>x</b>.',
        expr: '9(x − 2) − 4(x − 3) = 34',
        answer: 8,
        hint: { who: 'wrench', text: '9x − 18 − 4x + 12 = 34 → 5x − 6 = 34. Watch the sign on −4·(−3).' }
      },
      {
        type: 'boss',
        value: 1800,
        story: 'THE GOVERNOR. First Meridian\'s master vault — three tumbler rings, each a full multi-step equation. Ace puts a hand on your shoulder. "Distribute. Combine. Isolate. Bring it home, Cipher."',
        prompt: 'Crack all three tumbler rings.',
        bossName: 'THE GOVERNOR',
        stages: [
          { kind: 'keypad', label: 'RING 1', prompt: 'Solve for <b>x</b>.', expr: '2(x − 3) + 4 = 10', answer: 6,
            hint: { who: 'ace', text: '2x − 6 + 4 = 10 → 2x − 2 = 10.' } },
          { kind: 'keypad', label: 'RING 2', prompt: 'Solve for <b>x</b>.', expr: '4(2x + 1) − 3(x − 2) = 30', answer: 4,
            hint: { who: 'ace', text: '8x + 4 − 3x + 6 = 30 → 5x + 10 = 30.' } },
          { kind: 'keypad', label: 'RING 3', prompt: 'Solve for <b>x</b>.', expr: '7 − 4(3x − 1) − 6(x + 11) = 2x + 5', answer: -3,
            hint: { who: 'ghost', text: '7 − 12x + 4 − 6x − 66 = 2x + 5 → −18x − 55 = 2x + 5. Get the x\'s together: −60 = 20x.' } }
        ]
      }
    ]
  },

  // ============================================================
  // JOB 4 — THE GOLDEN SLICE
  // ============================================================
  {
    id: 'goldenslice',
    codename: 'JOB 04',
    title: 'The Golden Slice Casino',
    description: 'The Syndicate\'s casino pays winners in rigged fractions — the house always rounds its way. Every vault dial here takes a fraction, in lowest terms. Bring your denominators.',
    emblem: '🎰',
    heatPerMiss: 14,
    intro:
      '<p>The Golden Slice floats on the river like a wedding cake made of light. Inside, every game is crooked the same way: the payouts are fractions, and the house "simplifies" them wrong.</p>' +
      '<p>"The vault dials here don\'t take whole numbers," says <b>ACE</b>. "They take fractions — and they only accept <b>lowest terms</b>. Right value, wrong form, and the dial spits it back."</p>' +
      '<p><b>WRENCH</b> hands you a card with one sentence on it: <i>Common denominators are lockpicks.</i></p>' +
      '<p>Muffin idles by the dock in a speedboat tonight. Where Muffin got a speedboat is not a question anyone asks out loud.</p>',
    outro:
      '<p>The Dealer\'s vault opens on a mountain of chips — every "house rounding error" from ten crooked years, stacked to the ceiling.</p>' +
      '<p>Ace does the math out loud, for the pleasure of it. "Cash value, split fairly, comes to every player the Slice ever cheated."</p>' +
      '<p>Muffin guns the speedboat once, majestically, across the moonlit river.</p>',
    challenges: [
      {
        type: 'fraction',
        value: 450,
        story: 'The service dock gate. The dial shows 22/52 — but it will only turn on the reduced form.',
        prompt: 'Reduce to lowest terms: ' + FR(22, 52),
        answer: { n: 11, d: 26 },
        hint: { who: 'wrench', text: 'Both are even — divide top and bottom by 2. Then check: does anything else divide both 11 and 26?' }
      },
      {
        type: 'fraction',
        value: 500,
        story: 'The chip-exchange window. Three fractions, one dial. Wrench taps the card: common denominators.',
        prompt: 'Compute: ' + FR(5, 12) + ' + ' + FR(1, 4) + ' − ' + FR(1, 3),
        answer: { n: 1, d: 3 },
        hint: { who: 'wrench', text: 'Twelfths: 5/12 + 3/12 − 4/12. Then reduce.' }
      },
      {
        type: 'keypad',
        value: 450,
        story: 'A pit boss\'s keycard is coded as "three quarters of the table count." The floor has 44 tables.',
        prompt: 'Find ' + FR(3, 4) + ' of 44.',
        answer: 33,
        hint: { who: 'ace', text: '"Of" means multiply: 44 ÷ 4 = 11, then × 3.' }
      },
      {
        type: 'fraction',
        value: 500,
        story: 'The high-roller elevator. The dial wants a mixed number — whole part and fraction part.',
        prompt: 'Compute: 8 − ' + MX(2, 1, 6),
        answer: { w: 5, n: 5, d: 6 },
        hint: { who: 'ghost', text: 'Borrow: 8 = 7 + 6/6. Then 7 6/6 − 2 1/6.' }
      },
      {
        type: 'fraction',
        value: 550,
        story: 'The counting room door. Ninths against thirds — the house hopes you\'ll panic.',
        prompt: 'Compute: ' + MX(10, 1, 3) + ' − ' + MX(5, 4, 9),
        answer: { w: 4, n: 8, d: 9 },
        hint: { who: 'wrench', text: 'Ninths: 10 3/9 − 5 4/9. You\'ll need to borrow: 9 12/9 − 5 4/9.' }
      },
      {
        type: 'forgery',
        value: 650,
        story: 'A payout slip, stamped and "verified." A player won 7/15 + 2/3 of a jackpot share and the house paid 3/5. Ghost slides it across: "Play teacher."',
        prompt: 'Tap the <b>first line where the work goes wrong</b>.',
        lines: [
          FR(7, 15) + ' + ' + FR(2, 3),
          FR(2, 3) + ' = ' + FR(2, 15),
          FR(7, 15) + ' + ' + FR(2, 15) + ' = ' + FR(9, 15),
          '= ' + FR(3, 5) + '  ✓ <span class="doc-sig">approved — L.S.</span>'
        ],
        badLine: 1,
        fixPrompt: 'Fix it. What is 7/15 + 2/3 really? (Mixed number, lowest terms.)',
        fix: { kind: 'fraction', answer: { w: 1, n: 2, d: 15 } },
        hint: { who: 'ace', text: 'To turn thirds into fifteenths, multiply top AND bottom by 5: 2/3 = 10/15.' }
      },
      {
        type: 'fraction',
        value: 550,
        story: 'The vault antechamber. Sixths meet twenty-fourths. The dial hums, waiting.',
        prompt: 'Compute: ' + MX(9, 5, 6) + ' − ' + FR(7, 24),
        answer: { w: 9, n: 13, d: 24 },
        hint: { who: 'wrench', text: 'Twenty-fourths: 5/6 = 20/24. Then 9 20/24 − 7/24.' }
      },
      {
        type: 'keypad',
        value: 600,
        story: 'A lock with a letter in it — the house thought variables would scare you off. Adorable.',
        prompt: 'Solve for <b>z</b>: &nbsp;' + FR(4, 15) + 'z + ' + FR(5, 6) + 'z + ' + FR(1, 2) + ' = ' + MX(1, 3, 5),
        answer: 1,
        hint: { who: 'ace', text: 'Combine the z-terms: 4/15 + 5/6 = 8/30 + 25/30 = 33/30 = 11/10. And 1 3/5 − 1/2 = 11/10. So (11/10)z = 11/10.' }
      },
      {
        type: 'fraction',
        value: 600,
        story: 'The Dealer\'s private stair. Six fractions cascade down the lock plate, alternating signs — a telescope of halves.',
        prompt: 'Compute the easiest way: ' + FR(1, 2) + ' − ' + FR(1, 4) + ' + ' + FR(1, 8) + ' − ' + FR(1, 16) + ' + ' + FR(1, 32) + ' − ' + FR(1, 64),
        answer: { n: 21, d: 64 },
        hint: { who: 'wrench', text: 'Everything over 64: 32 − 16 + 8 − 4 + 2 − 1, all in 64ths.' }
      },
      {
        type: 'boss',
        value: 1800,
        story: 'THE HOUSE DEALER — the casino\'s master vault. Three dials in sequence, and the whole expression is printed above them in gold leaf: 3 − 2⅓ · 3/14 + 1⅓ ÷ ⅘. "Order of operations," Ace murmurs. "Multiply and divide first. Take it in pieces."',
        prompt: 'Work the expression piece by piece.',
        bossName: 'THE HOUSE DEALER',
        stages: [
          { kind: 'fraction', label: 'DIAL 1 · the product', prompt: 'First piece: ' + MX(2, 1, 3) + ' · ' + FR(3, 14),
            answer: { n: 1, d: 2 },
            hint: { who: 'wrench', text: '2 1/3 = 7/3. Then 7/3 · 3/14 — cancel before you multiply.' } },
          { kind: 'fraction', label: 'DIAL 2 · the quotient', prompt: 'Second piece: ' + MX(1, 1, 3) + ' ÷ ' + FR(4, 5),
            answer: { w: 1, n: 2, d: 3 },
            hint: { who: 'wrench', text: '4/3 ÷ 4/5 = 4/3 · 5/4. Flip the second and multiply.' } },
          { kind: 'fraction', label: 'DIAL 3 · the total', prompt: 'Now the whole thing: 3 − ' + FR(1, 2) + ' + ' + MX(1, 2, 3),
            answer: { w: 4, n: 1, d: 6 },
            hint: { who: 'ace', text: 'Sixths: 3 = 18/6, 1/2 = 3/6, 1 2/3 = 10/6. So 18 − 3 + 10, in sixths.' } }
        ]
      }
    ]
  },

  // ============================================================
  // JOB 5 — THE COUNTERFEIT BUREAU
  // ============================================================
  {
    id: 'bureau',
    codename: 'JOB 05',
    title: 'The Counterfeit Bureau',
    description: 'The Syndicate\'s document mill: fake ages, fake ledgers, fake everything. Turn their stories into equations, and their forgeries against them.',
    emblem: '🖋',
    heatPerMiss: 14,
    intro:
      '<p>Above a print shop on Delancey, the Syndicate runs its real weapon: the Counterfeit Bureau. Fake permits. Fake deeds. Fake arithmetic, signed and stamped.</p>' +
      '<p>"Every document in there is a story," <b>ACE</b> says. "And every story is an equation wearing a coat. Your job: pick the RIGHT equation for the story, then solve it. Choose the wrong equation and the safe knows."</p>' +
      '<p><b>GHOST</b> hands you a forger\'s loupe. "And when you see worked math with a stamp on it — assume it\'s lying until you prove otherwise."</p>' +
      '<p>Muffin is disguised as a newspaper vendor across the street. The disguise is a hat. It is completely effective.</p>',
    outro:
      '<p>File by file, the Bureau\'s fakes go into the shredder, and the REAL records — the ones the Syndicate buried — go into the van.</p>' +
      '<p>"Deeds, birthdays, bank books," Ace reads. "People are about to get their own lives handed back."</p>' +
      '<p>Muffin sells one actual newspaper before leaving the disguise behind. Committed to the role, to the end.</p>',
    challenges: [
      {
        type: 'intel',
        value: 550,
        story: 'The first cabinet is keyed to a claim on a Syndicate ID card: "Three consecutive integers add to 54."',
        prompt: 'Which equation matches the story?',
        equations: [
          'x + (x + 1) + (x + 2) = 54',
          '3x = 54',
          'x + (x + 2) + (x + 4) = 54'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. Enter the <b>smallest</b> of the three integers.',
        answer: 17,
        hint: { who: 'ace', text: 'Consecutive integers step by 1: x, x+1, x+2. Combine: 3x + 3 = 54.' }
      },
      {
        type: 'intel',
        value: 600,
        story: 'A shipping manifest, obviously fake: "Three consecutive EVEN integers total 378 crates."',
        prompt: 'Which equation matches the story?',
        equations: [
          'x + (x + 2) + (x + 4) = 378',
          'x + (x + 1) + (x + 2) = 378',
          '3x + 2 = 378'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. Enter the <b>middle</b> integer.',
        answer: 126,
        hint: { who: 'ace', text: 'EVEN integers step by 2: x, x+2, x+4. So 3x + 6 = 378.' }
      },
      {
        type: 'intel',
        value: 600,
        story: 'Two Syndicate payroll files, stapled together: "Bill is 5 years older than Sue. Their ages sum to 67."',
        prompt: 'Let s = Sue\'s age. Which equation matches?',
        equations: [
          's + (s + 5) = 67',
          's + 5s = 67',
          '2s − 5 = 67'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. How old is <b>Bill</b>?',
        answer: 36,
        hint: { who: 'ghost', text: '2s + 5 = 67, so Sue is 31. Bill is FIVE MORE than Sue — read the question again before you type.' }
      },
      {
        type: 'intel',
        value: 600,
        story: 'A combination hidden in a riddle, in the Accountant\'s own handwriting: "I divided 80 by my number, then added 13. The result was 93."',
        prompt: 'Let x be the number. Which equation matches?',
        equations: [
          '80 ÷ x + 13 = 93',
          'x ÷ 80 + 13 = 93',
          '80x + 13 = 93'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. What was the number?',
        answer: 1,
        hint: { who: 'wrench', text: '80 ÷ x = 80. What do you divide 80 by to get 80?' }
      },
      {
        type: 'intel',
        value: 600,
        story: 'Another riddle-lock, smugger than the last: "I thought of a number, added 3, then increased the result 5 times. I got 25."',
        prompt: 'Which equation matches?',
        equations: [
          '5(x + 3) = 25',
          '5x + 3 = 25',
          'x + 3 · 5 = 25'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. What was the number?',
        answer: 2,
        hint: { who: 'ace', text: '"Added 3 FIRST, then multiplied the whole thing by 5" — that\'s why (x + 3) wears parentheses.' }
      },
      {
        type: 'forgery',
        value: 700,
        story: 'The Bureau\'s masterpiece: a forged age affidavit. "Abigail is 8 years older than Cynthia. Twenty years ago, Abigail was three times as old as Cynthia." The Syndicate\'s work is attached.',
        prompt: 'Tap the <b>first line where the work goes wrong</b>.',
        lines: [
          'Let C = Cynthia\'s age now, so Abigail = C + 8',
          'Twenty years ago:&nbsp; C + 8 = 3(C − 20)',
          'C + 8 = 3C − 60',
          '68 = 2C, so C = 34  ✓ <span class="doc-sig">approved — L.S.</span>'
        ],
        badLine: 1,
        fixPrompt: 'Fix it. How old is Cynthia really?',
        fix: { kind: 'number', answer: 24 },
        hint: { who: 'ghost', text: 'Twenty years ago BOTH of them were 20 years younger. Abigail was (C + 8) − 20, not C + 8.' }
      },
      {
        type: 'intel',
        value: 650,
        story: 'The lumber-room safe (the Bureau fakes construction permits too): "A 65-inch board is sawed into two pieces. One piece is 7 inches shorter than twice the other."',
        prompt: 'Let x = the shorter piece. Which equation matches?',
        equations: [
          'x + (2x − 7) = 65',
          'x + 2x + 7 = 65',
          '2x − 7 = 65'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. How long is the <b>longer</b> piece, in inches?',
        answer: 41,
        hint: { who: 'wrench', text: '3x − 7 = 65 → x = 24. The longer piece is 2(24) − 7. Answer the question they asked!' }
      },
      {
        type: 'intel',
        value: 650,
        story: 'The records-room lock, keyed to a Syndicate radio code: "The difference between two numbers is 5. Twice the smaller is 18 more than the larger."',
        prompt: 'Let s = the smaller number, so the larger is s + 5. Which equation matches?',
        equations: [
          '2s = (s + 5) + 18',
          '2s + 18 = s + 5',
          's − 5 = 2s + 18'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. Enter the <b>larger</b> number.',
        answer: 28,
        hint: { who: 'ace', text: '2s = s + 23 → s = 23. The larger number is 5 more.' }
      },
      {
        type: 'boss',
        value: 1800,
        story: 'THE ARCHIVE — a safe built into the Bureau\'s floor, holding the master list of everyone the Syndicate ever robbed. Its lock is a digit riddle: "I am a two-digit number. My digits sum to 13. My units digit is one more than twice my tens digit."',
        prompt: 'Break the riddle, open the Archive.',
        bossName: 'THE ARCHIVE',
        stages: [
          { kind: 'choice', label: 'STEP 1 · the setup', prompt: 'Let t = tens digit, u = units digit. Which pair of equations matches the riddle?',
            options: [
              't + u = 13 &nbsp;and&nbsp; u = 2t + 1',
              't + u = 13 &nbsp;and&nbsp; t = 2u + 1',
              't · u = 13 &nbsp;and&nbsp; u = 2t + 1',
              't + u = 13 &nbsp;and&nbsp; u = 2t − 1'
            ],
            correct: 0,
            hint: { who: 'ace', text: '"Units is one more than twice tens": u = 2t + 1. Digits SUM to 13.' } },
          { kind: 'keypad', label: 'STEP 2 · the number', prompt: 'Solve the system. Enter the two-digit number itself.',
            answer: 49,
            hint: { who: 'ace', text: 'Substitute: t + (2t + 1) = 13 → 3t = 12 → t = 4, u = 9. Tens digit first!' } }
        ]
      }
    ]
  },

  // ============================================================
  // JOB 6 — ZERO HOUR: THE MIDNIGHT VAULT
  // ============================================================
  {
    id: 'zerohour',
    codename: 'FINAL JOB',
    title: 'Zero Hour: The Midnight Vault',
    description: 'Syndicate HQ. Every trick they own, stacked into one tower — and at the bottom, the Midnight Vault and the Accountant himself. Everything you\'ve learned, all at once.',
    emblem: '🌑',
    heatPerMiss: 18,
    intro:
      '<p>Syndicate Tower at midnight: forty floors of black glass, and under it all, the Midnight Vault — where the Accountant keeps the city\'s stolen fortune behind locks built from every trick in his crooked book.</p>' +
      '<p><b>ACE</b> looks around the van. "Number theory on the doors. Timed panels. Fakes and forgeries. Fractions in the deep vault. And at the bottom — him. This is everything, all at once."</p>' +
      '<p><b>WRENCH</b> cracks her knuckles. <b>GHOST</b> vanishes — which for Ghost is a pep talk.</p>' +
      '<p>Muffin puts on a tiny earpiece and looks at you in the mirror. The look says: <i>I will keep the engine running. You will crack the vault. This is the way of things.</i></p>' +
      '<p class="brief-rule">Final job: the heat rises FAST here. Breathe. Check your signs. Distribute like you mean it.</p>',
    outro:
      '<p>The Midnight Vault stands open. It takes the whole crew, the van, the speedboat, and two borrowed grocery carts to move it all.</p>' +
      '<p>By sunrise, it\'s done: every account refilled, every deed returned, every rigged book burned in a barrel on Ninth Street while the pawn shop\'s new owner hands out coffee.</p>' +
      '<p>"The Syndicate ran this city on bad math," Ace says, watching the smoke curl. "You beat them with good math."</p>' +
      '<p>Muffin honks the horn twice. For Muffin, that is a standing ovation.</p>',
    challenges: [
      {
        type: 'choice',
        value: 500,
        story: 'The loading-dock door is stenciled with a giant 90 — a prime-lock. It opens for the true factorization only.',
        prompt: 'Which is the prime factorization of <b>90</b>?',
        options: [
          '2 · ' + SUP(3, 2) + ' · 5',
          SUP(2, 2) + ' · 3 · 5',
          '2 · 3 · ' + SUP(5, 2),
          SUP(3, 2) + ' · ' + SUP(5, 2)
        ],
        correct: 0,
        hint: { who: 'wrench', text: 'Factor tree: 90 = 2 · 45 = 2 · 9 · 5. And 9 is 3².' }
      },
      {
        type: 'twofield',
        value: 550,
        story: 'The freight elevator takes two keys, cut from the numbers 21 and 18.',
        prompt: 'Find both keys for <b>21 and 18</b>.',
        fields: [
          { label: 'LCM', answer: 126 },
          { label: 'GCF', answer: 3 }
        ],
        hint: { who: 'wrench', text: '21 = 3·7, 18 = 2·3². GCF: what they share (3). LCM: 2 · 3² · 7.' }
      },
      {
        type: 'keypad',
        value: 550,
        timer: 90,
        story: 'Floor 13. Laser grid on a timer — Ghost is holding a mirror at a very uncomfortable angle. "Whenever you\'re ready," she says, meaning NOW.',
        prompt: 'The grid control wants this — the clever way, before Ghost\'s arm gives out.',
        expr: '387 · 13 + 113 · 13',
        answer: 6500,
        hint: { who: 'wrench', text: 'Factor out the 13: 13 · (387 + 113) = 13 · 500.' }
      },
      {
        type: 'forgery',
        value: 700,
        story: 'A security memo, posted proudly by the door: the Accountant\'s own "audit" of the alarm code. Signed with a flourish.',
        prompt: 'Tap the <b>first line where the work goes wrong</b>.',
        lines: [
          SUP(4, 2) + ' + 45 ÷ 3 − 12',
          '= 8 + 45 ÷ 3 − 12',
          '= 8 + 15 − 12',
          '= 11  ✓ <span class="doc-sig">approved — L.S.</span>'
        ],
        badLine: 1,
        fixPrompt: 'Fix it. What is the true value of 4² + 45 ÷ 3 − 12?',
        fix: { kind: 'number', answer: 19 },
        hint: { who: 'ace', text: '4² means 4 · 4, not 4 · 2.' }
      },
      {
        type: 'choice',
        value: 600,
        story: 'Floor 21. A vault door so shiny it\'s suspicious. Ghost\'s voice in your ear: "Fakes and traps, Cipher. And one more kind — the lock that was never locked."',
        prompt: 'Solve — carefully: <b>6(x − 2) − 4(x − 5) = 2x + 8</b>',
        options: [
          'Every number works — the lock was never locked. Push the door.',
          'x = 0',
          'x = 4',
          'No solution — booby trap.'
        ],
        correct: 0,
        hint: { who: 'ghost', text: 'Left side: 6x − 12 − 4x + 20 = 2x + 8. That\'s... exactly the right side. TRUE for every x.' }
      },
      {
        type: 'fraction',
        value: 600,
        story: 'The deep vault stairwell. A fraction dial, old brass, fifteenths against sixths.',
        prompt: 'Compute: ' + FR(13, 15) + ' − ' + FR(1, 6),
        answer: { n: 7, d: 10 },
        hint: { who: 'wrench', text: 'Thirtieths: 26/30 − 5/30 = 21/30. Then reduce.' }
      },
      {
        type: 'intel',
        value: 650,
        story: 'The Accountant\'s desk. A jar of coins with a brass plaque: "$14.35 — an EQUAL number of pennies, nickels, dimes, and quarters. Guess how many of each, little thief."',
        prompt: 'Let x = the number of EACH coin. Which equation matches? (Work in cents.)',
        equations: [
          '41x = 1435',
          '4x = 1435',
          '46x = 1435'
        ],
        correctEq: 0,
        answerPrompt: 'Solve it. How many of each coin?',
        answer: 35,
        hint: { who: 'ace', text: 'One of each coin is 1 + 5 + 10 + 25 = 41 cents. And $14.35 = 1435 cents.' }
      },
      {
        type: 'keypad',
        value: 600,
        story: 'The vault antechamber. One last integer gauntlet, etched in black steel.',
        prompt: 'Compute: <b>−72 ÷ 8 + (−3) · (−5)</b>',
        answer: 6,
        hint: { who: 'ghost', text: '−72 ÷ 8 = −9. Negative times negative: +15. Then −9 + 15.' }
      },
      {
        type: 'boss',
        value: 2500,
        story: 'The Midnight Vault. And leaning against it, unhurried, a thin man polishing his glasses: <b>THE ACCOUNTANT</b>. "L.S. — Ledger Syndicate. You\'ve been correcting my work all over town." He taps the vault. "Three locks. My three best. Show me this \'good math\' of yours."',
        prompt: 'Beat the Accountant\'s three locks.',
        bossName: 'THE ACCOUNTANT',
        stages: [
          { kind: 'keypad', label: 'LOCK 1 · the gauntlet', prompt: 'Solve for <b>x</b>.', expr: '5(2x − 4) − 3(x + 2) = 2x + 9', answer: 7,
            hint: { who: 'ace', text: '10x − 20 − 3x − 6 = 2x + 9 → 7x − 26 = 2x + 9 → 5x = 35.' } },
          { kind: 'keypad', label: 'LOCK 2 · the ledger', prompt: 'Solve for <b>y</b>: &nbsp;' + FR(2, 5) + 'y + ' + FR(1, 10) + 'y + 3 = 8', answer: 10,
            hint: { who: 'wrench', text: '2/5 + 1/10 = 4/10 + 1/10 = 1/2. So (1/2)y = 5.' } },
          { kind: 'fraction', label: 'LOCK 3 · the last dial', prompt: 'Compute: ' + MX(2, 7, 12) + ' − ' + MX(1, 1, 6),
            answer: { w: 1, n: 5, d: 12 },
            hint: { who: 'ace', text: 'Twelfths: 1 1/6 = 1 2/12. Then 2 7/12 − 1 2/12. Last one, Cipher. Make it clean.' } }
        ]
      }
    ]
  }
];
