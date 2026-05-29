import { useCallback, useEffect, useRef, useState } from 'react';

export const PHASES = {
  WORK:        { key: 'WORK',        label: 'Focus',       duration: 25 * 60 },
  SHORT_BREAK: { key: 'SHORT_BREAK', label: 'Short Break', duration:  5 * 60 },
  LONG_BREAK:  { key: 'LONG_BREAK',  label: 'Long Break',  duration: 15 * 60 },
};
const SESSIONS_BEFORE_LONG_BREAK = 4;

const initialState = {
  phase: 'WORK',
  remainingSeconds: PHASES.WORK.duration,
  isRunning: false,
  sessionInCycle: 0,
};

export function useTimer(onStateChange) {
  const [state, setState] = useState(initialState);
  const tickRef = useRef(null);
  // Prevent sending remote state back to server when we received it
  const suppressSyncRef = useRef(false);

  const notify = useCallback((newState) => {
    if (!suppressSyncRef.current) onStateChange?.(newState);
  }, [onStateChange]);

  // Tick
  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.remainingSeconds <= 1) {
          clearInterval(tickRef.current);
          const next = advancePhase(prev, true);
          // Phase complete — notify sync but mark as not-user-triggered
          setTimeout(() => onStateChange?.(next), 0);
          return next;
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [state.isRunning]); // eslint-disable-line

  const start = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, isRunning: true };
      notify(next);
      return next;
    });
  }, [notify]);

  const pause = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, isRunning: false };
      notify(next);
      return next;
    });
  }, [notify]);

  const reset = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, isRunning: false, remainingSeconds: PHASES[prev.phase].duration };
      notify(next);
      return next;
    });
  }, [notify]);

  const skip = useCallback(() => {
    setState((prev) => {
      const next = advancePhase(prev, false);
      notify(next);
      return next;
    });
  }, [notify]);

  // Called when we receive state from the server — apply without re-broadcasting
  const applyRemote = useCallback((remote) => {
    suppressSyncRef.current = true;
    setState({
      phase: remote.phase,
      remainingSeconds: remote.remainingSeconds,
      isRunning: remote.isRunning,
      sessionInCycle: remote.sessionInCycle,
    });
    setTimeout(() => { suppressSyncRef.current = false; }, 0);
  }, []);

  return { state, start, pause, reset, skip, applyRemote };
}

function advancePhase(state, recordCompletion) {
  if (state.phase === 'WORK') {
    const newCycle = state.sessionInCycle + 1;
    const isLong = newCycle >= SESSIONS_BEFORE_LONG_BREAK;
    const nextPhase = isLong ? 'LONG_BREAK' : 'SHORT_BREAK';
    return {
      phase: nextPhase,
      remainingSeconds: PHASES[nextPhase].duration,
      isRunning: false,
      sessionInCycle: isLong ? 0 : newCycle,
    };
  }
  return {
    phase: 'WORK',
    remainingSeconds: PHASES.WORK.duration,
    isRunning: false,
    sessionInCycle: state.sessionInCycle,
  };
}
