# Decision 006: Braille translation posture — Grade 1, no indicators, lossy accent reduction

- Date: 2026-05-25
- Status: accepted
- Decided by: Tim Dixon (Q208A, Q209A, Q211A — 2026-05-25)

## What this tool does

The LLBS Braille Name Generator is a **social-share tool**, not a braille production system. Its job is to let a visitor create a branded image showing their name in braille, to be shared on social media to raise awareness of LLBS and braille literacy. The image is visual; it is not read by touch.

## Translation scope (Q208A)

The braille translation is intentionally small:

- **Grade 1 (uncontracted) Unified English Braille only.** Each letter of the name is converted individually to its Grade 1 cell. No Grade 2 contractions are used.
- **No capital indicators.** Capital indicators are omitted for visual simplicity.
- **No number indicators.** Digits are silently dropped before translation.
- **No punctuation braille.** Punctuation characters are silently dropped.
- **Accented letters** are reduced to their base ASCII letter before translation (for example, é becomes e). The ligatures ß, æ, œ, ø, ð, þ, and ł are expanded to their ASCII equivalents.
- Spaces in the name are represented as empty braille cells.

This scope is frozen. Future requests to add capital indicators, number indicators, or Grade 2 contractions should be directed to the [LLBS Braille Reference](https://github.com/timdixon82/Braille-Reference) project. Braille-Reference is the educational reference; this generator is the social-share tool. The two are siblings with deliberately different scopes.

## Brand-safety filter (Q209A)

The page includes a client-side filter that blocks offensive terms from the generated image. The filter:

- Stores a blocked-word list as a base64-encoded string in `scripts/app.js`, decoded at startup with `atob()`. The base64 is **cosmetic obfuscation only** — it is not encryption and not a security control.
- Normalises input before matching: lowercases, strips diacritics, then applies leet-speak substitutions (for example, 3 → e, @ → a).
- Expands wildcard asterisk characters with a cap of 200 variants per entry to prevent denial-of-service from a pathological word list.
- Is **English-only**. It does not cover offensive terms in other languages.

This is **brand protection, not a content-safety guarantee**. A determined user can bypass the filter. Its purpose is to prevent accidental or casual misuse of the LLBS brand.

The filter is kept as-is per Tim's Q209A decision. Any change to the blocked-word list or algorithm should be documented here.

## ?name= URL parameter (Q211A)

The `?name=` query parameter pre-fills the name field and triggers generation on load. This enables sharing a link that generates a specific name directly.

The implementation uses `history.replaceState` to write the normalised display name back into the URL after generation. This means:

- The visitor's typed name is preserved in the browser's history for that session.
- Anyone inspecting the browser history or URL bar sees the typed name.

This is an intentional design choice — it is the mechanism that makes the shareable link work. The README notes this as a privacy nuance for any user who shares their device. No server-side logging occurs; the name never leaves the browser.
