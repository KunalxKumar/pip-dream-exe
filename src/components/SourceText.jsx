import React from 'react';

export default function SourceText() {
  return (
    <div className="lore-app-container source-txt-content font-mono">
      <div className="lore-top-badges font-pixel">
        <span className="lore-badge">EST. 1998</span>
        <span className="lore-badge">LAST DREAM PATCH: 10/19/98</span>
        <span className="lore-badge">BEST VIEWED AT 800×600</span>
      </div>

      <div className="source-paper-frame">
        <div className="source-paper-header font-pixel">
          <span>SOURCE.TXT — 1998 COMMENTARY</span>
          <span className="shortcut-badge">SHORTCUT: ALT + S</span>
        </div>

        <pre className="source-text-block font-mono">
{`HELLO, CURIOUS HUMAN.

YOU FOUND THE SOURCE.

PIPOS WAS BUILT WITH:

  • HTML
  • CSS
  • REACT
  • WEB AUDIO
  • A LITTLE JAVASCRIPT
  • A LOT OF BEDTIME MAGIC

"THANK YOU FOR LOOKING CLOSER."

VIEW SOURCE IS A VERY OLD HABIT.
AND THE BEST ONES NEVER DIE.`}
        </pre>

        <div className="source-paper-footer font-pixel">
          <span>// Hand-crafted in Midnight Nursery with love and starlight.</span>
        </div>
      </div>
    </div>
  );
}
