# Product Requirements Document (PRD)
# Poop Pee Log ("Track. Log. Lega.")

**Versi Dokumen**: 1.0.0 (MVP Fase 1)  
**Tanggal**: 9 November 2026  
**Status**: Disetujui (Approved)  
**Target Rilis MVP**: Q1 2027  
**Platform**: Web (Landing Page) & Mobile (Android & iOS via React Native Expo)

---

## 1. Executive Summary & Visi Produk

### 1.1 Latar Belakang
Manusia rata-rata buang air kecil (Pee) 4–8 kali sehari dan buang air besar (Poop) 1–3 kali sehari. Aktivitas biologis harian ini menyimpan banyak cerita: momen darurat saat perjalanan, kelegaan tak terkira setelah menahan macet berjam-jam, atau sekadar pencapaian telah "menandai" toilet di kota atau puncak gunung yang baru dikunjungi.

Sebagian besar aplikasi di pasaran terbagi menjadi dua kategori ekstrem:
1. **Aplikasi Medis / Klinis**: Menggunakan Bristol Stool Scale yang kaku dan penuh jargon medis, membuat pengguna canggung untuk menggunakannya secara harian.
2. **Aplikasi Fasilitas Publik / Toilet Finder**: Berfokus mencari toilet umum terdekat dan memberikan rating kebersihan kloset, padahal pengguna seringkali hanya ingin mencatat sejarah pribadi mereka sendiri.

**Poop Pee Log** hadir mengisi kekosongan tersebut sebagai **personal lifelogger & diary** buang air yang menyenangkan, estetik, dan sat-set. Konsepnya seperti Strava atau Foursquare Swarm, tetapi 100% didedikasikan untuk rekam jejak biologis pribadi pengguna.

### 1.2 Visi & Tagline
> **Visi**: *"Menjadi buku harian biologis personal paling sat-set, seru, dan aman di dunia untuk mendokumentasikan jejak lega pengguna tanpa rasa canggung atau was-was privasi."*

**Tagline Resmi**: `"Track. Log. Lega."`

---

## 2. Prinsip Produk yang Tidak Boleh Dilanggar (Core Tenets)

1. **3-Detik / 2-Tap Rule**:
   Mencatat buang air harus selesai maksimal dalam 3 detik dan 2 ketukan layar (Tap `+ LOG` -> Tap `PEE` atau `POOP`). Tidak boleh ada form input yang memblokir proses penyimpanan. Mood dan catatan adalah opsional.
2. **Privacy First (Zero Social di MVP)**:
   Data buang air adalah data ultra-sensitif. Di MVP Fase 1, **TIDAK ADA** fitur sosial, feed pertemanan, leaderboard publik, pencari toilet umum terdekat, maupun sistem rating toilet. Data milik pengguna seutuhnya dan terisolasi dengan Row Level Security (RLS).
3. **Offline-First Resilience**:
   Aplikasi harus dapat digunakan di toilet basement gedung, dalam pesawat, atau di pelosok pegunungan tanpa sinyal internet. Data disimpan di database lokal terlebih dahulu dan otomatis disinkronkan saat koneksi internet kembali.
4. **Zero Friction Onboarding (Anonymous First)**:
   Pengguna dapat langsung menggunakan aplikasi dalam hitungan detik setelah instalasi via Anonymous Guest Mode tanpa kewajiban mengisi email atau nomor telepon di awal.

---

## 3. Target Pengguna & Persona

### 3.1 Persona 1: Si Nomaden Perut Sensitif
- **Nama**: Rian (27 tahun)
- **Profesi**: Field Sales & Traveler
- **Perilaku**: Sering bepergian antar kota, singgah di rest area, SPBU, kafe, dan stasiun. Perutnya mudah bereaksi terhadap makanan pedas atau kopi susu.
- **Kebutuhan**: Butuh tombol log instan saat keluar dari toilet, otomatis merekam koordinat GPS dan nama kecamatan tanpa harus mengetik manual. Senang melihat peta dunia yang dipenuhi pin lokasi toilet yang pernah ia taklukkan.

### 3.2 Persona 2: Si Habit & Quantified-Self Enthusiast
- **Nama**: Alya (23 tahun)
- **Profesi**: UI/UX Designer & Runner
- **Perilaku**: Pengguna aktif Strava, Apple Health, dan Notion. Suka melihat grafik, streak konsistensi, dan pencapaian (*achievements*).
- **Kebutuhan**: Menginginkan data statistik yang rapi (total pee vs poop, streak harian, heatmap wilayah) serta berburu lencana/badge unik bertema humoris.

