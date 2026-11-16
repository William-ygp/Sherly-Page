import React, { useState } from 'react';
import { playlists } from '../data/content';
import { useAudio } from '../context/AudioContext';
import { getDeterministicGradient } from '../utils/gradient';
import { normalizeAssetUrl } from '../utils/format';
import type { Song } from '../types';
import { Search, Heart, Play, Pause, ChevronDown, Music2 } from 'lucide-react';

export const MusicSection: React.FC = () => {
  const {
    filteredSongs,
    currentSong,
    isPlaying,
    favorites,
    activePlaylist,
    searchQuery,
    playSong,
    togglePlay,
    toggleFavorite,
    setPlaylist,
    setSearchQuery,
  } = useAudio();

  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const toggleNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNoteId((prev) => (prev === id ? null : id));
  };

  const handleCardClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <section id="musica" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Section Title */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="font-serif italic text-3xl sm:text-5xl text-text-main mb-3">
          Canciones que te dedico
        </h2>
        <p className="font-sans text-text-muted text-sm sm:text-base max-w-md mx-auto">
          Melodías que cuentan quiénes somos y los instantes que nunca quiero olvidar.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar canción, artista o recuerdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-full pl-11 pr-5 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30 transition-all font-sans"
          />
        </div>

        {/* Playlist Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
          {/* Todas */}
          <button
            onClick={() => setPlaylist('todas')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer border ${
              activePlaylist === 'todas'
                ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/40 shadow-glow-gold'
                : 'liquid-glass text-text-muted hover:text-text-main border-white/10'
            }`}
          >
            Todas
          </button>

          {/* Favoritas */}
          <button
            onClick={() => setPlaylist('favoritas')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 border ${
              activePlaylist === 'favoritas'
                ? 'bg-accent-rose/20 text-accent-rose border-accent-rose/40 shadow-glow-rose'
                : 'liquid-glass text-text-muted hover:text-text-main border-white/10'
            }`}
          >
            <Heart className="w-3 h-3 fill-current" />
            Favoritas ({favorites.length})
          </button>

          {/* Custom playlists */}
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => setPlaylist(pl.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer border ${
                activePlaylist === pl.id
                  ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/40 shadow-glow-gold'
                  : 'liquid-glass text-text-muted hover:text-text-main border-white/10'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid: 2 columns on mobile, 3 columns on tablet/desktop */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {filteredSongs.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            const isFav = favorites.includes(song.id);
            const isNoteOpen = expandedNoteId === song.id;

            return (
              <div
                key={song.id}
                onClick={() => handleCardClick(song)}
                className={`liquid-glass rounded-card p-3 sm:p-4 border transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:scale-[1.01] ${
                  isCurrent
                    ? 'border-accent-gold/40 shadow-glow-gold bg-white/[0.09]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Cover & Overlay Actions */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-[#111018] shadow-inner">
                  {song.cover ? (
                    <img
                      src={normalizeAssetUrl(song.cover)}
                      alt={song.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* Fallback Deterministic Gradient */
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                      style={{ background: getDeterministicGradient(song.title) }}
                    >
                      <Music2 className="w-8 h-8 text-white/40 mb-1" />
                      <span className="text-[11px] font-sans text-white/60 line-clamp-2 px-2">
                        {song.title}
                      </span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                      isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-text-main shadow-lg transform transition-transform group-active:scale-90">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.id, e);
                    }}
                    aria-label={isFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-80 cursor-pointer min-h-[32px] min-w-[32px]"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav
                          ? 'fill-accent-rose text-accent-rose filter drop-shadow'
                          : 'text-white/70 hover:text-white'
                      }`}
                    />
                  </button>

                  {/* Duration Badge */}
                  {song.duration && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-sans px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 tabular-nums">
                      {song.duration}
                    </span>
                  )}
                </div>

                {/* Song Meta */}
                <div className="mb-2">
                  <h3
                    className={`font-sans font-semibold text-sm sm:text-base truncate ${
                      isCurrent ? 'text-accent-gold' : 'text-text-main'
                    }`}
                  >
                    {song.title}
                  </h3>
                  <p className="font-sans text-xs text-text-muted truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>

                {/* Dedication Note Accordion */}
                {song.note && (
                  <div className="mt-1 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={(e) => toggleNote(song.id, e)}
                      className="w-full flex items-center justify-between text-[11px] text-accent-gold/80 hover:text-accent-gold transition-colors font-sans py-1 cursor-pointer"
                    >
                      <span>Por qué elegí esta canción</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isNoteOpen ? 'rotate-180 text-accent-gold' : ''
                        }`}
                      />
                    </button>

                    {isNoteOpen && (
                      <p className="mt-1.5 text-xs font-sans text-text-muted italic leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/10 animate-fade-in">
                        "{song.note}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="liquid-glass rounded-card p-10 text-center max-w-md mx-auto">
          <Music2 className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-60" />
          <p className="text-text-main font-sans text-sm mb-1">No se encontraron canciones</p>
          <p className="text-text-muted font-sans text-xs">
            Intenta con otro término de búsqueda o selecciona otra lista.
          </p>
        </div>
      )}
    </section>
  );
};

