import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Heart, Check, Send } from 'lucide-react';
import { playClickSound, playChimeSound } from '../utils/audio';

const STORAGE_KEY = 'pip_dreambook_entries';

const SEEDED_ENTRIES = [
  {
    id: 'seed-1',
    name: 'LUNA_01',
    message: 'Your nightlights are adorable.',
    timestamp: '10/19/98 23:42',
    badge: '★',
    entryNum: '#0041',
  },
  {
    id: 'seed-2',
    name: 'MOONBYTE',
    message: 'The Dream Router is magical.',
    timestamp: '10/19/98 23:46',
    badge: '★',
    entryNum: '#0042',
  },
];

// Sanitize user inputs to prevent HTML/script injection
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

export default function Dreambook({ isMissionActive = true, onSign }) {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback if localStorage parse fails
    }
    return SEEDED_ENTRIES;
  });

  const [name, setName] = useState('');
  const [dreamMessage, setDreamMessage] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 3;

  // Persist to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore storage quota error
    }
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const cleanName = sanitizeText(name).slice(0, 24);
    const cleanMsg = sanitizeText(dreamMessage).slice(0, 180);

    if (!cleanName || cleanName.length < 2) {
      setValidationError('Please enter a name (at least 2 characters).');
      return;
    }

    if (!cleanMsg || cleanMsg.length < 3) {
      setValidationError('Please write a bedtime dream message for Pip (at least 3 characters).');
      return;
    }

    playChimeSound();

    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const nextEntryNum = `#${String(entries.length + 42).padStart(4, '0')}`;

    const newEntry = {
      id: `entry-${Date.now()}`,
      name: cleanName,
      message: cleanMsg,
      timestamp: `10/19/98 ${hrs}:${mins}`,
      badge: '★',
      entryNum: nextEntryNum,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setName('');
    setDreamMessage('');
    setCurrentPage(1);

    // Pip reaction
    const reaction = isMissionActive ? 'Dreambook signed.' : '♡ Pip saved your dream.';
    setFeedbackMsg(reaction);

    if (onSign) {
      onSign(newEntry);
    }

    // Auto-dismiss feedback after 5 seconds
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 5000);
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(entries.length / entriesPerPage));
  const displayedEntries = entries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="dreambook-container">
      {/* 90s Subtitle & Mode Header */}
      <div className="section-title-bar" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} color="var(--pip-berry)" />
          <span className="font-retro title-text">LEAVE A LITTLE DREAM FOR PIP</span>
        </div>
        <span className="font-pixel subtitle-text" title="Local Dreambook using browser localStorage">
          [ LOCAL DREAMBOOK ]
        </span>
      </div>

      {/* Retro Guestbook Identity Banner */}
      <div className="dreambook-meta-banner font-mono">
        <div className="meta-left">
          <span>GUESTBOOK ENTRY #{String(entries.length + 42).padStart(4, '0')}</span>
          <span className="meta-dot">•</span>
          <span>LAST SIGNED: 10/19/98</span>
        </div>
        <div className="meta-right">
          <span className="dreambook-storage-pill font-pixel">💾 LOCAL STORAGE READY</span>
        </div>
      </div>

      {/* Pip Reaction Notice (Non-intrusive Inline Status) */}
      {feedbackMsg && (
        <div className="dreambook-reaction-bar font-pixel" role="status" aria-live="polite">
          <Heart size={14} fill="var(--pip-pink)" color="var(--pip-berry)" />
          <span>{feedbackMsg}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--pip-brown-light)' }}>
            <Check size={12} style={{ display: 'inline', marginRight: '2px' }} />
            SAVED
          </span>
        </div>
      )}

      {/* Validation Warning */}
      {validationError && (
        <div className="dreambook-error-bar font-pixel" role="alert">
          <span>⚠ {validationError}</span>
        </div>
      )}

      {/* 1998 Sign-In Form */}
      <form className="dreambook-form" onSubmit={handleSubmit} noValidate>
        <div className="dreambook-form-group">
          <div className="form-label-row">
            <label htmlFor="dreambook-name" className="font-pixel form-label">
              NAME:
            </label>
            <span className="font-mono char-count">{name.length}/24</span>
          </div>
          <input
            id="dreambook-name"
            type="text"
            className="dreambook-input font-retro"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 24))}
            placeholder="e.g. STAR_TRAVELER"
            maxLength={24}
            required
            autoComplete="off"
          />
        </div>

        <div className="dreambook-form-group">
          <div className="form-label-row">
            <label htmlFor="dreambook-message" className="font-pixel form-label">
              DREAM MESSAGE:
            </label>
            <span className="font-mono char-count">{dreamMessage.length}/180</span>
          </div>
          <textarea
            id="dreambook-message"
            className="dreambook-textarea font-body"
            value={dreamMessage}
            onChange={(e) => setDreamMessage(e.target.value.slice(0, 180))}
            placeholder="Whisper a warm bedtime dream or note for Pip..."
            rows={3}
            maxLength={180}
            required
          />
        </div>

        <div className="dreambook-submit-row">
          <button
            type="submit"
            className="pip-button pip-button-primary dreambook-sign-btn"
            onClick={playClickSound}
          >
            <Send size={14} />
            <span>[ SIGN DREAMBOOK ]</span>
          </button>
          <span className="font-pixel form-hint">
            ★ Dreams are safely saved to your local browser
          </span>
        </div>
      </form>

      {/* Recent Dreamers Entries List */}
      <div className="dreambook-entries-section">
        <div className="entries-heading-bar font-pixel">
          <Sparkles size={13} color="var(--pip-yellow)" />
          <span>RECENT DREAMERS ({entries.length} LOGGED)</span>
        </div>

        <div className="dreambook-entries-list" role="feed" aria-label="Dreambook signed entries">
          {displayedEntries.map((entry) => (
            <article key={entry.id} className="dreambook-entry-card">
              <header className="entry-card-header">
                <div className="entry-author">
                  <span className="entry-star">{entry.badge}</span>
                  <span className="entry-name font-retro">{entry.name}</span>
                </div>
                <div className="entry-meta font-mono">
                  <span className="entry-num">{entry.entryNum}</span>
                  <span className="entry-time">{entry.timestamp}</span>
                </div>
              </header>
              <p className="entry-message font-body">"{entry.message}"</p>
            </article>
          ))}
        </div>

        {/* Nostalgic Guestbook Pager Footer */}
        <nav className="dreambook-pager font-pixel" aria-label="Dreambook pagination">
          <button
            type="button"
            className="pip-button pip-button-soft pager-btn"
            onClick={() => {
              playClickSound();
              setCurrentPage((p) => Math.max(1, p - 1));
            }}
            disabled={currentPage === 1}
            aria-label="Previous Dreambook Page"
          >
            <span>&lt; PREV PAGE</span>
          </button>

          <span className="pager-status font-mono">
            PAGE {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            className="pip-button pip-button-soft pager-btn"
            onClick={() => {
              playClickSound();
              setCurrentPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={currentPage === totalPages}
            aria-label="Next Dreambook Page"
          >
            <span>NEXT PAGE &gt;</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
