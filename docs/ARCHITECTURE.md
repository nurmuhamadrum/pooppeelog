# Arsitektur Monorepo & Panduan Teknis
# Poop Pee Log ("Track. Log. Lega.")

Dokumen ini mendefinisikan struktur repositori monorepo, pembagian paket, konfigurasi dependensi bersama, dan panduan inisialisasi proyek menggunakan **Turborepo** dan **npm / pnpm workspaces**.

---

## 1. Topologi Repositori & Pembagian Paket

```
poop-pee-log/
├── apps/
│   ├── web/                        # WEBSITE LANDING PAGE (React 19 + Vite + Tailwind CSS)
│   │   ├── public/                 # Favicon, OpenGraph, aset lencana preview
│   │   ├── src/
│   │   │   ├── components/         # Hero, Features, Carousel, BadgeShowcase, Footer
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── mobile/                     # MOBILE APP (React Native + Expo SDK 52 + Expo Router)
│       ├── assets/                 # Ikon marker kustom Pee (kuning) & Poop (coklat)
│       ├── src/
│       │   ├── app/                # Expo Router File-based Routing
│       │   │   ├── (auth)/         # welcome.tsx, lock.tsx
│       │   │   ├── (tabs)/         # index.tsx (Map), timeline.tsx, stats.tsx, settings.tsx
│       │   │   └── modals/         # quick-log.tsx, mood-note.tsx
│       │   ├── components/         # MapMarkers, ClusterMarker, Sheet, Cards
│       │   ├── db/                 # SQLite / WatermelonDB Local Engine & SyncWorker
│       │   ├── hooks/              # useLocation, useAppLock, useSyncStatus
│       │   ├── services/           # Supabase client mobile & anonymous auth
│       │   └── store/              # Zustand state (filters, settings)
│       ├── app.json
│       └── package.json
│
├── packages/
│   ├── shared/                     # TYPESCRIPT SHARED CODE & DOMAIN LOGIC
│   │   ├── src/
│   │   │   ├── types/              # Domain Types (Log, Mood, Badge, Profile)
│   │   │   ├── constants/          # Master Badge Seed, Mood lists, Theme colors
│   │   │   ├── utils/              # Rumus Blur 50m, Kalkulasi Streak, Evaluasi Badge
│   │   │   ├── validators/         # Zod schemas (CreateLog, UpdateMood, Bounds)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── supabase/                   # DATABASE SCHEMA & MIGRATIONS
│       ├── migrations/             # SQL PostGIS scripts
│       └── config.toml
│
├── docs/                           # DOKUMENTASI PROYEK LENGKAP
│   ├── PRD.md                      # Product Requirements Document
│   ├── FSD.md                      # Functional Specification Document
│   ├── DATABASE_SCHEMA.sql         # SQL DDL PostGIS, RLS, Indexes, & Triggers
│   ├── FLOWCHARTS.md               # 6 Diagram Alur Kerja Mermaid & Teks
│   └── ARCHITECTURE.md             # Dokumen ini
│
├── package.json                    # Monorepo Root Configuration
├── turbo.json                      # Turborepo Build & Pipeline Cache
└── README.md                       # Petunjuk Setup Cepat
```

---

## 2. Hubungan Antar Paket (Dependency Graph)

```
             +----------------------------+
             |      packages/shared       |
             |  - Types (Log, Badge)      |
             |  - Zod Schemas             |
             |  - Rumus Blur 50m          |
             |  - Kalkulasi Streak        |
             +----------------------------+
                     ^            ^
                    /              \
                   /                \
+-----------------------+      +-----------------------+
|       apps/web        |      |      apps/mobile      |
|  - React + Vite       |      |  - React Native Maps  |
|  - Tailwind CSS       |      |  - SQLite Local Store |
|  - Mengimpor daftar   |      |  - Supabase Anonymous |
|    badge & metadata   |      |  - Mengimpor seluruh  |
|    untuk landing page |      |    types, rumus & Zod |
+-----------------------+      +-----------------------+
```

---

## 3. Konfigurasi Monorepo Inti

### 3.1 `package.json` (Root)
```json
{
  "name": "poop-pee-log",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "turbo run dev --filter=@poop-pee-log/web",
    "dev:mobile": "turbo run start --filter=@poop-pee-log/mobile",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "typescript": "^5.6.3"
  },
  "packageManager": "npm@11.8.0"
}
```

### 3.2 `turbo.json` (Pipeline Caching)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".expo/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## 4. Panduan Menjalankan Proyek

### 4.1 Menjalankan Website Landing Page
```bash
# Menjalankan dev server Vite untuk website di http://localhost:5173
npm run dev:web
```

### 4.2 Menjalankan Aplikasi Mobile Expo
```bash
# Menjalankan bundler Metro Expo untuk Android & iOS
npm run dev:mobile
```

### 4.3 Setup Supabase Database
1. Buka project Supabase Anda.
2. Masuk ke **SQL Editor**.
3. Jalankan seluruh isi skrip dari file:
   `docs/DATABASE_SCHEMA.sql`
4. Seluruh tabel (`profiles`, `logs`, `badges`, `user_badges`), fungsi PostGIS, trigger otomatis untuk akun tamu (*anonymous*), serta kebijakan isolasi Row Level Security (RLS) akan terpasang otomatis.
