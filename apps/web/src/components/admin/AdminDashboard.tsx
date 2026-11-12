import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Users, HelpCircle, Award, LogOut, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { SirFlushSVG } from '../MascotSVGs';
import { AdminLogin } from './AdminLogin';
import { StatsTab } from './StatsTab';
import { UsersTab } from './UsersTab';
import { FaqTab } from './FaqTab';
import { BadgesTab } from './BadgesTab';
import { checkCurrentAdminSession, signOutAdmin } from '../../services/adminApi';

type TabId = 'stats' | 'users' | 'faq' | 'badges';

const TABS: { id: TabId; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'stats', label: 'Statistik', icon: BarChart3, desc: 'Ringkasan aktivitas global aplikasi' },
  { id: 'users', label: 'Pengguna & Log', icon: Users, desc: 'Daftar pengguna dan aktivitas terbaru' },
  { id: 'faq', label: 'Konten FAQ', icon: HelpCircle, desc: 'Kelola pertanyaan di landing page' },
  { id: 'badges', label: 'Lencana', icon: Award, desc: 'Kelola master lencana pencapaian' },
];

export const AdminDashboard: React.FC = () => {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('stats');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = 'Admin · Poop Pee Log';
    checkCurrentAdminSession()
      .then((res) => {
        if (res.authenticated) {
          setAuthenticated(true);
          setAdminEmail(res.email ?? null);
        }
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const notify = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setAuthenticated(false);
    setAdminEmail(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-dark-bg text-cream-bg flex items-center justify-center gap-2 text-xs font-bold">
        <Loader2 className="w-4 h-4 animate-spin text-both-teal" /> Memeriksa sesi admin...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          setAuthenticated(true);
          checkCurrentAdminSession().then((res) => setAdminEmail(res.email ?? null));
        }}
      />
    );
  }

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-dark-bg text-cream-bg flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen bg-dark-surface border-b lg:border-b-0 lg:border-r border-dark-border flex lg:flex-col">
        <div className="hidden lg:flex items-center gap-3 px-5 h-20 border-b border-dark-border">
          <div className="w-10 h-10 rounded-xl bg-both-teal p-1.5 flex items-center justify-center">
            <SirFlushSVG />
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm">Poop Pee Log</div>
            <div className="text-[10px] font-bold text-both-teal uppercase tracking-wider truncate">
              {adminEmail || 'Admin Supabase'}
            </div>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1 p-2 lg:p-3 overflow-x-auto flex-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-pee-amber text-ink' : 'text-peach-tint/70 hover:bg-dark-bg hover:text-cream-bg'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block p-3 border-t border-dark-border space-y-1">
          <a href="/" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-peach-tint/70 hover:bg-dark-bg hover:text-cream-bg">
            <ExternalLink className="w-4 h-4" /> Lihat Landing Page
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emergency hover:bg-emergency/10"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="h-20 px-6 flex items-center justify-between border-b border-dark-border">
          <div>
            <h1 className="text-xl font-black tracking-tight">{active.label}</h1>
            <p className="text-[11px] text-peach-tint/60 font-semibold">{active.desc}</p>
          </div>
          <button
            onClick={handleLogout}
            className="lg:hidden p-2 rounded-xl text-emergency border border-dark-border"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <div className="p-6 space-y-5">
          {tab === 'stats' && <StatsTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'faq' && <FaqTab notify={notify} />}
          {tab === 'badges' && <BadgesTab notify={notify} />}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-dark-surface border border-both-teal rounded-xl px-4 py-3 shadow-2xl text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-both-teal" /> {toast}
        </div>
      )}
    </div>
  );
};
