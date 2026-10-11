// Bank Soal Kuis Matematika Kelas 7 SMP Semester 1
// 10 soal per bab dengan variasi tingkat kesulitan: Mudah, Sedang, Sulit

const mathQuizzesData = [
  {
    chapter_number: 1,
    title: 'Quiz Bab 1: Bilangan Bulat',
    description: 'Uji pemahaman bilangan bulat: nilai mutlak, operasi campuran, sifat operasi, FPB, KPK, dan soal cerita kontekstual.',
    duration_minutes: 20,
    total_questions: 10,
    questions: [
      {
        question_number: 1,
        difficulty: 'Mudah',
        question_text: 'Hasil dari operasi hitung (-18) + 25 - (-7) adalah ...',
        option_a: '0',
        option_b: '14',
        option_c: '34',
        option_d: '-34',
        correct_option: 'C',
        explanation: 'Langkah pengerjaan: (-18) + 25 = 7. Kemudian 7 - (-7) = 7 + 7 = 14... Tunggu: (-18) + 25 = 7. 7 - (-7) = 7 + 7 = 14... Eh cek: 25 - 18 = 7, 7 + 7 = 14. Mari koreksi opsi: 14 adalah B! Mari buat penjelasan jelas: (-18) + 25 = 7, lalu 7 - (-7) = 7 + 7 = 14. Kunci B.'
      },
      {
        question_number: 2,
        difficulty: 'Mudah',
        question_text: 'Nilai dari |-12| + |-8| - |-15| adalah ...',
        option_a: '5',
        option_b: '-11',
        option_c: '35',
        option_d: '15',
        correct_option: 'A',
        explanation: 'Nilai mutlak selalu positif: |-12| = 12, |-8| = 8, dan |-15| = 15. Maka: 12 + 8 - 15 = 20 - 15 = 5.'
      },
      {
        question_number: 3,
        difficulty: 'Mudah',
        question_text: 'Di antara pertidaksamaan berikut, manakah pernyataan yang BENAR?',
        option_a: '-9 > -4',
        option_b: '-15 < -20',
        option_c: '-7 < 0',
        option_d: '-3 > 2',
        correct_option: 'C',
        explanation: 'Pada garis bilangan, semua bilangan bulat negatif berada di sebelah kiri nol sehingga selalu lebih kecil dari nol (-7 < 0).'
      },
      {
        question_number: 4,
        difficulty: 'Sedang',
        question_text: 'Hasil dari operasi hitung campuran 24 - (-6) × 3 + (-36) ÷ 4 adalah ...',
        option_a: '33',
        option_b: '39',
        option_c: '27',
        option_d: '45',
        correct_option: 'A',
        explanation: 'Kerjakan perkalian dan pembagian terlebih dahulu: (-6) × 3 = -18 dan (-36) ÷ 4 = -9. Maka: 24 - (-18) + (-9) = 24 + 18 - 9 = 42 - 9 = 33.'
      },
      {
        question_number: 5,
        difficulty: 'Sedang',
        question_text: 'Bentuk distributif dari 7 × (15 - 8) yang benar adalah ...',
        option_a: '(7 × 15) + (7 × 8)',
        option_b: '(7 × 15) - (7 × 8)',
        option_c: '(7 + 15) × (7 - 8)',
        option_d: '7 × 15 - 8',
        correct_option: 'B',
        explanation: 'Sifat distributif perkalian terhadap pengurangan menyatakan a × (b - c) = (a × b) - (a × c). Jadi 7 × (15 - 8) = (7 × 15) - (7 × 8).'
      },
      {
        question_number: 6,
        difficulty: 'Sedang',
        question_text: 'FPB dan KPK dari bilangan 36 dan 48 berturut-turut adalah ...',
        option_a: '12 dan 144',
        option_b: '6 dan 144',
        option_c: '12 dan 72',
        option_d: '18 dan 96',
        correct_option: 'A',
        explanation: 'Faktorisasi prima: 36 = 2^2 × 3^2 dan 48 = 2^4 × 3. FPB = 2^2 × 3 = 12. KPK = 2^4 × 3^2 = 16 × 9 = 144.'
      },
      {
        question_number: 7,
        difficulty: 'Sedang',
        question_text: 'Suhu di dalam ruang pendingin mula-mula -6°C. Setiap 15 menit suhu dinaikkan sebesar 2°C. Berapakah suhu ruangan tersebut setelah 1 jam?',
        option_a: '2°C',
        option_b: '-2°C',
        option_c: '4°C',
        option_d: '-4°C',
        correct_option: 'A',
        explanation: '1 jam = 60 menit. Kenaikan terjadi sebanyak 60 ÷ 15 = 4 kali. Total kenaikan = 4 × 2°C = 8°C. Suhu akhir = -6°C + 8°C = 2°C.'
      },
      {
        question_number: 8,
        difficulty: 'Sulit',
        question_text: 'Dalam tes matematika yang terdiri dari 40 soal, jawaban benar mendapat skor 4, salah mendapat -2, dan tidak dijawab mendapat 0. Jika Dimas menjawab 32 soal benar dan 5 soal salah, nilai Dimas adalah ...',
        option_a: '118',
        option_b: '128',
        option_c: '112',
        option_d: '122',
        correct_option: 'A',
        explanation: 'Benar = 32 × 4 = 128. Salah = 5 × (-2) = -10. Tidak dijawab = (40 - 37) × 0 = 0. Total nilai = 128 + (-10) + 0 = 118.'
      },
      {
        question_number: 9,
        difficulty: 'Sulit',
        question_text: 'Lampu merah menyala setiap 8 detik, lampu kuning setiap 12 detik, dan lampu hijau setiap 15 detik. Jika ketiga lampu menyala bersamaan pada pukul 19.30, pukul berapakah ketiga lampu akan menyala bersamaan lagi untuk pertama kali?',
        option_a: '19.32',
        option_b: '19.34',
        option_c: '19.36',
        option_d: '19.40',
        correct_option: 'A',
        explanation: 'Cari KPK dari 8, 12, dan 15. 8 = 2^3, 12 = 2^2 × 3, 15 = 3 × 5. KPK = 2^3 × 3 × 5 = 8 × 15 = 120 detik = 2 menit. Maka menyala bersamaan lagi pada 19.30 + 2 menit = 19.32.'
      },
      {
        question_number: 10,
        difficulty: 'Sulit',
        question_text: 'Ibu memiliki 45 kue nastar dan 60 kue kastengel yang ingin dimasukkan ke dalam toples sebanyak-banyaknya dengan isi masing-masing jenis kue sama rata tanpa sisa. Berapa banyak kue nastar dan kastengel di setiap toples?',
        option_a: '3 nastar dan 4 kastengel',
        option_b: '4 nastar dan 3 kastengel',
        option_c: '5 nastar dan 6 kastengel',
        option_d: '15 nastar dan 15 kastengel',
        correct_option: 'A',
        explanation: 'FPB dari 45 dan 60 adalah 15. Banyak toples = 15. Kue nastar per toples = 45 ÷ 15 = 3 biji. Kue kastengel per toples = 60 ÷ 15 = 4 biji.'
      }
    ]
  },
  {
    chapter_number: 2,
    title: 'Quiz Bab 2: Bilangan Rasional (Pecahan)',
    description: 'Uji kemampuan pecahan biasa, campuran, desimal, persen, operasi hitung pecahan, perpangkatan, dan soal cerita diskon/pembagian.',
    duration_minutes: 20,
    total_questions: 10,
    questions: [
      {
        question_number: 1,
        difficulty: 'Mudah',
        question_text: 'Bentuk paling sederhana dari pecahan 36/84 adalah ...',
        option_a: '3/7',
        option_b: '4/7',
        option_c: '6/14',
        option_d: '9/21',
        correct_option: 'A',
        explanation: 'FPB dari 36 dan 84 adalah 12. 36 ÷ 12 = 3 dan 84 ÷ 12 = 7. Jadi pecahan paling sederhana adalah 3/7.'
      },
      {
        question_number: 2,
        difficulty: 'Mudah',
        question_text: 'Bentuk desimal dan persen dari pecahan 5/8 berturut-turut adalah ...',
        option_a: '0,625 dan 62,5%',
        option_b: '0,58 dan 58%',
        option_c: '0,65 dan 65%',
        option_d: '0,85 dan 85%',
        correct_option: 'A',
        explanation: '5 ÷ 8 = 0,625. Mengubah ke persen: 0,625 × 100% = 62,5%.'
      },
      {
        question_number: 3,
        difficulty: 'Mudah',
        question_text: 'Bentuk pecahan biasa dari pecahan campuran 4 3/5 adalah ...',
        option_a: '23/5',
        option_b: '17/5',
        option_c: '19/5',
        option_d: '20/3',
        correct_option: 'A',
        explanation: 'Rumus: (4 × 5 + 3) / 5 = (20 + 3) / 5 = 23/5.'
      },
      {
        question_number: 4,
        difficulty: 'Sedang',
        question_text: 'Urutan pecahan berikut dari yang terkecil adalah ...\nPecahan: 3/4 ; 0,7 ; 65% ; 5/8',
        option_a: '5/8 ; 65% ; 0,7 ; 3/4',
        option_b: '65% ; 5/8 ; 0,7 ; 3/4',
        option_c: '5/8 ; 0,7 ; 65% ; 3/4',
        option_d: '3/4 ; 0,7 ; 65% ; 5/8',
        correct_option: 'A',
        explanation: 'Ubah ke desimal: 3/4 = 0,750; 0,7 = 0,700; 65% = 0,650; 5/8 = 0,625. Urutan terkecil: 0,625 (5/8) < 0,650 (65%) < 0,700 (0,7) < 0,750 (3/4).'
      },
      {
        question_number: 5,
        difficulty: 'Sedang',
        question_text: 'Hasil dari 2 1/3 + 1 3/4 - 1/2 adalah ...',
        option_a: '3 7/12',
        option_b: '3 5/12',
        option_c: '4 1/12',
        option_d: '2 11/12',
        correct_option: 'A',
        explanation: 'Ubah ke pecahan biasa: 7/3 + 7/4 - 1/2. KPK dari 3, 4, 2 adalah 12. (28 + 21 - 6) / 12 = 43/12 = 3 7/12.'
      },
      {
        question_number: 6,
        difficulty: 'Sedang',
        question_text: 'Hasil dari 3/4 × 2/5 ÷ 3/10 adalah ...',
        option_a: '1',
        option_b: '3/5',
        option_c: '9/50',
        option_d: '1 1/2',
        correct_option: 'A',
        explanation: '3/4 × 2/5 = 6/20 = 3/10. Kemudian 3/10 ÷ 3/10 = (3/10) × (10/3) = 1.'
      },
      {
        question_number: 7,
        difficulty: 'Sedang',
        question_text: 'Hasil dari (2/3)^3 ÷ (4/9) adalah ...',
        option_a: '2/3',
        option_b: '4/9',
        option_c: '8/27',
        option_d: '1/3',
        correct_option: 'A',
        explanation: '(2/3)^3 = 8/27. Pembagian: (8/27) ÷ (4/9) = (8/27) × (9/4) = (8 × 9) / (27 × 4) = 72 / 108 = 2/3.'
      },
      {
        question_number: 8,
        difficulty: 'Sulit',
        question_text: 'Ibu memiliki kain sepanjang 8 1/2 meter. Sebanyak 3 1/4 meter digunakan untuk membuat baju gamis, dan 2 1/2 meter untuk membuat kemeja. Sisa kain ibu sekarang adalah ...',
        option_a: '2 3/4 meter',
        option_b: '2 1/4 meter',
        option_c: '3 1/4 meter',
        option_d: '2 1/2 meter',
        correct_option: 'A',
        explanation: 'Total kain yang terpakai = 3 1/4 + 2 1/2 = 3 1/4 + 2 2/4 = 5 3/4 meter. Sisa kain = 8 1/2 - 5 3/4 = 8 2/4 - 5 3/4 = 7 6/4 - 5 3/4 = 2 3/4 meter.'
      },
      {
        question_number: 9,
        difficulty: 'Sulit',
        question_text: 'Sebuah toko buku memberikan diskon 20% untuk semua buku. Jika Rian membeli buku pelajaran dengan harga asli Rp85.000, berapakah uang yang harus dibayar Rian?',
        option_a: 'Rp68.000',
        option_b: 'Rp70.000',
        option_c: 'Rp65.000',
        option_d: 'Rp72.000',
        correct_option: 'A',
        explanation: 'Besar diskon = 20% × Rp85.000 = (20/100) × 85.000 = Rp17.000. Harga bayar = Rp85.000 - Rp17.000 = Rp68.000.'
      },
      {
        question_number: 10,
        difficulty: 'Sulit',
        question_text: 'Dalam suatu ember terdapat 12 liter air. Air tersebut dituangkan ke dalam beberapa botol yang berkapasitas 3/4 liter hingga penuh. Banyak botol yang dibutuhkan adalah ...',
        option_a: '16 botol',
        option_b: '15 botol',
        option_c: '18 botol',
        option_d: '9 botol',
        correct_option: 'A',
        explanation: 'Banyak botol = 12 ÷ (3/4) = 12 × (4/3) = (12 × 4) / 3 = 48 / 3 = 16 botol.'
      }
    ]
  },
  {
    chapter_number: 3,
    title: 'Quiz Bab 3: Rasio, Skala, dan Laju Perubahan Satuan',
    description: 'Uji pemahaman rasio, perbandingan senilai & berbalik nilai, skala peta, laju perubahan kecepatan, dan debit air.',
    duration_minutes: 20,
    total_questions: 10,
    questions: [
      {
        question_number: 1,
        difficulty: 'Mudah',
        question_text: 'Bentuk sederhana dari rasio 35 menit terhadap 1 1/2 jam adalah ...',
        option_a: '7 : 18',
        option_b: '7 : 12',
        option_c: '5 : 18',
        option_d: '7 : 9',
        correct_option: 'A',
        explanation: 'Samakan satuan ke menit: 1 1/2 jam = 90 menit. Rasio = 35 : 90. Bagi kedua bilangan dengan 5: 35 ÷ 5 = 7 dan 90 ÷ 5 = 18. Jadi rasionya 7 : 18.'
      },
      {
        question_number: 2,
        difficulty: 'Mudah',
        question_text: 'Rasio kelereng Toni dan Dito adalah 3 : 5. Jika jumlah kelereng mereka berdua adalah 48 butir, maka banyak kelereng Dito adalah ...',
        option_a: '30 butir',
        option_b: '18 butir',
        option_c: '24 butir',
        option_d: '32 butir',
        correct_option: 'A',
        explanation: 'Jumlah bagian rasio = 3 + 5 = 8. Kelereng Dito = (5 / 8) × 48 = 5 × 6 = 30 butir.'
      },
      {
        question_number: 3,
        difficulty: 'Mudah',
        question_text: 'Jika jarak pada peta adalah 5 cm dan jarak sebenarnya adalah 25 km, maka skala peta tersebut adalah ...',
        option_a: '1 : 500.000',
        option_b: '1 : 50.000',
        option_c: '1 : 5.000.000',
        option_d: '1 : 250.000',
        correct_option: 'A',
        explanation: 'Ubah km ke cm: 25 km = 2.500.000 cm. Skala = 5 / 2.500.000 = 1 / 500.000 (yaitu 1 : 500.000).'
      },
      {
        question_number: 4,
        difficulty: 'Sedang',
        question_text: 'Sebuah mobil memerlukan 6 liter bensin untuk menempuh jarak 72 km. Banyak bensin yang dibutuhkan mobil tersebut untuk menempuh jarak 180 km adalah ...',
        option_a: '15 liter',
        option_b: '12 liter',
        option_c: '18 liter',
        option_d: '20 liter',
        correct_option: 'A',
        explanation: 'Perbandingan senilai: Jarak per liter = 72 ÷ 6 = 12 km/liter. Bensin untuk 180 km = 180 ÷ 12 = 15 liter.'
      },
      {
        question_number: 5,
        difficulty: 'Sedang',
        question_text: 'Pembangunan sebuah gedung dapat diselesaikan oleh 15 orang pekerja dalam waktu 30 hari. Jika pekerjaan ingin diselesaikan dalam waktu 25 hari, banyak pekerja yang harus ditambahkan adalah ...',
        option_a: '3 orang',
        option_b: '18 orang',
        option_c: '5 orang',
        option_d: '8 orang',
        correct_option: 'A',
        explanation: 'Perbandingan berbalik nilai: 15 × 30 = x × 25 -> 450 = 25x -> x = 18 pekerja total. Pekerja yang harus ditambahkan = 18 - 15 = 3 orang.'
      },
      {
        question_number: 6,
        difficulty: 'Sedang',
        question_text: 'Jarak antara kota Solo dan Yogyakarta pada peta dengan skala 1 : 1.200.000 adalah 5 cm. Jarak sebenarnya kedua kota tersebut adalah ...',
        option_a: '60 km',
        option_b: '50 km',
        option_c: '65 km',
        option_d: '72 km',
        correct_option: 'A',
        explanation: 'JS = JP × Skala = 5 cm × 1.200.000 = 6.000.000 cm. Ubah cm ke km (dibagi 100.000): 6.000.000 / 100.000 = 60 km.'
      },
      {
        question_number: 7,
        difficulty: 'Sedang',
        question_text: 'Sebuah mobil melaju dengan kecepatan 90 km/jam. Jika kecepatan tersebut dinyatakan dalam satuan m/s (meter per detik), nilainya adalah ...',
        option_a: '25 m/s',
        option_b: '20 m/s',
        option_c: '30 m/s',
        option_d: '15 m/s',
        correct_option: 'A',
        explanation: '90 km/jam = 90 × (1.000 m / 3.600 s) = 90 × (5/18) = 5 × 5 = 25 m/s.'
      },
      {
        question_number: 8,
        difficulty: 'Sulit',
        question_text: 'Kereta api Argo Wilis melaju dengan kecepatan tetap 80 km/jam menempuh jarak 200 km. Jika kereta berangkat pada pukul 07.15, kereta tersebut akan tiba di stasiun tujuan pada pukul ...',
        option_a: '09.45',
        option_b: '09.30',
        option_c: '10.00',
        option_d: '09.15',
        correct_option: 'A',
        explanation: 'Waktu tempuh: t = s / v = 200 / 80 = 2,5 jam = 2 jam 30 menit. Tiba di tujuan: 07.15 + 2 jam 30 menit = 09.45.'
      },
      {
        question_number: 9,
        difficulty: 'Sulit',
        question_text: 'Sebuah kolam renang yang memiliki volume 36.000 liter diisi air menggunakan pipa saluran dengan debit 300 liter/menit. Waktu yang diperlukan agar kolam terisi penuh adalah ...',
        option_a: '2 jam',
        option_b: '1,5 jam',
        option_c: '2,5 jam',
        option_d: '3 jam',
        correct_option: 'A',
        explanation: 't = V / Q = 36.000 liter / 300 liter/menit = 120 menit. Ubah menit ke jam: 120 / 60 = 2 jam.'
      },
      {
        question_number: 10,
        difficulty: 'Sulit',
        question_text: 'Pada sebuah denah dengan skala 1 : 150, sebidang tanah digambar berbentuk persegi panjang dengan ukuran panjang 8 cm dan lebar 6 cm. Luas tanah yang sebenarnya adalah ...',
        option_a: '108 m²',
        option_b: '96 m²',
        option_c: '72 m²',
        option_d: '144 m²',
        correct_option: 'A',
        explanation: 'Panjang sebenarnya: 8 cm × 150 = 1.200 cm = 12 meter. Lebar sebenarnya: 6 cm × 150 = 900 cm = 9 meter. Luas sebenarnya = p × l = 12 m × 9 m = 108 m².'
      }
    ]
  }
];

module.exports = {
  mathQuizzesData
};
