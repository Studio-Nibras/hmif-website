# Technical Design Document
## Website Resmi HMIF UNIBA Surakarta

**Versi:** 1.0 — Draft Awal  
**Status:** Draft / sebagian keputusan masih TBD  
**Terkait:** `PRD.md`

> Dokumen ini menerjemahkan kebutuhan produk ke rancangan teknis awal. Detail yang belum diputuskan ditandai `TBD` dan tidak boleh dianggap sebagai keputusan final.

---

## 1. Tujuan Dokumen

Menjadi acuan implementasi teknis website HMIF, mencakup arsitektur, pembagian frontend/backend, autentikasi, rancangan API, database, keamanan, dan deployment.

## 2. Prinsip Arsitektur

- Pisahkan frontend, backend, dan database.
- Frontend mengakses data melalui REST API; frontend tidak mengakses MySQL secara langsung.
- Validasi dan otorisasi wajib dilakukan di backend.
- Endpoint publik hanya menyajikan konten yang berstatus `published`.
- Endpoint mutasi CMS wajib memerlukan session admin yang valid.
- Secret disimpan di environment variables, bukan di repository.
- Gunakan data resmi; jangan mengisi konten organisasi dengan data rekaan.
- Hindari kompleksitas di luar kebutuhan MVP.

## 3. Arsitektur Tingkat Tinggi

```text
Browser
  ├── Public Website (React + Vite)
  └── Admin CMS (React + Vite)
             │
             │ HTTPS / REST API (JSON)
             ▼
       Express.js Backend
         ├── Auth & Session Middleware
         ├── Public Content Routes
         ├── Admin CMS Routes
         ├── Validation & Sanitization
         ├── Business Logic
         └── Activity Logging
             │
             ▼
           MySQL
```

Frontend publik dan CMS dapat berada dalam satu aplikasi React dengan route terpisah. Deployment frontend dan backend boleh menggunakan domain berbeda, tetapi konfigurasi CORS dan cookie harus diuji dengan benar.

## 4. Stack dan Tanggung Jawab

| Komponen | Teknologi | Tanggung jawab |
|---|---|---|
| Frontend | React + Vite | Halaman publik, CMS, state UI, validasi pengalaman pengguna |
| Backend | Node.js + Express.js | REST API, autentikasi, validasi, aturan bisnis, akses data |
| Database | MySQL 8+ | Penyimpanan konten, akun admin, struktur organisasi, log |
| Auth | Session-based | Mempertahankan status login admin |
| Password | bcrypt atau pustaka hashing yang sesuai | Penyimpanan password berbentuk hash |
| Konten artikel | Rich text editor TBD | Menyusun artikel |
| Gambar | Image storage TBD | Sampul artikel dan foto anggota |
| Hosting | TBD | Deployment aplikasi dan database |

Versi paket final ditetapkan saat setup dan dicatat dalam manifest proyek.

## 5. Usulan Struktur Repository

Struktur berikut merupakan usulan awal; nama folder dapat disesuaikan saat implementasi.

```text
hmif-website/
├── docs/
│   ├── PRD.md
│   ├── TECHNICAL_DESIGN.md
│   ├── ROADMAP.md
│   └── TESTING_CHECKLIST.md
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── features/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── news/
│       │   ├── programs/
│       │   ├── organization/
│       │   └── settings/
│       ├── services/
│       ├── hooks/
│       └── styles/
├── backend/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── validators/
│       ├── utils/
│       └── server.js
├── database/
│   └── schema.sql
├── .env.example
├── .gitignore
└── README.md
```

### Pembagian tanggung jawab backend

- `config/`: konfigurasi environment dan koneksi database.
- `middleware/`: autentikasi, rate limit, penanganan error.
- `routes/`: deklarasi endpoint dan middleware terkait.
- `controllers/`: menerima request dan menyusun response.
- `services/`: aturan bisnis dan alur multi-langkah.
- `repositories/`: query database.
- `validators/`: validasi payload dan parameter.
- `utils/`: fungsi pendukung yang dapat digunakan ulang.

