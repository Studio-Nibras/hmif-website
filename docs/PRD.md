# Product Requirements Document (PRD)
## Website Resmi HMIF UNIBA Surakarta

**Versi:** 1.0 — Draft Awal  
**Status:** In Progress  
**Platform:** Web Application  
**Stack:** React + Vite, Express.js, MySQL  
**Dokumen:** Acuan utama perencanaan, pengembangan, pengujian, dan deployment website HMIF.

---

## 1. Ringkasan Proyek

Website HMIF UNIBA merupakan platform resmi Himpunan Mahasiswa Informatika Universitas Islam Batik Surakarta yang berfungsi sebagai pusat informasi, publikasi kegiatan, dokumentasi program kerja, serta representasi identitas organisasi di ranah digital.

Website terdiri dari dua bagian utama:

1. **Public Website:** halaman yang dapat diakses masyarakat umum, mahasiswa, calon anggota, dan pihak yang ingin mengenal HMIF.
2. **Admin CMS:** dashboard internal untuk mengelola berita, program kerja, struktur organisasi, dan konten website tanpa perlu mengubah kode secara langsung.

Pengembangan dilakukan secara bertahap dengan mengutamakan fungsi inti, keamanan, dan kemudahan pengelolaan konten sebelum melakukan penyempurnaan visual.

## 2. Latar Belakang dan Permasalahan

Website organisasi diperlukan agar informasi HMIF tersaji secara terpusat, konsisten, dan mudah diakses.

Permasalahan yang ingin diatasi:

- Informasi organisasi dan program kerja belum memiliki pusat publikasi digital yang terintegrasi.
- Dokumentasi kegiatan dan pencapaian berpotensi tersebar di berbagai platform.
- Informasi program kerja perlu tetap tersedia meskipun kegiatannya sudah selesai.
- Pengelolaan konten perlu dapat dilakukan oleh pengurus tanpa harus mengedit source code.
- Identitas dan citra profesional HMIF perlu direpresentasikan melalui website resmi.

## 3. Tujuan Proyek

### 3.1 Tujuan Utama

- Menyediakan website profil resmi HMIF.
- Mempermudah publikasi berita, pengumuman, prestasi, dan dokumentasi kegiatan.
- Menyediakan katalog program kerja yang dapat diperbarui oleh admin.
- Menyajikan struktur organisasi yang interaktif.
- Menyediakan CMS yang aman dan mudah digunakan.
- Menjaga informasi publik tetap konsisten dengan data yang dikelola melalui database.

### 3.2 Indikator Keberhasilan

- Seluruh halaman publik utama dapat diakses dan berfungsi.
- Admin dapat login dan logout dengan aman.
- Admin dapat membuat, mengedit, memublikasikan, dan menghapus berita sesuai aturan.
- Admin dapat mengelola program kerja tanpa harus membuat artikel berita.
- Program kerja yang telah selesai tetap tersimpan dalam katalog.
- Struktur organisasi dan pengaturan konten dapat dikelola melalui CMS.
- Konten draft tidak dapat diakses melalui endpoint publik.
- Dashboard menampilkan statistik berdasarkan data aktual, bukan angka dummy.
- Website dapat dibangun dan dijalankan pada lingkungan deployment yang ditentukan.

## 4. Target Pengguna

### 4.1 Pengunjung Publik

Termasuk mahasiswa, calon anggota, alumni, civitas akademika, dan masyarakat umum.

Kebutuhan:
- Mengenal HMIF dan identitas organisasinya.
- Mengetahui program kerja dan kegiatan.
- Membaca berita, pengumuman, serta prestasi.
- Melihat struktur organisasi.
- Menemukan informasi kontak resmi.

### 4.2 Admin HMIF

Pengguna internal yang bertanggung jawab atas pengelolaan website.

Kebutuhan:
- Mengelola berita dan program kerja.
- Mengatur struktur organisasi.
- Memperbarui konten halaman utama.
- Memantau ringkasan data melalui dashboard.
- Melihat aktivitas dasar pengelolaan konten.

