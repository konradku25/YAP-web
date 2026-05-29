import { useEffect, useRef } from 'react';
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
  const { colors, setPhaseColor, setBackgroundStyle, resetAll, applyRemoteColors } = usePhaseColors();

  const applyRemoteRef = useRef(null);
  const { status, peers, devices, sendState, sendTheme } = useSync(
    SESSION_ID,
    (s) => applyRemoteRef.current?.(s),
    applyRemoteColors,
  );
  const { state, start, pause, reset, skip, applyRemote } = useTimer(sendState);
  applyRemoteRef.current = applyRemote;

  // Push our colors whenever we first connect or whenever they change
  useEffect(() => {
    if (status === 'connected') sendTheme(colors);
  }, [status]); // eslint-disable-line

  return (
    <TimerScreen
      state={state}
      peers={peers}
      devices={devices}
      syncStatus={status}
      sessionId={SESSION_ID}
      colors={colors}
      onSetBackgroundStyle={(style) => {
        setBackgroundStyle(style);
        if (status === 'connected') sendTheme({ ...colors, backgroundStyle: style });
      }}
      onSetPhaseColor={(phase, field, value) => {
        setPhaseColor(phase, field, value);
        if (status === 'connected') sendTheme({ ...colors, [phase]: { ...colors[phase], [field]: value } });
      }}
      onResetColors={() => {
        resetAll();
        if (status === 'connected') sendTheme(null); // null = reset signal
      }}
      onStart={start}
      onPause={pause}
      onReset={reset}
      onSkip={skip}
    />
  );
}
