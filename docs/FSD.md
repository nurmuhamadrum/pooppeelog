# Functional Specification Document (FSD)
# Poop Pee Log ("Track. Log. Lega.")

**Versi Dokumen**: 1.0.0 (MVP Fase 1)  
**Status**: Disetujui (Approved)  
**Target Platform**: 
- **Website**: React 19 + Vite + TypeScript + Tailwind CSS (Landing Page)
- **Mobile**: React Native (Expo SDK 52+) + Expo Router + TypeScript + React Native Maps (Free Native)
- **Backend**: Supabase (PostgreSQL 15 + PostGIS + Supabase Auth + Row Level Security)
- **Local Storage**: WatermelonDB / Expo SQLite + AsyncStorage + SecureStore

---

## 1. Arsitektur Komponen & Navigasi

```
+-----------------------------------------------------------------------------------------+
|                                    ARSITEKTUR APLIKASI                                  |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   [ apps/web ] - LANDING PAGE SAJA                                                      |
|   ├── / (Home Landing Page)                                                             |
|   │   ├── HeroSection (Headline, Mockup 3D, CTA Download)                               |
|   │   ├── FeaturesSection (3-Detik Log, Peta Aib, Gamifikasi, Privasi 100%)             |
|   │   ├── ScreenshotCarousel (Showcase UI Mobile)                                       |
|   │   ├── BadgeShowcase (Daftar Lencana Eksentrik)                                      |
|   │   └── Footer (Manifesto Privasi, Disclaimer, Copyright)                             |
|                                                                                         |
|   [ apps/mobile ] - FULL LIFELOGGER                                                     |
|   ├── (auth)/                                                                           |
|   │   ├── welcome.tsx (Onboarding & Izin GPS)                                           |
|   │   └── lock.tsx (Kunci PIN 4-digit & Biometrik FaceID/Fingerprint)                   |
|   ├── (tabs)/                                                                           |
|   │   ├── index.tsx (Home: Fullscreen React Native Maps + FAB '+ LOG' + Layer Filter)   |
|   │   ├── timeline.tsx (Diary: Kronologi Log, Search Bar, Filter Chip, Delete Log)      |
|   │   ├── stats.tsx (Statistik, Api Streak, Mini Heatmap, Koleksi Badge)                |
|   │   └── settings.tsx (App Lock, Blur Lokasi 50m, Ekspor JSON/CSV, Hapus Akun)        |
|   └── modals/                                                                           |
|       ├── quick-log.tsx (Modal 2-Pilihan: PEE vs POOP)                                  |
|       └── mood-note.tsx (Bottom Sheet Opsional: Segmented Mood & Input Note Max 100)    |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Rincian Layar & Komponen UI Mobile

### 2.1 Layar Kunci / App Lock (`/(auth)/lock.tsx`)
- **Tujuan**: Mengamankan data pribadi saat aplikasi dibuka kembali atau saat aplikasi tidak aktif di latar belakang lebih dari 15 detik.
- **Elemen UI**:
  - Logo Poop Pee Log minimalis dengan ikon gembok halus.
  - 4 Indikator Dot PIN (lingkaran kosong/terisi).
  - Virtual Keypad angka 0–9, tombol backspace, dan tombol Biometrik.
  - Tombol trigger pemindaian biometrik (FaceID pada iOS / Fingerprint pada Android).
- **Logika Validasi**:
  - Mencocokkan input dengan hash PIN yang tersimpan di `expo-secure-store`.
  - Percobaan salah 1–2 kali: Animasi getar horizontal (shake) + dot berwarna merah.
  - Percobaan salah $\ge 3$ kali: Tombol terkunci dengan hitung mundur 30 detik (*rate-limiting lockout*).

### 2.2 Layar Peta Pribadi / Home (`/(tabs)/index.tsx`)
- **Tujuan**: Antarmuka utama (*home screen*) tempat pengguna mengeksplorasi jejak buang air mereka.
- **Penyedia Peta (Map Provider)**:
  - Menggunakan **React Native Maps** bawaan sistem operasi (Apple Maps di iOS, Google Maps di Android) secara gratis tanpa biaya token API pihak ketiga.
- **Elemen UI**:
  1. **Fullscreen Map View**:
     - Tema warna default: Light & Dark mode otomatis mengikuti tema sistem.
     - Custom Pin Markers:
       - **Pin Pee**: Ikon lingkaran warna Amber/Kuning Emas (`#F59E0B`) dengan simbol tetesan air.
       - **Pin Poop**: Ikon lingkaran warna Coklat Kopi (`#78350F`) dengan simbol swirl.
     - Pin Cluster: Lingkaran gradien amber-coklat dengan angka total pin di dalamnya.
  2. **Floating Action Button (FAB) `+ LOG`**:
     - Berdiameter 72px, melayang di tengah bawah layar (24px di atas bottom navigation).
     - Warna aksen hijau toska/oranye menyala dengan efek bayangan mendalam (*depth shadow*).
     - Haptic feedback berat saat ditekan (`Haptics.impactAsync(ImpactFeedbackStyle.Medium)`).
  3. **Filter Layer (Pojok Kanan Atas)**:
     - Segmented pill: `[Semua]` | `[Pee Saja]` | `[Poop Saja]`.
  4. **Tombol "My Location" (Pojok Kanan Bawah)**:
     - Mengembalikan fokus kamera peta ke lokasi pengguna saat ini.
  5. **Indikator "Blur Aktif" (Pojok Kiri Atas)**:
     - Chip kecil bertuliskan *"Blur 50m Aktif"* jika opsi privasi diaktifkan pengguna.