## 5. Ruang Lingkup MVP

### 5.1 Termasuk dalam MVP

- Public website.
- Autentikasi admin.
- Dashboard overview.
- CRUD berita dan kategori berita.
- CRUD program kerja.
- Relasi program kerja dengan artikel berita.
- Pengelolaan struktur organisasi.
- Pengaturan konten website.
- Upload atau pengelolaan gambar sesuai mekanisme yang dipilih.
- Activity log dasar.
- Validasi input, proteksi endpoint, dan penanganan error.
- Deployment frontend, backend, dan database.

### 5.2 Di Luar Ruang Lingkup MVP

- Registrasi anggota secara publik.
- Multi-role dan permission kompleks.
- Sistem presensi.
- Pembayaran dan iuran.
- Chat internal.
- Notifikasi email otomatis.
- Analitik pageview lanjutan.
- Audit trail tingkat lanjut.
- Sistem keanggotaan lengkap.

Fitur di luar MVP dapat dipertimbangkan kembali setelah fitur inti stabil.

## 6. Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Komunikasi | REST API berbasis JSON |
| Autentikasi | Session-based authentication |
| Password | Hashing menggunakan bcrypt |
| Styling | Mengikuti design system HMIF |
| Rich text | Editor yang mendukung konten berita |
| Deployment | TBD |

Versi dependensi, pilihan image storage, hosting, dan konfigurasi production ditetapkan saat implementasi.

## 7. Struktur Public Website

Navbar publik tidak menampilkan tombol Login. Admin mengakses halaman login melalui URL langsung `/admin/login`.

### 7.1 Beranda

Urutan konten yang direncanakan:

1. Hero section.
2. Pengenalan singkat HMIF.
3. Alasan bergabung dengan HMIF.
4. Preview program kerja.
5. Statistik HMIF.
6. Preview struktur organisasi.
7. Berita terbaru.
8. Call to action.
9. Footer.

Ketentuan:
- Hero dan konten utama dapat diperbarui melalui CMS.
- Statistik hanya menggunakan data yang telah diverifikasi.
- Jika data statistik belum tersedia, bagian tersebut tidak boleh menampilkan angka fiktif.
- Berita terbaru hanya menampilkan artikel berstatus published.
- Program kerja yang ditampilkan mengikuti pengaturan publikasi dan urutan tampilan.

### 7.2 Tentang Kami

Memuat:
- Profil HMIF.
- Sejarah atau timeline organisasi.
- Visi dan misi.
- Nilai-nilai organisasi.
- Struktur organisasi interaktif.

Struktur organisasi direncanakan menggunakan tampilan interaktif. Ketika pengguna memilih anggota, informasi anggota ditampilkan melalui drawer atau panel samping.

Data sejarah, visi, misi, dan anggota harus berasal dari informasi resmi yang diberikan HMIF.

### 7.3 Program Kerja

Halaman ini merupakan **katalog program kerja resmi HMIF**, bukan sekadar daftar artikel kegiatan.

Informasi setiap program dapat mencakup:
- Nama program.
- Deskripsi.
- Periode.
- Divisi penanggung jawab.
- Nama PIC.
- Tanggal mulai dan selesai jika tersedia.
- Status pelaksanaan.
- Gambar sampul jika tersedia.
- Artikel berita terkait jika tersedia.

Status pelaksanaan:
- `planned`
- `ongoing`
- `completed`

Status publikasi:
- `draft`
- `published`

Kedua status tersebut memiliki fungsi berbeda dan tidak boleh digabungkan.

Aturan bisnis:
- Program yang telah selesai tetap berada dalam katalog.
- Program dapat dipublikasikan tanpa artikel berita.
- Artikel berita dapat dibuat terpisah setelah kegiatan berlangsung.
- Artikel berita dapat dihubungkan ke program terkait.
- Program berstatus draft tidak ditampilkan kepada publik.
- Penyelesaian program tidak otomatis mengubah status publikasi artikel.
- Program yang selesai tidak otomatis dihapus dari katalog.

