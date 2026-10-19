import React, { useState } from 'react';
import { playClickSound } from '../utils/audio';
import { Check, ArrowRight } from 'lucide-react';

export default function DreamMemory({ onCompleteRoute }) {
  const allCards = [
    { id: 'c1', pairId: 'star', symbol: '★', name: 'STAR' },
    { id: 'c2', pairId: 'star', symbol: '★', name: 'STAR' },
    { id: 'c3', pairId: 'moon', symbol: '🌙', name: 'MOON' },
    { id: 'c4', pairId: 'moon', symbol: '🌙', name: 'MOON' },
    { id: 'c5', pairId: 'cloud', symbol: '☁️', name: 'CLOUD' },
    { id: 'c6', pairId: 'cloud', symbol: '☁️', name: 'CLOUD' },
    { id: 'c7', pairId: 'lantern', symbol: '🏮', name: 'LANTERN' },
    { id: 'c8', pairId: 'lantern', symbol: '🏮', name: 'LANTERN' },
  ];

  const [cards, setCards] = useState(() =>
    [...allCards].sort(() => Math.random() - 0.5).map((card, idx) => ({ ...card, uniqueKey: `${card.id}-${idx}` }))
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
        // Match!
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
    setCards([...allCards].sort(() => Math.random() - 0.5).map((card, idx) => ({ ...card, uniqueKey: `${card.id}-${idx}` })));
    setFlippedIds([]);
    setMatchedPairIds([]);
    setIsComplete(false);
  };

  return (
    <div className="dream-memory-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="section-title-bar">
        <span className="font-retro title-text">DREAM.MEMORY.EXE</span>
        <span className="font-pixel subtitle-text">[ Match 4 Cozy Dream Pairs ]</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '10px 0' }}>
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.uniqueKey) || matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <button
              key={card.uniqueKey}
              type="button"
              className={`pip-button ${isFlipped ? 'pip-button-primary' : ''}`}
              style={{
                height: '80px',
                fontSize: '1.8rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isMatched ? 0.8 : 1,
              }}
              onClick={() => handleCardClick(card.uniqueKey, card.pairId)}
            >
              {isFlipped ? (
                <>
                  <span>{card.symbol}</span>
                  <span className="font-pixel" style={{ fontSize: '0.65rem', marginTop: '2px' }}>{card.name}</span>
                </>
              ) : (
                <span className="font-pixel" style={{ fontSize: '1.2rem', color: 'var(--pip-berry)' }}>✦</span>
              )}
            </button>
          );
        })}
      </div>

      {isComplete ? (
        <div className="wow-delivery-verdict" style={{ background: '#FFFDF7', border: '2px solid var(--pip-green)' }}>
          <div className="verdict-header font-retro">
            <Check size={16} color="var(--pip-green)" />
            <span>✓ DREAM RECONSTRUCTED SUCCESSFULLY</span>
          </div>
          <p className="verdict-quote font-body">
            All 4 dream symbols successfully paired! The bedtime frequency is fully stabilized.
          </p>
          <button
            type="button"
            className="pip-button pip-button-primary"
            style={{ marginTop: '6px' }}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-pixel" style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Pairs Matched: {matchedPairIds.length} / 4
          </span>
          <button
            type="button"
            className="pip-button pip-button-soft"
            style={{ padding: '6px 12px', fontSize: '0.7rem' }}
            onClick={resetGame}
          >
            Reset Board
          </button>
        </div>
      )}
    </div>
  );
}
