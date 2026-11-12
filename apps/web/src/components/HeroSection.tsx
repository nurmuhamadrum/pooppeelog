import React, { useState } from 'react';
import { Zap, ShieldCheck, Cloud, Sparkles, HeartHandshake, MapPin, Flame } from 'lucide-react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { useLanguage } from '../i18n/LanguageContext';
import { useWebCopy } from '../i18n/translations';

type ActiveMascot = 'plop' | 'drip' | 'flush';

export const HeroSection: React.FC = () => {
  const { lang } = useLanguage();
  const t = useWebCopy(lang).hero;

  const [activeMascot, setActiveMascot] = useState<ActiveMascot>('flush');
  const [customBubble, setCustomBubble] = useState<string | null>(null);
  const [poopWiggle, setPoopWiggle] = useState(false);

  const triggerBubble = (text: string, mascot?: ActiveMascot) => {
    setCustomBubble(text);
    if (mascot) setActiveMascot(mascot);
    setPoopWiggle(true);
    setTimeout(() => setPoopWiggle(false), 800);
  };

  const mascotBubble = customBubble || t.defaultBubble;

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:py-24 border-b border-dark-border bg-gradient-to-b from-dark-bg via-dark-bg/95 to-dark-bg">
      {/* Ambient gradient glows */}
      <div className="absolute -top-32 -right-32 w-80 md:w-96 h-80 md:h-96 bg-pee-amber/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 md:w-96 h-80 md:h-96 bg-both-teal/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-80 md:w-96 h-80 md:h-96 bg-[#C98A58]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline, Mascot Greetings, & Value Props */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left z-10">
          {/* Top Pill Badge with animated sparkle */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber shadow-sm hover:scale-105 transition-transform cursor-default">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.pill}</span>
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
            {t.taglinePre}
            <strong>{t.taglineBold1}</strong>
            {t.taglineMid}
            <strong>Mr. Plop</strong>, <strong>Lil' Drip</strong>, &amp; <strong>Sir Flush</strong>
            {t.taglineEnd}
            <strong>{t.taglineBold2}</strong>
            {t.taglinePost}
          </p>

          {/* Cute Interactive Mascot Bubble Widget */}
          <div className="bg-dark-surface/90 border border-dark-border rounded-2xl p-3.5 max-w-xl mx-auto lg:mx-0 flex items-center gap-3.5 shadow-lg relative group">
            <div className="flex items-center -space-x-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => triggerBubble(t.plopQuote, 'plop')}
                className={`w-10 h-10 rounded-full bg-poop-brown p-1 border-2 border-dark-bg shadow-md hover:scale-125 hover:z-20 active:scale-90 transition-all flex items-center justify-center ${
                  poopWiggle ? 'mascot-bounce-wiggle' : ''
                }`}
                title="Mr. Plop"
              >
                <MrPlopSVG />
              </button>
              <button
                type="button"
                onClick={() => triggerBubble(t.dripQuote, 'drip')}
                className="w-10 h-10 rounded-full bg-pee-amber p-1 border-2 border-dark-bg shadow-md hover:scale-125 hover:z-20 active:scale-90 transition-all flex items-center justify-center"
                title="Lil' Drip"
              >
                <LilDripSVG />
              </button>
              <button
                type="button"
                onClick={() => triggerBubble(t.flushQuote, 'flush')}
                className="w-10 h-10 rounded-full bg-both-teal p-1 border-2 border-dark-bg shadow-md hover:scale-125 hover:z-20 active:scale-90 transition-all flex items-center justify-center"
                title="Sir Flush"
              >
                <SirFlushSVG />
              </button>
            </div>

            <div className="flex-1 text-left min-h-[38px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-pee-amber uppercase tracking-wider">
                <HeartHandshake className="w-3 h-3" />
                <span>{t.mascotSays}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-cream-bg line-clamp-2 transition-all">
                {mascotBubble}
              </p>
            </div>
          </div>

          {/* 3 Core Tenets Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs text-peach-tint font-bold">
            <span className="flex items-center gap-1.5 bg-dark-surface px-3 py-1.5 rounded-xl border border-dark-border">
              <Zap className="w-3.5 h-3.5 text-pee-amber" /> {t.chip1}
            </span>
            <span className="flex items-center gap-1.5 bg-dark-surface px-3 py-1.5 rounded-xl border border-dark-border">
              <Cloud className="w-3.5 h-3.5 text-both-teal" /> {t.chip2}
            </span>
            <span className="flex items-center gap-1.5 bg-dark-surface px-3 py-1.5 rounded-xl border border-dark-border">
              <ShieldCheck className="w-3.5 h-3.5 text-drip-blue" /> {t.chip3}
            </span>
          </div>

          {/* App Store Download Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <a
              href="#download"
              className="px-5 py-3 rounded-2xl bg-pee-amber text-ink font-black text-xs flex items-center gap-2.5 shadow-xl shadow-pee-amber/25 hover:scale-105 active:scale-95 transition-all group"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-1.436V3.25c0-.555.225-1.057.609-1.436zm11.597 11.599l2.709 2.709-12.08 6.942 9.371-9.651zm0-2.826L5.835 1.936l12.08 6.942-2.709 2.709zm1.414 1.413l3.652 2.096c.866.497.866 1.309 0 1.806l-3.652 2.096-2.42-2.42 2.42-2.578z" />
              </svg>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[9px] block font-semibold opacity-80">{t.playSub}</span>
                  <span className="text-[8px] bg-ink/15 text-ink font-extrabold px-1.5 py-0.5 rounded-full uppercase">{t.soon}</span>
                </div>
                <span className="text-xs font-black">Google Play</span>
              </div>
            </a>

            <a
              href="#download"
              className="px-5 py-3 rounded-2xl bg-dark-surface border border-dark-border text-cream-bg font-black text-xs flex items-center gap-2.5 hover:bg-dark-border hover:border-both-teal/40 transition-all group"
            >
              <svg className="w-5 h-5 flex-shrink-0 text-peach-tint group-hover:text-cream-bg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.06.64-2.7 1.39-.56.65-1.07 1.71-1.02 2.75 1.07.08 2.1-.53 2.71-1.27z" />
              </svg>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[9px] block font-semibold opacity-80 text-peach-tint/70">{t.appSub}</span>
                  <span className="text-[8px] bg-both-teal/20 text-both-teal font-extrabold px-1.5 py-0.5 rounded-full uppercase">{t.soon}</span>
                </div>
                <span className="text-xs font-black">App Store</span>
              </div>
            </a>
          </div>

          <p className="text-[11px] text-peach-tint/60 pt-0.5">{t.footnote}</p>
        </div>

        {/* Right Column: Animated Mascot Stage */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
          <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
            <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-poop-brown/25 via-pee-amber/20 to-both-teal/25 blur-2xl pointer-events-none" />

            <div className="absolute inset-2 rounded-full border border-dashed border-dark-border/80 orbit-spin-slow pointer-events-none">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pee-amber shadow-lg shadow-pee-amber/50" />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-both-teal shadow-lg shadow-both-teal/50" />
            </div>

            <div className="absolute inset-12 rounded-full border border-dark-border/60 orbit-spin-reverse pointer-events-none">
              <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-drip-blue shadow-lg shadow-drip-blue/50" />
            </div>

            <div className="absolute top-4 left-0 sm:-left-2 z-20 bg-dark-surface/95 backdrop-blur border border-dark-border px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-[11px] font-black text-pee-amber mascot-float">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.stageChip1}</span>
            </div>

            <div className="absolute top-8 right-0 sm:-right-2 z-20 bg-dark-surface/95 backdrop-blur border border-dark-border px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-[11px] font-black text-both-teal mascot-float-delayed">
              <Flame className="w-3.5 h-3.5 text-emergency" />
              <span>{t.stageChip2}</span>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-dark-surface/95 backdrop-blur border border-dark-border px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 text-[11px] font-bold text-cream-bg whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-pee-amber" />
              <span>{t.stageHint}</span>
            </div>

            <div className="relative z-10 flex items-end justify-center -space-x-4 sm:-space-x-5">
              <button
                type="button"
                onClick={() => triggerBubble(t.plopQuote, 'plop')}
                className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-poop-brown p-3 border-4 border-dark-bg shadow-2xl mascot-bounce-wiggle mascot-interactive flex items-center justify-center transition-all ${
                  activeMascot === 'plop' ? 'ring-4 ring-pee-amber/60 z-20' : 'opacity-95'
                }`}
                title="Mr. Plop (Poop)"
              >
                <MrPlopSVG />
                <span className="absolute -bottom-2.5 bg-dark-bg border border-dark-border text-[9px] font-black text-peach-tint px-2 py-0.5 rounded-full shadow">
                  Mr. Plop
                </span>
              </button>

              <button
                type="button"
                onClick={() => triggerBubble(t.flushQuote, 'flush')}
                className={`group relative w-32 h-32 sm:w-36 sm:h-36 -translate-y-6 rounded-[2rem] bg-both-teal p-3.5 border-4 border-dark-bg shadow-2xl shadow-both-teal/25 mascot-float mascot-interactive flex items-center justify-center transition-all ${
                  activeMascot === 'flush' ? 'ring-4 ring-both-teal/60 z-30' : 'z-20'
                }`}
                title="Sir Flush (Combo)"
              >
                <SirFlushSVG />
                <span className="absolute -bottom-2.5 bg-dark-bg border border-both-teal/50 text-[10px] font-black text-both-teal px-2.5 py-0.5 rounded-full shadow">
                  Sir Flush
                </span>
              </button>

              <button
                type="button"
                onClick={() => triggerBubble(t.dripQuote, 'drip')}
                className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-pee-amber p-3 border-4 border-dark-bg shadow-2xl mascot-float-delayed mascot-interactive flex items-center justify-center transition-all ${
                  activeMascot === 'drip' ? 'ring-4 ring-drip-blue/60 z-20' : 'opacity-95'
                }`}
                title="Lil' Drip (Pee)"
              >
                <LilDripSVG />
                <span className="absolute -bottom-2.5 bg-dark-bg border border-dark-border text-[9px] font-black text-pee-amber px-2 py-0.5 rounded-full shadow">
                  Lil' Drip
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
