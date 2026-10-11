import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import {
  Award,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CapaianPage({
  onNavigateMateri,
  onNavigateQuiz,
  onNavigateGame,
  onOpenChapter,
  onStartQuiz
}) {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sumRes, actRes] = await Promise.all([
          fetchApi('/progress/summary'),
          fetchApi('/progress/activities')
        ]);
        setSummary(sumRes);
        setActivities(actRes.activities || []);
      } catch (err) {
        console.error('Failed to load learning achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Memuat capaian pembelajaran...
      </div>
    );
  }

  const hasAnyProgress = summary && (summary.completed_chapters > 0 || summary.total_quizzes > 0 || summary.best_game_score > 0);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Capaian Pembelajaran</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Pantau perkembangan belajar mandirimu, tingkat ketuntasan bab materi, nilai kuis, dan rekor game edukatif.
        </p>
      </div>

      {!hasAnyProgress && (
        <div style={{
          backgroundColor: 'var(--sage-50)',
          border: '1px solid var(--sage-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={22} color="var(--sage-600)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', fontSize: '0.95rem' }}>
                Ayo Mulai Perjalanan Belajarmu!
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--sage-600)' }}>
                Kamu belum menyelesaikan bab atau mengerjakan kuis. Buka materi sekarang untuk melihat capaianmu bertambah.
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onNavigateMateri}>
            <span>Buka Materi</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 4 HIGHLIGHT STAT METRICS (MATERI DIPISAHKAN DARI QUIZ) */}
      <div className="stats-grid">
        {/* Materi Progress */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--sage-100)', color: 'var(--sage-600)' }}>
            <BookOpen size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-num">{summary ? `${summary.overall_percentage}%` : '0%'}</div>
            <div className="stat-label">Ketuntasan Materi</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {summary?.completed_chapters || 0} dari {summary?.total_chapters || 24} bab tuntas
            </div>
          </div>
        </div>

        {/* Bab Selesai */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-num">{summary?.completed_chapters || 0} Bab</div>
            <div className="stat-label">Bab Telah Tuntas</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Disimpan permanen di database
            </div>
          </div>
        </div>

        {/* Kuis & Rata-rata */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--blue-100)', color: 'var(--blue-600)' }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <div className="stat-num">{summary?.avg_quiz_score ? `${summary.avg_quiz_score} pts` : '0 pts'}</div>
            <div className="stat-label">Rata-rata Nilai Kuis</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {summary?.total_quizzes || 0} kali pengerjaan kuis
            </div>
          </div>
        </div>

        {/* Game Skor Terbaik */}
        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--cream-100)', color: 'var(--cream-500)' }}>
            <Gamepad2 size={22} />
          </div>
          <div>
            <div className="stat-num">{summary?.best_game_score ? `${summary.best_game_score} pts` : '0 pts'}</div>
            <div className="stat-label">Skor Game Terbaik</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Tantangan berhitung interaktif
            </div>
          </div>
        </div>
      </div>

      {/* SECTION KHUSUS: CAPAIAN MATEMATIKA SEMESTER 1 (BAB 1, 2, 3) */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sage-700)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <Award size={18} />
              <span>KURIKULUM MERDEKA KELAS VII</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Capaian Khusus Matematika (Semester 1)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Evaluasi ketuntasan 3 bab materi dan hasil kuis pemahaman konsep.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-app)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ketuntasan Modul Matematika</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sage-700)' }}>
              {summary?.math_summary?.completed_chapters || 0} / {summary?.math_summary?.total_chapters || 3} Bab Selesai ({summary?.math_summary?.progress_percentage || 0}%)
            </div>
          </div>
        </div>

        {/* 3 Kartu Bab Matematika Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
          {summary?.math_summary?.chapters?.map((ch) => {
            const isCompleted = ch.status === 'completed';
            const isInProgress = ch.status === 'in_progress';
            // Find quiz matching this chapter
            const associatedQuiz = summary?.math_summary?.quizzes?.find(q => q.chapter_number === ch.chapter_number);

            return (
              <div
                key={ch.id}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-lg)',
                  border: isCompleted ? '2px solid #86EFAC' : isInProgress ? '2px solid #FDE047' : '1px solid var(--border-light)',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem'
                }}
              >
                <div>
                  {/* Status Bab */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      BAB {ch.chapter_number}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-success' : isInProgress ? 'badge-warning' : 'badge-neutral'}`}>
                      {isCompleted ? '✓ Tuntas' : isInProgress ? 'Sedang Dipelajari' : 'Belum Dipelajari'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {ch.title}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {ch.description}
                  </p>

                  {/* Kuis Status Box */}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    padding: '0.85rem 1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-600)' }}>
                        Hasil Quiz Bab {ch.chapter_number}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {associatedQuiz?.attempt_count ? `${associatedQuiz.attempt_count}x dikerjakan` : 'Belum dikerjakan'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nilai Tertinggi</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: associatedQuiz?.highest_score !== null && associatedQuiz?.highest_score !== undefined ? 'var(--blue-700)' : 'var(--text-muted)' }}>
                          {associatedQuiz?.highest_score !== null && associatedQuiz?.highest_score !== undefined ? `${associatedQuiz.highest_score} pts` : '-'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nilai Terakhir</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: associatedQuiz?.latest_score !== null && associatedQuiz?.latest_score !== undefined ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {associatedQuiz?.latest_score !== null && associatedQuiz?.latest_score !== undefined ? `${associatedQuiz.latest_score} pts` : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onOpenChapter && onOpenChapter('matematika', ch.chapter_number)}
                  >
                    <span>Materi Bab</span>
                  </button>
                  {associatedQuiz && (
                    <button
                      className="btn btn-blue btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => onStartQuiz && onStartQuiz(associatedQuiz.id)}
                    >
                      <span>Ikuti Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION KHUSUS: CAPAIAN BAHASA INDONESIA SEMESTER 1 (BAB 1, 2, 3) */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cream-600)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <Award size={18} />
              <span>KURIKULUM MERDEKA KELAS VII</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Capaian Khusus Bahasa Indonesia (Semester 1)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Evaluasi ketuntasan 3 bab materi (Teks Deskripsi, Puisi Rakyat & Fantasi, Teks Prosedur) dan hasil kuis.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-app)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ketuntasan Modul B. Indonesia</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cream-600)' }}>
              {summary?.bahasa_indonesia_summary?.completed_chapters || 0} / {summary?.bahasa_indonesia_summary?.total_chapters || 3} Bab Selesai ({summary?.bahasa_indonesia_summary?.progress_percentage || 0}%)
            </div>
          </div>
        </div>

        {/* 3 Kartu Bab Bahasa Indonesia Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
          {summary?.bahasa_indonesia_summary?.chapters?.map((ch) => {
            const isCompleted = ch.status === 'completed';
            const isInProgress = ch.status === 'in_progress';
            const associatedQuiz = summary?.bahasa_indonesia_summary?.quizzes?.find(q => q.chapter_number === ch.chapter_number);

            return (
              <div
                key={ch.id}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-lg)',
                  border: isCompleted ? '2px solid #86EFAC' : isInProgress ? '2px solid #FDE047' : '1px solid var(--border-light)',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem'
                }}
              >
                <div>
                  {/* Status Bab */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      BAB {ch.chapter_number}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-success' : isInProgress ? 'badge-warning' : 'badge-neutral'}`}>
                      {isCompleted ? '✓ Tuntas' : isInProgress ? 'Sedang Dipelajari' : 'Belum Dipelajari'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {ch.title}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {ch.description}
                  </p>

                  {/* Kuis Status Box */}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    padding: '0.85rem 1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-600)' }}>
                        Hasil Quiz Bab {ch.chapter_number}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {associatedQuiz?.attempt_count ? `${associatedQuiz.attempt_count}x dikerjakan` : 'Belum dikerjakan'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nilai Tertinggi</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: associatedQuiz?.highest_score !== null && associatedQuiz?.highest_score !== undefined ? 'var(--blue-700)' : 'var(--text-muted)' }}>
                          {associatedQuiz?.highest_score !== null && associatedQuiz?.highest_score !== undefined ? `${associatedQuiz.highest_score} pts` : '-'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nilai Terakhir</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: associatedQuiz?.latest_score !== null && associatedQuiz?.latest_score !== undefined ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {associatedQuiz?.latest_score !== null && associatedQuiz?.latest_score !== undefined ? `${associatedQuiz.latest_score} pts` : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onOpenChapter && onOpenChapter('bahasa-indonesia', ch.chapter_number)}
                  >
                    <span>Materi Bab</span>
                  </button>
                  {associatedQuiz && (
                    <button
                      className="btn btn-blue btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => onStartQuiz && onStartQuiz(associatedQuiz.id)}
                    >
                      <span>Ikuti Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: SKOR GAME EDUKATIF */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream-500)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
              <Gamepad2 size={18} />
              <span>PERMAINAN EDUKATIF</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Skor Terbaik Game Matematika
            </h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onNavigateGame}>
            <span>Buka Menu Game</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {summary?.game_high_scores?.map((gm) => (
            <div
              key={gm.id}
              style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{gm.icon || '🎮'}</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {gm.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {gm.play_count > 0 ? `${gm.play_count}x dimainkan` : 'Belum pernah dimainkan'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Skor Tertinggi:</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: gm.highest_score ? 'var(--cream-600)' : 'var(--text-muted)' }}>
                  {gm.highest_score ? `${gm.highest_score} pts` : '0 pts'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRES PER MATA PELAJARAN (MATEMATIKA, BHS INGGRIS, BHS INDONESIA, IPAS) */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Progres Ketuntasan per Mata Pelajaran
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Perhitungan riil berdasarkan bab yang telah kamu pelajari dan tandai tuntas.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {summary?.subjects?.map((sub) => (
            <div key={sub.id} style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {sub.name}
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--sage-700)' }}>
                  {sub.completed_chapters} / {sub.total_chapters} Bab ({sub.progress_percentage}%)
                </span>
              </div>

              <div className="progress-track" style={{ height: '8px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${sub.progress_percentage}%`,
                    backgroundColor: sub.progress_percentage === 100 ? '#16A34A' : 'var(--sage-500)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIWAYAT AKTIVITAS BELAJAR SISWA */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Clock size={20} color="var(--sage-500)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Riwayat Aktivitas Belajar
          </h2>
        </div>

        {activities.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-title">Belum ada riwayat tercatat</div>
            <p className="empty-desc">
              Setiap kali kamu membuka materi, menyelesaikan bab, atau mengerjakan kuis, riwayat belajarmu akan tersimpan di sini.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-light)',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {act.description}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(act.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
