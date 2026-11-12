import {
  AdminStatOverview,
  CityDistribution,
  DailyLogStat,
  AdminUserItem,
  AdminActivityLogItem,
  EditableFAQ,
  EditableBadge,
} from '../types/admin';
import { INITIAL_BADGES } from '@poop-pee-log/shared';

export const INITIAL_ADMIN_STATS: AdminStatOverview = {
  totalUsers: 1482,
  activeUsersToday: 329,
  totalLogs: 12480,
  logsToday: 412,
  totalPee: 7240,
  totalPoop: 3890,
  totalCombo: 1350,
  streakRecordDays: 68,
  citiesCovered: 34,
};

export const INITIAL_CITY_DISTRIBUTION: CityDistribution[] = [
  { city: 'Jakarta Pusat', count: 3420, percentage: 27.4 },
  { city: 'Jakarta Selatan', count: 2890, percentage: 23.2 },
  { city: 'Bandung', count: 1780, percentage: 14.3 },
  { city: 'Surabaya', count: 1450, percentage: 11.6 },
  { city: 'Yogyakarta', count: 1120, percentage: 9.0 },
  { city: 'Kota Lainnya', count: 1820, percentage: 14.5 },
];

export const INITIAL_DAILY_STATS: DailyLogStat[] = [
  { date: '06 Nov', pee: 210, poop: 115, combo: 40, total: 365 },
  { date: '07 Nov', pee: 245, poop: 130, combo: 48, total: 423 },
  { date: '08 Nov', pee: 230, poop: 125, combo: 42, total: 397 },
  { date: '09 Nov', pee: 280, poop: 155, combo: 55, total: 490 },
  { date: '10 Nov', pee: 260, poop: 140, combo: 50, total: 450 },
  { date: '11 Nov', pee: 275, poop: 148, combo: 52, total: 475 },
  { date: '12 Nov', pee: 240, poop: 126, combo: 46, total: 412 },
];

export const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'usr_001',
    email: 'budi.santoso@gmail.com',
    displayName: 'Budi Plong',
    isAnonymous: false,
    totalLogs: 142,
    badgesCount: 7,
    lastActive: '12 Nov 2026, 18:42',
    joinedAt: '14 Okt 2026',
  },
  {
    id: 'usr_002',
    email: 'anita.wijaya@outlook.com',
    displayName: 'Anita Drip',
    isAnonymous: false,
    totalLogs: 98,
    badgesCount: 5,
    lastActive: '12 Nov 2026, 17:15',
    joinedAt: '20 Okt 2026',
  },
  {
    id: 'usr_003',
    email: null,
    displayName: 'Guest #8821',
    isAnonymous: true,
    totalLogs: 34,
    badgesCount: 3,
    lastActive: '12 Nov 2026, 16:30',
    joinedAt: '02 Nov 2026',
  },
  {
    id: 'usr_004',
    email: 'reza.rahadian@yahoo.com',
    displayName: 'Sir Reza Flush',
    isAnonymous: false,
    totalLogs: 215,
    badgesCount: 11,
    lastActive: '12 Nov 2026, 15:10',
    joinedAt: '05 Okt 2026',
  },
  {
    id: 'usr_005',
    email: null,
    displayName: 'Guest #4190',
    isAnonymous: true,
    totalLogs: 12,
    badgesCount: 1,
    lastActive: '12 Nov 2026, 12:05',
    joinedAt: '10 Nov 2026',
  },
  {
    id: 'usr_006',
    email: 'dina.kurnia@gmail.com',
    displayName: 'Dina Traveler',
    isAnonymous: false,
    totalLogs: 76,
    badgesCount: 4,
    lastActive: '11 Nov 2026, 21:50',
    joinedAt: '28 Okt 2026',
  },
];

export const INITIAL_ACTIVITY_LOGS: AdminActivityLogItem[] = [
  {
    id: 'log_991',
    userEmail: 'budi.santoso@gmail.com',
    type: 'COMBO',
    district: 'Menteng',
    city: 'Jakarta Pusat',
    mood: 'Kombo Sukses',
    note: 'Lega banget sehabis meeting siang',
    loggedAt: '12 Nov 2026, 18:42',
  },
  {
    id: 'log_990',
    userEmail: 'anita.wijaya@outlook.com',
    type: 'PEE',
    district: 'Kebon Jeruk',
    city: 'Jakarta Barat',
    mood: 'Lega Banget',
    note: 'Minum air 2 liter',
    loggedAt: '12 Nov 2026, 17:15',
  },
  {
    id: 'log_989',
    userEmail: 'Guest #8821',
    type: 'POOP',
    district: 'Dago',
    city: 'Bandung',
    mood: 'Plong Sekali',
    note: 'Toilet kafe bersih',
    loggedAt: '12 Nov 2026, 16:30',
  },
  {
    id: 'log_988',
    userEmail: 'reza.rahadian@yahoo.com',
    type: 'PEE',
    district: 'SCBD Sudirman',
    city: 'Jakarta Selatan',
    mood: 'Nahan Lama',
    loggedAt: '12 Nov 2026, 15:10',
  },
  {
    id: 'log_987',
    userEmail: 'Guest #4190',
    type: 'COMBO',
    district: 'Tegalsari',
    city: 'Surabaya',
    mood: 'Lega Banget',
    note: 'Paket komplet sebelum jalan',
    loggedAt: '12 Nov 2026, 12:05',
  },
];

export const INITIAL_FAQS_DATA: EditableFAQ[] = [
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

export const INITIAL_EDITABLE_BADGES: EditableBadge[] = INITIAL_BADGES.map((b) => ({
  id: b.id,
  code: b.code,
  title: b.title,
  description: b.description,
  iconName: b.iconName,
  mascot: b.mascot,
  category: b.category,
  requirementText: b.requirementText,
}));

