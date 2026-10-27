# Testing Checklist
## Website Resmi HMIF UNIBA Surakarta

**Versi:** 1.0 — Draft Awal  
**Status awal:** Belum diuji  
**Acuan:** `PRD.md`, `TECHNICAL_DESIGN.md`, dan `ROADMAP.md`

> Checklist ini merupakan rancangan kasus uji. Tandai selesai hanya setelah pengujian benar-benar dilakukan. Catat hasil dan bug yang ditemukan; jangan menganggap checklist ini sebagai bukti bahwa fitur sudah berjalan.

## Cara Mencatat Hasil

Untuk setiap kasus:
- `[ ]` Belum diuji
- `[x]` Lulus
- Jika gagal, catat langkah reproduksi, hasil aktual, hasil yang diharapkan, dan tingkat prioritas bug.

Prioritas bug:
- **P0 — Blocker:** keamanan, kehilangan data, atau fungsi inti tidak dapat digunakan.
- **P1 — Tinggi:** fungsi penting rusak atau alur utama terhambat.
- **P2 — Sedang/rendah:** masalah minor dengan workaround.

---

## 1. Fondasi dan Database

- [ ] **DB-01** Backend dapat terhubung ke database development.
- [ ] **DB-02** Aplikasi menampilkan error yang aman jika database tidak tersedia.
- [ ] **DB-03** Semua tabel schema yang dibutuhkan tersedia.
- [ ] **DB-04** Foreign key menolak relasi ke record yang tidak ada.
- [ ] **DB-05** Unique slug menolak duplikasi sesuai aturan.
- [ ] **DB-06** Karakter Unicode dan bahasa Indonesia tersimpan dengan benar.
- [ ] **DB-07** Tanggal dan timestamp disimpan/dibaca secara konsisten.
- [ ] **DB-08** Database baru hanya berisi seed yang disepakati, bukan data organisasi fiktif.
- [ ] **DB-09** Kredensial database tidak tersimpan di source code atau repository.
- [ ] **DB-10** Query list/filter tidak menyebabkan error ketika data kosong.

## 2. Autentikasi dan Session

- [ ] **AUTH-01** Login dengan kredensial valid berhasil.
- [ ] **AUTH-02** Login dengan password salah ditolak.
- [ ] **AUTH-03** Login dengan email yang tidak terdaftar ditolak tanpa membocorkan informasi berlebihan.
- [ ] **AUTH-04** Request ke endpoint admin tanpa session ditolak.
- [ ] **AUTH-05** Login menghasilkan session yang valid.
- [ ] **AUTH-06** Session ID diregenerasi atau diamankan setelah autentikasi.
- [ ] **AUTH-07** Logout menginvalidasi session di server.
- [ ] **AUTH-08** Session yang sudah logout tidak dapat digunakan kembali.
- [ ] **AUTH-09** Session kedaluwarsa ditangani dengan jelas oleh frontend.
- [ ] **AUTH-10** Login rate limit bekerja setelah percobaan berulang.
- [ ] **AUTH-11** Route `/admin` mengarahkan pengguna belum login ke `/admin/login`.
- [ ] **AUTH-12** Route `/admin/login` dapat dibuka langsung.
- [ ] **AUTH-13** Navbar publik tidak menampilkan tombol Login.
- [ ] **AUTH-14** Cookie production memiliki atribut keamanan yang sesuai dengan deployment.
- [ ] **AUTH-15** CORS hanya mengizinkan origin yang ditentukan ketika credentials digunakan.
- [ ] **AUTH-16** Password tidak pernah disimpan atau dicatat dalam bentuk plaintext.

## 3. Berita dan Kategori

### Kategori

- [ ] **CAT-01** Kategori dapat ditampilkan.
- [ ] **CAT-02** Admin dapat membuat kategori valid.
- [ ] **CAT-03** Admin dapat mengedit kategori.
- [ ] **CAT-04** Slug kategori duplikat ditolak.
- [ ] **CAT-05** Penghapusan kategori yang masih dipakai ditangani sesuai kebijakan.
- [ ] **CAT-06** Pengunjung tanpa session tidak dapat memutasi kategori.

### Artikel

