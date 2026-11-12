import { EditableFAQ, EditableBadge } from '../types/admin';
import { INITIAL_FAQS_DATA, INITIAL_EDITABLE_BADGES } from './mockAdminData';

/**
 * Penyimpanan konten sederhana berbasis localStorage.
 * Catatan: ini hanya untuk tahap prototipe. Untuk produksi, konten sebaiknya
 * disimpan di tabel Supabase (mis. `site_faqs`, `badges`) dengan RLS khusus admin.
 */
const FAQ_KEY = 'ppl_admin_faqs';
const BADGE_KEY = 'ppl_admin_badges';
export const CONTENT_UPDATED_EVENT = 'ppl-content-updated';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
}

export const getFaqs = (): EditableFAQ[] => read(FAQ_KEY, INITIAL_FAQS_DATA);
export const saveFaqs = (faqs: EditableFAQ[]) => write(FAQ_KEY, faqs);

export const getBadges = (): EditableBadge[] => read(BADGE_KEY, INITIAL_EDITABLE_BADGES);
export const saveBadges = (badges: EditableBadge[]) => write(BADGE_KEY, badges);

export const resetContent = () => {
  window.localStorage.removeItem(FAQ_KEY);
  window.localStorage.removeItem(BADGE_KEY);
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
};

