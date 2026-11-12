import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Award, Loader2 } from 'lucide-react';
import { EditableBadge } from '../../types/admin';
import { saveBadges } from '../../data/contentStore';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from '../MascotSVGs';
import {
  deleteBadgeFromSupabase,
  fetchBadgesFromSupabase,
  upsertBadgeToSupabase,
} from '../../services/adminApi';

interface BadgesTabProps {
  notify: (msg: string) => void;
}

const MASCOTS: { value: EditableBadge['mascot']; label: string; bg: string }[] = [
  { value: 'LIL_DRIP', label: "Lil' Drip", bg: 'bg-pee-amber' },
  { value: 'MR_PLOP', label: 'Mr. Plop', bg: 'bg-poop-brown' },
  { value: 'SIR_FLUSH', label: 'Sir Flush', bg: 'bg-both-teal' },
];
const CATEGORIES: EditableBadge['category'][] = ['MILESTONE', 'EXPLORATION', 'STREAK', 'ELEVATION'];
const ICONS = ['award', 'compass', 'flame', 'map-pin', 'mountain'];

const mascotSvg = (m: EditableBadge['mascot']) =>
  m === 'MR_PLOP' ? <MrPlopSVG /> : m === 'SIR_FLUSH' ? <SirFlushSVG /> : <LilDripSVG />;
const mascotBg = (m: EditableBadge['mascot']) => MASCOTS.find((x) => x.value === m)?.bg || 'bg-pee-amber';

const blankBadge = (): EditableBadge => ({
  id: `badge_${Date.now()}`,
  code: '',
  title: '',
  description: '',
  iconName: 'award',
  mascot: 'LIL_DRIP',
  category: 'MILESTONE',
  requirementText: '',
});

const inputCls =
  'w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-xs outline-none focus:border-both-teal';

export const BadgesTab: React.FC<BadgesTabProps> = ({ notify }) => {
  const [badges, setBadges] = useState<EditableBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<EditableBadge | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBadgesFromSupabase()
      .then((remote) => {
        setBadges(remote);
        saveBadges(remote);
      })
      .catch((e) => notify(`Gagal memuat Lencana Supabase: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.code.trim() || !draft.description.trim()) {
      notify('Kode, judul, dan deskripsi wajib diisi.');
      return;
    }
    const code = draft.code.trim().toUpperCase().replace(/\s+/g, '_');
    if (badges.some((b) => b.code === code && b.id !== draft.id)) {
      notify(`Kode "${code}" sudah dipakai lencana lain.`);
      return;
    }
    const clean = { ...draft, code };

    setSaving(true);
    try {
      await upsertBadgeToSupabase(clean);
    } catch (e) {
      notify(`Gagal simpan lencana ke Supabase: ${e instanceof Error ? e.message : 'Error'}`);
      setSaving(false);
      return;
    }
    setSaving(false);

    const next = isNew ? [...badges, clean] : badges.map((b) => (b.id === clean.id ? clean : b));
    setBadges(next);
    saveBadges(next);
    notify(isNew ? 'Lencana baru disimpan ke Supabase.' : 'Lencana diperbarui di Supabase.');
    setDraft(null);
  };

  const handleDelete = async (b: EditableBadge) => {
    if (!window.confirm(`Hapus lencana "${b.title}"?`)) return;
    try {
      await deleteBadgeFromSupabase(b.id);
    } catch (e) {
      notify(`Gagal hapus dari Supabase: ${e instanceof Error ? e.message : 'Error'}`);
      return;
    }
    const next = badges.filter((x) => x.id !== b.id);
    setBadges(next);
    saveBadges(next);
    if (draft?.id === b.id) setDraft(null);
    notify('Lencana dihapus.');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* List */}
      <div className="xl:col-span-2 bg-dark-surface border border-dark-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-pee-amber" /> Master Lencana ({badges.length})
            </h3>
            <p className="text-[11px] text-peach-tint/60 mt-0.5">
              Tersimpan langsung di tabel badges Supabase.
            </p>
          </div>
          <button
            onClick={() => {
              setDraft(blankBadge());
              setIsNew(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-pee-amber text-ink text-xs font-black flex items-center gap-1.5 hover:brightness-110"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Lencana
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-peach-tint/50 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat Lencana dari Supabase...
          </div>
        ) : badges.length === 0 ? (
          <div className="py-12 text-center text-xs text-peach-tint/50">
            Belum ada lencana di Supabase. Klik "Tambah Lencana" untuk membuat baru.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`flex gap-3 bg-dark-bg/60 border rounded-xl p-4 ${
                  draft?.id === b.id ? 'border-both-teal' : 'border-dark-border'
                }`}
              >
                <div className={`w-11 h-11 rounded-full ${mascotBg(b.mascot)} p-1.5 flex-shrink-0 flex items-center justify-center`}>
                  {mascotSvg(b.mascot)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black truncate">{b.title}</div>
                  <div className="text-[10px] font-bold text-peach-tint/50">
                    {b.code} · {b.category}
                  </div>
                  <p className="text-[11px] text-peach-tint/70 mt-1 line-clamp-2">{b.description}</p>
                  <div className="text-[10px] text-both-teal font-bold mt-1.5">🎯 {b.requirementText || '—'}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setDraft({ ...b });
                      setIsNew(false);
                    }}
                    className="p-1.5 rounded-lg text-peach-tint/60 hover:text-pee-amber hover:bg-dark-surface"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className="p-1.5 rounded-lg text-peach-tint/60 hover:text-emergency hover:bg-dark-surface"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor panel */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 h-fit xl:sticky xl:top-6">
        {draft ? (
          <div className="space-y-3 animate-fadeIn">
            <h3 className="font-black text-sm">{isNew ? 'Lencana Baru' : 'Edit Lencana'}</h3>

            {/* Live preview */}
            <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 text-center">
              <div className={`w-14 h-14 rounded-full ${mascotBg(draft.mascot)} p-2 mx-auto mb-2 flex items-center justify-center`}>
                {mascotSvg(draft.mascot)}
              </div>
              <div className="text-sm font-black">{draft.title || 'Judul Lencana'}</div>
              <div className="text-[10px] text-peach-tint/60 mt-0.5">{draft.description || 'Deskripsi lencana...'}</div>
            </div>

            <input className={inputCls} placeholder="Kode (mis. RAJA_KLOSET)" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
            <input className={inputCls} placeholder="Judul" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <textarea className={`${inputCls} resize-y`} rows={3} placeholder="Deskripsi" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <input className={inputCls} placeholder="Teks syarat (mis. 100 log tercatat)" value={draft.requirementText} onChange={(e) => setDraft({ ...draft, requirementText: e.target.value })} />

            <div className="grid grid-cols-2 gap-2">
              <select className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as EditableBadge['category'] })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className={inputCls} value={draft.iconName} onChange={(e) => setDraft({ ...draft, iconName: e.target.value })}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              {MASCOTS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setDraft({ ...draft, mascot: m.value })}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${
                    draft.mascot === m.value ? 'border-both-teal bg-both-teal/15 text-both-teal' : 'border-dark-border text-peach-tint/70'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setDraft(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-dark-border text-peach-tint/70 flex items-center justify-center gap-1">
                <X className="w-3.5 h-3.5" /> Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-both-teal text-ink flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-peach-tint/50">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">Pilih lencana untuk diedit, atau tambahkan lencana baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};
