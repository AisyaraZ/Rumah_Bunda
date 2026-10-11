import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import {
  BookOpen,
  HelpCircle,
  Gamepad2,
  TrendingUp,
  CheckCircle,
  FileText,
  Trophy,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function HomePage({ onNavigate, onOpenChapter }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await fetchApi('/progress/summary');
        setSummary(data);
      } catch (err) {
        console.error('Failed to load home summary:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9F6 100%)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sage-600)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Sparkles size={16} />
            <span>Selamat Datang di Portal Pembelajaran</span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Halo, {user?.full_name || 'Siswa'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Ayo lanjutkan perjalanan belajarmu hari ini di kelas VII SMP Rumah Bunda.
          </p>
        </div>

        {/* Continue Learning Action Card */}
        {summary?.continue_learning && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--sage-200)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <span className="badge badge-sage" style={{ marginBottom: '0.25rem' }}>
                Lanjutkan Belajar
              </span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {summary.continue_learning.subject_name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {summary.continue_learning.title}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onOpenChapter(summary.continue_learning.subject_slug, summary.continue_learning.chapter_number)}
            >
              <span>Lanjut</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* TIGA MENU UTAMA: MATERI, QUIZ, GAME */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Pilihan Menu Utama
      </h2>

      <div className="hero-cards-grid">
        {/* A. Kartu Materi */}
        <div className="hero-card hero-card-materi">
          <div>
            <div className="hero-card-icon">
              <BookOpen size={28} />
            </div>
            <h3 className="hero-card-title">Materi Pembelajaran</h3>
            <p className="hero-card-desc">
              Pelajari materi kelas 7 sesuai mata pelajaran: Matematika, Bahasa Inggris, Bahasa Indonesia, dan IPAS.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('materi')}
          >
            <span>Mulai Belajar</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* B. Kartu Quiz */}
        <div className="hero-card hero-card-quiz">
          <div>
            <div className="hero-card-icon">
              <HelpCircle size={28} />
            </div>
            <h3 className="hero-card-title">Quiz & Latihan Soal</h3>
            <p className="hero-card-desc">
              Uji pemahamanmu melalui latihan soal interaktif, penilaian otomatis, dan ulasan pembahasan materi.
            </p>
          </div>
          <button
            className="btn btn-blue"
            onClick={() => onNavigate('quiz')}
          >
            <span>Mulai Quiz</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* C. Kartu Game */}
        <div className="hero-card hero-card-game">
          <div>
            <div className="hero-card-icon">
              <Gamepad2 size={28} />
            </div>
            <h3 className="hero-card-title">Permainan Edukatif</h3>
            <p className="hero-card-desc">
              Belajar sambil bermain melalui tantangan edukatif yang seru untuk mengasah ketangkasan berpikir.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            style={{ backgroundColor: 'var(--cream-200)', color: 'var(--cream-500)' }}
            onClick={() => onNavigate('game')}
          >
            <span>Main Sekarang</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* SOROTAN KHUSUS MATEMATIKA SEMESTER 1 */}
      <div className="card" style={{
        marginBottom: '2rem',
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F4FBF7 100%)',
        border: '1px solid var(--sage-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sage-700)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
              <Sparkles size={15} />
              <span>Modul Utama Semester 1</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Matematika Kelas 7 SMP
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Cakupan materi lengkap Bab 1 (Bilangan Bulat), Bab 2 (Pecahan), dan Bab 3 (Rasio & Skala) beserta quiz dan game edukatif.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onOpenChapter('matematika', 1)}
            >
              <BookOpen size={15} />
              <span>Lanjutkan Belajar Matematika</span>
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('quiz')}
            >
              <HelpCircle size={15} />
              <span>Quiz Matematika</span>
            </button>
          </div>
        </div>

        {/* 4 Indikator Khusus Matematika */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* 1. Progres Matematika */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-200)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Progres Matematika
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sage-700)' }}>
              {summary?.math_summary?.progress_percentage || 0}%
            </div>
            <div className="progress-track" style={{ height: '6px', marginTop: '0.45rem' }}>
              <div
                className="progress-fill"
                style={{ width: `${summary?.math_summary?.progress_percentage || 0}%` }}
              />
            </div>
          </div>

          {/* 2. Jumlah Bab Selesai */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-200)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Bab Selesai
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16A34A' }}>
              {summary?.math_summary?.completed_chapters || 0} / {summary?.math_summary?.total_chapters || 3} Bab
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              {summary?.math_summary?.completed_chapters === 3 ? '🎉 Seluruh Bab Tuntas!' : 'Belajar mandiri bertahap'}
            </div>
          </div>

          {/* 3. Quiz Matematika Terakhir */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Quiz Matematika Terakhir
            </div>
            {summary?.math_summary?.latest_quiz ? (
              <>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--blue-600)' }}>
                  {summary.math_summary.latest_quiz.score} pts
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Bab {summary.math_summary.latest_quiz.chapter_number} ({summary.math_summary.latest_quiz.correct_answers}/{summary.math_summary.latest_quiz.total_questions} Benar)
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Belum Dikerjakan
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  Uji pemahamanmu setelah membaca materi
                </div>
              </>
            )}
          </div>

          {/* 4. Skor Terbaik Game */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-300)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Skor Terbaik Game
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--cream-600)' }}>
              {summary?.best_game_score ? `${summary.best_game_score} pts` : '0 pts'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Tersedia 3 Game Edukatif
            </div>
          </div>
        </div>

        {/* 3 Kartu Bab Matematika dengan Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
          {summary?.math_summary?.chapters?.map((ch) => {
            const isCompleted = ch.status === 'completed';
            const isInProgress = ch.status === 'in_progress';
            return (
              <div
                key={ch.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.15rem',
                  border: isCompleted ? '1.5px solid #86EFAC' : isInProgress ? '1.5px solid #FDE047' : '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Bab {ch.chapter_number}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-success' : isInProgress ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                      {isCompleted ? '✓ Selesai' : isInProgress ? 'Sedang Dipelajari' : 'Belum Dipelajari'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {ch.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ch.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onOpenChapter('matematika', ch.chapter_number)}
                  >
                    <span>{isCompleted ? 'Ulas Bab' : isInProgress ? 'Lanjutkan' : 'Buka Bab'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOROTAN KHUSUS BAHASA INDONESIA SEMESTER 1 */}
      <div className="card" style={{
        marginBottom: '2rem',
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFDF9 100%)',
        border: '1px solid var(--cream-300)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream-600)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
              <Sparkles size={15} />
              <span>Modul Utama Semester 1</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Bahasa Indonesia Kelas 7 SMP
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Cakupan materi lengkap Bab 1 (Teks Deskripsi), Bab 2 (Puisi Rakyat & Cerita Fantasi), dan Bab 3 (Teks Prosedur) beserta kuis dan game edukatif.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: 'var(--cream-200)', color: 'var(--cream-600)' }}
              onClick={() => onOpenChapter('bahasa-indonesia', 1)}
            >
              <BookOpen size={15} />
              <span>Lanjutkan Belajar B. Indonesia</span>
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('quiz')}
            >
              <HelpCircle size={15} />
              <span>Quiz B. Indonesia</span>
            </button>
          </div>
        </div>

        {/* 4 Indikator Khusus Bahasa Indonesia */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* 1. Progres Bahasa Indonesia */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-300)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Progres Bahasa Indonesia
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--cream-600)' }}>
              {summary?.bahasa_indonesia_summary?.progress_percentage || 0}%
            </div>
            <div className="progress-track" style={{ height: '6px', marginTop: '0.45rem' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${summary?.bahasa_indonesia_summary?.progress_percentage || 0}%`,
                  backgroundColor: 'var(--cream-500)'
                }}
              />
            </div>
          </div>

          {/* 2. Jumlah Bab Selesai */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-300)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Bab Selesai
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16A34A' }}>
              {summary?.bahasa_indonesia_summary?.completed_chapters || 0} / {summary?.bahasa_indonesia_summary?.total_chapters || 3} Bab
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              {summary?.bahasa_indonesia_summary?.completed_chapters === 3 ? '🎉 Seluruh Bab Tuntas!' : 'Belajar mandiri bertahap'}
            </div>
          </div>

          {/* 3. Quiz Bahasa Indonesia Terakhir */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Quiz B. Indonesia Terakhir
            </div>
            {summary?.bahasa_indonesia_summary?.latest_quiz ? (
              <>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--blue-600)' }}>
                  {summary.bahasa_indonesia_summary.latest_quiz.score} pts
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Bab {summary.bahasa_indonesia_summary.latest_quiz.chapter_number} ({summary.bahasa_indonesia_summary.latest_quiz.correct_answers}/{summary.bahasa_indonesia_summary.latest_quiz.total_questions} Benar)
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Belum Dikerjakan
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  Tersedia 15 soal berbobot per bab
                </div>
              </>
            )}
          </div>

          {/* 4. Game Bahasa Indonesia */}
          <div style={{ backgroundColor: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-200)' }}>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Game Bahasa Indonesia
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sage-700)' }}>
              3 Game Baru
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Detektif, Imajinasi & Urutan
            </div>
          </div>
        </div>

        {/* 3 Kartu Bab Bahasa Indonesia dengan Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
          {summary?.bahasa_indonesia_summary?.chapters?.map((ch) => {
            const isCompleted = ch.status === 'completed';
            const isInProgress = ch.status === 'in_progress';
            return (
              <div
                key={ch.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.15rem',
                  border: isCompleted ? '1.5px solid #86EFAC' : isInProgress ? '1.5px solid #FDE047' : '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Bab {ch.chapter_number}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-success' : isInProgress ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                      {isCompleted ? '✓ Selesai' : isInProgress ? 'Sedang Dipelajari' : 'Belum Dipelajari'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {ch.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ch.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, backgroundColor: 'var(--cream-100)', color: 'var(--cream-600)' }}
                    onClick={() => onOpenChapter('bahasa-indonesia', ch.chapter_number)}
                  >
                    <span>{isCompleted ? 'Ulas Bab' : isInProgress ? 'Lanjutkan' : 'Buka Bab'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INFORMASI TAMBAHAN PADA HOME (LIVE DARI DATABASE) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
          Ringkasan Progres & Aktivitas Belajar
        </h2>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => onNavigate('capaian')}
        >
          <span>Lihat Selengkapnya</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Stat Metric Cards */}
      <div className="stats-grid">
        {/* Progres Belajar */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--sage-100)', color: 'var(--sage-600)' }}>
            <TrendingUp size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-num">{summary ? `${summary.overall_percentage}%` : '0%'}</div>
            <div className="stat-label">Progres Belajar</div>
            <div className="progress-track" style={{ marginTop: '0.45rem', height: '6px' }}>
              <div className="progress-fill" style={{ width: `${summary?.overall_percentage || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Bab Selesai */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-num">
              {summary ? `${summary.completed_chapters} / ${summary.total_chapters}` : '0 / 24'}
            </div>
            <div className="stat-label">Bab Selesai</div>
          </div>
        </div>

        {/* Kuis Dikerjakan */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--blue-100)', color: 'var(--blue-600)' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-num">{summary ? summary.total_quizzes : 0}</div>
            <div className="stat-label">Kuis Dikerjakan</div>
          </div>
        </div>

        {/* Skor / Capaian Terakhir */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--amber-100)', color: 'var(--amber-500)' }}>
            <Trophy size={22} />
          </div>
          <div>
            <div className="stat-num">
              {summary?.max_quiz_score ? `${summary.max_quiz_score} pts` : summary?.best_game_score ? `${summary.best_game_score} pts` : '-'}
            </div>
            <div className="stat-label">Skor Terbaik</div>
          </div>
        </div>
      </div>

      {/* Riwayat Aktivitas Belajar Terakhir */}
      <div className="card" style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Clock size={18} color="var(--sage-500)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Aktivitas Belajar Terakhir</h3>
        </div>

        {summary?.last_activity ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {summary.last_activity.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {summary.last_activity.description}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {new Date(summary.last_activity.created_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('capaian')}
            >
              Lihat Riwayat
            </button>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <div className="empty-icon-box" style={{ width: '48px', height: '48px' }}>
              <Sparkles size={22} />
            </div>
            <div className="empty-title">Belum ada aktivitas belajar</div>
            <p className="empty-desc">
              Pilih menu Materi di atas untuk mulai membaca bab pelajaran pertamamu!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
