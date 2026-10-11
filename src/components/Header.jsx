import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import {
  Menu,
  X,
  Sparkles,
  User,
  Settings,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function Header({
  currentRoute,
  onNavigate,
  mobileOpen,
  setMobileOpen
}) {
  const { user } = useAuth();

  const getPageTitle = (route) => {
    switch (route) {
      case 'home':
        return 'Beranda Belajar';
      case 'profil':
        return 'Profil Siswa';
      case 'materi':
        return 'Materi Pembelajaran';
      case 'quiz':
        return 'Kuis & Evaluasi';
      case 'game':
        return 'Permainan Edukatif';
      case 'capaian':
        return 'Capaian Pembelajaran';
      case 'pengaturan':
        return 'Pengaturan Akun';
      default:
        return 'LMS Rumah Bunda';
    }
  };

  return (
    <>
      {/* Mobile Top Bar (Visible only on mobile <= 768px) */}
      <header className="mobile-header">
        <div className="mobile-header-left">
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka menu navigasi"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div
            className="mobile-brand-wrapper"
            onClick={() => onNavigate('home')}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="mobile-brand-title">Rumah Bunda</span>
          </div>
        </div>

        <div
          className="mobile-header-right"
          onClick={() => onNavigate('profil')}
          role="button"
          tabIndex={0}
          title="Buka profil"
        >
          <UserAvatar user={user} size={34} showBorder={true} />
        </div>
      </header>

      {/* Desktop Topbar (Visible on screens > 768px) */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-greeting">
            <Sparkles size={18} className="topbar-sparkle-icon" />
            <span>
              Halo, <strong className="topbar-user-name">{user?.full_name || 'Siswa'}</strong>! Selamat belajar mandiri.
            </span>
          </div>

          <div className="topbar-breadcrumb">
            <span className="breadcrumb-root" onClick={() => onNavigate('home')}>LMS Rumah Bunda</span>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{getPageTitle(currentRoute)}</span>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className={`btn btn-sm ${currentRoute === 'profil' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onNavigate('profil')}
            title="Buka Halaman Profil"
          >
            <UserAvatar user={user} size={22} />
            <span>Profil Siswa</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm ${currentRoute === 'pengaturan' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onNavigate('pengaturan')}
            title="Buka Pengaturan Akun"
          >
            <Settings size={15} />
            <span>Pengaturan</span>
          </button>
        </div>
      </header>
    </>
  );
}
