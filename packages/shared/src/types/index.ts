export type AppLanguage = 'en' | 'id';

export type LogType = 'PEE' | 'POOP' | 'COMBO';

export type MoodPee = 'LEGA' | 'NAHAN_LAMA' | 'DARURAT';
export type MoodPoop = 'LEGA_BANGET' | 'BIASA_AJA' | 'MASIH_GANJEL' | 'TRAGEDI';

export type MascotType = 'MR_PLOP' | 'LIL_DRIP' | 'SIR_FLUSH';

export interface Log {
  id: string;
  userId: string;
  type: LogType;
  latitude: number;
  longitude: number;
  altitude?: number;
  city: string;
  district: string;
  subdistrict?: string;
  country: string;
  mood?: string;
  note?: string;
  loggedAt: string;
  isBlurred: boolean;
  blurredLatitude?: number;
  blurredLongitude?: number;
  clientCreatedAt: string;
  syncStatus?: 'synced' | 'pending';
}

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  mascot: MascotType;
  category: 'MILESTONE' | 'EXPLORATION' | 'STREAK' | 'ELEVATION';
  requirementText: string;
}

export interface UserStats {
  totalPee: number;
  totalPoop: number;
  currentStreak: number;
  totalDistricts: number;
  totalCities: number;
  maxAltitude: number;
}
