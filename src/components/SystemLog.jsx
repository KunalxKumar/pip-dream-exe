import React from 'react';

export default function SystemLog({ missionState }) {
  const {
    dreamMemoryComplete = false,
    lullabyComplete = false,
    routeComplete = false,
    nightlightComplete = false,
    dreamDelivered = false,
  } = missionState || {};

  const entries = [
    { time: '23:47', event: 'PIP ONLINE', status: 'OK', complete: true },
    { time: '23:49', event: 'DREAM PACKET DETECTED', status: 'OK', complete: true },
    {
      time: '00:03',
      event: 'SIGNAL STABILIZED (DREAM MEMORY)',
      status: dreamMemoryComplete ? 'OK' : 'PENDING',
      complete: dreamMemoryComplete,
    },
    {
      time: '00:12',
      event: 'LULLABY HARMONIZED (432Hz WAVE)',
      status: lullabyComplete ? 'OK' : 'PENDING',
      complete: lullabyComplete,
    },
    {
      time: '00:26',
      event: 'CELESTIAL ROUTE LOCKED',
      status: routeComplete ? 'OK' : 'PENDING',
      complete: routeComplete,
    },
    {
      time: '00:41',
      event: 'DELIVERY DISPATCHED (NIGHTLIGHT)',
      status: nightlightComplete ? 'OK' : 'PENDING',
      complete: nightlightComplete,
    },
    {
      time: '01:03',
      event: 'DREAM DELIVERED TO BEDROOM SILL',
      status: dreamDelivered ? 'OK' : 'PENDING',
      complete: dreamDelivered,
    },
  ];

  return (
    <div className="lore-app-container system-log-content font-mono">
      <div className="lore-top-badges font-pixel">
        <span className="lore-badge">LOG_TTY_01</span>
        <span className="lore-badge">SYS_UPTIME: 100%</span>
        <span className="lore-badge">PATCH 10/19/98</span>
      </div>

      <div className="system-log-terminal">
        <div className="terminal-header font-pixel">
          <span>PIPOS KERNEL LOG — SESSION EVENT BUFFER</span>
          <span className="live-blink-dot font-mono">● LIVE</span>
        </div>

        <div className="terminal-body font-mono">
          <div className="log-table-header">
            <span className="col-time">TIME</span>
            <span className="col-event">EVENT</span>
            <span className="col-status">STATE</span>
          </div>

          <div className="log-divider" />

          {entries.map((entry, idx) => (
            <div
              key={idx}
              className={`log-entry-row ${entry.complete ? 'is-complete' : 'is-pending'}`}
            >
              <span className="col-time">{entry.time}</span>
              <span className="col-event">{entry.event}</span>
              <span className={`col-status status-${entry.status.toLowerCase()}`}>
                [{entry.status}]
              </span>
            </div>
          ))}
        </div>

        <div className="terminal-footer font-pixel">
          {dreamDelivered ? (
            <span className="footer-complete-text">
              ✓ ALL DREAM PACKETS SAFELY TRANSMITTED AT 01:03.
            </span>
          ) : (
            <span className="footer-pending-text">
              WAITING FOR DREAM PACKET COMPLETION...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
