const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../authMiddleware');

router.use(authenticateToken);

// GET /api/games
router.get('/', (req, res) => {
  try {
    const games = db.prepare(`
      SELECT g.id, g.name, g.slug, g.icon, g.description, g.is_active,
             s.name as subject_name, s.slug as subject_slug,
             MAX(ga.score) as highest_score,
             COUNT(ga.id) as play_count,
             (SELECT completed_at FROM game_attempts WHERE user_id = ? AND game_id = g.id ORDER BY completed_at DESC LIMIT 1) as last_played_at
      FROM games g
      LEFT JOIN subjects s ON s.id = g.subject_id
      LEFT JOIN game_attempts ga ON ga.game_id = g.id AND ga.user_id = ?
      GROUP BY g.id
      ORDER BY g.order_index ASC
    `).all(req.userId, req.userId);

    return res.json({ games });
  } catch (err) {
    console.error('Get games error:', err);
    return res.status(500).json({ error: 'Gagal memuat daftar permainan.' });
  }
});

// POST /api/games/:id/attempt
// Submit score for educational game
router.post('/:id/attempt', (req, res) => {
  try {
    const { id } = req.params;
    const { score, details } = req.body;

    if (score === undefined || isNaN(score)) {
      return res.status(400).json({ error: 'Skor permainan tidak valid.' });
    }

    const game = db.prepare('SELECT id, name FROM games WHERE id = ?').get(id);
    if (!game) {
      return res.status(404).json({ error: 'Permainan tidak ditemukan.' });
    }

    // Insert attempt
    db.prepare(`
      INSERT INTO game_attempts (user_id, game_id, score, details_json)
      VALUES (?, ?, ?, ?)
    `).run(req.userId, game.id, Math.max(0, parseInt(score, 10)), JSON.stringify(details || {}));

    // Log learning activity
    db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'game_played', ?, ?, ?)
    `).run(
      req.userId,
      `Bermain ${game.name}`,
      `Meraih skor ${score} poin`,
      `/game`
    );

    const highest = db.prepare('SELECT MAX(score) as highest_score FROM game_attempts WHERE user_id = ? AND game_id = ?').get(req.userId, game.id);

    return res.json({
      message: 'Skor permainan berhasil dicatat!',
      score,
      highest_score: highest.highest_score
    });
  } catch (err) {
    console.error('Submit game score error:', err);
    return res.status(500).json({ error: 'Gagal mencatat skor permainan.' });
  }
});

module.exports = router;
