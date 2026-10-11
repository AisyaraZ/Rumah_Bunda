import React, { useState } from 'react';
import { fetchApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  XCircle,
  BookOpen,
  MapPin,
  Compass,
  AlertCircle
} from 'lucide-react';

const ADVENTURE_STAGES = [
  // TAHAP 1: Membedakan Puisi Rakyat (Pantun vs Syair vs Gurindam)
  {
    stage: 1,
    title: 'Tahap 1: Gerbang Puisi Rakyat',
    theme: 'Misteri Bait Klasik',
    instructions: 'Baca bait puisi rakyat berikut dan tebak jenisnya berdasarkan ciri rima dan jumlah baris:',
    poemText: [
      'Barang siapa berbuat cermat,',
      'Hidupnya kelak beroleh selamat.'
    ],
    question: 'Bait di atas terdiri atas 2 baris bersajak a-a, baris 1 syarat dan baris 2 akibat. Jenis puisi rakyat tersebut adalah...',
    options: [
      { key: 'A', text: 'Pantun Jenaka' },
      { key: 'B', text: 'Gurindam' },
      { key: 'C', text: 'Syair Kisah' },
      { key: 'D', text: 'Talibun' }
    ],
    correct: 'B',
    explanation: 'Puisi rakyat 2 baris berima a-a di mana baris 1 berisi syarat/sebab dan baris 2 berisi akibat/nasihat adalah ciri mutlak Gurindam.'
  },
  // TAHAP 2: Menyusun Baris Puisi sesuai Pola dan Rima
  {
    stage: 2,
    title: 'Tahap 2: Perangkai Rima Pantun',
    theme: 'Menyusun Bait Hikmah',
    instructions: 'Susunlah baris-baris acak berikut agar menjadi bait pantun bersajak silang a-b-a-b yang bermakna nasihat luhur:',
    poemLines: [
      '1. Tempat burung kutilang bersarang',
      '2. Pohon jati tumbuh di bukit',
      '3. Masa depanmu cerah gemilang',
      '4. Bila belajar tekun sedikit'
    ],
    question: 'Urutan baris yang benar agar membentuk pantun dengan rima a-b-a-b (sampiran lalu isi) adalah...',
    options: [
      { key: 'A', text: '1 - 2 - 3 - 4' },
      { key: 'B', text: '2 - 1 - 4 - 3' },
      { key: 'C', text: '4 - 3 - 2 - 1' },
      { key: 'D', text: '2 - 4 - 1 - 3' }
    ],
    correct: 'B',
    explanation: 'Urutan benar: (2) Pohon jati tumbuh di bukit [a], (1) Tempat burung kutilang bersarang [b], (4) Bila belajar tekun sedikit [a], (3) Masa depanmu cerah gemilang [b]. Pola rima a-b-a-b rapi.'
  },
  // TAHAP 3: Memasangkan Bagian Cerita Fantasi dengan Struktur
  {
    stage: 3,
    title: 'Tahap 3: Lorong Struktur Cerita Fantasi',
    theme: 'Pintu Ajaib Perpustakaan',
    instructions: 'Telaah penggalan cerita fantasi berikut:',
    storySnippet: '"Di sebuah perpustakaan tua sekolah yang temaram, Arga duduk menyendiri di antara rak buku kayu yang menjulang. Arga dikenal sebagai anak yang pendiam namun sangat mencintai sejarah."',
    question: 'Penggalan kisah di atas mengenalkan tokoh, watak, dan latar suasana. Bagian struktur cerita fantasi yang dimaksud adalah...',
    options: [
      { key: 'A', text: 'Resolusi' },
      { key: 'B', text: 'Orientasi' },
      { key: 'C', text: 'Komplikasi' },
      { key: 'D', text: 'Klimaks' }
    ],
    correct: 'B',
    explanation: 'Orientasi adalah tahap awal cerita fantasi yang memperkenalkan tokoh (Arga), sifatnya (pendiam, suka sejarah), serta latar tempat dan suasana permulaan (perpustakaan tua temaram).'
  },
  // TAHAP 4: Mengidentifikasi Tokoh, Latar, Alur, & Amanat
  {
    stage: 4,
    title: 'Tahap 4: Kristal Intrinsik Fantasi',
    theme: 'Misteri Kerajaan Aksara',
    instructions: 'Cermati kutipan akhir petualangan Arga berikut:',
    storySnippet: '"Dengan membaca kalimat mantra kejujuran dari buku naga perak, kutukan es hitam pecah berkeping-keping. Monster kabut lenyap melebur. Arga tersadar kembali di meja belajarnya dan menyadari bahwa ilmu pengetahuan dan kebiasaan membaca adalah pelita yang menjaga kebaikan dunia dari kegelapan."',
    question: 'Amanat utama yang ingin disampaikan pengarang melalui kutipan cerita fantasi tersebut adalah...',
    options: [
      { key: 'A', text: 'Kita harus belajar ilmu sihir naga perak agar ditakuti oleh monster kabut.' },
      { key: 'B', text: 'Membaca buku dan merawat ilmu pengetahuan adalah pelindung peradaban manusia dari kehampaan.' },
      { key: 'C', text: 'Perpustakaan tua harus ditutup agar siswa tidak tersedot ke dimensi lain.' },
      { key: 'D', text: 'Jangan pernah sendirian saat belajar di sore hari.' }
    ],
    correct: 'B',
    explanation: 'Amanat cerita adalah pesan moral inti bahwa membaca buku dan mencintai ilmu adalah pelita sejati yang memelihara kebaikan dan kemajuan peradaban manusia.'
  }
];

