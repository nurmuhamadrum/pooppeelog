import React from 'react';
import { EyeOff, UserX, Trash2, FileSpreadsheet } from 'lucide-react';
import { SirFlushSVG } from './MascotSVGs';
import { useLanguage } from '../i18n/LanguageContext';
import { useWebCopy } from '../i18n/translations';

export const PrivacyManifesto: React.FC = () => {
  const { lang } = useLanguage();
  const t = useWebCopy(lang).privacy;
  const isEn = lang === 'en';

  return (
    <section id="privasi" className="py-20 md:py-28 border-b border-dark-border bg-dark-bg/80">
      <div className="max-w-5xl mx-auto px-6">
        <div className="w-16 h-16 rounded-3xl bg-both-teal/20 border border-both-teal/40 p-2 mx-auto mb-6 shadow-xl flex items-center justify-center">
          <SirFlushSVG />
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-both-teal bg-both-teal/10 border border-both-teal/30 px-3 py-1 rounded-full">
            {t.pill}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight mt-3">
            {t.title}
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-both-teal/20 border border-both-teal/40 flex items-center justify-center text-both-teal flex-shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">{t.c1Title}</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">{t.c1Desc}</p>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-pee-amber/20 border border-pee-amber/40 flex items-center justify-center text-pee-amber flex-shrink-0">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">{t.c2Title}</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">{t.c2Desc}</p>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-poop-brown/20 border border-poop-brown/40 flex items-center justify-center text-poop-brown flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">{t.c3Title}</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">{t.c3Desc}</p>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emergency/20 border border-emergency/40 flex items-center justify-center text-emergency flex-shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">{t.c4Title}</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">{t.c4Desc}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border-2 border-both-teal/30 rounded-3xl p-8 text-center relative overflow-hidden">
          <p className="text-sm sm:text-base text-cream-bg font-semibold italic max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? '"We designed Poop Pee Log so you can smile proudly at your personal relief trail without ever worrying that your restroom habits will become ad targeting data."'
              : '"Kami merancang Poop Pee Log agar Anda bisa tersenyum puas melihat jejak lega Anda tanpa perlu khawatir suatu hari data toilet Anda dijadikan target iklan pop-up."'}
          </p>
          <div className="mt-4 text-xs text-both-teal font-extrabold uppercase tracking-wider">
            {isEn ? '— Poop Pee Log Team' : '— Tim Poop Pee Log'}
          </div>
        </div>
      </div>
    </section>
  );
};
