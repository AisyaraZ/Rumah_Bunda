import React, { useState } from 'react';
import { fetchApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Trophy,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Compass,
  Navigation,
  Droplets,
  Activity
} from 'lucide-react';

export default function EkspedisiRasioSkalaGame({ game, onBack }) {
  const { showToast } = useAuth();
  const [currentPostIdx, setCurrentPostIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [activeHint, setActiveHint] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState(game?.highest_score || 0);
  const [studyAdvice, setStudyAdvice] = useState(new Set());

  // Checkpoints on the Expedition Map
  const checkpoints = [
    {
      id: 'pos-1',
      posName: 'Pos 1: Lembah Rasio Bibit Pohon',
      icon: Navigation,
      topic: 'Menyederhanakan Rasio & Satuan',
      prompt: 'Di pos kehutanan, terdapat 750 gram pupuk organik dan 3 kg tanah subur. Sebelum dicampur, tentukan perbandingan paling sederhana antara pupuk dan tanah!',
      options: ['1 : 4', '1 : 3', '3 : 4', '1 : 2'],
      answer: '1 : 4',
      hint: 'Samakan satuan terlebih dahulu: 3 kg = 3.000 gram. Rasio = 750 : 3.000 = (750 ÷ 750) : (3.000 ÷ 750) = 1 : 4.'
    },
    {
      id: 'pos-2',
      posName: 'Pos 2: Menara Pantau & Skala Peta',
      icon: MapPin,
      topic: 'Skala Peta (Jarak Sebenarnya)',
      prompt: 'Peta ekspedisi memiliki skala 1 : 200.000. Jarak dari Pos 1 ke Pos 2 pada peta terukur 6 cm. Berapakah jarak sebenarnya yang harus ditempuh ekspedisi dalam kilometer?',
      options: ['12 km', '6 km', '20 km', '1,2 km'],
      answer: '12 km',
      hint: 'Jarak Sebenarnya = Jarak Peta × Skala = 6 cm × 200.000 = 1.200.000 cm. Ubah cm ke km (bagi 100.000): 1.200.000 / 100.000 = 12 km.'
    },
    {
      id: 'pos-3',
      posName: 'Pos 3: Sungai Perbandingan Senilai & Berbalik Nilai',
      icon: Compass,
      topic: 'Perbandingan Berbalik Nilai (Pekerja)',
      prompt: 'Sebuah jembatan darurat bambu dapat dibangun oleh 6 anggota regu dalam waktu 10 jam. Jika pekerjaan ingin selesai dalam waktu 4 jam sebelum badai tiba, berapa banyak anggota regu yang harus dikerahkan secara total?',
      options: ['15 orang', '12 orang', '18 orang', '10 orang'],
      answer: '15 orang',
      hint: 'Gunakan perbandingan berbalik nilai: x1 × y1 = x2 × y2 -> 6 × 10 = x2 × 4 -> 60 = 4x2 -> x2 = 60 / 4 = 15 orang.'
    },
    {
      id: 'pos-4',
      posName: 'Pos 4: Jalur Laju Kendaraan',
      icon: Activity,
      topic: 'Laju Kecepatan (v = s / t)',
      prompt: 'Kendaraan logistik melaju dari Pos 3 ke Pos 4 sejauh 90 km dalam waktu 1,5 jam. Berapakah kecepatan rata-rata kendaraan tersebut?',
      options: ['60 km/jam', '75 km/jam', '50 km/jam', '80 km/jam'],
      answer: '60 km/jam',
      hint: 'Rumus kecepatan: v = s / t = 90 km / 1,5 jam = 60 km/jam.'
    },
    {
      id: 'pos-5',
      posName: 'Pos 5: Danau Pembangkit & Debit Air',
      icon: Droplets,
      topic: 'Debit Air (Q = V / t)',
      prompt: 'Sebuah tandon penampungan air di Pos Akhir bervolume 600 liter diisi penuh menggunakan pompa berkekuatan debit 40 liter/menit. Berapa menit waktu yang diperlukan sampai tandon penuh?',
      options: ['15 menit', '20 menit', '12 menit', '25 menit'],
      answer: '15 menit',
      hint: 'Rumus waktu debit: t = V / Q = 600 liter / 40 liter/menit = 15 menit.'
    }
  ];

  const currentPos = checkpoints[currentPostIdx];

  const handleAnswerClick = (chosen) => {
    setActiveHint(null);
    if (chosen === currentPos.answer) {
      const added = 20;
      const newScore = score + added;
      setScore(newScore);
      showToast(`Pos terbuka! +${added} poin`, 'success');

      if (currentPostIdx < checkpoints.length - 1) {
        setCurrentPostIdx(prev => prev + 1);
      } else {
        finishExpedition(newScore);
      }
    } else {
      setActiveHint(currentPos.hint);
      setStudyAdvice(prev => new Set(prev).add(currentPos.topic));
      showToast('Kunci navigasi salah. Pelajari petunjuk rumus!', 'error');
    }
  };

  const finishExpedition = async (finalScore) => {
    setIsFinished(true);
    try {
      const res = await fetchApi(`/games/${game.id}/attempt`, {
        method: 'POST',
        body: JSON.stringify({
          score: finalScore,
          details: {
            checkpoints_reached: checkpoints.length,
            advice: Array.from(studyAdvice)
          }
        })
      });
      if (res.highest_score > bestScore) {
        setBestScore(res.highest_score);
      }
      showToast('Ekspedisi sukses! Seluruh pos berhasil dijelajahi.', 'success');
    } catch (e) {
      console.error('Failed to submit game score:', e);
    }
  };

  const restartExpedition = () => {
    setCurrentPostIdx(0);
    setScore(0);
    setActiveHint(null);
    setIsFinished(false);
    setStudyAdvice(new Set());
  };

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto' }}>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={15} />
        <span>Kembali ke Menu Game</span>
      </button>

      {!isFinished ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--blue-100)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Ekspedisi Rasio & Skala</h2>
                <span className="badge badge-blue">{currentPos.topic}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKOR EKSPEDISI</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--blue-600)' }}>{score}</div>
            </div>
          </div>

          {/* Interactive Map Waypoint Trail */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Peta Jalur Pos Ekspedisi
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {checkpoints.map((cp, idx) => {
                const isPassed = idx < currentPostIdx;
                const isCurrent = idx === currentPostIdx;

                return (
                  <div key={cp.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? '#16A34A' : isCurrent ? 'var(--blue-500)' : 'white',
                      color: isPassed || isCurrent ? 'white' : 'var(--text-muted)',
                      border: isCurrent ? '3px solid var(--blue-200)' : '2px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(62, 126, 159, 0.15)' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isCurrent ? 'var(--blue-600)' : 'var(--text-muted)', marginTop: '4px' }}>
                      Pos {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pos Challenge Content */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue-600)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <currentPos.icon size={18} />
              <span>{currentPos.posName}</span>
            </div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
              {currentPos.prompt}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {currentPos.options.map((opt, i) => (
              <button
                key={i}
                className="btn btn-outline"
                onClick={() => handleAnswerClick(opt)}
                style={{
                  padding: '1rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  backgroundColor: 'white',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Hint if wrong */}
          {activeHint && (
            <div style={{ padding: '1rem 1.25rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', color: '#1E40AF', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <AlertCircle size={18} />
                <span>Petunjuk Kompas & Rumus:</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {activeHint}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* EXPEDITION FINISHED */
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
            Ekspedisi Selesai dengan Gemilang! 🗺️
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Seluruh pos rute rasio, perbandingan, skala peta, laju kecepatan, dan debit air berhasil kamu selesaikan!
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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--blue-600)' }}>{score}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR AKHIR</div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#D97706' }}>{Math.max(score, bestScore)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR TERBAIK</div>
            </div>
          </div>

          {studyAdvice.size > 0 && (
            <div style={{ textAlign: 'left', backgroundColor: 'var(--sage-50)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--sage-200)' }}>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                💡 Saran Belajar & Penguatan Rumus:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.from(studyAdvice).map(s => (
                  <span key={s} className="badge badge-blue">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={restartExpedition}>
              <RotateCcw size={16} />
              <span>Jalankan Ekspedisi Baru</span>
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