export default function PetualanganDuniaImajinasiGame({ game, onBack }) {
  const { showToast } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const stageData = ADVENTURE_STAGES[currentIdx];

  const handleSelect = (key) => {
    if (isAnswered) return;
    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === stageData.correct;
    let earnedPoints = 0;

    if (isCorrect) {
      const bonus = streak * 15;
      earnedPoints = 50 + bonus;
      setScore(prev => prev + earnedPoints);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setHistory(prev => [
      ...prev,
      {
        stage: stageData.stage,
        title: stageData.title,
        isCorrect,
        points: earnedPoints
      }
    ]);
  };

  const handleNextStage = () => {
    if (currentIdx < ADVENTURE_STAGES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setIsFinished(true);
    try {
      if (game && game.id) {
        await fetchApi(`/games/${game.id}/attempt`, {
          method: 'POST',
          body: JSON.stringify({ score })
        });
      }
      showToast('Petualangan selesai! Skor berhasil disimpan.', 'success');
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setHistory([]);
    setIsFinished(false);
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: '#EDE9FE',
            color: '#6D28D9',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Trophy size={16} />
            <span>Skor Petualangan: {score} pts</span>
          </div>

          {streak > 1 && (
            <div style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              🔥 Combo x{streak}!
            </div>
          )}
        </div>
      </div>

      {!isFinished ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Stage Progress Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-blue">
              Tahap {stageData.stage} dari {ADVENTURE_STAGES.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Topik: Puisi Rakyat & Cerita Fantasi
            </span>
          </div>

          <div className="progress-track" style={{ height: '6px', marginBottom: '1.75rem' }}>
            <div
              className="progress-fill"
              style={{
                width: `${((currentIdx + 1) / ADVENTURE_STAGES.length) * 100}%`,
                backgroundColor: '#7C3AED'
              }}
            />
          </div>

          {/* Stage Header Box */}
          <div style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            border: '1px solid #E9D5FF',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6D28D9', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              <Sparkles size={18} />
              <span>{stageData.title}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>— {stageData.theme}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              {stageData.instructions}
            </p>

            {/* Poem or Story snippet */}
            {stageData.poemText && (
              <div style={{
                backgroundColor: 'white',
                borderLeft: '4px solid #7C3AED',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1.25rem',
                marginTop: '1rem',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1.6
              }}>
                {stageData.poemText.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {stageData.poemLines && (
              <div style={{
                backgroundColor: 'white',
                border: '1px dashed #C4B5FD',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1.25rem',
                marginTop: '1rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6
              }}>
                {stageData.poemLines.map((line, i) => (
                  <div key={i} style={{ fontWeight: 500 }}>{line}</div>
                ))}
              </div>
            )}

            {stageData.storySnippet && (
              <div style={{
                backgroundColor: 'white',
                borderLeft: '4px solid #7C3AED',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1.25rem',
                marginTop: '1rem',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1.6
              }}>
                "{stageData.storySnippet}"
              </div>
            )}
          </div>

          {/* Question */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            {stageData.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {stageData.options.map(opt => {
              const isSelected = selectedOption === opt.key;
              const isCorrectOpt = opt.key === stageData.correct;

              let btnBg = 'white';
              let btnBorder = 'var(--border-light)';
              let btnColor = 'var(--text-primary)';

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnBg = '#DCFCE7';
                  btnBorder = '#16A34A';
                  btnColor = '#15803D';
                } else if (isSelected) {
                  btnBg = '#FEE2E2';
                  btnBorder = '#DC2626';
                  btnColor = '#B91C1C';
                }
              }

              return (
                <button
                  key={opt.key}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${btnBorder}`,
                    backgroundColor: btnBg,
                    color: btnColor,
                    textAlign: 'left',
                    fontSize: '0.925rem',
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span style={{
                    fontWeight: 800,
                    marginRight: '0.85rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {opt.key}
                  </span>
                  <span style={{ flex: 1 }}>{opt.text}</span>

                  {isAnswered && isCorrectOpt && <CheckCircle size={20} color="#16A34A" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle size={20} color="#DC2626" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div style={{
              backgroundColor: selectedOption === stageData.correct ? '#F0FDF4' : '#FFFBEB',
              border: `1px solid ${selectedOption === stageData.correct ? '#86EFAC' : '#FDE68A'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: selectedOption === stageData.correct ? '#166534' : '#B45309', marginBottom: '0.35rem' }}>
                {selectedOption === stageData.correct ? (
                  <>
                    <CheckCircle size={18} color="#16A34A" />
                    <span>Gerbang Terbuka! Jawaban Tepat (+{streak > 1 ? `50 + bonus ${ (streak-1)*15 }` : '50'} pts)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} color="#D97706" />
                    <span>Tantangan Belum Terpecahkan! Pilihan yang benar adalah {stageData.correct}.</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                <strong>Penjelasan:</strong> {stageData.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
                onClick={handleNextStage}
              >
                <span>{currentIdx < ADVENTURE_STAGES.length - 1 ? 'Lanjut ke Tahap Berikutnya' : 'Selesaikan Petualangan Imajinasi'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished */
        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#EDE9FE',
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Trophy size={36} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Petualangan Selesai! 🏰✨
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Hebat! Kamu telah menaklukkan gerbang puisi rakyat, merangkai rima bait, serta mengurai alur dan amanat cerita fantasi.
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skor Akhir</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7C3AED' }}>{score} pts</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tahap Tuntas</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A' }}>
                {history.filter(h => h.isCorrect).length} / {ADVENTURE_STAGES.length}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={handleRestart}>
              <RotateCcw size={16} />
              <span>Mulai Lagi</span>
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
