import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import PetualanganBilanganBulatGame from './games/PetualanganBilanganBulatGame';
import MisiPecahanGame from './games/MisiPecahanGame';
import EkspedisiRasioSkalaGame from './games/EkspedisiRasioSkalaGame';
import DetektifTeksDeskripsiGame from './games/DetektifTeksDeskripsiGame';
import PetualanganDuniaImajinasiGame from './games/PetualanganDuniaImajinasiGame';
import SusunLangkahTepatGame from './games/SusunLangkahTepatGame';
import MathGameRunner from './MathGameRunner';
import { Gamepad2, Trophy, Play, Clock, Sparkles, Compass, PieChart, MapPin, Search, ListOrdered, Zap, Scroll } from 'lucide-react';

export default function GamePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        const data = await fetchApi('/games');
        setGames(data.games);
      } catch (err) {
        console.error('Failed to load games:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, [activeGame]);

  if (activeGame) {
    if (activeGame.slug === 'petualangan-bilangan-bulat') {
      return <PetualanganBilanganBulatGame game={activeGame} onBack={() => setActiveGame(null)} />;
    }
    if (activeGame.slug === 'misi-pecahan') {
      return <MisiPecahanGame game={activeGame} onBack={() => setActiveGame(null)} />;
    }
    if (activeGame.slug === 'ekspedisi-rasio-skala') {
      return <EkspedisiRasioSkalaGame game={activeGame} onBack={() => setActiveGame(null)} />;
    }
    if (activeGame.slug === 'detektif-teks-deskripsi') {
      return <DetektifTeksDeskripsiGame game={activeGame} onBack={() => setActiveGame(null)} />;
    }
    if (activeGame.slug === 'petualangan-dunia-imajinasi') {
      return <PetualanganDuniaImajinasiGame game={activeGame} onBack={() => setActiveGame(null)} />;
    }
    if (activeGame.slug === 'susun-langkah-tepat') {
      return <SusunLangkahTepatGame game={activeGame} onBack={() => setActiveGame(null)} />;
    }
    return <MathGameRunner game={activeGame} onBack={() => setActiveGame(null)} />;
  }

  const getGameIcon = (iconName, slug) => {
    if (slug === 'detektif-teks-deskripsi' || iconName === 'Search') return <Search size={28} />;
    if (slug === 'petualangan-dunia-imajinasi' || iconName === 'Sparkles') return <Sparkles size={28} />;
    if (slug === 'susun-langkah-tepat' || iconName === 'ListOrdered') return <ListOrdered size={28} />;
    if (slug === 'petualangan-bilangan-bulat' || iconName === 'Compass') return <Compass size={28} />;
    if (slug === 'misi-pecahan' || iconName === 'PieChart') return <PieChart size={28} />;
    if (slug === 'ekspedisi-rasio-skala' || iconName === 'MapPin') return <MapPin size={28} />;
    if (iconName === 'Zap') return <Zap size={28} />;
    if (iconName === 'Scroll') return <Scroll size={28} />;
    return <Gamepad2 size={28} />;
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Permainan Edukatif Pembelajaran</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Belajar sambil bermain! Taklukkan tantangan edukatif Matematika dan Bahasa Indonesia kelas VII SMP dan raih skor terbaikmu.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Memuat daftar permainan edukatif...
        </div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-box">
            <Gamepad2 size={32} />
          </div>
          <div className="empty-title">Game edukatif akan segera tersedia</div>
          <p className="empty-desc">
            Modul permainan sedang disiapkan untuk memperkaya pengalaman belajar mandiri siswa kelas VII SMP.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {games.map((g) => {
            const isPlayable = g.is_active === 1;

            return (
              <div
                key={g.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                  opacity: isPlayable ? 1 : 0.85
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isPlayable ? 'var(--sage-100)' : 'var(--bg-subtle)',
                      color: isPlayable ? 'var(--sage-700)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getGameIcon(g.icon, g.slug)}
                    </div>

                    {isPlayable ? (
                      <span className="badge badge-sage">
                        {g.subject_name || 'Matematika'}
                      </span>
                    ) : (
                      <span className="badge badge-gray">
                        Segera Hadir
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                    {g.name}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '44px' }}>
                    {g.description}
                  </p>

                  {/* Best Score or Status info */}
                  {isPlayable ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      marginBottom: '1.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <Trophy size={16} color="var(--amber-500)" />
                      <span>Skor Terbaik: <strong>{g.highest_score ? `${g.highest_score} Poin` : 'Belum Ada'}</strong></span>
                      {g.play_count > 0 && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Dimainkan {g.play_count}x
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      marginBottom: '1.5rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>
                      Game edukatif akan segera tersedia untuk mata pelajaran {g.subject_name}.
                    </div>
                  )}
                </div>

                {/* Mainkan Button only for active playable games */}
                {isPlayable ? (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => setActiveGame(g)}
                  >
                    <Play size={16} />
                    <span>Mainkan Sekarang</span>
                  </button>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    Segera Hadir
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
