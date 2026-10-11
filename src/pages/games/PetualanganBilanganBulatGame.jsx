import React, { useState } from 'react';
import { fetchApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Trophy,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function PetualanganBilanganBulatGame({ game, onBack }) {
  const { showToast } = useAuth();
  const [level, setLevel] = useState(1); // 1 = Mudah, 2 = Sedang, 3 = Sulit
  const [stepIdx, setStepIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeHint, setActiveHint] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState(game?.highest_score || 0);
  const [needsReviewTopics, setNeedsReviewTopics] = useState(new Set());

  // 3 Levels of curated adventure stages for Bilangan Bulat
  const stages = [
    // Level 1: Mudah (Dasar Bilangan Negatif & Nilai Mutlak)
    {
      level: 1,
      levelTitle: 'Level 1: Lembah Es (Konsep Dasar & Nilai Mutlak)',
      questions: [
        {
          id: 'l1-1',
          topic: 'Nilai Mutlak',
          prompt: 'Suhu di dalam gua es adalah -15°C. Berapakah nilai mutlak dari suhu tersebut, |-15|?',
          options: ['-15', '15', '0', '30'],
          answer: '15',
          hint: 'Nilai mutlak menyatakan jarak dari 0 sehingga nilainya tidak pernah negatif.'
        },
        {
          id: 'l1-2',
          topic: 'Penjumlahan Bilangan Bulat',
          prompt: 'Pahlawan melangkah maju 8 meter, lalu mundur sejauh 14 meter. Di manakah posisinya sekarang dari titik awal?',
          options: ['-6 meter', '+6 meter', '-22 meter', '+22 meter'],
          answer: '-6 meter',
          hint: 'Maju dinyatakan (+8) dan mundur dinyatakan (-14). Hitung 8 + (-14).'
        },
        {
          id: 'l1-3',
          topic: 'Membandingkan Bilangan',
          prompt: 'Pilihlah bilangan bulat yang nilainya PALING KECIL di antara pilihan berikut:',
          options: ['-25', '-12', '0', '-2'],
          answer: '-25',
          hint: 'Pada bilangan negatif, bilangan dengan angka mutlak terbesar letaknya paling kiri di garis bilangan, jadi nilainya paling kecil.'
        }
      ]
    },
    // Level 2: Sedang (Operasi Campuran & Sifat Operasi)
    {
      level: 2,
      levelTitle: 'Level 2: Hutan Algoritma (Operasi Campuran & Sifat Hitung)',
      questions: [
        {
          id: 'l2-1',
          topic: 'Operasi Campuran',
          prompt: 'Selesaikan teka-teki pintu gerbang: 20 - (-4) × 5 + (-16) ÷ 4 = ?',
          options: ['36', '26', '40', '-16'],
          answer: '36',
          hint: 'Kerjakan perkalian (-4) × 5 = -20 dan pembagian (-16) ÷ 4 = -4 dulu. Lalu 20 - (-20) + (-4) = 40 - 4 = 36.'
        },
        {
          id: 'l2-2',
          topic: 'Sifat Distributif',
          prompt: 'Bentuk sederhana dari (-6) × 12 + (-6) × 8 menggunakan sifat distributif adalah ...',
          options: ['-6 × (12 + 8) = -120', '-6 × (12 - 8) = -24', '-12 × 8 = -96', '120'],
          answer: '-6 × (12 + 8) = -120',
          hint: 'Keluarkan faktor persekutuan (-6): (-6) × (12 + 8) = (-6) × 20 = -120.'
        },
        {
          id: 'l2-3',
          topic: 'Perkalian Tanda Negatif',
          prompt: 'Berapakah hasil dari perkalian berantai: (-3) × (-4) × (-5)?',
          options: ['-60', '+60', '-35', '+35'],
          answer: '-60',
          hint: 'Tiga bilangan negatif: (-) × (-) = (+), lalu (+) × (-) = (-). Jadi 12 × (-5) = -60.'
        }
      ]
    },
    // Level 3: Sulit (FPB, KPK & Soal Cerita Kedalaman)
    {
      level: 3,
      levelTitle: 'Level 3: Puncak Menara (FPB, KPK & Tantangan Nyata)',
      questions: [
        {
          id: 'l3-1',
          topic: 'FPB & Pembagian Merata',
          prompt: 'Seorang penjelajah menemukan 36 kristal biru dan 54 kristal merah. Berapakah jumlah kantong terbanyak yang dapat diisi kristal sama banyak tanpa sisa?',
          options: ['18 kantong', '9 kantong', '12 kantong', '6 kantong'],
          answer: '18 kantong',
          hint: 'Gunakan FPB dari 36 dan 54. 36 = 2^2 × 3^2, 54 = 2 × 3^3. FPB = 2 × 3^2 = 18.'
        },
        {
          id: 'l3-2',
          topic: 'KPK & Waktu Bertemu',
          prompt: 'Dua lonceng menara berbunyi otomatis. Lonceng pertama berbunyi tiap 6 menit, lonceng kedua tiap 15 menit. Setiap berapa menit kedua lonceng berbunyi bersamaan?',
          options: ['30 menit', '60 menit', '45 menit', '90 menit'],
          answer: '30 menit',
          hint: 'Cari KPK dari 6 dan 15. 6 = 2 × 3, 15 = 3 × 5. KPK = 2 × 3 × 5 = 30.'
        },
        {
          id: 'l3-3',
          topic: 'Soal Cerita Perubahan Nilai',
          prompt: 'Kapal selam mula-mula berada pada kedalaman -70 meter. Kapal naik 25 meter, lalu menyelam turun 40 meter. Di posisi manakah kapal sekarang?',
          options: ['-85 meter', '-55 meter', '-95 meter', '-65 meter'],
          answer: '-85 meter',
          hint: 'Posisi = -70 + 25 - 40 = -45 - 40 = -85 meter di bawah permukaan laut.'
        }
      ]
    }
  ];

  const currentStage = stages[level - 1];
  const currentQ = currentStage.questions[stepIdx];

  const handleSelectAnswer = (chosen) => {
    setActiveHint(null);
    if (chosen === currentQ.answer) {
      const addedPoints = 20 + streak * 5;
      const newScore = score + addedPoints;
      setScore(newScore);
      setStreak(prev => prev + 1);
      showToast(`Hebat! Jawaban tepat (+${addedPoints} poin)`, 'success');

      // Next step or level
      if (stepIdx < currentStage.questions.length - 1) {
        setStepIdx(prev => prev + 1);
      } else if (level < stages.length) {
        setLevel(prev => prev + 1);
        setStepIdx(0);
        showToast(`Selamat! Kamu membuka ${stages[level].levelTitle}!`, 'success');
      } else {
        finishAdventure(newScore);
      }
    } else {
      setStreak(0);
      setActiveHint(currentQ.hint);
      setNeedsReviewTopics(prev => new Set(prev).add(currentQ.topic));
      showToast('Jawaban kurang tepat. Periksa petunjuk di bawah!', 'error');
    }
  };

  const finishAdventure = async (finalScore) => {
    setIsFinished(true);
    try {
      const res = await fetchApi(`/games/${game.id}/attempt`, {
        method: 'POST',
        body: JSON.stringify({
          score: finalScore,
          details: {
            completed_stages: 3,
            topics_reviewed: Array.from(needsReviewTopics)
          }
        })
      });
      if (res.highest_score > bestScore) {
        setBestScore(res.highest_score);
      }
      showToast('Petualangan selesai! Skor tersimpan di capaian belajarmu.', 'success');
    } catch (e) {
      console.error('Failed to submit game score:', e);
    }
  };

  const restartGame = () => {
    setLevel(1);
    setStepIdx(0);
    setScore(0);
    setStreak(0);
    setActiveHint(null);
    setIsFinished(false);
    setNeedsReviewTopics(new Set());
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={15} />
        <span>Kembali ke Menu Game</span>
      </button>

      {/* GAME RUNNER */}
      {!isFinished ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Header bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--sage-100)', color: 'var(--sage-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Petualangan Bilangan Bulat</h2>
                <span className="badge badge-sage">{currentStage.levelTitle}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKOR</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sage-700)' }}>{score}</div>
              </div>
              {streak > 1 && (
                <span className="badge badge-amber">🔥 {streak}x Streak</span>
              )}
            </div>
          </div>

          {/* Level Progress Bar */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Tantangan {stepIdx + 1} dari {currentStage.questions.length} (Level {level}/3)</span>
              <span>Topik: {currentQ.topic}</span>
            </div>
            <div className="progress-track" style={{ height: '7px' }}>
              <div className="progress-fill" style={{ width: `${((stepIdx + (level - 1) * 3) / 9) * 100}%` }}></div>
            </div>
          </div>

          {/* Question Box */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--sage-600)', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Misi: {currentQ.topic}
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {currentQ.prompt}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                className="btn btn-outline"
                onClick={() => handleSelectAnswer(opt)}
                style={{
                  padding: '1rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  backgroundColor: 'white',
                  textAlign: 'center',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Hint callout if wrong answer */}
          {activeHint && (
            <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', color: '#B45309', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Petunjuk Guru Les:</strong><br />
                {activeHint}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ADVENTURE COMPLETE VIEW */
        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <Trophy size={40} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Petualangan Selesai! 🎉
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Kamu telah menaklukkan seluruh rintangan Lembah Bilangan Bulat dengan sangat baik!
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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--sage-700)' }}>{score}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR AKHIR</div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#D97706' }}>{Math.max(score, bestScore)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR TERBAIK</div>
            </div>
          </div>

          {/* Topics to review */}
          {needsReviewTopics.size > 0 && (
            <div style={{ textAlign: 'left', backgroundColor: 'var(--sage-50)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--sage-200)' }}>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                💡 Rekomendasi Materi untuk Diulas Kembali:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.from(needsReviewTopics).map(t => (
                  <span key={t} className="badge badge-amber">{t}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={restartGame}>
              <RotateCcw size={16} />
              <span>Mulai Petualangan Baru</span>
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
