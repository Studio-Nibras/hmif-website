# Development Roadmap
## Website Resmi HMIF UNIBA Surakarta

**Versi:** 1.0 — Draft Awal  
**Status awal:** Belum dimulai  
**Acuan:** `PRD.md` dan `TECHNICAL_DESIGN.md`

> Checklist ini digunakan untuk melacak pekerjaan. Tandai task selesai hanya setelah implementasi diverifikasi. Urutan dapat disesuaikan berdasarkan dependensi dan temuan teknis.

## Cara Menggunakan

Status task:
- `[ ]` Todo
- `[x]` Done
- Tambahkan catatan singkat untuk blocker atau keputusan penting.

Prioritas:
- **P0:** wajib untuk MVP atau blocker.
- **P1:** penting untuk pengalaman dan operasional MVP.
- **P2:** peningkatan yang dapat ditunda.

---

## Fase 0 — Finalisasi Perencanaan

- [ ] **P0** Tinjau dan setujui scope MVP pada `PRD.md`.
- [ ] **P0** Simpan dokumen di folder `docs/` dalam repository.
- [ ] **P0** Tinjau rancangan teknis dan cocokkan dengan schema SQL.
- [ ] **P0** Tandai keputusan TBD yang menghalangi implementasi awal.
- [ ] **P1** Konfirmasi data resmi HMIF yang tersedia: profil, visi-misi, struktur, program kerja, kontak.
- [ ] **P1** Tetapkan konvensi branch, commit, dan review perubahan.

**Definition of Done:** requirement MVP jelas, keputusan blocker tercatat, dan dokumen berada di repository.

## Fase 1 — Fondasi Repository dan Database

- [ ] **P0** Siapkan repository dan struktur folder final.
- [ ] **P0** Siapkan `.gitignore` dan `.env.example`.
- [ ] **P0** Setup project frontend React + Vite.
- [ ] **P0** Setup project backend Express.js.
- [ ] **P0** Konfigurasi environment development.
- [ ] **P0** Buat koneksi MySQL dan verifikasi koneksi.
- [ ] **P0** Jalankan schema database dan verifikasi tabel.
- [ ] **P0** Pastikan seed hanya memuat kategori awal yang disepakati.
- [ ] **P1** Tambahkan health endpoint backend.
- [ ] **P1** Terapkan format response dan error dasar.

**Definition of Done:** frontend dan backend dapat dijalankan lokal, backend terhubung ke database, dan schema terverifikasi.

## Fase 2 — Autentikasi dan Proteksi

- [ ] **P0** Implementasikan proses setup akun admin awal yang terkontrol.
- [ ] **P0** Implementasikan hashing dan verifikasi password.
- [ ] **P0** Implementasikan login dan session.
- [ ] **P0** Implementasikan endpoint pemeriksaan session (`/api/auth/me`).
- [ ] **P0** Implementasikan logout dan invalidasi session server.
- [ ] **P0** Terapkan middleware proteksi endpoint admin.
- [ ] **P0** Terapkan rate limit login.
- [ ] **P0** Bangun halaman login admin.
- [ ] **P0** Proteksi route `/admin` di frontend.
- [ ] **P1** Tangani session kedaluwarsa dan pesan error login.
- [ ] **P1** Uji alur login/logout dan akses tanpa autentikasi.

**Definition of Done:** admin dapat login/logout, route admin terlindungi, dan endpoint admin menolak request tanpa session valid.

## Fase 3 — Backend Berita dan Kategori

- [ ] **P0** Implementasikan daftar kategori.
- [ ] **P0** Implementasikan CRUD kategori dengan validasi relasi.
- [ ] **P0** Implementasikan daftar berita dengan pagination/filter dasar.
- [ ] **P0** Implementasikan detail berita berdasarkan slug.
- [ ] **P0** Implementasikan create dan update artikel.
- [ ] **P0** Implementasikan Save Draft dan Publish.
- [ ] **P0** Implementasikan unpublish dan delete dengan aturan yang jelas.
- [ ] **P0** Pastikan endpoint publik hanya mengembalikan artikel published.
- [ ] **P0** Terapkan validasi slug unik dan field wajib.
- [ ] **P0** Sanitasi rich text sebelum dirender.
- [ ] **P1** Implementasikan pencarian dan filter kategori.
- [ ] **P1** Catat aktivitas CRUD/publikasi di activity log.

