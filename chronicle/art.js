// ======================================================
// art.js — All SVG illustrations and sprite renderers
// Realms of Mathematica II — The Numerian Codex
// ======================================================

const Art = {

  // --------------------------------------------------------
  // TITLE EMBLEM — open codex with star-chart and crossed quill+sword
  // --------------------------------------------------------
  titleEmblem() {
    return '<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<radialGradient id="te-glow" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0" stop-color="#f0d27a" stop-opacity="0.4"/>' +
          '<stop offset="1" stop-color="#f0d27a" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="te-page" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#f0e3bd"/>' +
          '<stop offset="1" stop-color="#c8b078"/>' +
        '</linearGradient>' +
        '<linearGradient id="te-bind" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#7a3818"/>' +
          '<stop offset="1" stop-color="#3a1810"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<circle cx="110" cy="110" r="100" fill="url(#te-glow)"/>' +
      // codex (open book)
      '<path d="M 30 130 Q 60 110 110 115 Q 160 110 190 130 L 190 175 Q 160 160 110 165 Q 60 160 30 175 Z" fill="url(#te-bind)" stroke="#1a1008" stroke-width="2"/>' +
      // pages left
      '<path d="M 36 132 Q 68 116 110 122 L 110 168 Q 68 162 36 173 Z" fill="url(#te-page)" stroke="#3a2010" stroke-width="0.8"/>' +
      // pages right
      '<path d="M 184 132 Q 152 116 110 122 L 110 168 Q 152 162 184 173 Z" fill="url(#te-page)" stroke="#3a2010" stroke-width="0.8"/>' +
      // central binding ribbon
      '<rect x="106" y="118" width="8" height="56" fill="#5a1818" stroke="#1a0808" stroke-width="0.5"/>' +
      // page lines (left)
      '<line x1="48" y1="138" x2="100" y2="134" stroke="#5a3818" stroke-width="0.5" opacity="0.55"/>' +
      '<line x1="48" y1="144" x2="100" y2="140" stroke="#5a3818" stroke-width="0.5" opacity="0.55"/>' +
      '<line x1="48" y1="150" x2="100" y2="146" stroke="#5a3818" stroke-width="0.5" opacity="0.55"/>' +
      '<line x1="48" y1="156" x2="100" y2="152" stroke="#5a3818" stroke-width="0.5" opacity="0.55"/>' +
      // page lines (right) — number symbols
      '<text x="125" y="142" fill="#3a2010" font-family="Cinzel" font-size="6.5" opacity="0.7">∑ π Δ √</text>' +
      '<text x="125" y="152" fill="#3a2010" font-family="Cinzel" font-size="6.5" opacity="0.7">x²·y³·z</text>' +
      '<text x="125" y="162" fill="#3a2010" font-family="Cinzel" font-size="6.5" opacity="0.7">∞ Ω ⊕</text>' +
      // star above book
      '<g transform="translate(110, 70)">' +
        '<polygon points="0,-32 8,-10 32,-10 13,4 20,28 0,14 -20,28 -13,4 -32,-10 -8,-10" fill="#d4a624" stroke="#3a2010" stroke-width="1"/>' +
        '<polygon points="0,-22 5,-6 22,-6 9,2 14,18 0,9 -14,18 -9,2 -22,-6 -5,-6" fill="#f0d27a"/>' +
        '<circle r="3" fill="#fff"/>' +
      '</g>' +
      // crossed quill and sword (behind the book)
      '<line x1="34" y1="58" x2="92" y2="130" stroke="#888" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="92" y1="130" x2="92" y2="126" stroke="#5a3818" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M 186 58 Q 178 90 132 120 Q 138 130 144 134" fill="#c47828" stroke="#3a2010" stroke-width="1.5"/>' +
      '<path d="M 180 62 Q 178 72 174 80 M 178 70 Q 174 80 168 88 M 172 80 Q 168 90 160 100 M 164 90 Q 160 100 150 108" stroke="#3a2010" stroke-width="0.5" fill="none"/>' +
      // small stars
      '<circle cx="48" cy="46" r="1.5" fill="#fff"/>' +
      '<circle cx="178" cy="40" r="1" fill="#fff"/>' +
      '<circle cx="200" cy="74" r="1.5" fill="#fff"/>' +
      '<circle cx="22" cy="92" r="1" fill="#fff"/>' +
      '<circle cx="156" cy="20" r="1.5" fill="#fff"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // HERO PORTRAIT — composes traits from class + heritage
  // mode: 'full' | 'mini' | 'sheet' | 'combat'
  // --------------------------------------------------------
  heroPortrait(hero, mode) {
    const cls = (CLASSES && hero && CLASSES[hero.classId]) || CLASSES.warrior;
    const her = (HERITAGES && hero && HERITAGES[hero.heritageId]) || HERITAGES.human;
    const skin = her.skinTone || '#d9b48b';
    const hair = cls.portraitTraits.hairColor;
    const weapon = cls.portraitTraits.weaponColor;
    const earShape = her.id === 'elf' ? 'pointed' : (her.id === 'halfling' ? 'small' : 'round');
    const bodyHeight = her.id === 'dwarf' ? 'short' : (her.id === 'halfling' ? 'short' : 'tall');

    // Tabaxi (cat-folk) support
    const isFelid = !!her.isFelid;
    const fur = isFelid ? (FUR_COLORS[(hero && hero.furColor)] || FUR_COLORS[her.defaultFur] || FUR_COLORS.tabby) : null;
    const coatTone = isFelid ? fur.base : skin;

    const isMini = mode === 'mini';
    const w = isMini ? 64 : 200;
    const h = isMini ? 64 : 250;
    // mini avatars crop to head + shoulders so the circular frame shows the face
    const vb = isMini ? '38 40 124 128' : '0 0 200 250';

    // humanoid side-ears (unused for felids)
    let earL = '', earR = '';
    if (earShape === 'pointed') {
      earL = '<path d="M 76 110 Q 68 105 70 95 L 76 105 Z" fill="' + skin + '"/>';
      earR = '<path d="M 124 110 Q 132 105 130 95 L 124 105 Z" fill="' + skin + '"/>';
    } else if (earShape === 'small') {
      earL = '<ellipse cx="74" cy="108" rx="4" ry="6" fill="' + skin + '"/>';
      earR = '<ellipse cx="126" cy="108" rx="4" ry="6" fill="' + skin + '"/>';
    } else {
      earL = '<ellipse cx="73" cy="110" rx="5" ry="7" fill="' + skin + '"/>';
      earR = '<ellipse cx="127" cy="110" rx="5" ry="7" fill="' + skin + '"/>';
    }

    // class-specific weapon/gear
    let weaponElt = '';
    if (cls.id === 'warrior') {
      weaponElt = '<line x1="40" y1="100" x2="44" y2="220" stroke="' + weapon + '" stroke-width="6" stroke-linecap="round"/>' +
                  '<rect x="34" y="92" width="16" height="6" fill="#7a5818"/>' +
                  '<rect x="38" y="86" width="8" height="10" fill="' + weapon + '"/>';
    } else if (cls.id === 'mage') {
      weaponElt = '<line x1="40" y1="100" x2="44" y2="230" stroke="' + weapon + '" stroke-width="5" stroke-linecap="round"/>' +
                  '<circle cx="42" cy="92" r="9" fill="#3a3e8a" stroke="' + weapon + '" stroke-width="2"/>' +
                  '<circle cx="42" cy="92" r="4" fill="#a0c0ff"/>';
    } else if (cls.id === 'rogue') {
      weaponElt = '<line x1="36" y1="140" x2="44" y2="180" stroke="' + weapon + '" stroke-width="3" stroke-linecap="round"/>' +
                  '<line x1="40" y1="138" x2="48" y2="178" stroke="' + weapon + '" stroke-width="3" stroke-linecap="round"/>';
    } else {
      // ranger — bow
      weaponElt = '<path d="M 40 100 Q 28 160 40 220" fill="none" stroke="' + weapon + '" stroke-width="4" stroke-linecap="round"/>' +
                  '<line x1="42" y1="100" x2="42" y2="220" stroke="#e8d5b5" stroke-width="0.6"/>';
    }

    // body + clothing (class specific)
    let clothing = '';
    if (cls.id === 'warrior') {
      // breastplate + tabard
      clothing = '<polygon points="60,160 140,160 150,250 50,250" fill="#7a4030" stroke="#3a2010" stroke-width="1.5"/>' +
                 '<polygon points="80,160 120,160 110,250 90,250" fill="' + cls.iconColor + '" stroke="#3a2010" stroke-width="1"/>' +
                 '<rect x="62" y="170" width="76" height="6" fill="#888" stroke="#3a2010" stroke-width="1"/>' +
                 '<circle cx="100" cy="173" r="3.5" fill="#d4a624" stroke="#3a2010" stroke-width="0.6"/>';
    } else if (cls.id === 'mage') {
      // long robe
      clothing = '<polygon points="56,158 144,158 158,250 42,250" fill="#2a2858" stroke="#1a1838" stroke-width="1.5"/>' +
                 '<polygon points="56,158 144,158 130,210 70,210" fill="#3a3e8a" stroke="#1a1838" stroke-width="0.8"/>' +
                 // runes hem
                 '<text x="60" y="248" fill="#d4a624" font-family="Cinzel" font-size="8" opacity="0.8">∑·π·Δ·√·∞·Ω</text>';
    } else if (cls.id === 'rogue') {
      // hood + leather
      clothing = '<polygon points="60,156 140,156 148,250 52,250" fill="#1a2818" stroke="#0a1808" stroke-width="1.5"/>' +
                 '<path d="M 60 156 Q 100 130 140 156 L 138 180 Q 100 160 62 180 Z" fill="#0a1408" opacity="0.6"/>' +
                 '<line x1="74" y1="180" x2="76" y2="240" stroke="#3a3818" stroke-width="1"/>' +
                 '<line x1="124" y1="180" x2="122" y2="240" stroke="#3a3818" stroke-width="1"/>';
    } else {
      // ranger cloak
      clothing = '<polygon points="56,156 144,156 152,250 48,250" fill="#3a4a28" stroke="#1a2818" stroke-width="1.5"/>' +
                 '<polygon points="60,158 140,158 130,220 70,220" fill="#4a5a2a" stroke="#1a2818" stroke-width="0.6"/>' +
                 '<line x1="100" y1="160" x2="100" y2="200" stroke="#3a2010" stroke-width="3"/>' +
                 '<circle cx="100" cy="168" r="3" fill="#d4a624" stroke="#3a2010" stroke-width="0.6"/>';
    }

    // face geometry
    const headY = bodyHeight === 'short' ? 112 : 105;
    const eyeY = headY + 3;
    const browY = headY - 8;

    // ---- humanoid brows (by class "mood") ----
    const _brow = (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#1a1008" stroke-width="1.5" stroke-linecap="round"/>';
    const mood = cls.id === 'warrior' ? 'fierce' : (cls.id === 'mage' ? 'wise' : (cls.id === 'rogue' ? 'sly' : 'calm'));
    let browStr;
    if (mood === 'fierce')      browStr = _brow(86, browY + 4, 98, browY)     + _brow(114, browY, 126, browY + 4);
    else if (mood === 'wise')   browStr = _brow(86, browY, 98, browY - 2)     + _brow(114, browY - 2, 126, browY);
    else if (mood === 'sly')    browStr = _brow(86, browY - 1, 98, browY + 3) + _brow(114, browY + 3, 126, browY - 1);
    else                        browStr = _brow(86, browY, 98, browY)         + _brow(114, browY, 126, browY);

    // ---- hair (class-tinted; humanoid only) ----
    let hairShape = '';
    if (cls.id === 'mage') {
      hairShape = '<path d="M 70 95 Q 100 65 130 95 L 132 124 Q 100 116 68 124 Z" fill="' + hair + '"/>' +
                  '<path d="M 130 95 Q 138 130 134 160 L 128 156 Q 128 130 126 110 Z" fill="' + hair + '"/>';
    } else if (cls.id === 'rogue') {
      hairShape = '<path d="M 68 100 Q 100 70 132 100 Q 134 116 132 124 Q 100 116 68 124 Q 66 110 68 100 Z" fill="' + hair + '"/>';
    } else if (cls.id === 'warrior') {
      hairShape = '<path d="M 72 100 Q 100 80 128 100 L 128 112 Q 100 108 72 112 Z" fill="' + hair + '"/>';
    } else {
      hairShape = '<path d="M 70 100 Q 100 76 130 100 L 130 130 Q 100 114 70 130 Z" fill="' + hair + '"/>' +
                  '<line x1="132" y1="124" x2="140" y2="158" stroke="' + hair + '" stroke-width="4" stroke-linecap="round"/>';
    }

    // ---- dwarf beard ----
    let beard = '';
    if (her.id === 'dwarf') {
      beard = '<path d="M 84 130 Q 100 158 116 130 L 118 152 Q 100 166 82 152 Z" fill="' + hair + '"/>';
    }

    // ---- HUMANOID face ----
    const faceHumanoid =
      '<ellipse cx="100" cy="' + headY + '" rx="28" ry="32" fill="' + coatTone + '" stroke="#3a2010" stroke-width="1.5"/>' +
      earL + earR + hairShape + beard +
      '<ellipse cx="92" cy="' + eyeY + '" rx="2.6" ry="3.2" fill="#1a1008"/>' +
      '<ellipse cx="108" cy="' + eyeY + '" rx="2.6" ry="3.2" fill="#1a1008"/>' +
      '<circle cx="92.7" cy="' + (eyeY - 1) + '" r="0.7" fill="#fff"/>' +
      '<circle cx="108.7" cy="' + (eyeY - 1) + '" r="0.7" fill="#fff"/>' +
      browStr +
      '<line x1="100" y1="' + (eyeY + 2) + '" x2="100" y2="' + (eyeY + 8) + '" stroke="#3a2010" stroke-width="1" opacity="0.5"/>' +
      '<path d="M 94 ' + (headY + 15) + ' Q 100 ' + (headY + 19) + ' 106 ' + (headY + 15) + '" stroke="#3a2010" stroke-width="1.3" fill="none"/>';

    // ---- TABAXI (cat-folk) face ----
    let faceFelid = '';
    let tail = '';
    if (isFelid) {
      const earInner = '#e89aa8';
      const catEars =
        '<polygon points="78,' + (headY - 22) + ' 67,' + (headY - 52) + ' 93,' + (headY - 30) + '" fill="' + fur.base + '" stroke="#3a2010" stroke-width="1.2"/>' +
        '<polygon points="80,' + (headY - 27) + ' 73,' + (headY - 45) + ' 89,' + (headY - 31) + '" fill="' + earInner + '"/>' +
        '<polygon points="122,' + (headY - 22) + ' 133,' + (headY - 52) + ' 107,' + (headY - 30) + '" fill="' + fur.base + '" stroke="#3a2010" stroke-width="1.2"/>' +
        '<polygon points="120,' + (headY - 27) + ' 127,' + (headY - 45) + ' 111,' + (headY - 31) + '" fill="' + earInner + '"/>';

      // coat markings
      let markings = '';
      if (fur.striped) {
        markings =
          '<path d="M 100 ' + (headY - 26) + ' L 100 ' + (headY - 15) + '" stroke="' + fur.marking + '" stroke-width="2.2" stroke-linecap="round"/>' +
          '<path d="M 92 ' + (headY - 24) + ' L 90 ' + (headY - 15) + '" stroke="' + fur.marking + '" stroke-width="1.7" stroke-linecap="round"/>' +
          '<path d="M 108 ' + (headY - 24) + ' L 110 ' + (headY - 15) + '" stroke="' + fur.marking + '" stroke-width="1.7" stroke-linecap="round"/>' +
          '<path d="M 72 ' + (headY) + ' Q 78 ' + (headY + 1) + ' 83 ' + (headY) + '" stroke="' + fur.marking + '" stroke-width="1.5" fill="none"/>' +
          '<path d="M 128 ' + (headY) + ' Q 122 ' + (headY + 1) + ' 117 ' + (headY) + '" stroke="' + fur.marking + '" stroke-width="1.5" fill="none"/>';
      } else if (fur.patched) {
        markings =
          '<path d="M 72 ' + (headY - 18) + ' Q 88 ' + (headY - 30) + ' 96 ' + (headY - 10) + ' Q 84 ' + (headY - 4) + ' 72 ' + (headY - 6) + ' Z" fill="' + fur.marking + '" opacity="0.9"/>' +
          '<path d="M 112 ' + (headY + 2) + ' Q 126 ' + (headY - 6) + ' 128 ' + (headY + 10) + ' Q 118 ' + (headY + 14) + ' 110 ' + (headY + 8) + ' Z" fill="' + (fur.patch || fur.marking) + '" opacity="0.9"/>';
      }

      const muzzle = '<ellipse cx="100" cy="' + (headY + 13) + '" rx="15" ry="11" fill="' + fur.muzzle + '"/>';
      const nose = '<polygon points="95,' + (headY + 7) + ' 105,' + (headY + 7) + ' 100,' + (headY + 13) + '" fill="#c86878" stroke="#9a4858" stroke-width="0.6"/>';
      const mouth =
        '<path d="M 100 ' + (headY + 13) + ' Q 95 ' + (headY + 19) + ' 90 ' + (headY + 16) + '" stroke="#5a3a2a" stroke-width="1.1" fill="none"/>' +
        '<path d="M 100 ' + (headY + 13) + ' Q 105 ' + (headY + 19) + ' 110 ' + (headY + 16) + '" stroke="#5a3a2a" stroke-width="1.1" fill="none"/>';
      const catEye = (cx) =>
        '<path d="M ' + (cx - 6.5) + ' ' + eyeY + ' Q ' + cx + ' ' + (eyeY - 5.5) + ' ' + (cx + 6.5) + ' ' + eyeY + ' Q ' + cx + ' ' + (eyeY + 4) + ' ' + (cx - 6.5) + ' ' + eyeY + ' Z" fill="#f8f4e0" stroke="#3a2010" stroke-width="0.8"/>' +
        '<ellipse cx="' + cx + '" cy="' + eyeY + '" rx="3.6" ry="4.4" fill="' + fur.eye + '"/>' +
        '<ellipse cx="' + cx + '" cy="' + eyeY + '" rx="1.1" ry="3.8" fill="#140e08"/>' +
        '<circle cx="' + (cx - 1.4) + '" cy="' + (eyeY - 1.8) + '" r="0.9" fill="#fff"/>';
      const whiskers =
        '<line x1="86" y1="' + (headY + 11) + '" x2="64" y2="' + (headY + 9) + '" stroke="#e8e0cc" stroke-width="0.8" opacity="0.8"/>' +
        '<line x1="86" y1="' + (headY + 14) + '" x2="64" y2="' + (headY + 16) + '" stroke="#e8e0cc" stroke-width="0.8" opacity="0.8"/>' +
        '<line x1="114" y1="' + (headY + 11) + '" x2="136" y2="' + (headY + 9) + '" stroke="#e8e0cc" stroke-width="0.8" opacity="0.8"/>' +
        '<line x1="114" y1="' + (headY + 14) + '" x2="136" y2="' + (headY + 16) + '" stroke="#e8e0cc" stroke-width="0.8" opacity="0.8"/>';

      faceFelid = catEars +
        '<ellipse cx="100" cy="' + headY + '" rx="29" ry="31" fill="' + fur.base + '" stroke="#3a2010" stroke-width="1.5"/>' +
        markings + muzzle + whiskers + catEye(90) + catEye(110) + nose + mouth;

      // tail curling up behind the body
      tail =
        '<path d="M 150 248 Q 190 222 180 176 Q 176 156 162 156" fill="none" stroke="' + fur.base + '" stroke-width="13" stroke-linecap="round"/>' +
        '<ellipse cx="162" cy="156" rx="8" ry="8" fill="' + fur.marking + '"/>' +
        (fur.striped ? '<line x1="176" y1="196" x2="187" y2="193" stroke="' + fur.marking + '" stroke-width="3.5" stroke-linecap="round"/><line x1="173" y1="214" x2="184" y2="213" stroke="' + fur.marking + '" stroke-width="3.5" stroke-linecap="round"/>' : '');
    }

    const portraitInner =
      '<defs>' +
        '<linearGradient id="hp-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + cls.iconColor + '" stop-opacity="0.5"/>' +
          '<stop offset="1" stop-color="#0e0a18"/>' +
        '</linearGradient>' +
        '<radialGradient id="hp-glow" cx="0.5" cy="0.4" r="0.55">' +
          '<stop offset="0" stop-color="#d4a624" stop-opacity="0.16"/>' +
          '<stop offset="1" stop-color="#d4a624" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<rect width="200" height="250" fill="url(#hp-bg)"/>' +
      '<rect width="200" height="250" fill="url(#hp-glow)"/>' +
      tail +
      weaponElt +
      clothing +
      '<rect x="92" y="138" width="16" height="20" fill="' + coatTone + '"/>' +
      (isFelid ? faceFelid : faceHumanoid);

    return '<svg width="' + w + '" height="' + h + '" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + portraitInner + '</svg>';
  },

  // --------------------------------------------------------
  // CLASS THUMBNAIL — icon for hero creation choice cards
  // --------------------------------------------------------
  classThumb(classId) {
    const cls = CLASSES[classId];
    if (!cls) return '';
    let inner;
    if (classId === 'warrior') {
      // sword + shield
      inner =
        '<circle cx="48" cy="48" r="44" fill="rgba(138,62,34,0.18)" stroke="#8a3e22" stroke-width="2"/>' +
        '<path d="M 28 26 Q 48 18 68 26 L 68 60 Q 48 78 28 60 Z" fill="#7a4828" stroke="#3a2010" stroke-width="2"/>' +
        '<circle cx="48" cy="44" r="6" fill="#d4a624" stroke="#3a2010" stroke-width="1"/>' +
        '<line x1="48" y1="14" x2="48" y2="82" stroke="#b8c0c8" stroke-width="4" stroke-linecap="round"/>' +
        '<rect x="42" y="76" width="12" height="4" fill="#5a3818"/>' +
        '<rect x="40" y="80" width="16" height="6" fill="#3a2010"/>';
    } else if (classId === 'mage') {
      // staff + orb + stars
      inner =
        '<circle cx="48" cy="48" r="44" fill="rgba(58,62,138,0.18)" stroke="#3a3e8a" stroke-width="2"/>' +
        '<line x1="32" y1="22" x2="56" y2="80" stroke="#7a5a28" stroke-width="3.5" stroke-linecap="round"/>' +
        '<circle cx="34" cy="20" r="10" fill="#3a3e8a" stroke="#7a5a28" stroke-width="2"/>' +
        '<circle cx="34" cy="20" r="4" fill="#a0c0ff"/>' +
        '<circle cx="34" cy="19" r="1.5" fill="#fff"/>' +
        '<text x="68" y="40" fill="#a0c0ff" font-family="Cinzel" font-size="10">∑</text>' +
        '<text x="68" y="60" fill="#a0c0ff" font-family="Cinzel" font-size="10">π</text>' +
        '<text x="68" y="78" fill="#a0c0ff" font-family="Cinzel" font-size="10">∞</text>';
    } else if (classId === 'rogue') {
      // two daggers crossed + cloak
      inner =
        '<circle cx="48" cy="48" r="44" fill="rgba(42,58,42,0.22)" stroke="#2a3a2a" stroke-width="2"/>' +
        '<path d="M 28 30 Q 48 20 68 30 L 70 80 Q 48 92 26 80 Z" fill="#1a2818" stroke="#0a1808" stroke-width="2"/>' +
        '<line x1="22" y1="22" x2="50" y2="62" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>' +
        '<rect x="22" y="62" width="4" height="6" fill="#3a2010" transform="rotate(-35 24 64)"/>' +
        '<line x1="74" y1="22" x2="46" y2="62" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>' +
        '<rect x="70" y="62" width="4" height="6" fill="#3a2010" transform="rotate(35 72 64)"/>';
    } else {
      // ranger — bow + arrow
      inner =
        '<circle cx="48" cy="48" r="44" fill="rgba(58,90,42,0.18)" stroke="#3a5a2a" stroke-width="2"/>' +
        '<path d="M 30 18 Q 16 48 30 78" fill="none" stroke="#6a4818" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="30" y1="18" x2="30" y2="78" stroke="#e8d5b5" stroke-width="0.7"/>' +
        '<line x1="36" y1="48" x2="80" y2="48" stroke="#5a3818" stroke-width="2"/>' +
        '<polygon points="80,42 92,48 80,54" fill="#888" stroke="#3a2010" stroke-width="1"/>' +
        '<polygon points="36,44 30,48 36,52" fill="#aab87c"/>';
    }
    return '<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  },

  // --------------------------------------------------------
  // HERITAGE THUMBNAIL
  // --------------------------------------------------------
  heritageThumb(heritageId) {
    const her = HERITAGES[heritageId];
    if (!her) return '';
    // simple silhouette tinted by skinTone
    let silhouette;
    if (heritageId === 'human') {
      silhouette = '<ellipse cx="48" cy="35" rx="14" ry="16" fill="' + her.skinTone + '"/><rect x="34" y="50" width="28" height="36" fill="' + her.skinTone + '"/>';
    } else if (heritageId === 'elf') {
      silhouette = '<ellipse cx="48" cy="32" rx="13" ry="17" fill="' + her.skinTone + '"/>' +
                   '<path d="M 36 32 L 30 22 L 38 28 Z" fill="' + her.skinTone + '"/>' +
                   '<path d="M 60 32 L 66 22 L 58 28 Z" fill="' + her.skinTone + '"/>' +
                   '<rect x="34" y="50" width="28" height="36" fill="' + her.skinTone + '"/>';
    } else if (heritageId === 'dwarf') {
      silhouette = '<ellipse cx="48" cy="38" rx="16" ry="18" fill="' + her.skinTone + '"/>' +
                   '<path d="M 36 50 Q 48 70 60 50 L 60 60 Q 48 76 36 60 Z" fill="#4a3010"/>' +
                   '<rect x="32" y="58" width="32" height="32" fill="' + her.skinTone + '"/>';
    } else if (heritageId === 'halfling') {
      silhouette = '<ellipse cx="48" cy="40" rx="14" ry="15" fill="' + her.skinTone + '"/>' +
                   '<rect x="36" y="56" width="24" height="28" fill="' + her.skinTone + '"/>';
    } else { // tabaxi
      const f = (FUR_COLORS && FUR_COLORS[her.defaultFur]) || { base: '#d98a3a', marking: '#a85a1a', eye: '#7aa84a' };
      silhouette =
        // cat ears
        '<polygon points="38,32 32,16 48,28" fill="' + f.base + '"/>' +
        '<polygon points="58,32 64,16 48,28" fill="' + f.base + '"/>' +
        // head
        '<ellipse cx="48" cy="38" rx="16" ry="16" fill="' + f.base + '"/>' +
        // stripes / markings
        '<line x1="48" y1="24" x2="48" y2="32" stroke="' + f.marking + '" stroke-width="2"/>' +
        // eyes
        '<ellipse cx="42" cy="38" rx="2" ry="3" fill="' + f.eye + '"/>' +
        '<ellipse cx="54" cy="38" rx="2" ry="3" fill="' + f.eye + '"/>' +
        '<ellipse cx="42" cy="38" rx="0.7" ry="3" fill="#140e08"/>' +
        '<ellipse cx="54" cy="38" rx="0.7" ry="3" fill="#140e08"/>' +
        // muzzle + nose
        '<ellipse cx="48" cy="46" rx="7" ry="5" fill="#f0d4a4"/>' +
        '<polygon points="45,44 51,44 48,48" fill="#c86878"/>' +
        // body
        '<rect x="36" y="56" width="24" height="30" fill="' + f.base + '"/>' +
        // tail
        '<path d="M 60 84 Q 74 74 68 58" fill="none" stroke="' + f.base + '" stroke-width="5" stroke-linecap="round"/>';
    }
    return '<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="48" cy="48" r="46" fill="rgba(212,166,36,0.12)" stroke="#8a6a14" stroke-width="1.5"/>' +
      silhouette +
    '</svg>';
  },

  // --------------------------------------------------------
  // NPC PORTRAITS
  // --------------------------------------------------------
  lysara(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="lys-bg"><stop offset="0" stop-color="#3a3e8a"/><stop offset="1" stop-color="#1a1838"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#lys-bg)"/>' +
      // hair (long, silver-purple)
      '<path d="M 28 42 Q 50 18 72 42 L 76 80 Q 64 78 64 80 L 36 80 Q 24 78 28 80 Z" fill="#a890c0"/>' +
      // face
      '<ellipse cx="50" cy="50" rx="16" ry="18" fill="#e8d5b5" stroke="#3a2010" stroke-width="0.8"/>' +
      // elf ears
      '<path d="M 34 50 Q 28 46 30 38 L 36 46 Z" fill="#e8d5b5"/>' +
      '<path d="M 66 50 Q 72 46 70 38 L 64 46 Z" fill="#e8d5b5"/>' +
      // bangs
      '<path d="M 36 36 Q 50 28 64 36 L 64 44 Q 50 38 36 44 Z" fill="#a890c0"/>' +
      // eyes (sharp green)
      '<ellipse cx="44" cy="50" rx="1.8" ry="2.2" fill="#3a8a48"/>' +
      '<ellipse cx="56" cy="50" rx="1.8" ry="2.2" fill="#3a8a48"/>' +
      '<circle cx="44.5" cy="49.5" r="0.5" fill="#fff"/>' +
      '<circle cx="56.5" cy="49.5" r="0.5" fill="#fff"/>' +
      // brows
      '<line x1="40" y1="46" x2="48" y2="46" stroke="#7a5a8a" stroke-width="1"/>' +
      '<line x1="52" y1="46" x2="60" y2="46" stroke="#7a5a8a" stroke-width="1"/>' +
      // mouth
      '<path d="M 46 60 Q 50 62 54 60" stroke="#3a2010" stroke-width="0.8" fill="none"/>' +
      // circlet
      '<path d="M 36 36 Q 50 30 64 36" fill="none" stroke="#d4a624" stroke-width="1.5"/>' +
      '<circle cx="50" cy="32" r="1.6" fill="#3a8a48"/>' +
    '</svg>';
  },

  brenna(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="bre-bg"><stop offset="0" stop-color="#7a4828"/><stop offset="1" stop-color="#3a1810"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#bre-bg)"/>' +
      // hair (red, bun)
      '<ellipse cx="50" cy="32" rx="20" ry="12" fill="#8a3818"/>' +
      '<circle cx="50" cy="26" r="6" fill="#8a3818"/>' +
      // face
      '<ellipse cx="50" cy="52" rx="17" ry="19" fill="#e8c4a0" stroke="#3a2010" stroke-width="0.8"/>' +
      // ears
      '<ellipse cx="32" cy="52" rx="3" ry="4" fill="#e8c4a0"/>' +
      '<ellipse cx="68" cy="52" rx="3" ry="4" fill="#e8c4a0"/>' +
      // eyes (warm brown)
      '<ellipse cx="44" cy="52" rx="1.8" ry="2.2" fill="#5a2a10"/>' +
      '<ellipse cx="56" cy="52" rx="1.8" ry="2.2" fill="#5a2a10"/>' +
      '<circle cx="44.5" cy="51.5" r="0.5" fill="#fff"/>' +
      '<circle cx="56.5" cy="51.5" r="0.5" fill="#fff"/>' +
      // brows
      '<line x1="40" y1="48" x2="48" y2="49" stroke="#3a1810" stroke-width="1.2"/>' +
      '<line x1="52" y1="49" x2="60" y2="48" stroke="#3a1810" stroke-width="1.2"/>' +
      // smile
      '<path d="M 42 62 Q 50 68 58 62" stroke="#3a2010" stroke-width="1.2" fill="none"/>' +
      // freckles
      '<circle cx="42" cy="56" r="0.8" fill="#8a4818" opacity="0.6"/>' +
      '<circle cx="58" cy="56" r="0.8" fill="#8a4818" opacity="0.6"/>' +
      '<circle cx="46" cy="58" r="0.6" fill="#8a4818" opacity="0.5"/>' +
      // apron strap
      '<rect x="36" y="74" width="28" height="8" fill="#3a2818"/>' +
      '<rect x="38" y="76" width="24" height="2" fill="#d4a624"/>' +
    '</svg>';
  },

  dorrick(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="dor-bg"><stop offset="0" stop-color="#5a3818"/><stop offset="1" stop-color="#1a1008"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#dor-bg)"/>' +
      // head/face — dwarf, broad
      '<ellipse cx="50" cy="40" rx="20" ry="20" fill="#c8a878" stroke="#3a2010" stroke-width="0.8"/>' +
      // hair
      '<path d="M 30 36 Q 50 22 70 36 L 70 44 Q 50 36 30 44 Z" fill="#3a1808"/>' +
      // ears
      '<ellipse cx="30" cy="42" rx="3" ry="4" fill="#c8a878"/>' +
      '<ellipse cx="70" cy="42" rx="3" ry="4" fill="#c8a878"/>' +
      // big braided beard
      '<path d="M 32 52 Q 50 78 68 52 L 70 84 Q 50 96 30 84 Z" fill="#3a1808"/>' +
      '<line x1="44" y1="62" x2="44" y2="86" stroke="#1a0808" stroke-width="1"/>' +
      '<line x1="50" y1="64" x2="50" y2="90" stroke="#1a0808" stroke-width="1"/>' +
      '<line x1="56" y1="62" x2="56" y2="86" stroke="#1a0808" stroke-width="1"/>' +
      // beard rings
      '<circle cx="44" cy="74" r="2" fill="#d4a624" stroke="#3a2010" stroke-width="0.5"/>' +
      '<circle cx="56" cy="74" r="2" fill="#d4a624" stroke="#3a2010" stroke-width="0.5"/>' +
      // eyes
      '<ellipse cx="42" cy="42" rx="1.6" ry="2" fill="#1a1008"/>' +
      '<ellipse cx="58" cy="42" rx="1.6" ry="2" fill="#1a1008"/>' +
      '<circle cx="42.5" cy="41.5" r="0.4" fill="#fff"/>' +
      '<circle cx="58.5" cy="41.5" r="0.4" fill="#fff"/>' +
      // brows
      '<line x1="38" y1="38" x2="46" y2="38" stroke="#3a1808" stroke-width="1.6"/>' +
      '<line x1="54" y1="38" x2="62" y2="38" stroke="#3a1808" stroke-width="1.6"/>' +
      // nose (broad)
      '<path d="M 48 44 Q 50 50 52 44 Q 50 52 48 44 Z" fill="#a88858"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ENEMY SPRITES
  // --------------------------------------------------------
  enemySprite(spriteId, sizeOpt) {
    const size = sizeOpt || 200;
    const vb = '0 0 200 250';
    let inner = '';
    if (spriteId === 'rubble_imp') {
      inner =
        // ground shadow
        '<ellipse cx="100" cy="240" rx="50" ry="6" fill="rgba(0,0,0,0.45)"/>' +
        // body — stack of stone
        '<polygon points="70,190 130,190 140,240 60,240" fill="#6a6058" stroke="#2a2418" stroke-width="2"/>' +
        '<polygon points="80,170 120,170 130,190 70,190" fill="#7a7068" stroke="#2a2418" stroke-width="1.5"/>' +
        // head — angular rock
        '<polygon points="74,110 126,110 132,164 68,164" fill="#8a8078" stroke="#2a2418" stroke-width="2"/>' +
        // eyes (glowing yellow)
        '<rect x="84" y="128" width="10" height="6" fill="#1a1008"/>' +
        '<rect x="106" y="128" width="10" height="6" fill="#1a1008"/>' +
        '<circle cx="89" cy="131" r="2" fill="#f0d27a"/>' +
        '<circle cx="111" cy="131" r="2" fill="#f0d27a"/>' +
        // mouth
        '<polygon points="86,148 114,148 110,158 90,158" fill="#1a1008"/>' +
        '<line x1="92" y1="148" x2="92" y2="158" stroke="#5a4838" stroke-width="0.8"/>' +
        '<line x1="100" y1="148" x2="100" y2="158" stroke="#5a4838" stroke-width="0.8"/>' +
        '<line x1="108" y1="148" x2="108" y2="158" stroke="#5a4838" stroke-width="0.8"/>' +
        // arms — short rocky stubs
        '<polygon points="58,180 70,200 56,220 44,200" fill="#7a7068" stroke="#2a2418" stroke-width="1.5"/>' +
        '<polygon points="142,180 156,200 144,220 130,200" fill="#7a7068" stroke="#2a2418" stroke-width="1.5"/>' +
        // cracks
        '<line x1="82" y1="114" x2="86" y2="124" stroke="#3a3428" stroke-width="0.6"/>' +
        '<line x1="118" y1="116" x2="120" y2="138" stroke="#3a3428" stroke-width="0.6"/>';
    } else if (spriteId === 'stone_grub') {
      inner =
        '<ellipse cx="100" cy="240" rx="65" ry="8" fill="rgba(0,0,0,0.5)"/>' +
        // segmented body
        '<ellipse cx="60" cy="200" rx="22" ry="18" fill="#6a6058" stroke="#2a2418" stroke-width="2"/>' +
        '<ellipse cx="92" cy="200" rx="24" ry="20" fill="#7a7068" stroke="#2a2418" stroke-width="2"/>' +
        '<ellipse cx="128" cy="200" rx="22" ry="18" fill="#6a6058" stroke="#2a2418" stroke-width="2"/>' +
        '<ellipse cx="155" cy="202" rx="18" ry="14" fill="#5a5048" stroke="#2a2418" stroke-width="1.5"/>' +
        // head
        '<polygon points="22,196 38,178 52,184 50,210 38,218" fill="#8a8078" stroke="#2a2418" stroke-width="2"/>' +
        // eyes (red coals)
        '<circle cx="34" cy="192" r="2.5" fill="#1a1008"/>' +
        '<circle cx="34" cy="192" r="1.5" fill="#cc3030"/>' +
        // teeth/mandibles
        '<polygon points="22,200 18,204 26,206" fill="#1a1008"/>' +
        '<polygon points="22,210 18,206 26,208" fill="#1a1008"/>' +
        // back ridges
        '<polygon points="80,180 88,170 96,180" fill="#5a5048" stroke="#2a2418" stroke-width="1"/>' +
        '<polygon points="112,180 120,170 128,180" fill="#5a5048" stroke="#2a2418" stroke-width="1"/>' +
        // ground rubble
        '<ellipse cx="30" cy="232" rx="6" ry="2" fill="#4a4038"/>' +
        '<ellipse cx="170" cy="232" rx="8" ry="2" fill="#4a4038"/>';
    } else if (spriteId === 'quarry_brute') {
      inner =
        '<ellipse cx="100" cy="240" rx="70" ry="8" fill="rgba(0,0,0,0.55)"/>' +
        // legs (cube blocks)
        '<rect x="60" y="200" width="28" height="40" fill="#5a4830" stroke="#2a1810" stroke-width="2"/>' +
        '<rect x="112" y="200" width="28" height="40" fill="#5a4830" stroke="#2a1810" stroke-width="2"/>' +
        // body (massive cube)
        '<rect x="44" y="120" width="112" height="90" fill="#6a5838" stroke="#2a1810" stroke-width="2.5"/>' +
        // body highlight
        '<polygon points="44,120 156,120 144,134 56,134" fill="#7a6848" stroke="none"/>' +
        // chest carving
        '<polygon points="80,148 120,148 130,178 70,178" fill="#3a2818" stroke="#2a1810" stroke-width="1.5"/>' +
        '<text x="100" y="170" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="16">V</text>' +
        // arms
        '<rect x="22" y="130" width="22" height="80" fill="#6a5838" stroke="#2a1810" stroke-width="2"/>' +
        '<rect x="156" y="130" width="22" height="80" fill="#6a5838" stroke="#2a1810" stroke-width="2"/>' +
        // fists
        '<rect x="14" y="206" width="32" height="24" fill="#5a4830" stroke="#2a1810" stroke-width="2"/>' +
        '<rect x="154" y="206" width="32" height="24" fill="#5a4830" stroke="#2a1810" stroke-width="2"/>' +
        // head (small cube)
        '<rect x="78" y="62" width="44" height="50" fill="#7a6848" stroke="#2a1810" stroke-width="2"/>' +
        // eyes (slits)
        '<rect x="84" y="80" width="10" height="3" fill="#1a1008"/>' +
        '<rect x="106" y="80" width="10" height="3" fill="#1a1008"/>' +
        '<rect x="86" y="80.5" width="3" height="2" fill="#cc8030"/>' +
        '<rect x="108" y="80.5" width="3" height="2" fill="#cc8030"/>' +
        // mouth
        '<rect x="90" y="98" width="20" height="6" fill="#1a1008"/>' +
        // pickaxe
        '<line x1="174" y1="60" x2="194" y2="220" stroke="#5a3818" stroke-width="6" stroke-linecap="round"/>' +
        '<polygon points="156,52 178,40 196,64 174,76" fill="#888" stroke="#2a1810" stroke-width="1.5"/>';
    } else if (spriteId === 'quarry_foreman') {
      // mini-boss — taller brute with banner
      inner =
        '<ellipse cx="100" cy="244" rx="85" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // banner pole
        '<line x1="160" y1="10" x2="160" y2="120" stroke="#3a2010" stroke-width="3"/>' +
        '<polygon points="160,12 188,18 184,40 160,32" fill="#8a2828" stroke="#3a1010" stroke-width="1.5"/>' +
        '<text x="172" y="28" fill="#d4a624" font-family="Cinzel" font-size="12">∑</text>' +
        // legs
        '<rect x="56" y="200" width="32" height="44" fill="#5a3a18" stroke="#1a0a08" stroke-width="2.5"/>' +
        '<rect x="112" y="200" width="32" height="44" fill="#5a3a18" stroke="#1a0a08" stroke-width="2.5"/>' +
        // belt
        '<rect x="44" y="190" width="112" height="14" fill="#3a2010" stroke="#1a0a08" stroke-width="1.5"/>' +
        '<circle cx="100" cy="197" r="5" fill="#d4a624" stroke="#1a0a08" stroke-width="1"/>' +
        // torso
        '<rect x="40" y="110" width="120" height="80" fill="#6a4828" stroke="#1a0a08" stroke-width="2.5"/>' +
        // armor plates
        '<polygon points="40,110 160,110 152,124 48,124" fill="#7a5838"/>' +
        '<polygon points="60,128 140,128 144,150 56,150" fill="#3a2010" stroke="#1a0a08" stroke-width="1.5"/>' +
        '<text x="100" y="146" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="16">FORE</text>' +
        // arms
        '<rect x="14" y="120" width="26" height="80" fill="#6a4828" stroke="#1a0a08" stroke-width="2"/>' +
        '<rect x="160" y="120" width="26" height="80" fill="#6a4828" stroke="#1a0a08" stroke-width="2"/>' +
        // fists
        '<rect x="6" y="194" width="38" height="28" fill="#5a3a18" stroke="#1a0a08" stroke-width="2"/>' +
        '<rect x="156" y="194" width="38" height="28" fill="#5a3a18" stroke="#1a0a08" stroke-width="2"/>' +
        // head — horned helm
        '<rect x="70" y="48" width="60" height="60" fill="#7a5838" stroke="#1a0a08" stroke-width="2.5"/>' +
        // horns
        '<polygon points="70,48 56,18 76,38" fill="#3a2818" stroke="#1a0a08" stroke-width="1.5"/>' +
        '<polygon points="130,48 144,18 124,38" fill="#3a2818" stroke="#1a0a08" stroke-width="1.5"/>' +
        // visor slit
        '<rect x="76" y="74" width="48" height="6" fill="#1a0808"/>' +
        '<rect x="80" y="75" width="6" height="3" fill="#ee4040"/>' +
        '<rect x="114" y="75" width="6" height="3" fill="#ee4040"/>' +
        // jaw mark
        '<polygon points="84,90 116,90 108,108 92,108" fill="#1a0808"/>' +
        // ground crack
        '<line x1="60" y1="244" x2="80" y2="248" stroke="#1a0808" stroke-width="1"/>' +
        '<line x1="120" y1="248" x2="140" y2="244" stroke="#1a0808" stroke-width="1"/>';
    } else if (spriteId === 'hollowed_one') {
      // final boss — massive cube creature, void inside
      inner =
        '<defs>' +
          '<radialGradient id="hol-void" cx="0.5" cy="0.5" r="0.6">' +
            '<stop offset="0" stop-color="#7a3878"/>' +
            '<stop offset="0.6" stop-color="#2a0838"/>' +
            '<stop offset="1" stop-color="#0a0210"/>' +
          '</radialGradient>' +
          '<linearGradient id="hol-stone" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#5a5048"/>' +
            '<stop offset="1" stop-color="#2a2418"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="244" rx="92" ry="12" fill="rgba(0,0,0,0.65)"/>' +
        // outer cube (massive)
        '<polygon points="20,80 100,40 180,80 180,210 100,250 20,210" fill="url(#hol-stone)" stroke="#0a0408" stroke-width="2.5"/>' +
        // top face
        '<polygon points="20,80 100,40 180,80 100,120" fill="#7a7068" stroke="#0a0408" stroke-width="1.5"/>' +
        // right face shading
        '<polygon points="180,80 180,210 100,250 100,120" fill="#3a3028" stroke="#0a0408" stroke-width="1.5"/>' +
        // glyphs on left face
        '<text x="40" y="140" fill="#7a3878" font-family="Cinzel" font-size="14" opacity="0.85">∑</text>' +
        '<text x="60" y="170" fill="#7a3878" font-family="Cinzel" font-size="14" opacity="0.85">π</text>' +
        '<text x="40" y="200" fill="#7a3878" font-family="Cinzel" font-size="14" opacity="0.85">∞</text>' +
        // central wound — the hollow
        '<polygon points="74,118 126,118 126,180 74,180" fill="url(#hol-void)" stroke="#7a3878" stroke-width="1.5"/>' +
        // void inner glow
        '<polygon points="84,128 116,128 116,170 84,170" fill="#1a0420"/>' +
        // void eye
        '<ellipse cx="100" cy="148" rx="9" ry="14" fill="#cc4878"/>' +
        '<ellipse cx="100" cy="148" rx="4" ry="9" fill="#1a0420"/>' +
        '<circle cx="100" cy="146" r="1.5" fill="#fff" opacity="0.6"/>' +
        // floating fragments around boss
        '<polygon points="10,60 22,52 30,66 18,74" fill="#5a5048" stroke="#0a0408" stroke-width="1"/>' +
        '<polygon points="170,40 182,32 190,44 178,52" fill="#5a5048" stroke="#0a0408" stroke-width="1"/>' +
        '<polygon points="186,156 198,150 200,164 186,166" fill="#5a5048" stroke="#0a0408" stroke-width="1"/>' +
        // chains
        '<line x1="12" y1="20" x2="40" y2="80" stroke="#3a2010" stroke-width="1.5" stroke-dasharray="3 2"/>' +
        '<line x1="188" y1="20" x2="160" y2="80" stroke="#3a2010" stroke-width="1.5" stroke-dasharray="3 2"/>';
    } else {
      // try later-act sprites
      const act2 = this._enemyAct2(spriteId);
      const act3 = act2 ? null : this._enemyAct3(spriteId);
      const act4 = (act2 || act3) ? null : this._enemyAct4(spriteId);
      const act5 = (act2 || act3 || act4) ? null : this._enemyAct5(spriteId);
      const act6 = (act2 || act3 || act4 || act5) ? null : this._enemyAct6(spriteId);
      if (act2) inner = act2;
      else if (act3) inner = act3;
      else if (act4) inner = act4;
      else if (act5) inner = act5;
      else if (act6) inner = act6;
      else inner = '<rect x="60" y="60" width="80" height="100" fill="#5a4838"/>';
    }
    return '<svg width="' + size + '" height="' + size * (250/200) + '" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  },

  // --------------------------------------------------------
  // SCENE ILLUSTRATIONS
  // --------------------------------------------------------

  // ----- Numeria, the village hub (rebuilt after old crisis) -----
  numeriaHub() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="nh-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#5a4878"/>' +
          '<stop offset="0.6" stop-color="#c47828"/>' +
          '<stop offset="1" stop-color="#7a3818"/>' +
        '</linearGradient>' +
        '<linearGradient id="nh-ground" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#4a3818"/>' +
          '<stop offset="1" stop-color="#2a1810"/>' +
        '</linearGradient>' +
      '</defs>' +
      // sky
      '<rect width="800" height="240" fill="url(#nh-sky)"/>' +
      // distant mountains
      '<polygon points="0,200 80,140 160,180 240,120 320,170 400,130 480,180 560,140 640,170 720,130 800,180 800,240 0,240" fill="#3a2848" opacity="0.7"/>' +
      '<polygon points="0,220 100,170 200,200 300,160 400,210 500,170 600,200 700,160 800,210 800,240 0,240" fill="#2a1838" opacity="0.7"/>' +
      // sun setting
      '<circle cx="600" cy="160" r="40" fill="#f0d27a" opacity="0.9"/>' +
      '<circle cx="600" cy="160" r="60" fill="#f0d27a" opacity="0.2"/>' +
      // ground
      '<rect y="240" width="800" height="120" fill="url(#nh-ground)"/>' +
      // path stones
      '<ellipse cx="400" cy="320" rx="200" ry="20" fill="#5a4828" opacity="0.6"/>' +
      // tavern (left)
      '<g transform="translate(60, 100)">' +
        '<polygon points="0,130 0,60 70,20 140,60 140,130" fill="#7a4828" stroke="#3a1810" stroke-width="2.5"/>' +
        '<polygon points="-10,62 70,12 150,62 70,22" fill="#5a2818" stroke="#3a1810" stroke-width="2.5"/>' +
        // door
        '<rect x="58" y="80" width="24" height="50" fill="#3a1810" stroke="#1a0808" stroke-width="1.5"/>' +
        '<circle cx="76" cy="106" r="1.5" fill="#d4a624"/>' +
        // window
        '<rect x="20" y="74" width="22" height="22" fill="#ffaa55" stroke="#3a1810" stroke-width="1.5"/>' +
        '<line x1="31" y1="74" x2="31" y2="96" stroke="#3a1810" stroke-width="0.6"/>' +
        '<rect x="98" y="74" width="22" height="22" fill="#ffaa55" stroke="#3a1810" stroke-width="1.5"/>' +
        '<line x1="109" y1="74" x2="109" y2="96" stroke="#3a1810" stroke-width="0.6"/>' +
        // sign
        '<rect x="-8" y="48" width="40" height="14" fill="#5a3010" stroke="#3a1810" stroke-width="1"/>' +
        '<text x="12" y="58" text-anchor="middle" fill="#d4a624" font-family="IM Fell English SC" font-size="8">COMPASS</text>' +
        // chimney smoke
        '<rect x="100" y="18" width="10" height="20" fill="#3a1810"/>' +
        '<path d="M 102 18 Q 100 4 108 -8 Q 116 -4 110 12" fill="rgba(255,255,255,0.18)"/>' +
      '</g>' +
      // smithy (right) — anvil out front
      '<g transform="translate(540, 110)">' +
        '<polygon points="0,120 0,40 100,40 100,120" fill="#5a4828" stroke="#1a1008" stroke-width="2.5"/>' +
        '<polygon points="-10,42 50,4 110,42" fill="#3a2018" stroke="#1a1008" stroke-width="2.5"/>' +
        // open forge (orange glow)
        '<rect x="20" y="64" width="60" height="40" fill="#cc4818" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="24" y="68" width="52" height="32" fill="#f0d27a"/>' +
        '<rect x="28" y="78" width="44" height="14" fill="#f08838"/>' +
        // anvil
        '<polygon points="36,116 56,116 60,128 32,128" fill="#3a3838" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="20" y="128" width="56" height="6" fill="#5a4818"/>' +
        // sign
        '<rect x="76" y="20" width="44" height="14" fill="#5a3010" stroke="#3a1810" stroke-width="1"/>' +
        '<text x="98" y="30" text-anchor="middle" fill="#d4a624" font-family="IM Fell English SC" font-size="8">FORGE</text>' +
      '</g>' +
      // central well
      '<g transform="translate(360, 220)">' +
        '<rect x="-30" y="40" width="60" height="40" fill="#5a4838" stroke="#1a1008" stroke-width="1.5" rx="3"/>' +
        '<rect x="-26" y="42" width="52" height="36" fill="#3a2818"/>' +
        '<rect x="-32" y="38" width="64" height="6" fill="#4a3828" stroke="#1a1008" stroke-width="1"/>' +
        '<line x1="-20" y1="10" x2="-20" y2="44" stroke="#3a2010" stroke-width="3"/>' +
        '<line x1="20" y1="10" x2="20" y2="44" stroke="#3a2010" stroke-width="3"/>' +
        '<line x1="-26" y1="10" x2="26" y2="10" stroke="#3a2010" stroke-width="3"/>' +
        '<polygon points="-26,4 26,4 30,10 -30,10" fill="#5a3818" stroke="#1a1008" stroke-width="1"/>' +
        // rope + bucket
        '<line x1="0" y1="10" x2="0" y2="38" stroke="#bfa050" stroke-width="1"/>' +
      '</g>' +
      // Lysara's tower (back)
      '<g transform="translate(360, 60)">' +
        '<rect x="-22" y="60" width="44" height="120" fill="#4a3a58" stroke="#1a0a18" stroke-width="2"/>' +
        '<polygon points="-26,60 22,60 22,68 -26,68" fill="#6a4878" stroke="#1a0a18" stroke-width="1.5"/>' +
        '<polygon points="-22,60 22,60 0,20" fill="#3a1a48" stroke="#1a0a18" stroke-width="2"/>' +
        // glowing window
        '<rect x="-8" y="80" width="16" height="22" fill="#a890c0" stroke="#1a0a18" stroke-width="1.5"/>' +
        '<rect x="-7" y="81" width="14" height="20" fill="#c4a8d8"/>' +
        '<line x1="0" y1="80" x2="0" y2="102" stroke="#1a0a18" stroke-width="0.5"/>' +
        // star atop spire
        '<polygon points="0,8 3,16 11,16 5,21 7,29 0,24 -7,29 -5,21 -11,16 -3,16" fill="#d4a624"/>' +
      '</g>' +
      // foreground figures (silhouettes)
      '<g transform="translate(280, 280)" opacity="0.85">' +
        '<ellipse cx="0" cy="40" rx="12" ry="3" fill="rgba(0,0,0,0.4)"/>' +
        '<rect x="-6" y="6" width="12" height="34" fill="#2a1810"/>' +
        '<ellipse cx="0" cy="-2" rx="8" ry="10" fill="#2a1810"/>' +
      '</g>' +
      '<g transform="translate(460, 290)" opacity="0.85">' +
        '<ellipse cx="0" cy="36" rx="10" ry="3" fill="rgba(0,0,0,0.4)"/>' +
        '<rect x="-5" y="4" width="10" height="30" fill="#2a1810"/>' +
        '<ellipse cx="0" cy="-4" rx="7" ry="9" fill="#2a1810"/>' +
      '</g>' +
      // foreground torches
      '<g transform="translate(140, 290)">' +
        '<rect x="-2" y="0" width="4" height="50" fill="#3a2010"/>' +
        '<ellipse cx="0" cy="-4" rx="5" ry="9" fill="#f08838"/>' +
        '<ellipse cx="0" cy="-8" rx="3" ry="6" fill="#f0d27a"/>' +
      '</g>' +
      '<g transform="translate(620, 290)">' +
        '<rect x="-2" y="0" width="4" height="50" fill="#3a2010"/>' +
        '<ellipse cx="0" cy="-4" rx="5" ry="9" fill="#f08838"/>' +
        '<ellipse cx="0" cy="-8" rx="3" ry="6" fill="#f0d27a"/>' +
      '</g>' +
    '</svg>';
  },

  // ----- Lysara's study -----
  lysaraStudy() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<radialGradient id="ls-light" cx="0.5" cy="0.5" r="0.8">' +
          '<stop offset="0" stop-color="#a890c0" stop-opacity="0.35"/>' +
          '<stop offset="1" stop-color="#1a0a18" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      // wall
      '<rect width="800" height="360" fill="#2a1838"/>' +
      '<rect width="800" height="360" fill="url(#ls-light)"/>' +
      // floor
      '<polygon points="0,260 800,260 760,360 40,360" fill="#3a2848"/>' +
      // stone wall texture
      '<g opacity="0.4">' +
        '<rect x="0" y="0" width="800" height="2" fill="#1a0a18"/>' +
        '<rect x="0" y="60" width="800" height="2" fill="#1a0a18"/>' +
        '<rect x="0" y="120" width="800" height="2" fill="#1a0a18"/>' +
        '<rect x="0" y="180" width="800" height="2" fill="#1a0a18"/>' +
        '<rect x="40" y="0" width="2" height="60" fill="#1a0a18"/>' +
        '<rect x="160" y="0" width="2" height="60" fill="#1a0a18"/>' +
        '<rect x="280" y="0" width="2" height="60" fill="#1a0a18"/>' +
        '<rect x="400" y="0" width="2" height="60" fill="#1a0a18"/>' +
        '<rect x="520" y="0" width="2" height="60" fill="#1a0a18"/>' +
        '<rect x="640" y="0" width="2" height="60" fill="#1a0a18"/>' +
        '<rect x="760" y="0" width="2" height="60" fill="#1a0a18"/>' +
      '</g>' +
      // arched window (back)
      '<path d="M 350 40 Q 400 0 450 40 L 450 160 L 350 160 Z" fill="#a890c0" stroke="#5a3878" stroke-width="3"/>' +
      '<line x1="400" y1="20" x2="400" y2="160" stroke="#5a3878" stroke-width="2"/>' +
      '<line x1="350" y1="80" x2="450" y2="80" stroke="#5a3878" stroke-width="2"/>' +
      // stars through window
      '<circle cx="372" cy="50" r="1.4" fill="#fff"/>' +
      '<circle cx="424" cy="60" r="1.2" fill="#fff"/>' +
      '<circle cx="380" cy="98" r="1.6" fill="#fff"/>' +
      '<circle cx="420" cy="120" r="1.4" fill="#fff"/>' +
      // bookshelves (left)
      '<g transform="translate(40, 80)">' +
        '<rect x="0" y="0" width="200" height="180" fill="#3a1810" stroke="#1a0808" stroke-width="2"/>' +
        '<line x1="0" y1="50" x2="200" y2="50" stroke="#1a0808" stroke-width="2"/>' +
        '<line x1="0" y1="100" x2="200" y2="100" stroke="#1a0808" stroke-width="2"/>' +
        '<line x1="0" y1="150" x2="200" y2="150" stroke="#1a0808" stroke-width="2"/>' +
        // book spines row 1
        '<rect x="10" y="8" width="14" height="40" fill="#7a2828"/>' +
        '<rect x="26" y="8" width="10" height="40" fill="#3a5878"/>' +
        '<rect x="38" y="10" width="18" height="38" fill="#5a3878"/>' +
        '<rect x="58" y="6" width="12" height="42" fill="#7a5828"/>' +
        '<rect x="72" y="14" width="22" height="34" fill="#3a7858" rx="2"/>' +
        '<rect x="96" y="8" width="14" height="40" fill="#5a2828"/>' +
        '<rect x="112" y="10" width="10" height="38" fill="#7a5828"/>' +
        '<rect x="124" y="8" width="16" height="40" fill="#3a3878"/>' +
        '<rect x="142" y="12" width="14" height="36" fill="#5a3818"/>' +
        '<rect x="158" y="6" width="20" height="42" fill="#7a2858"/>' +
        '<rect x="180" y="10" width="12" height="38" fill="#3a5828"/>' +
        // row 2
        '<rect x="10" y="58" width="20" height="40" fill="#3a3848"/>' +
        '<rect x="32" y="60" width="14" height="38" fill="#7a5828"/>' +
        '<rect x="48" y="62" width="22" height="36" fill="#5a2828"/>' +
        '<rect x="72" y="58" width="12" height="40" fill="#3a7848"/>' +
        '<rect x="86" y="64" width="16" height="34" fill="#7a3878"/>' +
        '<rect x="104" y="60" width="14" height="38" fill="#5a3818"/>' +
        '<rect x="120" y="58" width="10" height="40" fill="#3a5878"/>' +
        '<rect x="132" y="62" width="20" height="36" fill="#7a5828"/>' +
        '<rect x="154" y="60" width="12" height="38" fill="#3a3838"/>' +
        '<rect x="168" y="58" width="22" height="40" fill="#5a3878"/>' +
        // row 3
        '<rect x="10" y="108" width="16" height="40" fill="#7a2828"/>' +
        '<rect x="28" y="110" width="14" height="38" fill="#3a3848"/>' +
        '<rect x="44" y="112" width="20" height="36" fill="#5a5828"/>' +
        '<rect x="66" y="106" width="12" height="42" fill="#7a3878"/>' +
        '<rect x="80" y="108" width="16" height="40" fill="#3a7848"/>' +
        '<rect x="98" y="110" width="14" height="38" fill="#5a2828"/>' +
        '<rect x="114" y="112" width="22" height="36" fill="#3a3878"/>' +
        '<rect x="138" y="108" width="10" height="40" fill="#7a5828"/>' +
        '<rect x="150" y="110" width="18" height="38" fill="#5a3818"/>' +
        '<rect x="170" y="106" width="14" height="42" fill="#3a5828"/>' +
        // row 4
        '<rect x="20" y="158" width="40" height="6" fill="#bfa050"/>' +
        '<rect x="80" y="156" width="32" height="8" fill="#7a3838"/>' +
        '<rect x="130" y="160" width="50" height="6" fill="#bfa050"/>' +
        '<text x="180" y="172" fill="#d4a624" font-family="Cinzel" font-size="6" opacity="0.7">scroll</text>' +
      '</g>' +
      // desk with open codex
      '<g transform="translate(280, 260)">' +
        '<rect x="0" y="0" width="240" height="14" fill="#5a3818" stroke="#1a0808" stroke-width="1.5"/>' +
        '<rect x="6" y="14" width="8" height="50" fill="#5a3818"/>' +
        '<rect x="226" y="14" width="8" height="50" fill="#5a3818"/>' +
        // open book
        '<path d="M 24 -28 Q 60 -36 120 -32 Q 180 -36 216 -28 L 216 -2 Q 180 -8 120 -4 Q 60 -8 24 -2 Z" fill="#7a3818" stroke="#3a1810" stroke-width="1.5"/>' +
        '<path d="M 28 -26 Q 60 -32 116 -30 L 116 -4 Q 60 -8 28 -4 Z" fill="#f0e3bd" stroke="#3a2010" stroke-width="0.6"/>' +
        '<path d="M 212 -26 Q 180 -32 124 -30 L 124 -4 Q 180 -8 212 -4 Z" fill="#f0e3bd" stroke="#3a2010" stroke-width="0.6"/>' +
        '<rect x="116" y="-30" width="8" height="28" fill="#5a1818"/>' +
        // numbers on page
        '<text x="60" y="-18" fill="#3a2010" font-family="Cinzel" font-size="6">∑ x³ = V</text>' +
        '<text x="150" y="-18" fill="#3a2010" font-family="Cinzel" font-size="6">l·w·h</text>' +
        // candle
        '<rect x="200" y="-50" width="6" height="24" fill="#f0e3bd"/>' +
        '<ellipse cx="203" cy="-54" rx="3" ry="6" fill="#ffcc55"/>' +
        '<circle cx="203" cy="-44" r="20" fill="#ffaa33" opacity="0.18"/>' +
        // inkwell + quill
        '<ellipse cx="32" cy="-30" rx="6" ry="3" fill="#1a1008"/>' +
        '<line x1="32" y1="-30" x2="50" y2="-58" stroke="#c47828" stroke-width="1.5"/>' +
      '</g>' +
      // crystal orb (right side)
      '<g transform="translate(620, 280)">' +
        '<rect x="-8" y="-2" width="16" height="6" fill="#3a1818"/>' +
        '<circle cx="0" cy="-18" r="22" fill="#a890c0" stroke="#5a3878" stroke-width="2" opacity="0.85"/>' +
        '<circle cx="-4" cy="-22" r="6" fill="#fff" opacity="0.5"/>' +
        // glow
        '<circle cx="0" cy="-18" r="42" fill="#c4a8d8" opacity="0.18"/>' +
      '</g>' +
      // floating runes
      '<text x="100" y="40" fill="#a890c0" font-family="Cinzel" font-size="14" opacity="0.4">∑</text>' +
      '<text x="700" y="60" fill="#a890c0" font-family="Cinzel" font-size="14" opacity="0.4">π</text>' +
      '<text x="560" y="50" fill="#a890c0" font-family="Cinzel" font-size="14" opacity="0.4">Δ</text>' +
      '<text x="180" y="240" fill="#a890c0" font-family="Cinzel" font-size="14" opacity="0.4">∞</text>' +
    '</svg>';
  },

  // ----- The Rusty Compass tavern interior -----
  tavernInterior() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      // wall
      '<rect width="800" height="240" fill="#5a3818"/>' +
      '<rect width="800" height="120" fill="#3a2010"/>' +
      // floor
      '<polygon points="0,240 800,240 760,360 40,360" fill="#3a2010"/>' +
      // wood planks
      '<line x1="40" y1="280" x2="760" y2="280" stroke="#1a1008" stroke-width="1"/>' +
      '<line x1="60" y1="320" x2="740" y2="320" stroke="#1a1008" stroke-width="1"/>' +
      // ceiling beams
      '<line x1="0" y1="60" x2="800" y2="60" stroke="#1a1008" stroke-width="3"/>' +
      '<line x1="160" y1="0" x2="160" y2="60" stroke="#3a2010" stroke-width="3"/>' +
      '<line x1="400" y1="0" x2="400" y2="60" stroke="#3a2010" stroke-width="3"/>' +
      '<line x1="640" y1="0" x2="640" y2="60" stroke="#3a2010" stroke-width="3"/>' +
      // hanging lanterns
      '<g transform="translate(240, 60)">' +
        '<line x1="0" y1="0" x2="0" y2="24" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="-12" y="24" width="24" height="28" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="-8" y="28" width="16" height="20" fill="#ffcc55"/>' +
        '<circle cx="0" cy="38" r="40" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
      '<g transform="translate(560, 60)">' +
        '<line x1="0" y1="0" x2="0" y2="24" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="-12" y="24" width="24" height="28" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="-8" y="28" width="16" height="20" fill="#ffcc55"/>' +
        '<circle cx="0" cy="38" r="40" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
      // hearth (back)
      '<g transform="translate(400, 80)">' +
        '<rect x="-50" y="0" width="100" height="120" fill="#3a2010" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="-46" y="20" width="92" height="80" fill="#1a1008"/>' +
        // fire
        '<polygon points="-30,100 -20,60 -10,80 0,40 10,80 20,60 30,100" fill="#f08838"/>' +
        '<polygon points="-20,100 -12,72 -4,84 4,52 12,84 20,72 28,100" fill="#f0d27a"/>' +
        // logs
        '<ellipse cx="-15" cy="100" rx="10" ry="4" fill="#3a1810"/>' +
        '<ellipse cx="10" cy="100" rx="10" ry="4" fill="#3a1810"/>' +
        // mantel
        '<rect x="-58" y="-6" width="116" height="8" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        // compass picture above
        '<circle cx="0" cy="-30" r="14" fill="#3a2010" stroke="#d4a624" stroke-width="1.5"/>' +
        '<polygon points="0,-40 3,-30 0,-20 -3,-30" fill="#d4a624"/>' +
        '<polygon points="-10,-30 0,-32 10,-30 0,-28" fill="#d4a624"/>' +
      '</g>' +
      // bar counter (front-left)
      '<g transform="translate(40, 240)">' +
        '<rect x="0" y="0" width="280" height="20" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="0" y="20" width="280" height="60" fill="#3a2010" stroke="#1a1008" stroke-width="1.5"/>' +
        // grain
        '<line x1="0" y1="40" x2="280" y2="40" stroke="#1a1008" stroke-width="0.8"/>' +
        '<line x1="0" y1="60" x2="280" y2="60" stroke="#1a1008" stroke-width="0.8"/>' +
        // mug
        '<rect x="40" y="-22" width="18" height="22" fill="#888" stroke="#3a2010" stroke-width="1.2"/>' +
        '<rect x="42" y="-22" width="14" height="6" fill="#f0e3bd"/>' +
        '<path d="M 58 -16 Q 66 -12 58 -8" fill="none" stroke="#888" stroke-width="2"/>' +
        // bowl
        '<ellipse cx="120" cy="-4" rx="20" ry="6" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<ellipse cx="120" cy="-6" rx="16" ry="4" fill="#8a5818"/>' +
      '</g>' +
      // tables (right)
      '<g transform="translate(540, 280)">' +
        '<rect x="0" y="0" width="80" height="8" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="6" y="8" width="6" height="40" fill="#3a2010"/>' +
        '<rect x="68" y="8" width="6" height="40" fill="#3a2010"/>' +
        // tankard
        '<rect x="34" y="-16" width="12" height="16" fill="#888" stroke="#3a2010" stroke-width="1"/>' +
      '</g>' +
      '<g transform="translate(640, 250)">' +
        '<rect x="0" y="0" width="80" height="8" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="6" y="8" width="6" height="40" fill="#3a2010"/>' +
        '<rect x="68" y="8" width="6" height="40" fill="#3a2010"/>' +
      '</g>' +
      // hanging map
      '<g transform="translate(120, 80)">' +
        '<rect x="0" y="0" width="60" height="44" fill="#e8d5b5" stroke="#3a2010" stroke-width="1.5"/>' +
        '<line x1="0" y1="0" x2="60" y2="44" stroke="#3a2010" stroke-width="0.4"/>' +
        '<line x1="60" y1="0" x2="0" y2="44" stroke="#3a2010" stroke-width="0.4"/>' +
        '<circle cx="30" cy="22" r="6" fill="none" stroke="#aa2828" stroke-width="1.2"/>' +
        '<text x="30" y="42" text-anchor="middle" fill="#5a3010" font-family="Cinzel" font-size="6">NUMERIA</text>' +
      '</g>' +
      // dust motes
      '<circle cx="200" cy="150" r="1" fill="#f0d27a" opacity="0.4"/>' +
      '<circle cx="320" cy="100" r="1" fill="#f0d27a" opacity="0.4"/>' +
      '<circle cx="500" cy="130" r="1" fill="#f0d27a" opacity="0.4"/>' +
    '</svg>';
  },

  // ----- Dorrick's forge -----
  forge() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      // wall
      '<rect width="800" height="240" fill="#3a2818"/>' +
      // floor
      '<rect y="240" width="800" height="120" fill="#2a1810"/>' +
      // forge centerpiece
      '<g transform="translate(360, 100)">' +
        // stone forge
        '<rect x="0" y="40" width="200" height="120" fill="#5a4828" stroke="#1a1008" stroke-width="2.5"/>' +
        '<rect x="-10" y="30" width="220" height="14" fill="#3a2818" stroke="#1a1008" stroke-width="2"/>' +
        // chimney
        '<rect x="60" y="-100" width="80" height="140" fill="#3a2818" stroke="#1a1008" stroke-width="2"/>' +
        '<polygon points="40,-100 60,-130 140,-130 160,-100" fill="#1a1008"/>' +
        // forge opening with fire
        '<rect x="40" y="64" width="120" height="80" fill="#1a0808"/>' +
        '<rect x="48" y="72" width="104" height="68" fill="#cc4818"/>' +
        '<rect x="56" y="84" width="88" height="48" fill="#f08838"/>' +
        '<rect x="64" y="100" width="72" height="28" fill="#f0d27a"/>' +
        // flame tongues
        '<polygon points="60,72 70,40 80,72" fill="#f08838"/>' +
        '<polygon points="80,72 92,30 104,72" fill="#f0d27a"/>' +
        '<polygon points="104,72 116,40 128,72" fill="#f08838"/>' +
        '<polygon points="128,72 138,50 148,72" fill="#f0d27a"/>' +
        // smoke
        '<path d="M 100 -100 Q 92 -116 100 -130 Q 108 -120 100 -100" fill="rgba(255,255,255,0.2)"/>' +
      '</g>' +
      // anvil (front)
      '<g transform="translate(200, 280)">' +
        '<polygon points="0,0 60,0 70,20 -10,20" fill="#3a3838" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="-12" y="20" width="84" height="10" fill="#5a4818"/>' +
        '<rect x="20" y="30" width="20" height="50" fill="#3a2010"/>' +
        // hammer on top
        '<line x1="20" y1="-30" x2="38" y2="-2" stroke="#5a3818" stroke-width="3"/>' +
        '<rect x="14" y="-36" width="20" height="12" fill="#3a3838" stroke="#1a1008" stroke-width="1.5"/>' +
        // glowing sword on anvil
        '<rect x="-4" y="-2" width="40" height="4" fill="#f08838"/>' +
        '<rect x="36" y="-3" width="4" height="6" fill="#3a2010"/>' +
        '<circle cx="38" cy="0" r="14" fill="#f08838" opacity="0.3"/>' +
      '</g>' +
      // weapon rack (right wall)
      '<g transform="translate(600, 80)">' +
        '<rect x="0" y="0" width="160" height="220" fill="#4a3818" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="60" x2="160" y2="60" stroke="#1a1008" stroke-width="1.5"/>' +
        '<line x1="0" y1="120" x2="160" y2="120" stroke="#1a1008" stroke-width="1.5"/>' +
        '<line x1="0" y1="180" x2="160" y2="180" stroke="#1a1008" stroke-width="1.5"/>' +
        // sword
        '<line x1="30" y1="8" x2="30" y2="56" stroke="#b8c0c8" stroke-width="3"/>' +
        '<rect x="26" y="46" width="8" height="3" fill="#5a3818"/>' +
        // axe
        '<line x1="80" y1="8" x2="80" y2="56" stroke="#5a3818" stroke-width="2.5"/>' +
        '<polygon points="68,16 88,8 96,24 76,32" fill="#888" stroke="#1a1008" stroke-width="1"/>' +
        // hammer
        '<line x1="130" y1="8" x2="130" y2="56" stroke="#5a3818" stroke-width="2.5"/>' +
        '<rect x="120" y="6" width="20" height="14" fill="#3a3838" stroke="#1a1008" stroke-width="1"/>' +
        // shields
        '<path d="M 24 70 Q 40 60 56 70 L 56 100 Q 40 116 24 100 Z" fill="#7a4828" stroke="#1a1008" stroke-width="1.5"/>' +
        '<circle cx="40" cy="86" r="4" fill="#d4a624"/>' +
        '<path d="M 84 70 Q 100 60 116 70 L 116 100 Q 100 116 84 100 Z" fill="#3a3a78" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="100,76 104,86 100,96 96,86" fill="#d4a624"/>' +
        // armor
        '<polygon points="20,130 60,130 65,170 15,170" fill="#888" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="80,130 120,130 125,170 75,170" fill="#3a3838" stroke="#1a1008" stroke-width="1.5"/>' +
        // helmets
        '<path d="M 24 192 Q 40 184 56 192 L 56 212 L 24 212 Z" fill="#888" stroke="#1a1008" stroke-width="1.5"/>' +
        '<line x1="40" y1="192" x2="40" y2="212" stroke="#1a1008" stroke-width="0.8"/>' +
        '<path d="M 84 192 Q 100 184 116 192 L 116 212 L 84 212 Z" fill="#5a4828" stroke="#1a1008" stroke-width="1.5"/>' +
      '</g>' +
      // tool barrel (left front)
      '<g transform="translate(80, 280)">' +
        '<rect x="0" y="0" width="60" height="50" fill="#5a3818" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="14" x2="60" y2="14" stroke="#1a1008" stroke-width="1"/>' +
        '<line x1="0" y1="36" x2="60" y2="36" stroke="#1a1008" stroke-width="1"/>' +
        // tools sticking out
        '<line x1="14" y1="-30" x2="16" y2="0" stroke="#5a3818" stroke-width="2.5"/>' +
        '<polygon points="10,-32 18,-32 16,-22 12,-22" fill="#888"/>' +
        '<line x1="36" y1="-26" x2="38" y2="0" stroke="#5a3818" stroke-width="2.5"/>' +
        '<rect x="32" y="-30" width="12" height="6" fill="#3a3838"/>' +
        '<line x1="50" y1="-20" x2="48" y2="0" stroke="#5a3818" stroke-width="2"/>' +
      '</g>' +
      // hanging chains
      '<line x1="40" y1="0" x2="40" y2="100" stroke="#3a2018" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<line x1="780" y1="0" x2="780" y2="80" stroke="#3a2018" stroke-width="1" stroke-dasharray="3 3"/>' +
      // ember sparks
      '<circle cx="380" cy="80" r="1.4" fill="#f0d27a"/>' +
      '<circle cx="420" cy="60" r="1" fill="#f08838"/>' +
      '<circle cx="460" cy="90" r="1.4" fill="#f0d27a"/>' +
      '<circle cx="350" cy="120" r="1" fill="#f08838"/>' +
      // ambient orange glow
      '<rect width="800" height="360" fill="rgba(204,72,24,0.06)"/>' +
    '</svg>';
  },

  // ----- The Sundered Quarry exterior -----
  quarryExterior() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="qe-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#3a2848"/>' +
          '<stop offset="1" stop-color="#5a4838"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="220" fill="url(#qe-sky)"/>' +
      // distant cliffs
      '<polygon points="0,180 80,90 150,140 220,80 280,150 360,90 440,160 540,100 620,160 720,110 800,150 800,220 0,220" fill="#3a2818"/>' +
      // quarry pit walls
      '<polygon points="0,220 800,220 760,360 40,360" fill="#4a3828"/>' +
      // dramatic terrace cuts (stairs of stone blocks)
      '<g>' +
        '<rect x="40" y="220" width="160" height="40" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="80" y="260" width="120" height="40" fill="#6a5848" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="120" y="300" width="80" height="60" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
      '</g>' +
      '<g>' +
        '<rect x="600" y="220" width="160" height="40" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="600" y="260" width="120" height="40" fill="#6a5848" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="600" y="300" width="80" height="60" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
      '</g>' +
      // grid lines on stone (showing volume) - faint guidelines
      '<g opacity="0.3" stroke="#d4a624" stroke-width="0.6">' +
        '<line x1="40" y1="240" x2="200" y2="240"/>' +
        '<line x1="80" y1="280" x2="200" y2="280"/>' +
        '<line x1="80" y1="220" x2="80" y2="260"/>' +
        '<line x1="120" y1="220" x2="120" y2="300"/>' +
        '<line x1="160" y1="220" x2="160" y2="260"/>' +
      '</g>' +
      // mine entrance — yawning arched opening
      '<g transform="translate(400, 200)">' +
        '<path d="M -80 100 L -80 30 Q -80 -10 0 -10 Q 80 -10 80 30 L 80 100 Z" fill="#1a0808" stroke="#3a1810" stroke-width="3"/>' +
        // arch keystone
        '<polygon points="-12,-10 12,-10 14,-2 -14,-2" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        '<text x="0" y="-2" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="6">V</text>' +
        // wood support beams
        '<rect x="-86" y="30" width="6" height="70" fill="#3a2010"/>' +
        '<rect x="80" y="30" width="6" height="70" fill="#3a2010"/>' +
        '<rect x="-90" y="24" width="180" height="8" fill="#3a2010"/>' +
        // glowing eyes inside (foreshadow)
        '<circle cx="-30" cy="80" r="2" fill="#cc3030" opacity="0.8"/>' +
        '<circle cx="30" cy="80" r="2" fill="#cc3030" opacity="0.8"/>' +
        // dripping moss
        '<line x1="-60" y1="-2" x2="-60" y2="14" stroke="#3a7848" stroke-width="2"/>' +
        '<line x1="60" y1="-2" x2="60" y2="12" stroke="#3a7848" stroke-width="2"/>' +
      '</g>' +
      // cart on rails (left)
      '<g transform="translate(220, 290)">' +
        '<rect x="0" y="0" width="60" height="30" fill="#5a3818" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="-4" y="0" width="4" height="30" fill="#3a2010"/>' +
        '<rect x="60" y="0" width="4" height="30" fill="#3a2010"/>' +
        '<circle cx="14" cy="34" r="6" fill="#3a3838" stroke="#1a1008" stroke-width="1"/>' +
        '<circle cx="46" cy="34" r="6" fill="#3a3838" stroke="#1a1008" stroke-width="1"/>' +
        // rocks in cart
        '<polygon points="6,-8 14,-12 20,-6 12,-2" fill="#7a7068"/>' +
        '<polygon points="26,-12 36,-14 40,-6 30,-4" fill="#5a5048"/>' +
        '<polygon points="44,-10 54,-12 56,-4 46,-2" fill="#7a7068"/>' +
      '</g>' +
      // rails
      '<line x1="40" y1="328" x2="240" y2="328" stroke="#3a2818" stroke-width="2"/>' +
      '<line x1="40" y1="334" x2="240" y2="334" stroke="#3a2818" stroke-width="2"/>' +
      // crows
      '<g transform="translate(150, 100)" opacity="0.7">' +
        '<path d="M 0 0 Q 8 -6 16 0 Q 8 -2 0 0" fill="#1a0808"/>' +
      '</g>' +
      '<g transform="translate(560, 130)" opacity="0.7">' +
        '<path d="M 0 0 Q 8 -6 16 0 Q 8 -2 0 0" fill="#1a0808"/>' +
      '</g>' +
      // foreground sign post
      '<g transform="translate(40, 290)">' +
        '<line x1="0" y1="0" x2="0" y2="60" stroke="#3a2010" stroke-width="3"/>' +
        '<rect x="-30" y="6" width="64" height="22" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<text x="2" y="20" text-anchor="middle" fill="#d4a624" font-family="IM Fell English SC" font-size="9">QUARRY</text>' +
      '</g>' +
    '</svg>';
  },

  // ----- Quarry interior chamber -----
  quarryInterior() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<radialGradient id="qi-torch" cx="0.5" cy="0.5" r="0.8">' +
          '<stop offset="0" stop-color="#f0d27a" stop-opacity="0.55"/>' +
          '<stop offset="1" stop-color="#1a0808" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<rect width="800" height="360" fill="#1a0808"/>' +
      // light pool centered
      '<rect width="800" height="360" fill="url(#qi-torch)"/>' +
      // back wall (rocky)
      '<polygon points="0,80 800,80 800,260 0,260" fill="#3a2818"/>' +
      // floor
      '<polygon points="0,260 800,260 760,360 40,360" fill="#2a1810"/>' +
      // back wall texture
      '<g stroke="#1a0808" stroke-width="1" opacity="0.7">' +
        '<line x1="0" y1="100" x2="800" y2="100"/>' +
        '<line x1="100" y1="80" x2="100" y2="100"/>' +
        '<line x1="240" y1="80" x2="240" y2="100"/>' +
        '<line x1="380" y1="80" x2="380" y2="100"/>' +
        '<line x1="520" y1="80" x2="520" y2="100"/>' +
        '<line x1="660" y1="80" x2="660" y2="100"/>' +
        '<line x1="0" y1="140" x2="800" y2="140"/>' +
        '<line x1="60" y1="100" x2="60" y2="140"/>' +
        '<line x1="200" y1="100" x2="200" y2="140"/>' +
        '<line x1="340" y1="100" x2="340" y2="140"/>' +
        '<line x1="480" y1="100" x2="480" y2="140"/>' +
        '<line x1="620" y1="100" x2="620" y2="140"/>' +
        '<line x1="760" y1="100" x2="760" y2="140"/>' +
        '<line x1="0" y1="180" x2="800" y2="180"/>' +
        '<line x1="120" y1="140" x2="120" y2="180"/>' +
        '<line x1="260" y1="140" x2="260" y2="180"/>' +
        '<line x1="400" y1="140" x2="400" y2="180"/>' +
        '<line x1="540" y1="140" x2="540" y2="180"/>' +
        '<line x1="680" y1="140" x2="680" y2="180"/>' +
        '<line x1="0" y1="220" x2="800" y2="220"/>' +
      '</g>' +
      // wooden support beams
      '<g transform="translate(140, 80)">' +
        '<rect x="0" y="0" width="10" height="180" fill="#3a2010" stroke="#1a0808" stroke-width="1"/>' +
        '<rect x="-30" y="0" width="70" height="10" fill="#3a2010" stroke="#1a0808" stroke-width="1"/>' +
      '</g>' +
      '<g transform="translate(650, 80)">' +
        '<rect x="0" y="0" width="10" height="180" fill="#3a2010" stroke="#1a0808" stroke-width="1"/>' +
        '<rect x="-30" y="0" width="70" height="10" fill="#3a2010" stroke="#1a0808" stroke-width="1"/>' +
      '</g>' +
      // torches on the beams
      '<g transform="translate(110, 130)">' +
        '<line x1="0" y1="0" x2="-12" y2="-10" stroke="#3a2010" stroke-width="3"/>' +
        '<ellipse cx="-14" cy="-14" rx="5" ry="9" fill="#f08838"/>' +
        '<ellipse cx="-14" cy="-18" rx="3" ry="5" fill="#f0d27a"/>' +
        '<circle cx="-14" cy="-14" r="36" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
      '<g transform="translate(690, 130)">' +
        '<line x1="0" y1="0" x2="12" y2="-10" stroke="#3a2010" stroke-width="3"/>' +
        '<ellipse cx="14" cy="-14" rx="5" ry="9" fill="#f08838"/>' +
        '<ellipse cx="14" cy="-18" rx="3" ry="5" fill="#f0d27a"/>' +
        '<circle cx="14" cy="-14" r="36" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
      // stone pillars carved with cubes
      '<g transform="translate(300, 200)">' +
        '<rect x="0" y="0" width="40" height="60" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="-4,-4 44,-4 44,4 -4,4" fill="#7a6058" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="-4,60 44,60 48,68 -8,68" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        // cube carving
        '<rect x="10" y="14" width="20" height="20" fill="none" stroke="#d4a624" stroke-width="0.8"/>' +
        '<polygon points="10,14 16,8 36,8 30,14" fill="none" stroke="#d4a624" stroke-width="0.8"/>' +
        '<polygon points="30,14 36,8 36,28 30,34" fill="none" stroke="#d4a624" stroke-width="0.8"/>' +
      '</g>' +
      '<g transform="translate(460, 200)">' +
        '<rect x="0" y="0" width="40" height="60" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="-4,-4 44,-4 44,4 -4,4" fill="#7a6058" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="-4,60 44,60 48,68 -8,68" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="10" y="14" width="20" height="20" fill="none" stroke="#d4a624" stroke-width="0.8"/>' +
        '<polygon points="10,14 16,8 36,8 30,14" fill="none" stroke="#d4a624" stroke-width="0.8"/>' +
        '<polygon points="30,14 36,8 36,28 30,34" fill="none" stroke="#d4a624" stroke-width="0.8"/>' +
      '</g>' +
      // rubble piles (foreground)
      '<g transform="translate(40, 320)" opacity="0.9">' +
        '<polygon points="0,0 20,-10 36,4 28,18 8,16" fill="#5a5048"/>' +
        '<polygon points="36,4 50,-6 62,8 46,18" fill="#7a7068"/>' +
      '</g>' +
      '<g transform="translate(680, 320)" opacity="0.9">' +
        '<polygon points="0,0 20,-10 36,4 28,18 8,16" fill="#7a7068"/>' +
        '<polygon points="36,4 50,-6 62,8 46,18" fill="#5a5048"/>' +
      '</g>' +
      // glowing rune circle in the middle of the floor
      '<g transform="translate(400, 300)" opacity="0.7">' +
        '<circle cx="0" cy="0" r="40" fill="none" stroke="#7a3878" stroke-width="2"/>' +
        '<circle cx="0" cy="0" r="28" fill="none" stroke="#7a3878" stroke-width="1.2"/>' +
        '<polygon points="0,-32 6,0 0,32 -6,0" fill="none" stroke="#7a3878" stroke-width="1"/>' +
        '<text x="0" y="4" text-anchor="middle" fill="#7a3878" font-family="Cinzel" font-size="14">∑</text>' +
      '</g>' +
      // mist
      '<rect width="800" height="60" y="240" fill="rgba(168,144,192,0.08)"/>' +
    '</svg>';
  },

  // ----- Boss arena (Hollowed One's chamber) -----
  bossArena() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<radialGradient id="ba-void" cx="0.5" cy="0.5" r="0.7">' +
          '<stop offset="0" stop-color="#7a3878" stop-opacity="0.6"/>' +
          '<stop offset="0.5" stop-color="#2a0838" stop-opacity="0.5"/>' +
          '<stop offset="1" stop-color="#0a0210" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<rect width="800" height="360" fill="#0a0210"/>' +
      // distant void
      '<rect width="800" height="360" fill="url(#ba-void)"/>' +
      // far cathedral pillars
      '<g transform="translate(120, 80)" opacity="0.6">' +
        '<polygon points="0,0 30,0 24,200 6,200" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<polygon points="-8,0 38,0 38,16 -8,16" fill="#5a2858"/>' +
      '</g>' +
      '<g transform="translate(280, 80)" opacity="0.7">' +
        '<polygon points="0,0 36,0 28,220 8,220" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<polygon points="-10,0 46,0 46,16 -10,16" fill="#5a2858"/>' +
      '</g>' +
      '<g transform="translate(450, 80)" opacity="0.7">' +
        '<polygon points="0,0 36,0 28,220 8,220" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<polygon points="-10,0 46,0 46,16 -10,16" fill="#5a2858"/>' +
      '</g>' +
      '<g transform="translate(620, 80)" opacity="0.6">' +
        '<polygon points="0,0 30,0 24,200 6,200" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<polygon points="-8,0 38,0 38,16 -8,16" fill="#5a2858"/>' +
      '</g>' +
      // floor (cracked obsidian)
      '<polygon points="0,260 800,260 760,360 40,360" fill="#1a0420"/>' +
      // cracks in floor
      '<line x1="100" y1="280" x2="200" y2="320" stroke="#7a3878" stroke-width="1.5" opacity="0.7"/>' +
      '<line x1="200" y1="320" x2="280" y2="340" stroke="#7a3878" stroke-width="1" opacity="0.7"/>' +
      '<line x1="500" y1="280" x2="600" y2="340" stroke="#7a3878" stroke-width="1.5" opacity="0.7"/>' +
      '<line x1="350" y1="290" x2="450" y2="350" stroke="#7a3878" stroke-width="1" opacity="0.5"/>' +
      // central altar
      '<g transform="translate(400, 280)">' +
        '<polygon points="-60,0 60,0 70,40 -70,40" fill="#3a1838" stroke="#1a0418" stroke-width="2.5"/>' +
        '<polygon points="-60,-8 60,-8 60,0 -60,0" fill="#5a2858" stroke="#1a0418" stroke-width="2"/>' +
        '<polygon points="-50,-8 50,-8 50,-2 -50,-2" fill="#7a3878"/>' +
        '<polygon points="-40,-30 40,-30 30,-8 -30,-8" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<text x="0" y="-14" text-anchor="middle" fill="#cc4878" font-family="Cinzel" font-size="14">l·w·h</text>' +
      '</g>' +
      // floating cube fragments
      '<g transform="translate(160, 100)" opacity="0.85">' +
        '<polygon points="0,0 24,-8 30,12 6,20" fill="#5a4838" stroke="#1a0418" stroke-width="1"/>' +
        '<polygon points="0,0 24,-8 24,4 0,12" fill="#7a6058"/>' +
      '</g>' +
      '<g transform="translate(640, 120)" opacity="0.85">' +
        '<polygon points="0,0 30,-6 36,16 6,22" fill="#5a4838" stroke="#1a0418" stroke-width="1"/>' +
        '<polygon points="0,0 30,-6 30,8 0,14" fill="#7a6058"/>' +
      '</g>' +
      '<g transform="translate(60, 200)" opacity="0.7">' +
        '<polygon points="0,0 20,-4 26,12 6,16" fill="#5a4838" stroke="#1a0418" stroke-width="1"/>' +
      '</g>' +
      '<g transform="translate(700, 220)" opacity="0.7">' +
        '<polygon points="0,0 18,-4 22,10 4,14" fill="#5a4838" stroke="#1a0418" stroke-width="1"/>' +
      '</g>' +
      // braziers
      '<g transform="translate(120, 280)">' +
        '<rect x="-8" y="0" width="16" height="40" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<ellipse cx="0" cy="0" rx="14" ry="6" fill="#5a2858" stroke="#1a0418" stroke-width="1.5"/>' +
        '<ellipse cx="0" cy="-2" rx="10" ry="4" fill="#cc4878"/>' +
        '<polygon points="-8,-2 -4,-16 0,-6 4,-20 8,-6 12,-14" fill="#cc4878" opacity="0.85"/>' +
        '<circle cx="0" cy="-8" r="30" fill="#cc4878" opacity="0.15"/>' +
      '</g>' +
      '<g transform="translate(680, 280)">' +
        '<rect x="-8" y="0" width="16" height="40" fill="#3a1838" stroke="#1a0418" stroke-width="1.5"/>' +
        '<ellipse cx="0" cy="0" rx="14" ry="6" fill="#5a2858" stroke="#1a0418" stroke-width="1.5"/>' +
        '<ellipse cx="0" cy="-2" rx="10" ry="4" fill="#cc4878"/>' +
        '<polygon points="-8,-2 -4,-16 0,-6 4,-20 8,-6 12,-14" fill="#cc4878" opacity="0.85"/>' +
        '<circle cx="0" cy="-8" r="30" fill="#cc4878" opacity="0.15"/>' +
      '</g>' +
      // distant stars
      '<circle cx="100" cy="40" r="1" fill="#a890c0"/>' +
      '<circle cx="300" cy="30" r="1.2" fill="#a890c0"/>' +
      '<circle cx="500" cy="46" r="1" fill="#a890c0"/>' +
      '<circle cx="700" cy="30" r="1.2" fill="#a890c0"/>' +
    '</svg>';
  },

  // ----- Ending vista (sunrise over restored Numeria) -----
  endingVista() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="ev-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#5a4878"/>' +
          '<stop offset="0.4" stop-color="#c47828"/>' +
          '<stop offset="0.7" stop-color="#f0d27a"/>' +
          '<stop offset="1" stop-color="#a890c0"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="240" fill="url(#ev-sky)"/>' +
      // sun rising large
      '<circle cx="400" cy="200" r="80" fill="#f0d27a"/>' +
      '<circle cx="400" cy="200" r="120" fill="#f0d27a" opacity="0.25"/>' +
      // light rays
      '<g stroke="#f0d27a" stroke-width="2" opacity="0.45">' +
        '<line x1="400" y1="80" x2="400" y2="40"/>' +
        '<line x1="320" y1="120" x2="280" y2="80"/>' +
        '<line x1="480" y1="120" x2="520" y2="80"/>' +
        '<line x1="280" y1="200" x2="220" y2="200"/>' +
        '<line x1="520" y1="200" x2="580" y2="200"/>' +
        '<line x1="320" y1="280" x2="280" y2="320"/>' +
        '<line x1="480" y1="280" x2="520" y2="320"/>' +
      '</g>' +
      // mountains
      '<polygon points="0,220 100,140 200,180 300,120 400,170 500,120 600,180 700,140 800,200 800,260 0,260" fill="#3a2848"/>' +
      // numeria silhouette
      '<polygon points="0,260 800,260 800,360 0,360" fill="#2a1810"/>' +
      // tavern
      '<g transform="translate(120, 220)" opacity="0.9">' +
        '<polygon points="0,40 0,0 40,-20 80,0 80,40" fill="#1a0808" stroke="#2a1810" stroke-width="1"/>' +
        '<polygon points="-6,2 40,-22 86,2" fill="#1a0808"/>' +
        '<rect x="30" y="20" width="20" height="20" fill="#f08838"/>' +
      '</g>' +
      // tower
      '<g transform="translate(380, 200)" opacity="0.9">' +
        '<rect x="-15" y="60" width="30" height="60" fill="#1a0808"/>' +
        '<polygon points="-18,60 18,60 0,30" fill="#1a0808"/>' +
        '<rect x="-6" y="74" width="12" height="14" fill="#f0d27a"/>' +
      '</g>' +
      // smithy
      '<g transform="translate(580, 220)" opacity="0.9">' +
        '<rect x="0" y="0" width="60" height="40" fill="#1a0808"/>' +
        '<polygon points="-6,2 60,-22 66,2" fill="#1a0808"/>' +
        '<rect x="14" y="14" width="32" height="20" fill="#f08838"/>' +
      '</g>' +
      // banner pole on tower
      '<line x1="380" y1="180" x2="380" y2="150" stroke="#f0d27a" stroke-width="1.5"/>' +
      '<polygon points="380,152 410,162 408,178 380,170" fill="#d4a624"/>' +
      // hero silhouette on ridge
      '<g transform="translate(680, 240)">' +
        '<rect x="-3" y="0" width="6" height="20" fill="#1a0808"/>' +
        '<ellipse cx="0" cy="-2" rx="4" ry="5" fill="#1a0808"/>' +
        // staff/sword
        '<line x1="6" y1="-8" x2="6" y2="20" stroke="#1a0808" stroke-width="1.5"/>' +
      '</g>' +
      // birds
      '<g opacity="0.7">' +
        '<path d="M 200 80 Q 208 74 216 80 Q 208 76 200 80" fill="#1a0808"/>' +
        '<path d="M 240 60 Q 248 54 256 60 Q 248 56 240 60" fill="#1a0808"/>' +
        '<path d="M 480 50 Q 488 44 496 50 Q 488 46 480 50" fill="#1a0808"/>' +
        '<path d="M 600 100 Q 608 94 616 100 Q 608 96 600 100" fill="#1a0808"/>' +
      '</g>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT II — NPC: MIRA
  // --------------------------------------------------------
  mira(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="mir-bg"><stop offset="0" stop-color="#3a7858"/><stop offset="1" stop-color="#1a3838"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#mir-bg)"/>' +
      // hair (long, dark teal-brown)
      '<path d="M 28 38 Q 50 16 72 38 L 76 86 Q 64 82 64 86 L 36 86 Q 24 82 28 86 Z" fill="#3a2818"/>' +
      // bandana
      '<rect x="28" y="34" width="44" height="6" fill="#cc4848" stroke="#3a1010" stroke-width="0.6"/>' +
      '<polygon points="68,34 78,28 76,40 70,40" fill="#cc4848" stroke="#3a1010" stroke-width="0.6"/>' +
      // face
      '<ellipse cx="50" cy="52" rx="17" ry="19" fill="#d8b888" stroke="#3a2010" stroke-width="0.8"/>' +
      // partial elf ears
      '<path d="M 32 52 Q 26 48 28 40 L 34 48 Z" fill="#d8b888"/>' +
      '<path d="M 68 52 Q 74 48 72 40 L 66 48 Z" fill="#d8b888"/>' +
      // eyes (sea green)
      '<ellipse cx="44" cy="52" rx="1.8" ry="2.2" fill="#3a7858"/>' +
      '<ellipse cx="56" cy="52" rx="1.8" ry="2.2" fill="#3a7858"/>' +
      '<circle cx="44.5" cy="51.5" r="0.5" fill="#fff"/>' +
      '<circle cx="56.5" cy="51.5" r="0.5" fill="#fff"/>' +
      // brows
      '<line x1="40" y1="48" x2="48" y2="48" stroke="#2a1808" stroke-width="1.2"/>' +
      '<line x1="52" y1="48" x2="60" y2="48" stroke="#2a1808" stroke-width="1.2"/>' +
      // determined mouth
      '<path d="M 44 62 Q 50 64 56 62" stroke="#3a2010" stroke-width="1.2" fill="none"/>' +
      // small earring
      '<circle cx="33" cy="56" r="1" fill="#d4a624"/>' +
      // collar of leather jacket
      '<path d="M 30 80 Q 50 90 70 80 L 74 96 L 26 96 Z" fill="#3a2010" stroke="#1a0808" stroke-width="1"/>' +
      '<line x1="50" y1="86" x2="50" y2="96" stroke="#1a0808" stroke-width="0.6"/>' +
    '</svg>';
  },

  goren(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="gor-bg"><stop offset="0" stop-color="#3a5878"/><stop offset="1" stop-color="#1a2838"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#gor-bg)"/>' +
      // weathered cap
      '<path d="M 28 38 Q 50 22 72 38 L 76 50 Q 50 42 24 50 Z" fill="#1a2838" stroke="#0a1818" stroke-width="1.2"/>' +
      '<path d="M 22 46 L 78 46 L 78 50 L 22 50 Z" fill="#0a1818"/>' +
      // face
      '<ellipse cx="50" cy="58" rx="17" ry="17" fill="#d0a878" stroke="#3a2010" stroke-width="0.8"/>' +
      // ears
      '<ellipse cx="32" cy="58" rx="3" ry="4" fill="#d0a878"/>' +
      '<ellipse cx="68" cy="58" rx="3" ry="4" fill="#d0a878"/>' +
      // weathered eyes
      '<ellipse cx="44" cy="56" rx="1.6" ry="2" fill="#1a1008"/>' +
      '<ellipse cx="56" cy="56" rx="1.6" ry="2" fill="#1a1008"/>' +
      // crow\'s feet
      '<line x1="36" y1="55" x2="40" y2="55" stroke="#3a2010" stroke-width="0.6"/>' +
      '<line x1="60" y1="55" x2="64" y2="55" stroke="#3a2010" stroke-width="0.6"/>' +
      '<line x1="36" y1="58" x2="40" y2="58" stroke="#3a2010" stroke-width="0.6"/>' +
      '<line x1="60" y1="58" x2="64" y2="58" stroke="#3a2010" stroke-width="0.6"/>' +
      // big bushy salt-and-pepper beard
      '<path d="M 30 66 Q 50 94 70 66 L 72 88 Q 50 100 28 88 Z" fill="#c8c0b0"/>' +
      '<path d="M 36 76 Q 50 92 64 76" fill="#a89888"/>' +
      // pipe
      '<rect x="56" y="74" width="14" height="3" fill="#3a2010" stroke="#1a0808" stroke-width="0.4"/>' +
      '<rect x="68" y="71" width="6" height="6" fill="#5a3818" stroke="#1a0808" stroke-width="0.6"/>' +
      '<circle cx="71" cy="71" r="1.6" fill="#cc4818"/>' +
      // smoke
      '<path d="M 72 70 Q 80 60 76 50" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>' +
    '</svg>';
  },

  gull(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="gul-bg"><stop offset="0" stop-color="#5a4878"/><stop offset="1" stop-color="#1a1838"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#gul-bg)"/>' +
      // wispy white hair
      '<path d="M 26 36 Q 50 18 74 36 L 78 60 Q 64 52 64 58 L 36 58 Q 22 52 22 60 Z" fill="#e8e0d0"/>' +
      // tied scarf in hair
      '<path d="M 28 32 Q 38 26 50 30 Q 62 26 72 32" fill="none" stroke="#aa3838" stroke-width="2"/>' +
      // face (older, lined)
      '<ellipse cx="50" cy="56" rx="16" ry="18" fill="#e8c4a8" stroke="#3a2010" stroke-width="0.8"/>' +
      // ears
      '<ellipse cx="34" cy="56" rx="2.5" ry="4" fill="#e8c4a8"/>' +
      '<ellipse cx="66" cy="56" rx="2.5" ry="4" fill="#e8c4a8"/>' +
      // glasses
      '<circle cx="44" cy="54" r="5" fill="none" stroke="#5a4828" stroke-width="1"/>' +
      '<circle cx="56" cy="54" r="5" fill="none" stroke="#5a4828" stroke-width="1"/>' +
      '<line x1="49" y1="54" x2="51" y2="54" stroke="#5a4828" stroke-width="1"/>' +
      // eyes
      '<circle cx="44" cy="54" r="1.4" fill="#1a1008"/>' +
      '<circle cx="56" cy="54" r="1.4" fill="#1a1008"/>' +
      // wrinkles
      '<path d="M 38 62 Q 40 64 42 62" stroke="#5a3818" stroke-width="0.4" fill="none"/>' +
      '<path d="M 58 62 Q 60 64 62 62" stroke="#5a3818" stroke-width="0.4" fill="none"/>' +
      // kind smile
      '<path d="M 42 68 Q 50 72 58 68" stroke="#3a2010" stroke-width="1" fill="none"/>' +
      // shawl
      '<path d="M 28 78 Q 50 90 72 78 L 76 96 L 24 96 Z" fill="#5a3878" stroke="#3a1858" stroke-width="0.8"/>' +
      '<path d="M 32 82 L 68 82" stroke="#a890c0" stroke-width="0.6"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT II — SCENE ILLUSTRATIONS
  // --------------------------------------------------------

  // ----- Port of Whitehaven -----
  portWhitehaven() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="pw-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#a8c4d8"/>' +
          '<stop offset="0.6" stop-color="#e0d8c0"/>' +
          '<stop offset="1" stop-color="#c4a888"/>' +
        '</linearGradient>' +
        '<linearGradient id="pw-sea" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#3a6878"/>' +
          '<stop offset="1" stop-color="#1a3848"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="220" fill="url(#pw-sky)"/>' +
      // distant lighthouse on cliff
      '<polygon points="0,200 80,140 160,180 220,150 280,180 0,180" fill="#7a8898" opacity="0.7"/>' +
      '<g transform="translate(120, 140)">' +
        '<rect x="-6" y="0" width="12" height="36" fill="#e8e0d0" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="-8" y="-4" width="16" height="6" fill="#cc4818" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="-4" y="0" width="8" height="12" fill="#3a2010"/>' +
        '<circle cx="0" cy="-8" r="3" fill="#ffcc55"/>' +
        '<circle cx="0" cy="-8" r="20" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
      // sea + waves
      '<rect y="220" width="800" height="60" fill="url(#pw-sea)"/>' +
      '<path d="M 0 232 Q 80 226 160 232 T 320 232 T 480 232 T 640 232 T 800 232" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>' +
      '<path d="M 0 244 Q 80 238 160 244 T 320 244 T 480 244 T 640 244 T 800 244" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>' +
      // pier/dock with planks
      '<rect y="270" width="800" height="20" fill="#5a3818"/>' +
      '<g stroke="#1a0808" stroke-width="0.6">' +
        '<line x1="60" y1="270" x2="60" y2="290"/>' +
        '<line x1="140" y1="270" x2="140" y2="290"/>' +
        '<line x1="220" y1="270" x2="220" y2="290"/>' +
        '<line x1="300" y1="270" x2="300" y2="290"/>' +
        '<line x1="380" y1="270" x2="380" y2="290"/>' +
        '<line x1="460" y1="270" x2="460" y2="290"/>' +
        '<line x1="540" y1="270" x2="540" y2="290"/>' +
        '<line x1="620" y1="270" x2="620" y2="290"/>' +
        '<line x1="700" y1="270" x2="700" y2="290"/>' +
      '</g>' +
      // ground beach
      '<rect y="290" width="800" height="70" fill="#c4a878"/>' +
      // tavern (left)
      '<g transform="translate(80, 160)">' +
        '<polygon points="0,110 0,50 60,20 120,50 120,110" fill="#7a3818" stroke="#3a1810" stroke-width="2"/>' +
        '<polygon points="-10,52 60,12 130,52" fill="#5a2818" stroke="#3a1810" stroke-width="2"/>' +
        '<rect x="50" y="70" width="20" height="40" fill="#3a1810"/>' +
        '<circle cx="66" cy="92" r="1.5" fill="#d4a624"/>' +
        '<rect x="14" y="62" width="22" height="22" fill="#ffaa55" stroke="#3a1810" stroke-width="1"/>' +
        '<line x1="25" y1="62" x2="25" y2="84" stroke="#3a1810" stroke-width="0.6"/>' +
        '<rect x="84" y="62" width="22" height="22" fill="#ffaa55" stroke="#3a1810" stroke-width="1"/>' +
        '<line x1="95" y1="62" x2="95" y2="84" stroke="#3a1810" stroke-width="0.6"/>' +
        // sign
        '<rect x="-12" y="34" width="40" height="14" fill="#5a3010" stroke="#3a1810" stroke-width="1"/>' +
        '<text x="8" y="44" text-anchor="middle" fill="#d4a624" font-family="IM Fell English SC" font-size="7">SALT-WORN</text>' +
        // hanging anchor
        '<line x1="100" y1="36" x2="100" y2="46" stroke="#3a2010" stroke-width="1"/>' +
        '<g transform="translate(100, 50)" fill="#888" stroke="#3a2010" stroke-width="0.6">' +
          '<line x1="0" y1="-4" x2="0" y2="8"/>' +
          '<path d="M -5 6 Q 0 12 5 6"/>' +
          '<line x1="-5" y1="-3" x2="5" y2="-3"/>' +
        '</g>' +
      '</g>' +
      // net-mender shed (right)
      '<g transform="translate(540, 180)">' +
        '<rect x="0" y="0" width="100" height="90" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
        '<polygon points="-10,2 50,-28 110,2" fill="#3a2818" stroke="#1a0808" stroke-width="2"/>' +
        '<rect x="40" y="50" width="20" height="40" fill="#3a2010"/>' +
        // net hanging
        '<g transform="translate(0, 30)" stroke="#8a6a14" stroke-width="0.6" fill="none">' +
          '<line x1="0" y1="0" x2="100" y2="0"/>' +
          '<line x1="0" y1="0" x2="20" y2="20"/>' +
          '<line x1="20" y1="0" x2="40" y2="20"/>' +
          '<line x1="40" y1="0" x2="60" y2="20"/>' +
          '<line x1="60" y1="0" x2="80" y2="20"/>' +
          '<line x1="80" y1="0" x2="100" y2="20"/>' +
          '<line x1="20" y1="0" x2="0" y2="20"/>' +
          '<line x1="40" y1="0" x2="20" y2="20"/>' +
          '<line x1="60" y1="0" x2="40" y2="20"/>' +
          '<line x1="80" y1="0" x2="60" y2="20"/>' +
          '<line x1="100" y1="0" x2="80" y2="20"/>' +
        '</g>' +
      '</g>' +
      // moored boat at the pier
      '<g transform="translate(330, 240)">' +
        // hull
        '<path d="M -50 10 Q -40 28 0 30 Q 40 28 50 10 Q 30 12 0 12 Q -30 12 -50 10 Z" fill="#5a3818" stroke="#1a0808" stroke-width="1.5"/>' +
        '<rect x="-44" y="6" width="88" height="4" fill="#3a2010"/>' +
        // mast
        '<line x1="0" y1="6" x2="0" y2="-46" stroke="#3a2010" stroke-width="3"/>' +
        // sail (white with red stripe)
        '<polygon points="0,-46 0,-4 32,-4 28,-46" fill="#f0e3bd" stroke="#3a2010" stroke-width="1.2"/>' +
        '<rect x="0" y="-26" width="30" height="4" fill="#cc4818"/>' +
        // rope from mast to bow
        '<line x1="0" y1="-44" x2="-48" y2="14" stroke="#3a2010" stroke-width="0.6"/>' +
        '<line x1="0" y1="-44" x2="48" y2="14" stroke="#3a2010" stroke-width="0.6"/>' +
        // tiny figure (Mira)
        '<g transform="translate(-12, 0)">' +
          '<ellipse cx="0" cy="0" rx="3" ry="4" fill="#3a2818"/>' +
          '<rect x="-2" y="3" width="4" height="6" fill="#1a2838"/>' +
        '</g>' +
      '</g>' +
      // seagull
      '<path d="M 220 100 Q 230 92 240 100 Q 230 96 220 100" fill="#fff" stroke="#3a2010" stroke-width="0.4"/>' +
      '<path d="M 600 80 Q 610 72 620 80 Q 610 76 600 80" fill="#fff" stroke="#3a2010" stroke-width="0.4"/>' +
      // crates
      '<rect x="280" y="296" width="24" height="24" fill="#5a3818" stroke="#1a0808" stroke-width="1"/>' +
      '<rect x="308" y="304" width="20" height="16" fill="#5a3818" stroke="#1a0808" stroke-width="1"/>' +
      // barrels
      '<rect x="430" y="296" width="22" height="28" fill="#7a5828" stroke="#1a0808" stroke-width="1" rx="2"/>' +
      '<line x1="430" y1="306" x2="452" y2="306" stroke="#1a0808" stroke-width="0.6"/>' +
      '<line x1="430" y1="316" x2="452" y2="316" stroke="#1a0808" stroke-width="0.6"/>' +
    '</svg>';
  },

  // ----- The Salt-Worn Sign tavern interior -----
  saltWornInterior() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="800" height="360" fill="#3a2818"/>' +
      '<rect width="800" height="80" fill="#1a0808"/>' +
      // wall planks (vertical)
      '<g stroke="#1a0808" stroke-width="0.6">' +
        '<line x1="80" y1="80" x2="80" y2="280"/>' +
        '<line x1="160" y1="80" x2="160" y2="280"/>' +
        '<line x1="240" y1="80" x2="240" y2="280"/>' +
        '<line x1="320" y1="80" x2="320" y2="280"/>' +
        '<line x1="400" y1="80" x2="400" y2="280"/>' +
        '<line x1="480" y1="80" x2="480" y2="280"/>' +
        '<line x1="560" y1="80" x2="560" y2="280"/>' +
        '<line x1="640" y1="80" x2="640" y2="280"/>' +
        '<line x1="720" y1="80" x2="720" y2="280"/>' +
      '</g>' +
      // floor
      '<polygon points="0,280 800,280 760,360 40,360" fill="#5a3818"/>' +
      // hanging ship\'s wheel
      '<g transform="translate(400, 110)">' +
        '<line x1="0" y1="-40" x2="0" y2="-10" stroke="#1a0808" stroke-width="1"/>' +
        '<circle cx="0" cy="20" r="32" fill="none" stroke="#5a3818" stroke-width="6"/>' +
        '<circle cx="0" cy="20" r="6" fill="#3a2010"/>' +
        '<line x1="0" y1="-12" x2="0" y2="52" stroke="#5a3818" stroke-width="4"/>' +
        '<line x1="-32" y1="20" x2="32" y2="20" stroke="#5a3818" stroke-width="4"/>' +
        '<line x1="-22" y1="-2" x2="22" y2="42" stroke="#5a3818" stroke-width="4"/>' +
        '<line x1="-22" y1="42" x2="22" y2="-2" stroke="#5a3818" stroke-width="4"/>' +
      '</g>' +
      // bar (front)
      '<g transform="translate(40, 240)">' +
        '<rect x="0" y="0" width="320" height="20" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="0" y="20" width="320" height="60" fill="#3a2010" stroke="#1a1008" stroke-width="1.5"/>' +
        // beer taps
        '<g transform="translate(120, -10)">' +
          '<rect x="0" y="0" width="8" height="20" fill="#3a3838"/>' +
          '<rect x="-4" y="-6" width="16" height="8" fill="#5a3818"/>' +
        '</g>' +
        '<g transform="translate(160, -10)">' +
          '<rect x="0" y="0" width="8" height="20" fill="#3a3838"/>' +
          '<rect x="-4" y="-6" width="16" height="8" fill="#7a3818"/>' +
        '</g>' +
        '<g transform="translate(200, -10)">' +
          '<rect x="0" y="0" width="8" height="20" fill="#3a3838"/>' +
          '<rect x="-4" y="-6" width="16" height="8" fill="#3a5828"/>' +
        '</g>' +
        // mug on bar
        '<rect x="20" y="-22" width="18" height="22" fill="#888" stroke="#3a2010" stroke-width="1.2"/>' +
        '<rect x="22" y="-22" width="14" height="6" fill="#f0e3bd"/>' +
        // smoked fish
        '<g transform="translate(260, -8)">' +
          '<ellipse cx="0" cy="0" rx="14" ry="4" fill="#7a5828" stroke="#3a1808" stroke-width="0.8"/>' +
          '<polygon points="14,-2 22,0 14,2" fill="#7a5828" stroke="#3a1808" stroke-width="0.8"/>' +
          '<circle cx="-10" cy="-1" r="1" fill="#fff"/>' +
          '<circle cx="-10" cy="-1" r="0.5" fill="#1a1008"/>' +
        '</g>' +
      '</g>' +
      // table (right)
      '<g transform="translate(520, 270)">' +
        '<rect x="0" y="0" width="100" height="10" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="6" y="10" width="8" height="50" fill="#3a2010"/>' +
        '<rect x="86" y="10" width="8" height="50" fill="#3a2010"/>' +
        '<rect x="40" y="-18" width="14" height="18" fill="#888" stroke="#3a2010" stroke-width="1"/>' +
      '</g>' +
      // map on wall (right back)
      '<g transform="translate(640, 100)">' +
        '<rect x="0" y="0" width="80" height="56" fill="#e8d5b5" stroke="#3a2010" stroke-width="1.5"/>' +
        '<polygon points="10,30 30,20 50,32 70,18 76,40 60,46 30,50 14,42" fill="none" stroke="#3a2010" stroke-width="0.7"/>' +
        '<circle cx="40" cy="34" r="2" fill="#aa2828"/>' +
        '<line x1="40" y1="34" x2="44" y2="38" stroke="#aa2828" stroke-width="0.6"/>' +
      '</g>' +
      // candle on bar
      '<g transform="translate(100, 230)">' +
        '<rect x="-2" y="0" width="4" height="14" fill="#f0e3bd"/>' +
        '<ellipse cx="0" cy="-4" rx="2" ry="5" fill="#ffcc55"/>' +
        '<circle cx="0" cy="-2" r="14" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
      // lantern hanging
      '<g transform="translate(640, 80)">' +
        '<line x1="0" y1="0" x2="0" y2="20" stroke="#1a0808" stroke-width="1"/>' +
        '<rect x="-8" y="20" width="16" height="20" fill="#5a3818" stroke="#1a0808" stroke-width="1"/>' +
        '<rect x="-6" y="22" width="12" height="14" fill="#ffcc55"/>' +
        '<circle cx="0" cy="32" r="36" fill="#ffaa33" opacity="0.18"/>' +
      '</g>' +
    '</svg>';
  },

  // ----- Mira\'s boat the Codex-Wake at sea -----
  codexWake() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="cw-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#5a78a8"/>' +
          '<stop offset="1" stop-color="#a8c4d8"/>' +
        '</linearGradient>' +
        '<linearGradient id="cw-sea" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#3a6878"/>' +
          '<stop offset="1" stop-color="#0a3848"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="180" fill="url(#cw-sky)"/>' +
      // distant island
      '<polygon points="80,170 130,140 180,170" fill="#3a4858" opacity="0.7"/>' +
      '<polygon points="600,170 660,130 720,170" fill="#3a4858" opacity="0.7"/>' +
      // sun behind clouds
      '<circle cx="650" cy="90" r="36" fill="#f0d27a" opacity="0.7"/>' +
      '<ellipse cx="640" cy="100" rx="50" ry="10" fill="#e0d8c0" opacity="0.8"/>' +
      '<ellipse cx="660" cy="80" rx="60" ry="8" fill="#e0d8c0" opacity="0.6"/>' +
      // sea
      '<rect y="180" width="800" height="180" fill="url(#cw-sea)"/>' +
      // big waves
      '<path d="M 0 200 Q 60 184 120 200 T 240 200 T 360 200 T 480 200 T 600 200 T 720 200 T 800 200" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>' +
      '<path d="M 0 220 Q 80 200 160 220 T 320 220 T 480 220 T 640 220 T 800 220" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>' +
      '<path d="M 0 248 Q 100 224 200 248 T 400 248 T 600 248 T 800 248" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>' +
      '<path d="M 0 280 Q 120 252 240 280 T 480 280 T 720 280 T 800 280" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.2"/>' +
      // the Codex-Wake ship centered
      '<g transform="translate(400, 220)">' +
        // hull
        '<path d="M -120 20 Q -100 56 0 60 Q 100 56 120 20 Q 80 24 0 24 Q -80 24 -120 20 Z" fill="#5a3818" stroke="#1a0808" stroke-width="2"/>' +
        '<rect x="-110" y="14" width="220" height="8" fill="#3a2010"/>' +
        '<rect x="-100" y="22" width="200" height="3" fill="#bfa050"/>' +
        // portholes
        '<circle cx="-60" cy="38" r="4" fill="#ffcc55" stroke="#1a0808" stroke-width="0.8"/>' +
        '<circle cx="-20" cy="38" r="4" fill="#ffcc55" stroke="#1a0808" stroke-width="0.8"/>' +
        '<circle cx="20" cy="38" r="4" fill="#ffcc55" stroke="#1a0808" stroke-width="0.8"/>' +
        '<circle cx="60" cy="38" r="4" fill="#ffcc55" stroke="#1a0808" stroke-width="0.8"/>' +
        // main mast
        '<line x1="0" y1="14" x2="0" y2="-130" stroke="#3a2010" stroke-width="4"/>' +
        // big sail (white with red codex sigil)
        '<polygon points="0,-130 0,0 80,0 70,-130" fill="#f0e3bd" stroke="#3a2010" stroke-width="1.5"/>' +
        '<text x="36" y="-60" text-anchor="middle" fill="#cc4818" font-family="Cinzel" font-size="24">∞</text>' +
        // secondary sail
        '<polygon points="0,-130 0,-20 -60,-20 -54,-110" fill="#f0e3bd" stroke="#3a2010" stroke-width="1.5"/>' +
        // rigging
        '<line x1="0" y1="-120" x2="-110" y2="14" stroke="#3a2010" stroke-width="0.6"/>' +
        '<line x1="0" y1="-120" x2="110" y2="14" stroke="#3a2010" stroke-width="0.6"/>' +
        // flag at top
        '<polygon points="0,-130 24,-126 22,-118 0,-122" fill="#cc4818" stroke="#3a1010" stroke-width="0.6"/>' +
        // bow figurehead
        '<polygon points="-120,20 -132,16 -130,28 -120,30" fill="#bfa050" stroke="#1a0808" stroke-width="1"/>' +
        // person at the wheel
        '<g transform="translate(-40, -10)">' +
          '<ellipse cx="0" cy="0" rx="4" ry="6" fill="#3a2818"/>' +
          '<rect x="-3" y="6" width="6" height="14" fill="#1a2838"/>' +
        '</g>' +
        '<g transform="translate(40, -10)">' +
          '<ellipse cx="0" cy="0" rx="4" ry="6" fill="#2a1810"/>' +
          '<rect x="-3" y="6" width="6" height="14" fill="#5a3818"/>' +
        '</g>' +
      '</g>' +
      // foam at bow
      '<path d="M 280 240 Q 290 244 300 240 Q 310 244 320 240" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>' +
      // dolphins jumping
      '<path d="M 160 246 Q 168 234 180 240" fill="none" stroke="#3a4858" stroke-width="2"/>' +
      '<path d="M 580 252 Q 588 240 600 246" fill="none" stroke="#3a4858" stroke-width="2"/>' +
      // sea birds
      '<path d="M 100 100 Q 108 92 116 100 Q 108 96 100 100" fill="#fff" stroke="#3a2010" stroke-width="0.4"/>' +
      '<path d="M 720 110 Q 728 102 736 110 Q 728 106 720 110" fill="#fff" stroke="#3a2010" stroke-width="0.4"/>' +
      '<path d="M 240 130 Q 248 122 256 130 Q 248 126 240 130" fill="#fff" stroke="#3a2010" stroke-width="0.4"/>' +
    '</svg>';
  },

  // ----- Isle of Halves -----
  isleHalves() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="ih-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#5a4878"/>' +
          '<stop offset="1" stop-color="#a8a4c8"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="200" fill="url(#ih-sky)"/>' +
      // sea
      '<rect y="200" width="800" height="60" fill="#3a5878"/>' +
      // The island, literally cut in half
      '<g>' +
        // left half
        '<polygon points="50,260 220,260 240,200 200,160 100,170 60,210" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
        '<polygon points="100,170 200,160 240,200 220,260 230,260 250,200 200,150 90,160 50,210 60,210" fill="#7a6038" opacity="0.5"/>' +
        // grass on top
        '<path d="M 100 170 Q 150 162 200 160" stroke="#3a7858" stroke-width="3" fill="none"/>' +
        // right half — visibly separated
        '<polygon points="320,260 490,260 510,200 470,160 370,170 330,210" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
        '<path d="M 370 170 Q 420 162 470 160" stroke="#3a7858" stroke-width="3" fill="none"/>' +
        // void/sea between
        '<rect x="240" y="160" width="80" height="100" fill="#3a5878"/>' +
        // moonlit ripple between
        '<path d="M 240 220 Q 260 216 280 220 T 320 220" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>' +
        // small tree on each half
        '<g transform="translate(150, 168)">' +
          '<rect x="-2" y="-22" width="4" height="22" fill="#3a2010"/>' +
          '<ellipse cx="0" cy="-26" rx="14" ry="12" fill="#3a5828"/>' +
        '</g>' +
        '<g transform="translate(420, 168)">' +
          '<rect x="-2" y="-22" width="4" height="22" fill="#3a2010"/>' +
          '<ellipse cx="0" cy="-26" rx="14" ry="12" fill="#3a5828"/>' +
        '</g>' +
        // a half-house on each
        '<g transform="translate(180, 220)">' +
          '<rect x="0" y="0" width="20" height="20" fill="#7a5828" stroke="#1a0808" stroke-width="1"/>' +
          '<polygon points="-2,2 10,-10 20,2" fill="#5a3818"/>' +
        '</g>' +
        '<g transform="translate(380, 220)">' +
          '<rect x="0" y="0" width="20" height="20" fill="#7a5828" stroke="#1a0808" stroke-width="1"/>' +
          '<polygon points="-2,2 10,-10 20,2" fill="#5a3818"/>' +
        '</g>' +
      '</g>' +
      // distant: the right side of the island floats slightly
      '<g transform="translate(540, 80)">' +
        '<polygon points="0,180 200,180 220,120 180,80 80,90 10,130" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
        '<text x="120" y="170" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="20" opacity="0.4">1/2</text>' +
      '</g>' +
      // half-moon
      '<g transform="translate(140, 70)">' +
        '<circle r="22" fill="#f0d27a"/>' +
        '<path d="M 0 -22 A 22 22 0 0 0 0 22 Z" fill="#5a4878"/>' +
      '</g>' +
      // a giant "1/2" graffiti carved on the cliff face
      '<text x="700" y="170" fill="#d4a624" font-family="Cinzel" font-size="38" opacity="0.5">1/2</text>' +
      // foreground: cracked stone path
      '<rect y="260" width="800" height="100" fill="#3a2818"/>' +
      '<line x1="40" y1="300" x2="760" y2="300" stroke="#5a4828" stroke-width="2" stroke-dasharray="20 10"/>' +
    '</svg>';
  },

  // ----- Isle of Thirds -----
  isleThirds() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="it-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#3a5878"/>' +
          '<stop offset="0.6" stop-color="#7a8898"/>' +
          '<stop offset="1" stop-color="#cca878"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="220" fill="url(#it-sky)"/>' +
      '<rect y="220" width="800" height="40" fill="#3a5878"/>' +
      // three-faceted island (a sphere split into thirds rotating slightly different shades)
      '<g transform="translate(400, 200)">' +
        // back third
        '<path d="M -120 0 Q -120 -120 -40 -120 L -40 60 Q -120 60 -120 0 Z" fill="#5a4878" stroke="#1a0838" stroke-width="2"/>' +
        // middle third
        '<path d="M -40 -120 L 40 -120 Q 40 60 -40 60 Z" fill="#7a6878" stroke="#1a0838" stroke-width="2"/>' +
        // front third (slightly forward)
        '<path d="M 40 -120 L 120 -120 Q 120 60 40 60 Z" fill="#5a4878" stroke="#1a0838" stroke-width="2"/>' +
        // glowing seams
        '<line x1="-40" y1="-120" x2="-40" y2="60" stroke="#d4a624" stroke-width="1.5" opacity="0.7"/>' +
        '<line x1="40" y1="-120" x2="40" y2="60" stroke="#d4a624" stroke-width="1.5" opacity="0.7"/>' +
        // floating cube glyphs
        '<text x="-80" y="-30" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="20">1/3</text>' +
        '<text x="0" y="-30" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="20">1/3</text>' +
        '<text x="80" y="-30" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="20">1/3</text>' +
        // mini towers, one per third
        '<g transform="translate(-80, -80)">' +
          '<rect x="-4" y="0" width="8" height="20" fill="#3a2010"/>' +
          '<polygon points="-6,0 8,0 0,-12" fill="#5a3818"/>' +
        '</g>' +
        '<g transform="translate(0, -80)">' +
          '<rect x="-4" y="0" width="8" height="20" fill="#3a2010"/>' +
          '<polygon points="-6,0 8,0 0,-12" fill="#5a3818"/>' +
        '</g>' +
        '<g transform="translate(80, -80)">' +
          '<rect x="-4" y="0" width="8" height="20" fill="#3a2010"/>' +
          '<polygon points="-6,0 8,0 0,-12" fill="#5a3818"/>' +
        '</g>' +
      '</g>' +
      // floating fractured pieces overhead
      '<polygon points="80,80 110,70 124,90 96,98" fill="#7a6878" stroke="#1a0838" stroke-width="1"/>' +
      '<polygon points="650,60 680,52 694,70 666,76" fill="#7a6878" stroke="#1a0838" stroke-width="1"/>' +
      '<polygon points="50,140 78,134 88,150 60,156" fill="#5a4878" stroke="#1a0838" stroke-width="1"/>' +
      '<polygon points="700,150 730,144 740,160 712,166" fill="#5a4878" stroke="#1a0838" stroke-width="1"/>' +
      // beach
      '<rect y="260" width="800" height="100" fill="#cca878"/>' +
      // distant boat
      '<g transform="translate(700, 245)" opacity="0.7">' +
        '<polygon points="-12,0 12,0 16,5 -16,5" fill="#3a2010"/>' +
        '<line x1="0" y1="0" x2="0" y2="-14" stroke="#3a2010" stroke-width="1.2"/>' +
        '<polygon points="0,-14 0,-2 10,-2 8,-12" fill="#f0e3bd"/>' +
      '</g>' +
    '</svg>';
  },

  // ----- Isle of Pieces -----
  islePieces() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="ip-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#1a3848"/>' +
          '<stop offset="1" stop-color="#5a6878"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="240" fill="url(#ip-sky)"/>' +
      // stormy sea
      '<rect y="240" width="800" height="120" fill="#1a3848"/>' +
      '<path d="M 0 252 Q 80 240 160 252 T 320 252 T 480 252 T 640 252 T 800 252" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none"/>' +
      '<path d="M 0 274 Q 100 260 200 274 T 400 274 T 600 274 T 800 274" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="none"/>' +
      // the shattered island — many pieces floating in mid-air
      '<g>' +
        // large central platform
        '<polygon points="320,220 480,220 500,260 300,260" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
        '<polygon points="320,220 480,220 470,230 330,230" fill="#7a6038" opacity="0.7"/>' +
        // tower stump on central platform
        '<rect x="380" y="180" width="40" height="40" fill="#3a2010" stroke="#1a0808" stroke-width="1.5"/>' +
        '<polygon points="372,180 428,180 400,150" fill="#5a3018" stroke="#1a0808" stroke-width="1.5"/>' +
        // floating chunks around it
        '<polygon points="160,200 220,194 246,222 218,238 174,232" fill="#5a4828" stroke="#1a0808" stroke-width="1.5"/>' +
        '<polygon points="556,194 612,200 626,224 590,236 550,224" fill="#5a4828" stroke="#1a0808" stroke-width="1.5"/>' +
        '<polygon points="100,150 144,144 158,166 130,176" fill="#5a4828" stroke="#1a0808" stroke-width="1.2"/>' +
        '<polygon points="640,130 680,124 694,148 668,158" fill="#5a4828" stroke="#1a0808" stroke-width="1.2"/>' +
        '<polygon points="280,140 320,134 336,156 304,164" fill="#5a4828" stroke="#1a0808" stroke-width="1.2"/>' +
        '<polygon points="460,128 504,122 522,144 484,156" fill="#5a4828" stroke="#1a0808" stroke-width="1.2"/>' +
        '<polygon points="60,250 92,246 102,266 76,272" fill="#5a4828" stroke="#1a0808" stroke-width="1"/>' +
        '<polygon points="700,255 730,250 738,268 716,272" fill="#5a4828" stroke="#1a0808" stroke-width="1"/>' +
        // glow lines between pieces (a torn chain)
        '<line x1="246" y1="216" x2="320" y2="220" stroke="#cc4878" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.7"/>' +
        '<line x1="480" y1="220" x2="556" y2="216" stroke="#cc4878" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.7"/>' +
        '<line x1="158" y1="160" x2="280" y2="148" stroke="#cc4878" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/>' +
        '<line x1="520" y1="140" x2="640" y2="138" stroke="#cc4878" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/>' +
      '</g>' +
      // floating fragments tiny
      '<polygon points="38,60 50,56 56,68 42,72" fill="#5a4828" opacity="0.6"/>' +
      '<polygon points="740,80 752,76 758,88 744,92" fill="#5a4828" opacity="0.6"/>' +
      '<polygon points="200,40 210,38 215,46 204,48" fill="#5a4828" opacity="0.5"/>' +
      // distant lightning
      '<polyline points="600,40 612,72 600,72 614,100" stroke="#f0d27a" stroke-width="1.5" fill="none" opacity="0.7"/>' +
      // glowing rune on central tower
      '<text x="400" y="208" text-anchor="middle" fill="#cc4878" font-family="Cinzel" font-size="16">∞</text>' +
    '</svg>';
  },

  // ----- Sunken Reef boss arena -----
  sunkenReef() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<radialGradient id="sr-light" cx="0.5" cy="0.4" r="0.7">' +
          '<stop offset="0" stop-color="#a8d8e0" stop-opacity="0.45"/>' +
          '<stop offset="1" stop-color="#1a3848" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="sr-water" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#2a5878"/>' +
          '<stop offset="1" stop-color="#0a2838"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="360" fill="url(#sr-water)"/>' +
      // sun rays from above
      '<rect width="800" height="360" fill="url(#sr-light)"/>' +
      '<g opacity="0.45">' +
        '<polygon points="100,0 140,360 80,360" fill="rgba(255,255,255,0.18)"/>' +
        '<polygon points="280,0 320,360 260,360" fill="rgba(255,255,255,0.18)"/>' +
        '<polygon points="500,0 540,360 480,360" fill="rgba(255,255,255,0.18)"/>' +
        '<polygon points="680,0 720,360 660,360" fill="rgba(255,255,255,0.18)"/>' +
      '</g>' +
      // reef floor with crannies
      '<polygon points="0,260 800,260 760,360 40,360" fill="#1a2838"/>' +
      // coral pillars
      '<g transform="translate(120, 200)">' +
        '<polygon points="0,60 -8,40 -4,20 -10,0 -4,-20 0,-30 4,-20 -2,0 4,20 8,40 0,60" fill="#cc4878" stroke="#5a1838" stroke-width="1.5"/>' +
        '<circle cx="-4" cy="-10" r="3" fill="#f08888"/>' +
        '<circle cx="4" cy="10" r="3" fill="#f08888"/>' +
      '</g>' +
      '<g transform="translate(680, 200)">' +
        '<polygon points="0,60 -8,40 -4,20 -10,0 -4,-20 0,-30 4,-20 -2,0 4,20 8,40 0,60" fill="#cc4878" stroke="#5a1838" stroke-width="1.5"/>' +
        '<circle cx="-4" cy="-10" r="3" fill="#f08888"/>' +
        '<circle cx="4" cy="10" r="3" fill="#f08888"/>' +
      '</g>' +
      '<g transform="translate(220, 230)">' +
        '<polygon points="0,40 -6,20 -2,0 -8,-10 0,-22 6,-10 0,0 6,20 0,40" fill="#a8c47a" stroke="#3a5818" stroke-width="1"/>' +
      '</g>' +
      '<g transform="translate(580, 230)">' +
        '<polygon points="0,40 -6,20 -2,0 -8,-10 0,-22 6,-10 0,0 6,20 0,40" fill="#a8c47a" stroke="#3a5818" stroke-width="1"/>' +
      '</g>' +
      // sunken ruined arch (back center)
      '<g transform="translate(400, 200)">' +
        '<path d="M -100 60 L -100 -20 Q -100 -60 0 -60 Q 100 -60 100 -20 L 100 60 Z" fill="#3a4858" stroke="#1a2838" stroke-width="2"/>' +
        '<path d="M -90 60 L -90 -20 Q -90 -54 0 -54 Q 90 -54 90 -20 L 90 60 Z" fill="#1a2838"/>' +
        // throne for the Half-King
        '<rect x="-30" y="20" width="60" height="40" fill="#5a4878" stroke="#1a0838" stroke-width="2"/>' +
        '<polygon points="-30,20 30,20 24,8 -24,8" fill="#7a5878"/>' +
        '<rect x="-32" y="60" width="64" height="6" fill="#3a1838"/>' +
        // glowing seams on throne
        '<line x1="0" y1="20" x2="0" y2="58" stroke="#cc4878" stroke-width="1.2" opacity="0.7"/>' +
      '</g>' +
      // skeleton of a ship sunk in foreground
      '<g transform="translate(420, 310)">' +
        '<path d="M -80 0 Q -60 16 0 18 Q 60 16 80 0 Q 50 4 0 4 Q -50 4 -80 0 Z" fill="#3a2010" stroke="#1a0808" stroke-width="1.5"/>' +
        '<line x1="0" y1="4" x2="0" y2="-30" stroke="#3a2010" stroke-width="2.5"/>' +
        // bone-like ribs
        '<g stroke="#5a4838" stroke-width="1" fill="none">' +
          '<path d="M -50 4 Q -40 -12 -36 4"/>' +
          '<path d="M -20 4 Q -10 -16 -6 4"/>' +
          '<path d="M 14 4 Q 24 -16 28 4"/>' +
          '<path d="M 44 4 Q 54 -12 58 4"/>' +
        '</g>' +
      '</g>' +
      // bubbles
      '<circle cx="100" cy="100" r="2" fill="rgba(255,255,255,0.5)"/>' +
      '<circle cx="180" cy="60" r="3" fill="rgba(255,255,255,0.5)"/>' +
      '<circle cx="240" cy="120" r="2" fill="rgba(255,255,255,0.4)"/>' +
      '<circle cx="560" cy="80" r="3" fill="rgba(255,255,255,0.5)"/>' +
      '<circle cx="620" cy="140" r="2" fill="rgba(255,255,255,0.4)"/>' +
      '<circle cx="700" cy="50" r="2.5" fill="rgba(255,255,255,0.5)"/>' +
      // fish silhouettes
      '<path d="M 80 200 Q 100 196 120 200 Q 100 204 80 200 M 120 200 L 130 196 L 130 204 Z" fill="#3a4858" opacity="0.7"/>' +
      '<path d="M 660 240 Q 680 236 700 240 Q 680 244 660 240 M 700 240 L 710 236 L 710 244 Z" fill="#3a4858" opacity="0.7"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT II — ENEMY SPRITE additions (extend enemySprite logic)
  // --------------------------------------------------------
  _enemyAct2(spriteId) {
    if (spriteId === 'brine_sprite') {
      return (
        '<ellipse cx="100" cy="240" rx="40" ry="6" fill="rgba(0,0,0,0.5)"/>' +
        // body — translucent jellyfish-like
        '<ellipse cx="100" cy="120" rx="60" ry="50" fill="#88c4d8" opacity="0.85" stroke="#3a6878" stroke-width="2"/>' +
        '<ellipse cx="100" cy="100" rx="40" ry="20" fill="#a8d8e0" opacity="0.7"/>' +
        // inner glow
        '<circle cx="90" cy="100" r="6" fill="#fff" opacity="0.5"/>' +
        // eyes
        '<ellipse cx="84" cy="124" rx="3" ry="4" fill="#1a3848"/>' +
        '<ellipse cx="116" cy="124" rx="3" ry="4" fill="#1a3848"/>' +
        '<circle cx="84.5" cy="123" r="0.7" fill="#fff"/>' +
        '<circle cx="116.5" cy="123" r="0.7" fill="#fff"/>' +
        // tentacles
        '<g stroke="#3a6878" stroke-width="2.5" fill="none">' +
          '<path d="M 60 168 Q 50 200 58 230"/>' +
          '<path d="M 80 174 Q 70 210 80 240"/>' +
          '<path d="M 100 178 Q 100 220 100 240"/>' +
          '<path d="M 120 174 Q 130 210 120 240"/>' +
          '<path d="M 140 168 Q 150 200 142 230"/>' +
        '</g>' +
        // 1/2 mark on the bell
        '<text x="100" y="118" text-anchor="middle" fill="#3a6878" font-family="Cinzel" font-size="16">1/2</text>'
      );
    }
    if (spriteId === 'splitwhelk') {
      return (
        '<ellipse cx="100" cy="240" rx="55" ry="8" fill="rgba(0,0,0,0.5)"/>' +
        // shell — visible split down the middle
        '<g transform="translate(100, 150)">' +
          // left half
          '<path d="M 0 90 L 0 -30 Q -10 -70 -50 -50 Q -70 -10 -60 40 Q -50 80 0 90 Z" fill="#cc8848" stroke="#3a1810" stroke-width="2"/>' +
          // right half
          '<path d="M 0 90 L 0 -30 Q 10 -70 50 -50 Q 70 -10 60 40 Q 50 80 0 90 Z" fill="#cc8848" stroke="#3a1810" stroke-width="2"/>' +
          // spiral
          '<path d="M -50 -30 Q -30 -20 -20 -40 Q -10 -50 -20 -10" fill="none" stroke="#3a1810" stroke-width="1.5"/>' +
          '<path d="M 50 -30 Q 30 -20 20 -40 Q 10 -50 20 -10" fill="none" stroke="#3a1810" stroke-width="1.5"/>' +
          // central glow (the split)
          '<line x1="0" y1="-30" x2="0" y2="90" stroke="#f0d27a" stroke-width="2"/>' +
          // tiny body inside
          '<ellipse cx="0" cy="50" rx="14" ry="8" fill="#7a5828"/>' +
          '<ellipse cx="-4" cy="44" rx="1.5" ry="2" fill="#1a1008"/>' +
          '<ellipse cx="4" cy="44" rx="1.5" ry="2" fill="#1a1008"/>' +
          // mouth/tongue
          '<path d="M -8 56 Q 0 62 8 56" stroke="#3a2010" stroke-width="0.8" fill="none"/>' +
        '</g>'
      );
    }
    if (spriteId === 'tide_imp') {
      return (
        '<ellipse cx="100" cy="240" rx="40" ry="6" fill="rgba(0,0,0,0.55)"/>' +
        // body (small, eel-like)
        '<path d="M 60 220 Q 80 180 100 200 Q 120 220 140 180 Q 150 140 130 110 Q 100 80 80 100 Q 60 130 70 160" fill="#3a6878" stroke="#1a2838" stroke-width="2"/>' +
        // belly
        '<path d="M 80 100 Q 100 130 90 160 Q 80 190 100 200" fill="#88c4d8" opacity="0.7"/>' +
        // fins
        '<polygon points="62,160 50,156 56,176" fill="#88c4d8" stroke="#1a2838" stroke-width="1"/>' +
        '<polygon points="148,180 162,186 156,166" fill="#88c4d8" stroke="#1a2838" stroke-width="1"/>' +
        // head
        '<ellipse cx="80" cy="100" rx="18" ry="14" fill="#3a6878" stroke="#1a2838" stroke-width="2"/>' +
        // big eye
        '<ellipse cx="72" cy="98" rx="3" ry="4" fill="#f0d27a"/>' +
        '<ellipse cx="72" cy="98" rx="1.5" ry="2.5" fill="#1a2838"/>' +
        // sharp teeth
        '<polygon points="62,108 64,116 68,108" fill="#fff"/>' +
        '<polygon points="68,110 70,118 74,110" fill="#fff"/>' +
        '<polygon points="78,108 80,116 84,108" fill="#fff"/>' +
        // bubbles
        '<circle cx="50" cy="80" r="2" fill="rgba(255,255,255,0.5)"/>' +
        '<circle cx="160" cy="100" r="2.5" fill="rgba(255,255,255,0.5)"/>'
      );
    }
    if (spriteId === 'coral_golem') {
      return (
        '<ellipse cx="100" cy="240" rx="65" ry="8" fill="rgba(0,0,0,0.6)"/>' +
        // legs (coral pillars)
        '<polygon points="56,200 84,200 88,240 52,240" fill="#cc4878" stroke="#5a1838" stroke-width="2"/>' +
        '<polygon points="116,200 144,200 148,240 112,240" fill="#cc4878" stroke="#5a1838" stroke-width="2"/>' +
        // body
        '<polygon points="44,120 156,120 168,200 32,200" fill="#cc4878" stroke="#5a1838" stroke-width="2"/>' +
        '<polygon points="60,140 140,140 148,180 52,180" fill="#7a1838" opacity="0.5"/>' +
        // sea growth
        '<circle cx="60" cy="160" r="4" fill="#a8c47a"/>' +
        '<circle cx="140" cy="160" r="4" fill="#a8c47a"/>' +
        // arms
        '<polygon points="22,140 44,150 50,210 28,200" fill="#cc4878" stroke="#5a1838" stroke-width="2"/>' +
        '<polygon points="178,140 156,150 150,210 172,200" fill="#cc4878" stroke="#5a1838" stroke-width="2"/>' +
        // fists (heavy)
        '<rect x="14" y="200" width="34" height="22" fill="#a83878" stroke="#5a1838" stroke-width="2"/>' +
        '<rect x="152" y="200" width="34" height="22" fill="#a83878" stroke="#5a1838" stroke-width="2"/>' +
        // head (cube-coral)
        '<polygon points="74,68 126,68 134,116 66,116" fill="#cc4878" stroke="#5a1838" stroke-width="2"/>' +
        '<polygon points="74,68 126,68 122,76 78,76" fill="#a83878"/>' +
        // glowing eyes
        '<circle cx="86" cy="92" r="4" fill="#1a0808"/>' +
        '<circle cx="86" cy="92" r="2" fill="#f0d27a"/>' +
        '<circle cx="114" cy="92" r="4" fill="#1a0808"/>' +
        '<circle cx="114" cy="92" r="2" fill="#f0d27a"/>' +
        // jaw / fraction grin
        '<rect x="80" y="104" width="40" height="6" fill="#1a0808"/>' +
        '<line x1="92" y1="104" x2="92" y2="110" stroke="#5a4838" stroke-width="0.8"/>' +
        '<line x1="100" y1="104" x2="100" y2="110" stroke="#5a4838" stroke-width="0.8"/>' +
        '<line x1="108" y1="104" x2="108" y2="110" stroke="#5a4838" stroke-width="0.8"/>' +
        // glyph on chest
        '<text x="100" y="170" text-anchor="middle" fill="#f0d27a" font-family="Cinzel" font-size="16">⅔</text>' +
        // small bubbles
        '<circle cx="20" cy="80" r="2" fill="rgba(255,255,255,0.4)"/>' +
        '<circle cx="180" cy="70" r="2" fill="rgba(255,255,255,0.4)"/>'
      );
    }
    if (spriteId === 'halves_warden') {
      return (
        '<ellipse cx="100" cy="244" rx="80" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // body — half-stone, half-water
        '<g transform="translate(100, 130)">' +
          // left half (stone)
          '<path d="M 0 110 L -60 110 L -70 0 Q -70 -80 0 -80 Z" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
          // right half (water)
          '<path d="M 0 110 L 60 110 L 70 0 Q 70 -80 0 -80 Z" fill="#3a6878" stroke="#1a2838" stroke-width="2"/>' +
          // dividing seam
          '<line x1="0" y1="-80" x2="0" y2="110" stroke="#f0d27a" stroke-width="2"/>' +
          // chest mark
          '<text x="-20" y="20" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="20">1</text>' +
          '<line x1="-30" y1="28" x2="-12" y2="28" stroke="#d4a624" stroke-width="2"/>' +
          '<text x="-20" y="46" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="20">2</text>' +
          // crown on head — half iron, half coral
          '<polygon points="-30,-80 -30,-100 -20,-90 -10,-100 0,-90" fill="#888" stroke="#1a0808" stroke-width="1.5"/>' +
          '<polygon points="0,-90 10,-100 20,-90 30,-100 30,-80" fill="#cc4878" stroke="#5a1838" stroke-width="1.5"/>' +
        '</g>' +
        // big halberd (split haft)
        '<line x1="14" y1="50" x2="20" y2="220" stroke="#3a2010" stroke-width="5"/>' +
        '<polygon points="-10,50 24,40 36,80 6,90" fill="#888" stroke="#1a0808" stroke-width="1.5"/>' +
        '<polygon points="-10,50 24,40 14,30 -2,42" fill="#3a6878"/>'
      );
    }
    if (spriteId === 'thirds_seer') {
      return (
        '<ellipse cx="100" cy="244" rx="80" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // floating robed body
        '<g transform="translate(100, 130)">' +
          // robe with three folds
          '<path d="M -60 100 L -70 0 Q -70 -80 0 -80 Q 70 -80 70 0 L 60 100 Z" fill="#5a4878" stroke="#1a0838" stroke-width="2"/>' +
          '<path d="M -50 100 L -40 -20 L -20 100 Z" fill="#7a6898" opacity="0.6"/>' +
          '<path d="M -10 100 L 0 -30 L 10 100 Z" fill="#7a6898" opacity="0.6"/>' +
          '<path d="M 30 100 L 40 -20 L 50 100 Z" fill="#7a6898" opacity="0.6"/>' +
          // hood
          '<path d="M -40 -80 Q 0 -114 40 -80 L 40 -40 Q 0 -52 -40 -40 Z" fill="#3a1838" stroke="#1a0838" stroke-width="2"/>' +
          // three eyes glow inside hood
          '<circle cx="-14" cy="-58" r="2" fill="#cc4878"/>' +
          '<circle cx="0" cy="-62" r="2" fill="#cc4878"/>' +
          '<circle cx="14" cy="-58" r="2" fill="#cc4878"/>' +
          // hands holding a triangular sigil
          '<polygon points="-12,-10 12,-10 0,16" fill="none" stroke="#d4a624" stroke-width="2"/>' +
          '<text x="0" y="6" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="10">⅓</text>' +
        '</g>'
      );
    }
    if (spriteId === 'pieces_collector') {
      return (
        '<ellipse cx="100" cy="244" rx="85" ry="11" fill="rgba(0,0,0,0.6)"/>' +
        // body composed of mismatched pieces
        '<g transform="translate(100, 130)">' +
          '<polygon points="-40,80 -60,40 -50,0 -30,-30 0,-50 30,-30 50,-10 60,30 50,80" fill="#5a4828" stroke="#1a0808" stroke-width="2"/>' +
          // patchwork seams
          '<line x1="-30" y1="-30" x2="0" y2="-50" stroke="#f0d27a" stroke-width="1.5"/>' +
          '<line x1="0" y1="-50" x2="30" y2="-30" stroke="#f0d27a" stroke-width="1.5"/>' +
          '<line x1="-50" y1="0" x2="-30" y2="-30" stroke="#f0d27a" stroke-width="1.5"/>' +
          '<line x1="30" y1="-30" x2="50" y2="-10" stroke="#f0d27a" stroke-width="1.5"/>' +
          '<line x1="-40" y1="80" x2="-60" y2="40" stroke="#f0d27a" stroke-width="1"/>' +
          '<line x1="50" y1="80" x2="60" y2="30" stroke="#f0d27a" stroke-width="1"/>' +
          // glowing center
          '<circle cx="0" cy="0" r="14" fill="#cc4878" opacity="0.7"/>' +
          '<circle cx="0" cy="0" r="6" fill="#fff" opacity="0.8"/>' +
          // gathered fragments orbiting
          '<polygon points="-90,-20 -78,-26 -70,-12 -84,-6" fill="#5a4828" stroke="#1a0808" stroke-width="1"/>' +
          '<polygon points="80,-30 92,-36 98,-22 84,-14" fill="#5a4828" stroke="#1a0808" stroke-width="1"/>' +
          '<polygon points="100,40 112,34 118,48 104,56" fill="#5a4828" stroke="#1a0808" stroke-width="1"/>' +
          '<polygon points="-100,40 -88,34 -82,48 -96,56" fill="#5a4828" stroke="#1a0808" stroke-width="1"/>' +
        '</g>'
      );
    }
    if (spriteId === 'half_king') {
      return (
        '<defs>' +
          '<radialGradient id="hk-void" cx="0.5" cy="0.5" r="0.8">' +
            '<stop offset="0" stop-color="#cc4878"/>' +
            '<stop offset="0.5" stop-color="#5a1838"/>' +
            '<stop offset="1" stop-color="#0a0210"/>' +
          '</radialGradient>' +
          '<linearGradient id="hk-water" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#3a6878"/>' +
            '<stop offset="1" stop-color="#1a3848"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="244" rx="95" ry="14" fill="rgba(0,0,0,0.7)"/>' +
        // throne behind
        '<rect x="40" y="50" width="120" height="80" fill="#3a1838" stroke="#1a0828" stroke-width="2"/>' +
        '<polygon points="20,46 180,46 174,50 26,50" fill="#5a2858"/>' +
        // King — torso emerging from water
        '<g transform="translate(100, 130)">' +
          // crown (jagged, multiple peaks)
          '<polygon points="-50,-30 -40,-66 -28,-44 -18,-72 -10,-44 0,-78 10,-44 18,-72 28,-44 40,-66 50,-30" fill="#d4a624" stroke="#3a2010" stroke-width="1.5"/>' +
          '<polygon points="-40,-50 -28,-50 -34,-58" fill="#cc4818"/>' +
          '<polygon points="-10,-58 10,-58 0,-66" fill="#cc4818"/>' +
          '<polygon points="28,-50 40,-50 34,-58" fill="#cc4818"/>' +
          // head (cracked stone left, water-flow right)
          '<path d="M 0 0 L -50 0 L -50 -34 Q -40 -50 0 -50 Z" fill="url(#hk-void)" stroke="#1a0808" stroke-width="2"/>' +
          '<path d="M 0 0 L 50 0 L 50 -34 Q 40 -50 0 -50 Z" fill="url(#hk-water)" stroke="#1a2838" stroke-width="2"/>' +
          '<line x1="0" y1="-50" x2="0" y2="0" stroke="#f0d27a" stroke-width="2"/>' +
          // eyes (left burning red, right deep blue)
          '<circle cx="-24" cy="-22" r="4" fill="#1a0808"/>' +
          '<circle cx="-24" cy="-22" r="2" fill="#cc4818"/>' +
          '<circle cx="24" cy="-22" r="4" fill="#1a2838"/>' +
          '<circle cx="24" cy="-22" r="2" fill="#a8d8e0"/>' +
          // mouth — a yawning slash
          '<path d="M -20 -8 L 20 -8 L 16 -2 L -16 -2 Z" fill="#1a0808"/>' +
          '<line x1="-12" y1="-8" x2="-12" y2="-2" stroke="#5a4838" stroke-width="0.6"/>' +
          '<line x1="0" y1="-8" x2="0" y2="-2" stroke="#5a4838" stroke-width="0.6"/>' +
          '<line x1="12" y1="-8" x2="12" y2="-2" stroke="#5a4838" stroke-width="0.6"/>' +
          // shoulders / robes flowing into water
          '<path d="M -50 0 Q -70 50 -60 100 L 60 100 Q 70 50 50 0 Z" fill="#5a2858" stroke="#1a0838" stroke-width="2"/>' +
          '<path d="M -50 0 Q -40 30 -20 40 L 20 40 Q 40 30 50 0" fill="#3a1838"/>' +
          // chest — fraction sigil
          '<polygon points="-16,30 16,30 12,38 -12,38" fill="#cc4878" stroke="#5a1838" stroke-width="1.5"/>' +
          '<text x="0" y="36" text-anchor="middle" fill="#fff" font-family="Cinzel" font-size="10">½</text>' +
        '</g>' +
        // tentacle/wave arm rising
        '<path d="M 20 230 Q 0 200 20 180 Q 50 200 40 240" fill="#3a6878" opacity="0.85" stroke="#1a2838" stroke-width="1.5"/>' +
        '<path d="M 180 230 Q 200 200 180 180 Q 150 200 160 240" fill="#5a2858" opacity="0.85" stroke="#1a0838" stroke-width="1.5"/>' +
        // water at base
        '<rect x="0" y="222" width="200" height="14" fill="url(#hk-water)" opacity="0.7"/>' +
        '<path d="M 0 224 Q 50 220 100 224 T 200 224" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none"/>'
      );
    }
    return null;
  },

  // --------------------------------------------------------
  // ACT III — NPC PORTRAITS
  // --------------------------------------------------------
  serjeant_vol(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="vol-bg"><stop offset="0" stop-color="#5a4838"/><stop offset="1" stop-color="#2a1810"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#vol-bg)"/>' +
      // helmet
      '<path d="M 28 44 Q 50 18 72 44 L 72 50 L 28 50 Z" fill="#6a6058" stroke="#1a1008" stroke-width="2"/>' +
      '<rect x="26" y="44" width="48" height="6" fill="#4a4038" stroke="#1a1008" stroke-width="1"/>' +
      '<polygon points="48,20 52,20 50,12" fill="#aa3838"/>' +
      // face
      '<ellipse cx="50" cy="58" rx="16" ry="17" fill="#cc9a70" stroke="#3a2010" stroke-width="0.8"/>' +
      // ears
      '<ellipse cx="34" cy="58" rx="3" ry="4" fill="#cc9a70"/>' +
      '<ellipse cx="66" cy="58" rx="3" ry="4" fill="#cc9a70"/>' +
      // scar
      '<line x1="60" y1="50" x2="64" y2="66" stroke="#a86850" stroke-width="1.2"/>' +
      // eyes (hard stare)
      '<ellipse cx="44" cy="56" rx="1.6" ry="2" fill="#1a1008"/>' +
      '<ellipse cx="56" cy="56" rx="1.6" ry="2" fill="#1a1008"/>' +
      '<line x1="39" y1="52" x2="48" y2="53" stroke="#3a2010" stroke-width="1.6"/>' +
      '<line x1="52" y1="53" x2="61" y2="52" stroke="#3a2010" stroke-width="1.6"/>' +
      // stern mouth + stubble
      '<path d="M 44 68 L 56 68" stroke="#3a2010" stroke-width="1.4"/>' +
      '<path d="M 40 64 Q 50 74 60 64" fill="none" stroke="#5a4838" stroke-width="0.5" opacity="0.6"/>' +
      // gorget
      '<path d="M 30 80 Q 50 90 70 80 L 74 96 L 26 96 Z" fill="#4a4038" stroke="#1a1008" stroke-width="1"/>' +
      '<circle cx="50" cy="84" r="2.5" fill="#d4a624"/>' +
    '</svg>';
  },

  tinker_pell(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="pell-bg"><stop offset="0" stop-color="#3a5868"/><stop offset="1" stop-color="#1a2838"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#pell-bg)"/>' +
      // wild hair
      '<path d="M 28 44 Q 30 20 50 22 Q 70 20 72 44 Q 64 36 50 38 Q 36 36 28 44 Z" fill="#a89878"/>' +
      '<path d="M 26 40 L 20 34 M 74 40 L 80 34 M 30 30 L 28 22 M 70 30 L 72 22" stroke="#a89878" stroke-width="2"/>' +
      // face
      '<ellipse cx="50" cy="54" rx="16" ry="17" fill="#e0b888" stroke="#3a2010" stroke-width="0.8"/>' +
      '<ellipse cx="34" cy="54" rx="3" ry="4" fill="#e0b888"/>' +
      '<ellipse cx="66" cy="54" rx="3" ry="4" fill="#e0b888"/>' +
      // goggles pushed up on forehead
      '<circle cx="42" cy="42" r="6" fill="#2a3848" stroke="#bfa050" stroke-width="2"/>' +
      '<circle cx="58" cy="42" r="6" fill="#2a3848" stroke="#bfa050" stroke-width="2"/>' +
      '<circle cx="42" cy="42" r="2.5" fill="#88c4d8"/>' +
      '<circle cx="58" cy="42" r="2.5" fill="#88c4d8"/>' +
      '<line x1="48" y1="42" x2="52" y2="42" stroke="#bfa050" stroke-width="1.5"/>' +
      // bright eyes
      '<ellipse cx="44" cy="56" rx="2" ry="2.4" fill="#1a1008"/>' +
      '<ellipse cx="56" cy="56" rx="2" ry="2.4" fill="#1a1008"/>' +
      '<circle cx="44.6" cy="55.2" r="0.7" fill="#fff"/>' +
      '<circle cx="56.6" cy="55.2" r="0.7" fill="#fff"/>' +
      // grin
      '<path d="M 42 64 Q 50 70 58 64" stroke="#3a2010" stroke-width="1.2" fill="none"/>' +
      // collar + tools
      '<path d="M 30 80 Q 50 90 70 80 L 74 96 L 26 96 Z" fill="#5a4828" stroke="#1a1008" stroke-width="1"/>' +
      '<rect x="40" y="80" width="3" height="12" fill="#888"/>' +
      '<rect x="56" y="80" width="3" height="12" fill="#bfa050"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT III — ENEMY SPRITES
  // --------------------------------------------------------
  _enemyAct3(spriteId) {
    if (spriteId === 'cog_sprite') {
      return (
        '<ellipse cx="100" cy="238" rx="34" ry="6" fill="rgba(0,0,0,0.45)"/>' +
        // floating gear body
        '<g transform="translate(100,140)">' +
        '<circle r="40" fill="#7a6048" stroke="#2a1810" stroke-width="2"/>' +
        (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180;const x=Math.cos(a)*46,y=Math.sin(a)*46;s+='<rect x="'+(x-5)+'" y="'+(y-5)+'" width="10" height="10" fill="#7a6048" stroke="#2a1810" stroke-width="1" transform="rotate('+(i*45)+' '+x+' '+y+')"/>';} return s; })() +
        '<circle r="26" fill="#9a7a52"/>' +
        // single glowing eye
        '<circle r="11" fill="#1a1008"/>' +
        '<circle r="6" fill="#f0a838"/>' +
        '<circle r="2.5" cy="-1" fill="#fff"/>' +
        '</g>' +
        // little arms
        '<line x1="64" y1="150" x2="48" y2="170" stroke="#5a4838" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="136" y1="150" x2="152" y2="170" stroke="#5a4838" stroke-width="4" stroke-linecap="round"/>' +
        // sparks
        '<circle cx="60" cy="120" r="1.5" fill="#f0d27a"/>' +
        '<circle cx="146" cy="128" r="1.5" fill="#f0a838"/>'
      );
    }
    if (spriteId === 'bolt_hound') {
      return (
        '<ellipse cx="100" cy="240" rx="70" ry="8" fill="rgba(0,0,0,0.5)"/>' +
        // body
        '<rect x="58" y="150" width="84" height="40" rx="8" fill="#6a6058" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="64" y="156" width="72" height="10" fill="#8a8078"/>' +
        // plates
        '<line x1="84" y1="150" x2="84" y2="190" stroke="#2a1810" stroke-width="1"/>' +
        '<line x1="108" y1="150" x2="108" y2="190" stroke="#2a1810" stroke-width="1"/>' +
        // head
        '<polygon points="142,156 178,148 180,178 144,184" fill="#7a6858" stroke="#1a1008" stroke-width="2"/>' +
        // jaw
        '<polygon points="160,176 182,176 178,186 162,186" fill="#5a4838" stroke="#1a1008" stroke-width="1"/>' +
        '<line x1="164" y1="176" x2="164" y2="186" stroke="#2a1810" stroke-width="0.8"/>' +
        '<line x1="172" y1="176" x2="172" y2="186" stroke="#2a1810" stroke-width="0.8"/>' +
        // eye
        '<circle cx="160" cy="162" r="4" fill="#1a1008"/>' +
        '<circle cx="160" cy="162" r="2" fill="#cc3030"/>' +
        // ear antenna
        '<line x1="150" y1="148" x2="146" y2="134" stroke="#2a1810" stroke-width="2"/>' +
        '<circle cx="146" cy="132" r="2.5" fill="#f0a838"/>' +
        // legs (piston)
        '<rect x="66" y="190" width="8" height="44" fill="#4a4038" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="90" y="190" width="8" height="44" fill="#4a4038" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="114" y="190" width="8" height="44" fill="#4a4038" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="130" y="190" width="8" height="44" fill="#4a4038" stroke="#1a1008" stroke-width="1"/>' +
        // tail
        '<line x1="58" y1="160" x2="34" y2="150" stroke="#5a4838" stroke-width="5" stroke-linecap="round"/>' +
        '<polygon points="34,150 26,144 30,156" fill="#7a6858"/>'
      );
    }
    if (spriteId === 'slag_crawler') {
      return (
        '<ellipse cx="100" cy="240" rx="80" ry="9" fill="rgba(0,0,0,0.55)"/>' +
        // molten segmented body
        '<ellipse cx="48" cy="205" rx="22" ry="16" fill="#5a3018" stroke="#1a0808" stroke-width="2"/>' +
        '<ellipse cx="84" cy="205" rx="24" ry="18" fill="#6a3818" stroke="#1a0808" stroke-width="2"/>' +
        '<ellipse cx="120" cy="205" rx="22" ry="16" fill="#5a3018" stroke="#1a0808" stroke-width="2"/>' +
        '<ellipse cx="150" cy="206" rx="18" ry="13" fill="#4a2810" stroke="#1a0808" stroke-width="1.5"/>' +
        // molten cracks (glowing)
        '<path d="M 38 200 Q 48 196 58 202" stroke="#f0a838" stroke-width="2" fill="none"/>' +
        '<path d="M 74 198 Q 84 194 96 200" stroke="#f0d27a" stroke-width="2.5" fill="none"/>' +
        '<path d="M 112 200 Q 120 196 130 202" stroke="#f0a838" stroke-width="2" fill="none"/>' +
        // head
        '<polygon points="20,200 36,186 50,192 48,216 34,222" fill="#7a4818" stroke="#1a0808" stroke-width="2"/>' +
        '<circle cx="32" cy="198" r="3" fill="#1a0808"/>' +
        '<circle cx="32" cy="198" r="1.5" fill="#f0d27a"/>' +
        // mandibles
        '<polygon points="20,202 12,200 20,208" fill="#3a2010"/>' +
        '<polygon points="20,210 12,212 22,214" fill="#3a2010"/>' +
        // back spines
        '<polygon points="78,187 86,174 94,187" fill="#3a2010"/>' +
        '<polygon points="112,189 120,178 128,189" fill="#3a2010"/>' +
        // legs
        '<g stroke="#2a1810" stroke-width="2.5">' +
        '<line x1="60" y1="218" x2="56" y2="232"/><line x1="84" y1="220" x2="84" y2="234"/><line x1="108" y1="218" x2="112" y2="232"/><line x1="132" y1="218" x2="136" y2="230"/>' +
        '</g>'
      );
    }
    if (spriteId === 'forge_sentinel') {
      return (
        '<ellipse cx="100" cy="242" rx="60" ry="8" fill="rgba(0,0,0,0.55)"/>' +
        // legs
        '<rect x="74" y="196" width="20" height="44" fill="#4a4038" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="106" y="196" width="20" height="44" fill="#4a4038" stroke="#1a1008" stroke-width="2"/>' +
        // torso (riveted plate)
        '<rect x="60" y="120" width="80" height="80" rx="6" fill="#6a6058" stroke="#1a1008" stroke-width="2.5"/>' +
        '<rect x="68" y="128" width="64" height="16" fill="#8a8078"/>' +
        // rivets
        '<circle cx="66" cy="126" r="2" fill="#3a3028"/><circle cx="134" cy="126" r="2" fill="#3a3028"/><circle cx="66" cy="194" r="2" fill="#3a3028"/><circle cx="134" cy="194" r="2" fill="#3a3028"/>' +
        // furnace chest (glowing grate)
        '<rect x="84" y="150" width="32" height="34" fill="#1a0808" stroke="#2a1810" stroke-width="1.5"/>' +
        '<rect x="88" y="154" width="24" height="26" fill="#cc4818"/>' +
        '<line x1="88" y1="162" x2="112" y2="162" stroke="#1a0808" stroke-width="1.5"/>' +
        '<line x1="88" y1="170" x2="112" y2="170" stroke="#1a0808" stroke-width="1.5"/>' +
        // arms with hammer
        '<rect x="40" y="128" width="20" height="60" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="140" y="128" width="20" height="50" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="150" y="100" width="22" height="16" fill="#3a3838" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="158" y="116" width="6" height="64" fill="#3a2010"/>' +
        // head
        '<rect x="80" y="90" width="40" height="34" rx="4" fill="#7a6858" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="86" y="102" width="28" height="6" fill="#1a0808"/>' +
        '<rect x="90" y="103" width="6" height="4" fill="#f0a838"/>' +
        '<rect x="104" y="103" width="6" height="4" fill="#f0a838"/>' +
        // chimney
        '<rect x="94" y="80" width="12" height="12" fill="#3a2818"/>' +
        '<ellipse cx="100" cy="78" rx="6" ry="3" fill="rgba(120,120,120,0.5)"/>'
      );
    }
    if (spriteId === 'quartermaster_construct') {
      return (
        '<ellipse cx="100" cy="244" rx="78" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // tall ledger-body
        '<rect x="64" y="120" width="72" height="100" rx="4" fill="#5a4838" stroke="#1a1008" stroke-width="2.5"/>' +
        // open ledger chest
        '<rect x="74" y="140" width="52" height="40" fill="#f0e3bd" stroke="#3a2010" stroke-width="1.5"/>' +
        '<line x1="100" y1="140" x2="100" y2="180" stroke="#aa8838" stroke-width="1"/>' +
        '<line x1="80" y1="150" x2="96" y2="150" stroke="#3a2010" stroke-width="0.6"/>' +
        '<line x1="80" y1="158" x2="96" y2="158" stroke="#3a2010" stroke-width="0.6"/>' +
        '<line x1="104" y1="150" x2="120" y2="150" stroke="#3a2010" stroke-width="0.6"/>' +
        '<text x="112" y="172" text-anchor="middle" fill="#5a1818" font-family="Cinzel" font-size="9">÷</text>' +
        // abacus arms
        '<rect x="34" y="130" width="30" height="70" rx="3" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<line x1="38" y1="142" x2="60" y2="142" stroke="#5a4838" stroke-width="1"/>' +
        '<line x1="38" y1="156" x2="60" y2="156" stroke="#5a4838" stroke-width="1"/>' +
        '<line x1="38" y1="170" x2="60" y2="170" stroke="#5a4838" stroke-width="1"/>' +
        '<line x1="38" y1="184" x2="60" y2="184" stroke="#5a4838" stroke-width="1"/>' +
        '<circle cx="44" cy="142" r="2.5" fill="#d4a624"/><circle cx="52" cy="142" r="2.5" fill="#d4a624"/>' +
        '<circle cx="44" cy="156" r="2.5" fill="#bfa050"/><circle cx="56" cy="156" r="2.5" fill="#bfa050"/>' +
        '<circle cx="48" cy="170" r="2.5" fill="#d4a624"/>' +
        '<circle cx="44" cy="184" r="2.5" fill="#bfa050"/><circle cx="52" cy="184" r="2.5" fill="#bfa050"/><circle cx="60" cy="184" r="2.5" fill="#bfa050"/>' +
        '<rect x="136" y="130" width="30" height="70" rx="3" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<line x1="140" y1="142" x2="162" y2="142" stroke="#5a4838" stroke-width="1"/>' +
        '<line x1="140" y1="156" x2="162" y2="156" stroke="#5a4838" stroke-width="1"/>' +
        '<line x1="140" y1="170" x2="162" y2="170" stroke="#5a4838" stroke-width="1"/>' +
        '<circle cx="146" cy="142" r="2.5" fill="#d4a624"/><circle cx="154" cy="156" r="2.5" fill="#bfa050"/><circle cx="150" cy="170" r="2.5" fill="#d4a624"/>' +
        // head — narrow with visor
        '<rect x="82" y="84" width="36" height="40" rx="3" fill="#6a6058" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="86" y="98" width="28" height="6" fill="#1a0808"/>' +
        '<rect x="90" y="99" width="5" height="4" fill="#88c4d8"/>' +
        '<rect x="105" y="99" width="5" height="4" fill="#88c4d8"/>' +
        // stamp crown
        '<rect x="92" y="76" width="16" height="10" fill="#3a2818" stroke="#1a1008" stroke-width="1"/>' +
        '<text x="100" y="84" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="7">QM</text>' +
        // legs
        '<rect x="74" y="220" width="16" height="24" fill="#4a4038" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="110" y="220" width="16" height="24" fill="#4a4038" stroke="#1a1008" stroke-width="2"/>'
      );
    }
    if (spriteId === 'siege_breaker') {
      return (
        '<ellipse cx="100" cy="244" rx="92" ry="11" fill="rgba(0,0,0,0.6)"/>' +
        // tracked base
        '<rect x="30" y="206" width="140" height="30" rx="6" fill="#3a3028" stroke="#1a1008" stroke-width="2.5"/>' +
        '<circle cx="48" cy="236" r="9" fill="#2a2018" stroke="#1a1008" stroke-width="2"/>' +
        '<circle cx="80" cy="238" r="9" fill="#2a2018" stroke="#1a1008" stroke-width="2"/>' +
        '<circle cx="120" cy="238" r="9" fill="#2a2018" stroke="#1a1008" stroke-width="2"/>' +
        '<circle cx="152" cy="236" r="9" fill="#2a2018" stroke="#1a1008" stroke-width="2"/>' +
        // hull
        '<rect x="46" y="130" width="108" height="80" rx="6" fill="#6a5848" stroke="#1a1008" stroke-width="2.5"/>' +
        '<polygon points="46,130 154,130 144,144 56,144" fill="#7a6858"/>' +
        // multiply sigil
        '<rect x="80" y="158" width="40" height="34" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<text x="100" y="184" text-anchor="middle" fill="#f0a838" font-family="Cinzel" font-size="22">×</text>' +
        // great ram/cannon
        '<rect x="150" y="150" width="44" height="26" fill="#4a4038" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="190" y="156" width="8" height="14" fill="#1a0808"/>' +
        '<polygon points="150,150 162,138 162,188 150,176" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        // smokestacks
        '<rect x="58" y="106" width="12" height="26" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="78" y="100" width="12" height="32" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<ellipse cx="64" cy="102" rx="8" ry="4" fill="rgba(120,120,120,0.5)"/>' +
        '<ellipse cx="84" cy="96" rx="9" ry="4" fill="rgba(120,120,120,0.5)"/>' +
        // head/cabin
        '<rect x="100" y="96" width="38" height="36" rx="3" fill="#7a6858" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="106" y="108" width="26" height="8" fill="#1a0808"/>' +
        '<rect x="110" y="109" width="6" height="6" fill="#cc3030"/>' +
        '<rect x="122" y="109" width="6" height="6" fill="#cc3030"/>'
      );
    }
    if (spriteId === 'foundry_mind') {
      return (
        '<defs>' +
          '<radialGradient id="fm-core" cx="0.5" cy="0.5" r="0.6">' +
            '<stop offset="0" stop-color="#f0d27a"/>' +
            '<stop offset="0.5" stop-color="#f0843a"/>' +
            '<stop offset="1" stop-color="#7a1808"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="244" rx="96" ry="13" fill="rgba(0,0,0,0.7)"/>' +
        // great furnace housing
        '<polygon points="24,230 36,90 164,90 176,230" fill="#3a2818" stroke="#1a0808" stroke-width="3"/>' +
        '<polygon points="36,90 164,90 156,104 44,104" fill="#5a4030"/>' +
        // pipes/arms reaching out
        '<path d="M 36 130 Q 8 130 10 180" fill="none" stroke="#4a4038" stroke-width="8"/>' +
        '<path d="M 164 130 Q 192 130 190 180" fill="none" stroke="#4a4038" stroke-width="8"/>' +
        '<path d="M 40 110 Q 16 96 18 70" fill="none" stroke="#4a4038" stroke-width="6"/>' +
        '<path d="M 160 110 Q 184 96 182 70" fill="none" stroke="#4a4038" stroke-width="6"/>' +
        // gears on the housing
        '<g transform="translate(54,210)"><circle r="14" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180;s+='<rect x="'+(Math.cos(a)*16-3)+'" y="'+(Math.sin(a)*16-3)+'" width="6" height="6" fill="#5a4838" stroke="#1a1008" stroke-width="0.8"/>';} return s; })() +
        '<circle r="5" fill="#3a2818"/></g>' +
        '<g transform="translate(146,210)"><circle r="14" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180;s+='<rect x="'+(Math.cos(a)*16-3)+'" y="'+(Math.sin(a)*16-3)+'" width="6" height="6" fill="#5a4838" stroke="#1a1008" stroke-width="0.8"/>';} return s; })() +
        '<circle r="5" fill="#3a2818"/></g>' +
        // glowing core (the "face")
        '<circle cx="100" cy="160" r="50" fill="#1a0808" stroke="#2a1810" stroke-width="3"/>' +
        '<circle cx="100" cy="160" r="40" fill="url(#fm-core)"/>' +
        // grate bars over core
        '<line x1="70" y1="140" x2="130" y2="140" stroke="#1a0808" stroke-width="3"/>' +
        '<line x1="64" y1="160" x2="136" y2="160" stroke="#1a0808" stroke-width="3"/>' +
        '<line x1="70" y1="180" x2="130" y2="180" stroke="#1a0808" stroke-width="3"/>' +
        // eyes within the fire
        '<ellipse cx="86" cy="152" rx="5" ry="7" fill="#1a0808"/>' +
        '<ellipse cx="114" cy="152" rx="5" ry="7" fill="#1a0808"/>' +
        '<circle cx="86" cy="152" r="2" fill="#f0d27a"/>' +
        '<circle cx="114" cy="152" r="2" fill="#f0d27a"/>' +
        // jagged mouth
        '<polygon points="80,176 88,170 96,176 104,170 112,176 120,170 120,184 80,184" fill="#1a0808"/>' +
        // numerals floating up from the chimney heat
        '<text x="100" y="84" text-anchor="middle" fill="#f0a838" font-family="Cinzel" font-size="12" opacity="0.8">× ÷</text>' +
        // top chimneys
        '<rect x="60" y="64" width="16" height="28" fill="#2a1810" stroke="#1a0808" stroke-width="2"/>' +
        '<rect x="124" y="64" width="16" height="28" fill="#2a1810" stroke="#1a0808" stroke-width="2"/>' +
        '<ellipse cx="68" cy="62" rx="11" ry="5" fill="rgba(140,120,100,0.5)"/>' +
        '<ellipse cx="132" cy="62" rx="11" ry="5" fill="rgba(140,120,100,0.5)"/>' +
        // ember sparks
        '<circle cx="100" cy="120" r="1.5" fill="#f0d27a"/>' +
        '<circle cx="120" cy="110" r="1.5" fill="#f0a838"/>' +
        '<circle cx="80" cy="112" r="1.5" fill="#f0a838"/>'
      );
    }
    return null;
  },

  // --------------------------------------------------------
  // ACT III — SCENE ILLUSTRATIONS
  // --------------------------------------------------------
  warMarchRoad() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="wm-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5868"/><stop offset="0.6" stop-color="#a88868"/><stop offset="1" stop-color="#caa878"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#wm-sky)"/>' +
      // smoke on the horizon (the foundries)
      '<ellipse cx="600" cy="150" rx="120" ry="40" fill="#5a4838" opacity="0.5"/>' +
      '<rect x="560" y="120" width="14" height="40" fill="#2a1810"/>' +
      '<rect x="590" y="110" width="14" height="50" fill="#2a1810"/>' +
      '<rect x="620" y="124" width="14" height="36" fill="#2a1810"/>' +
      '<path d="M 567 120 Q 560 100 572 84" stroke="rgba(90,72,56,0.6)" stroke-width="6" fill="none"/>' +
      '<path d="M 597 110 Q 590 88 602 70" stroke="rgba(90,72,56,0.6)" stroke-width="7" fill="none"/>' +
      // hills
      '<polygon points="0,200 160,150 320,190 480,150 640,185 800,150 800,240 0,240" fill="#5a4838"/>' +
      // muddy road
      '<polygon points="320,360 360,200 440,200 560,360" fill="#4a3828"/>' +
      '<polygon points="350,360 380,220 420,220 480,360" fill="#3a2818"/>' +
      // ruts
      '<line x1="380" y1="220" x2="360" y2="360" stroke="#2a1810" stroke-width="2"/>' +
      '<line x1="420" y1="220" x2="470" y2="360" stroke="#2a1810" stroke-width="2"/>' +
      // ground
      '<rect y="240" width="800" height="120" fill="#5a4830"/>' +
      // broken war machine (left)
      '<g transform="translate(120,250)">' +
        '<rect x="0" y="0" width="70" height="40" rx="4" fill="#5a4838" stroke="#1a1008" stroke-width="2" transform="rotate(-8)"/>' +
        '<circle cx="10" cy="48" r="14" fill="#3a3028" stroke="#1a1008" stroke-width="2"/>' +
        '<circle cx="58" cy="50" r="14" fill="#3a3028" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="40" y1="0" x2="60" y2="-30" stroke="#4a4038" stroke-width="5"/>' +
        '<rect x="56" y="-40" width="18" height="12" fill="#3a3838" transform="rotate(20 60 -34)"/>' +
        // rust
        '<circle cx="30" cy="14" r="3" fill="#7a3818" opacity="0.6"/>' +
      '</g>' +
      // signpost pointing to foundries
      '<g transform="translate(640,250)">' +
        '<line x1="0" y1="0" x2="0" y2="60" stroke="#3a2010" stroke-width="3"/>' +
        '<polygon points="0,4 44,4 52,12 44,20 0,20" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<text x="20" y="16" fill="#d4a624" font-family="IM Fell English SC" font-size="8">FOUNDRIES</text>' +
      '</g>' +
      // crows
      '<path d="M 200 90 Q 208 84 216 90 Q 208 86 200 90" fill="#1a0808"/>' +
      '<path d="M 260 70 Q 268 64 276 70 Q 268 66 260 70" fill="#1a0808"/>' +
      // marching silhouettes
      '<g transform="translate(400,300)" opacity="0.85">' +
        '<rect x="-3" y="0" width="6" height="22" fill="#1a0808"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#1a0808"/><line x1="5" y1="-8" x2="5" y2="14" stroke="#1a0808" stroke-width="1.5"/>' +
      '</g>' +
      '<g transform="translate(430,308)" opacity="0.8">' +
        '<rect x="-3" y="0" width="6" height="20" fill="#1a0808"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#1a0808"/>' +
      '</g>' +
    '</svg>';
  },

  cinderforgeTown() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a48"/><stop offset="1" stop-color="#8a5838"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#cf-sky)"/>' +
      // hazy red sun
      '<circle cx="180" cy="120" r="34" fill="#e07838" opacity="0.7"/>' +
      // distant smokestacks
      '<g opacity="0.8">' +
        '<rect x="40" y="120" width="16" height="100" fill="#2a1810"/>' +
        '<rect x="70" y="140" width="16" height="80" fill="#2a1810"/>' +
        '<rect x="720" y="110" width="18" height="110" fill="#2a1810"/>' +
        '<rect x="750" y="130" width="16" height="90" fill="#2a1810"/>' +
        '<path d="M 48 120 Q 42 100 54 84" stroke="rgba(90,72,56,0.6)" stroke-width="6" fill="none"/>' +
        '<path d="M 728 110 Q 722 88 736 72" stroke="rgba(90,72,56,0.6)" stroke-width="7" fill="none"/>' +
      '</g>' +
      // palisade wall
      '<rect y="170" width="800" height="20" fill="#3a2818"/>' +
      '<g fill="#4a3018">' +
        '<polygon points="40,170 56,170 48,158"/>' +
        '<polygon points="120,170 136,170 128,158"/>' +
        '<polygon points="200,170 216,170 208,158"/>' +
        '<polygon points="600,170 616,170 608,158"/>' +
        '<polygon points="700,170 716,170 708,158"/>' +
      '</g>' +
      // ground
      '<rect y="190" width="800" height="170" fill="#4a3828"/>' +
      // tavern/quartermaster depot (left)
      '<g transform="translate(70,170)">' +
        '<rect x="0" y="0" width="150" height="120" fill="#5a4030" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="-8" y="-16" width="166" height="18" fill="#3a2818" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="56" y="70" width="36" height="50" fill="#2a1810"/>' +
        '<rect x="16" y="24" width="28" height="26" fill="#ffaa55" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="106" y="24" width="28" height="26" fill="#ffaa55" stroke="#1a1008" stroke-width="1.5"/>' +
        // banner
        '<polygon points="20,2 20,40 36,32 36,2" fill="#7a2828"/>' +
        '<text x="74" y="-3" text-anchor="middle" fill="#d4a624" font-family="IM Fell English SC" font-size="9">DEPOT</text>' +
      '</g>' +
      // artificer workshop (right)
      '<g transform="translate(560,180)">' +
        '<rect x="0" y="0" width="150" height="110" fill="#4a4438" stroke="#1a1008" stroke-width="2"/>' +
        '<polygon points="-8,2 75,-30 158,2" fill="#3a3428" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="58" y="62" width="34" height="48" fill="#2a1810"/>' +
        // gear sign
        '<g transform="translate(120,-12)"><circle r="10" fill="#bfa050" stroke="#1a1008" stroke-width="1.5"/>' +
          (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180;s+='<rect x="'+(Math.cos(a)*11-2)+'" y="'+(Math.sin(a)*11-2)+'" width="4" height="4" fill="#bfa050"/>';} return s; })() +
          '<circle r="3" fill="#3a2818"/></g>' +
        '<rect x="18" y="24" width="26" height="24" fill="#88c4d8" stroke="#1a1008" stroke-width="1.5"/>' +
      '</g>' +
      // central forge fire (town square)
      '<g transform="translate(400,250)">' +
        '<rect x="-30" y="20" width="60" height="40" fill="#3a2818" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="-22" y="10" width="44" height="14" fill="#cc4818"/>' +
        '<polygon points="-16,10 -8,-14 0,-2 8,-20 16,-2 20,-12 22,10" fill="#f0843a"/>' +
        '<polygon points="-8,10 -2,-6 4,2 10,-10 14,10" fill="#f0d27a"/>' +
        '<circle cx="0" cy="0" r="50" fill="#f0843a" opacity="0.12"/>' +
      '</g>' +
      // townsfolk silhouettes
      '<g transform="translate(320,300)" opacity="0.85"><rect x="-3" y="0" width="6" height="22" fill="#1a0808"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#1a0808"/></g>' +
      '<g transform="translate(486,306)" opacity="0.85"><rect x="-3" y="0" width="6" height="20" fill="#1a0808"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#1a0808"/></g>' +
      // floating embers
      '<circle cx="420" cy="200" r="1.5" fill="#f0a838"/><circle cx="380" cy="180" r="1.5" fill="#f0d27a"/><circle cx="450" cy="220" r="1.5" fill="#f0a838"/>' +
    '</svg>';
  },

  quartermasterDepot() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="800" height="360" fill="#3a2c20"/>' +
      '<rect width="800" height="90" fill="#2a1c14"/>' +
      // beams
      '<rect x="0" y="88" width="800" height="6" fill="#1a1008"/>' +
      '<line x1="200" y1="0" x2="200" y2="88" stroke="#1a1008" stroke-width="4"/>' +
      '<line x1="600" y1="0" x2="600" y2="88" stroke="#1a1008" stroke-width="4"/>' +
      // floor
      '<polygon points="0,270 800,270 760,360 40,360" fill="#4a3828"/>' +
      // shelves of crates (back)
      '<g transform="translate(40,120)">' +
        '<rect x="0" y="0" width="240" height="150" fill="#3a2818" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="50" x2="240" y2="50" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="100" x2="240" y2="100" stroke="#1a1008" stroke-width="2"/>' +
        // crates
        '<rect x="8" y="8" width="40" height="38" fill="#6a4a28" stroke="#1a1008" stroke-width="1"/><text x="28" y="32" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="10">×</text>' +
        '<rect x="54" y="8" width="40" height="38" fill="#6a4a28" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="100" y="8" width="40" height="38" fill="#5a3a20" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="150" y="8" width="40" height="38" fill="#6a4a28" stroke="#1a1008" stroke-width="1"/><text x="170" y="32" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="10">÷</text>' +
        '<rect x="196" y="8" width="38" height="38" fill="#5a3a20" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="14" y="58" width="44" height="40" fill="#5a3a20" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="64" y="58" width="44" height="40" fill="#6a4a28" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="120" y="58" width="44" height="40" fill="#5a3a20" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="176" y="58" width="44" height="40" fill="#6a4a28" stroke="#1a1008" stroke-width="1"/>' +
        // barrels bottom
        '<rect x="10" y="108" width="30" height="40" rx="3" fill="#7a5828" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="50" y="108" width="30" height="40" rx="3" fill="#7a5828" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="150" y="108" width="30" height="40" rx="3" fill="#7a5828" stroke="#1a1008" stroke-width="1"/>' +
      '</g>' +
      // weapon rack (right)
      '<g transform="translate(560,130)">' +
        '<rect x="0" y="0" width="200" height="140" fill="#4a3828" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="20" x2="200" y2="20" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="30" y1="20" x2="30" y2="140" stroke="#3a2818" stroke-width="3"/>' +
        '<line x1="36" y1="24" x2="36" y2="130" stroke="#b8c0c8" stroke-width="3"/>' +
        '<line x1="80" y1="24" x2="80" y2="130" stroke="#5a3818" stroke-width="4"/>' +
        '<rect x="70" y="20" width="22" height="16" fill="#3a3838" stroke="#1a1008" stroke-width="1"/>' +
        '<line x1="130" y1="24" x2="130" y2="130" stroke="#5a3818" stroke-width="3"/>' +
        '<polygon points="118,28 142,22 148,40 124,46" fill="#888" stroke="#1a1008" stroke-width="1"/>' +
        '<polygon points="170,30 186,24 188,120 172,124" fill="#6a6058" stroke="#1a1008" stroke-width="1.5"/>' +
      '</g>' +
      // counter (front)
      '<g transform="translate(300,260)">' +
        '<rect x="0" y="0" width="200" height="18" fill="#5a4030" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="0" y="18" width="200" height="60" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        // ledger + scale
        '<rect x="20" y="-14" width="30" height="20" fill="#f0e3bd" stroke="#3a2010" stroke-width="1"/>' +
        '<line x1="120" y1="-26" x2="180" y2="-26" stroke="#3a3838" stroke-width="2"/>' +
        '<line x1="150" y1="-26" x2="150" y2="-6" stroke="#3a3838" stroke-width="1.5"/>' +
        '<path d="M 120 -26 L 114 -16 L 126 -16 Z" fill="none" stroke="#3a3838" stroke-width="1"/>' +
        '<path d="M 180 -26 L 174 -16 L 186 -16 Z" fill="none" stroke="#3a3838" stroke-width="1"/>' +
      '</g>' +
      // hanging lantern
      '<g transform="translate(400,90)"><line x1="0" y1="0" x2="0" y2="20" stroke="#1a1008" stroke-width="1"/><rect x="-8" y="20" width="16" height="20" fill="#5a3818" stroke="#1a1008" stroke-width="1"/><rect x="-6" y="22" width="12" height="14" fill="#ffcc55"/><circle cx="0" cy="32" r="36" fill="#ffaa33" opacity="0.16"/></g>' +
    '</svg>';
  },

  artificerWorkshop() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="800" height="360" fill="#2c3038"/>' +
      '<rect width="800" height="90" fill="#1c2028"/>' +
      '<polygon points="0,270 800,270 760,360 40,360" fill="#3a3e44"/>' +
      // big blueprint on the wall
      '<g transform="translate(60,110)">' +
        '<rect x="0" y="0" width="200" height="150" fill="#2a4858" stroke="#1a2838" stroke-width="2"/>' +
        '<g stroke="#6aa0c0" stroke-width="0.6" opacity="0.7">' +
          '<line x1="0" y1="30" x2="200" y2="30"/><line x1="0" y1="60" x2="200" y2="60"/><line x1="0" y1="90" x2="200" y2="90"/><line x1="0" y1="120" x2="200" y2="120"/>' +
          '<line x1="40" y1="0" x2="40" y2="150"/><line x1="80" y1="0" x2="80" y2="150"/><line x1="120" y1="0" x2="120" y2="150"/><line x1="160" y1="0" x2="160" y2="150"/>' +
        '</g>' +
        // a drawn gear + equation
        '<circle cx="70" cy="70" r="28" fill="none" stroke="#a8d0e0" stroke-width="1.5"/>' +
        '<circle cx="70" cy="70" r="8" fill="none" stroke="#a8d0e0" stroke-width="1.5"/>' +
        '<circle cx="130" cy="100" r="16" fill="none" stroke="#a8d0e0" stroke-width="1.5"/>' +
        '<text x="100" y="135" fill="#a8d0e0" font-family="Cinzel" font-size="10">24 × 13 = ?</text>' +
      '</g>' +
      // workbench with gears + tools (center/front)
      '<g transform="translate(300,250)">' +
        '<rect x="0" y="0" width="220" height="16" fill="#4a4438" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="8" y="16" width="10" height="60" fill="#3a3428"/>' +
        '<rect x="202" y="16" width="10" height="60" fill="#3a3428"/>' +
        // gears on bench
        '<g transform="translate(40,-8)"><circle r="18" fill="#bfa050" stroke="#1a1008" stroke-width="1.5"/>' +
          (() => { let s=''; for(let i=0;i<10;i++){const a=i*36*Math.PI/180;s+='<rect x="'+(Math.cos(a)*20-3)+'" y="'+(Math.sin(a)*20-3)+'" width="6" height="6" fill="#bfa050" stroke="#1a1008" stroke-width="0.6"/>';} return s; })() +
          '<circle r="6" fill="#3a2818"/></g>' +
        '<g transform="translate(78,4)"><circle r="11" fill="#9a8040" stroke="#1a1008" stroke-width="1.5"/>' +
          (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180;s+='<rect x="'+(Math.cos(a)*13-2)+'" y="'+(Math.sin(a)*13-2)+'" width="4" height="4" fill="#9a8040"/>';} return s; })() +
          '<circle r="3" fill="#3a2818"/></g>' +
        // tools
        '<line x1="140" y1="-6" x2="160" y2="-6" stroke="#3a3838" stroke-width="3"/>' +
        '<rect x="158" y="-9" width="10" height="6" fill="#5a4838"/>' +
        '<line x1="180" y1="-10" x2="190" y2="2" stroke="#888" stroke-width="2"/>' +
        // springs
        '<path d="M 110 -4 q 4 -6 8 0 q 4 6 8 0 q 4 -6 8 0" fill="none" stroke="#888" stroke-width="1.5"/>' +
      '</g>' +
      // shelf of small inventions (right)
      '<g transform="translate(580,120)">' +
        '<rect x="0" y="0" width="180" height="140" fill="#3a3e44" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="46" x2="180" y2="46" stroke="#1a1008" stroke-width="2"/>' +
        '<line x1="0" y1="92" x2="180" y2="92" stroke="#1a1008" stroke-width="2"/>' +
        // gizmos
        '<circle cx="30" cy="28" r="12" fill="#bfa050" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="60" y="14" width="24" height="28" fill="#88c4d8" stroke="#1a1008" stroke-width="1"/>' +
        '<polygon points="110,40 122,14 134,40" fill="#9a8040" stroke="#1a1008" stroke-width="1"/>' +
        '<circle cx="160" cy="28" r="10" fill="#cc6838" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="14" y="58" width="30" height="28" fill="#5a4838" stroke="#1a1008" stroke-width="1"/>' +
        '<circle cx="80" cy="72" r="13" fill="#bfa050" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="120" y="58" width="44" height="28" fill="#3a4858" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="20" y="104" width="40" height="30" fill="#6a5838" stroke="#1a1008" stroke-width="1"/>' +
        '<circle cx="100" cy="118" r="14" fill="#9a8040" stroke="#1a1008" stroke-width="1"/>' +
      '</g>' +
      // ceiling lamp (electric-ish blue)
      '<g transform="translate(400,90)"><line x1="0" y1="0" x2="0" y2="16" stroke="#1a1008" stroke-width="1"/><circle cx="0" cy="22" r="8" fill="#88c4d8"/><circle cx="0" cy="22" r="30" fill="#88c4d8" opacity="0.14"/></g>' +
    '</svg>';
  },

  foundryExterior() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="fe-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1c28"/><stop offset="1" stop-color="#7a3818"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#fe-sky)"/>' +
      // the great foundry — huge dark structure
      '<polygon points="80,240 80,120 200,80 360,110 360,240" fill="#2a2018" stroke="#1a1008" stroke-width="3"/>' +
      '<polygon points="360,240 360,90 540,70 700,110 720,240" fill="#332620" stroke="#1a1008" stroke-width="3"/>' +
      // many chimneys belching fire
      '<g>' +
        '<rect x="120" y="60" width="22" height="60" fill="#1a1008"/>' +
        '<rect x="200" y="40" width="24" height="80" fill="#1a1008"/>' +
        '<rect x="300" y="56" width="22" height="64" fill="#1a1008"/>' +
        '<rect x="460" y="36" width="26" height="74" fill="#1a1008"/>' +
        '<rect x="560" y="48" width="24" height="62" fill="#1a1008"/>' +
        '<rect x="640" y="58" width="22" height="56" fill="#1a1008"/>' +
        // fire tops
        '<polygon points="124,60 131,40 138,60" fill="#f0843a"/>' +
        '<polygon points="205,40 212,16 219,40" fill="#f0843a"/>' +
        '<polygon points="304,56 311,38 318,56" fill="#f0843a"/>' +
        '<polygon points="465,36 473,12 481,36" fill="#f0843a"/>' +
        '<polygon points="564,48 571,28 578,48" fill="#f0843a"/>' +
        // smoke
        '<path d="M 131 40 Q 124 20 136 4" stroke="rgba(90,72,56,0.55)" stroke-width="6" fill="none"/>' +
        '<path d="M 212 16 Q 205 -2 218 -16" stroke="rgba(90,72,56,0.55)" stroke-width="7" fill="none"/>' +
        '<path d="M 473 12 Q 466 -6 480 -20" stroke="rgba(90,72,56,0.55)" stroke-width="7" fill="none"/>' +
      '</g>' +
      // glowing windows grid
      '<g fill="#f0a838">' +
        '<rect x="110" y="150" width="16" height="20"/><rect x="140" y="150" width="16" height="20"/><rect x="170" y="150" width="16" height="20"/>' +
        '<rect x="110" y="185" width="16" height="20"/><rect x="170" y="185" width="16" height="20"/>' +
        '<rect x="420" y="140" width="18" height="24"/><rect x="455" y="140" width="18" height="24"/><rect x="490" y="140" width="18" height="24"/><rect x="560" y="150" width="18" height="24"/>' +
        '<rect x="420" y="180" width="18" height="24"/><rect x="490" y="180" width="18" height="24"/>' +
      '</g>' +
      // great gate (entrance) glowing
      '<g transform="translate(400,170)">' +
        '<path d="M -50 70 L -50 10 Q -50 -24 0 -24 Q 50 -24 50 10 L 50 70 Z" fill="#1a0808" stroke="#3a1810" stroke-width="3"/>' +
        '<rect x="-56" y="6" width="6" height="64" fill="#3a2818"/>' +
        '<rect x="50" y="6" width="6" height="64" fill="#3a2818"/>' +
        '<polygon points="-12,-24 12,-24 14,-16 -14,-16" fill="#5a4838"/>' +
        '<text x="0" y="-16" text-anchor="middle" fill="#f0a838" font-family="Cinzel" font-size="7">×÷</text>' +
        // inner glow
        '<ellipse cx="0" cy="60" rx="40" ry="12" fill="#cc4818" opacity="0.5"/>' +
      '</g>' +
      // ground + rails
      '<rect y="240" width="800" height="120" fill="#2a1c14"/>' +
      '<line x1="0" y1="300" x2="800" y2="300" stroke="#3a2818" stroke-width="2"/>' +
      '<line x1="0" y1="312" x2="800" y2="312" stroke="#3a2818" stroke-width="2"/>' +
      '<g stroke="#1a1008" stroke-width="1">' + (() => { let s=''; for(let x=20;x<800;x+=40){s+='<line x1="'+x+'" y1="298" x2="'+x+'" y2="314"/>';} return s; })() + '</g>' +
      // ore cart
      '<g transform="translate(180,288)"><rect x="0" y="0" width="56" height="24" fill="#4a3828" stroke="#1a1008" stroke-width="1.5"/><circle cx="12" cy="26" r="6" fill="#2a2018"/><circle cx="44" cy="26" r="6" fill="#2a2018"/><polygon points="8,-6 18,-10 26,-4" fill="#6a6058"/></g>' +
      // ember rain
      '<circle cx="300" cy="120" r="1.5" fill="#f0a838"/><circle cx="500" cy="100" r="1.5" fill="#f0d27a"/><circle cx="620" cy="140" r="1.5" fill="#f0a838"/><circle cx="250" cy="160" r="1.2" fill="#f0843a"/>' +
    '</svg>';
  },

  foundryInterior() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="fi-glow" cx="0.5" cy="0.7" r="0.7"><stop offset="0" stop-color="#f0843a" stop-opacity="0.4"/><stop offset="1" stop-color="#1a0808" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#1a1410"/>' +
      '<rect width="800" height="360" fill="url(#fi-glow)"/>' +
      // back wall with pipes
      '<rect width="800" height="200" fill="#2a2018"/>' +
      '<g stroke="#3a3028" stroke-width="8" fill="none">' +
        '<path d="M 0 40 L 300 40 Q 320 40 320 60 L 320 120"/>' +
        '<path d="M 800 60 L 500 60 Q 480 60 480 80 L 480 130"/>' +
        '<path d="M 0 90 L 200 90"/>' +
      '</g>' +
      '<circle cx="320" cy="40" r="6" fill="#5a4838"/><circle cx="480" cy="60" r="6" fill="#5a4838"/>' +
      // molten channel along the floor
      '<polygon points="0,300 800,300 800,330 0,330" fill="#1a0808"/>' +
      '<polygon points="0,306 800,306 800,324 0,324" fill="#cc4818"/>' +
      '<polygon points="0,310 800,310 800,320 0,320" fill="#f0843a"/>' +
      '<path d="M 0 315 Q 100 311 200 315 T 400 315 T 600 315 T 800 315" stroke="#f0d27a" stroke-width="2" fill="none" opacity="0.7"/>' +
      // floor
      '<rect y="330" width="800" height="30" fill="#2a1c14"/>' +
      // big cauldron pouring (left)
      '<g transform="translate(120,140)">' +
        '<path d="M -40 0 Q -40 50 0 54 Q 40 50 40 0 Z" fill="#3a3028" stroke="#1a1008" stroke-width="2.5"/>' +
        '<ellipse cx="0" cy="0" rx="40" ry="10" fill="#5a4838" stroke="#1a1008" stroke-width="2"/>' +
        '<ellipse cx="0" cy="0" rx="32" ry="7" fill="#f0843a"/>' +
        // pour
        '<path d="M 36 4 Q 56 40 50 160" stroke="#f0a838" stroke-width="6" fill="none"/>' +
        // chain
        '<line x1="-30" y1="-6" x2="-40" y2="-60" stroke="#3a2818" stroke-width="2" stroke-dasharray="3 2"/>' +
        '<line x1="30" y1="-6" x2="40" y2="-60" stroke="#3a2818" stroke-width="2" stroke-dasharray="3 2"/>' +
      '</g>' +
      // conveyor with parts (center)
      '<g transform="translate(360,250)">' +
        '<rect x="0" y="0" width="280" height="14" fill="#3a3028" stroke="#1a1008" stroke-width="2"/>' +
        '<circle cx="14" cy="7" r="9" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        '<circle cx="266" cy="7" r="9" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/>' +
        // parts on belt
        '<rect x="40" y="-16" width="20" height="16" fill="#6a6058" stroke="#1a1008" stroke-width="1"/>' +
        '<circle cx="110" cy="-8" r="9" fill="#bfa050" stroke="#1a1008" stroke-width="1"/>' +
        '<rect x="160" y="-16" width="20" height="16" fill="#6a6058" stroke="#1a1008" stroke-width="1"/>' +
        '<circle cx="220" cy="-8" r="9" fill="#9a8040" stroke="#1a1008" stroke-width="1"/>' +
        // support legs
        '<rect x="20" y="14" width="6" height="60" fill="#3a2818"/>' +
        '<rect x="254" y="14" width="6" height="60" fill="#3a2818"/>' +
      '</g>' +
      // giant gear turning (right back)
      '<g transform="translate(680,150)"><circle r="60" fill="#3a3028" stroke="#1a1008" stroke-width="3"/>' +
        (() => { let s=''; for(let i=0;i<12;i++){const a=i*30*Math.PI/180;s+='<rect x="'+(Math.cos(a)*64-7)+'" y="'+(Math.sin(a)*64-7)+'" width="14" height="14" fill="#3a3028" stroke="#1a1008" stroke-width="1.5" transform="rotate('+(i*30)+' '+(Math.cos(a)*64)+' '+(Math.sin(a)*64)+')"/>';} return s; })() +
        '<circle r="40" fill="#4a4038"/><circle r="12" fill="#1a1008"/></g>' +
      // hanging lamps
      '<g transform="translate(300,40)"><line x1="0" y1="0" x2="0" y2="18" stroke="#1a1008" stroke-width="1"/><rect x="-7" y="18" width="14" height="16" fill="#5a3818"/><rect x="-5" y="20" width="10" height="11" fill="#ffcc55"/><circle cy="28" r="30" fill="#ffaa33" opacity="0.14"/></g>' +
      // embers
      '<circle cx="200" cy="200" r="1.5" fill="#f0a838"/><circle cx="420" cy="180" r="1.5" fill="#f0d27a"/><circle cx="560" cy="210" r="1.5" fill="#f0a838"/>' +
    '</svg>';
  },

  foundryMindCore() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="fmc-glow" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#f0843a" stop-opacity="0.5"/><stop offset="0.6" stop-color="#7a1808" stop-opacity="0.3"/><stop offset="1" stop-color="#0a0404" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#140a08"/>' +
      '<rect width="800" height="360" fill="url(#fmc-glow)"/>' +
      // vaulted machine walls
      '<polygon points="0,0 120,0 80,200 0,220" fill="#2a1c14" stroke="#1a0808" stroke-width="2"/>' +
      '<polygon points="800,0 680,0 720,200 800,220" fill="#2a1c14" stroke="#1a0808" stroke-width="2"/>' +
      // huge pipes converging
      '<g stroke="#3a3028" stroke-width="14" fill="none">' +
        '<path d="M 40 40 Q 200 80 360 160"/>' +
        '<path d="M 760 40 Q 600 80 440 160"/>' +
        '<path d="M 80 320 Q 200 280 340 200"/>' +
        '<path d="M 720 320 Q 600 280 460 200"/>' +
      '</g>' +
      // floor grating
      '<polygon points="0,280 800,280 760,360 40,360" fill="#1a1008"/>' +
      '<g stroke="#3a2818" stroke-width="1.5">' + (() => { let s=''; for(let x=60;x<780;x+=44){s+='<line x1="'+x+'" y1="284" x2="'+(x-20)+'" y2="356"/>';} for(let y=292;y<356;y+=18){s+='<line x1="40" y1="'+y+'" x2="760" y2="'+y+'"/>';} return s; })() + '</g>' +
      // molten pits glowing through grate
      '<ellipse cx="200" cy="330" rx="60" ry="14" fill="#cc4818" opacity="0.5"/>' +
      '<ellipse cx="600" cy="330" rx="60" ry="14" fill="#cc4818" opacity="0.5"/>' +
      // central dais where the boss sits
      '<ellipse cx="400" cy="300" rx="120" ry="26" fill="#2a1c14" stroke="#1a0808" stroke-width="2"/>' +
      '<ellipse cx="400" cy="296" rx="100" ry="20" fill="#3a2818"/>' +
      '<ellipse cx="400" cy="294" rx="70" ry="12" fill="#5a4030"/>' +
      // hanging chains
      '<line x1="260" y1="0" x2="300" y2="120" stroke="#3a2818" stroke-width="2" stroke-dasharray="4 3"/>' +
      '<line x1="540" y1="0" x2="500" y2="120" stroke="#3a2818" stroke-width="2" stroke-dasharray="4 3"/>' +
      // floating numerals in the heat
      '<text x="320" y="120" fill="#f0a838" font-family="Cinzel" font-size="16" opacity="0.5">×</text>' +
      '<text x="470" y="100" fill="#f0a838" font-family="Cinzel" font-size="16" opacity="0.5">÷</text>' +
      '<text x="400" y="80" fill="#f0d27a" font-family="Cinzel" font-size="14" opacity="0.4">= ?</text>' +
      // ember rain
      '<circle cx="300" cy="160" r="1.5" fill="#f0a838"/><circle cx="500" cy="150" r="1.5" fill="#f0d27a"/><circle cx="420" cy="120" r="1.5" fill="#f0a838"/><circle cx="360" cy="180" r="1.2" fill="#f0843a"/>' +
    '</svg>';
  },

  foundryDawn() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="fd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4868"/><stop offset="0.5" stop-color="#c8a0a0"/><stop offset="1" stop-color="#f0d2a4"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#fd-sky)"/>' +
      // soft dawn sun
      '<circle cx="400" cy="200" r="70" fill="#f0d27a" opacity="0.85"/>' +
      '<circle cx="400" cy="200" r="110" fill="#f0d27a" opacity="0.2"/>' +
      // the foundry — now quiet, chimneys cold (only thin white steam)
      '<polygon points="80,240 80,130 220,100 380,130 380,240" fill="#3a3038" opacity="0.9"/>' +
      '<polygon points="380,240 380,120 560,100 720,130 720,240" fill="#43383c" opacity="0.9"/>' +
      '<g fill="#2a2028">' +
        '<rect x="140" y="80" width="20" height="50"/><rect x="220" y="64" width="22" height="66"/><rect x="320" y="78" width="20" height="52"/><rect x="480" y="64" width="24" height="66"/><rect x="580" y="76" width="22" height="54"/>' +
      '</g>' +
      // thin white steam (not fire)
      '<path d="M 150 80 Q 146 60 154 44" stroke="rgba(240,240,240,0.5)" stroke-width="4" fill="none"/>' +
      '<path d="M 231 64 Q 227 44 235 28" stroke="rgba(240,240,240,0.5)" stroke-width="5" fill="none"/>' +
      '<path d="M 491 64 Q 487 44 495 28" stroke="rgba(240,240,240,0.45)" stroke-width="5" fill="none"/>' +
      // a single banner raised on the gate
      '<line x1="400" y1="140" x2="400" y2="96" stroke="#bfa050" stroke-width="2"/>' +
      '<polygon points="400,98 432,108 428,124 400,116" fill="#d4a624"/>' +
      // ground
      '<rect y="240" width="800" height="120" fill="#3a3028"/>' +
      // grass returning at the edges
      '<g stroke="#5a7848" stroke-width="2">' +
        '<line x1="40" y1="300" x2="40" y2="290"/><line x1="46" y1="302" x2="44" y2="292"/><line x1="52" y1="300" x2="54" y2="290"/>' +
        '<line x1="760" y1="300" x2="760" y2="290"/><line x1="766" y1="302" x2="764" y2="292"/><line x1="754" y1="300" x2="756" y2="290"/>' +
      '</g>' +
      // two figures looking at the dawn
      '<g transform="translate(360,300)" opacity="0.9"><rect x="-3" y="0" width="6" height="24" fill="#2a1810"/><ellipse cx="0" cy="-4" rx="5" ry="6" fill="#2a1810"/></g>' +
      '<g transform="translate(420,304)" opacity="0.9"><rect x="-3" y="0" width="6" height="22" fill="#2a1810"/><ellipse cx="0" cy="-4" rx="4" ry="5" fill="#2a1810"/></g>' +
      // birds
      '<path d="M 200 80 Q 208 74 216 80 Q 208 76 200 80" fill="#2a1810"/>' +
      '<path d="M 560 70 Q 568 64 576 70 Q 568 66 560 70" fill="#2a1810"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT IV — NPC PORTRAITS
  // --------------------------------------------------------
  keeper_sable(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="sab-bg"><stop offset="0" stop-color="#4a4030"/><stop offset="1" stop-color="#1a1408"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#sab-bg)"/>' +
      // neat dark hair, parted, in a bun
      '<path d="M 30 44 Q 50 22 70 44 Q 60 36 50 38 Q 40 36 30 44 Z" fill="#2a2018"/>' +
      '<circle cx="50" cy="26" r="7" fill="#2a2018"/>' +
      // face
      '<ellipse cx="50" cy="54" rx="16" ry="18" fill="#caa478" stroke="#3a2010" stroke-width="0.8"/>' +
      '<ellipse cx="34" cy="54" rx="3" ry="4" fill="#caa478"/>' +
      '<ellipse cx="66" cy="54" rx="3" ry="4" fill="#caa478"/>' +
      // half-moon spectacles
      '<path d="M 38 56 Q 44 62 50 56" fill="none" stroke="#bfa050" stroke-width="1"/>' +
      '<path d="M 50 56 Q 56 62 62 56" fill="none" stroke="#bfa050" stroke-width="1"/>' +
      '<ellipse cx="44" cy="53" rx="1.5" ry="2" fill="#1a1008"/>' +
      '<ellipse cx="56" cy="53" rx="1.5" ry="2" fill="#1a1008"/>' +
      // calm mouth
      '<path d="M 44 64 Q 50 67 56 64" stroke="#3a2010" stroke-width="1" fill="none"/>' +
      // high collar + coin brooch
      '<path d="M 32 80 Q 50 90 68 80 L 72 96 L 28 96 Z" fill="#3a3020" stroke="#1a1008" stroke-width="1"/>' +
      '<circle cx="50" cy="84" r="3" fill="#d4a624" stroke="#3a2010" stroke-width="0.6"/>' +
      '<text x="50" y="86.5" text-anchor="middle" fill="#3a2010" font-family="Cinzel" font-size="4">·01</text>' +
    '</svg>';
  },

  assayer_fenn(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="fenn-bg"><stop offset="0" stop-color="#3a4438"/><stop offset="1" stop-color="#141a14"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#fenn-bg)"/>' +
      // bald with side hair
      '<ellipse cx="50" cy="42" rx="17" ry="16" fill="#d0b088"/>' +
      '<path d="M 33 46 Q 32 56 36 64 L 40 60 Q 36 52 38 46 Z" fill="#8a8078"/>' +
      '<path d="M 67 46 Q 68 56 64 64 L 60 60 Q 64 52 62 46 Z" fill="#8a8078"/>' +
      // face
      '<ellipse cx="50" cy="52" rx="16" ry="17" fill="#d0b088" stroke="#3a2010" stroke-width="0.8"/>' +
      // jeweler\'s loupe over one eye
      '<circle cx="56" cy="52" r="6" fill="#1a2820" stroke="#bfa050" stroke-width="2"/>' +
      '<circle cx="56" cy="52" r="2.5" fill="#88c4d8" opacity="0.7"/>' +
      '<ellipse cx="44" cy="52" rx="1.6" ry="2" fill="#1a1008"/>' +
      // brows
      '<line x1="39" y1="48" x2="48" y2="48" stroke="#5a5048" stroke-width="1.2"/>' +
      // thin mustache + mouth
      '<path d="M 44 62 L 56 62" stroke="#5a5048" stroke-width="1.4"/>' +
      '<path d="M 45 66 Q 50 69 55 66" stroke="#3a2010" stroke-width="1" fill="none"/>' +
      // collar + tiny balance scale pin
      '<path d="M 32 80 Q 50 90 68 80 L 72 96 L 28 96 Z" fill="#2a3328" stroke="#1a1008" stroke-width="1"/>' +
      '<line x1="44" y1="86" x2="56" y2="86" stroke="#bfa050" stroke-width="1"/>' +
      '<line x1="50" y1="84" x2="50" y2="88" stroke="#bfa050" stroke-width="1"/>' +
      '<path d="M 44 86 l -2 3 l 4 0 z" fill="#bfa050"/>' +
      '<path d="M 56 86 l -2 3 l 4 0 z" fill="#bfa050"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT IV — ENEMY SPRITES
  // --------------------------------------------------------
  _enemyAct4(spriteId) {
    if (spriteId === 'coin_mite') {
      return (
        '<ellipse cx="100" cy="236" rx="34" ry="6" fill="rgba(0,0,0,0.45)"/>' +
        // body — a big coin on legs
        '<g transform="translate(100,150)">' +
        '<ellipse cx="0" cy="0" rx="44" ry="44" fill="#d4a624" stroke="#7a5818" stroke-width="3"/>' +
        '<ellipse cx="0" cy="0" rx="34" ry="34" fill="#e8c44a"/>' +
        '<circle r="34" fill="none" stroke="#7a5818" stroke-width="1" stroke-dasharray="2 3"/>' +
        // face stamped on coin
        '<ellipse cx="-12" cy="-6" rx="4" ry="5" fill="#1a1008"/>' +
        '<ellipse cx="12" cy="-6" rx="4" ry="5" fill="#1a1008"/>' +
        '<circle cx="-11" cy="-7" r="1" fill="#fff"/><circle cx="13" cy="-7" r="1" fill="#fff"/>' +
        '<path d="M -12 10 Q 0 18 12 10" stroke="#7a5818" stroke-width="2" fill="none"/>' +
        '<text x="0" y="-18" text-anchor="middle" fill="#7a5818" font-family="Cinzel" font-size="8">0.1</text>' +
        '</g>' +
        // little legs + arms
        '<line x1="84" y1="188" x2="78" y2="214" stroke="#7a5818" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="116" y1="188" x2="122" y2="214" stroke="#7a5818" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="58" y1="150" x2="40" y2="166" stroke="#7a5818" stroke-width="3.5" stroke-linecap="round"/>' +
        '<line x1="142" y1="150" x2="160" y2="166" stroke="#7a5818" stroke-width="3.5" stroke-linecap="round"/>'
      );
    }
    if (spriteId === 'ledger_shade') {
      return (
        '<ellipse cx="100" cy="240" rx="46" ry="7" fill="rgba(0,0,0,0.5)"/>' +
        // floating tattered ledger-cloak
        '<path d="M 60 120 Q 100 96 140 120 L 150 230 Q 130 214 120 230 Q 110 214 100 230 Q 90 214 80 230 Q 70 214 50 230 Z" fill="#2a2840" stroke="#14122a" stroke-width="2"/>' +
        // open book at center
        '<path d="M 76 150 Q 100 142 124 150 L 124 178 Q 100 170 76 178 Z" fill="#3a3858" stroke="#14122a" stroke-width="1.5"/>' +
        '<path d="M 78 152 Q 100 146 100 150 L 100 174 Q 100 168 78 174 Z" fill="#e8e0c8"/>' +
        '<path d="M 122 152 Q 100 146 100 150 L 100 174 Q 100 168 122 174 Z" fill="#e8e0c8"/>' +
        '<line x1="82" y1="158" x2="96" y2="156" stroke="#3a2010" stroke-width="0.5"/>' +
        '<line x1="82" y1="164" x2="96" y2="162" stroke="#3a2010" stroke-width="0.5"/>' +
        '<text x="112" y="166" text-anchor="middle" fill="#7a1818" font-family="Cinzel" font-size="6">−</text>' +
        // hood + glowing eyes
        '<path d="M 76 118 Q 100 92 124 118 L 120 138 Q 100 126 80 138 Z" fill="#14122a" stroke="#0a0818" stroke-width="1.5"/>' +
        '<ellipse cx="90" cy="122" rx="3" ry="4" fill="#88c4d8"/>' +
        '<ellipse cx="110" cy="122" rx="3" ry="4" fill="#88c4d8"/>' +
        // wispy hands
        '<path d="M 60 150 Q 48 156 50 172" fill="none" stroke="#3a3858" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M 140 150 Q 152 156 150 172" fill="none" stroke="#3a3858" stroke-width="4" stroke-linecap="round"/>'
      );
    }
    if (spriteId === 'tarnish_ooze') {
      return (
        '<ellipse cx="100" cy="240" rx="64" ry="9" fill="rgba(0,0,0,0.5)"/>' +
        // puddle body
        '<path d="M 40 230 Q 30 180 60 170 Q 70 140 100 150 Q 130 140 140 170 Q 170 180 160 230 Z" fill="#5a6850" stroke="#2a3424" stroke-width="2"/>' +
        // tarnish sheen
        '<path d="M 60 200 Q 100 188 140 200" stroke="#8aa078" stroke-width="3" fill="none" opacity="0.6"/>' +
        '<ellipse cx="78" cy="186" rx="6" ry="3" fill="#3a4830" opacity="0.7"/>' +
        '<ellipse cx="122" cy="190" rx="7" ry="3" fill="#3a4830" opacity="0.7"/>' +
        // coins half-dissolved in the ooze
        '<circle cx="70" cy="214" r="6" fill="#9a7a2a" stroke="#5a4818" stroke-width="1" opacity="0.8"/>' +
        '<circle cx="120" cy="218" r="5" fill="#9a7a2a" stroke="#5a4818" stroke-width="1" opacity="0.8"/>' +
        '<circle cx="100" cy="222" r="4" fill="#9a7a2a" stroke="#5a4818" stroke-width="1" opacity="0.7"/>' +
        // eyes
        '<ellipse cx="86" cy="168" rx="5" ry="6" fill="#1a1008"/>' +
        '<ellipse cx="114" cy="168" rx="5" ry="6" fill="#1a1008"/>' +
        '<circle cx="87" cy="166" r="1.4" fill="#aaccaa"/><circle cx="115" cy="166" r="1.4" fill="#aaccaa"/>' +
        // drippy mouth
        '<path d="M 86 180 Q 100 190 114 180" stroke="#2a3424" stroke-width="2" fill="none"/>' +
        '<path d="M 100 188 Q 98 196 102 200" stroke="#5a6850" stroke-width="3" fill="none"/>'
      );
    }
    if (spriteId === 'vault_sentinel') {
      return (
        '<ellipse cx="100" cy="242" rx="58" ry="8" fill="rgba(0,0,0,0.55)"/>' +
        // a great round vault-door given legs
        '<rect x="76" y="196" width="18" height="44" fill="#3a3830" stroke="#1a1808" stroke-width="2"/>' +
        '<rect x="106" y="196" width="18" height="44" fill="#3a3830" stroke="#1a1808" stroke-width="2"/>' +
        '<circle cx="100" cy="150" r="58" fill="#5a5848" stroke="#1a1808" stroke-width="3"/>' +
        '<circle cx="100" cy="150" r="48" fill="#6a6858" stroke="#1a1808" stroke-width="1.5"/>' +
        '<circle cx="100" cy="150" r="36" fill="none" stroke="#3a3830" stroke-width="2" stroke-dasharray="3 4"/>' +
        // vault wheel-handle (its "face")
        '<g stroke="#3a3830" stroke-width="5">' +
        '<line x1="100" y1="122" x2="100" y2="178"/>' +
        '<line x1="72" y1="150" x2="128" y2="150"/>' +
        '<line x1="80" y1="130" x2="120" y2="170"/>' +
        '<line x1="80" y1="170" x2="120" y2="130"/>' +
        '</g>' +
        '<circle cx="100" cy="150" r="9" fill="#d4a624" stroke="#3a2010" stroke-width="1.5"/>' +
        // glowing eye-slots
        '<rect x="84" y="138" width="8" height="4" fill="#88c4d8"/>' +
        '<rect x="108" y="138" width="8" height="4" fill="#88c4d8"/>' +
        // arms (bolt-levers)
        '<rect x="38" y="146" width="24" height="8" fill="#4a4838" stroke="#1a1808" stroke-width="1.5"/>' +
        '<rect x="138" y="146" width="24" height="8" fill="#4a4838" stroke="#1a1808" stroke-width="1.5"/>'
      );
    }
    if (spriteId === 'the_auditor') {
      return (
        '<ellipse cx="100" cy="244" rx="76" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // tall stern figure with abacus-spine
        '<rect x="70" y="118" width="60" height="106" rx="4" fill="#3a3850" stroke="#14122a" stroke-width="2.5"/>' +
        // rows of beads down the chest (place-value columns)
        (() => { let s=''; const cols=[78,90,102,114]; cols.forEach((x,ci)=>{ s+='<line x1="'+x+'" y1="128" x2="'+x+'" y2="214" stroke="#2a2840" stroke-width="2"/>'; for(let r=0;r<4;r++){ s+='<circle cx="'+x+'" cy="'+(136+r*20)+'" r="3" fill="'+(((ci+r)%2)?'#d4a624':'#88c4d8')+'"/>'; } }); return s; })() +
        // tenths/hundredths labels
        '<text x="100" y="232" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="7">. 1 0 0</text>' +
        // arms holding a quill + ledger
        '<rect x="40" y="130" width="30" height="14" fill="#3a3850" stroke="#14122a" stroke-width="1.5" transform="rotate(-12 55 137)"/>' +
        '<rect x="130" y="130" width="30" height="14" fill="#3a3850" stroke="#14122a" stroke-width="1.5" transform="rotate(12 145 137)"/>' +
        '<line x1="36" y1="120" x2="30" y2="100" stroke="#5a5878" stroke-width="2"/>' + // quill
        '<path d="M 30 100 Q 26 96 30 92" fill="none" stroke="#88c4d8" stroke-width="2"/>' +
        // narrow head with monocle
        '<rect x="84" y="86" width="32" height="36" rx="3" fill="#4a4860" stroke="#14122a" stroke-width="2"/>' +
        '<circle cx="94" cy="102" r="6" fill="none" stroke="#bfa050" stroke-width="1.5"/>' +
        '<ellipse cx="94" cy="102" rx="2" ry="2.5" fill="#88c4d8"/>' +
        '<ellipse cx="108" cy="102" rx="2" ry="2.5" fill="#88c4d8"/>' +
        '<path d="M 90 114 L 110 114" stroke="#14122a" stroke-width="1.5"/>' +
        // tall scholar\'s cap
        '<polygon points="84,86 116,86 100,68" fill="#2a2840" stroke="#14122a" stroke-width="1.5"/>' +
        // legs
        '<rect x="78" y="224" width="14" height="18" fill="#2a2840"/>' +
        '<rect x="108" y="224" width="14" height="18" fill="#2a2840"/>'
      );
    }
    if (spriteId === 'coin_hoard') {
      return (
        '<ellipse cx="100" cy="246" rx="92" ry="11" fill="rgba(0,0,0,0.6)"/>' +
        // a great heap of coins forming a creature
        '<path d="M 20 240 Q 30 170 80 160 Q 100 120 120 160 Q 170 170 180 240 Z" fill="#b8902a" stroke="#6a4818" stroke-width="2.5"/>' +
        // individual coins in the pile
        (() => { let s=''; const pts=[[50,210],[70,224],[95,214],[120,226],[150,210],[60,188],[100,196],[140,190],[80,206],[118,204],[40,228],[160,228],[100,176]]; pts.forEach((p,i)=>{ s+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="9" ry="9" fill="'+((i%2)?'#d4a624':'#e8c44a')+'" stroke="#6a4818" stroke-width="1"/>'; }); return s; })() +
        // gem accents
        '<polygon points="64,200 70,196 76,200 70,208" fill="#cc4878"/>' +
        '<polygon points="132,198 138,194 144,198 138,206" fill="#3a78b8"/>' +
        // face emerging at the top of the hoard
        '<ellipse cx="100" cy="150" rx="30" ry="26" fill="#caa030" stroke="#6a4818" stroke-width="2"/>' +
        '<ellipse cx="89" cy="146" rx="5" ry="7" fill="#1a1008"/>' +
        '<ellipse cx="111" cy="146" rx="5" ry="7" fill="#1a1008"/>' +
        '<circle cx="90" cy="144" r="1.6" fill="#f0d27a"/><circle cx="112" cy="144" r="1.6" fill="#f0d27a"/>' +
        // greedy grin full of coins
        '<path d="M 84 160 Q 100 176 116 160 L 112 168 Q 100 178 88 168 Z" fill="#1a1008"/>' +
        '<rect x="90" y="161" width="4" height="6" fill="#e8c44a"/><rect x="98" y="162" width="4" height="6" fill="#e8c44a"/><rect x="106" y="161" width="4" height="6" fill="#e8c44a"/>' +
        // grasping arms of coins
        '<path d="M 70 160 Q 44 150 40 124" fill="none" stroke="#b8902a" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M 130 160 Q 156 150 160 124" fill="none" stroke="#b8902a" stroke-width="9" stroke-linecap="round"/>' +
        '<circle cx="40" cy="122" r="7" fill="#d4a624" stroke="#6a4818" stroke-width="1"/>' +
        '<circle cx="160" cy="122" r="7" fill="#d4a624" stroke="#6a4818" stroke-width="1"/>'
      );
    }
    if (spriteId === 'tithe_master') {
      return (
        '<defs>' +
          '<radialGradient id="tm-core" cx="0.5" cy="0.5" r="0.6">' +
            '<stop offset="0" stop-color="#0a0a14"/>' +
            '<stop offset="0.7" stop-color="#1a1828"/>' +
            '<stop offset="1" stop-color="#3a3858"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="246" rx="96" ry="13" fill="rgba(0,0,0,0.7)"/>' +
        // towering cloaked figure of coins and shadow
        '<path d="M 44 240 Q 30 150 70 120 Q 100 70 130 120 Q 170 150 156 240 Z" fill="#1a1828" stroke="#0a0814" stroke-width="3"/>' +
        // coin-scale trim down the cloak
        (() => { let s=''; for(let y=140;y<236;y+=22){ for(let x=64;x<140;x+=24){ s+='<ellipse cx="'+(x + ((y/22)%2?10:0))+'" cy="'+y+'" rx="7" ry="7" fill="#3a3450" stroke="#6a5818" stroke-width="0.8" opacity="0.85"/>'; } } return s; })() +
        // the great hollow coin where the face should be
        '<circle cx="100" cy="128" r="46" fill="#7a5818" stroke="#3a2808" stroke-width="3"/>' +
        '<circle cx="100" cy="128" r="36" fill="#caa030" stroke="#3a2808" stroke-width="1.5"/>' +
        '<circle cx="100" cy="128" r="18" fill="url(#tm-core)" stroke="#3a2808" stroke-width="2"/>' +
        // void eyes inside the hole
        '<ellipse cx="92" cy="124" rx="3" ry="5" fill="#cc4878"/>' +
        '<ellipse cx="108" cy="124" rx="3" ry="5" fill="#cc4878"/>' +
        '<circle cx="92" cy="122" r="1" fill="#fff" opacity="0.7"/>' +
        '<circle cx="108" cy="122" r="1" fill="#fff" opacity="0.7"/>' +
        // engraved value around the coin
        '<text x="100" y="98" text-anchor="middle" fill="#3a2808" font-family="Cinzel" font-size="7">0.001</text>' +
        '<text x="100" y="166" text-anchor="middle" fill="#3a2808" font-family="Cinzel" font-size="7">∞</text>' +
        // crown of floating coins
        '<circle cx="62" cy="92" r="6" fill="#d4a624" stroke="#3a2808" stroke-width="1"/>' +
        '<circle cx="80" cy="78" r="6" fill="#d4a624" stroke="#3a2808" stroke-width="1"/>' +
        '<circle cx="100" cy="72" r="6" fill="#d4a624" stroke="#3a2808" stroke-width="1"/>' +
        '<circle cx="120" cy="78" r="6" fill="#d4a624" stroke="#3a2808" stroke-width="1"/>' +
        '<circle cx="138" cy="92" r="6" fill="#d4a624" stroke="#3a2808" stroke-width="1"/>' +
        // grasping shadow-hands
        '<path d="M 56 150 Q 28 150 22 196" fill="none" stroke="#1a1828" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="M 144 150 Q 172 150 178 196" fill="none" stroke="#1a1828" stroke-width="10" stroke-linecap="round"/>' +
        // falling coins
        '<circle cx="40" cy="210" r="3" fill="#d4a624"/><circle cx="166" cy="206" r="3" fill="#d4a624"/><circle cx="30" cy="170" r="2" fill="#d4a624"/>'
      );
    }
    return null;
  },

  // --------------------------------------------------------
  // ACT IV — SCENE ILLUSTRATIONS
  // --------------------------------------------------------
  vaultDescent() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="vd-glow" cx="0.5" cy="0.2" r="0.9"><stop offset="0" stop-color="#d4a624" stop-opacity="0.22"/><stop offset="1" stop-color="#0a0808" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#100c0a"/>' +
      '<rect width="800" height="360" fill="url(#vd-glow)"/>' +
      // stone shaft walls converging downward
      '<polygon points="0,0 260,0 360,360 0,360" fill="#2a2018" stroke="#1a1408" stroke-width="2"/>' +
      '<polygon points="800,0 540,0 440,360 800,360" fill="#2a2018" stroke="#1a1408" stroke-width="2"/>' +
      '<polygon points="260,0 540,0 440,360 360,360" fill="#1a1410"/>' +
      // brick courses on side walls
      '<g stroke="#1a1408" stroke-width="1" opacity="0.6">' +
        '<line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="120" x2="320" y2="120"/><line x1="0" y1="180" x2="340" y2="180"/><line x1="0" y1="240" x2="360" y2="240"/>' +
        '<line x1="800" y1="60" x2="520" y2="60"/><line x1="800" y1="120" x2="500" y2="120"/><line x1="800" y1="180" x2="480" y2="180"/><line x1="800" y1="240" x2="460" y2="240"/>' +
      '</g>' +
      // descending spiral stair (center)
      (() => { let s=''; for(let i=0;i<9;i++){ const y=40+i*36; const wsteps=120-i*8; const cx=400+(i%2?14:-14); s+='<polygon points="'+(cx-wsteps/2)+','+y+' '+(cx+wsteps/2)+','+y+' '+(cx+wsteps/2-8)+','+(y+14)+' '+(cx-wsteps/2+8)+','+(y+14)+'" fill="'+((i%2)?'#4a3a28':'#3a2c1c')+'" stroke="#1a1408" stroke-width="1.5"/>'; } return s; })() +
      // hanging lanterns down the shaft
      '<g transform="translate(150,80)"><rect x="-7" y="0" width="14" height="16" fill="#5a3818" stroke="#1a1008" stroke-width="1"/><rect x="-5" y="2" width="10" height="11" fill="#ffcc55"/><circle cy="8" r="26" fill="#ffaa33" opacity="0.16"/></g>' +
      '<g transform="translate(650,140)"><rect x="-7" y="0" width="14" height="16" fill="#5a3818" stroke="#1a1008" stroke-width="1"/><rect x="-5" y="2" width="10" height="11" fill="#ffcc55"/><circle cy="8" r="26" fill="#ffaa33" opacity="0.16"/></g>' +
      // faint coin-glint at the bottom of the shaft
      '<ellipse cx="400" cy="350" rx="70" ry="14" fill="#d4a624" opacity="0.25"/>' +
      '<circle cx="384" cy="348" r="3" fill="#d4a624"/><circle cx="408" cy="352" r="3" fill="#e8c44a"/><circle cx="420" cy="346" r="2" fill="#d4a624"/>' +
    '</svg>';
  },

  undermarket() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="um-glow" cx="0.5" cy="0.5" r="0.8"><stop offset="0" stop-color="#d4a624" stop-opacity="0.16"/><stop offset="1" stop-color="#100c0a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#1a1410"/>' +
      // great vaulted cavern ceiling
      '<path d="M 0 120 Q 200 30 400 40 Q 600 30 800 120 L 800 0 L 0 0 Z" fill="#2a2018" stroke="#1a1408" stroke-width="2"/>' +
      // stalactites
      '<polygon points="160,60 168,60 164,92" fill="#3a2c1c"/><polygon points="320,46 330,46 325,86" fill="#3a2c1c"/><polygon points="500,48 510,48 505,84" fill="#3a2c1c"/><polygon points="640,62 648,62 644,90" fill="#3a2c1c"/>' +
      '<rect width="800" height="360" fill="url(#um-glow)"/>' +
      // floor
      '<rect y="270" width="800" height="90" fill="#2a2118"/>' +
      '<g stroke="#1a1408" stroke-width="1" opacity="0.5">' + (() => { let s=''; for(let x=0;x<800;x+=60){s+='<line x1="'+x+'" y1="270" x2="'+(x-30)+'" y2="360"/>';} s+='<line x1="40" y1="310" x2="760" y2="310"/>'; return s; })() + '</g>' +
      // market stalls (left) with striped awning
      '<g transform="translate(70,150)">' +
        '<rect x="0" y="40" width="150" height="90" fill="#3a2c1c" stroke="#1a1008" stroke-width="2"/>' +
        '<polygon points="-10,40 160,40 150,16 0,16" fill="#7a3838"/>' +
        '<g fill="#a85050">' + (() => { let s=''; for(let i=0;i<7;i++){s+='<polygon points="'+(i*23-6)+',40 '+(i*23+6)+',40 '+(i*23+2)+',18 '+(i*23-2)+',18"/>';} return s; })() + '</g>' +
        // coins/goods on the counter
        '<rect x="10" y="40" width="130" height="10" fill="#5a4830"/>' +
        '<circle cx="30" cy="38" r="5" fill="#d4a624"/><circle cx="44" cy="38" r="5" fill="#e8c44a"/><circle cx="58" cy="36" r="5" fill="#d4a624"/>' +
        '<rect x="90" y="28" width="14" height="14" fill="#88c4d8" stroke="#1a1008" stroke-width="1"/>' +
        '<text x="74" y="64" text-anchor="middle" fill="#d4a624" font-family="IM Fell English SC" font-size="8">KEEPER</text>' +
      '</g>' +
      // assayer office (right) with hanging scale
      '<g transform="translate(560,150)">' +
        '<rect x="0" y="40" width="150" height="90" fill="#2a3328" stroke="#1a1008" stroke-width="2"/>' +
        '<polygon points="-8,42 75,14 158,42" fill="#1c241c" stroke="#1a1008" stroke-width="2"/>' +
        '<rect x="58" y="80" width="34" height="50" fill="#14180e"/>' +
        // big balance scale sign
        '<line x1="40" y1="20" x2="110" y2="20" stroke="#bfa050" stroke-width="2"/>' +
        '<line x1="75" y1="14" x2="75" y2="22" stroke="#bfa050" stroke-width="2"/>' +
        '<path d="M 40 20 L 32 32 L 48 32 Z" fill="none" stroke="#bfa050" stroke-width="1.5"/>' +
        '<path d="M 110 20 L 102 32 L 118 32 Z" fill="none" stroke="#bfa050" stroke-width="1.5"/>' +
        '<text x="75" y="60" text-anchor="middle" fill="#bfa050" font-family="IM Fell English SC" font-size="8">ASSAYER</text>' +
      '</g>' +
      // central brazier
      '<g transform="translate(400,260)">' +
        '<rect x="-8" y="0" width="16" height="36" fill="#3a2818" stroke="#1a1008" stroke-width="1.5"/>' +
        '<ellipse cx="0" cy="0" rx="16" ry="6" fill="#5a4830" stroke="#1a1008" stroke-width="1.5"/>' +
        '<polygon points="-12,-2 -4,-18 0,-6 6,-22 10,-6 14,-14" fill="#f0a838"/>' +
        '<polygon points="-6,-2 0,-14 4,-4 8,-16 10,-2" fill="#f0d27a"/>' +
        '<circle cx="0" cy="-6" r="44" fill="#f0a838" opacity="0.12"/>' +
      '</g>' +
      // shoppers (silhouettes)
      '<g transform="translate(320,300)" opacity="0.85"><rect x="-3" y="0" width="6" height="22" fill="#0e0a08"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#0e0a08"/></g>' +
      '<g transform="translate(470,304)" opacity="0.85"><rect x="-3" y="0" width="6" height="20" fill="#0e0a08"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#0e0a08"/></g>' +
      // floating coin motes
      '<circle cx="250" cy="150" r="2" fill="#d4a624" opacity="0.7"/><circle cx="540" cy="130" r="2" fill="#e8c44a" opacity="0.7"/>' +
    '</svg>';
  },

  vaultHall() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="vh-glow" cx="0.5" cy="0.55" r="0.7"><stop offset="0" stop-color="#d4a624" stop-opacity="0.18"/><stop offset="1" stop-color="#0c0a08" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#14100c"/>' +
      '<rect width="800" height="360" fill="url(#vh-glow)"/>' +
      // back wall lined with safe-deposit doors
      '<rect y="40" width="800" height="230" fill="#241c14"/>' +
      (() => { let s=''; for(let r=0;r<3;r++){ for(let c=0;c<10;c++){ const x=30+c*76, y=56+r*70; s+='<rect x="'+x+'" y="'+y+'" width="60" height="54" fill="#3a2e1e" stroke="#1a1408" stroke-width="1.5"/>'; s+='<rect x="'+(x+4)+'" y="'+(y+4)+'" width="52" height="46" fill="#4a3a26"/>'; s+='<circle cx="'+(x+30)+'" cy="'+(y+27)+'" r="6" fill="#bfa050" stroke="#1a1408" stroke-width="1"/>'; s+='<line x1="'+(x+30)+'" y1="'+(y+21)+'" x2="'+(x+30)+'" y2="'+(y+33)+'" stroke="#1a1408" stroke-width="1"/>'; s+='<line x1="'+(x+24)+'" y1="'+(y+27)+'" x2="'+(x+36)+'" y2="'+(y+27)+'" stroke="#1a1408" stroke-width="1"/>'; } } return s; })() +
      // one door hanging open, coins spilling
      '<rect x="334" y="126" width="60" height="54" fill="#1a1208" stroke="#1a1408" stroke-width="1.5"/>' +
      '<rect x="392" y="126" width="8" height="54" fill="#4a3a26" stroke="#1a1408" stroke-width="1"/>' +
      '<path d="M 344 178 Q 360 184 380 180" stroke="#d4a624" stroke-width="3" fill="none"/>' +
      '<circle cx="350" cy="182" r="4" fill="#d4a624"/><circle cx="364" cy="186" r="4" fill="#e8c44a"/><circle cx="378" cy="184" r="3" fill="#d4a624"/>' +
      // floor
      '<polygon points="0,270 800,270 760,360 40,360" fill="#241c14"/>' +
      '<g stroke="#1a1408" stroke-width="1" opacity="0.5">' + (() => { let s=''; for(let x=60;x<780;x+=60){s+='<line x1="'+x+'" y1="274" x2="'+(x-26)+'" y2="356"/>';} for(let y=290;y<356;y+=20){s+='<line x1="40" y1="'+y+'" x2="760" y2="'+y+'"/>';} return s; })() + '</g>' +
      // two iron columns
      '<g transform="translate(170,150)"><rect x="-12" y="0" width="24" height="120" fill="#3a2e1e" stroke="#1a1408" stroke-width="2"/><rect x="-16" y="-6" width="32" height="8" fill="#4a3a26"/><rect x="-16" y="118" width="32" height="10" fill="#2a2014"/></g>' +
      '<g transform="translate(630,150)"><rect x="-12" y="0" width="24" height="120" fill="#3a2e1e" stroke="#1a1408" stroke-width="2"/><rect x="-16" y="-6" width="32" height="8" fill="#4a3a26"/><rect x="-16" y="118" width="32" height="10" fill="#2a2014"/></g>' +
      // scattered coins on floor
      '<circle cx="120" cy="320" r="5" fill="#d4a624"/><circle cx="700" cy="324" r="5" fill="#e8c44a"/><circle cx="500" cy="332" r="4" fill="#d4a624"/>' +
      // hanging chandelier of candles
      '<g transform="translate(400,40)"><line x1="0" y1="0" x2="0" y2="20" stroke="#1a1008" stroke-width="1.5"/><ellipse cx="0" cy="24" rx="40" ry="6" fill="none" stroke="#5a4830" stroke-width="2"/><rect x="-34" y="18" width="4" height="8" fill="#f0e3bd"/><rect x="-2" y="16" width="4" height="10" fill="#f0e3bd"/><rect x="30" y="18" width="4" height="8" fill="#f0e3bd"/><ellipse cx="-32" cy="16" rx="2" ry="4" fill="#ffcc55"/><ellipse cx="0" cy="14" rx="2" ry="4" fill="#ffcc55"/><ellipse cx="32" cy="16" rx="2" ry="4" fill="#ffcc55"/><circle cy="24" r="50" fill="#ffaa33" opacity="0.1"/></g>' +
    '</svg>';
  },

  vaultHeart() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="vhrt-glow" cx="0.5" cy="0.42" r="0.6"><stop offset="0" stop-color="#cc4878" stop-opacity="0.35"/><stop offset="0.6" stop-color="#3a2808" stop-opacity="0.3"/><stop offset="1" stop-color="#0a0604" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#0e0a06"/>' +
      '<rect width="800" height="360" fill="url(#vhrt-glow)"/>' +
      // vast circular vault door behind (the great seal)
      '<circle cx="400" cy="150" r="150" fill="#241c10" stroke="#14100a" stroke-width="4"/>' +
      '<circle cx="400" cy="150" r="120" fill="#2e2414" stroke="#14100a" stroke-width="2"/>' +
      '<circle cx="400" cy="150" r="90" fill="none" stroke="#4a3a1e" stroke-width="3" stroke-dasharray="4 6"/>' +
      '<circle cx="400" cy="150" r="60" fill="none" stroke="#4a3a1e" stroke-width="2"/>' +
      // great locking spokes
      '<g stroke="#4a3a1e" stroke-width="6">' + (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180; s+='<line x1="'+(400+Math.cos(a)*60)+'" y1="'+(150+Math.sin(a)*60)+'" x2="'+(400+Math.cos(a)*118)+'" y2="'+(150+Math.sin(a)*118)+'"/>';} return s; })() + '</g>' +
      '<circle cx="400" cy="150" r="18" fill="#7a5818" stroke="#14100a" stroke-width="2"/>' +
      '<text x="400" y="154" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="10">·</text>' +
      // mounds of treasure flanking
      '<path d="M 0 300 Q 60 240 140 260 Q 200 244 240 300 Z" fill="#b8902a" stroke="#6a4818" stroke-width="2"/>' +
      '<path d="M 560 300 Q 620 244 680 260 Q 760 240 800 300 Z" fill="#b8902a" stroke="#6a4818" stroke-width="2"/>' +
      (() => { let s=''; const pts=[[40,288],[80,276],[120,286],[170,272],[210,288],[600,288],[640,274],[690,284],[730,272],[760,288]]; pts.forEach((p,i)=>{ s+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="9" ry="9" fill="'+((i%2)?'#d4a624':'#e8c44a')+'" stroke="#6a4818" stroke-width="1"/>'; }); return s; })() +
      // floor
      '<polygon points="0,300 800,300 760,360 40,360" fill="#1a120a"/>' +
      // pedestal at center-front where the Hollow Coin waits
      '<g transform="translate(400,300)">' +
        '<rect x="-26" y="0" width="52" height="30" fill="#2e2414" stroke="#14100a" stroke-width="2"/>' +
        '<polygon points="-26,0 26,0 20,-10 -20,-10" fill="#3e3018"/>' +
        '<ellipse cx="0" cy="-14" rx="14" ry="14" fill="#7a5818" stroke="#3a2808" stroke-width="2"/>' +
        '<circle cx="0" cy="-14" r="6" fill="#0a0606"/>' + // hollow center
        '<circle cx="0" cy="-14" r="20" fill="#cc4878" opacity="0.25"/>' +
      '</g>' +
      // dust + coin motes
      '<circle cx="300" cy="120" r="1.5" fill="#d4a624"/><circle cx="500" cy="110" r="1.5" fill="#e8c44a"/><circle cx="420" cy="90" r="1.5" fill="#cc4878"/>' +
    '</svg>';
  },

  vaultTreasury() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="vt-glow" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#f0d27a" stop-opacity="0.4"/><stop offset="1" stop-color="#1a120a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#1a120a"/>' +
      '<rect width="800" height="360" fill="url(#vt-glow)"/>' +
      // a shaft of clean daylight breaking in from above (the seal lifted)
      '<polygon points="340,0 460,0 520,260 280,260" fill="#f0d27a" opacity="0.18"/>' +
      '<polygon points="370,0 430,0 470,260 330,260" fill="#f0e3bd" opacity="0.16"/>' +
      // restored vault — coins flowing back into open boxes
      '<rect y="40" width="800" height="220" fill="#2a2014"/>' +
      (() => { let s=''; for(let c=0;c<10;c++){ const x=30+c*76, y=90; s+='<rect x="'+x+'" y="'+y+'" width="60" height="54" fill="#3a2e1e" stroke="#1a1408" stroke-width="1.5"/>'; s+='<rect x="'+(x+4)+'" y="'+(y+4)+'" width="52" height="46" fill="#caa030" opacity="0.5"/>'; s+='<circle cx="'+(x+18)+'" cy="'+(y+30)+'" r="5" fill="#d4a624"/><circle cx="'+(x+34)+'" cy="'+(y+34)+'" r="5" fill="#e8c44a"/><circle cx="'+(x+48)+'" cy="'+(y+30)+'" r="5" fill="#d4a624"/>'; } return s; })() +
      // floor heaped with gold
      '<rect y="260" width="800" height="100" fill="#2a2014"/>' +
      '<path d="M 0 300 Q 200 270 400 290 Q 600 270 800 300 L 800 360 L 0 360 Z" fill="#b8902a"/>' +
      (() => { let s=''; for(let i=0;i<22;i++){ const x=30+i*36, y=300+ (i%3)*12; s+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="9" fill="'+((i%2)?'#d4a624':'#e8c44a')+'" stroke="#6a4818" stroke-width="1"/>'; } return s; })() +
      // two figures standing in the light
      '<g transform="translate(380,300)" opacity="0.9"><rect x="-3" y="0" width="6" height="24" fill="#2a1810"/><ellipse cx="0" cy="-4" rx="5" ry="6" fill="#2a1810"/></g>' +
      '<g transform="translate(420,304)" opacity="0.9"><rect x="-3" y="0" width="6" height="22" fill="#2a1810"/><ellipse cx="0" cy="-4" rx="4" ry="5" fill="#2a1810"/></g>' +
      // sparkles
      '<circle cx="300" cy="140" r="1.5" fill="#fff"/><circle cx="500" cy="120" r="1.5" fill="#fff"/><circle cx="400" cy="100" r="1.5" fill="#f0d27a"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT V — NPC PORTRAITS
  // --------------------------------------------------------
  marketer_quill(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="quill-bg"><stop offset="0" stop-color="#7a5848"/><stop offset="1" stop-color="#2a1810"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#quill-bg)"/>' +
      // bright feathered cap
      '<path d="M 30 40 Q 50 22 70 40 L 70 44 Q 50 38 30 44 Z" fill="#3a6848"/>' +
      '<path d="M 66 38 Q 78 26 82 12 Q 74 22 70 34 Z" fill="#cc4878"/>' +
      // face
      '<ellipse cx="50" cy="54" rx="16" ry="18" fill="#d8b088" stroke="#3a2010" stroke-width="0.8"/>' +
      '<ellipse cx="34" cy="54" rx="3" ry="4" fill="#d8b088"/>' +
      '<ellipse cx="66" cy="54" rx="3" ry="4" fill="#d8b088"/>' +
      // eyes (merry)
      '<ellipse cx="44" cy="54" rx="2" ry="2.4" fill="#1a1008"/>' +
      '<ellipse cx="56" cy="54" rx="2" ry="2.4" fill="#1a1008"/>' +
      '<circle cx="44.6" cy="53.2" r="0.7" fill="#fff"/><circle cx="56.6" cy="53.2" r="0.7" fill="#fff"/>' +
      // big grin
      '<path d="M 42 63 Q 50 70 58 63" stroke="#3a2010" stroke-width="1.3" fill="none"/>' +
      // curled mustache
      '<path d="M 44 60 Q 40 62 38 59 M 56 60 Q 60 62 62 59" stroke="#5a3818" stroke-width="1.2" fill="none"/>' +
      // collar with coin buttons
      '<path d="M 30 80 Q 50 90 70 80 L 74 96 L 26 96 Z" fill="#5a3848" stroke="#1a1008" stroke-width="1"/>' +
      '<circle cx="44" cy="86" r="2" fill="#d4a624"/><circle cx="56" cy="86" r="2" fill="#d4a624"/>' +
    '</svg>';
  },

  outfitter_bex(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="bex-bg"><stop offset="0" stop-color="#3a4868"/><stop offset="1" stop-color="#14182a"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#bex-bg)"/>' +
      // braided hair wrapped with measuring tape
      '<path d="M 30 44 Q 50 22 70 44 L 72 70 Q 64 60 64 66 L 36 66 Q 32 60 28 70 Z" fill="#3a2818"/>' +
      '<path d="M 30 40 Q 50 30 70 40" fill="none" stroke="#d8c068" stroke-width="2" stroke-dasharray="3 2"/>' +
      // face
      '<ellipse cx="50" cy="54" rx="16" ry="18" fill="#b88858" stroke="#3a2010" stroke-width="0.8"/>' +
      '<ellipse cx="34" cy="54" rx="3" ry="4" fill="#b88858"/>' +
      '<ellipse cx="66" cy="54" rx="3" ry="4" fill="#b88858"/>' +
      // focused eyes + a pin held in teeth
      '<ellipse cx="44" cy="54" rx="1.8" ry="2.2" fill="#1a1008"/>' +
      '<ellipse cx="56" cy="54" rx="1.8" ry="2.2" fill="#1a1008"/>' +
      '<line x1="40" y1="50" x2="48" y2="51" stroke="#2a1808" stroke-width="1.2"/>' +
      '<line x1="52" y1="51" x2="60" y2="50" stroke="#2a1808" stroke-width="1.2"/>' +
      '<path d="M 44 64 Q 50 66 56 64" stroke="#3a2010" stroke-width="1.1" fill="none"/>' +
      '<line x1="48" y1="65" x2="58" y2="67" stroke="#bbb" stroke-width="1"/>' + // pin
      // apron with spools + scissors
      '<path d="M 30 80 Q 50 90 70 80 L 74 96 L 26 96 Z" fill="#2a3348" stroke="#1a1008" stroke-width="1"/>' +
      '<rect x="40" y="82" width="6" height="9" fill="#cc4878"/>' +
      '<rect x="54" y="82" width="6" height="9" fill="#3a7848"/>' +
      '<circle cx="50" cy="88" r="2" fill="none" stroke="#bbb" stroke-width="1"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT V — ENEMY SPRITES
  // --------------------------------------------------------
  _enemyAct5(spriteId) {
    if (spriteId === 'tare_wisp') {
      return (
        '<ellipse cx="100" cy="236" rx="32" ry="6" fill="rgba(0,0,0,0.4)"/>' +
        // a floating balance-scale spirit
        '<line x1="100" y1="96" x2="100" y2="150" stroke="#bfa050" stroke-width="3"/>' +
        '<line x1="60" y1="120" x2="140" y2="120" stroke="#bfa050" stroke-width="3"/>' +
        '<path d="M 60 120 L 48 142 L 72 142 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.5" opacity="0.9"/>' +
        '<path d="M 140 120 L 128 138 L 152 138 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.5" opacity="0.9"/>' +
        // wispy ghost body around the post
        '<path d="M 84 150 Q 80 200 90 230 Q 100 214 110 230 Q 120 200 116 150 Z" fill="#a8c4d8" opacity="0.55" stroke="#6a8aa0" stroke-width="1.5"/>' +
        // face on the central knob
        '<circle cx="100" cy="104" r="12" fill="#caa84a" stroke="#7a5818" stroke-width="1.5"/>' +
        '<ellipse cx="95" cy="102" rx="2" ry="3" fill="#1a1008"/>' +
        '<ellipse cx="105" cy="102" rx="2" ry="3" fill="#1a1008"/>' +
        '<path d="M 95 110 Q 100 113 105 110" stroke="#7a5818" stroke-width="1" fill="none"/>' +
        // unequal pans (cheating)
        '<circle cx="60" cy="142" r="4" fill="#d4a624"/>' +
        '<text x="138" y="143" fill="#7a5818" font-family="Cinzel" font-size="8">?</text>'
      );
    }
    if (spriteId === 'tally_gremlin') {
      return (
        '<ellipse cx="100" cy="240" rx="44" ry="7" fill="rgba(0,0,0,0.5)"/>' +
        // squat gremlin made of tally-marks and parchment
        '<path d="M 64 150 Q 60 130 100 126 Q 140 130 136 150 L 142 220 Q 100 236 58 220 Z" fill="#d8c89a" stroke="#7a5828" stroke-width="2"/>' +
        // tally scrawls on body
        '<g stroke="#5a3818" stroke-width="2">' +
        '<line x1="76" y1="170" x2="76" y2="186"/><line x1="82" y1="170" x2="82" y2="186"/><line x1="88" y1="170" x2="88" y2="186"/><line x1="94" y1="170" x2="94" y2="186"/><line x1="72" y1="178" x2="98" y2="180"/>' +
        '<line x1="112" y1="172" x2="112" y2="188"/><line x1="118" y1="172" x2="118" y2="188"/><line x1="124" y1="172" x2="124" y2="188"/>' +
        '</g>' +
        // fraction scrawl
        '<text x="100" y="210" text-anchor="middle" fill="#7a1818" font-family="Cinzel" font-size="11">⅓ + ¼</text>' +
        // head
        '<ellipse cx="100" cy="132" rx="22" ry="18" fill="#cabf90" stroke="#7a5828" stroke-width="2"/>' +
        // big ears
        '<polygon points="80,128 64,116 82,138" fill="#cabf90" stroke="#7a5828" stroke-width="1.5"/>' +
        '<polygon points="120,128 136,116 118,138" fill="#cabf90" stroke="#7a5828" stroke-width="1.5"/>' +
        // eyes + sharp grin
        '<ellipse cx="92" cy="130" rx="3" ry="4" fill="#1a1008"/>' +
        '<ellipse cx="108" cy="130" rx="3" ry="4" fill="#1a1008"/>' +
        '<circle cx="92.7" cy="129" r="0.8" fill="#fff"/><circle cx="108.7" cy="129" r="0.8" fill="#fff"/>' +
        '<path d="M 90 140 L 110 140 L 106 146 L 94 146 Z" fill="#1a1008"/>' +
        '<line x1="96" y1="140" x2="96" y2="146" stroke="#cabf90" stroke-width="0.8"/><line x1="104" y1="140" x2="104" y2="146" stroke="#cabf90" stroke-width="0.8"/>'
      );
    }
    if (spriteId === 'zero_sprite') {
      return (
        '<ellipse cx="100" cy="238" rx="34" ry="6" fill="rgba(0,0,0,0.45)"/>' +
        // a chain of glowing zeros forming a creature
        '<g stroke="#88c4d8" stroke-width="4" fill="none">' +
        '<circle cx="100" cy="130" r="30"/>' +
        '</g>' +
        '<circle cx="100" cy="130" r="22" fill="#1a2838" opacity="0.6"/>' +
        // smaller orbiting zeros
        '<circle cx="64" cy="120" r="9" fill="none" stroke="#6aa0c0" stroke-width="3"/>' +
        '<circle cx="138" cy="146" r="11" fill="none" stroke="#6aa0c0" stroke-width="3"/>' +
        '<circle cx="120" cy="92" r="7" fill="none" stroke="#6aa0c0" stroke-width="2.5"/>' +
        // face inside the big zero
        '<ellipse cx="92" cy="126" rx="3" ry="4" fill="#88c4d8"/>' +
        '<ellipse cx="108" cy="126" rx="3" ry="4" fill="#88c4d8"/>' +
        '<path d="M 90 138 Q 100 144 110 138" stroke="#88c4d8" stroke-width="2" fill="none"/>' +
        // tail of zeros
        '<circle cx="96" cy="180" r="8" fill="none" stroke="#6aa0c0" stroke-width="3"/>' +
        '<circle cx="104" cy="208" r="6" fill="none" stroke="#4a7a98" stroke-width="2.5"/>' +
        // ×10 glints
        '<text x="150" y="110" fill="#88c4d8" font-family="Cinzel" font-size="10" opacity="0.8">×10</text>'
      );
    }
    if (spriteId === 'the_misweigher') {
      return (
        '<ellipse cx="100" cy="244" rx="78" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // hunched merchant-construct with a giant rigged balance for a head
        '<rect x="74" y="150" width="52" height="74" rx="4" fill="#5a4838" stroke="#1a1008" stroke-width="2.5"/>' +
        // robe pattern
        '<path d="M 74 170 L 126 170 M 74 190 L 126 190 M 74 210 L 126 210" stroke="#3a2c1c" stroke-width="1.5"/>' +
        // arms holding weights
        '<rect x="44" y="158" width="30" height="12" fill="#5a4838" stroke="#1a1008" stroke-width="1.5" transform="rotate(-10 59 164)"/>' +
        '<rect x="126" y="158" width="30" height="12" fill="#5a4838" stroke="#1a1008" stroke-width="1.5" transform="rotate(10 141 164)"/>' +
        '<rect x="34" y="168" width="18" height="18" fill="#3a3830" stroke="#1a1008" stroke-width="1.5"/>' +
        '<text x="43" y="181" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="8">1</text>' +
        '<rect x="148" y="168" width="22" height="22" fill="#3a3830" stroke="#1a1008" stroke-width="1.5"/>' +
        '<text x="159" y="184" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="9">9?</text>' +
        // the balance-head (tilted, dishonest)
        '<line x1="100" y1="150" x2="100" y2="120" stroke="#bfa050" stroke-width="3"/>' +
        '<line x1="62" y1="110" x2="138" y2="130" stroke="#bfa050" stroke-width="3"/>' + // tilted beam
        '<path d="M 62 110 L 50 130 L 74 130 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.5"/>' +
        '<path d="M 138 130 L 126 148 L 150 148 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.5"/>' +
        '<circle cx="100" cy="116" r="12" fill="#caa84a" stroke="#7a5818" stroke-width="2"/>' +
        // sly eyes on the knob
        '<ellipse cx="95" cy="114" rx="2.2" ry="3" fill="#1a1008"/>' +
        '<ellipse cx="105" cy="114" rx="2.2" ry="3" fill="#1a1008"/>' +
        '<path d="M 95 121 Q 100 119 105 121" stroke="#7a5818" stroke-width="1" fill="none"/>' +
        // legs
        '<rect x="80" y="224" width="14" height="18" fill="#3a2c1c"/>' +
        '<rect x="106" y="224" width="14" height="18" fill="#3a2c1c"/>'
      );
    }
    if (spriteId === 'the_sunderer') {
      return (
        '<ellipse cx="100" cy="244" rx="78" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // a clerk split down the middle, each half a different denominator
        '<path d="M 100 120 L 70 124 L 64 224 L 100 224 Z" fill="#5a3858" stroke="#2a1838" stroke-width="2"/>' +
        '<path d="M 100 120 L 130 124 L 136 224 L 100 224 Z" fill="#385868" stroke="#182838" stroke-width="2"/>' +
        '<line x1="100" y1="120" x2="100" y2="224" stroke="#d8c068" stroke-width="2" stroke-dasharray="4 3"/>' +
        // fraction marks on each half
        '<text x="84" y="175" text-anchor="middle" fill="#e0c0e0" font-family="Cinzel" font-size="14">1</text>' +
        '<line x1="78" y1="180" x2="90" y2="180" stroke="#e0c0e0" stroke-width="1.5"/>' +
        '<text x="84" y="194" text-anchor="middle" fill="#e0c0e0" font-family="Cinzel" font-size="14">3</text>' +
        '<text x="116" y="175" text-anchor="middle" fill="#bfe0e8" font-family="Cinzel" font-size="14">1</text>' +
        '<line x1="110" y1="180" x2="122" y2="180" stroke="#bfe0e8" stroke-width="1.5"/>' +
        '<text x="116" y="194" text-anchor="middle" fill="#bfe0e8" font-family="Cinzel" font-size="14">4</text>' +
        // two-tone head
        '<path d="M 100 88 Q 78 88 78 110 L 100 116 Z" fill="#6a4868" stroke="#2a1838" stroke-width="2"/>' +
        '<path d="M 100 88 Q 122 88 122 110 L 100 116 Z" fill="#486878" stroke="#182838" stroke-width="2"/>' +
        '<ellipse cx="90" cy="104" rx="3" ry="4" fill="#e0c0e0"/>' +
        '<ellipse cx="110" cy="104" rx="3" ry="4" fill="#bfe0e8"/>' +
        '<path d="M 90 112 L 110 112" stroke="#2a1838" stroke-width="1.5"/>' +
        // split staff
        '<line x1="48" y1="120" x2="48" y2="220" stroke="#5a4858" stroke-width="4"/>' +
        '<line x1="44" y1="120" x2="52" y2="120" stroke="#d8c068" stroke-width="3"/>'
      );
    }
    if (spriteId === 'the_decimator') {
      return (
        '<ellipse cx="100" cy="244" rx="80" ry="10" fill="rgba(0,0,0,0.6)"/>' +
        // a tall figure draped in strings of zeros
        '<path d="M 70 120 Q 100 100 130 120 L 140 224 L 60 224 Z" fill="#2a3848" stroke="#14202c" stroke-width="2.5"/>' +
        // hanging zero-strands
        (() => { let s=''; const xs=[74,88,100,112,126]; xs.forEach((x,i)=>{ for(let r=0;r<3;r++){ s+='<circle cx="'+x+'" cy="'+(150+r*24+(i%2)*8)+'" r="6" fill="none" stroke="#88c4d8" stroke-width="2"/>'; } }); return s; })() +
        // power glyphs
        '<text x="100" y="210" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="12">×100</text>' +
        // head — a glowing 10 inside a cowl
        '<path d="M 78 120 Q 100 92 122 120 L 118 140 Q 100 130 82 140 Z" fill="#14202c" stroke="#0a1018" stroke-width="2"/>' +
        '<text x="100" y="124" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="14">10ⁿ</text>' +
        '<ellipse cx="91" cy="118" rx="2.5" ry="3.5" fill="#aadcf0"/>' +
        '<ellipse cx="109" cy="118" rx="2.5" ry="3.5" fill="#aadcf0"/>' +
        // arms of beads
        '<path d="M 70 140 Q 46 150 42 184" fill="none" stroke="#2a3848" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M 130 140 Q 154 150 158 184" fill="none" stroke="#2a3848" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="42" cy="184" r="7" fill="none" stroke="#88c4d8" stroke-width="2.5"/>' +
        '<circle cx="158" cy="184" r="7" fill="none" stroke="#88c4d8" stroke-width="2.5"/>'
      );
    }
    if (spriteId === 'babel_engine') {
      return (
        '<defs><radialGradient id="be-core" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#f0d27a"/><stop offset="0.6" stop-color="#cc7838"/><stop offset="1" stop-color="#5a2818"/></radialGradient></defs>' +
        '<ellipse cx="100" cy="246" rx="96" ry="13" fill="rgba(0,0,0,0.7)"/>' +
        // a great tower-machine of mismatched parts (a tower of babel of measures)
        '<polygon points="50,240 60,150 140,150 150,240" fill="#4a3c30" stroke="#1a1208" stroke-width="3"/>' +
        '<polygon points="64,150 72,96 128,96 136,150" fill="#5a4838" stroke="#1a1208" stroke-width="2.5"/>' +
        '<polygon points="76,96 84,56 116,56 124,96" fill="#6a5848" stroke="#1a1208" stroke-width="2"/>' +
        // each tier a different measuring device
        // bottom: gears
        '<circle cx="76" cy="200" r="14" fill="#3a2c1c" stroke="#1a1208" stroke-width="1.5"/>' + (() => { let s=''; for(let i=0;i<8;i++){const a=i*45*Math.PI/180;s+='<rect x="'+(76+Math.cos(a)*16-3)+'" y="'+(200+Math.sin(a)*16-3)+'" width="6" height="6" fill="#3a2c1c"/>';} return s; })() +
        '<circle cx="124" cy="206" r="11" fill="#3a2c1c" stroke="#1a1208" stroke-width="1.5"/>' +
        // mid: a balance + an abacus
        '<line x1="80" y1="120" x2="120" y2="120" stroke="#bfa050" stroke-width="2.5"/>' +
        '<line x1="100" y1="116" x2="100" y2="124" stroke="#bfa050" stroke-width="2"/>' +
        '<path d="M 80 120 L 74 130 L 86 130 Z" fill="none" stroke="#bfa050" stroke-width="1.2"/>' +
        '<path d="M 120 120 L 114 130 L 126 130 Z" fill="none" stroke="#bfa050" stroke-width="1.2"/>' +
        '<line x1="84" y1="134" x2="116" y2="134" stroke="#88c4d8" stroke-width="1"/>' +
        '<circle cx="90" cy="134" r="2" fill="#d4a624"/><circle cx="104" cy="134" r="2" fill="#d4a624"/>' +
        // the glowing core eye (top tier)
        '<circle cx="100" cy="76" r="16" fill="url(#be-core)" stroke="#3a1808" stroke-width="2"/>' +
        '<ellipse cx="94" cy="74" rx="2.5" ry="4" fill="#1a0808"/>' +
        '<ellipse cx="106" cy="74" rx="2.5" ry="4" fill="#1a0808"/>' +
        '<path d="M 92 84 Q 100 90 108 84" stroke="#3a1808" stroke-width="1.5" fill="none"/>' +
        // chaotic floating symbols of every measure
        '<text x="40" y="120" fill="#f0a838" font-family="Cinzel" font-size="11" opacity="0.7">½</text>' +
        '<text x="158" y="130" fill="#88c4d8" font-family="Cinzel" font-size="11" opacity="0.7">km</text>' +
        '<text x="46" y="180" fill="#aab87c" font-family="Cinzel" font-size="11" opacity="0.7">×10</text>' +
        '<text x="150" y="184" fill="#cc8aa0" font-family="Cinzel" font-size="11" opacity="0.7">hr</text>' +
        '<text x="100" y="44" text-anchor="middle" fill="#f0d27a" font-family="Cinzel" font-size="10" opacity="0.7">= ?</text>' +
        // arms
        '<path d="M 60 160 Q 34 162 30 200" fill="none" stroke="#4a3c30" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M 140 160 Q 166 162 170 200" fill="none" stroke="#4a3c30" stroke-width="9" stroke-linecap="round"/>'
      );
    }
    return null;
  },

  // --------------------------------------------------------
  // ACT V — SCENE ILLUSTRATIONS
  // --------------------------------------------------------
  concordCity() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="cc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6890"/><stop offset="0.6" stop-color="#c8a8a0"/><stop offset="1" stop-color="#e8c890"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#cc-sky)"/>' +
      // skyline of mismatched guild-towers (each a different style/color)
      '<rect x="40" y="120" width="50" height="120" fill="#7a4858"/><polygon points="36,120 94,120 65,86" fill="#5a2838"/>' +
      '<rect x="110" y="90" width="44" height="150" fill="#48687a"/><rect x="110" y="90" width="44" height="10" fill="#385868"/><polygon points="106,90 158,90 132,60" fill="#2a4858"/>' +
      '<rect x="172" y="140" width="40" height="100" fill="#6a7a48"/><polygon points="168,140 216,140 192,112" fill="#4a5a2a"/>' +
      '<rect x="600" y="100" width="46" height="140" fill="#8a6a38"/><polygon points="596,100 650,100 623,70" fill="#5a4818"/>' +
      '<rect x="660" y="130" width="42" height="110" fill="#6a4868"/><polygon points="656,130 706,130 681,104" fill="#3a1848"/>' +
      '<rect x="718" y="150" width="40" height="90" fill="#4a7868"/><polygon points="714,150 762,150 738,124" fill="#2a4838"/>' +
      // banners strung between towers (different colors = different guilds)
      '<line x1="65" y1="100" x2="132" y2="76" stroke="#3a2818" stroke-width="1"/>' +
      '<polygon points="80,92 92,90 90,100 80,100" fill="#cc4878"/><polygon points="104,84 116,82 114,92 104,92" fill="#48a0c0"/>' +
      '<line x1="623" y1="84" x2="681" y2="116" stroke="#3a2818" stroke-width="1"/>' +
      '<polygon points="640,92 652,92 650,102 640,100" fill="#aab87c"/><polygon points="660,100 672,102 670,112 660,108" fill="#d4a624"/>' +
      // central plaza ground
      '<rect y="240" width="800" height="120" fill="#b89868"/>' +
      // grand market square with stalls (foreground)
      '<g transform="translate(120,250)">' +
        '<polygon points="-10,30 110,30 100,8 0,8" fill="#cc4878"/>' +
        '<g fill="#e07898">' + (() => { let s=''; for(let i=0;i<6;i++){s+='<polygon points="'+(i*18)+',30 '+(i*18+9)+',30 '+(i*18+7)+',10 '+(i*18+2)+',10"/>';} return s; })() + '</g>' +
        '<rect x="0" y="30" width="100" height="50" fill="#5a4030" stroke="#1a1008" stroke-width="1.5"/>' +
        '<circle cx="20" cy="28" r="4" fill="#d4a624"/><rect x="40" y="22" width="12" height="10" fill="#aab87c"/><circle cx="74" cy="28" r="4" fill="#cc4878"/>' +
      '</g>' +
      '<g transform="translate(560,256)">' +
        '<polygon points="-10,28 110,28 100,8 0,8" fill="#48a0c0"/>' +
        '<g fill="#78c0d8">' + (() => { let s=''; for(let i=0;i<6;i++){s+='<polygon points="'+(i*18)+',28 '+(i*18+9)+',28 '+(i*18+7)+',10 '+(i*18+2)+',10"/>';} return s; })() + '</g>' +
        '<rect x="0" y="28" width="100" height="46" fill="#4a4858" stroke="#1a1008" stroke-width="1.5"/>' +
        '<rect x="16" y="20" width="14" height="12" fill="#d8c068"/><circle cx="56" cy="26" r="4" fill="#88c4d8"/><rect x="74" y="20" width="12" height="12" fill="#cc8aa0"/>' +
      '</g>' +
      // central fountain/monument with a great scale on top
      '<g transform="translate(400,250)">' +
        '<rect x="-30" y="40" width="60" height="40" fill="#9a8868" stroke="#5a4838" stroke-width="1.5"/>' +
        '<rect x="-36" y="36" width="72" height="6" fill="#7a6848"/>' +
        '<rect x="-6" y="0" width="12" height="40" fill="#8a7858"/>' +
        '<line x1="-30" y1="6" x2="30" y2="6" stroke="#bfa050" stroke-width="3"/>' +
        '<line x1="0" y1="-2" x2="0" y2="10" stroke="#bfa050" stroke-width="2"/>' +
        '<path d="M -30 6 L -38 20 L -22 20 Z" fill="none" stroke="#bfa050" stroke-width="1.5"/>' +
        '<path d="M 30 6 L 22 20 L 38 20 Z" fill="none" stroke="#bfa050" stroke-width="1.5"/>' +
      '</g>' +
      // crowds (silhouettes)
      '<g transform="translate(300,310)" opacity="0.8"><rect x="-3" y="0" width="6" height="22" fill="#3a2818"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#3a2818"/></g>' +
      '<g transform="translate(330,316)" opacity="0.8"><rect x="-3" y="0" width="6" height="18" fill="#3a2818"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#3a2818"/></g>' +
      '<g transform="translate(480,312)" opacity="0.8"><rect x="-3" y="0" width="6" height="20" fill="#3a2818"/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#3a2818"/></g>' +
      // doves
      '<path d="M 240 70 Q 248 64 256 70 Q 248 66 240 70" fill="#fff"/>' +
      '<path d="M 520 60 Q 528 54 536 60 Q 528 56 520 60" fill="#fff"/>' +
    '</svg>';
  },

  districtScales() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="ds-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6878"/><stop offset="1" stop-color="#c0b090"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#ds-sky)"/>' +
      // weighhouse buildings
      '<rect x="60" y="110" width="160" height="130" fill="#8a7858" stroke="#3a2818" stroke-width="2"/>' +
      '<polygon points="50,110 230,110 140,70" fill="#5a4838"/>' +
      '<rect x="580" y="120" width="160" height="120" fill="#7a6a50" stroke="#3a2818" stroke-width="2"/>' +
      '<polygon points="570,120 750,120 660,82" fill="#4a3c28"/>' +
      // giant hanging scales everywhere
      '<g transform="translate(300,80)"><line x1="0" y1="0" x2="0" y2="30" stroke="#3a2818" stroke-width="2"/><line x1="-44" y1="30" x2="44" y2="30" stroke="#bfa050" stroke-width="3"/><path d="M -44 30 L -54 52 L -34 52 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.5"/><path d="M 44 30 L 34 52 L 54 52 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.5"/><circle cx="0" cy="30" r="6" fill="#bfa050"/></g>' +
      '<g transform="translate(500,100)"><line x1="0" y1="0" x2="0" y2="24" stroke="#3a2818" stroke-width="2"/><line x1="-34" y1="24" x2="34" y2="24" stroke="#bfa050" stroke-width="2.5"/><path d="M -34 24 L -42 40 L -26 40 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.2"/><path d="M 34 24 L 26 40 L 42 40 Z" fill="#caa84a" stroke="#7a5818" stroke-width="1.2"/></g>' +
      // ground + weight-stones and measuring rods
      '<rect y="240" width="800" height="120" fill="#a89878"/>' +
      '<rect x="120" y="280" width="30" height="40" fill="#5a5048" stroke="#1a1008" stroke-width="1.5"/><text x="135" y="306" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="10">kg</text>' +
      '<rect x="160" y="294" width="22" height="26" fill="#6a6058" stroke="#1a1008" stroke-width="1.5"/><text x="171" y="312" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="8">g</text>' +
      '<line x1="620" y1="250" x2="700" y2="330" stroke="#7a5828" stroke-width="3"/><g stroke="#3a2818" stroke-width="1">' + (() => { let s=''; for(let i=1;i<8;i++){const t=i/8;s+='<line x1="'+(620+80*t)+'" y1="'+(250+80*t-6)+'" x2="'+(620+80*t+6)+'" y2="'+(250+80*t)+'"/>';} return s; })() + '</g>' +
      // measuring-tape banner
      '<path d="M 0 180 Q 200 168 400 180 T 800 180" fill="none" stroke="#d8c068" stroke-width="6"/>' +
      '<g stroke="#7a5818" stroke-width="1">' + (() => { let s=''; for(let x=20;x<800;x+=20){s+='<line x1="'+x+'" y1="176" x2="'+x+'" y2="184"/>';} return s; })() + '</g>' +
      '<circle cx="380" cy="300" r="2" fill="#d4a624"/>' +
    '</svg>';
  },

  districtHalves() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="dh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4868"/><stop offset="1" stop-color="#c098b0"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#dh-sky)"/>' +
      // the Fraction Exchange — a grand hall with pie/bar charts as architecture
      '<rect x="120" y="100" width="560" height="140" fill="#6a5868" stroke="#2a1838" stroke-width="2.5"/>' +
      '<polygon points="100,100 700,100 400,52" fill="#4a3858" stroke="#2a1838" stroke-width="2.5"/>' +
      // columns
      '<g fill="#7a6878" stroke="#2a1838" stroke-width="1.5">' +
        '<rect x="140" y="120" width="20" height="120"/><rect x="240" y="120" width="20" height="120"/><rect x="540" y="120" width="20" height="120"/><rect x="640" y="120" width="20" height="120"/>' +
      '</g>' +
      // great fraction-circle window (split into pieces)
      '<g transform="translate(400,150)">' +
        '<circle r="46" fill="#e0c0e0" stroke="#2a1838" stroke-width="3"/>' +
        '<path d="M 0 0 L 0 -46 A 46 46 0 0 1 40 23 Z" fill="#cc8aa0"/>' +
        '<path d="M 0 0 L 40 23 A 46 46 0 0 1 -40 23 Z" fill="#a868a0"/>' +
        '<line x1="0" y1="0" x2="0" y2="-46" stroke="#2a1838" stroke-width="1.5"/>' +
        '<line x1="0" y1="0" x2="40" y2="23" stroke="#2a1838" stroke-width="1.5"/>' +
        '<line x1="0" y1="0" x2="-40" y2="23" stroke="#2a1838" stroke-width="1.5"/>' +
        '<text x="0" y="-26" text-anchor="middle" fill="#2a1838" font-family="Cinzel" font-size="9">⅓</text>' +
      '</g>' +
      // bar-fraction banners
      '<g transform="translate(200,128)"><rect width="80" height="14" fill="#e0c0e0" stroke="#2a1838" stroke-width="1"/><rect width="20" height="14" fill="#cc8aa0"/><rect x="20" width="20" height="14" fill="#cc8aa0"/><line x1="20" y1="0" x2="20" y2="14" stroke="#2a1838" stroke-width="0.6"/><line x1="40" y1="0" x2="40" y2="14" stroke="#2a1838" stroke-width="0.6"/><line x1="60" y1="0" x2="60" y2="14" stroke="#2a1838" stroke-width="0.6"/></g>' +
      '<g transform="translate(520,128)"><rect width="80" height="14" fill="#e0c0e0" stroke="#2a1838" stroke-width="1"/><rect width="48" height="14" fill="#a868a0"/><g stroke="#2a1838" stroke-width="0.6">' + (() => { let s=''; for(let i=1;i<5;i++){s+='<line x1="'+(i*16)+'" y1="0" x2="'+(i*16)+'" y2="14"/>';} return s; })() + '</g></g>' +
      // ground
      '<rect y="240" width="800" height="120" fill="#9a88a0"/>' +
      '<rect y="240" width="800" height="6" fill="#7a6888"/>' +
      // floor inlaid with a number line
      '<line x1="80" y1="300" x2="720" y2="300" stroke="#5a4868" stroke-width="3"/>' +
      '<g stroke="#5a4868" stroke-width="2" fill="#5a4868" font-family="Cinzel" font-size="9">' + (() => { let s=''; const labels=['0','¼','½','¾','1']; for(let i=0;i<5;i++){const x=80+i*160;s+='<line x1="'+x+'" y1="294" x2="'+x+'" y2="306"/>';s+='<text x="'+x+'" y="320" text-anchor="middle">'+labels[i]+'</text>';} return s; })() + '</g>' +
    '</svg>';
  },

  districtPowers() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="dp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a3848"/><stop offset="1" stop-color="#3a6878"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#dp-sky)"/>' +
      // towers of increasing height (powers of ten)
      '<g stroke="#14202c" stroke-width="2">' +
        '<rect x="60" y="200" width="50" height="40" fill="#2a4858"/><text x="85" y="224" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="9">1</text>' +
        '<rect x="150" y="160" width="50" height="80" fill="#2a4858"/><text x="175" y="200" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="9">10</text>' +
        '<rect x="240" y="110" width="50" height="130" fill="#2a4858"/><text x="265" y="178" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="9">100</text>' +
        '<rect x="330" y="50" width="50" height="190" fill="#2a4858"/><text x="355" y="148" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="9">1000</text>' +
      '</g>' +
      // a great clockwork ×10 wheel on the right
      '<g transform="translate(600,140)"><circle r="70" fill="#1a2c38" stroke="#14202c" stroke-width="3"/>' +
        (() => { let s=''; for(let i=0;i<10;i++){const a=i*36*Math.PI/180;s+='<rect x="'+(Math.cos(a)*74-4)+'" y="'+(Math.sin(a)*74-4)+'" width="8" height="8" fill="#1a2c38" stroke="#14202c" stroke-width="1" transform="rotate('+(i*36)+' '+(Math.cos(a)*74)+' '+(Math.sin(a)*74)+')"/>';} return s; })() +
        '<circle r="50" fill="#244050"/><circle r="16" fill="#14202c"/>' +
        '<text x="0" y="5" text-anchor="middle" fill="#88c4d8" font-family="Cinzel" font-size="16">×10</text>' +
      '</g>' +
      // ground with a place-value chart inlaid
      '<rect y="240" width="800" height="120" fill="#243038"/>' +
      '<g transform="translate(120,270)">' +
        '<rect width="420" height="40" fill="#1a2630" stroke="#14202c" stroke-width="1.5"/>' +
        '<g stroke="#3a5868" stroke-width="1">' + (() => { let s=''; for(let i=1;i<7;i++){s+='<line x1="'+(i*60)+'" y1="0" x2="'+(i*60)+'" y2="40"/>';} return s; })() + '</g>' +
        '<g fill="#88c4d8" font-family="Cinzel" font-size="9" text-anchor="middle">' +
          '<text x="30" y="16">1000</text><text x="90" y="16">100</text><text x="150" y="16">10</text><text x="210" y="16">1</text><text x="270" y="16">0.1</text><text x="330" y="16">.01</text><text x="390" y="16">.001</text>' +
        '</g>' +
        '<circle cx="150" cy="30" r="4" fill="#d4a624"/>' +
      '</g>' +
      // floating zeros drifting up
      '<circle cx="200" cy="90" r="8" fill="none" stroke="#88c4d8" stroke-width="2" opacity="0.6"/>' +
      '<circle cx="440" cy="70" r="10" fill="none" stroke="#88c4d8" stroke-width="2" opacity="0.6"/>' +
      '<circle cx="500" cy="120" r="6" fill="none" stroke="#88c4d8" stroke-width="2" opacity="0.5"/>' +
    '</svg>';
  },

  babelChamber() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="bc-glow" cx="0.5" cy="0.42" r="0.6"><stop offset="0" stop-color="#f0a838" stop-opacity="0.4"/><stop offset="0.6" stop-color="#5a3818" stop-opacity="0.3"/><stop offset="1" stop-color="#0e0a06" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#14100a"/>' +
      '<rect width="800" height="360" fill="url(#bc-glow)"/>' +
      // vast round hall, walls covered in every measure and symbol
      '<path d="M 0 60 Q 400 0 800 60 L 800 280 L 0 280 Z" fill="#2a2014" stroke="#1a1208" stroke-width="2"/>' +
      // graffiti of mismatched units around the walls
      '<g fill="#5a4830" font-family="Cinzel" font-size="13" opacity="0.55">' +
        '<text x="60" y="100">½</text><text x="140" y="80">km</text><text x="220" y="110">×100</text><text x="300" y="70">¾</text><text x="500" y="72">hr</text><text x="580" y="104">mL</text><text x="660" y="80">⅗</text><text x="730" y="108">kg</text>' +
      '</g>' +
      // tiers of broken stairs spiraling up (a ruined tower of babel)
      (() => { let s=''; for(let i=0;i<6;i++){ const y=70+i*30; const wd=360-i*40; s+='<rect x="'+(400-wd/2)+'" y="'+y+'" width="'+wd+'" height="14" fill="'+((i%2)?'#3a2c1c':'#4a3a26')+'" stroke="#1a1208" stroke-width="1.5"/>'; } return s; })() +
      // floor
      '<polygon points="0,280 800,280 760,360 40,360" fill="#1a1208"/>' +
      // central dais
      '<ellipse cx="400" cy="300" rx="120" ry="26" fill="#2a2014" stroke="#1a1208" stroke-width="2"/>' +
      '<ellipse cx="400" cy="296" rx="96" ry="18" fill="#3a2c1c"/>' +
      '<ellipse cx="400" cy="294" rx="64" ry="11" fill="#5a4830"/>' +
      // shafts of mismatched colored light from above
      '<polygon points="200,60 240,280 180,280" fill="rgba(204,120,160,0.12)"/>' +
      '<polygon points="400,40 430,280 370,280" fill="rgba(136,196,216,0.12)"/>' +
      '<polygon points="600,60 660,280 580,280" fill="rgba(170,184,124,0.12)"/>' +
      // floating equation fragments
      '<text x="300" y="150" fill="#f0a838" font-family="Cinzel" font-size="14" opacity="0.5">⅓ + ¼ = ?</text>' +
      '<text x="470" y="130" fill="#88c4d8" font-family="Cinzel" font-size="14" opacity="0.5">3 km = ? m</text>' +
      // embers
      '<circle cx="320" cy="180" r="1.5" fill="#f0a838"/><circle cx="500" cy="170" r="1.5" fill="#f0d27a"/>' +
    '</svg>';
  },

  concordAccord() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="ca-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a78a8"/><stop offset="0.5" stop-color="#a8c0d8"/><stop offset="1" stop-color="#f0e3bd"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#ca-sky)"/>' +
      // bright sun over the reconciled city
      '<circle cx="400" cy="120" r="46" fill="#f0e3bd"/><circle cx="400" cy="120" r="74" fill="#f0e3bd" opacity="0.2"/>' +
      // the guild towers now flying a SINGLE shared banner
      '<rect x="120" y="120" width="44" height="120" fill="#7a6858"/><rect x="200" y="100" width="44" height="140" fill="#7a6858"/><rect x="560" y="110" width="44" height="130" fill="#7a6858"/><rect x="640" y="130" width="44" height="110" fill="#7a6858"/>' +
      // shared banners (all the same now — gold)
      '<polygon points="142,124 142,150 158,142 158,124" fill="#d4a624"/>' +
      '<polygon points="222,104 222,130 238,122 238,104" fill="#d4a624"/>' +
      '<polygon points="582,114 582,140 598,132 598,114" fill="#d4a624"/>' +
      '<polygon points="662,134 662,160 678,152 678,134" fill="#d4a624"/>' +
      // a great rope of bunting joining every tower
      '<path d="M 142 120 Q 400 80 678 130" fill="none" stroke="#3a2818" stroke-width="1.2"/>' +
      (() => { let s=''; const cols=['#cc4878','#48a0c0','#aab87c','#d4a624','#a868a0']; for(let i=0;i<14;i++){const t=i/14;const x=142+(678-142)*t;const y=120+(130-120)*t-Math.sin(t*Math.PI)*36;s+='<polygon points="'+x+','+y+' '+(x+10)+','+y+' '+(x+5)+','+(y+12)+'" fill="'+cols[i%5]+'"/>';} return s; })() +
      // ground / plaza full of celebrating crowd
      '<rect y="240" width="800" height="120" fill="#c0a878"/>' +
      '<g opacity="0.85" fill="#3a2818">' + (() => { let s=''; for(let i=0;i<12;i++){const x=120+i*50;const h=18+ (i%3)*3; s+='<rect x="'+(x-3)+'" y="'+(300-h)+'" width="6" height="'+h+'"/><ellipse cx="'+x+'" cy="'+(296-h)+'" rx="4" ry="5"/>'; } return s; })() + '</g>' +
      // two heroes in the middle, raised
      '<g transform="translate(390,290)"><rect x="-3" y="0" width="6" height="24" fill="#2a1810"/><ellipse cx="0" cy="-4" rx="5" ry="6" fill="#2a1810"/></g>' +
      '<g transform="translate(420,296)"><rect x="-3" y="0" width="6" height="20" fill="#2a1810"/><ellipse cx="0" cy="-4" rx="4" ry="5" fill="#2a1810"/></g>' +
      // confetti
      '<rect x="300" y="120" width="4" height="4" fill="#cc4878"/><rect x="500" y="140" width="4" height="4" fill="#48a0c0"/><rect x="360" y="100" width="4" height="4" fill="#aab87c"/><rect x="460" y="110" width="4" height="4" fill="#d4a624"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // ACT VI — NPC + antagonist
  // --------------------------------------------------------
  astronomer_vega(size) {
    const w = size || 80;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="vega-bg"><stop offset="0" stop-color="#3a3a68"/><stop offset="1" stop-color="#0e0e22"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#vega-bg)"/>' +
      // stars behind
      '<circle cx="24" cy="26" r="1.2" fill="#fff"/><circle cx="74" cy="22" r="1" fill="#fff"/><circle cx="80" cy="60" r="1.2" fill="#fff"/><circle cx="20" cy="64" r="1" fill="#fff"/>' +
      // hood/robe deep blue
      '<path d="M 28 46 Q 50 18 72 46 L 70 80 Q 50 70 30 80 Z" fill="#2a2a58"/>' +
      // star-circlet
      '<path d="M 34 40 Q 50 30 66 40" fill="none" stroke="#d4a624" stroke-width="1.5"/>' +
      '<polygon points="50,28 52,34 58,34 53,38 55,44 50,40 45,44 47,38 42,34 48,34" fill="#f0d27a"/>' +
      // face (older, serene, deep brown skin)
      '<ellipse cx="50" cy="54" rx="15" ry="17" fill="#8a6248" stroke="#2a1810" stroke-width="0.8"/>' +
      '<ellipse cx="35" cy="54" rx="3" ry="4" fill="#8a6248"/>' +
      '<ellipse cx="65" cy="54" rx="3" ry="4" fill="#8a6248"/>' +
      // calm starlit eyes
      '<ellipse cx="44" cy="54" rx="2" ry="2.4" fill="#1a1028"/>' +
      '<ellipse cx="56" cy="54" rx="2" ry="2.4" fill="#1a1028"/>' +
      '<circle cx="44.5" cy="53.3" r="0.7" fill="#a8c4f0"/><circle cx="56.5" cy="53.3" r="0.7" fill="#a8c4f0"/>' +
      '<path d="M 44 64 Q 50 67 56 64" stroke="#2a1810" stroke-width="1" fill="none"/>' +
      // collar with a small astrolabe
      '<path d="M 30 80 Q 50 90 70 80 L 74 96 L 26 96 Z" fill="#1a1a3a" stroke="#0a0a1a" stroke-width="1"/>' +
      '<circle cx="50" cy="86" r="4" fill="none" stroke="#d4a624" stroke-width="1"/>' +
      '<line x1="46" y1="86" x2="54" y2="86" stroke="#d4a624" stroke-width="0.6"/>' +
      '<line x1="50" y1="82" x2="50" y2="90" stroke="#d4a624" stroke-width="0.6"/>' +
    '</svg>';
  },

  _enemyAct6(spriteId) {
    if (spriteId === 'grid_wisp') {
      return (
        '<ellipse cx="100" cy="238" rx="30" ry="5" fill="rgba(0,0,0,0.4)"/>' +
        // a floating lattice-spirit
        '<g stroke="#88c4f0" stroke-width="1.5" opacity="0.85" fill="none">' +
        '<rect x="66" y="100" width="68" height="68"/>' +
        '<line x1="66" y1="123" x2="134" y2="123"/><line x1="66" y1="146" x2="134" y2="146"/>' +
        '<line x1="89" y1="100" x2="89" y2="168"/><line x1="111" y1="100" x2="111" y2="168"/>' +
        '</g>' +
        // glowing node "face" at a lattice point
        '<circle cx="111" cy="123" r="9" fill="#1a2a48"/>' +
        '<circle cx="111" cy="123" r="5" fill="#a8d4ff"/>' +
        '<ellipse cx="100" cy="134" rx="3" ry="4" fill="#a8d4ff"/>' +
        '<ellipse cx="116" cy="134" rx="3" ry="4" fill="#a8d4ff"/>' +
        // trailing coordinate sparks
        '<circle cx="70" cy="186" r="3" fill="#88c4f0"/><circle cx="120" cy="190" r="2.5" fill="#88c4f0"/>' +
        '<text x="138" y="110" fill="#88c4f0" font-family="Cinzel" font-size="9" opacity="0.8">(x,y)</text>'
      );
    }
    if (spriteId === 'glyph_moth') {
      return (
        '<ellipse cx="100" cy="236" rx="40" ry="6" fill="rgba(0,0,0,0.4)"/>' +
        // wings shaped like quadrilaterals
        '<polygon points="100,150 46,110 30,168 92,182" fill="#5a6aa8" stroke="#2a2a58" stroke-width="2" opacity="0.9"/>' +
        '<polygon points="100,150 154,110 170,168 108,182" fill="#5a6aa8" stroke="#2a2a58" stroke-width="2" opacity="0.9"/>' +
        '<polygon points="100,150 60,182 92,210" fill="#48588a" stroke="#2a2a58" stroke-width="1.5"/>' +
        '<polygon points="100,150 140,182 108,210" fill="#48588a" stroke="#2a2a58" stroke-width="1.5"/>' +
        // wing geometry marks
        '<polygon points="56,130 78,124 74,152 52,156" fill="none" stroke="#a8c4f0" stroke-width="1"/>' +
        '<polygon points="144,130 122,124 126,152 148,156" fill="none" stroke="#a8c4f0" stroke-width="1"/>' +
        // body
        '<ellipse cx="100" cy="158" rx="8" ry="26" fill="#2a2a48" stroke="#14142a" stroke-width="1.5"/>' +
        '<circle cx="100" cy="138" r="9" fill="#3a3a5a" stroke="#14142a" stroke-width="1.5"/>' +
        '<circle cx="95" cy="136" r="2.5" fill="#f0d27a"/><circle cx="105" cy="136" r="2.5" fill="#f0d27a"/>' +
        // antennae
        '<path d="M 96 130 Q 88 116 80 116" fill="none" stroke="#14142a" stroke-width="1.5"/>' +
        '<path d="M 104 130 Q 112 116 120 116" fill="none" stroke="#14142a" stroke-width="1.5"/>'
      );
    }
    if (spriteId === 'star_sentinel') {
      return (
        '<ellipse cx="100" cy="242" rx="50" ry="7" fill="rgba(0,0,0,0.45)"/>' +
        // a guardian of star-iron, body a big star
        '<polygon points="100,40 116,92 172,92 126,124 144,178 100,146 56,178 74,124 28,92 84,92" fill="#3a4a78" stroke="#1a2240" stroke-width="2.5"/>' +
        '<polygon points="100,60 110,96 148,96 117,118 129,156 100,134 71,156 83,118 52,96 90,96" fill="#4a5a92"/>' +
        // core face
        '<circle cx="100" cy="108" r="20" fill="#1a2240" stroke="#88c4f0" stroke-width="2"/>' +
        '<ellipse cx="92" cy="106" rx="3" ry="4.5" fill="#a8d4ff"/>' +
        '<ellipse cx="108" cy="106" rx="3" ry="4.5" fill="#a8d4ff"/>' +
        '<path d="M 92 118 Q 100 124 108 118" stroke="#88c4f0" stroke-width="2" fill="none"/>' +
        // legs
        '<line x1="84" y1="176" x2="78" y2="220" stroke="#3a4a78" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="116" y1="176" x2="122" y2="220" stroke="#3a4a78" stroke-width="6" stroke-linecap="round"/>' +
        // sparkle points
        '<circle cx="100" cy="40" r="2" fill="#fff"/><circle cx="172" cy="92" r="1.5" fill="#fff"/><circle cx="28" cy="92" r="1.5" fill="#fff"/>'
      );
    }
    if (spriteId === 'axis_warden') {
      return (
        '<ellipse cx="100" cy="244" rx="72" ry="9" fill="rgba(0,0,0,0.55)"/>' +
        // a colossus made of two crossed axes (x and y), grid for a torso
        '<rect x="36" y="150" width="128" height="6" fill="#5a3a1a"/>' + // x-axis arm
        '<rect x="97" y="60" width="6" height="160" fill="#5a3a1a"/>' +  // y-axis spine
        // grid torso
        '<rect x="70" y="120" width="60" height="76" fill="#1a2a40" stroke="#0a1830" stroke-width="2"/>' +
        '<g stroke="#3a6a9a" stroke-width="1">' +
        '<line x1="70" y1="139" x2="130" y2="139"/><line x1="70" y1="158" x2="130" y2="158"/><line x1="70" y1="177" x2="130" y2="177"/>' +
        '<line x1="90" y1="120" x2="90" y2="196"/><line x1="110" y1="120" x2="110" y2="196"/>' +
        '</g>' +
        // plotted-point "heart"
        '<circle cx="110" cy="158" r="6" fill="#9a2828"/>' +
        // axis number ticks
        '<g fill="#caa86a" font-family="Cinzel" font-size="8" text-anchor="middle">' +
        '<text x="150" y="148">x</text><text x="108" y="74">y</text>' +
        '</g>' +
        // head
        '<rect x="84" y="74" width="32" height="34" rx="3" fill="#2a3a58" stroke="#0a1830" stroke-width="2"/>' +
        '<rect x="90" y="86" width="20" height="6" fill="#0a1426"/>' +
        '<rect x="93" y="87" width="5" height="4" fill="#a8d4ff"/><rect x="103" y="87" width="5" height="4" fill="#a8d4ff"/>' +
        // arms ending in compass-points
        '<polygon points="36,150 26,144 26,162" fill="#888" stroke="#1a1830" stroke-width="1"/>' +
        '<polygon points="164,150 174,144 174,162" fill="#888" stroke="#1a1830" stroke-width="1"/>' +
        // legs
        '<rect x="80" y="196" width="14" height="26" fill="#2a3a58"/>' +
        '<rect x="106" y="196" width="14" height="26" fill="#2a3a58"/>'
      );
    }
    if (spriteId === 'the_nullity') {
      return (
        '<defs>' +
          '<radialGradient id="null-void" cx="0.5" cy="0.42" r="0.6">' +
            '<stop offset="0" stop-color="#0a0a14"/>' +
            '<stop offset="0.7" stop-color="#1a1430"/>' +
            '<stop offset="1" stop-color="#3a2a58"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="246" rx="98" ry="13" fill="rgba(0,0,0,0.7)"/>' +
        // a great robed scholar of erasure, a hole in reality where the chest should be
        '<path d="M 40 244 Q 24 130 70 92 Q 100 56 130 92 Q 176 130 160 244 Z" fill="#1a1430" stroke="#0a0818" stroke-width="3"/>' +
        // robe folds glowing with un-written math (faded symbols)
        '<g fill="#3a2a58" font-family="Cinzel" font-size="12" opacity="0.6">' +
        '<text x="60" y="160">∑</text><text x="128" y="150">π</text><text x="66" y="200">√</text><text x="124" y="206">∞</text><text x="92" y="230">×</text>' +
        '</g>' +
        // the void wound at center, swallowing symbols
        '<circle cx="100" cy="150" r="34" fill="url(#null-void)" stroke="#3a2a58" stroke-width="2"/>' +
        '<circle cx="100" cy="150" r="22" fill="#08060e"/>' +
        // a single eye of cold light deep in the void
        '<ellipse cx="100" cy="150" rx="6" ry="9" fill="#a8c4f0"/>' +
        '<ellipse cx="100" cy="150" rx="2.5" ry="6" fill="#08060e"/>' +
        '<circle cx="99" cy="146" r="1" fill="#fff"/>' +
        // hood — empty but for two distant star-eyes
        '<path d="M 70 92 Q 100 50 130 92 L 124 120 Q 100 104 76 120 Z" fill="#0a0818" stroke="#05040c" stroke-width="2"/>' +
        '<circle cx="88" cy="100" r="2.5" fill="#a8c4f0"/>' +
        '<circle cx="112" cy="100" r="2.5" fill="#a8c4f0"/>' +
        // crown of broken numerals
        '<g fill="#5a4a78">' +
        '<polygon points="70,92 64,66 78,84"/>' +
        '<polygon points="100,80 100,52 110,76"/>' +
        '<polygon points="130,92 136,66 122,84"/>' +
        '</g>' +
        // the un-writing quill in one shadow-hand
        '<path d="M 150 150 Q 176 120 188 84" fill="none" stroke="#3a2a58" stroke-width="3"/>' +
        '<path d="M 188 84 Q 192 78 196 80 L 190 90 Z" fill="#a8c4f0"/>' +
        // erasing shadow-hand
        '<path d="M 50 160 Q 24 168 18 206" fill="none" stroke="#1a1430" stroke-width="10" stroke-linecap="round"/>' +
        // a smear of "erased" reality at the quill tip
        '<rect x="150" y="120" width="40" height="10" fill="#08060e" opacity="0.5" transform="rotate(-40 170 125)"/>' +
        // surrounding voided stars
        '<circle cx="30" cy="80" r="1.5" fill="#a8c4f0"/><circle cx="176" cy="200" r="1.5" fill="#a8c4f0"/><circle cx="40" cy="200" r="1" fill="#a8c4f0"/>'
      );
    }
    return null;
  },

  // --------------------------------------------------------
  // ACT VI — SCENE ILLUSTRATIONS
  // --------------------------------------------------------
  skyOutpost() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="so-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a3a"/><stop offset="0.6" stop-color="#3a3a68"/><stop offset="1" stop-color="#8a6a78"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#so-sky)"/>' +
      // stars
      (() => { let s=''; const pts=[[60,40],[140,28],[220,60],[300,34],[420,50],[520,30],[620,56],[700,36],[760,70],[100,90],[360,86],[660,92]]; pts.forEach((p,i)=>{ s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i%3?1:1.6)+'" fill="#fff"/>'; }); return s; })() +
      // a big ringed planet low on the horizon
      '<circle cx="660" cy="150" r="44" fill="#c89878" opacity="0.85"/>' +
      '<ellipse cx="660" cy="150" rx="70" ry="14" fill="none" stroke="#e0c0a0" stroke-width="3" opacity="0.7"/>' +
      // clouds far below
      '<ellipse cx="120" cy="250" rx="120" ry="22" fill="#c0b0c0" opacity="0.5"/>' +
      '<ellipse cx="520" cy="270" rx="160" ry="26" fill="#b0a0b8" opacity="0.45"/>' +
      // the outpost — a small observatory on a floating star-iron platform
      '<rect y="280" width="800" height="80" fill="#2a2a48"/>' +
      '<polygon points="0,280 800,280 760,300 40,300" fill="#3a3a5a"/>' +
      '<g transform="translate(330,180)">' +
        '<rect x="0" y="40" width="140" height="60" fill="#3a3a5a" stroke="#14142a" stroke-width="2"/>' +
        '<path d="M -6 40 Q 70 -6 146 40 Z" fill="#4a4a72" stroke="#14142a" stroke-width="2"/>' +
        // dome slit + telescope
        '<line x1="70" y1="0" x2="70" y2="40" stroke="#14142a" stroke-width="3"/>' +
        '<line x1="70" y1="20" x2="110" y2="-12" stroke="#888" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="112" cy="-14" r="5" fill="#1a2a40" stroke="#888" stroke-width="2"/>' +
        // glowing windows
        '<rect x="20" y="58" width="20" height="26" fill="#a8c4f0"/>' +
        '<rect x="100" y="58" width="20" height="26" fill="#a8c4f0"/>' +
        '<rect x="60" y="64" width="20" height="36" fill="#2a2a48"/>' +
      '</g>' +
      // the Sky-Bridge stretching up into the dark on the right (a glowing grid)
      '<g opacity="0.7" stroke="#88c4f0" stroke-width="1.2" fill="none">' +
        '<path d="M 560 300 L 700 60"/>' +
        '<path d="M 620 300 L 740 60"/>' +
        '<path d="M 560 300 L 620 300 M 575 240 L 632 240 M 590 180 L 660 180 M 605 120 L 690 120 M 700 60 L 740 60"/>' +
      '</g>' +
      '<text x="690" y="50" fill="#88c4f0" font-family="Cinzel" font-size="10" opacity="0.8">to the Summit ↑</text>' +
      // lantern by the door
      '<g transform="translate(300,300)"><line x1="0" y1="-30" x2="0" y2="0" stroke="#14142a" stroke-width="2"/><rect x="-6" y="-44" width="12" height="14" fill="#3a3a5a" stroke="#14142a"/><rect x="-4" y="-42" width="8" height="9" fill="#ffcc55"/><circle cy="-37" r="26" fill="#ffaa33" opacity="0.14"/></g>' +
    '</svg>';
  },

  skyBridge() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="sb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a20"/><stop offset="1" stop-color="#2a2a50"/></linearGradient></defs>' +
      '<rect width="800" height="360" fill="url(#sb-sky)"/>' +
      // dense starfield
      (() => { let s=''; const pts=[[40,30],[120,60],[200,24],[280,80],[360,40],[440,70],[520,30],[600,64],[680,34],[760,60],[80,140],[300,160],[520,150],[700,140],[160,220],[620,210]]; pts.forEach((p,i)=>{ s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i%4?1:1.8)+'" fill="#fff" opacity="'+(0.5+0.5*((i%3)/2))+'"/>'; }); return s; })() +
      // nebula wash
      '<ellipse cx="240" cy="120" rx="180" ry="80" fill="#5a3a78" opacity="0.18"/>' +
      '<ellipse cx="600" cy="220" rx="200" ry="90" fill="#3a5a78" opacity="0.16"/>' +
      // the great Sky-Bridge: a vast coordinate lattice receding to a vanishing point
      '<g stroke="#88c4f0" stroke-width="1.5" opacity="0.9" fill="none">' +
        // horizontal rungs (perspective — closer = lower & wider)
        (() => { let s=''; const rows=[[40,330,760,330],[110,288,690,288],[170,250,630,250],[222,216,578,216],[266,186,534,186],[304,160,496,160],[336,138,464,138],[362,120,438,120]]; rows.forEach(r=>{ s+='<line x1="'+r[0]+'" y1="'+r[1]+'" x2="'+r[2]+'" y2="'+r[3]+'"/>'; }); return s; })() +
        // converging rails
        '<line x1="40" y1="330" x2="362" y2="120"/>' +
        '<line x1="760" y1="330" x2="438" y2="120"/>' +
        '<line x1="180" y1="330" x2="378" y2="120"/>' +
        '<line x1="620" y1="330" x2="422" y2="120"/>' +
        '<line x1="320" y1="330" x2="392" y2="120"/>' +
        '<line x1="480" y1="330" x2="408" y2="120"/>' +
      '</g>' +
      // glowing nodes at lattice intersections
      '<circle cx="40" cy="330" r="4" fill="#a8d4ff"/><circle cx="760" cy="330" r="4" fill="#a8d4ff"/>' +
      '<circle cx="222" cy="216" r="3" fill="#a8d4ff"/><circle cx="578" cy="216" r="3" fill="#a8d4ff"/>' +
      '<circle cx="400" cy="120" r="5" fill="#f0e3bd"/>' +
      // a distant gate of light at the vanishing point (the summit)
      '<rect x="384" y="92" width="32" height="30" rx="3" fill="#f0e3bd" opacity="0.5"/>' +
      '<circle cx="400" cy="108" r="40" fill="#a8c4f0" opacity="0.12"/>' +
      // floating shards of broken bridge
      '<polygon points="120,180 150,170 162,196 132,206" fill="#2a3a58" stroke="#1a2a40" stroke-width="1"/>' +
      '<polygon points="650,170 680,160 692,186 662,196" fill="#2a3a58" stroke="#1a2a40" stroke-width="1"/>' +
      '<text x="400" y="84" text-anchor="middle" fill="#a8c4f0" font-family="Cinzel" font-size="9" opacity="0.7">(?, ?)</text>' +
    '</svg>';
  },

  nullityVoid() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="nv-void" cx="0.5" cy="0.46" r="0.62"><stop offset="0" stop-color="#1a1430"/><stop offset="0.55" stop-color="#0a0818"/><stop offset="1" stop-color="#05040c"/></radialGradient></defs>' +
      '<rect width="800" height="360" fill="#05040c"/>' +
      '<rect width="800" height="360" fill="url(#nv-void)"/>' +
      // the summit platform — a single glowing coordinate grid floating in the void
      '<g transform="translate(400,250)">' +
        '<g stroke="#3a4a78" stroke-width="1.5" opacity="0.85" fill="none">' +
          (() => { let s=''; for(let i=-4;i<=4;i++){ const x=i*40; s+='<line x1="'+x+'" y1="-70" x2="'+(x*0.5)+'" y2="40"/>'; } for(let j=0;j<=4;j++){ const y=-70+j*28; const wd=160-j*20; s+='<line x1="'+(-wd)+'" y1="'+y+'" x2="'+wd+'" y2="'+y+'"/>'; } return s; })() +
        '</g>' +
        // origin glow
        '<circle cx="0" cy="40" r="6" fill="#a8c4f0"/>' +
      '</g>' +
      // the Codex pages orbiting overhead, reuniting
      (() => { let s=''; const pts=[[300,90],[360,70],[420,66],[480,78],[400,50],[340,110]]; pts.forEach((p,i)=>{ s+='<g transform="translate('+p[0]+','+p[1]+') rotate('+(i*12-30)+')"><rect x="-10" y="-13" width="20" height="26" fill="#f0e3bd" stroke="#7a5818" stroke-width="1"/><line x1="-6" y1="-7" x2="6" y2="-7" stroke="#5a3818" stroke-width="0.6"/><line x1="-6" y1="-2" x2="6" y2="-2" stroke="#5a3818" stroke-width="0.6"/></g>'; }); return s; })() +
      // beams connecting the pages
      '<g stroke="#d4a624" stroke-width="1" opacity="0.5">' +
        '<line x1="300" y1="90" x2="360" y2="70"/><line x1="360" y1="70" x2="420" y2="66"/><line x1="420" y1="66" x2="480" y2="78"/><line x1="400" y1="50" x2="360" y2="70"/><line x1="340" y1="110" x2="300" y2="90"/>' +
      '</g>' +
      // erased "holes" in space — patches of pure nothing
      '<circle cx="120" cy="120" r="26" fill="#000"/>' +
      '<circle cx="680" cy="160" r="34" fill="#000"/>' +
      '<circle cx="200" cy="280" r="18" fill="#000"/>' +
      // faded floating symbols being un-written near the holes
      '<text x="150" y="100" fill="#2a2448" font-family="Cinzel" font-size="14" opacity="0.6">∑</text>' +
      '<text x="640" y="130" fill="#2a2448" font-family="Cinzel" font-size="14" opacity="0.6">π</text>' +
      // distant cold stars
      '<circle cx="60" cy="50" r="1.2" fill="#a8c4f0"/><circle cx="740" cy="60" r="1.4" fill="#a8c4f0"/><circle cx="520" cy="40" r="1" fill="#a8c4f0"/>' +
    '</svg>';
  },

  finaleVista() {
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="fv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a78"/><stop offset="0.45" stop-color="#e0a060"/><stop offset="0.75" stop-color="#f0d27a"/><stop offset="1" stop-color="#a8c0d8"/></linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#fv-sky)"/>' +
      // great rising sun
      '<circle cx="400" cy="210" r="90" fill="#f0e3bd"/><circle cx="400" cy="210" r="140" fill="#f0e3bd" opacity="0.22"/>' +
      // last stars fading at the top
      '<circle cx="80" cy="30" r="1.4" fill="#fff" opacity="0.7"/><circle cx="200" cy="20" r="1" fill="#fff" opacity="0.6"/><circle cx="640" cy="26" r="1.4" fill="#fff" opacity="0.7"/>' +
      // the restored Sky-Bridge, whole and gleaming, arcing across the sky
      '<g stroke="#d4a624" stroke-width="2" opacity="0.8" fill="none">' +
        '<path d="M 0 200 Q 400 60 800 200"/>' +
        '<path d="M 0 214 Q 400 74 800 214"/>' +
        (() => { let s=''; for(let i=1;i<16;i++){ const t=i/16; const x=t*800; const y=200-Math.sin(t*Math.PI)*140 + 7; s+='<line x1="'+x+'" y1="'+(y-7)+'" x2="'+x+'" y2="'+(y+7)+'"/>'; } return s; })() +
      '</g>' +
      // the lands below, all six restored, as a peaceful montage of silhouettes
      '<rect y="240" width="800" height="120" fill="#3a4838"/>' +
      // Numeria tower (l), quarry, sea, foundry, vault well, concord, all tiny
      '<g fill="#1a2418" opacity="0.9">' +
        '<rect x="60" y="210" width="14" height="40"/><polygon points="56,210 78,210 67,194"/>' + // tower
        '<polygon points="140,250 170,224 200,250"/>' + // quarry hill
        '<path d="M 240 250 q 20 -10 40 0 q 20 -10 40 0 l 0 6 -80 0 z"/>' + // sea waves
        '<rect x="360" y="220" width="12" height="30"/><rect x="376" y="214" width="12" height="36"/>' + // foundry stacks
        '<rect x="460" y="232" width="30" height="18"/>' + // vault
        '<rect x="560" y="216" width="12" height="34"/><rect x="576" y="222" width="12" height="28"/><rect x="592" y="210" width="12" height="40"/>' + // concord towers
        '<rect x="700" y="224" width="12" height="26"/><polygon points="696,224 716,224 706,210"/>' +
      '</g>' +
      // two heroes + companions on a near ridge, watching
      '<g transform="translate(360,300)" opacity="0.95"><rect x="-3" y="0" width="6" height="26" fill="#1a1208"/><ellipse cx="0" cy="-5" rx="5" ry="6" fill="#1a1208"/><line x1="6" y1="-10" x2="6" y2="16" stroke="#1a1208" stroke-width="1.5"/></g>' +
      '<g transform="translate(392,306)" opacity="0.95"><rect x="-3" y="0" width="6" height="22" fill="#1a1208"/><ellipse cx="0" cy="-4" rx="4" ry="5" fill="#1a1208"/></g>' +
      '<g transform="translate(420,302)" opacity="0.95"><rect x="-3" y="0" width="6" height="24" fill="#1a1208"/><ellipse cx="0" cy="-4" rx="4" ry="5" fill="#1a1208"/></g>' +
      // doves rising
      '<path d="M 240 90 Q 248 84 256 90 Q 248 86 240 90" fill="#fff"/>' +
      '<path d="M 540 80 Q 548 74 556 80 Q 548 76 540 80" fill="#fff"/>' +
      '<path d="M 300 60 Q 308 54 316 60 Q 308 56 300 60" fill="#fff"/>' +
    '</svg>';
  },

  // --------------------------------------------------------
  // COORDINATE GRID (Act VI) — shared by combat grid-click + figures
  // viewBox 0 0 340 340; origin (44,296); axis length 272 over `size` units
  // px(gx) = 44 + gx*step ; py(gy) = 296 - gy*step ; step = 272/size
  // --------------------------------------------------------
  GRID_VB: 340,
  GRID_OX: 44,
  GRID_OY: 296,
  GRID_LEN: 272,
  coordGrid(size, opts) {
    size = size || 10;
    opts = opts || {};
    const step = this.GRID_LEN / size;
    const px = (gx) => this.GRID_OX + gx * step;
    const py = (gy) => this.GRID_OY - gy * step;
    let s = '<svg class="coord-grid-svg" width="100%" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" style="max-width:340px;touch-action:manipulation;">';
    s += '<rect x="0" y="0" width="340" height="340" fill="#f4ecd0" rx="6"/>';
    // gridlines
    s += '<g stroke="#caa86a" stroke-width="1">';
    for (let i = 0; i <= size; i++) {
      s += '<line x1="' + px(i) + '" y1="' + py(0) + '" x2="' + px(i) + '" y2="' + py(size) + '"/>';
      s += '<line x1="' + px(0) + '" y1="' + py(i) + '" x2="' + px(size) + '" y2="' + py(i) + '"/>';
    }
    s += '</g>';
    // axes
    s += '<line x1="' + px(0) + '" y1="' + py(0) + '" x2="' + px(size) + '" y2="' + py(0) + '" stroke="#5a3a1a" stroke-width="2.5"/>';
    s += '<line x1="' + px(0) + '" y1="' + py(0) + '" x2="' + px(0) + '" y2="' + py(size) + '" stroke="#5a3a1a" stroke-width="2.5"/>';
    // axis numbers
    s += '<g fill="#5a3a1a" font-family="Cinzel,serif" font-size="9" text-anchor="middle">';
    for (let i = 0; i <= size; i++) {
      if (i % (size > 10 ? 2 : 1) === 0) {
        s += '<text x="' + px(i) + '" y="' + (this.GRID_OY + 16) + '">' + i + '</text>';
        if (i > 0) s += '<text x="' + (this.GRID_OX - 12) + '" y="' + (py(i) + 3) + '">' + i + '</text>';
      }
    }
    s += '</g>';
    // axis labels
    s += '<text x="' + px(size) + '" y="' + (this.GRID_OY + 28) + '" fill="#7a1818" font-family="Cinzel,serif" font-size="10" text-anchor="end">x</text>';
    s += '<text x="' + (this.GRID_OX - 22) + '" y="' + py(size) + '" fill="#7a1818" font-family="Cinzel,serif" font-size="10">y</text>';
    // paths
    (opts.path || []).forEach(p => {
      s += '<line x1="' + px(p.from[0]) + '" y1="' + py(p.from[1]) + '" x2="' + px(p.to[0]) + '" y2="' + py(p.to[1]) + '" stroke="#9a2828" stroke-width="2.5" stroke-dasharray="5 3"/>';
    });
    // markers
    (opts.markers || []).forEach(m => {
      const cx = px(m.x), cy = py(m.y), col = m.color || '#9a2828';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + col + '" stroke="#3a1010" stroke-width="1.5"/>';
      if (m.label) s += '<text x="' + (cx + 9) + '" y="' + (cy - 7) + '" fill="#3a2010" font-family="Cinzel,serif" font-size="10" font-weight="bold">' + m.label + '</text>';
    });
    // interactive hint dot layer placeholder (engine adds the user marker)
    s += '<g class="grid-user-layer"></g>';
    s += '</svg>';
    return s;
  },
  // convert an SVG-space point (in 0..340 units) to nearest grid coords
  gridFromSvg(svgX, svgY, size) {
    const step = this.GRID_LEN / size;
    let gx = Math.round((svgX - this.GRID_OX) / step);
    let gy = Math.round((this.GRID_OY - svgY) / step);
    gx = Math.max(0, Math.min(size, gx));
    gy = Math.max(0, Math.min(size, gy));
    return { x: gx, y: gy };
  },
  gridMarkerSvg(gx, gy, size, color) {
    const step = this.GRID_LEN / size;
    const cx = this.GRID_OX + gx * step, cy = this.GRID_OY - gy * step;
    return '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="' + (color || '#3a7a48') + '" stroke="#0a2010" stroke-width="2"/>';
  },

  // --------------------------------------------------------
  // SHAPE FIGURES (Act VI) — for classify problems. 160x130 svg.
  // --------------------------------------------------------
  shapeFigure(kind) {
    const wrap = (inner) => '<svg width="160" height="130" viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="130" fill="#f4ecd0" rx="6"/>' +
      '<g fill="#5a8aaa" stroke="#1a3a4a" stroke-width="2.5" stroke-linejoin="round">' + inner + '</g></svg>';
    const quads = {
      square:        '<rect x="50" y="32" width="64" height="64"/>',
      rectangle:     '<rect x="34" y="42" width="92" height="46"/>',
      rhombus:       '<polygon points="80,28 120,65 80,102 40,65"/>',
      parallelogram: '<polygon points="48,40 130,40 112,90 30,90"/>',
      trapezoid:     '<polygon points="56,40 104,40 130,92 30,92"/>'
    };
    const tris = {
      tri_right:   '<polygon points="40,98 40,34 116,98"/>',
      tri_acute:   '<polygon points="80,30 122,98 38,98"/>',
      tri_obtuse:  '<polygon points="30,96 150,96 96,60"/>',
      tri_equilateral: '<polygon points="80,30 120,98 40,98"/>',
      tri_isosceles:   '<polygon points="80,30 106,98 54,98"/>',
      tri_scalene:     '<polygon points="34,96 150,96 70,42"/>'
    };
    return wrap(quads[kind] || tris[kind] || '<rect x="50" y="40" width="60" height="50"/>');
  },

  // --------------------------------------------------------
  // ITEM ICONS — small 40x40 svgs
  // --------------------------------------------------------
  itemIcon(itemId) {
    const item = ITEMS[itemId];
    if (!item) return '';
    const map = {
      iron_longsword:  '<line x1="20" y1="6" x2="20" y2="32" stroke="#b8c0c8" stroke-width="3.5" stroke-linecap="round"/><rect x="15" y="30" width="10" height="3" fill="#5a3818"/><rect x="17" y="33" width="6" height="5" fill="#5a3818"/>',
      oak_staff:       '<line x1="20" y1="8" x2="20" y2="36" stroke="#7a5a28" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="8" r="6" fill="#3a3e8a" stroke="#7a5a28" stroke-width="1.5"/><circle cx="20" cy="8" r="2.5" fill="#a0c0ff"/>',
      pair_of_daggers: '<line x1="13" y1="8" x2="17" y2="34" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><line x1="23" y1="8" x2="27" y2="34" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>',
      yew_shortbow:    '<path d="M 14 8 Q 6 20 14 32" fill="none" stroke="#6a4818" stroke-width="3"/><line x1="14" y1="8" x2="14" y2="32" stroke="#e8d5b5" stroke-width="0.6"/>',
      leather_hauberk: '<polygon points="10,10 30,10 32,32 8,32" fill="#7a4830" stroke="#3a1810" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="#d4a624"/>',
      scholars_robe:   '<polygon points="10,8 30,8 33,34 7,34" fill="#3a3e8a" stroke="#1a1838" stroke-width="1.5"/><text x="20" y="24" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="9">∑</text>',
      shadowed_jerkin: '<polygon points="10,8 30,8 32,34 8,34" fill="#1a2818" stroke="#0a1808" stroke-width="1.5"/><line x1="20" y1="10" x2="20" y2="32" stroke="#3a3818" stroke-width="1"/>',
      ranger_cloak:    '<polygon points="8,8 32,8 34,34 6,34" fill="#3a4a28" stroke="#1a2818" stroke-width="1.5"/><polygon points="10,10 30,10 26,24 14,24" fill="#4a5a2a"/>',
      measuring_chain: '<g stroke="#d4a624" stroke-width="1.5" fill="none"><circle cx="10" cy="14" r="3"/><circle cx="16" cy="20" r="3"/><circle cx="22" cy="14" r="3"/><circle cx="28" cy="20" r="3"/></g>',
      cubits_amulet:   '<polygon points="20,8 28,18 26,32 14,32 12,18" fill="#5a3878" stroke="#d4a624" stroke-width="1.5"/><text x="20" y="26" text-anchor="middle" fill="#d4a624" font-family="Cinzel" font-size="9">V</text>',
      quarrymans_belt: '<rect x="6" y="16" width="28" height="8" fill="#5a3818" stroke="#1a0808" stroke-width="1.5"/><rect x="16" y="14" width="8" height="12" fill="#d4a624" stroke="#1a0808" stroke-width="1"/>',
      hourglass_charm: '<polygon points="10,8 30,8 22,20 30,32 10,32 18,20" fill="#d4a624" stroke="#3a2010" stroke-width="1.2"/><polygon points="12,10 28,10 22,18 18,18" fill="#cc3030" opacity="0.7"/>',
      hollowed_blade:  '<line x1="20" y1="6" x2="20" y2="32" stroke="#7a3878" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="32" stroke="#cc4878" stroke-width="1.5" stroke-linecap="round"/><rect x="14" y="30" width="12" height="3" fill="#3a1838"/>',
      apprentices_grimoire: '<rect x="8" y="8" width="24" height="26" fill="#5a3818" stroke="#1a0808" stroke-width="1.5"/><rect x="10" y="10" width="20" height="22" fill="#f0e3bd"/><text x="20" y="24" text-anchor="middle" fill="#3a2010" font-family="Cinzel" font-size="10">A</text>',
      ironwood_circlet:'<path d="M 8 20 Q 20 14 32 20" fill="none" stroke="#3a2010" stroke-width="2"/><circle cx="20" cy="17" r="3" fill="#d4a624"/>',
      golems_core:     '<rect x="10" y="10" width="20" height="20" fill="#7a3878" stroke="#1a0418" stroke-width="1.5"/><rect x="14" y="14" width="12" height="12" fill="#cc4878"/><circle cx="20" cy="20" r="3" fill="#fff" opacity="0.65"/>',
      minor_potion:    '<rect x="16" y="6" width="8" height="6" fill="#5a3818"/><path d="M 14 12 L 14 30 Q 14 34 20 34 Q 26 34 26 30 L 26 12 Z" fill="#cc3060" stroke="#3a1810" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#ee6088"/>',
      greater_potion:  '<rect x="16" y="6" width="8" height="6" fill="#3a2010"/><path d="M 14 12 L 14 32 Q 14 34 20 34 Q 26 34 26 32 L 26 12 Z" fill="#7a3030" stroke="#1a0808" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#cc3060"/><text x="20" y="28" text-anchor="middle" fill="#f0d27a" font-family="Cinzel" font-size="8">+</text>',
      mana_phial:      '<rect x="16" y="6" width="8" height="6" fill="#5a3818"/><path d="M 14 12 L 14 30 Q 14 34 20 34 Q 26 34 26 30 L 26 12 Z" fill="#3060cc" stroke="#1a1838" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#6090ee"/>',
      scroll_of_sight: '<rect x="6" y="14" width="28" height="14" fill="#f0e3bd" stroke="#3a2010" stroke-width="1.5"/><circle cx="10" cy="21" r="3" fill="#3a2010"/><circle cx="30" cy="21" r="3" fill="#3a2010"/><text x="20" y="25" text-anchor="middle" fill="#3a2010" font-family="Cinzel" font-size="8">✦</text>',
      scroll_of_clemency: '<rect x="6" y="14" width="28" height="14" fill="#f0e3bd" stroke="#3a2010" stroke-width="1.5"/><circle cx="10" cy="21" r="3" fill="#3a2010"/><circle cx="30" cy="21" r="3" fill="#3a2010"/><text x="20" y="25" text-anchor="middle" fill="#5a1818" font-family="Cinzel" font-size="8">✗</text>',
      // Act II
      brass_sextant:    '<circle cx="20" cy="22" r="12" fill="none" stroke="#bfa050" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="34" stroke="#bfa050" stroke-width="1.5"/><line x1="8" y1="22" x2="32" y2="22" stroke="#bfa050" stroke-width="1.5"/><circle cx="20" cy="22" r="2" fill="#d4a624"/>',
      pearled_circlet:  '<path d="M 6 22 Q 20 12 34 22" fill="none" stroke="#5a3818" stroke-width="2"/><circle cx="14" cy="18" r="2" fill="#f0e3bd"/><circle cx="20" cy="15" r="2.5" fill="#f0e3bd"/><circle cx="26" cy="18" r="2" fill="#f0e3bd"/>',
      kelp_charm:       '<g stroke="#3a7848" stroke-width="2" fill="none"><path d="M 20 6 Q 16 12 20 16 Q 24 20 20 24 Q 16 28 20 34"/></g><circle cx="20" cy="11" r="2" fill="#aab87c"/><circle cx="20" cy="20" r="2" fill="#aab87c"/><circle cx="20" cy="29" r="2" fill="#aab87c"/>',
      saltskin_jerkin:  '<polygon points="10,8 30,8 32,32 8,32" fill="#3a6878" stroke="#1a2838" stroke-width="1.5"/><polygon points="12,10 28,10 18,18 22,18" fill="#a8d8e0" opacity="0.5"/><circle cx="20" cy="22" r="2" fill="#d4a624"/>',
      netcaster_cloak:  '<polygon points="8,8 32,8 34,34 6,34" fill="#3a5878" stroke="#1a2838" stroke-width="1.5"/><g stroke="#8a6a14" stroke-width="0.6" fill="none"><line x1="12" y1="14" x2="28" y2="30"/><line x1="20" y1="14" x2="12" y2="22"/><line x1="28" y1="14" x2="20" y2="22"/></g>',
      tide_blade:       '<line x1="20" y1="6" x2="20" y2="32" stroke="#3a6878" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="32" stroke="#88c4d8" stroke-width="1.5" stroke-linecap="round"/><rect x="14" y="30" width="12" height="3" fill="#3a1818"/>',
      coral_staff:      '<line x1="20" y1="8" x2="20" y2="36" stroke="#cc4878" stroke-width="3.5" stroke-linecap="round"/><polygon points="14,8 26,8 20,2" fill="#f08888"/><circle cx="20" cy="8" r="3" fill="#f0d27a"/>',
      half_kings_horn:  '<path d="M 8 26 Q 16 8 30 12 Q 26 22 16 30 Q 12 28 8 26 Z" fill="#cccccc" stroke="#3a2010" stroke-width="1.5"/><line x1="16" y1="20" x2="22" y2="16" stroke="#3a2010" stroke-width="0.6"/>',
      sextant_of_wholeness: '<circle cx="20" cy="22" r="12" fill="rgba(212,166,36,0.18)" stroke="#d4a624" stroke-width="2"/><polygon points="20,10 24,22 20,34 16,22" fill="#d4a624"/><polygon points="8,22 20,18 32,22 20,26" fill="#d4a624"/><circle cx="20" cy="22" r="2" fill="#fff"/>',
      navigators_locket: '<ellipse cx="20" cy="22" rx="8" ry="10" fill="#bfa050" stroke="#3a2010" stroke-width="1.5"/><line x1="12" y1="10" x2="28" y2="10" stroke="#bfa050" stroke-width="0.8"/><text x="20" y="25" text-anchor="middle" fill="#1a1008" font-family="Cinzel" font-size="8">∞</text>',
      smoked_kipper:    '<ellipse cx="20" cy="22" rx="14" ry="6" fill="#7a5828" stroke="#3a1808" stroke-width="1"/><polygon points="34,20 38,22 34,24" fill="#7a5828" stroke="#3a1808" stroke-width="1"/><circle cx="10" cy="21" r="1" fill="#fff"/><circle cx="10" cy="21" r="0.5" fill="#1a1008"/>',
      brine_phial:      '<rect x="16" y="6" width="8" height="6" fill="#5a3818"/><path d="M 14 12 L 14 30 Q 14 34 20 34 Q 26 34 26 30 L 26 12 Z" fill="#3a7898" stroke="#1a2838" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#88c4d8"/>',
      // Act III
      forge_hammer:     '<line x1="20" y1="14" x2="20" y2="36" stroke="#5a3818" stroke-width="3"/><rect x="10" y="6" width="20" height="12" rx="2" fill="#5a5a5a" stroke="#1a1008" stroke-width="1.5"/><rect x="8" y="8" width="4" height="8" fill="#3a3a3a"/>',
      repeater_sling:   '<path d="M 10 10 Q 20 6 30 10" fill="none" stroke="#5a3818" stroke-width="2"/><path d="M 10 10 L 18 24 L 22 24 L 30 10" fill="none" stroke="#7a5828" stroke-width="1.5"/><circle cx="20" cy="26" r="3" fill="#888"/>',
      plated_brigandine:'<polygon points="10,8 30,8 32,32 8,32" fill="#5a5a5a" stroke="#1a1008" stroke-width="1.5"/><circle cx="14" cy="13" r="1.4" fill="#3a3a3a"/><circle cx="26" cy="13" r="1.4" fill="#3a3a3a"/><circle cx="14" cy="27" r="1.4" fill="#3a3a3a"/><circle cx="26" cy="27" r="1.4" fill="#3a3a3a"/><line x1="20" y1="8" x2="20" y2="32" stroke="#3a3a3a" stroke-width="0.8"/>',
      artificer_vest:   '<polygon points="10,8 30,8 32,33 8,33" fill="#4a4438" stroke="#1a1008" stroke-width="1.5"/><rect x="13" y="16" width="6" height="8" fill="#3a3428"/><rect x="21" y="16" width="6" height="8" fill="#3a3428"/><circle cx="16" cy="12" r="1.2" fill="#bfa050"/>',
      abacus_ring:      '<circle cx="20" cy="20" r="11" fill="none" stroke="#bfa050" stroke-width="2.5"/><line x1="9" y1="16" x2="31" y2="16" stroke="#3a2818" stroke-width="0.8"/><line x1="9" y1="24" x2="31" y2="24" stroke="#3a2818" stroke-width="0.8"/><circle cx="15" cy="16" r="1.6" fill="#d4a624"/><circle cx="24" cy="24" r="1.6" fill="#d4a624"/>',
      ledger_seal:      '<rect x="10" y="10" width="20" height="22" fill="#5a3a20" stroke="#1a1008" stroke-width="1.5"/><rect x="13" y="13" width="14" height="16" fill="#f0e3bd"/><text x="20" y="25" text-anchor="middle" fill="#5a1818" font-family="Cinzel" font-size="11">÷</text>',
      cinder_charm:     '<circle cx="20" cy="22" r="9" fill="#1a0808" stroke="#5a3818" stroke-width="1.5"/><circle cx="20" cy="22" r="5" fill="#f0843a"/><circle cx="20" cy="21" r="2" fill="#f0d27a"/><line x1="20" y1="8" x2="20" y2="13" stroke="#5a3818" stroke-width="1.5"/>',
      multipliers_edge: '<line x1="20" y1="6" x2="20" y2="30" stroke="#cc8838" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="30" stroke="#f0d27a" stroke-width="1.5"/><rect x="14" y="28" width="12" height="3" fill="#5a3818"/><text x="30" y="14" fill="#f0a838" font-family="Cinzel" font-size="9">×</text>',
      dividing_engine:  '<rect x="10" y="12" width="20" height="18" rx="2" fill="#5a4838" stroke="#1a1008" stroke-width="1.5"/><circle cx="16" cy="21" r="4" fill="#bfa050"/><circle cx="26" cy="17" r="2.5" fill="#9a8040"/><text x="20" y="36" text-anchor="middle" fill="#bfa050" font-family="Cinzel" font-size="8">÷</text>',
      warmarch_medal:   '<polygon points="20,6 24,16 20,14 16,16" fill="#aa3838"/><circle cx="20" cy="24" r="9" fill="#d4a624" stroke="#3a2010" stroke-width="1.5"/><text x="20" y="28" text-anchor="middle" fill="#5a3010" font-family="Cinzel" font-size="9">★</text>',
      sabotage_kit:     '<rect x="9" y="14" width="22" height="16" rx="2" fill="#3a3028" stroke="#1a1008" stroke-width="1.5"/><line x1="14" y1="14" x2="14" y2="10" stroke="#888" stroke-width="1.5"/><circle cx="14" cy="9" r="2" fill="#888"/><rect x="20" y="18" width="8" height="3" fill="#bfa050"/>',
      ration_tin:       '<rect x="11" y="12" width="18" height="20" rx="2" fill="#7a6048" stroke="#1a1008" stroke-width="1.5"/><ellipse cx="20" cy="12" rx="9" ry="2.5" fill="#9a8060"/><line x1="13" y1="20" x2="27" y2="20" stroke="#5a4838" stroke-width="0.8"/>',
      oil_flask:        '<rect x="16" y="6" width="8" height="6" fill="#3a2010"/><path d="M 13 12 L 13 30 Q 13 34 20 34 Q 27 34 27 30 L 27 12 Z" fill="#caa030" stroke="#3a2010" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#f0d27a"/><text x="20" y="29" text-anchor="middle" fill="#5a3818" font-family="Cinzel" font-size="8">+</text>',
      // Act IV
      coinblade:        '<line x1="20" y1="6" x2="20" y2="30" stroke="#d4a624" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="30" stroke="#f0d27a" stroke-width="1.5"/><rect x="14" y="29" width="12" height="3" fill="#5a3818"/><circle cx="30" cy="12" r="3" fill="#d4a624" stroke="#7a5818" stroke-width="0.8"/>',
      assayers_scale:   '<line x1="20" y1="8" x2="20" y2="34" stroke="#7a5828" stroke-width="2.5"/><line x1="10" y1="12" x2="30" y2="12" stroke="#bfa050" stroke-width="2"/><path d="M 10 12 L 6 20 L 14 20 Z" fill="none" stroke="#bfa050" stroke-width="1"/><path d="M 30 12 L 26 20 L 34 20 Z" fill="none" stroke="#bfa050" stroke-width="1"/>',
      vault_mail:       '<polygon points="10,8 30,8 32,32 8,32" fill="#5a5848" stroke="#1a1408" stroke-width="1.5"/><circle cx="15" cy="14" r="2" fill="none" stroke="#3a3830" stroke-width="1"/><circle cx="25" cy="14" r="2" fill="none" stroke="#3a3830" stroke-width="1"/><circle cx="20" cy="22" r="2" fill="none" stroke="#3a3830" stroke-width="1"/>',
      archivists_coat:  '<polygon points="10,8 30,8 32,33 8,33" fill="#3a3020" stroke="#1a1408" stroke-width="1.5"/><rect x="14" y="16" width="5" height="8" fill="#2a2014"/><rect x="21" y="16" width="5" height="8" fill="#2a2014"/><circle cx="20" cy="11" r="1.4" fill="#d4a624"/>',
      assayers_loupe:   '<circle cx="18" cy="20" r="9" fill="none" stroke="#bfa050" stroke-width="2.5"/><circle cx="18" cy="20" r="5" fill="#88c4d8" opacity="0.6"/><line x1="25" y1="27" x2="32" y2="34" stroke="#5a4830" stroke-width="2.5"/>',
      decimal_abacus:   '<rect x="9" y="12" width="22" height="18" rx="1.5" fill="#5a3818" stroke="#1a1008" stroke-width="1.5"/><line x1="9" y1="18" x2="31" y2="18" stroke="#3a2010" stroke-width="0.8"/><line x1="9" y1="24" x2="31" y2="24" stroke="#3a2010" stroke-width="0.8"/><circle cx="15" cy="18" r="1.6" fill="#d4a624"/><circle cx="22" cy="18" r="1.6" fill="#d4a624"/><circle cx="26" cy="24" r="1.6" fill="#88c4d8"/><line x1="20" y1="12" x2="20" y2="30" stroke="#cc4878" stroke-width="0.6"/>',
      lucky_decicoin:   '<circle cx="20" cy="20" r="11" fill="#d4a624" stroke="#7a5818" stroke-width="1.5"/><circle cx="20" cy="20" r="8" fill="#e8c44a"/><text x="20" y="24" text-anchor="middle" fill="#7a5818" font-family="Cinzel" font-size="8">.99</text>',
      tithe_breaker:    '<line x1="20" y1="6" x2="20" y2="30" stroke="#caa030" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="30" stroke="#cc4878" stroke-width="1.4"/><rect x="14" y="29" width="12" height="3" fill="#3a2808"/><circle cx="20" cy="13" r="2" fill="#0a0606"/>',
      hollow_coin:      '<circle cx="20" cy="20" r="12" fill="#7a5818" stroke="#3a2808" stroke-width="1.5"/><circle cx="20" cy="20" r="8" fill="#caa030"/><circle cx="20" cy="20" r="3.5" fill="#0a0606"/><circle cx="20" cy="20" r="3.5" fill="none" stroke="#cc4878" stroke-width="0.8"/>',
      keepers_ledger:   '<rect x="9" y="8" width="22" height="26" fill="#3a2e1e" stroke="#1a1408" stroke-width="1.5"/><rect x="11" y="10" width="18" height="22" fill="#e8e0c8"/><line x1="14" y1="16" x2="26" y2="16" stroke="#7a1818" stroke-width="0.6"/><line x1="14" y1="20" x2="26" y2="20" stroke="#3a2010" stroke-width="0.5"/><line x1="14" y1="24" x2="26" y2="24" stroke="#3a2010" stroke-width="0.5"/>',
      deepvault_medal:  '<polygon points="20,6 24,15 20,13 16,15" fill="#5a4830"/><circle cx="20" cy="23" r="9" fill="#bfa050" stroke="#3a2808" stroke-width="1.5"/><text x="20" y="27" text-anchor="middle" fill="#3a2808" font-family="Cinzel" font-size="9">▼</text>',
      candied_fig:      '<ellipse cx="20" cy="23" rx="9" ry="10" fill="#6a3858" stroke="#3a1838" stroke-width="1.5"/><path d="M 20 13 L 20 9 L 23 7" fill="none" stroke="#5a7838" stroke-width="1.5"/><circle cx="17" cy="21" r="1" fill="#e0b0c8"/><circle cx="23" cy="25" r="1" fill="#e0b0c8"/>',
      lamp_oil_draught: '<rect x="16" y="6" width="8" height="6" fill="#5a3818"/><path d="M 14 12 L 14 30 Q 14 34 20 34 Q 26 34 26 30 L 26 12 Z" fill="#c8b030" stroke="#3a2808" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#f0e0a0"/>',
      // Act V
      balance_glaive:   '<line x1="20" y1="10" x2="20" y2="36" stroke="#7a5828" stroke-width="2.5"/><line x1="11" y1="11" x2="29" y2="11" stroke="#bfa050" stroke-width="2"/><path d="M 11 11 L 7 18 L 15 18 Z" fill="none" stroke="#bfa050" stroke-width="1"/><path d="M 29 11 L 25 18 L 33 18 Z" fill="none" stroke="#bfa050" stroke-width="1"/><polygon points="17,6 23,6 20,10" fill="#b8c0c8"/>',
      tally_wand:       '<line x1="14" y1="32" x2="28" y2="10" stroke="#7a5828" stroke-width="2.5" stroke-linecap="round"/><circle cx="29" cy="9" r="4" fill="#caa84a"/><g stroke="#5a3818" stroke-width="1"><line x1="16" y1="26" x2="20" y2="26"/><line x1="19" y1="22" x2="23" y2="22"/></g>',
      guild_tabard:     '<polygon points="10,8 30,8 32,32 8,32" fill="#5a4858" stroke="#1a1008" stroke-width="1.5"/><polygon points="20,8 30,8 20,20" fill="#cc4878"/><polygon points="20,8 10,8 20,20" fill="#48a0c0"/><polygon points="20,20 30,32 20,32" fill="#aab87c"/><polygon points="20,20 10,32 20,32" fill="#d4a624"/>',
      merchants_finery: '<polygon points="10,8 30,8 33,33 7,33" fill="#5a3848" stroke="#1a1008" stroke-width="1.5"/><path d="M 14 10 L 20 22 L 26 10" fill="#caa84a"/><circle cx="20" cy="26" r="1.5" fill="#d4a624"/>',
      common_denom_ring:'<circle cx="20" cy="20" r="11" fill="none" stroke="#bfa050" stroke-width="2.5"/><text x="20" y="17" text-anchor="middle" fill="#e0c0e0" font-family="Cinzel" font-size="7">1</text><line x1="15" y1="20" x2="25" y2="20" stroke="#e0c0e0" stroke-width="1"/><text x="20" y="28" text-anchor="middle" fill="#e0c0e0" font-family="Cinzel" font-size="7">n</text>',
      power_loop:       '<circle cx="13" cy="20" r="4" fill="none" stroke="#88c4d8" stroke-width="2"/><circle cx="21" cy="20" r="5" fill="none" stroke="#88c4d8" stroke-width="2"/><circle cx="30" cy="20" r="6" fill="none" stroke="#88c4d8" stroke-width="2"/>',
      traders_chain:    '<g stroke="#d4a624" stroke-width="2" fill="none"><circle cx="12" cy="16" r="3"/><circle cx="18" cy="22" r="3"/><circle cx="24" cy="16" r="3"/><circle cx="30" cy="22" r="3"/></g><circle cx="21" cy="30" r="3" fill="#d4a624"/>',
      accord_blade:     '<line x1="20" y1="6" x2="20" y2="30" stroke="#caa84a" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="30" stroke="#f0e3bd" stroke-width="1.5"/><rect x="13" y="29" width="14" height="3" fill="#5a3818"/><circle cx="30" cy="12" r="2.5" fill="#d4a624"/>',
      babel_key:        '<circle cx="14" cy="14" r="6" fill="none" stroke="#bfa050" stroke-width="2.5"/><line x1="18" y1="18" x2="30" y2="30" stroke="#bfa050" stroke-width="2.5"/><line x1="26" y1="26" x2="32" y2="22" stroke="#bfa050" stroke-width="2.5"/><line x1="29" y1="29" x2="34" y2="26" stroke="#bfa050" stroke-width="2"/>',
      concord_medal:    '<polygon points="20,6 24,15 20,13 16,15" fill="#aab87c"/><circle cx="20" cy="23" r="9" fill="#d4a624" stroke="#5a4818" stroke-width="1.5"/><text x="20" y="27" text-anchor="middle" fill="#5a4818" font-family="Cinzel" font-size="9">⚖</text>',
      unity_charm:      '<circle cx="20" cy="20" r="11" fill="#3a3850" stroke="#1a1828" stroke-width="1.5"/><path d="M 20 20 L 20 9 A 11 11 0 0 1 29.5 25.5 Z" fill="#cc4878"/><path d="M 20 20 L 29.5 25.5 A 11 11 0 0 1 10.5 25.5 Z" fill="#48a0c0"/><path d="M 20 20 L 10.5 25.5 A 11 11 0 0 1 20 9 Z" fill="#aab87c"/>',
      spiced_wine:      '<path d="M 13 8 L 27 8 L 24 18 Q 24 24 20 24 Q 16 24 16 18 Z" fill="#7a2838" stroke="#3a1018" stroke-width="1.5"/><rect x="18" y="24" width="4" height="8" fill="#5a3818"/><rect x="14" y="32" width="12" height="3" fill="#5a3818"/>',
      guild_tonic:      '<rect x="16" y="6" width="8" height="6" fill="#5a3818"/><path d="M 14 12 L 14 30 Q 14 34 20 34 Q 26 34 26 30 L 26 12 Z" fill="#48a0a0" stroke="#1a3838" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="2" ry="3" fill="#a0e0e0"/>',
      // Act VI
      starforged_blade: '<line x1="20" y1="6" x2="20" y2="30" stroke="#7a9ad8" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="6" x2="20" y2="30" stroke="#dce8ff" stroke-width="1.5"/><rect x="14" y="29" width="12" height="3" fill="#3a3a5a"/><polygon points="20,4 21,8 25,8 22,11 23,15 20,12 17,15 18,11 15,8 19,8" fill="#f0e3bd"/>',
      astrolabe_staff:  '<line x1="14" y1="34" x2="28" y2="8" stroke="#5a5a78" stroke-width="2.5" stroke-linecap="round"/><circle cx="29" cy="8" r="6" fill="none" stroke="#a8c4f0" stroke-width="2"/><line x1="24" y1="8" x2="34" y2="8" stroke="#a8c4f0" stroke-width="1"/><line x1="29" y1="3" x2="29" y2="13" stroke="#a8c4f0" stroke-width="1"/>',
      skyweave_mail:    '<polygon points="10,8 30,8 32,32 8,32" fill="#3a4a78" stroke="#1a2240" stroke-width="1.5"/><g stroke="#7a9ad8" stroke-width="0.6"><line x1="10" y1="16" x2="30" y2="16"/><line x1="10" y1="24" x2="30" y2="24"/><line x1="20" y1="8" x2="20" y2="32"/></g>',
      constellation_cloak:'<polygon points="8,8 32,8 34,34 6,34" fill="#1a1a3a" stroke="#0a0a1a" stroke-width="1.5"/><circle cx="14" cy="14" r="1" fill="#fff"/><circle cx="26" cy="18" r="1" fill="#fff"/><circle cx="18" cy="24" r="1" fill="#fff"/><circle cx="28" cy="28" r="1" fill="#fff"/><circle cx="12" cy="28" r="1" fill="#fff"/>',
      plotters_compass: '<circle cx="20" cy="20" r="11" fill="#1a2a40" stroke="#a8c4f0" stroke-width="2"/><line x1="9" y1="20" x2="31" y2="20" stroke="#a8c4f0" stroke-width="0.8"/><line x1="20" y1="9" x2="20" y2="31" stroke="#a8c4f0" stroke-width="0.8"/><circle cx="24" cy="16" r="2.5" fill="#9a2828"/>',
      geometers_lens:   '<circle cx="18" cy="18" r="9" fill="#1a2a40" opacity="0.6" stroke="#bfa050" stroke-width="2"/><polygon points="18,12 24,22 12,22" fill="none" stroke="#a8c4f0" stroke-width="1.2"/><line x1="25" y1="25" x2="33" y2="33" stroke="#5a4830" stroke-width="2.5"/>',
      sky_charm:        '<polygon points="20,6 24,16 34,16 26,23 29,33 20,27 11,33 14,23 6,16 16,16" fill="#3a4a78" stroke="#1a2240" stroke-width="1"/><polygon points="20,12 22,17 27,17 23,21 24,26 20,23 16,26 17,21 13,17 18,17" fill="#a8d4ff"/>',
      codex_complete:   '<rect x="8" y="8" width="24" height="26" fill="#5a1818" stroke="#2a0808" stroke-width="1.5"/><rect x="11" y="10" width="18" height="22" fill="#f0e3bd"/><polygon points="20,13 22,18 27,18 23,21 24,26 20,23 16,26 17,21 13,18 18,18" fill="#d4a624"/>',
      starlance:        '<line x1="10" y1="32" x2="30" y2="8" stroke="#7a9ad8" stroke-width="3" stroke-linecap="round"/><polygon points="30,8 24,10 28,14" fill="#dce8ff"/><polygon points="31,7 29,3 35,5" fill="#f0e3bd"/><circle cx="14" cy="28" r="2" fill="#a8d4ff"/>',
      champion_medal:   '<polygon points="20,5 24,14 20,12 16,14" fill="#9a2828"/><circle cx="20" cy="23" r="10" fill="#d4a624" stroke="#5a3010" stroke-width="1.5"/><polygon points="20,17 22,22 27,22 23,25 24,30 20,27 16,30 17,25 13,22 18,22" fill="#5a3010"/>',
      ambrosia:         '<path d="M 13 8 L 27 8 L 25 16 Q 25 24 20 24 Q 15 24 15 16 Z" fill="#f0d8a0" stroke="#bfa050" stroke-width="1.5"/><rect x="18" y="24" width="4" height="8" fill="#bfa050"/><rect x="14" y="32" width="12" height="3" fill="#8a7838"/><circle cx="20" cy="14" r="2" fill="#fff" opacity="0.7"/>',
      star_tonic:       '<rect x="16" y="6" width="8" height="6" fill="#3a3a5a"/><path d="M 14 12 L 14 30 Q 14 34 20 34 Q 26 34 26 30 L 26 12 Z" fill="#3a4a88" stroke="#1a2240" stroke-width="1.5"/><polygon points="20,16 21,20 25,20 22,22 23,26 20,24 17,26 18,22 15,20 19,20" fill="#a8d4ff"/>'
    };
    const inner = map[itemId] || '<rect x="8" y="8" width="24" height="24" fill="#5a3818" stroke="#3a2010" stroke-width="1.5"/>';
    return '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="40" height="40" rx="4" fill="rgba(0,0,0,0.3)" stroke="' + (item.slot === 'weapon' ? '#aa2828' : item.slot === 'armor' ? '#5a3878' : item.slot === 'accessory' ? '#d4a624' : '#3a7848') + '" stroke-width="1.5"/>' +
      inner +
    '</svg>';
  }

};

if (typeof window !== 'undefined') window.Art = Art;
