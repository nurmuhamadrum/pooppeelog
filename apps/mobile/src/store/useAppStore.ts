import { create } from 'zustand';
import { Log } from '@poop-pee-log/shared';
import {
  getLocalLogs,
  insertLocalLog,
  insertMultipleLocalLogs,
  updateLocalLogMoodAndNote,
  deleteLocalLog,
  getDatabase,
} from '../db/sqlite';
import { getOrCreateGuestUser } from '../services/supabase';
import { syncLogsWithCloud, SyncResult } from '../services/sync';
import * as Crypto from 'expo-crypto';

interface AppState {
  logs: Log[];
  userId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;

  mapFilter: 'ALL' | 'PEE' | 'POOP' | 'COMBO';
  appLockEnabled: boolean;

  initialize: () => Promise<void>;
  syncWithCloud: () => Promise<SyncResult>;
  addLog: (logData: Omit<Log, 'id' | 'userId' | 'clientCreatedAt' | 'syncStatus'>) => Promise<Log>;
  importLogs: (importedLogs: Log[]) => Promise<number>;
  updateLogMoodAndNote: (id: string, mood: string, note: string) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  setMapFilter: (filter: 'ALL' | 'PEE' | 'POOP' | 'COMBO') => void;
  toggleAppLock: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  logs: [],
  userId: null,
  isLoading: true,
  isSyncing: false,
  lastSyncedAt: null,
  mapFilter: 'ALL',
  appLockEnabled: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      await getDatabase();
      const guestId = await getOrCreateGuestUser();
      const loadedLogs = await getLocalLogs();

      set({
        userId: guestId,
        logs: loadedLogs,
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

    // Update state lokal
    set((state) => ({
      logs: [fullLog, ...state.logs],
    }));

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
  toggleAppLock: () => set((state) => ({ appLockEnabled: !state.appLockEnabled })),
}));
