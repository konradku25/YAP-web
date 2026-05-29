// ── Hex ↔ HSL ───────────────────────────────────────────
export function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };
  return `#${[f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

// ── Relative luminance (WCAG) ────────────────────────────
export function luminance(hex) {
  const lin = c => {
    const v = parseInt(hex.slice(c, c + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(1) + 0.7152 * lin(3) + 0.0722 * lin(5);
}

// ── Text colour that's always readable on bg ─────────────
export function readableText(bgHex) {
  return luminance(bgHex) > 0.179 ? '#1a0e10' : '#f5eeee';
}

// ── Accent adjusted to be readable on bg ────────────────
export function readableAccent(accentHex, bgHex) {
  const [h, s, l] = hexToHsl(accentHex);
  const bgLum = luminance(bgHex);
  // Dark bg → lighten accent; light bg → darken it
  const target = bgLum < 0.25 ? Math.max(l, 62) : Math.min(l, 42);
  return hslToHex(h, s, target);
}

// ── 5 blob colours derived from a single accent ──────────
export function blobsFromAccent(accentHex) {
  const [h, s, l] = hexToHsl(accentHex);
  const base = Math.max(20, Math.min(l, 52));
  return [
    hslToHex(h,          s,          base),
    hslToHex(h + 18,     s + 8,      base + 10),
    hslToHex(h - 18,     s - 12,     base -  8),
    hslToHex(h +  6,     s,          base +  5),
    hslToHex(h - 10,     s - 18,     base - 14),
  ];
}

// ── Full CSS-var map from base + accent ──────────────────
export function deriveVars(baseHex, accentHex) {
  const bgLum   = luminance(baseHex);
  const isDark  = bgLum < 0.25;
  const fg      = readableText(baseHex);
  const accent  = readableAccent(accentHex, baseHex);
  const blobs   = blobsFromAccent(accentHex);
  const btnFg   = luminance(accent) > 0.35 ? '#1a0e10' : '#ffffff';

  return {
    '--c-base':    baseHex,
    '--c-fg':      fg,
    '--c-muted':   isDark ? 'rgba(245,238,238,.55)' : 'rgba(26,14,16,.50)',
    '--c-surface': isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)',
    '--c-border':  isDark ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.11)',
    '--c-accent':  accent,
    '--c-btn':     accent,
    '--c-btn-fg':  btnFg,
    '--c-blob-a':  blobs[0],
    '--c-blob-b':  blobs[1],
    '--c-blob-c':  blobs[2],
    '--c-blob-d':  blobs[3],
    '--c-blob-e':  blobs[4],
  };
}
