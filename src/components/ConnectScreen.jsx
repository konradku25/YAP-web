import { useState } from 'react';

export default function ConnectScreen({ onConnect }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length < 4) {
      setError('Session code must be at least 4 characters.');
      return;
    }
    onConnect(clean);
  };

  return (
    <div className="connect-screen">
      <div className="connect-card">
        <h1 className="app-title">YAP</h1>
        <p className="app-subtitle">Yet Another Pomodoro</p>

        <div className="divider" />

        <p className="connect-hint">
          Open YAP on your phone, tap&nbsp;<strong>Sync</strong>, and enter the
          session code shown — or scan the QR to open this page automatically.
        </p>

        <form onSubmit={handleSubmit} className="connect-form">
          <input
            className="code-input"
            type="text"
            placeholder="ABCD12"
            maxLength={8}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" type="submit">
            Connect
          </button>
        </form>
      </div>
    </div>
  );
}
