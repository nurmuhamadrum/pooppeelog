import React, { useState } from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Download, Menu, X, ShieldCheck, Coffee, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useWebCopy } from '../i18n/translations';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = useWebCopy(lang).nav;

  const LangSwitcher = () => (
    <div className="inline-flex items-center bg-dark-surface border border-dark-border rounded-full p-0.5 text-[10px] sm:text-[11px] font-black flex-shrink-0">
      <Globe className="hidden sm:block w-3.5 h-3.5 text-peach-tint/60 ml-2 mr-1" />
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-full transition-all ${
          lang === 'en' ? 'bg-both-teal text-ink' : 'text-peach-tint/70 hover:text-cream-bg'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('id')}
        className={`px-2 py-1 rounded-full transition-all ${
          lang === 'id' ? 'bg-both-teal text-ink' : 'text-peach-tint/70 hover:text-cream-bg'
        }`}
      >
        ID
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Logo with Mascot Trio */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
          <div className="flex items-center -space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-poop-brown p-1 border-2 border-dark-bg shadow-md flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
              <MrPlopSVG />
            </div>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-pee-amber p-1 border-2 border-dark-bg shadow-md flex items-center justify-center transform group-hover:-translate-y-1.5 transition-transform">
              <LilDripSVG />
            </div>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-both-teal p-1 border-2 border-dark-bg shadow-md flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
              <SirFlushSVG />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-sm sm:text-lg text-cream-bg tracking-tight truncate">Poop Pee Log</span>
              <span className="hidden sm:inline-block text-[10px] bg-both-teal/20 text-both-teal border border-both-teal/40 px-2 py-0.5 rounded-full font-bold">v1.0</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-peach-tint/70 font-medium block -mt-0.5 truncate">Track. Log. Lega.</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-peach-tint/80">
          <a href="#fitur" className="hover:text-pee-amber transition-colors">{t.features}</a>
          <a href="#maskot" className="hover:text-pee-amber transition-colors">{t.mascots}</a>
          <a href="#preview" className="hover:text-pee-amber transition-colors">{t.preview}</a>
          <a href="#lencana" className="hover:text-pee-amber transition-colors">{t.badges}</a>
          <a href="#privasi" className="hover:text-pee-amber transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-both-teal" />
            {t.privacy}
          </a>
        </nav>

        {/* CTA Buttons & Language Toggle */}
        <div className="hidden md:flex items-center gap-2.5">
          <LangSwitcher />

          <a
            href="https://saweria.co/pooppeelog"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-[#FAAE2B] text-black font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-[#fbb944] hover:scale-105 active:scale-95 transition-all"
            title={t.support}
          >
            <Coffee className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.support}</span>
          </a>

          <a
            href="#download"
            className="px-4 py-2.5 rounded-full bg-pee-amber text-ink font-black text-xs flex items-center gap-1.5 shadow-lg shadow-pee-amber/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.download}</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <LangSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-peach-tint hover:text-cream-bg rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-b border-dark-border px-6 py-5 space-y-4 text-sm font-bold text-peach-tint animate-fadeIn">
          <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">{t.features}</a>
          <a href="#maskot" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">{t.mascots}</a>
          <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">{t.preview}</a>
          <a href="#lencana" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">{t.badges}</a>
          <a href="#privasi" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">{t.privacy}</a>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://saweria.co/pooppeelog"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#FAAE2B] text-black font-black text-xs flex items-center justify-center gap-2 shadow"
            >
              <Coffee className="w-4 h-4 stroke-[2.5]" />
              <span>{t.support}</span>
            </a>
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-pee-amber text-ink font-black text-xs flex items-center justify-center gap-2 shadow"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadNow}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
