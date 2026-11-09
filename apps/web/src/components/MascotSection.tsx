import React, { useState } from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Sparkles, MessageCircle, Volume2 } from 'lucide-react';

export const MascotSection: React.FC = () => {
  // Fun interactive states when user clicks on a mascot
  const [activeSpeech, setActiveSpeech] = useState<{
    plop: string;
    drip: string;
    flush: string;
  }>({
    plop: 'Plong adalah koentji kehidupan! ✨',
    drip: 'Seger! Jangan nahan kencing ya~ 💧',
    flush: 'Wuuusshhh! Privasimu aman terkunci! 🛡️',
  });

  const [tappedMascot, setTappedMascot] = useState<'plop' | 'drip' | 'flush' | null>(null);

  const handleTap = (mascot: 'plop' | 'drip' | 'flush') => {
    setTappedMascot(mascot);
    setTimeout(() => setTappedMascot(null), 1200);

    const plopQuotes = [
      'Plong! Perut auto enteng hari ini! 🍫',
      'Bristol Skala Tipe 4: Sempurna tanpa celah! ✨',
      'Jangan buru-buru, nikmati momen hening di toilet 🧘',
      'Fakta unik: 3 detik log menyelamatkan memori pencernaanmu!',
    ];
    const dripQuotes = [
      'Gluk gluk... Jangan lupa 2 liter air hari ini! 💦',
      'Warna kuning jernih = Hidrasi juara! 🏆',
      'Kencing 1-tap, tercatat kilat sebelum sempat mikir ⚡',
      'Ahhh legaaa banget rasanya! 🌊',
    ];
    const flushQuotes = [
      'Wuuusshhh! Semua data langsung dienkripsi lokal! 🔒',
      'Kloset idaman: Bersih, wangi, anti-bocor data! 🚽',
      'Siraman kombo terdeteksi! Keduanya selesai tuntas! 🎉',
      'Tenang, tidak ada cloud yang mengintip catatanmu 🛡️',
    ];

    if (mascot === 'plop') {
      const random = plopQuotes[Math.floor(Math.random() * plopQuotes.length)];
      setActiveSpeech((prev) => ({ ...prev, plop: random }));
    } else if (mascot === 'drip') {
      const random = dripQuotes[Math.floor(Math.random() * dripQuotes.length)];
      setActiveSpeech((prev) => ({ ...prev, drip: random }));
    } else {
      const random = flushQuotes[Math.floor(Math.random() * flushQuotes.length)];
      setActiveSpeech((prev) => ({ ...prev, flush: random }));
    }
  };

  return (
    <section id="maskot" className="py-20 md:py-28 border-b border-dark-border bg-dark-bg/60 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-pee-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-both-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Kenalan dengan Trio Maskot Resmi
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            Sahabat Setia di Setiap Toilet
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            Menghilangkan rasa canggung dalam mencatat aktivitas biologis harianmu.{' '}
            <span className="text-pee-amber font-semibold">Klik atau tap maskot</span> untuk berinteraksi dan mendengarkan celoteh lucunya!
          </p>
        </div>

        {/* 3 Mascots Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Mr. Plop */}
          <div
            onClick={() => handleTap('plop')}
            className={`group bg-dark-surface/90 border rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              tappedMascot === 'plop'
                ? 'border-[#C98A58] ring-4 ring-[#C98A58]/20 scale-[1.02] shadow-2xl shadow-[#C98A58]/30'
                : 'border-dark-border hover:border-[#C98A58] hover:shadow-2xl hover:shadow-[#C98A58]/20'
            }`}
          >
            {/* Click me hint badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-peach-tint/60 bg-dark-bg/80 border border-dark-border px-2.5 py-1 rounded-full group-hover:text-pee-amber transition-colors">
              <Volume2 className="w-3 h-3" />
              <span>Tap me!</span>
            </div>

            <div>
              {/* Mascot Bubble / Avatar Container - using lighter caramel warm gradient background so Mr Plop pops out with high contrast */}
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#5C3217] via-[#3E210F] to-[#241208] p-3 mx-auto mb-4 shadow-xl border-2 border-[#C98A58]/40 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative flex items-center justify-center">
                <div className={`w-full h-full ${tappedMascot === 'plop' ? 'mascot-bounce-wiggle' : 'mascot-float'}`}>
                  <MrPlopSVG />
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="min-h-[58px] mb-4 bg-dark-bg/90 border border-[#C98A58]/30 rounded-2xl p-3 flex items-center gap-2.5 shadow-inner">
                <MessageCircle className="w-4 h-4 text-[#C98A58] flex-shrink-0" />
                <p className="text-xs font-bold text-cream-bg leading-snug">
                  "{activeSpeech.plop}"
                </p>
              </div>

              <div className="text-center">
                <span className="text-xs font-black uppercase text-[#FDE0C7] bg-[#7A4824]/50 border border-[#C98A58]/60 px-3.5 py-1 rounded-full inline-block shadow-sm">
                  Poop Mascot
                </span>
                <h3 className="text-2xl font-black text-cream-bg mt-3 flex items-center justify-center gap-2">
                  Mr. Plop
                  <span className="text-base group-hover:scale-125 transition-transform">🍫</span>
                </h3>
                <p className="text-xs text-[#E8A572] font-semibold mt-1">"Plong adalah koentji kehidupan!"</p>
              </div>

              <p className="text-xs sm:text-sm text-peach-tint/80 mt-4 leading-relaxed text-center">
                Swirl karamel ramah dengan gradien hangat berlapis kilau manis, mata bundar berbinar, dan pipi merona bahagia. Selalu setia menemani momen BAB agar terekam rapi tanpa rasa tabu.
              </p>
            </div>
          </div>

          {/* 2. Lil' Drip */}
          <div
            onClick={() => handleTap('drip')}
            className={`group bg-dark-surface/90 border rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              tappedMascot === 'drip'
                ? 'border-drip-blue ring-4 ring-drip-blue/20 scale-[1.02] shadow-2xl shadow-drip-blue/30'
                : 'border-dark-border hover:border-drip-blue hover:shadow-2xl hover:shadow-drip-blue/20'
            }`}
          >
            {/* Click me hint badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-peach-tint/60 bg-dark-bg/80 border border-dark-border px-2.5 py-1 rounded-full group-hover:text-pee-amber transition-colors">
              <Volume2 className="w-3 h-3" />
              <span>Tap me!</span>
            </div>

            <div>
              {/* Mascot Bubble Container */}
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#0B4B75] via-[#08304B] to-[#041A29] p-3 mx-auto mb-4 shadow-xl border-2 border-drip-blue/40 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative flex items-center justify-center">
                <div className={`w-full h-full ${tappedMascot === 'drip' ? 'mascot-bounce-wiggle' : 'mascot-float'}`}>
                  <LilDripSVG />
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="min-h-[58px] mb-4 bg-dark-bg/90 border border-drip-blue/30 rounded-2xl p-3 flex items-center gap-2.5 shadow-inner">
                <MessageCircle className="w-4 h-4 text-drip-blue flex-shrink-0" />
                <p className="text-xs font-bold text-cream-bg leading-snug">
                  "{activeSpeech.drip}"
                </p>
              </div>

              <div className="text-center">
                <span className="text-xs font-black uppercase text-[#E0F2FE] bg-drip-blue/30 border border-drip-blue/60 px-3.5 py-1 rounded-full inline-block shadow-sm">
                  Pee Mascot
                </span>
                <h3 className="text-2xl font-black text-cream-bg mt-3 flex items-center justify-center gap-2">
                  Lil' Drip
                  <span className="text-base group-hover:scale-125 transition-transform">💧</span>
                </h3>
                <p className="text-xs text-drip-blue font-semibold mt-1">"Jangan nahan lama-lama, lega itu sehat!"</p>
              </div>

              <p className="text-xs sm:text-sm text-peach-tint/80 mt-4 leading-relaxed text-center">
                Tetesan air biru ceria dengan senyum kucing kawaii dan cipratan gelembung segar. Selalu mengingatkan target hidrasi harianmu dan mencatat kencing hanya dalam 1 tap kilat.
              </p>
            </div>
          </div>

          {/* 3. Sir Flush */}
          <div
            onClick={() => handleTap('flush')}
            className={`group bg-dark-surface/90 border rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
              tappedMascot === 'flush'
                ? 'border-both-teal ring-4 ring-both-teal/20 scale-[1.02] shadow-2xl shadow-both-teal/30'
                : 'border-dark-border hover:border-both-teal hover:shadow-2xl hover:shadow-both-teal/20'
            }`}
          >
            {/* Click me hint badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-peach-tint/60 bg-dark-bg/80 border border-dark-border px-2.5 py-1 rounded-full group-hover:text-pee-amber transition-colors">
              <Volume2 className="w-3 h-3" />
              <span>Tap me!</span>
            </div>

            <div>
              {/* Mascot Bubble Container */}
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#134E4A] via-[#0F3936] to-[#082220] p-3 mx-auto mb-4 shadow-xl border-2 border-both-teal/40 transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 relative flex items-center justify-center">
                <div className={`w-full h-full ${tappedMascot === 'flush' ? 'mascot-bounce-wiggle' : 'mascot-float'}`}>
                  <SirFlushSVG />
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="min-h-[58px] mb-4 bg-dark-bg/90 border border-both-teal/30 rounded-2xl p-3 flex items-center gap-2.5 shadow-inner">
                <MessageCircle className="w-4 h-4 text-both-teal flex-shrink-0" />
                <p className="text-xs font-bold text-cream-bg leading-snug">
                  "{activeSpeech.flush}"
                </p>
              </div>

              <div className="text-center">
                <span className="text-xs font-black uppercase text-both-teal bg-both-teal/20 border border-both-teal/50 px-3.5 py-1 rounded-full inline-block shadow-sm">
                  Combo & Guard Mascot
                </span>
                <h3 className="text-2xl font-black text-cream-bg mt-3 flex items-center justify-center gap-2">
                  Sir Flush
                  <span className="text-base group-hover:scale-125 transition-transform">🚽</span>
                </h3>
                <p className="text-xs text-both-teal font-semibold mt-1">"Satu siraman untuk privasi mutlak."</p>
              </div>

              <p className="text-xs sm:text-sm text-peach-tint/80 mt-4 leading-relaxed text-center">
                Kloset keramik bersinar dengan tuas emas dan pusaran air pirus segar. Mengayomi Mr. Plop dan Lil' Drip saat terjadi sesi kombo, sekaligus pelindung fitur privasi biometrik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