- [ ] **NEWS-01** Admin dapat membuat artikel draft.
- [ ] **NEWS-02** Artikel draft muncul dalam daftar CMS.
- [ ] **NEWS-03** Artikel draft tidak muncul di daftar publik.
- [ ] **NEWS-04** Akses langsung ke slug draft dari publik ditolak atau tidak ditemukan.
- [ ] **NEWS-05** Admin dapat mengedit artikel.
- [ ] **NEWS-06** Admin dapat menyimpan perubahan sebagai draft.
- [ ] **NEWS-07** Artikel valid dapat dipublikasikan.
- [ ] **NEWS-08** Publikasi ditolak jika field wajib belum lengkap.
- [ ] **NEWS-09** Artikel published muncul di daftar publik.
- [ ] **NEWS-10** Unpublish membuat artikel tidak lagi tersedia untuk publik.
- [ ] **NEWS-11** Slug duplikat ditolak dengan pesan yang jelas.
- [ ] **NEWS-12** Edit judul tidak diam-diam mengubah slug terbit tanpa aturan yang disepakati.
- [ ] **NEWS-13** Pencarian dan filter kategori mengembalikan hasil yang sesuai.
- [ ] **NEWS-14** Pagination bekerja dan tidak menduplikasi atau melewatkan record secara tidak wajar.
- [ ] **NEWS-15** Penghapusan artikel memerlukan konfirmasi di UI.
- [ ] **NEWS-16** Artikel yang terhubung ke program ditangani dengan benar saat salah satu entitas dihapus.
- [ ] **NEWS-17** HTML rich text berbahaya disanitasi sebelum dirender.
- [ ] **NEWS-18** Kegagalan simpan mempertahankan isi form.
- [ ] **NEWS-19** Loading, empty, error, dan success state tampil sesuai kondisi.
- [ ] **NEWS-20** Artikel menampilkan tanggal publikasi dan gambar sampul dengan benar bila tersedia.

## 4. Program Kerja

- [ ] **PROG-01** Admin dapat membuat program sebagai draft.
- [ ] **PROG-02** Admin dapat memublikasikan program tanpa membuat artikel berita.
- [ ] **PROG-03** Program draft tidak tampil ke publik.
- [ ] **PROG-04** Program published tampil di katalog publik.
- [ ] **PROG-05** Admin dapat mengubah status pelaksanaan menjadi `planned`.
- [ ] **PROG-06** Admin dapat mengubah status pelaksanaan menjadi `ongoing`.
- [ ] **PROG-07** Admin dapat mengubah status pelaksanaan menjadi `completed`.
- [ ] **PROG-08** Perubahan status pelaksanaan tidak otomatis mengubah status publikasi.
- [ ] **PROG-09** Program completed tetap tersedia dalam katalog selama published.
- [ ] **PROG-10** Admin dapat menghubungkan program dengan artikel.
- [ ] **PROG-11** Program dapat memiliki lebih dari satu artikel jika aturan final mengizinkan.
- [ ] **PROG-12** Relasi program-artikel tidak menciptakan relasi duplikat.
- [ ] **PROG-13** Admin dapat menghapus relasi tanpa menghapus program atau artikel secara tidak sengaja.
- [ ] **PROG-14** Tanggal mulai dan akhir divalidasi.
- [ ] **PROG-15** Filter atau urutan katalog bekerja sesuai keputusan produk.
- [ ] **PROG-16** Penghapusan program menangani relasi dengan aman.
- [ ] **PROG-17** Form mempertahankan isi saat request gagal.
- [ ] **PROG-18** Loading, empty, error, dan success state tampil dengan benar.

## 5. Struktur Organisasi

- [ ] **ORG-01** Admin dapat membuat dan mengedit divisi.
- [ ] **ORG-02** Admin dapat membuat dan mengedit anggota.
- [ ] **ORG-03** Anggota terhubung ke divisi yang valid.
- [ ] **ORG-04** Nama, jabatan, periode, dan urutan tampilan tervalidasi.
- [ ] **ORG-05** Status aktif/nonaktif ditangani dengan benar.
- [ ] **ORG-06** Data publik hanya menampilkan field yang dimaksudkan untuk publik.
- [ ] **ORG-07** Urutan anggota dan divisi pada website sesuai pengaturan CMS.
- [ ] **ORG-08** Pemilihan anggota menampilkan drawer/panel detail yang benar.
- [ ] **ORG-09** Foto yang tidak tersedia memiliki fallback yang layak.
- [ ] **ORG-10** Penghapusan divisi dengan anggota terkait ditangani sesuai kebijakan.
- [ ] **ORG-11** Data kosong tidak menghasilkan error layout.
- [ ] **ORG-12** Perubahan organisasi tidak memengaruhi data program secara tak terduga.

