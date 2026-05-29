import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PHASES } from '../hooks/useTimer.js';
import Background from './Background.jsx';
import ColorSettings from './ColorSettings.jsx';
import { deriveVars } from '../utils/colorUtils.js';

const DEVICE_LABEL = { web: 'Web', android: 'Android' };
const WEB_URL = 'https://yap-web-flame.vercel.app';

export default function TimerScreen({
  state, peers, devices, syncStatus, sessionId,
  colors, onSetPhaseColor, onSetBackgroundStyle, onResetColors,
  onStart, onPause, onReset, onSkip,
}) {
  const { phase, remainingSeconds, isRunning, sessionInCycle } = state;
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  const isWork = phase === 'WORK';
  const phaseLabel = PHASES[phase].label.toUpperCase();

  const schemeKey = !isRunning ? 'PAUSED' : phase;
  const scheme    = colors[schemeKey];
  const cssVars   = deriveVars(scheme.base, scheme.accent);

  const [showSync,   setShowSync]   = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [qrDataUrl,  setQrDataUrl]  = useState('');

  const syncConnected = syncStatus === 'connected' && peers > 0;

  // QR encodes just the session code — Android scans it and connects directly
  useEffect(() => {
    QRCode.toDataURL(sessionId, {
      width: 180, margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl);
  }, [sessionId]);

  const closeAll = () => { setShowSync(false); setShowColors(false); };

  return (
    <div className={`screen ${isWork ? 'phase-work' : 'phase-break'}`} style={cssVars}>
      <Background isWork={isWork} style={colors.backgroundStyle ?? 'lava'} />

      {/* ── Header ── */}
      <header className="glass-bar">
        <span className="app-name">YAP</span>

        <div className="header-center">
          {syncConnected && (
            <div className="device-chips">
              {devices.map((d, i) => (
                <span key={i} className="device-chip">
                  <span className="chip-dot" />
                  {DEVICE_LABEL[d] ?? d}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          <button
            className={`pill-btn ghost ${showColors ? 'accent' : ''}`}
            onClick={() => { closeAll(); setShowColors(v => !v); }}
          >
            Theme
          </button>

          <button
            className={`pill-btn ghost ${syncConnected ? 'accent' : ''}`}
            onClick={() => { closeAll(); setShowSync(v => !v); }}
          >
            <span className={`status-dot status-${syncStatus}`} />
            {syncConnected ? `${peers} synced` : 'Sync'}
          </button>
        </div>
      </header>

      {/* ── Colour settings ── */}
      {showColors && (
        <ColorSettings
          colors={colors}
          onSetPhaseColor={onSetPhaseColor}
          onSetBackgroundStyle={onSetBackgroundStyle}
          onResetAll={onResetColors}
          onClose={() => setShowColors(false)}
        />
      )}

      {/* ── Sync drawer ── */}
      {showSync && (
        <div className="sync-drawer glass-panel">
          <p className="sync-hint">
            Open <strong>YAP</strong> on your phone, tap <strong>Sync</strong>, and enter the code below.
          </p>
          <div className="sync-body">
            {qrDataUrl && <img src={qrDataUrl} alt="QR" className="qr-img" />}
            <div className="sync-details">
              <p className="sync-label">Session code</p>
              <p className="sync-code">{sessionId}</p>
              <div className="sync-devices">
                {syncConnected
                  ? devices.map((d, i) => (
                      <span key={i} className="device-chip">
                        <span className="chip-dot" />
                        {DEVICE_LABEL[d] ?? d}
                      </span>
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
