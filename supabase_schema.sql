-- ============================================================================
-- LMS RUMAH BUNDA - SUPABASE POSTGRESQL SCHEMA & INITIAL DATA
-- Jalankan skrip ini di SQL Editor pada Dashboard Supabase Anda:
-- Dashboard Supabase -> Project -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Tabel Users (Data Pengguna / Siswa)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Subjects (Mata Pelajaran Kelas 7 SMP)
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  color_theme TEXT DEFAULT 'sage',
  order_index INTEGER DEFAULT 0
);

-- 3. Tabel Chapters (Bab Pembelajaran)
CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0
);

-- 4. Tabel Chapter Progress (Progres Belajar Siswa per Bab)
CREATE TABLE IF NOT EXISTS chapter_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'in_progress',
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_chapter UNIQUE(user_id, chapter_id)
);

-- 5. Tabel Quizzes (Daftar Kuis)
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 15,
  total_questions INTEGER DEFAULT 5,
  chapter_number INTEGER DEFAULT NULL,
  order_index INTEGER DEFAULT 0
);

-- 6. Tabel Quiz Questions (Bank Soal Pilihan Ganda)
CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  difficulty TEXT DEFAULT 'Sedang',
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  explanation TEXT DEFAULT ''
);

-- 7. Tabel Quiz Attempts (Riwayat Pengerjaan Kuis)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers_json TEXT,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Games (Permainan Edukatif)
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0
);

-- 9. Tabel Game Attempts (Riwayat Skor Game)
CREATE TABLE IF NOT EXISTS game_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  details_json TEXT,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabel Learning Activities (Riwayat Aktivitas Belajar)
CREATE TABLE IF NOT EXISTS learning_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  path TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk optimasi query
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user ON chapter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_game_attempts_user ON game_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON learning_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);

-- ============================================================================
-- Selesai pembuatan tabel dasar.
-- Catatan: Untuk memasukkan seluruh materi kurikulum lengkap & memindahkan data
-- siswa dari database lama, jalankan perintah berikut di terminal:
-- npm run migrate:supabase
-- ============================================================================
