import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { SirFlushSVG } from '../MascotSVGs';
import { isSupabaseConfigured } from '../../lib/supabase';
import { signInAdminWithEmail } from '../../services/adminApi';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Supabase belum dikonfigurasi pada apps/web/.env');
      return;
    }

    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    const res = await signInAdminWithEmail(email.trim(), password);
    setLoading(false);

    if (res.ok) {
      onSuccess();
    } else {
      setError(res.error || 'Gagal login.');
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
          Poop Pee Log · Supabase Admin Auth
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[11px] font-bold text-peach-tint/80 uppercase tracking-wider">Email Admin</span>
            <div className="mt-1.5 flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl px-3 focus-within:border-both-teal transition-colors">
              <Mail className="w-4 h-4 text-peach-tint/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-peach-tint/30"
                placeholder="admin@email.com"
                autoFocus
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] font-bold text-peach-tint/80 uppercase tracking-wider">Password</span>
            <div className="mt-1.5 flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl px-3 focus-within:border-both-teal transition-colors">
              <Lock className="w-4 h-4 text-peach-tint/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-peach-tint/30"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && <p className="text-xs font-bold text-emergency leading-relaxed">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-both-teal text-ink font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
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
