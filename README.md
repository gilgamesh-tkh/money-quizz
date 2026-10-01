# Money Quizz — Quiz de personnalité financière

Petit quiz statique (sans build, sans dépendances) qui détermine ton profil financier :
**Spender**, **Balancer**, **Saver** ou **Investor**, avec des conseils personnalisés.

🌐 **Démo en ligne : https://gilgamesh-tkh.github.io/money-quizz/**

## Lancement local

```bash
python3 -m http.server
# puis ouvrir http://localhost:8000
```

Ou directement : `xdg-open index.html`. Aucune étape de build.

> Nécessite une connexion réseau : fond 3D via `three.js` (CDN) et polices Google Fonts (`Caveat` + `Kalam`).

## Structure

- `index.html` — point d'entrée : squelette + CDN + balises `<script>`.
- `css/style.css` — tous les styles (thèmes clair/sombre, `prefers-reduced-motion`).
- `js/data.js` — contenu du quiz : `PTS`, `QUESTIONS`, `TYPES`, `DRAW`, `ADVICE`.
- `js/quiz.js` — déroulement : `showQuestion()` → `answer()` → `showResult()` → `showSlides()`.
- `js/theme.js` — bascule clair/sombre (`localStorage`, `prefers-color-scheme`).
- `js/background.js` — fond Three.js (dessins main levée + pièces 3D).
- `js/main.js` — amorçage.
- `img/money-quiz-icon.svg` — icône du projet (favicon).

## Licence

MIT — voir [LICENSE](LICENSE).
