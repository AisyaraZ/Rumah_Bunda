# LMS Rumah Bunda – Belajar Mandiri Siswa Kelas 7 SMP

Selamat datang di platform **LMS Rumah Bunda**, sebuah sistem manajemen pembelajaran modern, ramah siswa, dan minimalis yang dirancang khusus untuk pembelajaran mandiri siswa kelas VII SMP.

---

## 🌟 Fitur Utama

1. **Desain Bersih & Ramah Siswa (Clean Pastel Look)**:
   - Palet warna lembut: Putih, sage green (`#557F63`), soft blue (`#3E7E9F`), dan warm cream (`#FAF8F2`).
   - Tipografi modern Google Fonts (*Plus Jakarta Sans*).
   - Tata letak responsif untuk komputer, tablet, dan ponsel.
   - Logo teks resmi Rumah Bunda dengan ikon rumah di sudut kiri atas.

2. **Sistem Autentikasi & Keamanan**:
   - Pendaftaran akun siswa dengan validasi nama lengkap, username unik, email, dan kata sandi (minimal 6 karakter).
   - Login dengan username atau email, fitur tampilkan/sembunyikan kata sandi.
   - Enkripsi kata sandi menggunakan `bcryptjs` (kata sandi **tidak** disimpan dalam bentuk teks biasa).
   - Sesi autentikasi aman dengan JSON Web Token (JWT).
   - Isolasi data per pengguna: setiap siswa memiliki data progres dan capaian tersendiri.

3. **Dashboard Home**:
   - Sapaan personal (*"Halo, [Nama Siswa]!"*).
   - Tiga kartu menu utama berukuran besar:
     - 📖 **Materi**: *"Pelajari materi kelas 7 sesuai mata pelajaran"* -> Tombol *"Mulai Belajar"*.
     - ❓ **Quiz**: *"Uji pemahamanmu melalui latihan soal"* -> Tombol *"Mulai Quiz"*.
     - 🎮 **Game**: *"Belajar sambil bermain melalui permainan edukatif"* -> Tombol *"Main Sekarang"*.
   - Metrik riil dari database: Persentase progres belajar, jumlah bab selesai, jumlah kuis dikerjakan, skor terbaik, dan aktivitas belajar terakhir.
   - Tombol dinamis **"Lanjutkan Belajar"** menuju bab yang sedang dipelajari.

4. **Struktur Materi Bertingkat Kelas 7 SMP**:
   - 4 Mata Pelajaran Utama:
     1. **Matematika** (6 Bab)
     2. **Bahasa Inggris** (6 Bab)
     3. **Bahasa Indonesia** (6 Bab)
     4. **IPAS** (6 Bab)
   - Struktur: `Materi → Mata Pelajaran → Daftar Bab → Detail Bab`.
   - Halaman Detail Bab dilengkapi:
     - Breadcrumb navigasi: `Home → Materi → [Mata Pelajaran] → [Bab]`.
     - Status belajar: *Belum Dipelajari*, *Sedang Dipelajari*, atau *Selesai*.
     - Tombol **"Tandai Selesai"** (menyimpan permanen ke SQLite dan memperbarui progres).
     - Tombol **"Bab Sebelumnya"** dan **"Bab Berikutnya"**.
     - Area konten terstruktur yang rapi dengan keterangan *"Materi akan segera tersedia"* (siap diisi teks, gambar, video, dan dokumen).

5. **Sistem Quiz Interaktif**:
   - Filter mata pelajaran (Semua, Matematika, Bahasa Inggris, Bahasa Indonesia, IPAS).
   - Sistem kuis lengkap: navigasi nomor soal, pilihan ganda A/B/C/D, penilaian otomatis instan (skor 0-100), tampilan pembahasan soal, dan penyimpanan riwayat pengerjaan ke tabel `quiz_attempts`.

6. **Permainan Edukatif (Game)**:
   - Mini-game interaktif *"Tantangan Hitung Cepat"* (Matematika Kelas 7) dengan timer 45 detik, multiplier streak, dan pencatatan skor terbaik ke database `game_attempts`.
   - Kartu permainan mendatang berlabel *"Segera Hadir"* dengan keterangan edukatif yang rapi tanpa tombol dummy.

7. **Capaian Pembelajaran (Learning Analytics)**:
   - Persentase ketuntasan materi dipisahkan dari skor kuis.
   - Progress bar capaian masing-masing mata pelajaran.
   - Riwayat aktivitas belajar runut waktu (timeline) dari database `learning_activities`.

8. **Profil & Pengaturan Siswa**:
   - Informasi akun, jenjang kelas VII SMP, tanggal pembuatan akun.
   - Fitur edit nama dan catatan belajar.
   - Fitur ubah kata sandi dengan validasi kata sandi lama.
   - Pengaturan preferensi ukuran teks belajar (*Standar* / *Besar*).
   - Logout dengan modal konfirmasi keamanan.

---

## 🗄️ Struktur Database (SQLite)

File database tersimpan permanen di: `data/lms_rumah_bunda.db`

Tabel yang digunakan:
- `users`: Identitas siswa, hash password, jenjang kelas, avatar, dan tanggal registrasi.
- `subjects`: 4 mata pelajaran (Matematika, Bahasa Inggris, Bahasa Indonesia, IPAS).
- `chapters`: 24 bab terstruktur kurikulum kelas 7 SMP.
- `chapter_progress`: Status belajar siswa per bab (`not_started`, `in_progress`, `completed`).
- `quizzes`: Informasi kuis dan durasi pengerjaan.
- `quiz_questions`: Bank soal pilihan ganda, kunci jawaban, dan pembahasan.
- `quiz_attempts`: Riwayat pengerjaan kuis siswa, skor akhir, dan rincian jawaban.
- `games`: Data permainan edukatif.
- `game_attempts`: Riwayat skor dan waktu bermain siswa.
- `learning_activities`: Catatan kronologis seluruh aktivitas belajar siswa.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi saat ini telah aktif berjalan di:
👉 **[http://localhost:5000](http://localhost:5000)**

Untuk menjalankan secara manual di masa depan:
```bash
# Menjalankan server produksi
npm start

# Atau menjalankan mode pengembangan
npm run dev
```

Akun uji coba yang sudah siap digunakan:
- **Username**: `budi_smp7` atau `aisyah_smp7`
- **Password**: `password123`
*(Atau Anda dapat langsung membuat akun baru melalui formulir registrasi)*
