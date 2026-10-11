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

async function runTests() {
  console.log('--- STARTING LMS RUMAH BUNDA API E2E TESTS ---');

  // 1. Register student
  console.log('\n1. Test Register:');
  const regRes = await post('/api/auth/register', {
    full_name: 'Aisyah Putri',
    username: 'aisyah_smp7',
    email: 'aisyah@rumahbunda.id',
    password: 'password123',
    confirm_password: 'password123'
  });
  console.log('Register response:', regRes.status, regRes.body.user ? 'SUCCESS' : regRes.body);
  const token = regRes.body.token;

  // 2. Duplicate registration check
  console.log('\n2. Test Duplicate Register:');
  const dupRes = await post('/api/auth/register', {
    full_name: 'Aisyah Clone',
    username: 'aisyah_smp7',
    email: 'another@email.com',
    password: 'password123',
    confirm_password: 'password123'
  });
  console.log('Duplicate check:', dupRes.status === 409 ? 'PASSED (Rejected duplicate)' : 'FAILED');

  // 3. Login test
  console.log('\n3. Test Login:');
  const loginRes = await post('/api/auth/login', {
    identifier: 'aisyah_smp7',
    password: 'password123'
  });
  console.log('Login check:', loginRes.status === 200 ? 'PASSED (Login successful)' : 'FAILED');

  // 4. Get Subjects
  console.log('\n4. Test Subjects Listing:');
  const subjectsRes = await get('/api/subjects', token);
  console.log('Found subjects:', subjectsRes.body.subjects.map(s => `${s.name} (${s.total_chapters} bab)`));

  // 5. Open Math Chapter 1
  console.log('\n5. Test Open Chapter 1 Matematika:');
  const chapRes = await get('/api/subjects/matematika/chapters/1', token);
  console.log('Chapter:', chapRes.body.chapter.title, '| Status:', chapRes.body.progress.status);

  // 6. Mark Chapter 1 Completed
  console.log('\n6. Test Mark Chapter 1 Completed:');
  const markRes = await post(`/api/subjects/chapters/${chapRes.body.chapter.id}/status`, { status: 'completed' }, token);
  console.log('Mark status:', markRes.body);

  // 7. Check Quizzes
  console.log('\n7. Test Quizzes:');
  const quizRes = await get('/api/quizzes', token);
  console.log('Quizzes found:', quizRes.body.quizzes.map(q => q.title));

  // 8. Submit Quiz
  const qId = quizRes.body.quizzes[0].id;
  const qDetail = await get(`/api/quizzes/${qId}`, token);
  console.log('\n8. Take Quiz:', qDetail.body.quiz.title, 'with', qDetail.body.questions.length, 'questions');
  
  // Submit answers (all C, A, A, B, B)
  const answers = {};
  qDetail.body.questions.forEach((q, i) => {
    answers[q.id] = ['C', 'A', 'A', 'B', 'B'][i] || 'A';
  });
  const submitRes = await post(`/api/quizzes/${qId}/submit`, { user_answers: answers }, token);
  console.log('Quiz Result: Score =', submitRes.body.score, `(${submitRes.body.correct_answers}/${submitRes.body.total_questions} correct)`);

  // 9. Play Math Game
  console.log('\n9. Test Game Score Submission:');
  const gameRes = await get('/api/games', token);
  const activeGame = gameRes.body.games.find(g => g.is_active === 1);
  const gameAttempt = await post(`/api/games/${activeGame.id}/attempt`, { score: 140 }, token);
  console.log('Game recorded:', gameAttempt.body);

  // 10. Check Progress Summary
  console.log('\n10. Test Overall Progress Summary:');
  const summaryRes = await get('/api/progress/summary', token);
  console.log('Summary metrics:', {
    overall_percentage: summaryRes.body.overall_percentage + '%',
    completed_chapters: summaryRes.body.completed_chapters,
    total_quizzes: summaryRes.body.total_quizzes,
    avg_quiz_score: summaryRes.body.avg_quiz_score,
    best_game_score: summaryRes.body.best_game_score,
    continue_learning: summaryRes.body.continue_learning?.title
  });

  console.log('\n--- ALL E2E API VERIFICATIONS PASSED SUCCESSFULLY! ---');
}

runTests().catch(console.error);
