import { useEffect, useRef } from 'react';

export default function Background({ isWork, style = 'lava' }) {
  const phaseClass = isWork ? 'bg-work' : 'bg-break';

  if (style === 'gradient') return <RadialGradientBackground phaseClass={phaseClass} />;

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

function RadialGradientBackground({ phaseClass }) {
  const ref = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    let raf;
    const step = () => {
      tRef.current += 0.007;
      const t = tRef.current;
      // Two independent Lissajous components → looks organic
      const x1 = 50 + Math.sin(t * 0.8)  * 28;
      const y1 = 50 + Math.sin(t * 1.3)  * 22;
      const x2 = 50 + Math.sin(t * 0.8 + Math.PI) * 20;
      const y2 = 50 + Math.sin(t * 1.3 + Math.PI) * 18;
      if (ref.current) {
        ref.current.style.background = [
          `radial-gradient(circle at ${x1}% ${y1}%, var(--c-blob-a) 0%, transparent 65%)`,
          `radial-gradient(circle at ${x2}% ${y2}%, var(--c-blob-b) 0%, transparent 60%)`,
          `var(--c-base)`,
        ].join(', ');
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className={`bg-canvas ${phaseClass}`}>
      <div className="bg-noise" />
    </div>
  );
}