### 2.3 Modal Pilihan Cepat / One-Tap Log (`/modals/quick-log.tsx`)
- **Tujuan**: Mewujudkan prinsip *3-Detik / 2-Tap Log*.
- **Elemen UI**:
  - Modal semi-transparan dengan efek blur latar belakang (*backdrop blur*).
  - Dua kartu pilihan berukuran besar:
    - **PEE**: Warna Amber Kuning (`#F59E0B`), teks "BUANG AIR KECIL (PEE)".
    - **POOP**: Warna Coklat Kopi (`#78350F`), teks "BUANG AIR BESAR (POOP)".
- **Alur Eksekusi**:
  1. Pengguna mengetuk salah satu kartu.
  2. Modal tertutup seketika ($< 50\text{ ms}$).
  3. Log tersimpan ke database lokal dalam $< 100\text{ ms}$.
  4. Haptic feedback ringan berbunyi.
  5. Toast konfirmasi muncul: *"Lega tercatat!"*.
  6. Sheet Mood & Note terbuka secara anggun (*smooth spring animation*).

### 2.4 Bottom Sheet Mood & Note (`/modals/mood-note.tsx`)
- **Tujuan**: Menambahkan konteks emosional dan cerita opsional tanpa memblokir pencatatan.
- **Karakteristik**:
  - Bersifat **non-blocking** dan **opsional**. Jika pengguna menutup sheet atau mematikan layar HP, log utama tetap tersimpan utuh.
- **Elemen UI**:
  1. **Segmented Pills Mood**:
     - Pilihan Mood PEE:
       - `LEGA` (Default - "Lega Banget")
       - `NAHAN_LAMA` ("Nahan Lama")
       - `DARURAT` ("Detik-detik Terakhir")
     - Pilihan Mood POOP:
       - `LEGA_BANGET` (Default - "Plong Sempurna")
       - `BIASA_AJA` ("Standar Operasional")
       - `MASIH_GANJEL` ("Ada yang Menggantung")
       - `TRAGEDI` ("Momen Bersejarah / Tragedi")
  2. **Catatan Bebas (Note Input)**:
     - Single/Multi-line TextInput, maksimal **100 karakter**.
     - Indikator panjang karakter dinamis: `XX/100`.
     - Placeholder santai: *"Ada cerita unik di toilet ini? (opsional)"*.
  3. **Tombol Aksi**:
     - Tombol *"Simpan Mood & Catatan"*.
     - Tombol *"Lewati / Selesai"* (atau usap sheet ke bawah untuk menutup).

### 2.5 Layar Timeline / Diary (`/(tabs)/timeline.tsx`)
- **Tujuan**: Melihat buku harian riwayat buang air secara kronologis.
- **Elemen UI**:
  - **Search Bar**: Mencari log berdasarkan nama kota, kecamatan, atau kata di dalam catatan.
  - **Filter Chips**: Filter cepat berdasarkan tipe buang air atau mood.
  - **Sticky Date Headers**: Pengelompokan tanggal (misal: "Hari ini - 9 Nov 2026", "Kemarin", "Oktober 2026").
  - **Item Kartu Log**:
    - Ikon tipe (Kuning untuk Pee, Coklat untuk Poop).
    - Label jam (misal: `14:32 WIB`).
    - Nama lokasi (misal: `Kec. Gambir, Jakarta Pusat`).
    - Badge mood dengan warna kontras.
    - Cuplikan catatan jika ada.
    - Aksi: Geser ke kiri (*Swipe to Delete*) atau tombol opsi untuk menghapus log.

