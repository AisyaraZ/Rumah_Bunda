import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, BookOpen, User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    identifier: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setErrorMsg('Username/Email dan kata sandi wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await login(formData.identifier, formData.password);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal login. Periksa kembali akun Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.username || !formData.email || !formData.password || !formData.confirm_password) {
      setErrorMsg('Harap lengkapi semua kolom pendaftaran.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await register({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password
      });
    } catch (err) {
      setErrorMsg(err.message || 'Pendaftaran gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-app)',
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(229, 237, 230, 0.7) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(222, 237, 244, 0.7) 0%, transparent 40%)'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-modal)',
        padding: '2.25rem',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--sage-100)',
            color: 'var(--sage-600)',
            marginBottom: '0.85rem'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--sage-700)', marginBottom: '0.25rem' }}>
            Rumah Bunda
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            LMS Belajar Mandiri Siswa Kelas 7 SMP
          </p>
        </div>

        {/* Form Mode Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: !isRegister ? 'white' : 'transparent',
              color: !isRegister ? 'var(--sage-700)' : 'var(--text-secondary)',
              boxShadow: !isRegister ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Masuk / Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: isRegister ? 'white' : 'transparent',
              color: isRegister ? 'var(--sage-700)' : 'var(--text-secondary)',
              boxShadow: isRegister ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Daftar / Buat Akun
          </button>
        </div>

        {/* Error message notice */}
        {errorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-md)',
            color: '#B91C1C',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.25rem'
          }}>
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">Username atau Email</label>
              <div className="password-input-wrapper">
                <input
                  id="identifier"
                  type="text"
                  name="identifier"
                  className="form-input"
                  placeholder="Contoh: rani_smp7 atau rani@email.com"
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Kata Sandi</label>
              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Masukkan kata sandi akun Anda"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '0.75rem' }}
            >
              {loading ? 'Memproses Masuk...' : 'Masuk ke Rumah Bunda'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Belum memiliki akun siswa? </span>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--sage-600)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Buat Akun Baru
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">Nama Lengkap Siswa</label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                className="form-input"
                placeholder="Contoh: Siti Nurhaliza"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-input"
                placeholder="Contoh: siti_nurhaliza"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hanya huruf, angka, dan underscore (3-20 karakter)</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="Contoh: siti@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Kata Sandi</label>
              <div className="password-input-wrapper">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm_password">Konfirmasi Kata Sandi</label>
              <div className="password-input-wrapper">
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  className="form-input"
                  placeholder="Ulangi kata sandi"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '0.75rem' }}
            >
              {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sudah terdaftar? </span>
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--sage-600)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Masuk di Sini
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
