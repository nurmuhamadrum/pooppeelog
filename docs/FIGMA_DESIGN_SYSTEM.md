# Figma Design System & Mascot Specification
# Poop Pee Log ("Track. Log. Lega.")

Dokumen ini merupakan panduan resmi spesifikasi desain antarmuka (**UI/UX Specification**) dan aset visual untuk aplikasi **Poop Pee Log**, menggunakan palet warna resmi serta 3 karakter maskot utama: **Mr. Plop**, **Lil' Drip**, dan **Sir Flush**.

---

## 1. Karakter Maskot Resmi (Brand Mascots)

| Maskot | Peran / Kategori | Warna Latar / Aksen | Deskripsi & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Mr. Plop** | **Poop Mascot** (Buang Air Besar) | `#8B5E3C` (Poop brown) | Karakter swirl coklat tersenyum ramah dengan mata bundar berbinar dan pipi merona merah. Digunakan pada tombol utama POOP, pin peta buang air besar, dan kartu diary. |
| **Lil' Drip** | **Pee Mascot** (Buang Air Kecil) | `#F5B700` (Pee amber) / `#3BA3E8` (Drip blue) | Karakter tetesan air biru ceria di atas background kuning emas dengan pipi merona. Digunakan pada tombol PEE, indikator hidrasi, dan pin peta kencing. |
| **Sir Flush** | **Both / Combo Mascot** | `#2FB8AC` (Both teal) | Kloset putih bersahabat yang diapit tetesan air dan swirl mini. Digunakan pada tombol tengah FAB `+ LOG`, status lega kombo, dan logo pelindung App Lock. |

---

## 2. Palet Warna Resmi (10 Color Palette Tokens)

Sesuai dengan panduan visual resmi proyek:

| Token Name | Hex Code | Deskripsi & Implementasi UI |
| :--- | :--- | :--- |
| **`poop-brown`** | `#8B5E3C` | Warna tubuh Mr. Plop, border kartu POOP, dan pin BAB di peta. |
| **`pee-amber`** | `#F5B700` | Warna dasar Lil' Drip, aksen navigasi aktif, dan tombol simpan. |
| **`drip-blue`** | `#3BA3E8` | Warna tubuh tetesan Lil' Drip dan highlight hidrasi air. |
| **`both-teal`** | `#2FB8AC` | Warna Sir Flush, badge status "Lega Banget", dan persentase streak. |
| **`emergency`** | `#FF5A5F` | Pipi merona karakter, status mood "Momen Darurat", dan peringatan hapus. |
| **`cream-bg`** | `#FFF6EA` | Warna teks utama (*heading/title*) dan elemen terang kontras tinggi. |
| **`peach-tint`** | `#F3E3D6` | Warna teks sekunder (*body/subtext*) dan border halus. |
| **`ink`** | `#2B1A0E` | Warna garis outline karakter, pupil mata, dan teks di atas tombol kuning. |
| **`dark-bg`** | `#1E1A17` | Latar belakang kanvas aplikasi (*warm coffee black*). |
| **`dark-surface`** | `#2E2823` | Latar belakang kartu (*card*), modal sheet, keypad, dan bottom bar. |

---

## 3. Komponen & Auto-Layout Mobile (390×844 px)

### 3.1 Peta Pribadi (Home Screen)
- **Background**: `#1E1A17` dengan pola titik koordinat halus `#3D352E`.
- **Pin Lil' Drip (Pee)**:
  - Kotak rounded-2xl `44x44 px`, background `#F5B700`, border putih `2px`, avatar SVG Lil' Drip di dalamnya.
  - Ekor pin: Segitiga sudut rotasi $45^\circ$ mengarah ke lokasi GPS.
- **Pin Mr. Plop (Poop)**:
  - Kotak rounded-2xl `44x44 px`, background `#8B5E3C`, border putih `2px`, avatar SVG Mr. Plop di dalamnya.
- **Cluster Badge (Sir Flush Theme)**:
  - Lingkaran `56x56 px`, background `#2FB8AC`, border lingkaran dalam `#1E1A17` berisi angka jumlah log.
- **Center FAB Button `+ LOG`**:
  - Tombol lingkaran `60x60 px` berwarna `#F5B700` dengan ikon Sir Flush di tengahnya, bayangan mendalam `#F5B700/50`.

### 3.2 Modal 2-Tap Quick Log (3 Detik)
- **Container**: Latar semi-transparan `#1E1A17CC` dengan backdrop blur `12px`.
- **Card**: Latar `#2E2823`, rounded-3xl `32px`, border `1px #3D352E`.
- **Tombol Lil' Drip (PEE)**: Kartu vertical auto-layout, border 2px `#F5B700`, latar `#F5B7001A`, avatar Lil' Drip `64x64 px`.
- **Tombol Mr. Plop (POOP)**: Kartu vertical auto-layout, border 2px `#8B5E3C`, latar `#8B5E3C26`, avatar Mr. Plop `64x64 px`.
- **Tombol Sir Flush (Keduanya Sekaligus)**: Kartu horizontal, border 1px `#2FB8AC`, latar `#2FB8AC1A`.

### 3.3 Bottom Sheet Mood & Catatan
- **Pills Mood Segmented**:
  - `Lega Banget`: Border `#2FB8AC`, teks `#2FB8AC`, latar `#2FB8AC20`.
  - `Nahan Lama`: Border `#3D352E`, teks `#F3E3D6`.
  - `Momen Darurat`: Border `#FF5A5F`, teks `#FF5A5F`, latar `#FF5A5F20`.
  - `Tragedi Kloset`: Border `#8B5E3C`, teks `#8B5E3C`, latar `#8B5E3C20`.

---

## 4. Berkas Mockup & Cara Buka di Figma

- **Berkas Lokal**: [`docs/mockup.html`](file:///Users/nurmuhamadrum/Project/Personal/Vibe%20Engineering/docs/mockup.html)
- **File Figma Langsung**: [Buka di Figma (Node 3:3)](https://www.figma.com/design/LXkrdk20savDKuUgrW59OL?node-id=3-3&autoplay-code-preview=3-3)
