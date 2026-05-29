import { useState } from 'react';
import { PHASE_KEYS, PHASE_LABELS, DEFAULTS } from '../hooks/usePhaseColors.js';

const BLOB_LABELS = ['Blob A', 'Blob B', 'Blob C', 'Blob D', 'Blob E'];

export default function ColorSettings({ colors, onSetColor, onSetBlob, onResetAll, onClose }) {
  const [activePhase, setActivePhase] = useState('WORK');
  const scheme = colors[activePhase];

  return (
    <div className="settings-panel glass-panel">
      <div className="settings-header">
        <span className="settings-title">🎨 Color Palette</span>
        <div className="settings-header-actions">
          <button className="pill-btn ghost" onClick={onResetAll}>Reset all</button>
          <button className="pill-btn ghost" onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Phase tabs */}
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

      {/* Color pickers */}
      <div className="color-grid">
        <ColorSwatch
          label="Background"
          value={scheme.base}
          onChange={v => onSetColor(activePhase, 'base', v)}
          onReset={() => onSetColor(activePhase, 'base', DEFAULTS[activePhase].base)}
        />
        {scheme.blobs.map((color, i) => (
          <ColorSwatch
            key={i}
            label={BLOB_LABELS[i]}
            value={color}
            onChange={v => onSetBlob(activePhase, i, v)}
            onReset={() => onSetBlob(activePhase, i, DEFAULTS[activePhase].blobs[i])}
          />
        ))}
      </div>
    </div>
  );
}

function ColorSwatch({ label, value, onChange, onReset }) {
  return (
    <div className="swatch-row">
      <label className="swatch-label">{label}</label>
      <div className="swatch-controls">
        <div className="swatch-preview" style={{ background: value }}>
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="color-input"
            title={label}
          />
        </div>
        <span className="swatch-hex">{value}</span>
        <button className="swatch-reset" onClick={onReset} title="Reset">↺</button>
      </div>
    </div>
  );
}
