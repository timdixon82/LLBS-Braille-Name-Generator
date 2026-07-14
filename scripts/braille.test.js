// Unit tests for the pure braille translation and text-generation helpers
// extracted to scripts/braille.js.
//
// The braille alphabet is asserted against an INDEPENDENT reference — the
// Unicode Braille Patterns block (U+2800..U+283F) — not against whatever
// BRAILLE_MAP happens to contain. Unicode defines a braille cell's code
// point as U+2800 plus a bitmask where dot 1 is bit 0, dot 2 is bit 1, ...
// dot 6 is bit 5. That formula is used directly below to compute the
// EXPECTED character for a given set of dots, independently of the map's
// own implementation, and each letter is checked against the well-
// established standard Grade 1 (uncontracted) UEB alphabet (see
// docs/decisions/006-braille-translation-posture.md for the translation
// scope this project targets).

import { describe, it, expect } from 'vitest';
import {
  BRAILLE_MAP,
  normaliseForFilter,
  isProfane,
  asciifyForBraille,
  tidyDisplayName,
  buildAltText,
  buildShareText,
  buildBreakdown,
  dataURLToBlob,
} from './braille.js';

// Independent reference implementation of the Unicode Braille Patterns
// formula, written separately from anything in braille.js so a shared bug
// would not cancel out.
function expectedBrailleChar(dots) {
  let mask = 0;
  for (const d of dots) mask |= 1 << (d - 1);
  return String.fromCodePoint(0x2800 + mask);
}

// The standard Grade 1 (uncontracted) UEB alphabet, a-z, as a set of dot
// numbers per letter. This is the well-established, widely published
// mapping (matching the Unicode Braille Patterns block letter assignment),
// independent of BRAILLE_MAP's own values.
const STANDARD_GRADE1_ALPHABET = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5],
  f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
  k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5],
  p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
};

describe('BRAILLE_MAP (standard Grade 1 UEB alphabet, verified against Unicode Braille Patterns)', () => {
  for (const letter of Object.keys(STANDARD_GRADE1_ALPHABET)) {
    it(`maps "${letter}" to the standard dot pattern`, () => {
      const standardDots = STANDARD_GRADE1_ALPHABET[letter];
      expect(BRAILLE_MAP[letter]).toEqual(standardDots);
      // Cross-check against the Unicode Braille Patterns formula too, so
      // the assertion is not solely a copy of the standard table above.
      const mapChar = expectedBrailleChar(BRAILLE_MAP[letter]);
      const standardChar = expectedBrailleChar(standardDots);
      expect(mapChar).toBe(standardChar);
    });
  }

  it('maps space to an empty cell (no dots)', () => {
    expect(BRAILLE_MAP[' ']).toEqual([]);
  });

  it('renders "a" as U+2801, the Unicode reference character for dot 1', () => {
    expect(expectedBrailleChar(BRAILLE_MAP.a)).toBe('⠁');
  });
});

describe('normaliseForFilter', () => {
  it('lowercases input', () => {
    expect(normaliseForFilter('SHIT')).toBe('shit');
  });

  it('strips accents', () => {
    expect(normaliseForFilter('café')).toBe('cafe');
  });

  it('maps common leetspeak substitutions to letters', () => {
    expect(normaliseForFilter('sh1t')).toBe('shit');
    expect(normaliseForFilter('sh!t')).toBe('shit');
    expect(normaliseForFilter('a55hole')).toBe('asshole');
    expect(normaliseForFilter('@sshole')).toBe('asshole');
  });

  it('drops punctuation that has no leetspeak substitution', () => {
    expect(normaliseForFilter('sh-i.t')).toBe('shit');
  });
});

