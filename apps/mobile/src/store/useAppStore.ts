import { create } from 'zustand';
import { Log } from '@poop-pee-log/shared';
import { getLocalLogs, insertLocalLog, deleteLocalLog, getDatabase } from '../db/sqlite';
import { getOrCreateGuestUser } from '../services/supabase';

interface AppState {
  // Data
  logs: Log[];
  userId: string | null;
  isLoading: boolean;

  // Filter & UI settings
  mapFilter: 'ALL' | 'PEE' | 'POOP';
  blurLocation: boolean;
  appLockEnabled: boolean;

  // Actions
  initialize: () => Promise<void>;
  addLog: (logData: Omit<Log, 'id' | 'userId' | 'clientCreatedAt' | 'syncStatus'>) => Promise<Log>;
  removeLog: (id: string) => Promise<void>;
  setMapFilter: (filter: 'ALL' | 'PEE' | 'POOP') => void;
  toggleBlurLocation: () => void;
  toggleAppLock: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  logs: [],
  userId: null,
  isLoading: true,
  mapFilter: 'ALL',
  blurLocation: true,
  appLockEnabled: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      await getDatabase(); // Inisialisasi tabel SQLite
      const guestId = await getOrCreateGuestUser();
      const loadedLogs = await getLocalLogs();

      set({
        userId: guestId,
        logs: loadedLogs,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize local store:', error);
      set({ isLoading: false });
    }
  },

  addLog: async (logData) => {
    const currentUserId = get().userId || 'guest_user';
    const now = new Date().toISOString();
    const newId = 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const fullLog: Log = {
      ...logData,
      id: newId,
      userId: currentUserId,
      clientCreatedAt: now,
      syncStatus: 'pending',
    };

    // 1. Simpan ke SQLite (<10ms)
    await insertLocalLog(fullLog);

    // 2. Update state lokal instan
    set((state) => ({
      logs: [fullLog, ...state.logs],
    }));

    return fullLog;
  },

  removeLog: async (id: string) => {
    await deleteLocalLog(id);
    set((state) => ({
      logs: state.logs.filter((l) => l.id !== id),
    }));
  },

  setMapFilter: (filter) => set({ mapFilter: filter }),
  toggleBlurLocation: () => set((state) => ({ blurLocation: !state.blurLocation })),
  toggleAppLock: () => set((state) => ({ appLockEnabled: !state.appLockEnabled })),
}));

