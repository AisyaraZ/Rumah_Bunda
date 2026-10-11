import React, { useState } from 'react';
import { fetchApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';

const CASES_DATA = [
  // Kasus 1: Mengendus Kata Konkret & Kata Sifat
  {
    id: 1,
    title: 'Kasus 1: Mengendus Bukti Kata Konkret',
    theme: 'Pantai Kuta Bali',
    narrative: 'Detektif menemukan deskripsi objek pantai berikut: "Pantai Kuta memiliki hamparan pemandangan yang sangat menakjubkan bagi para pengunjung."',
    question: 'Bantulah detektif mengubah kata abstrak "pemandangan sangat menakjubkan" menjadi pilihan KATA KONKRET yang paling hidup dan melibatkan pancaindra penglihatan:',
    options: [
      { key: 'A', text: 'Suasana yang benar-benar memuaskan dan tiada tara di hati' },
      { key: 'B', text: 'Pasir putih bersih dan ombak biru bergulung memecah buih putih di bibir pantai' },
      { key: 'C', text: 'Kondisi alam yang terkenal sangat indah di Pulau Dewata' },
      { key: 'D', text: 'Keadaan cuaca yang sangat bersahabat bagi turis asing' }
    ],
    correct: 'B',
    explanation: 'Kata konkret harus dapat diserap secara nyata oleh pancaindra. "Pasir putih bersih" dan "ombak biru bergulung memecah buih putih" dapat dilihat secara kasat mata.'
  },
  // Kasus 2: Menentukan Bagian Struktur Teks
  {
    id: 2,
    title: 'Kasus 2: Rekonstruksi Struktur Teks',
    theme: 'Candi Prambanan',
    narrative: 'Detektif memeriksa robekan naskah deskripsi berikut:\n"Candi Prambanan adalah kompleks candi Hindu terbesar di Indonesia yang terletak di perbatasan Daerah Istimewa Yogyakarta dan Jawa Tengah. Mahakarya abad ke-9 ini telah ditetapkan UNESCO sebagai warisan budaya dunia."',
    question: 'Berdasarkan cirinya, robekan naskah di atas termasuk bagian struktur...',
    options: [
      { key: 'A', text: 'Identifikasi (Pernyataan Umum)' },
      { key: 'B', text: 'Deskripsi Bagian' },
      { key: 'C', text: 'Penutup / Simpulan Kesan' },
      { key: 'D', text: 'Rekomendasi Penulis' }
    ],
    correct: 'A',
    explanation: 'Paragraf tersebut mengenalkan nama objek (Candi Prambanan), lokasi, dan sejarah singkat pengakuan dunia, yang merupakan karakteristik bagian Identifikasi.'
  },
  // Kasus 3: Deteksi Majas Personifikasi
  {
    id: 3,
    title: 'Kasus 3: Jejak Majas Personifikasi',
    theme: 'Hutan Pinus Mangunan',
    narrative: 'Detektif menemukan beberapa kalimat puitis dalam catatan wisata hutan pinus.',
    question: 'Manakah kalimat berikut yang terbukti menggunakan MAJAS PERSONIFIKASI (benda mati bersikap seperti manusia)?',
    options: [
      { key: 'A', text: 'Hutan pinus ini merupakan paru-paru hijau bagi wilayah Bantul.' },
      { key: 'B', text: 'Pohon-pohon pinus berbisik lirih saat semilir angin membelai rantingnya.' },
      { key: 'C', text: 'Pemandangan di puncak bukit bagaikan lukisan alam di atas kanvas raksasa.' },
      { key: 'D', text: 'Tinggi pohon pinus rata-rata mencapai dua puluh lima meter.' }
    ],
    correct: 'B',
    explanation: '"Pohon pinus berbisik lirih" dan "angin membelai ranting" menggambarkan pohon dan angin mati memiliki perilaku berbicara dan membelai layaknya manusia.'
  },
  // Kasus 4: Memperbaiki Ejaan Kata Depan "di, ke, dari"
  {
    id: 4,
    title: 'Kasus 4: Investigasi Kesalahan Kata Depan',
    theme: 'Griya Anggrek Bogor',
    narrative: 'Detektif menemukan draf tulisan reporter pemula yang memuat kekeliruan penulisan kata depan:',
    question: 'Manakah penulisan kata depan (preposisi) dan awalan yang SUDAH BENAR menurut kaidah ejaan?',
    options: [
      { key: 'A', text: 'Ratusan bibit anggrek di rawat dipot kaca oleh petugas kebun raya.' },
      { key: 'B', text: 'Ratusan bibit anggrek dirawat di pot kaca oleh petugas kebun raya.' },
      { key: 'C', text: 'Ratusan bibit anggrek dirawat dipot kaca oleh petugas kebun raya.' },
      { key: 'D', text: 'Ratusan bibit anggrek di rawat di pot kaca oleh petugas kebun raya.' }
    ],
    correct: 'B',
    explanation: '"Dirawat" ditulis serangkai/digabung karena awalan di- pada kata kerja pasif. Sedangkan "di pot" ditulis terpisah karena kata depan yang menunjukkan tempat.'
  },
  // Kasus 5: Analisis Kalimat Perincian
  {
    id: 5,
    title: 'Kasus 5: Membedah Kalimat Perincian',
    theme: 'Danau Toba Sumatera Utara',
    narrative: 'Terdapat pernyataan umum: "Danau Toba memancarkan suasana pagi yang sangat syahdu dan tenang."',
    question: 'Manakah kalimat perincian yang paling tepat untuk memperjelas pernyataan umum tersebut?',
    options: [
      { key: 'A', text: 'Danau Toba terbentuk akibat letusan gunung berapi purba ribuan tahun lalu.' },
      { key: 'B', text: 'Permukaan air danau begitu tenang tanpa riak, diselimuti kabut tipis putih sementara kicau burung gereja memecah keheningan fajar.' },
      { key: 'C', text: 'Banyak penginapan dan hotel berbintang dibangun di sekitar tepi danau.' },
      { key: 'D', text: 'Bupati setempat meresmikan festival budaya tahunan di pulau Samosir.' }
    ],
    correct: 'B',
    explanation: 'Kalimat B memerinci suasana syahdu melalui penglihatan (air tenang tanpa riak, kabut tipis) dan pendengaran (kicau burung memecah keheningan fajar).'
  }
];

export default function DetektifTeksDeskripsiGame({ game, onBack }) {
  const { showToast } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answersLog, setAnswersLog] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  const currentCase = CASES_DATA[currentStep];

  const handleSelectOption = (key) => {
    if (isAnswered) return;
    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === currentCase.correct;
    let earnedPoints = 0;

    if (isCorrect) {
      const bonusStreak = streak * 10;
      earnedPoints = 40 + bonusStreak;
      setScore(prev => prev + earnedPoints);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setAnswersLog(prev => [
      ...prev,
      {
        caseId: currentCase.id,
        title: currentCase.title,
        selected: key,
        correct: currentCase.correct,
        isCorrect,
        points: earnedPoints
      }
    ]);
  };

  const handleNextCase = () => {
    if (currentStep < CASES_DATA.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setIsFinished(true);
    try {
      setSavingScore(true);
      if (game && game.id) {
        await fetchApi(`/games/${game.id}/attempt`, {
          method: 'POST',
          body: JSON.stringify({ score })
        });
      }
      showToast('Skor detektif berhasil disimpan permanen!', 'success');
    } catch (err) {
      console.error('Failed to save score:', err);
    } finally {
      setSavingScore(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setAnswersLog([]);
    setIsFinished(false);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Bar */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: 'var(--sage-100)',
            color: 'var(--sage-700)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Trophy size={16} />
            <span>Skor: {score} pts</span>
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
              🔥 Streak x{streak}!
            </div>
          )}
        </div>
      </div>

      {!isFinished ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-sage">
              Kasus {currentStep + 1} dari {CASES_DATA.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Topik: Teks Deskripsi
            </span>
          </div>

          <div className="progress-track" style={{ height: '6px', marginBottom: '1.5rem' }}>
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / CASES_DATA.length) * 100}%` }}
            />
          </div>

          {/* Case Title & Narrative */}
          <div style={{
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sage-700)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              <Search size={18} />
              <span>{currentCase.title}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({currentCase.theme})</span>
            </div>

            <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              "{currentCase.narrative}"
            </p>
          </div>

          {/* Question */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            {currentCase.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentCase.options.map(opt => {
              const isSelected = selectedOption === opt.key;
              const isCorrectOpt = opt.key === currentCase.correct;

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
                  onClick={() => handleSelectOption(opt.key)}
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

          {/* Feedback & Explanation */}
          {isAnswered && (
            <div style={{
              backgroundColor: selectedOption === currentCase.correct ? 'var(--sage-50)' : '#FFFBEB',
              border: `1px solid ${selectedOption === currentCase.correct ? 'var(--sage-200)' : '#FDE68A'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: selectedOption === currentCase.correct ? 'var(--sage-800)' : '#B45309', marginBottom: '0.4rem' }}>
                {selectedOption === currentCase.correct ? (
                  <>
                    <CheckCircle size={18} color="#16A34A" />
                    <span>Luar biasa! Penyelidikan Tepat (+{streak > 1 ? `40 + bonus ${ (streak-1)*10 }` : '40'} pts)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} color="#D97706" />
                    <span>Kurang tepat! Kunci yang benar adalah opsi {currentCase.correct}.</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                <strong>Penjelasan Detektif:</strong> {currentCase.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleNextCase}>
                <span>{currentStep < CASES_DATA.length - 1 ? 'Kasus Selanjutnya' : 'Selesaikan Misi Detektif'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--sage-100)',
            color: 'var(--sage-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Trophy size={36} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Misi Detektif Selesai! 🕵️‍♂️
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Kamu telah menuntaskan seluruh investigasi kata konkret, struktur teks, majas, dan kaidah kata depan teks deskripsi.
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
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--sage-700)' }}>{score} pts</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kasus Tepat</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A' }}>
                {answersLog.filter(a => a.isCorrect).length} / {CASES_DATA.length}
              </div>
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
