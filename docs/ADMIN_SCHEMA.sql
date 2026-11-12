-- ==============================================================================
-- ADMIN DASHBOARD SCHEMA & RPC MIGRATION (Poop Pee Log)
-- ==============================================================================
-- Jalankan script ini di Supabase SQL Editor untuk mengaktifkan:
-- 1. Role Admin pada tabel public.profiles
-- 2. Tabel public.site_faqs untuk manajemen FAQ Landing Page
-- 3. Kolom mascot & requirement_text pada public.badges + RLS publik
-- 4. RPC Functions (SECURITY DEFINER) untuk statistik & daftar user/log real
-- ==============================================================================

-- 1. Tambah kolom is_admin pada profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Helper function cek apakah user saat ini adalah admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Lengkapi kolom pada public.badges agar sinkron dengan Web & Admin (termasuk bilingual EN/ID)
ALTER TABLE public.badges
ADD COLUMN IF NOT EXISTS mascot VARCHAR(30) NOT NULL DEFAULT 'LIL_DRIP',
ADD COLUMN IF NOT EXISTS requirement_text TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS title_en VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS requirement_text_en TEXT NOT NULL DEFAULT '';

-- Update seed data badges dengan mascot, requirement_text, dan terjemahan EN
UPDATE public.badges SET
    mascot = 'LIL_DRIP',
    requirement_text = 'Log pertama berhasil',
    title_en = 'First Timer',
    description_en = 'Recorded your very first bathroom log in history.',
    requirement_text_en = '1st log recorded'
WHERE id = 'badge_01';

UPDATE public.badges SET
    mascot = 'MR_PLOP',
    requirement_text = '3 kecamatan berbeda',
    title_en = 'City Explorer',
    description_en = 'Successfully logged relief in at least 3 different districts.',
    requirement_text_en = '3 different districts'
WHERE id = 'badge_02';

UPDATE public.badges SET
    mascot = 'SIR_FLUSH',
    requirement_text = 'Streak 7 hari beruntun',
    title_en = 'Smooth Flow',
    description_en = 'Maintained a daily logging streak for 7 consecutive days.',
    requirement_text_en = '7-day streak'
WHERE id = 'badge_03';

UPDATE public.badges SET
    mascot = 'LIL_DRIP',
    requirement_text = '2 kota berbeda',
    title_en = 'Traveler',
    description_en = 'Marked your relief trail in at least 2 different cities.',
    requirement_text_en = '2 different cities'
WHERE id = 'badge_04';

UPDATE public.badges SET
    mascot = 'SIR_FLUSH',
    requirement_text = 'Ketinggian > 1.000m',
    title_en = 'Peak Relief',
    description_en = 'Completed a relief session at an altitude above 1,000 meters.',
    requirement_text_en = 'Altitude > 1,000m'
WHERE id = 'badge_05';

-- RLS Badges: Publik dapat membaca master badges (untuk landing page & app), hanya admin yang bisa ubah
DROP POLICY IF EXISTS "Authenticated users can read master badges" ON public.badges;
DROP POLICY IF EXISTS "Public can read master badges" ON public.badges;
CREATE POLICY "Public can read master badges"
    ON public.badges FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "Admins can manage badges" ON public.badges;
CREATE POLICY "Admins can manage badges"
    ON public.badges FOR ALL
    USING (public.is_current_user_admin())
    WITH CHECK (public.is_current_user_admin());

