// Pure, DOM-free braille translation and text-generation helpers, extracted
// from scripts/app.js so they can be unit-tested directly (see
// scripts/braille.test.js). Nothing in this file touches `document`,
// `window`, or any other browser global; DOM wiring stays in app.js.
//
// Translation scope: Grade 1 (uncontracted) UEB only, no capital/number/
// punctuation indicators, accents reduced to ASCII. See
// docs/decisions/006-braille-translation-posture.md.

export const BRAILLE_MAP = {
  'a':[1],'b':[1,2],'c':[1,4],'d':[1,4,5],'e':[1,5],'f':[1,2,4],'g':[1,2,4,5],
  'h':[1,2,5],'i':[2,4],'j':[2,4,5],'k':[1,3],'l':[1,2,3],'m':[1,3,4],
  'n':[1,3,4,5],'o':[1,3,5],'p':[1,2,3,4],'q':[1,2,3,4,5],'r':[1,2,3,5],
  's':[2,3,4],'t':[2,3,4,5],'u':[1,3,6],'v':[1,2,3,6],'w':[2,4,5,6],
  'x':[1,3,4,6],'y':[1,3,4,5,6],'z':[1,3,5,6],' ':[]
};

// Blocked-word list, base64-encoded as cosmetic obfuscation only (not a
// security control — see Decision 006). Decoded at import time with atob().
const _b = ['ZnVjaw==','ZmNraW5n','Y3VudA==','dHdhdA==','d2Fua2Vy','YmFzdGFyZA==',
  'Yml0Y2g=','c2hpdA==','YXNzaG9sZQ==','YXJzZWhvbGU=','cHJpY2s=','cGlzcw==',
  'c2x1dA==','d2hvcmU=','cmV0YXJk','dGFyZA==','c3Bhc3RpYw==','c3Bhego=','dHJhbm55',
  'ZmFnZ290','ZmFnb3Q=','ZHlrZQ==','bmlnZ2Vy','bmlnZ2E=','Y2hpbms=','Z29vaw==',
  'c3BpYw==','a2lrZQ==','d2V0YmFjaw==','d29w','cGFraQ==','cmFwZWQ=','cmFwaW5n',
  'am90','am90c28=','YWhvbGU='];
export const BLOCKED = Array.from(new Set(_b.map(s => atob(s))));

export function normaliseForFilter(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/[4@]/g,'a')
    .replace(/0/g,'o').replace(/[5$]/g,'s').replace(/7/g,'t')
    .replace(/8/g,'b').replace(/[^a-z]/g,'');
}

export function isProfane(text) {
  const variants = [];
  if (text.indexOf('*') === -1) variants.push(text);
  else {
    const vowels = ['a','e','i','o','u'];
    let stack = [text];
    while (stack.length) {
      const s = stack.pop();
      const idx = s.indexOf('*');
      if (idx === -1) { variants.push(s); continue; }
      for (const v of vowels) stack.push(s.slice(0, idx) + v + s.slice(idx + 1));
      if (stack.length > 200) break;
    }
  }
  return variants.some(v => {
    const n = normaliseForFilter(v);
    return n && BLOCKED.some(t => t && n.includes(t));
  });
}

const SPECIAL_CHAR_MAP = {'ß':'ss','ẞ':'ss','æ':'ae','Æ':'ae','œ':'oe','Œ':'oe',
  'ø':'o','Ø':'o','ð':'d','Ð':'d','þ':'th','Þ':'th','ł':'l','Ł':'l'};

export function asciifyForBraille(text) {
  let out = '';
  for (const ch of text) out += (SPECIAL_CHAR_MAP[ch] !== undefined) ? SPECIAL_CHAR_MAP[ch] : ch;
  return out.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z\s]/g,'').replace(/\s+/g,' ').trim();
}

export function tidyDisplayName(text) {
  return text.replace(/\s+/g,' ').trim().split(' ').map(w => {
    if (!w) return '';
    return w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase();
  }).join(' ');
}

export function buildAltText(name) {
  return '"' + name + '" written in Grade 1 (uncontracted) braille below the Lincoln & Lindsey Blind Society logo. The dots shown would be raised on the page to be read by touch.';
}

export function buildShareText(name) {
  return '"' + name + '" in Grade 1 braille. #LLBS\n\nImage: ' + buildAltText(name);
}

// Pure computation for the breakdown list: returns the summary text and one
// item string per braille cell. DOM rendering (populating <li> elements)
// stays in app.js's renderBreakdown, which calls this and writes the result
// into the page.
export function buildBreakdown(brailleName) {
  const lc = brailleName.replace(/\s/g,'').length;
  const summary = 'The braille spells "' + brailleName + '" with ' + lc +
    ' letter' + (lc === 1 ? '' : 's') + '. Each cell:';
  const items = [];
  for (const ch of brailleName) {
    if (ch === ' ') { items.push('(space) — empty cell'); continue; }
    const dots = BRAILLE_MAP[ch] || [];
    items.push(ch.toUpperCase() + (dots.length === 0
      ? ' — no dots'
      : ' — dot' + (dots.length === 1 ? '' : 's') + ' ' + dots.join(', ')));
  }
  return { summary, items };
}

export function dataURLToBlob(dataURL) {
  const [header, b64] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
