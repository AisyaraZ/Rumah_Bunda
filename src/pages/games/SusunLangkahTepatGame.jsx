import React, { useState } from 'react';
import { fetchApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  ListOrdered,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function SusunLangkahTepatGame({ game, onBack }) {
  const { showToast } = useAuth();
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // MISI 1: Menyusun Langkah Salad Buah
  const [saladSteps, setSaladSteps] = useState([
    { id: 4, text: 'Simpanlah di dalam lemari pendingin selama 20 menit sebelum dinikmati.' },
    { id: 1, text: 'Cuci bersih buah apel dan melon di bawah air mengalir, lalu tiriskan.' },
    { id: 3, text: 'Tuangkan saus dressing yogurt dan madu, lalu aduk perlahan hingga merata.' },
    { id: 2, text: 'Potonglah buah berbentuk dadu kecil dan masukkan ke mangkuk saji.' }
  ]);

  // MISI 2: Menyusun Langkah Cuci Tangan WHO
  const [handwashSteps, setHandwashSteps] = useState([
    { id: 3, text: 'Bilas kedua tangan dengan air mengalir sampai bebas busa sabun.' },
    { id: 1, text: 'Basahi kedua telapak tangan dengan air bersih mengalir.' },
    { id: 4, text: 'Keringkan tangan menggunakan tisu bersih atau handuk pribadi.' },
    { id: 2, text: 'Tuang sabun secukupnya, gosok telapak tangan, punggung, dan sela jari.' }
  ]);

  // MISI 3: Mengelompokkan Kalimat (Imperatif vs Deklaratif vs Interogatif)
  const [sentenceAnswers, setSentenceAnswers] = useState({});

  // MISI 4: Verba Aktif-Pasif & Konjungsi Urutan
  const [grammarAnswers, setGrammarAnswers] = useState({});

  // Feedback states
  const [feedback, setFeedback] = useState(null);

  // Move item in list (Intuitive for both mobile and desktop)
  const moveItem = (list, setList, index, direction) => {
    if (isEvaluated) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const updated = [...list];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setList(updated);
  };

  // Evaluate Mission 1 (Salad Steps: Correct order is 1 -> 2 -> 3 -> 4)
  const evaluateMission1 = () => {
    const isCorrect = saladSteps[0].id === 1 && saladSteps[1].id === 2 && saladSteps[2].id === 3 && saladSteps[3].id === 4;
    setIsEvaluated(true);
    if (isCorrect) {
      setScore(prev => prev + 50);
      setFeedback({
        correct: true,
        text: 'Luar biasa! Urutan pembuatan salad buah sempurna (Cuci Buah → Potong Dadu → Tuang Dressing → Dinginkan).'
      });
    } else {
      setFeedback({
        correct: false,
        text: 'Urutan belum tepat. Urutan yang logis: 1. Cuci buah → 2. Potong dadu → 3. Tuangkan dressing → 4. Dinginkan di kulkas.'
      });
    }
  };

  // Evaluate Mission 2 (Handwash Steps: Correct order is 1 -> 2 -> 3 -> 4)
  const evaluateMission2 = () => {
    const isCorrect = handwashSteps[0].id === 1 && handwashSteps[1].id === 2 && handwashSteps[2].id === 3 && handwashSteps[4]?.id === 4 ||
                      (handwashSteps[0].id === 1 && handwashSteps[1].id === 2 && handwashSteps[2].id === 3 && handwashSteps[3].id === 4);
    setIsEvaluated(true);
    if (isCorrect) {
      setScore(prev => prev + 50);
      setFeedback({
        correct: true,
        text: 'Tepat sekali! Protokol cuci tangan higienis (Basahi Tangan → Beri Sabun & Gosok Sela → Bilas Air → Keringkan Tisu).'
      });
    } else {
      setFeedback({
        correct: false,
        text: 'Urutan belum sesuai standar. Urutan yang benar: 1. Basahi tangan → 2. Sabun & gosok sela jari → 3. Bilas air mengalir → 4. Keringkan tisu.'
      });
    }
  };

  // Evaluate Mission 3: Kalimat Classification
  const sentenceQuestions = [
    { id: 'q1', text: '"Potonglah buah apel berukuran dadu kecil!"', correct: 'Imperatif' },
    { id: 'q2', text: '"Salad buah kaya vitamin C yang baik untuk metabolisme tubuh."', correct: 'Deklaratif' },
    { id: 'q3', text: '"Apakah tanganmu sudah dibilas hingga bersih dari busa?"', correct: 'Interogatif' }
  ];

  const evaluateMission3 = () => {
    let correctCount = 0;
    sentenceQuestions.forEach(q => {
      if (sentenceAnswers[q.id] === q.correct) correctCount++;
    });
    setIsEvaluated(true);
    const earned = correctCount * 20;
    setScore(prev => prev + earned);
    setFeedback({
      correct: correctCount === 3,
      text: `Kamu berhasil mengelompokkan ${correctCount} dari 3 kalimat secara tepat! (+${earned} pts)`
    });
  };

  // Evaluate Mission 4: Verba & Konjungsi
  const grammarQuestions = [
    {
      id: 'g1',
      text: '"Kupas buah apel, [ ... ] potonglah berbentuk dadu kecil!" Konjungsi urutan yang paling tepat adalah...',
      options: ['kemudian', 'karena', 'meskipun', 'sebab'],
      correct: 'kemudian'
    },
    {
      id: 'g2',
      text: 'Di antara kata berikut, manakah yang merupakan VERBA PASIF?',
      options: ['mengupas', 'mencuci', 'ditiriskan', 'memotong'],
      correct: 'ditiriskan'
    }
  ];

  const evaluateMission4 = async () => {
    let correctCount = 0;
    grammarQuestions.forEach(q => {
      if (grammarAnswers[q.id] === q.correct) correctCount++;
    });
    const earned = correctCount * 25;
    const totalScore = score + earned;
    setScore(totalScore);
    setIsEvaluated(true);
    setFeedback({
      correct: correctCount === 2,
      text: `Hasil tata bahasa: ${correctCount} dari 2 benar! (+${earned} pts)`
    });

    // Save final score to database
    try {
      if (game && game.id) {
        await fetchApi(`/games/${game.id}/attempt`, {
          method: 'POST',
          body: JSON.stringify({ score: totalScore })
        });
      }
      showToast('Seluruh tantangan teks prosedur tuntas! Skor tersimpan.', 'success');
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  const handleNextMission = () => {
    if (missionIdx < 3) {
      setMissionIdx(prev => prev + 1);
      setIsEvaluated(false);
      setFeedback(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setMissionIdx(0);
    setScore(0);
    setIsEvaluated(false);
    setIsFinished(false);
    setFeedback(null);
    setSaladSteps([
      { id: 4, text: 'Simpanlah di dalam lemari pendingin selama 20 menit sebelum dinikmati.' },
      { id: 1, text: 'Cuci bersih buah apel dan melon di bawah air mengalir, lalu tiriskan.' },
      { id: 3, text: 'Tuangkan saus dressing yogurt dan madu, lalu aduk perlahan hingga merata.' },
      { id: 2, text: 'Potonglah buah berbentuk dadu kecil dan masukkan ke mangkuk saji.' }
    ]);
    setHandwashSteps([
      { id: 3, text: 'Bilas kedua tangan dengan air mengalir sampai bebas busa sabun.' },
      { id: 1, text: 'Basahi kedua telapak tangan dengan air bersih mengalir.' },
      { id: 4, text: 'Keringkan tangan menggunakan tisu bersih atau handuk pribadi.' },
      { id: 2, text: 'Tuang sabun secukupnya, gosok telapak tangan, punggung, dan sela jari.' }
    ]);
    setSentenceAnswers({});
    setGrammarAnswers({});
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          ← Menu Game
        </button>

        <div style={{
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          padding: '0.4rem 0.95rem',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Trophy size={16} />
          <span>Skor Langkah: {score} pts</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Mission Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-success">
              Misi {missionIdx + 1} dari 4
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Topik: Teks Prosedur
            </span>
          </div>

          <div className="progress-track" style={{ height: '6px', marginBottom: '1.75rem' }}>
            <div
              className="progress-fill"
              style={{
                width: `${((missionIdx + 1) / 4) * 100}%`,
                backgroundColor: '#059669'
              }}
            />
          </div>

          {/* MISI 1: SUSUN SALAD BUAH */}
          {missionIdx === 0 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  🥗 Misi 1: Susun Langkah Membuat Salad Buah
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Gunakan tombol panah <strong>Naik (▲)</strong> atau <strong>Turun (▼)</strong> untuk menyusun tahapan membuat salad buah secara runtut dan tepat:
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {saladSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1.25rem',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.925rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {step.text}
                      </span>
                    </div>

                    {!isEvaluated && (
                      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                          disabled={idx === 0}
                          onClick={() => moveItem(saladSteps, setSaladSteps, idx, 'up')}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                          disabled={idx === saladSteps.length - 1}
                          onClick={() => moveItem(saladSteps, setSaladSteps, idx, 'down')}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!isEvaluated ? (
                <button className="btn btn-primary" onClick={evaluateMission1}>
                  <span>Periksa Urutan Langkah</span>
                </button>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: feedback?.correct ? '#ECFDF5' : '#FFFBEB',
                    border: `1px solid ${feedback?.correct ? '#A7F3D0' : '#FDE68A'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ fontWeight: 700, color: feedback?.correct ? '#065F46' : '#B45309', marginBottom: '0.25rem' }}>
                      {feedback?.correct ? '✓ Jawaban Sempurna!' : '⚠ Periksa Kembali'}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feedback?.text}</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleNextMission}>
                    <span>Lanjut ke Misi 2</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MISI 2: SUSUN LANGKAH CUCI TANGAN */}
          {missionIdx === 1 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  🧼 Misi 2: Susun Langkah Mencuci Tangan (Standar WHO)
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Urutkan tahapan mencuci tangan berikut agar higienis dan membunuh kuman penyakit:
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {handwashSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1.25rem',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#E0F2FE',
                        color: '#0369A1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.925rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {step.text}
                      </span>
                    </div>

                    {!isEvaluated && (
                      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                          disabled={idx === 0}
                          onClick={() => moveItem(handwashSteps, setHandwashSteps, idx, 'up')}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                          disabled={idx === handwashSteps.length - 1}
                          onClick={() => moveItem(handwashSteps, setHandwashSteps, idx, 'down')}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!isEvaluated ? (
                <button className="btn btn-primary" onClick={evaluateMission2}>
                  <span>Periksa Urutan Cuci Tangan</span>
                </button>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: feedback?.correct ? '#ECFDF5' : '#FFFBEB',
                    border: `1px solid ${feedback?.correct ? '#A7F3D0' : '#FDE68A'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ fontWeight: 700, color: feedback?.correct ? '#065F46' : '#B45309', marginBottom: '0.25rem' }}>
                      {feedback?.correct ? '✓ Higienis & Tepat!' : '⚠ Periksa Kembali'}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feedback?.text}</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleNextMission}>
                    <span>Lanjut ke Misi 3</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MISI 3: KELOMPOKKAN JENIS KALIMAT */}
          {missionIdx === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  📝 Misi 3: Kelompokkan Jenis Kalimat Prosedur
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Tentukan apakah kalimat di bawah ini tergolong <strong>Imperatif (Perintah)</strong>, <strong>Deklaratif (Pernyataan)</strong>, atau <strong>Interogatif (Pertanyaan)</strong>:
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                {sentenceQuestions.map(item => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.15rem 1.25rem',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      {item.text}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['Imperatif', 'Deklaratif', 'Interogatif'].map(cat => {
                        const isSelected = sentenceAnswers[item.id] === cat;
                        return (
                          <button
                            key={cat}
                            disabled={isEvaluated}
                            onClick={() => setSentenceAnswers(prev => ({ ...prev, [item.id]: cat }))}
                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                          >
                            <span>{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!isEvaluated ? (
                <button
                  className="btn btn-primary"
                  disabled={Object.keys(sentenceAnswers).length < 3}
                  onClick={evaluateMission3}
                >
                  <span>Periksa Pengelompokan Kalimat</span>
                </button>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: feedback?.correct ? '#ECFDF5' : '#FFFBEB',
                    border: `1px solid ${feedback?.correct ? '#A7F3D0' : '#FDE68A'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feedback?.text}</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleNextMission}>
                    <span>Lanjut ke Misi 4</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MISI 4: VERBA AKTIF-PASIF & KONJUNGSI */}
          {missionIdx === 3 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  🔍 Misi 4: Deteksi Kebahasaan Prosedur
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Pilihlah verba pasif dan konjungsi urutan waktu yang paling tepat:
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                {grammarQuestions.map(item => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.15rem 1.25rem',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      {item.text}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {item.options.map(opt => {
                        const isSelected = grammarAnswers[item.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={isEvaluated}
                            onClick={() => setGrammarAnswers(prev => ({ ...prev, [item.id]: opt }))}
                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!isEvaluated ? (
                <button
                  className="btn btn-primary"
                  disabled={Object.keys(grammarAnswers).length < 2}
                  onClick={evaluateMission4}
                >
                  <span>Selesaikan Seluruh Misi</span>
                </button>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: feedback?.correct ? '#ECFDF5' : '#FFFBEB',
                    border: `1px solid ${feedback?.correct ? '#A7F3D0' : '#FDE68A'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feedback?.text}</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleNextMission}>
                    <span>Lihat Hasil Akhir Game</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Final Results */
        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Trophy size={36} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Semua Langkah Tertata Rapih! 📋✨
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Selamat! Kamu telah menguasai tahapan urutan kerja, kalimat imperatif, dan kaidah kebahasaan teks prosedur secara tepat.
          </p>

          <div style={{
            display: 'inline-flex',
            gap: '2rem',
            backgroundColor: 'var(--bg-app)',
            padding: '1.25rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skor Total</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>{score} pts</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Misi Selesai</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A' }}>4 / 4</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={handleRestart}>
              <RotateCcw size={16} />
              <span>Main Lagi</span>
            </button>
            <button className="btn btn-primary" onClick={onBack}>
              <span>Kembali ke Menu Game</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
