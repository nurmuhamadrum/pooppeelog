import React from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg text-peach-tint/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-dark-border">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="flex items-center -space-x-1.5">
                <div className="w-8 h-8 rounded-full bg-poop-brown p-0.5 border-2 border-dark-bg shadow">
                  <MrPlopSVG />
                </div>
                <div className="w-8 h-8 rounded-full bg-pee-amber p-0.5 border-2 border-dark-bg shadow">
                  <LilDripSVG />
                </div>
                <div className="w-8 h-8 rounded-full bg-both-teal p-0.5 border-2 border-dark-bg shadow">
                  <SirFlushSVG />
                </div>
              </div>
              <span className="font-black text-lg text-cream-bg">Poop Pee Log</span>
            </div>
            <p className="text-xs text-peach-tint/60 mt-1.5 font-medium">
              Track. Log. Lega. — Lifelogger biologis personal nomor satu.
            </p>
          </div>

          {/* Quick Links & Buy Me A Coffee Button */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-peach-tint/80">
              <a href="#fitur" className="hover:text-pee-amber">Fitur</a>
              <a href="#maskot" className="hover:text-pee-amber">Maskot</a>
              <a href="#preview" className="hover:text-pee-amber">Simulator</a>
              <a href="#lencana" className="hover:text-pee-amber">Lencana</a>
              <a href="#privasi" className="hover:text-pee-amber">Privasi</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-pee-amber">GitHub</a>
            </div>

            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#FFDD00] text-black font-black text-xs flex items-center gap-2 shadow hover:bg-[#ffe338] transition-transform hover:scale-105 active:scale-95"
            >
              <span>☕</span>
              <span>Buy Me a Coffee</span>
            </a>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 text-center text-[11px] text-peach-tint/50 space-y-2">
          <p>
            <strong>Disclaimer Medis:</strong> Poop Pee Log dirancang sebagai buku harian catatan pribadi mandiri. Aplikasi ini bukan perangkat medis dan tidak dimaksudkan untuk mendiagnosis, mengobati, atau mencegah penyakit apa pun. Konsultasikan dengan tenaga medis profesional jika Anda memiliki keluhan pencernaan atau saluran kemih.
          </p>
          <p className="flex items-center justify-center gap-1 text-peach-tint/60 pt-2">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-emergency fill-emergency" /> oleh Tim Poop Pee Log © 2026. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
};
