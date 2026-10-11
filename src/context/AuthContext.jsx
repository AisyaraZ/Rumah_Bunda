import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadUser = async () => {
    const token = localStorage.getItem('rb_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchApi('/auth/me');
      setUser(data.user);
    } catch (err) {
      console.error('Session expired or invalid:', err);
      localStorage.removeItem('rb_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (identifier, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    localStorage.setItem('rb_token', data.token);
    setUser(data.user);
    showToast(`Selamat datang kembali, ${data.user.full_name}!`, 'success');
    return data.user;
  };

  const register = async (userData) => {
    const data = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    localStorage.setItem('rb_token', data.token);
    setUser(data.user);
    showToast(`Pendaftaran berhasil! Halo, ${data.user.full_name}!`, 'success');
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('rb_token');
    setUser(null);
    showToast('Anda telah berhasil keluar (logout).', 'success');
  };

  const updateProfile = async (profileData) => {
    const data = await fetchApi('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    setUser(data.user);
    showToast('Profil Anda berhasil diperbarui!', 'success');
    return data.user;
  };

  const uploadAvatar = async (avatarData) => {
    const data = await fetchApi('/auth/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_data: avatarData })
    });
    setUser(data.user);
    showToast('Foto profil berhasil diperbarui!', 'success');
    return data.user;
  };

  const deleteAvatar = async () => {
    const data = await fetchApi('/auth/avatar', {
      method: 'DELETE'
    });
    setUser(data.user);
    showToast('Foto profil dikembalikan ke inisial default.', 'success');
    return data.user;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      deleteAvatar,
      refreshUser: loadUser,
      showToast,
      toast,
      closeToast: () => setToast(null)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
