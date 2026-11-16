import React, { useState } from 'react';
import { config } from '../data/content';
import { useAudio } from '../context/AudioContext';
import { useFX } from '../context/HeartFXContext';
import { Lock, Heart, Sparkles } from 'lucide-react';

export const GateModal: React.FC = () => {
  const { hasEntered, enterSite } = useAudio();
  const { rain } = useFX();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  if (hasEntered) return null;

  const handleEnter = async () => {
    // If access code is enabled
    if (config.accessCodeHash) {
      if (!pinInput.trim()) {
        setPinError(true);
        return;
      }
      setIsVerifying(true);
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(pinInput.trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        if (hashHex.toLowerCase() !== config.accessCodeHash.toLowerCase()) {
          setPinError(true);
          setIsVerifying(false);
          return;
        }
      } catch (err) {
        console.error('Error verificando PIN:', err);
        setPinError(true);
        setIsVerifying(false);
        return;
      }
    }

    // Dismiss gate and launch first rain of hearts
    setIsExiting(true);
    setTimeout(() => {
      enterSite();
      rain(3800, 16);
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-base/80 backdrop-blur-2xl transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      <div className="liquid-glass w-full max-w-sm rounded-card-lg p-8 sm:p-10 text-center flex flex-col items-center shadow-card border border-white/20">
        {/* Decorative Top Icon */}
        <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mb-6 shadow-glow-rose">
          {config.accessCodeHash ? (
            <Lock className="w-7 h-7 text-accent-gold" />
          ) : (
            <Heart className="w-7 h-7 text-accent-rose animate-pulse" />
          )}
        </div>

        {/* Title */}
        <h2 id="gate-title" className="font-serif italic text-3xl sm:text-4xl text-text-main mb-2">
          {config.to ? `Para ${config.to}` : 'Un rincón especial'}
        </h2>
        <p className="text-text-muted text-sm sm:text-base font-sans mb-8">
          {config.accessCodeHash
            ? 'Ingresa la clave secreta para abrir este espacio.'
            : 'Un rincón con nuestros recuerdos, melodías y momentos guardados.'}
        </p>

        {/* PIN input if access code configured */}
        {config.accessCodeHash && (
          <div className="w-full mb-6">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Código de acceso"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              className="w-full bg-white/5 border border-white/20 rounded-full px-5 py-3 text-center text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent-gold/60 focus:ring-1 focus:ring-accent-gold/40 text-lg tracking-widest transition-all"
            />
            {pinError && (
              <p className="text-accent-rose text-xs mt-2 transition-all">
                El código no coincide. Intenta de nuevo.
              </p>
            )}
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={handleEnter}
          disabled={isVerifying}
          className="liquid-glass group relative w-full py-4 px-6 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition-all duration-200 border border-white/30 flex items-center justify-center gap-3 shadow-glow-gold cursor-pointer min-h-[48px]"
        >
          <Sparkles className="w-5 h-5 text-accent-gold group-hover:scale-110 transition-transform" />
          <span className="font-sans font-medium text-text-main text-base tracking-wide">
            {config.accessCodeHash ? 'Desbloquear y entrar' : 'Toca para entrar'}
          </span>
        </button>

        <p className="text-text-muted/60 text-xs mt-6 tracking-wider uppercase font-sans">
          Música y sonido incluidos
        </p>
      </div>
    </div>
  );
};

