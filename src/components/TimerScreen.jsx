import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PHASES } from '../hooks/useTimer.js';
import Background from './Background.jsx';
import ColorSettings from './ColorSettings.jsx';

const DEVICE_ICON  = { web: '🖥️', android: '📱' };
const THEME_OPTIONS = [
  { value: 'dark',   label: '🌙 Dark'   },
  { value: 'light',  label: '☀️ Light'  },
  { value: 'system', label: '💻 System' },
];
const WEB_URL = 'https://yap-web-flame.vercel.app';

export default function TimerScreen({
  state, peers, devices, syncStatus, sessionId,
  theme, onThemeChange,
  colors, onSetColor, onSetBlob, onResetColors,
  onStart, onPause, onReset, onSkip,
}) {
  const { phase, remainingSeconds, isRunning, sessionInCycle } = state;
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  const isWork = phase === 'WORK';
  const phaseLabel = PHASES[phase].label.toUpperCase();

  // Active colour scheme — paused state overrides phase colours
  const schemeKey = !isRunning ? 'PAUSED' : phase;
  const scheme    = colors[schemeKey];

  // CSS vars injected onto the root element so Background (fixed) also picks them up
  const cssVars = {
    '--c-base':   scheme.base,
    '--c-blob-a': scheme.blobs[0],
    '--c-blob-b': scheme.blobs[1],
    '--c-blob-c': scheme.blobs[2],
    '--c-blob-d': scheme.blobs[3],
    '--c-blob-e': scheme.blobs[4],
  };

  const [showSync,   setShowSync]   = useState(false);
  const [showTheme,  setShowTheme]  = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [qrDataUrl,  setQrDataUrl]  = useState('');

  const syncUrl = `${WEB_URL}/?s=${sessionId}`;
  const syncConnected = syncStatus === 'connected' && peers > 0;

  useEffect(() => {
    QRCode.toDataURL(syncUrl, {
      width: 180, margin: 1,
      color: { dark: '#1a1114', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [syncUrl]);

  const closeAll = () => { setShowSync(false); setShowTheme(false); setShowColors(false); };

  return (
    <div
      className={`screen ${isWork ? 'phase-work' : 'phase-break'}`}
      style={cssVars}
    >
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
          {/* Palette */}
          <button
            className={`pill-btn ghost ${showColors ? 'accent' : ''}`}
            onClick={() => { closeAll(); setShowColors(v => !v); }}
          >
            🎨
          </button>

          {/* Theme */}
          <div className="dropdown-wrap">
            <button
              className="pill-btn ghost"
              onClick={() => { closeAll(); setShowTheme(v => !v); }}
            >
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
            onClick={() => { closeAll(); setShowSync(v => !v); }}
          >
            {syncConnected ? `🟢 ${peers} synced` : '⚡ Sync'}
          </button>
        </div>
      </header>

      {/* ── Colour settings ── */}
      {showColors && (
        <ColorSettings
          colors={colors}
          onSetColor={onSetColor}
          onSetBlob={onSetBlob}
          onResetAll={onResetColors}
          onClose={() => setShowColors(false)}
        />
      )}

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
                  ? devices.map((d, i) => (
                      <span key={i} className="device-chip">{DEVICE_ICON[d] ?? '❓'} {d}</span>
                    ))
                  : <span className="sync-waiting">Waiting for device…</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Timer ── */}
      <main className="timer-main">
        <p className="phase-label">{isRunning ? phaseLabel : 'PAUSED'}</p>

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
