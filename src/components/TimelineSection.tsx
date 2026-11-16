import React, { useEffect, useRef } from 'react';
import { timeline } from '../data/content';
import { Calendar } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver to reveal timeline items as they enter view
  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.timeline-item');
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="historia" className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-14 sm:mb-20">
        <h2 className="font-serif italic text-3xl sm:text-5xl text-text-main mb-3">
          Nuestra Historia
        </h2>
        <p className="font-sans text-text-muted text-sm sm:text-base max-w-md mx-auto">
          Los capítulos que nos trajeron hasta aquí y los que aún están por escribirse.
        </p>
      </div>

      {/* Timeline container */}
      <div ref={containerRef} className="relative">
        {/* Glowing vertical center line */}
        <div
          aria-hidden="true"
          className="absolute left-4 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-gradient-to-b from-accent-gold/20 via-accent-rose/40 to-accent-violet/20 shadow-glow-rose"
        />

        {/* Timeline Items */}
        <div className="space-y-12 sm:space-y-16">
          {timeline.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`timeline-item opacity-0 translate-y-8 transition-all duration-700 ease-out relative flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Center glowing node marker */}
                <div
                  aria-hidden="true"
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 w-7 h-7 rounded-full liquid-glass border border-accent-gold/40 flex items-center justify-center z-10 shadow-glow-gold bg-[#07070B]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
                </div>

                {/* Milestone Glass Card */}
                <div
                  className={`ml-12 md:ml-0 md:w-[45%] ${
                    isEven ? 'md:pl-8' : 'md:pr-8'
                  } w-full`}
                >
                  <div className="liquid-glass rounded-card p-5 sm:p-7 border border-white/15 hover:border-white/25 transition-all shadow-card group">
                    {/* Date */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-accent-gold font-sans uppercase tracking-wider mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif italic text-xl sm:text-2xl text-text-main mb-3 group-hover:text-accent-gold transition-colors">
                      {item.title}
                    </h3>

                    {/* Text */}
                    <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                      {item.text}
                    </p>

                    {/* Optional Photo */}
                    {item.photo && (
                      <div className="rounded-2xl overflow-hidden border border-white/15 aspect-video bg-[#121118]">
                        <img
                          src={item.photo}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Hide image if sample not found
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer for alternate side on desktop */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
