<div align="center">

# 🚽 Poop Pee Log 🧻
### *"Track. Log. Lega."*

**Aplikasi *personal biological lifelogger* buang air kecil (Pee) dan buang air besar (Poop) yang sat-set 3-detik, 100% privat, estetik, dan menyenangkan.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_52+-000020.svg)](https://expo.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase_PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/nurmuhamadrum/pooppeelog/pulls)

[📱 Fitur Utama](#-fitur-unggulan) • [📱 Antarmuka Aplikasi](#-antarmuka-aplikasi) • [🎭 Trio Maskot](#-trio-maskot-resmi) • [🛠️ Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek) • [📚 Dokumentasi](#-indeks-dokumentasi-lengkap)

</div>

---

## 📱 Antarmuka Aplikasi

Aplikasi **Poop Pee Log** (Mobile App & Web Simulator) mengusung tema *Warm Dark Canvas* (`#1E1A17`), kontras ramah mata, dan alur sat-set:

| 🗺️ **1. Peta Pribadi Realtime** | ⚡ **2. Quick Log 3-Detik** | 📖 **3. Buku Harian & Streak** |
| :--- | :--- | :--- |
| • Radar denyut GPS aktif dengan titik lokasi presisi.<br/>• Pin maskot **Lil' Drip** (Pee `#F5B700`) & **Mr. Plop** (Poop `#8B5E3C`).<br/>• Pilihan tema peta: *Dark Mode*, *Vintage Cream*, dan *OS Standard*.<br/>• Filter bar (`ALL`, `PEE`, `POOP`, `COMBO`) & kartu pop-up detail lokasi.<br/>• 100% peta pribadi tanpa pelacak pihak ketiga. | • Modal taktil 2-tap sat-set ($<100\text{ ms}$).<br/>• Tombol besar **Lil' Drip** (Pee) & **Mr. Plop** (Poop) berdampingan.<br/>• Tombol penuh **Sir Flush** untuk kombo kencing & BAB sekaligus.<br/>• Pemilih mood kelegaan (*Lega Banget, Nahan Lama, Darurat*).<br/>• Otomatis merekam waktu dan koordinat GPS. | • Tampilan buku harian riwayat lengkap sesuai simulator web.<br/>• Kartu catatan harian dengan avatar maskot sesuai tipe log.<br/>• Waktu presisi, distrik/kota, dan kutipan catatan personal.<br/>• Banner **Streak 7 Hari Beruntun** untuk habit sehat.<br/>• Navigasi tab bar dengan tombol FAB `+ LOG` emas tengah. |

---

## 🌟 Konsep & Filosofi Produk

Poop Pee Log dirancang murni untuk kepuasan pribadi (*personal biological satisfaction*), layaknya **Strava**, namun khusus mencatat jejak kelegaan diri sendiri:

- ❌ **Bukan aplikasi pencari toilet umum**: Tidak menampilkan daftar toilet umum terdekat atau fasilitas umum.
- ❌ **Bukan aplikasi ulasan / rating kloset**: Tidak ada review kebersihan atau foto fasilitas umum.
- ❌ **Bukan media sosial / oversharing**: Tidak ada *friend feed*, tombol *like*, komentar orang asing, atau leaderboard publik.
- ✅ **100% Personal & Privat**: Seluruh riwayat koordinat dan waktu buang air Anda hanya milik Anda.
- ✅ **Offline-First & Anonymous**: Mulai mencatat seketika tanpa login wajib (menggunakan SQLite lokal). Opsi sinkronisasi cloud pribadi tersedia kapan saja.

---

## 🎭 Trio Maskot Resmi

Untuk mengubah rutinitas biologis menjadi pengalaman yang ceria dan santai, Poop Pee Log ditemani oleh trio maskot ramah dengan warna token resmi aplikasi:

| Maskot | Peran & Identitas | Warna Token Resmi | Kepribadian & Fungsi |
| :---: | :--- | :---: | :--- |
| 🍫<br/>**Mr. Plop** | **Poop Companion**<br/>*(Buang Air Besar)* | `#8B5E3C`<br/>*(Poop Brown)* | Karakter *swirl* coklat hangat (`#C98A58` → `#7A4824`) dengan mata berbinar dan pipi merona (`#FF6B6B`). Selalu siap merayakan setiap buang air besar yang sehat dan plong tanpa canggung. |
| 💧<br/>**Lil' Drip** | **Pee Companion**<br/>*(Buang Air Kecil)* | `#F5B700` &amp; `#3BA3E8`<br/>*(Pee Amber / Drip Blue)* | Tetesan air biru segar (`#67D5FD` → `#0E78C2`) di atas lingkaran kuning emas (`#F5B700`). Mengingatkan hidrasi sehat dan membantu mencatat buang air kecil dalam sekejap. |
| 🚽<br/>**Sir Flush** | **Combo & Privacy Guardian**<br/>*(Kloset Pelindung)* | `#2FB8AC`<br/>*(Both Teal)* | Kloset putih keramik bersahabat dengan tuas emas dan pusaran air teal (`#2FB8AC`). Menjaga Mr. Plop dan Lil' Drip, melambangkan sesi kombo serta pelindung privasi data biometrik. |

> 🔊 **Fitur Unik Landing Page:** Buka website landing page dan klik maskot trio di panggung interaktif untuk mendengarkan efek suara Web Audio API interaktif!

---

## ⚡ Fitur Unggulan

### 1. 📱 Aplikasi Mobile (React Native + Expo)
- **3-Second Quick Log**: Rekam sesi buang air dalam 2 ketukan dengan responsivitas tinggi.
- **Peta Interaktif & Radar GPS**: Menampilkan lingkaran radar GPS berdenyut (*pulse*) dan pin koordinat maskot.
- **Buku Harian (Diary Timeline)**: Riwayat lengkap terfilter berdasarkan tipe (`Pee`, `Poop`, `Kombo`), mood, dan rentang tanggal kustom menggunakan native date picker.
- **Streak & Lencana Gamifikasi**: Menghitung streak harian beruntun dan membuka lencana pencapaian otomatis.
- **Keamanan Biometrik (App Lock)**: Proteksi pembukaan aplikasi dengan Face ID / Sidik Jari.
- **Cadangkan & Pulihkan (JSON Export/Import)**: Ekspor seluruh riwayat data lokal ke file JSON standar atau pulihkan kapan saja.
- **Kritik & Saran Langsung**: Formulir feedback bawaan aplikasi yang langsung terhubung ke dashboard admin.
- **Bilingual Penuh**: Pilihan bahasa Indonesia dan English yang sinkron di seluruh komponen.

### 2. 🌐 Website Landing Page (Vite + React 19 + Tailwind)
- **Hero Interaktif**: Panggung animasi maskot dengan reaksi klik dan suara interaktif (*Web Audio API*).
- **Simulator Aplikasi Langsung**: Uji coba alur aplikasi mobile langsung di layar browser melalui simulator interaktif.
- **Bilingual CMS**: Menampilkan FAQ dinamis dan master lencana yang dapat diubah langsung dari Admin Dashboard.
- **Formulir Feedback Pengunjung**: Kolom kirim kritik, saran fitur, rating bintang, dan laporan bug.
- **Dukungan Saweria**: Integrasi tombol donasi kopi langsung ke Saweria.
- **Kursor Khusus Mr. Plop & Favicon Maskot**: Pengalaman visual menyenangkan sejak pertama kali memuat halaman.

### 3. 🛡️ Web Admin Dashboard (`/admin` atau `#/admin`)
- **Statistik Global Realtime**: Ringkasan total pengguna, total log harian, rasio Pee vs Poop, cakupan kota, dan grafik tren aktivitas.
- **Manajemen Pengguna & Log**: Pantau aktivitas logging terbaru dan akun pengguna secara aman dengan Supabase Auth & RPC.
- **CMS Konten FAQ & Lencana**: Tambah, sunting, atur urutan, dan kelola teks FAQ serta Lencana dalam bahasa Indonesia dan Inggris.
- **Tab Kritik & Saran Pengguna**: Tinjau, filter berdasarkan platform (`WEB` / `MOBILE`), cari berdasarkan pesan/email, dan kelola feedback dari pengguna.

---

## 🏗️ Topologi Monorepo

Proyek ini dikelola menggunakan struktur **Turborepo** monorepo yang bersih dan terisolasi:

```text
pooppeelog/
├── apps/
│   ├── mobile/                    # Aplikasi Mobile (Expo SDK 52+, React Native, Expo Router)
│   │   ├── app/                   # File-based routing Expo Router ((tabs), auth, dll.)
│   │   ├── src/
│   │   │   ├── components/        # Komponen UI (FeedbackModal, MascotIcons, dll.)
│   │   │   ├── db/                # SQLite local storage & offline queue
│   │   │   ├── i18n/              # Terjemahan bilingual ID & EN
│   │   │   ├── services/          # Supabase client, auth & feedback service
│   │   │   └── store/             # Zustand global state (useAppStore)
│   │   └── package.json
│   │
│   └── web/                       # Landing Page & Admin Dashboard (React 19, Vite, Tailwind)
│       ├── src/
│       │   ├── components/        # HeroSection, MascotSection, FeedbackSection, dll.
│       │   │   └── admin/         # AdminDashboard, StatsTab, UsersTab, FaqTab, BadgesTab, FeedbackTab
│       │   ├── i18n/              # LanguageContext & Web bilingual copy
│       │   ├── services/          # adminApi.ts (RPC Supabase client)
│       │   └── types/             # Tipe TypeScript admin & log
│       └── package.json
│
├── packages/
│   └── shared/                    # Kontrak TypeScript, tipe data, & konstanta bersama
│
├── docs/                          # Dokumentasi teknis lengkap (PRD, FSD, SQL, Diagram)
│   ├── assets/                    # Aset grafis SVG (mockup-showcase.svg, mascots-banner.svg)
│   ├── ADMIN_SCHEMA.sql           # Skema admin, FAQ, Badges CMS, Feedback table, & RPC
│   ├── DATABASE_SCHEMA.sql        # Skema awal PostGIS, Logs, & User Profiles
│   ├── FLOWCHARTS.md              # Diagram alur sistem Mermaid
│   ├── FSD.md                     # Functional Specification Document
│   └── PRD.md                     # Product Requirements Document
│
├── package.json                   # Root package.json (npm workspaces)
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat
- **Node.js**: Versi `18.x` atau `>= 20.x`
- **npm** atau **pnpm**
- **Expo Go** pada ponsel fisik (iOS/Android) atau Simulator/Emulator lokal

### 1. Kloning Repositori & Pasang Dependensi
```bash
git clone https://github.com/nurmuhamadrum/pooppeelog.git
cd pooppeelog

# Pasang seluruh dependensi monorepo
npm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` atau buat `.env` di masing-masing workspace:

**Pada `apps/web/.env`**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Pada `apps/mobile/.env`**:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Migrasi Database Supabase
Buka **SQL Editor** pada dashboard proyek Supabase Anda dan jalankan secara berurutan:
1. Jalankan [`docs/DATABASE_SCHEMA.sql`](./docs/DATABASE_SCHEMA.sql) untuk tabel dasar logs, profiles, dan PostGIS.
2. Jalankan [`docs/ADMIN_SCHEMA.sql`](./docs/ADMIN_SCHEMA.sql) untuk mengaktifkan role admin, tabel FAQ, tabel Feedback, dan RPC fungsi statistik.

### 4. Menjalankan Server Lokal

#### Menjalankan Website Landing Page & Admin:
```bash
npm run dev --workspace=@poop-pee-log/web
```
- Akses Landing Page: `http://localhost:5173`
- Akses Admin Portal: `http://localhost:5173/#/admin`

#### Menjalankan Aplikasi Mobile (Expo):
```bash
npm run start --workspace=@poop-pee-log/mobile
```
- Tekan `i` untuk membuka iOS Simulator.
- Tekan `a` untuk membuka Android Emulator.
- Pindai QR Code dengan aplikasi **Expo Go** pada ponsel fisik.

#### Memeriksa TypeScript & Build:
```bash
# Validasi TypeScript Mobile
./node_modules/.bin/tsc -p apps/mobile/tsconfig.json --noEmit

# Validasi Build Web
npm run build --workspace=@poop-pee-log/web
```

---

## 📚 Indeks Dokumentasi Lengkap

Seluruh aspek produk dan teknis didokumentasikan secara rinci di direktori `docs/`:

1. 📄 **[Product Requirements Document (PRD)](./docs/PRD.md)**: Visi produk, persona pengguna, batasan scope, dan user stories.
2. 📋 **[Functional Specification Document (FSD)](./docs/FSD.md)**: Spesifikasi setiap layar, penanganan state, validasi Zod, dan algoritma streak.
3. 🗄️ **[Database Schema & PostGIS DDL](./docs/DATABASE_SCHEMA.sql)**: DDL basis data Supabase PostgreSQL + PostGIS dan RLS policies.
4. 👑 **[Admin & Feedback Schema](./docs/ADMIN_SCHEMA.sql)**: Skema role admin, RPC aggregation functions, CMS FAQ/Lencana, dan tabel `user_feedbacks`.
5. 📊 **[System Flowcharts & Guide](./docs/FLOWCHARTS.md)**: 6 Diagram alur Mermaid: Onboarding, Quick Log, Peta, Timeline, Gamifikasi, dan Sinkronisasi Offline.
6. 🏛️ **[Monorepo Architecture Guide](./docs/ARCHITECTURE.md)**: Arsitektur monorepo Turborepo, dependensi packages, dan alur data.
7. 🎨 **[Figma Design System Specification](./docs/FIGMA_DESIGN_SYSTEM.md)**: Spesifikasi auto-layout frame Figma, palet token 10 warna, dan hierarki komponen.
8. 🧪 **[Interactive HTML Mockup Prototype](./docs/mockup.html)**: Prototipe interaktif mandiri yang dapat dibuka langsung di peramban web.

---

## ☕ Dukung Pengembang

Poop Pee Log dibuat sebagai proyek independen yang **100% bebas iklan** dan **tidak pernah menjual data pengguna**. Anda dapat mendukung biaya server dan kopi pengembangan melalui Saweria:

<div align="center">
  <a href="https://saweria.co/pooppeelog" target="_blank">
    <img src="https://img.shields.io/badge/Saweria-Traktir%20Kopi-FAAE2B?style=for-the-badge&logo=coffee&logoColor=black" alt="Dukung di Saweria" />
  </a>
</div>

---

## ⚠️ Medical Disclaimer

> **Pernyataan Medis:**  
> Poop Pee Log dirancang sebagai buku harian catatan pribadi mandiri (*self-tracking lifelogger*). Aplikasi ini **bukan perangkat medis** dan tidak dimaksudkan untuk mendiagnosis, mengobati, menyembuhkan, atau mencegah penyakit maupun keluhan klinis apa pun. Selalu konsultasikan dengan dokter atau tenaga medis profesional bersertifikat apabila Anda mengalami masalah kesehatan pencernaan atau saluran kemih.

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi **MIT**. Lihat berkas [LICENSE](./LICENSE) untuk informasi lebih lanjut.

<div align="center">
  <sub>Dibuat dengan ❤️ dan rasa lega oleh <b>Tim Poop Pee Log</b> © 2026. Seluruh hak cipta dilindungi undang-undang.</sub>
</div>