### 7.4 Berita / Blog

Kategori awal:
- Kegiatan.
- Prestasi.
- Pengumuman.
- Akademik.

Fitur:
- Daftar berita.
- Detail artikel.
- Pencarian.
- Filter kategori.
- Tanggal publikasi.
- Gambar sampul.
- Konten artikel.
- Navigasi ke program kerja terkait jika tersedia.

Artikel memiliki status:
- `draft`
- `published`

Aturan:
- Artikel draft hanya dapat diakses admin yang berwenang.
- Artikel published dapat diakses publik.
- Artikel hanya dianggap terbit setelah validasi publikasi berhasil.
- Slug harus unik.
- Slug yang telah digunakan untuk artikel terbit sebaiknya tidak berubah secara otomatis ketika judul diedit.

### 7.5 Hubungi Kami

Menyediakan informasi kontak resmi HMIF.

Jenis informasi, tautan media sosial, email, dan detail kontak final ditentukan berdasarkan data resmi organisasi.

Formulir pesan langsung belum termasuk MVP kecuali diputuskan pada tahap berikutnya.

### 7.6 Halaman yang Tidak Dibuat

- Halaman registrasi admin publik.
- Halaman login pada navbar publik.
- Halaman prestasi terpisah karena prestasi merupakan kategori berita.

## 8. Admin CMS

### 8.1 Login dan Autentikasi

URL:
- `/admin/login`
- `/admin` untuk dashboard yang dilindungi autentikasi.

Ketentuan:
- MVP menggunakan satu akun admin utama.
- Tidak tersedia registrasi admin publik.
- Akun awal dibuat melalui proses setup yang terkontrol.
- Password disimpan dalam bentuk hash, bukan plaintext.
- Endpoint admin harus dilindungi middleware autentikasi.
- Pengguna yang belum login akan diarahkan ke halaman login ketika mengakses dashboard.
- Logout harus menginvalidasi session di server.
- Login memiliki pembatasan percobaan untuk mengurangi risiko brute force.
- Session cookie dikonfigurasi dengan aman untuk lingkungan HTTPS.

### 8.2 Dashboard Overview

Menampilkan ringkasan:
- Total artikel.
- Artikel published dan draft.
- Total program kerja.
- Ringkasan status pelaksanaan program.
- Grafik publikasi artikel per bulan.
- Grafik perbandingan artikel published dan draft.
- Grafik status program kerja.
- Timeline aktivitas terbaru.

Ketentuan:
- Semua statistik bersumber dari database.
- Data dummy tidak boleh disajikan sebagai data aktual.
- Kondisi tanpa data harus memiliki empty state.
- Analitik pageview tidak termasuk MVP.

### 8.3 Kelola Berita

Fitur:
- Daftar berita.
- Pencarian dan filter kategori/status.
- Tambah artikel.
- Edit artikel.
- Simpan sebagai draft.
- Preview artikel.
- Publikasikan artikel.
- Hapus artikel dengan konfirmasi.
- Atur kategori.
- Hubungkan artikel dengan program kerja.

Editor artikel perlu mendukung format konten yang dibutuhkan untuk publikasi.

Aturan publikasi:
- Tombol Save Draft menyimpan artikel sebagai draft.
- Tombol Preview menampilkan tampilan artikel sebelum dipublikasikan.
- Tombol Publish memvalidasi field wajib sebelum mengubah status menjadi published.
- Kegagalan penyimpanan tidak boleh menghapus isi form yang sedang diedit.
- Konten rich text harus divalidasi dan disanitasi sebelum dirender.

### 8.4 Kelola Program Kerja

