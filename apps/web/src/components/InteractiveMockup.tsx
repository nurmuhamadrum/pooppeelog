import React, { useState } from 'react';
import { PhoneMockup, MockupScreen } from './PhoneMockup';
import { MapPin, Calendar, BarChart3, User, Zap, Smile, Cloud } from 'lucide-react';

export const InteractiveMockup: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<MockupScreen>('map');

  return (
    <section id="preview" className="py-20 md:py-28 border-b border-dark-border bg-dark-bg/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-pee-amber bg-pee-amber/10 border border-pee-amber/30 px-3.5 py-1.5 rounded-full">
            Live Interactive Simulator
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight mt-3">
            Coba Aplikasi Langsung di Layar
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-2">
            Pilih menu di bawah atau sentuh tombol di dalam layar HP simulasi untuk merasakan alur sat-set Poop Pee Log.
          </p>

          {/* Interactive Screen Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveScreen('map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'map'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> 1. Peta Pribadi
            </button>
            <button
              onClick={() => setActiveScreen('quick-log')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'quick-log'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> 2. Quick Log (3 Detik)
            </button>
            <button
              onClick={() => setActiveScreen('mood')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'mood'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <Smile className="w-3.5 h-3.5" /> 3. Mood Sheet
            </button>
            <button
              onClick={() => setActiveScreen('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'timeline'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> 4. Buku Harian
            </button>
            <button
              onClick={() => setActiveScreen('stats')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'stats'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> 5. Stats & Badges
            </button>
            <button
              onClick={() => setActiveScreen('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'profile'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" /> 6. Profil & Sync
            </button>
            <button
              onClick={() => setActiveScreen('auth')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeScreen === 'auth'
                  ? 'bg-pee-amber text-ink shadow-lg shadow-pee-amber/20'
                  : 'bg-dark-surface border border-dark-border text-peach-tint/80 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" /> 7. Akun & Auth
            </button>
          </div>
        </div>

        {/* Centered Unified Phone Device Frame */}
        <div className="flex justify-center items-center">
          <PhoneMockup currentScreen={activeScreen} onScreenChange={setActiveScreen} />
        </div>
      </div>
    </section>
  );
};
