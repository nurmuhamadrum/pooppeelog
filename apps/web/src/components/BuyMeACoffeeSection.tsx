import React, { useState } from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Coffee, Heart, Sparkles, Check, ExternalLink } from 'lucide-react';

export const BuyMeACoffeeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.216 6.415l-.132-.666c-.119-.597-.387-1.163-.78-1.636-.394-.474-.897-.835-1.464-1.054-.567-.218-1.18-.306-1.782-.256-.602.05-1.187.234-1.705.536l-1.077.628c-.896-.604-1.942-.968-3.032-1.055-1.09-.088-2.18.102-3.159.551s-1.802 1.135-2.385 1.99c-.583.855-.898 1.865-.913 2.927l.004.283c-.021.368.016.737.11 1.093l1.83 6.945c.294 1.117.971 2.083 1.91 2.723.938.641 2.062.946 3.172.861l5.228-.403c1.085-.084 2.102-.572 2.87-1.378.767-.806 1.196-1.879 1.21-2.998l.42-3.864c.597-.184 1.127-.552 1.516-1.052.388-.501.603-1.119.615-1.758.012-.64-.179-1.265-.546-1.788-.367-.522-.888-.912-1.487-1.116zm-2.072 2.812l-.258 2.378c-.01.093-.046.183-.105.258-.059.075-.138.129-.228.156l-.689.208-.752-2.856 1.045-.61c.159-.093.34-.149.526-.164.185-.015.372.012.546.079.174.067.329.178.45.323.12.146.203.32.24.508l.025.12c.002.04.004.079.004.119 0 .093-.016.186-.048.274-.032.088-.08.169-.142.238-.062.068-.137.123-.22.16z" />
  </svg>
);

export const BuyMeACoffeeSection: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(2);

  const tiers = [
    {
      cups: 1,
      price: 'Rp 25.000',
      title: 'Segelas Espresso',
      desc: 'Bikin developer melek koding fitur baru di malam hari.',
      icon: '☕',
    },
    {
      cups: 2,
      price: 'Rp 50.000',
      title: 'Cappuccino Hangat',
      desc: 'Bantu biaya operasional server Supabase & peta tanpa iklan.',
      popular: true,
      icon: '☕☕',
    },
    {
      cups: 3,
      price: 'Rp 75.000',
      title: 'Traktir Trio Maskot',
      desc: 'Mr. Plop, Lil\' Drip, dan Sir Flush bersulang kelegaan bersamamu!',
      icon: '☕☕☕',
    },
  ];

  return (
    <section id="support" className="py-20 md:py-28 border-b border-dark-border relative overflow-hidden bg-gradient-to-b from-dark-bg via-dark-surface/40 to-dark-bg">
      {/* Background ambient warm glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFDD00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header Tag */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFDD00]/15 border border-[#FFDD00]/40 text-xs font-black text-[#FFDD00] mb-4 shadow-sm">
            <Coffee className="w-4 h-4" />
            <span>DUKUNG PENGEMBANGAN</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            Traktir Kami Kopi di{' '}
            <span className="text-[#FFDD00] underline decoration-pee-amber/60 decoration-wavy decoration-2">
              Buy Me a Coffee
            </span>
          </h2>

          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            Poop Pee Log dibuat <strong>100% gratis</strong> tanpa paywall, tanpa iklan berisik, dan tanpa pernah memonetisasi data kesehatan biologismu. Traktiran kopi dari kamu menjaga aplikasi ini tetap independen dan terus berkembang!
          </p>
        </div>

        {/* Mascot Cheers Card */}
        <div className="bg-dark-surface/90 border border-dark-border rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-dark-border">
            {/* Mascot Trio with Coffee */}
            <div className="flex items-center gap-4">
              <div className="flex items-center -space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-poop-brown p-2 border-2 border-dark-bg shadow-xl flex items-center justify-center transform -rotate-6">
                  <MrPlopSVG />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-pee-amber p-2.5 border-2 border-dark-bg shadow-2xl z-10 flex items-center justify-center">
                  <LilDripSVG />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-both-teal p-2 border-2 border-dark-bg shadow-xl flex items-center justify-center transform rotate-6">
                  <SirFlushSVG />
                </div>
              </div>
              <div>
                <span className="text-xs font-black text-both-teal uppercase tracking-wider block">
                  Trio Maskot Menemanimu
                </span>
                <h4 className="text-lg font-black text-cream-bg">
                  "Kopi Hangat, Perut Sehat, Hati Lega!"
                </h4>
                <p className="text-xs text-peach-tint/70">
                  Mr. Plop, Lil' Drip, & Sir Flush siap terus mencatat setiap jejakmu.
                </p>
              </div>
            </div>

            {/* Privacy Promise Badge */}
            <div className="flex items-center gap-2 bg-dark-bg px-4 py-2.5 rounded-2xl border border-dark-border text-xs text-peach-tint/80">
              <Heart className="w-4 h-4 text-emergency fill-emergency flex-shrink-0" />
              <span>Nol Iklan • Nol Jual Data • 100% Pribadi</span>
            </div>
          </div>

          {/* Interactive Coffee Selection Tiers */}
          <div className="pt-6">
            <label className="text-xs font-bold text-peach-tint/70 uppercase tracking-wider block mb-3">
              Pilih Jumlah Kopi:
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
                        ? 'bg-[#FFDD00]/10 border-[#FFDD00] shadow-xl shadow-[#FFDD00]/10 ring-2 ring-[#FFDD00]/40'
                        : 'bg-dark-bg border-dark-border hover:border-peach-tint/40'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2.5 right-4 bg-[#FFDD00] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> FAVORIT
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{tier.icon}</span>
                        <span className="text-xs font-black text-[#FFDD00]">{tier.price}</span>
                      </div>
                      <h5 className="font-bold text-sm text-cream-bg">{tier.title}</h5>
                      <p className="text-xs text-peach-tint/70 mt-1 leading-snug">{tier.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between text-xs font-bold">
                      <span className={isSelected ? 'text-[#FFDD00]' : 'text-peach-tint/50'}>
                        {tier.cups} Cangkir Kopi
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#FFDD00] text-black flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Buy Me a Coffee Action Button */}
          <div className="mt-8 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-peach-tint/60 block">
                Dukungan disalurkan secara aman melalui platform resmi:
              </span>
              <span className="text-xs font-bold text-cream-bg">
                buymeacoffee.com/pooppeelog
              </span>
            </div>

            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFDD00] hover:bg-[#ffe338] active:scale-95 text-[#000000] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-[#FFDD00]/25 transition-all group"
            >
              <BuyMeACoffeeIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Traktir {selectedTier} Kopi di Buy Me a Coffee</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
