import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Search,
  Trash2,
  Lightbulb,
  Bug,
  Heart,
  MessageCircle,
  Globe,
  Smartphone,
  Star,
  Calendar,
  Mail,
  User,
} from 'lucide-react';
import { AdminFeedbackItem, FeedbackCategory, FeedbackPlatform } from '../../types/admin';
import { deleteFeedbackFromSupabase, fetchAdminFeedbacks } from '../../services/adminApi';

const CATEGORY_CONFIG: Record<FeedbackCategory, { label: string; icon: React.ElementType; color: string }> = {
  SUGGESTION: { label: 'Saran Fitur', icon: Lightbulb, color: 'text-pee-amber bg-pee-amber/10 border-pee-amber/30' },
  BUG: { label: 'Lapor Bug', icon: Bug, color: 'text-emergency-red bg-emergency-red/10 border-emergency-red/30' },
  PRAISE: { label: 'Apresiasi', icon: Heart, color: 'text-pink-400 bg-pink-400/10 border-pink-400/30' },
  OTHER: { label: 'Lainnya', icon: MessageCircle, color: 'text-both-teal bg-both-teal/10 border-both-teal/30' },
};

export const FeedbackTab: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | FeedbackCategory>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | FeedbackPlatform>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminFeedbacks();
      setFeedbacks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat feedback dari Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus masukan/feedback ini secara permanen?')) return;
    setDeletingId(id);
    try {
      await deleteFeedbackFromSupabase(id);
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal menghapus feedback.');
    } finally {
      setDeletingId(null);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = feedbacks.length;
    const suggestions = feedbacks.filter((f) => f.category === 'SUGGESTION').length;
    const bugs = feedbacks.filter((f) => f.category === 'BUG').length;
    const praises = feedbacks.filter((f) => f.category === 'PRAISE').length;
    const ratings = feedbacks.filter((f) => f.rating).map((f) => f.rating as number);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '-';

    return { total, suggestions, bugs, praises, avgRating };
  }, [feedbacks]);

  // Filtered list
  const filteredFeedbacks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feedbacks.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (platformFilter !== 'ALL' && item.platform !== platformFilter) return false;
      if (!q) return true;
      return (
        item.message.toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q)
      );
    });
  }, [feedbacks, query, categoryFilter, platformFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-both-teal flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-both-teal animate-pulse" />
            Kritik & Saran Pengguna Realtime
          </span>
          <p className="text-xs text-cream-bg/60 mt-0.5">
            Daftar feedback dari pengunjung Landing Page dan pengguna Mobile App.
          </p>
        </div>
        <button
          onClick={loadFeedbacks}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-peach-tint/80 hover:text-cream-bg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Segarkan
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-emergency/15 border border-emergency/40 rounded-xl px-4 py-3 text-xs font-bold text-emergency">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border">
          <div className="text-[11px] font-bold text-cream-bg/60 uppercase">Total Masukan</div>
          <div className="text-2xl font-black text-cream-bg mt-1">{metrics.total}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border">
          <div className="text-[11px] font-bold text-pee-amber uppercase flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> Saran Fitur
          </div>
          <div className="text-2xl font-black text-pee-amber mt-1">{metrics.suggestions}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border">
          <div className="text-[11px] font-bold text-emergency-red uppercase flex items-center gap-1">
            <Bug className="w-3.5 h-3.5" /> Lapor Bug
          </div>
          <div className="text-2xl font-black text-emergency-red mt-1">{metrics.bugs}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border">
          <div className="text-[11px] font-bold text-pink-400 uppercase flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> Apresiasi
          </div>
          <div className="text-2xl font-black text-pink-400 mt-1">{metrics.praises}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-both-teal uppercase flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-both-teal" /> Rata-rata Skor
          </div>
          <div className="text-2xl font-black text-both-teal mt-1">
            {metrics.avgRating} <span className="text-xs text-cream-bg/40 font-normal">/ 5</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cream-bg/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pesan atau email pengirim..."
            className="w-full bg-dark-surface border border-dark-border focus:border-both-teal rounded-xl pl-10 pr-4 py-2 text-xs text-cream-bg placeholder-cream-bg/40 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 bg-dark-surface border border-dark-border rounded-xl p-1 text-xs">
          {(['ALL', 'SUGGESTION', 'BUG', 'PRAISE', 'OTHER'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                categoryFilter === cat
                  ? 'bg-both-teal text-ink shadow-sm'
                  : 'text-cream-bg/60 hover:text-cream-bg'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat === 'SUGGESTION' ? 'Saran' : cat === 'BUG' ? 'Bug' : cat === 'PRAISE' ? 'Praise' : 'Lainnya'}
            </button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1 bg-dark-surface border border-dark-border rounded-xl p-1 text-xs">
          {(['ALL', 'WEB', 'MOBILE'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                platformFilter === p
                  ? 'bg-pee-amber text-ink shadow-sm'
                  : 'text-cream-bg/60 hover:text-cream-bg'
              }`}
            >
              {p === 'ALL' ? 'Semua Platform' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Feedbacks List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-cream-bg/50 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-both-teal" /> Memuat data masukan...
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-12 text-center bg-dark-surface/50 border border-dark-border rounded-2xl space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-dark-surface mx-auto flex items-center justify-center text-cream-bg/40">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-cream-bg">Belum ada kritik & saran</div>
          <div className="text-xs text-cream-bg/50 max-w-sm mx-auto">
            Masukan yang dikirim melalui formulir landing page atau aplikasi mobile akan muncul di sini secara otomatis.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map((item) => {
            const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
            const CatIcon = catConfig.icon;
            const dateStr = new Date(item.createdAt).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div
                key={item.id}
                className="bg-dark-surface border border-dark-border hover:border-dark-border/80 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-border/50 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Pill */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${catConfig.color}`}
                    >
                      <CatIcon className="w-3 h-3" />
                      {catConfig.label}
                    </span>

                    {/* Platform Pill */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-bg border border-dark-border text-cream-bg/70">
                      {item.platform === 'MOBILE' ? (
                        <>
                          <Smartphone className="w-3 h-3 text-both-teal" /> Mobile App
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-pee-amber" /> Web Landing
                        </>
                      )}
                    </span>

                    {/* Rating */}
                    {item.rating && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-pee-amber font-bold ml-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-pee-amber" />
                        ))}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-cream-bg/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1 text-cream-bg/40 hover:text-emergency-red transition-colors rounded-lg hover:bg-emergency-red/10"
                      title="Hapus masukan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-sm text-cream-bg leading-relaxed font-medium whitespace-pre-wrap">
                  {item.message}
                </p>

                {/* Sender Email or User */}
                <div className="flex items-center gap-4 text-xs text-cream-bg/60 pt-1">
                  {item.email ? (
                    <span className="inline-flex items-center gap-1.5 text-both-teal font-medium">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${item.email}`} className="hover:underline">
                        {item.email}
                      </a>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-cream-bg/40">
                      <User className="w-3.5 h-3.5" />
                      Pengguna Anonim / Tamu
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