Untuk MVP, hindari membuat lapisan abstraksi yang tidak memberi manfaat nyata. Struktur boleh disederhanakan bila jumlah kode masih kecil.

## 6. Konfigurasi Environment

Variabel yang diperkirakan diperlukan:

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=hmif_website
DATABASE_USER=
DATABASE_PASSWORD=
SESSION_SECRET=
```

Nama variabel merupakan usulan dan harus konsisten dengan implementasi. Jika menggunakan TLS database atau layanan gambar eksternal, tambahkan variabel yang diperlukan sesuai provider.

Aturan:
- Jangan commit file `.env`.
- Commit `.env.example` tanpa secret.
- Gunakan secret acak yang kuat untuk production.
- Jangan memakai password atau session secret contoh di lingkungan production.
- Batasi hak akses akun database sesuai kebutuhan aplikasi.

## 7. Database dan Relasi

Tabel awal sesuai PRD:

| Tabel | Relasi / tujuan |
|---|---|
| `admins` | Akun yang membuat atau mengubah konten |
| `news_categories` | Satu kategori dapat memiliki banyak artikel |
| `news_articles` | Artikel memiliki kategori dan admin pembuat/pengelola |
| `programs` | Katalog program kerja; dapat terkait divisi |
| `program_news` | Relasi many-to-many antara program dan artikel |
| `organization_divisions` | Satu divisi dapat memiliki banyak anggota |
| `organization_members` | Anggota dan informasi jabatan/periode |
| `website_settings` | Nilai konfigurasi konten website |
| `activity_logs` | Aktivitas admin |

Relasi penting:
- `news_articles.category_id` → `news_categories.id`.
- `news_articles.admin_id` → `admins.id`, dengan kebijakan penghapusan yang tidak menghilangkan atribusi tanpa sengaja.
- `programs.division_id` → `organization_divisions.id` jika divisi dihubungkan langsung.
- `organization_members.division_id` → `organization_divisions.id`.
- `program_news.program_id` → `programs.id`.
- `program_news.article_id` → `news_articles.id`.
- `activity_logs.admin_id` → `admins.id`, dengan kebijakan retensi dan penghapusan yang ditentukan.

Detail nama kolom, tipe data, constraint, indeks, serta kebijakan `ON DELETE` harus cocok dengan `schema.sql` aktual. Jangan menganggap contoh relasi ini telah diterapkan sebelum diverifikasi.

### Status yang berbeda

- Program `status`: `planned`, `ongoing`, `completed`.
- Program `publication_status`: `draft`, `published`.
- Artikel `status`: `draft`, `published`.

Status pelaksanaan program tidak otomatis mengubah status publikasi program maupun artikel.

## 8. Rancangan API

Prefix: `/api`. Semua request dan response menggunakan JSON kecuali mekanisme upload yang nantinya dipilih.

### 8.1 Format respons yang disarankan

Berhasil:

```json
{
  "data": {},
  "message": "Berhasil"
}
```

Gagal:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Periksa kembali data yang dikirim",
    "details": {}
  }
}
```

Format ini adalah konvensi usulan. Terapkan secara konsisten dan jangan mengirim stack trace atau rahasia ke client.

### 8.2 Autentikasi

| Method | Endpoint | Akses | Tujuan |
|---|---|---|---|
| POST | `/api/auth/login` | Publik + rate limit | Memulai session admin |
| POST | `/api/auth/logout` | Admin | Mengakhiri session |
| GET | `/api/auth/me` | Session valid | Mendapatkan admin yang sedang login |

Login harus memverifikasi password terhadap hash. Pesan error tidak perlu mengungkap apakah email atau password tertentu valid.

### 8.3 Dashboard