### 3.3 Persona 3: Si Pengabdi Privasi
- **Nama**: Budi (32 tahun)
- **Profesi**: Software Engineer & Tech Enthusiast
- **Perilaku**: Sangat peduli dengan privasi data, enggan berbagi informasi personal ke platform media sosial, dan sering meminjamkan HP ke anak/teman.
- **Kebutuhan**: Perlindungan App Lock (PIN 4-digit & Biometrik FaceID/Fingerprint), fitur pengaburan lokasi (*blur location* 50m di peta), opsi ekspor data (JSON/CSV), dan tombol hapus semua data permanen.

---

## 4. Tujuan Bisnis & Success Metrics (KPI)

| Metrik | Target MVP | Cara Pengukuran |
| :--- | :--- | :--- |
| **Time-to-Log** | $\le 3\text{ detik}$ (Median) | Telemetri client dari event tap FAB hingga event local persist. |
| **Log Reliability** | $99.9\%$ sukses tanpa crash | Sentry / Bugsnag crash-free session rate pada operasi logging. |
| **D7 & D30 Retention** | D7 $\ge 40\%$, D30 $\ge 25\%$ | Mixpanel / PostHog retention cohort pengguna aktif harian (DAU). |
| **Offline Resilience** | $0\%$ data loss | Rasio verifikasi antrean pending sync vs Supabase synced records. |
| **Privacy Trust** | $0$ insiden data breach | Audit isolasi Supabase RLS policies dan enkripsi client-side. |

---

## 5. Ruang Lingkup Produk (Scope)

### 5.1 In-Scope (Fase 1 - MVP)
- **Landing Page Website (`apps/web`)**:
  - Halaman statis React + Vite + Tailwind CSS.
  - Showcase fitur, screenshot aplikasi mobile, daftar badge unik, edukasi manifesto privasi, dan CTA download Android (Play Store) & iOS (App Store).
  - Tanpa login, tanpa dashboard, dan tanpa koneksi database.
- **Aplikasi Mobile (`apps/mobile`)**:
  - **Anonymous Guest Auth**: Pengguna langsung dapat menggunakan aplikasi secara instan, dengan opsi menghubungkan akun (Google / Apple) di halaman pengaturan.
  - **Quick 2-Tap Log**: Tombol melayang `+ LOG` besar dengan pilihan PEE (Kuning) dan POOP (Coklat).
  - **Auto Geotagging**: Mengambil koordinat GPS, ketinggian (mdpl), waktu lokal, dan reverse-geocoding kecamatan/kota.
  - **Map Pribadi (Peta Aib)**: Peta layar penuh dengan React Native Maps (native Apple Maps / Google Maps tanpa biaya token), clustering pin, dan filter layer (Semua, Pee saja, Poop saja).
  - **Mood & Note Bottom Sheet**: Input opsional non-blocking (Pilihan mood santai + catatan bebas max 100 karakter).
  - **Timeline / Diary**: Riwayat log kronologis dengan filter jenis, pencarian nama kota/catatan, dan fungsi hapus log.
  - **Stats & Gamified Badges**: Total hitungan, rasio pee:poop, streak harian dengan api menyala, mini heatmap, dan 5 master badge perdana.
  - **Privacy & Security**: App Lock (PIN 4-digit & Biometrik), Blur Lokasi 50m, Ekspor Data (JSON/CSV), dan Hapus Semua Data.
  - **Offline-First Synchronization**: Penyimpanan lokal resilient dengan antrean sinkronisasi otomatis ke Supabase saat online.

### 5.2 Out-of-Scope (Eksplisit Dilarang di Fase 1)
- ❌ **Pencari Toilet Terdekat (Toilet Finder)**: Tidak menyediakan peta toilet umum terdekat.
- ❌ **Rating / Review Kebersihan Toilet**: Tidak ada fitur ulasan kloset, aroma, ketersediaan tisu, atau fasilitas toilet.
- ❌ **Fitur Sosial & Oversharing**: Tidak ada pertemanan, leaderboard antar pengguna, follow/unfollow, maupun feed publik.
- ❌ **Bristol Stool Scale Klinis**: Tidak menyertakan klasifikasi bentuk feses medis tipe 1–7 yang rumit.
- ❌ **Logging / Transaksi via Browser Web**: Website murni untuk kebutuhan pemasaran dan landing page.

