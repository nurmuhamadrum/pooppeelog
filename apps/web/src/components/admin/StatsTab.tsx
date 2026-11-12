import React, { useCallback, useEffect, useState } from 'react';
import { Users, Activity, Droplet, Flame, MapPin, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchAdminOverview, OverviewResponse } from '../../services/adminApi';

const fmt = (n: number) => n.toLocaleString('id-ID');

const EMPTY_OVERVIEW: OverviewResponse = {
  totalUsers: 0,
  activeUsersToday: 0,
  totalLogs: 0,
  logsToday: 0,
  totalPee: 0,
  totalPoop: 0,
  totalCombo: 0,
  streakRecordDays: 0,
  citiesCovered: 0,
  cityDistribution: [],
  dailyStats: [],
};

export const StatsTab: React.FC = () => {
  const [data, setData] = useState<OverviewResponse>(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminOverview();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat statistik Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const typeTotal = Math.max(data.totalPee + data.totalPoop + data.totalCombo, 1);
  const ratio = [
    { label: 'Pee', value: data.totalPee, color: 'bg-pee-amber', text: 'text-pee-amber' },
    { label: 'Poop', value: data.totalPoop, color: 'bg-poop-brown', text: 'text-[#C98A58]' },
    { label: 'Combo', value: data.totalCombo, color: 'bg-both-teal', text: 'text-both-teal' },
  ];
  const maxDaily = Math.max(...data.dailyStats.map((d) => d.total), 1);

  const cards = [
    { label: 'Total Pengguna', value: fmt(data.totalUsers), sub: `${fmt(data.activeUsersToday)} aktif hari ini`, icon: Users, accent: 'text-both-teal bg-both-teal/15' },
    { label: 'Total Log', value: fmt(data.totalLogs), sub: `+${fmt(data.logsToday)} hari ini`, icon: Activity, accent: 'text-pee-amber bg-pee-amber/15' },
    { label: 'Kota Tercakup', value: fmt(data.citiesCovered), sub: 'kota / kabupaten', icon: MapPin, accent: 'text-drip-blue bg-drip-blue/15' },
    { label: 'Log Kombo (Sir Flush)', value: fmt(data.totalCombo), sub: `${((data.totalCombo / typeTotal) * 100).toFixed(1)}% dari total log`, icon: Flame, accent: 'text-emergency bg-emergency/15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-both-teal flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-both-teal animate-pulse" />
          Terhubung ke Data Real Supabase
        </span>
        <button
          onClick={load}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-peach-tint/80 hover:text-cream-bg flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Segarkan
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-emergency/15 border border-emergency/40 rounded-xl px-4 py-3 text-xs font-bold text-emergency">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

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
            <div className="text-3xl font-black mt-3 tracking-tight">{loading ? '...' : c.value}</div>
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
            {data.dailyStats.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-peach-tint/0 group-hover:text-peach-tint/80 transition-colors">
                  {d.total}
                </span>
                <div
                  className="w-full max-w-[44px] flex flex-col-reverse rounded-lg overflow-hidden bg-dark-bg/50"
                  style={{ height: `${Math.max((d.total / maxDaily) * 180, d.total > 0 ? 8 : 3)}px` }}
                >
                  {d.total > 0 && (
                    <>
                      <div className="bg-pee-amber" style={{ height: `${(d.pee / d.total) * 100}%` }} />
                      <div className="bg-poop-brown" style={{ height: `${(d.poop / d.total) * 100}%` }} />
                      <div className="bg-both-teal" style={{ height: `${(d.combo / d.total) * 100}%` }} />
                    </>
                  )}
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
          <div className="flex h-4 rounded-full overflow-hidden mb-5 bg-dark-bg">
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
        {data.cityDistribution.length === 0 ? (
          <p className="text-xs text-peach-tint/50 py-4 text-center">Belum ada data log kota.</p>
        ) : (
          <div className="space-y-3">
            {data.cityDistribution.map((c) => (
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
                    style={{ width: `${Math.min(c.percentage * 2.5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
