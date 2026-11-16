import React from 'react';
import { useAudio } from '../context/AudioContext';
import { getDeterministicGradient } from '../utils/gradient';
import { normalizeAssetUrl } from '../utils/format';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronDown,
  Heart,
  Music2,
} from 'lucide-react';

export const PlayerDock: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffle,
    favorites,
    isSheetOpen,
    isFirstPlayTriggered,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeatMode,
    toggleFavorite,
    setSheetOpen,
  } = useAudio();

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = favorites.includes(currentSong.id);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek((val / 100) * duration);
  };

  return (
    <>
      {/* 1. BOTTOM FLOATING DOCK (Glass Pill) */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg transition-all duration-300 ${
          isSheetOpen ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div
          onClick={() => setSheetOpen(true)}
          className={`liquid-glass rounded-full px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 shadow-card border border-white/20 cursor-pointer select-none transition-all hover:border-white/30 active:scale-[0.99] ${
            isFirstPlayTriggered ? '' : 'animate-pulse'
          }`}
          role="region"
          aria-label="Reproductor de música flotante"
        >
          {/* Cover & Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border border-white/20 bg-[#121118]">
              {currentSong.cover ? (
                <img
                  src={normalizeAssetUrl(currentSong.cover)}
                  alt=""
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: getDeterministicGradient(currentSong.title) }}
                >
                  <Music2 className="w-5 h-5 text-white/60" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1" aria-live="polite">
              <p className="font-sans font-semibold text-xs sm:text-sm text-text-main truncate">
                {currentSong.title}
              </p>
              <p className="font-sans text-[11px] sm:text-xs text-text-muted truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Play/Pause Button */}
            <button
              id="dock-play-btn"
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar canción' : 'Reproducir canción'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-accent-gold/20 hover:bg-accent-gold/30 border border-accent-gold/40 text-accent-gold flex items-center justify-center transition-transform active:scale-90 cursor-pointer min-h-[44px] min-w-[44px]"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSong}
              aria-label="Siguiente canción"
              className="w-10 h-10 rounded-full text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXPANDED BOTTOM SHEET */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-400 flex flex-col justify-end ${
          isSheetOpen
            ? 'opacity-100 pointer-events-auto backdrop-blur-md bg-black/60'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSheetOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`liquid-glass w-full max-w-xl mx-auto rounded-t-[36px] p-6 sm:p-8 flex flex-col justify-between max-h-[90dvh] overflow-y-auto border-t border-white/20 shadow-2xl transition-transform duration-400 pb-safe ${
            isSheetOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Reproductor completo"
        >
          {/* Drag Pill / Close */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label="Cerrar reproductor"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />

            <button
              type="button"
              onClick={(e) => toggleFavorite(currentSong.id, e)}
              aria-label={isFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav ? 'fill-accent-rose text-accent-rose' : 'text-white/70'
                }`}
              />
            </button>
          </div>

          {/* Large Cover */}
          <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-card-lg overflow-hidden shadow-2xl border border-white/15 my-3 bg-[#111018]">
            {currentSong.cover ? (
              <img
                src={normalizeAssetUrl(currentSong.cover)}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                style={{ background: getDeterministicGradient(currentSong.title) }}
              >
                <Music2 className="w-16 h-16 text-white/40 mb-3" />
                <span className="font-serif italic text-xl text-white/80 line-clamp-2">
                  {currentSong.title}
                </span>
              </div>
            )}
          </div>

          {/* Song Meta */}
          <div className="text-center mt-3 mb-4">
            <h3 className="font-sans font-bold text-xl sm:text-2xl text-text-main truncate">
              {currentSong.title}
            </h3>
            <p className="font-sans text-sm sm:text-base text-text-muted mt-0.5 truncate">
              {currentSong.artist}
            </p>
          </div>

          {/* Dedication Note if present */}
          {currentSong.note && (
            <div className="mb-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <p className="text-[11px] uppercase tracking-wider text-accent-gold font-sans mb-1">
                Nuestra nota
              </p>
              <p className="text-xs sm:text-sm font-sans text-text-muted italic leading-relaxed">
                "{currentSong.note}"
              </p>
            </div>
          )}

          {/* Progress Bar & Seek */}
          <div className="w-full px-2 mb-4">
            <div className="relative flex items-center group">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onChange={handleSeekChange}
                aria-label="Barra de progreso de canción"
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent-gold focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted font-sans tabular-nums mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls: Shuffle | Prev | Play/Pause | Next | Repeat */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4">
            {/* Shuffle */}
            <button
              type="button"
              onClick={toggleShuffle}
              aria-label={isShuffle ? 'Desactivar aleatorio' : 'Activar aleatorio'}
              className={`p-2.5 rounded-full transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isShuffle ? 'text-accent-gold' : 'text-text-muted/60 hover:text-text-main'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              type="button"
              onClick={prevSong}
              aria-label="Canción anterior"
              className="p-2.5 rounded-full text-text-main hover:text-accent-gold transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            {/* Play/Pause Large */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-16 h-16 rounded-full bg-accent-gold text-base flex items-center justify-center shadow-glow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[48px] min-w-[48px]"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current text-[#07070B]" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1 text-[#07070B]" />
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={nextSong}
              aria-label="Canción siguiente"
              className="p-2.5 rounded-full text-text-main hover:text-accent-gold transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            {/* Repeat */}
            <button
              type="button"
              onClick={cycleRepeatMode}
              aria-label={`Modo de repetición: ${repeatMode}`}
              className={`p-2.5 rounded-full transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                repeatMode !== 'none'
                  ? 'text-accent-gold'
                  : 'text-text-muted/60 hover:text-text-main'
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Volume Slider (Desktop) */}
          <div className="hidden sm:flex items-center justify-center gap-3 max-w-xs mx-auto w-full pt-2">
            <button
              type="button"
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
              className="text-text-muted hover:text-text-main"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Control de volumen"
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent-gold"
            />
          </div>
        </div>
      </div>
    </>
  );
};