Fitur:
- Daftar program.
- Tambah program.
- Edit program.
- Atur status pelaksanaan.
- Atur status publikasi.
- Atur divisi dan PIC.
- Atur periode dan tanggal.
- Atur urutan tampilan.
- Hubungkan program dengan artikel berita.
- Hapus program dengan konfirmasi.

Aturan:
- Status pelaksanaan terpisah dari status publikasi.
- Program selesai tetap tersimpan.
- Perubahan program tidak otomatis membuat artikel berita.
- Penghapusan program harus mempertimbangkan relasi artikel yang terkait agar tidak menyebabkan data yatim atau kehilangan informasi yang tidak disengaja.

### 8.5 Kelola Struktur Organisasi

Fitur:
- Tambah dan edit divisi.
- Tambah dan edit anggota.
- Atur jabatan.
- Atur foto dan bio.
- Atur periode jabatan.
- Atur urutan tampilan.
- Mengatur status anggota aktif atau tidak aktif.

Ketentuan:
- Data ditampilkan secara konsisten di halaman Tentang Kami.
- Perubahan urutan di CMS memengaruhi urutan pada halaman publik.
- Data yang belum diverifikasi tidak boleh dianggap sebagai struktur resmi.

### 8.6 Pengaturan Website

Mengelola konten yang perlu diperbarui tanpa mengubah source code, seperti:
- Hero title dan subtitle.
- CTA.
- Visi dan misi.
- Profil singkat.
- Informasi kontak.
- Tautan media sosial.
- Konten footer.
- Konten statis lain yang disepakati.

Pengaturan harus menggunakan daftar key yang terdefinisi dan divalidasi, bukan memberikan akses bebas untuk mengubah konfigurasi sistem.

### 8.7 Activity Log

Mencatat aktivitas penting admin, misalnya:
- Login dan logout.
- Membuat artikel.
- Mengedit artikel.
- Memublikasikan artikel.
- Menghapus artikel.
- Membuat atau memperbarui program kerja.
- Memperbarui struktur organisasi.
- Mengubah pengaturan website.

Activity log MVP bersifat dasar, bukan audit trail lengkap.

## 9. Database

Database awal bernama `hmif_website`, menggunakan MySQL 8+ dan charset `utf8mb4`.

Tabel yang direncanakan:

| Tabel | Fungsi |
|---|---|
| `admins` | Akun admin |
| `news_categories` | Kategori berita |
| `news_articles` | Konten berita |
| `programs` | Data program kerja |
| `program_news` | Relasi program kerja dan artikel |
| `organization_divisions` | Divisi organisasi |
| `organization_members` | Anggota dan jabatan |
| `website_settings` | Pengaturan konten website |
| `activity_logs` | Riwayat aktivitas admin |

Ketentuan database:
- Gunakan primary key dan foreign key sesuai kebutuhan.
- Slug kategori, berita, dan program harus unik pada tabel masing-masing.
- Field yang sering dipakai untuk pencarian atau filter perlu dipertimbangkan untuk indexing.
- Data terkait harus ditangani dengan aturan penghapusan yang jelas.
- Gunakan validasi di backend selain constraint database.
- Kategori berita awal dapat di-seed.
- Data admin, program kerja, dan struktur organisasi tidak boleh diisi dengan data fiktif.
- Akun admin awal dibuat melalui setup terkontrol, bukan akun default yang ditanamkan ke source code.

Detail tipe data, constraint, dan indeks mengacu pada file skema SQL terpisah.

## 10. Rancangan REST API

Prefix API: `/api`

### Autentikasi
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Dashboard
- `GET /api/dashboard/stats`
- `GET /api/dashboard/publication-overview`
- `GET /api/dashboard/program-overview`
- `GET /api/dashboard/recent-activity`

### Kategori Berita
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

### Berita
- `GET /api/news`
- `GET /api/news/:slug`
- `POST /api/news`
- `PATCH /api/news/:id`
- `DELETE /api/news/:id`
- `POST /api/news/:id/publish`
- `POST /api/news/:id/unpublish`

