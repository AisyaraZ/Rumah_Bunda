import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import {
  HelpCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trophy,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function QuizRunnerPage({ quizId, onBackToList }) {
  const { showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [started, setStarted] = useState(false);

  // Draft storage key
  const draftKey = `rb_quiz_draft_${quizId}`;

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);
        const res = await fetchApi(`/quizzes/${quizId}`);
        setData(res);

        // Restore saved draft answers if exists
        try {
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            if (parsed && typeof parsed === 'object') {
              setUserAnswers(parsed);
              setStarted(true); // resume right away
            }
          }
        } catch (e) {}
      } catch (err) {
        console.error('Failed to load quiz details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Menyiapkan lembar soal kuis...
      </div>
    );
  }

  if (!data || !data.questions || data.questions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-title">Soal Belum Tersedia</div>
        <button className="btn btn-primary" onClick={onBackToList} style={{ marginTop: '1rem' }}>
          Kembali ke Daftar Kuis
        </button>
      </div>
    );
  }

  const { quiz, questions } = data;
  const currentQuestion = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (optionKey) => {
    setUserAnswers(prev => {
      const updated = {
        ...prev,
        [currentQuestion.id]: optionKey
      };
      // Save draft immediately to localStorage
      try {
        localStorage.setItem(draftKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSubmitQuiz = async () => {
    setShowConfirmSubmit(false);
    try {
      setSubmitting(true);
      const res = await fetchApi(`/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ user_answers: userAnswers })
      });
      setResult(res);
      // Remove draft after successful submission
      try {
        localStorage.removeItem(draftKey);
      } catch (e) {}
      showToast('Kuis berhasil diselesaikan dan dinilai otomatis!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal mengirim jawaban kuis.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Mudah':
        return <span className="badge badge-success">Mudah</span>;
      case 'Sulit':
        return <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>Sulit</span>;
      default:
        return <span className="badge badge-blue">Sedang</span>;
    }
  };

  // INSTRUCTIONS SCREEN BEFORE STARTING
  if (!started && !result) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <button className="btn btn-outline btn-sm" onClick={onBackToList} style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={15} />
          <span>Kembali ke Daftar Kuis</span>
        </button>

        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--blue-100)',
            color: 'var(--blue-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <HelpCircle size={32} />
          </div>

          <span className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
            {quiz.subject_name}
          </span>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.45rem' }}>
            {quiz.title}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            {quiz.description}
          </p>

          {/* Quiz Details Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            marginBottom: '1.75rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sage-700)' }}>{questions.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>JUMLAH SOAL</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--blue-600)' }}>{quiz.duration_minutes} Menit</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DURASI</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16A34A' }}>0 - 100</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RENTANG SKOR</div>
            </div>
          </div>

          {/* Instructions checklist */}
          <div style={{ textAlign: 'left', backgroundColor: 'var(--sage-50)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--sage-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--sage-800)', marginBottom: '0.65rem', fontSize: '0.9rem' }}>
              <Info size={17} />
              <span>Petunjuk Pengerjaan:</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--sage-700)', lineHeight: 1.6 }}>
              <li>Pilihlah satu jawaban yang paling tepat pada opsi A, B, C, atau D.</li>
              <li>Jawaban tersimpan otomatis secara berkala agar tidak hilang jika peramban termuat ulang.</li>
              <li>Kamu dapat berpindah nomor soal secara bebas melalui panel navigasi nomor soal.</li>
              <li>Setelah mengumpulkan jawaban, sistem akan menampilkan skor otomatis dan pembahasan lengkap.</li>
            </ul>
          </div>

          <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)}>
            <span>Mulai Mengerjakan Soal</span>
          </button>
        </div>
      </div>
    );
  }

  // IF QUIZ COMPLETED: SHOW RESULT & REVIEW MODAL / PAGE
  if (result) {
    const isPassing = result.score >= 70;
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isPassing ? '#DCFCE7' : '#FEF3C7',
            color: isPassing ? '#15803D' : '#D97706',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Trophy size={40} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Hasil Evaluasi: {quiz.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {isPassing
              ? 'Selamat! Pemahaman belajarmu pada bab ini sangat memuaskan.'
              : 'Tetap semangat! Pelajari kembali pembahasan di bawah ini untuk memperbaiki pemahamanmu.'}
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '1.25rem 2.5rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            marginBottom: '1.75rem'
          }}>
            <div>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: isPassing ? 'var(--sage-700)' : '#D97706' }}>
                {result.score}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR AKHIR</div>
            </div>

            <div style={{ width: '1px', height: '44px', backgroundColor: 'var(--border-subtle)' }} />

            <div>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#16A34A' }}>
                {result.correct_answers}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>BENAR</div>
            </div>

            <div style={{ width: '1px', height: '44px', backgroundColor: 'var(--border-subtle)' }} />

            <div>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#DC2626' }}>
                {result.total_questions - result.correct_answers}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SALAH</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                setResult(null);
                setUserAnswers({});
                setCurrentIdx(0);
                setStarted(true);
                try { localStorage.removeItem(draftKey); } catch (e) {}
              }}
            >
              <RotateCcw size={16} />
              <span>Kerjakan Ulang Quiz</span>
            </button>
            <button className="btn btn-primary" onClick={onBackToList}>
              <span>Kembali ke Daftar Kuis</span>
            </button>
          </div>
        </div>

        {/* REVIEW DAN PEMBAHASAN LENGKAP */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Pembahasan Soal & Kunci Jawaban Lengkap
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {result.review.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                borderLeft: item.is_correct ? '5px solid #16A34A' : '5px solid #DC2626',
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-sage">Soal Nomor {item.question_number}</span>
                </div>

                {item.is_correct ? (
                  <span className="badge badge-success">
                    <CheckCircle size={13} />
                    <span>Jawaban Benar</span>
                  </span>
                ) : (
                  <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                    <XCircle size={13} />
                    <span>Jawaban Salah</span>
                  </span>
                )}
              </div>

              <p style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                {item.question_text}
              </p>

              {/* Options display */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const isSelected = item.selected_option === opt;
                  const isCorrect = item.correct_option === opt;
                  let bg = 'var(--bg-app)';
                  let border = 'var(--border-light)';
                  let textColor = 'var(--text-primary)';

                  if (isCorrect) {
                    bg = '#DCFCE7';
                    border = '#86EFAC';
                    textColor = '#15803D';
                  } else if (isSelected && !item.is_correct) {
                    bg = '#FEE2E2';
                    border = '#FCA5A5';
                    textColor = '#B91C1C';
                  }

                  return (
                    <div
                      key={opt}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color: textColor,
                        fontSize: '0.9rem',
                        fontWeight: isCorrect || isSelected ? 600 : 400
                      }}
                    >
                      <strong>{opt}.</strong> {item.options[opt]}
                      {isSelected && !isCorrect && <span style={{ fontSize: '0.75rem', marginLeft: '6px' }}>(Jawabanmu)</span>}
                      {isCorrect && <span style={{ fontSize: '0.75rem', marginLeft: '6px' }}>(Kunci Jawaban)</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation box */}
              {item.explanation && (
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--sage-50)',
                  border: '1px solid var(--sage-200)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--sage-800)',
                  lineHeight: 1.55
                }}>
                  💡 <strong>Pembahasan & Langkah Penyelesaian:</strong><br />
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ RUNNER INTERFACE
  return (
    <div>
      {/* Top Runner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button className="btn btn-outline btn-sm" onClick={onBackToList}>
            <ArrowLeft size={14} />
            <span>Keluar dari Kuis</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Terjawab: <strong style={{ color: 'var(--sage-700)' }}>{answeredCount}</strong> dari {questions.length} soal
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowConfirmSubmit(true)}
            disabled={submitting}
          >
            <Send size={14} />
            <span>Selesaikan Quiz</span>
          </button>
        </div>
      </div>

      {/* Question Number Navigation Grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Navigasi Nomor Soal
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Jawaban tersimpan otomatis
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {questions.map((q, idx) => {
            const isAnswered = !!userAnswers[q.id];
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  border: isCurrent ? '2px solid var(--sage-600)' : '1px solid var(--border-subtle)',
                  backgroundColor: isCurrent ? 'var(--sage-100)' : isAnswered ? '#DCFCE7' : 'white',
                  color: isCurrent ? 'var(--sage-700)' : isAnswered ? '#15803D' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {q.question_number}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-sage">
              Soal Nomor {currentQuestion.question_number} dari {questions.length}
            </span>
            {renderDifficultyBadge(currentQuestion.difficulty)}
          </div>
          <span className="badge badge-blue">
            {quiz.title}
          </span>
        </div>

        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '2rem', whiteSpace: 'pre-line' }}>
          {currentQuestion.question_text}
        </p>

        {/* Options A, B, C, D */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[
            { key: 'A', text: currentQuestion.option_a },
            { key: 'B', text: currentQuestion.option_b },
            { key: 'C', text: currentQuestion.option_c },
            { key: 'D', text: currentQuestion.option_d }
          ].map(opt => {
            const isSelected = userAnswers[currentQuestion.id] === opt.key;

            return (
              <div
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--sage-500)' : '1px solid var(--border-light)',
                  backgroundColor: isSelected ? 'var(--sage-50)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'var(--sage-500)' : 'var(--bg-subtle)',
                  color: isSelected ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  {opt.key}
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)' }}>
                  {opt.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons: Previous / Next / Selesaikan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="btn btn-outline"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
        >
          <ChevronLeft size={16} />
          <span>Sebelumnya</span>
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
          >
            <span>Berikutnya</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setShowConfirmSubmit(true)}
          >
            <Send size={16} />
            <span>Selesaikan Quiz</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmSubmit}
        title="Selesaikan & Kumpulkan Jawaban?"
        message={`Anda telah menjawab ${answeredCount} dari ${questions.length} soal. Soal yang belum terjawab tidak akan dihitung sebagai jawaban benar. Apakah Anda yakin ingin menyelesaikan kuis ini?`}
        confirmText="Ya, Selesaikan"
        cancelText="Periksa Kembali"
        onConfirm={handleSubmitQuiz}
        onCancel={() => setShowConfirmSubmit(false)}
      />
    </div>
  );
}
