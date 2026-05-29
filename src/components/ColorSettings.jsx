import { useState } from 'react';
import { PHASE_KEYS, PHASE_LABELS, DEFAULTS } from '../hooks/usePhaseColors.js';
import { blobsFromAccent, readableAccent } from '../utils/colorUtils.js';

export default function ColorSettings({ colors, onSetPhaseColor, onResetAll, onClose }) {
  const [activePhase, setActivePhase] = useState('WORK');
  const scheme = colors[activePhase];
  const previewAccent  = readableAccent(scheme.accent, scheme.base);
  const previewBlobs   = blobsFromAccent(scheme.accent);

  return (
    <div className="settings-panel glass-panel">
      <div className="settings-header">
        <span className="settings-title">🎨 Colour Palette</span>
        <div className="settings-header-actions">
          <button className="pill-btn ghost" onClick={onResetAll}>Reset all</button>
          <button className="pill-btn ghost" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="phase-tabs">
        {PHASE_KEYS.map(key => (
          <button
            key={key}
            className={`phase-tab ${activePhase === key ? 'active' : ''}`}
            onClick={() => setActivePhase(key)}
          >
            {PHASE_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="palette-editor">
        {/* Pickers */}
        <div className="picker-row">
          <ColorPicker
            label="Background"
            value={scheme.base}
            onChange={v => onSetPhaseColor(activePhase, 'base', v)}
            onReset={() => onSetPhaseColor(activePhase, 'base', DEFAULTS[activePhase].base)}
          />
          <ColorPicker
            label="Accent"
            value={scheme.accent}
            onChange={v => onSetPhaseColor(activePhase, 'accent', v)}
            onReset={() => onSetPhaseColor(activePhase, 'accent', DEFAULTS[activePhase].accent)}
          />
        </div>

        {/* Live preview */}
        <div className="palette-preview" style={{ background: scheme.base }}>
          <div className="preview-blobs">
            {previewBlobs.map((c, i) => (
              <span key={i} className="preview-blob" style={{ background: c }} />
            ))}
          </div>
          <span className="preview-accent-label" style={{ color: previewAccent }}>
            FOCUS
          </span>
          <span className="preview-timer" style={{ color: '#f5eeee' }}>
            25:00
          </span>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange, onReset }) {
  return (
    <div className="swatch-row">
      <span className="swatch-label">{label}</span>
      <div className="swatch-controls">
        <div className="swatch-preview" style={{ background: value }}>
          <input type="color" value={value} onChange={e => onChange(e.target.value)} className="color-input" />
        </div>
        <span className="swatch-hex">{value}</span>
        <button className="swatch-reset" onClick={onReset} title="Reset">↺</button>
      </div>
    </div>
  );
}
