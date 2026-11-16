import React, { useState, useRef } from 'react';
import { photos } from '../data/content';
import { useFX } from '../context/HeartFXContext';
import { normalizeAssetUrl } from '../utils/format';
import { Camera, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { bigHeart } = useFX();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lastTapRef = useRef<{ time: number; index: number }>({ time: 0, index: -1 });

  const handlePhotoClick = (index: number, e: React.MouseEvent) => {
    const now = Date.now();
    const prev = lastTapRef.current;

    // Double tap detection (less than 320ms on the same photo)
    if (prev.index === index && now - prev.time < 320) {
      // Trigger double-tap jumping heart
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      bigHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
      lastTapRef.current = { time: 0, index: -1 };
    } else {
      // Single tap -> record tap time, open lightbox on simple click if not a quick second tap
      lastTapRef.current = { time: now, index };
      setTimeout(() => {
        if (lastTapRef.current.time === now) {
          setLightboxIndex(index);
        }
      }, 250);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + photos.length) % photos.length);
    }
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % photos.length);
    }
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id="galeria" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="font-serif italic text-3xl sm:text-5xl text-text-main mb-3">
          Galería de Recuerdos
        </h2>
        <p className="font-sans text-text-muted text-sm sm:text-base max-w-md mx-auto">
          Imágenes que guardan la luz de cada día que hemos compartido. Toca para ampliar; doble toque para un corazón.
        </p>
      </div>

      {/* Masonry / Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {photos.map((photo, index) => (
          <div
            key={index}
            onClick={(e) => handlePhotoClick(index, e)}
            className="liquid-glass rounded-card overflow-hidden border border-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between select-none"
          >
            {/* Image container */}
            <div className="relative aspect-[4/5] w-full bg-[#121118] overflow-hidden">
              <img
                src={normalizeAssetUrl(photo.thumb || photo.src)}
                alt={photo.caption}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback placeholder if image not uploaded yet
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback-placeholder');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />

              {/* Placeholder fallback if photo is not present yet */}
              <div className="fallback-placeholder absolute inset-0 hidden flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                <Camera className="w-8 h-8 text-accent-gold/40 mb-2" />
                <span className="text-[11px] font-sans text-text-muted/60">
                  Foto {index + 1}
                </span>
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-xs text-white/90 font-sans px-3 py-1 rounded-full liquid-glass border border-white/20">
                  Ver recuerdo
                </span>
              </div>
            </div>

            {/* Caption */}
            {photo.caption && (
              <div className="p-3 text-left">
                <p className="font-sans text-xs text-text-main line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
                {photo.date && (
                  <p className="font-sans text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-accent-gold" />
                    <span>{photo.date}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Glass Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de foto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar visor"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-text-main hover:bg-white/10 transition-colors z-20 cursor-pointer min-h-[44px] min-w-[44px]"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={prevPhoto}
            aria-label="Foto anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-text-main hover:bg-white/10 transition-colors z-20 cursor-pointer min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={nextPhoto}
            aria-label="Foto siguiente"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-text-main hover:bg-white/10 transition-colors z-20 cursor-pointer min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass rounded-card-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col items-center justify-center border border-white/25 shadow-2xl relative"
          >
            <img
              src={normalizeAssetUrl(photos[lightboxIndex].src)}
              alt={photos[lightboxIndex].caption}
              className="w-full max-h-[65vh] object-contain bg-[#0b0a10]"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.lightbox-fallback');
                if (fallback) (fallback as HTMLElement).style.display = 'flex';
              }}
            />

            <div className="lightbox-fallback hidden w-full h-64 flex-col items-center justify-center text-center p-6 bg-white/5">
              <Camera className="w-12 h-12 text-accent-gold/50 mb-3" />
              <p className="text-text-main font-sans text-sm">
                Coloca tu foto en{' '}
                <code className="text-accent-gold">{photos[lightboxIndex].src}</code>
              </p>
            </div>

            {/* Caption in lightbox */}
            <div className="w-full p-4 sm:p-6 text-center border-t border-white/10 bg-[#07070B]/60">
              <p className="font-serif italic text-lg sm:text-xl text-text-main">
                {photos[lightboxIndex].caption}
              </p>
              {photos[lightboxIndex].date && (
                <p className="font-sans text-xs text-text-muted mt-1">
                  {photos[lightboxIndex].date}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
