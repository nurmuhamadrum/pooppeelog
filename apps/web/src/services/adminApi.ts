import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  AdminActivityLogItem,
  AdminStatOverview,
  AdminUserItem,
  CityDistribution,
  DailyLogStat,
  EditableBadge,
  EditableFAQ,
} from '../types/admin';

export interface OverviewResponse extends AdminStatOverview {
  cityDistribution: CityDistribution[];
  dailyStats: DailyLogStat[];
}

export async function signInAdminWithEmail(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { ok: false, error: 'Supabase belum dikonfigurasi pada apps/web/.env' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, error: error?.message || 'Email atau password salah.' };
  }

  // Cek apakah user memiliki hak akses admin
  const { data: isAdmin, error: rpcErr } = await supabase.rpc('is_current_user_admin');
  if (rpcErr) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: `Gagal verifikasi admin (${rpcErr.message}). Pastikan docs/ADMIN_SCHEMA.sql sudah dijalankan di Supabase.`,
    };
  }

  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: 'Akun ini tidak memiliki hak akses Admin (is_admin = false di tabel profiles).',
    };
  }

  return { ok: true };
}

export async function checkCurrentAdminSession(): Promise<{ authenticated: boolean; email?: string | null }> {
  if (!supabase || !isSupabaseConfigured) return { authenticated: false };
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return { authenticated: false };

  const { data: isAdmin } = await supabase.rpc('is_current_user_admin');
  if (!isAdmin) return { authenticated: false };
  return { authenticated: true, email: session.user.email };
}

export async function signOutAdmin(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function fetchAdminOverview(): Promise<OverviewResponse> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { data, error } = await supabase.rpc('admin_get_overview');
  if (error) throw new Error(error.message);

  return {
    totalUsers: Number(data?.totalUsers || 0),
    activeUsersToday: Number(data?.activeUsersToday || 0),
    totalLogs: Number(data?.totalLogs || 0),
    logsToday: Number(data?.logsToday || 0),
    totalPee: Number(data?.totalPee || 0),
    totalPoop: Number(data?.totalPoop || 0),
    totalCombo: Number(data?.totalCombo || 0),
    streakRecordDays: 0,
    citiesCovered: Number(data?.citiesCovered || 0),
    cityDistribution: Array.isArray(data?.cityDistribution) ? data.cityDistribution : [],
    dailyStats: Array.isArray(data?.dailyStats) ? data.dailyStats : [],
  };
}

export async function fetchAdminUsers(): Promise<AdminUserItem[]> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { data, error } = await supabase.rpc('admin_get_users');
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export async function fetchAdminRecentLogs(limitCount = 30): Promise<AdminActivityLogItem[]> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { data, error } = await supabase.rpc('admin_get_recent_logs', { limit_count: limitCount });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

// ==========================================
// FAQ CRUD (public.site_faqs)
// ==========================================
export async function fetchFaqsFromSupabase(onlyActive = false): Promise<EditableFAQ[]> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  let query = supabase.from('site_faqs').select('id, q, a, sort_order, is_active').order('sort_order', { ascending: true });
  if (onlyActive) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    id: row.id,
    q: row.q,
    a: row.a,
    order: row.sort_order,
    isActive: row.is_active,
  }));
}

export async function upsertFaqToSupabase(faq: EditableFAQ): Promise<void> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { error } = await supabase.from('site_faqs').upsert({
    id: faq.id,
    q: faq.q,
    a: faq.a,
    sort_order: faq.order,
    is_active: faq.isActive,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function saveFaqOrdersToSupabase(faqs: EditableFAQ[]): Promise<void> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const rows = faqs.map((f, idx) => ({
    id: f.id,
    q: f.q,
    a: f.a,
    sort_order: idx + 1,
    is_active: f.isActive,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('site_faqs').upsert(rows);
  if (error) throw new Error(error.message);
}

export async function deleteFaqFromSupabase(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { error } = await supabase.from('site_faqs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ==========================================
// BADGES CRUD (public.badges)
// ==========================================
export async function fetchBadgesFromSupabase(): Promise<EditableBadge[]> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { data, error } = await supabase
    .from('badges')
    .select('id, code, title, description, icon_name, mascot, category, requirement_text')
    .order('id', { ascending: true });
  if (error) throw new Error(error.message);

  return (data || []).map((b) => ({
    id: b.id,
    code: b.code,
    title: b.title,
    description: b.description,
    iconName: b.icon_name || 'award',
    mascot: (b.mascot as EditableBadge['mascot']) || 'LIL_DRIP',
    category: (b.category as EditableBadge['category']) || 'MILESTONE',
    requirementText: b.requirement_text || '',
  }));
}

export async function upsertBadgeToSupabase(badge: EditableBadge): Promise<void> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { error } = await supabase.from('badges').upsert({
    id: badge.id,
    code: badge.code,
    title: badge.title,
    description: badge.description,
    icon_name: badge.iconName,
    mascot: badge.mascot,
    category: badge.category,
    requirement_text: badge.requirementText,
    requirement_criteria: { label: badge.requirementText },
  });
  if (error) throw new Error(error.message);
}

export async function deleteBadgeFromSupabase(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase tidak tersedia');
  const { error } = await supabase.from('badges').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

