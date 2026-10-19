# CLAUDE.md — PipOS Frontend Design Polish Pass

## Project Objective
Transform this React + Vite portfolio into **"Pip's tiny magical computer from 1998"** (PipOS).
You are performing the heavy lifting under the direction of Antigravity.

---

## YOUR CURRENT TASK: Frontend Design Polish (Phase 7 - 1998 OS Ergonomics)

Execute the 3 targeted aesthetic improvements:

### 1. Authentic 1998 Window Frames (`src/components/WindowPanel.jsx` & `src/index.css`)
- Add classic 1998 title bar horizontal grip stripes (`≡ ≡ ≡`) behind the window title.
- Give title bar control buttons (`_`, `□`, `X`) authentic retro beveled borders with active depression.
- Add an inset status bar at the bottom of the window (`SYS_READY | 432Hz | MEM: 64KB`) with subtle engraved borders.

### 2. Mobile Notification Tray (`src/components/SystemNotification.jsx` & `src/index.css`)
- On screens under 600px, replace the screen-covering floating modal with a docked system tray notification:
  - Dock it right above the taskbar (`bottom: 48px; left: 8px; right: 8px`).
  - Keep it compact so it never blocks desktop icon interaction or window contents.

### 3. Tactile 1998 Controls & Micro-Interactions (`src/index.css`)
- Apply mechanical depression (`transform: translate(1px, 1px)`) and classic beveled shadow shifts on all button `:active` states.
- Ensure all long-form narrative text uses crisp, high-contrast readable type rather than hard-to-read pixel font.
- Maintain high WCAG AA contrast for both Day (`#FFF8F1`, `#A34063`) and Night (`#130F1E`, `#FFF5E4`, `#E8C978`) modes.

---

## Verification
- Run `npm run build` and `npx oxlint src` — must pass with 0 errors.

Execute this pass now.
