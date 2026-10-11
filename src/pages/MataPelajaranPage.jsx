import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { ChevronRight, ArrowLeft, CheckCircle2, BookOpen, Clock, ArrowRight } from 'lucide-react';

export default function MataPelajaranPage({ subjectSlug, onBack, onOpenChapter, onOpenQuiz, onOpenGame }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi(`/subjects/${subjectSlug}`);
        setData(res);
      } catch (err) {
        console.error('Failed to load subject detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subjectSlug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        Memuat daftar bab...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-title">Mata Pelajaran Tidak Ditemukan</div>
        <button className="btn btn-outline" onClick={onBack} style={{ marginTop: '1rem' }}>
          Kembali ke Daftar Materi
        </button>
      </div>
    );
  }

  const { subject, chapters } = data;

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={13} />
            <span>Selesai</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="badge badge-blue">
            <Clock size={13} />
            <span>Sedang Dipelajari</span>
          </span>
        );
      default:
        return (
          <span className="badge badge-gray">
            <span>Belum Dipelajari</span>
          </span>
        );
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', font: 'inherit' }}>
          <span>Materi</span>
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{subject.name}</span>
      </div>

      {/* Header Info */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {subject.name} – Kelas VII SMP
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
              {subject.description}
            </p>
          </div>

          <button className="btn btn-outline btn-sm" onClick={onBack}>
            <ArrowLeft size={15} />
            <span>Semua Mata Pelajaran</span>
          </button>
        </div>

        {/* Overall progress bar */}
        <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.45rem' }}>
            <span>Progres Penyelesaian Materi</span>
            <span style={{ color: 'var(--sage-700)' }}>
              {subject.completed_chapters} dari {subject.total_chapters} Bab Selesai ({subject.progress_percentage}%)
            </span>
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${subject.progress_percentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Daftar Bab */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
        Daftar Bab Pembelajaran ({chapters.length} Bab)
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {chapters.map((chap) => {
          const isCompleted = chap.status === 'completed';
          const isInProgress = chap.status === 'in_progress';

          return (
            <div
              key={chap.id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem 1.75rem',
                gap: '1rem',
                borderLeft: isCompleted ? '5px solid #16A34A' : isInProgress ? '5px solid var(--blue-500)' : '5px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isCompleted ? '#DCFCE7' : 'var(--sage-100)',
                    color: isCompleted ? '#16A34A' : 'var(--sage-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    flexShrink: 0
                  }}>
                    {chap.chapter_number}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{chap.title}</h3>
                      {renderStatusBadge(chap.status)}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {chap.description || 'Kompetensi pembelajaran kurikulum mandiri kelas 7 SMP.'}
                    </p>
                  </div>
                </div>

                {/* Progress bar per bab */}
                <div style={{ textAlign: 'right', minWidth: '130px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Ketuntasan: <strong>{chap.completion_percentage || 0}%</strong>
                  </div>
                  <div className="progress-track" style={{ width: '130px', height: '6px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${chap.completion_percentage || 0}%`,
                        backgroundColor: isCompleted ? '#16A34A' : 'var(--blue-500)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Pelajari Materi, Kuis, Game */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.85rem'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {chap.quiz && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.8rem', color: 'var(--blue-700)', borderColor: 'var(--blue-200)', backgroundColor: 'var(--blue-50)' }}
                      onClick={() => onOpenQuiz && onOpenQuiz(chap.quiz.id)}
                    >
                      <span>📝 Quiz Bab ({chap.quiz.total_questions} Soal)</span>
                    </button>
                  )}

                  {chap.game && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.8rem', color: 'var(--sage-700)', borderColor: 'var(--sage-200)', backgroundColor: 'var(--sage-50)' }}
                      onClick={() => onOpenGame && onOpenGame(chap.game.slug)}
                    >
                      <span>🎮 Game ({chap.game.name})</span>
                    </button>
                  )}
                </div>

                <button
                  className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  onClick={() => onOpenChapter(subjectSlug, chap.chapter_number)}
                >
                  <span>{isCompleted ? 'Ulas Materi Bab' : isInProgress ? 'Lanjutkan Belajar' : 'Pelajari Materi'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
