import React, { useState } from 'react';
import { fetchApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  PieChart,
  Trophy,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  Layers
} from 'lucide-react';

export default function MisiPecahanGame({ game, onBack }) {
  const { showToast } = useAuth();
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState(game?.highest_score || 0);
  const [unmasteredConcepts, setUnmasteredConcepts] = useState(new Set());

  // Visual Interactive Missions
  const missions = [
    {
      id: 'm1',
      type: 'visual_pie',
      title: 'Misi 1: Potongan Kue Ulang Tahun',
      prompt: 'Sebuah kue tart dibagi menjadi 8 potong sama besar. Budi memakan 2 potong dan Siti memakan 4 potong. Berapa bagian kue yang telah dimakan dalam bentuk pecahan paling sederhana?',
      visualTotal: 8,
      visualEaten: 6,
      options: ['3/4', '6/8', '1/2', '2/3'],
      answer: '3/4',
      concept: 'Menyederhanakan Pecahan',
      explanation: 'Total dimakan = 2/8 + 4/8 = 6/8. Sederhanakan dengan membagi pembilang dan penyebut dengan FPB(6,8) = 2, sehingga diperoleh 3/4.'
    },
    {
      id: 'm2',
      type: 'fraction_bar',
      title: 'Misi 2: Batang Pecahan Senilai',
      prompt: 'Perhatikan batang pecahan di bawah ini. Manakah di antara pecahan berikut yang SENILAI dengan 3/5?',
      fractionNum: 3,
      fractionDen: 5,
      options: ['9/15', '6/15', '12/25', '6/12'],
      answer: '9/15',
      concept: 'Pecahan Senilai',
      explanation: 'Pecahan senilai diperoleh dengan mengalikan pembilang dan penyebut dengan bilangan yang sama: 3 × 3 = 9 dan 5 × 3 = 15. Jadi 3/5 senilai dengan 9/15.'
    },
    {
      id: 'm3',
      type: 'shopping',
      title: 'Misi 3: Diskon Toko Pakaian',
      prompt: 'Sebuah celana seharga Rp120.000 mendapatkan diskon 25%. Berapakah potongan harga yang diperoleh pembeli?',
      options: ['Rp30.000', 'Rp25.000', 'Rp35.000', 'Rp40.000'],
      answer: 'Rp30.000',
      concept: 'Persen & Potongan Harga',
      explanation: 'Diskon 25% = 25/100 = 1/4. Potongan harga = 1/4 × Rp120.000 = Rp30.000.'
    },
    {
      id: 'm4',
      type: 'decimal_convert',
      title: 'Misi 4: Laboratorium Konversi Desimal',
      prompt: 'Cairan di tabung reaksi menunjukkan volume 0,375 liter. Bentuk pecahan biasa paling sederhana dari nilai tersebut adalah ...',
      options: ['3/8', '375/100', '3/4', '7/16'],
      answer: '3/8',
      concept: 'Konversi Desimal ke Pecahan',
      explanation: '0,375 = 375/1000. FPB dari 375 dan 1000 adalah 125. 375 ÷ 125 = 3 dan 1000 ÷ 125 = 8. Jadi bentuk paling sederhana adalah 3/8.'
    },
    {
      id: 'm5',
      type: 'operation',
      title: 'Misi 5: Pembuatan Roti Bakery',
      prompt: 'Koki memiliki 3 1/2 kg tepung. Ia menggunakan 1 1/4 kg untuk roti tawar dan 1 1/8 kg untuk donat. Berapa kg sisa tepung terigu koki?',
      options: ['1 1/8 kg', '1 1/4 kg', '1 3/8 kg', '7/8 kg'],
      answer: '1 1/8 kg',
      concept: 'Operasi Campuran Pecahan',
      explanation: 'Tepung terpakai = 1 2/8 + 1 1/8 = 2 3/8 kg. Sisa = 3 4/8 - 2 3/8 = 1 1/8 kg.'
    }
  ];

  const currentMission = missions[missionIdx];

  const handleChooseAnswer = (chosen) => {
    setActiveFeedback(null);
    if (chosen === currentMission.answer) {
      const added = 25;
      const newScore = score + added;
      setScore(newScore);
      showToast(`Misi berhasil! +${added} poin`, 'success');

      if (missionIdx < missions.length - 1) {
        setMissionIdx(prev => prev + 1);
      } else {
        finishMissions(newScore);
      }
    } else {
      setActiveFeedback({
        chosen,
        concept: currentMission.concept,
        explanation: currentMission.explanation
      });
      setUnmasteredConcepts(prev => new Set(prev).add(currentMission.concept));
      showToast('Jawaban belum tepat. Cermati penjelasannya!', 'error');
    }
  };

  const finishMissions = async (finalScore) => {
    setIsFinished(true);
    try {
      const res = await fetchApi(`/games/${game.id}/attempt`, {
        method: 'POST',
        body: JSON.stringify({
          score: finalScore,
          details: {
            completed_missions: missions.length,
            unmastered: Array.from(unmasteredConcepts)
          }
        })
      });
      if (res.highest_score > bestScore) {
        setBestScore(res.highest_score);
      }
      showToast('Seluruh misi pecahan terselesaikan dengan baik!', 'success');
    } catch (e) {
      console.error('Failed to submit game score:', e);
    }
  };

  const restartGame = () => {
    setMissionIdx(0);
    setScore(0);
    setActiveFeedback(null);
    setIsFinished(false);
    setUnmasteredConcepts(new Set());
  };

  // Visual Renderer for fraction pie / bar
  const renderVisualElement = () => {
    if (currentMission.type === 'visual_pie') {
      const total = currentMission.visualTotal;
      const eaten = currentMission.visualEaten;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            maxWidth: '260px',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--sage-200)'
          }}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: i < eaten ? '#F59E0B' : '#E2E8F0',
                  color: i < eaten ? 'white' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                {i < eaten ? 'Dimakan' : 'Sisa'}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {eaten} dari {total} bagian telah termakan
          </span>
        </div>
      );
    }

    if (currentMission.type === 'fraction_bar') {
      return (
        <div style={{ margin: '1.25rem 0', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', height: '36px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--blue-500)' }}>
            <div style={{ width: '60%', backgroundColor: 'var(--blue-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
              3 Bagian
            </div>
            <div style={{ width: '40%', backgroundColor: 'var(--blue-100)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
              2 Bagian
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0</span>
            <span>Nilai: 3/5 bagian (60%)</span>
            <span>1</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={15} />
        <span>Kembali ke Menu Game</span>
      </button>

      {!isFinished ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--cream-100)', color: 'var(--cream-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Misi Pecahan</h2>
                <span className="badge badge-amber">{currentMission.concept}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKOR MISI</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber-500)' }}>{score}</div>
            </div>
          </div>

          {/* Mission Progress */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Misi {missionIdx + 1} dari {missions.length}</span>
              <span>Target: Menyelidiki Pecahan</span>
            </div>
            <div className="progress-track" style={{ height: '7px' }}>
              <div className="progress-fill" style={{ width: `${((missionIdx + 1) / missions.length) * 100}%`, backgroundColor: '#F59E0B' }}></div>
            </div>
          </div>

          {/* Visual Canvas */}
          {renderVisualElement()}

          {/* Prompt */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {currentMission.title}
            </h3>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {currentMission.prompt}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {currentMission.options.map((opt, i) => (
              <button
                key={i}
                className="btn btn-outline"
                onClick={() => handleChooseAnswer(opt)}
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

          {/* Feedback on incorrect attempt */}
          {activeFeedback && (
            <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', color: '#92400E', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <AlertCircle size={18} />
                <span>Ulasan Konsep: {activeFeedback.concept}</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {activeFeedback.explanation}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* FINISHED SCREEN */
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
            Semua Misi Selesai! 🥧
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Hebat! Kamu telah menuntaskan seluruh tantangan analisis bilangan rasional dan pecahan.
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
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--amber-500)' }}>{score}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR MISI</div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#D97706' }}>{Math.max(score, bestScore)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SKOR TERBAIK</div>
            </div>
          </div>

          {unmasteredConcepts.size > 0 && (
            <div style={{ textAlign: 'left', backgroundColor: 'var(--sage-50)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--sage-200)' }}>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                💡 Konsep yang Disarankan untuk Dipelajari Lagi:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.from(unmasteredConcepts).map(c => (
                  <span key={c} className="badge badge-amber">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={restartGame}>
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
