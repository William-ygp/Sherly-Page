import React, { useEffect } from 'react';

export const Background: React.FC = () => {
  // Global pointer tracking for liquid glass specular glow
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = `${(e.clientX / window.innerWidth) * 100}%`;
      const y = `${(e.clientY / window.innerHeight) * 100}%`;
      document.documentElement.style.setProperty('--mx', x);
      document.documentElement.style.setProperty('--my', y);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#07070B]">
      {/* 1. Ambient Light Orbs for Glass Refraction & Blur */}
      {/* Orb 1: Rose / Gold */}
      <div
        className="ambient-orb-1 absolute -top-[15%] left-[10%] w-[520px] h-[520px] rounded-full blur-[110px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #FF6B9A 0%, rgba(242, 184, 198, 0.4) 50%, transparent 75%)',
        }}
      />

      {/* Orb 2: Violet / Lavender */}
      <div
        className="ambient-orb-2 absolute top-[40%] -right-[10%] w-[580px] h-[580px] rounded-full blur-[130px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #8B7CFF 0%, rgba(139, 124, 255, 0.3) 50%, transparent 80%)',
        }}
      />

      {/* Orb 3: Deep Night Blue */}
      <div
        className="ambient-orb-3 absolute -bottom-[10%] left-[20%] w-[640px] h-[640px] rounded-full blur-[140px] opacity-35"
        style={{
          background: 'radial-gradient(circle, #1E1B4B 0%, rgba(30, 27, 75, 0.5) 60%, transparent 80%)',
        }}
      />

      {/* 2. Subtle Grain / Film Noise Layer (3.5% opacity) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* 3. Tiny Bokeh Stars (almost imperceptible) */}
      <div className="absolute inset-0 opacity-40">
        {[
          { top: '15%', left: '20%', size: '2px', delay: '0s' },
          { top: '25%', left: '75%', size: '1.5px', delay: '2s' },
          { top: '48%', left: '15%', size: '2px', delay: '4s' },
          { top: '65%', left: '85%', size: '1px', delay: '1s' },
          { top: '82%', left: '30%', size: '2.5px', delay: '3s' },
          { top: '35%', left: '50%', size: '1px', delay: '5s' },
          { top: '78%', left: '65%', size: '1.5px', delay: '2.5s' },
        ].map((star, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-white/70 animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: '6s',
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};
