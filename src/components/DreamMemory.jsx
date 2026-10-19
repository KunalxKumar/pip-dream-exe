import React, { useState } from 'react';
import { playClickSound, playChimeSound } from '../utils/audio';
import { Check, ArrowRight } from 'lucide-react';
import { dreamMemoryCards } from '../data/dreamMemoryData';

export default function DreamMemory({ onCompleteRoute }) {
  const [cards, setCards] = useState(() =>
    [...dreamMemoryCards].sort(() => Math.random() - 0.5).map((card, idx) => ({ ...card, uniqueKey: `${card.id}-${idx}` }))
  );
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleCardClick = (uniqueKey, pairId) => {
    if (isComplete || flippedIds.includes(uniqueKey) || matchedPairIds.includes(pairId)) return;
    playClickSound();

    if (flippedIds.length === 0) {
      setFlippedIds([uniqueKey]);
    } else if (flippedIds.length === 1) {
      const firstKey = flippedIds[0];
      const firstCard = cards.find((c) => c.uniqueKey === firstKey);
      const newFlipped = [firstKey, uniqueKey];
      setFlippedIds(newFlipped);

      if (firstCard.pairId === pairId) {
        // Match chime sound
        playChimeSound();
        const nextMatched = [...matchedPairIds, pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIds([]);
        if (nextMatched.length === 4) {
          setIsComplete(true);
        }
      } else {
        // Mismatch - reset after 700ms
        setTimeout(() => {
          setFlippedIds([]);
        }, 700);
      }
    }
  };

  const resetGame = () => {
    playClickSound();
    setCards([...dreamMemoryCards].sort(() => Math.random() - 0.5).map((card, idx) => ({ ...card, uniqueKey: `${card.id}-${idx}` })));
    setFlippedIds([]);
    setMatchedPairIds([]);
    setIsComplete(false);
  };

  return (
    <div className="dream-memory-container">
      {/* 2-Row Responsive Retro Header */}
      <div className="dream-memory-header">
        <div className="font-retro dream-memory-title">DREAM.MEMORY.EXE</div>
        <div className="font-pixel dream-memory-meta">
          <span className="dream-memory-instruction">Match 4 Cozy Dream Pairs</span>
          <span className="dream-memory-stability">Stability: {matchedPairIds.length * 25}%</span>
        </div>
      </div>

      {/* 8 Cards: 4x2 Desktop, 2x4 Mobile Grid */}
      <div className="dream-memory-grid">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.uniqueKey) || matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <button
              key={card.uniqueKey}
              type="button"
              className={`pip-button dream-memory-card ${isFlipped ? 'pip-button-primary' : ''}`}
              style={{
                opacity: isMatched ? 0.8 : 1,
              }}
              onClick={() => handleCardClick(card.uniqueKey, card.pairId)}
              aria-label={isFlipped ? `${card.name} symbol` : 'Hidden dream card'}
            >
              {isFlipped ? (
                <>
                  <span className="card-symbol">{card.symbol}</span>
                  <span className="font-pixel card-name">{card.name}</span>
                </>
              ) : (
                <span className="font-pixel card-back-icon">✦</span>
              )}
            </button>
          );
        })}
      </div>

      {isComplete ? (
        <div className="wow-delivery-verdict" style={{ background: '#FFFDF7', border: '2px solid var(--pip-green)' }}>
          <div className="verdict-header font-retro">
            <Check size={16} color="var(--pip-green)" />
            <span>✓ DREAM RECONSTRUCTED (100% STABILITY)</span>
          </div>
          <p className="verdict-quote font-body" style={{ margin: '4px 0' }}>
            All 4 cozy dream symbols paired! Bedtime frequency is 100% stabilized.
          </p>
          <button
            type="button"
            className="pip-button pip-button-primary"
            style={{ marginTop: '4px' }}
            onClick={() => {
              playClickSound();
              if (onCompleteRoute) onCompleteRoute();
            }}
          >
            <span>[ SEND TO DREAM ROUTER ]</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="dream-memory-footer font-pixel">
          <span className="pairs-matched-text">
            Pairs Matched: {matchedPairIds.length} / 4
          </span>
          <button
            type="button"
            className="pip-button pip-button-soft reset-board-btn"
            onClick={resetGame}
          >
            Reset Board
          </button>
        </div>
      )}
    </div>
  );
}
