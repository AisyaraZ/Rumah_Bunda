import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { useAuth } from '../context/AuthContext';
import MathContentRenderer from '../components/MathContentRenderer';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  Image,
  Paperclip,
  Sparkles,
  ArrowLeft,
  List,
  HelpCircle,
  BookOpen,
  Award,
  Play,
  Gamepad2,
  Trophy,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

export default function DetailBabPage({
  subjectSlug,
  chapterNumber,
  onBackToSubject,
  onNavigateChapter,
  onGoHome,
  onGoMateri,
  onOpenQuiz,
  onOpenGame
}) {
  const { showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeSubchapterIdx, setActiveSubchapterIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'kuis' | 'game' | 'hasil'
  const [showSubchapterDrawer, setShowSubchapterDrawer] = useState(false);

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        const res = await fetchApi(`/subjects/${subjectSlug}/chapters/${chapterNumber}`);
        setData(res);
        setActiveSubchapterIdx(0);
        setActiveTab('materi');
        setShowSubchapterDrawer(false);
      } catch (err) {
        console.error('Failed to load chapter detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChapter();
  }, [subjectSlug, chapterNumber]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        Memuat modul pembelajaran...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-title">Bab Tidak Ditemukan</div>
        <button className="btn btn-primary" onClick={onBackToSubject} style={{ marginTop: '1rem' }}>
          Kembali ke Mata Pelajaran
        </button>
      </div>
    );
  }

  const { subject, chapter, progress, prevChapter, nextChapter, associatedQuiz, associatedGame } = data;
  const isCompleted = progress?.status === 'completed';
  const hasSubchapters = Array.isArray(chapter.subchapters) && chapter.subchapters.length > 0;
  const activeSub = hasSubchapters ? chapter.subchapters[activeSubchapterIdx] : null;

  const handleToggleComplete = async () => {
    try {
      setUpdating(true);
      const newStatus = isCompleted ? 'in_progress' : 'completed';
      const res = await fetchApi(`/subjects/chapters/${chapter.id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus })
      });

      setData(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          status: res.status,
          completed_at: res.completed_at
        }
      }));

      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message || 'Gagal mengubah status bab.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectSubchapter = (idx) => {
    setActiveSubchapterIdx(idx);
    setShowSubchapterDrawer(false);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Progress percentage calculation
  const totalSub = hasSubchapters ? chapter.subchapters.length : 1;
  const progressPct = Math.round(((activeSubchapterIdx + 1) / totalSub) * 100);

  return (
    <div className="module-reading-container">
      {/* Breadcrumb Navigation: Home → Materi → Mata Pelajaran → Bab */}
      <div className="breadcrumb">
        <button onClick={onGoHome} className="breadcrumb-btn">
          Home
        </button>
        <span className="breadcrumb-separator">/</span>
        <button onClick={onGoMateri} className="breadcrumb-btn">
          Materi
        </button>
        <span className="breadcrumb-separator">/</span>
        <button onClick={onBackToSubject} className="breadcrumb-btn">
          {subject.name}
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{chapter.title}</span>
      </div>

      {/* Chapter Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
              <span className="badge badge-sage">{subject.name} – Bab {chapter.chapter_number}</span>
              {isCompleted ? (
                <span className="badge badge-success">
                  <CheckCircle size={13} />
                  <span>Selesai Dipelajari</span>
                </span>
              ) : (
                <span className="badge badge-blue">
                  <Clock size={13} />
                  <span>Sedang Dipelajari</span>
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              {chapter.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: 0, fontSize: '0.95rem', lineHeight: 1.55 }}>
              {chapter.description || 'Kompetensi pembelajaran kurikulum mandiri kelas 7 SMP Rumah Bunda.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
              onClick={handleToggleComplete}
              disabled={updating}
            >
              <CheckCircle size={18} />
              <span>{updating ? 'Menyimpan...' : isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 TAB UTAMA BAB: MATERI, KUIS, GAME, HASIL BELAJAR */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--border-light)',
        paddingBottom: '0.35rem',
        overflowX: 'auto'
      }}>
        <button
          className={`btn btn-sm ${activeTab === 'materi' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('materi')}
        >
          <BookOpen size={15} />
          <span>Materi Pembelajaran</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'kuis' ? 'btn-blue' : 'btn-outline'}`}
          onClick={() => setActiveTab('kuis')}
        >
          <HelpCircle size={15} />
          <span>Kuis Bab {associatedQuiz ? `(${associatedQuiz.total_questions} Soal)` : ''}</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'game' ? 'btn-secondary' : 'btn-outline'}`}
          style={activeTab === 'game' ? { backgroundColor: 'var(--cream-200)', color: 'var(--cream-600)', borderColor: 'var(--cream-300)' } : {}}
          onClick={() => setActiveTab('game')}
        >
          <Gamepad2 size={15} />
          <span>Game Edukatif</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'hasil' ? 'btn-primary' : 'btn-outline'}`}
          style={activeTab === 'hasil' ? { backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#86EFAC' } : {}}
          onClick={() => setActiveTab('hasil')}
        >
          <Award size={15} />
          <span>Hasil Belajar</span>
        </button>
      </div>

      {/* TAB 1: MATERI PEMBELAJARAN */}
      {activeTab === 'materi' && (
        <>
          {hasSubchapters ? (
            <div>
              {/* SUBCHAPTER TOP STEPPER & PROGRESS BAR */}
              <div className="subchapter-stepper-card">
                <div className="stepper-top-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-sage">
                      Subbab {activeSubchapterIdx + 1} dari {chapter.subchapters.length}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {progressPct}% Progres Modul
                    </span>
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowSubchapterDrawer(!showSubchapterDrawer)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {showSubchapterDrawer ? <X size={15} /> : <List size={15} />}
                    <span>{showSubchapterDrawer ? 'Tutup Daftar' : `Daftar Subbab (${chapter.subchapters.length})`}</span>
                  </button>
                </div>

                {/* Progress bar line */}
                <div className="stepper-progress-bar-track">
                  <div
                    className="stepper-progress-bar-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Stepper pills row */}
                <div className="subchapter-stepper-row">
                  {chapter.subchapters.map((sub, idx) => {
                    const isActive = idx === activeSubchapterIdx;
                    const cleanTitle = sub.title.replace(/^\d+[\.\)]\s*/, '');
                    return (
                      <button
                        key={sub.id}
                        className={`stepper-pill ${isActive ? 'active' : ''}`}
                        onClick={() => handleSelectSubchapter(idx)}
                        title={sub.title}
                      >
                        <span className="stepper-pill-num">{idx + 1}</span>
                        <span className="stepper-pill-title">{cleanTitle}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Collapsible Subchapter Grid Drawer */}
                {showSubchapterDrawer && (
                  <div className="subchapter-index-drawer">
                    {chapter.subchapters.map((sub, idx) => {
                      const isActive = idx === activeSubchapterIdx;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubchapter(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isActive ? '1px solid var(--sage-500)' : '1px solid var(--border-light)',
                            backgroundColor: isActive ? 'var(--sage-100)' : 'white',
                            color: isActive ? 'var(--sage-800)' : 'var(--text-primary)',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            gap: '0.65rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: isActive ? 'var(--sage-600)' : 'var(--sage-100)',
                            color: isActive ? 'white' : 'var(--sage-700)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {idx + 1}
                          </span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sub.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MAIN READING LESSON CARD */}
              <div className="lesson-reading-card">
                {/* Lesson Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '0.85rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-sage">
                      Subbab {activeSubchapterIdx + 1} dari {chapter.subchapters.length}
                    </span>
                    <span className="badge badge-blue">
                      {subject.name} Kelas VII
                    </span>
                  </div>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Modul Belajar Digital Mandiri
                  </span>
                </div>

                <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.35 }}>
                  {activeSub.title}
                </h2>

                {/* Render Rich Math & Module Content */}
                <MathContentRenderer
                  content={activeSub.content}
                  practiceAnswers={activeSub.practiceAnswers}
                />

                {/* Subchapter Navigation Bar (Prev / Next Subchapter) */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '3rem',
                  paddingTop: '1.75rem',
                  borderTop: '1px solid var(--border-light)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={activeSubchapterIdx === 0}
                    onClick={() => {
                      setActiveSubchapterIdx(prev => Math.max(0, prev - 1));
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Subbab Sebelumnya</span>
                  </button>

                  <button
                    className={`btn btn-sm ${isCompleted ? 'btn-outline' : 'btn-secondary'}`}
                    onClick={handleToggleComplete}
                    disabled={updating}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <CheckCircle size={15} />
                    <span>{isCompleted ? '✓ Sudah Ditandai Selesai' : 'Tandai Bab Selesai'}</span>
                  </button>

                  {activeSubchapterIdx < chapter.subchapters.length - 1 ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setActiveSubchapterIdx(prev => Math.min(chapter.subchapters.length - 1, prev + 1));
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                    >
                      <span>Lanjut ke Subbab Berikutnya</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-blue btn-sm"
                      onClick={() => setActiveTab('kuis')}
                    >
                      <HelpCircle size={16} />
                      <span>Selesai &amp; Buka Kuis Bab</span>
                    </button>
                  )}
                </div>
              </div>

              {/* POST-READING EVALUATION CARDS (QUIZ & GAME) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: associatedQuiz && associatedGame ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {associatedQuiz && (
                  <div className="card" style={{
                    backgroundColor: 'var(--blue-50)',
                    borderColor: 'var(--blue-200)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-600)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                        <HelpCircle size={17} />
                        <span>Uji Pemahaman Belajarmu</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {associatedQuiz.title}
                      </h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Tersedia {associatedQuiz.total_questions} soal pilihan ganda berbobot.
                      </p>
                    </div>

                    <button
                      className="btn btn-blue btn-sm"
                      onClick={() => onOpenQuiz ? onOpenQuiz(associatedQuiz.id) : setActiveTab('kuis')}
                    >
                      <Play size={14} />
                      <span>Mulai Quiz</span>
                    </button>
                  </div>
                )}

                {associatedGame && (
                  <div className="card" style={{
                    backgroundColor: 'var(--cream-50)',
                    borderColor: 'var(--cream-300)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream-600)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                        <Gamepad2 size={17} />
                        <span>Tantangan Game Edukatif</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {associatedGame.name}
                      </h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Asah pemahaman konsep sambil bermain interaktif.
                      </p>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ backgroundColor: 'var(--cream-200)', color: 'var(--cream-600)' }}
                      onClick={() => onOpenGame ? onOpenGame(associatedGame.slug) : setActiveTab('game')}
                    >
                      <Play size={14} />
                      <span>Main Game</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--sage-100)',
                color: 'var(--sage-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Materi sedang dipersiapkan
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                Ruang belajar ini sedang dilengkapi modul pembelajaran.
              </p>
            </div>
          )}
        </>
      )}

      {/* TAB 2: KUIS BAB */}
      {activeTab === 'kuis' && (
        <div className="card" style={{ padding: '2rem' }}>
          {associatedQuiz ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
                    Evaluasi Pemahaman Bab {chapter.chapter_number}
                  </span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {associatedQuiz.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', margin: 0 }}>
                    {associatedQuiz.description || 'Kuis pilihan ganda berbobot untuk menguji ketuntasan konsep materi.'}
                  </p>
                </div>

                <button
                  className="btn btn-blue"
                  onClick={() => onOpenQuiz && onOpenQuiz(associatedQuiz.id)}
                >
                  <Play size={16} />
                  <span>{associatedQuiz.attempt_count > 0 ? 'Kerjakan Ulang Quiz' : 'Mulai Quiz Sekarang'}</span>
                </button>
              </div>

              {/* Rincian Kuis */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Jumlah Soal</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {associatedQuiz.total_questions} Soal
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Pilihan Ganda (A, B, C, D)</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Alokasi Waktu</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {associatedQuiz.duration_minutes || 25} Menit
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Waktu ideal belajar mandiri</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nilai Tertinggi</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: associatedQuiz.highest_score !== null ? 'var(--blue-700)' : 'var(--text-muted)' }}>
                    {associatedQuiz.highest_score !== null ? `${associatedQuiz.highest_score} pts` : '-'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {associatedQuiz.attempt_count > 0 ? `${associatedQuiz.attempt_count}x dikerjakan` : 'Belum dikerjakan'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nilai Terakhir</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: associatedQuiz.latest_score !== null ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {associatedQuiz.latest_score !== null ? `${associatedQuiz.latest_score} pts` : '-'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Hasil percobaan terakhir</div>
                </div>
              </div>

              {/* Petunjuk Pengerjaan */}
              <div style={{ backgroundColor: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--blue-800)', marginBottom: '0.4rem' }}>
                  📌 Petunjuk Pengerjaan Kuis:
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                  <li>Kuis terdiri atas 10-15 soal pilihan ganda berbobot (Mudah, Sedang, Sulit).</li>
                  <li>Jawaban disimpan otomatis sebagai draft; kuis tidak akan hilang bila halaman dimuat ulang.</li>
                  <li>Penilaian otomatis menggunakan rumus: <strong>Nilai = (Jawaban Benar ÷ Total Soal) × 100</strong>.</li>
                  <li>Setelah mengumpulkan kuis, kamu dapat meninjau pembahasan lengkap untuk setiap nomor soal.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <HelpCircle size={36} color="var(--text-muted)" />
              <div className="empty-title" style={{ marginTop: '0.75rem' }}>Kuis Belum Tersedia untuk Bab Ini</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GAME EDUKATIF */}
      {activeTab === 'game' && (
        <div className="card" style={{ padding: '2rem' }}>
          {associatedGame ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--cream-100)',
                    color: 'var(--cream-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Gamepad2 size={32} />
                  </div>
                  <div>
                    <span className="badge badge-amber" style={{ marginBottom: '0.3rem' }}>
                      Permainan Edukatif Bab {chapter.chapter_number}
                    </span>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {associatedGame.name}
                    </h2>
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ backgroundColor: 'var(--cream-200)', color: 'var(--cream-600)' }}
                  onClick={() => onOpenGame && onOpenGame(associatedGame.slug)}
                >
                  <Play size={16} />
                  <span>Mainkan Game Sekarang</span>
                </button>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {associatedGame.description}
              </p>

              {/* Statistik Rekor Game */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream-600)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <Trophy size={16} />
                    <span>Skor Tertinggi Siswa</span>
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: associatedGame.highest_score ? 'var(--cream-600)' : 'var(--text-muted)' }}>
                    {associatedGame.highest_score ? `${associatedGame.highest_score} pts` : '0 pts'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Tersimpan permanen di database
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sage-700)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <RotateCcw size={16} />
                    <span>Frekuensi Bermain</span>
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {associatedGame.play_count || 0} kali
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {associatedGame.play_count > 0 ? 'Terus asah ketangkasanmu!' : 'Belum pernah dimainkan'}
                  </div>
                </div>
              </div>

              {/* Panduan Tantangan Game */}
              <div style={{ backgroundColor: '#FDFBF7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#B45309', marginBottom: '0.35rem' }}>
                  🎯 Mekanisme Permainan:
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Setiap jawaban benar akan menambah poin dan kombo streak bonus. Jika menjawab keliru, sistem akan memberikan petunjuk penjelasan edukatif untuk membantumu memahami materi secara mendalam.
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <Gamepad2 size={36} color="var(--text-muted)" />
              <div className="empty-title" style={{ marginTop: '0.75rem' }}>Game Belum Tersedia untuk Bab Ini</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HASIL BELAJAR */}
      {activeTab === 'hasil' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
              Laporan Capaian Bab {chapter.chapter_number}
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Ringkasan Capaian: {chapter.title}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Status Materi */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>Status Ketuntasan Materi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {isCompleted ? (
                  <span className="badge badge-success">✓ Selesai Dipelajari</span>
                ) : (
                  <span className="badge badge-blue">Sedang Dipelajari</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isCompleted ? 'Kamu telah menandai materi bab ini tuntas.' : 'Selesaikan seluruh subbab dan tandai selesai.'}
              </div>
            </div>

            {/* Skor Kuis */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>Penguasaan Konsep (Quiz)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: associatedQuiz?.highest_score !== null ? 'var(--blue-700)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {associatedQuiz?.highest_score !== null ? `${associatedQuiz.highest_score} pts` : '-'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {associatedQuiz?.attempt_count ? `${associatedQuiz.attempt_count}x percobaan kuis` : 'Belum mengerjakan kuis'}
              </div>
            </div>

            {/* Skor Game */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>Rekor Game Edukatif</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: associatedGame?.highest_score ? 'var(--cream-600)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {associatedGame?.highest_score ? `${associatedGame.highest_score} pts` : '0 pts'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {associatedGame?.play_count ? `${associatedGame.play_count}x memainkan game` : 'Belum mencoba game'}
              </div>
            </div>
          </div>

          {/* Saran Belajar Guru */}
          <div style={{ backgroundColor: 'var(--sage-50)', border: '1px solid var(--sage-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--sage-800)', marginBottom: '0.35rem' }}>
              💡 Rekomendasi Belajar Mandiri:
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--sage-700)', margin: 0, lineHeight: 1.5 }}>
              {isCompleted && associatedQuiz?.highest_score >= 80 ? (
                'Hebat! Kamu telah menguasai kompetensi bab ini dengan sangat baik. Pertahankan prestasimu dan lanjutkan ke bab berikutnya!'
              ) : isCompleted ? (
                'Materi telah dibaca, namun nilai kuis masih dapat ditingkatkan. Coba pelajari kembali subbab terkait dan kerjakan ulang kuis untuk mencapai nilai maksimal.'
              ) : (
                'Baca materi setiap subbab secara berurutan, selesaikan latihan mandiri, lalu uji pemahamanmu melalui kuis bab.'
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {associatedQuiz && (
              <button className="btn btn-blue btn-sm" onClick={() => onOpenQuiz && onOpenQuiz(associatedQuiz.id)}>
                <HelpCircle size={15} />
                <span>Ulangi Kuis Bab Ini</span>
              </button>
            )}

            {associatedGame && (
              <button className="btn btn-outline btn-sm" onClick={() => onOpenGame && onOpenGame(associatedGame.slug)}>
                <Gamepad2 size={15} />
                <span>Tingkatkan Skor Game</span>
              </button>
            )}

            {nextChapter && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigateChapter(subjectSlug, nextChapter.chapter_number)}
              >
                <span>Lanjut ke Bab {nextChapter.chapter_number}</span>
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Between Chapters (Prev / Next Chapter) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
        {prevChapter ? (
          <button
            className="btn btn-outline"
            onClick={() => onNavigateChapter(subjectSlug, prevChapter.chapter_number)}
          >
            <ChevronLeft size={18} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bab Sebelumnya</div>
              <div style={{ fontWeight: 600 }}>Bab {prevChapter.chapter_number}: {prevChapter.title}</div>
            </div>
          </button>
        ) : (
          <button className="btn btn-outline" onClick={onBackToSubject}>
            <ArrowLeft size={16} />
            <span>Daftar Bab {subject.name}</span>
          </button>
        )}

        {nextChapter ? (
          <button
            className="btn btn-outline"
            onClick={() => onNavigateChapter(subjectSlug, nextChapter.chapter_number)}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bab Berikutnya</div>
              <div style={{ fontWeight: 600 }}>Bab {nextChapter.chapter_number}: {nextChapter.title}</div>
            </div>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onBackToSubject}>
            <span>Selesai Seluruh Bab {subject.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}