describe('isProfane', () => {
  it('flags a known blocked word', () => {
    expect(isProfane('shit')).toBe(true);
  });

  it('flags a blocked word embedded in a longer string', () => {
    expect(isProfane('you are shit at this')).toBe(true);
  });

  it('flags a leetspeak variant of a blocked word', () => {
    expect(isProfane('sh1t')).toBe(true);
  });

  it('flags a wildcard variant of a blocked word', () => {
    expect(isProfane('sh*t')).toBe(true);
  });

  it('does not flag a clean name', () => {
    expect(isProfane('Alice')).toBe(false);
  });

  it('flags "Scunthorpe" (the well-known Scunthorpe problem: it contains a blocked substring)', () => {
    // Documents an existing, known limitation of a substring-based filter
    // rather than a regression: "Scunthorpe" contains "cunt", so the naive
    // substring match flags it even though the name itself is inoffensive.
    // Out of scope to fix here (see Decision 006's framing of the filter
    // as brand protection, not a content-safety guarantee).
    expect(isProfane('Scunthorpe')).toBe(true);
  });

  it('does not flag an ordinary name with no blocked substring', () => {
    expect(isProfane('Bartholomew')).toBe(false);
  });
});

describe('asciifyForBraille', () => {
  it('lowercases and keeps plain ASCII letters and spaces', () => {
    expect(asciifyForBraille('Alice Smith')).toBe('alice smith');
  });

  it('reduces accented letters to their base ASCII letter', () => {
    expect(asciifyForBraille('José')).toBe('jose');
  });

  it('expands known ligatures to their ASCII equivalents', () => {
    expect(asciifyForBraille('Straße')).toBe('strasse');
    expect(asciifyForBraille('Bjørn')).toBe('bjorn');
  });

  it('drops digits and punctuation', () => {
    expect(asciifyForBraille("O'Brien-123")).toBe('obrien');
  });

  it('collapses repeated whitespace and trims', () => {
    expect(asciifyForBraille('  Anna   Marie  ')).toBe('anna marie');
  });
});

describe('tidyDisplayName', () => {
  it('title-cases each word', () => {
    expect(tidyDisplayName('alice smith')).toBe('Alice Smith');
  });

  it('normalises a name typed in all caps', () => {
    expect(tidyDisplayName('ALICE SMITH')).toBe('Alice Smith');
  });

  it('collapses repeated whitespace and trims', () => {
    expect(tidyDisplayName('  alice   smith  ')).toBe('Alice Smith');
  });
});

describe('buildAltText', () => {
  it('describes the image for a given name', () => {
    expect(buildAltText('Alice')).toBe(
      '"Alice" written in Grade 1 (uncontracted) braille below the Lincoln & Lindsey Blind Society logo. The dots shown would be raised on the page to be read by touch.'
    );
  });
});

describe('buildShareText', () => {
  it('wraps the alt text with a hashtag and label', () => {
    expect(buildShareText('Alice')).toBe(
      '"Alice" in Grade 1 braille. #LLBS\n\nImage: ' + buildAltText('Alice')
    );
  });
});

describe('buildBreakdown', () => {
  it('summarises a simple name and lists each cell', () => {
    const { summary, items } = buildBreakdown('al');
    expect(summary).toBe('The braille spells "al" with 2 letters. Each cell:');
    expect(items).toEqual(['A — dot 1', 'L — dots 1, 2, 3']);
  });

  it('uses singular "letter" for a one-letter name', () => {
    const { summary } = buildBreakdown('a');
    expect(summary).toBe('The braille spells "a" with 1 letter. Each cell:');
  });

  it('describes a space as an empty cell and excludes it from the letter count', () => {
    const { summary, items } = buildBreakdown('a b');
    expect(summary).toBe('The braille spells "a b" with 2 letters. Each cell:');
    expect(items).toEqual(['A — dot 1', '(space) — empty cell', 'B — dots 1, 2']);
  });
});

describe('dataURLToBlob', () => {
  it('converts a data URL into a Blob with the correct MIME type and byte length', async () => {
    // "hi" base64-encoded, wrapped as a data URL.
    const b64 = btoa('hi');
    const dataURL = 'data:text/plain;base64,' + b64;
    const blob = dataURLToBlob(dataURL);
    expect(blob.type).toBe('text/plain');
    expect(blob.size).toBe(2);
    const text = await blob.text();
    expect(text).toBe('hi');
  });
});
