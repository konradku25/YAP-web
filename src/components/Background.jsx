export default function Background({ isWork, style = 'lava' }) {
  const phaseClass = isWork ? 'bg-work' : 'bg-break';

  if (style === 'aurora') {
    return (
      <div className={`bg-canvas ${phaseClass}`}>
        <div className="aurora-band aurora-1" />
        <div className="aurora-band aurora-2" />
        <div className="aurora-band aurora-3" />
        <div className="bg-noise" />
      </div>
    );
  }

  if (style === 'gradient') {
    return (
      <div className={`bg-canvas bg-gradient-style ${phaseClass}`}>
        <div className="bg-noise" />
      </div>
    );
  }

  // default: lava
  return (
    <div className={`bg-canvas ${phaseClass}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
      <div className="bg-noise" />
    </div>
  );
}