### Program Kerja
- `GET /api/programs`
- `GET /api/programs/:slug`
- `POST /api/programs`
- `PATCH /api/programs/:id`
- `DELETE /api/programs/:id`
- Endpoint tambahan untuk relasi program dan berita jika diperlukan.

### Struktur Organisasi
- `GET /api/organization`
- Endpoint CRUD untuk divisi dan anggota.

### Pengaturan Website
- `GET /api/settings`
- `PATCH /api/settings`

Daftar ini adalah rancangan awal. Metode HTTP, format payload, pagination, validasi, dan kode respons final perlu ditetapkan sebelum implementasi setiap modul.

Aturan penting:
- Endpoint publik hanya mengembalikan konten published.
- Endpoint mutasi admin harus memerlukan autentikasi.
- Input divalidasi di backend.
- Error menggunakan format respons yang konsisten.
- Endpoint publik dan endpoint admin harus dibedakan dengan jelas.

## 11. Desain dan Identitas Visual

Arah desain mengikuti referensi desain HMIF yang sudah dibahas.

### Palet warna

- Deep Teal: `#07536A`
- Sky Blue: `#A9D2F4`
- Dark Navy: `#17364F`

### Tipografi

- Plus Jakarta Sans.
- Manrope.

### Prinsip desain

- Modern, bersih, dan profesional.
- Memperkuat identitas organisasi mahasiswa informatika.
- Navigasi mudah dipahami.
- Layout konsisten pada seluruh halaman.
- Menggunakan rounded corners secara terukur.
- Aksen glass-tech digunakan seperlunya.
- Responsif untuk desktop, tablet, dan mobile.
- Dashboard mengutamakan keterbacaan dan efisiensi kerja.

Desain final tetap mengacu pada referensi visual yang disetujui dan tidak boleh mengorbankan fungsi inti.

## 12. Keamanan dan Validasi

Persyaratan minimum:
- Password menggunakan hashing yang sesuai.
- Secret dan kredensial disimpan di environment variables.
- File `.env` tidak masuk repository.
- Endpoint admin dilindungi autentikasi.
- Session dikonfigurasi dengan aman.
- Login diberi rate limit.
- Rich text disanitasi untuk mencegah XSS.
- Upload gambar membatasi tipe file dan ukuran.
- Data yang ditampilkan di frontend tidak boleh menggantikan validasi backend.
- Error database tidak menampilkan detail sensitif kepada publik.
- Penghapusan data penting memerlukan konfirmasi di antarmuka.
- Konfigurasi production harus memperhatikan HTTPS, CORS, dan cookie lintas origin jika frontend dan backend berada pada domain berbeda.

## 13. UX, Loading, dan Error States

Setiap modul yang mengambil atau mengubah data perlu memiliki:
- Loading state.
- Empty state.
- Error state.
- Success feedback.
- Validasi form.
- Konfirmasi tindakan destruktif.
- Penanganan session yang kedaluwarsa.

Ketentuan:
- Kegagalan API tidak boleh membuat halaman rusak tanpa penjelasan.
- Data form dipertahankan jika penyimpanan gagal.
- Pengguna mendapat pesan yang jelas setelah operasi berhasil atau gagal.
- Empty state menyediakan konteks atau tindakan berikutnya jika relevan.

## 14. Kriteria Penerimaan MVP

MVP dapat dianggap siap ketika:

1. Semua halaman publik utama dapat dibuka dan dinavigasikan.
2. Halaman publik menampilkan konten dari database.
3. Admin dapat login, mengakses dashboard, dan logout.
4. Pengunjung yang belum login tidak dapat mengakses fitur CMS.
5. CRUD berita bekerja dengan validasi dan status draft/published.
6. Artikel draft tidak dapat diakses oleh publik.
7. CRUD program kerja bekerja secara terpisah dari berita.
8. Program selesai tetap ada dalam katalog.
9. Program dapat memiliki artikel terkait, tetapi artikel bukan syarat keberadaan program.
10. Struktur organisasi dapat dikelola melalui CMS.
11. Pengaturan konten website dapat diperbarui melalui CMS.
12. Statistik dashboard bersumber dari data aktual.
13. Activity log mencatat aktivitas utama yang ditentukan.
14. Error state dan empty state tersedia.
15. Konfigurasi production tidak mengandalkan secret yang ditanam di source code.