| Method | Endpoint | Akses | Tujuan |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Admin | Ringkasan jumlah data |
| GET | `/api/dashboard/publication-overview` | Admin | Statistik publikasi bulanan dan status artikel |
| GET | `/api/dashboard/program-overview` | Admin | Ringkasan status program |
| GET | `/api/dashboard/recent-activity` | Admin | Aktivitas terbaru |

### 8.4 Berita dan kategori

| Method | Endpoint | Akses | Tujuan |
|---|---|---|---|
| GET | `/api/news` | Publik untuk published; admin dapat meminta daftar CMS melalui kebijakan terpisah | Daftar berita |
| GET | `/api/news/:slug` | Publik hanya published; admin dapat preview draft secara terproteksi | Detail artikel |
| POST | `/api/news` | Admin | Membuat artikel |
| PATCH | `/api/news/:id` | Admin | Mengubah artikel |
| DELETE | `/api/news/:id` | Admin | Menghapus artikel |
| POST | `/api/news/:id/publish` | Admin | Memublikasikan artikel |
| POST | `/api/news/:id/unpublish` | Admin | Mengubah artikel menjadi draft |
| GET | `/api/categories` | Publik atau admin sesuai kebutuhan | Daftar kategori |
| POST | `/api/categories` | Admin | Membuat kategori |
| PATCH | `/api/categories/:id` | Admin | Mengubah kategori |
| DELETE | `/api/categories/:id` | Admin, dengan pemeriksaan relasi | Menghapus kategori |

Endpoint daftar perlu mendukung pagination dan filter yang ditetapkan saat implementasi. Endpoint publik tidak boleh mengembalikan draft, termasuk lewat pencarian, slug langsung, atau filter.

### 8.5 Program kerja

| Method | Endpoint | Akses | Tujuan |
|---|---|---|---|
| GET | `/api/programs` | Publik untuk published; admin dapat meminta daftar CMS | Katalog program |
| GET | `/api/programs/:slug` | Publik hanya published; preview admin terproteksi | Detail program |
| POST | `/api/programs` | Admin | Membuat program |
| PATCH | `/api/programs/:id` | Admin | Mengubah program |
| DELETE | `/api/programs/:id` | Admin, dengan pemeriksaan relasi | Menghapus program |

Relasi program-berita dapat dikelola melalui endpoint khusus atau payload program yang tervalidasi. Bentuk final TBD. Pastikan relasi tidak membuat duplikasi dan penghapusan satu entitas tidak menghapus entitas terkait tanpa keputusan eksplisit.

### 8.6 Struktur organisasi

Rancangan awal:
- `GET /api/organization` untuk data publik yang relevan.
- Endpoint CRUD divisi dan anggota khusus admin.

Path dan metode detail TBD. Endpoint publik tidak perlu mengembalikan data internal yang tidak relevan.

### 8.7 Pengaturan website

- `GET /api/settings` untuk pengaturan publik yang aman.
- `PATCH /api/settings` untuk perubahan oleh admin.

Jangan pernah mengekspos secret konfigurasi server melalui endpoint settings.

## 9. Autentikasi dan Session

- Gunakan session yang disimpan di server-side store untuk production.
- Cookie menggunakan `HttpOnly`, `Secure` pada HTTPS, dan `SameSite` yang sesuai dengan topologi domain.
- Jika frontend dan backend beda site, evaluasi kebutuhan `SameSite=None; Secure`, CORS dengan credentials, dan perlindungan CSRF.
- Jangan mengizinkan origin sembarang ketika credentials aktif.
- Rotasi atau regenerasi session ID setelah login untuk mengurangi session fixation.
- Logout menghapus session di server dan membersihkan cookie.
- Lindungi login dengan rate limiting.
- Route frontend yang diproteksi hanya membantu UX; otorisasi sebenarnya harus tetap di backend.
- Perilaku session kedaluwarsa harus ditangani dengan jelas oleh frontend.

## 10. Validasi, Keamanan, dan Penanganan Error

