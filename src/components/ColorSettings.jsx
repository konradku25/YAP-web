import { useState } from 'react';
import { PHASE_KEYS, PHASE_LABELS, DEFAULTS } from '../hooks/usePhaseColors.js';

export default function ColorSettings({ colors, onSetPhaseColor, onResetAll, onClose }) {
  const [activePhase, setActivePhase] = useState('WORK');
  const scheme = colors[activePhase];

  return (
    <>
      {/* Backdrop — clicking outside closes */}
      <div className="palette-backdrop" onClick={onClose} />

      <aside className="palette-panel">
        <div className="palette-top">
          <span className="palette-title">Palette</span>
          <button className="palette-close" onClick={onClose}>✕</button>
        </div>

        {/* Phase tabs */}
        <div className="palette-tabs">
          {PHASE_KEYS.map(key => (
            <button
              key={key}
              className={`palette-tab ${activePhase === key ? 'active' : ''}`}
              style={activePhase === key ? {
                background: colors[key].accent,
                borderColor: colors[key].accent,
                color: '#fff',
              } : {
                borderColor: colors[key].accent + '80',
              }}
              onClick={() => setActivePhase(key)}
            >
              {PHASE_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Pickers */}
        <div className="palette-pickers">
          <Swatch
            label="Background"
            value={scheme.base}
            onChange={v => onSetPhaseColor(activePhase, 'base', v)}
            onReset={() => onSetPhaseColor(activePhase, 'base', DEFAULTS[activePhase].base)}
          />
          <Swatch
            label="Accent"
            value={scheme.accent}
            onChange={v => onSetPhaseColor(activePhase, 'accent', v)}
            onReset={() => onSetPhaseColor(activePhase, 'accent', DEFAULTS[activePhase].accent)}
          />
        </div>

        <button className="palette-reset" onClick={onResetAll}>
          Reset all to defaults
        </button>
      </aside>
    </>
  );
}

function Swatch({ label, value, onChange, onReset }) {
  return (
    <div className="swatch">
      <div className="swatch-top">
        <span className="swatch-label">{label}</span>
        <button className="swatch-reset-btn" onClick={onReset}>↺ Reset</button>
      </div>
      <label className="swatch-body" style={{ background: value }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="color-input"
        />
        <span className="swatch-hex">{value}</span>
      </label>
    </div>
  );
}
