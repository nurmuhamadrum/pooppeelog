import React from 'react';
import { Smartphone, Github, Sparkles, CheckCircle2 } from 'lucide-react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { useLanguage } from '../i18n/LanguageContext';

export const DownloadSection: React.FC = () => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  return (
    <section id="download" className="py-24 bg-dark-bg relative overflow-hidden border-t border-dark-border">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-poop-brown/15 via-pee-amber/15 to-both-teal/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-b from-dark-surface to-[#241F1A] border-2 border-dark-border rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-center -space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-poop-brown p-1 border-2 border-dark-bg shadow-md">
              <MrPlopSVG />
            </div>
            <div className="w-14 h-14 rounded-full bg-pee-amber p-1 border-2 border-dark-bg shadow-lg -translate-y-1 z-10">
              <LilDripSVG />
            </div>
            <div className="w-12 h-12 rounded-full bg-both-teal p-1 border-2 border-dark-bg shadow-md">
              <SirFlushSVG />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pee-amber/10 border border-pee-amber/30 text-pee-amber text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Under Active Development' : 'Sedang Dalam Tahap Pengembangan Aktif'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-cream-bg tracking-tight max-w-2xl mx-auto">
            {isEn ? 'Coming Soon to Your Hands.' : 'Segera Hadir di Genggaman Anda.'}
          </h2>
          <p className="text-peach-tint/70 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            {isEn ? (
              <>
                The <strong className="text-cream-bg">Poop Pee Log</strong> mobile app (iOS &amp; Android) is being crafted for ultra-fast performance, 100% offline-first reliability, and zero privacy trackers.
              </>
            ) : (
              <>
                Aplikasi mobile <strong className="text-cream-bg">Poop Pee Log</strong> (iOS &amp; Android) sedang kami bangun dengan performa ultra cepat, 100% offline-first, dan tanpa pelacak privasi.
              </>
            )}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-dark-bg/80 border border-dark-border text-left flex items-center gap-4 opacity-90 hover:border-pee-amber/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-pee-amber">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-peach-tint/60 font-semibold uppercase tracking-wider">
                  {isEn ? 'Get it on' : 'Download di'}
                </div>
                <div className="text-base font-extrabold text-cream-bg leading-tight">Google Play</div>
                <span className="inline-block mt-0.5 text-[10px] bg-pee-amber/20 text-pee-amber px-2 py-0.2 rounded-full font-bold">Coming Soon</span>
              </div>
            </div>

            <div className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-dark-bg/80 border border-dark-border text-left flex items-center gap-4 opacity-90 hover:border-both-teal/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-both-teal">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-peach-tint/60 font-semibold uppercase tracking-wider">
                  {isEn ? 'Download on' : 'Download di'}
                </div>
                <div className="text-base font-extrabold text-cream-bg leading-tight">App Store</div>
                <span className="inline-block mt-0.5 text-[10px] bg-both-teal/20 text-both-teal px-2 py-0.2 rounded-full font-bold">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-dark-border/80 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-peach-tint/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-both-teal" />
              <span>{isEn ? '100% Ad-Free & Biometric Encrypted' : '100% Bebas Iklan & Biometrik Terenkripsi'}</span>
            </div>
            <span className="hidden sm:inline text-dark-border">•</span>
            <a
              href="https://github.com/nurmuhamadrum/pooppeelog"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface hover:bg-dark-border/70 border border-dark-border text-cream-bg font-bold transition-all hover:scale-105"
            >
              <Github className="w-4 h-4" />
              <span>{isEn ? 'Follow Progress on GitHub' : 'Pantau Progress di GitHub'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
