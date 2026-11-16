import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { HeartFXProvider } from './context/HeartFXContext';
import { AudioProvider } from './context/AudioContext';
import { Background } from './components/Background';
import { GateModal } from './components/GateModal';
import { HeroCountdown } from './components/HeroCountdown';
import { MusicSection } from './components/MusicSection';
import { LetterSection } from './components/LetterSection';
import { TimelineSection } from './components/TimelineSection';
import { GallerySection } from './components/GallerySection';
import { ClosingSection } from './components/ClosingSection';
import { PlayerDock } from './components/PlayerDock';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <HeartFXProvider>
        <AudioProvider>
          {/* Ambient Dark Liquid Glass Background */}
          <Background />

          {/* Mandatory Gate Screen (Audio Unlock + Optional PIN) */}
          <GateModal />

          {/* Main Scrollable Journey */}
          <main className="relative z-10 min-h-screen pb-28 selection:bg-accent-gold/25 selection:text-text-main">
            {/* 2. Hero & Mystery Countdown */}
            <HeroCountdown />

            {/* 3. Music Library & Moments */}
            <MusicSection />

            {/* 4. Love Letter & Interactive Messages */}
            <LetterSection />

            {/* 5. Memory Timeline */}
            <TimelineSection />

            {/* 6. Photo Gallery */}
            <GallerySection />

            {/* 7. Closing & Final Surprise */}
            <ClosingSection />
          </main>

          {/* Persistent Floating Bottom Dock & Player Sheet */}
          <PlayerDock />
        </AudioProvider>
      </HeartFXProvider>
    </ToastProvider>
  );
};

export default App;
