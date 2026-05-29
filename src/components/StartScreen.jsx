import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Background from './Background.jsx';

export default function StartScreen({ sessionId, syncStatus, peers, colors, onStart }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(sessionId, {
      width: 220, margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl);
  }, [sessionId]);

  const connected = syncStatus === 'connected' && peers > 0;

  // Auto-advance once a phone connects
  useEffect(() => {
    if (connected) {
      const t = setTimeout(onStart, 800);
      return () => clearTimeout(t);
    }
  }, [connected, onStart]);

  const scheme = colors?.WORK;
  const bgStyle = {
    '--c-base':   scheme?.base   ?? '#1a1114',
    '--c-blob-a': '#c0363e',
    '--c-blob-b': '#e07060',
    '--c-blob-c': '#9b2a55',
    '--c-blob-d': '#d4506a',
    '--c-blob-e': '#7a1f3a',
  };

  return (
    <div className="start-screen phase-work" style={bgStyle}>
      <Background isWork style={colors?.backgroundStyle ?? 'lava'} />

      <div className="start-scrim" />

      <main className="start-main">
        <div className="start-brand">
          <h1 className="start-logo">YAP</h1>
          <p className="start-tagline">Yet Another Pomodoro</p>
        </div>

        <div className="start-card">
          {/* QR code */}
          <div className="start-qr-wrap">
            {qrDataUrl
              ? <img src={qrDataUrl} alt="Session QR" className="start-qr" />
              : <div className="start-qr-placeholder" />}
          </div>

          <div className="start-info">
            <p className="start-hint">
              Open <strong>YAP</strong> on your phone, tap <strong>Sync</strong>,
              and scan this code to link both devices.
            </p>

            <div className="start-code-row">
              <span className="start-code-label">Session code</span>
              <span className="start-code">{sessionId}</span>
            </div>

            <div className="start-status-row">
              <span className={`status-dot status-${syncStatus}`} />
              <span className="start-status-text">
                {connected
                  ? `Phone connected — starting…`
                  : syncStatus === 'connecting'
                    ? 'Connecting to relay…'
                    : 'Waiting for phone'}
              </span>
            </div>
          </div>
        </div>

        <button className="start-solo-btn" onClick={onStart}>
          Use without sync
        </button>
      </main>
    </div>
  );
}
