import React from 'react';
import { Zap, MapPin, Flame, Lock, Sparkles } from 'lucide-react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { useLanguage } from '../i18n/LanguageContext';

export const FeaturesSection: React.FC = () => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  return (
    <section id="fitur" className="py-20 md:py-28 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-both-teal mb-3">
            <Sparkles className="w-3.5 h-3.5" /> {isEn ? '4 Core Product Pillars' : '4 Pilar Utama Produk'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            {isEn ? 'Built Purely for Personal Satisfaction' : 'Dibuat Khusus untuk Kepuasan Diri'}
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            {isEn
              ? 'Not a public toilet finder or restroom review app. This is the fastest, most private personal biological journal in the world.'
              : 'Ini bukan aplikasi pencari toilet atau review kloset umum. Ini adalah catatan sejarah biologis personal paling sat-set dan privat di dunia.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-pee-amber/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-pee-amber/20 border border-pee-amber/40 flex items-center justify-center p-2.5 shadow-lg">
                <Zap className="w-8 h-8 text-pee-amber" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-pee-amber bg-pee-amber/10 border border-pee-amber/30 px-3 py-1 rounded-full">
                {isEn ? 'Pillar #1' : 'Prinsip #1'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              {isEn ? '3-Second / 2-Tap Quick Log' : '3-Detik / 2-Tap Sat-set'}
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              {isEn ? (
                <>
                  No lengthy forms while you're in the restroom. Tap <strong>+ LOG</strong>, choose <strong>Lil' Drip</strong> (Pee), <strong>Mr. Plop</strong> (Poop), or <strong>Sir Flush</strong> (Combo), and it saves locally in under 100ms.
                </>
              ) : (
                <>
                  Tanpa form panjang yang bikin pegal di toilet. Sentuh tombol <strong>+ LOG</strong>, pilih <strong>Lil' Drip</strong> (Pee), <strong>Mr. Plop</strong> (Poop), atau <strong>Sir Flush</strong> (Combo), dan data langsung tersimpan ke memori HP dalam waktu kurang dari 100 milidetik.
                </>
              )}
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pee-amber p-1 flex-shrink-0 shadow flex items-center justify-center border border-dark-bg">
                <LilDripSVG />
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">
                  {isEn ? 'Async Auto-Geotagging' : 'Auto-Geotagging Asinkron'}
                </span>
                <span className="text-peach-tint/60 text-[11px]">
                  {isEn
                    ? 'GPS, altitude (masl), & district name filled automatically in background.'
                    : 'GPS, elevasi mdpl & nama kecamatan terisi otomatis di background.'}
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-poop-brown/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-poop-brown/20 border border-poop-brown/40 flex items-center justify-center p-2.5 shadow-lg">
                <MapPin className="w-8 h-8 text-poop-brown" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-poop-brown bg-poop-brown/10 border border-poop-brown/30 px-3 py-1 rounded-full">
                {isEn ? 'Pillar #2' : 'Prinsip #2'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              {isEn ? 'Personal Activity Map & Clustering' : 'Peta Aib Pribadi & Clustering'}
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              {isEn
                ? 'Turn the world into your relief canvas. Amber pins for pee, brown for poop, and teal for combo. Includes smart pin clustering and customizable map themes.'
                : 'Jadikan dunia sebagai kanvas kenanganmu. Pin kuning untuk kencing, coklat untuk BAB, dan teal untuk kombo. Didukung clustering otomatis dan pilihan tema peta.'}
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-poop-brown p-1 flex-shrink-0 shadow flex items-center justify-center border border-dark-bg">
                <MrPlopSVG />
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">
                  {isEn ? 'Live GPS & Accurate Mapping' : 'Live GPS & Pemetaan Akurat'}
                </span>
                <span className="text-peach-tint/60 text-[11px]">
                  {isEn
                    ? 'Pins are saved accurately on your device with zero third-party tracking.'
                    : 'Pin tersimpan presisi di perangkat Anda tanpa pelacakan pihak ketiga.'}
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-both-teal/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-both-teal/20 border border-both-teal/40 flex items-center justify-center p-2.5 shadow-lg">
                <Flame className="w-8 h-8 text-both-teal" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-both-teal bg-both-teal/10 border border-both-teal/30 px-3 py-1 rounded-full">
                {isEn ? 'Pillar #3' : 'Prinsip #3'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              {isEn ? 'Fire Streaks & Collectible Badges' : 'Streak Api & Koleksi Lencana'}
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              {isEn ? (
                <>
                  Maintaining daily biological habits feels like a game. Keep your daily streak burning, track your ratios, and unlock quirky badges like <em>"City Explorer"</em> and <em>"Peak Relief"</em>.
                </>
              ) : (
                <>
                  Menjaga rutinitas biologis kini terasa seperti bermain game. Nyalakan api streak harian, pantau rasio buang air, dan kumpulkan lencana humoris seperti <em>"Penjelajah Kota"</em> dan <em>"Puncak Lega"</em>.
                </>
              )}
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-both-teal p-1 flex-shrink-0 shadow flex items-center justify-center border border-dark-bg">
                <SirFlushSVG />
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">
                  {isEn ? 'Automatic Evaluation' : 'Evaluasi Otomatis'}
                </span>
                <span className="text-peach-tint/60 text-[11px]">
                  {isEn
                    ? 'Celebration modal pops up instantly when you unlock a new badge.'
                    : 'Sistem langsung merayakan dengan popup selebrasi saat lencana terbuka.'}
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-emergency/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emergency/20 border border-emergency/40 flex items-center justify-center p-2.5 shadow-lg">
                <Lock className="w-8 h-8 text-emergency" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emergency bg-emergency/10 border border-emergency/30 px-3 py-1 rounded-full">
                {isEn ? 'Pillar #4' : 'Prinsip #4'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              {isEn ? 'Total Privacy & Offline-First' : 'Privasi Total & Offline-First'}
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              {isEn
                ? 'Protect the app with Face ID / Fingerprint biometric lock. Zero friend feeds, zero social sharing, and your logs are safely stored in local SQLite even without signal.'
                : 'Kunci aplikasi dengan FaceID/Fingerprint. Tidak ada teman yang bisa mengintip, tidak ada feed media sosial, dan data tersimpan aman di database lokal HP Anda saat tanpa sinyal.'}
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emergency/20 border border-emergency flex items-center justify-center text-emergency font-bold text-sm">
                BIO
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">
                  {isEn ? 'App Lock & Hard Delete' : 'App Lock & Hard Delete'}
                </span>
                <span className="text-peach-tint/60 text-[11px]">
                  {isEn
                    ? 'Freely export JSON backups or wipe all local data permanently in 1 tap.'
                    : 'Bebas ekspor JSON atau hapus semua data permanen dalam 1 tap.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
