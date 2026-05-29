import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { PHASES } from '../hooks/useTimer.js';
import Background from './Background.jsx';

const DEVICE_ICON = { web: '🖥️', android: '📱' };
const THEME_OPTIONS = [
  { value: 'dark',   label: '🌙 Dark'   },
  { value: 'light',  label: '☀️ Light'  },
  { value: 'system', label: '💻 System' },
];

const WEB_URL = 'https://yap-web-flame.vercel.app';

export default function TimerScreen({
  state, peers, devices, syncStatus, sessionId,
  theme, onThemeChange,
  onStart, onPause, onReset, onSkip,
}) {
  const { phase, remainingSeconds, isRunning, sessionInCycle } = state;
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  const isWork = phase === 'WORK';
  const phaseLabel = PHASES[phase].label.toUpperCase();

  const [showSync, setShowSync]   = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const syncUrl = `${WEB_URL}/?s=${sessionId}`;

  useEffect(() => {
    QRCode.toDataURL(syncUrl, {
      width: 180, margin: 1,
      color: { dark: '#1a1114', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [syncUrl]);

  const syncConnected = syncStatus === 'connected' && peers > 0;

  return (
    <div className={`screen ${isWork ? 'phase-work' : 'phase-break'}`}>
      <Background isWork={isWork} />

      {/* ── Header ── */}
      <header className="glass-bar">
        <span className="app-name">YAP</span>

        <div className="header-center">
          {syncConnected && (
            <div className="device-chips">
              {devices.map((d, i) => (
                <span key={i} className="device-chip">
                  {DEVICE_ICON[d] ?? '❓'} {d}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          {/* Theme */}
          <div className="dropdown-wrap">
            <button className="pill-btn ghost" onClick={() => { setShowTheme(v => !v); setShowSync(false); }}>
              {THEME_OPTIONS.find(t => t.value === theme)?.label ?? '🌙'}
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

          {/* Sync */}
          <button
            className={`pill-btn ghost ${syncConnected ? 'accent' : ''}`}
            onClick={() => { setShowSync(v => !v); setShowTheme(false); }}
          >
            {syncConnected ? `🟢 ${peers} synced` : '⚡ Sync'}
          </button>
        </div>
      </header>

      {/* ── Sync drawer ── */}
      {showSync && (
        <div className="sync-drawer glass-panel">
          <p className="sync-hint">
            Open <strong>YAP</strong> on your phone → tap <strong>Sync</strong> → enter the code.
          </p>
          <div className="sync-body">
            {qrDataUrl && <img src={qrDataUrl} alt="QR" className="qr-img" />}
            <div className="sync-details">
              <p className="sync-label">Session code</p>
              <p className="sync-code">{sessionId}</p>
              <div className="sync-devices">
                {syncConnected
                  ? devices.map((d, i) => <span key={i} className="device-chip">{DEVICE_ICON[d] ?? '❓'} {d}</span>)
                  : <span className="sync-waiting">Waiting for device…</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Timer ── */}
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

        {/* Glass control bar */}
        <div className="controls-glass">
          <button className="icon-btn" onClick={onReset} title="Reset">↺</button>
          <button className="play-btn" onClick={isRunning ? onPause : onStart}>
            <span className="play-icon">{isRunning ? '⏸' : '▶'}</span>
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>
          <button className="icon-btn" onClick={onSkip} title="Skip">⏭</button>
        </div>
      </main>
    </div>
  );
}
