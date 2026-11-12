import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, HelpCircle, Loader2 } from 'lucide-react';
import { EditableFAQ } from '../../types/admin';
import { saveFaqs } from '../../data/contentStore';
import {
  deleteFaqFromSupabase,
  fetchFaqsFromSupabase,
  saveFaqOrdersToSupabase,
  upsertFaqToSupabase,
} from '../../services/adminApi';

interface FaqTabProps {
  notify: (msg: string) => void;
}

const emptyDraft = { q: '', a: '', qEn: '', aEn: '' };

export const FaqTab: React.FC<FaqTabProps> = ({ notify }) => {
  const [faqs, setFaqs] = useState<EditableFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | 'NEW' | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    setLoading(true);
    fetchFaqsFromSupabase(false)
      .then((remote) => {
        setFaqs(remote);
        saveFaqs(remote);
      })
      .catch((e) => notify(`Gagal memuat FAQ Supabase: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (faq?: EditableFAQ) => {
    setEditingId(faq ? faq.id : 'NEW');
    setDraft(
      faq
        ? { q: faq.q, a: faq.a, qEn: faq.qEn || '', aEn: faq.aEn || '' }
        : emptyDraft
    );
  };

  const handleSave = async () => {
    if (!draft.q.trim() || !draft.a.trim()) {
      notify('Pertanyaan dan jawaban (Indonesia) wajib diisi.');
      return;
    }

    const isNew = editingId === 'NEW';
    const target: EditableFAQ = isNew
      ? {
          id: `faq_${Date.now()}`,
          q: draft.q.trim(),
          a: draft.a.trim(),
          qEn: draft.qEn.trim(),
          aEn: draft.aEn.trim(),
          order: faqs.length + 1,
          isActive: true,
        }
      : {
          ...faqs.find((f) => f.id === editingId)!,
          q: draft.q.trim(),
          a: draft.a.trim(),
          qEn: draft.qEn.trim(),
          aEn: draft.aEn.trim(),
        };

    const next = (isNew ? [...faqs, target] : faqs.map((f) => (f.id === target.id ? target : f))).map((f, i) => ({
      ...f,
      order: i + 1,
    }));

    setSaving(true);
    try {
      await upsertFaqToSupabase(target);
    } catch (e) {
      notify(`Gagal simpan ke Supabase: ${e instanceof Error ? e.message : 'Error'}`);
      setSaving(false);
      return;
    }
    setSaving(false);

    setFaqs(next);
    saveFaqs(next);
    notify(isNew ? 'FAQ bilingual disimpan ke Supabase.' : 'FAQ bilingual diperbarui di Supabase.');
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    const normalized = next.map((f, i) => ({ ...f, order: i + 1 }));

    try {
      await saveFaqOrdersToSupabase(normalized);
    } catch (e) {
      notify(`Gagal ubah urutan di Supabase: ${e instanceof Error ? e.message : 'Error'}`);
      return;
    }

    setFaqs(normalized);
    saveFaqs(normalized);
    notify('Urutan FAQ diperbarui.');
  };

  const toggleVisibility = async (faq: EditableFAQ) => {
    const updated = { ...faq, isActive: !faq.isActive };
    try {
      await upsertFaqToSupabase(updated);
    } catch (e) {
      notify(`Gagal update visibilitas: ${e instanceof Error ? e.message : 'Error'}`);
      return;
    }
    const next = faqs.map((f) => (f.id === faq.id ? updated : f));
    setFaqs(next);
    saveFaqs(next);
    notify(updated.isActive ? 'FAQ ditampilkan.' : 'FAQ disembunyikan.');
  };

  const handleDelete = async (faq: EditableFAQ) => {
    if (!window.confirm(`Hapus FAQ "${faq.q}"?`)) return;
    try {
      await deleteFaqFromSupabase(faq.id);
    } catch (e) {
      notify(`Gagal hapus dari Supabase: ${e instanceof Error ? e.message : 'Error'}`);
      return;
    }
    const next = faqs.filter((f) => f.id !== faq.id).map((f, i) => ({ ...f, order: i + 1 }));
    setFaqs(next);
    saveFaqs(next);
    notify('FAQ dihapus.');
  };

  const editorForm = (
    <div className="bg-dark-bg border border-both-teal/50 rounded-2xl p-4 space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bahasa Indonesia */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-black text-pee-amber uppercase tracking-wider">
            🇮🇩 Bahasa Indonesia (Utama)
          </div>
          <input
            value={draft.q}
            onChange={(e) => setDraft({ ...draft, q: e.target.value })}
            placeholder="Pertanyaan (ID)..."
            className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-pee-amber"
          />
          <textarea
            value={draft.a}
            onChange={(e) => setDraft({ ...draft, a: e.target.value })}
            placeholder="Jawaban (ID)..."
            rows={4}
            className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-xs leading-relaxed outline-none focus:border-pee-amber resize-y"
          />
        </div>

        {/* English */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-black text-both-teal uppercase tracking-wider">
            🇬🇧 English
          </div>
          <input
            value={draft.qEn}
            onChange={(e) => setDraft({ ...draft, qEn: e.target.value })}
            placeholder="Question (EN)..."
            className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-both-teal"
          />
          <textarea
            value={draft.aEn}
            onChange={(e) => setDraft({ ...draft, aEn: e.target.value })}
            placeholder="Answer (EN)..."
            rows={4}
            className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-xs leading-relaxed outline-none focus:border-both-teal resize-y"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setEditingId(null)}
          className="px-3 py-2 rounded-lg text-xs font-bold text-peach-tint/70 border border-dark-border hover:text-cream-bg flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" /> Batal
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-xs font-black bg-both-teal text-ink flex items-center gap-1 hover:brightness-110 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan Bilingual
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pee-amber" /> Manajemen FAQ Landing Page (ID &amp; EN)
          </h3>
          <p className="text-[11px] text-peach-tint/60 mt-0.5">
            Kelola konten FAQ dalam Bahasa Indonesia &amp; Inggris, tersimpan langsung di Supabase.
          </p>
        </div>
        <button
          onClick={() => startEdit()}
          className="px-3.5 py-2 rounded-xl bg-pee-amber text-ink text-xs font-black flex items-center gap-1.5 hover:brightness-110"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah FAQ
        </button>
      </div>

      {editingId === 'NEW' && editorForm}

      {loading ? (
        <div className="py-10 text-center text-xs text-peach-tint/50 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Memuat FAQ dari Supabase...
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-10 text-center text-xs text-peach-tint/50">
          Belum ada FAQ di Supabase. Klik "Tambah FAQ" untuk membuat baru.
        </div>
      ) : (
        <div className="space-y-2.5">
          {faqs.map((faq, i) =>
            editingId === faq.id ? (
              <div key={faq.id}>{editorForm}</div>
            ) : (
              <div
                key={faq.id}
                className={`flex gap-3 bg-dark-bg/60 border border-dark-border rounded-xl p-4 ${!faq.isActive ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded text-peach-tint/60 hover:text-cream-bg disabled:opacity-20">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === faqs.length - 1} className="p-1 rounded text-peach-tint/60 hover:text-cream-bg disabled:opacity-20">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">
                      <span className="text-peach-tint/40 mr-1.5">#{faq.order}</span>
                      {faq.q}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${faq.qEn ? 'border-both-teal/40 text-both-teal bg-both-teal/10' : 'border-dark-border text-peach-tint/40'}`}>
                      {faq.qEn ? 'ID + EN' : 'ID only'}
                    </span>
                  </div>
                  <p className="text-xs text-peach-tint/70 line-clamp-2 leading-relaxed">{faq.a}</p>
                  {faq.qEn && (
                    <p className="text-[11px] text-both-teal/80 italic truncate">EN: {faq.qEn}</p>
                  )}
                </div>
                <div className="flex items-start gap-1">
                  <button
                    onClick={() => toggleVisibility(faq)}
                    title={faq.isActive ? 'Sembunyikan' : 'Tampilkan'}
                    className="p-2 rounded-lg text-peach-tint/60 hover:text-both-teal hover:bg-dark-surface"
                  >
                    {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(faq)} title="Edit" className="p-2 rounded-lg text-peach-tint/60 hover:text-pee-amber hover:bg-dark-surface">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq)}
                    title="Hapus"
                    className="p-2 rounded-lg text-peach-tint/60 hover:text-emergency hover:bg-dark-surface"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
