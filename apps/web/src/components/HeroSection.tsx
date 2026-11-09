import React from 'react';
import { Zap, ShieldCheck, WifiOff } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:py-24 border-b border-dark-border">
      {/* Ambient gradient glows */}
      <div className="absolute -top-36 -right-36 w-96 h-96 bg-pee-amber/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-both-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Description */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber shadow-sm">
            <span>✨</span> 100% Personal & Private Life-Tracker
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-cream-bg leading-[1.1]">
            Track. Log.{' '}
            <span className="text-both-teal underline decoration-pee-amber/60 decoration-wavy decoration-2">
              Lega.
            </span>
          </h1>

          {/* Tagline Paragraph */}
          <p className="text-base sm:text-lg text-peach-tint/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Seperti <strong>Strava</strong>, tapi untuk buang air kecil dan besar diri sendiri. Didampingi trio maskot menggemaskan <strong>Mr. Plop</strong>, <strong>Lil' Drip</strong>, dan <strong>Sir Flush</strong>. Rekam jejak biologis tanpa canggung hanya dalam <strong>3 detik</strong> dengan privasi total.
          </p>

          {/* 3 Core Tenets Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-peach-tint font-bold">
            <span className="flex items-center gap-1.5 bg-dark-surface px-3.5 py-2 rounded-xl border border-dark-border">
              <Zap className="w-4 h-4 text-pee-amber" /> 3-Detik / 2-Tap Log
            </span>
            <span className="flex items-center gap-1.5 bg-dark-surface px-3.5 py-2 rounded-xl border border-dark-border">
              <ShieldCheck className="w-4 h-4 text-both-teal" /> Zero Social / 100% Privat
            </span>
            <span className="flex items-center gap-1.5 bg-dark-surface px-3.5 py-2 rounded-xl border border-dark-border">
              <WifiOff className="w-4 h-4 text-drip-blue" /> Mode Offline-First
            </span>
          </div>

          {/* App Store Download Buttons */}
          <div id="download" className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            {/* Google Play */}
            <a
              href="#download"
              className="px-6 py-3.5 rounded-2xl bg-pee-amber text-ink font-black text-sm flex items-center gap-3 shadow-xl shadow-pee-amber/25 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-1.436V3.25c0-.555.225-1.057.609-1.436zm11.597 11.599l2.709 2.709-12.08 6.942 9.371-9.651zm0-2.826L5.835 1.936l12.08 6.942-2.709 2.709zm1.414 1.413l3.652 2.096c.866.497.866 1.309 0 1.806l-3.652 2.096-2.42-2.42 2.42-2.578z" />
              </svg>
              <div className="text-left">
                <span className="text-[10px] block font-semibold opacity-80 leading-none">TEMUKAN DI</span>
                <span className="text-xs font-black">Google Play</span>
              </div>
            </a>

            {/* App Store */}
            <a
              href="#download"
              className="px-6 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-cream-bg font-black text-sm flex items-center gap-3 hover:bg-dark-border transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.06.64-2.7 1.39-.56.65-1.07 1.71-1.02 2.75 1.07.08 2.1-.53 2.71-1.27z" />
              </svg>
              <div className="text-left">
                <span className="text-[10px] block font-semibold opacity-80 leading-none">UNDUH DI</span>
                <span className="text-xs font-black">App Store</span>
              </div>
            </a>
          </div>

          <p className="text-xs text-peach-tint/60 pt-1">
            *Gratis untuk Android & iOS. Tidak ada langganan tersembunyi. Bukan pengganti saran medis.
          </p>
        </div>

        {/* Right Column: Standardized Interactive Phone Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
};
