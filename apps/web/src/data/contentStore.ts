import { EditableFAQ, EditableBadge } from '../types/admin';
import { INITIAL_BADGES } from '@poop-pee-log/shared';

const FAQ_KEY = 'ppl_admin_faqs';
const BADGE_KEY = 'ppl_admin_badges';
export const CONTENT_UPDATED_EVENT = 'ppl-content-updated';

const FALLBACK_FAQS: EditableFAQ[] = [
  {
    id: 'faq_1',
    q: 'Apakah aplikasi ini bisa mencari toilet umum terdekat?',
    a: 'Tidak. Poop Pee Log BUKAN aplikasi pencari toilet umum. Aplikasi ini adalah buku harian pribadi (personal diary & tracker) untuk mendokumentasikan tempat dan waktu di mana Anda sendiri buang air, layaknya aplikasi Strava untuk aktivitas biologis.',
    order: 1,
    isActive: true,
  },
  {
    id: 'faq_2',
    q: 'Apakah ada fitur untuk memberi rating kebersihan toilet?',
    a: 'Tidak ada. Kami tidak menyediakan rating kloset, review kebersihan, atau penilaian fasilitas publik. Semua catatan dan mood murni untuk evaluasi dan kesenangan pribadi Anda.',
    order: 2,
    isActive: true,
  },
  {
    id: 'faq_3',
    q: 'Apakah teman atau orang lain bisa melihat catatan saya?',
    a: 'Sama sekali tidak bisa. Poop Pee Log menganut prinsip Zero Social. Tidak ada feed pertemanan, tidak ada tautan publik, dan tidak ada leaderboard. Data Anda diisolasi menggunakan Row Level Security (RLS) dan kunci aplikasi PIN/Biometrik.',
    order: 3,
    isActive: true,
  },
  {
    id: 'faq_4',
    q: 'Apakah saya bisa mencatat log saat tidak ada sinyal internet?',
    a: 'Tentu saja! Poop Pee Log dibangun dengan arsitektur Offline-First. Anda bisa mencatat di toilet basement mall atau di puncak gunung tanpa sinyal. Data akan tersimpan di memori HP Anda dan disinkronkan otomatis saat terhubung ke internet.',
    order: 4,
    isActive: true,
  },
  {
    id: 'faq_5',
    q: 'Apakah saya wajib mendaftarkan email saat pertama kali pakai?',
    a: 'Tidak wajib. Anda bisa langsung menggunakan mode tamu (Anonymous Guest) dalam hitungan detik setelah instalasi. Anda baru diminta menghubungkan Google/Apple ID jika ingin mencadangkan data lintas perangkat.',
    order: 5,
    isActive: true,
  },
];

const FALLBACK_BADGES: EditableBadge[] = INITIAL_BADGES.map((b) => ({
  id: b.id,
  code: b.code,
  title: b.title,
  description: b.description,
  iconName: b.iconName,
  mascot: b.mascot,
  category: b.category,
  requirementText: b.requirementText,
}));

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

export const getFaqs = (): EditableFAQ[] => read(FAQ_KEY, FALLBACK_FAQS);
export const saveFaqs = (faqs: EditableFAQ[]) => write(FAQ_KEY, faqs);

export const getBadges = (): EditableBadge[] => read(BADGE_KEY, FALLBACK_BADGES);
export const saveBadges = (badges: EditableBadge[]) => write(BADGE_KEY, badges);
