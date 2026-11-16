import React, { useState } from 'react';
import { config } from '../data/content';
import { useFX } from '../context/HeartFXContext';
import { Sparkles, Heart } from 'lucide-react';

export const ClosingSection: React.FC = () => {
  const { rain } = useFX();
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);

  const handleLastSurprise = () => {
    setSurpriseRevealed(true);
    // Large rain of hearts for 5 seconds
    rain(5000, 20);
  };

  return (
    <section className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-36 text-center">
      <div className="liquid-glass rounded-card-lg p-8 sm:p-12 border border-white/20 shadow-card">
        {/* Heart icon */}
        <div className="w-14 h-14 rounded-full bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
          <Heart className="w-7 h-7 text-accent-gold animate-pulse fill-accent-gold/30" />
        </div>

        {/* Closing Title */}
        <h2 className="font-serif italic text-3xl sm:text-5xl text-text-main mb-4">
          Siempre nosotros
        </h2>

        {/* Message */}
        <p className="font-sans text-text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          Gracias por cada momento, cada sonrisa y cada canción que hemos compartido. Esta página es
          solo un pequeño reflejo de todo lo que significas para mí.
        </p>

        {/* Last surprise button */}
        {!surpriseRevealed ? (
          <button
            type="button"
            onClick={handleLastSurprise}
            className="liquid-glass group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-accent-rose/40 bg-accent-rose/10 hover:bg-accent-rose/20 text-sm font-sans font-medium text-text-main transition-all duration-300 shadow-glow-rose active:scale-95 cursor-pointer min-h-[48px]"
          >
            <Sparkles className="w-4 h-4 text-accent-rose group-hover:rotate-12 transition-transform" />
            <span>Una última sorpresa</span>
          </button>
        ) : (
          <div className="animate-fade-in p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto">
            <p className="font-serif italic text-xl sm:text-2xl text-accent-gold mb-1">
              "Te elijo hoy, mañana y siempre."
            </p>
            <p className="font-sans text-xs text-text-muted mt-2">
              Con todo mi amor, {config.from} ♥
            </p>
          </div>
        )}

        {/* Bottom dedication note */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col items-center gap-1">
          <p className="text-[11px] font-sans text-text-muted/60 uppercase tracking-widest">
            Hecho con el corazón para {config.to}
          </p>
        </div>
      </div>
    </section>
  );
};

