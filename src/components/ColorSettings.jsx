import { useState } from 'react';
import { PHASE_KEYS, PHASE_LABELS, DEFAULTS } from '../hooks/usePhaseColors.js';

const STYLES = [
  { value: 'lava',     label: 'Lava Lamp' },
  { value: 'gradient', label: 'Gradient'  },
];

export default function ColorSettings({ colors, onSetPhaseColor, onSetBackgroundStyle, onResetAll, onClose }) {
  const [tab, setTab]         = useState('style');   // 'style' | 'colours'
  const [activePhase, setActivePhase] = useState('WORK');
  const scheme = colors[activePhase];

  return (
    <>
      <div className="palette-backdrop" onClick={onClose} />
      <aside className="palette-panel">

        {/* Header */}
        <div className="palette-top">
          <span className="palette-title">Palette</span>
          <button className="palette-close" onClick={onClose}>✕</button>
        </div>

        {/* Top-level tabs */}
        <div className="palette-main-tabs">
          <button
            className={`palette-main-tab ${tab === 'style' ? 'active' : ''}`}
            onClick={() => setTab('style')}
          >
            Style
          </button>
          <button
            className={`palette-main-tab ${tab === 'colours' ? 'active' : ''}`}
            onClick={() => setTab('colours')}
          >
            Colours
          </button>
        </div>

        {/* ── Style tab ── */}
        {tab === 'style' && (
          <div className="palette-section">
            <span className="swatch-label">Background</span>
            <div className="style-options">
              {STYLES.map(s => (
                <button
                  key={s.value}
                  className={`style-btn ${(colors.backgroundStyle ?? 'lava') === s.value ? 'active' : ''}`}
                  onClick={() => onSetBackgroundStyle(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Colours tab ── */}
        {tab === 'colours' && (
          <>
            <div className="palette-tabs">
              {PHASE_KEYS.map(key => (
                <button
                  key={key}
                  className={`palette-tab ${activePhase === key ? 'active' : ''}`}
                  style={activePhase === key ? {
                    background: colors[key].accent,
                    borderColor: colors[key].accent,
                    color: '#fff',
                  } : { borderColor: colors[key].accent + '80' }}
                  onClick={() => setActivePhase(key)}
                >
                  {PHASE_LABELS[key]}
                </button>
              ))}
            </div>

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
          </>
        )}

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
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="color-input" />
        <span className="swatch-hex">{value}</span>
      </label>
    </div>
  );
}