## 6. Pengaturan Website

- [ ] **SET-01** Pengaturan publik dapat dibaca tanpa membocorkan data sensitif.
- [ ] **SET-02** Hanya admin dapat mengubah pengaturan.
- [ ] **SET-03** Admin dapat mengubah konten hero yang disepakati.
- [ ] **SET-04** Admin dapat memperbarui profil singkat, visi, dan misi.
- [ ] **SET-05** Admin dapat memperbarui kontak dan tautan sosial yang disepakati.
- [ ] **SET-06** Key pengaturan yang tidak dikenal ditolak.
- [ ] **SET-07** Nilai dengan format salah ditolak dengan pesan yang jelas.
- [ ] **SET-08** Konten yang diperbarui tampil pada halaman publik yang sesuai.
- [ ] **SET-09** Kegagalan simpan mempertahankan nilai form.
- [ ] **SET-10** Loading, empty, error, dan success state bekerja.

## 7. Dashboard dan Activity Log

- [ ] **DASH-01** Total artikel cocok dengan data database.
- [ ] **DASH-02** Jumlah draft dan published cocok dengan data database.
- [ ] **DASH-03** Total program cocok dengan data database.
- [ ] **DASH-04** Distribusi status program cocok dengan data database.
- [ ] **DASH-05** Grafik publikasi bulanan menggunakan tanggal publikasi sesuai definisi final.
- [ ] **DASH-06** Dashboard tidak menampilkan angka dummy sebagai statistik aktual.
- [ ] **DASH-07** Kondisi tanpa data menampilkan empty state yang jelas.
- [ ] **DASH-08** Timeline aktivitas menampilkan aktivitas terbaru sesuai urutan.
- [ ] **LOG-01** Aktivitas penting tercatat.
- [ ] **LOG-02** Data sensitif seperti password dan token tidak dicatat.
- [ ] **LOG-03** Kegagalan penulisan log tidak merusak alur utama secara tidak terduga.
- [ ] **LOG-04** Log ditampilkan hanya kepada admin yang berwenang.

## 8. Public Website

- [ ] **PUB-01** Beranda memuat hero, pengenalan, program, statistik, organisasi, berita, CTA, dan footer sesuai rancangan.
- [ ] **PUB-02** Tentang Kami menampilkan profil dan konten resmi.
- [ ] **PUB-03** Halaman Program Kerja menampilkan hanya program published.
- [ ] **PUB-04** Program completed tidak otomatis hilang dari katalog.
- [ ] **PUB-05** Halaman berita hanya menampilkan artikel published.
- [ ] **PUB-06** Detail artikel berdasarkan slug bekerja.
- [ ] **PUB-07** Pencarian dan filter berita bekerja.
- [ ] **PUB-08** Artikel terkait menautkan ke program yang benar.
- [ ] **PUB-09** Halaman Hubungi Kami menampilkan kontak resmi yang benar.
- [ ] **PUB-10** Data placeholder diganti data resmi sebelum peluncuran.
- [ ] **PUB-11** Statistik yang tidak memiliki data terverifikasi disembunyikan atau ditampilkan dengan fallback yang jujur.
- [ ] **PUB-12** Navigasi dan footer konsisten di semua halaman.
- [ ] **PUB-13** Link eksternal dan sosial mengarah ke tujuan yang benar.
- [ ] **PUB-14** Halaman menampilkan fallback gambar jika sampul tidak tersedia.
- [ ] **PUB-15** Refresh pada URL halaman dalam tidak menghasilkan 404 di hosting.

## 9. UI, Responsivitas, dan Aksesibilitas Dasar

