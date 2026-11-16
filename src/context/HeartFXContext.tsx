import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  life: number;
  maxLife: number;
  swaySpeed: number;
  swayOffset: number;
  color: string;
  isBig?: boolean;
}

interface FXContextValue {
  burst: (x: number, y: number, count?: number) => void;
  rain: (durationMs?: number, countPerSec?: number) => void;
  bigHeart: (x: number, y: number) => void;
  risingHearts: (x: number, y: number, count?: number) => void;
}

const FXContext = createContext<FXContextValue>({
  burst: () => {},
  rain: () => {},
  bigHeart: () => {},
  risingHearts: () => {},
});

export const useFX = () => useContext(FXContext);

// Path2D standard heart normalized centered at (0, 0)
const heartPath = new Path2D(
  'M 0 -8 C -4 -16 -18 -12 -18 2 C -18 12 0 20 0 24 C 0 20 18 12 18 2 C 18 -12 4 -16 0 -8 Z'
);

const MAX_PARTICLES = 80;

export const HeartFXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<HeartParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const rainIntervalRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Resize canvas to match window with max dpr 2
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const addParticle = useCallback(
    (p: HeartParticle) => {
      if (reducedMotion) return;
      if (particlesRef.current.length >= MAX_PARTICLES) {
        // Drop oldest particle if limit reached
        particlesRef.current.shift();
      }
      particlesRef.current.push(p);
      startLoop();
    },
    [reducedMotion]
  );

  const startLoop = () => {
    if (animFrameRef.current !== null) return;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (document.hidden) {
        animFrameRef.current = null;
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = null;
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameRef.current = null;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Physics update
        const progress = p.life / p.maxLife;
        p.x += p.vx * dt + Math.sin(p.life * p.swaySpeed + p.swayOffset) * (p.isBig ? 0 : 25 * dt);
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;

        // Smooth fade out
        if (progress > 0.7) {
          p.opacity = 1 - (progress - 0.7) / 0.3;
        } else if (progress < 0.15) {
          p.opacity = progress / 0.15;
        }

        // Render
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const currentScale = p.isBig
          ? p.size * (1 + 0.3 * Math.sin(progress * Math.PI))
          : p.size;
        ctx.scale(currentScale, currentScale);

        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(255, 107, 154, 0.45)';
        ctx.shadowBlur = p.isBig ? 16 : 8;

        ctx.fill(heartPath);
        ctx.restore();
      }

      if (particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      } else {
        if (particlesRef.current.length > 0) {
          startLoop();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Burst: outward explosion of hearts (e.g. favorite toggle)
  const burst = useCallback(
    (x: number, y: number, count = 12) => {
      if (reducedMotion) return;
      const actualCount = Math.min(count, 16);
      for (let i = 0; i < actualCount; i++) {
        const angle = (Math.PI * 2 * i) / actualCount + (Math.random() - 0.5) * 0.4;
        const speed = 60 + Math.random() * 120;
        addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 40,
          size: 0.5 + Math.random() * 0.45,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 4,
          opacity: 1,
          life: 0,
          maxLife: 1.2 + Math.random() * 0.8,
          swaySpeed: 4,
          swayOffset: Math.random() * Math.PI,
          color: '#FF6B9A',
        });
      }
    },
    [addParticle, reducedMotion]
  );

  // Rising hearts: float gently upward (e.g. message tap or first play)
  const risingHearts = useCallback(
    (x: number, y: number, count = 6) => {
      if (reducedMotion) return;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          addParticle({
            x: x + (Math.random() - 0.5) * 36,
            y,
            vx: (Math.random() - 0.5) * 30,
            vy: -70 - Math.random() * 50,
            size: 0.45 + Math.random() * 0.4,
            rotation: (Math.random() - 0.5) * 0.8,
            vRot: (Math.random() - 0.5) * 2,
            opacity: 0.9,
            life: 0,
            maxLife: 2.2 + Math.random() * 0.8,
            swaySpeed: 3 + Math.random() * 2,
            swayOffset: Math.random() * Math.PI,
            color: '#FF6B9A',
          });
        }, i * 70);
      }
    },
    [addParticle, reducedMotion]
  );

  // Rain: falling hearts from top across the width for durationMs
  const rain = useCallback(
    (durationMs = 4000, countPerSec = 14) => {
      if (reducedMotion) return;
      if (rainIntervalRef.current !== null) {
        clearInterval(rainIntervalRef.current);
      }

      const spawnInterval = 1000 / countPerSec;
      const startTime = performance.now();

      rainIntervalRef.current = window.setInterval(() => {
        if (performance.now() - startTime >= durationMs) {
          if (rainIntervalRef.current !== null) {
            clearInterval(rainIntervalRef.current);
            rainIntervalRef.current = null;
          }
          return;
        }

        const width = window.innerWidth;
        addParticle({
          x: Math.random() * width,
          y: -30,
          vx: (Math.random() - 0.5) * 20,
          vy: 60 + Math.random() * 70,
          size: 0.5 + Math.random() * 0.5,
          rotation: (Math.random() - 0.5) * 0.6,
          vRot: (Math.random() - 0.5) * 2.5,
          opacity: 0.85,
          life: 0,
          maxLife: 4 + Math.random() * 1.5,
          swaySpeed: 2 + Math.random() * 2,
          swayOffset: Math.random() * Math.PI * 2,
          color: Math.random() > 0.3 ? '#FF6B9A' : '#F2B8C6',
        });
      }, spawnInterval);
    },
    [addParticle, reducedMotion]
  );

  // Big Heart: pop over a coordinate for photo double tap
  const bigHeart = useCallback(
    (x: number, y: number) => {
      if (reducedMotion) return;
      addParticle({
        x,
        y,
        vx: 0,
        vy: -40,
        size: 2.2,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.4,
        opacity: 1,
        life: 0,
        maxLife: 1.1,
        swaySpeed: 1,
        swayOffset: 0,
        color: '#FF6B9A',
        isBig: true,
      });

      // And a few tiny sparkling particles around it
      burst(x, y, 6);
    },
    [addParticle, burst, reducedMotion]
  );

  return (
    <FXContext.Provider value={{ burst, rain, bigHeart, risingHearts }}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: '100vw', height: '100vh' }}
      />
    </FXContext.Provider>
  );
};
