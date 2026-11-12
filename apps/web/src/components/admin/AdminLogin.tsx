import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { SirFlushSVG } from '../MascotSVGs';

/**
 * Gerbang login admin SEMENTARA (sisi klien).
 * PERINGATAN: passcode ini ikut ter-bundle ke JavaScript dan BUKAN keamanan sungguhan.
 * Untuk produksi, ganti dengan Supabase Auth + kolom `role = 'admin'` di tabel profiles
 * dan RLS / Edge Function yang memverifikasi role tersebut di server.
 */
const ADMIN_PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined) || 'lega-admin';
const SESSION_KEY = 'ppl_admin_session';

export const isAdminSessionActive = () => sessionStorage.getItem(SESSION_KEY) === '1';
export const clearAdminSession = () => sessionStorage.removeItem(SESSION_KEY);

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setError(null);
      onSuccess();
    } else {
      setError('Passcode salah. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-cream-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-dark-surface border border-dark-border rounded-3xl p-8 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-both-teal p-2 mx-auto mb-5 shadow-lg flex items-center justify-center">
          <SirFlushSVG />
        </div>
        <h1 className="text-2xl font-black text-center tracking-tight">Admin Console</h1>
        <p className="text-xs text-peach-tint/70 text-center mt-1 mb-6">
          Poop Pee Log · Manajemen Konten & Statistik
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[11px] font-bold text-peach-tint/80 uppercase tracking-wider">Passcode Admin</span>
            <div className="mt-1.5 flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl px-3 focus-within:border-both-teal transition-colors">
              <Lock className="w-4 h-4 text-peach-tint/50" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-peach-tint/30"
                placeholder="••••••••"
                autoFocus
              />
            </div>
          </label>

          {error && <p className="text-xs font-bold text-emergency">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-both-teal text-ink font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> Masuk Dashboard
          </button>
        </form>

        <a
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs font-bold text-peach-tint/60 hover:text-pee-amber"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Landing Page
        </a>
      </div>
    </div>
  );
};
