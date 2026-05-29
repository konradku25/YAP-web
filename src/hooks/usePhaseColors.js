import { useState, useCallback } from 'react';

export const PHASE_KEYS = ['WORK', 'SHORT_BREAK', 'LONG_BREAK', 'PAUSED'];

export const PHASE_LABELS = {
  WORK:        'Focus',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK:  'Long Break',
  PAUSED:      'Paused',
};

export const DEFAULTS = {
  WORK:        { base: '#180e10', accent: '#c0363e' },
  SHORT_BREAK: { base: '#0e1418', accent: '#2a6080' },
  LONG_BREAK:  { base: '#0a1510', accent: '#2a7a50' },
  PAUSED:      { base: '#111111', accent: '#484848' },
};

function load() {
  try {
    const raw = localStorage.getItem('yap-colors-v2');
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

export function usePhaseColors() {
  const [colors, setColors] = useState(load);

  const setPhaseColor = useCallback((phase, field, value) => {
    setColors(prev => {
      const next = { ...prev, [phase]: { ...prev[phase], [field]: value } };
      localStorage.setItem('yap-colors-v2', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem('yap-colors-v2');
    setColors(DEFAULTS);
  }, []);

  return { colors, setPhaseColor, resetAll };
}
