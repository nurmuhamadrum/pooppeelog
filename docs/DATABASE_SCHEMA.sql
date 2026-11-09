-- ==============================================================================
-- DATABASE SCHEMA: POOP PEE LOG (PostgreSQL 15 + PostGIS)
-- ==============================================================================
-- Deskripsi: Skema basis data lengkap untuk aplikasi Poop Pee Log di Supabase.
-- Mencakup tabel logs, badges, user_badges, profiles, indeks PostGIS,
-- fungsi trigger, Row Level Security (RLS), dan seed data lencana.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE log_type_enum AS ENUM ('PEE', 'POOP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE badge_category_enum AS ENUM ('MILESTONE', 'EXPLORATION', 'STREAK', 'ELEVATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Sinkronisasi dengan Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT DEFAULT 'Lega Explorer',
    pin_hash TEXT, -- PIN 4-digit terenkripsi untuk fallback app lock lokal
    biometric_enabled BOOLEAN DEFAULT FALSE,
    blur_location_default BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger Otomatis Pembuatan Profile Saat User Mendaftar (Termasuk Anonymous Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, is_anonymous)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.is_anonymous, FALSE)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. LOGS TABLE (Transaksi Buang Air Kecil & Besar)
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type log_type_enum NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
    altitude DOUBLE PRECISION DEFAULT 0.0,
    city VARCHAR(100) DEFAULT 'Tidak Diketahui',
    district VARCHAR(100) DEFAULT 'Tidak Diketahui',
    subdistrict VARCHAR(100),
    country VARCHAR(50) DEFAULT 'ID',
    mood VARCHAR(50),
    note VARCHAR(100),
    logged_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    is_blurred BOOLEAN DEFAULT FALSE,
    blurred_latitude DOUBLE PRECISION,
    blurred_longitude DOUBLE PRECISION,
    client_created_at TIMESTAMPTZ NOT NULL,
    sync_version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete untuk tombstone sync offline
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indeks Performa & Spasial
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_logged_at ON public.logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_location ON public.logs USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_logs_city_district ON public.logs(city, district);
CREATE INDEX IF NOT EXISTS idx_logs_is_deleted ON public.logs(is_deleted);

-- 5. BADGES MASTER TABLE
CREATE TABLE IF NOT EXISTS public.badges (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    category badge_category_enum NOT NULL,
    requirement_criteria JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. USER_BADGES TABLE (Lencana yang Berhasil Diraih User)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    trigger_log_id UUID REFERENCES public.logs(id) ON DELETE SET NULL,
    CONSTRAINT unique_user_badge UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles: Hanya pemilik yang bisa melihat dan mengubah
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Logs: Isolasi 100% - Pengguna HANYA dapat membaca, menambah, mengubah, dan menghapus log milik sendiri
DROP POLICY IF EXISTS "Users can manage own logs" ON public.logs;
CREATE POLICY "Users can manage own logs"
    ON public.logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Badges: Semua user terautentikasi (termasuk anonymous) dapat membaca master data badge
DROP POLICY IF EXISTS "Authenticated users can read master badges" ON public.badges;
CREATE POLICY "Authenticated users can read master badges"
    ON public.badges FOR SELECT
    USING (auth.role() = 'authenticated');

-- User Badges: Pengguna hanya dapat membaca dan mencatat badge mereka sendiri
DROP POLICY IF EXISTS "Users can view own unlocked badges" ON public.user_badges;
CREATE POLICY "Users can view own unlocked badges"
    ON public.user_badges FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own unlocked badges" ON public.user_badges;
CREATE POLICY "Users can insert own unlocked badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 8. SEED DATA BADGES PERDANA (FASE 1)
INSERT INTO public.badges (id, code, title, description, icon_name, category, requirement_criteria)
VALUES 
(
    'badge_01', 
    'PENDATANG_BARU', 
    'Pendatang Baru', 
    'Mencatat log buang air pertama kali dalam sejarah hidupmu.', 
    'award', 
    'MILESTONE', 
    '{"type": "total_logs", "count": 1}'::jsonb
),
(
    'badge_02', 
    'PENJELAJAH_KOTA', 
    'Penjelajah Kota', 
    'Berhasil buang air di minimal 3 kecamatan yang berbeda.', 
    'compass', 
    'EXPLORATION', 
    '{"type": "unique_districts", "count": 3}'::jsonb
),
(
    'badge_03', 
    'LANCAR_JAYA', 
    'Lancar Jaya', 
    'Menjaga streak pencatatan buang air selama 7 hari berturut-turut tanpa putus.', 
    'flame', 
    'STREAK', 
    '{"type": "streak_days", "count": 7}'::jsonb
),
(
    'badge_04', 
    'MUSAFIR', 
    'Musafir', 
    'Menandai jejak buang air di minimal 2 kota atau kabupaten yang berbeda.', 
    'map-pin', 
    'EXPLORATION', 
    '{"type": "unique_cities", "count": 2}'::jsonb
),
(
    'badge_05', 
    'PUNCAK_LEGA', 
    'Puncak Lega', 
    'Berhasil menuntaskan hajat di dataran tinggi berketinggian lebih dari 1.000 mdpl.', 
    'mountain', 
    'ELEVATION', 
    '{"type": "min_altitude_meters", "altitude": 1000}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    requirement_criteria = EXCLUDED.requirement_criteria;
