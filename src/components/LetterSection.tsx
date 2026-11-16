import React, { useState } from 'react';
import { letter, messages } from '../data/content';
import { useFX } from '../context/HeartFXContext';
import { Mail, MailOpen, Sparkles, Heart } from 'lucide-react';

export const LetterSection: React.FC = () => {
  const { rain, risingHearts } = useFX();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioningMessage, setIsTransitioningMessage] = useState(false);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Gentle rain of hearts for 4s
      rain(4000, 14);
    }
  };

  const handleNextMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Rising tiny hearts from button
    const rect = e.currentTarget.getBoundingClientRect();
    risingHearts(rect.left + rect.width / 2, rect.top, 5);

    setIsTransitioningMessage(true);
    setTimeout(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      setIsTransitioningMessage(false);
    }, 250);
  };

  return (
    <section id="carta" className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="font-serif italic text-3xl sm:text-5xl text-text-main mb-3">
          Palabras desde el Corazón
        </h2>
        <p className="font-sans text-text-muted text-sm sm:text-base max-w-md mx-auto">
          Lo que a veces callo por no encontrar la forma, pero que siempre late dentro de mí.
        </p>
      </div>

      {/* 1. ENVELOPE / LETTER CARD */}
      <div
        onClick={handleOpenEnvelope}
        className={`liquid-glass rounded-card-lg p-6 sm:p-12 border transition-all duration-700 cursor-pointer relative overflow-hidden shadow-card ${
          isOpen
            ? 'border-accent-gold/40 shadow-glow-gold'
            : 'border-white/20 hover:border-accent-gold/40 hover:scale-[1.01]'
        }`}
        role="region"
        aria-label="Carta de amor"
      >
        {!isOpen ? (
          /* Sealed Envelope View */
          <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center select-none">
            <div className="w-16 h-16 rounded-full bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center mb-5 shadow-glow-rose">
              <Mail className="w-8 h-8 text-accent-rose" />
            </div>
            <h3 className="font-serif italic text-2xl sm:text-3xl text-text-main mb-2">
              Una carta para ti
            </h3>
            <p className="font-sans text-text-muted text-xs sm:text-sm mb-6 max-w-xs">
              Sellada con cariño. Toca para abrir el sobre y leerla.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass border border-accent-gold/30 text-accent-gold text-xs font-sans tracking-wide">
              <Heart className="w-3.5 h-3.5 fill-current text-accent-rose" />
              <span>Abrir carta</span>
            </div>
          </div>
        ) : (
          /* Opened Letter View */
          <div className="animate-fade-in">
            {/* Top wax mark */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
              <div className="flex items-center gap-2 text-accent-gold text-xs uppercase tracking-widest font-sans">
                <MailOpen className="w-4 h-4 text-accent-rose" />
                <span>Carta abierta</span>
              </div>
              <Sparkles className="w-4 h-4 text-accent-gold/60" />
            </div>

            {/* Letter Title */}
            <h3 className="font-serif italic text-2xl sm:text-4xl text-text-main mb-8 leading-snug">
              {letter.title}
            </h3>

            {/* Letter Paragraphs (Staggered blur-to-sharp fade) */}
            <div className="space-y-6 font-serif text-base sm:text-xl text-text-main/90 leading-relaxed tracking-wide">
              {letter.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="transition-all duration-700 ease-out"
                  style={{
                    animation: `fadeBlurIn 0.8s ease-out ${idx * 0.25}s both`,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Signature */}
            <div className="mt-12 pt-6 border-t border-white/10 text-right">
              <p className="font-serif italic text-xl sm:text-2xl text-accent-gold">
                {letter.signature}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. "TOCA PARA VER UN MENSAJE" COMPONENT */}
      <div className="mt-12 sm:mt-16 text-center">
        <div className="liquid-glass rounded-card p-6 sm:p-8 border border-white/15 max-w-lg mx-auto shadow-card">
          <p className="text-[11px] uppercase tracking-widest text-accent-gold font-sans mb-4">
            Pequeñas certezas
          </p>

          {/* Animated Message Display */}
          <div className="min-h-[72px] sm:min-h-[84px] flex items-center justify-center px-4">
            <p
              className={`font-serif italic text-lg sm:text-2xl text-text-main transition-all duration-300 ${
                isTransitioningMessage
                  ? 'opacity-0 blur-sm scale-95'
                  : 'opacity-100 blur-0 scale-100'
              }`}
            >
              "{messages[currentMessageIndex]}"
            </p>
          </div>

          {/* Button with rising hearts */}
          <button
            type="button"
            onClick={handleNextMessage}
            className="mt-6 liquid-glass group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/25 hover:border-accent-rose/50 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-sans text-text-main transition-all active:scale-95 cursor-pointer shadow-glow-rose min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-accent-rose group-hover:rotate-12 transition-transform" />
            <span>Toca para ver otro mensaje</span>
          </button>
        </div>
      </div>
    </section>
  );
};
