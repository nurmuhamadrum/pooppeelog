import { Log } from '@poop-pee-log/shared';

export interface EvaluatedBadge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'MILESTONE' | 'HABIT' | 'EXPLORATION';
  isUnlocked: boolean;
  progressText: string;
}

export function evaluateBadges(logs: Log[]): EvaluatedBadge[] {
  const totalPee = logs.filter((l) => l.type === 'PEE').length;
  const totalPoop = logs.filter((l) => l.type === 'POOP').length;
  const totalLogs = logs.length;

  // Hitung jumlah kota unik
  const uniqueCities = new Set(logs.map((l) => l.city.toLowerCase().trim())).size;

  // Hitung log malam (22:00 - 05:00)
  const nightLogs = logs.filter((l) => {
    const hour = new Date(l.loggedAt).getHours();
    return hour >= 22 || hour < 5;
  }).length;

  return [
    {
      id: 'first_log',
      name: 'Lega Perdana',
      description: 'Mencatat buang air pertama kali di aplikasi',
      emoji: '🎖️',
      category: 'MILESTONE',
      isUnlocked: totalLogs >= 1,
      progressText: totalLogs >= 1 ? 'Terbuka' : '0/1 log',
    },
    {
      id: 'drip_hydrated',
      name: 'Hidrasi Terjaga',
      description: 'Mencatat 5x buang air kecil bersama Lil\' Drip',
      emoji: '🌊',
      category: 'HABIT',
      isUnlocked: totalPee >= 5,
      progressText: `${Math.min(totalPee, 5)}/5 pee`,
    },
    {
      id: 'plop_king',
      name: 'Raja Kloset',
      description: 'Mencatat 3x buang air besar bersama Mr. Plop',
      emoji: '👑',
      category: 'HABIT',
      isUnlocked: totalPoop >= 3,
      progressText: `${Math.min(totalPoop, 3)}/3 poop`,
    },
    {
      id: 'toilet_explorer',
      name: 'Penjelajah Toilet',
      description: 'Menandai jejak buang air di 3 kota/kabupaten berbeda',
      emoji: '🧭',
      category: 'EXPLORATION',
      isUnlocked: uniqueCities >= 3,
      progressText: `${Math.min(uniqueCities, 3)}/3 kota`,
    },
    {
      id: 'night_owl',
      name: 'Pahlawan Malam',
      description: 'Mencatat buang air saat tengah malam (22:00 - 05:00)',
      emoji: '🦉',
      category: 'MILESTONE',
      isUnlocked: nightLogs >= 1,
      progressText: nightLogs >= 1 ? 'Terbuka' : '0/1 malam',
    },
  ];
}
