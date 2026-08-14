# Portfolio Website Handoff

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:4173/`.

## Source of truth

- Figma file: `米兰露营灯`
- Pages 1–28 are implemented in `script.js` and `styles.css`.
- `public/figma/` contains the Figma-derived assets.
- `AGENTS.md` contains the non-negotiable Figma and interaction rules.

## Important implementation rule

Preserve the Figma layout, typography, geometry, content, and static visuals. Add interaction only to verified original layers. Do not replace pages with screenshots or guessed typography, and do not alter Figma assets to remove backgrounds.

## Current directory update

Only the first Publications author line was updated to:

`-第一作者，发表于《上海轻工业》，2026.07`

The supplied transparent asset is stored at:

`public/figma/page-02/user/270-2152-updated.png`
