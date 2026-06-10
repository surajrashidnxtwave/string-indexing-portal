# String Indexing & Slicing — Learning Portal

Unified interactive learning experience for Python string indexing & slicing.

**Live:** https://string-indexing-portal.vercel.app

## Arc
1. Motivation video (interactive)
2. Concept explainer (interactive, try-it widgets)
3. Worked example (interactive, live Python via Pyodide)
4. Adaptive practice (2PL IRT)
5. Flashcards
6. Recap video (interactive)
7. Cheatsheet

## Structure
- `index.html` — the portal (embedded player engine + app shell)
- `<video name>/` — `script.json` (single source of truth) + `player.html` (standalone) + `audio/` (ElevenLabs narration + manifest)
- `learning-experience/` — shared CSS + practice/IRT/item-bank JS

Static site — no build step. Every push to `main` auto-deploys via Vercel.
