import { useState, useCallback } from 'react';

export const PHASE_KEYS = ['WORK', 'SHORT_BREAK', 'LONG_BREAK', 'PAUSED'];

export const PHASE_LABELS = {
  WORK:        'Focus',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK:  'Long Break',
  PAUSED:      'Paused',
};

export const DEFAULTS = {
  WORK: {
    base:  '#180e10',
    blobs: ['#c0363e', '#e07060', '#9b2a55', '#d4506a', '#7a1f3a'],
  },
  SHORT_BREAK: {
    base:  '#0e1418',
    blobs: ['#2a6080', '#3a8aaa', '#1e4a7a', '#4a7abf', '#1a305a'],
  },
  LONG_BREAK: {
    base:  '#0a1510',
    blobs: ['#2a7a50', '#3aaa70', '#1e5a3a', '#4abf80', '#1a5530'],
  },
  PAUSED: {
    base:  '#111111',
    blobs: ['#3a3a3a', '#555555', '#2a2a2a', '#484848', '#323232'],
  },
};

function load() {
  try {
    const raw = localStorage.getItem('yap-colors');
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

export function usePhaseColors() {
  const [colors, setColors] = useState(load);

  const setColor = useCallback((phase, field, value) => {
    setColors(prev => {
      const next = {
        ...prev,
        [phase]: { ...prev[phase], [field]: value },
      };
      localStorage.setItem('yap-colors', JSON.stringify(next));
      return next;
    });
  }, []);

  const setBlob = useCallback((phase, index, value) => {
    setColors(prev => {
      const blobs = [...prev[phase].blobs];
      blobs[index] = value;
      const next = { ...prev, [phase]: { ...prev[phase], blobs } };
      localStorage.setItem('yap-colors', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem('yap-colors');
    setColors(DEFAULTS);
  }, []);

  return { colors, setColor, setBlob, resetAll };
}
