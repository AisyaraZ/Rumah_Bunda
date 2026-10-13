const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Deteksi apakah connection string Supabase / PostgreSQL tersedia
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL;
const isPostgres = Boolean(connectionString);

let db = null;
let pool = null;

// Helper: Normalisasi parameter (array atau spread) & konversi undefined ke null
function normalizeParams(params) {
  let list = params;
  if (params.length === 1 && Array.isArray(params[0])) {
    list = params[0];
  }
  return list.map(v => (v === undefined ? null : v));
}

// Helper: Konversi placeholder SQL dari SQLite (?) ke PostgreSQL ($1, $2, ...)
function toPgSql(sql) {
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
}

if (isPostgres) {
  console.log('🔗 [Database] Terhubung ke Cloud Database PostgreSQL (Supabase).');
  const { Pool, types } = require('pg');

  // Parse COUNT / BIGINT (type OID 20) sebagai integer JavaScript
  types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)));
  // Parse NUMERIC / AVG (type OID 1700) sebagai float JavaScript
  types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  db = {
    isPostgres: true,
    pool,
    prepare(sql) {
      return {
        async get(...params) {
          const p = normalizeParams(params);
          const pgSql = toPgSql(sql);
          const res = await pool.query(pgSql, p);
          return res.rows[0] || null;
        },
        async all(...params) {
          const p = normalizeParams(params);
          const pgSql = toPgSql(sql);
          const res = await pool.query(pgSql, p);
          return res.rows;
        },
        async run(...params) {
          const p = normalizeParams(params);
          let queryText = sql;
          const isInsert = /^\s*INSERT\s+INTO/i.test(queryText);
          if (isInsert && !/RETURNING/i.test(queryText)) {
            queryText += ' RETURNING id';
          }
          const pgSql = toPgSql(queryText);
          const res = await pool.query(pgSql, p);
          return {
            lastInsertRowid: res.rows[0]?.id || null,
            changes: res.rowCount
          };
        }
      };
    },
    async query(sql, params = []) {
      const p = normalizeParams(params);
      const pgSql = toPgSql(sql);
      return pool.query(pgSql, p);
    },
    async exec(sql) {
      return pool.query(sql);
    }
  };
} else {
  // Mode Fallback Lokal: SQLite
  console.log('📂 [Database] Menjalankan database lokal SQLite.');
  const Database = require('better-sqlite3');

  let dbPath;
  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'lms_rumah_bunda.db');
    const sourceDbPath = path.join(__dirname, '..', 'data', 'lms_rumah_bunda.db');
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      } catch (err) {
        console.warn('Could not copy initial db to /tmp:', err);
      }
    }
    dbPath = tmpDbPath;
  } else {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = path.join(dataDir, 'lms_rumah_bunda.db');
  }

  const sqliteInstance = new Database(dbPath);
  sqliteInstance.pragma('foreign_keys = ON');

  db = {
    isPostgres: false,
    sqlite: sqliteInstance,
    prepare(sql) {
      const stmt = sqliteInstance.prepare(sql);
      return {
        async get(...params) {
          const p = normalizeParams(params);
          return stmt.get(...p) || null;
        },
        async all(...params) {
          const p = normalizeParams(params);
          return stmt.all(...p);
        },
        async run(...params) {
          const p = normalizeParams(params);
          return stmt.run(...p);
        }
      };
    },
    async query(sql, params = []) {
      const p = normalizeParams(params);
      const stmt = sqliteInstance.prepare(sql);
      return stmt.all(...p);
    },
    async exec(sql) {
      return sqliteInstance.exec(sql);
    }
  };
}

// Inisialisasi Skema Database
async function initDatabase() {
  if (isPostgres) {
    // Pada PostgreSQL / Supabase, skema dikelola melalui supabase_schema.sql
    // Cek apakah tabel subjects sudah terisi
    try {
      const check = await db.prepare('SELECT COUNT(*) as count FROM subjects').get();
      if (!check || check.count === 0) {
        console.log('ℹ️ Tabel di Supabase kosong. Menjalankan auto-seeding awal...');
        const subjectsData = [
          { slug: 'matematika', name: 'Matematika', icon: 'Calculator', description: 'Pelajari konsep bilangan, aljabar, perbandingan, dan geometri kelas 7.', color_theme: 'blue', order_index: 1 },
          { slug: 'bahasa-inggris', name: 'Bahasa Inggris', icon: 'Languages', description: 'Tingkatkan kemampuan reading, grammar, vocabulary, dan percakapan dasar.', color_theme: 'sage', order_index: 2 },
          { slug: 'bahasa-indonesia', name: 'Bahasa Indonesia', icon: 'BookOpen', description: 'Pahami teks deskripsi, fantasi, prosedur, dan laporan hasil observasi.', color_theme: 'amber', order_index: 3 },
          { slug: 'ipas', name: 'IPAS', icon: 'Atom', description: 'Eksplorasi sains alam, penyelidikan ilmiah, zat, dan ekosistem sekitar.', color_theme: 'teal', order_index: 4 }
        ];

        for (const s of subjectsData) {
          await db.prepare(`
            INSERT INTO subjects (slug, name, icon, description, color_theme, order_index)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(s.slug, s.name, s.icon, s.description, s.color_theme, s.order_index);
        }
      }
    } catch (err) {
      console.warn('ℹ️ Catatan Supabase: Pastikan supabase_schema.sql telah dijalankan di SQL Editor Supabase jika tabel belum terbentuk.');
    }
  } else {
    // Inisialisasi SQLite Schema
    db.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        class_grade TEXT DEFAULT 'VII SMP',
        avatar TEXT DEFAULT 'student-1',
        bio TEXT DEFAULT 'Siswa kelas VII SMP di Rumah Bunda',
        school_name TEXT DEFAULT 'SMP Negeri 1 Rumah Bunda',
        education_level TEXT DEFAULT 'Sekolah Menengah Pertama (SMP)',
        notification_pref TEXT DEFAULT '{"reminder":true,"quiz":true,"announcement":true}',
        theme_pref TEXT DEFAULT 'sage',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        color_theme TEXT DEFAULT 'sage',
        order_index INTEGER DEFAULT 0
      );

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

      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        duration_minutes INTEGER DEFAULT 15,
        total_questions INTEGER DEFAULT 5,
        chapter_number INTEGER DEFAULT NULL,
        order_index INTEGER DEFAULT 0,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question_number INTEGER NOT NULL,
        difficulty TEXT DEFAULT 'Sedang',
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        explanation TEXT DEFAULT '',
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      );

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
  }
}

// Inisialisasi awal saat pertama kali dimuat
initDatabase().catch(err => console.error('Database init warning:', err));

module.exports = {
  db,
  initDatabase,
  isPostgres
};
