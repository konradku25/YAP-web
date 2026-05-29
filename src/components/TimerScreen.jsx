import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { PHASES } from '../hooks/useTimer.js';

const STATUS_LABEL = { connected: '🟢', connecting: '🟡', disconnected: '🔴' };
const THEME_OPTIONS = [
  { value: 'dark',   label: '🌙 Dark'   },
  { value: 'light',  label: '☀️ Light'  },
  { value: 'system', label: '💻 System' },
];

const WEB_URL = 'https://yap-web-flame.vercel.app';

export default function TimerScreen({
  state, peers, syncStatus, sessionId,
  theme, onThemeChange,
  onStart, onPause, onReset, onSkip,
}) {
  const { phase, remainingSeconds, isRunning, sessionInCycle } = state;
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  const isWork = phase === 'WORK';
  const phaseLabel = PHASES[phase].label.toUpperCase();

  const [showSync, setShowSync] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const syncUrl = `${WEB_URL}/?s=${sessionId}`;

  useEffect(() => {
    QRCode.toDataURL(syncUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [syncUrl]);

  return (
    <div className={`timer-screen ${isWork ? 'phase-work' : 'phase-break'}`}>
      <header className="timer-header">
        <span className="app-name">YAP</span>

        <div className="header-actions">
          {/* Theme picker */}
          <div className="dropdown-wrap">
            <button className="btn-ghost" onClick={() => { setShowTheme(v => !v); setShowSync(false); }}>
              {THEME_OPTIONS.find(t => t.value === theme)?.label ?? '🌙 Dark'}
            </button>
            {showTheme && (
              <div className="dropdown">
                {THEME_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`dropdown-item ${theme === opt.value ? 'active' : ''}`}
                    onClick={() => { onThemeChange(opt.value); setShowTheme(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sync button */}
          <button
            className={`btn-ghost sync-btn ${syncStatus === 'connected' ? 'synced' : ''}`}
            onClick={() => { setShowSync(v => !v); setShowTheme(false); }}
          >
            {STATUS_LABEL[syncStatus]} Sync {peers > 0 ? `· ${peers}` : ''}
          </button>
        </div>
      </header>

      {/* Sync panel */}
      {showSync && (
        <div className="sync-panel">
          <p className="sync-hint">
            Open <strong>YAP</strong> on your phone, tap <strong>Sync</strong>, and enter the code below.
          </p>
          <div className="sync-row">
            {qrDataUrl && (
              <img src={qrDataUrl} alt="Session QR" className="qr-img" />
            )}
            <div className="sync-info">
              <p className="sync-label">Session code</p>
              <p className="sync-code">{sessionId}</p>
              <p className="sync-status">
                {STATUS_LABEL[syncStatus]}&nbsp;
                {syncStatus === 'connected' ? `${peers} device${peers !== 1 ? 's' : ''} connected` : syncStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="timer-main">
        <p className="phase-label">{phaseLabel}</p>

        <div className="timer-display">
          <span className="timer-digits">{mins}</span>
          <span className="timer-colon">:</span>
          <span className="timer-digits">{secs}</span>
        </div>

        <div className="session-dots">
          {Array.from({ length: 4 }, (_, i) => {
            const filled = i < sessionInCycle || (phase === 'WORK' && i === sessionInCycle);
            return <span key={i} className={`dot ${filled ? 'dot-filled' : ''}`} />;
          })}
        </div>

        <div className="controls">
          <button className="btn-icon" onClick={onReset} title="Reset">↺</button>
          <button className="btn-primary large" onClick={isRunning ? onPause : onStart}>
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="btn-icon" onClick={onSkip} title="Skip">⏭</button>
        </div>
      </main>
    </div>
  );
}
