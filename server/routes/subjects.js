const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../authMiddleware');

// All subject routes require authentication for personalized progress
router.use(authenticateToken);

// GET /api/subjects
// Returns all 4 subjects with user's completion progress
router.get('/', async (req, res) => {
  try {
    const subjects = await db.prepare(`
      SELECT s.id, s.slug, s.name, s.icon, s.description, s.color_theme, s.order_index,
             COUNT(c.id) as total_chapters
      FROM subjects s
      LEFT JOIN chapters c ON c.subject_id = s.id
      GROUP BY s.id, s.slug, s.name, s.icon, s.description, s.color_theme, s.order_index
      ORDER BY s.order_index ASC
    `).all();

    // Attach user progress for each subject
    const userProgressStmt = db.prepare(`
      SELECT COUNT(cp.id) as completed_chapters
      FROM chapter_progress cp
      JOIN chapters c ON c.id = cp.chapter_id
      WHERE cp.user_id = ? AND c.subject_id = ? AND cp.status = 'completed'
    `);

    const result = await Promise.all(subjects.map(async sub => {
      const prog = await userProgressStmt.get(req.userId, sub.id);
      const completed_chapters = prog ? prog.completed_chapters : 0;
      const percentage = sub.total_chapters > 0 
        ? Math.round((completed_chapters / sub.total_chapters) * 100) 
        : 0;
      return {
        ...sub,
        completed_chapters,
        progress_percentage: percentage
      };
    }));

    return res.json({ subjects: result });
  } catch (err) {
    console.error('Get subjects error:', err);
    return res.status(500).json({ error: 'Gagal memuat mata pelajaran.' });
  }
});

// GET /api/subjects/:slug
// Returns subject details with chapter list and per-chapter completion status
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const subject = await db.prepare('SELECT * FROM subjects WHERE slug = ?').get(slug);

    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    const chapters = await db.prepare(`
      SELECT c.id, c.chapter_number, c.title, c.description, c.order_index,
             COALESCE(cp.status, 'not_started') as status,
             cp.completed_at,
             cp.last_accessed_at
      FROM chapters c
      LEFT JOIN chapter_progress cp ON cp.chapter_id = c.id AND cp.user_id = ?
      WHERE c.subject_id = ?
      ORDER BY c.order_index ASC
    `).all(req.userId, subject.id);

    const completedCount = chapters.filter(c => c.status === 'completed').length;
    const percentage = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;

    const quizStmt = db.prepare('SELECT id, title, total_questions FROM quizzes WHERE subject_id = ? AND chapter_number = ?');
    const gameStmt = db.prepare('SELECT id, name, slug, icon FROM games WHERE subject_id = ? AND order_index = ? AND is_active = 1');
    const quizAttemptStmt = db.prepare('SELECT MAX(score) as highest_score, COUNT(*) as attempt_count FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?');
    const gameAttemptStmt = db.prepare('SELECT MAX(score) as highest_score, COUNT(*) as play_count FROM game_attempts WHERE user_id = ? AND game_id = ?');

    const enrichedChapters = await Promise.all(chapters.map(async c => {
      const q = await quizStmt.get(subject.id, c.chapter_number);
      const g = await gameStmt.get(subject.id, c.chapter_number);
      const qStat = q ? await quizAttemptStmt.get(req.userId, q.id) : null;
      const gStat = g ? await gameAttemptStmt.get(req.userId, g.id) : null;

      const completionPct = c.status === 'completed' ? 100 : c.status === 'in_progress' ? 50 : 0;

      return {
        ...c,
        completion_percentage: completionPct,
        quiz: q ? { ...q, highest_score: qStat?.highest_score, attempt_count: qStat?.attempt_count || 0 } : null,
        game: g ? { ...g, highest_score: gStat?.highest_score, play_count: gStat?.play_count || 0 } : null
      };
    }));

    return res.json({
      subject: {
        ...subject,
        total_chapters: chapters.length,
        completed_chapters: completedCount,
        progress_percentage: percentage
      },
      chapters: enrichedChapters
    });
  } catch (err) {
    console.error('Get subject detail error:', err);
    return res.status(500).json({ error: 'Gagal memuat detail mata pelajaran.' });
  }
});