### 2.6 Layar Statistik & Badges (`/(tabs)/stats.tsx`)
- **Tujuan**: Gamifikasi dan visualisasi data personal.
- **Elemen UI**:
  1. **Ringkasan Angka (KPI Cards)**:
     - Total Pee.
     - Total Poop.
     - Rasio Pee : Poop.
     - Total Kota / Kabupaten yang pernah dijelajahi.
  2. **Streak Counter**:
     - Ikon api menyala dengan angka streak hari aktif.
     - Pesan penyemangat (contoh: *"Lancar Jaya! 5 hari buang air berturut-turut"*).
  3. **Mini Area Summary**:
     - 3 Kecamatan dengan frekuensi log tertinggi.
  4. **Badge Showcase (Koleksi Lencana)**:
     - Grid 2 kolom kartu lencana.
     - Lencana Belum Terbuka: Tampilan abu-abu (*grayscale*) dengan icon gembok dan teks petunjuk syarat buka.
     - Lencana Terbuka: Tampilan penuh warna, animasi shimmer halus, dan tanggal berhasil diraih.

### 2.7 Layar Pengaturan & Privasi (`/(tabs)/settings.tsx`)
- **Tujuan**: Kontrol keamanan, privasi data, sinkronisasi, dan manajemen akun.
- **Elemen UI**:
  1. **Bagian Akun & Identitas**:
     - Status: *"Mode Tamu (Anonymous)"* atau *"Terhubung dengan [email/Google/Apple]"*.
     - Tombol *"Hubungkan Akun Google / Apple"* untuk mengamankan data dan cadangan cloud.
  2. **Bagian Keamanan**:
     - Switch `App Lock`: Mengaktifkan/menonaktifkan kunci PIN 4-digit.
     - Switch `Buka dengan Biometrik (FaceID / Fingerprint)`.
     - Tombol `Ubah PIN`.
  3. **Bagian Privasi**:
     - Switch `Blur Lokasi 50 Meter`: Menjelaskan bahwa koordinat pin pada peta digeser acak demi privasi.
  4. **Bagian Sinkronisasi & Data**:
     - Status antrean: *"Semua data tersinkronisasi"* atau *"3 log menunggu sinkronisasi"*.
     - Tombol *"Sinkronkan Sekarang"*.
     - Tombol *"Ekspor Data ke JSON"* & *"Ekspor Data ke CSV"*.
     - Tombol Merah Bahaya: *"Hapus Semua Data & Log Permanen"*.

---

## 3. Spesifikasi Validasi & Penanganan State

### 3.1 Validasi Input (Zod Schemas)
```typescript
// packages/shared/src/validators/log.schema.ts
import { z } from 'zod';

export const LogTypeEnum = z.enum(['PEE', 'POOP']);

export const MoodPeeEnum = z.enum(['LEGA', 'NAHAN_LAMA', 'DARURAT']);
export const MoodPoopEnum = z.enum(['LEGA_BANGET', 'BIASA_AJA', 'MASIH_GANJEL', 'TRAGEDI']);

export const CreateLogSchema = z.object({
  type: LogTypeEnum,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().nullable().optional(),
  city: z.string().max(100).default('Tidak Diketahui'),
  district: z.string().max(100).default('Tidak Diketahui'),
  subdistrict: z.string().max(100).nullable().optional(),
  country: z.string().max(50).default('ID'),
  mood: z.string().max(50).nullable().optional(),
  note: z.string().max(100, 'Catatan maksimal 100 karakter').nullable().optional(),
  logged_at: z.string().datetime(),
  is_blurred: z.boolean().default(false),
  client_created_at: z.string().datetime(),
});
```

### 3.2 Penanganan State Aplikasi

| State | Tampilan pada Layar Map | Tampilan pada Layar Timeline | Tampilan pada Layar Stats |
| :--- | :--- | :--- | :--- |
| **Loading** | Shimmer skeleton pada kontrol peta dan pin placeholder. | Skeleton kartu berkedip abu-abu lembut. | Skeleton kotak kartu angka berkedip. |
| **Error** | Banner peringatan: *"Gagal memuat peta. Periksa koneksi atau izin lokasi."* | Tombol *"Coba Muat Ulang"* dengan ikon refresh. | Teks error dengan tombol reload. |
| **Empty** | Peta bersih dengan popup panduan: *"Belum ada pin aib. Sentuh tombol + LOG sekarang!"* | Ilustrasi kloset bersahabat dengan teks: *"Belum ada catatan lega. Mulai rekam sekarang!"* | Angka 0 dengan pesan: *"Ayo mulai mencatat untuk membuka lencana pertamamu!"* |
| **Offline** | Indikator kecil *"Mode Offline - Data tersimpan di HP"* di bar status atas. | Tetap menampilkan semua data lokal tanpa kendala. | Tetap menghitung statistik berdasarkan database lokal. |

---

## 4. Logika Bisnis & Algoritma Khusus