## 15. Strategi Pengembangan

### Tahap 1 — Fondasi
- Finalisasi PRD dan kebutuhan yang belum ditentukan.
- Setup repository dan struktur folder.
- Setup database.
- Konfigurasi environment.
- Setup koneksi MySQL.
- Setup Express.js dan format error API.

### Tahap 2 — Autentikasi
- Setup akun admin awal.
- Login dan logout.
- Session.
- Middleware proteksi endpoint.
- Proteksi route admin pada frontend.

### Tahap 3 — Backend CMS
- CRUD kategori dan berita.
- CRUD program kerja.
- Relasi program dan berita.
- CRUD struktur organisasi.
- Pengaturan website.
- Activity log.

### Tahap 4 — Frontend CMS
- Login.
- Dashboard overview.
- Form dan daftar berita.
- Form dan daftar program.
- Struktur organisasi.
- Pengaturan website.

### Tahap 5 — Public Website
- Beranda.
- Tentang Kami.
- Program Kerja.
- Berita dan detail artikel.
- Hubungi Kami.

### Tahap 6 — Integrasi dan QA
- Integrasi seluruh halaman dengan API.
- Pengujian autentikasi dan otorisasi.
- Pengujian CRUD dan relasi data.
- Pengujian responsif.
- Pengujian empty/error states.
- Pemeriksaan keamanan dasar.

### Tahap 7 — Deployment
- Konfigurasi database production.
- Konfigurasi environment production.
- Deployment backend dan frontend.
- Verifikasi session lintas origin bila diperlukan.
- Smoke test seluruh fitur inti.

Urutan dapat disesuaikan setelah fondasi dan dependensi teknis diketahui.

## 16. Hal yang Masih Perlu Diputuskan (TBD)

- [ ] Nama domain dan strategi hosting.
- [ ] Pilihan image storage untuk foto anggota dan sampul berita.
- [ ] Pilihan rich text editor.
- [ ] Mekanisme setup dan pemulihan akun admin.
- [ ] Apakah halaman kontak hanya berisi informasi atau juga formulir pesan.
- [ ] Konten resmi: sejarah, visi, misi, nilai, dan kontak HMIF.
- [ ] Data resmi program kerja dan struktur organisasi.
- [ ] Apakah program perlu fitur arsip/filter berdasarkan periode.
- [ ] Apakah kategori berita dapat ditambah/dihapus admin atau hanya dikelola terbatas.
- [ ] Format pagination dan filter API.
- [ ] Kebijakan backup database.
- [ ] Kebutuhan SEO dan metadata artikel.
- [ ] Kebutuhan aksesibilitas dan target browser.
- [ ] Mekanisme pengujian otomatis.
- [ ] Detail format API dan skema validasi.

## 17. Aturan Pemeliharaan PRD

Dokumen ini menjadi acuan utama selama development.

- Keputusan baru yang mengubah scope, alur, atau aturan bisnis harus dicatat di PRD.
- Fitur yang belum disepakati tidak dianggap sebagai requirement final.
- Jika implementasi menyimpang dari PRD, perubahan harus disengaja dan didokumentasikan.
- Setiap modul yang selesai perlu diperiksa terhadap kriteria penerimaannya.
- Bug dan pekerjaan tersisa dicatat di daftar task terpisah.
- Perubahan versi PRD dilakukan ketika terdapat perubahan requirement yang berarti.

**Prinsip utama:** bangun fitur yang dibutuhkan, pastikan aturan bisnis benar, lalu sempurnakan tampilan dan pengalaman pengguna.
