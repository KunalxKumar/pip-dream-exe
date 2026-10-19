# CLAUDE.md — MASTER DIRECTIVES: PIP.DREAM.EXE 1998 DESKTOP OPERATING SYSTEM

## Core Objective
Upgrade PipOS from a scrolling portfolio into a believable **1998 magical desktop operating system**, inspired by the interaction philosophy of Retro-Folio (`mariarodr1136/Retro-Folio`).
Do NOT copy Retro-Folio's code/assets/clippy. Keep PipOS uniquely: **"Pip's tiny magical computer from 1998."**

---

## ARCHITECTURAL BREAKDOWN

### Phase 1 — Application Window Manager & Desktop UX
1. **Central Application Registry (`src/data/appsData.js`)**:
   - Centralize applications:
     - `pip`: PIP (Hero Resident)
     - `projects`: PROJECTS (3 Bedtime Engines)
     - `dream-memory`: DREAM.MEMORY.EXE (Dream Toy Mini-game)
     - `lullaby`: LULLABY LAB (Audio Synthesizer)
     - `dream-route`: DREAM ROUTER (Celestial Routing)
     - `nightlights`: NIGHTLIGHTS (Bedside Lamps)
     - `dream-log`: DREAM LOG (Origin Chronicle)
     - `secret`: SECRET (Easter Egg)
2. **Window Manager Hook (`src/hooks/useWindowManager.js`)**:
   - Manage `openWindows`, `activeWindowId`, `zIndex`, `minimized`, and desktop positions `(x, y)`.
   - Operations: `openWindow(appId)`, `closeWindow(appId)`, `minimizeWindow(appId)`, `restoreWindow(appId)`, `focusWindow(appId)`, `updateWindowPosition(appId, x, y)`.
   - Prevent window title bar from being dragged off-screen (keep ≥48px accessible).
   - Disable dragging on mobile (`<= 768px`).
3. **WindowPanel Integration (`src/components/WindowPanel.jsx`)**:
   - Add dragging via title bar on desktop.
   - Wire minimize (`_`) and close (`X`) buttons directly to window manager.
   - Bring window to front on click.
4. **Desktop Icon Interaction (`src/components/Desktop.jsx`)**:
   - Single-click: select/highlight icon.
   - Double-click (or Enter / Mobile single tap): open application.
   - Short labels to avoid ugly wrapping (`LULLABY`, `ROUTES`, `LIGHTS`, `DREAM TOY`).
5. **Taskbar & Start Menu (`src/components/StatusBar.jsx`)**:
   - Left: `♥ PipOS / START` button opens compact nostalgic Start Menu.
   - Center: Dynamic taskbar tabs for open applications (`active` highlighted, `minimized` dimmed). Clicking toggles minimize/restore.
   - Right: Retain Day/Night, Sound, Network OK, and Live Clock.

---

### Phase 2 — DREAM.MEMORY.EXE Mini-Game & Mission Pipeline
1. **Dream Toy Mini-Game (`src/components/DreamMemory.jsx`, `src/data/dreamMemoryData.js`)**:
   - 4 cozy dream pairs (STAR, MOON, CLOUD, LANTERN) = 8 cards total.
   - Shuffled each round.
   - Cozy feedback: Web Audio chime on match, gentle bump on mismatch. No harsh punishment.
   - Completion state: `✓ DREAM RECONSTRUCTED`, `[ SEND TO DREAM ROUTER ]` button.
2. **Lightweight Shared Mission State (`src/hooks/useDreamMission.js`)**:
   - State: `dreamMemoryComplete`, `lullabyComplete`, `routeComplete`, `nightlightComplete`, `dreamDelivered`.
   - Linear magical flow:
     - `DREAM WAITING` → `DREAM MEMORY` → `LULLABY` → `DREAM ROUTER` → `NIGHTLIGHT` → `DREAM DELIVERED`
   - Unlock behavior is an invitation, not a wall: user can still explore any window freely.
3. **Pip Reactions & Final Delivery (`src/components/Pip.jsx`)**:
   - Pip reacts to mission status (`curious` → `working` → `listening` → `delivering` → `sleeping`).
   - Final Delivery sequence: `✓ DREAM DELIVERY COMPLETE (01:03)`, Pip closes eyes to sleep, heartfelt goodnight message with `[ Return to PipOS ]` action.
4. **Early-Web Soul**:
   - Tasteful 1998 easter eggs: `VISITOR #0042`, `BEST VIEWED AT 800x600`, `LAST DREAM PATCH: 10/19/1998`.

---

## CONSTRAINTS & VERIFICATION
- Zero new external libraries.
- No memory leaks; cleanup all timers & event listeners.
- Strict WCAG AA contrast for Day and Night modes.
- Full responsiveness down to 375px.
- Must pass `npm run build` and `npx oxlint src` with 0 warnings and 0 errors.
