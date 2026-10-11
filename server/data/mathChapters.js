// Data Materi Pembelajaran Matematika Kelas 7 SMP Semester 1
// Disusun terstruktur berdasarkan Kurikulum Merdeka & Modul Rumah Bunda

const mathChaptersData = [
  {
    chapter_number: 1,
    title: 'Bab 1: Bilangan Bulat',
    description: 'Pengertian bilangan bulat, garis bilangan, nilai mutlak, operasi hitung, sifat operasi, FPB, KPK, dan aplikasinya.',
    subchapters: [
      {
        id: '1-1',
        title: '1. Pengertian Bilangan Bulat dan Garis Bilangan',
        content: `
### Pengertian Bilangan Bulat
Bilangan bulat adalah himpunan bilangan yang terdiri dari bilangan bulat negatif, bilangan nol, dan bilangan bulat positif. Dalam notasi matematika, himpunan bilangan bulat disimbolkan dengan $\\mathbb{Z}$ (dari bahasa Jerman *Zahlen*):

$$\\mathbb{Z} = \\{ \\dots, -4, -3, -2, -1, 0, 1, 2, 3, 4, \\dots \\}$$

1. **Bilangan Bulat Negatif**: Bilangan yang bernilai kurang dari nol, ditulis dengan tanda minus di depannya (misalnya: $-1, -2, -3, -4, \\dots$).
2. **Bilangan Nol ($0$)**: Bilangan yang bernilai netral, bukan bilangan positif dan bukan bilangan negatif.
3. **Bilangan Bulat Positif**: Bilangan yang bernilai lebih dari nol, sering disebut juga bilangan asli (misalnya: $1, 2, 3, 4, \\dots$).

---

### Garis Bilangan Bulat
Pada garis bilangan horizontal:
- Bilangan nol ($0$) terletak di tengah sebagai titik acuan.
- Bilangan bulat positif terletak di sebelah **kanan** nol.
- Bilangan bulat negatif terletak di sebelah **kiri** nol.

[ILUSTRASI: GARIS_BILANGAN_BULAT]

**Aturan Penting Membandingkan Bilangan Bulat:**
- Semakin ke kanan letak suatu bilangan pada garis bilangan, nilainya **semakin besar**.
- Semakin ke kiri letak suatu bilangan pada garis bilangan, nilainya **semakin kecil**.
- Setiap bilangan positif selalu lebih besar daripada bilangan negatif ($3 > -8$).
- Di antara dua bilangan negatif, bilangan yang angkanya terlihat lebih besar justru nilainya lebih kecil (misalnya: $-9 < -2$).

---

### Penerapan dalam Kehidupan Sehari-hari
| Situasi Nyata | Lambang Bilangan |
| :--- | :---: |
| Suhu $7^\\circ\\text{C}$ di atas titik beku ($0^\\circ\\text{C}$) | $+7$ atau $7$ |
| Suhu $5^\\circ\\text{C}$ di bawah titik beku ($0^\\circ\\text{C}$) | $-5$ |
| Ketinggian pesawat $1.500\\text{ meter}$ di atas permukaan laut | $+1.500$ |
| Kapal selam menyelam $120\\text{ meter}$ di bawah permukaan laut | $-120$ |
| Pedagang memperoleh keuntungan sebesar Rp50.000 | $+50.000$ |
| Pedagang mengalami kerugian sebesar Rp20.000 | $-20.000$ |
`
      },
      {
        id: '1-2',
        title: '2. Lawan Bilangan dan Nilai Mutlak',
        content: `
### Lawan Suatu Bilangan (Invers Tambah)
Dua bilangan dikatakan saling berlawanan jika keduanya berjarak sama dari titik $0$ pada garis bilangan, tetapi berada pada arah yang berlawanan.
- Lawan dari bilangan positif $a$ adalah bilangan negatif $-a$.
- Lawan dari bilangan negatif $-a$ adalah bilangan positif $a$.
- Lawan dari $0$ adalah $0$.

**Contoh:**
- Lawan dari $7$ adalah $-7$.
- Lawan dari $-15$ adalah $15$.
- Lawan dari $-(-4)$ adalah $-4$.

---

### Nilai Mutlak (Absolute Value)
**Definisi:** Nilai mutlak suatu bilangan adalah **jarak** bilangan tersebut dari titik $0$ pada garis bilangan tanpa memperhatikan arahnya. Karena mengukur jarak, nilai mutlak **tidak pernah bernilai negatif** (selalu bernilai positif atau nol).

Notasi nilai mutlak ditulis dengan dua garis tegak $|x|$:
$$|x| = \\begin{cases} x, & \\text{jika } x \\ge 0 \\\\ -x, & \\text{jika } x < 0 \\end{cases}$$

**Contoh:**
- $|8| = 8$ (jarak dari titik $0$ ke $8$ adalah 8 satuan)
- $|-9| = 9$ (jarak dari titik $0$ ke $-9$ adalah 9 satuan)
- $|0| = 0$
- $|-25| + |12| = 25 + 12 = 37$
- $|-10| - |-4| = 10 - 4 = 6$
`
      },
      {
        id: '1-3',
        title: '3. Penjumlahan dan Pengurangan Bilangan Bulat',
        content: `
### Penjumlahan Bilangan Bulat
Dalam menjumlahkan dua bilangan bulat, perhatikan kondisi tandanya:

1. **Kedua bilangan bertanda sama:**
   - Jumlahkan nilai mutlak kedua bilangan, lalu beri tanda yang sama dengan kedua bilangan tersebut.
   - $(+) + (+) = (+)$ $\\rightarrow$ Contoh: $14 + 18 = 32$
   - $(-) + (-) = (-)$ $\\rightarrow$ Contoh: $(-8) + (-12) = -(8 + 12) = -20$

2. **Kedua bilangan berlawanan tanda:**
   - Kurangkan nilai yang lebih besar dengan nilai yang lebih kecil. Tanda hasil penjumlahan mengikuti tanda bilangan yang nilai mutlaknya lebih besar.
   - Contoh 1: $(-15) + 20 = +(20 - 15) = +5 = 5$
   - Contoh 2: $9 + (-17) = -(17 - 9) = -8$

---

### Pengurangan Bilangan Bulat
Mengurangkan suatu bilangan bulat sama dengan **menjumlahkan dengan lawan dari bilangan pengurangnya**:

$$a - b = a + (-b)$$
$$a - (-b) = a + b$$

**Contoh:**
- $12 - 18 = 12 + (-18) = -6$
- $-8 - 14 = -8 + (-14) = -22$
- $9 - (-7) = 9 + 7 = 16$
- $-15 - (-20) = -15 + 20 = 5$
`
      },
      {
        id: '1-4',
        title: '4. Perkalian dan Pembagian Bilangan Bulat',
        content: `
### Aturan Tanda pada Perkalian dan Pembagian
Hasil kali atau hasil bagi dua bilangan bulat mengikuti kaidah tanda berikut:

| Operasi Perkalian | Operasi Pembagian | Hasil Tanda | Contoh Perkalian | Contoh Pembagian |
| :---: | :---: | :---: | :--- | :--- |
| $(+) \\times (+)$ | $(+) \\div (+)$ | **Positif (+)** | $6 \\times 7 = 42$ | $36 \\div 4 = 9$ |
| $(-) \\times (-)$ | $(-) \\div (-)$ | **Positif (+)** | $(-5) \\times (-8) = 40$ | $(-48) \\div (-6) = 8$ |
| $(+) \\times (-)$ | $(+) \\div (-)$ | **Negatif (-)** | $9 \\times (-4) = -36$ | $45 \\div (-5) = -9$ |
| $(-) \\times (+)$ | $(-) \\div (+)$ | **Negatif (-)** | $(-7) \\times 6 = -42$ | $(-56) \\div 7 = -8$ |

> **Prinsip Utama:**
> - Jika kedua bilangan **bertanda sama** (keduanya positif atau keduanya negatif), hasilnya selalu **positif**.
> - Jika kedua bilangan **berbeda tanda** (satu positif dan satu negatif), hasilnya selalu **negatif**.

---

### Sifat Khusus Perkalian Bilangan Bulat
- **Perkalian dengan nol ($0$):** Setiap bilangan bulat jika dikalikan dengan nol hasilnya adalah nol:
  $$a \\times 0 = 0 \\times a = 0$$
- **Unsur identitas perkalian ($1$):** Setiap bilangan bulat dikalikan dengan 1 hasilnya bilangan itu sendiri:
  $$a \\times 1 = 1 \\times a = a$$
- **Perkalian dengan $-1$:** Mengalikan bilangan dengan $-1$ menghasilkan lawan bilangannya:
  $$a \\times (-1) = -a$$
`
      },
      {
        id: '1-5',
        title: '5. Sifat-Sifat Operasi Hitung Bilangan Bulat',
        content: `
### 1. Sifat Komutatif (Pertukaran)
Pertukaran letak bilangan tidak mengubah hasil operasi. Berlaku pada penjumlahan dan perkalian:
- **Penjumlahan:** $a + b = b + a$
  - Contoh: $(-8) + 12 = 12 + (-8) = 4$
- **Perkalian:** $a \\times b = b \\times a$
  - Contoh: $(-6) \\times 7 = 7 \\times (-6) = -42$
> *Catatan:* Sifat komutatif **tidak berlaku** pada pengurangan dan pembagian ($8 - 3 \\neq 3 - 8$ dan $12 \\div 4 \\neq 4 \\div 12$).

---

### 2. Sifat Asosiatif (Pengelompokan)
Pengelompokan pengerjaan bilangan tidak mengubah hasil akhir. Berlaku pada penjumlahan dan perkalian:
- **Penjumlahan:** $(a + b) + c = a + (b + c)$
  - Contoh: $((-5) + 8) + (-3) = 3 + (-3) = 0$
  - Jika dikelompokkan lain: $(-5) + (8 + (-3)) = (-5) + 5 = 0$ (Hasil sama)
- **Perkalian:** $(a \\times b) \\times c = a \\times (b \\times c)$
  - Contoh: $((-2) \\times 4) \\times (-5) = (-8) \\times (-5) = 40$
  - Jika dikelompokkan lain: $(-2) \\times (4 \\times (-5)) = (-2) \\times (-20) = 40$ (Hasil sama)

---

### 3. Sifat Distributif (Penyebaran)
Perkalian menyebar terhadap penjumlahan atau pengurangan:
- **Terhadap Penjumlahan:** $a \\times (b + c) = (a \\times b) + (a \\times c)$
  - Contoh: $5 \\times (10 + (-4)) = (5 \\times 10) + (5 \\times (-4)) = 50 + (-20) = 30$
- **Terhadap Pengurangan:** $a \\times (b - c) = (a \\times b) - (a \\times c)$
  - Contoh: $8 \\times (15 - 5) = (8 \\times 15) - (8 \\times 5) = 120 - 40 = 80$
`
      },
      {
        id: '1-6',
        title: '6. Operasi Hitung Campuran Bilangan Bulat',
        content: `
### Urutan Kekuatan Operasi (KABATAKU)
Saat menyelesaikan operasi campuran yang memuat lebih dari satu tanda hitung, wajib mengikuti urutan hierarki operasi matematika:

1. **Kurung $\\mathbf{( \\ )}$**: Selesaikan terlebih dahulu operasi yang berada di dalam tanda kurung.
2. **Perkalian $(\\times)$ dan Pembagian $(\\div)$**: Perkalian dan pembagian memiliki tingkat kekuatan yang sama. Kerjakan secara berurutan dari **kiri ke kanan**.
3. **Penjumlahan $(+)$ dan Pengurangan $(-)$**: Penjumlahan dan pengurangan memiliki tingkat kekuatan yang sama. Kerjakan secara berurutan dari **kiri ke kanan**.

---

### Contoh Langkah Penyelesaian:
**Hitunglah hasil dari:** $-12 + 8 \\times (-3) - (-18) \\div 6$

**Langkah penyelesaian:**
1. Kerjakan perkalian dan pembagian terlebih dahulu:
   - $8 \\times (-3) = -24$
   - $(-18) \\div 6 = -3$
2. Tuliskan kembali bentuk operasinya:
   $$= -12 + (-24) - (-3)$$
3. Ubah pengurangan menjadi penjumlahan dengan lawan:
   $$= -12 + (-24) + 3$$
4. Selesaikan dari kiri ke kanan:
   - $(-12) + (-24) = -36$
   - $-36 + 3 = -33$

**Hasil akhir:** $-33$
`
      },
      {
        id: '1-7',
        title: '7. Faktor Bilangan, FPB, dan KPK',
        content: `
### Faktor dan Kelipatan
- **Faktor:** Bilangan bulat yang dapat membagi habis suatu bilangan tanpa sisa.
  - Contoh: Faktor dari $12$ adalah $1, 2, 3, 4, 6, 12$.
- **Faktorisasi Prima:** Menyatakan bilangan sebagai perkalian faktor-faktor prima (menggunakan pohon faktor).
  - $24 = 2^3 \\times 3$
  - $36 = 2^2 \\times 3^2$

---

### FPB (Faktor Persekutuan Terbesar)
FPB adalah bilangan terbesar yang dapat membagi habis dua atau lebih bilangan sekaligus.
- **Cara Menentukan FPB dari Faktorisasi Prima:**
  1. Pilih faktor prima yang **sama** pada setiap bilangan.
  2. Ambil faktor prima yang berpangkat **terkecil**.
  3. Kalikan faktor-faktor tersebut.

**Contoh:** Tentukan FPB dari $24$ dan $36$.
- $24 = 2^3 \\times 3$
- $36 = 2^2 \\times 3^2$
- Faktor prima yang sama adalah $2$ dan $3$.
- Pangkat terkecil untuk $2$ adalah $2^2$, dan untuk $3$ adalah $3^1$.
$$\\text{FPB} = 2^2 \\times 3 = 4 \\times 3 = 12$$

---

### KPK (Kelipatan Persekutuan Terkecil)
KPK adalah bilangan terkecil yang merupakan kelipatan persekutuan dari dua atau lebih bilangan.
- **Cara Menentukan KPK dari Faktorisasi Prima:**
  1. Ambil **semua** faktor prima yang muncul pada bilangan-bilangan tersebut.
  2. Jika ada faktor prima yang sama, ambil yang berpangkat **terbesar**.
  3. Kalikan seluruh faktor tersebut.

**Contoh:** Tentukan KPK dari $24$ dan $36$.
- Faktor prima yang ada: $2$ dan $3$.
- Pangkat terbesar untuk $2$ adalah $2^3$, dan untuk $3$ adalah $3^2$.
$$\\text{KPK} = 2^3 \\times 3^2 = 8 \\times 9 = 72$$
`
      },
      {
        id: '1-8',
        title: '8. Penerapan FPB dan KPK dalam Kehidupan Sehari-hari',
        content: `
### Kapan Menggunakan FPB?
Gunakan konsep FPB ketika menemukan kata kunci soal cerita seperti:
- *"dibagikan sama banyak"*,
- *"jumlah wadah/kantong terbanyak"*,
- *"potongan sama panjang"*.

**Contoh Kasus FPB:**
Ibu memiliki 30 kue donat dan 45 bolu kukus. Ibu ingin membagikan kue tersebut ke dalam beberapa kotak bingkisan dengan setiap kotak berisi jenis kue yang sama banyak tanpa sisa.
1. Berapa kotak bingkisan terbanyak yang dapat dibuat?
2. Berapa isi donat dan bolu pada masing-masing kotak?

**Penyelesaian:**
- Cari FPB dari 30 dan 45:
  - $30 = 2 \\times 3 \\times 5$
  - $45 = 3^2 \\times 5$
  - $\\text{FPB} = 3 \\times 5 = 15$
- **Kotak terbanyak:** $15\\text{ kotak}$.
- Isi donat per kotak: $30 \\div 15 = 2\\text{ donat}$.
- Isi bolu per kotak: $45 \\div 15 = 3\\text{ bolu}$.

---

### Kapan Menggunakan KPK?
Gunakan konsep KPK ketika menemukan kata kunci soal cerita seperti:
- *"bertemu bersama-sama lagi"*,
- *"menyalakan lampu bersamaan"*,
- *"jadwal ronda/les bersamaan berikutnya"*.

**Contoh Kasus KPK:**
Ali pergi les matematika setiap 4 hari sekali, sedangkan Budi pergi les setiap 6 hari sekali. Jika pada tanggal 2 Mei mereka pergi les bersama-sama, tanggal berapakah mereka akan pergi les bersama-sama untuk kedua kalinya?

**Penyelesaian:**
- Cari KPK dari 4 dan 6:
  - $4 = 2^2$
  - $6 = 2 \\times 3$
  - $\\text{KPK} = 2^2 \\times 3 = 4 \\times 3 = 12\\text{ hari}$.
- Mereka akan bertemu $12\\text{ hari}$ setelah tanggal 2 Mei:
  $$\\text{Tanggal pertemuan} = 2 + 12 = 14\\text{ Mei}$$
`
      },
      {
        id: '1-9',
        title: '9. Contoh Soal dan Pembahasan Runtut',
        content: `
### Contoh 1: Perubahan Suhu Ruang
**Soal:** Suhu di dalam lemari es mula-mula $-5^\\circ\\text{C}$. Ketika aliran listrik padam, suhu di dalam lemari es naik sebesar $3^\\circ\\text{C}$ setiap 10 menit. Berapakah suhu lemari es setelah listrik padam selama 40 menit?

**Langkah Penyelesaian:**
1. Hitung berapa kali kenaikan suhu terjadi dalam 40 menit:
   $$\\text{Frekuensi kenaikan} = 40 \\div 10 = 4\\text{ kali}$$
2. Hitung total kenaikan suhu:
   $$\\text{Total kenaikan} = 4 \\times 3^\\circ\\text{C} = 12^\\circ\\text{C}$$
3. Jumlahkan dengan suhu awal:
   $$\\text{Suhu akhir} = -5^\\circ\\text{C} + 12^\\circ\\text{C} = 7^\\circ\\text{C}$$
**Jawaban:** Suhu di dalam lemari es setelah 40 menit adalah $7^\\circ\\text{C}$.

---

### Contoh 2: Penyelaman Laut
**Soal:** Seorang penyelam berada di kedalaman 18 meter di bawah permukaan laut. Kemudian penyelam tersebut berenang naik sejauh 7 meter, lalu menyelam turun lagi sejauh 12 meter. Tuliskan posisi akhir penyelam dalam bentuk bilangan bulat!

**Langkah Penyelesaian:**
1. Permukaan laut diwakili angka $0$.
2. Posisi awal: $-18\\text{ meter}$.
3. Naik 7 meter berarti ditambah $+7$:
   $$-18 + 7 = -11\\text{ meter}$$
4. Turun 12 meter berarti dikurangi 12 (atau ditambah $-12$):
   $$-11 - 12 = -23\\text{ meter}$$
**Jawaban:** Posisi akhir penyelam berada pada kedalaman $-23$ meter (atau $23$ meter di bawah permukaan laut).

---

### Contoh 3: Sistem Penilaian Ujian
**Soal:** Dalam sebuah kompetisi matematika yang terdiri dari 30 soal, diberlakukan aturan penilaian: jawaban benar bernilai $4$, jawaban salah bernilai $-2$, dan soal tidak dijawab bernilai $0$. Jika Dinda berhasil menjawab benar 22 soal dan salah 5 soal, berapakah total nilai yang diperoleh Dinda?

**Langkah Penyelesaian:**
1. Hitung jumlah soal yang tidak dijawab:
   $$\\text{Tidak dijawab} = 30 - (22 + 5) = 30 - 27 = 3\\text{ soal}$$
2. Hitung poin untuk jawaban benar:
   $$\\text{Nilai benar} = 22 \\times 4 = 88$$
3. Hitung poin untuk jawaban salah:
   $$\\text{Nilai salah} = 5 \\times (-2) = -10$$
4. Hitung poin tidak dijawab:
   $$\\text{Nilai kosong} = 3 \\times 0 = 0$$
5. Jumlahkan seluruh poin:
   $$\\text{Total nilai} = 88 + (-10) + 0 = 78$$
**Jawaban:** Total nilai yang diperoleh Dinda adalah $78$.
`
      },
      {
        id: '1-10',
        title: '10. Latihan Soal Mandiri Bab 1',
        content: `
Ujilah pemahamanmu dengan mencoba latihan soal berikut sebelum membuka pembahasan:

#### Soal 1 (Dasar)
Hitunglah hasil dari $(-24) + 38 - (-16) + (-15)$!

#### Soal 2 (Nilai Mutlak & Operasi)
Tentukan nilai dari $|-14| \\times |-3| - |-45| \\div |-9|$!

#### Soal 3 (Operasi Campuran)
Selesaikan operasi hitung berikut: $35 - (-5) \\times 4 + (-48) \\div (-6)$!

#### Soal 4 (Soal Cerita Suhu)
Suhu udara di puncak gunung pada malam hari adalah $-4^\\circ\\text{C}$. Pada siang hari suhu naik sebesar $11^\\circ\\text{C}$. Menjelang petang suhu turun kembali sebesar $5^\\circ\\text{C}$. Berapakah suhu udara pada petang hari?

#### Soal 5 (Aplikasi FPB & KPK)
Pak Budi memiliki 48 buku tulis dan 72 pensil yang akan dibagikan kepada anak-anak panti asuhan secara merata.
a. Berapakah jumlah anak terbanyak yang dapat menerima paket bantuan tersebut?
b. Berapa banyak buku tulis dan pensil yang diterima oleh masing-masing anak?
`,
        practiceAnswers: [
          {
            number: 1,
            question: 'Hitunglah hasil dari (-24) + 38 - (-16) + (-15)',
            answer: '15',
            step: 'Langkah: (-24) + 38 = 14. Lalu 14 - (-16) = 14 + 16 = 30. Terakhir 30 + (-15) = 15.'
          },
          {
            number: 2,
            question: 'Tentukan nilai dari |-14| * |-3| - |-45| / |-9|',
            answer: '37',
            step: 'Langkah: |-14| = 14, |-3| = 3, |-45| = 45, |-9| = 9. Maka 14 * 3 - 45 / 9 = 42 - 5 = 37.'
          },
          {
            number: 3,
            question: 'Selesaikan operasi hitung: 35 - (-5) * 4 + (-48) / (-6)',
            answer: '63',
            step: 'Langkah: Perkalian (-5) * 4 = -20. Pembagian (-48) / (-6) = 8. Maka 35 - (-20) + 8 = 35 + 20 + 8 = 63.'
          },
          {
            number: 4,
            question: 'Suhu awal -4°C, naik 11°C, turun 5°C. Suhu akhir?',
            answer: '2°C',
            step: 'Langkah: -4 + 11 = 7°C. Kemudian 7 - 5 = 2°C.'
          },
          {
            number: 5,
            question: 'Pak Budi membagikan 48 buku dan 72 pensil sama rata. Berapa anak dan isi masing-masing?',
            answer: '24 anak; tiap anak mendapat 2 buku dan 3 pensil',
            step: 'Langkah: FPB(48, 72) = 24. Banyak anak = 24. Buku per anak = 48 / 24 = 2. Pensil per anak = 72 / 24 = 3.'
          }
        ]
      }
    ]
  },
  {
    chapter_number: 2,
    title: 'Bab 2: Bilangan Rasional (Pecahan)',
    description: 'Pengertian bilangan rasional, jenis pecahan, pecahan senilai, konversi, operasi hitung, pecahan campuran, perpangkatan, dan aplikasi nyata.',
    subchapters: [
      {
        id: '2-1',
        title: '1. Pengertian Bilangan Rasional & Jenis-Jenis Pecahan',
        content: `
### Pengertian Bilangan Rasional
Bilangan rasional adalah bilangan yang dapat dinyatakan dalam bentuk pecahan $\\frac{a}{b}$, dengan $a$ dan $b$ merupakan bilangan bulat serta $b \\neq 0$.
- $a$ disebut sebagai **pembilang** (numerator).
- $b$ disebut sebagai **penyebut** (denominator).

Mengapa penyebut $b \\neq 0$? Karena pembagian dengan nol tidak terdefinisi dalam matematika.

---

### Jenis-Jenis Bentuk Pecahan
1. **Pecahan Biasa**:
   - **Pecahan Murni (Sejati):** Pembilang lebih kecil dari penyebut ($a < b$). Nilainya di antara $0$ dan $1$. Contoh: $\\frac{1}{2}, \\frac{3}{4}, \\frac{5}{8}$.
   - **Pecahan Tidak Murni:** Pembilang lebih besar atau sama dengan penyebut ($a \\ge b$). Nilainya $\\ge 1$. Contoh: $\\frac{5}{3}, \\frac{7}{4}, \\frac{9}{2}$.
2. **Pecahan Campuran**: Gabungan dari bilangan bulat dan pecahan murni. Contoh: $2\\frac{1}{3}, 1\\frac{3}{4}$. Pecahan tidak murni dapat diubah menjadi pecahan campuran.
3. **Pecahan Desimal**: Pecahan dengan penyebut perpangkatan 10 ($10, 100, 1000, \\dots$) yang dituliskan dengan tanda koma. Contoh: $0,5 = \\frac{5}{10}$, $0,75 = \\frac{75}{100}$.
4. **Persen (Per Seratus)**: Pecahan dengan penyebut $100$, dilambangkan dengan simbol $\\%$. Contoh: $25\\% = \\frac{25}{100}$, $50\\% = \\frac{50}{100} = \\frac{1}{2}$.
`
      },
      {
        id: '2-2',
        title: '2. Pecahan Senilai dan Menyederhanakan Pecahan',
        content: `
### Pecahan Senilai
Pecahan senilai adalah pecahan-pecahan yang bernilai sama meskipun dituliskan dengan lambang pembilang dan penyebut yang berbeda. Pecahan senilai dapat diperoleh dengan **mengalikan atau membagi pembilang dan penyebut dengan bilangan yang sama** (bukan nol):

$$\\frac{a}{b} = \\frac{a \\times k}{b \\times k} = \\frac{a \\div m}{b \\div m} \\quad (k, m \\neq 0)$$

**Contoh:**
$$\\frac{2}{3} = \\frac{2 \\times 2}{3 \\times 2} = \\frac{4}{6} = \\frac{2 \\times 4}{3 \\times 4} = \\frac{8}{12}$$

---

### Menyederhanakan Pecahan
Menyederhanakan pecahan berarti mengubah pecahan menjadi pecahan senilai yang paling sederhana, yaitu ketika pembilang dan penyebut tidak lagi memiliki faktor persekutuan selain 1 (FPB pembilang dan penyebut adalah 1).

**Langkah:** Bagi pembilang dan penyebut dengan FPB dari keduanya.

**Contoh:** Sederhanakan pecahan $\\frac{36}{48}$.
1. Cari FPB dari 36 dan 48:
   - $36 = 2^2 \\times 3^2$
   - $48 = 2^4 \\times 3$
   - $\\text{FPB} = 2^2 \\times 3 = 12$
2. Bagi pembilang dan penyebut dengan 12:
   $$\\frac{36 \\div 12}{48 \\div 12} = \\frac{3}{4}$$
Jadi, bentuk paling sederhana dari $\\frac{36}{48}$ adalah $\\frac{3}{4}$.
`
      },
      {
        id: '2-3',
        title: '3. Konversi Antar Bentuk Pecahan, Desimal, dan Persen',
        content: `
### 1. Pecahan Biasa ke Pecahan Campuran (dan Sebaliknya)
- **Pecahan Tidak Murni ke Campuran:** Bagi pembilang dengan penyebut. Hasil bagi menjadi bilangan bulat, sisa bagi menjadi pembilang baru.
  $$\\frac{17}{5} = 17 \\div 5 = 3 \\text{ sisa } 2 \\implies 3\\frac{2}{5}$$
- **Campuran ke Pecahan Biasa:** Kalikan bilangan bulat dengan penyebut, lalu tambahkan dengan pembilang:
  $$c\\frac{a}{b} = \\frac{(c \\times b) + a}{b}$$
  Contoh: $4\\frac{2}{3} = \\frac{(4 \\times 3) + 2}{3} = \\frac{12 + 2}{3} = \\frac{14}{3}$

---

### 2. Pecahan ke Desimal (dan Sebaliknya)
- **Pecahan ke Desimal:** Ubah penyebut ke 10, 100, atau 1000, atau lakukan pembagian bersusun:
  $$\\frac{3}{4} = \\frac{3 \\times 25}{4 \\times 25} = \\frac{75}{100} = 0,75$$
  $$\\frac{5}{8} = 5 \\div 8 = 0,625$$
- **Desimal ke Pecahan:** Hitung jumlah angka di belakang koma:
  $$0,4 = \\frac{4}{10} = \\frac{2}{5}$$
  $$0,35 = \\frac{35}{100} = \\frac{7}{20}$$

---

### 3. Pecahan ke Persen (dan Sebaliknya)
- **Pecahan ke Persen:** Kalikan pecahan dengan $100\\%$:
  $$\\frac{3}{5} \\times 100\\% = \\frac{300}{5}\\% = 60\\%$$
- **Persen ke Pecahan:** Tulis dengan penyebut 100 lalu sederhanakan:
  $$45\\% = \\frac{45}{100} = \\frac{9}{20}$$
`
      },
      {
        id: '2-4',
        title: '4. Membandingkan dan Mengurutkan Pecahan',
        content: `
### Cara Membandingkan Dua Pecahan
Untuk membandingkan pecahan $\\frac{a}{b}$ dan $\\frac{c}{d}$:

1. **Metode Menyamakan Penyebut (KPK Penyebut):**
   - Samakan penyebut kedua pecahan menggunakan KPK.
   - Bandingkan pembilangnya: pecahan dengan pembilang lebih besar bernilai lebih besar.
   - Contoh: Bandingkan $\\frac{3}{4}$ dan $\\frac{5}{6}$.
     - KPK dari 4 dan 6 adalah 12.
     - $\\frac{3}{4} = \\frac{9}{12}$ dan $\\frac{5}{6} = \\frac{10}{12}$
     - Karena $9 < 10$, maka $\\frac{3}{4} < \\frac{5}{6}$.

2. **Metode Perkalian Silang (Cepat untuk 2 pecahan):**
   - $\\frac{a}{b} \\dots \\frac{c}{d} \\implies$ Bandingkan $a \\times d$ dengan $b \\times c$.
   - Contoh: $\\frac{3}{4}$ dan $\\frac{5}{6} \\implies 3 \\times 6 = 18$ dan $4 \\times 5 = 20$.
   - Karena $18 < 20$, maka $\\frac{3}{4} < \\frac{5}{6}$.

---

### Mengurutkan Berbagai Bentuk Bilangan Rasional
**Tips:** Ubah semua bilangan ke bentuk yang sama (paling mudah ke bentuk desimal) lalu urutkan.

**Contoh:** Urutkan dari yang terkecil: $0,65; \\frac{3}{4}; 70\\%; \\frac{5}{8}$.
- $0,65 = 0,650$
- $\\frac{3}{4} = 0,750$
- $70\\% = 0,700$
- $\\frac{5}{8} = 0,625$

Urutan dari terkecil: $\\frac{5}{8} < 0,65 < 70\\% < \\frac{3}{4}$.
`
      },
      {
        id: '2-5',
        title: '5. Penjumlahan dan Pengurangan Pecahan',
        content: `
### Pecahan dengan Penyebut Sama
Cukup jumlahkan atau kurangkan pembilangnya, sedangkan penyebutnya tetap:
$$\\frac{a}{c} + \\frac{b}{c} = \\frac{a + b}{c} \\quad \\text{dan} \\quad \\frac{a}{c} - \\frac{b}{c} = \\frac{a - b}{c}$$

Contoh: $\\frac{5}{9} + \\frac{2}{9} = \\frac{7}{9}$ dan $\\frac{7}{11} - \\frac{3}{11} = \\frac{4}{11}$.

---

### Pecahan dengan Penyebut Berbeda
Samakan penyebut kedua pecahan terlebih dahulu dengan mencari KPK dari penyebut-penyebutnya:

**Contoh 1:** Hitung $\\frac{2}{3} + \\frac{1}{4}$.
- KPK dari 3 dan 4 adalah 12.
$$\\frac{2}{3} + \\frac{1}{4} = \\frac{2 \\times 4}{12} + \\frac{1 \\times 3}{12} = \\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$$

**Contoh 2:** Hitung $3\\frac{1}{2} - 1\\frac{3}{5}$.
- Ubah ke pecahan biasa:
  $$3\\frac{1}{2} = \\frac{7}{2} \\quad \\text{dan} \\quad 1\\frac{3}{5} = \\frac{8}{5}$$
- KPK dari 2 dan 5 adalah 10:
  $$\\frac{7 \\times 5}{10} - \\frac{8 \\times 2}{10} = \\frac{35}{10} - \\frac{16}{10} = \\frac{19}{10} = 1\\frac{9}{10}$$
`
      },
      {
        id: '2-6',
        title: '6. Perkalian dan Pembagian Pecahan',
        content: `
### Perkalian Pecahan
Pada perkalian pecahan, kalikan pembilang dengan pembilang, dan penyebut dengan penyebut:
$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$$

> **Tips Mempermudah:** Lakukan penyederhanaan (coret silang) antara pembilang dan penyebut sebelum mengalikan.

**Contoh:**
$$\\frac{4}{9} \\times \\frac{3}{8} = \\frac{1}{3} \\times \\frac{1}{2} = \\frac{1 \\times 1}{3 \\times 2} = \\frac{1}{6}$$

Jika ada pecahan campuran, **wajib diubah ke pecahan biasa terlebih dahulu**:
$$2\\frac{1}{4} \\times 1\\frac{1}{3} = \\frac{9}{4} \\times \\frac{4}{3} = \\frac{9 \\times 4}{4 \\times 3} = \\frac{36}{12} = 3$$

---

### Pembagian Pecahan
Membagi dengan suatu pecahan sama dengan **mengalikan dengan kebalikan dari pecahan pembagi**:
$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{a \\times d}{b \\times c}$$

**Contoh:**
$$\\frac{5}{6} \\div \\frac{2}{3} = \\frac{5}{6} \\times \\frac{3}{2} = \\frac{5 \\times 1}{2 \\times 2} = \\frac{5}{4} = 1\\frac{1}{4}$$
`
      },
      {
        id: '2-7',
        title: '7. Perpangkatan dan Operasi Campuran Pecahan',
        content: `
### Perpangkatan Pecahan
Memangkatkan suatu pecahan berarti memangkatkan pembilang dan memangkatkan penyebutnya:
$$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$

**Contoh:**
- $\\left(\\frac{2}{3}\\right)^3 = \\frac{2^3}{3^3} = \\frac{8}{27}$
- $\\left(-\\frac{3}{4}\\right)^2 = \\frac{(-3)^2}{4^2} = \\frac{9}{16}$
- $\\left(-\\frac{1}{2}\\right)^3 = \\frac{(-1)^3}{2^3} = -\\frac{1}{8}$

---

### Operasi Hitung Campuran Pecahan
Urutan pengerjaan sama dengan operasi bilangan bulat:
1. Operasi di dalam tanda kurung
2. Perpangkatan
3. Perkalian dan pembagian (kiri ke kanan)
4. Penjumlahan dan pengurangan (kiri ke kanan)

**Contoh:** Hitung $\\frac{1}{2} + \\frac{3}{4} \\times \\frac{2}{5} - \\left(\\frac{1}{3}\\right)^2 \\div \\frac{1}{6}$.
1. Pangkat: $\\left(\\frac{1}{3}\\right)^2 = \\frac{1}{9}$
2. Perkalian: $\\frac{3}{4} \\times \\frac{2}{5} = \\frac{6}{20} = \\frac{3}{10}$
3. Pembagian: $\\frac{1}{9} \\div \\frac{1}{6} = \\frac{1}{9} \\times 6 = \\frac{6}{9} = \\frac{2}{3}$
4. Bentuk sekarang: $\\frac{1}{2} + \\frac{3}{10} - \\frac{2}{3}$
5. Samakan penyebut (KPK 2, 10, 3 adalah 30):
   $$= \\frac{15}{30} + \\frac{9}{30} - \\frac{20}{30} = \\frac{15 + 9 - 20}{30} = \\frac{4}{30} = \\frac{2}{15}$$
`
      },
      {
        id: '2-8',
        title: '8. Penerapan Pecahan dalam Kehidupan Sehari-hari',
        content: `
Pecahan banyak digunakan dalam kehidupan sehari-hari, antara lain:

### 1. Pembagian Bagian Benda / Bahan
**Contoh:** Ibu mempunyai $2\\frac{1}{2}\\text{ kg}$ gula pasir. Untuk membuat kue bolu diperlukan $\\frac{3}{4}\\text{ kg}$ gula. Berapa kg sisa gula pasir ibu?
$$\\text{Sisa gula} = 2\\frac{1}{2} - \\frac{3}{4} = \\frac{5}{2} - \\frac{3}{4} = \\frac{10}{4} - \\frac{3}{4} = \\frac{7}{4} = 1\\frac{3}{4}\\text{ kg}$$

---

### 2. Menghitung Potongan Harga (Diskon)
**Contoh:** Sebuah tas sekolah berharga Rp200.000 dijual dengan diskon $15\\%$.
1. Besar potongan harga:
   $$\\text{Diskon} = 15\\% \\times \\text{Rp}200.000 = \\frac{15}{100} \\times 200.000 = \\text{Rp}30.000$$
2. Harga yang harus dibayar:
   $$\\text{Harga bayar} = \\text{Rp}200.000 - \\text{Rp}30.000 = \\text{Rp}170.000$$

---

### 3. Pembagian Tali / Panjang ke Potongan Kecil
**Contoh:** Seutas tali sepanjang $7\\frac{1}{2}\\text{ meter}$ dipotong-potong menjadi beberapa utas tali kecil dengan panjang masing-masing $\\frac{3}{4}\\text{ meter}$. Berapa banyak potongan tali yang diperoleh?
$$\\text{Banyak potongan} = 7\\frac{1}{2} \\div \\frac{3}{4} = \\frac{15}{2} \\times \\frac{4}{3} = \\frac{60}{6} = 10\\text{ potong}$$
`
      },
      {
        id: '2-9',
        title: '9. Contoh Soal dan Pembahasan Runtut',
        content: `
### Contoh 1: Perhitungan Luas Persegi Panjang
**Soal:** Sebuah taman berbentuk persegi panjang memiliki panjang $6\\frac{2}{3}\\text{ meter}$ dan lebar $3\\frac{3}{4}\\text{ meter}$. Berapakah luas taman tersebut?

**Langkah Penyelesaian:**
1. Rumus luas persegi panjang: $L = p \\times l$
2. Ubah pecahan campuran menjadi pecahan biasa:
   $$p = 6\\frac{2}{3} = \\frac{20}{3}\\text{ meter} \\quad \\text{dan} \\quad l = 3\\frac{3}{4} = \\frac{15}{4}\\text{ meter}$$
3. Kalikan panjang dan lebar:
   $$L = \\frac{20}{3} \\times \\frac{15}{4} = \\frac{20 \\times 15}{3 \\times 4} = \\frac{300}{12} = 25\\text{ m}^2$$
**Jawaban:** Luas taman tersebut adalah $25\\text{ meter persegi}$.

---

### Contoh 2: Perhitungan Gaji dan Tabungan
**Soal:** Ayah menerima gaji bulanan. Sebanyak $\\frac{2}{5}$ bagian digunakan untuk keperluan rumah tangga, $\\frac{1}{4}$ bagian untuk biaya pendidikan anak, dan sisanya ditabung. Jika gaji Ayah adalah Rp4.000.000, berapa rupiah uang yang ditabung oleh Ayah?

**Langkah Penyelesaian:**
1. Hitung total bagian yang terpakai:
   $$\\text{Bagian terpakai} = \\frac{2}{5} + \\frac{1}{4} = \\frac{8}{20} + \\frac{5}{20} = \\frac{13}{20}$$
2. Hitung bagian yang ditabung:
   $$\\text{Bagian tabungan} = 1 - \\frac{13}{20} = \\frac{20}{20} - \\frac{13}{20} = \\frac{7}{20}$$
3. Hitung jumlah uang tabungan:
   $$\\text{Uang ditabung} = \\frac{7}{20} \\times 4.000.000 = 7 \\times 200.000 = \\text{Rp}1.400.000$$
**Jawaban:** Uang yang ditabung oleh Ayah adalah Rp1.400.000.
`
      },
      {
        id: '2-10',
        title: '10. Latihan Soal Mandiri Bab 2',
        content: `
Ujilah pemahamanmu dengan mencoba latihan soal berikut sebelum membuka pembahasan:

#### Soal 1 (Menyederhanakan Pecahan)
Bentuk paling sederhana dari pecahan $\\frac{42}{70}$ adalah ...

#### Soal 2 (Operasi Campuran Pecahan)
Hitunglah hasil dari $1\\frac{3}{4} + \\frac{2}{5} \\div \\frac{4}{15} - \\frac{1}{2}$!

#### Soal 3 (Perpangkatan Pecahan)
Tentukan hasil dari $\\left(\\frac{2}{3}\\right)^3 \\times \\left(1\\frac{1}{2}\\right)^2$!

#### Soal 4 (Soal Cerita Pembagian)
Pak RT memiliki persediaan beras sebanyak $35\\frac{1}{2}\\text{ kg}$. Beras tersebut akan dimasukkan ke dalam beberapa kantong plastik yang masing-masing berkapasitas $2\\frac{1}{2}\\text{ kg}$. Berapa banyak kantong plastik yang dibutuhkan dan berapa kg sisa beras jika ada?

#### Soal 5 (Aplikasi Diskon & Pecahan)
Harga sebuah kemeja mula-mula Rp160.000. Toko memberikan diskon sebesar $25\\%$. Namun pembeli harus membayar pajak pertambahan sebesar $\\frac{1}{10}$ dari harga setelah diskon. Berapa rupiah total uang yang harus dibayar?
`,
        practiceAnswers: [
          {
            number: 1,
            question: 'Sederhanakan 42/70',
            answer: '3/5',
            step: 'FPB dari 42 dan 70 adalah 14. 42 / 14 = 3, 70 / 14 = 5. Jadi hasilnya 3/5.'
          },
          {
            number: 2,
            question: 'Hitung 1 3/4 + 2/5 / (4/15) - 1/2',
            answer: '2 3/4 (atau 11/4)',
            step: 'Pembagian dulu: (2/5) / (4/15) = (2/5) * (15/4) = 30/20 = 3/2 = 1 1/2. Lalu 1 3/4 + 1 1/2 - 1/2 = 1 3/4 + 1 = 2 3/4.'
          },
          {
            number: 3,
            question: 'Hitung (2/3)^3 * (1 1/2)^2',
            answer: '2/3',
            step: '(2/3)^3 = 8/27. 1 1/2 = 3/2 -> (3/2)^2 = 9/4. Hasil kali = (8/27) * (9/4) = (8*9)/(27*4) = 72/108 = 2/3.'
          },
          {
            number: 4,
            question: 'Beras 35 1/2 kg dibagi per kantong 2 1/2 kg',
            answer: '14 kantong penuh dan sisa 1/2 kg',
            step: '35 1/2 = 71/2. Kantong = 5/2. (71/2) / (5/2) = 71/5 = 14 sisa 1 bagian dari 5, yaitu 14 kantong berisi 35 kg dan tersisa 1/2 kg beras.'
          },
          {
            number: 5,
            question: 'Kemeja Rp160.000 diskon 25%, pajak 1/10 dari harga setelah diskon',
            answer: 'Rp132.000',
            step: 'Diskon = 25% * 160.000 = Rp40.000. Harga setelah diskon = Rp120.000. Pajak = 1/10 * 120.000 = Rp12.000. Total bayar = 120.000 + 12.000 = Rp132.000.'
          }
        ]
      }
    ]
  },
  {
    chapter_number: 3,
    title: 'Bab 3: Rasio, Skala, dan Laju Perubahan Satuan',
    description: 'Konsep rasio, menyederhanakan perbandingan, rasio senilai & berbalik nilai, skala peta, laju perubahan, kecepatan, dan debit air.',
    subchapters: [
      {
        id: '3-1',
        title: '1. Pengertian Rasio dan Menyederhanakan Rasio',
        content: `
### Pengertian Rasio (Perbandingan)
Rasio adalah cara membandingkan dua nilai atau besaran yang sejenis dengan satuan yang sama. Rasio antara nilai $a$ dan nilai $b$ ($b \\neq 0$) dapat dituliskan dalam bentuk:

$$a : b \\quad \\text{atau} \\quad \\frac{a}{b}$$

Contoh: Jika di kelas VII-A terdapat 18 siswa laki-laki dan 24 siswa perempuan, rasio siswa laki-laki terhadap siswa perempuan adalah $18 : 24$.

---

### Menyederhanakan Rasio
Menyederhanakan rasio dilakukan dengan membagi kedua bilangan dengan FPB-nya, persis seperti menyederhanakan pecahan biasa.

> **Syarat Mutlak:** Sebelum menyederhanakan rasio, **satuan dari kedua besaran harus disamakan terlebih dahulu!**

**Contoh 1:** Sederhanakan rasio $18 : 24$.
- FPB dari 18 dan 24 adalah 6.
- $18 \\div 6 = 3$ dan $24 \\div 6 = 4$
- Bentuk sederhana: **$3 : 4$**

**Contoh 2:** Sederhanakan rasio $500\\text{ gram} : 2\\text{ kg}$.
1. Samakan satuan ke gram ($1\\text{ kg} = 1.000\\text{ gram}$):
   $$2\\text{ kg} = 2.000\\text{ gram}$$
2. Tulis rasio: $500 : 2.000$
3. Bagi kedua bilangan dengan 500:
   $$500 \\div 500 = 1 \\quad \\text{dan} \\quad 2.000 \\div 500 = 4$$
- Bentuk sederhana: **$1 : 4$**
`
      },
      {
        id: '3-2',
        title: '2. Rasio Bagian terhadap Bagian & terhadap Keseluruhan',
        content: `
### Memahami Dua Sudut Pandang Rasio
Misalkan sebuah keranjang berisi $12$ buah apel dan $20$ buah jeruk (total ada $12 + 20 = 32$ buah).

1. **Rasio Bagian terhadap Bagian (Part to Part):**
   - Membandingkan satu kelompok dengan kelompok lainnya.
   - Rasio apel terhadap jeruk $= 12 : 20 = 3 : 5$.
   - Artinya, setiap ada 3 apel, terdapat 5 jeruk.

2. **Rasio Bagian terhadap Keseluruhan (Part to Whole):**
   - Membandingkan satu kelompok dengan jumlah total keseluruhan.
   - Rasio apel terhadap total buah $= 12 : 32 = 3 : 8$ (atau $\\frac{3}{8}$ dari seluruh buah).
   - Rasio jeruk terhadap total buah $= 20 : 32 = 5 : 8$ (atau $\\frac{5}{8}$ dari seluruh buah).

---

### Rumus Menentukan Nilai Berdasarkan Rasio
Jika rasio $A : B = m : n$:
- Nilai $A = \\frac{m}{m + n} \\times \\text{Jumlah } (A + B)$
- Nilai $A = \\frac{m}{|m - n|} \\times \\text{Selisih } |A - B|$
- Nilai $A = \\frac{m}{n} \\times \\text{Nilai } B$
`
      },
      {
        id: '3-3',
        title: '3. Perbandingan Senilai (Direct Proportion)',
        content: `
### Konsep Perbandingan Senilai
Perbandingan senilai terjadi jika **pertambahan nilai suatu besaran menyebabkan pertambahan nilai besaran lainnya secara sebanding**, atau sebaliknya.

Contoh situasi perbandingan senilai:
- Jumlah buku yang dibeli dengan total harga yang harus dibayar.
- Jarak yang ditempuh mobil dengan banyaknya bahan bakar (bensin) yang terpakai.
- Waktu kerja dan upah harian yang diterima buruh.

---

### Rumus Perbandingan Senilai
$$\\frac{x_1}{y_1} = \\frac{x_2}{y_2} \\iff x_1 \\cdot y_2 = x_2 \\cdot y_1$$

**Contoh Soal:**
Sebuah mobil memerlukan 4 liter bensin untuk menempuh jarak $60\\text{ km}$. Berapa liter bensin yang diperlukan untuk menempuh jarak $150\\text{ km}$?

**Penyelesaian:**
- $x_1 = 4\\text{ liter}$, $y_1 = 60\\text{ km}$
- $x_2 = ?$, $y_2 = 150\\text{ km}$
$$\\frac{4}{60} = \\frac{x_2}{150}$$
$$60 \\times x_2 = 4 \\times 150$$
$$60 \\cdot x_2 = 600 \\implies x_2 = \\frac{600}{60} = 10\\text{ liter}$$
Jadi, dibutuhkan **10 liter bensin**.
`
      },
      {
        id: '3-4',
        title: '4. Perbandingan Berbalik Nilai (Inverse Proportion)',
        content: `
### Konsep Perbandingan Berbalik Nilai
Perbandingan berbalik nilai terjadi jika **pertambahan nilai suatu besaran justru menyebabkan penurunan nilai besaran lainnya**, sedemikian sehingga **hasil kali kedua variabel bernilai konstan**.

Contoh situasi perbandingan berbalik nilai:
- Kecepatan kendaraan dengan waktu tempuh perjalanan (makin cepat laju mobil, waktu yang dibutuhkan makin singkat).
- Banyaknya pekerja dengan waktu yang diperlukan untuk menyelesaikan suatu proyek bangunan.
- Banyaknya hewan ternak dengan waktu habisnya persediaan pakan rumput.

---

### Rumus Perbandingan Berbalik Nilai
$$x_1 \\cdot y_1 = x_2 \\cdot y_2 \\iff \\frac{x_1}{x_2} = \\frac{y_2}{y_1}$$

**Contoh Soal:**
Suatu pekerjaan pembangunan jembatan dapat diselesaikan oleh 12 orang pekerja dalam waktu 20 hari. Jika pekerjaan tersebut ingin diselesaikan dalam waktu 15 hari, berapa orang pekerja yang dibutuhkan secara keseluruhan?

**Penyelesaian:**
- $x_1 = 12\\text{ pekerja}$, $y_1 = 20\\text{ hari}$
- $x_2 = ?$, $y_2 = 15\\text{ hari}$
$$x_1 \\cdot y_1 = x_2 \\cdot y_2$$
$$12 \\times 20 = x_2 \\times 15$$
$$240 = 15 \\cdot x_2 \\implies x_2 = \\frac{240}{15} = 16\\text{ pekerja}$$
Jadi, dibutuhkan **16 pekerja** (artinya perlu tambahan $16 - 12 = 4$ pekerja).
`
      },
      {
        id: '3-5',
        title: '5. Skala pada Peta dan Denah',
        content: `
### Pengertian Skala
Skala adalah perbandingan antara jarak pada gambar/peta (JP) dengan jarak sebenarnya di permukaan bumi (JS).

$$\\text{Skala} = \\frac{\\text{Jarak pada Peta (JP)}}{\\text{Jarak Sebenarnya (JS)}}$$

> **Ingat:** Skala dituliskan dalam bentuk $1 : n$, dan **keduanya harus dalam satuan centimeter (cm)**.

**Konversi Satuan Panjang Penting:**
- $1\\text{ km} = 100.000\\text{ cm}$
- $1\\text{ m} = 100\\text{ cm}$

---

### Rumus Turunan Skala:
1. **Mencari Skala:** $\\text{Skala} = \\frac{JP}{JS}$
2. **Mencari Jarak pada Peta:** $JP = JS \\times \\text{Skala} = \\frac{JS}{n}$
3. **Mencari Jarak Sebenarnya:** $JS = \\frac{JP}{\\text{Skala}} = JP \\times n$

**Contoh Soal:**
Jarak antara kota A dan kota B pada peta adalah $4\\text{ cm}$. Jika skala peta adalah $1 : 1.500.000$, berapakah jarak sebenarnya antara kedua kota tersebut dalam satuan kilometer?

**Penyelesaian:**
- $JP = 4\\text{ cm}$
- Skala $= 1 : 1.500.000$ (artinya $1\\text{ cm}$ di peta mewakili $1.500.000\\text{ cm}$ di dunia nyata)
$$JS = JP \\times 1.500.000 = 4 \\times 1.500.000 = 6.000.000\\text{ cm}$$
Ubah cm ke km (dibagi 100.000):
$$JS = \\frac{6.000.000}{100.000} = 60\\text{ km}$$
Jadi, jarak sebenarnya adalah **60 km**.
`
      },
      {
        id: '3-6',
        title: '6. Laju Perubahan Satuan: Kecepatan, Jarak, dan Waktu',
        content: `
### Konsep Kecepatan sebagai Laju Perubahan Jarak terhadap Waktu
Kecepatan rata-rata ($v$) menyatakan seberapa jauh perpindahan jarak ($s$) yang ditempuh setiap satu satuan waktu ($t$).

$$v = \\frac{s}{t} \\quad \\Longleftrightarrow \\quad s = v \\times t \\quad \\Longleftrightarrow \\quad t = \\frac{s}{v}$$

Keterangan:
- $v$ = kecepatan (misalnya: $\\text{km/jam}$ atau $\\text{m/s}$)
- $s$ = jarak tempuh (misalnya: $\\text{km}$ atau $\\text{meter}$)
- $t$ = waktu tempuh (misalnya: $\\text{jam}$, $\\text{menit}$, atau $\\text{detik}$)

---

### Konversi Satuan Kecepatan
Mengubah $\\text{km/jam}$ ke $\\text{m/s}$ (meter per detik):
$$1\\text{ km/jam} = \\frac{1.000\\text{ meter}}{3.600\\text{ detik}} = \\frac{5}{18}\\text{ m/s}$$

**Contoh:** Ubah $72\\text{ km/jam}$ ke satuan $\\text{m/s}$:
$$72\\text{ km/jam} = 72 \\times \\frac{5}{18} = 4 \\times 5 = 20\\text{ m/s}$$

**Contoh Soal Perjalanan:**
Sebuah bus melaju dengan kecepatan konstan $60\\text{ km/jam}$. Jika bus berangkat pukul 08.00 dan menempuh jarak $150\\text{ km}$, pukul berapakah bus tersebut sampai di tujuan?

**Penyelesaian:**
$$t = \\frac{s}{v} = \\frac{150\\text{ km}}{60\\text{ km/jam}} = 2,5\\text{ jam} = 2\\text{ jam } 30\\text{ menit}$$
Waktu tiba $= 08.00 + 2\\text{ jam } 30\\text{ menit} = \\mathbf{10.30}$.
`
      },
      {
        id: '3-7',
        title: '7. Laju Perubahan Harga dan Debit Air',
        content: `
### 1. Laju Perubahan Harga (Harga Satuan / Unit Rate)
Menghitung harga per satu satuan unit untuk membandingkan mana penawaran yang lebih hemat.

$$\\text{Harga Satuan} = \\frac{\\text{Total Harga}}{\\text{Jumlah Unit}}$$

**Contoh:** Toko A menjual 6 buah buku tulis seharga Rp24.000. Toko B menjual 10 buah buku tulis seharga Rp38.000. Toko manakah yang menjual buku lebih murah?
- Harga per buku di Toko A $= \\frac{\\text{Rp}24.000}{6} = \\text{Rp}4.000\\text{/buku}$.
- Harga per buku di Toko B $= \\frac{\\text{Rp}38.000}{10} = \\text{Rp}3.800\\text{/buku}$.
**Kesimpulan:** Toko B lebih murah karena harga satuannya Rp3.800 dibandingkan Toko A Rp4.000.

---

### 2. Debit Air ($Q$)
Debit air menyatakan banyaknya volume zat cair ($V$) yang mengalir melalui suatu penampang per satu satuan waktu ($t$).

$$Q = \\frac{V}{t} \\quad \\Longleftrightarrow \\quad V = Q \\times t \\quad \\Longleftrightarrow \\quad t = \\frac{V}{Q}$$

Keterangan:
- $Q$ = debit air (misalnya: $\\text{liter/menit}$ atau $\\text{m}^3/\\text{detik}$)
- $V$ = volume cairan (misalnya: $\\text{liter}$, $\\text{dm}^3$, $\\text{m}^3$)
- $t$ = waktu mengalir (misalnya: $\\text{menit}$, $\\text{detik}$)

**Hubungan Satuan Volume:**
- $1\\text{ liter} = 1\\text{ dm}^3 = 1.000\\text{ cm}^3 = 1.000\\text{ ml}$
- $1\\text{ m}^3 = 1.000\\text{ liter}$

**Contoh Soal Debit:**
Sebuah bak mandi bervolume $240\\text{ liter}$ diisi air menggunakan selang dengan debit $12\\text{ liter/menit}$. Berapa waktu yang dibutuhkan sampai bak tersebut terisi penuh?

**Penyelesaian:**
$$t = \\frac{V}{Q} = \\frac{240\\text{ liter}}{12\\text{ liter/menit}} = 20\\text{ menit}$$
Jadi, bak mandi akan terisi penuh dalam waktu **20 menit**.
`
      },
      {
        id: '3-8',
        title: '8. Contoh Soal dan Pembahasan Runtut',
        content: `
### Contoh 1: Perbandingan Selisih Umur
**Soal:** Rasio umur Kakak dan Adik adalah $5 : 3$. Jika selisih umur mereka berdua adalah 6 tahun, tentukan umur Kakak dan Adik masing-masing!

**Langkah Penyelesaian:**
1. Rasio Kakak : Adik $= 5 : 3$.
2. Selisih angka rasio $= 5 - 3 = 2\\text{ bagian}$.
3. Selisih umur riil $= 6\\text{ tahun}$.
4. Nilai 1 bagian rasio $= 6 \\div 2 = 3\\text{ tahun}$.
5. Hitung umur masing-masing:
   $$\\text{Umur Kakak} = 5 \\times 3\\text{ tahun} = 15\\text{ tahun}$$
   $$\\text{Umur Adik} = 3 \\times 3\\text{ tahun} = 9\\text{ tahun}$$
**Jawaban:** Umur Kakak adalah 15 tahun dan umur Adik adalah 9 tahun.

---

### Contoh 2: Menghitung Luas Rumah dari Denah
**Soal:** Sebuah denah rumah digambar dengan skala $1 : 200$. Pada denah tersebut, ruang keluarga digambar berbentuk persegi panjang dengan panjang $4\\text{ cm}$ dan lebar $3\\text{ cm}$. Berapakah luas ruang keluarga yang sebenarnya dalam meter persegi ($\text{m}^2$)?

**Langkah Penyelesaian:**
1. Hitung panjang sebenarnya:
   $$p = 4\\text{ cm} \\times 200 = 800\\text{ cm} = 8\\text{ meter}$$
2. Hitung lebar sebenarnya:
   $$l = 3\\text{ cm} \\times 200 = 600\\text{ cm} = 6\\text{ meter}$$
3. Hitung luas sebenarnya:
   $$L = p \\times l = 8\\text{ m} \\times 6\\text{ m} = 48\\text{ m}^2$$
**Jawaban:** Luas ruang keluarga yang sebenarnya adalah $48\\text{ m}^2$.
`
      },
      {
        id: '3-9',
        title: '9. Latihan Soal Mandiri Bab 3',
        content: `
Ujilah pemahamanmu dengan mencoba latihan soal berikut sebelum membuka pembahasan:

#### Soal 1 (Menyederhanakan Rasio)
Sederhanakan rasio antara 45 menit terhadap 2 jam!

#### Soal 2 (Perbandingan Senilai)
Sebuah konveksi dapat menjahit 84 potong pakaian seragam dalam waktu 7 hari. Berapa banyak pakaian yang dapat dijahit dalam waktu 15 hari?

#### Soal 3 (Perbandingan Berbalik Nilai)
Sebuah peternak mempunyai persediaan pakan ayam yang cukup untuk 60 ekor ayam selama 24 hari. Jika peternak membeli 20 ekor ayam lagi, berapa hari persediaan pakan tersebut akan habis?

#### Soal 4 (Skala Peta)
Jarak kota P dan Q sebenarnya adalah $120\\text{ km}$. Pada peta jarak kedua kota tersebut digambar sepanjang $8\\text{ cm}$. Tentukan skala peta tersebut!

#### Soal 5 (Debit & Waktu)
Sebuah kolam ikan bervolume $1.800\\text{ liter}$ dikuras menggunakan pompa air dengan debit $75\\text{ liter/menit}$. Berapa waktu yang dibutuhkan hingga air di kolam habis terkuras?
`,
        practiceAnswers: [
          {
            number: 1,
            question: 'Sederhanakan 45 menit : 2 jam',
            answer: '3 : 8',
            step: '2 jam = 120 menit. 45 : 120 = (45/15) : (120/15) = 3 : 8.'
          },
          {
            number: 2,
            question: '84 baju dalam 7 hari. Berapa baju dalam 15 hari?',
            answer: '180 potong pakaian',
            step: 'Laju per hari = 84 / 7 = 12 baju/hari. Dalam 15 hari = 15 * 12 = 180 baju.'
          },
          {
            number: 3,
            question: '60 ayam habis pakan 24 hari. Jika tambah 20 ekor (total 80 ekor), berapa hari?',
            answer: '18 hari',
            step: 'Berbalik nilai: 60 * 24 = 80 * x -> 1440 = 80x -> x = 1440 / 80 = 18 hari.'
          },
          {
            number: 4,
            question: 'JP = 8 cm, JS = 120 km. Berapakah skala?',
            answer: '1 : 1.500.000',
            step: 'JS = 120 km = 12.000.000 cm. Skala = 8 / 12.000.000 = 1 / 1.500.000.'
          },
          {
            number: 5,
            question: 'Volume 1.800 liter, debit 75 liter/menit. Berapa menit?',
            answer: '24 menit',
            step: 't = V / Q = 1.800 / 75 = 24 menit.'
          }
        ]
      }
    ]
  }
];

module.exports = {
  mathChaptersData
};