- [ ] **UI-01** Layout diuji pada desktop.
- [ ] **UI-02** Layout diuji pada tablet.
- [ ] **UI-03** Layout diuji pada mobile.
- [ ] **UI-04** Tidak ada horizontal overflow yang tidak disengaja.
- [ ] **UI-05** Form memiliki label yang jelas.
- [ ] **UI-06** Error validasi dapat dipahami.
- [ ] **UI-07** Kontrol utama dapat digunakan dengan keyboard.
- [ ] **UI-08** Fokus keyboard terlihat.
- [ ] **UI-09** Gambar informatif memiliki alt text yang sesuai.
- [ ] **UI-10** Kontras teks dan latar cukup terbaca.
- [ ] **UI-11** Tombol loading mencegah pengiriman ganda jika diperlukan.
- [ ] **UI-12** Tindakan hapus atau tindakan destruktif meminta konfirmasi.
- [ ] **UI-13** Empty state memberi penjelasan atau tindakan berikutnya.
- [ ] **UI-14** Palet warna dan tipografi mengikuti design system yang disetujui.

## 10. Keamanan Dasar

- [ ] **SEC-01** Semua endpoint mutasi CMS menolak pengguna tanpa session valid.
- [ ] **SEC-02** Endpoint publik tidak membocorkan draft.
- [ ] **SEC-03** Validasi dilakukan di backend.
- [ ] **SEC-04** Input SQL diproses melalui query terparameterisasi atau mekanisme aman yang setara.
- [ ] **SEC-05** Rich text disanitasi sebelum render.
- [ ] **SEC-06** Upload menolak tipe file yang tidak diizinkan.
- [ ] **SEC-07** Upload menolak file yang melampaui batas ukuran.
- [ ] **SEC-08** Error publik tidak mengandung stack trace atau detail SQL.
- [ ] **SEC-09** Secret tidak berada di source code, client bundle, atau repository.
- [ ] **SEC-10** Cookie production memiliki atribut yang sesuai.
- [ ] **SEC-11** CORS tidak menggunakan origin wildcard dengan credentials.
- [ ] **SEC-12** Rate limit login diuji.
- [ ] **SEC-13** Session logout benar-benar tidak dapat digunakan lagi.
- [ ] **SEC-14** Kebijakan CSRF ditetapkan dan diuji sesuai topologi deployment.
- [ ] **SEC-15** Log tidak menyimpan password, session ID, atau token rahasia.

## 11. Build, Deployment, dan Smoke Test

- [ ] **DEP-01** Frontend production build berhasil.
- [ ] **DEP-02** Backend dapat dijalankan dengan environment production.
- [ ] **DEP-03** Database production menggunakan schema yang benar.
- [ ] **DEP-04** Environment variables wajib tersedia.
- [ ] **DEP-05** HTTPS aktif pada domain publik.
- [ ] **DEP-06** CORS dan cookie bekerja pada domain production.
- [ ] **DEP-07** Login, akses dashboard, dan logout berhasil di production.
- [ ] **DEP-08** Admin dapat membuat dan memublikasikan konten uji yang aman.
- [ ] **DEP-09** Konten published muncul di public website.
- [ ] **DEP-10** Konten draft tetap tersembunyi dari publik.
- [ ] **DEP-11** Refresh halaman dalam tidak menghasilkan 404.
- [ ] **DEP-12** Error API dan database ditangani dengan benar.
- [ ] **DEP-13** Backup dan prosedur restore telah ditentukan serta diuji sebelum data penting dipakai.
- [ ] **DEP-14** Tidak ada secret atau data uji sensitif dalam artefak publik.

## 12. Catatan Bug

Gunakan format berikut untuk setiap bug yang ditemukan:

```text
ID:
Judul:
Prioritas: P0 / P1 / P2
Lingkungan: Local / Staging / Production
Prasyarat:
Langkah reproduksi:
Hasil yang diharapkan:
Hasil aktual:
Bukti/log (tanpa secret):
Status: Open / In Progress / Fixed / Retested
```

## 13. Sign-off MVP

Sebelum menyatakan MVP siap diluncurkan:

- [ ] Semua kasus P0 yang relevan telah lulus.
- [ ] Tidak ada bug P0 terbuka.
- [ ] Alur autentikasi dan proteksi data lulus.
- [ ] CRUD berita dan program lulus.
- [ ] Struktur organisasi dan settings lulus.
- [ ] Public website menampilkan konten yang benar.
- [ ] Build production dan smoke test lulus.
- [ ] Backup dan akses operasional telah dipertimbangkan.
- [ ] Kriteria penerimaan di `PRD.md` telah diperiksa.

**Catatan:** checklist ini perlu disesuaikan ketika requirement atau implementasi berubah. Jangan menghapus kasus uji penting tanpa mencatat alasannya.