### 4.1 Algoritma 3-Detik Log Engine
1. **Event Tap FAB**: Membuka modal overlay dalam waktu $< 16\text{ ms}$ (60 FPS).
2. **Event Tap Opsi (PEE / POOP)**:
   - Ambil timestamp ISO terkini (`now()`).
   - Ambil koordinat lokasi terakhir dari cache (`Location.getLastKnownPositionAsync()`).
   - Buat objek record lokal baru dengan ID UUID v4.
   - Simpan langsung ke database lokal SQLite/WatermelonDB dengan flag `sync_status = 'pending'`.
   - Bunyikan haptic feedback: `Haptics.notificationAsync(NotificationFeedbackType.Success)`.
   - Tampilkan toast *"Lega tercatat!"* selama 2 detik.
   - Buka bottom sheet Mood & Note.
3. **Background Worker Asinkron**:
   - Minta koordinat GPS presisi tinggi (`Location.getCurrentPositionAsync({ accuracy: Accuracy.Balanced })`).
   - Jalankan reverse geocoding via `Location.reverseGeocodeAsync()`.
   - Perbarui record lokal dengan koordinat terbaru dan nama kecamatan/kota.

### 4.2 Algoritma Pengaburan Lokasi 50 Meter (Geodesic Blur)
Untuk melindungi privasi pengguna saat menampilkan pin di peta:
$$\theta = 2\pi \cdot \text{Math.random}()$$
$$r = 20 + 30 \cdot \text{Math.random}() \quad (\text{radius 20 hingga 50 meter})$$
$$\Delta \text{lat} = \frac{r \cdot \cos(\theta)}{111320}$$
$$\Delta \text{lon} = \frac{r \cdot \sin(\theta)}{111320 \cdot \cos(\text{lat} \cdot \frac{\pi}{180})}$$
$$\text{lat}_{\text{blurred}} = \text{lat} + \Delta \text{lat}$$
$$\text{lon}_{\text{blurred}} = \text{lon} + \Delta \text{lon}$$

### 4.3 Algoritma Perhitungan Streak Harian
```typescript
export function calculateStreak(logDates: string[], userTimeZone: string): number {
  if (!logDates.length) return 0;

  // Normalisasi tanggal unik dalam format YYYY-MM-DD sesuai zona waktu pengguna
  const uniqueDays = Array.from(
    new Set(
      logDates.map((dateStr) =>
        new Intl.DateTimeFormat('en-CA', { timeZone: userTimeZone }).format(new Date(dateStr))
      )
    )
  ).sort().reverse(); // Urutkan dari tanggal terbaru ke terlama

  const now = new Date();
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTimeZone }).format(now);
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTimeZone }).format(yesterday);

  let currentStreak = 0;
  let expectedDate = new Date(now);

  // Jika hari ini belum log tapi kemarin ada log, streak hari kemarin tetap dihitung aktif
  if (uniqueDays[0] === todayStr) {
    expectedDate = new Date(now);
  } else if (uniqueDays[0] === yesterdayStr) {
    expectedDate = yesterday;
  } else {
    return 0; // Streak terputus
  }

  for (const dayStr of uniqueDays) {
    const expectedStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTimeZone }).format(expectedDate);
    if (dayStr === expectedStr) {
      currentStreak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}
```

### 4.4 Engine Evaluasi Badge (Lencana)
Setiap kali log baru berhasil disimpan, fungsi murni `evaluateBadges` dijalankan:
1. **Pendatang Baru (`badge_01`)**: `totalLogs >= 1`.
2. **Penjelajah Kota (`badge_02`)**: `uniqueDistricts.size >= 3` (dihitung dari field `district` yang bukan 'Tidak Diketahui').
3. **Lancar Jaya (`badge_03`)**: `currentStreak >= 7`.
4. **Musafir (`badge_04`)**: `uniqueCities.size >= 2` (dihitung dari field `city`).
5. **Puncak Lega (`badge_05`)**: `currentLog.altitude >= 1000` (ketinggian di atas 1.000 meter di atas permukaan laut).

---

## 5. Alur Anonymous Auth & Migrasi Akun

1. **Inisialisasi Pertama (Cold Start)**:
   - Aplikasi memeriksa apakah ada sesi aktif di Supabase.
   - Jika belum ada, panggil `supabase.auth.signInAnonymously()`.
   - Supabase membuat akun guest dengan UUID unik dan hak akses RLS penuh.
   - Pengguna langsung dapat mencatat log dan melihat peta seketika tanpa input apa pun.
2. **Migrasi / Link Akun Cloud**:
   - Di tab Pengaturan, terdapat opsi *"Hubungkan Akun Google / Apple"*.
   - Saat pengguna memilih link akun, panggil `supabase.auth.linkIdentity({ provider: 'google' | 'apple' })`.
   - Seluruh data log dan lencana yang dibuat selama mode anonymous tetap melekat pada UUID yang sama, sehingga riwayat pengguna tidak pernah hilang.
