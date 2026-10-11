import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import {
  Home,
  User,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ currentRoute, onNavigate }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { key: 'home', label: 'Home', icon: Home, path: '/home' },
    { key: 'profil', label: 'Profil', icon: User, path: '/profil' },
    { key: 'materi', label: 'Materi', icon: BookOpen, path: '/materi' },
    { key: 'quiz', label: 'Quiz', icon: HelpCircle, path: '/quiz' },
    { key: 'game', label: 'Game', icon: Gamepad2, path: '/game' },
    { key: 'capaian', label: 'Capaian Pembelajaran', icon: Award, path: '/capaian' },
    { key: 'pengaturan', label: 'Pengaturan', icon: Settings, path: '/pengaturan' },
  ];

  const handleNavClick = (key) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div className="brand-logo" onClick={() => handleNavClick('home')}>
        <div className="brand-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div>
          <div className="brand-text-title">Rumah Bunda</div>
          <span className="brand-badge">Kelas 7 SMP</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.key;
          return (
            <button
              key={item.key}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.key)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom User Area */}
      <div className="sidebar-bottom">
        <div className="user-chip" onClick={() => handleNavClick('profil')}>
          <div className="avatar-circle">
            {getInitials(user?.full_name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-chip-name">{user?.full_name || 'Siswa'}</div>
            <div className="user-chip-grade">Kelas VII SMP</div>
          </div>
        </div>

        <button
          className="btn btn-outline btn-block btn-sm"
          style={{ marginTop: '0.75rem', gap: '0.5rem', color: '#B91C1C', borderColor: '#FECACA' }}
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut size={15} />
          <span>Keluar</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {renderNavContent()}
      </aside>

      {/* Mobile Header Bar */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} onClick={() => handleNavClick('home')}>
          <div className="brand-icon-box" style={{ width: '34px', height: '34px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--sage-700)' }}>Rumah Bunda</span>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          style={{ padding: '0.4rem', border: 'none' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop Topbar */}
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--sage-500)" />
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Halo, <strong style={{ color: 'var(--text-primary)' }}>{user?.full_name || 'Siswa'}</strong>! Selamat belajar mandiri.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handleNavClick('profil')}
            title="Buka Profil"
          >
            <User size={15} />
            <span>Profil</span>
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handleNavClick('pengaturan')}
            title="Buka Pengaturan"
          >
            <Settings size={15} />
            <span>Pengaturan</span>
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun LMS Rumah Bunda? Progres belajar Anda tetap tersimpan dengan aman di database."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isDanger={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
