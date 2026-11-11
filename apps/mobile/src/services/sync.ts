import { supabase } from './supabase';
import {
  getPendingLogs,
  markLogsAsSynced,
  insertMultipleLocalLogs,
  getLocalLogs,
} from '../db/sqlite';
import { Log } from '@poop-pee-log/shared';
import * as Crypto from 'expo-crypto';

export interface SyncResult {
  success: boolean;
  uploadedCount: number;
  downloadedCount: number;
  error?: string;
}

/**
 * Memastikan sesi Supabase Auth aktif (bisa via Anonymous Auth jika belum login).
 */
export async function ensureAuthSession(): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      return session.user.id;
    }

    // Sign in secara anonymous agar mendapatkan auth.uid() resmi dari Supabase Auth
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (!anonError && anonData.user?.id) {
      // Pastikan profile record juga ada
      await supabase.from('profiles').upsert(
        {
          id: anonData.user.id,
          is_anonymous: true,
          display_name: 'Penjelajah Toilet',
        },
        { onConflict: 'id' }
      );
      return anonData.user.id;
    } else if (anonError) {
      console.log('signInAnonymously error:', anonError.message);
    }
  } catch (err) {
    console.log('ensureAuthSession notice:', err);
  }
  return null;
}

/**
 * Sinkronisasi dua arah (Two-Way Sync):
 * 1. Push: Upload catatan lokal dengan status 'pending' ke cloud.
 * 2. Pull: Ambil catatan baru dari cloud yang belum ada di lokal.
 */
export async function syncLogsWithCloud(currentUserId?: string): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    uploadedCount: 0,
    downloadedCount: 0,
  };

  try {
    // Helper validasi UUID
    const isUUID = (val?: string) =>
      Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val));

    // 1. Cek ketersediaan URL Supabase yang valid
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder-project')) {
      return {
        success: false,
        uploadedCount: 0,
        downloadedCount: 0,
        error: 'Kredensial Supabase belum dikonfigurasi di file .env',
      };
    }

    // Selalu pastikan menggunakan ID dari sesi resmi Supabase Auth
    const activeAuthId = await ensureAuthSession();
    const finalUserId = activeAuthId || (currentUserId && isUUID(currentUserId) ? currentUserId : null);

    if (!finalUserId) {
      return {
        success: false,
        uploadedCount: 0,
        downloadedCount: 0,
        error: 'Sesi akun Supabase tidak aktif. Pastikan Anonymous Sign-In sudah aktif di Supabase.',
      };
    }

    // 2. PUSH: Upload pending local logs
    const pendingLogs = await getPendingLogs();
    if (pendingLogs.length > 0) {
      const recordsToUpsert = pendingLogs.map((log) => ({
        // Pastikan id log berupa UUID valid agar PostgreSQL tidak melempar error
        id: isUUID(log.id) ? log.id : Crypto.randomUUID(),
        user_id: finalUserId,
        type: log.type,
        latitude: log.latitude,
        longitude: log.longitude,
        altitude: log.altitude ?? 0.0,
        city: log.city,
        district: log.district,
        subdistrict: log.subdistrict ?? null,
        country: log.country,
        mood: log.mood ?? null,
        note: log.note ?? null,
        logged_at: log.loggedAt,
        is_blurred: log.isBlurred,
        blurred_latitude: log.blurredLatitude ?? null,
        blurred_longitude: log.blurredLongitude ?? null,
        client_created_at: log.clientCreatedAt,
        is_deleted: false,
      }));

      const { error: uploadError } = await supabase
        .from('logs')
        .upsert(recordsToUpsert, { onConflict: 'id' });

      if (uploadError) {
        throw new Error(`Gagal mengunggah data ke server: ${uploadError.message}`);
      }

      await markLogsAsSynced(pendingLogs.map((l) => l.id));
      result.uploadedCount = pendingLogs.length;
    }

    // 3. PULL: Ambil data dari server yang mungkin baru
    const { data: remoteLogs, error: pullError } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', finalUserId)
      .eq('is_deleted', false)
      .order('logged_at', { ascending: false });

    if (pullError) {
      throw new Error(`Gagal mengambil data dari server: ${pullError.message}`);
    }

    if (remoteLogs && remoteLogs.length > 0) {
      const existingLogs = await getLocalLogs();
      const existingMap = new Set(existingLogs.map((l) => l.id));

      const newRemoteLogs: Log[] = remoteLogs
        .filter((r: any) => !existingMap.has(r.id))
        .map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          type: r.type,
          latitude: r.latitude,
          longitude: r.longitude,
          altitude: r.altitude ?? undefined,
          city: r.city,
          district: r.district,
          subdistrict: r.subdistrict ?? undefined,
          country: r.country,
          mood: r.mood ?? undefined,
          note: r.note ?? undefined,
          loggedAt: r.logged_at,
          isBlurred: Boolean(r.is_blurred),
          blurredLatitude: r.blurred_latitude ?? undefined,
          blurredLongitude: r.blurred_longitude ?? undefined,
          clientCreatedAt: r.client_created_at,
          syncStatus: 'synced',
        }));

      if (newRemoteLogs.length > 0) {
        await insertMultipleLocalLogs(newRemoteLogs);
        result.downloadedCount = newRemoteLogs.length;
      }
    }

    result.success = true;
    return result;
  } catch (err: any) {
    console.log('Sync error:', err);
    result.error = err?.message || 'Terjadi kesalahan sinkronisasi';
    result.success = false;
    return result;
  }
}
