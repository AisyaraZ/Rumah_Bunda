import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { HelpCircle, Clock, FileText, CheckCircle2, Award, Play, RotateCcw, Filter } from 'lucide-react';

export default function QuizPage({ onStartQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);

  const filterTabs = [
    { key: 'all', label: 'Semua Mata Pelajaran' },
    { key: 'matematika', label: 'Matematika' },
    { key: 'bahasa-inggris', label: 'Bahasa Inggris' },
    { key: 'bahasa-indonesia', label: 'Bahasa Indonesia' },
    { key: 'ipas', label: 'IPAS' }
  ];

  useEffect(() => {
    async function loadQuizzes() {
      try {
        setLoading(true);
        const data = await fetchApi(`/quizzes?subject=${selectedSubject}`);
        setQuizzes(data.quizzes);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, [selectedSubject]);

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Quiz & Latihan Soal</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Uji pemahaman belajarmu dengan kuis pilihan ganda terstruktur untuk siswa kelas VII SMP.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm ${selectedSubject === tab.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedSubject(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz List or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Memuat daftar kuis...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-box">
            <HelpCircle size={32} />
          </div>
          <div className="empty-title">Belum ada quiz tersedia</div>
          <p className="empty-desc">
            Kuis untuk kategori ini belum ditambahkan oleh pengajar. Silakan cek mata pelajaran lainnya atau kembali nanti.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {quizzes.map((quiz) => {
            const hasAttempted = quiz.attempt_count > 0;

            return (
              <div
                key={quiz.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span className="badge badge-sage">
                      {quiz.subject_name}
                    </span>

                    {hasAttempted ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={13} />
                        <span>Pernah Dikerjakan ({quiz.attempt_count}x)</span>
                      </span>
                    ) : (
                      <span className="badge badge-gray">
                        <span>Belum Dikerjakan</span>
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {quiz.title}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '44px' }}>
                    {quiz.description}
                  </p>

                  {/* Quiz Meta Details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} color="var(--sage-500)" />
                      <span>{quiz.total_questions} Soal</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} color="var(--blue-500)" />
                      <span>{quiz.duration_minutes} Menit</span>
                    </div>

                    {hasAttempted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto', fontWeight: 700, color: 'var(--sage-700)' }}>
                        <Award size={16} color="var(--amber-500)" />
                        <span>Skor: {quiz.latest_score}/100</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className={`btn ${hasAttempted ? 'btn-outline' : 'btn-primary'} btn-block`}
                  onClick={() => onStartQuiz(quiz.id)}
                >
                  {hasAttempted ? (
                    <>
                      <RotateCcw size={16} />
                      <span>Kerjakan Ulang Kuis</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Mulai Quiz</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