-- 3. Tabel SITE_FAQS (Manajemen Konten FAQ Landing Page - Bilingual ID & EN)
CREATE TABLE IF NOT EXISTS public.site_faqs (
    id TEXT PRIMARY KEY,
    q TEXT NOT NULL,
    a TEXT NOT NULL,
    q_en TEXT NOT NULL DEFAULT '',
    a_en TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.site_faqs
ADD COLUMN IF NOT EXISTS q_en TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS a_en TEXT NOT NULL DEFAULT '';

ALTER TABLE public.site_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active faqs" ON public.site_faqs;
CREATE POLICY "Public can read active faqs"
    ON public.site_faqs FOR SELECT
    USING (is_active = TRUE OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can manage faqs" ON public.site_faqs;
CREATE POLICY "Admins can manage faqs"
    ON public.site_faqs FOR ALL
    USING (public.is_current_user_admin())
    WITH CHECK (public.is_current_user_admin());

-- Seed data FAQ awal (ID & EN)
INSERT INTO public.site_faqs (id, q, a, q_en, a_en, sort_order, is_active)
VALUES
(
    'faq_1',
    'Apakah aplikasi ini bisa mencari toilet umum terdekat?',
    'Tidak. Poop Pee Log BUKAN aplikasi pencari toilet umum. Aplikasi ini adalah buku harian pribadi (personal diary & tracker) untuk mendokumentasikan tempat dan waktu di mana Anda sendiri buang air, layaknya aplikasi Strava untuk aktivitas biologis.',
    'Can this app find the nearest public toilet?',
    'No. Poop Pee Log is NOT a public toilet finder. It is a personal biological diary and tracker to log where and when you relieve yourself, just like Strava for your bathroom habits.',
    1,
    TRUE
),
(
    'faq_2',
    'Apakah ada fitur untuk memberi rating kebersihan toilet?',
    'Tidak ada. Kami tidak menyediakan rating kloset, review kebersihan, atau penilaian fasilitas publik. Semua catatan dan mood murni untuk evaluasi dan kesenangan pribadi Anda.',
    'Is there a feature to rate toilet cleanliness?',
    'No. We do not provide toilet ratings, cleanliness reviews, or public facility scores. All notes and moods are strictly for your own personal tracking and enjoyment.',
    2,
    TRUE
),
(
    'faq_3',
    'Apakah teman atau orang lain bisa melihat catatan saya?',
    'Sama sekali tidak bisa. Poop Pee Log menganut prinsip Zero Social. Tidak ada feed pertemanan, tidak ada tautan publik, dan tidak ada leaderboard. Data Anda diisolasi menggunakan Row Level Security (RLS) dan kunci aplikasi PIN/Biometrik.',
    'Can friends or other people see my logs?',
    'Never. Poop Pee Log follows a strict Zero Social principle. There are no friend feeds, no public links, and no leaderboards. Your data is isolated with Row Level Security (RLS) and biometric app lock.',
    3,
    TRUE
),
(
    'faq_4',
    'Apakah saya bisa mencatat log saat tidak ada sinyal internet?',
    'Tentu saja! Poop Pee Log dibangun dengan arsitektur Offline-First. Anda bisa mencatat di toilet basement mall atau di puncak gunung tanpa sinyal. Data akan tersimpan di memori HP Anda dan disinkronkan otomatis saat terhubung ke internet.',
    'Can I record a log when there is no internet connection?',
    'Of course! Poop Pee Log is built with an Offline-First architecture. You can log in a basement restroom or on a mountain peak without signal. Logs are stored locally on your phone and auto-sync when back online.',
    4,
    TRUE
),
(
    'faq_5',
    'Apakah saya wajib mendaftarkan email saat pertama kali pakai?',
    'Tidak wajib. Anda bisa langsung menggunakan mode tamu (Anonymous Guest) dalam hitungan detik setelah instalasi. Anda baru diminta menghubungkan Google/Apple ID jika ingin mencadangkan data lintas perangkat.',
    'Do I have to register an email before using the app?',
    'Not required. You can start immediately in Anonymous Guest mode seconds after installing. You only need to link an email or Google account if you want multi-device cloud backup.',
    5,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    q_en = CASE WHEN public.site_faqs.q_en = '' THEN EXCLUDED.q_en ELSE public.site_faqs.q_en END,
    a_en = CASE WHEN public.site_faqs.a_en = '' THEN EXCLUDED.a_en ELSE public.site_faqs.a_en END;

-- 4. RPC: Statistik Global untuk Admin Dashboard
CREATE OR REPLACE FUNCTION public.admin_get_overview()
RETURNS JSONB AS $$
DECLARE
    v_total_users BIGINT;
    v_active_today BIGINT;
    v_total_logs BIGINT;
    v_logs_today BIGINT;
    v_total_pee BIGINT;
    v_total_poop BIGINT;
    v_total_combo BIGINT;
    v_cities_covered BIGINT;
    v_city_dist JSONB;
    v_daily_stats JSONB;
    v_today_start TIMESTAMPTZ;
BEGIN
    IF NOT public.is_current_user_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    v_today_start := DATE_TRUNC('day', TIMEZONE('Asia/Jakarta', NOW())) AT TIME ZONE 'Asia/Jakarta';

    SELECT COUNT(*) INTO v_total_users FROM public.profiles;

    SELECT COUNT(DISTINCT user_id) INTO v_active_today
    FROM public.logs
    WHERE is_deleted = FALSE AND logged_at >= v_today_start;

    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE logged_at >= v_today_start),
        COUNT(*) FILTER (WHERE type = 'PEE'),
        COUNT(*) FILTER (WHERE type = 'POOP'),
        COUNT(*) FILTER (WHERE type = 'COMBO'),
        COUNT(DISTINCT NULLIF(TRIM(city), ''))
    INTO v_total_logs, v_logs_today, v_total_pee, v_total_poop, v_total_combo, v_cities_covered
    FROM public.logs
    WHERE is_deleted = FALSE;

    -- Distribusi Top 6 Kota
    SELECT COALESCE(jsonb_agg(row_to_json(c)), '[]'::jsonb)
    INTO v_city_dist
    FROM (
        SELECT
            COALESCE(NULLIF(TRIM(city), ''), 'Tidak Diketahui') AS city,
            COUNT(*) AS count,
            ROUND((COUNT(*)::NUMERIC / GREATEST(v_total_logs, 1)) * 100, 1) AS percentage
        FROM public.logs
        WHERE is_deleted = FALSE
        GROUP BY COALESCE(NULLIF(TRIM(city), ''), 'Tidak Diketahui')
        ORDER BY count DESC
        LIMIT 6
    ) c;

    -- Statistik Harian 7 Hari Terakhir
    SELECT COALESCE(jsonb_agg(row_to_json(d) ORDER BY d.day_date ASC), '[]'::jsonb)
    INTO v_daily_stats
    FROM (
        SELECT
            gs.day_date,
            TO_CHAR(gs.day_date, 'DD Mon') AS date,
            COUNT(l.id) FILTER (WHERE l.type = 'PEE') AS pee,
            COUNT(l.id) FILTER (WHERE l.type = 'POOP') AS poop,
            COUNT(l.id) FILTER (WHERE l.type = 'COMBO') AS combo,
            COUNT(l.id) AS total
        FROM GENERATE_SERIES(
            (TIMEZONE('Asia/Jakarta', NOW())::DATE - INTERVAL '6 days')::DATE,
            TIMEZONE('Asia/Jakarta', NOW())::DATE,
            INTERVAL '1 day'
        ) AS gs(day_date)
        LEFT JOIN public.logs l
            ON l.is_deleted = FALSE
            AND (TIMEZONE('Asia/Jakarta', l.logged_at))::DATE = gs.day_date
        GROUP BY gs.day_date
    ) d;

    RETURN jsonb_build_object(
        'totalUsers', v_total_users,
        'activeUsersToday', v_active_today,
        'totalLogs', v_total_logs,
        'logsToday', v_logs_today,
        'totalPee', v_total_pee,
        'totalPoop', v_total_poop,
        'totalCombo', v_total_combo,
        'citiesCovered', v_cities_covered,
        'cityDistribution', v_city_dist,
        'dailyStats', v_daily_stats
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: Daftar Pengguna untuk Admin Dashboard
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_current_user_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    RETURN COALESCE((
        SELECT jsonb_agg(row_to_json(u))
        FROM (
            SELECT
                p.id,
                p.email,
                COALESCE(p.display_name, CASE WHEN p.is_anonymous THEN 'Tamu #' || LEFT(p.id::TEXT, 4) ELSE SPLIT_PART(COALESCE(p.email, 'User'), '@', 1) END) AS "displayName",
                p.is_anonymous AS "isAnonymous",
                COALESCE(lc.total_logs, 0) AS "totalLogs",
                COALESCE(bc.badges_count, 0) AS "badgesCount",
                COALESCE(TO_CHAR(TIMEZONE('Asia/Jakarta', lc.last_active), 'DD Mon YYYY, HH24:MI'), '-') AS "lastActive",
                TO_CHAR(TIMEZONE('Asia/Jakarta', p.created_at), 'DD Mon YYYY') AS "joinedAt"
            FROM public.profiles p
            LEFT JOIN (
                SELECT user_id, COUNT(*) AS total_logs, MAX(logged_at) AS last_active
                FROM public.logs
                WHERE is_deleted = FALSE
                GROUP BY user_id
            ) lc ON lc.user_id = p.id
            LEFT JOIN (
                SELECT user_id, COUNT(*) AS badges_count
                FROM public.user_badges
                GROUP BY user_id
            ) bc ON bc.user_id = p.id
            ORDER BY COALESCE(lc.last_active, p.created_at) DESC
            LIMIT 100
        ) u
    ), '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: Aktivitas Log Terbaru untuk Admin Dashboard
CREATE OR REPLACE FUNCTION public.admin_get_recent_logs(limit_count INTEGER DEFAULT 30)
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_current_user_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    RETURN COALESCE((
        SELECT jsonb_agg(row_to_json(r))
        FROM (
            SELECT
                l.id,
                COALESCE(p.email, p.display_name, 'Tamu #' || LEFT(p.id::TEXT, 4)) AS "userEmail",
                l.type::TEXT AS type,
                COALESCE(l.district, 'Tidak Diketahui') AS district,
                COALESCE(l.city, 'Tidak Diketahui') AS city,
                COALESCE(l.mood, 'Lega') AS mood,
                l.note,
                TO_CHAR(TIMEZONE('Asia/Jakarta', l.logged_at), 'DD Mon YYYY, HH24:MI') AS "loggedAt"
            FROM public.logs l
            LEFT JOIN public.profiles p ON p.id = l.user_id
            WHERE l.is_deleted = FALSE
            ORDER BY l.logged_at DESC
            LIMIT limit_count
        ) r
    ), '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
