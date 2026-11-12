import React from 'react';
import { Users, Activity, Droplet, Flame, MapPin, TrendingUp } from 'lucide-react';
import { INITIAL_ADMIN_STATS, INITIAL_CITY_DISTRIBUTION, INITIAL_DAILY_STATS } from '../../data/mockAdminData';

const fmt = (n: number) => n.toLocaleString('id-ID');

export const StatsTab: React.FC = () => {
  const s = INITIAL_ADMIN_STATS;
  const typeTotal = s.totalPee + s.totalPoop + s.totalCombo;
  const ratio = [
    { label: 'Pee', value: s.totalPee, color: 'bg-pee-amber', text: 'text-pee-amber' },
    { label: 'Poop', value: s.totalPoop, color: 'bg-poop-brown', text: 'text-[#C98A58]' },
    { label: 'Combo', value: s.totalCombo, color: 'bg-both-teal', text: 'text-both-teal' },
  ];
  const maxDaily = Math.max(...INITIAL_DAILY_STATS.map((d) => d.total));

  const cards = [
    { label: 'Total Pengguna', value: fmt(s.totalUsers), sub: `${fmt(s.activeUsersToday)} aktif hari ini`, icon: Users, accent: 'text-both-teal bg-both-teal/15' },
    { label: 'Total Log', value: fmt(s.totalLogs), sub: `+${fmt(s.logsToday)} hari ini`, icon: Activity, accent: 'text-pee-amber bg-pee-amber/15' },
    { label: 'Kota Tercakup', value: fmt(s.citiesCovered), sub: 'kota / kabupaten', icon: MapPin, accent: 'text-drip-blue bg-drip-blue/15' },
    { label: 'Rekor Streak', value: `${s.streakRecordDays} hari`, sub: 'streak terpanjang', icon: Flame, accent: 'text-emergency bg-emergency/15' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-dark-surface border border-dark-border rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-peach-tint/70">{c.label}</span>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.accent}`}>
                <c.icon className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black mt-3 tracking-tight">{c.value}</div>
            <div className="text-[11px] text-peach-tint/60 mt-1 font-semibold">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily stacked bar chart */}
        <div className="lg:col-span-2 bg-dark-surface border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-both-teal" /> Log Harian (7 Hari Terakhir)
            </h3>
            <div className="flex gap-3 text-[10px] font-bold">
              {ratio.map((r) => (
                <span key={r.label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${r.color}`} /> {r.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-56 flex items-end gap-3">
            {INITIAL_DAILY_STATS.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-peach-tint/0 group-hover:text-peach-tint/80 transition-colors">
                  {d.total}
                </span>
                <div
                  className="w-full max-w-[44px] flex flex-col-reverse rounded-lg overflow-hidden"
                  style={{ height: `${(d.total / maxDaily) * 180}px` }}
                >
                  <div className="bg-pee-amber" style={{ height: `${(d.pee / d.total) * 100}%` }} />
                  <div className="bg-poop-brown" style={{ height: `${(d.poop / d.total) * 100}%` }} />
                  <div className="bg-both-teal" style={{ height: `${(d.combo / d.total) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-peach-tint/60">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type ratio */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-5">
          <h3 className="font-black text-sm flex items-center gap-2 mb-5">
            <Droplet className="w-4 h-4 text-pee-amber" /> Rasio Jenis Log
          </h3>
          <div className="flex h-4 rounded-full overflow-hidden mb-5">
            {ratio.map((r) => (
              <div key={r.label} className={r.color} style={{ width: `${(r.value / typeTotal) * 100}%` }} />
            ))}
          </div>
          <div className="space-y-3">
            {ratio.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-bold">
                  <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} /> {r.label}
                </span>
                <span className="text-peach-tint/80 font-semibold">
                  {fmt(r.value)}{' '}
                  <span className={`font-black ${r.text}`}>({((r.value / typeTotal) * 100).toFixed(1)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City distribution */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-5">
        <h3 className="font-black text-sm flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-drip-blue" /> Distribusi Kota Teratas
        </h3>
        <div className="space-y-3">
          {INITIAL_CITY_DISTRIBUTION.map((c) => (
            <div key={c.city}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{c.city}</span>
                <span className="text-peach-tint/70">
                  {fmt(c.count)} log · {c.percentage}%
                </span>
              </div>
              <div className="h-2.5 bg-dark-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-drip-blue to-both-teal rounded-full"
                  style={{ width: `${c.percentage * 3}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

