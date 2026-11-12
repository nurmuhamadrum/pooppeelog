import React, { useState } from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Coffee, Heart, Sparkles, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const BuyMeACoffeeSection: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(2);
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const tiers = [
    {
      cups: 1,
      price: isEn ? '$1 / Rp 10k' : 'Rp 10.000',
      title: isEn ? 'Iced Tea / Coffee' : 'Segelas Es Teh / Kopi',
      desc: isEn ? 'Keeps the developer awake building new features & performance boosts.' : 'Bikin developer melek koding fitur baru dan optimasi performa.',
      icon: '🧋',
    },
    {
      cups: 2,
      price: isEn ? '$2 / Rp 25k' : 'Rp 25.000',
      title: isEn ? 'Palm Sugar Latte' : 'Kopi Susu Gula Aren',
      desc: isEn ? 'Supports server ops, offline maps, and regular updates.' : 'Bantu operasional server, peta offline, dan perbaikan berkala.',
      popular: true,
      icon: '☕',
    },
    {
      cups: 3,
      price: isEn ? '$4 / Rp 50k' : 'Rp 50.000',
      title: isEn ? 'Treat the Mascot Trio' : 'Traktir Trio Maskot',
      desc: isEn ? 'Mr. Plop, Lil\' Drip, and Sir Flush raise a toast of relief with you!' : 'Mr. Plop, Lil\' Drip, dan Sir Flush bersulang kelegaan bersamamu!',
      icon: '☕☕☕',
    },
  ];

  return (
    <section id="support" className="py-20 md:py-28 border-b border-dark-border relative overflow-hidden bg-gradient-to-b from-dark-bg via-dark-surface/40 to-dark-bg">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FAAE2B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAAE2B]/15 border border-[#FAAE2B]/40 text-xs font-black text-[#FAAE2B] mb-4 shadow-sm">
            <Coffee className="w-4 h-4" />
            <span>{isEn ? 'SUPPORT DEVELOPMENT' : 'DUKUNG PENGEMBANGAN'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            {isEn ? 'Support the Developer on ' : 'Dukung Developer Lewat '}
            <span className="text-[#FAAE2B] underline decoration-pee-amber/60 decoration-wavy decoration-2">
              Saweria
            </span>
          </h2>

          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            {isEn ? (
              <>
                Poop Pee Log is built <strong>100% free</strong> with zero paywalls, zero noisy ads, and zero monetization of your biological health data. Your small tip on Saweria helps keep this app growing!
              </>
            ) : (
              <>
                Poop Pee Log dibuat <strong>100% gratis</strong> tanpa paywall, tanpa iklan berisik, dan tanpa pernah memonetisasi data kesehatan biologismu. Donasi kecilmu di Saweria sangat berarti agar aplikasi ini terus berkembang!
              </>
            )}
          </p>
        </div>

        <div className="bg-dark-surface/90 border border-dark-border rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-dark-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center -space-x-3">
                <div className="w-14 h-14 rounded-full bg-poop-brown p-2 border-2 border-dark-bg shadow-xl flex items-center justify-center transform -rotate-6">
                  <MrPlopSVG />
                </div>
                <div className="w-16 h-16 rounded-full bg-pee-amber p-2.5 border-2 border-dark-bg shadow-2xl z-10 flex items-center justify-center">
                  <LilDripSVG />
                </div>
                <div className="w-14 h-14 rounded-full bg-both-teal p-2 border-2 border-dark-bg shadow-xl flex items-center justify-center transform rotate-6">
                  <SirFlushSVG />
                </div>
              </div>
              <div>
                <span className="text-xs font-black text-both-teal uppercase tracking-wider block">
                  {isEn ? 'The Mascot Trio Cheers You On' : 'Trio Maskot Menemanimu'}
                </span>
                <h4 className="text-lg font-black text-cream-bg">
                  {isEn ? '"Happy Coding, Healthy Gut, Relieved Heart!"' : '"Semangat Koding, Perut Sehat, Hati Lega!"'}
                </h4>
                <p className="text-xs text-peach-tint/70">
                  {isEn
                    ? 'Mr. Plop, Lil\' Drip, & Sir Flush are ready to record every step.'
                    : 'Mr. Plop, Lil\' Drip, & Sir Flush siap terus mencatat setiap jejakmu.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-dark-bg px-4 py-2.5 rounded-2xl border border-dark-border text-xs text-peach-tint/80">
              <Heart className="w-4 h-4 text-emergency fill-emergency flex-shrink-0" />
              <span>{isEn ? 'Zero Ads • Zero Data Selling • 100% Private' : 'Nol Iklan • Nol Jual Data • 100% Pribadi'}</span>
            </div>
          </div>

          <div className="pt-6">
            <label className="text-xs font-bold text-peach-tint/70 uppercase tracking-wider block mb-3">
              {isEn ? 'Support Tiers:' : 'Pilihan Dukungan:'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiers.map((tier) => {
                const isSelected = selectedTier === tier.cups;
                return (
                  <button
                    key={tier.cups}
                    onClick={() => setSelectedTier(tier.cups)}
                    className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FAAE2B]/10 border-[#FAAE2B] shadow-xl shadow-[#FAAE2B]/10 ring-2 ring-[#FAAE2B]/40'
                        : 'bg-dark-bg border-dark-border hover:border-peach-tint/40'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2.5 right-4 bg-[#FAAE2B] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {isEn ? 'POPULAR' : 'POPULER'}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{tier.icon}</span>
                        <span className="text-xs font-black text-[#FAAE2B]">{tier.price}</span>
                      </div>
                      <h5 className="font-bold text-sm text-cream-bg">{tier.title}</h5>
                      <p className="text-xs text-peach-tint/70 mt-1 leading-snug">{tier.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between text-xs font-bold">
                      <span className={isSelected ? 'text-[#FAAE2B]' : 'text-peach-tint/50'}>
                        {isEn ? `Support Tier #${tier.cups}` : `Tingkat Dukungan #${tier.cups}`}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#FAAE2B] text-black flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-peach-tint/60 block">
                {isEn ? 'Support via QRIS, GoPay, OVO, Dana, LinkAja on Saweria:' : 'Dukungan via QRIS, GoPay, OVO, Dana, LinkAja di Saweria:'}
              </span>
              <span className="text-xs font-bold text-cream-bg">saweria.co/pooppeelog</span>
            </div>

            <a
              href="https://saweria.co/pooppeelog"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FAAE2B] hover:bg-[#fbb944] active:scale-95 text-[#000000] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-[#FAAE2B]/25 transition-all group"
            >
              <Coffee className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{isEn ? 'Support via Saweria' : 'Dukung via Saweria'}</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
