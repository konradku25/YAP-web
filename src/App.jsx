import { useCallback, useEffect, useState } from 'react';
import ConnectScreen from './components/ConnectScreen.jsx';
import TimerScreen from './components/TimerScreen.jsx';
import { useTimer } from './hooks/useTimer.js';
import { useSync } from './hooks/useSync.js';

export default function App() {
  // Read ?s=CODE from URL on load
  const [sessionId, setSessionId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('s')?.toUpperCase() ?? null;
  });

  const { status, peers, sendState } = useSync(sessionId, applyRemote);
  const { state, start, pause, reset, skip, applyRemote } = useTimer(sendState);

  // Auto-update URL when session changes so page is shareable
  useEffect(() => {
    if (sessionId) {
      window.history.replaceState({}, '', `?s=${sessionId}`);
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [sessionId]);

  const disconnect = useCallback(() => {
    setSessionId(null);
  }, []);

  if (!sessionId) {
    return <ConnectScreen onConnect={setSessionId} />;
  }

  return (
    <TimerScreen
      state={state}
      peers={peers}
      syncStatus={status}
      sessionId={sessionId}
      onStart={start}
      onPause={pause}
      onReset={reset}
      onSkip={skip}
      onDisconnect={disconnect}
    />
  );
}
