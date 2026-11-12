import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, HelpCircle } from 'lucide-react';
import { EditableFAQ } from '../../types/admin';
import { getFaqs, saveFaqs } from '../../data/contentStore';

interface FaqTabProps {
  notify: (msg: string) => void;
}

const emptyDraft = { q: '', a: '' };

export const FaqTab: React.FC<FaqTabProps> = ({ notify }) => {
  const [faqs, setFaqs] = useState<EditableFAQ[]>(() => [...getFaqs()].sort((a, b) => a.order - b.order));
  const [editingId, setEditingId] = useState<string | 'NEW' | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const persist = (next: EditableFAQ[], msg: string) => {
    const normalized = next.map((f, i) => ({ ...f, order: i + 1 }));
    setFaqs(normalized);
    saveFaqs(normalized);
    notify(msg);
  };

  const startEdit = (faq?: EditableFAQ) => {
    setEditingId(faq ? faq.id : 'NEW');
    setDraft(faq ? { q: faq.q, a: faq.a } : emptyDraft);
  };

  const handleSave = () => {
    if (!draft.q.trim() || !draft.a.trim()) {
      notify('Pertanyaan dan jawaban wajib diisi.');
      return;
    }
    if (editingId === 'NEW') {
      persist(
        [...faqs, { id: `faq_${Date.now()}`, q: draft.q.trim(), a: draft.a.trim(), order: faqs.length + 1, isActive: true }],
        'FAQ baru ditambahkan.'
      );
    } else {
      persist(
        faqs.map((f) => (f.id === editingId ? { ...f, q: draft.q.trim(), a: draft.a.trim() } : f)),
        'FAQ diperbarui.'
      );
    }
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next, 'Urutan FAQ diperbarui.');
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
          className="px-4 py-2 rounded-lg text-xs font-black bg-both-teal text-ink flex items-center gap-1 hover:brightness-110"
        >
          <Save className="w-3.5 h-3.5" /> Simpan
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
            Perubahan langsung tampil di bagian FAQ pada landing page.
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
                  onClick={() =>
                    persist(
                      faqs.map((f) => (f.id === faq.id ? { ...f, isActive: !f.isActive } : f)),
                      faq.isActive ? 'FAQ disembunyikan.' : 'FAQ ditampilkan.'
                    )
                  }
                  title={faq.isActive ? 'Sembunyikan' : 'Tampilkan'}
                  className="p-2 rounded-lg text-peach-tint/60 hover:text-both-teal hover:bg-dark-surface"
                >
                  {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(faq)} title="Edit" className="p-2 rounded-lg text-peach-tint/60 hover:text-pee-amber hover:bg-dark-surface">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus FAQ "${faq.q}"?`)) {
                      persist(faqs.filter((f) => f.id !== faq.id), 'FAQ dihapus.');
                    }
                  }}
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
    </div>
  );
};

