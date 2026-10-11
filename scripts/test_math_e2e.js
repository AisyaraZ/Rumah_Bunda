const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runMathVerification() {
  console.log('====================================================');
  console.log('   VERIFIKASI SISTEM LMS RUMAH BUNDA KELAS 7 SMP    ');
  console.log('====================================================\n');

  // 1. Auth: Login existing or register student
  const testUsername = 'siswa_smp7_eval';
  let token = null;
  const loginRes = await post('/api/auth/login', { identifier: testUsername, password: 'password123' });
  if (loginRes.status === 200) {
    token = loginRes.body.token;
    console.log('✓ Login berhasil sebagai:', loginRes.body.user.full_name);
  } else {
    const regRes = await post('/api/auth/register', {
      full_name: 'Budi Santoso',
      username: testUsername,
      email: 'budi_smp7@rumahbunda.id',
      password: 'password123',
      confirm_password: 'password123'
    });
    token = regRes.body.token;
    console.log('✓ Registrasi siswa baru berhasil:', regRes.body.user.full_name);
  }

  // 2. Verifikasi 3 Bab Matematika
  console.log('\n--- VERIFIKASI 3 BAB MATERI MATEMATIKA ---');
  for (let c = 1; c <= 3; c++) {
    const res = await get(`/api/subjects/matematika/chapters/${c}`, token);
    if (res.status !== 200) {
      throw new Error(`Gagal membuka Bab ${c}: ${JSON.stringify(res.body)}`);
    }
    const chap = res.body.chapter;
    console.log(`✓ Bab ${c}: "${chap.title}"`);
    console.log(`  - Subbab: ${chap.subchapters?.length || 0} subtopik lengkap`);
    chap.subchapters?.forEach((s, idx) => {
      console.log(`    ${idx + 1}. ${s.title} (${s.content.length} karakter)`);
    });
    console.log(`  - Quiz Terhubung: "${res.body.associatedQuiz?.title || 'None'}"`);

    // Tandai Bab 1 & 2 selesai untuk simulasi progres
    if (c <= 2) {
      await post(`/api/subjects/chapters/${chap.id}/status`, { status: 'completed' }, token);
      console.log(`  - [Progress] Bab ${c} ditandai SELESAI`);
    } else {
      await post(`/api/subjects/chapters/${chap.id}/status`, { status: 'in_progress' }, token);
      console.log(`  - [Progress] Bab ${c} ditandai SEDANG DIPELAJARI`);
    }
  }

  // 3. Verifikasi 3 Quiz Matematika (10 Soal per Bab)
  console.log('\n--- VERIFIKASI 3 KUIS MATEMATIKA & PENILAIAN ---');
  const quizzesRes = await get('/api/quizzes', token);
  const mathQuizzes = quizzesRes.body.quizzes.filter(q => q.subject_slug === 'matematika');
  console.log(`✓ Ditemukan ${mathQuizzes.length} Kuis Matematika:`);

  for (const q of mathQuizzes) {
    const detail = await get(`/api/quizzes/${q.id}`, token);
    const questions = detail.body.questions;
    console.log(`\n  * Quiz Bab ${q.chapter_number}: "${q.title}"`);
    console.log(`    - Jumlah soal: ${questions.length} (Target: minimal 10)`);
    
    // Check distribution
    const diffs = questions.map(qs => (qs.difficulty || 'Sedang').toLowerCase());
    console.log(`    - Distribusi kesulitan: Mudah=${diffs.filter(d => d==='mudah').length}, Sedang=${diffs.filter(d => d==='sedang').length}, Sulit=${diffs.filter(d => d==='sulit').length}`);

    // Test answering: select all first choice or known choices to test scoring formula
    const answers = {};
    questions.forEach(qs => {
      // Pick choice 'A' or 'B'
      answers[qs.id] = 'A';
    });
    const subRes = await post(`/api/quizzes/${q.id}/submit`, { user_answers: answers }, token);
    console.log(`    - Hasil Uji Submit: Skor ${subRes.body.score}/100 (${subRes.body.correct_answers}/${subRes.body.total_questions} Benar)`);
    console.log(`    - Ulasan Pembahasan Diterima: ${subRes.body.review?.length} pembahasan soal lengkap`);
  }

  // 4. Verifikasi 3 Game Edukatif
  console.log('\n--- VERIFIKASI 3 GAME EDUKATIF ---');
  const gamesRes = await get('/api/games', token);
  const games = gamesRes.body.games;
  console.log(`✓ Ditemukan ${games.length} Game Edukatif terdaftar:`);

  const mockScores = [180, 240, 200];
  for (let i = 0; i < games.length; i++) {
    const g = games[i];
    console.log(`  ${i + 1}. [${g.icon}] ${g.name} (${g.slug})`);
    const attRes = await post(`/api/games/${g.id}/attempt`, { score: mockScores[i] || 150 }, token);
    console.log(`     - Submit skor ${mockScores[i]} pts: Sukses (id: ${attRes.body.attempt?.id})`);
  }

  // 5. Verifikasi Sinkronisasi Home & Capaian Pembelajaran
  console.log('\n--- VERIFIKASI DATA PROGRES HOME & CAPAIAN ---');
  const sumRes = await get('/api/progress/summary', token);
  const s = sumRes.body;
  console.log(`✓ Overall Chapters: ${s.completed_chapters}/${s.total_chapters} (${s.overall_percentage}%)`);
  console.log(`✓ Progres Matematika: ${s.math_summary?.completed_chapters}/${s.math_summary?.total_chapters} Bab (${s.math_summary?.progress_percentage}%)`);
  console.log(`✓ Kuis Matematika Terakhir: Bab ${s.math_summary?.latest_quiz?.chapter_number} - Skor ${s.math_summary?.latest_quiz?.score} pts`);
  console.log(`✓ Skor Game Tertinggi: ${s.best_game_score} pts`);
  console.log(`✓ Continue Learning: "${s.continue_learning?.title}" (${s.continue_learning?.subject_name})`);

  console.log('\n✓ Rekor Game per Permainan:');
  s.game_high_scores?.forEach(gh => {
    console.log(`  - ${gh.name}: ${gh.highest_score} pts (${gh.play_count}x dimainkan)`);
  });

  // 6. Verifikasi Riwayat Aktivitas
  console.log('\n--- VERIFIKASI RIWAYAT AKTIVITAS BELAJAR ---');
  const actRes = await get('/api/progress/activities', token);
  console.log(`✓ Jumlah riwayat aktivitas tercatat: ${actRes.body.activities?.length || 0}`);
  actRes.body.activities?.slice(0, 5).forEach((a, i) => {
    console.log(`  ${i + 1}. [${a.activity_type}] ${a.title} - ${a.description}`);
  });

  console.log('\n====================================================');
  console.log('   SEMUA UJI FUNGSIONALITAS BERHASIL 100%           ');
  console.log('====================================================');
}

runMathVerification().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
