import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'Apakah aplikasi ini bisa mencari toilet umum terdekat?',
    a: 'Tidak. Poop Pee Log BUKAN aplikasi pencari toilet umum. Aplikasi ini adalah buku harian pribadi (personal diary & tracker) untuk mendokumentasikan tempat dan waktu di mana Anda sendiri buang air, layaknya aplikasi Strava untuk aktivitas biologis.',
  },
  {
    q: 'Apakah ada fitur untuk memberi rating kebersihan toilet?',
    a: 'Tidak ada. Kami tidak menyediakan rating kloset, review kebersihan, atau penilaian fasilitas publik. Semua catatan dan mood murni untuk evaluasi dan kesenangan pribadi Anda.',
  },
  {
    q: 'Apakah teman atau orang lain bisa melihat catatan saya?',
    a: 'Sama sekali tidak bisa. Poop Pee Log menganut prinsip Zero Social. Tidak ada feed pertemanan, tidak ada tautan publik, dan tidak ada leaderboard. Data Anda diisolasi menggunakan Row Level Security (RLS) dan kunci aplikasi PIN/Biometrik.',
  },
  {
    q: 'Apakah saya bisa mencatat log saat tidak ada sinyal internet?',
    a: 'Tentu saja! Poop Pee Log dibangun dengan arsitektur Offline-First. Anda bisa mencatat di toilet basement mall atau di puncak gunung tanpa sinyal. Data akan tersimpan di memori HP Anda dan disinkronkan otomatis saat terhubung ke internet.',
  },
  {
    q: 'Apakah saya wajib mendaftarkan email saat pertama kali pakai?',
    a: 'Tidak wajib. Anda bisa langsung menggunakan mode tamu (Anonymous Guest) dalam hitungan detik setelah instalasi. Anda baru diminta menghubungkan Google/Apple ID jika ingin mencadangkan data lintas perangkat.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 border-b border-dark-border">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Pertanyaan yang Sering Diajukan
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            FAQ Seputar Poop Pee Log
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-cream-bg hover:text-pee-amber transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-peach-tint/60 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-pee-amber' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-peach-tint/80 leading-relaxed border-t border-dark-border/40 pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
