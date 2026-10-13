const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../authMiddleware');

router.use(authenticateToken);

// GET /api/progress/summary
// Summary for Home dashboard and Profile
router.get('/summary', async (req, res) => {
  try {
    const userId = req.userId;

    // Total chapters in system
    const totalChaptersRow = await db.prepare('SELECT COUNT(*) as count FROM chapters').get();
    const totalChapters = totalChaptersRow ? totalChaptersRow.count : 0;

    // User's completed chapters
    const completedChaptersRow = await db.prepare(`
      SELECT COUNT(*) as count FROM chapter_progress
      WHERE user_id = ? AND status = 'completed'
    `).get(userId);
    const completedChapters = completedChaptersRow ? completedChaptersRow.count : 0;

    const overallPercentage = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

    // Total quizzes attempted by user
    const quizStats = await db.prepare(`
      SELECT COUNT(*) as total_attempts,
             AVG(score) as avg_score,
             MAX(score) as max_score
      FROM quiz_attempts
      WHERE user_id = ?
    `).get(userId);

    const totalQuizzesAttempted = quizStats ? quizStats.total_attempts : 0;
    const avgQuizScore = quizStats && quizStats.avg_score !== null ? Math.round(quizStats.avg_score) : 0;
    const maxQuizScore = quizStats && quizStats.max_score !== null ? quizStats.max_score : 0;

    // Best game score
    const gameStats = await db.prepare(`
      SELECT MAX(score) as best_score, COUNT(*) as total_played
      FROM game_attempts
      WHERE user_id = ?
    `).get(userId);

    const bestGameScore = gameStats && gameStats.best_score !== null ? gameStats.best_score : 0;
    const totalGamesPlayed = gameStats ? gameStats.total_played : 0;

    // Subject breakdown
    const subjects = await db.prepare(`
      SELECT s.id, s.name, s.slug, s.icon, s.color_theme,
             COUNT(c.id) as total_chapters
      FROM subjects s
      LEFT JOIN chapters c ON c.subject_id = s.id
      GROUP BY s.id, s.name, s.slug, s.icon, s.color_theme, s.order_index
      ORDER BY s.order_index ASC
    `).all();

    const subjectProgressStmt = db.prepare(`
      SELECT COUNT(cp.id) as completed_count
      FROM chapter_progress cp
      JOIN chapters c ON c.id = cp.chapter_id
      WHERE cp.user_id = ? AND c.subject_id = ? AND cp.status = 'completed'
    `);

    const subjectBreakdown = await Promise.all(subjects.map(async sub => {
      const prog = await subjectProgressStmt.get(userId, sub.id);
      const completed_count = prog ? prog.completed_count : 0;
      const pct = sub.total_chapters > 0 ? Math.round((completed_count / sub.total_chapters) * 100) : 0;
      return {
        ...sub,
        completed_chapters: completed_count,
        progress_percentage: pct
      };
    }));

    // Last learning activity
    const lastActivity = await db.prepare(`
      SELECT * FROM learning_activities
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(userId);

    // Unfinished chapter to "Lanjutkan Belajar"
    // First priority: last accessed chapter that is still in_progress
    let continueChapter = await db.prepare(`
      SELECT c.id, c.chapter_number, c.title, s.name as subject_name, s.slug as subject_slug, cp.last_accessed_at
      FROM chapter_progress cp
      JOIN chapters c ON c.id = cp.chapter_id
      JOIN subjects s ON s.id = c.subject_id
      WHERE cp.user_id = ? AND cp.status = 'in_progress'
      ORDER BY cp.last_accessed_at DESC
      LIMIT 1
    `).get(userId);

    // Second priority: first chapter of first subject not yet completed
    if (!continueChapter) {
      continueChapter = await db.prepare(`
        SELECT c.id, c.chapter_number, c.title, s.name as subject_name, s.slug as subject_slug
        FROM chapters c
        JOIN subjects s ON s.id = c.subject_id
        LEFT JOIN chapter_progress cp ON cp.chapter_id = c.id AND cp.user_id = ?
        WHERE cp.status IS NULL OR cp.status != 'completed'
        ORDER BY s.order_index ASC, c.order_index ASC
        LIMIT 1
      `).get(userId);
    }

    // Dedicated Matematika Summary & Bab 1, 2, 3 Breakdown
    const mtkSubject = await db.prepare('SELECT id, name, slug FROM subjects WHERE slug = ?').get('matematika');
    let mathSummary = null;
    if (mtkSubject) {
      const mtkChapters = await db.prepare(`
        SELECT c.id, c.chapter_number, c.title, c.description,
               COALESCE(cp.status, 'not_started') as status,
               cp.completed_at
        FROM chapters c
        LEFT JOIN chapter_progress cp ON cp.chapter_id = c.id AND cp.user_id = ?
        WHERE c.subject_id = ?
        ORDER BY c.chapter_number ASC
      `).all(userId, mtkSubject.id);

      const mtkCompleted = mtkChapters.filter(c => c.status === 'completed').length;
      const mtkPct = mtkChapters.length > 0 ? Math.round((mtkCompleted / mtkChapters.length) * 100) : 0;

      // Latest Math Quiz attempt
      const latestMathQuiz = await db.prepare(`
        SELECT qa.score, qa.total_questions, qa.correct_answers, qa.completed_at,
               q.title as quiz_title, q.chapter_number
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        WHERE qa.user_id = ? AND q.subject_id = ?
        ORDER BY qa.completed_at DESC
        LIMIT 1
      `).get(userId, mtkSubject.id);

      // Quiz per chapter breakdown
      const mathQuizzes = await db.prepare(`
        SELECT q.id, q.chapter_number, q.title, q.total_questions,
               MAX(qa.score) as highest_score,
               COUNT(qa.id) as attempt_count,
               (SELECT score FROM quiz_attempts WHERE user_id = ? AND quiz_id = q.id ORDER BY completed_at DESC LIMIT 1) as latest_score
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = ?
        WHERE q.subject_id = ?
        GROUP BY q.id, q.chapter_number, q.title, q.total_questions
        ORDER BY q.chapter_number ASC
      `).all(userId, userId, mtkSubject.id);

      mathSummary = {
        total_chapters: mtkChapters.length,
        completed_chapters: mtkCompleted,
        progress_percentage: mtkPct,
        chapters: mtkChapters,
        latest_quiz: latestMathQuiz || null,
        quizzes: mathQuizzes
      };
    }

    // Dedicated Bahasa Indonesia Summary & Bab 1, 2, 3 Breakdown
    const bIndoSubject = await db.prepare('SELECT id, name, slug FROM subjects WHERE slug = ?').get('bahasa-indonesia');
    let bIndoSummary = null;
    if (bIndoSubject) {
      const bIndoChapters = await db.prepare(`
        SELECT c.id, c.chapter_number, c.title, c.description,
               COALESCE(cp.status, 'not_started') as status,
               cp.completed_at
        FROM chapters c
        LEFT JOIN chapter_progress cp ON cp.chapter_id = c.id AND cp.user_id = ?
        WHERE c.subject_id = ?
        ORDER BY c.chapter_number ASC
      `).all(userId, bIndoSubject.id);

      const bIndoCompleted = bIndoChapters.filter(c => c.status === 'completed').length;
      const bIndoPct = bIndoChapters.length > 0 ? Math.round((bIndoCompleted / bIndoChapters.length) * 100) : 0;

      // Latest Bahasa Indonesia Quiz attempt
      const latestBIndoQuiz = await db.prepare(`
        SELECT qa.score, qa.total_questions, qa.correct_answers, qa.completed_at,
               q.title as quiz_title, q.chapter_number
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        WHERE qa.user_id = ? AND q.subject_id = ?
        ORDER BY qa.completed_at DESC
        LIMIT 1
      `).get(userId, bIndoSubject.id);

      // Quiz per chapter breakdown
      const bIndoQuizzes = await db.prepare(`
        SELECT q.id, q.chapter_number, q.title, q.total_questions,
               MAX(qa.score) as highest_score,
               COUNT(qa.id) as attempt_count,
               (SELECT score FROM quiz_attempts WHERE user_id = ? AND quiz_id = q.id ORDER BY completed_at DESC LIMIT 1) as latest_score
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = ?
        WHERE q.subject_id = ?
        GROUP BY q.id, q.chapter_number, q.title, q.total_questions
        ORDER BY q.chapter_number ASC
      `).all(userId, userId, bIndoSubject.id);

      bIndoSummary = {
        total_chapters: bIndoChapters.length,
        completed_chapters: bIndoCompleted,
        progress_percentage: bIndoPct,
        chapters: bIndoChapters,
        latest_quiz: latestBIndoQuiz || null,
        quizzes: bIndoQuizzes
      };
    }

    // High scores per game
    const gameHighScores = await db.prepare(`
      SELECT g.id, g.name, g.slug, g.icon, g.subject_id,
             MAX(ga.score) as highest_score,
             COUNT(ga.id) as play_count,
             (SELECT completed_at FROM game_attempts WHERE user_id = ? AND game_id = g.id ORDER BY completed_at DESC LIMIT 1) as last_played_at
      FROM games g
      LEFT JOIN game_attempts ga ON ga.game_id = g.id AND ga.user_id = ?
      WHERE g.is_active = 1
      GROUP BY g.id, g.name, g.slug, g.icon, g.subject_id, g.order_index
      ORDER BY g.order_index ASC
    `).all(userId, userId);

    return res.json({
      overall_percentage: overallPercentage,
      total_chapters: totalChapters,
      completed_chapters: completedChapters,
      total_quizzes: totalQuizzesAttempted,
      avg_quiz_score: avgQuizScore,
      max_quiz_score: maxQuizScore,
      best_game_score: bestGameScore,
      total_games_played: totalGamesPlayed,
      subjects: subjectBreakdown,
      last_activity: lastActivity || null,
      math_summary: mathSummary,
      bahasa_indonesia_summary: bIndoSummary,
      game_high_scores: gameHighScores,
      continue_learning: continueChapter ? {
        title: continueChapter.title,
        subject_name: continueChapter.subject_name,
        subject_slug: continueChapter.subject_slug,
        chapter_number: continueChapter.chapter_number,
        path: `/materi/${continueChapter.subject_slug}/${continueChapter.chapter_number}`
      } : null
    });
  } catch (err) {
    console.error('Get progress summary error:', err);
    return res.status(500).json({ error: 'Gagal memuat ringkasan capaian.' });
  }
});

// GET /api/progress/activities
// Timeline of all learning activities for Capaian Pembelajaran page
router.get('/activities', async (req, res) => {
  try {
    const activities = await db.prepare(`
      SELECT id, activity_type, title, description, path, created_at
      FROM learning_activities
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(req.userId);

    return res.json({ activities });
  } catch (err) {
    console.error('Get activities error:', err);
    return res.status(500).json({ error: 'Gagal memuat riwayat aktivitas belajar.' });
  }
});

module.exports = router;
