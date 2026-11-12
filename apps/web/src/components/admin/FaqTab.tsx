import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, HelpCircle, Loader2 } from 'lucide-react';
import { EditableFAQ } from '../../types/admin';
import { getFaqs, saveFaqs } from '../../data/contentStore';
import {
  deleteFaqFromSupabase,
  fetchFaqsFromSupabase,
  saveFaqOrdersToSupabase,
  upsertFaqToSupabase,
} from '../../services/adminApi';

interface FaqTabProps {
  isLiveMode: boolean;
  notify: (msg: string) => void;
}

const emptyDraft = { q: '', a: '' };

export const FaqTab: React.FC<FaqTabProps> = ({ isLiveMode, notify }) => {
  const [faqs, setFaqs] = useState<EditableFAQ[]>(() => [...getFaqs()].sort((a, b) => a.order - b.order));
  const [loading, setLoading] = useState(isLiveMode);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | 'NEW' | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (!isLiveMode) return;
    setLoading(true);
    fetchFaqsFromSupabase(false)
      .then((remote) => {
        if (remote.length > 0) {
          setFaqs(remote);
          saveFaqs(remote);
        }
      })
      .catch((e) => notify(`Gagal memuat FAQ Supabase: ${e.message}`))
      .finally(() => setLoading(false));
  }, [isLiveMode]);

  const startEdit = (faq?: EditableFAQ) => {
    setEditingId(faq ? faq.id : 'NEW');
    setDraft(faq ? { q: faq.q, a: faq.a } : emptyDraft);
  };

  const handleSave = async () => {
    if (!draft.q.trim() || !draft.a.trim()) {
      notify('Pertanyaan dan jawaban wajib diisi.');
      return;
    }

    const isNew = editingId === 'NEW';
    const target: EditableFAQ = isNew
      ? { id: `faq_${Date.now()}`, q: draft.q.trim(), a: draft.a.trim(), order: faqs.length + 1, isActive: true }
      : { ...faqs.find((f) => f.id === editingId)!, q: draft.q.trim(), a: draft.a.trim() };

    const next = (isNew ? [...faqs, target] : faqs.map((f) => (f.id === target.id ? target : f))).map((f, i) => ({
      ...f,
      order: i + 1,
    }));

    if (isLiveMode) {
      setSaving(true);
      try {
        await upsertFaqToSupabase(target);
      } catch (e) {
        notify(`Gagal simpan ke Supabase: ${e instanceof Error ? e.message : 'Error'}`);
        setSaving(false);
        return;
      }
      setSaving(false);
    }

    setFaqs(next);
    saveFaqs(next);
    notify(isNew ? 'FAQ baru disimpan ke Supabase.' : 'FAQ diperbarui di Supabase.');
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    const normalized = next.map((f, i) => ({ ...f, order: i + 1 }));

    if (isLiveMode) {
      try {
        await saveFaqOrdersToSupabase(normalized);
      } catch (e) {
        notify(`Gagal ubah urutan di Supabase: ${e instanceof Error ? e.message : 'Error'}`);
        return;
      }
    }

    setFaqs(normalized);
    saveFaqs(normalized);
    notify('Urutan FAQ diperbarui.');
  };

  const toggleVisibility = async (faq: EditableFAQ) => {
    const updated = { ...faq, isActive: !faq.isActive };
    if (isLiveMode) {
      try {
        await upsertFaqToSupabase(updated);
      } catch (e) {
        notify(`Gagal update visibilitas: ${e instanceof Error ? e.message : 'Error'}`);
        return;
      }
    }
    const next = faqs.map((f) => (f.id === faq.id ? updated : f));
    setFaqs(next);
    saveFaqs(next);
    notify(updated.isActive ? 'FAQ ditampilkan.' : 'FAQ disembunyikan.');
  };

  const handleDelete = async (faq: EditableFAQ) => {
    if (!window.confirm(`Hapus FAQ "${faq.q}"?`)) return;
    if (isLiveMode) {
      try {
        await deleteFaqFromSupabase(faq.id);
      } catch (e) {
        notify(`Gagal hapus dari Supabase: ${e instanceof Error ? e.message : 'Error'}`);
        return;
      }
    }
    const next = faqs.filter((f) => f.id !== faq.id).map((f, i) => ({ ...f, order: i + 1 }));
    setFaqs(next);
    saveFaqs(next);
    notify('FAQ dihapus.');
  };

  const editorForm = (
    <div className="bg-dark-bg border border-both-teal/50 rounded-2xl p-4 space-y-3 animate-fadeIn">
      <input
        value={draft.q}
        onChange={(e) => setDraft({ ...draft, q: e.target.value })}
        placeholder="Pertanyaan..."
        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-both-teal"
      />
      <textarea
        value={draft.a}
        onChange={(e) => setDraft({ ...draft, a: e.target.value })}
        placeholder="Jawaban..."
        rows={4}
        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-xs leading-relaxed outline-none focus:border-both-teal resize-y"
      />
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
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pee-amber" /> Manajemen FAQ Landing Page
          </h3>
          <p className="text-[11px] text-peach-tint/60 mt-0.5">
            {isLiveMode ? 'Tersimpan langsung di tabel site_faqs Supabase.' : 'Tersimpan lokal di browser.'}
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
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">
                    <span className="text-peach-tint/40 mr-1.5">#{faq.order}</span>
                    {faq.q}
                  </div>
                  <p className="text-xs text-peach-tint/70 mt-1 line-clamp-2 leading-relaxed">{faq.a}</p>
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
