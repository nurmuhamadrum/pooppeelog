# Poop Pee Log 🚽 🧻

> **"Track. Log. Lega."**  
> Aplikasi *personal diary* / *lifelogger* buang air kecil (Pee) dan buang air besar (Poop) yang sat-set, privat, dan estetik.

---

## 🌟 Konsep Inti

Poop Pee Log adalah aplikasi buku harian biologis mandiri.
- ❌ **Bukan** aplikasi pencari toilet umum.
- ❌ **Bukan** aplikasi rating atau review kebersihan kloset.
- ❌ **Bukan** aplikasi jejaring sosial atau feed oversharing.
- ✅ **100% Personal & Privat**: Seperti Strava, namun khusus mencatat jejak lega untuk diri sendiri.

---

## 📚 Dokumentasi Proyek Lengkap

Semua spesifikasi kebutuhan produk, arsitektur teknis, dan diagram alur sistem telah didokumentasikan secara komprehensif di dalam folder `docs/`:

1. **[Product Requirements Document (PRD)](./docs/PRD.md)**  
   *Latar belakang, visi, persona pengguna, metrik KPI, batasan ruang lingkup In/Out Fase 1, dan user stories.*
2. **[Functional Specification Document (FSD)](./docs/FSD.md)**  
   *Daftar lengkap layar Web & Mobile, detail komponen UI, penanganan state (Loading, Error, Empty, Offline), validasi Zod, algoritma streak, dan rumus geodetic blur 50m.*
3. **[Database Schema & PostGIS DDL](./docs/DATABASE_SCHEMA.sql)**  
   *Skema basis data Supabase (PostgreSQL 15 + PostGIS), RLS policies, trigger otomatis anonymous auth, dan seed data 5 lencana awal.*
4. **[System Flowcharts & Guide](./docs/FLOWCHARTS.md)**  
   *6 Diagram alur Mermaid dan penjelasan teks langkah-demi-langkah: Onboarding & App Lock, 3-Detik Log Engine, Map & Clustering, Timeline & Delete, Stats & Badge Unlock, serta Offline-First Sync.*
5. **[Monorepo Architecture & Setup Guide](./docs/ARCHITECTURE.md)**  
   *Topologi monorepo Turborepo dengan `apps/web` (React + Vite), `apps/mobile` (React Native Expo), dan `packages/shared`.*
6. **[Figma Design System & Mockup Specs](./docs/FIGMA_DESIGN_SYSTEM.md)**  
   *Spesifikasi hierarki frame Figma, auto-layout, design tokens (warna, font, shadow), dan panduan impor.*
7. **[Interactive HTML Mockup Prototype](./docs/mockup.html)**  
   *File prototype interaktif web & mobile yang bisa dibuka di browser dan diimpor langsung ke Figma.*

---

## 🛠️ Tech Stack Acuan

- **Website Landing Page**: React 19 + Vite + TypeScript + Tailwind CSS
- **Mobile App**: React Native (Expo SDK 52+) + Expo Router + TypeScript
- **Peta Mobile**: React Native Maps (Apple Maps & Google Maps native, 100% gratis tanpa biaya API token pihak ketiga)
- **Backend / Database**: Supabase (PostgreSQL 15 + PostGIS, Row Level Security, Supabase Auth dengan Anonymous Guest Sign-In)
- **Local Database / Offline Queue**: SQLite / WatermelonDB + AsyncStorage + SecureStore
- **State Management**: Zustand + TanStack Query

---

## 🚀 Prinsip Desain yang Tidak Boleh Dilanggar

1. **3-Detik / 2-Tap Log**: Menekan `+ LOG` lalu memilih `PEE` atau `POOP` langsung menyimpan data dalam $<100\text{ ms}$. Mood dan catatan bersifat opsional dalam bottom sheet non-blocking.
2. **Privacy First**: Data terisolasi penuh oleh Row Level Security (RLS). Tidak ada feed publik.
3. **Offline First**: Logging tetap berfungsi normal di toilet basement atau tempat tanpa sinyal, tersinkronisasi otomatis saat online kembali.
4. **Anonymous Onboarding**: Pengguna dapat langsung menggunakan aplikasi seketika tanpa kewajiban mendaftar akun di awal.
