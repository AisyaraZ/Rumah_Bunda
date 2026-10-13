const jwt = require('jsonwebtoken');
const { db } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'rumah_bunda_lms_super_secret_key_2025';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Token autentikasi tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.prepare(`
      SELECT id, full_name, username, email, class_grade, avatar, bio,
             school_name, education_level, notification_pref, theme_pref,
             created_at, updated_at
      FROM users WHERE id = ?
    `).get(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Sesi pengguna tidak valid atau pengguna telah dihapus.' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sesi telah kedaluwarsa atau token tidak valid. Silakan login kembali.' });
  }
}

module.exports = {
  authenticateToken,
  JWT_SECRET
};
