import React, { useState } from 'react';
import { Zap, ShieldCheck, Cloud, Sparkles, HeartHandshake } from 'lucide-react';
import { PhoneMockup, MockupScreen } from './PhoneMockup';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';

export const HeroSection: React.FC = () => {
  const [heroScreen, setHeroScreen] = useState<MockupScreen>('quick-log');
  const [mascotBubble, setMascotBubble] = useState<string>('Yuk sentuh tombol di dalam HP untuk catat kelegaan!');
  const [poopWiggle, setPoopWiggle] = useState(false);

  const triggerBubble = (text: string) => {
    setMascotBubble(text);
    setPoopWiggle(true);
    setTimeout(() => setPoopWiggle(false), 800);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:py-20 border-b border-dark-border bg-gradient-to-b from-dark-bg via-dark-bg/95 to-dark-bg">
      {/* Ambient gradient glows */}
      <div className="absolute -top-32 -right-32 w-80 md:w-96 h-80 md:h-96 bg-pee-amber/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 md:w-96 h-80 md:h-96 bg-both-teal/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-80 md:w-96 h-80 md:h-96 bg-[#C98A58]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Headline, Mascot Greetings, & Value Props */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left z-10">
          {/* Top Pill Badge with animated sparkle */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber shadow-sm hover:scale-105 transition-transform cursor-default">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Lifelogger Biologis Personal & Aman</span>
            <span className="text-[10px] bg-pee-amber/20 text-pee-amber px-2 py-0.5 rounded-full font-extrabold">
              v1.0
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-cream-bg leading-[1.08]">
            Track. Log.{' '}
            <span className="relative inline-block text-both-teal">
              Lega.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-pee-amber"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path d="M0 15 Q 25 5, 50 15 T 100 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Tagline Paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-peach-tint/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Buku harian buang air pribadi layaknya <strong>Strava biologismu</strong>. Temani kebiasaan sehat bersama trio maskot kocak <strong>Mr. Plop</strong>, <strong>Lil' Drip</strong>, dan <strong>Sir Flush</strong>. Cukup <strong>login / signup</strong> untuk backup riwayat aman maksimal dan sinkronisasi lintas perangkat.
          </p>

          {/* Cute Interactive Mascot Bubble Widget */}
          <div className="bg-dark-surface/90 border border-dark-border rounded-2xl p-3.5 max-w-xl mx-auto lg:mx-0 flex items-center gap-3.5 shadow-lg relative group">
            {/* 3 Mini Mascots that user can click to hear their cute reaction */}
            <div className="flex items-center -space-x-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => triggerBubble('Mr. Plop: "Plong itu hak asasi setiap manusia! 🍫"')}
                className={`w-10 h-10 rounded-full bg-poop-brown p-1 border-2 border-dark-bg shadow-md hover:scale-125 hover:z-20 active:scale-90 transition-all flex items-center justify-center ${
                  poopWiggle ? 'mascot-bounce-wiggle' : ''
                }`}
                title="Sapa Mr. Plop"
              >
                <MrPlopSVG />
              </button>
              <button
                type="button"
                onClick={() => triggerBubble('Lil\' Drip: "Gluk gluk... Jangan nahan kencing ya! 💧"')}
                className="w-10 h-10 rounded-full bg-pee-amber p-1 border-2 border-dark-bg shadow-md hover:scale-125 hover:z-20 active:scale-90 transition-all flex items-center justify-center"
                title="Sapa Lil' Drip"
              >
                <LilDripSVG />
              </button>
              <button
                type="button"
                onClick={() => triggerBubble('Sir Flush: "Wussshh! Login akunmu melindungi data tetap aman & tersimpan awet! 🛡️"')}
                className="w-10 h-10 rounded-full bg-both-teal p-1 border-2 border-dark-bg shadow-md hover:scale-125 hover:z-20 active:scale-90 transition-all flex items-center justify-center"
                title="Sapa Sir Flush"
              >
                <SirFlushSVG />
              </button>
            </div>

            <div className="flex-1 text-left min-h-[38px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-pee-amber uppercase tracking-wider">
                <HeartHandshake className="w-3 h-3" />
                <span>Maskot Bilang:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-cream-bg line-clamp-2 transition-all">
                {mascotBubble}
              </p>
            </div>
          </div>

          {/* 3 Core Tenets Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs text-peach-tint font-bold">
            <span className="flex items-center gap-1.5 bg-dark-surface px-3 py-1.5 rounded-xl border border-dark-border">
              <Zap className="w-3.5 h-3.5 text-pee-amber" /> 3-Detik Log
            </span>
            <span className="flex items-center gap-1.5 bg-dark-surface px-3 py-1.5 rounded-xl border border-dark-border">
              <Cloud className="w-3.5 h-3.5 text-both-teal" /> Cloud Sync & Backup Akun
            </span>
            <span className="flex items-center gap-1.5 bg-dark-surface px-3 py-1.5 rounded-xl border border-dark-border">
              <ShieldCheck className="w-3.5 h-3.5 text-drip-blue" /> Privasi Enkripsi Total
            </span>
          </div>

          {/* App Store Download Buttons */}
          <div id="download" className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            {/* Google Play */}
            <a
              href="#download"
              className="px-5 py-3 rounded-2xl bg-pee-amber text-ink font-black text-xs flex items-center gap-2.5 shadow-xl shadow-pee-amber/25 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-1.436V3.25c0-.555.225-1.057.609-1.436zm11.597 11.599l2.709 2.709-12.08 6.942 9.371-9.651zm0-2.826L5.835 1.936l12.08 6.942-2.709 2.709zm1.414 1.413l3.652 2.096c.866.497.866 1.309 0 1.806l-3.652 2.096-2.42-2.42 2.42-2.578z" />
              </svg>
              <div className="text-left">
                <span className="text-[9px] block font-semibold opacity-80 leading-none">TEMUKAN DI</span>
                <span className="text-xs font-black">Google Play</span>
              </div>
            </a>

            {/* App Store */}
            <a
              href="#download"
              className="px-5 py-3 rounded-2xl bg-dark-surface border border-dark-border text-cream-bg font-black text-xs flex items-center gap-2.5 hover:bg-dark-border transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.06.64-2.7 1.39-.56.65-1.07 1.71-1.02 2.75 1.07.08 2.1-.53 2.71-1.27z" />
              </svg>
              <div className="text-left">
                <span className="text-[9px] block font-semibold opacity-80 leading-none">UNDUH DI</span>
                <span className="text-xs font-black">App Store</span>
              </div>
            </a>
          </div>

          <p className="text-[11px] text-peach-tint/60 pt-0.5">
            *Daftar & login mudah dengan Email / Google Auth. Riwayat data tersimpan aman di cloud pribadi tanpa pernah diumbar.
          </p>
        </div>

        {/* Right Column: Interactive Phone Frame in Real Size (Displays Quick-Log Catat Kelegaan) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-8 sm:pt-6 pb-6">
          {/* Floating Playful Mascot Badges around Phone - placed safely at top-left and top-right so they never overlap the phone or bottom info text */}
          <div className="hidden sm:flex absolute -top-3 -left-6 z-30 items-center gap-1.5 bg-dark-surface/95 backdrop-blur border border-dark-border px-3.5 py-1.5 rounded-full shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform">
            <span className="w-6 h-6 rounded-full bg-poop-brown p-0.5 border border-dark-bg flex-shrink-0 flex items-center justify-center">
              <MrPlopSVG />
            </span>
            <span className="text-xs font-black text-cream-bg">Lega Maksimal!</span>
          </div>

          <div className="hidden sm:flex absolute -top-3 -right-6 z-30 items-center gap-1.5 bg-dark-surface/95 backdrop-blur border border-dark-border px-3.5 py-1.5 rounded-full shadow-2xl transform rotate-6 hover:rotate-0 transition-transform">
            <span className="w-6 h-6 rounded-full bg-pee-amber p-0.5 border border-dark-bg flex-shrink-0 flex items-center justify-center">
              <LilDripSVG />
            </span>
            <span className="text-xs font-black text-cream-bg">1-Tap Kencing</span>
          </div>

          {/* Interactive Phone Mockup with standard real-device sizing showing quick-log */}
          <PhoneMockup
            compact={false}
            currentScreen={heroScreen}
            onScreenChange={(s) => {
              setHeroScreen(s);
              if (s === 'map') triggerBubble('Peta Pribadi kamu terbuka! 🗺️');
              if (s === 'quick-log') triggerBubble('Layar Catat Kelegaan: Tap Lil\' Drip, Mr. Plop, atau Sir Flush! ⚡');
              if (s === 'stats') triggerBubble('Layar Statistik & Tren Mingguan 📊');
              if (s === 'lock') triggerBubble('Layar Proteksi PIN & Biometrik 🔒');
              if (s === 'mood') triggerBubble('Pilih level kelegaanmu! 😊');
              if (s === 'timeline') triggerBubble('Buku harian catatan buang air 📅');
            }}
          />

          <span className="text-[10px] text-peach-tint/60 font-semibold mt-3 text-center flex items-center gap-1">
            <span>💡</span> Sentuh tombol di layar simulasi HP di atas untuk mencoba alur pencatatan
          </span>
        </div>
      </div>
    </section>
  );
};
