import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import {
  Home,
  User,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Award,
  Settings,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({
  currentRoute,
  onNavigate,
  mobileOpen,
  setMobileOpen,
  onLogoutClick
}) {
  const { user } = useAuth();

  const menuItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'profil', label: 'Profil Siswa', icon: User },
    { key: 'materi', label: 'Materi Belajar', icon: BookOpen },
    { key: 'quiz', label: 'Kuis Evaluasi', icon: HelpCircle },
    { key: 'game', label: 'Game Edukatif', icon: Gamepad2 },
    { key: 'capaian', label: 'Capaian Pembelajaran', icon: Award },
    { key: 'pengaturan', label: 'Pengaturan Akun', icon: Settings },
  ];

  const handleItemClick = (key) => {
    onNavigate(key);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="mobile-drawer-overlay mobile-open"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SINGLE Responsive Sidebar Element */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="brand-logo" onClick={() => handleItemClick('home')}>
          <div className="brand-icon-box">
            <svg
              width="24"
              height="24"
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="brand-text-title">Rumah Bunda</div>
            <span className="brand-badge">Kelas 7 SMP</span>
          </div>

          {/* Close button inside drawer for mobile */}
          {mobileOpen && (
            <button
              type="button"
              className="btn btn-outline btn-sm mobile-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
              style={{ padding: '0.35rem', border: 'none', marginLeft: 'auto' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="nav-menu">
          <div className="nav-section-label">MENU UTAMA</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleItemClick(item.key)}
              >
                <Icon size={19} className="nav-icon" />
                <span>{item.label}</span>
                {isActive && <span className="nav-active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile Area */}
        <div className="sidebar-bottom">
          <div
            className="user-chip"
            onClick={() => handleItemClick('profil')}
            title="Buka profil siswa"
            role="button"
            tabIndex={0}
          >
            <UserAvatar user={user} size={42} showBorder={true} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-chip-name">{user?.full_name || 'Siswa'}</div>
              <div className="user-chip-grade">@{user?.username || 'siswa'} • {user?.class_grade || 'VII SMP'}</div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-block btn-sm sidebar-logout-btn"
            onClick={onLogoutClick}
          >
            <LogOut size={15} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