**Definition of Done:** CRUD berita bekerja, draft terlindungi, validasi berjalan, dan aturan publikasi diuji.

## Fase 4 — Backend Program Kerja dan Relasi Berita

- [ ] **P0** Implementasikan daftar program kerja.
- [ ] **P0** Implementasikan detail program berdasarkan slug.
- [ ] **P0** Implementasikan create/update/delete program.
- [ ] **P0** Validasi status pelaksanaan dan status publikasi secara terpisah.
- [ ] **P0** Implementasikan relasi program dan artikel.
- [ ] **P0** Pastikan program dapat dipublikasikan tanpa artikel.
- [ ] **P0** Pastikan program selesai tetap tersimpan di katalog.
- [ ] **P0** Terapkan aturan penghapusan yang aman untuk data terkait.
- [ ] **P1** Implementasikan urutan tampilan dan filter periode jika disepakati.
- [ ] **P1** Catat aktivitas pengelolaan program.

**Definition of Done:** program dan berita dapat dikelola terpisah dan relasinya tidak menyebabkan kehilangan data tak disengaja.

## Fase 5 — Struktur Organisasi, Settings, dan Activity Log

- [ ] **P0** Implementasikan CRUD divisi.
- [ ] **P0** Implementasikan CRUD anggota.
- [ ] **P0** Implementasikan periode jabatan, urutan tampilan, dan status aktif.
- [ ] **P0** Implementasikan endpoint publik struktur organisasi.
- [ ] **P0** Implementasikan pembacaan dan perubahan pengaturan website.
- [ ] **P0** Batasi settings ke key yang diizinkan.
- [ ] **P1** Lengkapi activity log untuk aksi utama.
- [ ] **P1** Tentukan aturan penghapusan dan retensi log.
- [ ] **P1** Uji data organisasi kosong dan data tidak aktif.

**Definition of Done:** struktur organisasi dan pengaturan bisa dikelola CMS dan ditampilkan secara benar di endpoint publik.

## Fase 6 — Dashboard API

- [ ] **P0** Implementasikan ringkasan jumlah artikel dan status.
- [ ] **P0** Implementasikan jumlah program dan status pelaksanaan.
- [ ] **P1** Implementasikan agregasi publikasi artikel per bulan.
- [ ] **P1** Implementasikan publikasi vs draft.
- [ ] **P1** Implementasikan program berdasarkan status.
- [ ] **P1** Implementasikan aktivitas terbaru.
- [ ] **P0** Pastikan seluruh angka berasal dari database aktual.
- [ ] **P0** Pastikan respons empty state valid saat database belum memiliki konten.

**Definition of Done:** API dashboard memberikan statistik konsisten dengan data aktual, termasuk saat data kosong.

## Fase 7 — Frontend CMS

- [ ] **P0** Bangun layout dashboard dan navigasi CMS.
- [ ] **P0** Integrasikan halaman login dengan API.
- [ ] **P0** Bangun dashboard overview.
- [ ] **P0** Bangun daftar, form, edit, preview, dan hapus berita.
- [ ] **P0** Bangun daftar dan form program kerja.
- [ ] **P0** Bangun pengelolaan relasi berita-program.
- [ ] **P0** Bangun pengelolaan struktur organisasi.
- [ ] **P0** Bangun halaman pengaturan website.
- [ ] **P1** Tambahkan chart dashboard berdasarkan API.
- [ ] **P0** Tambahkan loading, empty, error, dan success states.
- [ ] **P0** Pertahankan isi form saat penyimpanan gagal.
- [ ] **P1** Sesuaikan responsive layout untuk tablet dan mobile.

**Definition of Done:** semua modul CMS inti terhubung ke API dan alur utama dapat diselesaikan tanpa mengedit database secara manual.

## Fase 8 — Public Website

