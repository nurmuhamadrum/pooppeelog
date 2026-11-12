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
    qEn: 'Can this app find the nearest public toilet?',
    aEn: 'No. Poop Pee Log is NOT a public toilet finder. It is a personal biological diary and tracker to log where and when you relieve yourself, just like Strava for your bathroom habits.',
    order: 1,
    isActive: true,
  },
  {
    id: 'faq_2',
    q: 'Apakah ada fitur untuk memberi rating kebersihan toilet?',
    a: 'Tidak ada. Kami tidak menyediakan rating kloset, review kebersihan, atau penilaian fasilitas publik. Semua catatan dan mood murni untuk evaluasi dan kesenangan pribadi Anda.',
    qEn: 'Is there a feature to rate toilet cleanliness?',
    aEn: 'No. We do not provide toilet ratings, cleanliness reviews, or public facility scores. All notes and moods are strictly for your own personal tracking and enjoyment.',
    order: 2,
    isActive: true,
  },
  {
    id: 'faq_3',
    q: 'Apakah teman atau orang lain bisa melihat catatan saya?',
    a: 'Sama sekali tidak bisa. Poop Pee Log menganut prinsip Zero Social. Tidak ada feed pertemanan, tidak ada tautan publik, dan tidak ada leaderboard. Data Anda diisolasi menggunakan Row Level Security (RLS) dan kunci aplikasi PIN/Biometrik.',
    qEn: 'Can friends or other people see my logs?',
    aEn: 'Never. Poop Pee Log follows a strict Zero Social principle. There are no friend feeds, no public links, and no leaderboards. Your data is isolated with Row Level Security (RLS) and biometric app lock.',
    order: 3,
    isActive: true,
  },
  {
    id: 'faq_4',
    q: 'Apakah saya bisa mencatat log saat tidak ada sinyal internet?',
    a: 'Tentu saja! Poop Pee Log dibangun dengan arsitektur Offline-First. Anda bisa mencatat di toilet basement mall atau di puncak gunung tanpa sinyal. Data akan tersimpan di memori HP Anda dan disinkronkan otomatis saat terhubung ke internet.',
    qEn: 'Can I record a log when there is no internet connection?',
    aEn: 'Of course! Poop Pee Log is built with an Offline-First architecture. You can log in a basement restroom or on a mountain peak without signal. Logs are stored locally on your phone and auto-sync when back online.',
    order: 4,
    isActive: true,
  },
  {
    id: 'faq_5',
    q: 'Apakah saya wajib mendaftarkan email saat pertama kali pakai?',
    a: 'Tidak wajib. Anda bisa langsung menggunakan mode tamu (Anonymous Guest) dalam hitungan detik setelah instalasi. Anda baru diminta menghubungkan Google/Apple ID jika ingin mencadangkan data lintas perangkat.',
    qEn: 'Do I have to register an email before using the app?',
    aEn: 'Not required. You can start immediately in Anonymous Guest mode seconds after installing. You only need to link an email or Google account if you want multi-device cloud backup.',
    order: 5,
    isActive: true,
  },
];

const BADGE_EN_MAP: Record<string, { titleEn: string; descriptionEn: string; requirementTextEn: string }> = {
  PENDATANG_BARU: {
    titleEn: 'First Timer',
    descriptionEn: 'Recorded your very first bathroom log in history.',
    requirementTextEn: '1st log recorded',
  },
  PENJELAJAH_KOTA: {
    titleEn: 'City Explorer',
    descriptionEn: 'Successfully logged relief in at least 3 different districts.',
    requirementTextEn: '3 different districts',
  },
  LANCAR_JAYA: {
    titleEn: 'Smooth Flow',
    descriptionEn: 'Maintained a daily logging streak for 7 consecutive days.',
    requirementTextEn: '7-day streak',
  },
  MUSAFIR: {
    titleEn: 'Traveler',
    descriptionEn: 'Marked your relief trail in at least 2 different cities.',
    requirementTextEn: '2 different cities',
  },
  PUNCAK_LEGA: {
    titleEn: 'Peak Relief',
    descriptionEn: 'Completed a relief session at an altitude above 1,000 meters.',
    requirementTextEn: 'Altitude > 1,000m',
  },
};

const FALLBACK_BADGES: EditableBadge[] = INITIAL_BADGES.map((b) => ({
  id: b.id,
  code: b.code,
  title: b.title,
  description: b.description,
  titleEn: BADGE_EN_MAP[b.code]?.titleEn || b.title,
  descriptionEn: BADGE_EN_MAP[b.code]?.descriptionEn || b.description,
  iconName: b.iconName,
  mascot: b.mascot,
  category: b.category,
  requirementText: b.requirementText,
  requirementTextEn: BADGE_EN_MAP[b.code]?.requirementTextEn || b.requirementText,
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
