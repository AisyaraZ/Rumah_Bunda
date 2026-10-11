const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Ensure DB is initialized
const { initDatabase } = require('./db');
initDatabase();

const authRoutes = require('./routes/auth');
const subjectsRoutes = require('./routes/subjects');
const quizzesRoutes = require('./routes/quizzes');
const gamesRoutes = require('./routes/games');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LMS Rumah Bunda Backend', timestamp: new Date().toISOString() });
});

// Serve frontend static files if built
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// For SPA routing, redirect unmatched non-API routes to index.html in dist if it exists
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend belum di-build. Jalankan `npm run dev` untuk development.' });
  }
});

// Start server (only if executed directly, not as a serverless function)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Rumah Bunda LMS Backend berjalan di:`);
    console.log(` http://localhost:${PORT}`);
    console.log(`===============================================`);
  });
}

module.exports = app;