- [ ] **P0** Implementasikan layout, navbar, dan footer publik.
- [ ] **P0** Bangun Beranda dengan konten CMS/API.
- [ ] **P0** Bangun Tentang Kami.
- [ ] **P0** Bangun katalog Program Kerja.
- [ ] **P0** Bangun daftar Berita/Blog.
- [ ] **P0** Bangun detail artikel.
- [ ] **P0** Bangun Hubungi Kami.
- [ ] **P0** Pastikan navbar publik tidak menampilkan Login.
- [ ] **P0** Pastikan `/admin/login` dapat diakses langsung.
- [ ] **P0** Pastikan konten draft tidak muncul pada halaman publik.
- [ ] **P1** Tambahkan metadata SEO dasar.
- [ ] **P1** Pastikan konten dan data resmi menggantikan placeholder sebelum launch.

**Definition of Done:** seluruh halaman publik utama berfungsi, responsif, dan menggunakan data publik dari API.

## Fase 9 — Integrasi, QA, dan Perbaikan

- [ ] **P0** Jalankan seluruh checklist `TESTING_CHECKLIST.md`.
- [ ] **P0** Uji alur login, session, dan logout.
- [ ] **P0** Uji CRUD berita, kategori, program, organisasi, dan settings.
- [ ] **P0** Uji aturan program selesai dan relasi berita-program.
- [ ] **P0** Uji endpoint publik terhadap kebocoran draft.
- [ ] **P0** Uji validasi, error, empty state, dan loading state.
- [ ] **P0** Uji responsive layout.
- [ ] **P0** Perbaiki bug P0 dan P1 yang menghalangi MVP.
- [ ] **P1** Jalankan production build dan periksa console/network errors.
- [ ] **P1** Periksa aksesibilitas dasar: label form, fokus keyboard, kontras, alt text.

**Definition of Done:** tidak ada bug blocker yang diketahui dan kriteria penerimaan MVP terpenuhi.

## Fase 10 — Deployment dan Handover

- [ ] **P0** Pilih provider hosting setelah memeriksa batas biaya dan kebutuhan.
- [ ] **P0** Siapkan database production dan jalankan schema dengan aman.
- [ ] **P0** Siapkan environment variables production.
- [ ] **P0** Konfigurasi HTTPS, CORS, dan session cookie.
- [ ] **P0** Deploy backend.
- [ ] **P0** Deploy frontend.
- [ ] **P0** Verifikasi login lintas domain jika frontend/backend terpisah.
- [ ] **P0** Jalankan smoke test production.
- [ ] **P0** Pastikan tidak ada secret dalam repository/build publik.
- [ ] **P1** Dokumentasikan proses setup, deployment, backup, dan restore.
- [ ] **P1** Siapkan mekanisme backup database yang realistis.

**Definition of Done:** website production berfungsi, login aman, konten publik benar, dan proses pemeliharaan dasar terdokumentasi.

---

## Ringkasan Status

Perbarui bagian ini saat progres berubah.

| Fase | Status | Catatan |
|---|---|---|
| 0. Finalisasi perencanaan | Todo | |
| 1. Fondasi repository dan database | Todo | |
| 2. Autentikasi dan proteksi | Todo | |
| 3. Backend berita dan kategori | Todo | |
| 4. Backend program kerja | Todo | |
| 5. Organisasi, settings, activity log | Todo | |
| 6. Dashboard API | Todo | |
| 7. Frontend CMS | Todo | |
| 8. Public website | Todo | |
| 9. Integrasi dan QA | Todo | |
| 10. Deployment | Todo | |

## Aturan Update Progres

- Tandai task `[x]` setelah diuji, bukan hanya setelah kode ditulis.
- Catat blocker dengan singkat dan spesifik.
- Jangan mengerjakan fitur P2 sebelum blocker P0 terselesaikan tanpa alasan yang jelas.
- Jika requirement berubah, perbarui PRD terlebih dahulu.
- Jika rancangan teknis berubah, perbarui `TECHNICAL_DESIGN.md`.
- Jangan memasukkan secret, password, token, atau data sensitif ke catatan progres.
