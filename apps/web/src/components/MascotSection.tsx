import React from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Sparkles } from 'lucide-react';

export const MascotSection: React.FC = () => {
  return (
    <section id="maskot" className="py-20 md:py-28 border-b border-dark-border bg-dark-bg/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Kenalan dengan Trio Maskot Resmi
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            Sahabat Setia di Setiap Toilet
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            Menghilangkan rasa canggung dalam mencatat aktivitas biologis harianmu. Karakter ekspresif yang siap merayakan setiap kelegaan.
          </p>
        </div>

        {/* 3 Mascots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Mr. Plop */}
          <div className="group bg-dark-surface border border-dark-border rounded-3xl p-8 hover:border-poop-brown transition-all duration-300 hover:shadow-2xl hover:shadow-poop-brown/20 flex flex-col justify-between">
            <div>
              <div className="w-32 h-32 rounded-3xl bg-poop-brown p-3 mx-auto mb-6 shadow-xl border-2 border-white/20 transform group-hover:scale-105 group-hover:rotate-2 transition-transform">
                <MrPlopSVG />
              </div>
              <div className="text-center">
                <span className="text-xs font-black uppercase text-peach-tint bg-poop-brown/30 border border-poop-brown/50 px-3 py-1 rounded-full">
                  Poop Mascot
                </span>
                <h3 className="text-2xl font-black text-cream-bg mt-3">Mr. Plop</h3>
                <p className="text-xs text-pee-amber font-semibold mt-1">"Plong adalah koentji kehidupan!"</p>
              </div>
              <p className="text-xs sm:text-sm text-peach-tint/80 mt-4 leading-relaxed text-center">
                Swirl coklat ramah dengan mata bundar berbinar dan pipi merona. Hadir menemani setiap momen buang air besar (BAB) agar terekam rapi dan menyenangkan.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border/80 flex items-center justify-between text-[11px] font-bold text-peach-tint/70">
              <span>Warna Khas:</span>
              <span className="font-mono text-peach-tint bg-dark-bg px-2 py-0.5 rounded">#8B5E3C (Poop Brown)</span>
            </div>
          </div>

          {/* 2. Lil' Drip */}
          <div className="group bg-dark-surface border border-dark-border rounded-3xl p-8 hover:border-pee-amber transition-all duration-300 hover:shadow-2xl hover:shadow-pee-amber/20 flex flex-col justify-between">
            <div>
              <div className="w-32 h-32 rounded-3xl bg-pee-amber p-3 mx-auto mb-6 shadow-xl border-2 border-white/20 transform group-hover:scale-105 group-hover:-rotate-2 transition-transform">
                <LilDripSVG />
              </div>
              <div className="text-center">
                <span className="text-xs font-black uppercase text-ink bg-pee-amber px-3 py-1 rounded-full">
                  Pee Mascot
                </span>
                <h3 className="text-2xl font-black text-cream-bg mt-3">Lil' Drip</h3>
                <p className="text-xs text-drip-blue font-semibold mt-1">"Jangan nahan lama-lama, lega itu sehat!"</p>
              </div>
              <p className="text-xs sm:text-sm text-peach-tint/80 mt-4 leading-relaxed text-center">
                Tetesan air biru ceria yang selalu mengingatkan pentingnya hidrasi optimal. Maskot untuk buang air kecil (kencing) dengan tombol 1-tap tercepat.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border/80 flex items-center justify-between text-[11px] font-bold text-peach-tint/70">
              <span>Warna Khas:</span>
              <span className="font-mono text-pee-amber bg-dark-bg px-2 py-0.5 rounded">#F5B700 & #3BA3E8</span>
            </div>
          </div>

          {/* 3. Sir Flush */}
          <div className="group bg-dark-surface border border-dark-border rounded-3xl p-8 hover:border-both-teal transition-all duration-300 hover:shadow-2xl hover:shadow-both-teal/20 flex flex-col justify-between">
            <div>
              <div className="w-32 h-32 rounded-3xl bg-both-teal p-3 mx-auto mb-6 shadow-xl border-2 border-white/20 transform group-hover:scale-105 group-hover:rotate-1 transition-transform">
                <SirFlushSVG />
              </div>
              <div className="text-center">
                <span className="text-xs font-black uppercase text-both-teal bg-both-teal/20 border border-both-teal/40 px-3 py-1 rounded-full">
                  Combo & Guard Mascot
                </span>
                <h3 className="text-2xl font-black text-cream-bg mt-3">Sir Flush</h3>
                <p className="text-xs text-both-teal font-semibold mt-1">"Satu siraman untuk privasi mutlak."</p>
              </div>
              <p className="text-xs sm:text-sm text-peach-tint/80 mt-4 leading-relaxed text-center">
                Kloset putih bersahabat yang mengayomi Mr. Plop dan Lil' Drip. Mewakili status lega kombo, tombol utama pencatatan FAB, dan penjaga keamanan App Lock.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border/80 flex items-center justify-between text-[11px] font-bold text-peach-tint/70">
              <span>Warna Khas:</span>
              <span className="font-mono text-both-teal bg-dark-bg px-2 py-0.5 rounded">#2FB8AC (Both Teal)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
