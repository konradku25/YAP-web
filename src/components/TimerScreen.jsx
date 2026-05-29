import { PHASES } from '../hooks/useTimer.js';

const STATUS_LABEL = { connected: '🟢', connecting: '🟡', disconnected: '🔴' };

export default function TimerScreen({ state, peers, syncStatus, sessionId, onStart, onPause, onReset, onSkip, onDisconnect }) {
  const { phase, remainingSeconds, isRunning, sessionInCycle } = state;
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  const phaseInfo = PHASES[phase];
  const isWork = phase === 'WORK';

  return (
    <div className={`timer-screen ${isWork ? 'phase-work' : 'phase-break'}`}>
      <header className="timer-header">
        <span className="session-code">#{sessionId}</span>
        <span className="sync-badge">
          {STATUS_LABEL[syncStatus]} {peers} device{peers !== 1 ? 's' : ''}
        </span>
        <button className="btn-ghost" onClick={onDisconnect}>Disconnect</button>
      </header>

      <main className="timer-main">
        <p className="phase-label">{phaseInfo.label.toUpperCase()}</p>

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
