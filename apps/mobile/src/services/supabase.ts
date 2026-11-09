import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Placeholder Supabase config (dapat dikonfigurasi via process.env / app.json)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Adaptor penyimpanan token session yang aman di Keychain iOS / Keystore Android
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Anonymous Onboarding:
 * Memungkinkan pengguna langsung menggunakan app tanpa ketik email/password.
 */
export async function getOrCreateGuestUser(): Promise<string> {
  const GUEST_ID_KEY = 'pooppeelog_guest_user_id';
  let guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);

  if (!guestId) {
    // Generate UUID v4 sederhana untuk identitas lokal
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    await SecureStore.setItemAsync(GUEST_ID_KEY, guestId);
  }

  return guestId;
}
