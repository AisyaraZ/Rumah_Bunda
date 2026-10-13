require('dotenv').config();
const { Pool, types } = require('pg');
const fs = require('fs');
const path = require('path');

// Parse BigInt/COUNT as integer
types.setTypeParser(20, (val) => val === null ? null : parseInt(val, 10));
types.setTypeParser(1700, (val) => val === null ? null : parseFloat(val));

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('\n❌ ERROR: Variabel DATABASE_URL tidak ditemukan!');
  console.error('Silakan buat file .env di folder utama proyek dan masukkan connection string Supabase:');
  console.error('DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres\n');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 MEMULAI MIGRASI DATABASE KE SUPABASE (POSTGRESQL)');
  console.log('====================================================');

  const client = await pool.connect();
  try {
    // 1. Jalankan schema SQL
    console.log('\n📦 [1/4] Membuat struktur tabel di Supabase...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'supabase_schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✅ Struktur tabel dan indeks berhasil dibuat.');

    // 2. Periksa apakah SQLite lokal ada
    const sqlitePath = path.join(__dirname, '..', 'data', 'lms_rumah_bunda.db');
    let sqliteDb = null;
    if (fs.existsSync(sqlitePath)) {
      try {
        const Database = require('better-sqlite3');
        sqliteDb = new Database(sqlitePath);
        console.log('\n📂 [2/4] Ditemukan database SQLite lokal:', sqlitePath);
      } catch (err) {
        console.warn('⚠️ Tidak dapat membuka SQLite lokal:', err.message);
      }
    }

    if (sqliteDb) {
      console.log('\n🔄 [3/4] Memindahkan seluruh data dari SQLite ke Supabase...');

      // Migrasi Users
      const users = sqliteDb.prepare('SELECT * FROM users').all();
      console.log(`- Mengimpor ${users.length} pengguna...`);
      for (const u of users) {
        await client.query(`
          INSERT INTO users (id, full_name, username, email, password_hash, class_grade, avatar, bio, school_name, education_level, notification_pref, theme_pref, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            username = EXCLUDED.username,
            email = EXCLUDED.email,
            password_hash = EXCLUDED.password_hash,
            avatar = EXCLUDED.avatar,
            bio = EXCLUDED.bio,
            school_name = EXCLUDED.school_name,
            education_level = EXCLUDED.education_level,
            notification_pref = EXCLUDED.notification_pref,
            theme_pref = EXCLUDED.theme_pref
        `, [
          u.id, u.full_name, u.username, u.email, u.password_hash,
          u.class_grade || 'VII SMP', u.avatar || 'student-1', u.bio || '',
          u.school_name || 'SMP Negeri 1 Rumah Bunda',
          u.education_level || 'Sekolah Menengah Pertama (SMP)',
          u.notification_pref || '{"reminder":true,"quiz":true,"announcement":true}',
          u.theme_pref || 'sage',
          u.created_at || new Date(),
          u.updated_at || new Date()
        ]);
      }

      // Migrasi Subjects
      const subjects = sqliteDb.prepare('SELECT * FROM subjects').all();
      console.log(`- Mengimpor ${subjects.length} mata pelajaran...`);
      for (const s of subjects) {
        await client.query(`
          INSERT INTO subjects (id, slug, name, icon, description, color_theme, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            name = EXCLUDED.name,
            icon = EXCLUDED.icon,
            description = EXCLUDED.description,
            color_theme = EXCLUDED.color_theme,
            order_index = EXCLUDED.order_index
        `, [s.id, s.slug, s.name, s.icon, s.description, s.color_theme, s.order_index]);
      }

      // Migrasi Chapters
      const chapters = sqliteDb.prepare('SELECT * FROM chapters').all();
      console.log(`- Mengimpor ${chapters.length} bab pembelajaran...`);
      for (const c of chapters) {
        await client.query(`
          INSERT INTO chapters (id, subject_id, chapter_number, title, description, content, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            subject_id = EXCLUDED.subject_id,
            chapter_number = EXCLUDED.chapter_number,
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content = EXCLUDED.content,
            order_index = EXCLUDED.order_index
        `, [c.id, c.subject_id, c.chapter_number, c.title, c.description, c.content || '', c.order_index]);
      }

      // Migrasi Chapter Progress
      const progress = sqliteDb.prepare('SELECT * FROM chapter_progress').all();
      console.log(`- Mengimpor ${progress.length} riwayat progres bab...`);
      for (const p of progress) {
        await client.query(`
          INSERT INTO chapter_progress (id, user_id, chapter_id, status, completed_at, last_accessed_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (user_id, chapter_id) DO UPDATE SET
            status = EXCLUDED.status,
            completed_at = EXCLUDED.completed_at,
            last_accessed_at = EXCLUDED.last_accessed_at
        `, [p.id, p.user_id, p.chapter_id, p.status, p.completed_at, p.last_accessed_at || new Date()]);
      }

      // Migrasi Quizzes
      const quizzes = sqliteDb.prepare('SELECT * FROM quizzes').all();
      console.log(`- Mengimpor ${quizzes.length} kuis...`);
      for (const q of quizzes) {
        await client.query(`
          INSERT INTO quizzes (id, subject_id, title, description, duration_minutes, total_questions, chapter_number, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            duration_minutes = EXCLUDED.duration_minutes,
            total_questions = EXCLUDED.total_questions,
            chapter_number = EXCLUDED.chapter_number,
            order_index = EXCLUDED.order_index
        `, [q.id, q.subject_id, q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number, q.order_index]);
      }

      // Migrasi Quiz Questions
      const questions = sqliteDb.prepare('SELECT * FROM quiz_questions').all();
      console.log(`- Mengimpor ${questions.length} butir soal kuis...`);
      for (const q of questions) {
        await client.query(`
          INSERT INTO quiz_questions (id, quiz_id, question_number, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            difficulty = EXCLUDED.difficulty,
            question_text = EXCLUDED.question_text,
            option_a = EXCLUDED.option_a,
            option_b = EXCLUDED.option_b,
            option_c = EXCLUDED.option_c,
            option_d = EXCLUDED.option_d,
            correct_option = EXCLUDED.correct_option,
            explanation = EXCLUDED.explanation
        `, [q.id, q.quiz_id, q.question_number, q.difficulty || 'Sedang', q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.explanation]);
      }

      // Migrasi Quiz Attempts
      const quizAttempts = sqliteDb.prepare('SELECT * FROM quiz_attempts').all();
      console.log(`- Mengimpor ${quizAttempts.length} riwayat kuis siswa...`);
      for (const qa of quizAttempts) {
        await client.query(`
          INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, correct_answers, answers_json, completed_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [qa.id, qa.user_id, qa.quiz_id, qa.score, qa.total_questions, qa.correct_answers, qa.answers_json, qa.completed_at || new Date()]);
      }

      // Migrasi Games
      const games = sqliteDb.prepare('SELECT * FROM games').all();
      console.log(`- Mengimpor ${games.length} game edukatif...`);
      for (const g of games) {
        await client.query(`
          INSERT INTO games (id, subject_id, name, slug, icon, description, is_active, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            icon = EXCLUDED.icon,
            description = EXCLUDED.description,
            is_active = EXCLUDED.is_active,
            order_index = EXCLUDED.order_index
        `, [g.id, g.subject_id, g.name, g.slug, g.icon, g.description, g.is_active, g.order_index]);
      }

      // Migrasi Game Attempts
      const gameAttempts = sqliteDb.prepare('SELECT * FROM game_attempts').all();
      console.log(`- Mengimpor ${gameAttempts.length} riwayat bermain siswa...`);
      for (const ga of gameAttempts) {
        await client.query(`
          INSERT INTO game_attempts (id, user_id, game_id, score, details_json, completed_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [ga.id, ga.user_id, ga.game_id, ga.score, ga.details_json, ga.completed_at || new Date()]);
      }

      // Migrasi Learning Activities
      const activities = sqliteDb.prepare('SELECT * FROM learning_activities').all();
      console.log(`- Mengimpor ${activities.length} catatan aktivitas belajar...`);
      for (const a of activities) {
        await client.query(`
          INSERT INTO learning_activities (id, user_id, activity_type, title, description, path, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING
        `, [a.id, a.user_id, a.activity_type, a.title, a.description, a.path, a.created_at || new Date()]);
      }

      // Synchronize PostgreSQL ID Sequences
      console.log('\n⚙️ [4/4] Menyesuaikan sequence ID auto-increment PostgreSQL...');
      const tables = [
        'users', 'subjects', 'chapters', 'chapter_progress',
        'quizzes', 'quiz_questions', 'quiz_attempts',
        'games', 'game_attempts', 'learning_activities'
      ];

      for (const t of tables) {
        await client.query(`
          SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE(MAX(id), 1)) FROM ${t}
        `, [t]);
      }
      console.log('✅ Semua sequence ID berhasil disinkronkan.');

    } else {
      console.log('\n🌱 [3/4] Menjalankan seeding materi & kuis bawaan ke Supabase...');
      // Seed subjects
      const subjectsData = [
        { slug: 'matematika', name: 'Matematika', icon: 'Calculator', description: 'Pelajari konsep bilangan, aljabar, perbandingan, dan geometri kelas 7.', color_theme: 'blue', order_index: 1 },
        { slug: 'bahasa-inggris', name: 'Bahasa Inggris', icon: 'Languages', description: 'Tingkatkan kemampuan reading, grammar, vocabulary, dan percakapan dasar.', color_theme: 'sage', order_index: 2 },
        { slug: 'bahasa-indonesia', name: 'Bahasa Indonesia', icon: 'BookOpen', description: 'Pahami teks deskripsi, fantasi, prosedur, dan laporan hasil observasi.', color_theme: 'amber', order_index: 3 },
        { slug: 'ipas', name: 'IPAS', icon: 'Atom', description: 'Eksplorasi sains alam, penyelidikan ilmiah, zat, dan ekosistem sekitar.', color_theme: 'teal', order_index: 4 }
      ];

      for (const s of subjectsData) {
        await client.query(`
          INSERT INTO subjects (slug, name, icon, description, color_theme, order_index)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (slug) DO NOTHING
        `, [s.slug, s.name, s.icon, s.description, s.color_theme, s.order_index]);
      }
    }

    console.log('\n====================================================');
    console.log('🎉 MIGRASI KE SUPABASE SELESAI DENGAN SUKSES!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat migrasi:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
