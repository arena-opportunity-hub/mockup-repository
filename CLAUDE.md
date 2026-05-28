# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repository is the central mockup catalogue for the **Opportunity Hub** feature — an internal Reply tool that matches project opportunities against consultant skill profiles.

- Deployed as a **GitHub Pages** site (`index.html` is the entry point — a catalogue, not itself a mockup)
- Designers and developers navigate the catalogue to find and review individual screen mockups
- Mockups use **React 18 + MUI v5**

## Repo Structure

```
mockup-repo/
├── index.html          # Catalogue entry point (GitHub Pages root)
├── shared/
│   ├── styles.css      # Full design system — copy on changes, do not inline
│   └── script.js       # Shared utilities: tabs, chips, drawer, snackbar, dropdowns
└── mockups/            # One .html file per screen
```

## Design Tokens (from styles.css)

- **Primary:** `#1976D2`  |  **Primary Light:** `#E3F0FC`  |  **Primary Dark:** `#1256A0`
- **Danger:** `#E53935`  |  **Text:** `#212121`  |  **Muted:** `#757575`  |  **Border:** `#E0E0E0`  |  **Surface:** `#FFFFFF`  |  **BG:** `#F5F6F8`
- **Status pills:**
  - approved: background `#E1F5EE`, color `#0F6E56`
  - review: background `#FAEEDA`, color `#854F0B`
  - rejected: background `#FCEBEB`, color `#791F1F`
  - neutral: background `#F1EFE8`, color `#5F5E5A`
- **Font:** Roboto
- **Buttons:** uppercase, `font-weight: 700`, `letter-spacing: 0.5px`

These conventions follow FinHUB Material Design. Do not deviate from them when adding or editing mockups.

## Adding a New Mockup

1. Create `mockups/<screen-name>.html`
2. Use the standard React+MUI shell (see any existing mockup for the pattern):
   - `<script type="module">` with imports from `https://esm.sh/react@18`, `https://esm.sh/react-dom@18/client`, `https://esm.sh/htm`, `https://esm.sh/@mui/material@5`
   - `const html = htm.bind(h)` — use `html\`...\`` for JSX-like templates
   - MockupBar component (sticky white top bar with "← Katalog" link)
   - MUI theme with `primary: { main: '#1976D2' }` and `disableElevation: true` on buttons
3. Add an entry to `index.html` in the appropriate sprint group with the correct status badge (`done`, `in-progress`, or `planned`)

## Status Badges in index.html

Each catalogue card has a `data-status` attribute: `done`, `in-progress`, or `planned`.

- Set it **honestly** — only mark `done` when the mockup fully reflects the UI spec.
- `planned` cards display a disabled "Öffnen" button (no link target yet).

## No Build Step

This is intentional. Open any file directly in a browser or push to GitHub Pages. No npm, no bundler, no compilation required. All dependencies are loaded at runtime from `esm.sh`.
