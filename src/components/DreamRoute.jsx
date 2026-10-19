import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Check } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { dreamPackets } from '../data/dreamsData';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function DreamRoute({ onRouteComplete, isCompleted = false }) {
  const [selectedDream, setSelectedDream] = useState(dreamPackets[0]);
  const [routeState, setRouteState] = useState(isCompleted ? 'DELIVERED' : 'IDLE'); // IDLE, ROUTING, DELIVERED
  const [pipStep, setPipStep] = useState(0);
  const [completed, setCompleted] = useState(isCompleted);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const waypoints = [
    { id: 'moon', x: 250, y: 35, label: 'Moon Relay 🌙', emoji: '🌙' },
    { id: 'junction', x: 250, y: 85, label: 'Little Dipper Gate', emoji: '✦' },
    { id: 'left-cloud', x: 130, y: 135, label: 'Marshmallow Cloud', emoji: '☁' },
    { id: 'right-cloud', x: 370, y: 135, label: 'Starlight Lighthouse', emoji: '⭐' },
    { id: 'shelf-mid', x: 250, y: 190, label: 'Cloud Shelf R-09', emoji: '☁' },
    { id: 'shelf-left', x: 90, y: 200, label: 'Pillow Terminal', emoji: '☁' },
    { id: 'shelf-right', x: 410, y: 200, label: 'Warm Quilt Gate', emoji: '☁' },
    { id: 'home', x: 250, y: 275, label: 'Dreamer Bedroom 🏠', emoji: '🏠' },
  ];

  const deliveryPathIndices = [0, 1, 3, 4, 7];

  const handleStartDelivery = () => {
    playClickSound();
    setRouteState('ROUTING');
    setPipStep(0);

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    deliveryPathIndices.forEach((nodeIdx, stepIdx) => {
      const id = setTimeout(() => {
        setPipStep(stepIdx);
        playClickSound();
        if (stepIdx === deliveryPathIndices.length - 1) {
          setRouteState('DELIVERED');
          setCompleted(true);
          playChimeSound();
          if (onRouteComplete) onRouteComplete();
        }
      }, stepIdx * 800);
      timeoutsRef.current.push(id);
    });
  };

  const currentCoords = waypoints[deliveryPathIndices[pipStep]];

  return (
    <WindowPanel
      title="PROJECT 02 — DREAM DELIVERY ROUTES"
      icon={<Send size={14} color="var(--pip-berry)" />}
      statusText={`ROUTE ENGINE: ${routeState === 'ROUTING' ? 'DELIVERING...' : routeState === 'DELIVERED' ? '✓ DELIVERY SUCCESS' : 'ROUTE LOCKED'}`}
      className="dream-route-window"
    >
      <div className="dream-route-showcase">
        {/* Packet selection bar */}
        <div className="route-packet-selector">
          <span className="font-pixel selector-title">SELECT DREAM PAYLOAD:</span>
          <div className="packet-button-group">
            {dreamPackets.map((pkt) => (
              <button
                key={pkt.id}
                type="button"
                className={`packet-pill-btn ${selectedDream.id === pkt.id ? 'active' : ''}`}
                onClick={() => {
                  playClickSound();
                  setSelectedDream(pkt);
                  setRouteState('IDLE');
                  setPipStep(0);
                }}
              >
                <span className="packet-emoji">☁</span>
                <span className="font-pixel">{pkt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Visual Showcase: The Dream Map */}
        <div className="dream-map-viewport">
          <svg
            className="dream-map-svg"
            viewBox="0 0 500 310"
            aria-label="Celestial Dream Delivery Route Map"
          >
            <defs>
              <linearGradient id="routeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FCE7A2" />
                <stop offset="50%" stopColor="#F7D6E0" />
                <stop offset="100%" stopColor="#A34063" />
              </linearGradient>
            </defs>

            {/* Path lines connecting waypoints */}
            <line x1="250" y1="45" x2="250" y2="85" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="250" y1="85" x2="130" y2="135" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="250" y1="85" x2="370" y2="135" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="130" y1="135" x2="90" y2="200" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="130" y1="135" x2="250" y2="190" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="370" y1="135" x2="250" y2="190" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="370" y1="135" x2="410" y2="200" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="90" y1="200" x2="250" y2="190" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="250" y1="190" x2="410" y2="200" stroke="var(--pip-brown)" strokeWidth="2.5" strokeDasharray="4 3" />
            <line x1="250" y1="190" x2="250" y2="265" stroke="var(--pip-brown)" strokeWidth="3" strokeDasharray="4 3" />

            {/* Glowing Active Route Line */}
            {routeState !== 'IDLE' && (
              <polyline
                points="250,45 250,85 370,135 250,190 250,265"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                className="animated-route-stroke"
              />
            )}

            {/* Render Waypoint Nodes */}
            {waypoints.map((wp) => (
              <g key={wp.id} className="waypoint-group">
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={wp.id === 'moon' || wp.id === 'home' ? 18 : 12}
                  fill="var(--pip-cream)"
                  stroke="var(--pip-brown)"
                  strokeWidth="2.5"
                />
                <text
                  x={wp.x}
                  y={wp.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  className="font-pixel"
                >
                  {wp.emoji}
                </text>
                <text
                  x={wp.x}
                  y={wp.y + 24}
                  textAnchor="middle"
                  fill="var(--text-main)"
                  fontSize="10"
                  fontFamily="var(--font-pixel)"
                  fontWeight="bold"
                >
                  {wp.label}
                </text>
              </g>
            ))}

            {/* Pip Traveling Along Route Token */}
            <motion.g
              animate={{ x: currentCoords.x, y: currentCoords.y }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              <circle
                r="16"
                fill="var(--pip-berry)"
                stroke="#FFF8F1"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 6px rgba(163, 64, 99, 0.6))"
              />
              <text x="0" y="5" textAnchor="middle" fontSize="13">
                👶
              </text>
            </motion.g>
          </svg>
        </div>

        {/* Live Route Telemetry & Controls */}
        <div className="route-telemetry-panel">
          <div className="telemetry-info">
            <span className="font-mono text-muted">DESTINATION:</span>
            <strong className="font-body">{selectedDream.sender}</strong>
            <span className="font-mono text-muted" style={{ marginLeft: '12px' }}>FREQUENCY:</span>
            <span className="pip-tag font-mono">{selectedDream.frequency}</span>
          </div>

          <div className="route-actions" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              className="pip-button pip-button-primary dispatch-btn"
              onClick={handleStartDelivery}
              disabled={routeState === 'ROUTING'}
            >
              <Sparkles size={14} />
              <span>
                {routeState === 'ROUTING'
                  ? 'PIP IS DELIVERING DREAM...'
                  : routeState === 'DELIVERED'
                  ? '✓ DREAM DELIVERED! (DISPATCH AGAIN)'
                  : '[ DISPATCH PIP ON DREAM ROUTE ]'}
              </span>
            </button>
            {completed && (
              <div className="font-pixel" style={{ color: 'var(--pip-green)', fontSize: '0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Check size={12} /> Dream delivery route successfully completed!
              </div>
            )}
          </div>
        </div>
      </div>
    </WindowPanel>
  );
}