// GET /api/subjects/:slug/chapters/:chapterNumber
// Returns chapter detail, navigation to prev/next, and logs study activity
router.get('/:slug/chapters/:chapterNumber', async (req, res) => {
  try {
    const { slug, chapterNumber } = req.params;
    const chapNum = parseInt(chapterNumber, 10);

    const subject = await db.prepare('SELECT id, slug, name, icon, color_theme FROM subjects WHERE slug = ?').get(slug);
    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    const chapter = await db.prepare(`
      SELECT * FROM chapters WHERE subject_id = ? AND chapter_number = ?
    `).get(subject.id, chapNum);

    if (!chapter) {
      return res.status(404).json({ error: 'Bab tidak ditemukan.' });
    }

    // Previous and Next chapter info
    const prevChapter = await db.prepare(`
      SELECT chapter_number, title FROM chapters
      WHERE subject_id = ? AND chapter_number < ?
      ORDER BY chapter_number DESC LIMIT 1
    `).get(subject.id, chapNum);

    const nextChapter = await db.prepare(`
      SELECT chapter_number, title FROM chapters
      WHERE subject_id = ? AND chapter_number > ?
      ORDER BY chapter_number ASC LIMIT 1
    `).get(subject.id, chapNum);

    // Get current progress
    let progress = await db.prepare(`
      SELECT status, completed_at, last_accessed_at FROM chapter_progress
      WHERE user_id = ? AND chapter_id = ?
    `).get(req.userId, chapter.id);

    // If no record exists yet, mark as 'in_progress' and log access
    if (!progress) {
      await db.prepare(`
        INSERT INTO chapter_progress (user_id, chapter_id, status, last_accessed_at)
        VALUES (?, ?, 'in_progress', CURRENT_TIMESTAMP)
      `).run(req.userId, chapter.id);

      progress = { status: 'in_progress', completed_at: null, last_accessed_at: new Date().toISOString() };

      // Log activity
      await db.prepare(`
        INSERT INTO learning_activities (user_id, activity_type, title, description, path)
        VALUES (?, 'chapter_read', ?, ?, ?)
      `).run(
        req.userId,
        `Membuka ${chapter.title}`,
        `Sedang mempelajari mata pelajaran ${subject.name}`,
        `/materi/${subject.slug}/${chapter.chapter_number}`
      );
    } else {
      // Update last accessed time
      await db.prepare(`
        UPDATE chapter_progress
        SET last_accessed_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND chapter_id = ?
      `).run(req.userId, chapter.id);
    }

    // Check for associated quiz
    const associatedQuiz = await db.prepare(`
      SELECT id, title, description, total_questions, duration_minutes FROM quizzes
      WHERE subject_id = ? AND chapter_number = ?
    `).get(subject.id, chapNum);

    let quizWithStats = null;
    if (associatedQuiz) {
      const qStats = await db.prepare(`
        SELECT MAX(score) as highest_score, COUNT(*) as attempt_count,
               (SELECT score FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY completed_at DESC LIMIT 1) as latest_score
        FROM quiz_attempts
        WHERE user_id = ? AND quiz_id = ?
      `).get(req.userId, associatedQuiz.id, req.userId, associatedQuiz.id);
      quizWithStats = {
        ...associatedQuiz,
        highest_score: qStats?.highest_score ?? null,
        latest_score: qStats?.latest_score ?? null,
        attempt_count: qStats?.attempt_count || 0
      };
    }

    // Check for associated educational game
    const associatedGame = await db.prepare(`
      SELECT id, name, slug, icon, description FROM games
      WHERE subject_id = ? AND order_index = ? AND is_active = 1
    `).get(subject.id, chapNum);

    let gameWithStats = null;
    if (associatedGame) {
      const gStats = await db.prepare(`
        SELECT MAX(score) as highest_score, COUNT(*) as play_count
        FROM game_attempts
        WHERE user_id = ? AND game_id = ?
      `).get(req.userId, associatedGame.id);
      gameWithStats = {
        ...associatedGame,
        highest_score: gStats?.highest_score ?? null,
        play_count: gStats?.play_count || 0
      };
    }

    // Parse subchapters JSON if present
    let subchapters = [];
    try {
      if (chapter.content && chapter.content.trim().startsWith('[')) {
        subchapters = JSON.parse(chapter.content);
      }
    } catch (e) {
      console.error('Failed to parse subchapters json:', e);
    }

    return res.json({
      subject,
      chapter: {
        ...chapter,
        subchapters
      },
      progress,
      prevChapter: prevChapter || null,
      nextChapter: nextChapter || null,
      associatedQuiz: quizWithStats || null,
      associatedGame: gameWithStats || null
    });
  } catch (err) {
    console.error('Get chapter detail error:', err);
    return res.status(500).json({ error: 'Gagal memuat materi bab.' });
  }
});

// POST /api/subjects/chapters/:chapterId/status
// Update status: 'completed' or 'in_progress'
router.post('/chapters/:chapterId/status', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { status } = req.body;

    if (!['completed', 'in_progress', 'not_started'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid.' });
    }

    const chapter = await db.prepare(`
      SELECT c.*, s.name as subject_name, s.slug as subject_slug
      FROM chapters c
      JOIN subjects s ON s.id = c.subject_id
      WHERE c.id = ?
    `).get(chapterId);

    if (!chapter) {
      return res.status(404).json({ error: 'Bab tidak ditemukan.' });
    }

    const completedAt = status === 'completed' ? new Date().toISOString() : null;

    await db.prepare(`
      INSERT INTO chapter_progress (user_id, chapter_id, status, completed_at, last_accessed_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, chapter_id) DO UPDATE SET
        status = excluded.status,
        completed_at = excluded.completed_at,
        last_accessed_at = CURRENT_TIMESTAMP
    `).run(req.userId, chapterId, status, completedAt);

    // If marked completed, log learning activity
    if (status === 'completed') {
      await db.prepare(`
        INSERT INTO learning_activities (user_id, activity_type, title, description, path)
        VALUES (?, 'chapter_completed', ?, ?, ?)
      `).run(
        req.userId,
        `Menyelesaikan ${chapter.title}`,
        `Materi ${chapter.subject_name} telah ditandai selesai.`,
        `/materi/${chapter.subject_slug}/${chapter.chapter_number}`
      );
    }

    return res.json({
      message: status === 'completed' ? 'Bab berhasil ditandai selesai!' : 'Status belajar diperbarui.',
      status,
      completed_at: completedAt
    });
  } catch (err) {
    console.error('Update chapter status error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui status belajar bab.' });
  }
});

module.exports = router;
