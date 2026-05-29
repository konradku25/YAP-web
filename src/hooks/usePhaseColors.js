import { useState, useCallback } from 'react';

export const PHASE_KEYS = ['WORK', 'SHORT_BREAK', 'LONG_BREAK', 'PAUSED'];

export const PHASE_LABELS = {
  WORK:        'Focus',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK:  'Long Break',
  PAUSED:      'Paused',
};

export const DEFAULTS = {
  WORK:        { base: '#1a1114', accent: '#e8b4b8' },
  SHORT_BREAK: { base: '#11161a', accent: '#b4d4e8' },
  LONG_BREAK:  { base: '#0f1a12', accent: '#b4e8c4' },
  PAUSED:      { base: '#141414', accent: '#888888' },
  backgroundStyle: 'lava', // 'lava' | 'aurora' | 'gradient'
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

  const setBackgroundStyle = useCallback((style) => {
    setColors(prev => {
      const next = { ...prev, backgroundStyle: style };
      localStorage.setItem('yap-colors-v2', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem('yap-colors-v2');
    setColors(DEFAULTS);
  }, []);

  // Apply a full theme object received from sync (same shape as DEFAULTS)
  const applyRemoteColors = useCallback((remote) => {
    try {
      const merged = { ...DEFAULTS };
      for (const key of PHASE_KEYS) {
        if (remote[key]?.base && remote[key]?.accent) {
          merged[key] = { base: remote[key].base, accent: remote[key].accent };
        }
      }
      localStorage.setItem('yap-colors-v2', JSON.stringify(merged));
      setColors(merged);
    } catch {}
  }, []);

  return { colors, setPhaseColor, setBackgroundStyle, resetAll, applyRemoteColors };
}
