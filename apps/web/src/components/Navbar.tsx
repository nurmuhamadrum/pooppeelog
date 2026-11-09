import React, { useState } from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Download, Menu, X, ShieldCheck, Coffee } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo with Mascot Trio */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="flex items-center -space-x-2">
            <div className="w-9 h-9 rounded-full bg-poop-brown p-1 border-2 border-dark-bg shadow-md flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
              <MrPlopSVG />
            </div>
            <div className="w-9 h-9 rounded-full bg-pee-amber p-1 border-2 border-dark-bg shadow-md flex items-center justify-center transform group-hover:-translate-y-1.5 transition-transform">
              <LilDripSVG />
            </div>
            <div className="w-9 h-9 rounded-full bg-both-teal p-1 border-2 border-dark-bg shadow-md flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
              <SirFlushSVG />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-cream-bg tracking-tight">Poop Pee Log</span>
              <span className="text-[10px] bg-both-teal/20 text-both-teal border border-both-teal/40 px-2 py-0.5 rounded-full font-bold">MVP Fase 1</span>
            </div>
            <span className="text-[11px] text-peach-tint/70 font-medium block -mt-0.5">Track. Log. Lega.</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-peach-tint/80">
          <a href="#fitur" className="hover:text-pee-amber transition-colors">Fitur</a>
          <a href="#maskot" className="hover:text-pee-amber transition-colors">Maskot</a>
          <a href="#preview" className="hover:text-pee-amber transition-colors">Peta Pribadi</a>
          <a href="#lencana" className="hover:text-pee-amber transition-colors">Lencana</a>
          <a href="#privasi" className="hover:text-pee-amber transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-both-teal" />
            Privasi 100%
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-[#FFDD00] text-black font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-[#ffe338] hover:scale-105 active:scale-95 transition-all"
            title="Dukung Developer di Buy Me a Coffee"
          >
            <Coffee className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Buy Me a Coffee</span>
          </a>

          <a
            href="#download"
            className="px-4 py-2.5 rounded-full bg-pee-amber text-ink font-black text-xs flex items-center gap-1.5 shadow-lg shadow-pee-amber/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-peach-tint hover:text-cream-bg rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-b border-dark-border px-6 py-5 space-y-4 text-sm font-bold text-peach-tint animate-fadeIn">
          <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">Fitur</a>
          <a href="#maskot" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">Maskot</a>
          <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">Peta Pribadi</a>
          <a href="#lencana" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">Lencana</a>
          <a href="#privasi" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-pee-amber">Privasi 100%</a>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#FFDD00] text-black font-black text-xs flex items-center justify-center gap-2 shadow"
            >
              <Coffee className="w-4 h-4 stroke-[2.5]" />
              <span>Buy Me a Coffee</span>
            </a>
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-pee-amber text-ink font-black text-xs flex items-center justify-center gap-2 shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download Sekarang</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
