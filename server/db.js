const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'lms_rumah_bunda.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
function initDatabase() {
  db.exec(`
    -- 1. Users / Profiles
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      class_grade TEXT DEFAULT 'VII SMP',
      avatar TEXT DEFAULT 'student-1',
      bio TEXT DEFAULT 'Siswa kelas VII SMP di Rumah Bunda',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Subjects (Mata Pelajaran Kelas 7)
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      color_theme TEXT DEFAULT 'sage',
      order_index INTEGER DEFAULT 0
    );

    -- 3. Chapters (Bab Pembelajaran)
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      chapter_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    -- 4. Chapter Progress (Status Belajar & Penyelesaian Bab per Siswa)
    CREATE TABLE IF NOT EXISTS chapter_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      chapter_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'in_progress',
      completed_at DATETIME,
      last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      UNIQUE(user_id, chapter_id)
    );

    -- 5. Quizzes
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 15,
      total_questions INTEGER DEFAULT 5,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    -- Quiz Questions
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL,
      explanation TEXT DEFAULT '',
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- 6. Quiz Attempts (Riwayat Pengerjaan & Skor Kuis)
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      answers_json TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- 7. Games (Permainan Edukatif)
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
    );

    -- 8. Game Attempts (Riwayat Permainan & Skor Game)
    CREATE TABLE IF NOT EXISTS game_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      details_json TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    );

    -- 9. Learning Activities (Riwayat Aktivitas Belajar)
    CREATE TABLE IF NOT EXISTS learning_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      activity_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedInitialData();
}

// Seed default subjects, chapters, quizzes, and games if not yet populated
function seedInitialData() {
  const subjectCount = db.prepare('SELECT COUNT(*) as count FROM subjects').get().count;

  if (subjectCount === 0) {
    const insertSubject = db.prepare(`
      INSERT INTO subjects (slug, name, icon, description, color_theme, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const subjectsData = [
      {
        slug: 'matematika',
        name: 'Matematika',
        icon: 'Calculator',
        description: 'Pelajari konsep bilangan, aljabar, perbandingan, dan geometri kelas 7.',
        color_theme: 'blue',
        order_index: 1
      },
      {
        slug: 'bahasa-inggris',
        name: 'Bahasa Inggris',
        icon: 'Languages',
        description: 'Tingkatkan kemampuan reading, grammar, vocabulary, dan percakapan dasar.',
        color_theme: 'sage',
        order_index: 2
      },
      {
        slug: 'bahasa-indonesia',
        name: 'Bahasa Indonesia',
        icon: 'BookOpen',
        description: 'Pahami teks deskripsi, fantasi, prosedur, dan laporan hasil observasi.',
        color_theme: 'amber',
        order_index: 3
      },
      {
        slug: 'ipas',
        name: 'IPAS',
        icon: 'Atom',
        description: 'Eksplorasi sains alam, penyelidikan ilmiah, zat, dan ekosistem sekitar.',
        color_theme: 'teal',
        order_index: 4
      }
    ];

    for (const sub of subjectsData) {
      insertSubject.run(sub.slug, sub.name, sub.icon, sub.description, sub.color_theme, sub.order_index);
    }
  }

  // Seed chapters
  const chapterCount = db.prepare('SELECT COUNT(*) as count FROM chapters').get().count;
  if (chapterCount === 0) {
    const insertChapter = db.prepare(`
      INSERT INTO chapters (subject_id, chapter_number, title, description, content, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Get subject IDs
    const mtk = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('matematika').id;
    const bing = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-inggris').id;
    const bind = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-indonesia').id;
    const ipas = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('ipas').id;

    // Matematika chapters (Grade 7 SMP)
    const mtkChapters = [
      { num: 1, title: 'Bab 1: Bilangan Bulat dan Pecahan', desc: 'Operasi hitung bilangan bulat, pecahan, dan sifat-sifatnya.' },
      { num: 2, title: 'Bab 2: Aljabar', desc: 'Unsur aljabar, penjumlahan, pengurangan, dan perkalian aljabar.' },
      { num: 3, title: 'Bab 3: Persamaan dan Pertidaksamaan Linear Satu Variabel', desc: 'Konsep persamaan linear dan penyelesaian masalah kontekstual.' },
      { num: 4, title: 'Bab 4: Perbandingan dan Skala', desc: 'Perbandingan senilai, berbalik nilai, dan aplikasi skala peta.' },
      { num: 5, title: 'Bab 5: Aritmetika Sosial', desc: 'Harga beli, harga jual, untung, rugi, diskon, dan pajak.' },
      { num: 6, title: 'Bab 6: Garis dan Sudut', desc: 'Hubungan antargaris, jenis sudut, dan hubungan antarsudut.' }
    ];

    // Bahasa Inggris chapters
    const bingChapters = [
      { num: 1, title: 'Bab 1: Good Morning! (Greeting & Introduction)', desc: 'Ungkapan salam, berpamitan, dan memperkenalkan diri dalam bahasa Inggris.' },
      { num: 2, title: 'Bab 2: It is What Time? (Time & Daily Routines)', desc: 'Menyatakan waktu, hari, tanggal, dan rutinitas harian sederhana.' },
      { num: 3, title: 'Bab 3: What Does It Look Like? (Descriptive Text)', desc: 'Mendeskripsikan ciri-ciri orang, hewan peliharaan, dan benda sekitar.' },
      { num: 4, title: 'Bab 4: This is My World (Things Around Us)', desc: 'Kosa kata benda-benda di kelas, rumah, dan lingkungan sekitar.' },
      { num: 5, title: 'Bab 5: I Love Things I Do (Simple Present Tense)', desc: 'Penggunaan kata kerja aktivitas dan kebiasaan sehari-hari.' },
      { num: 6, title: 'Bab 6: We Love What We Do (Hobbies & Interests)', desc: 'Menceritakan kegemaran dan kegiatan yang disukai bersama teman.' }
    ];

    // Bahasa Indonesia chapters
    const bindChapters = [
      { num: 1, title: 'Bab 1: Jelajah Nusantara (Teks Deskripsi)', desc: 'Memahami ciri, struktur, dan kebahasaan teks deskripsi keindahan objek.' },
      { num: 2, title: 'Bab 2: Berkelana di Dunia Imajinasi (Cerita Fantasi)', desc: 'Mengidentifikasi unsur intrinsik dan keajaiban tokoh dalam cerita fantasi.' },
      { num: 3, title: 'Bab 3: Langkah Tepat Melakukan Sesuatu (Teks Prosedur)', desc: 'Menyusun urutan langkah petunjuk membuat atau melakukan sesuatu.' },
      { num: 4, title: 'Bab 4: Menyibak Fakta Ilmiah (Laporan Hasil Observasi)', desc: 'Membaca dan menelaah informasi faktual dari pengamatan lingkungan.' },
      { num: 5, title: 'Bab 5: Melestarikan Nilai Luhur (Puisi Rakyat & Pantun)', desc: 'Mengenal rima, bait, dan pesan moral dalam pantun dan gurindam.' },
      { num: 6, title: 'Bab 6: Membuka Gerbang Dunia (Buku Fiksi & Nonfiksi)', desc: 'Mengenal unsur buku, peta konsep ide pokok, dan ulasan bacaan.' }
    ];

    // IPAS chapters
    const ipasChapters = [
      { num: 1, title: 'Bab 1: Hakikat Ilmu Sains dan Pengukuran', desc: 'Metode ilmiah, laboratorium sains, dan besaran serta pengukuran fisika.' },
      { num: 2, title: 'Bab 2: Zat dan Perubahannya', desc: 'Wujud materi zat padat, cair, gas, dan perubahan fisika serta kimia.' },
      { num: 3, title: 'Bab 3: Suhu, Kalor, dan Pemuaian', desc: 'Konsep termometer, skala suhu, perpindahan kalor, dan pemuaian benda.' },
      { num: 4, title: 'Bab 4: Gerak dan Gaya', desc: 'Konsep perpindahan, kecepatan, percepatan, serta pengaruh gaya terhadap gerak.' },
      { num: 5, title: 'Bab 5: Klasifikasi Makhluk Hidup & Ekosistem', desc: 'Pengelompokan makhluk hidup, rantai makanan, dan keseimbangan ekologi.' },
      { num: 6, title: 'Bab 6: Bumi dan Tata Surya', desc: 'Sistem tata surya, rotasi, revolusi bumi, dan benda-benda langit.' }
    ];

    // Per user prompt instructions:
    // "kosongkan isi materi terlebih dahulu. Judul bab dapat menggunakan penamaan sementara seperti 'Bab 1', 'Bab 2', dan seterusnya. Jangan mengarang isi materi pembelajaran karena kontennya akan ditambahkan kemudian."
    // Notice content is intentionally empty string ('')!

    for (const c of mtkChapters) insertChapter.run(mtk, c.num, c.title, c.desc, '', c.num);
    for (const c of bingChapters) insertChapter.run(bing, c.num, c.title, c.desc, '', c.num);
    for (const c of bindChapters) insertChapter.run(bind, c.num, c.title, c.desc, '', c.num);
    for (const c of ipasChapters) insertChapter.run(ipas, c.num, c.title, c.desc, '', c.num);
  }

  // Seed Quizzes & Questions
  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get().count;
  if (quizCount === 0) {
    const mtk = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('matematika').id;
    const bing = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-inggris').id;
    const bind = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-indonesia').id;
    const ipas = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('ipas').id;

    const insertQuiz = db.prepare(`
      INSERT INTO quizzes (subject_id, title, description, duration_minutes, total_questions, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertQuestion = db.prepare(`
      INSERT INTO quiz_questions (quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Math Quiz
    const q1 = insertQuiz.run(
      mtk,
      'Kuis Latihan Matematika: Bilangan Bulat & Pecahan',
      'Uji kemampuan dasar operasi hitung bilangan bulat dan pecahan kelas 7 SMP.',
      15,
      5,
      1
    );
    const q1Id = q1.lastInsertRowid;

    insertQuestion.run(
      q1Id, 1,
      'Hasil dari -12 + 25 - (-7) adalah...',
      '6', '20', '32', '-20',
      'C', 'Penjelasan: -12 + 25 = 13. Kemudian 13 - (-7) = 13 + 7 = 32.'
    );
    insertQuestion.run(
      q1Id, 2,
      'Suhu di dalam lemari es mula-mula -4°C. Ketika listrik mati, suhunya naik 2°C setiap 10 menit. Berapakah suhu lemari es setelah 30 menit?',
      '2°C', '4°C', '6°C', '-2°C',
      'A', 'Penjelasan: Dalam 30 menit terjadi kenaikan 3 kali (30/10). Kenaikan = 3 x 2°C = 6°C. Suhu akhir = -4°C + 6°C = 2°C.'
    );
    insertQuestion.run(
      q1Id, 3,
      'Bentuk sederhana dari pecahan 24 / 36 adalah...',
      '2/3', '3/4', '4/6', '1/2',
      'A', 'Penjelasan: Pembilang dan penyebut sama-sama dibagi FPB-nya, yaitu 12. 24:12 = 2, 36:12 = 3. Jadi hasilnya 2/3.'
    );
    insertQuestion.run(
      q1Id, 4,
      'Hasil dari 3/4 + 1/2 adalah...',
      '4/6', '5/4 atau 1 1/4', '4/4', '3/8',
      'B', 'Penjelasan: Samakan penyebut menjadi 4: 3/4 + 2/4 = 5/4 = 1 1/4.'
    );
    insertQuestion.run(
      q1Id, 5,
      'Dalam sebuah tes dengan 10 soal, jawaban benar bernilai 4, salah -2, dan tidak dijawab 0. Jika Budi menjawab benar 7 soal dan salah 3 soal, nilai Budi adalah...',
      '28', '22', '16', '20',
      'B', 'Penjelasan: Nilai benar = 7 x 4 = 28. Nilai salah = 3 x (-2) = -6. Total = 28 + (-6) = 22.'
    );

    // English Quiz
    const q2 = insertQuiz.run(
      bing,
      'English Quiz: Greetings & Self-Introduction',
      'Latihan soal pemahaman ungkapan salam, perkenalan diri, dan daily communication.',
      10,
      5,
      2
    );
    const q2Id = q2.lastInsertRowid;

    insertQuestion.run(
      q2Id, 1,
      'Rani meets her teacher at 7:00 AM. What should she say to greet her teacher?',
      'Good night, Ma\'am.', 'Good afternoon, Ma\'am.', 'Good morning, Ma\'am.', 'Good evening, Ma\'am.',
      'C', 'Penjelasan: Pukul 07.00 pagi menggunakan sapaan "Good morning".'
    );
    insertQuestion.run(
      q2Id, 2,
      'Edo: "Nice to meet you, Beni." Beni: "..."',
      'Nice to meet you too.', 'I am sorry.', 'Good bye.', 'Thank you.',
      'A', 'Penjelasan: Jawaban yang tepat untuk "Nice to meet you" adalah "Nice to meet you too".'
    );
    insertQuestion.run(
      q2Id, 3,
      'Which sentence is correct for introducing yourself?',
      'Her name is Nina.', 'My name is Farhan and I am 13 years old.', 'They are my friends.', 'His hobby is reading.',
      'B', 'Penjelasan: Kalimat perkenalan diri sendiri menggunakan kata ganti kepemilikan "My name is...".'
    );
    insertQuestion.run(
      q2Id, 4,
      'What do you say before going to bed at night?',
      'Good morning', 'Good afternoon', 'Good night', 'Hello',
      'C', 'Penjelasan: "Good night" digunakan untuk berpamitan pada malam hari sebelum tidur.'
    );
    insertQuestion.run(
      q2Id, 5,
      '"Thank you very much for your help, Siti." The best response is...',
      'I am fine', 'You are welcome', 'Goodbye', 'See you later',
      'B', 'Penjelasan: Respon yang sopan atas ucapan terima kasih adalah "You are welcome".'
    );
  }

  // Seed Games
  const gameCount = db.prepare('SELECT COUNT(*) as count FROM games').get().count;
  if (gameCount === 0) {
    const mtk = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('matematika').id;
    const bing = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-inggris').id;
    const ipas = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('ipas').id;
    const bind = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-indonesia').id;

    const insertGame = db.prepare(`
      INSERT INTO games (subject_id, name, slug, icon, description, is_active, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Playable Math Game
    insertGame.run(
      mtk,
      'Tantangan Hitung Cepat',
      'hitung-cepat-matematika',
      'Zap',
      'Latih ketangkasan berhitung bilangan bulat kelas 7 dalam waktu terbatas!',
      1,
      1
    );

    // Playable English Word Game
    insertGame.run(
      bing,
      'Kuis Kosakata Bahasa Inggris',
      'tebak-kata-inggris',
      'Sparkles',
      'Susun huruf dan tebak arti kosa kata harian bahasa Inggris kelas 7 SMP.',
      1,
      2
    );

    // Upcoming Games (is_active = 0 to showcase upcoming structure as requested)
    insertGame.run(
      ipas,
      'Petualangan Penjelajah Sains IPAS',
      'petualangan-sains-ipas',
      'Compass',
      'Eksplorasi konsep tata surya, rantai makanan, dan ekosistem bumi.',
      0, // Segera Hadir
      3
    );

    insertGame.run(
      bind,
      'Teka-Teki Pantun Nusantara',
      'teka-teki-pantun',
      'Scroll',
      'Lengkapi bait pantun dan uji pemahaman rima serta makna puisi rakyat.',
      0, // Segera Hadir
      4
    );
  }
}

// Upgrade and synchronize Math Curriculum (3 chapters, 3 quizzes with 10 questions each, 3 games)
function upgradeMathCurriculum() {
  const { mathChaptersData } = require('./data/mathChapters');
  const { mathQuizzesData } = require('./data/mathQuizzes');

  // 1. Add columns if not exist
  try { db.exec('ALTER TABLE quizzes ADD COLUMN chapter_number INTEGER DEFAULT NULL;'); } catch (e) {}
  try { db.exec('ALTER TABLE quiz_questions ADD COLUMN difficulty TEXT DEFAULT "Sedang";'); } catch (e) {}

  const mtkSubject = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('matematika');
  if (!mtkSubject) return;
  const mtkId = mtkSubject.id;

  // 2. Update Matematika Chapters (Only 3 chapters as requested)
  // Remove chapters > 3 for Matematika to keep clean 3 chapters
  db.prepare('DELETE FROM chapters WHERE subject_id = ? AND chapter_number > 3').run(mtkId);

  const checkChapterStmt = db.prepare('SELECT id FROM chapters WHERE subject_id = ? AND chapter_number = ?');
  const insertChapterStmt = db.prepare(`
    INSERT INTO chapters (subject_id, chapter_number, title, description, content, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const updateChapterStmt = db.prepare(`
    UPDATE chapters
    SET title = ?, description = ?, content = ?, order_index = ?
    WHERE id = ?
  `);

  for (const c of mathChaptersData) {
    const existing = checkChapterStmt.get(mtkId, c.chapter_number);
    const contentJson = JSON.stringify(c.subchapters);
    if (existing) {
      updateChapterStmt.run(c.title, c.description, contentJson, c.chapter_number, existing.id);
    } else {
      insertChapterStmt.run(mtkId, c.chapter_number, c.title, c.description, contentJson, c.chapter_number);
    }
  }

  // 3. Update Quizzes for Matematika (10 questions per chapter)
  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes (subject_id, title, description, duration_minutes, total_questions, chapter_number, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const updateQuizStmt = db.prepare(`
    UPDATE quizzes
    SET title = ?, description = ?, duration_minutes = ?, total_questions = ?, chapter_number = ?, order_index = ?
    WHERE id = ?
  `);
  const insertQuestionStmt = db.prepare(`
    INSERT INTO quiz_questions (quiz_id, question_number, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const q of mathQuizzesData) {
    let quiz = db.prepare('SELECT id FROM quizzes WHERE subject_id = ? AND chapter_number = ?').get(mtkId, q.chapter_number);
    if (!quiz) {
      // Check by title match
      quiz = db.prepare('SELECT id FROM quizzes WHERE subject_id = ? AND title LIKE ?').get(mtkId, `%Bab ${q.chapter_number}%`);
    }

    let quizId;
    if (quiz) {
      quizId = quiz.id;
      updateQuizStmt.run(q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number, q.chapter_number, quizId);
      // Replace questions with the 10 comprehensive questions
      db.prepare('DELETE FROM quiz_questions WHERE quiz_id = ?').run(quizId);
    } else {
      const res = insertQuizStmt.run(mtkId, q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number, q.chapter_number);
      quizId = res.lastInsertRowid;
    }

    for (const item of q.questions) {
      insertQuestionStmt.run(
        quizId,
        item.question_number,
        item.difficulty || 'Sedang',
        item.question_text,
        item.option_a,
        item.option_b,
        item.option_c,
        item.option_d,
        item.correct_option,
        item.explanation
      );
    }
  }

  // 4. Update the 3 Educational Games for Matematika
  const gamesToRegister = [
    {
      name: 'Petualangan Bilangan Bulat',
      slug: 'petualangan-bilangan-bulat',
      icon: 'Compass',
      description: 'Selesaikan 3 level tantangan operasi bilangan bulat, nilai mutlak, operasi campuran, dan FPB/KPK.',
      is_active: 1,
      order: 1
    },
    {
      name: 'Misi Pecahan',
      slug: 'misi-pecahan',
      icon: 'PieChart',
      description: 'Pecahkan tantangan visual batang pecahan, lingkaran kue, konversi desimal, persen, dan diskon belanja.',
      is_active: 1,
      order: 2
    },
    {
      name: 'Ekspedisi Rasio dan Skala',
      slug: 'ekspedisi-rasio-skala',
      icon: 'MapPin',
      description: 'Jalankan ekspedisi peta pos perbandingan senilai/berbalik nilai, skala denah, kecepatan, dan debit air.',
      is_active: 1,
      order: 3
    }
  ];

  for (const g of gamesToRegister) {
    const existingGame = db.prepare('SELECT id FROM games WHERE slug = ?').get(g.slug);
    if (existingGame) {
      db.prepare(`
        UPDATE games
        SET name = ?, icon = ?, description = ?, is_active = ?, subject_id = ?, order_index = ?
        WHERE id = ?
      `).run(g.name, g.icon, g.description, g.is_active, mtkId, g.order, existingGame.id);
    } else {
      db.prepare(`
        INSERT INTO games (subject_id, name, slug, icon, description, is_active, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(mtkId, g.name, g.slug, g.icon, g.description, g.is_active, g.order);
    }
  }
}

// Upgrade and synchronize Bahasa Indonesia Curriculum (3 chapters, 3 quizzes with 15 questions each, 3 games)
function upgradeBahasaIndonesiaCurriculum() {
  const { bahasaIndonesiaChaptersData } = require('./data/bahasaIndonesiaChapters');
  const { bahasaIndonesiaQuizzesData } = require('./data/bahasaIndonesiaQuizzes');

  const bIndoSubject = db.prepare('SELECT id FROM subjects WHERE slug = ?').get('bahasa-indonesia');
  if (!bIndoSubject) return;
  const bIndoId = bIndoSubject.id;

  // 1. Clean up chapters > 3 for Bahasa Indonesia
  try {
    db.prepare('DELETE FROM chapter_progress WHERE chapter_id IN (SELECT id FROM chapters WHERE subject_id = ? AND chapter_number > 3)').run(bIndoId);
    db.prepare('DELETE FROM chapters WHERE subject_id = ? AND chapter_number > 3').run(bIndoId);
  } catch (e) {
    console.error('Error cleaning obsolete chapters:', e);
  }

  // 2. Upsert 3 chapters for Bahasa Indonesia
  const checkChapterStmt = db.prepare('SELECT id FROM chapters WHERE subject_id = ? AND chapter_number = ?');
  const insertChapterStmt = db.prepare(`
    INSERT INTO chapters (subject_id, chapter_number, title, description, content, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const updateChapterStmt = db.prepare(`
    UPDATE chapters
    SET title = ?, description = ?, content = ?, order_index = ?
    WHERE id = ?
  `);

  for (const c of bahasaIndonesiaChaptersData) {
    const existing = checkChapterStmt.get(bIndoId, c.chapter_number);
    const contentJson = JSON.stringify(c.subchapters);
    if (existing) {
      updateChapterStmt.run(c.title, c.description, contentJson, c.chapter_number, existing.id);
    } else {
      insertChapterStmt.run(bIndoId, c.chapter_number, c.title, c.description, contentJson, c.chapter_number);
    }
  }

  // 3. Upsert Quizzes for Bahasa Indonesia (15 questions per chapter)
  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes (subject_id, title, description, duration_minutes, total_questions, chapter_number, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const updateQuizStmt = db.prepare(`
    UPDATE quizzes
    SET title = ?, description = ?, duration_minutes = ?, total_questions = ?, chapter_number = ?, order_index = ?
    WHERE id = ?
  `);
  const insertQuestionStmt = db.prepare(`
    INSERT INTO quiz_questions (quiz_id, question_number, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const q of bahasaIndonesiaQuizzesData) {
    let quiz = db.prepare('SELECT id FROM quizzes WHERE subject_id = ? AND chapter_number = ?').get(bIndoId, q.chapter_number);
    if (!quiz) {
      quiz = db.prepare('SELECT id FROM quizzes WHERE subject_id = ? AND title LIKE ?').get(bIndoId, `%Bab ${q.chapter_number}%`);
    }

    let quizId;
    if (quiz) {
      quizId = quiz.id;
      updateQuizStmt.run(q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number, q.chapter_number, quizId);
      db.prepare('DELETE FROM quiz_questions WHERE quiz_id = ?').run(quizId);
    } else {
      const res = insertQuizStmt.run(bIndoId, q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number, q.chapter_number);
      quizId = res.lastInsertRowid;
    }

    for (const item of q.questions) {
      insertQuestionStmt.run(
        quizId,
        item.question_number,
        item.difficulty || 'Sedang',
        item.question_text,
        item.option_a,
        item.option_b,
        item.option_c,
        item.option_d,
        item.correct_option,
        item.explanation
      );
    }
  }

  // 4. Update the 3 Educational Games for Bahasa Indonesia
  const gamesToRegister = [
    {
      name: 'Detektif Teks Deskripsi',
      slug: 'detektif-teks-deskripsi',
      icon: 'Search',
      description: 'Selidiki kata sifat, kata konkret, bagian struktur teks, majas personifikasi & metafora, dan perbaiki kata depan di/ke/dari.',
      is_active: 1,
      order: 1
    },
    {
      name: 'Petualangan Dunia Imajinasi',
      slug: 'petualangan-dunia-imajinasi',
      icon: 'Sparkles',
      description: 'Jelajahi gerbang puisi rakyat (pantun, syair, gurindam), susun bait rima, dan pecahkan misteri cerita fantasi.',
      is_active: 1,
      order: 2
    },
    {
      name: 'Susun Langkah dengan Tepat',
      slug: 'susun-langkah-tepat',
      icon: 'ListOrdered',
      description: 'Susun urutan resep salad buah & cuci tangan WHO, klasifikasikan kalimat imperatif/interogatif, serta verba aktif-pasif.',
      is_active: 1,
      order: 3
    }
  ];

  for (const g of gamesToRegister) {
    const existingGame = db.prepare('SELECT id FROM games WHERE slug = ?').get(g.slug);
    if (existingGame) {
      db.prepare(`
        UPDATE games
        SET name = ?, icon = ?, description = ?, is_active = ?, subject_id = ?, order_index = ?
        WHERE id = ?
      `).run(g.name, g.icon, g.description, g.is_active, bIndoId, g.order, existingGame.id);
    } else {
      db.prepare(`
        INSERT INTO games (subject_id, name, slug, icon, description, is_active, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(bIndoId, g.name, g.slug, g.icon, g.description, g.is_active, g.order);
    }
  }

  // Deactivate old placeholder teka-teki-pantun if present
  try {
    db.prepare('UPDATE games SET is_active = 0 WHERE slug = ?').run('teka-teki-pantun');
  } catch (e) {}
}

// Upgrade user table schema for enhanced profile & settings
function upgradeUserColumns() {
  const columns = db.prepare('PRAGMA table_info(users)').all().map(c => c.name);
  if (!columns.includes('school_name')) {
    db.exec(`ALTER TABLE users ADD COLUMN school_name TEXT DEFAULT 'SMP Negeri 1 Rumah Bunda'`);
  }
  if (!columns.includes('education_level')) {
    db.exec(`ALTER TABLE users ADD COLUMN education_level TEXT DEFAULT 'Sekolah Menengah Pertama (SMP)'`);
  }
  if (!columns.includes('notification_pref')) {
    db.exec(`ALTER TABLE users ADD COLUMN notification_pref TEXT DEFAULT '{"reminder":true,"quiz":true,"announcement":true}'`);
  }
  if (!columns.includes('theme_pref')) {
    db.exec(`ALTER TABLE users ADD COLUMN theme_pref TEXT DEFAULT 'sage'`);
  }
}

// Initialize database right away
initDatabase();
upgradeUserColumns();
upgradeMathCurriculum();
upgradeBahasaIndonesiaCurriculum();

module.exports = {
  db,
  initDatabase,
  upgradeUserColumns,
  upgradeMathCurriculum,
  upgradeBahasaIndonesiaCurriculum
};
