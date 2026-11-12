import React, { useMemo, useState } from 'react';
import { Search, UserCircle2, Ghost, Award, ListChecks } from 'lucide-react';
import { INITIAL_USERS, INITIAL_ACTIVITY_LOGS } from '../../data/mockAdminData';

const TYPE_STYLE: Record<string, string> = {
  PEE: 'bg-pee-amber/15 text-pee-amber border-pee-amber/40',
  POOP: 'bg-poop-brown/20 text-[#C98A58] border-poop-brown/50',
  COMBO: 'bg-both-teal/15 text-both-teal border-both-teal/40',
};

export const UsersTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState<'ALL' | 'CLOUD' | 'GUEST'>('ALL');

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INITIAL_USERS.filter((u) => {
      if (accountFilter === 'CLOUD' && u.isAnonymous) return false;
      if (accountFilter === 'GUEST' && !u.isAnonymous) return false;
      if (!q) return true;
      return u.displayName.toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    });
  }, [query, accountFilter]);

  return (
    <div className="space-y-6">
      {/* Users table */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-dark-border">
          <h3 className="font-black text-sm flex items-center gap-2">
            <UserCircle2 className="w-4 h-4 text-both-teal" /> Daftar Pengguna
            <span className="text-[10px] bg-dark-bg border border-dark-border px-2 py-0.5 rounded-full text-peach-tint/70">
              {users.length}
            </span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl px-3">
              <Search className="w-3.5 h-3.5 text-peach-tint/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama / email..."
                className="bg-transparent py-2 text-xs outline-none w-48 placeholder:text-peach-tint/30"
              />
            </div>
            <div className="flex bg-dark-bg border border-dark-border p-0.5 rounded-xl text-[11px] font-bold">
              {(['ALL', 'CLOUD', 'GUEST'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAccountFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    accountFilter === f ? 'bg-both-teal text-ink' : 'text-peach-tint/70 hover:text-cream-bg'
                  }`}
                >
                  {f === 'ALL' ? 'Semua' : f === 'CLOUD' ? 'Akun Cloud' : 'Tamu'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-dark-bg/60 text-peach-tint/60 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="text-left font-bold px-5 py-3">Pengguna</th>
                <th className="text-left font-bold px-5 py-3">Tipe</th>
                <th className="text-right font-bold px-5 py-3">Total Log</th>
                <th className="text-right font-bold px-5 py-3">Lencana</th>
                <th className="text-left font-bold px-5 py-3">Terakhir Aktif</th>
                <th className="text-left font-bold px-5 py-3">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-dark-border/60 hover:bg-dark-bg/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-bold text-cream-bg">{u.displayName}</div>
                    <div className="text-[11px] text-peach-tint/60">{u.email || '— tanpa email —'}</div>
                  </td>
                  <td className="px-5 py-3">
                    {u.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-dark-bg border border-dark-border text-peach-tint/70">
                        <Ghost className="w-3 h-3" /> Tamu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pee-amber/15 border border-pee-amber/40 text-pee-amber">
                        Cloud
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-black">{u.totalLogs}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-both-teal">
                      <Award className="w-3 h-3" /> {u.badgesCount}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-peach-tint/80">{u.lastActive}</td>
                  <td className="px-5 py-3 text-peach-tint/60">{u.joinedAt}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-peach-tint/50 font-semibold">
                    Tidak ada pengguna yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-5">
        <h3 className="font-black text-sm flex items-center gap-2 mb-4">
          <ListChecks className="w-4 h-4 text-pee-amber" /> Aktivitas Log Terbaru
        </h3>
        <div className="space-y-2.5">
          {INITIAL_ACTIVITY_LOGS.map((l) => (
            <div
              key={l.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-dark-bg/60 border border-dark-border rounded-xl px-4 py-3"
            >
              <span className={`self-start text-[10px] font-black px-2 py-0.5 rounded-md border ${TYPE_STYLE[l.type]}`}>
                {l.type}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">
                  {l.district}, {l.city} <span className="text-peach-tint/50 font-semibold">· {l.mood}</span>
                </div>
                <div className="text-[11px] text-peach-tint/60 truncate">
                  {l.userEmail}
                  {l.note ? ` — "${l.note}"` : ''}
                </div>
              </div>
              <span className="text-[11px] text-peach-tint/60 font-semibold whitespace-nowrap">{l.loggedAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

