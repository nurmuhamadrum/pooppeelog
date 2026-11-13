import { supabase } from './supabase';

export type MobileFeedbackCategory = 'SUGGESTION' | 'BUG' | 'PRAISE' | 'OTHER';

export interface MobileSubmitFeedbackPayload {
  category: MobileFeedbackCategory;
  message: string;
  rating?: number;
  email?: string;
  userId?: string;
}

export async function submitMobileFeedback(
  payload: MobileSubmitFeedbackPayload
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('user_feedbacks').insert({
      category: payload.category,
      message: payload.message.trim(),
      rating: payload.rating || null,
      email: payload.email?.trim() || null,
      platform: 'MOBILE',
      user_id: payload.userId || null,
    });

    if (error) {
      console.warn('[Feedback] Supabase error:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Koneksi gagal';
    return { ok: false, error: msg };
  }
}

