import { useEffect, useRef, useState } from 'react';
import TimerScreen from './components/TimerScreen.jsx';
import { useTimer } from './hooks/useTimer.js';
import { useSync } from './hooks/useSync.js';
import { usePhaseColors } from './hooks/usePhaseColors.js';

function generateSessionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const SESSION_ID = generateSessionId();

export default function App() {
  const { colors, setPhaseColor, resetAll } = usePhaseColors();

  const applyRemoteRef = useRef(null);
  const { status, peers, devices, sendState } = useSync(SESSION_ID, (s) => applyRemoteRef.current?.(s));
  const { state, start, pause, reset, skip, applyRemote } = useTimer(sendState);
  applyRemoteRef.current = applyRemote;

  return (
    <TimerScreen
      state={state}
      peers={peers}
      devices={devices}
      syncStatus={status}
      sessionId={SESSION_ID}
      colors={colors}
      onSetPhaseColor={setPhaseColor}
      onResetColors={resetAll}
      onStart={start}
      onPause={pause}
      onReset={reset}
      onSkip={skip}
    />
  );
}
