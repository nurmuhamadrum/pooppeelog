import React from 'react';
import { EyeOff, UserX, Trash2, FileSpreadsheet } from 'lucide-react';
import { SirFlushSVG } from './MascotSVGs';

export const PrivacyManifesto: React.FC = () => {
  return (
    <section id="privasi" className="py-20 md:py-28 border-b border-dark-border bg-dark-bg/80">
      <div className="max-w-5xl mx-auto px-6">
        {/* Top Icon */}
        <div className="w-16 h-16 rounded-3xl bg-both-teal/20 border border-both-teal/40 p-2 mx-auto mb-6 shadow-xl flex items-center justify-center">
          <SirFlushSVG />
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-both-teal bg-both-teal/10 border border-both-teal/30 px-3 py-1 rounded-full">
            Prinsip Privasi Absolut
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight mt-3">
            Manifesto Privasi Poop Pee Log
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            Data buang air adalah salah satu rutinitas biologis paling personal dari setiap manusia. Kami tidak pernah memperlakukannya sebagai komoditas iklan atau konten oversharing.
          </p>
        </div>

        {/* 4 Privacy Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-both-teal/20 border border-both-teal/40 flex items-center justify-center text-both-teal flex-shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">Zero Social & Zero Oversharing</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">
                Tidak ada feed teman, tidak ada follower, dan tidak ada leaderboard publik. Buku harian ini murni untuk kepuasan dan evaluasi kesehatan diri Anda sendiri.
              </p>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-pee-amber/20 border border-pee-amber/40 flex items-center justify-center text-pee-amber flex-shrink-0">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">Kontrol Penuh Koordinat Lokasi</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">
                Data koordinat GPS Anda hanya disimpan di perangkat dan akun pribadi Anda yang terenkripsi. Tidak ada pelacak pihak ketiga atau iklan yang mengintai lokasi Anda.
              </p>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-poop-brown/20 border border-poop-brown/40 flex items-center justify-center text-poop-brown flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">Ekspor Bebas Kapan Saja</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">
                Data Anda adalah hak milik Anda. Unduh seluruh riwayat buang air Anda dalam format JSON atau CSV kapan pun Anda inginkan tanpa batasan.
              </p>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emergency/20 border border-emergency/40 flex items-center justify-center text-emergency flex-shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cream-bg">Hard Delete Permanen</h3>
              <p className="text-xs text-peach-tint/70 mt-1 leading-relaxed">
                Ingin menghapus jejak aib? Cukup sentuh tombol "Hapus Semua Data", dan seluruh catatan akan dimusnahkan secara permanen dari HP maupun cloud.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Quote Box */}
        <div className="bg-dark-surface border-2 border-both-teal/30 rounded-3xl p-8 text-center relative overflow-hidden">
          <p className="text-sm sm:text-base text-cream-bg font-semibold italic max-w-2xl mx-auto leading-relaxed">
            "Kami merancang Poop Pee Log agar Anda bisa tersenyum puas melihat jejak lega Anda tanpa perlu khawatir suatu hari data toilet Anda dijadikan target iklan pop-up."
          </p>
          <div className="mt-4 text-xs text-both-teal font-extrabold uppercase tracking-wider">
            — Tim Poop Pee Log
          </div>
        </div>
      </div>
    </section>
  );
};
