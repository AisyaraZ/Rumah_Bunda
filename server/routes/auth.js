const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { full_name, username, email, password, confirm_password } = req.body;

    // Validation
    if (!full_name || !username || !email || !password || !confirm_password) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
    }

    if (full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Nama lengkap minimal 2 karakter.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username hanya boleh huruf, angka, dan garis bawah (3-20 karakter).' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Format email tidak valid.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Kata sandi minimal 6 karakter.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Konfirmasi kata sandi tidak cocok.' });
    }

    // Check duplicate username or email
    const existingUser = await db.prepare('SELECT id, username, email FROM users WHERE username = ? OR email = ?').get(cleanUsername, cleanEmail);
    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return res.status(409).json({ error: 'Username sudah digunakan oleh siswa lain.' });
      }
      return res.status(409).json({ error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const insertStmt = db.prepare(`
      INSERT INTO users (full_name, username, email, password_hash, class_grade, avatar)
      VALUES (?, ?, ?, ?, 'VII SMP', 'student-1')
    `);
    const result = await insertStmt.run(full_name.trim(), cleanUsername, cleanEmail, password_hash);
    const userId = result.lastInsertRowid;

    // Log welcome activity
    await db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'profile_created', 'Selamat Datang di Rumah Bunda', 'Akun berhasil dibuat. Selamat belajar mandiri!', '/home')
    `).run(userId);

    // Generate JWT token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });

    const user = await db.prepare('SELECT id, full_name, username, email, class_grade, avatar, bio, created_at FROM users WHERE id = ?').get(userId);

    return res.status(201).json({
      message: 'Registrasi berhasil! Selamat datang di Rumah Bunda.',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email dan kata sandi wajib diisi.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find by username or email
    const user = await db.prepare(`
      SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?
    `).get(cleanIdentifier, cleanIdentifier);

    if (!user) {
      return res.status(401).json({ error: 'Username/Email atau kata sandi tidak cocok.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username/Email atau kata sandi tidak cocok.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    // Remove password_hash from response
    delete user.password_hash;

    return res.json({
      message: 'Login berhasil! Selamat datang kembali.',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server saat login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      full_name,
      username,
      email,
      avatar,
      bio,
      school_name,
      education_level,
      notification_pref,
      theme_pref
    } = req.body;

    const currentUser = await db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    // 1. Validate full_name
    let updatedFullName = currentUser.full_name;
    if (full_name !== undefined) {
      if (!full_name || full_name.trim().length < 2) {
        return res.status(400).json({ error: 'Nama lengkap minimal 2 karakter.' });
      }
      updatedFullName = full_name.trim();
    }

    // 2. Validate username
    let updatedUsername = currentUser.username;
    if (username !== undefined && username.trim().toLowerCase() !== currentUser.username.toLowerCase()) {
      const cleanUsername = username.trim().toLowerCase();
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
        return res.status(400).json({ error: 'Username hanya boleh huruf, angka, dan garis bawah (3-20 karakter).' });
      }
      const existingUser = await db.prepare('SELECT id FROM users WHERE LOWER(username) = ? AND id != ?').get(cleanUsername, req.userId);
      if (existingUser) {
        return res.status(409).json({ error: 'Username sudah digunakan oleh siswa lain.' });
      }
      updatedUsername = cleanUsername;
    }

    // 3. Validate email
    let updatedEmail = currentUser.email;
    if (email !== undefined && email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      const cleanEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ error: 'Format email tidak valid.' });
      }
      const existingEmail = await db.prepare('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?').get(cleanEmail, req.userId);
      if (existingEmail) {
        return res.status(409).json({ error: 'Email sudah terdaftar pada akun lain.' });
      }
      updatedEmail = cleanEmail;
    }

    // 4. Avatar
    let updatedAvatar = currentUser.avatar;
    if (avatar !== undefined) {
      updatedAvatar = avatar || 'student-1';
    }

    // 5. Bio
    let updatedBio = currentUser.bio;
    if (bio !== undefined) {
      updatedBio = bio.trim();
    }

    // 6. School name & education level
    let updatedSchool = school_name !== undefined ? school_name.trim() : (currentUser.school_name || 'SMP Negeri 1 Rumah Bunda');
    let updatedEduLevel = education_level !== undefined ? education_level.trim() : (currentUser.education_level || 'Sekolah Menengah Pertama (SMP)');

    // 7. Preferences
    let updatedNotifPref = currentUser.notification_pref;
    if (notification_pref !== undefined) {
      updatedNotifPref = typeof notification_pref === 'object' ? JSON.stringify(notification_pref) : String(notification_pref);
    }

    let updatedThemePref = currentUser.theme_pref || 'sage';
    if (theme_pref !== undefined) {
      updatedThemePref = String(theme_pref);
    }

    // Execute update
    await db.prepare(`
      UPDATE users
      SET full_name = ?,
          username = ?,
          email = ?,
          avatar = ?,
          bio = ?,
          school_name = ?,
          education_level = ?,
          notification_pref = ?,
          theme_pref = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      updatedFullName,
      updatedUsername,
      updatedEmail,
      updatedAvatar,
      updatedBio,
      updatedSchool,
      updatedEduLevel,
      updatedNotifPref,
      updatedThemePref,
      req.userId
    );

    // Log activity
    await db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'profile_updated', 'Profil Siswa Diperbarui', 'Data profil dan informasi akun berhasil diperbarui.', '/profil')
    `).run(req.userId);

    const updatedUser = await db.prepare(`
      SELECT id, full_name, username, email, class_grade, avatar, bio,
             school_name, education_level, notification_pref, theme_pref,
             created_at, updated_at
      FROM users WHERE id = ?
    `).get(req.userId);

    return res.json({
      message: 'Profil dan informasi akun berhasil disimpan!',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui profil.' });
  }
});

// POST /api/auth/avatar
// Upload or change avatar image (Base64 data URL with JPG/PNG validation)
router.post('/avatar', authenticateToken, async (req, res) => {
  try {
    const { avatar_data } = req.body;

    if (!avatar_data) {
      return res.status(400).json({ error: 'Data gambar profil tidak ditemukan.' });
    }

    // Validate format
    const isValidImage = avatar_data.startsWith('data:image/jpeg') ||
                         avatar_data.startsWith('data:image/jpg') ||
                         avatar_data.startsWith('data:image/png') ||
                         avatar_data.startsWith('data:image/webp');

    if (!isValidImage) {
      return res.status(400).json({ error: 'Format foto harus berupa JPG, JPEG, PNG, atau WebP.' });
    }

    // Check size (approx 5MB base64 is ~6.8M chars)
    if (avatar_data.length > 7 * 1024 * 1024) {
      return res.status(400).json({ error: 'Ukuran file foto maksimal 5 MB.' });
    }

    await db.prepare(`
      UPDATE users
      SET avatar = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(avatar_data, req.userId);

    // Log activity
    await db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'avatar_updated', 'Foto Profil Diperbarui', 'Foto profil akun siswa berhasil diubah.', '/pengaturan')
    `).run(req.userId);

    const updatedUser = await db.prepare(`
      SELECT id, full_name, username, email, class_grade, avatar, bio,
             school_name, education_level, notification_pref, theme_pref,
             created_at, updated_at
      FROM users WHERE id = ?
    `).get(req.userId);

    return res.json({
      message: 'Foto profil berhasil diperbarui!',
      avatar: avatar_data,
      user: updatedUser
    });
  } catch (err) {
    console.error('Upload avatar error:', err);
    return res.status(500).json({ error: 'Gagal mengunggah foto profil.' });
  }
});

// DELETE /api/auth/avatar
// Reset avatar to default
router.delete('/avatar', authenticateToken, async (req, res) => {
  try {
    await db.prepare(`
      UPDATE users
      SET avatar = 'student-1',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.userId);

    // Log activity
    await db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'avatar_removed', 'Foto Profil Dihapus', 'Foto profil dikembalikan ke inisial default.', '/pengaturan')
    `).run(req.userId);

    const updatedUser = await db.prepare(`
      SELECT id, full_name, username, email, class_grade, avatar, bio,
             school_name, education_level, notification_pref, theme_pref,
             created_at, updated_at
      FROM users WHERE id = ?
    `).get(req.userId);

    return res.json({
      message: 'Foto profil berhasil dihapus dan dikembalikan ke avatar default.',
      avatar: 'student-1',
      user: updatedUser
    });
  } catch (err) {
    console.error('Delete avatar error:', err);
    return res.status(500).json({ error: 'Gagal menghapus foto profil.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password, confirm_new_password } = req.body;

    if (!current_password || !new_password || !confirm_new_password) {
      return res.status(400).json({ error: 'Semua kolom kata sandi wajib diisi.' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'Kata sandi baru minimal 6 karakter.' });
    }

    if (new_password !== confirm_new_password) {
      return res.status(400).json({ error: 'Konfirmasi kata sandi baru tidak cocok.' });
    }

    const user = await db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.userId);
    const isMatch = await bcrypt.compare(current_password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Kata sandi saat ini salah.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(new_password, salt);

    await db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newHash, req.userId);

    // Log activity
    await db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'security_update', 'Kata Sandi Diubah', 'Kata sandi akun berhasil diperbarui demi keamanan.', '/pengaturan')
    `).run(req.userId);

    return res.json({ message: 'Kata sandi berhasil diperbarui.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengganti kata sandi.' });
  }
});

module.exports = router;
