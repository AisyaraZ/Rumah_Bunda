// Kumpulan Soal Kuis Bahasa Indonesia Kelas 7 SMP Semester 1 (Rumah Bunda)
// Masing-masing bab memiliki 15 soal pilihan ganda dengan 4 opsi (A, B, C, D)
// Kunci jawaban terverifikasi dan dilengkapi pembahasan langkah demi langkah

const bahasaIndonesiaQuizzesData = [
  // ==========================================
  // QUIZ BAB 1: JELAJAH NUSANTARA (TEKS DESKRIPSI)
  // ==========================================
  {
    chapter_number: 1,
    title: 'Quiz Bab 1: Jelajah Nusantara (Teks Deskripsi)',
    description: 'Uji pemahamanmu tentang ciri, tujuan, struktur teks deskripsi, majas personifikasi & metafora, kata konkret, serta ejaan kata depan.',
    duration_minutes: 25,
    total_questions: 15,
    questions: [
      {
        question_number: 1,
        difficulty: 'Mudah',
        question_text: 'Teks yang menggambarkan suatu objek, tempat, atau suasana secara terperinci sehingga pembaca seolah-olah melihat dan merasakan sendiri objek tersebut disebut...',
        option_a: 'Teks prosedur',
        option_b: 'Teks deskripsi',
        option_c: 'Teks laporan hasil observasi',
        option_d: 'Teks narasi ekspositoris',
        correct_option: 'B',
        explanation: 'Teks deskripsi adalah teks yang melukiskan objek secara terperinci dan konkret dengan melibatkan pancaindra sehingga pembaca seolah-olah mengalami sendiri hal yang digambarkan.'
      },
      {
        question_number: 2,
        difficulty: 'Mudah',
        question_text: 'Struktur teks deskripsi yang memuat pengenalan nama objek, lokasi keberadaan, sejarah singkat, atau gambaran umum disebut...',
        option_a: 'Deskripsi bagian',
        option_b: 'Penutup',
        option_c: 'Identifikasi',
        option_d: 'Simpulan',
        correct_option: 'C',
        explanation: 'Identifikasi (atau pernyataan umum) adalah bagian pembuka teks deskripsi yang mengenalkan nama objek, lokasi, sejarah, atau gambaran umum mengenai objek yang dibahas.'
      },
      {
        question_number: 3,
        difficulty: 'Mudah',
        question_text: 'Perhatikan kalimat berikut: "Aroma wangi bunga melati semerbak tercium saat melintasi kebun." Kalimat tersebut melibatkan pancaindra...',
        option_a: 'Penglihatan',
        option_b: 'Pendengaran',
        option_c: 'Penciuman',
        option_d: 'Perabaan',
        correct_option: 'C',
        explanation: 'Kata "aroma wangi" dan "tercium" secara langsung melibatkan indra penciuman (hidung).'
      },
      {
        question_number: 4,
        difficulty: 'Sedang',
        question_text: 'Di antara pilihan berikut, manakah kata konkret yang paling tepat untuk menggambarkan keindahan pantai?',
        option_a: 'Pemandangan mengagumkan',
        option_b: 'Pasir putih halus dan terumbu karang kemerahan',
        option_c: 'Suasana yang sangat menyenangkan',
        option_d: 'Kondisi alam yang luar biasa',
        correct_option: 'B',
        explanation: '"Pasir putih halus" dan "terumbu karang kemerahan" merupakan kata konkret karena wujud bendanya dapat dilihat dan diraba secara nyata oleh pancaindra.'
      },
      {
        question_number: 5,
        difficulty: 'Sedang',
        question_text: 'Perhatikan kutipan teks berikut:\n"Kebun Raya Bogor adalah kawasan konservasi botani tertua di Asia Tenggara yang terletak di jantung Kota Bogor, Jawa Barat. Kawasan seluas 87 hektare ini didirikan sejak tahun 1817."\nDalam struktur teks deskripsi, kutipan di atas menempati bagian...',
        option_a: 'Deskripsi bagian',
        option_b: 'Identifikasi',
        option_c: 'Simpulan atau kesan',
        option_d: 'Rekomendasi',
        correct_option: 'B',
        explanation: 'Paragraf tersebut mengenalkan nama objek (Kebun Raya Bogor), lokasi (Kota Bogor), dan sejarah pendirian (1817), yang merupakan ciri khas bagian Identifikasi.'
      },
      {
        question_number: 6,
        difficulty: 'Sedang',
        question_text: 'Kalimat berikut yang mengandung majas personifikasi adalah...',
        option_a: 'Hutan bakau adalah sabuk hijau penyelamat garis pantai dari abrasi.',
        option_b: 'Dedaunan pohon damar menari-nari riang menyambut semilir angin sore.',
        option_c: 'Candi Borobudur dibangun pada masa Wangsa Syailendra.',
        option_d: 'Air terjun itu memiliki ketinggian sekitar lima puluh meter.',
        correct_option: 'B',
        explanation: 'Majas personifikasi mengumpamakan benda mati seolah berbuat seperti manusia. Frasa "dedaunan menari-nari riang menyambut" menggambarkan daun mati berperilaku seperti manusia yang menari.'
      },
      {
        question_number: 7,
        difficulty: 'Sedang',
        question_text: 'Perhatikan kalimat: "Gunung Bromo adalah sang permata abadi di tanah Tengger." Gaya bahasa (majas) yang digunakan dalam kalimat tersebut adalah...',
        option_a: 'Personifikasi',
        option_b: 'Metafora',
        option_c: 'Hiperbola',
        option_d: 'Litotes',
        correct_option: 'B',
        explanation: 'Kalimat tersebut membandingkan Gunung Bromo secara langsung dengan sebutan kiasan "sang permata abadi" tanpa kata pembanding (seperti/laksana), sehingga merupakan majas metafora.'
      },
      {
        question_number: 8,
        difficulty: 'Sedang',
        question_text: 'Manakah penulisan kata depan yang paling tepat sesuai kaidah ejaan bahasa Indonesia?',
        option_a: 'Kami beristirahat dikebun raya setelah menempuh perjalanan jauh.',
        option_b: 'Bunga langka itu ditanam dipinggir kolam teratai.',
        option_c: 'Wisatawan berbondong-bondong menuju ke puncak bukit pada pagi hari.',
        option_d: 'Pemandangan itu dilukis disebuah kanvas berukuran besar.',
        correct_option: 'C',
        explanation: 'Kata depan "ke" yang menunjukkan arah/tempat harus ditulis terpisah ("ke puncak"). Pilihan A, B, dan D salah karena kata depan "di" yang menunjukkan tempat ditulis serangkai (seharusnya "di kebun", "di pinggir", "di sebuah").'
      },
      {
        question_number: 9,
        difficulty: 'Sedang',
        question_text: 'Manakah penulisan awalan (prefiks) di- yang benar pada kata kerja pasif berikut?',
        option_a: 'Tanaman langka itu di rawat dengan sangat teliti oleh petugas.',
        option_b: 'Kelopak bunga anggrek di petik untuk diteliti di laboratorium.',
        option_c: 'Kawasan konservasi ini dikunjungi oleh ribuan pelajar setiap bulan.',
        option_d: 'Keindahan Danau Toba di abadikan lewat jepretan kamera.',
        correct_option: 'C',
        explanation: 'Awalan di- pada kata kerja pasif harus ditulis serangkai/digabung ("dikunjungi", "dirawat", "dipetik", "diabadikan"). Pilihan C menulis kata "dikunjungi" secara benar dan serangkai.'
      },
      {
        question_number: 10,
        difficulty: 'Sulit',
        question_text: 'Perhatikan kalimat umum berikut: "Pantai Senggigi memiliki air laut yang sangat jernih."\nManakah kalimat perincian yang paling tepat untuk mengembangkan kalimat umum tersebut?',
        option_a: 'Banyak wisatawan berkunjung ke pantai ini bersama sanak saudaranya.',
        option_b: 'Batu karang dan ikan-ikan kecil berwarna perak tampak jelas berenang di dasar laut sedalam dua meter.',
        option_c: 'Pantai Senggigi terletak di pesisir barat Pulau Lombok, Nusa Tenggara Barat.',
        option_d: 'Kios cinderamata berjejer rapi di sepanjang jalan masuk kawasan pantai.',
        correct_option: 'B',
        explanation: 'Kalimat perincian harus menjelaskan secara spesifik rincian kejernihan air. Kalimat B merinci bahwa saking jernihnya air, batu karang dan ikan di dasar kedalaman 2 meter terlihat dengan jelas.'
      },
      {
        question_number: 11,
        difficulty: 'Sulit',
        question_text: 'Perhatikan kutipan penutup berikut:\n"Mengagumi kemegahan Candi Prambanan menyadarkan kita akan tingginya peradaban nenek moyang bangsa. Sungguh, mahakarya ini merupakan pusaka bangsa yang patut kita jaga kelestariannya selamanya."\nAlasan kutipan di atas tergolong bagian penutup teks deskripsi adalah...',
        option_a: 'Berisi perincian ukuran batuan dan relief candi secara matematis.',
        option_b: 'Berisi kesan, refleksi pribadi, dan ajakan penulis untuk melestarikan objek.',
        option_c: 'Menjelaskan lokasi geografi dan rute perjalanan menuju candi.',
        option_d: 'Memuat daftar harga tiket dan fasilitas yang tersedia bagi pengunjung.',
        correct_option: 'B',
        explanation: 'Bagian penutup/simpulan dalam teks deskripsi berisi kesan batin, refleksi perasaan kekaguman, atau tanggapan akhir penulis terhadap objek yang telah digambarkan.'
      },
      {
        question_number: 12,
        difficulty: 'Sulit',
        question_text: 'Perhatikan kalimat berikut:\n"Di griya anggrek kami melihat anggrek bulan anggrek hitam dan anggrek selop mekar serempak."\nPerbaikan penggunaan tanda baca yang tepat pada kalimat tersebut adalah...',
        option_a: 'Di griya anggrek, kami melihat anggrek bulan, anggrek hitam, dan anggrek selop mekar serempak.',
        option_b: 'Di Griya Anggrek, kami melihat anggrek bulan, anggrek hitam dan anggrek selop mekar serempak.',
        option_c: 'Di Griya Anggrek, kami melihat anggrek bulan, anggrek hitam, dan anggrek selop mekar serempak.',
        option_d: 'Di Griya Anggrek kami melihat: anggrek bulan; anggrek hitam; dan anggrek selop mekar serempak.',
        correct_option: 'C',
        explanation: 'Nama diri tempat geografis "Griya Anggrek" harus diawali huruf kapital. Tanda koma digunakan setelah keterangan tempat di awal kalimat dan di antara rincian lebih dari dua unsur ("anggrek bulan, anggrek hitam, dan anggrek selop").'
      },
      {
        question_number: 13,
        difficulty: 'Sedang',
        question_text: 'Teks deskripsi "Pesona Kebun Raya" menggambarkan teratai raksasa Victoria amazonica. Kalimat yang menggambarkan objek tersebut melalui panca indra penglihatan adalah...',
        option_a: 'Aroma wangi bunga teratai semerbak tercium dari kejauhan.',
        option_b: 'Daunnya yang bulat lebar berwarna hijau cerah mengapung anggun di atas air tenang laksana nampan alami.',
        option_c: 'Permukaan daunnya terasa licin dan agak dingin saat disentuh jari.',
        option_d: 'Gemericik air di sekitar akar teratai terdengar menenangkan hati.',
        correct_option: 'B',
        explanation: 'Ciri fisik "daun bulat lebar berwarna hijau cerah mengapung anggun laksana nampan alami" diserap oleh indra penglihatan (mata).'
      },
      {
        question_number: 14,
        difficulty: 'Sulit',
        question_text: 'Manakah urutan langkah yang paling tepat dan logis dalam menyusun teks deskripsi?',
        option_a: 'Menulis teks -> menentukan objek -> menyunting ejaan -> membuat kerangka',
        option_b: 'Menentukan objek -> mengumpulkan data pengamatan -> membuat kerangka -> mengembangkan teks -> menyunting tulisan',
        option_c: 'Mengembangkan teks -> menentukan tujuan -> mengamati objek -> mempublikasikan',
        option_d: 'Menyunting tulisan -> membuat kerangka -> menentukan objek -> mengamati objek',
        correct_option: 'B',
        explanation: 'Urutan menulis teks deskripsi yang benar diawali menentukan objek, mengamati dan mengumpulkan data indrawi, menyusun kerangka (identifikasi-deskripsi bagian-penutup), mengembangkan menjadi draf teks, lalu menyunting ejaan dan tanda baca.'
      },
      {
        question_number: 15,
        difficulty: 'Mudah',
        question_text: 'Perhatikan kalimat: "Semilir angin pegunungan membelai lembut wajah para pejalan kaki." Kata sifat dalam kalimat tersebut adalah...',
        option_a: 'Angin',
        option_b: 'Pegunungan',
        option_c: 'Lembut',
        option_d: 'Wajah',
        correct_option: 'C',
        explanation: 'Kata "lembut" adalah kata sifat (adjektiva) yang menerangkan cara belaian angin pada wajah pejalan kaki.'
      }
    ]
  },

  // ==========================================
  // QUIZ BAB 2: BERKELANA DI DUNIA IMAJINASI (PUISI RAKYAT & CERITA FANTASI)
  // ==========================================
  {
    chapter_number: 2,
    title: 'Quiz Bab 2: Berkelana di Dunia Imajinasi',
    description: 'Uji kemampuanmu membedakan pantun, syair, gurindam, mengidentifikasi struktur cerita fantasi, unsur intrinsik, dan analisis tokoh ajaib.',
    duration_minutes: 25,
    total_questions: 15,
    questions: [
      {
        question_number: 1,
        difficulty: 'Mudah',
        question_text: 'Puisi rakyat yang terdiri atas empat baris tiap bait dengan pola rima akhir silang a-b-a-b, di mana baris 1-2 adalah sampiran dan baris 3-4 adalah isi disebut...',
        option_a: 'Gurindam',
        option_b: 'Syair',
        option_c: 'Pantun',
        option_d: 'Seloka',
        correct_option: 'C',
        explanation: 'Pantun memiliki ciri khas bersajak a-b-a-b, terdiri atas 4 baris, baris 1-2 merupakan sampiran, dan baris 3-4 merupakan isi.'
      },
      {
        question_number: 2,
        difficulty: 'Mudah',
        question_text: 'Perhatikan ciri puisi rakyat berikut:\n1) Terdiri atas 2 baris dalam satu bait.\n2) Bersajak akhir a-a.\n3) Baris pertama berisi soal/syarat dan baris kedua berisi akibat/nasihat.\nCiri-ciri tersebut dimiliki oleh...',
        option_a: 'Pantun',
        option_b: 'Gurindam',
        option_c: 'Syair',
        option_d: 'Talibun',
        correct_option: 'B',
        explanation: 'Gurindam adalah puisi rakyat dua baris berima a-a, karya masyhur Raja Ali Haji, di mana baris 1 adalah syarat/sebab dan baris 2 adalah akibat/nasihat.'
      },
      {
        question_number: 3,
        difficulty: 'Mudah',
        question_text: 'Ciri utama yang membedakan syair dari pantun adalah...',
        option_a: 'Syair bersajak a-b-a-b sedangkan pantun a-a-a-a',
        option_b: 'Semua baris pada syair adalah isi, tidak memiliki sampiran',
        option_c: 'Syair hanya terdiri atas dua baris tiap bait',
        option_d: 'Syair tidak terikat aturan jumlah suku kata',
        correct_option: 'B',
        explanation: 'Pada syair, keempat baris dalam bait merupakan isi cerita/petuah yang utuh (semua baris adalah isi, berima a-a-a-a), sedangkan pantun memiliki sampiran pada dua baris awal.'
      },
      {
        question_number: 4,
        difficulty: 'Sedang',
        question_text: 'Perhatikan bait pantun berikut:\n"Pohon beringin daunnya lebat, (1)\nTempat berteduh si anak gembala. (2)\n[ . . . . . . . . . . . . . . . . . . . . . . ] (3)\nTentu dirimu hidup bahagia. (4)"\nBaris ketiga yang paling tepat untuk melengkapi pantun di atas adalah...',
        option_a: 'Bila kamu rajin beribadat',
        option_b: 'Mari kawan rajin belajar',
        option_c: 'Kalau kamu bersikap hemat',
        option_d: 'Jangan suka berbuat jahat',
        correct_option: 'C',
        explanation: 'Baris ke-4 berakhiran bunyi "-a" (gembala / bahagia). Baris ke-3 harus bersajak dengan baris ke-1 yang berakhiran "-at" (lebat). Di samping itu, nasihat hidup bahagia sangat padu dengan "Kalau kamu bersikap hemat" (lebat - gembala - hemat - bahagia).'
      },
      {
        question_number: 5,
        difficulty: 'Sedang',
        question_text: 'Perhatikan bait gurindam berikut:\n"Barang siapa meninggalkan sembahyang,\nIbarat rumah tiada bertiang."\nMakna tersirat dari gurindam tersebut adalah...',
        option_a: 'Orang yang rajin sembahyang pasti memiliki rumah mewah bertiang megah.',
        option_b: 'Ibadah sembahyang adalah tiang utama penopang kokohnya kehidupan moral manusia.',
        option_c: 'Mendirikan rumah harus menggunakan tiang kayu jati yang kuat.',
        option_d: 'Orang yang tidak sembahyang akan kehilangan tempat tinggalnya.',
        correct_option: 'B',
        explanation: 'Perumpamaan "rumah tiada bertiang" melambangkan kerapuhan hidup. Tanpa tiang penyangga (sembahyang/ibadah), kehidupan manusia akan mudah roboh dan binasa.'
      },
      {
        question_number: 6,
        difficulty: 'Mudah',
        question_text: 'Teks naratif yang menghadirkan dunia khayalan penuh keajaiban, tokoh sakti, atau latar menembus batas ruang dan waktu disebut...',
        option_a: 'Cerita fantasi',
        option_b: 'Cerita fabel',
        option_c: 'Teks biografi',
        option_d: 'Cerita anekdot',
        correct_option: 'A',
        explanation: 'Cerita fantasi adalah teks naratif fiksi yang memuat keajaiban supranatural, tokoh dengan kekuatan luar biasa, dan peristiwa di luar hukum alam.'
      },
      {
        question_number: 7,
        difficulty: 'Sedang',
        question_text: 'Cerita fantasi yang seluruh tokoh, latar tempat, dan peristiwanya merupakan rekaan murni penulis tanpa menggunakan nama tempat nyata di bumi disebut...',
        option_a: 'Fantasi irisan',
        option_b: 'Fantasi total',
        option_c: 'Fantasi sezaman',
        option_d: 'Fantasi lintas waktu',
        correct_option: 'B',
        explanation: 'Fantasi total adalah jenis cerita fantasi yang semua unsurnya (nama tempat, tokoh, dunia) diciptakan murni dari imajinasi pengarang dan tidak ada di dunia nyata.'
      },
      {
        question_number: 8,
        difficulty: 'Sedang',
        question_text: 'Bagian struktur cerita fantasi yang memperkenalkan tokoh utama, watak, latar tempat, dan suasana awal cerita disebut...',
        option_a: 'Resolusi',
        option_b: 'Komplikasi',
        option_c: 'Orientasi',
        option_d: 'Klimaks',
        correct_option: 'C',
        explanation: 'Orientasi adalah tahap awal cerita yang berfungsi mengenalkan tokoh, watak, latar tempat, waktu, dan suasana permulaan.'
      },
      {
        question_number: 9,
        difficulty: 'Sedang',
        question_text: 'Perhatikan kutipan teks fantasi berikut:\n"Tiba-tiba buku bersampul naga perak memancarkan cahaya ungu menyilaukan. Rak perpustakaan bergetar hebat dan sebuah pusaran angin gaib menyedot Arga masuk ke lorong dimensi lain!"\nDalam struktur cerita fantasi, kutipan tersebut menandai dimulainya tahap...',
        option_a: 'Orientasi',
        option_b: 'Komplikasi',
        option_c: 'Resolusi',
        option_d: 'Koda',
        correct_option: 'B',
        explanation: 'Peristiwa munculnya keanehan, cahaya ajaib, dan tersedotnya tokoh ke dimensi lain merupakan awal munculnya konflik dan rintangan yang menjadi inti Komplikasi.'
      },
      {
        question_number: 10,
        difficulty: 'Sedang',
        question_text: 'Tahap penyelesaian konflik dalam cerita fantasi, di mana tokoh berhasil mengatasi rintangan dan kedamaian kembali pulih disebut...',
        option_a: 'Orientasi',
        option_b: 'Klimaks',
        option_c: 'Resolusi',
        option_d: 'Komplikasi',
        correct_option: 'C',
        explanation: 'Resolusi adalah bagian akhir cerita yang memuat penyelesaian masalah dari konflik atau rintangan yang dihadapi tokoh.'
      },
      {
        question_number: 11,
        difficulty: 'Sulit',
        question_text: 'Perhatikan kutipan cerita berikut:\n"Dengan segenap keberanian, Arga melafalkan mantra kebaikan dari buku naga perak. Seketika gelombang cahaya emas memancar menghancurkan monster kabut. Kristal es hitam yang membelenggu Kerajaan Aksara pecah berkeping-keping."\nUnsur intrinsik tokoh Arga yang tercermin dari kutipan tersebut adalah watak...',
        option_a: 'Pemberani dan pantang menyerah',
        option_b: 'Sombong dan mengandalkan kekuatan fisik',
        option_c: 'Ragu-ragu dan penakut',
        option_d: 'Pendendam terhadap musuh',
        correct_option: 'A',
        explanation: 'Tindakan Arga yang menghadapi monster dengan segenap keberanian dan melafalkan mantra kebaikan menunjukkan watak pemberani, berjiwa mulia, dan pantang menyerah.'
      },
      {
        question_number: 12,
        difficulty: 'Sulit',
        question_text: 'Dalam cerita "Pintu Ajaib di Perpustakaan", latar tempat berpindah dari perpustakaan sekolah masa kini ke Kerajaan Aksara berumput kristal. Berdasarkan latar waktunya, cerita tersebut tergolong cerita fantasi...',
        option_a: 'Fantasi sezaman',
        option_b: 'Fantasi lintas ruang dan waktu',
        option_c: 'Fantasi sains nonfiksi',
        option_d: 'Fantasi historis murni',
        correct_option: 'B',
        explanation: 'Kisah tersebut membawa tokoh menembus dua dimensi berbeda (dunia nyata perpustakaan sekolah dan dimensi Kerajaan Aksara), sehingga tergolong fantasi lintas ruang/waktu.'
      },
      {
        question_number: 13,
        difficulty: 'Sedang',
        question_text: 'Perhatikan bait syair berikut:\n"Wahai ananda dengarlah madah,\nMenuntut ilmu janganlah gundah,\nBiar lelah tetap tabah,\nAgar hidupmu beroleh berkah."\nPola rima akhir pada bait syair di atas adalah...',
        option_a: 'a-b-a-b',
        option_b: 'a-a-b-b',
        option_c: 'a-a-a-a',
        option_d: 'a-b-b-a',
        correct_option: 'C',
        explanation: 'Keempat baris berakhiran bunyi yang sama ("madah", "gundah", "tabah", "berkah" yang berakhiran -ah), sehingga polanya adalah lurus a-a-a-a khas syair.'
      },
      {
        question_number: 14,
        difficulty: 'Sulit',
        question_text: 'Amanat utama yang dapat dipetik dari cerita fantasi "Pintu Ajaib di Perpustakaan" adalah...',
        option_a: 'Perpustakaan tua harus segera dibongkar agar tidak ada buku misterius.',
        option_b: 'Membaca buku dan merawat ilmu adalah pelita yang menjaga kebaikan peradaban manusia.',
        option_c: 'Kita harus belajar mantra sihir untuk mengalahkan musuh di dimensi lain.',
        option_d: 'Jangan membaca buku di sore hari karena bisa terjebak di dunia lain.',
        correct_option: 'B',
        explanation: 'Amanat cerita mengajarkan bahwa buku dan kecintaan pada literasi adalah kekuatan pelindung ilmu dan peradaban manusia dari kehampaan zaman.'
      },
      {
        question_number: 15,
        difficulty: 'Mudah',
        question_text: 'Nama pengarang asli puisi rakyat biasanya tidak diketahui karena disebarkan secara lisan. Ciri ini disebut...',
        option_a: 'Arkais',
        option_b: 'Anonim',
        option_c: 'Komunal',
        option_d: 'Konvensional',
        correct_option: 'B',
        explanation: 'Anonim berarti tidak mencantumkan nama pengarang atau tidak diketahui siapa pencipta awalnya.'
      }
    ]
  },

  // ==========================================
  // QUIZ BAB 3: HAL YANG BAIK BAGI TUBUH (TEKS PROSEDUR)
  // ==========================================
  {
    chapter_number: 3,
    title: 'Quiz Bab 3: Hal yang Baik bagi Tubuh (Teks Prosedur)',
    description: 'Uji pemahamanmu tentang struktur teks prosedur, kalimat imperatif, konjungsi urutan waktu, verba aktif-pasif, serta takaran akurat dalam resep sehat & protokol cuci tangan.',
    duration_minutes: 25,
    total_questions: 15,
    questions: [
      {
        question_number: 1,
        difficulty: 'Mudah',
        question_text: 'Teks yang berisi panduan teratur untuk membuat, menggunakan, atau melakukan sesuatu secara runtut disebut...',
        option_a: 'Teks deskripsi',
        option_b: 'Teks prosedur',
        option_c: 'Teks eksposisi',
        option_d: 'Teks narasi',
        correct_option: 'B',
        explanation: 'Teks prosedur memuat langkah-langkah kerja sistematis agar pembaca dapat melakukan atau membuat sesuatu secara benar dan berhasil.'
      },
      {
        question_number: 2,
        difficulty: 'Mudah',
        question_text: 'Bagian struktur teks prosedur yang memuat penjelasan tentang hasil akhir atau manfaat yang akan diperoleh pembaca disebut...',
        option_a: 'Langkah-langkah',
        option_b: 'Tujuan',
        option_c: 'Alat dan bahan',
        option_d: 'Penutup',
        correct_option: 'B',
        explanation: 'Tujuan adalah bagian pengantar awal yang menjelaskan manfaat, hasil akhir, atau alasan mengapa prosedur tersebut penting dilakukan.'
      },
      {
        question_number: 3,
        difficulty: 'Mudah',
        question_text: 'Kalimat berikut yang merupakan kalimat imperatif (perintah) adalah...',
        option_a: 'Salad buah mengandung banyak vitamin C alami.',
        option_b: 'Apakah buah apel sudah dicuci dengan air mengalir?',
        option_c: 'Potonglah buah melon berbentuk dadu berukuran satu sentimeter!',
        option_d: 'Ibu membeli buah naga dan anggur di pasar swalayan.',
        correct_option: 'C',
        explanation: 'Kalimat "Potonglah buah melon berbentuk dadu...!" menggunakan kata kerja berakhiran partikel -lah dan tanda seru (!) yang menginstruksikan tindakan perintah langsung.'
      },
      {
        question_number: 4,
        difficulty: 'Mudah',
        question_text: 'Kalimat berikut yang merupakan contoh kalimat deklaratif (pernyataan) adalah...',
        option_a: 'Bilaslah kedua tanganmu hingga busa sabun hilang!',
        option_b: 'Mencuci tangan dengan sabun efektif membasmi kuman pembawa penyakit.',
        option_c: 'Bagaimana cara memotong buah apel agar tidak kecokelatan?',
        option_d: 'Jangan gunakan handuk basah yang sudah kotor!',
        correct_option: 'B',
        explanation: 'Kalimat B adalah kalimat deklaratif (berita) yang memberikan informasi faktual tanpa meminta atau memerintah.'
      },
      {
        question_number: 5,
        difficulty: 'Sedang',
        question_text: 'Perhatikan kalimat: "Apakah tanganmu sudah dibasahi sebelum menuang sabun?" Jenis kalimat tersebut adalah...',
        option_a: 'Kalimat imperatif',
        option_b: 'Kalimat deklaratif',
        option_c: 'Kalimat interogatif',
        option_d: 'Kalimat persuasif',
        correct_option: 'C',
        explanation: 'Kalimat tersebut menggunakan kata tanya "Apakah" dan diakhiri tanda tanya (?), sehingga tergolong kalimat interogatif (pertanyaan).'
      },
      {
        question_number: 6,
        difficulty: 'Sedang',
        question_text: 'Manakah kelompok kata yang semuanya merupakan konjungsi urutan waktu (temporal)?',
        option_a: 'Kemudian, setelah itu, selanjutnya, lalu',
        option_b: 'Karena, sebab, oleh karena itu, akibatnya',
        option_c: 'Dan, serta, atau, tetapi',
        option_d: 'Meskipun, walaupun, kendatipun, biarpun',
        correct_option: 'A',
        explanation: '"Kemudian", "setelah itu", "selanjutnya", dan "lalu" adalah konjungsi urutan waktu kronologis dalam teks prosedur.'
      },
      {
        question_number: 7,
        difficulty: 'Sedang',
        question_text: 'Perhatikan kalimat: "Ibu **mengupas** kulit buah apel dengan pisau."\nKata "mengupas" pada kalimat tersebut merupakan...',
        option_a: 'Verba pasif',
        option_b: 'Verba aktif',
        option_c: 'Nomina konkret',
        option_d: 'Adjektiva kualitas',
        correct_option: 'B',
        explanation: 'Kata "mengupas" berawalan me- di mana subjek (Ibu) melakukan tindakan langsung, sehingga merupakan verba aktif.'
      },
      {
        question_number: 8,
        difficulty: 'Sedang',
        question_text: 'Manakah bentuk kalimat pasif yang sesuai dari kalimat aktif "Petugas menyemprotkan disinfektan ke seluruh ruangan"?',
        option_a: 'Semprotkanlah disinfektan ke seluruh ruangan!',
        option_b: 'Disinfektan disemprotkan oleh petugas ke seluruh ruangan.',
        option_c: 'Petugas sedang menyemprot ruangan dengan disinfektan.',
        option_d: 'Apakah disinfektan sudah disemprotkan ke ruangan?',
        correct_option: 'B',
        explanation: 'Bentuk pasif menggunakan awalan di- pada verba ("disemprotkan") dan objek ("disinfektan") berpindah menjadi subjek kalimat.'
      },
      {
        question_number: 9,
        difficulty: 'Sedang',
        question_text: 'Ukuran bahan berikut yang paling tepat dan akurat untuk teks resep salad buah adalah...',
        option_a: 'Gunakan yogurt secukupnya sesuai selera.',
        option_b: 'Tambahkan madu sedikit saja agar tidak kemanisan.',
        option_c: 'Campurkan 150 ml yogurt tawar dan 2 sendok makan madu murni.',
        option_d: 'Potonglah beberapa buah apel berukuran sedang.',
        correct_option: 'C',
        explanation: 'Pilihan C menyebutkan takaran terukur baku secara eksak ("150 ml yogurt" dan "2 sendok makan madu"), sehingga tidak ambigu bagi pembaca.'
      },
      {
        question_number: 10,
        difficulty: 'Sulit',
        question_text: 'Perhatikan langkah acak membuat salad buah berikut:\n1) Tuangkan saus dressing yogurt dan aduk secara perlahan.\n2) Cuci bersih buah apel dan melon di bawah air mengalir.\n3) Simpan di dalam kulkas selama 20 menit sebelum disajikan.\n4) Potong buah menjadi bentuk dadu kecil lalu masukkan ke mangkuk saji.\nUrutan langkah pembuatan yang tepat dan logis adalah...',
        option_a: '2 - 4 - 1 - 3',
        option_b: '2 - 1 - 4 - 3',
        option_c: '4 - 2 - 1 - 3',
        option_d: '1 - 2 - 4 - 3',
        correct_option: 'A',
        explanation: 'Urutan pembuatan yang logis: (2) Cuci buah terlebih dahulu -> (4) Potong buah dan letakkan di mangkuk -> (1) Tuangkan saus dressing -> (3) Dinginkan di kulkas sebelum disajikan.'
      },
      {
        question_number: 11,
        difficulty: 'Sulit',
        question_text: 'Dalam prosedur mencuci tangan 6 langkah WHO, setelah meratakan sabun di telapak tangan dan menggosok punggung tangan, langkah selanjutnya yang benar adalah...',
        option_a: 'Langsung mengeringkan tangan dengan tisu bersih.',
        option_b: 'Menggosok sela-sela jari tangan bagian dalam secara merata.',
        option_c: 'Mematikan keran air menggunakan siku.',
        option_d: 'Menuangkan kembali sabun kedua kalinya.',
        correct_option: 'B',
        explanation: 'Urutan mencuci tangan WHO: telapak tangan -> punggung tangan dan sela luar -> sela-sela jari bagian dalam -> jemari posisi mengunci -> putar ibu jari -> putar kuku di telapak.'
      },
      {
        question_number: 12,
        difficulty: 'Sulit',
        question_text: 'Perhatikan kalimat berikut:\n"Sebelum memotong buah, pastikan tangan dan pisau dapur telah dicuci hingga bebas kuman."\nFungsi kata "Sebelum" pada kalimat prosedur tersebut adalah...',
        option_a: 'Menunjukkan konjungsi syarat bersyarat',
        option_b: 'Menunjukkan konjungsi urutan waktu untuk tindakan pendahulu',
        option_c: 'Menunjukkan konjungsi pertentangan antarkalimat',
        option_d: 'Menunjukkan kata seru penegas instruksi',
        correct_option: 'B',
        explanation: 'Kata "Sebelum" adalah konjungsi temporal yang menegaskan tindakan mencuci tangan harus dilakukan mendahului tahapan memotong buah.'
      },
      {
        question_number: 13,
        difficulty: 'Sedang',
        question_text: 'Manakah bagian yang termasuk penutup dalam teks prosedur resep makanan?',
        option_a: '1 buah mangkuk saji berukuran sedang dan 1 sendok pengaduk.',
        option_b: 'Salad buah segar kaya antioksidan siap dinikmati selagi dingin bersama keluarga tercinta!',
        option_c: 'Kupaslah kulit buah apel dan melon secara hati-hati di atas talenan.',
        option_d: '150 ml yogurt tawar dan 2 sendok makan madu alami.',
        correct_option: 'B',
        explanation: 'Kalimat B merupakan penutup/simpulan ramah yang memberi ucapan selamat menikmati hasil olahan yang telah selesai dibuat.'
      },
      {
        question_number: 14,
        difficulty: 'Sulit',
        question_text: 'Perhatikan kalimat imperatif larangan berikut:\n"Jangan mendiamkan potongan buah apel di udara terbuka terlalu lama karena dapat menyebabkan warnanya berubah kecokelatan (oksidasi)."\nCiri kebahasaan penting yang terkandung dalam kalimat di atas adalah...',
        option_a: 'Menggunakan kalimat imperatif larangan disertai alasan logis penjelasan',
        option_b: 'Menggunakan majas personifikasi buah apel',
        option_c: 'Menggunakan rima silang puisi rakyat',
        option_d: 'Menggunakan kalimat tanya interogatif ganda',
        correct_option: 'A',
        explanation: 'Kalimat tersebut menggunakan kata "Jangan" (larangan) dan menghubungkannya dengan kata "karena" yang memberikan alasan ilmiah/logis (terhindar dari oksidasi kecokelatan).'
      },
      {
        question_number: 15,
        difficulty: 'Mudah',
        question_text: 'Standar durasi minimal mencuci tangan memakai sabun yang dianjurkan oleh WHO agar kuman mati optimal adalah selama...',
        option_a: '5 detik',
        option_b: '10 detik',
        option_c: '20 detik',
        option_d: '60 menit',
        correct_option: 'C',
        explanation: 'WHO dan Kementerian Kesehatan menganjurkan mencuci tangan dengan sabun dan air mengalir selama minimal 20 detik.'
      }
    ]
  }
];

module.exports = {
  bahasaIndonesiaQuizzesData
};
