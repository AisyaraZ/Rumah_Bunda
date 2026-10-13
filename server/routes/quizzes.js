const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../authMiddleware');

router.use(authenticateToken);

// GET /api/quizzes
// List quizzes with attempts and highest/latest score for the logged-in user
router.get('/', async (req, res) => {
  try {
    const { subject } = req.query;

    let query = `
      SELECT q.id, q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number,
             s.name as subject_name, s.slug as subject_slug, s.color_theme,
             COUNT(qa.id) as attempt_count,
             MAX(qa.score) as highest_score,
             (SELECT score FROM quiz_attempts WHERE user_id = ? AND quiz_id = q.id ORDER BY completed_at DESC LIMIT 1) as latest_score,
             (SELECT completed_at FROM quiz_attempts WHERE user_id = ? AND quiz_id = q.id ORDER BY completed_at DESC LIMIT 1) as last_attempt_at
      FROM quizzes q
      JOIN subjects s ON s.id = q.subject_id
      LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = ?
    `;

    const params = [req.userId, req.userId, req.userId];

    if (subject && subject !== 'all') {
      query += ` WHERE s.slug = ? `;
      params.push(subject);
    }

    query += `
      GROUP BY q.id, q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number,
               s.name, s.slug, s.color_theme, q.order_index
      ORDER BY q.order_index ASC
    `;

    const quizzes = await db.prepare(query).all(...params);

    return res.json({ quizzes });
  } catch (err) {
    console.error('Get quizzes error:', err);
    return res.status(500).json({ error: 'Gagal memuat daftar kuis.' });
  }
});

// GET /api/quizzes/:id
// Get quiz details and questions for taking the quiz (without answers)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await db.prepare(`
      SELECT q.id, q.title, q.description, q.duration_minutes, q.total_questions, q.chapter_number,
             s.name as subject_name, s.slug as subject_slug, s.color_theme
      FROM quizzes q
      JOIN subjects s ON s.id = q.subject_id
      WHERE q.id = ?
    `).get(id);

    if (!quiz) {
      return res.status(404).json({ error: 'Kuis tidak ditemukan.' });
    }

    // Questions without correct_option or explanation
    const questions = await db.prepare(`
      SELECT id, question_number, difficulty, question_text, option_a, option_b, option_c, option_d
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY question_number ASC
    `).all(id);

    return res.json({ quiz, questions });
  } catch (err) {
    console.error('Get quiz detail error:', err);
    return res.status(500).json({ error: 'Gagal memuat soal kuis.' });
  }
});

// POST /api/quizzes/:id/submit
// Submit answers, calculate score, save attempt, return review & explanation
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_answers } = req.body; // { [questionId]: 'A' | 'B' | 'C' | 'D' }

    if (!user_answers || typeof user_answers !== 'object') {
      return res.status(400).json({ error: 'Data jawaban tidak valid.' });
    }

    const quiz = await db.prepare(`
      SELECT q.id, q.title, s.name as subject_name, s.slug as subject_slug
      FROM quizzes q
      JOIN subjects s ON s.id = q.subject_id
      WHERE q.id = ?
    `).get(id);

    if (!quiz) {
      return res.status(404).json({ error: 'Kuis tidak ditemukan.' });
    }

    const questions = await db.prepare(`
      SELECT id, question_number, question_text, option_a, option_b, option_c, option_d,
             correct_option, explanation
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY question_number ASC
    `).all(id);

    let correctCount = 0;
    const review = questions.map(q => {
      const selectedOption = user_answers[q.id] || null;
      const isCorrect = selectedOption === q.correct_option;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        question_number: q.question_number,
        question_text: q.question_text,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },
        selected_option: selectedOption,
        correct_option: q.correct_option,
        is_correct: isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Save attempt to database
    const insertAttempt = db.prepare(`
      INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, answers_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    await insertAttempt.run(
      req.userId,
      quiz.id,
      score,
      totalQuestions,
      correctCount,
      JSON.stringify(user_answers)
    );

    // Log to learning activities
    await db.prepare(`
      INSERT INTO learning_activities (user_id, activity_type, title, description, path)
      VALUES (?, 'quiz_completed', ?, ?, ?)
    `).run(
      req.userId,
      `Mengerjakan ${quiz.title}`,
      `Memperoleh skor ${score}/100 (${correctCount} dari ${totalQuestions} benar)`,
      `/quiz`
    );

    return res.json({
      message: 'Kuis berhasil diselesaikan!',
      score,
      correct_answers: correctCount,
      total_questions: totalQuestions,
      review
    });
  } catch (err) {
    console.error('Submit quiz error:', err);
    return res.status(500).json({ error: 'Gagal mengirim jawaban kuis.' });
  }
});

// GET /api/quizzes/attempts/history
router.get('/attempts/history', async (req, res) => {
  try {
    const history = await db.prepare(`
      SELECT qa.id, qa.score, qa.total_questions, qa.correct_answers, qa.completed_at,
             q.title as quiz_title, s.name as subject_name
      FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      JOIN subjects s ON s.id = q.subject_id
      WHERE qa.user_id = ?
      ORDER BY qa.completed_at DESC
      LIMIT 20
    `).all(req.userId);

    return res.json({ history });
  } catch (err) {
    console.error('Get history error:', err);
    return res.status(500).json({ error: 'Gagal memuat riwayat kuis.' });
  }
});

module.exports = router;
