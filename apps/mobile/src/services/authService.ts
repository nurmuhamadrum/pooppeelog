import { supabase } from './supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';

// Melengkapi proses auth session pada web browser modal
WebBrowser.maybeCompleteAuthSession();

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
  message?: string;
}

/**
 * 1. Daftar Akun Baru dengan Email & Password
 */
export async function signUpWithEmail(email: string, pass: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data.user,
      message: data.session
        ? 'Pendaftaran berhasil!'
        : 'Tautan konfirmasi telah dikirim ke email Anda. Silakan verifikasi untuk masuk.',
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal mendaftar' };
  }
}

/**
 * 2. Masuk dengan Email & Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal masuk' };
  }
}

/**
 * 3. Lupa Password (Kirim Email Reset)
 */
export async function resetPasswordForEmail(email: string): Promise<AuthResponse> {
  try {
    const redirectTo = Linking.createURL('/auth/reset-password');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Instruksi reset password telah dikirim ke email Anda.',
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal mengirim email reset password' };
  }
}

/**
 * 4. Masuk dengan Google OAuth (via Expo WebBrowser & Deep Linking)
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const redirectUrl = makeRedirectUri({
      scheme: 'pooppeelog',
      path: 'auth/callback',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (res.type === 'success' && res.url) {
        // Ambil session dari URL hash/query callback
        const urlObj = new URL(res.url);
        const params = new URLSearchParams(urlObj.hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            return { success: false, error: sessionError.message };
          }

          return { success: true, user: sessionData.user };
        }
      }
    }

    return { success: false, error: 'Proses login Google dibatalkan atau tidak selesai.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal autentikasi Google' };
  }
}

/**
 * 5. Keluar (Sign Out)
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
