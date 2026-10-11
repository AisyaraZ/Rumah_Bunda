import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import UserAvatar from '../components/UserAvatar';
import ConfirmModal from '../components/ConfirmModal';
import {
  Settings,
  User,
  Camera,
  Upload,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  Palette,
  BarChart2,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  School,
  IdCard,
  Mail,
  GraduationCap,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function PengaturanPage({ activeTab = 'info', onChangeTab }) {
  const {
    user,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    logout,
    showToast
  } = useAuth();

  // Internal tab state synced with prop
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (onChangeTab) {
      onChangeTab(tab);
    }
  };

  // -------------------------------------------------------------
  // TAB A: FOTO PROFIL & IDENTITAS
  // -------------------------------------------------------------
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileError, setAvatarFileError] = useState('');
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setAvatarFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarFileError('Format file harus berupa JPG, JPEG, PNG, atau WebP.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarFileError('Ukuran file maksimal adalah 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!avatarPreview) return;
    try {
      setSavingAvatar(true);
      setAvatarFileError('');
      await uploadAvatar(avatarPreview);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setAvatarFileError(err.message || 'Gagal menyimpan foto profil.');
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleCancelAvatarPreview = () => {
    setAvatarPreview(null);
    setAvatarFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus foto profil dan kembali ke avatar inisial?')) {
      return;
    }
    try {
      setSavingAvatar(true);
      await deleteAvatar();
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      showToast(err.message || 'Gagal menghapus foto profil.', 'error');
    } finally {
      setSavingAvatar(false);
    }
  };

  // -------------------------------------------------------------
  // TAB B: INFORMASI AKUN
  // -------------------------------------------------------------
  const [infoForm, setInfoForm] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    school_name: user?.school_name || 'SMP Negeri 1 Rumah Bunda',
    education_level: user?.education_level || 'Sekolah Menengah Pertama (SMP)',
    bio: user?.bio || ''
  });
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');

  // Keep info form in sync with user changes
  useEffect(() => {
    if (user) {
      setInfoForm({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        school_name: user.school_name || 'SMP Negeri 1 Rumah Bunda',
        education_level: user.education_level || 'Sekolah Menengah Pertama (SMP)',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');

    // Validations
    if (!infoForm.full_name || infoForm.full_name.trim().length < 2) {
      setInfoError('Nama lengkap minimal 2 karakter.');
      return;
    }

    if (!infoForm.username || !/^[a-zA-Z0-9_]{3,20}$/.test(infoForm.username.trim())) {
      setInfoError('Username hanya boleh berupa huruf, angka, dan garis bawah (3-20 karakter).');
      return;
    }

    if (!infoForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(infoForm.email.trim())) {
      setInfoError('Format alamat email tidak valid.');
      return;
    }

    try {
      setSavingInfo(true);
      await updateProfile(infoForm);
      setInfoSuccess('Informasi akun berhasil disimpan!');
      setTimeout(() => setInfoSuccess(''), 4000);
    } catch (err) {
      setInfoError(err.message || 'Gagal menyimpan perubahan informasi akun.');
    } finally {
      setSavingInfo(false);
    }
  };

  // -------------------------------------------------------------
  // TAB C: KEAMANAN AKUN (PASSWORD)
  // -------------------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_new_password) {
      setPasswordError('Semua kolom kata sandi wajib diisi.');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok dengan kata sandi baru.');
      return;
    }

    try {
      setSavingPassword(true);
      await fetchApi('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordForm)
      });

      setPasswordSuccess('Kata sandi Anda berhasil diperbarui dengan aman!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_new_password: ''
      });
      showToast('Kata sandi berhasil diubah.', 'success');
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (err) {
      setPasswordError(err.message || 'Gagal mengubah kata sandi. Periksa kata sandi saat ini.');
    } finally {
      setSavingPassword(false);
    }
  };

  // -------------------------------------------------------------
  // TAB D: PENGGUNAAN LMS & PREFERENSI
  // -------------------------------------------------------------
  // Preferences
  const [notifications, setNotifications] = useState(() => {
    try {
      return user?.notification_pref ? JSON.parse(user.notification_pref) : { reminder: true, quiz: true, announcement: true };
    } catch {
      return { reminder: true, quiz: true, announcement: true };
    }
  });

  const [fontSizePref, setFontSizePref] = useState(() => localStorage.getItem('rb_fontsize') || 'normal');
  const [themePref, setThemePref] = useState(() => user?.theme_pref || 'sage');
  const [savingPref, setSavingPref] = useState(false);

  // Learning Stats from DB
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Logout modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoadingStats(true);
        const data = await fetchApi('/progress/summary');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats in settings:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
  };

  const handleSavePreferences = async () => {
    try {
      setSavingPref(true);
      await updateProfile({
        notification_pref: notifications,
        theme_pref: themePref
      });
      showToast('Preferensi penggunaan LMS berhasil disimpan!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan preferensi.', 'error');
    } finally {
      setSavingPref(false);
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSizePref(size);
    localStorage.setItem('rb_fontsize', size);
    document.documentElement.style.fontSize = size === 'large' ? '17px' : '16px';
    showToast(`Ukuran teks diatur ke mode ${size === 'large' ? 'Besar' : 'Standar'}.`, 'success');
  };

  return (
    <div className="settings-page-container">
      {/* Page Title & Description */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Pengaturan Akun Siswa
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Kelola foto identitas, informasi akun, keamanan kata sandi, dan preferensi belajar mandiri di Rumah Bunda.
        </p>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="settings-tab-bar">
        <button
          type="button"
          className={`settings-tab-btn ${currentTab === 'foto' ? 'active' : ''}`}
          onClick={() => handleTabChange('foto')}
        >
          <Camera size={17} />
          <span>Foto & Identitas</span>
        </button>

        <button
          type="button"
          className={`settings-tab-btn ${currentTab === 'info' ? 'active' : ''}`}
          onClick={() => handleTabChange('info')}
        >
          <User size={17} />
          <span>Informasi Akun</span>
        </button>

        <button
          type="button"
          className={`settings-tab-btn ${currentTab === 'keamanan' ? 'active' : ''}`}
          onClick={() => handleTabChange('keamanan')}
        >
          <Lock size={17} />
          <span>Keamanan Kata Sandi</span>
        </button>

        <button
          type="button"
          className={`settings-tab-btn ${currentTab === 'penggunaan' ? 'active' : ''}`}
          onClick={() => handleTabChange('penggunaan')}
        >
          <BarChart2 size={17} />
          <span>Penggunaan LMS</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="settings-content-wrapper" style={{ maxWidth: '820px' }}>
        {/* ========================================================= */}
        {/* TAB A: FOTO & IDENTITAS AKUN                              */}
        {/* ========================================================= */}
        {currentTab === 'foto' && (
          <div className="card settings-card">
            <div className="settings-section-header">
              <Camera size={20} color="var(--sage-600)" />
              <div>
                <h2 className="settings-section-title">Foto Profil & Identitas Visual</h2>
                <p className="settings-section-desc">
                  Unggah foto profil agar akun belajarmu mudah dikenali. Foto akan tampil di header, sidebar, dan profil.
                </p>
              </div>
            </div>

            {avatarFileError && (
              <div className="alert-message error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{avatarFileError}</span>
              </div>
            )}

            <div className="avatar-upload-section">
              <div className="avatar-display-box">
                {/* Preview Image if selected, else current avatar */}
                {avatarPreview ? (
                  <div className="avatar-preview-container">
                    <img
                      src={avatarPreview}
                      alt="Pratinjau Foto Baru"
                      className="avatar-preview-img"
                    />
                    <span className="avatar-preview-badge">Pratinjau Baru</span>
                  </div>
                ) : (
                  <div className="avatar-current-container">
                    <UserAvatar user={user} size={110} showBorder={true} />
                    <span className="avatar-current-label">Foto Saat Ini</span>
                  </div>
                )}
              </div>

              <div className="avatar-controls-box">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  style={{ display: 'none' }}
                  id="avatar-file-input"
                />

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={savingAvatar}
                  >
                    <Upload size={16} />
                    <span>{user?.avatar && user.avatar.startsWith('data:') ? 'Ganti Foto' : 'Unggah Foto Baru'}</span>
                  </button>

                  {user?.avatar && user.avatar.startsWith('data:') && !avatarPreview && (
                    <button
                      type="button"
                      className="btn btn-danger-outline"
                      onClick={handleDeleteAvatar}
                      disabled={savingAvatar}
                    >
                      <Trash2 size={16} />
                      <span>Hapus Foto</span>
                    </button>
                  )}
                </div>

                {avatarPreview && (
                  <div className="avatar-confirm-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveAvatar}
                      disabled={savingAvatar}
                    >
                      <Save size={16} />
                      <span>{savingAvatar ? 'Menyimpan...' : 'Simpan Foto Profil'}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleCancelAvatarPreview}
                      disabled={savingAvatar}
                    >
                      Batal
                    </button>
                  </div>
                )}

                <div className="avatar-upload-notes">
                  <p>• Format yang didukung: <strong>JPG, JPEG, PNG, WebP</strong></p>
                  <p>• Batas maksimal ukuran file: <strong>5 MB</strong></p>
                  <p>• Foto akan tersimpan permanen di database dan tetap tampil setelah logout dan login kembali.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB B: INFORMASI AKUN                                     */}
        {/* ========================================================= */}
        {currentTab === 'info' && (
          <div className="card settings-card">
            <div className="settings-section-header">
              <User size={20} color="var(--sage-600)" />
              <div>
                <h2 className="settings-section-title">Informasi Data Akun Siswa</h2>
                <p className="settings-section-desc">
                  Perbarui nama lengkap, username, email, dan asal sekolahmu untuk keperluan administrasi belajar.
                </p>
              </div>
            </div>

            {infoError && (
              <div className="alert-message error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{infoError}</span>
              </div>
            )}

            {infoSuccess && (
              <div className="alert-message success" style={{ marginBottom: '1.25rem' }}>
                <CheckCircle size={18} />
                <span>{infoSuccess}</span>
              </div>
            )}

            <form onSubmit={handleInfoSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="info-fullname">
                    Nama Lengkap Siswa <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="info-fullname"
                    type="text"
                    className="form-input"
                    value={infoForm.full_name}
                    onChange={(e) => setInfoForm({ ...infoForm, full_name: e.target.value })}
                    placeholder="Contoh: Aisyah Putri"
                    required
                  />
                  <span className="form-hint">Nama asli siswa untuk pencatatan sertifikat & capaian.</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="info-username">
                    Nama Pengguna (Username) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="info-username"
                    type="text"
                    className="form-input"
                    value={infoForm.username}
                    onChange={(e) => setInfoForm({ ...infoForm, username: e.target.value })}
                    placeholder="Contoh: aisyah_smp7"
                    required
                  />
                  <span className="form-hint">Hanya huruf, angka, dan garis bawah (3-20 karakter).</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="info-email">
                    Alamat Email <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="info-email"
                    type="email"
                    className="form-input"
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    placeholder="Contoh: aisyah@rumahbunda.id"
                    required
                  />
                  <span className="form-hint">Digunakan untuk login dan notifikasi belajar.</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="info-school">
                    Nama Asal Sekolah
                  </label>
                  <input
                    id="info-school"
                    type="text"
                    className="form-input"
                    value={infoForm.school_name}
                    onChange={(e) => setInfoForm({ ...infoForm, school_name: e.target.value })}
                    placeholder="Contoh: SMP Negeri 1 Rumah Bunda"
                  />
                  <span className="form-hint">Sekolah tempat siswa menempuh pendidikan kelas 7.</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Tingkat Kelas & Jenjang</label>
                  <input
                    type="text"
                    className="form-input"
                    value={`${user?.class_grade || 'Kelas VII SMP'} (${infoForm.education_level})`}
                    disabled
                    style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                  />
                  <span className="form-hint">Ditetapkan untuk kurikulum Kelas 7 SMP Semester 1.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">ID Akun Siswa (Permanen)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={`RB-${String(user?.id || 1).padStart(4, '0')}`}
                    disabled
                    style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                  />
                  <span className="form-hint">Nomor identitas unik siswa dalam database Rumah Bunda.</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="info-bio">Catatan & Motivasi Belajar</label>
                <textarea
                  id="info-bio"
                  className="form-textarea"
                  rows="3"
                  value={infoForm.bio}
                  onChange={(e) => setInfoForm({ ...infoForm, bio: e.target.value })}
                  placeholder="Tuliskan target atau motivasi belajarmu di Rumah Bunda..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingInfo}
                >
                  <Save size={16} />
                  <span>{savingInfo ? 'Menyimpan...' : 'Simpan Perubahan Akun'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB C: KEAMANAN KATA SANDI                                */}
        {/* ========================================================= */}
        {currentTab === 'keamanan' && (
          <div className="card settings-card">
            <div className="settings-section-header">
              <Lock size={20} color="var(--blue-600)" />
              <div>
                <h2 className="settings-section-title">Keamanan Kata Sandi Akun</h2>
                <p className="settings-section-desc">
                  Ganti kata sandi secara berkala untuk menjaga keamanan akun. Kata sandi dienkripsi dengan standar bcrypt.
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="alert-message error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="alert-message success" style={{ marginBottom: '1.25rem' }}>
                <CheckCircle size={18} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="current-pw">
                  Kata Sandi Saat Ini <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="current-pw"
                    type={showCurrentPw ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Masukkan kata sandi lama Anda"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    aria-label="Toggle password visibility"
                  >
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="new-pw">
                    Kata Sandi Baru <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="new-pw"
                      type={showNewPw ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Minimal 6 karakter"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPw(!showNewPw)}
                      aria-label="Toggle password visibility"
                    >
                      {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <span className="form-hint">Gunakan kombinasi huruf dan angka agar kuat.</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-new-pw">
                    Konfirmasi Kata Sandi Baru <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirm-new-pw"
                      type={showConfirmPw ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Ulangi kata sandi baru"
                      value={passwordForm.confirm_new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_new_password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingPassword}
                >
                  <ShieldCheck size={16} />
                  <span>{savingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB D: PENGGUNAAN LMS & PREFERENSI                        */}
        {/* ========================================================= */}
        {currentTab === 'penggunaan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Bagian 1: Preferensi Notifikasi */}
            <div className="card settings-card">
              <div className="settings-section-header">
                <Bell size={20} color="var(--sage-600)" />
                <div>
                  <h2 className="settings-section-title">Preferensi Notifikasi Belajar</h2>
                  <p className="settings-section-desc">
                    Atur pemberitahuan untuk membantu menjaga konsistensi belajar mandiri setiap hari.
                  </p>
                </div>
              </div>

              <div className="pref-list">
                <div className="pref-item">
                  <div className="pref-info">
                    <span className="pref-title">Pengingat Jadwal Belajar Harian</span>
                    <span className="pref-desc">Dapatkan pengingat untuk melanjutkan subbab materi yang belum selesai.</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={!!notifications.reminder}
                      onChange={() => handleNotificationToggle('reminder')}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="pref-item">
                  <div className="pref-info">
                    <span className="pref-title">Notifikasi Evaluasi & Nilai Kuis</span>
                    <span className="pref-desc">Tampilkan hasil pencapaian dan ulasan kunci jawaban setelah submit kuis.</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={!!notifications.quiz}
                      onChange={() => handleNotificationToggle('quiz')}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="pref-item">
                  <div className="pref-info">
                    <span className="pref-title">Pembaruan Materi & Tantangan Game Baru</span>
                    <span className="pref-desc">Informasi ketika modul bab baru atau level permainan baru tersedia.</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={!!notifications.announcement}
                      onChange={() => handleNotificationToggle('announcement')}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSavePreferences}
                  disabled={savingPref}
                >
                  <Save size={15} />
                  <span>{savingPref ? 'Menyimpan...' : 'Simpan Preferensi Notifikasi'}</span>
                </button>
              </div>
            </div>

            {/* Bagian 2: Preferensi Tampilan */}
            <div className="card settings-card">
              <div className="settings-section-header">
                <Palette size={20} color="var(--amber-600)" />
                <div>
                  <h2 className="settings-section-title">Preferensi Tampilan Antarmuka</h2>
                  <p className="settings-section-desc">
                    Sesuaikan kenyamanan membaca materi teks dan rumus agar proses belajar semakin menyenangkan.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Ukuran Huruf Teks Bacaan</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Menyesuaikan ukuran teks artikel materi dan soal evaluasi.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${fontSizePref === 'normal' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleFontSizeChange('normal')}
                  >
                    Standar (16px)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${fontSizePref === 'large' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleFontSizeChange('large')}
                  >
                    Besar Nyaman (17px)
                  </button>
                </div>
              </div>
            </div>

            {/* Bagian 3: Statistik Penggunaan LMS Nyata */}
            <div className="card settings-card">
              <div className="settings-section-header">
                <BarChart2 size={20} color="var(--blue-600)" />
                <div>
                  <h2 className="settings-section-title">Statistik Penggunaan LMS</h2>
                  <p className="settings-section-desc">
                    Rekaman asli aktivitas pembelajaran akunmu yang tersimpan permanen di database Rumah Bunda.
                  </p>
                </div>
              </div>

              {loadingStats ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                  Memuat statistik penggunaan...
                </div>
              ) : (
                <div className="settings-stats-grid">
                  <div className="settings-stat-item">
                    <span className="settings-stat-val">{stats?.completed_chapters || 0} Bab</span>
                    <span className="settings-stat-lbl">Materi Tuntas ({stats?.overall_percentage || 0}%)</span>
                  </div>

                  <div className="settings-stat-item">
                    <span className="settings-stat-val">{stats?.total_quizzes || 0} Kali</span>
                    <span className="settings-stat-lbl">Kuis Dikerjakan</span>
                  </div>

                  <div className="settings-stat-item">
                    <span className="settings-stat-val">{stats?.total_games_played || 0} Kali</span>
                    <span className="settings-stat-lbl">Game Dimainkan</span>
                  </div>

                  <div className="settings-stat-item">
                    <span className="settings-stat-val">{stats?.avg_quiz_score || 0} pts</span>
                    <span className="settings-stat-lbl">Rata-Rata Nilai</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bagian 4: Zona Keluar Akun */}
            <div className="card settings-card" style={{ borderColor: '#FECACA', backgroundColor: '#FFFDFD' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#B91C1C', marginBottom: '0.2rem' }}>
                    Keluar dari Akun Siswa (Logout)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Seluruh progres bab, nilai kuis, dan skor gamemu tersimpan aman di database permanen.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowLogoutConfirm(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <LogOut size={16} />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Logout */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Konfirmasi Keluar dari LMS"
        message="Apakah Anda yakin ingin keluar dari akun Rumah Bunda saat ini? Semua progres belajar tetap tersimpan aman."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isDanger={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
