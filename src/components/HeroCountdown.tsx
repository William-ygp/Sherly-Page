import React, { useState, useEffect, useRef, useCallback } from 'react';
import { config, surprise } from '../data/content';
import { useFX } from '../context/HeartFXContext';
import { Sparkles, Gift } from 'lucide-react';

const GLITCH_SYMBOLS = ['¿', '?', '#', '%', '&', '▒', '§', '?', '¿'];

interface CountdownDisplay {
  hours: number;
  minutes: number;
  seconds: number;
  isZero: boolean;
}

export const HeroCountdown: React.FC = () => {
  const { rain } = useFX();
  const [displayState, setDisplayState] = useState<CountdownDisplay>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isZero: false,
  });

  const [revealed, setRevealed] = useState(false);
  const [glitchText, setGlitchText] = useState('??');
  const [isGlitching, setIsGlitching] = useState(false);
  const [manualGlitch, setManualGlitch] = useState(false);
  const hasTriggeredZeroFx = useRef(false);
  const glitchTimerRef = useRef<number | null>(null);

  // Calculate local remaining time (NEVER computing or exposing total days)
  const computeTime = useCallback((): CountdownDisplay => {
    const target = new Date(config.surpriseDate).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isZero: true };
    }

    // Horas y minutos DENTRO del ciclo diario: nunca horas totales
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    return { hours, minutes, seconds, isZero: false };
  }, []);

  // Secure Countdown mode: fetch from /api/countdown
  const fetchServerCountdown = useCallback(async () => {
    try {
      const res = await fetch('/api/countdown');
      if (!res.ok) throw new Error('Error al consultar /api/countdown');
      const data = await res.json();
      setDisplayState({
        hours: data.hours,
        minutes: data.minutes,
        seconds: data.seconds,
        isZero: Boolean(data.released),
      });
      if (data.released && !hasTriggeredZeroFx.current) {
        hasTriggeredZeroFx.current = true;
        setRevealed(true);
        rain(5000, 18);
      }
    } catch {
      // Fallback to local
      const local = computeTime();
      setDisplayState(local);
    }
  }, [computeTime, rain]);

  // Main timer loop
  useEffect(() => {
    if (config.secureCountdown) {
      fetchServerCountdown();
      const interval = setInterval(fetchServerCountdown, 5 * 60 * 1000); // sync every 5 min
      return () => clearInterval(interval);
    }

    // Standard mode: local timer
    const update = () => {
      if (document.hidden) return;
      const res = computeTime();
      setDisplayState(res);

      if (res.isZero) {
        if (!hasTriggeredZeroFx.current) {
          hasTriggeredZeroFx.current = true;
          // Intensify glitch for 2 seconds then reveal
          setIsGlitching(true);
          setTimeout(() => {
            setIsGlitching(false);
            setRevealed(true);
            rain(5000, 18);
          }, 2000);
        }
      }
    };

    update();
    const timer = setInterval(update, 1000);

    const handleVisibility = () => {
      if (!document.hidden) update();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [computeTime, config.secureCountdown, fetchServerCountdown, rain]);

  // Random glitch burst every 2-5 seconds for 200-400ms
  useEffect(() => {
    if (revealed) return;

    let timeout: number;

    const scheduleGlitch = () => {
      const delay = 2000 + Math.random() * 3000;
      timeout = window.setTimeout(() => {
        setIsGlitching(true);

        // Pick random non-numeric symbols
        const s1 = GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)];
        const s2 = GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)];
        setGlitchText(`${s1}${s2}`);

        const duration = 200 + Math.random() * 200;
        setTimeout(() => {
          setGlitchText('??');
          setIsGlitching(false);
          scheduleGlitch();
        }, duration);
      }, delay);
    };

    scheduleGlitch();
    return () => clearTimeout(timeout);
  }, [revealed]);

  // Manual hover/tap glitch intensifier
  const handleGlitchInteraction = () => {
    if (revealed) return;
    setManualGlitch(true);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);

    const s1 = GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)];
    const s2 = GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)];
    setGlitchText(`${s1}${s2}`);

    glitchTimerRef.current = window.setTimeout(() => {
      setGlitchText('??');
      setManualGlitch(false);
    }, 1000);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 flex flex-col items-center text-center">
      {/* Decorative subtitle / dedication */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/15 mb-6 text-accent-gold text-xs sm:text-sm tracking-widest uppercase font-sans">
        <Sparkles className="w-3.5 h-3.5 text-accent-rose" />
        <span>De {config.from} para {config.to}</span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif italic text-4xl sm:text-6xl md:text-7xl text-text-main max-w-3xl leading-tight mb-5 drop-shadow-sm">
        {config.title}
      </h1>

      {/* Subtitle */}
      <p className="font-sans text-text-muted text-base sm:text-lg max-w-xl mx-auto mb-12 sm:mb-16 leading-relaxed">
        {config.subtitle}
      </p>

      {/* Countdown Card OR Surprise Reveal */}
      {!revealed ? (
        <div className="w-full max-w-md mx-auto">
          <div className="liquid-glass rounded-card-lg p-6 sm:p-8 shadow-card border border-white/20">
            <p className="text-text-muted text-xs uppercase tracking-widest font-sans mb-5">
              Tiempo para el gran momento
            </p>

            {/* Countdown Blocks: DÍAS | HORAS | MINUTOS (and SECONDS if enabled) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {/* BLOCK 1: DÍAS (Always ?? with Glitch, NEVER exposed numbers) */}
              <div
                onClick={handleGlitchInteraction}
                onMouseEnter={handleGlitchInteraction}
                aria-label="días: desconocido"
                className="liquid-glass flex-1 max-w-[96px] py-4 sm:py-5 px-2 rounded-2xl border border-white/20 flex flex-col items-center justify-center cursor-pointer select-none transition-transform active:scale-95"
              >
                <div
                  className={`relative font-sans font-bold text-3xl sm:text-4xl text-accent-gold transition-all duration-150 ${
                    isGlitching || manualGlitch ? 'glitch-active' : ''
                  }`}
                >
                  {/* Base Text */}
                  <span className="relative z-10 tabular-nums">{glitchText}</span>

                  {/* Glitch chromatic split (Rose & Violet) */}
                  {(isGlitching || manualGlitch) && (
                    <>
                      <span
                        aria-hidden="true"
                        className="glitch-copy-rose absolute inset-0 text-accent-rose pointer-events-none select-none z-0"
                      >
                        {glitchText}
                      </span>
                      <span
                        aria-hidden="true"
                        className="glitch-copy-violet absolute inset-0 text-accent-violet pointer-events-none select-none z-0"
                      >
                        {glitchText}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[11px] font-sans tracking-wider text-text-muted mt-1 uppercase">
                  Días
                </span>
              </div>

              {/* Separator */}
              <span className="text-2xl sm:text-3xl font-serif text-accent-gold/60 animate-pulse select-none">
                :
              </span>

              {/* BLOCK 2: HORAS (Within day) */}
              <div
                aria-label="horas restantes"
                className="liquid-glass flex-1 max-w-[96px] py-4 sm:py-5 px-2 rounded-2xl border border-white/20 flex flex-col items-center justify-center select-none"
              >
                <span className="font-sans font-bold text-3xl sm:text-4xl text-text-main tabular-nums">
                  {pad(displayState.hours)}
                </span>
                <span className="text-[11px] font-sans tracking-wider text-text-muted mt-1 uppercase">
                  Horas
                </span>
              </div>

              {/* Separator */}
              <span className="text-2xl sm:text-3xl font-serif text-accent-gold/60 animate-pulse select-none">
                :
              </span>

              {/* BLOCK 3: MINUTOS */}
              <div
                aria-label="minutos restantes"
                className="liquid-glass flex-1 max-w-[96px] py-4 sm:py-5 px-2 rounded-2xl border border-white/20 flex flex-col items-center justify-center select-none"
              >
                <span className="font-sans font-bold text-3xl sm:text-4xl text-text-main tabular-nums">
                  {pad(displayState.minutes)}
                </span>
                <span className="text-[11px] font-sans tracking-wider text-text-muted mt-1 uppercase">
                  Minutos
                </span>
              </div>

              {/* Optional SECONDS block */}
              {config.showSeconds && (
                <>
                  <span className="text-2xl sm:text-3xl font-serif text-accent-gold/60 animate-pulse select-none">
                    :
                  </span>
                  <div
                    aria-label="segundos restantes"
                    className="liquid-glass flex-1 max-w-[96px] py-4 sm:py-5 px-2 rounded-2xl border border-white/20 flex flex-col items-center justify-center select-none"
                  >
                    <span className="font-sans font-bold text-3xl sm:text-4xl text-text-main tabular-nums">
                      {pad(displayState.seconds)}
                    </span>
                    <span className="text-[11px] font-sans tracking-wider text-text-muted mt-1 uppercase">
                      Segundos
                    </span>
                  </div>
                </>
              )}
            </div>

            <p className="text-text-muted/60 text-[11px] mt-5 font-sans">
              Los días permanecen en secreto hasta el final ✨
            </p>
          </div>
        </div>
      ) : (
        /* Zero reached -> Surprise Reveal Card */
        <div className="w-full max-w-lg mx-auto animate-fade-in">
          <div className="liquid-glass rounded-card-lg p-8 sm:p-10 shadow-card border border-accent-gold/30 relative overflow-hidden text-center">
            <div className="w-16 h-16 rounded-full bg-accent-gold/15 border border-accent-gold/40 flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
              <Gift className="w-8 h-8 text-accent-gold animate-bounce" />
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-text-main mb-4 leading-snug">
              {surprise.title}
            </h2>
            <p className="font-sans text-text-muted text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {surprise.message}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
