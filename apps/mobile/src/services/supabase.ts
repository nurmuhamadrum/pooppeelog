import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

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
 * Memastikan ID guest adalah format UUID standar yang valid untuk database PostgreSQL.
 */
export async function getOrCreateGuestUser(): Promise<string> {
  const GUEST_ID_KEY = 'pooppeelog_guest_user_id';
  let guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);

  // Validasi format UUID standar (36 karakter dengan 4 tanda '-')
  const isValidUUID =
    guestId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(guestId);

  if (!isValidUUID) {
    // Generate UUID v4 standar
    guestId = Crypto.randomUUID();
    await SecureStore.setItemAsync(GUEST_ID_KEY, guestId);
  }

  return guestId!;
}

