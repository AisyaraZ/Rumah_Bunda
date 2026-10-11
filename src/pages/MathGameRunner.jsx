import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Zap, Trophy, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

export default function MathGameRunner({ game, onBack }) {
  const { showToast } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentScore, setCurrentScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState({ text: '7 + (-3)', answer: 4, options: [4, 10, -4, 2] });
  const [isFinished, setIsFinished] = useState(false);
  const [bestScore, setBestScore] = useState(game.highest_score || 0);

  // Generate Grade 7 Math questions (bilangan bulat)
  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans, text;

    if (op === '+') {
      a = Math.floor(Math.random() * 25) - 10; // -10 to 14
      b = Math.floor(Math.random() * 25) - 10;
      ans = a + b;
      text = `${a >= 0 ? a : `(${a})`} + ${b >= 0 ? b : `(${b})`}`;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 25) - 5;
      b = Math.floor(Math.random() * 20) - 5;
      ans = a - b;
      text = `${a >= 0 ? a : `(${a})`} - ${b >= 0 ? b : `(${b})`}`;
    } else {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
      text = `${a} × ${b}`;
    }

    // Generate 3 unique distractors
    const optionsSet = new Set([ans]);
    while (optionsSet.size < 4) {
      const delta = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      optionsSet.add(ans + delta);
    }
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { text, answer: ans, options };
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setCurrentScore(0);
    setStreak(0);
    setTimeLeft(45);
    setProblem(generateProblem());
  };

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      finishGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleAnswer = (chosen) => {
    if (!isPlaying) return;

    if (chosen === problem.answer) {
      const addedPoints = 10 + streak * 2;
      setCurrentScore(prev => prev + addedPoints);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    setProblem(generateProblem());
  };

  const finishGame = async () => {
    setIsPlaying(false);
    setIsFinished(true);

    try {
      const res = await fetchApi(`/games/${game.id}/attempt`, {
        method: 'POST',
        body: JSON.stringify({
          score: currentScore,
          details: { final_score: currentScore }
        })
      });
      if (res.highest_score > bestScore) {
        setBestScore(res.highest_score);
      }
      showToast('Permainan selesai! Skor Anda berhasil disimpan.', 'success');
    } catch (err) {
      console.error('Failed to submit game score:', err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={15} />
          <span>Kembali ke Daftar Game</span>
        </button>
      </div>

      <div className="card" style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 2rem', textAlign: 'center' }}>
        {!isPlaying && !isFinished ? (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--cream-100)',
              color: 'var(--cream-500)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Zap size={36} />
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.45rem' }}>
              {game.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Selesaikan sebanyak mungkin operasi hitung bilangan bulat kelas 7 dalam waktu 45 detik. Pertahankan streak untuk bonus poin!
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '2rem',
              fontWeight: 700,
              color: 'var(--sage-700)'
            }}>
              <Trophy size={18} color="var(--amber-500)" />
              <span>Skor Terbaikmu: {bestScore} Poin</span>
            </div>

            <div>
              <button className="btn btn-primary btn-lg" onClick={startGame}>
                <span>Mulai Bermain Sekarang</span>
              </button>
            </div>
          </div>
        ) : isPlaying ? (
          <div>
            {/* Play bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: timeLeft <= 10 ? '#FEE2E2' : 'var(--sage-100)',
                color: timeLeft <= 10 ? '#DC2626' : 'var(--sage-700)',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                ⏳ {timeLeft} detik
              </div>

              <div style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--sage-700)'
              }}>
                Skor: {currentScore}
              </div>

              {streak > 1 && (
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--amber-100)',
                  color: 'var(--amber-500)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  🔥 {streak}x Streak!
                </div>
              )}
            </div>

            {/* Problem display */}
            <div style={{
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 1.5rem',
              marginBottom: '2rem',
              border: '1px solid var(--border-light)'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Berapakah hasil dari:
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                {problem.text} = ?
              </div>
            </div>

            {/* Answer buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {problem.options.map((opt, i) => (
                <button
                  key={i}
                  className="btn btn-outline"
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '1.15rem',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    backgroundColor: 'white',
                    borderColor: 'var(--border-subtle)',
                    transition: 'all 0.1s ease'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Trophy size={36} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Waktu Habis!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Permainan selesai! Skor Anda telah tersimpan secara permanen.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2.5rem',
              padding: '1.25rem 2.25rem',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--sage-700)' }}>
                  {currentScore}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SKOR PERMAINAN</div>
              </div>

              <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--amber-500)' }}>
                  {Math.max(currentScore, bestScore)}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SKOR TERBAIK</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={startGame}>
                <RotateCcw size={16} />
                <span>Main Lagi</span>
              </button>
              <button className="btn btn-primary" onClick={onBack}>
                <span>Daftar Permainan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
