import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Song } from '../types';
import { songs as allSongs } from '../data/content';
import { useToast } from './ToastContext';
import { useFX } from './HeartFXContext';
import { normalizeAssetUrl } from '../utils/format';

type RepeatMode = 'none' | 'all' | 'one';

interface AudioContextValue {
  songs: Song[];
  filteredSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  favorites: string[];
  activePlaylist: string;
  searchQuery: string;
  isSheetOpen: boolean;
  hasEntered: boolean;
  isFirstPlayTriggered: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  toggleFavorite: (songId: string, event?: React.MouseEvent) => void;
  setPlaylist: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setSheetOpen: (open: boolean) => void;
  enterSite: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio debe usarse dentro de un AudioProvider');
  return ctx;
};

const FAVORITES_STORAGE_KEY = 'pagina_dedicatoria_favorites';
const VOLUME_STORAGE_KEY = 'pagina_dedicatoria_volume';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { burst, risingHearts } = useFX();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioPreloadRef = useRef<HTMLAudioElement | null>(null);

  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(allSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [activePlaylist, setActivePlaylist] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFirstPlayTriggered, setIsFirstPlayTriggered] = useState<boolean>(false);

  // Volume with localStorage fallback
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
      return saved !== null ? parseFloat(saved) : 0.8;
    } catch {
      return 0.8;
    }
  });

  // Favorites with localStorage fallback
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filtered songs by active playlist and search
  const filteredSongs = useMemo(() => {
    return allSongs.filter((song) => {
      const matchesPlaylist =
        activePlaylist === 'todas'
          ? true
          : activePlaylist === 'favoritas'
          ? favorites.includes(song.id)
          : song.playlist === activePlaylist;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.note.toLowerCase().includes(q);

      return matchesPlaylist && matchesSearch;
    });
  }, [activePlaylist, searchQuery, favorites]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextSong();
      }
    };

    const onError = () => {
      if (audio.src && audio.src !== window.location.href) {
        showToast(`No se pudo reproducir: ${currentSong?.title || 'archivo'}. Verificando siguiente...`, 'warning');
        setTimeout(() => {
          handleNextSong();
        }, 1200);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  // Update volume
  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
    } catch {
      // ignore
    }
  }, []);

  // Enter site (gesture unlocks audio playback)
  const enterSite = useCallback(() => {
    setHasEntered(true);
    // Play initial song softly or preload
    if (audioRef.current && currentSong) {
      audioRef.current.src = normalizeAssetUrl(currentSong.file);
      audioRef.current.play().catch(() => {
        // In case file is not present yet or blocked
      });
    }
  }, [currentSong]);

  // Preload next song metadata
  const preloadNextSong = useCallback((nextSongItem: Song | undefined) => {
    if (!nextSongItem) return;
    if (!nextAudioPreloadRef.current) {
      nextAudioPreloadRef.current = new Audio();
      nextAudioPreloadRef.current.preload = 'metadata';
    }
    nextAudioPreloadRef.current.src = normalizeAssetUrl(nextSongItem.file);
  }, []);

  // Play a specific song
  const playSong = useCallback(
    (song: Song) => {
      const audio = audioRef.current;
      if (!audio) return;

      const isFirst = !isFirstPlayTriggered;
      if (isFirst) {
        setIsFirstPlayTriggered(true);
        // Animate first play pulse + 6 rising hearts from dock play button
        const dockPlayBtn = document.getElementById('dock-play-btn');
        if (dockPlayBtn) {
          const rect = dockPlayBtn.getBoundingClientRect();
          risingHearts(rect.left + rect.width / 2, rect.top, 6);
        }
      }

      setCurrentSong(song);
      const songUrl = normalizeAssetUrl(song.file);
      if (audio.src !== songUrl && !audio.src.endsWith(songUrl)) {
        audio.src = songUrl;
      }
      audio.play().catch((err) => {
        console.warn('Audio playback prevented or missing file:', err);
        showToast(`Audio de muestra: "${song.title}" (sube tu MP3 a public/music/)`, 'info');
      });

      // Preload next
      const currentIndex = allSongs.findIndex((s) => s.id === song.id);
      const nextIndex = (currentIndex + 1) % allSongs.length;
      preloadNextSong(allSongs[nextIndex]);
    },
    [isFirstPlayTriggered, risingHearts, showToast, preloadNextSong]
  );

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (!currentSong && allSongs.length > 0) {
        playSong(allSongs[0]);
      } else if (currentSong) {
        if (!audio.src || audio.src === window.location.href) {
          audio.src = currentSong.file;
        }
        audio.play().catch((err) => {
          console.warn('Playback error:', err);
          showToast(`Archivo no encontrado: "${currentSong.title}"`, 'warning');
        });
      }
    }
  }, [isPlaying, currentSong, playSong, showToast]);

  // Next song
  const handleNextSong = useCallback(() => {
    if (!currentSong || allSongs.length === 0) return;
    const list = filteredSongs.length > 0 ? filteredSongs : allSongs;
    const currentIndex = list.findIndex((s) => s.id === currentSong.id);

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * list.length);
      if (list.length > 1 && nextIndex === currentIndex) {
        nextIndex = (currentIndex + 1) % list.length;
      }
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= list.length) {
        if (repeatMode === 'none') {
          setIsPlaying(false);
          return;
        }
        nextIndex = 0;
      }
    }

    playSong(list[nextIndex]);
  }, [currentSong, filteredSongs, isShuffle, repeatMode, playSong]);

  // Prev song
  const handlePrevSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (!currentSong || allSongs.length === 0) return;
    const list = filteredSongs.length > 0 ? filteredSongs : allSongs;
    const currentIndex = list.findIndex((s) => s.id === currentSong.id);

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = list.length - 1;
    }
    playSong(list[prevIndex]);
  }, [currentSong, filteredSongs, playSong]);

  // Seek
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  // Cycle repeat mode: none -> all -> one -> none
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  // Favorite toggle
  const toggleFavorite = useCallback(
    (songId: string, event?: React.MouseEvent) => {
      setFavorites((prev) => {
        const isFav = prev.includes(songId);
        const next = isFav ? prev.filter((id) => id !== songId) : [...prev, songId];

        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        // Trigger heart burst particle if marking as favorite
        if (!isFav && event) {
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
        }

        return next;
      });
    },
    [burst]
  );

  // Media Session API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: 'Nuestra Historia',
        artwork: currentSong.cover
          ? [
              { src: currentSong.cover, sizes: '96x96', type: 'image/webp' },
              { src: currentSong.cover, sizes: '256x256', type: 'image/webp' },
              { src: currentSong.cover, sizes: '512x512', type: 'image/webp' },
            ]
          : [],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrevSong());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNextSong());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          seek(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('Error configurando MediaSession:', e);
    }
  }, [currentSong, togglePlay, handlePrevSong, handleNextSong, seek]);

  // Keyboard shortcuts (Space, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (audioRef.current) {
          seek(audioRef.current.currentTime - 5);
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (audioRef.current) {
          seek(audioRef.current.currentTime + 5);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek]);

  return (
    <AudioContext.Provider
      value={{
        songs: allSongs,
        filteredSongs,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        repeatMode,
        isShuffle,
        favorites,
        activePlaylist,
        searchQuery,
        isSheetOpen,
        hasEntered,
        isFirstPlayTriggered,
        playSong,
        togglePlay,
        nextSong: handleNextSong,
        prevSong: handlePrevSong,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeatMode,
        toggleFavorite,
        setPlaylist: setActivePlaylist,
        setSearchQuery,
        setSheetOpen: setIsSheetOpen,
        enterSite,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