---

## 6. User Stories & Acceptance Criteria

### US-01: Quick Logging dalam 3 Detik
- **Sebagai** pengguna yang sedang selesai buang air,
- **Saya ingin** mencatat log hanya dengan 2 kali sentuhan cepat,
- **Agar** saya tidak membuang waktu dan data langsung terekam sebelum saya lupa.
- **Kriteria Penerimaan**:
  1. Menekan tombol `+ LOG` membuka modal pilihan tipe buang air.
  2. Menekan ikon `PEE` atau `POOP` langsung menyimpan data ke database lokal dalam $< 100\text{ ms}$.
  3. Perangkat memberikan getaran haptic feedback dan menampilkan toast notifikasi "Lega tercatat!".
  4. Pengambilan GPS presisi dan reverse geocoding kecamatan berjalan asinkron di latar belakang tanpa memblokir interaksi pengguna.

### US-02: Peta Pribadi & Clustering
- **Sebagai** pengguna yang suka bepergian,
- **Saya ingin** melihat peta interaktif berisi pin tempat saya pernah kencing atau buang air besar,
- **Agar** saya memiliki dokumentasi visual unik mengenai jejak perjalanan hidup saya.
- **Kriteria Penerimaan**:
  1. Peta menampilkan Pin Kuning untuk Pee dan Pin Coklat untuk Poop.
  2. Pada level zoom rendah/sedang, pin berdekatan otomatis dikelompokkan menjadi cluster badge dengan angka total log.
  3. Mengetuk cluster memperbesar peta secara otomatis ke area tersebut.
  4. Mengetuk pin tunggal menampilkan kartu ringkasan berisi waktu, kecamatan, mood, dan catatan.

### US-03: Dukungan Penggunaan Offline (Offline-First)
- **Sebagai** pengguna yang sering berada di toilet basement tanpa sinyal internet,
- **Saya ingin** aplikasi tetap berfungsi normal tanpa menampilkan pesan error koneksi,
- **Agar** saya tetap bisa mencatat log di mana saja.
- **Kriteria Penerimaan**:
  1. Log baru yang dibuat saat offline tersimpan di database lokal dengan status `pending_sync`.
  2. Indikator offline tidak mengganggu proses pencatatan.
  3. Ketika internet aktif kembali, aplikasi otomatis mengirimkan data ke Supabase tanpa memerlukan intervensi manual dari pengguna.

### US-04: Kunci Aplikasi & Privasi Lokasi
- **Sebagai** pengguna yang menghargai privasi,
- **Saya ingin** mengunci aplikasi dengan PIN/Biometrik dan mengaburkan lokasi pin sejauh 50 meter di peta,
- **Agar** orang lain tidak dapat mengintip riwayat saya saat meminjam ponsel.
- **Kriteria Penerimaan**:
  1. Jika App Lock aktif dan aplikasi berada di latar belakang lebih dari 15 detik, layar terkunci otomatis.
  2. Pengguna dapat membuka kunci menggunakan Biometrik (FaceID/Fingerprint) atau PIN 4-digit.
  3. Jika toggle "Blur Lokasi 50m" aktif, koordinat pin pada peta digeser acak dalam radius 20–50 meter dari titik asli.

---

## 7. Asumsi & Ketergantungan Teknis

1. **Izin GPS**: Pengguna memberikan izin akses lokasi `When In Use`. Jika izin ditolak, aplikasi tetap berjalan dengan menandai lokasi sebagai "Lokasi Tidak Diketahui" atau fallback koordinat manual.
2. **Reverse Geocoding**: Menggunakan geocoder bawaan sistem operasi (`expo-location`) atau API geocoding gratis dengan rate-limit caching lokal untuk menghindari pembengkakan kuota.
3. **Penyedia Peta Bebas Biaya**: Menggunakan React Native Maps yang terintegrasi dengan Google Maps SDK (Android) dan Apple Maps (iOS) secara gratis tanpa memerlukan kartu kredit/token langganan pihak ketiga.
4. **Penyimpanan Aman**: PIN dan token session disimpan di iOS Keychain dan Android KeyStore melalui modul `expo-secure-store`.
