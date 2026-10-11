import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import UserAvatar from '../components/UserAvatar';
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  School,
  IdCard,
  Edit3,
  CheckCircle,
  BookOpen,
  Award,
  Gamepad2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function ProfilPage({ onEditProfile }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      try {
        setLoadingStats(true);
        const [sumData, actData] = await Promise.all([
          fetchApi('/progress/summary').catch(() => null),
          fetchApi('/progress/activities').catch(() => ({ activities: [] }))
        ]);

        if (isMounted) {
          if (sumData) setSummary(sumData);
          if (actData?.activities) setActivities(actData.activities.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load profile learning stats:', err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Format ID Siswa (e.g. RB-0001)
  const studentId = user?.id ? `RB-${String(user.id).padStart(4, '0')}` : 'RB-0001';

  // Format tanggal bergabung
  const formattedJoinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '11 Oktober 2026';

  const handleEditClick = (targetTab = 'info') => {
    if (onEditProfile) {
      onEditProfile(targetTab);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz_completed':
        return <Award size={16} color="var(--blue-600)" />;
      case 'game_played':
        return <Gamepad2 size={16} color="var(--amber-600)" />;
      case 'chapter_completed':
      case 'chapter_read':
        return <BookOpen size={16} color="var(--sage-600)" />;
      default:
        return <Sparkles size={16} color="var(--sage-500)" />;
    }
  };

  const formatActivityTime = (dateStr) => {
    if (!dateStr) return 'Baru saja';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="profile-page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Profil Siswa
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Data diri resmi dan rekapitulasi progres belajar mandiri di Rumah Bunda.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleEditClick('info')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Edit3 size={16} />
            <span>Edit Profil</span>
          </button>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* KOLOM KIRI: KARTU IDENTITAS SISWA UTAMA */}
        <div className="profile-left-col">
          <div className="card profile-badge-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div className="profile-avatar-wrapper" style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
              <UserAvatar user={user} size={96} showBorder={true} />
              <button
                type="button"
                className="avatar-change-badge-btn"
                onClick={() => handleEditClick('foto')}
                title="Ganti Foto Profil"
              >
                <Edit3 size={14} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {user?.full_name || 'Nama Siswa'}
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              @{user?.username || 'username'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span className="badge badge-sage">
                <GraduationCap size={14} />
                <span>{user?.class_grade || 'Kelas VII SMP'}</span>
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)', borderColor: 'var(--blue-200)' }}>
                <ShieldCheck size={14} />
                <span>Akun Terverifikasi</span>
              </span>
            </div>

            {/* Quick Meta List */}
            <div className="profile-meta-list">
              <div className="profile-meta-item">
                <IdCard size={16} className="profile-meta-icon" />
                <div className="profile-meta-content">
                  <span className="profile-meta-label">ID Siswa</span>
                  <span className="profile-meta-value">{studentId}</span>
                </div>
              </div>

              <div className="profile-meta-item">
                <School size={16} className="profile-meta-icon" />
                <div className="profile-meta-content">
                  <span className="profile-meta-label">Asal Sekolah</span>
                  <span className="profile-meta-value">{user?.school_name || 'SMP Negeri 1 Rumah Bunda'}</span>
                </div>
              </div>

              <div className="profile-meta-item">
                <Mail size={16} className="profile-meta-icon" />
                <div className="profile-meta-content">
                  <span className="profile-meta-label">Email Terdaftar</span>
                  <span className="profile-meta-value">{user?.email || 'siswa@rumahbunda.id'}</span>
                </div>
              </div>

              <div className="profile-meta-item">
                <Calendar size={16} className="profile-meta-icon" />
                <div className="profile-meta-content">
                  <span className="profile-meta-label">Tanggal Bergabung</span>
                  <span className="profile-meta-value">{formattedJoinDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Action to Settings */}
            <button
              type="button"
              className="btn btn-outline btn-block btn-sm"
              onClick={() => handleEditClick('foto')}
              style={{ marginTop: '1.5rem', gap: '0.5rem' }}
            >
              <span>Kelola Foto & Keamanan</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: DETAIL INFORMASI & REKAPITULASI PROGRES NYATA */}
        <div className="profile-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* KARTU 1: DETAIL INFORMASI AKUN LENGKAP */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <User size={19} color="var(--sage-600)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Informasi Data Diri
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleEditClick('info')}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                Ubah Data
              </button>
            </div>

            <div className="profile-details-grid">
              <div className="profile-field-box">
                <span className="profile-field-title">Nama Lengkap</span>
                <span className="profile-field-data">{user?.full_name || '-'}</span>
              </div>

              <div className="profile-field-box">
                <span className="profile-field-title">Username / ID Akun</span>
                <span className="profile-field-data">@{user?.username || '-'} ({studentId})</span>
              </div>

              <div className="profile-field-box">
                <span className="profile-field-title">Alamat Email</span>
                <span className="profile-field-data">{user?.email || '-'}</span>
              </div>

              <div className="profile-field-box">
                <span className="profile-field-title">Tingkat & Jenjang Belajar</span>
                <span className="profile-field-data">{user?.class_grade || 'Kelas VII SMP'} • {user?.education_level || 'Sekolah Menengah Pertama (SMP)'}</span>
              </div>

              <div className="profile-field-box">
                <span className="profile-field-title">Nama Asal Sekolah</span>
                <span className="profile-field-data">{user?.school_name || 'SMP Negeri 1 Rumah Bunda'}</span>
              </div>

              <div className="profile-field-box">
                <span className="profile-field-title">Status Akun Belajar</span>
                <span className="profile-field-data" style={{ color: 'var(--sage-700)', fontWeight: 700 }}>
                  ● Aktif (Pembelajaran Mandiri)
                </span>
              </div>

              <div className="profile-field-box" style={{ gridColumn: '1 / -1' }}>
                <span className="profile-field-title">Catatan & Motivasi Belajar</span>
                <span className="profile-field-data" style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>
                  {user?.bio || 'Siswa aktif kelas VII SMP di platform belajar mandiri Rumah Bunda. Siap mengeksplorasi ilmu dan meraih prestasi!'}
                </span>
              </div>
            </div>
          </div>

          {/* KARTU 2: REKAPITULASI CAPAIAN BELAJAR NYATA */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <TrendingUp size={19} color="var(--sage-600)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Ringkasan Aktivitas & Capaian Belajar
                </h3>
              </div>
              <span className="badge badge-sage" style={{ fontSize: '0.75rem' }}>
                Data Riil Database
              </span>
            </div>

            {loadingStats ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Memuat statistik belajar...
              </div>
            ) : (
              <div className="profile-stats-grid">
                {/* 1. Materi Tuntas */}
                <div className="profile-stat-card">
                  <div className="profile-stat-header">
                    <CheckCircle size={18} color="var(--sage-600)" />
                    <span className="profile-stat-label">Bab Tuntas</span>
                  </div>
                  <div className="profile-stat-number">
                    {summary ? `${summary.completed_chapters} Bab` : '0 Bab'}
                  </div>
                  <div className="profile-stat-sub">
                    dari total {summary?.total_chapters || 6} bab ({summary?.overall_percentage || 0}%)
                  </div>
                </div>

                {/* 2. Kuis Dikerjakan */}
                <div className="profile-stat-card">
                  <div className="profile-stat-header">
                    <Award size={18} color="var(--blue-600)" />
                    <span className="profile-stat-label">Kuis Dikerjakan</span>
                  </div>
                  <div className="profile-stat-number">
                    {summary ? summary.total_quizzes : 0} Kali
                  </div>
                  <div className="profile-stat-sub">
                    Rata-rata: {summary?.avg_quiz_score || 0} pts (Maks: {summary?.max_quiz_score || 0})
                  </div>
                </div>

                {/* 3. Tantangan Game */}
                <div className="profile-stat-card">
                  <div className="profile-stat-header">
                    <Gamepad2 size={18} color="var(--amber-600)" />
                    <span className="profile-stat-label">Game Edukatif</span>
                  </div>
                  <div className="profile-stat-number">
                    {summary ? (summary.total_games_played || 0) : 0} Kali
                  </div>
                  <div className="profile-stat-sub">
                    Rekor Terbaik: {summary?.best_game_score || 0} Poin
                  </div>
                </div>
              </div>
            )}

            {/* Riwayat Aktivitas Belajar Terkini */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={16} color="var(--text-muted)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Aktivitas Belajar Terakhir
                </h4>
              </div>

              {activities.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '0.5rem 0' }}>
                  Belum ada aktivitas tercatat. Mulailah membuka materi di menu Materi!
                </div>
              ) : (
                <div className="profile-activity-timeline">
                  {activities.map((act) => (
                    <div key={act.id} className="activity-timeline-item">
                      <div className="activity-timeline-dot">
                        {getActivityIcon(act.activity_type)}
                      </div>
                      <div className="activity-timeline-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span className="activity-timeline-title">{act.title}</span>
                          <span className="activity-timeline-time">{formatActivityTime(act.created_at)}</span>
                        </div>
                        <p className="activity-timeline-desc">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
