import { Log } from '@poop-pee-log/shared';
import { Colors } from '@/constants/Colors';

export interface BadgeDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  mascot: 'drip' | 'plop' | 'flush';
  accentColor: string;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'newbie',
    title: 'Pendatang Baru',
    category: 'Awal Perjalanan',
    description: 'Mencatat buang air pertama kali dalam hidupmu di aplikasi!',
    mascot: 'drip',
    accentColor: Colors.peeAmber,
  },
  {
    id: 'hydration-master',
    title: 'Juara Hidrasi',
    category: 'Konsistensi',
    description: 'Mencapai total 10x catatan buang air kecil (Pee)',
    mascot: 'drip',
    accentColor: Colors.dripBlue,
  },
  {
    id: 'urban-explorer',
    title: 'Penjelajah Kota',
    category: 'Eksplorasi',
    description: 'Mencoba toilet di minimal 3 area / distrik berbeda',
    mascot: 'plop',
    accentColor: Colors.poopLight,
  },
  {
    id: 'flush-royale',
    title: 'Sir Flush Royale',
    category: 'Master Kloset',
    description: 'Melakukan paket kombo Pee & Poop (Sir Flush) 3 kali',
    mascot: 'flush',
    accentColor: Colors.bothTeal,
  },
  {
    id: 'streak-warrior',
    title: 'Lancar Jaya (Streak 3)',
    category: 'Disiplin',
    description: 'Menjaga streak mencatat buang air 3 hari berturut-turut tanpa putus',
    mascot: 'plop',
    accentColor: Colors.emergencyRed,
  },
  {
    id: 'centurion',
    title: 'Legenda Toilet',
    category: 'Pencapaian Akbar',
    description: 'Mencatat total 50 riwayat aktivitas biologis',
    mascot: 'flush',
    accentColor: '#A78BFA',
  },
];

/**
 * Menghitung streak hari aktif berturut-turut
 */
export function calculateStreakDays(logs: Log[]): number {
  if (logs.length === 0) return 0;
  const dates = Array.from(
    new Set(logs.map((l) => new Date(l.loggedAt).toDateString()))
  ).map((d) => new Date(d).getTime());
  dates.sort((a, b) => b - a);

  let streak = 0;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const today = new Date().setHours(0, 0, 0, 0);

  const mostRecent = new Date(dates[0]).setHours(0, 0, 0, 0);
  if (today - mostRecent > oneDayMs) {
    return 0;
  }

  let expected = mostRecent;
  for (const d of dates) {
    const current = new Date(d).setHours(0, 0, 0, 0);
    if (current === expected) {
      streak++;
      expected -= oneDayMs;
    } else {
      break;
    }
  }
  return Math.max(streak, logs.length > 0 ? 1 : 0);
}

/**
 * Evaluasi lencana yang berhasil dipenuhi berdasarkan riwayat log
 */
export function evaluateEarnedBadgeIds(logs: Log[]): Set<string> {
  const earned = new Set<string>();

  const totalLogs = logs.length;
  const totalPee = logs.filter((l) => l.type === 'PEE' || l.type === 'COMBO').length;
  const totalFlush = logs.filter((l) => l.type === 'COMBO').length;

  const districts = new Set<string>();
  logs.forEach((l) => {
    if (l.district) districts.add(l.district);
  });

  const streak = calculateStreakDays(logs);

  if (totalLogs >= 1) earned.add('newbie');
  if (totalPee >= 10) earned.add('hydration-master');
  if (districts.size >= 3) earned.add('urban-explorer');
  if (totalFlush >= 3) earned.add('flush-royale');
  if (streak >= 3) earned.add('streak-warrior');
  if (totalLogs >= 50) earned.add('centurion');

  return earned;
}

/**
 * Cari lencana BARU yang belum pernah dibuka sebelumnya
 */
export function findNewlyUnlockedBadges(
  logs: Log[],
  alreadyUnlockedBadgeIds: string[]
): BadgeDefinition[] {
  const earned = evaluateEarnedBadgeIds(logs);
  const alreadySet = new Set(alreadyUnlockedBadgeIds);

  const newBadges: BadgeDefinition[] = [];
  for (const badge of ALL_BADGES) {
    if (earned.has(badge.id) && !alreadySet.has(badge.id)) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}
