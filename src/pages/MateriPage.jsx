import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { Calculator, Languages, BookOpen, Atom, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MateriPage({ onSelectSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await fetchApi('/subjects');
        setSubjects(data.subjects);
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  const getSubjectIcon = (iconName) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator size={32} />;
      case 'Languages':
        return <Languages size={32} />;
      case 'BookOpen':
        return <BookOpen size={32} />;
      case 'Atom':
        return <Atom size={32} />;
      default:
        return <BookOpen size={32} />;
    }
  };

  const getThemeStyles = (theme) => {
    switch (theme) {
      case 'blue':
        return {
          bg: 'var(--blue-50)',
          iconColor: 'var(--blue-600)',
          badgeClass: 'badge-blue',
          fillClass: 'progress-fill-blue'
        };
      case 'sage':
        return {
          bg: 'var(--sage-50)',
          iconColor: 'var(--sage-600)',
          badgeClass: 'badge-sage',
          fillClass: 'progress-fill'
        };
      case 'amber':
        return {
          bg: 'var(--cream-50)',
          iconColor: 'var(--cream-500)',
          badgeClass: 'badge-amber',
          fillClass: 'progress-fill'
        };
      case 'teal':
        return {
          bg: '#F0FDF4',
          iconColor: '#15803D',
          badgeClass: 'badge-success',
          fillClass: 'progress-fill'
        };
      default:
        return {
          bg: 'var(--sage-50)',
          iconColor: 'var(--sage-600)',
          badgeClass: 'badge-sage',
          fillClass: 'progress-fill'
        };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Materi Pembelajaran</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Pilih salah satu dari 4 mata pelajaran kelas VII SMP berikut untuk mempelajari bab dan kompetensi dasar.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Memuat daftar mata pelajaran...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {subjects.map((sub) => {
            const styles = getThemeStyles(sub.color_theme);
            return (
              <div
                key={sub.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                  borderTop: `4px solid ${styles.iconColor}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: styles.bg,
                      color: styles.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getSubjectIcon(sub.icon)}
                    </div>

                    <span className={`badge ${styles.badgeClass}`}>
                      {sub.total_chapters} Bab
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                    {sub.name}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '40px' }}>
                    {sub.description}
                  </p>
                </div>

                <div>
                  {/* Progress Indicator */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      <span>Progres Tuntas</span>
                      <span>{sub.completed_chapters} / {sub.total_chapters} Bab ({sub.progress_percentage}%)</span>
                    </div>
                    <div className="progress-track" style={{ height: '7px' }}>
                      <div className={`progress-fill ${styles.fillClass}`} style={{ width: `${sub.progress_percentage}%` }}></div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => onSelectSubject(sub.slug)}
                  >
                    <span>Lihat Materi</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
