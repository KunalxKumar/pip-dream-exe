# CLAUDE.md — PipOS Director Directives for Claude Code

## Project Objective
Transform this React + Vite portfolio into **"Pip's tiny magical computer from 1998"** (PipOS).
You are performing the heavy lifting under the direction of Antigravity.

## Current Progress & Architecture
- **Step 1 (Phase 0)**: Design tokens & colors locked in `src/index.css` (Day & Night Moonlit Nursery palettes).
- **Step 2 (Phase 1 & 3)**: Desktop shell & sticky sidebar dock overhauled (`src/components/Desktop.jsx`, `src/App.jsx`).
- **Step 3 (Phase 2)**: Hero window balanced, Dream Queue native status panel built, and WCAG AA contrast fixed (`src/components/Pip.jsx`).
- **Backup Branch**: `backup-step3-pre-claude` contains the verified clean state.

---

## YOUR CURRENT TASK: STEP 4 — Project Cards Overhaul (Phase 4)

Turn the 3 project cards in `src/components/ProjectCard.jsx` and `src/data/projectsData.js` from text-heavy prose into **working mini-app previews**:

### Principle: Show First. Explain Second.

### 1. Project 01 — Lullaby Lab (`id: 'lullaby-lab'`)
Mini interactive preview inside the card:
- Visual notes: `♪ ♫ ♪`
- Compact specs: `TEMPO: 68 BPM`, `MOOD: SLEEPY`
- Mini action button: `[ PLAY LULLABY ]` (triggers sound via `src/utils/audio.js`)
- Followed by: `[ OPEN PROJECT ]` button (expands/scrolls to full lab)

### 2. Project 02 — Dream Delivery Routes (`id: 'dream-routes'`)
Mini visual path preview:
- Compact delivery flow: `MOON ↓ CLOUD ↓ WINDOW ↓ SLEEP`
- Status badge: `ROUTE STATUS: READY`
- Mini action button: `[ DELIVER DREAM ]`
- Followed by: `[ OPEN PROJECT ]` button

### 3. Project 03 — Nightlight Collection (`id: 'nightlight-collection'`)
Mini lamp preview:
- Visual icon / star: `✦ MOON GLOW`
- Mini brightness meter: `████████░░`
- Mini action button: `[ TURN ON ]` (triggers gentle glow / toggle)
- Followed by: `[ OPEN PROJECT ]` button

---

## Constraints & Rules
- Do NOT rewrite the origin story yet.
- Do NOT add external dependencies.
- Preserve existing day/night color tokens.
- Run `npm run build` and `npx oxlint src` — must pass with 0 errors.
