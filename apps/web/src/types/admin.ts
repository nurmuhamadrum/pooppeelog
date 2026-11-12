export interface AdminStatOverview {
  totalUsers: number;
  activeUsersToday: number;
  totalLogs: number;
  logsToday: number;
  totalPee: number;
  totalPoop: number;
  totalCombo: number;
  streakRecordDays: number;
  citiesCovered: number;
}

export interface CityDistribution {
  city: string;
  count: number;
  percentage: number;
}

export interface DailyLogStat {
  date: string;
  pee: number;
  poop: number;
  combo: number;
  total: number;
}

export interface AdminUserItem {
  id: string;
  email: string | null;
  displayName: string;
  isAnonymous: boolean;
  totalLogs: number;
  badgesCount: number;
  lastActive: string;
  joinedAt: string;
}

export interface AdminActivityLogItem {
  id: string;
  userEmail: string;
  type: 'PEE' | 'POOP' | 'COMBO';
  district: string;
  city: string;
  mood: string;
  note?: string;
  loggedAt: string;
}

export interface EditableFAQ {
  id: string;
  q: string;
  a: string;
  order: number;
  isActive: boolean;
}

export interface EditableBadge {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  mascot: 'LIL_DRIP' | 'MR_PLOP' | 'SIR_FLUSH';
  category: 'MILESTONE' | 'EXPLORATION' | 'STREAK' | 'ELEVATION';
  requirementText: string;
}

