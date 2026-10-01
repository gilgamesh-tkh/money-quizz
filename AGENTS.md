# AGENTS.md

Static app. No build, no deps, no tests, no tooling.

## Structure
- `index.html` is the entrypoint: skeleton + CDN + `<script>` tags. No inline code.
- `css/style.css` — all styles, incl. `:root[data-theme]` theming and `prefers-reduced-motion` guards.
- `js/data.js` — quiz content only: `PTS`, `QUESTIONS`, `TYPES`, `DRAW` (result SVGs), `ADVICE`.
- `js/quiz.js` — quiz flow: `showQuestion()` → `answer()` → `showResult()` → `showSlides()`, plus `restart()`.
- `js/theme.js` — light/dark toggle (`localStorage('mq-theme')`, defaults to `prefers-color-scheme`).
- `js/background.js` — Three.js background (hand-style sprites + 3D coins).
- `js/main.js` — boot: calls `showQuestion()`.
- Open via local server (`python3 -m http.server`) or directly (`xdg-open index.html`). No build step.

## External deps (CDN, needs network)
- `three.js r128` via cdnjs, Google Fonts `Caveat` + `Kalam`. No local fallback — offline breaks 3D bg and fonts.

## Coupling / gotchas
- Scripts are classic (no modules) and share globals — order in `index.html` matters: `data → quiz → theme → background → main`.
- Quiz ↔ background communicate only via `window` events: `qchange`, `qanswer` (detail `{pts}`), `qreset`, `themechange`. Keep these names/signatures.
- UI copy is French — keep new strings in French.
- Scoring max is 25 (5 questions × max 5 pts). `TYPES` ranges (5-9/10-14/15-19/20-25) must stay contiguous if questions change.
- `prefers-reduced-motion: reduce` puts bg in `still` mode (single frame, no rAF loop) — preserve this when touching animation.
- No test/lint config exists. Verify with `node --check js/*.js` + open the page and check the console; exercise quiz → result → "Mes conseils" → restart, plus theme toggle.