### Validasi
- Validasi body, query parameter, route parameter, tipe data, panjang teks, dan field wajib di backend.
- Validasi tanggal mulai dan akhir.
- Validasi status menggunakan daftar nilai yang diizinkan.
- Pastikan foreign key yang dikirim memang ada.
- Tolak atau tangani slug duplikat dengan pesan yang jelas.
- Batasi ukuran payload dan upload.

### Rich text dan gambar
- Sanitasi HTML rich text sebelum ditampilkan.
- Jangan mempercayai HTML dari editor.
- Validasi MIME type dan ukuran file gambar.
- Pilihan storage dan kebijakan akses file masih TBD.
- Hindari menyimpan file upload di lokasi sementara yang hilang setelah redeploy jika hosting bersifat ephemeral.

### Error
- Gunakan middleware error terpusat.
- Bedakan validation error, unauthenticated, forbidden, not found, conflict, dan server error.
- Jangan menampilkan detail SQL, stack trace, secret, atau path internal kepada publik.
- Catat error server yang diperlukan tanpa menyimpan password atau session token.

## 11. Aturan Bisnis Penting

1. Hanya konten `published` yang dapat diakses publik.
2. Program kerja tetap menjadi entitas tersendiri dari artikel berita.
3. Program dapat diterbitkan tanpa artikel berita.
4. Artikel dapat dihubungkan ke program tanpa mengubah status pelaksanaan program.
5. Program `completed` tetap tersedia dalam katalog selama status publikasinya memungkinkan.
6. Statistik dashboard berasal dari query database aktual.
7. Penghapusan data terkait harus memiliki kebijakan eksplisit.
8. Admin awal dibuat melalui proses setup terkontrol, bukan registrasi publik.
9. Semua operasi mutasi CMS memerlukan session admin valid.

## 12. Strategi Pengujian Teknis

- Uji route dan aturan bisnis backend, termasuk akses tanpa session.
- Uji integrasi dengan database untuk CRUD dan foreign key.
- Uji endpoint publik untuk memastikan draft tidak bocor.
- Uji alur autentikasi dan session.
- Uji form dan error state frontend.
- Uji responsive layout pada viewport umum.
- Uji production build dan smoke test setelah deployment.

Rincian kasus uji berada di `TESTING_CHECKLIST.md`.

## 13. Deployment

Komponen yang perlu disiapkan:
- Frontend static hosting.
- Backend Node.js hosting.
- MySQL hosting.
- Environment variables production.
- HTTPS.
- CORS dan session cookie.
- Migrasi atau eksekusi schema database yang terkontrol.
- Backup database.
- Log dan pemeriksaan kesehatan aplikasi.

Provider dan domain final TBD. Sebelum memilih provider, periksa batas gratis, kebutuhan kartu pembayaran, batas koneksi database, penyimpanan persisten, dan potensi biaya.

## 14. Keputusan yang Masih TBD

- Hosting frontend, backend, dan database.
- Image storage.
- Rich text editor.
- Strategi CSRF sesuai deployment.
- Bentuk final payload dan pagination API.
- Kebijakan penghapusan kategori, divisi, program, dan admin.
- Retensi activity log.
- Prosedur backup dan restore.
- Mekanisme migrasi schema.
- Test runner dan kebutuhan CI.

## 15. Checklist Sebelum Implementasi

- [ ] Pastikan PRD menjadi acuan requirement.
- [ ] Cocokkan schema SQL dengan model relasi dokumen ini.
- [ ] Tentukan struktur repository final.
- [ ] Tentukan nama environment variables.
- [ ] Sepakati format response API.
- [ ] Sepakati session dan CORS berdasarkan domain deployment.
- [ ] Tentukan storage gambar sebelum implementasi upload.
- [ ] Tetapkan validasi dan error handling dasar.
- [ ] Perbarui dokumen jika ada keputusan teknis baru.

---

**Prinsip:** jaga arsitektur sesederhana mungkin, tetapi pastikan keamanan, aturan bisnis, dan batas akses data diterapkan di backend.
