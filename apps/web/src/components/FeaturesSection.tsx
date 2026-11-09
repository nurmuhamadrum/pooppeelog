import React from 'react';
import { Zap, MapPin, Flame, Lock, Sparkles } from 'lucide-react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="fitur" className="py-20 md:py-28 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-both-teal mb-3">
            <Sparkles className="w-3.5 h-3.5" /> 4 Pilar Utama Produk
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            Dibuat Khusus untuk Kepuasan Diri
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            Ini bukan aplikasi pencari toilet atau review kloset umum. Ini adalah catatan sejarah biologis personal paling sat-set dan privat di dunia.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: 3-Detik Sat-set */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-pee-amber/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-pee-amber/20 border border-pee-amber/40 flex items-center justify-center p-2.5 shadow-lg">
                <Zap className="w-8 h-8 text-pee-amber" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-pee-amber bg-pee-amber/10 border border-pee-amber/30 px-3 py-1 rounded-full">
                Prinsip #1
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              3-Detik / 2-Tap Sat-set
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              Tanpa form panjang yang bikin pegal di toilet. Sentuh tombol <strong>+ LOG</strong>, pilih <strong>Lil' Drip</strong> (Pee) atau <strong>Mr. Plop</strong> (Poop), dan data langsung tersimpan ke memori HP dalam waktu kurang dari 100 milidetik.
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pee-amber p-1 flex-shrink-0 shadow">
                <LilDripSVG />
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">Auto-Geotagging Asinkron</span>
                <span className="text-peach-tint/60 text-[11px]">GPS, elevasi mdpl & nama kecamatan terisi otomatis di background.</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Peta Aib Pribadi */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-poop-brown/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-poop-brown/20 border border-poop-brown/40 flex items-center justify-center p-2.5 shadow-lg">
                <MapPin className="w-8 h-8 text-poop-brown" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-poop-brown bg-poop-brown/10 border border-poop-brown/30 px-3 py-1 rounded-full">
                Prinsip #2
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              Peta Aib Pribadi & Clustering
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              Jadikan dunia sebagai kanvas kenanganmu. Pin kuning untuk kencing dan pin coklat untuk buang air besar. Didukung clustering otomatis saat pin rapat dan fitur pengaburan lokasi 50m.
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-poop-brown p-1 flex-shrink-0 shadow">
                <MrPlopSVG />
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">Blur Lokasi 50 Meter</span>
                <span className="text-peach-tint/60 text-[11px]">Privasi terjaga: koordinat pin digeser acak saat dilihat orang lain.</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Streak & Gamifikasi */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-both-teal/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-both-teal/20 border border-both-teal/40 flex items-center justify-center p-2.5 shadow-lg">
                <Flame className="w-8 h-8 text-both-teal" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-both-teal bg-both-teal/10 border border-both-teal/30 px-3 py-1 rounded-full">
                Prinsip #3
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              Streak Api & Koleksi Lencana
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              Menjaga rutinitas biologis kini terasa seperti bermain game. Nyalakan api streak harian, pantau rasio buang air, dan kumpulkan lencana humoris seperti <em>"Penjelajah Kota"</em> dan <em>"Puncak Lega"</em>.
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-both-teal p-1 flex-shrink-0 shadow">
                <SirFlushSVG />
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">Evaluasi Otomatis</span>
                <span className="text-peach-tint/60 text-[11px]">Sistem langsung merayakan dengan confetti saat lencana terbuka.</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Privasi Mutlak 100% */}
          <div className="bg-dark-surface border border-dark-border p-8 rounded-3xl relative overflow-hidden group hover:border-emergency/60 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emergency/20 border border-emergency/40 flex items-center justify-center p-2.5 shadow-lg">
                <Lock className="w-8 h-8 text-emergency" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emergency bg-emergency/10 border border-emergency/30 px-3 py-1 rounded-full">
                Prinsip #4
              </span>
            </div>

            <h3 className="text-2xl font-black text-cream-bg mb-3">
              Privasi Total & Offline-First
            </h3>
            <p className="text-peach-tint/80 text-sm leading-relaxed mb-6">
              Kunci aplikasi dengan 4-digit PIN dan FaceID/Fingerprint. Tidak ada teman yang bisa mengintip, tidak ada feed media sosial, dan data tersimpan aman di database lokal HP Anda saat tanpa sinyal.
            </p>

            <div className="bg-dark-bg/80 border border-dark-border p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emergency/20 border border-emergency flex items-center justify-center text-emergency font-bold text-sm">
                PIN
              </div>
              <div className="text-xs">
                <span className="font-bold text-cream-bg block">App Lock & Hard Delete</span>
                <span className="text-peach-tint/60 text-[11px]">Bebas ekspor JSON/CSV atau hapus semua data permanen dalam 1 tap.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
