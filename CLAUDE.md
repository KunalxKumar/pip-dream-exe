# CLAUDE.md — PipOS Director Directives for Claude Code

## Project Objective
Transform this React + Vite portfolio into **"Pip's tiny magical computer from 1998"** (PipOS).
You are performing the heavy lifting under the direction of Antigravity.

## Current Progress & Architecture
- **Step 1 (Phase 0)**: Design tokens & colors locked in `src/index.css` (Day & Night Moonlit Nursery palettes).
- **Step 2 (Phase 1 & 3)**: Desktop shell & sticky sidebar dock overhauled (`src/components/Desktop.jsx`, `src/App.jsx`).
- **Step 3 (Phase 2)**: Hero window balanced, Dream Queue native status panel built, and WCAG AA contrast fixed (`src/components/Pip.jsx`).
- **Step 4 (Phase 4)**: Interactive mini-app previews in `src/components/ProjectCard.jsx` and `src/index.css`.
- **Git State**: Clean commit `3d6eb6d`.

---

## YOUR CURRENT TASK: STEP 5 — System Notification Window Polish (Phase 5)

Polish the system notification popup in `src/components/SystemNotification.jsx` and `src/index.css` into an authentic 1998 OS alert dialog:

### Specifications:
1. **Window Frame**:
   - Give it an authentic 1998-era system message dialog aesthetic (classic beveled or clean pixel borders matching `WindowPanel`).
   - Title bar: `✦ PIPOS SYSTEM MESSAGE` with alert icon and close `[ X ]` button.
2. **Telemetry & Content**:
   - Status tag: `● PRIORITY PACKET` with timestamp `23:47`.
   - Clear retro header: `1 DREAM IS WAITING.`
   - Cozy message text: `Someone forgot how to sleep under the starlight.`
3. **Actions & Polish**:
   - Primary action button: `[ ✦ HELP PIP ]` (navigates/triggers dream dispatch on click).
   - Dismiss button: `[ LATER ]` or `[ X ]` with sound effect.
   - Smooth entrance/exit transitions with Framer Motion.
   - Ensure WCAG AA contrast compliance in both Day and Midnight themes.
4. **Verification**:
   - Run `npm run build` and `npx oxlint src` — must finish with 0 errors.

Execute this task now.
