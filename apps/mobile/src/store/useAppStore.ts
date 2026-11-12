import { create } from 'zustand';
import { AppLanguage, Log } from '@poop-pee-log/shared';
import * as SecureStore from 'expo-secure-store';
import {
  getLocalLogs,
  insertLocalLog,
  insertMultipleLocalLogs,
  updateLocalLogMoodAndNote,
  deleteLocalLog,
  getDatabase,
  getUnlockedBadgeIds,
  saveUnlockedBadge,
} from '../db/sqlite';
import { getOrCreateGuestUser, supabase } from '../services/supabase';
import { syncLogsWithCloud, SyncResult } from '../services/sync';
import { BadgeDefinition, findNewlyUnlockedBadges } from '../services/badgeEvaluator';
import * as Crypto from 'expo-crypto';

interface AppState {
  logs: Log[];
  userId: string | null;
  userEmail: string | null;
  isAnonymous: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;

  // Lencana Baru yang Perlu Ditampilkan di Modal
  unlockedBadgeQueue: BadgeDefinition[];
  dismissActiveBadgeModal: () => void;

  mapFilter: 'ALL' | 'PEE' | 'POOP' | 'COMBO';
  mapTheme: 'DARK' | 'RETRO' | 'STANDARD';
  gpsRadiusMeter: number;
  appLockEnabled: boolean;
  language: AppLanguage;

  initialize: () => Promise<void>;
  setUser: (userId: string, email?: string | null, isAnonymous?: boolean) => void;
  syncWithCloud: () => Promise<SyncResult>;
  addLog: (logData: Omit<Log, 'id' | 'userId' | 'clientCreatedAt' | 'syncStatus'>) => Promise<Log>;
  importLogs: (importedLogs: Log[]) => Promise<number>;
  updateLogMoodAndNote: (id: string, mood: string, note: string) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  setMapFilter: (filter: 'ALL' | 'PEE' | 'POOP' | 'COMBO') => void;
  setMapTheme: (theme: 'DARK' | 'RETRO' | 'STANDARD') => void;
  setGpsRadiusMeter: (radius: number) => void;
  toggleAppLock: () => void;
  setLanguage: (lang: AppLanguage) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  logs: [],
  userId: null,
  userEmail: null,
  isAnonymous: true,
  isLoading: true,
  isSyncing: false,
  lastSyncedAt: null,
  unlockedBadgeQueue: [],
  mapFilter: 'ALL',
  mapTheme: 'DARK',
  gpsRadiusMeter: 30,
  appLockEnabled: false,
  language: 'id',

  dismissActiveBadgeModal: () => {
    set((state) => ({
      unlockedBadgeQueue: state.unlockedBadgeQueue.slice(1),
    }));
  },

  setUser: (userId: string, email?: string | null, isAnonymous: boolean = false) => {
    set({ userId, userEmail: email ?? null, isAnonymous });
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      await getDatabase();

      // Cek apakah ada sesi auth Supabase aktif
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let activeUserId = session?.user?.id;
      let activeEmail = session?.user?.email ?? null;
      let isAnon = Boolean(session?.user?.is_anonymous);

      if (!activeUserId) {
        activeUserId = await getOrCreateGuestUser();
        isAnon = true;
      }

      const loadedLogs = await getLocalLogs();
      const savedLang = await SecureStore.getItemAsync('pooppeelog_language').catch(() => null);
      const activeLang: AppLanguage = savedLang === 'id' || savedLang === 'en' ? savedLang : 'id';

      set({
        userId: activeUserId,
        userEmail: activeEmail,
        isAnonymous: isAnon,
        logs: loadedLogs,
        language: activeLang,
        isLoading: false,
      });

      // Jalankan sinkronisasi background secara halus saat start
      get().syncWithCloud().catch(() => {});
    } catch (error) {
      console.error('Failed to initialize local store:', error);
      set({ isLoading: false });
    }
  },

  syncWithCloud: async () => {
    const currentUserId = get().userId || undefined;
    set({ isSyncing: true });
    try {
      const result = await syncLogsWithCloud(currentUserId);
      if (result.success) {
        const reloaded = await getLocalLogs();
        set({
          logs: reloaded,
          isSyncing: false,
          lastSyncedAt: new Date().toISOString(),
        });
      } else {
        set({ isSyncing: false });
      }
      return result;
    } catch (err: any) {
      set({ isSyncing: false });
      return {
        success: false,
        uploadedCount: 0,
        downloadedCount: 0,
        error: err?.message || 'Sync failed',
      };
    }
  },

  addLog: async (logData) => {
    let currentUserId = get().userId;
    if (!currentUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(currentUserId)) {
      currentUserId = await getOrCreateGuestUser();
      set({ userId: currentUserId });
    }

    const now = new Date().toISOString();
    const newId = Crypto.randomUUID();

    const fullLog: Log = {
      ...logData,
      id: newId,
      userId: currentUserId,
      clientCreatedAt: now,
      syncStatus: 'pending',
    };

    // Simpan ke SQLite
    await insertLocalLog(fullLog);

    const updatedLogs = [fullLog, ...get().logs];

    // Evaluasi apakah ada lencana baru yang berhasil diraih
    try {
      const alreadyUnlocked = await getUnlockedBadgeIds();
      const newlyEarned = findNewlyUnlockedBadges(updatedLogs, alreadyUnlocked);

      if (newlyEarned.length > 0) {
        for (const b of newlyEarned) {
          await saveUnlockedBadge(b.id);
        }
        set((state) => ({
          logs: updatedLogs,
          unlockedBadgeQueue: [...state.unlockedBadgeQueue, ...newlyEarned],
        }));
      } else {
        set({ logs: updatedLogs });
      }
    } catch (e) {
      console.log('Badge evaluation error:', e);
      set({ logs: updatedLogs });
    }

    return fullLog;
  },

  importLogs: async (importedLogs: Log[]) => {
    // Validasi dan filter log yang valid
    const validLogs = importedLogs.filter(
      (l) => l && l.id && l.type && typeof l.latitude === 'number' && typeof l.longitude === 'number'
    );

    if (validLogs.length > 0) {
      await insertMultipleLocalLogs(validLogs);
      const reloadedLogs = await getLocalLogs();
      set({ logs: reloadedLogs });
    }

    return validLogs.length;
  },

  updateLogMoodAndNote: async (id: string, mood: string, note: string) => {
    await updateLocalLogMoodAndNote(id, mood, note);

    set((state) => ({
      logs: state.logs.map((l) => (l.id === id ? { ...l, mood, note } : l)),
    }));
  },

  removeLog: async (id: string) => {
    await deleteLocalLog(id);
    set((state) => ({
      logs: state.logs.filter((l) => l.id !== id),
    }));
  },

  setMapFilter: (filter) => set({ mapFilter: filter }),
  setMapTheme: (theme) => set({ mapTheme: theme }),
  setGpsRadiusMeter: (radius) => set({ gpsRadiusMeter: radius }),
  toggleAppLock: () => set((state) => ({ appLockEnabled: !state.appLockEnabled })),
  setLanguage: async (language: AppLanguage) => {
    set({ language });
    await SecureStore.setItemAsync('pooppeelog_language', language).catch(() => {});
  },
}));
